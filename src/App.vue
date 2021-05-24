<template>
  <div class="container">
    <h1>Список сотрудников</h1>
    <button
      @click="
        page = 1;
        sort = '';
        direction = '';
      "
      style="margin-bottom: 10px"
    >
      Сброс сортировки
    </button>
    <table style="width: 80%">
      <tr>
        <th :class="arrowClassBy('fullName')" @click="sortBy('fullName')">
          ФИО
        </th>
        <th :class="arrowClassBy('count')" @click="sortBy('count')">Кол-во</th>
        <th :class="arrowClassBy('cost')" @click="sortBy('cost')">
          Общая стоимость
        </th>
      </tr>

      <tr
        v-for="person in persons"
        :key="person.id"
        @click="selectedPerson = person"
        class="table-row"
      >
        <td>{{ `${person.surname} ${person.name} ${person.patronymic}` }}</td>
        <td>{{ person.count }}</td>
        <td>{{ person.cost }}</td>
      </tr>
    </table>
    <div class="pagination">
      <button
        @click="currentPage = page"
        class="pagination__btn"
        v-for="page in pages"
        :key="page"
        :class="currentPage === page && 'pagination__btn-active'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import { loadPersons, loadMaterials } from "./api";

// const router = new VueRouter({
//   routes // short for `routes: routes`
// });

export default {
  name: "App",

  // router,

  data: function () {
    return {
      persons: [],
      currentPage: 1,
      pages: 1,
      sort: "",
      direction: "",
      selectedPerson: {},
    };
  },

  methods: {
    arrowClassBy: function (by) {
      return (
        this.sort === by &&
        (this.direction === "DESC"
          ? "table__head-active-desc"
          : "table__head-active-asc")
      );
    },

    sortBy: function (by) {
      if (this.sort !== by) {
        this.direction = "ASC";
        return (this.sort = by);
      }
      if (this.direction === "ASC") {
        return (this.direction = "DESC");
      }
      return (this.direction = "ASC");
    },

    setPersons: async function () {
      const data = await loadPersons(
        this.currentPage,
        this.sort,
        this.direction
      );
      this.persons = data.persons;
      this.pages = data.pages;
    },
  },

  watch: {
    persons: function () {
      this.persons.forEach(async (person) => {
        const data = await loadMaterials(person.id);
        let cost = 0;
        data.materials.forEach((material) => {
          cost += material.cost;
        });
        person.count = data.materials.length;
        person.cost = cost;
      });
    },

    sort: function () {
      this.setPersons();
    },
    direction: function () {
      this.setPersons();
    },
    currentPage: function () {
      this.setPersons();
    },

    selectedPerson: function () {
      console.log(this.selectedPerson);
    },
  },

  async created() {
    this.setPersons();
  },
};
</script>

<style src="./app.css"></style>
