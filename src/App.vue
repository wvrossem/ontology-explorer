<template>
  <div id="app">
    <div id="nav">
      <b-navbar 
        spaced
        shadow>
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }">
            <img
              src="logoPC.jpg"
              alt="Processing Citizenship"
            />
          </b-navbar-item>
        </template>
        <hr class="navbar-divider">
        <template slot="start">
          <router-link class="navbar-item" to="/">Home</router-link>
          <hr class="navbar-divider">
          <router-link class="navbar-item" to="/upload">Upload</router-link>
          <hr class="navbar-divider">
          <router-link class="navbar-item" to="/analysis">Network analysis</router-link>
          <hr class="navbar-divider">
          <router-link class="navbar-item" to="/about">About</router-link>
        </template>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$body-family: "Arvo", "Avenir", Helvetica, Arial, sans-serif;

$title-color: #bf0000;

$hero-body-padding: 1rem 1rem;

$navbar-item-img-max-height: 4rem;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #bf0000;
    }
  }
}

h1 {
  color: #bf0000;
}

a {
  color: #bf0000;
}

strong {
  color: #2c3e50;
}

#cytoscape-div {
  min-height: 600px;
  height: 600px;
}

.leaflet-popup-content {
  font-family: "Arvo";
}
</style>