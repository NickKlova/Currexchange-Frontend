import axios from 'axios'
import { backendEndpointConstants } from '@/js/consts/backendEndpointConsts'

function getContacts() {
  return axios.get(backendEndpointConstants.contactController.getContacts)
    .then(response => {
      return response.data
    })
    .catch(err=>{
      console.log(err)
    })
}

function updateContact(contactId, data) {
  return axios.patch(backendEndpointConstants.contactController.updateContact(contactId), data)
    .then(response => {
      return response.data
    })
}

function deleteContact(contactId) {
  return axios.delete(backendEndpointConstants.contactController.deleteContact(contactId))
    .then(response => {
      return response.data
    })
}

function createContact(data) {
  return axios.post(backendEndpointConstants.contactController.createContact, data)
    .then(response => {
      return response.data
    })
}

export default {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
}
