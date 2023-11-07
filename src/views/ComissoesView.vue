<template>
  <main class="gerarComissoes">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-usd-circle"></i>
        <div style="margin-left: 20px;">
          <h1>Comissões</h1>
          <div class="linha-horizontal"></div>
        </div>
      </div>
    </div><br>

    <div class="col-11 d-flex justify-content-end align-items-center">
      <div class="col-md-3">
        <label for="data_nascimento" class="form-label">Data Inicial:</label>
        <input type="date" class="form-control" id="data" name="data" required v-model="formData_data"><br>
      </div>
      <div class="col-md-3">
        <label for="data_nascimento" class="form-label">Data Inicial:</label>
        <input type="date" class="form-control" id="data" name="data" required v-model="formData_data"><br>
      </div>
      <div class="col-md-4">
        <label for="usuarioId" class="form-label">Colaborador:</label>
        <select id="inputState2" class="form-select" required v-model="formData.usuarioId">
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="incluirAtendimento()">Pesquisar</button>
    </div>




  </main>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

export default {
  components: {
    axios,
  },
  data() {
    return {
      formData: {
        usuarioId: '',
      }
    }
  },
  setup () {
    const usuarios = ref([]);

    onMounted(async () => {
      try {
        const responseUsuarios = await axios.get('https://localhost:7255/api/Usuario', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        usuarios.value = responseUsuarios.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      usuarios,
    }
  }
}
</script>

<style>
.linha-horizontal {
  border-top: 2px solid #8a888881;
  width: 60vw;
  margin-top: 10px;
}</style>