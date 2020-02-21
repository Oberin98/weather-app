const request = require('request');

const geocode = (address, cb) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoib2JiZXJpbjk4IiwiYSI6ImNrNnFvbzJ3NTAycGUzZW82Z3Y2ejJ6dWkifQ.UQwpf--JEiAP3Ef86pFCxw`

  request({ url, json: true }, (err, res) => {
    const { features } = res.body

    if (err) { ``
      cb('Some troubles!!', undefined)
    } else if (res.body.features.length === 0) {
      cb('Some troubles!!', undefined)
    } else {
      cb(undefined, {
        'latitude': features[0].center[1],
        'longtitude': features[0].center[0],
        'location': features[0].place_name,
      })
    }


  })
}

module.exports = geocode
