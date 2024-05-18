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
}

function updateCurrency(currencyId, currency) {
  return axios.patch(backendEndpointConstants.currencyController.updateCurrency(currencyId), currency)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when adding currency:', error)
    })
}

export default {
  createCurrency,
  getCurrencies,
  updateCurrency,
  deleteCurrency,
}
