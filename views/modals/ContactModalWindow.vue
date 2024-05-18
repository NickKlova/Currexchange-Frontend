<script setup>
import { ref, onMounted } from 'vue'
import contactService from '@/js/services/contactService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import isVarEmpty from "@/js/helper"

const props = defineProps({
  contact: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['closeAddContactDialog', 'pushCreatedContactToList', 'updateContactInList'])

const snackbar = useSnackbar()

const contactModel = ref({
  id: null,
  fullName: null,
  email: null,
  phoneNumber: null,
  isBlackList: null,
})


const isModifiedState = ref(false)

onMounted(() => {
  if(props.contact !== null) {
    setContactModifiedState()
  }
})

function setContactModifiedState() {
  isModifiedState.value = true
  contactModel.value = props.contact
}

function closeDialogWindow() {
  if (!isModifiedState.value) {
    let closeObject = {
      id: "new",
      state: true,
    }
    emits('closeAddContactDialog', closeObject)
  }
  else {
    let closeObject = {
      id: props.contact.id,
      state: true,
    }
    emits('closeAddContactDialog', closeObject)
  }
}

function isAllFieldsFill() {
  return !(isVarEmpty(contactModel.value.fullName) ||
    isVarEmpty(contactModel.value.email) ||
    isVarEmpty(contactModel.value.phoneNumber))
}

function saveOrUpdateContact() {
  let data = {
    fullName: contactModel.value.fullName,
    email: contactModel.value.email,
    phoneNumber: contactModel.value.phoneNumber,
    isBlacklist: isVarEmpty(contactModel.value.isBlacklist) ? false : contactModel.value.isBlacklist,
  }

  if (!isAllFieldsFill()) {
    let errorObj = {
      type: 'error',
      text: 'Fill all fields',
    }
    snackbar.add(errorObj)

    return
  }

  if(isModifiedState.value) {
    return contactService.updateContact(contactModel.value.id, data)
      .then(modifiedContact => {
        updateContactInList(modifiedContact)
      })
  }
  contactService.createContact(data)
    .then(response => {
      pushCreatedContactToList(response)
    })
}

function updateContactInList(contact) {
  emits('updateContactInList', contact)
}

function pushCreatedContactToList(contact) {
  emits('pushCreatedContactToList', contact)
}
</script>

<template>
  <Vue3Snackbar
    bottom
    right
  ></Vue3Snackbar>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <h1 class="mr-auto">
        Contact editor
      </h1>
      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>
    <!-- -->

    <!-- Edit container -->
    <VContainer>
      <VRow>
        <VCol>
          <VTextField
            v-model="contactModel.fullName"
            label="Full name"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="contactModel.email"
            label="Email"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTextField
            v-model="contactModel.phoneNumber"
            label="Phone number"
          />
        </VCol>
        <VCol>
          <VCheckbox
            v-model="contactModel.isBlackList"
            label="Blacklist"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            @click="saveOrUpdateContact"
          >
            Save
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
    <!-- -->
  </VCard>
</template>
