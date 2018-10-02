<template>
  <svg xmlns="http://www.w3.org/2000/svg" :code="code" :name="name" :font="font" :viewBox="viewBox">
    <path :d="path"/>
  </svg>
</template>

<script>
export default {
  name: 'svg-file-icon',
  props: {
    code: {
      type: String
    },
    name: {
      type: String
    },
    font: {
      type: String,
      default: 'default'
    },
    viewBox: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
svg path {
  fill: currentColor;
}
</style>
