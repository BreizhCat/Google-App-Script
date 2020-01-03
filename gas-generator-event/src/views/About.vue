<template>
  <div class="about">
    <h1>This is an configuration page </h1>
  </div>
</template>

<script>
export default {
  name: "home",
  mounted() {
    this.$store.commit("updateCurrentRoute", "about");
  }
};
</script>
