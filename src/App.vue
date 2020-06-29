<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$body-family: "Arvo", "Avenir", Helvetica, Arial, sans-serif;

$title-color: #bf0000;

$hero-body-padding: 1rem 1rem;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

h1 {
  color: #bf0000;
}

#cytoscape-div {
  min-height: 600px;
  height: 600px;
}

.leaflet-popup-content {
  font-family: "Arvo";
}
</style>