import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

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

function createRate(data) {
  return axios.post(backendEndpointConstants.rateController.createRate, data)
}

function getRates() {
  return axios.get(backendEndpointConstants.rateController.getRates)
    .then(response => {
      return response.data.map(rate => {
        return {
          id: rate.id,
          baseCurrency: {
            id: rate.baseCurrency.id,
            code: rate.baseCurrency.code,
          },
          targetCurrency: {
            id: rate.targetCurrency.id,
            code: rate.targetCurrency.code,
          },
          sellRate: rate.sellRate,
        }
      })
    })
}

function updateRate(rateId, data) {
  return axios.patch(backendEndpointConstants.rateController.updateRate(rateId), data)
    .then(response => {
      return  {
        id: response.data.id,
        baseCurrency: {
          id: response.data.baseCurrency.id,
          code: response.data.baseCurrency.code,
        },
        targetCurrency: {
          id: response.data.targetCurrency.id,
          code: response.data.targetCurrency.code,
        },
        sellRate: response.data.sellRate,
      }
    })
}

function deleteRate(rateId) {
  return axios.delete(backendEndpointConstants.rateController.deleteRate(rateId))
    .then(response => {
      return  {
        id: response.data.id,
        baseCurrency: {
          id: response.data.baseCurrency.id,
          code: response.data.baseCurrency.code,
        },
        targetCurrency: {
          id: response.data.targetCurrency.id,
          code: response.data.targetCurrency.code,
        },
        sellRate: response.data.sellRate,
      }
    })
}

export default {
  deleteRate,
  updateRate,
  getRates,
  createRate,
  getRateByCurrencies,
  getCurrenciesForAcceptedCurrency,
  getCurrenciesForReturnedCurrency,
}
