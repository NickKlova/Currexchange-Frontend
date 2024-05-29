import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getAllUsers() {
  return axios.get(backendEndpointConstants.userController.getAllUsers)
    .then((response) => {
      return response.data
    })
}

export default {
  getAllUsers
}
