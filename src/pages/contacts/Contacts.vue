<script setup>
import contactService from '@/js/services/contactService'
import ContactModalWindow from '../../../views/modals/ContactModalWindow.vue'
import { ref } from 'vue'
import { useSnackbar, Vue3Snackbar } from 'vue3-snackbar'

const snackbar = useSnackbar()
const contacts = ref([])
const isShownContactDialog = ref({})
const isLoading = ref(false)

onMounted(() => {
  setContacts()
  isShownContactDialog.value["new"] = false
})

function setContacts() {
  contactService.getContacts()
    .then(data => {
      contacts.value = data
    })
}

function pushCreatedContactToList(createdContact) {
  contacts.value.push(createdContact)
  snackbar.add({
    type: 'success',
    text: 'Contact created successfully!',
  })
  let closeObject = {
    id: "new",
    state: true,
  }
  closeContactDialog(closeObject)
}

const closeContactDialog = value => {
  isShownContactDialog.value[value.id] = !value.state
}

function updateContactInList(updatedContact) {
  let index = contacts.value.findIndex(cont => cont.id === updatedContact.id)
  if(index !== -1) {
    contacts.value[index] = updatedContact

    let closeObject = {
      id: updatedContact.id,
      state: true,
    }
    closeContactDialog(closeObject)
    snackbar.add({
      type: 'success',
      text: 'Contact updated successfully!',
    })
  }
}

async function deleteContact(id) {
  try {
    isLoading.value = true
    let data = await contactService.deleteContact(id)
    let contactIndex = contacts.value.findIndex(item => item.id === data.id)
    if (contactIndex !== -1) {
      contacts.value.splice(contactIndex, 1)
      snackbar.add({
        type: 'success',
        text: 'Contact deleted successfully!',
      })
    }
  } catch (error) {
    snackbar.add({
      type: 'error',
      text: error.message,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle>
      <div class="d-flex pa-2 align-center justify-space-between w-100">
        <div class="text-center flex-grow-1">
          Contact panel
        </div>
        <VBtn @click="isShownContactDialog['new']=true">
          <VIcon icon="ri-add-line" />
          <span>Add contact</span>
        </VBtn>

        <VDialog v-model="isShownContactDialog['new']">
          <ContactModalWindow
            @pushCreatedContactToList="pushCreatedContactToList"
            @closeAddContactDialog="closeContactDialog"
          />
        </VDialog>
      </div>
    </VCardTitle>
    <!--  -->
    <!-- List of currencies -->
    <VList>
      <!-- List title -->
      <VListItem class="bg-var-theme-background">
        <VRow>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Name
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Email
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Phone number
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Is on blacklist
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-center"
          >
            <VListItemTitle class="font-weight-bold">
              Actions
            </VListItemTitle>
          </VCol>
        </VRow>
      </VListItem>
      <!-- -->

      <!-- List content -->
      <VListItem v-if="contacts.length === 0">
        <VRow>
          <VCol
            cols="12"
            class="d-flex justify-center pa-15"
          >
            <VIcon
              icon="ri-database-2-fill"
              class="mr-3"
            />
            No data
          </VCol>
        </VRow>
      </VListItem>

      <VListItem
        v-if="contacts.length > 0"
        v-for="contact in contacts"
        :key="contact.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ contact.fullName }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ contact.email }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ contact.phoneNumber }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              <VChip :color="contact.isBlacklist ? 'error' : 'success'">
                {{ contact.isBlacklist ? "yes" : "no" }}
              </VChip>
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-center"
          >
            <!-- Update currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="isShownContactDialog[contact.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownContactDialog[contact.id]">
              <ContactModalWindow
                :contact="contact"
                @updateContactInList="updateContactInList"
                @closeAddContactDialog="closeContactDialog"
              />
            </VDialog>
            <!-- -->

            <!-- Delete currency button -->
            <VBtn
              color="secondary"
              variant="text"
              @click="deleteContact(contact.id)"
            >
              <VIcon icon="ri-delete-bin-5-line" />
            </VBtn>
            <!-- -->
          </VCol>
        </VRow>
      </VListItem>
    <!-- -->
    </VList>
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
  />
</template>
