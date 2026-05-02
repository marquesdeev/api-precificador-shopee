const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cors = require('cors');

puppeteer.use(StealthPlugin());
const app = express();
app.use(express.json());
app.use(cors());

app.post('/scraping-shopee', async (req, res) => {
    const { url } = req.body;
    
    // Abrindo o navegador "invisível"
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Espera o seletor do preço aparecer na tela da Shopee
        await page.waitForSelector('.G_m39B', { timeout: 10000 });

        const dados = await page.evaluate(() => {
            const nome = document.querySelector('.EfBy-A')?.innerText || "Produto não encontrado";
            // Pega o preço e limpa os símbolos de R$ e pontos
            const precoTexto = document.querySelector('.G_m39B')?.innerText || "0";
            const precoLimpo = parseFloat(precoTexto.replace('R$', '').replace('.', '').replace(',', '.').trim());

            return { nome, precoCusto: precoLimpo };
        });

        // Aplica sua lógica de precificação (Ex: Margem de 30% + Taxa Shopee 20%)
        const margem = 0.30;
        const taxaShopee = 0.20;
        const precoVenda = (dados.precoCusto + 3.00) / (1 - taxaShopee - margem);

        res.json({
            ...dados,
            vendaSugerida: precoVenda.toFixed(2),
            lucro: (precoVenda * margem).toFixed(2)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Não consegui ler o preço. Tente novamente." });
    } finally {
        await browser.close();
    }
});

app.listen(process.env.PORT || 8081, () => console.log("Servidor Online"));