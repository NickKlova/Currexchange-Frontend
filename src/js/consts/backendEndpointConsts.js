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
    getRates: backendHost.host + 'api/rate/get/all',
    getRateByCurrency: currencyId => {
      return backendHost.host + `api/rate/get/bycurrency/${currencyId}`;
    },
    getRate: rateId => {
      return backendHost.host + `api/rate/get/${rateId}`
    },
    createRate: backendHost.host + 'api/rate/create',
    updateRate: rateId => {
      return backendHost.host + `api/rate/update/${rateId}`
    },
    deleteRate: rateId => {
      return backendHost.host + `api/rate/delete/${rateId}`
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
