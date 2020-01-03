<template>
  <div id="app" class="container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mt-1" style="height:60px" id="navbar">
      <div id="logo"><img class="d-inline-block align-top logo" src="./assets/calendar.png" alt="Logo" />&nbsp;&nbsp;</div>
      <router-link to="/"><i class="fa fa-home"></i>&nbsp;Accueil</router-link>&nbsp;<router-link to="/conf"
        ><i class="fas fa-tools"></i>&nbsp;Configuration</router-link
      >
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <!--<item-menu v-for="item in menuItem" :i18n_text="i18n_text" v-bind:item="item" v-bind:key="item.text"
          @add-new-item="addNewItem" @collapse-all="collapseAll"></item-menu>-->
          <itemmenu
            v-for="item in $store.state.menuItem"
            v-bind:key="item.id"
            v-bind:item="item"
          />
        </ul>

        <div class="form-inline my-2 my-lg-0">
          <ul class="navbar-nav mr-auto">
            <localechanger></localechanger>
            <!--  <item-language v-for="item in languagues" :lang="language" v-bind:key="item.id"
            v-bind:item="item" @change-lang="changeLang"></item-language>-->
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>
<script>
// @ is an alias to /src
import itemmenu from "@/components/item-menu.vue";
import localechanger from "@/components/locale-changer.vue"

export default {
  name: "navbar",
  components: {
    itemmenu, localechanger
  }
};
</script>
<style>
#app {
  margin: auto;
}
#navbar {
  padding-left: 30px;
}
#navbar a {
  font-weight: bold;
  color: #ffffff;
}
#navbar a.router-link-exact-active {
  color: #42b983;
}
.logo {
  width: 30px;
  height: 30px;
}
</style>
