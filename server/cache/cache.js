let cachedCryptoData = [];

function getCryptoData() {
  return cachedCryptoData;
}

function setCryptoData(data) {
  cachedCryptoData = data;
}


module.exports = {
  getCryptoData,
  setCryptoData
};
