<template>
  <tbody>
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
          <th scope="col">Opções</th>
        </tr>
      </thead>

      <tr v-for="colaborador in filteredColaboradores">
        <th scope="row">{{ colaborador.id }}</th>
        <td>{{ colaborador.nome }}</td>
        <td>{{ colaborador.email }}</td>
        <td>{{ parseDataBrasil(colaborador.data_nascimento) }}</td>
        <td>{{ colaborador.ativo ? 'Sim' : 'Não' }}</td>
        <td>{{ colaborador.comissao }} %</td>
        <td>{{ obterNomeDoCargo(colaborador.cargoId) }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarColaborador(colaborador)"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirColaborador(colaborador)"></i>
        </td>
      </tr>
    </table>
    <br>
    <br>
    <br>
    <br>
  </tbody>

  <!-- Formulário Editar -->
  <div class="modal" v-if="editarModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.colaboradorID)">
        <h1>Editar Colaborador</h1>
        <div class="col-md-6">
          <label for="nome" class="form-label">Nome</label>
          <input type="text" class="form-control" id="nome" name="nome" required v-model="formDataPut.nome"><br>
        </div>

        <div class="col-md-6">
          <label for="cpf" class="form-label">CPF:</label>
          <input type="text" class="form-control" id="cpf" name="cpf" required v-model="formDataPut.cpf"><br>
        </div>

        <div class="col-md-6">
          <label for="data_nascimento" class="form-label">Data de Nascimento:</label>
          <input type="date" class="form-control" id="data_nascimento" name="data_nascimento" required
            v-model="formDataPut.data_nascimento"><br>
        </div>

        <div class="col-md-6">
          <label for="cep" class="form-label">CEP:</label>
          <input type="text" class="form-control" id="cep" name="cep" required v-model="formDataPut.cep"><br>
        </div>

        <div class="col-md-6">
          <label for="rua" class="form-label">Rua:</label>
          <input type="text" class="form-control" id="rua" name="rua" required v-model="formDataPut.rua"><br>
        </div>

        <div class="col-md-6">
          <label for="numero" class="form-label">Número:</label>
          <input type="text" class="form-control" id="numero" name="numero" required v-model="formDataPut.numero"><br>
        </div>

        <div class="col-md-6">
          <label for="cidade" class="form-label">Cidade:</label>
          <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formDataPut.cidade"><br>
        </div>

        <div class="col-md-6">
          <label for="estado" class="form-label">Estado:</label>
          <input type="text" class="form-control" id="estado" name="estado" required v-model="formDataPut.estado"><br>
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" name="email" required v-model="formDataPut.email"><br>
        </div>

        <div class="col-md-6">
          <label for="senha" class="col-form-label">Senha</label>
          <input type="password" class="form-control" id="senha" required v-model="formDataPut.senha">
        </div>

        <div class="col-md-6">
          <label for="ativo" class="form-label">Ativo:</label>
          <select id="ativo" class="form-select" name="ativo" required v-model="formDataPut.ativo">
            <option :value=true>Sim</option>
            <option :value=false>Não</option>
          </select><br>
        </div>

        <div class="col-md-6">
          <label for="comissao" class="form-label">Comissão %:</label>
          <input type="text" class="form-control" id="comissao" name="comissao" required
            v-model="formDataPut.comissao"><br>
        </div>

        <div class="col-md-6">
          <label for="cargoId" class="form-label">Cargo:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.cargoId">
            <option v-for="cargo in this.cargos" :key="cargo.id" :value="cargo.id">{{ cargo.descricao }}</option>
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
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Colaborador atualizado com sucesso!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Formulário Excluir -->
  <div class="modal" v-if="excluirModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>

      <form id="modalForm" class="row" @submit.prevent="excluirSimNaoFormulario()">
        <h1>Excluir Colaborador</h1>
        <div class="col-md-6">
          <label for="nome" class="form-label">Nome</label>
          <input type="text" class="form-control" id="nome" name="nome" required v-model="formDataPut.nome"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cpf" class="form-label">CPF:</label>
          <input type="text" class="form-control" id="cpf" name="cpf" required v-model="formDataPut.cpf"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="data_nascimento" class="form-label">Data de Nascimento:</label>
          <input type="date" class="form-control" id="data_nascimento" name="data_nascimento" required
            v-model="formDataPut.data_nascimento" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cep" class="form-label">CEP:</label>
          <input type="text" class="form-control" id="cep" name="cep" required v-model="formDataPut.cep"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="rua" class="form-label">Rua:</label>
          <input type="text" class="form-control" id="rua" name="rua" required v-model="formDataPut.rua"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="numero" class="form-label">Número:</label>
          <input type="text" class="form-control" id="numero" name="numero" required v-model="formDataPut.numero"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cidade" class="form-label">Cidade:</label>
          <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formDataPut.cidade"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="estado" class="form-label">Estado:</label>
          <input type="text" class="form-control" id="estado" name="estado" required v-model="formDataPut.estado"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" name="email" required v-model="formDataPut.email"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="senha" class="col-form-label">Senha</label>
          <input type="password" class="form-control" id="senha" required v-model="formDataPut.senha"
            disabled="isInputLocked">
        </div>

        <div class="col-md-6">
          <label for="ativo" class="form-label">Ativo:</label>
          <select id="ativo" class="form-select" name="ativo" required v-model="formDataPut.ativo"
            disabled="isInputLocked">
            <option :value=true>Sim</option>
            <option :value=false>Não</option>
          </select><br>
        </div>

        <div class="col-md-6">
          <label for="comissao" class="form-label">Comissão:</label>
          <input type="text" class="form-control" id="comissao" name="comissao" required v-model="formDataPut.comissao"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cargoId" class="form-label">Cargo:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.cargoId" disabled="isInputLocked">
            <option v-for="cargo in this.cargos" :key="cargo.id" :value="cargo.id">{{ cargo.descricao }}</option>
          </select>
        </div>

        <div class="col-12">
          <br>
          <button type="submit" class="btn btn-danger">Excluir</button>
        </div>
      </form>
    </div>
  </div>
  <div class="modal" v-if="excluirSimNaoModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Excluir</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Deseja excluir Colaborador?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.colaboradorID)">Excluir</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-if="successExcluirModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Colaborador excluido com sucesso!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { addNotification, dialogConfirm, dialogAlert } from '../../assets/common.js';
import { ref, computed, onMounted } from 'vue';

export default {
  components: {
    axios
  },
  data() {
    return {
      formDataPut: {
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
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      formData_nascimentoPut: '',
      colaboradorID: 0,
    }
  },
  setup() {
    const colaboradores = ref([]);
    const searchTerm = ref(null);
    const dataSourceColaboradores = ref([]);
    const cargos = ref([]);

    // Filtro
    const filteredColaboradores = computed(() => {
      if (!searchTerm.value) {
        return dataSourceColaboradores.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceColaboradores.value.filter(colaborador => {
        const nomeLowerCase = colaborador.nome.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseColaboradores = await axios.get('https://localhost:7255/api/Usuario', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceColaboradores.value = responseColaboradores.data;
        // console.log('Dados retornados da API Colaborador', responseColaboradores.data);
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
      searchTerm,
      filteredColaboradores,
      dataSourceColaboradores,
      cargos
    };
  },
  methods: {
    getColaborador() {
      axios.get('https://localhost:7255/api/Usuario', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredColaboradores = res.data;
            this.dataSourceColaboradores = res.data;
            return;
          }
          this.filteredColaborador = [];
          return;
        });
    },
    fecharModal() {
      this.editarModal = false;
      this.successModal = false;
      this.excluirModal = false;
      this.excluirSimNaoModal = false;
      this.successExcluirModal = false;
    },
    editarColaborador(colaborador) {
      this.formDataPut.nome = colaborador.nome.toString();
      this.formDataPut.cpf = colaborador.cpf.toString();
      this.formDataPut.email = colaborador.email.toString();
      this.formDataPut.data_nascimento = this.parseData(colaborador.data_nascimento);
      this.formDataPut.cep = colaborador.cep.toString();
      this.formDataPut.rua = colaborador.rua.toString();
      this.formDataPut.numero = colaborador.numero.toString();
      this.formDataPut.cidade = colaborador.cidade.toString();
      this.formDataPut.estado = colaborador.estado.toString();
      this.formDataPut.user_name = colaborador.user_name.toString();
      this.formDataPut.senha = colaborador.senha.toString();
      this.formDataPut.ativo = colaborador.ativo;
      this.formDataPut.comissao = colaborador.comissao.toString();
      this.formDataPut.gerenteId = colaborador.gerenteId.toString();
      this.formDataPut.cargoId = colaborador.cargoId;
      this.colaboradorID = colaborador.id;

      this.editarModal = true;
    },
    excluirColaborador(colaborador) {
      this.formDataPut.nome = colaborador.nome.toString();
      this.formDataPut.cpf = colaborador.cpf.toString();
      this.formDataPut.email = colaborador.email.toString();
      this.formDataPut.data_nascimento = this.parseData(colaborador.data_nascimento);
      this.formDataPut.cep = colaborador.cep.toString();
      this.formDataPut.rua = colaborador.rua.toString();
      this.formDataPut.numero = colaborador.numero.toString();
      this.formDataPut.cidade = colaborador.cidade.toString();
      this.formDataPut.estado = colaborador.estado.toString();
      this.formDataPut.user_name = colaborador.user_name.toString();
      this.formDataPut.senha = colaborador.senha.toString();
      this.formDataPut.ativo = colaborador.ativo;
      this.formDataPut.comissao = colaborador.comissao.toString();
      this.formDataPut.gerenteId = colaborador.gerenteId.toString();
      this.formDataPut.cargoId = colaborador.cargoId;
      this.colaboradorID = colaborador.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      this.formDataPut.data_nascimento = new Date(this.formDataPut.data_nascimento);

      axios.put('https://localhost:7255/api/Usuario/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.nomePut = '';
          this.formDataPut.cpfPut = '';
          this.formDataPut.emailPut = '';
          this.formDataPut.data_nascimento = '',
          this.formDataPut.cepPut = '';
          this.formDataPut.ruaPut = '';
          this.formDataPut.numeroPut = '';
          this.formDataPut.cidadePut = '';
          this.formDataPut.estadoPut = '';
          this.formDataPut.user_namePut = '';
          this.formDataPut.senhaPut = '';
          this.formDataPut.ativoPut = true;
          this.formDataPut.comissaoPut = '';
          this.formDataPut.gerenteIdPut = '';
          this.formDataPut.cargoIdPut = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getColaborador();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    excluirSimNaoFormulario() {
      this.excluirModal = false;
      this.excluirSimNaoModal = true;
    },
    excluirFormulario(id) {
      console.log('Id Colaborador-> ', id);

      axios.delete('https://localhost:7255/api/Usuario/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.nomePut = '';
          this.formDataPut.cpfPut = '';
          this.formDataPut.emailPut = '';
          this.formDataPut.data_nascimento = '',
          this.formDataPut.cepPut = '';
          this.formDataPut.ruaPut = '';
          this.formDataPut.numeroPut = '';
          this.formDataPut.cidadePut = '';
          this.formDataPut.estadoPut = '';
          this.formDataPut.user_namePut = '';
          this.formDataPut.senhaPut = '';
          this.formDataPut.ativoPut = true;
          this.formDataPut.comissaoPut = '';
          this.formDataPut.gerenteIdPut = '';
          this.formDataPut.cargoIdPut = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getColaborador();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      return `${ano}-${mes}-${dia}`;
    },
    parseDataBrasil(dataString) {
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
    },
    mounted() {
        this.getColaboradores()
    }
  }
}
</script>

<style>
.msg {
  background-color: #050101;
}

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
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  z-index: 1;
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

.modal-dialog {
  width: 80%;
}
</style>