// index.js

const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const SERVER_URL = 'https://example.com'; // replace this with your server URL

app.get('/status', async (req, res) => {
    try {
        const response = await axios.get(SERVER_URL, { timeout: 5000 }); // set timeout to 5 seconds
        if (response.status === 200) {
            res.json({ status: 'online' });
        } else {
            res.json({ status: 'offline' });
        }
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            res.json({ status: 'offline', error: 'Request timed out' });
        } else {
            res.json({ status: 'offline', error: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
