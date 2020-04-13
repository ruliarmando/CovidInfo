const axios = require('axios');
const fs = require('fs');

async function run() {
  const response = await axios.get('https://api.kawalcorona.com/indonesia/provinsi');
  const provinceNames = response.data.map(item => item.attributes.Provinsi);
  fs.writeFileSync('provinces.txt', provinceNames.join('\n'));
}

run();
