const axios = require('axios');
const fs = require('fs');

async function run() {
  const response = await axios.get('https://api.kawalcorona.com/');
  const countryNames = response.data.map(item => item.attributes.Country_Region);
  fs.writeFileSync('countries.txt', countryNames.join('\n'));
}

run();
