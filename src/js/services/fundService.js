import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getFunds() {
 return axios.get(backendEndpointConstants.fundController.getFunds)
}

function updateFund(fundId, data) {
  return axios.patch(backendEndpointConstants.fundController.updateFund(fundId, data))
}

export default {
  getFunds,
  updateFund,
}
