<template>
  <div class="person">
    <p>Фамилия: <input type="text" v-model="person.surname" /></p>
    <p>Имя: <input type="text" v-model="person.name" /></p>
    <p>Отчество: <input type="text" v-model="person.patronymic" /></p>
    <p>Список выданных материальных ценностей:</p>
    <table style="width: 100%">
      <tr>
        <th>№ п/п</th>
        <th>Название</th>
        <th>Стоимость</th>
      </tr>

      <tr
        v-for="(material, index) in materials"
        :key="material.id"
        @click="
          () => {
            hide();
            selectedMaterial = material;
          }
        "
        @contextmenu="
          (e) => {
            e.preventDefault();
            selectedMaterial = material;
            show(e);
          }
        "
        :class="
          selectedMaterial.id === material.id &&
          selectedMaterial.id &&
          'table__row-active'
        "
        class="table-row"
      >
        <td>{{ index + 1 }}</td>
        <td>
          <input
            class="change__input"
            placeholder="Введите название"
            type="text"
            v-model="material.name"
          />
        </td>
        <td>
          <input
            class="change__input"
            placeholder="Введите цену"
            type="number"
            v-model="material.cost"
          />
        </td>
      </tr>

      <tr>
        <td colspan="2">Итог</td>
        <td>{{ totalSum }}</td>
      </tr>
    </table>
    <div class="change__btns">
      <button @click="saveHandler">Сохранить</button>
      <button @click="cancel">Отмена</button>
      <button @click="materials.push({})">+</button>
    </div>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="showModal = true">Удалить</v-contextmenu-item>
    </v-contextmenu>

    <modal v-if="showModal" @close="showModal = false" @delete="deleteHandler">
      <template v-slot:header>
        <h3>Удлаение</h3>
      </template>
      <template v-slot:body>
        <h3>Вы уверенны что хотите удалить материальную ценность?</h3>
      </template>
    </modal>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import router from "../router/index";
import {
  loadOnePerson,
  loadMaterials,
  updatePerson,
  updateMaterials,
  createMaterial,
  deleteMaterial,
} from "../api";
import { directive, Contextmenu, ContextmenuItem } from "v-contextmenu";
import "v-contextmenu/dist/themes/default.css";
import modal from "../components/Modal";

export default {
  name: "Person",
  data: function () {
    return {
      person: {},
      materials: [],
      selectedMaterial: {},
      cost: 0,
      showModal: false,
    };
  },

  directives: { contextmenu: directive },

  components: {
    [Contextmenu.name]: Contextmenu,
    [ContextmenuItem.name]: ContextmenuItem,
    modal,
  },

  computed: {
    totalSum() {
      let totalCost = 0;
      this.materials.forEach((material) => {
        const cost = +material.cost || 0;
        totalCost += cost;
      });
      return totalCost;
    },
  },

  methods: {
    cancel: function () {
      router.push({ name: "Home" });
    },

    deleteHandler: function () {
      this.materials.forEach(async (element, index) => {
        if (
          element &&
          this.selectedMaterial &&
          element.id === this.selectedMaterial.id
        ) {
          await deleteMaterial(this.selectedMaterial.id);
          this.materials.splice(index, 1);
        }
      });
    },

    saveHandler: async function () {
      this.materials.forEach(async (material) => {
        if (material.id) {
          await updateMaterials(material);
        } else {
          await createMaterial({ ...material, personId: this.person.id });
        }
      });
      await updatePerson(this.person);
      alert("Изменения были успешно сохранены");
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

  async created() {
    const route = useRoute();
    const data = await loadOnePerson(route.params.id);
    this.person = data.person;
    const materialsData = await loadMaterials(route.params.id);
    this.materials = materialsData.materials;
  },
};
</script>
