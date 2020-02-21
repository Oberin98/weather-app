const request = require('request');

const forecast = ({ latitude, longtitude }, callback) => {
  const url = `https://api.darksky.net/forecast/227b0b87b4287f3a44f5550c09e97fde/${latitude},${longtitude}?units=si`
  request({ url, json: true }, (err, response) => {
    const { temperature, summary } = response.body.currently;
    if (err) {
      callback('Some Troubles!!!', undefined)
    } else if (response.body.error) {
      callback('Some Troubles!!!', undefined)
    } else {
      callback(undefined, { temperature, summary })
    }
  })
}


module.exports = forecast;
