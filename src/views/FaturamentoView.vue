<script setup>
</script>

<template>
  <main class="faturamento">
  <div class="row">
    <div class="d-flex justify-content">
      <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-chart-histogram" ></i>
      <div style="margin-left: 20px;">
        <h1>Faturamento</h1>
      </div>
    </div>
  </div>
</main>
<table class="table table-hover">
      <thead>
        <!-- Faturamento :
        Mês do faturamento
        Valor do faturamento mensal
        Data inicial e data final do faturamento
      -->
        <tr>
          <th scope="col">#</th>
          <th scope="col">Mês</th>
          <th scope="col">Valor</th>
          <th scope="col"></th>
        </tr>
        <tr v-for="(atendimento,index) in atendimentos" v-bind:key="index">
          <th scope="col">#</th>
          <th scope="col">{{ this.parseData(atendimento.data) }}</th>
          <th scope="col">R$ {{ atendimento.valor_total }}</th>
        </tr>
      </thead>
      <!-- <li v-for="(atendimento,index) in atendimentos" v-bind:key="index">
      {{ atendimento.data }}
      </li> -->
      </table>

</template>
Copy code
<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: "Faturamento",
  components: {
    axios
  },
  setup() {
    const atendimentos = ref([]);

    const parseData = (dataString) => {
      const data = new Date(dataString);
      const dataFormatada = new Date(data.getFullYear(), data.getMonth(), data.getDate());
      // const dia = dataFormatada.getUTCDate().toString().padStart(2, '0');
      const mes = traduzirMes(dataFormatada.getUTCMonth() + 1).toString().padStart(2, '0');
      // const ano = dataFormatada.getUTCFullYear();
    
      return `${mes}`;
    };
    const MesesEnum = {
  JANEIRO: 1,
  FEVEREIRO: 2,
  MARCO: 3,
  ABRIL: 4,
  MAIO: 5,
  JUNHO: 6,
  JULHO: 7,
  AGOSTO: 8,
  SETEMBRO: 9,
  OUTUBRO: 10,
  NOVEMBRO: 11,
  DEZEMBRO: 12,
};
const calcularFaturamentoMensal = () => {
      const faturamentoMensal = {};
      for (const atendimento of atendimentos.value) {
        const mes = parseData(atendimento.data);
        if (faturamentoMensal[mes]) {
          faturamentoMensal[mes].total += atendimento.valor_total;
        } else {
          faturamentoMensal[mes] = { mes, total: atendimento.valor_total };
        }
      }
      return Object.values(faturamentoMensal);
    };




// Exemplo de função para traduzir o número do mês em uma string
function traduzirMes(numeroMes) {
  for (const mes in MesesEnum) {
    if (MesesEnum[mes] === numeroMes) {
      return mes;
    }
  }
  return 'Mês inválido';
}


    const faturamentoMensal = ref([]);
    onMounted(() => {
      faturamentoMensal.value = calcularFaturamentoMensal();
      console.log('Faturamento mensal',faturamentoMensal)
    });
    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Atendimento', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        atendimentos.value = response.data;
        console.log('Dados retornados da API Atendimentos', response.data);
        console.log('Atendimento - ', atendimentos.value);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      atendimentos,
      parseData
    };
    
  }
}


</script>