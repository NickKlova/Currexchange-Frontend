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

  <VerticalNavGroup
    :item="{
      title: 'currencies',
      icon: 'ri-money-dollar-circle-fill',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'View',
        to: '/currencies/get',
        icon: 'ri-bar-chart-horizontal-fill',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    :item="{
      title: 'rates',
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
</template>
