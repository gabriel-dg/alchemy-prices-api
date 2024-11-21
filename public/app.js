async function getPricesBySymbol() {
    try {
        const symbols = document.getElementById('symbolInput').value;
        const response = await fetch(`/api/prices/by-symbol?symbols=${symbols}`);
        const data = await response.json();
        
        const resultsDiv = document.getElementById('symbolResults');
        
        if (data.error) {
            resultsDiv.innerHTML = `
                <div class="error-message">
                    ${data.error}
                </div>
            `;
            return;
        }

        console.log('Received data:', data);

        const tokenData = data.data || [];
        
        if (!Array.isArray(tokenData) || tokenData.length === 0) {
            resultsDiv.innerHTML = `
                <div class="error-message">
                    No token data found
                </div>
            `;
            return;
        }

        const priceContainer = document.createElement('div');
        priceContainer.className = 'price-cards';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'price-header';
        header.innerHTML = `
            <div>Asset</div>
            <div>Price</div>
            <div>Last Updated</div>
        `;
        priceContainer.appendChild(header);
        
        tokenData.forEach(token => {
            if (token.error) {
                console.error(`Error for ${token.symbol}:`, token.error);
                return;
            }

            const currentPrice = token.prices?.[0]?.value 
                ? parseFloat(token.prices[0].value) 
                : null;
            
            if (currentPrice === null) return;

            const card = document.createElement('div');
            card.className = 'price-card';
            
            // Format the date to be more concise
            const updateDate = new Date(token.prices[0].lastUpdatedAt);
            const formattedDate = updateDate.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            card.innerHTML = `
                <div class="token-symbol">${token.symbol}</div>
                <div class="token-price">$${formatNumber(currentPrice)}</div>
                <div class="token-update">${formattedDate}</div>
            `;
            priceContainer.appendChild(card);
        });

        if (priceContainer.children.length <= 1) { // Only header exists
            resultsDiv.innerHTML = `
                <div class="error-message">
                    No valid price data found
                </div>
            `;
            return;
        }

        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(priceContainer);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('symbolResults').innerHTML = `
            <div class="error-message">
                Error fetching data: ${error.message}
            </div>
        `;
    }
}

// Global variable to store addresses
let addressList = [];

function addAddress() {
    const network = document.getElementById('networkSelect').value;
    const address = document.getElementById('addressInput').value.trim();

    if (!address) {
        alert('Please enter a valid address');
        return;
    }

    // Add to list
    addressList.push({ network, address });

    // Update UI
    updateAddressList();

    // Clear input
    document.getElementById('addressInput').value = '';
}

function updateAddressList() {
    const listContainer = document.getElementById('addressList');
    listContainer.innerHTML = '';

    addressList.forEach((item, index) => {
        const addressItem = document.createElement('div');
        addressItem.className = 'address-item';
        addressItem.innerHTML = `
            <span class="network">${item.network}</span>
            <span class="address">${item.address}</span>
            <button class="remove-button" onclick="removeAddress(${index})">Remove</button>
        `;
        listContainer.appendChild(addressItem);
    });
}

function removeAddress(index) {
    addressList.splice(index, 1);
    updateAddressList();
}

async function getPricesByAddress() {
    try {
        if (addressList.length === 0) {
            document.getElementById('addressResults').innerHTML = `
                <div class="error-message">
                    Please add at least one token address
                </div>
            `;
            return;
        }

        const response = await fetch('/api/prices/by-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ addresses: addressList })
        });

        const data = await response.json();
        console.log('Address price data:', data); // Debug log
        
        // Create table for results
        const resultsDiv = document.getElementById('addressResults');
        let html = `
            <div class="price-cards">
                <div class="price-header">
                    <div>Network</div>
                    <div>Address</div>
                    <div>Price</div>
                </div>
        `;

        // Handle the API response structure
        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(token => {
                if (!token.error) {
                    const price = token.prices?.[0]?.value 
                        ? `$${formatNumber(parseFloat(token.prices[0].value))}` 
                        : 'N/A';
                    const network = addressList.find(a => a.address.toLowerCase() === token.address.toLowerCase())?.network || 'Unknown';
                    
                    html += `
                        <div class="price-card">
                            <div class="token-network">${network}</div>
                            <div class="token-address">${token.address}</div>
                            <div class="token-price">${price}</div>
                        </div>
                    `;
                }
            });
        }

        html += `</div>`;
        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('addressResults').innerHTML = `
            <div class="error-message">
                Error fetching data: ${error.message}
            </div>
        `;
    }
}

