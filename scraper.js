const puppeteer = require('puppeteer');
const path = require('path');
const { ipcMain } = require('electron');
function getContigs(win) {
    ipcMain.on('start', async (event, data) => {
        console.log(data);
        try {
            const browser = await puppeteer.launch({
                headless: data.headless,
            }
            );
            const page = await browser.newPage();
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

            let pages = []
            for (let i = 0; i < secuencias.length; i++) {
                try {
                    pages.push(await browser.newPage());
                    const newPage = pages[i];
                    await newPage.goto('https://phastest.ca/submissions/new');
                    await newPage.waitForSelector('#sequence-form');
                    const value = secuencias[0]
                    await newPage.evaluate((value) => {
                        document.querySelector('[href="#text-in"]').click();
                        document.querySelector('#sequence_text').value = value;
                        document.querySelector('#text-submit').click();
                    }, value);
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
                    const newPage = pages[i];
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
                            id:id
                        };
                    });
                    win.webContents.send('response-status-contigs', {
                        status: 'ready',
                        id: i,
                        result: result,
                    });
                    // win.webContents.send('response-get-results', {
                        
                    //     id: i
                    // });
                    results.push(result);
                } catch (e) {
                    win.webContents.send('response-status-contigs', {
                        status: 'error',
                        id: i,
                        result: null,
                    });
                }

            }
            await browser.close();
        }
        catch (e) {
            console.log(e);
        }
    })
}
exports.getContigs = getContigs;
