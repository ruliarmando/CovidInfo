const axios = require('axios');

module.exports = {
  getGlobalData: async () => {
    const [positif, sembuh, meninggal] = await Promise.all(
      [
        axios.get('https://api.kawalcorona.com/positif'),
        axios.get('https://api.kawalcorona.com/sembuh'),
        axios.get('https://api.kawalcorona.com/meninggal'),
      ]
    );

    return [{
      positif: positif.data.value,
      sembuh: sembuh.data.value,
      meninggal: meninggal.data.value,
    }];
  },

  getNationalData: async () => {
    const response = await axios.get('https://api.kawalcorona.com/indonesia');

    return response.data;
  },

  getProvinceData: async (province) => {
    const response = await axios.get('https://api.kawalcorona.com/indonesia/provinsi');
    const data = response.data.find(item => item.attributes.Provinsi === province);

    return [{
      positif: data.attributes.Kasus_Posi,
      sembuh: data.attributes.Kasus_Semb,
      meninggal: data.attributes.Kasus_Meni,
    }];
  },

  getCountryData: async (country) => {
    const response = await axios.get('https://api.kawalcorona.com/');
    const data = response.data.find(item => item.attributes.Country_Region === country);

    return [{
      positif: data.attributes.Active,
      sembuh: data.attributes.Recovered,
      meninggal: data.attributes.Deaths,
    }];
  }
}
