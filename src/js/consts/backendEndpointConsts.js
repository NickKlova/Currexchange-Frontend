export const backendHost = {
  host: 'http://localhost:5034/',
}

export const backendEndpointConstants = {
  currencyController: {
    getCurrencies: backendHost.host + 'api/currency/get/all',
    getBankGovCurrencies: backendHost.host + 'api/currency/gov/get/all',
    createCurrency: backendHost.host + 'api/currency/create',
    updateCurrency: currencyId => {
      return backendHost.host + `api/currency/update/${currencyId}`
    },
    deleteCurrency: currencyId => {
      return backendHost.host + `api/currency/delete/${currencyId}`
    },
  },
  rateController: {
    getRatesByTargetCurrency: backendHost.host + 'api/rate/getall/bytargetcurrency/',
    getRatesByBaseCurrency: backendHost.host + 'api/rate/getall/bybasecurrency/',
    getRate: (baseCurrencyId, targetCurrencyId) => {
      return backendHost.host + `api/rate/get/bycurrencies?baseCurrency=${baseCurrencyId}&targetCurrency=${targetCurrencyId}`
    },
    createRate: backendHost.host + 'api/rate/create',
    getRates: backendHost.host + 'api/rate/getall',
    updateRate: rateId => {
      return backendHost.host + 'api/rate/update?id=' + rateId
    },
    deleteRate: rateId => {
      return backendHost.host + `api/rate/delete?id=${rateId}`
    },
  },
  transactionController: {
    createTransaction: backendHost.host + 'api/transaction/create',
    getTransactions: backendHost.host + 'api/transaction/getall',
  },
  fundController: {
    getFunds: backendHost.host + 'api/fund/getall',
    updateFund: fundId => {
      return backendHost.host + `api/fund/update/${fundId}`
    },
  },
  contactController: {
    getContacts: backendHost.host + 'api/contact/getall',
    updateContact: contactId => {
      return backendHost.host + `api/contact/update?id=${contactId}`
    },
    deleteContact: contactId => {
      return backendHost.host + `api/contact/deactivate?id=${contactId}`
    },
    createContact: backendHost.host + 'api/contact/create',
  },
  reservationController: {
    createReservation: backendHost.host + 'api/reservation/create',
    getReservations: backendHost.host + 'api/reservation/getall',
    deleteReservation: reservationId => {
      return backendHost.host + 'api/reservation/delete?id=' + reservationId
    },
  },
}
