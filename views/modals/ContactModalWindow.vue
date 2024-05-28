<script setup>
import { ref, onMounted, computed } from 'vue'
import contactService from '@/js/services/contactService'
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar"
import { validationRules } from '@/js/validationRules.js'

const props = defineProps({
  contact: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['closeAddContactDialog', 'pushCreatedContactToList', 'updateContactInList'])

const isFormValid = ref(false)
const form = ref(null)
const isLoading = ref(null)

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

async function saveOrUpdateContact() {
  if(!isFormValid.value) {
    form.value.validate()
    return
  }

  let data = {
    fullName: contactModel.value.fullName,
    email: contactModel.value.email,
    phoneNumber: contactModel.value.phoneNumber,
    isBlacklist: !contactModel.value.isBlacklist ? false : contactModel.value.isBlacklist,
  }

  if(isModifiedState.value) {
    return await updateContact(data)
  }
  await createContact(data)
}

async function updateContact(body) {
  isLoading.value = true
  let updatedSuccessfully = false
  let data = null
  try {
    data = await contactService.updateContact(contactModel.value.id, body)
    updatedSuccessfully = true
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
    if(updatedSuccessfully) {
      updateContactInList(data)
    }
  }
  return data
}

async function createContact(body) {
  isLoading.value = true
  let updatedSuccessfully = false
  let data = null
  try {
    data = await contactService.createContact(body)
    updatedSuccessfully = true
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
    if(updatedSuccessfully) {
      pushCreatedContactToList(data)
    }
  }
  return data
}

function updateContactInList(contact) {
  emits('updateContactInList', contact)
}

function pushCreatedContactToList(contact) {
  emits('pushCreatedContactToList', contact)
}

//region validation rules

const contactValidationRules = computed(() => {
  let model = contactModel.value.fullName
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const emailValidationRules = computed(() => {
  let model = contactModel.value.email
  let rules = []
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  rules.push(regex.test(model) || 'E-mail address must be a valid email address');
  return rules
})

const phoneValidationRules = computed(() => {
  let model = contactModel.value.phoneNumber
  let rules = []
  const regex = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
  rules.push(regex.test(model) || 'Phone number must be a valid phone number');
  return rules
})

//endregion
</script>

<template>
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
      <VForm
        v-model="isFormValid"
        ref="form"
      >
        <VRow>
          <VCol>
            <VTextField
              v-model="contactModel.fullName"
              label="Full name"
              :rules="contactValidationRules"
            />
          </VCol>
          <VCol>
            <VTextField
              v-model="contactModel.email"
              label="Email"
              :rules="emailValidationRules"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              v-model="contactModel.phoneNumber"
              label="Phone number"
              :rules="phoneValidationRules"
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
      </VForm>
    </VContainer>
    <!-- -->
  </VCard>

  <VDialog
    v-model="isLoading"
    :persistent="isLoading"
  >
    <VProgressCircular
      v-if="isLoading"
      color="primary"
      :size="100"
      :width="10"
      indeterminate
      class="ma-auto"
    />
  </VDialog>

  <Vue3Snackbar
    bottom
    right
    duration="2000"
  ></Vue3Snackbar>
</template>
