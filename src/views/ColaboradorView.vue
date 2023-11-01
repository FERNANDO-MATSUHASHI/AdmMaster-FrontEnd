<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-user-add"></i>
        <div style="margin-left: 20px;" class="col">
          <h1>Colaboradores</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirColaborador()">Incluir Colaborador</button>
        </div>
      </div>
    </div>
    <hr>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Novo Colaborador</h1>
          <div class="col-md-6">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" required v-model="formData.nome"><br>
          </div>

          <div class="col-md-6">
            <label for="cpf" class="form-label">CPF:</label>
            <input type="text" class="form-control" id="cpf" name="cpf" required v-model="formData.cpf"><br>
          </div>

          <div class="col-md-6">
            <label for="data_nascimento" class="form-label">Data de Nascimento:</label>
            <input type="date" class="form-control" id="data_nascimento" name="data_nascimento" required v-model="formData_nascimento"><br>
          </div>

          <div class="col-md-6">
            <label for="cep" class="form-label">CEP:</label>
            <input type="text" class="form-control" id="cep" name="cep" required v-model="formData.cep"><br>
          </div>

          <div class="col-md-6">
            <label for="rua" class="form-label">Rua:</label>
            <input type="text" class="form-control" id="rua" name="rua" required v-model="formData.rua"><br>
          </div>

          <div class="col-md-6">
            <label for="numero" class="form-label">Número:</label>
            <input type="text" class="form-control" id="numero" name="numero" required v-model="formData.numero"><br>
          </div>

          <div class="col-md-6">
            <label for="cidade" class="form-label">Cidade:</label>
            <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formData.cidade"><br>
          </div>

          <div class="col-md-6">
            <label for="estado" class="form-label">Estado:</label>
            <input type="text" class="form-control" id="estado" name="estado" required v-model="formData.estado"><br>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required v-model="formData.email"><br>
          </div>

          <div class="col-md-6">
            <label for="senha" class="col-form-label">Senha</label>
            <input type="password" class="form-control" id="senha" required v-model="formData.senha">
          </div>

          <div class="col-md-6">
            <label for="ativo" class="form-label">Ativo:</label>
            <select id="ativo" class="form-select" name="ativo" required v-model="formData.ativo">
              <option :value=true>Sim</option>
              <option :value=false>Não</option>
            </select><br>
          </div>

          <div class="col-md-6">
            <label for="comissao" class="form-label">Comissão:</label>
            <input type="text" class="form-control" id="comissao" name="comissao" required v-model="formData.comissao"><br>
          </div>

          <div class="col-md-6">
            <label for="cargoId" class="form-label">Cargo:</label>
            <select id="inputState2" class="form-select" required v-model="formData.cargoId">
              <option v-for="cargo in cargos" :key="cargo.id" :value="cargo.id">{{ cargo.descricao }}</option>
            </select>
          </div>

          <div class="col-12">
            <br>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal" v-if="successModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Cadastro realizado com sucesso!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>

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
        :cpf="colabolador.cpf"
        :email="colabolador.email" 
        :data_nascimento_brasil="this.parseData(colabolador.data_nascimento)"
        :data_nascimento_original="colabolador.data_nascimento"
        :cep="colabolador.cep"
        :rua="colabolador.rua"
        :numero="colabolador.numero"
        :cidade="colabolador.cidade"
        :estado="colabolador.estado"
        :user_name="colabolador.user_name"
        :senha="colabolador.senha"
        :ativo="colabolador.ativo" 
        :comissao="colabolador.comissao" 
        :gerente-id="colabolador.gerenteId"
        :cargoId="colabolador.cargoId"
        :cargo_descricao="obterNomeDoCargo(colabolador.cargoId)"
        :listCargos="cargos" />
    </table>
  </main>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import getColaborador from '../components/colaborador/getColaborador.vue';

axios.interceptors.request.use((config) => {
    console.log('Dados a serem enviados:', config.data);
    return config;
});

export default {
  components: {
    axios,
    getColaborador,
  },
  data() {
    return {
      formData: {
        nome: '',
        cpf: '',
        email: '',
        data_nascimento: '',
        cep: '',
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        user_name: 'jao',
        senha: '',
        ativo: true,
        comissao: '',
        gerenteId: '1',
        cargoId: '',
      },
      showModal: false,
      successModal: false,
      formData_nascimento: '',
    };
  },
  setup() {
    const colaboradores = ref([]);
    const searchTerm = ref(null);
    const cargos = ref([]);

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

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Usuario', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        colaboradores.value = response.data;
        console.log('Dados retornados da API Colaborador', response.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseCargo = await axios.get('https://localhost:7255/api/Cargo');
        cargos.value = responseCargo.data;
        // console.log('Dados retornados da API Cargo', responseCargo.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      colaboradores,
      cargos,
      searchTerm,
      filteredColaboradores
    };
  },
  methods: {
    incluirColaborador() {
      this.showModal = true;
    },
    fecharModal() {
      this.showModal = false;
      this.successModal = false;
    },
    enviarFormulario() {
      this.formData.data_nascimento = new Date(this.formData_nascimento);

      axios.post('https://localhost:7255/api/Usuario', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.nome = '';
          this.formData.cpf = '';
          this.formData.email = '';
          this.formData.data_nascimento = '',
          this.formData.cep = '';
          this.formData.rua = '';
          this.formData.numero = '';
          this.formData.cidade = '';
          this.formData.estado = '';
          this.formData.user_name = '';
          this.formData.senha = '';
          this.formData.ativo = true;
          this.formData.comissao = '';
          this.formData.gerenteId = '';
          this.formData.cargoId = '';

          // Exibir o modal de sucesso
          this.showModal = false;
          this.successModal = true;
          // this.$router.push('/Colaborador');
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate();
      const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // Formatar a data como "DD/MM/YYYY"
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    },
    // Método para obter o nome do cargo com base no cargoId
    obterNomeDoCargo(idcargo) {
      const cargo = this.cargos.find(c => c.id === idcargo);
      return cargo ? cargo.descricao : 'Cargo Desconhecido';
  }
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
