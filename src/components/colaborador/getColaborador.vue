<script setup>
const props = defineProps(["id", "nome", "email", "data_nascimento", "ativo", "comissao", "cargoId"]);

</script>

<template>
    <tbody>
        <tr>
            <th scope="row">{{ id }}</th>
            <td>{{ nome }}</td>
            <td>{{ email }}</td>
            <td>{{ data_nascimento }}</td>
            <td>{{ ativo ? 'Sim' : 'Não' }}</td>
            <td>{{ comissao }}</td>
            <td>{{ cargoId }}</td>
            <td>
                <!-- Ícone de editar -->
                <i class="fi-rr-edit" @click="editarColaborador(id)" style="margin-right: 15px;"></i>
                <!-- Ícone de excluir -->
                <i class="fi-rr-trash" @click="excluirColaborador(id)"></i>
            </td>
        </tr>
    </tbody>
</template>

<script>
export default {
  // ... seu código existente ...

  methods: {
    // Método para editar um colaborador
    editarColaborador(id) {
      // Lógica para editar o colaborador com o ID fornecido
      console.log('Editar colaborador com ID:', id);
    },
    // Método para excluir um colaborador
    excluirColaborador(id) {
      // Lógica para excluir o colaborador com o ID fornecido
      console.log('Excluir colaborador com ID:', id);
    }
  }
}
</script>