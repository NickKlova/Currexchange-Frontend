import axios from 'axios'
import { backendEndpointConstants } from '@/pages/js/consts/backendEndpointConsts'

function getCurrencies( ) {
  return axios.get(backendEndpointConstants.currencyController.getCurrencies)
    .then(response => {
      return response.data.map(currency => {
        return {
          id: currency.id,
          code: currency.code,
        }
      })
    })
    .catch(error => {
      console.error('Error when receiving currency:', error)
      throw error
    })
}

export default {
  getCurrencies,
}
