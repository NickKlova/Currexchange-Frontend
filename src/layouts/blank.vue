<template>
  <div class="layout-wrapper layout-blank">
    <RouterView />
    {{ console.log("BLANK FILE") }}
  </div>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
