import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getCurrencies( ) {
  return axios.get(backendEndpointConstants.currencyController.getCurrencies)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when receiving currency:', error)
      throw error
    })
}

function deleteCurrency(currencyId) {
  return axios.delete(backendEndpointConstants.currencyController.deleteCurrency(currencyId))
    .then(response => {
      return {
        id: response.data.id,
        code: response.data.code,
      }
    })
    .catch(error => {
      console.error('Error when deleting currency:', error)
    })
}

function createCurrency(currency) {
  return axios.post(backendEndpointConstants.currencyController.createCurrency, currency)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when creating currency:', error)
      throw error
    })
}

function updateCurrency(currencyId, currency) {
  return axios.put(backendEndpointConstants.currencyController.updateCurrency(currencyId), currency)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when adding currency:', error)
      throw error
    })
}

function getBankGovCurrencies() {
  return axios.get(backendEndpointConstants.currencyController.getBankGovCurrencies)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when getBankGovCurrencies returned', error)
      throw error
    })
}

export default {
  getBankGovCurrencies,
  createCurrency,
  getCurrencies,
  updateCurrency,
  deleteCurrency,
}
