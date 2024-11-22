import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
} 