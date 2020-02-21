const express = require('express');
const router = express.Router();
const forecast = require('../utils/forecast-server');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('forecast');
});

router.post('/', async (req, res) => {
  const address = req.body;
  forecast(address, (err, forecastData) => {
    if (err) {
      return res.send('Error', error)
    } else {
      return res.json({ forecastData, location: address.location });
    }
  })
})

module.exports = router;
