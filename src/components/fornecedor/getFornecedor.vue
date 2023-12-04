<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Nome " />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">CNPJ</th>
        <th scope="col">Razão Social</th>
        <th scope="col">Nome Fantasia</th>
        <th scope="col">Telefone</th>
        <th scope="col">e-mail</th>
        <th scope="col">Cidade</th>
        <th scope="col">Estado</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="fornecedor in filteredFornecedores">
        <th scope="row">{{ fornecedor.id }}</th>
        <td>{{ formatarCNPJ(fornecedor.cnpj) }}</td>
        <td>{{ fornecedor.razao_social }}</td>
        <td>{{ fornecedor.nome_fantasia }}</td>
        <td>{{ formatarTelefone(fornecedor.telefone) }}</td>
        <td>{{ fornecedor.email }}</td>
        <td>{{ fornecedor.cidade }}</td>
        <td>{{ fornecedor.estado }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarFornecedor(fornecedor)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirFornecedor(fornecedor)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
        </td>
      </tr>
    </tbody>
  </table>
  <br>
  <br>
  <br>
  <br>


  <!-- Formulário Editar -->
  <div class="modal" v-if="editarModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.fornecedorID)">
        <h1>Editar Fornecedor</h1>
        <div class="col-md-6">
          <label for="cnpj" class="form-label">CNPJ:</label>
          <input type="text" class="form-control" id="cnpj" name="cnpj" @input="formatarCNPJ" required v-model="formDataPut.cnpj"><br>
        </div>

        <div class="col-md-6">
          <label for="razao_social" class="form-label">Razão Social:</label>
          <input type="text" class="form-control" id="razao_social" name="razao_social" required v-model="formDataPut.razao_social"><br>
        </div>

        <div class="col-md-6">
          <label for="nome_fantasia" class="form-label">Nome Fantasia:</label>
          <input type="text" class="form-control" id="nome_fantasia" name="nome_fantasia" required v-model="formDataPut.nome_fantasia"><br>
        </div>

        <div class="col-md-6">
          <label for="telefone" class="form-label">Telefone:</label>
          <input type="text" class="form-control" id="telefone" name="telefone" @input="formatarTelefone" required v-model="formDataPut.telefone"><br>
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" name="email" required v-model="formDataPut.email"><br>
        </div>

        <div class="col-md-2">
          <label for="cep" class="form-label">CEP:</label>
          <input type="text" class="form-control" id="cep" name="cep" required v-model="formDataPut.cep"><br>
        </div>

        <div class="col-2">
          <br>
          <button type="button" class="btn btn-primary mr-3" @click="pesquisarCEP">Pesquisar</button>
        </div>

        <div class="col-md-6">
          <label for="rua" class="form-label">Rua:</label>
          <input type="text" class="form-control" id="rua" name="rua" required v-model="formDataPut.rua" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="numero" class="form-label">Número:</label>
          <input type="text" class="form-control" id="numero" name="numero" required v-model="formDataPut.numero"><br>
        </div>

        <div class="col-md-6">
          <label for="cidade" class="form-label">Cidade:</label>
          <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formDataPut.cidade" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="estado" class="form-label">Estado:</label>
          <input type="text" class="form-control" id="estado" name="estado" required v-model="formDataPut.estado" disabled="isInputLocked"><br>
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
            Fornecedor atualizado com sucesso!
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
        <h1>Excluir Fornecedor</h1>
        <div class="col-md-6">
          <label for="cnpj" class="form-label">CNPJ:</label>
          <input type="text" class="form-control" id="cnpj" name="cnpj" required v-model="formDataPut.cnpj" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="razao_social" class="form-label">Razão Social:</label>
          <input type="text" class="form-control" id="razao_social" name="razao_social" required v-model="formDataPut.razao_social" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="nome_fantasia" class="form-label">Nome Fantasia:</label>
          <input type="text" class="form-control" id="nome_fantasia" name="nome_fantasia" required v-model="formDataPut.nome_fantasia" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="telefone" class="form-label">Telefone:</label>
          <input type="text" class="form-control" id="telefone" name="telefone" required v-model="formDataPut.telefone" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" name="email" required v-model="formDataPut.email" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cep" class="form-label">CEP:</label>
          <input type="text" class="form-control" id="cep" name="cep" required v-model="formDataPut.cep" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="rua" class="form-label">Rua:</label>
          <input type="text" class="form-control" id="rua" name="rua" required v-model="formDataPut.rua" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="numero" class="form-label">Número:</label>
          <input type="text" class="form-control" id="numero" name="numero" required v-model="formDataPut.numero" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="cidade" class="form-label">Cidade:</label>
          <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formDataPut.cidade" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-6">
          <label for="estado" class="form-label">Estado:</label>
          <input type="text" class="form-control" id="estado" name="estado" required v-model="formDataPut.estado" disabled="isInputLocked"><br>
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
            Deseja excluir Fornecedor?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.fornecedorID)">Excluir</button>
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
            Fornecedor excluido com sucesso!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModal()">Fechar</button>
          </div>
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
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

