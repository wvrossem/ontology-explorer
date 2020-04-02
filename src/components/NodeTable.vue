<template>
  <b-table 
    :paginated="true"
    :per-page="10"
    :pagination-simple="true"
    :data="data" 
    :columns="columns">
  </b-table>
</template>

<script>
    export default {
      data() {
        return {
          columns: [{
              field: 'id',
              label: 'ID',
              width: '40',
            },
            {
              field: 'node_name',
              label: 'Name',
              searchable: true,
            },
            {
              field: 'node_type',
              label: 'Type',
              centered: true
            },
          ]
        }
      },
      props: {
        data: {
          type: Array,
        },
      },
    }
</script>
