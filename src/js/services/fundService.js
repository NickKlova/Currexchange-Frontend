import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getFunds() {
  return axios.get(backendEndpointConstants.fundController.getFunds)
}

function updateFund(fundId, data) {
  return axios.put(backendEndpointConstants.fundController.updateFund(fundId), data)
    .then(response => {
      return response.data
    })
}

export default {
  getFunds,
  updateFund,
}
