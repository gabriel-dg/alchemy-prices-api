import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.ALCHEMY_API_KEY;
        
        if (!apiKey) {
            console.error('ALCHEMY_API_KEY is not set');
            return res.status(500).json({ error: 'API key configuration error' });
        }

        const baseUrl = `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/historical`;
        
        console.log('Making request to:', baseUrl);

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Alchemy API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            return res.status(response.status).json({ 
                error: `Alchemy API error: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }
        
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
} 