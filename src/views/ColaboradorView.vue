<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-user-add"></i>
        <div style="margin-left: 20px;" class="col">
          <h1>Colaboradores</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3">Incluir Colaborador</button>  
        </div>
      </div>
    </div>
    <hr>

    <div class="input-group input-group-sm mb-3">
      <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Nome " />
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nome</th>
          <th scope="col">E-Mail</th>
          <th scope="col">Data Nascimento</th>
          <th scope="col">Ativo</th>
          <th scope="col">Comissão</th>
          <th scope="col">Cargo</th>
        </tr>
      </thead>
      <getColaborador v-for="colabolador in filteredColaboradores" 
          :key="colabolador.id" 
          :id="colabolador.id"
          :nome="colabolador.nome" 
          :email="colabolador.email" 
          :data_nascimento="colabolador.data_nascimento"
          :ativo="colabolador.ativo" 
          :comissao="colabolador.comissao" 
          :cargoId="colabolador.cargoId" />
    </table>
  </main>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import getColaborador from '../components/colaborador/getColaborador.vue';

export default {
  components: {
    axios,
    getColaborador,
  },
  setup() {
    const colaboradores = ref([]);
    const searchTerm = ref(null);

    // Filtro
    const filteredColaboradores = computed(() => {
      if (!searchTerm.value) {
        return colaboradores.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return colaboradores.value.filter(colaborador => {
        const nomeLowerCase = colaborador.nome.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    const login = () => {
      axios.post('https://localhost:7255/api/Usuario/Login', this.formLogin, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        localStorage.setItem('token', response.data);
        this.formLogin.email = '';
        this.formLogin.senha = '';
        this.visivel = !this.visivel;
      })
      .catch(error => {
        console.error('Erro ao enviar formulário:', error);
        const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
        erroModal.show();
      });
    };

    const logout = () => {
      this.visivel = !this.visivel;
    };

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Usuario', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        colaboradores.value = response.data;
        console.log('Dados retornados da API', response.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      colaboradores,
      searchTerm,
      filteredColaboradores,
      login,
      logout,
    };
  },
};
</script>
