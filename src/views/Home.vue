<template>
  <div v-if="isDataLoaded" class="offers-page container mx-auto p-4">
    <h2>Properties</h2>
    <p>
      <input id="propertiesCheckbox" type="checkbox" class="mr-3 cursor-pointer" v-model="checkedApartments">
      <label for="propertiesCheckbox" class="cursor-pointer">View Apartments Only</label>
    </p>
    <div
      class="my-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        :class="{ chosen: chosenProperty === property.id }"
        class="shadow-md bg-white cursor-pointer"
        @click="filterChooseProperty(property)"
        @blur="initOffers"
        v-for="property in filteredProperties" :key="property.id">
        <table class="w-full">
          <TableProperty :item="property"/>
        </table>
      </div>
    </div>
    <h2>Offers</h2>
    <div class="flex justify-center items-center">
      <p class="mr-5 flex items-center">
        <input id="offersCheckbox" type="checkbox" class="mr-3 cursor-pointer" v-model="checkedPrices">
        <label for="offersCheckbox" class="cursor-pointer whitespace-nowrap">View over 400k+</label>
      </p>
      <p>
        <span>Order by:</span>
        <select v-model="selectedOrder">
          <option
            v-for="(order, index) in orderBy"
            :key="index"
            :disabled="order.sortTitle === 'all'"
            :value="order">{{ order.title }}
          </option>
        </select>
      </p>
    </div>
    <div
      class="my-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        class="shadow-md bg-white"
        v-for="offer in filteredOffers" :key="offer.id">
        <table class="w-full">
          <thead class="bg-purple-300">
          <tr>
            <th colspan="2">$ {{ offer.price }}</th>
          </tr>
          </thead>
          <TableProperty :item="offer.property"/>
          <tfoot class="bg-purple-300">
          <tr class="bg-purple-300">
            <td colspan="2">by {{ offer.offered_by }}</td>
          </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import axios from 'axios';
import TableProperty from '@/components/Property.vue'
import { OrderBy, Property, Offer } from '@/interfaces'

const orderBy: Array<OrderBy> = [
  { sortTitle: 'all', title: 'Choose' },
  { sortTitle: 'price', title: 'Price' },
  { sortTitle: 'bedrooms', title: 'Rooms' },
  { sortTitle: 'area', title: 'Area' }
]

export default defineComponent({
  name: 'Home',
  components: {
    TableProperty
  },
  setup() {
    const properties = ref([]);
    const offers = ref([]);
    const filteredProperties = ref([]);
    const filteredOffers = ref([]);
    const chosenProperty = ref(0)

    const checkedApartments = ref(false);
    const checkedPrices = ref(false);
    const selectedOrder = ref(orderBy[0]);
    const isDataLoaded = ref(true);

    const initProperties = (): void => {
      filteredProperties.value = Object.assign(properties.value)
    }

    const initOffers = (): void => {
      filteredOffers.value = Object.assign(offers.value)
    }

    (async (): Promise<void> => {
      await axios.all([
        axios.get('/data/properties.json'),
        axios.get('/data/offers.json')
      ])
        .then(response => {
          properties.value = response[0].data;
          offers.value = response[1].data;
          isDataLoaded.value = true
        });
      initProperties()
      initOffers()
    })();

    watch(checkedApartments, (checked: boolean) => {
      filteredProperties.value = filterApartments(checked)
    })
    watch(checkedPrices, () => {
      filter();
      sort();
    })
    watch(selectedOrder, () => {
      filter();
      sort();
    })

    const filterApartments = (checked: boolean) => checked ? properties.value.filter((property: Property) => property.kind === 'Apartment') : properties.value;

    const filterPropertiesById = (propertyId: number) => offers.value.filter((offer: Offer) => offer.property.id === propertyId);

    const filterChooseProperty = (property: Property): void => {
      chosenProperty.value = property.id;
      filteredOffers.value = filterPropertiesById(property.id);
      if (checkedPrices.value) {
        filteredOffers.value = filterByPrice(filteredOffers);
      }
    }
    const filterByPrice = (items: any) => items.value.filter((offer: Offer) => offer.price > 400000);

    const filter = (): void => {
      let filteredData: Array<Offer> = offers.value;
      if (chosenProperty.value > 0) {
        filteredData = filterPropertiesById(chosenProperty.value);
      }
      filteredOffers.value = checkedPrices.value ? filterByPrice(filteredOffers) : filteredData;
    }

    const sort = (): void => {
      filteredOffers.value = filteredOffers.value.sort((a: Offer, b: Offer) => {
        if (selectedOrder.value.sortTitle === 'price') {
          return a.price - b.price;
        } else if (selectedOrder.value.sortTitle === 'area') {
          return a.property.area - b.property.area;
        } else {
          return a.property.bedrooms - b.property.bedrooms;
        }
      })
    }

    return {
      properties,
      offers,
      isDataLoaded,
      orderBy,
      checkedApartments,
      filteredProperties,
      filteredOffers,
      checkedPrices,
      filterChooseProperty,
      selectedOrder,
      initProperties,
      initOffers,
      sort,
      chosenProperty
    }
  },
});
</script>

<style lang="scss">
.offers-page {
  h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
  }

  table {
    tbody {
      tr {
        td {
          text-align: left;
        }

        td:first-child {
          font-weight: bold;
          padding-left: 5px;
          width: 47%;
        }
      }
    }

    tfoot {
      td {
        text-align: right;
        padding-right: 10px;
      }
    }
  }

  .chosen {
    background: rgba(196, 181, 253, 0.5);
  }
}
</style>
