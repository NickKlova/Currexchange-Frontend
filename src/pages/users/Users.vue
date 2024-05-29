<script setup>
import CurrencyModalWindow from '../../../views/modals/CurrencyModalWindow.vue'
import { useSnackbar, Vue3Snackbar } from 'vue3-snackbar'
import userService from '@/js/services/userService'
import { ref } from 'vue'
import UserModalWindow from '../../../views/modals/UserModalWindow.vue'

const snackbar = useSnackbar()

const users = ref([])
const isLoading = ref(false)

//region dialog

const isShownUserDialog = ref({})

//endregion

onMounted(async () => {
  await setUsers()
})

async function setUsers() {
  try {
    users.value = await userService.getAllUsers()
  } catch (error) {

  }
}

const updateUserInList = updatedUser => {
  let index = users.value.findIndex(usr => usr.id === updatedUser.id)
  if(index !== -1) {
    users.value[index] = updatedUser

    let closeObject = {
      id: updatedUser.id,
      state: true,
    }
    closeUserDialog(closeObject)
    snackbar.add({
      type: 'success',
      text: 'User updated successfully!',
    })
  }
}
const closeUserDialog = value => {
  isShownUserDialog.value[value.id] = !value.state
}
</script>

<template>
  <VCard>
    <!-- Header -->
    <VCardTitle>
      <div class="d-flex pa-2 align-center justify-space-between w-100">
        <div class="text-center flex-grow-1">
          User panel
        </div>
        <VBtn @click="isShownUserDialog['new'] = true" class="ml-auto">
          <VIcon icon="ri-add-line" />
          <span>Add user</span>
        </VBtn>

        <VDialog v-model="isShownUserDialog['new']">
          <UserModalWindow
            :users="users"
            :isDialogShown="isShownUserDialog"
          >

          </UserModalWindow>
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
              Login
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Contact
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Role
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle class="font-weight-bold">
              Status
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
      <VListItem v-if="users.length === 0">
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
        v-if="users.length > 0"
        v-for="user in users"
        :key="user.id"
      >
        <VRow>
          <VCol>
            <VListItemTitle>
              {{ user.login }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              {{ user.contact.fullName }}
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              <VChip
                color="primary"
                label
              >
                {{ user.role.name }}
              </VChip>
            </VListItemTitle>
          </VCol>
          <VCol>
            <VListItemTitle>
              <VChip :color="user.isActive ? 'success' : 'error'">
                {{ user.isActive ? 'active' : 'not active' }}
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
              @click="isShownUserDialog[user.id] = true"
            >
              <VIcon icon="ri-settings-4-fill" />
            </VBtn>

            <VDialog v-model="isShownUserDialog[user.id]">
              <UserModalWindow
                :user="user"
                :users="users"
                :isDialogShown="isShownUserDialog"
              />
            </VDialog>
            <!-- -->

            <!-- Delete currency button
            <VBtn
              color="secondary"
              variant="text"
              @click="deleteCurrency(currency.id)"
            >
              <VIcon icon="ri-delete-bin-5-line" />
            </VBtn>-->
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
