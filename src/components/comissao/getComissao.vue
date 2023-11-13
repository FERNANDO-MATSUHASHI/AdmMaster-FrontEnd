<script setup>
const { comissoes, formData } = defineProps(['comissoes', 'formData']);

</script>

<template>
  <div class="input-group input-group-sm mb-3" style="margin-top: 2%;">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por QRU" />
  </div>
  <table class="tabela1 table table-hover">

    <tr>
      <th scope="col">Data</th>
      <th scope="col">QRU</th>
      <th scope="col">Colaborador</th>
      <th scope="col">Valor Bruto</th>
      <th scope="col">Valor Comissão</th>
    </tr>

    <tr v-for="comissao in comissoes.listaAuxiliar">
    <!-- <tr v-for="comissao in filteredComissao"> -->
      <td>{{ parseData(comissao.data) }}</td>
      <td>{{ comissao.atendimentoNome }}</td>
      <td>{{ comissao.usuarioNome }}</td>
      <td>R$ {{ comissao.valorAtendimento.toFixed(2) }}</td>
      <td>R$ {{ comissao.valorComissao.toFixed(2) }}</td>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>Porcentagem da Comissão: {{ comissoes.porcentagem }} %</th>
      <th>Valor Total Bruto: R$ {{ comissoes.total.toFixed(2) }}</th>
      <th>Valor Comissão: R$ {{ comissoes.totalComissao.toFixed(2) }}</th>
    </tr>
    <br>
    <br>
  </table>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';

export default {
  components: {
    axios,
  },
  data() {
    return {
    }
  },
  setup() {
    const searchTerm = ref(null);

    // Filtro
    const filteredComissao = computed(() => {
      if (!searchTerm.value) {
        console.log('Filtro-> ', comissoes.listaAuxiliar.value)
        return comissoes.listaAuxiliar.value;
      }
      const searchTermLowerCase = searchTerm.value;
      return comissoes.listaAuxiliar.filter(comissao => {
        const nomeLowerCase = comissao.atendimentoNome;
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    return {
      searchTerm,
      filteredComissao,
    }
  },
  methods: {
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate();
      const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // Formatar a data como "DD/MM/YYYY"
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    },
  }
}
</script>

<!-- <style>
.tabela {
  margin-left: 0%;
}
</style> -->