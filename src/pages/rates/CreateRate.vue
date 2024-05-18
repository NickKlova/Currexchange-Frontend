<script setup>

</script>

<template>
  <VCard>
    <VCardTitle>
      Rate create
    </VCardTitle>
    <VCardItem>
      <VRow>
        <VCol class="pa-5">
          <VAutocomplete
            label="Base currency"
            :items="['usd', 'eur']"
          />
        </VCol>
        <VCol class="pa-5">
          <VAutocomplete
            label="Target currency"
            :items="['pln', 'uah']"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol class="pa-5">
          <VTextField label="Rate"
          />
        </VCol>
      </VRow>
    </VCardItem>
  </VCard>
</template>