export default {
  components: {
    axios
  },
  data() {
    return {
      formDataPut: {
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        telefone: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        gerenteId: '1',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      erroModal: false,
      fornecedorID: 0,
    }
  },
  setup() {
    const fornecedores = ref([]);
    const searchTerm = ref(null);
    const dataSourceFornecedores = ref([]);

    // Filtro
    const filteredFornecedores = computed(() => {
      if (!searchTerm.value) {
        return dataSourceFornecedores.value;
      }
      const searchTermLowerCase = searchTerm.value;
      return dataSourceFornecedores.value.filter(fornecedor => {
        const nomeLowerCase = fornecedor.cnpj;
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseFornecedores = await axios.get('https://localhost:7255/api/Fornecedor/Fornecedor/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceFornecedores.value = responseFornecedores.data;
        // console.log('Dados retornados da API Fornecedor', responsFornecedores.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      fornecedores,
      searchTerm,
      filteredFornecedores,
      dataSourceFornecedores
    };
  },
  methods: {
    getFornecedor() {
      axios.get('https://localhost:7255/api/Fornecedor/Fornecedor/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredFornecedores = res.data;
            this.dataSourceFornecedores = res.data;
            return;
          }
          this.filteredFornecedores = [];
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
    fecharModalErro() {
      this.erroModal = false;
    },
    editarFornecedor(fornecedor) {
      this.formDataPut.cnpj = this.formatarCNPJ(fornecedor.cnpj);
      this.formDataPut.razao_social = fornecedor.razao_social.toString();
      this.formDataPut.nome_fantasia = fornecedor.nome_fantasia.toString();
      this.formDataPut.telefone = this.formatarTelefone(fornecedor.telefone);
      this.formDataPut.email = fornecedor.email.toString();
      this.formDataPut.cep = fornecedor.cep.toString();
      this.formDataPut.rua = fornecedor.rua.toString();
      this.formDataPut.numero = fornecedor.numero.toString();
      this.formDataPut.cidade = fornecedor.cidade.toString();
      this.formDataPut.estado = fornecedor.estado.toString();
      this.formDataPut.gerenteId = fornecedor.gerenteId.toString();
      this.fornecedorID = fornecedor.id;

      this.editarModal = true;
    },
    excluirFornecedor(fornecedor) {
      this.formDataPut.cnpj = this.formatarCNPJ(fornecedor.cnpj);
      this.formDataPut.razao_social = fornecedor.razao_social.toString();
      this.formDataPut.nome_fantasia = fornecedor.nome_fantasia.toString();
      this.formDataPut.telefone = this.formatarTelefone(fornecedor.telefone);
      this.formDataPut.email = fornecedor.email.toString();
      this.formDataPut.cep = fornecedor.cep.toString();
      this.formDataPut.rua = fornecedor.rua.toString();
      this.formDataPut.numero = fornecedor.numero.toString();
      this.formDataPut.cidade = fornecedor.cidade.toString();
      this.formDataPut.estado = fornecedor.estado.toString();
      this.formDataPut.gerenteId = fornecedor.gerenteId.toString();
      this.fornecedorID = fornecedor.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      this.formDataPut.cnpj = this.formDataPut.cnpj.replace(/\D/g, '');
      this.formDataPut.telefone = this.formDataPut.telefone.replace(/\D/g, '');

      axios.put('https://localhost:7255/api/Fornecedor/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.cnpj = '';
          this.formDataPut.razao_social = '';
          this.formDataPut.nome_fantasia = '';
          this.formDataPut.telefone = '';
          this.formDataPut.email = '';
          this.formDataPut.cep = '';
          this.formDataPut.rua = '';
          this.formDataPut.numero = '';
          this.formDataPut.cidade = '';
          this.formDataPut.estado = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getFornecedor();
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
      console.log('Id Fornecedor-> ', id);

      axios.delete('https://localhost:7255/api/Fornecedor/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.cnpj = '';
          this.formDataPut.razao_social = '';
          this.formDataPut.nome_fantasia = '';
          this.formDataPut.telefone = '';
          this.formDataPut.email = '';
          this.formDataPut.cep = '';
          this.formDataPut.rua = '';
          this.formDataPut.numero = '';
          this.formDataPut.cidade = '';
          this.formDataPut.estado = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getFornecedor();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    formatarCNPJ(cnpj) {
      // Remova caracteres não numéricos
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      // Aplica a máscara de CNPJ (XX.XXX.XXX/XXXX-XX)
      const retorno = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5').toString();

      return retorno;
    },
    formatarTelefone(telefone) {
      // Remove todos os caracteres não numéricos
      const telefoneLimpo = telefone.replace(/\D/g, '');

      // Formata o telefone conforme necessário (por exemplo, (11) 99999-9999)
      if (telefone.length == 11){
        const retorno = `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 7)}-${telefoneLimpo.slice(7, 11)}`;
        return retorno;
      }
      const retorno = `(${telefoneLimpo.slice(0, 2)}) ${telefoneLimpo.slice(2, 6)}-${telefoneLimpo.slice(6, 10)}`;
      return retorno;
    },
    async pesquisarCEP() {
      const cep = this.formDataPut.cep;
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
        if (!response.ok) {
          throw new Error('Erro ao buscar endereço.');
        }

        const data = await response.json();
        console.log('CEP-> ', data);
        this.formDataPut.rua = data.logradouro;
        this.formDataPut.cidade = data.localidade;
        this.formDataPut.estado = data.uf;
      } catch (error) {
        console.error('Erro na requisição:', error.message);
        this.erroModal = true;
        throw error;
      }
    },
    mounted() {
      this.getFornecedor()
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