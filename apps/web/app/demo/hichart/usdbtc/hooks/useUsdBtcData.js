import { useState, useEffect } from 'react';

export function useUsdBtcData(timeframe) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData([]); // Clear previous data

    let days;
    if (timeframe === '1Y') {
      days = 365;
    } else if (timeframe === '10Y') {
      days = 3650;
    } else if (timeframe === '20Y') {
      days = 7300;
    } else {
      setError('Invalid timeframe');
      setLoading(false);
      return;
    }

    const apiUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`;

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) {
          // Attempt to read error body if available
          return res.text().then(text => { throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`); });
        }
        return res.json();
      })
      .then(data => {
        // CoinGecko returns data in the format [[timestamp, price], [timestamp, price], ...]
        // We need to ensure the timestamp is in milliseconds for Highcharts
        const formattedData = data.prices.map(item => [item[0], item[1]]);
        setData(formattedData);
      })
      .catch(e => {
        console.error("Fetching USD/BTC data failed:", e);
        setError(`Failed to fetch USD/BTC data: ${e.message}`);
      })
      .finally(() => setLoading(false));

  }, [timeframe]);

  return { data, loading, error };
}
