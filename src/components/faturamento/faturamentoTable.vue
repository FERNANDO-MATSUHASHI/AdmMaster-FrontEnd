<template>
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
    </thead>
    <tbody>
        <tr v-for="(dados, index) in filteredFaturamento" :key="index">
        <td scope="col">{{ index + 1 }}</td>
        
<td scope="col">{{ dados.mes }}</td>
        <td scope="col">R$ {{ dados.valorFaturamento.toFixed(2) }}</td>
        <td scope="col">R$ {{ dados.valorDespesa.toFixed(2) }}</td>
        <td scope="col">R$ {{ dados.valorLiquido.toFixed(2) }}</td>
      </tr>
    </tbody>
  </table>
        
</template>
<script>
export default {
  props: {
    filteredFaturamento: Array
  }
}
</script>