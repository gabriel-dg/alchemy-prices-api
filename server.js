import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configure dotenv
dotenv.config();

// Get current directory path (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Route to get prices by symbol
app.get("/api/prices/by-symbol", async (req, res) => {
  try {
    const symbols = req.query.symbols?.split(",") || ["ETH", "BTC", "USDT"];
    const apiKey = process.env.ALCHEMY_API_KEY;
    const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/by-symbol`;

    const params = new URLSearchParams();
    symbols.forEach((symbol) => params.append("symbols", symbol));

    console.log("Requesting URL:", `${baseUrl}?${params.toString()}`);

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API responded with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    res.json(data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get prices by address
app.post("/api/prices/by-address", async (req, res) => {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/by-address`;

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get historical prices
app.post("/api/prices/historical", async (req, res) => {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;
    const baseUrl = `https://api.g.alchemy.com/prices/v1/tokens/historical`;

    // Create the request body with the correct structure
    const requestBody = {
      symbol: req.body.symbol, // Use symbol directly
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      interval: req.body.interval,
    };

    console.log("Historical request body:", requestBody);

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API responded with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);
    res.json(data);
  } catch (error) {
    console.error("Historical API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
