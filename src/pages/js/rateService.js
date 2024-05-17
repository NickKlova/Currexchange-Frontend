import axios from 'axios'
import { backendEndpointConstants } from '@/pages/js/consts/backendEndpointConsts'

function getCurrenciesForAcceptedCurrency(currencyId) {
  return axios.get(backendEndpointConstants.rateController.getRatesByTargetCurrency + currencyId)
    .then(response => {
      return response.data.map(rate => {
        return {
          id: rate.baseCurrency.id,
          code: rate.baseCurrency.code,
        }
      })
    })
    .catch(error => {
      console.error('Error when receiving currencies for base currency:', error)
      throw error
    })
}

function getCurrenciesForReturnedCurrency(currencyId) {
  return axios.get(backendEndpointConstants.rateController.getRatesByBaseCurrency + currencyId)
    .then(response => {
      return response.data.map(rate => {
        return {
          id: rate.targetCurrency.id,
          code: rate.targetCurrency.code,
        }
      })
    })
    .catch(error => {
      console.error('Error when receiving currencies for target currency:', error)
      throw error
    })
}

function getRateByCurrencies(baseCurrencyId, targetCurrencyId) {
  return axios.get(backendEndpointConstants.rateController.getRate(baseCurrencyId, targetCurrencyId))
    .then(response => {
      return response.data
    })
}

export default {
  getRateByCurrencies,
  getCurrenciesForAcceptedCurrency,
  getCurrenciesForReturnedCurrency,
}
