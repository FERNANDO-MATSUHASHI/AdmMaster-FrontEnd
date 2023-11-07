<template>
  <main class="faturamento">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-chart-histogram"></i>
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
        <th scope="col">Valor bruto</th>
        <th scope="col">Despesa</th>
        <th scope="col">Valor líquido</th>

      </tr>
      <tr v-for="(faturamento, index) in faturamentoMensal" v-bind:key="index">
        <th scope="col">#</th>
        <th scope="col">{{ faturamento.mes }}</th>
        <th scope="col">R$ {{ faturamento.total }}</th>
      </tr>
    </thead>

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
    const despesas = ref([]);
    const faturamentoMensal = ref([]);
    const parseData = (dataString) => {
      const data = new Date(dataString);
      const dataFormatada = new Date(data.getFullYear(), data.getMonth(), data.getDate());
      // const dia = dataFormatada.getUTCDate().toString().padStart(2, '0');
      const mes = traduzirMes(dataFormatada.getUTCMonth() + 1).toString().padStart(2, '0');
      // const ano = dataFormatada.getUTCFullYear();

      return `${mes}`;
    };

    const calcularFaturamentoMensal = () => {
      const faturamentoMensalObj = {};

      for (const atendimento of atendimentos.value) {
        const mes = parseData(atendimento.data);

        if (faturamentoMensalObj[mes]) {
          faturamentoMensalObj[mes] += atendimento.valor_total;
        } else {
          faturamentoMensalObj[mes] = atendimento.valor_total;
        }
      }

      // Converter o objeto faturamentoMensalObj em um array de objetos
      const faturamentoMensalArray = Object.entries(faturamentoMensalObj).map(([mes, total]) => ({ mes, total }));

      faturamentoMensal.value = faturamentoMensalArray;
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

    // Exemplo de função para traduzir o número do mês em uma string
    function traduzirMes(numeroMes) {
      for (const mes in MesesEnum) {
        if (MesesEnum[mes] === numeroMes) {
          return mes;
        }
      }
      return 'Mês inválido';
    }
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
        calcularFaturamentoMensal();
        console.log('Faturamento mensal', faturamentoMensal.value)
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
      try {
        const response = await axios.get('https://localhost:7255/api/DespesasAtendimento', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        despesas.value = response.data;
        console.log('Dados retornados da API Despesas atendimentos', response.data);
        console.log('Despesas atendimentos', despesas.value)
      } catch (error) {

      }
    });


    return {
      atendimentos,
      faturamentoMensal,
      parseData
    };

  }
}


</script>