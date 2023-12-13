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
    <div class="input-group input-group-sm mb-3">
      <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Mês" />
    </div>
    <faturamento-table :filteredFaturamento="filteredFaturamento" />
  </main>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import FaturamentoTable from '../components/faturamento/faturamentoTable.vue';

export default {
  name: "Faturamento",
  components: {
    FaturamentoTable,
    axios

  },
  setup() {
    const searchTerm = ref(null);
    const atendimentos = ref([]);
    const despesas = ref([]);
    const abastecimentos = ref([]);
    const manutencoes = ref([]);
    const faturamentoMensal = ref([]);
    const despesaMensal = ref([]);
    const abastecimentoMensal = ref([]);
    const manutencaoMensal = ref([]);
    const dadosCombinados = ref([]);

    const parseData = (dataString) => {
      const data = new Date(dataString);
      const dataFormatada = new Date(data.getFullYear(), data.getMonth(), data.getDate());
      const mes = traduzirMes(dataFormatada.getUTCMonth() + 1).toString().padStart(2, '0');
      return `${mes}`;
    };

    const parseDataAno = (dataString) => {
      const data = new Date(dataString);
      const dataFormatada = new Date(data.getFullYear(), data.getMonth(), data.getDate());
      const ano = dataFormatada.getFullYear();
      return `${ano}`;
    };

    // Filtro por mês
    const filteredFaturamento = computed(() => {
      if (!searchTerm.value) {
        return dadosCombinados.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dadosCombinados.value.filter(faturamento => {
        const nomeLowerCase = faturamento.mes.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    const calcularFaturamentoMensal = () => {
      const faturamentoMensalObj = {};
      for (const atendimento of atendimentos.value) {
        const mes = parseData(atendimento.data);
        const ano = parseDataAno(atendimento.data);
        // // console.log('Ano-> ', ano);
        // if (faturamentoMensalObj[mes]) {
        //   faturamentoMensalObj[mes] += atendimento.valor_total;
        // } else {
        //   faturamentoMensalObj[mes] = atendimento.valor_total;
        // }
        const chave = `${ano}-${mes}`; // Usar uma chave única para cada mês/ano

        if (faturamentoMensalObj[chave]) {
          faturamentoMensalObj[chave].total += atendimento.valor_total;
        } else {
          faturamentoMensalObj[chave] = { mes, ano, total: atendimento.valor_total };
        }
      }
      // Converter o objeto faturamentoMensalObj em um array de objetos
      // const faturamentoMensalArray = Object.entries(faturamentoMensalObj).map(([mes, ano, total]) => ({ mes, ano, total }));
      const faturamentoMensalArray = Object.values(faturamentoMensalObj);
      faturamentoMensal.value = faturamentoMensalArray;
      console.log('Faturamento-> ', faturamentoMensalArray);
    };
    const calcularDespesaMensal = () => {
      const despesaMensalObj = {};

      for (const despesa of despesas.value) {
        const atendimentoId = despesa.atendimentoId;
        const atendimentoCorrespondente = atendimentos.value.find(atendimento => atendimento.id === atendimentoId);
        if (atendimentoCorrespondente) {
          const mes = parseData(atendimentoCorrespondente.data);
          if (despesaMensalObj[mes]) {
            despesaMensalObj[mes].total += despesa.valor;
          } else {
            despesaMensalObj[mes] = {
              mes: mes,
              total: despesa.valor
            };
          }
        }
      }

      // Converter o objeto despesaMensalObj em um array de objetos
      const despesaMensalArray = Object.values(despesaMensalObj);

      despesaMensal.value = despesaMensalArray;
    };
    const calcularAbastecimentoMensal = () => {
      const abastecimentoMensalObj = {};
      for (const abastecimento of abastecimentos.value) {
        const mes = parseData(abastecimento.data_abastecimento);
        if (abastecimentoMensalObj[mes]) {
          abastecimentoMensalObj[mes].total += abastecimento.valor_total_abastecimento;
        } else {
          abastecimentoMensalObj[mes] = {
            mes: mes,
            total: abastecimento.valor_total_abastecimento
          };
        };
      };

      // Converter o objeto despesaMensalObj em um array de objetos
      const abastecimentoMensalArray = Object.values(abastecimentoMensalObj);
      abastecimentoMensal.value = abastecimentoMensalArray;
      // console.log('Valor Abastecimento-> ', abastecimentoMensalArray);
    };
    const calcularManutencaoMensal = () => {
      const manutencaoMensalObj = {};
      for (const manutencao of manutencoes.value) {
        const mes = parseData(manutencao.data_manutencao);
        if (manutencaoMensalObj[mes]) {
          manutencaoMensalObj[mes].total += manutencao.valor_total_manutencao;
        } else {
          manutencaoMensalObj[mes] = {
            mes: mes,
            total: abastecimento.valor_total_manutencao
          };
        };
      };

      // Converter o objeto manutencaoMensalObj em um array de objetos
      const manutencaoMensalArray = Object.values(manutencaoMensalObj);
      manutencaoMensal.value = manutencaoMensalArray;
      // console.log('Manutencao-> ', manutencaoMensalArray);
    };
    const combinarFaturamentoDespesa = () => {
      // Crie um objeto para armazenar os dados combinados
      const dadosCombinados = [];
      for (const faturamentoItem of faturamentoMensal.value) {
        const mes = faturamentoItem.mes;
        const ano = faturamentoItem.ano;
        const valorFaturamento = faturamentoItem.total;

        // Encontre a despesa correspondente com base no mês
        const despesaCorrespondente = despesaMensal.value.find(despesa => despesa.mes === mes);

        // Encontre o abastecimento correspondente com base no mês
        const abastecimentoCorrespondente = abastecimentoMensal.value.find(abastecimento => abastecimento.mes === mes);

        // Encontre o manutencao correspondente com base no mês
        const manutencaoCorrespondente = manutencaoMensal.value.find(manutencao => manutencao.mes === mes);

        if (despesaCorrespondente && abastecimentoCorrespondente && manutencaoCorrespondente) {
          const valorDespesa = despesaCorrespondente.total;
          const valorAbastecimento = abastecimentoCorrespondente.total;
          const valorManutencao = manutencaoCorrespondente.total;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
          mes,
          ano,
          valorFaturamento,
          valorDespesa,
          valorAbastecimento,
          valorManutencao,
          valorLiquido
          })
        } else if (!despesaCorrespondente && abastecimentoCorrespondente && manutencaoCorrespondente){
          const valorDespesa = 0;
          const valorAbastecimento = abastecimentoCorrespondente.total;
          const valorManutencao = manutencaoCorrespondente.total;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
          mes,
          ano,
          valorFaturamento,
          valorDespesa,
          valorAbastecimento,
          valorManutencao,
          valorLiquido
          })
        } else if (!despesaCorrespondente && !abastecimentoCorrespondente && manutencaoCorrespondente) {
          const valorDespesa = 0;
          const valorAbastecimento = 0;
          const valorManutencao = manutencaoCorrespondente.total;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        } else if (!despesaCorrespondente && !abastecimentoCorrespondente && !manutencaoCorrespondente){
          const valorDespesa = 0;
          const valorAbastecimento = 0;
          const valorManutencao = 0;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        }else if (despesaCorrespondente && !abastecimentoCorrespondente && !manutencaoCorrespondente) {
          const valorDespesa = despesaCorrespondente.total;
          const valorAbastecimento = 0;
          const valorManutencao = 0;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        } else if (despesaCorrespondente && abastecimentoCorrespondente && !manutencaoCorrespondente){
          const valorDespesa = despesaCorrespondente.total;
          const valorAbastecimento = abastecimentoCorrespondente.total;
          const valorManutencao = 0;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        } else if (despesaCorrespondente && !abastecimentoCorrespondente && manutencaoCorrespondente){
          const valorDespesa = despesaCorrespondente.total;
          const valorAbastecimento = 0;
          const valorManutencao = manutencaoCorrespondente.total;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        } else {
          const valorDespesa = 0;
          const valorAbastecimento = abastecimentoCorrespondente.total;
          const valorManutencao = 0;
          const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
          dadosCombinados.push({
            mes,
            ano,
            valorFaturamento,
            valorDespesa,
            valorAbastecimento,
            valorManutencao,
            valorLiquido
          })
        }

        // if (despesaCorrespondente) {
        //   const valorDespesa = despesaCorrespondente.total;
        //   const valorAbastecimento = abastecimentoCorrespondente.total;
        //   const valorManutencao = manutencaoCorrespondente.total;
        //   const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;

        //   // Adicione os dados combinados ao objeto
        //   dadosCombinados.push({
        //     mes,
        //     valorFaturamento,
        //     valorDespesa,
        //     valorAbastecimento,
        //     valorManutencao,
        //     valorLiquido
        //   });
        // } else {
        //   const valorDespesa = 0;
        //   const valorAbastecimento = abastecimentoCorrespondente.total;
        //   const valorManutencao = manutencaoCorrespondente.total;
        //   const valorLiquido = valorFaturamento - valorDespesa - valorAbastecimento - valorManutencao;
        //   // Adicione os dados combinados ao objeto
        //   dadosCombinados.push({
        //     mes,
        //     valorFaturamento,
        //     valorDespesa,
        //     valorAbastecimento,
        //     valorManutencao,
        //     valorLiquido
        //   });
        // };
      }
      // console.log('Dados Combinados-> ', dadosCombinados);
      return dadosCombinados;
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
    const ordenarDadosPorMes = () => {
      // Ordene o array dadosCombinados com base no mês
      dadosCombinados.value.sort((a, b) => {
        const mesA = MesesEnum[a.mes.toUpperCase()];
        const mesB = MesesEnum[b.mes.toUpperCase()];
        return mesA - mesB;
      });
    };
    onMounted(async () => {
      try {
        // Atendimento
        const response = await axios.get('https://localhost:7255/api/Atendimento/GerenteTodos/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        atendimentos.value = response.data;
        calcularFaturamentoMensal();

        // Despesas Atendimento
        const responseDespesas = await axios.get('https://localhost:7255/api/DespesasAtendimento', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        despesas.value = responseDespesas.data;
        calcularDespesaMensal();

        // Abastecimento
        const responseAbastecimentos = await axios.get('https://localhost:7255/api/Abastecimento/Abastecimento/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        abastecimentos.value = responseAbastecimentos.data;
        // console.log('Abastecimentos-> ', responseAbastecimentos.data);
        calcularAbastecimentoMensal();

        // Manutenção
        const responseManutencoes = await axios.get('https://localhost:7255/api/Manutencao/Manutencao/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        manutencoes.value = responseManutencoes.data;
        calcularManutencaoMensal();

        dadosCombinados.value = combinarFaturamentoDespesa();

        // Ordenar os dados por mês após combinar faturamento e despesa
        ordenarDadosPorMes();
      } catch (error) {
        console.error('Erro na solicitação:', error);

      }
    });
    return {
      atendimentos,
      faturamentoMensal,
      despesas,
      abastecimentos,
      manutencoes,
      despesaMensal,
      abastecimentoMensal,
      manutencaoMensal,
      dadosCombinados,
      searchTerm,
      filteredFaturamento,
      parseData,
    };

  }
}
</script>