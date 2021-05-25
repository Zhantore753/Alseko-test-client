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
        @click="
          () => {
            hide();
            selectedPerson = person;
          }
        "
        @dblclick="personDetail(selectedPerson.id)"
        :class="selectedPerson.id === person.id && 'table__row-active'"
        class="table-row"
        @contextmenu.prevent="
          (e) => {
            selectedPerson = person;
            show(e);
          }
        "
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
    <button @click="personDetail('create')" style="margin-top: 10px">
      Добваить сотрудника
    </button>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="showModal = true">Удалить</v-contextmenu-item>
    </v-contextmenu>
    <modal v-if="showModal" @close="showModal = false" @delete="deleteHandler">
      <template v-slot:header>
        <h3>Удлаение</h3>
      </template>
      <template v-slot:body>
        <h3>
          Вы уверенны что хотите удалить сотрудника и все его материальные
          ценности?
        </h3>
      </template>
    </modal>
  </div>
</template>

<script>
import {
  loadPersons,
  loadMaterials,
  deletePerson,
  deleteMaterialByPersonId,
} from "../api";
import router from "../router/index";
import { directive, Contextmenu, ContextmenuItem } from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
import modal from "../components/Modal";

export default {
  name: "Home",
  data: function () {
    return {
      persons: [],
      currentPage: 1,
      pages: 1,
      sort: "",
      direction: "",
      selectedPerson: {},
      showModal: false,
    };
  },

  directives: { contextmenu: directive },

  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    modal,
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

    deleteHandler: function () {
      this.persons.forEach(async (element, index) => {
        if (
          element &&
          this.selectedPerson &&
          element.id === this.selectedPerson.id
        ) {
          await deleteMaterialByPersonId(this.selectedPerson.id);
          await deletePerson(this.selectedPerson.id);
          this.persons.splice(index, 1);
          this.setPersons();
        }
      });
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

    personDetail: function (id) {
      router.push({ name: "Person", params: { id } });
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

    show(e) {
      this.$refs.contextmenu.show({
        top: e.clientY,
        left: e.clientX,
      });
    },

    hide() {
      this.$refs.contextmenu.hide();
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
  },

  created() {
    this.setPersons();
  },
};
</script>
