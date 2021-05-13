<template>
  <tbody>
    <tr>
      <td>Property Type</td><td> {{ item.kind }}</td>
    </tr>
    <tr>
      <td>Location</td><td>{{ item.location }}</td>
    </tr>
    <tr>
      <td>Bedrooms</td><td>{{ item.bedrooms }}</td>
    </tr>
    <tr>
      <td>Area</td><td>{{ item.area }} m<sup><small>2</small></sup></td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Property } from '@/interfaces'

export default defineComponent({
  name: "TableProperty",
  props: {
    item: {
      type: Object as PropType<Property>,
      required: true
    }
  }
})
</script>

<style scoped>

</style>