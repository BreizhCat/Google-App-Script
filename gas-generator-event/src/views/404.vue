<template>
  <div class="404">
    <h1>Gloups</h1>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Erroneous",
  mounted() {
    this.$store.commit("updateCurrentRoute", "error");
  }
};
</script>
