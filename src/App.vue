<template>
  <div id="app">
    <!-- <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-narrow">
              <figure class="image is-128x128">
                <img src="logoPC.jpg" />
              </figure>
            </div>
            <div class="column">
              <h1 class="title">Ontology explorer</h1>
              <h2 class="subtitle">Experiment combining Vue.js and cytoscape for network analysis</h2>

              <div id="nav">
            <b-navbar>
              <template slot="start">
                <router-link class="navbar-item" to="/">Home</router-link>|
                <router-link class="navbar-item" to="/upload">Upload</router-link>|
                <router-link class="navbar-item" to="/about">About</router-link>
              </template>
            </b-navbar>
          </div>
            </div>
          </div>

          
        </div>
      </div>
    </section> -->

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