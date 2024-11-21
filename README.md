# Alchemy Prices API Demo

A modern web application demonstrating the usage of Alchemy's Price API endpoints for cryptocurrency price tracking and historical data analysis.

![Alchemy Prices API Demo Screenshot](screenshot.png)

## Features

- **Price by Symbol**: Get current prices for multiple cryptocurrencies using their symbols
- **Price by Address**: Fetch token prices using their contract addresses across different networks
- **Historical Prices**: View historical price data with customizable time ranges and intervals

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (with modern features like CSS Variables, Flexbox, and Grid)
  - JavaScript (ES6+)
  - Custom UI components with neon/cyberpunk theme

- **Backend**:
  - Node.js
  - Express.js
  - node-fetch for API requests

- **APIs**:
  - Alchemy Price API
    - Token Prices By Symbol
    - Token Prices By Address
    - Historical Token Prices

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Alchemy API Key

## Installation

1. Clone the repository: 
```bash
git clone https://github.com/gabriel-dg/alchemy-prices-api
cd alchemy-prices-demo
```

2. Install dependencies:
```bash
npm install
```


3. Create a `.env` file in the root directory and add your Alchemy API key:
```bash
ALCHEMY_API_KEY=<your-alchemy-api-key>
```


4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `public/`: Static files and frontend code
- `server.js`: Node.js server setup with Express
- `package.json`: Project dependencies and scripts


## Features in Detail

### 1. Prices by Symbol
- Get current prices for multiple tokens using their symbols
- Support for comma-separated symbols (e.g., "BTC,ETH,USDT")
- Displays price and last update time

### 2. Prices by Address
- Fetch token prices using contract addresses
- Support for multiple networks (Ethereum, Polygon, Arbitrum)
- Dynamic address list management with add/remove functionality

### 3. Historical Prices
- View historical price data for any token
- Customizable date range selection
- Multiple interval options (1h, 1d, 1w)
- Paginated results with 10 entries per page

## Styling

The application features a modern cyberpunk/neon theme with:
- Gradient backgrounds
- Neon glow effects
- Responsive design
- Interactive hover states
- Smooth animations
- Dark mode optimized

## API Endpoints

### GET `/api/prices/by-symbol`
- Query params: `symbols` (comma-separated list)
- Returns current prices for specified tokens

### POST `/api/prices/by-address`
- Body: Array of `{network, address}` objects
- Returns prices for specified token addresses

### POST `/api/prices/historical`
- Body: `{symbol, startTime, endTime, interval}`
- Returns historical price data


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Alchemy](https://www.alchemy.com/) for providing the Price API


