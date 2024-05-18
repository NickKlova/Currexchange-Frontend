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
      title: 'transactions',
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
  
  <VerticalNavLink
    :item="{
      title: 'Currencies',
      to: '/currencies/get',
      icon: 'ri-money-dollar-circle-fill',
    }"
  />
  
  <VerticalNavGroup
    :item="{
      title: 'Rates',
      icon: 'ri-swap-2-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Create',
        to: '/rate/create',
        icon: 'ri-add-line',
      }"
    />

    <VerticalNavLink
      :item="{
        title: 'View',
        to: '/rates/get',
        icon: 'ri-bar-chart-horizontal-fill',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavLink
    :item="{
      title: 'Funds',
      to: '/funds/get',
      icon: 'ri-wallet-3-fill',
    }"
  />

  <VerticalNavGroup
    :item="{
      title: 'Reservations',
      icon: 'ri-bookmark-fill',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'View',
        to: '/reservations/get',
        icon: 'ri-bar-chart-horizontal-fill',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Create',
        to: '/reservation/create',
        icon: 'ri-add-line',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavLink
    :item="{
      title: 'Contacts',
      to: '/contacts/get',
      icon: 'ri-account-box-fill',
    }"
  />
</template>
