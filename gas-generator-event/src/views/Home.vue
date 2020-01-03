<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script>
export default {
  name: "home",
  mounted() {
    this.$store.commit("updateCurrentRoute", "home");
    
  }
};
</script>
