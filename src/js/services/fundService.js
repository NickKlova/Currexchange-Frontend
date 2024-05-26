import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getFunds() {
  return axios.get(backendEndpointConstants.fundController.getFunds)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when receiving funds:', error)
      throw error
    })
}

function updateFund(fundId, data) {
  return axios.put(backendEndpointConstants.fundController.updateFund(fundId), data)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.error('Error when updating fund', error)
      throw error
    })
}

export default {
  getFunds,
  updateFund,
}
