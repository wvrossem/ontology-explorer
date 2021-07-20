<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title title is-4">Selected Node Info</p>
    </header>

    <div class="card-content">
      <article class="message">
        <div class="message-header">
          <p>Node name</p>
        </div>
        <div class="message-body">
          <p class="is-family-code">{{ node.name }}</p>
        </div>
      </article>
    </div>

    <div class="card-content">
      <article class="message">
        <div class="message-header">
          <p>Neighborhood</p>
        </div>
        <div class="message-body">
          <ul class="list">
            <li
              class="is-family-code list-item"
              v-for="el in node.neighborhood"
              :key="el.name"
            >
              <small>{{ el.name }} ({{ el.classes[0] }})</small>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: "NodeInfo",
  props: {
    node: {
      type: Object,
    },
  },
};
</script>