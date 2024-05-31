const puppeteer = require('puppeteer');
const path = require('path');
const { ipcMain, dialog } = require('electron');
function getContigs(win) {
    // inicia el proceso de scraping
    ipcMain.on('start', async (event, data) => {
        try {
            const browser = await puppeteer.launch({
                headless: data.headless,
            }
            );

            const page = await browser.newPage();
            const secuencias = await getSequences(page, data, win);
            let pages = []
            for (let i = 0; i < secuencias.length; i++) {
                try {
                    pages.push(await browser.newPage());
                    const newPage = pages[i];
                    if (data.page === 'phatest') {
                        await newPage.goto('https://phastest.ca/submissions/new');
                        await newPage.waitForSelector('#sequence-form');
                        const value = secuencias[i]
                        await newPage.evaluate((value) => {
                            document.querySelector('[href="#text-in"]').click();
                            document.querySelector('#sequence_text').value = value;
                            document.querySelector('#text-submit').click();
                        }, value);
                    }
                    else if (data.page === 'genemark') {
                        const { genemarkOptions } = data;
                        await newPage.goto('https://genemark.bme.gatech.edu/genemarks2.cgi');
                        await newPage.waitForSelector('textarea');
                        const value = secuencias[i]
                        await newPage.evaluate((value, genemarkOptions) => {
                            document.querySelector('textarea').value = value;
                            document.querySelector(`input[name="mode"][value="${genemarkOptions.mode}"]`).checked = true;
                            document.querySelector(`input[name="format"][value="${genemarkOptions.format}"]`).checked = true;
                            document.querySelector('input[name="faa"]').checked = genemarkOptions.faa;
                            document.querySelector('input[name="fnn"]').checked = genemarkOptions.fnn;
                            document.querySelector('input[name="email"]').value = genemarkOptions.email;
                            document.querySelector('input[name="subject"]').value = genemarkOptions.subject;
                            document.querySelector('input[name="zip"]').checked = genemarkOptions.zip;
                            document.querySelector(`input[name="gcode"][value="${genemarkOptions.gcode}"]`).checked = true;
                            document.querySelector('#submit').click();

                        }, value, genemarkOptions);
                    }
                    win.webContents.send('response-status-contigs', {
                        status: 'submitting sequence...',
                        id: i
                    });
                } catch (e) {
                    win.webContents.send('response-status-contigs', {
                        status: 'error',
                        id: i,
                        result: null,
                    });
                }

            }
            let results = []
            for (let i = 0; i < pages.length; i++) {
                try {
                    setTimeout(async () => {
                        const newPage = pages[i];
                        if (data.page === 'phatest') {
                            await newPage.waitForSelector('#first-div-results', { timeout: 0 });
                            win.webContents.send('response-status-contigs', {
                                status: 'processing submitting...',
                                id: i
                            });
                            const result = await newPage.evaluate(() => {
                                const url = window.location.href
                                const isPhage = Array.from(document.querySelectorAll('b')).filter((e) => { return e.innerText === 'No phage were found in this sequence!' }).length > 0 ? false : true;
                                const array = url.split('/')
                                const id = array[array.length - 1]
                                return {
                                    url: url,
                                    isPhage: isPhage,
                                    id: id
                                };
                            });
                        } else if (data.page === 'genemark') {

                            await newPage.waitForSelector('td', { timeout: 0 });
                            const result = await newPage.evaluate(() => {
                                return {
                                    url: Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('gms2.out'))[0].href,
                                    id: Array.from(document.querySelectorAll('td')).filter(td => td.textContent.includes('job ID'))[0].innerText.split(';')[0].trim().split('=')[1].trim(),
                                    isPhage: undefined
                                }
                            })
                        }
                        win.webContents.send('response-status-contigs', {
                            status: 'ready',
                            id: i,
                            result: result,
                        });
                        results.push(result);
                    }, 1500);
                } catch (e) {
                    win.webContents.send('response-status-contigs', {
                        status: 'error',
                        id: i,
                        result: null,
                    });
                }

            }
            if (data.headless) {
                await browser.close();
            }
        }
        catch (e) {
            dialog.showErrorBox('Error', e.message).then(() => {
                win.reload()
            })
        }
    })
}
exports.getContigs = getContigs;

async function getSequences(page, data, win) {
    await page.goto(data.url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('[data-ga-action="nuccore fasta"]');

    const contigs = await page.evaluate(() => {
        const tr = document.querySelectorAll('tr[title]');
        return Array.from(tr).map((el) => {
            return {
                url: el.querySelector('[data-ga-action="nuccore fasta"]').href,
                name: el.querySelectorAll('td')[2].innerText
            }
        })
    });

    win.webContents.send('response-get-contigs', contigs.map((el) => {
        return {
            name: el.name,
            status: 'starting...',
            result: null
        }
    }));

    let secuencias = [];
    const urls = contigs.map((el) => el.url);
    for (let i = 0; i < urls.length; i++) {
        try {
            await page.goto(urls[i]);
            await page.waitForSelector('pre');
            const secuencia = await page.evaluate(() => {
                return document.querySelector('pre').innerText;
            });
            secuencias.push(secuencia);
            win.webContents.send('response-status-contigs', {
                status: 'finding prophage sequences...',
                id: i,
                result: null,
            });
        } catch (e) {
            win.webContents.send('response-status-contigs', {
                status: 'error',
                id: i,
                result: null,
            });

        }
    }
    return secuencias;
}