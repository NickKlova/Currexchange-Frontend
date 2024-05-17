export const backendHost = {
  host: 'http://localhost:5034/',
}

export const backendEndpointConstants = {
  currencyController: {
    getCurrencies: backendHost.host + 'api/currency/getall',
    createCurrency: backendHost.host + 'api/currency/create',
    updateCurrency: backendHost.host + 'api/currency/update?id=',
    deleteCurrency: backendHost.host + 'api/currency/delete?id=',
  },
  rateController: {
    getRatesByTargetCurrency: backendHost.host + 'api/rate/getallByTargetCurrencyId?targetCurrencyId=',
    getRatesByBaseCurrency: backendHost.host + 'api/rate/getallByBaseCurrencyId?baseCurrencyId=',
    getRate: (baseCurrencyId, targetCurrencyId) => {
      return backendHost.host + `api/rate/get?baseCurrency=${baseCurrencyId}&targetCurrency=${targetCurrencyId}`
    },
  },
  transactionController: {
    createTransaction: backendHost.host + 'api/transaction/create',
  },
}
