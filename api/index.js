import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

// Route to get prices by symbol
export default async function handler(req, res) {
    if (req.method === 'GET' && req.url.startsWith('/api/prices/by-symbol')) {
        try {
            const symbols = req.query.symbols?.split(',') || ['ETH', 'BTC', 'USDT'];
            const apiKey = process.env.ALCHEMY_API_KEY;
            const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/by-symbol`;
            
            const params = new URLSearchParams();
            symbols.forEach(symbol => params.append('symbols', symbol));
            
            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'GET',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST' && req.url.startsWith('/api/prices/by-address')) {
        try {
            const apiKey = process.env.ALCHEMY_API_KEY;
            const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/by-address`;
            
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(req.body)
            });
            
            const data = await response.json();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST' && req.url.startsWith('/api/prices/historical')) {
        try {
            const apiKey = process.env.ALCHEMY_API_KEY;
            const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/historical`;
            
            const requestBody = {
                symbol: req.body.symbol,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                interval: req.body.interval
            };
            
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(404).json({ error: 'Not found' });
} 