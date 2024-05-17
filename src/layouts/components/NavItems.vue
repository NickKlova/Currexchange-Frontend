<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
</script>

<template>
  <!-- Operations -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Operations',
    }"
  />
  <VerticalNavGroup
    :item="{
      title: 'Transactions',
      icon: 'ri-p2p-fill',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Create',
        to: '/transaction/create',
        icon: 'ri-add-line',
      }"
    />
  </VerticalNavGroup>
</template>
