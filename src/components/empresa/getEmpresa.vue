<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Nome" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nome da Empresa</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredEmpresas.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="empresa in filteredEmpresas">
        <th scope="row">{{ empresa.id }}</th>
        <td>{{ empresa.nome_empresa }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarEmpresa(empresa)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirEmpresa(empresa)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.empresaId)">
        <h1>Editar Empresa Parceira</h1>

        <div class="col-md-6">
          <label for="nome_empresa" class="form-label">Nome da Empresa:</label>
          <input type="text" class="form-control" id="nome_empresa" name="nome_empresa" required v-model="formDataPut.nome_empresa"><br>
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
            Empresa atualizada com sucesso!
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
        <h1>Excluir Empresa Parceira</h1>

        <div class="col-md-6">
          <label for="nome_empresa" class="form-label">Nome da Empresa:</label>
          <input type="text" class="form-control" id="nome_empresa" name="nome_empresa" required v-model="formDataPut.nome_empresa" disabled="isInputLocked"><br>
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
            Deseja excluir Empresa Parceira?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.empresaId)">Excluir</button>
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
            Empresa Parceira excluida com sucesso!
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
import { ref, computed, onMounted } from 'vue';

export default {
  components: {
    axios
  },
  data() {
    return {
      formDataPut: {
        nome_empresa: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      empresaId: 0,
      erroModal: false,
    }
  },
  setup() {
    const empresas = ref([]);
    const searchTerm = ref(null);
    const dataSourceEmpresas = ref([]);

    // Filtro
    const filteredEmpresas = computed(() => {
      if (!searchTerm.value) {
        return dataSourceEmpresas.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceEmpresas.value.filter(empresa => {
        const nomeLowerCase = empresa.nome_empresa.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseEmpresas = await axios.get('https://localhost:7255/api/Empresa/Empresas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceEmpresas.value = responseEmpresas.data;
        console.log('Empresas---> ', responseEmpresas);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      empresas,
      searchTerm,
      filteredEmpresas,
      dataSourceEmpresas,
    };
  },
  methods: {
    getEmpresa() {
      axios.get('https://localhost:7255/api/Empresa/Empresas/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredEmpresas = res.data;
            this.dataSourceEmpresas = res.data;
            // console.log('Empresas---> ', res.data);
            return;
          }
          this.filteredEmpresas = [];
          return;
        });
    },
    fecharModal() {
      this.editarModal = false;
      this.successModal = false;
      this.excluirModal = false;
      this.excluirSimNaoModal = false;
      this.successExcluirModal = false;
      this.erroModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    editarEmpresa(empresa) {
      this.formDataPut.nome_empresa = empresa.nome_empresa;
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.empresaId = empresa.id;

      this.editarModal = true;
    },
    excluirEmpresa(empresa) {
      this.formDataPut.nome_empresa = empresa.nome_empresa;
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.empresaId = empresa.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      axios.put('https://localhost:7255/api/Empresa/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.nome_empresa = '';
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getEmpresa();
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
      axios.delete('https://localhost:7255/api/Empresa/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.nome_empresa = '';
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getEmpresa();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    mounted() {
      this.getEmpresa()
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