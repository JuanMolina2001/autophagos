const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
        }
        );
        const page = await browser.newPage();
        await page.goto('coloque el link aqui');

        await page.setViewport({ width: 1080, height: 1024 });
        await page.waitForSelector('[data-ga-action="nuccore fasta"]');

        const data = await page.evaluate(() => {
            const test = Array.from(document.querySelectorAll('[data-ga-action="nuccore fasta"]')).map(element => element.href);
            return test;
        });

        let secuencias = [];
        for (let i = 0; i < data.length; i++) {
            await page.goto(data[i]);
            await page.waitForSelector('pre');
            const secuencia = await page.evaluate(() => {
                return document.querySelector('pre').innerText;
            });
            secuencias.push(secuencia);

        }
        let pages = []
        for (let i = 0; i < secuencias.length; i++) {
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
        }
        for (let i = 0; i < pages.length; i++) {
            const newPage = pages[i];
        }
        console.log(results);
    }
    catch (e) {
        console.log(e);
    }
})();