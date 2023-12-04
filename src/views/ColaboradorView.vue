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

    <getColaborador ref="componentGetColaborador"></getColaborador>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Novo Colaborador</h1>
          
          <div class="col-md-6">
            <label for="nome" class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome" name="nome" required v-model="formData.nome" placeholder="Ex... João Silva"><br>
          </div>

          <div class="col-md-6">
            <label for="cpf" class="form-label">CPF:</label>
            <input type="text" class="form-control" id="cpf" name="cpf" required @input="formatarCPF" v-model="formData.cpf" placeholder="Ex... 123.456.789-00"><br>
          </div>
          
          <div class="col-md-2">
            <label for="telefone" class="form-label">telefone:</label>
            <input type="text" class="form-control" id="telefone" name="telefone" required @input="formatarTelefone" v-model="formData.telefone" placeholder="Ex... (14)99989-1020"><br>
          </div>

          <div class="col-md-2">
            <label for="data_nascimento" class="form-label">Data de Nascimento:</label>
            <input type="date" class="form-control" id="data_nascimento" name="data_nascimento" required v-model="formData_nascimento"><br>
          </div>

          <div class="col-md-2">
            <label for="cep" class="form-label">CEP:</label>
            <input type="text" class="form-control" id="cep" name="cep" required v-model="formData.cep" placeholder="Ex... 17506000"><br>
          </div>

          <div class="col-2">
            <br>
            <button type="button" class="btn btn-primary mr-3" @click="pesquisarCEP">Pesquisar</button>
          </div>

          <div class="col-md-6">
            <label for="rua" class="form-label">Rua:</label>
            <input type="text" class="form-control" id="rua" name="rua" required v-model="formData.rua" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-6">
            <label for="numero" class="form-label">Número:</label>
            <input type="text" class="form-control" id="numero" name="numero" required v-model="formData.numero" placeholder="Ex... 100" ref="numero"><br>
          </div>

          <div class="col-md-6">
            <label for="cidade" class="form-label">Cidade:</label>
            <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formData.cidade" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-6">
            <label for="estado" class="form-label">Estado:</label>
            <input type="text" class="form-control" id="estado" name="estado" required v-model="formData.estado" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-6">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required v-model="formData.email"  placeholder="Ex... teste@teste.com"><br>
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
            <label for="comissao" class="form-label">Comissão %:</label>
            <input type="text" class="form-control" id="comissao" name="comissao" required v-model="formData.comissao" placeholder="Ex... 20"><br>
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

    <div class="modal" v-if="erroModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Erro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModalErro()"></button>
          </div>
          <div class="modal-body">
            CEP inválido!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModalErro()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </main>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import getColaborador from '../components/colaborador/getColaborador.vue';

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
        telefone: '',
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
        gerenteId: '',
        cargoId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
      formData_nascimento: '',
    };
  },
  setup() {
    const colaboradores = ref([]);
    const cargos = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Usuario/Colaboradores/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        colaboradores.value = response.data;
        // console.log('Dados retornados da API Colaborador', response.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseCargo = await axios.get('https://localhost:7255/api/Cargo');
        cargos.value = responseCargo.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      colaboradores,
      cargos,
    };
  },
  methods: {
    incluirColaborador() {
      this.showModal = true;
    },
    fecharModal() {
      // this.$forceUpdate();
      this.showModal = false;
      this.successModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    enviarFormulario() {
      this.formData.data_nascimento = new Date(this.formData_nascimento);
      this.formData.gerenteId = localStorage.getItem('gerenteId');
      this.formData.cpf = this.formData.cpf.replace(/\D/g, '');
      this.formData.telefone = this.formData.telefone.replace(/\D/g, '');

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
          this.$refs.componentGetColaborador.getColaborador();
          this.successModal = true;
          return;
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    formatarCPF() {
      // Remova caracteres não numéricos
      const cpfLimpo = this.formData.cpf.replace(/\D/g, '');

      // Verifica se o CPF tem pelo menos 11 dígitos
      if (cpfLimpo.length === 11) {
        // Aplica a máscara de CPF (XXX.XXX.XXX-XX)
        this.formData.cpf = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
    },
    formatarTelefone() {
      // Remove todos os caracteres não numéricos
      const telefoneLimpo = this.formData.telefone.replace(/\D/g, '');

      if (telefone.length == 11){
        const retorno = `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-${telefoneLimpo.slice(7, 11)}`;
        return retorno;
      }
      const retorno = `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 6)}-${telefoneLimpo.slice(6, 10)}`;
      return retorno;
    },
    async pesquisarCEP() {
      const cep = this.formData.cep;
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
        if (!response.ok) {
          throw new Error('Erro ao buscar endereço.');
        }

        const data = await response.json();
        console.log('CEP-> ', data);
        this.formData.rua = data.logradouro;
        this.formData.cidade = data.localidade;
        this.formData.estado = data.uf;

        this.$refs.numero.focus();

        return;
      } catch (error) {
        console.error('Erro na requisição:', error.message);
        this.erroModal = true;
        throw error;
      }
    },
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
