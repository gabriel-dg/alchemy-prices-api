import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const symbols = req.query.symbols?.split(',') || ['ETH', 'BTC', 'USDT'];
        const apiKey = process.env.ALCHEMY_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API key configuration error' });
        }

        const baseUrl = `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-symbol`;
        
        const params = new URLSearchParams();
        symbols.forEach(symbol => params.append('symbols', symbol));

        const response = await fetch(`${baseUrl}?${params.toString()}`, {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                error: `API error: ${response.status}`
            });
        }
        
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
} 