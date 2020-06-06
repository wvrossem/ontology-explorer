<template>
  <div>
    <b-table 
      :paginated="true"
      :per-page="10"
      :pagination-simple="true"
      :data="data"
      checkable
      :checked-rows.sync="checkedNodes" 
      :columns="columns">
    </b-table>

    <b-button icon-left="download">
      <download-csv
        :data = "data">
        Download Data
      </download-csv>
    </b-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      checkedNodes: [],
      columns: [
        {
          field: 'node_name',
          label: 'Name',
          searchable: true,
          sortable: true
        },
        {
          field: 'node_type',
          label: 'Type',
          centered: true
        },
        {
          field: 'node_centrality_degree',
          label: 'Degree',
          centered: true,
          sortable: true
        },
        {
          field: 'node_centrality_closeness',
          label: 'Closeness',
          centered: true,
          sortable: true
        },
        {
          field: 'node_centrality_betweenness',
          label: 'Betweenness',
          centered: true,
          sortable: true
        }
      ]
    }
  },
  props: {
    data: {
      type: Array,
    },
  },
  watch: {
    checkedNodes: function () {
      this.$emit("show-nodes", this.checkedNodes);
    },
  }
}

</script>
