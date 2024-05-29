<script setup>
import { userRoles } from '@/js/consts/userRolesConsts'
import contactService from '@/js/services/contactService'
import { validationRules } from '@/js/validationRules.js'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  users: {
    type: Array,
    default: null,
  },
  isDialogShown: {
    type: Object,
    default: null,
  }
})

const isPasswordShown = ref(false)
const isModifiedState = ref(false)
const isPasswordChanged = ref(false)

const login = ref(null)
const contact = ref(null)
const role = ref(null)
const status = ref(null)
const password = ref(null)

const isFormValid = ref(false)
const form = ref(null)
const contacts = ref([])

onMounted(async () => {
  if(props.user !== null) {
    isModifiedState.value = true
    login.value = props.user.login
    contact.value = props.user.contact
    role.value = props.user.role
    status.value = props.user.isActive
  }
  await setContacts()
})

function closeDialogWindow() {
  if (isModifiedState.value) {
   return props.isDialogShown[props.user.id] = false
  }
  props.isDialogShown['new'] = false
}

async function setContacts() {
  try {
    let data = await contactService.getContacts()
    contacts.value = data
  } catch (error) {

  }
}

//region validation rules

const contactValidationRules = computed(() => {
  let model = contact.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const loginValidationRules = computed(() => {
  let model = login.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const roleValidationRules = computed(() => {
  let model = role.value
  let rules = []

  rules.push(validationRules.isFieldRequired(model))
  return rules
})

const passwordValidationRules = computed(() => {
  let model = password.value
  let rules = []

  if(isPasswordChanged.value || !isModifiedState.value) {
    rules.push(validationRules.isFieldRequired(model))

    const regex = /^(?=.*\d.*\d)[a-zA-Z\d]{8,}$/;
    rules.push(regex.test(model) || 'Password must contain at least 8 characters (2 numbers is required)');
  }
  return rules
})
//endregion

async function createOrUpdateUser() {
  if(!isFormValid.value) {
    form.value.validate()
    return
  }
}

async function createUser() {

}

async function updateUser() {

}
</script>

<template>
  <VCard>
    <!-- Close button in header -->
    <div class="d-flex justify-end pa-5">
      <h3 class="mr-auto font-weight-regular">
        User editor
      </h3>

      <VSwitch
        v-if="isModifiedState"
        v-model="isPasswordChanged"
        class="pr-5 pt-2"
        label="Password will changed"
      >
      </VSwitch>

      <VBtn @click="closeDialogWindow">
        Close
      </VBtn>
    </div>
    <!-- -->

    <VContainer>
      <VForm
        v-model="isFormValid"
        ref="form"
      >
        <VRow>
          <VCol>
            <VTextField
              v-model="login"
              label="Login"
              clearable
              :rules="loginValidationRules"
            />
          </VCol>
          <VCol>
            <VAutocomplete
              v-model="contact"
              label="Contact"
              item-title="fullName"
              return-object
              :items="contacts"
              :rules="contactValidationRules"
            />
          </VCol>
        </VRow>
        <VRow cols="3">
          <VCol>
            <VAutocomplete
              v-model="role"
              label="Role"
              :items="userRoles"
              item-title="name"
              return-object
              :rules="roleValidationRules"
            />
          </VCol>
          <VCol>
            <VCheckbox
              v-model="status"
              label="Is user active?"
            />
          </VCol>
        </VRow>
        <VRow
          v-if="isPasswordChanged || !isModifiedState"
        >
          <VCol>
            <VTextField
              v-model="password"
              label="Password"
              :append-icon="isPasswordShown ? 'ri-eye-fill' : 'ri-eye-off-fill'"
              :type="isPasswordShown ? 'text' : 'password'"
              hint="At least 8 characters"
              @click:append="isPasswordShown = !isPasswordShown"
              :rules="passwordValidationRules"
            >

            </VTextField>
          </VCol>
        </VRow>
        <VRow>
          <VCol class="d-flex justify-center">
            <VBtn
              color="success"
              @click="createOrUpdateUser"
            >
              Save
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VContainer>
  </VCard>
</template>
