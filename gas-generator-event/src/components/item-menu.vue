<template>
  <li class="nav-item" v-if="$store.getters.getCurrentRoute=='home'">
    <a @click="$emit(item.action)" class="nav-link" href="#">
      <i :class="item.icon"></i> {{ $t(item.text) }}
    </a>
  </li>
</template>

<script>
export default {
  name: "item-menu",
  props: ["item"]
};
</script>
