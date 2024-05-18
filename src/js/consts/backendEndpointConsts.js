export const backendHost = {
  host: 'http://localhost:5034/',
}

export const backendEndpointConstants = {
  currencyController: {
    getCurrencies: backendHost.host + 'api/currency/getall',
    createCurrency: backendHost.host + 'api/currency/create',
    updateCurrency: currencyId => {
      return backendHost.host + `api/currency/update?id=${currencyId}`
    },
    deleteCurrency: currencyId => {
      return backendHost.host + `api/currency/delete?id=${currencyId}`
    },
  },
  rateController: {
    getRatesByTargetCurrency: backendHost.host + 'api/rate/getallByTargetCurrencyId?targetCurrencyId=',
    getRatesByBaseCurrency: backendHost.host + 'api/rate/getallByBaseCurrencyId?baseCurrencyId=',
    getRate: (baseCurrencyId, targetCurrencyId) => {
      return backendHost.host + `api/rate/get?baseCurrency=${baseCurrencyId}&targetCurrency=${targetCurrencyId}`
    },
    createRate: backendHost.host + 'api/rate/create',
  },
  transactionController: {
    createTransaction: backendHost.host + 'api/transaction/create',
  },
}
