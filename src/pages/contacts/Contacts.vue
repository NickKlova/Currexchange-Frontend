<script setup>
import contactService from '@/js/services/contactService'
import ContactModalWindow from '../../../views/modals/ContactModalWindow.vue'
import { ref } from 'vue'

const contacts = ref([])
const isShownContactDialog = ref({})

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
  }
}

function deleteContact(id) {
  contactService.deleteContact(id)
    .then(deletedContact => {
      let cont = contacts.value.findIndex(item => item.id === deletedContact.id)
      if (cont !== -1) {
        contacts.value.splice(cont, 1)
      }
    })
}
</script>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle>
      <div class="d-flex justify-end pa-5">
        <h1 class="mr-auto">
          Contact panel
        </h1>
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
      <VListItem
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
              {{ contact.isBlacklist ? "yes" : "no" }}
            </VListItemTitle>
          </VCol>
          <VCol
            cols="1"
            class="d-flex justify-end"
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
</template>
