<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Placa" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Marca</th>
        <th scope="col">Modelo</th>
        <th scope="col">Placa</th>
        <th scope="col">Ano Fabricação</th>
        <th scope="col">Ano Modelo</th>
        <th scope="col">Descrição</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredTipoViaturas.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="tipoViatura in filteredTipoViaturas">
        <th scope="row">{{ tipoViatura.id }}</th>
        <td>{{ tipoViatura.marca }}</td>
        <td>{{ tipoViatura.modelo }}</td>
        <td>{{ tipoViatura.placa }}</td>
        <td>{{ tipoViatura.ano }}</td>
        <td>{{ tipoViatura.ano_modelo }}</td>
        <td>{{ tipoViatura.descricao }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarTipoViatura(tipoViatura)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirTipoViatura(tipoViatura)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.tipoViaturaId)">
        <h1>Editar Tipo Viatura</h1>

        <div class="col-md-2">
            <label for="marca" class="form-label">Marca</label>
            <input type="text" class="form-control" id="marca" name="marca" required v-model="formDataPut.marca"><br>
          </div>

          <div class="col-md-2">
            <label for="modelo" class="form-label">Modelo:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formDataPut.modelo"><br>
          </div>
          
          <div class="col-md-2">
            <label for="placa" class="form-label">Placa:</label>
            <input type="text" class="form-control" id="placa" name="placa" required v-model="formDataPut.placa"><br>
          </div>

          <div class="col-md-2">
            <label for="ano" class="form-label">Ano Fabricação:</label>
            <input type="text" class="form-control" id="ano" name="ano" required v-model="formDataPut.ano"><br>
          </div>

          <div class="col-md-2">
            <label for="ano_modelo" class="form-label">Ano Modelo:</label>
            <input type="text" class="form-control" id="ano_modelo" name="ano_modelo" required v-model="formDataPut.ano_modelo"><br>
          </div>

          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formDataPut.descricao"><br>
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
            Tipo de Viatura atualizado com sucesso!
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
        <h1>Excluir Tipo de Viatura</h1>

        <div class="col-md-2">
            <label for="marca" class="form-label">Marca</label>
            <input type="text" class="form-control" id="marca" name="marca" required v-model="formDataPut.marca" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="modelo" class="form-label">Modelo:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formDataPut.modelo" disabled="isInputLocked"><br>
          </div>
          
          <div class="col-md-2">
            <label for="placa" class="form-label">Placa:</label>
            <input type="text" class="form-control" id="placa" name="placa" required v-model="formDataPut.placa" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="ano" class="form-label">Ano Fabricação:</label>
            <input type="text" class="form-control" id="ano" name="ano" required v-model="formDataPut.ano" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="ano_modelo" class="form-label">Ano Modelo:</label>
            <input type="text" class="form-control" id="ano_modelo" name="ano_modelo" required v-model="formDataPut.ano_modelo" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formDataPut.descricao" disabled="isInputLocked"><br>
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
            Deseja excluir Tipo de Viatura?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.tipoViaturaId)">Excluir</button>
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
            Tipo de Viatura excluida com sucesso!
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
        marca: '',
        modelo: '',
        placa: '',
        ano: '',
        ano_modelo: '',
        descricao: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      tipoViaturaId: 0,
      erroModal: false,
    }
  },
  setup() {
    const tipoViaturas = ref([]);
    const searchTerm = ref(null);
    const dataSourceTipoViaturas = ref([]);

    // Filtro
    const filteredTipoViaturas = computed(() => {
      if (!searchTerm.value) {
        return dataSourceTipoViaturas.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceTipoViaturas.value.filter(tipoViatura => {
        const nomeLowerCase = tipoViatura.placa.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseTipoViaturas = await axios.get('https://localhost:7255/api/TipoViatura/TipoViaturas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceTipoViaturas.value = responseTipoViaturas.data;
        console.log('Tipo Viaturas---> ', responseTipoViaturas)
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      tipoViaturas,
      searchTerm,
      filteredTipoViaturas,
      dataSourceTipoViaturas,
    };
  },
  methods: {
    getTipoViatura() {
      axios.get('https://localhost:7255/api/TipoViatura/TipoViaturas/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredTipoViaturas = res.data;
            this.dataSourceTipoViaturas = res.data;
            console.log('TipoViaturas---> ', res.data);
            return;
          }
          this.filteredTipoViaturas = [];
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
    editarTipoViatura(tipoViatura) {
      this.formDataPut.marca = tipoViatura.marca.toString();
      this.formDataPut.modelo = tipoViatura.modelo.toString();
      this.formDataPut.placa = tipoViatura.placa.toString();
      this.formDataPut.ano = tipoViatura.ano.toString();
      this.formDataPut.ano_modelo = tipoViatura.ano_modelo,toString();
      this.formDataPut.descricao = tipoViatura.descricao.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoViaturaId = tipoViatura.id;

      this.editarModal = true;
    },
    excluirTipoViatura(tipoViatura) {
      this.formDataPut.marca = tipoViatura.marca.toString();
      this.formDataPut.modelo = tipoViatura.modelo.toString();
      this.formDataPut.placa = tipoViatura.placa.toString();
      this.formDataPut.ano = tipoViatura.ano.toString();
      this.formDataPut.ano_modelo = tipoViatura.ano_modelo,toString();
      this.formDataPut.descricao = tipoViatura.descricao.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoViaturaId = tipoViatura.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      axios.put('https://localhost:7255/api/TipoViatura/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.marca = '';
          this.formDataPut.modelo = '';
          this.formDataPut.placa = '';
          this.formDataPut.ano = '';
          this.formDataPut.ano_modelo = '';
          this.formDataPut.descricao = '',
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getTipoViatura();
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
      axios.delete('https://localhost:7255/api/TipoViatura/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.marca = '';
          this.formDataPut.modelo = '';
          this.formDataPut.placa = '';
          this.formDataPut.ano = '';
          this.formDataPut.ano_modelo = '';
          this.formDataPut.descricao = '',
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getTipoViatura();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    mounted() {
      this.getTipoViaturas()
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