// Add these variables at the top of your file
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let historicalDataCache = null;

// Update the formatHistoricalData function
function formatHistoricalData(data) {
    if (!data || !data.data || data.data.length === 0) {
        return '<div class="no-data">No historical data available</div>';
    }

    // Cache the data for pagination
    historicalDataCache = data;
    currentPage = 1;

    return renderHistoricalPage();
}

function renderHistoricalPage() {
    if (!historicalDataCache) return '';

    const data = historicalDataCache;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const totalPages = Math.ceil(data.data.length / ITEMS_PER_PAGE);

    const priceRows = data.data
        .slice(startIndex, endIndex)
        .map(pricePoint => {
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: data.currency?.toUpperCase() || 'USD'
            }).format(parseFloat(pricePoint.value));

            const date = new Date(pricePoint.timestamp);
            const dateFormat = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };

            const formattedDate = date.toLocaleString('en-US', dateFormat);

            return `<tr>
                <td>${formattedDate}</td>
                <td>${formattedPrice}</td>
            </tr>`;
        }).join('');

    return `
        <div class="historical-data">
            <h3>${data.symbol} Historical Prices</h3>
            <div class="table-container">
                <table class="historical-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${priceRows}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">
                    Showing ${startIndex + 1}-${Math.min(endIndex, data.data.length)} 
                    of ${data.data.length} entries
                </div>
                <div class="pagination-controls">
                    <button 
                        class="pagination-button" 
                        onclick="changePage(-1)"
                        ${currentPage === 1 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button 
                        class="pagination-button" 
                        onclick="changePage(1)"
                        ${currentPage === totalPages ? 'disabled' : ''}>
                        Next
                    </button>
                </div>
            </div>
        </div>`;
}

// Add the changePage function
function changePage(delta) {
    if (!historicalDataCache) return;

    const totalPages = Math.ceil(historicalDataCache.data.length / ITEMS_PER_PAGE);
    const newPage = currentPage + delta;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        document.getElementById('historicalResults').innerHTML = renderHistoricalPage();
    }
}

// Update the getHistoricalPrices function to reset pagination
async function getHistoricalPrices() {
    // Reset pagination when fetching new data
    currentPage = 1;
    historicalDataCache = null;
    
    try {
        const symbol = document.getElementById('historicalSymbol').value.trim().toUpperCase();
        
        if (!symbol) {
            document.getElementById('historicalResults').innerHTML = `
                <div class="error-message">
                    Please enter a token symbol
                </div>
            `;
            return;
        }

        // Simplify the request body structure to match working example
        const requestBody = {
            symbol: symbol,
            startTime: new Date(document.getElementById('startDate').value).toISOString(),
            endTime: new Date(document.getElementById('endDate').value).toISOString(),
            interval: document.getElementById('interval').value
        };

        console.log('Sending request:', requestBody);

        const response = await fetch('/api/prices/historical', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Historical price data:', data);
        
        if (data.error) {
            document.getElementById('historicalResults').innerHTML = `
                <div class="error-message">
                    ${data.error.message || data.error}
                </div>
            `;
            return;
        }

        document.getElementById('historicalResults').innerHTML = formatHistoricalData(data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('historicalResults').innerHTML = `
            <div class="error-message">
                Error fetching historical data: ${error.message}
            </div>
        `;
    }
}

// Helper function to format numbers (keep existing implementation)
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num.toFixed(2);
    }
}

// Set default dates when page loads
document.addEventListener('DOMContentLoaded', () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    
    document.getElementById('startDate').value = startDate.toISOString().slice(0, 16);
    document.getElementById('endDate').value = endDate.toISOString().slice(0, 16);
}); 