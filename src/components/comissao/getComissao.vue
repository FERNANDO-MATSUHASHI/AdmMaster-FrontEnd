<script setup>
const props = defineProps(["data", "atendimentoNome", "usuarioNome", "valorAtendimento", "valorComissao", "comissoes"]);

</script>

<template>
    <tr>
      <td>{{ parseData(data) }}</td>
      <td>{{ atendimentoNome }}</td>
      <td>{{ usuarioNome }}</td>
      <td>R$ {{ valorAtendimento.toFixed(2) }}</td>
      <td>R$ {{ valorComissao.toFixed(2) }}</td>
    </tr>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  setup() {
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