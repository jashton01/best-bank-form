const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Alloy API configuration
const alloyToken = process.env.ALLOY_TOKEN;
const alloySecret = process.env.ALLOY_SECRET;
const alloyBaseUrl = 'https://sandbox.alloy.co/v1/evaluations';

app.post('/api/submit-application', async (req, res) => {
  try {
    const { firstName, lastName, addressLine1, city, state } = req.body;

    // Format data for Alloy API
    const alloyPayload = {
      name_first: firstName,
      name_last: lastName,
      address_line_1: addressLine1,
      address_city: city,
      address_state: state,
      address_country_code: 'US'
    };

    // Make request to Alloy API
    const alloyResponse = await axios.post(alloyBaseUrl, alloyPayload, {
      auth: {
        username: alloyToken,
        password: alloySecret
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(alloyResponse.data);
  } catch (error) {
    console.error('Error submitting to Alloy:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to process application',
      details: error.response?.data || error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});