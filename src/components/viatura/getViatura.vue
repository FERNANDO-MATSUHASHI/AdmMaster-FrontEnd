<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Viatura" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Sigla</th>
        <th scope="col">Obs. Viatura</th>
        <th scope="col">Tipo de Viatura</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredViaturas.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="viatura in filteredViaturas">
        <th scope="row">{{ viatura.id }}</th>
        <td>{{ viatura.sigla }}</td>
        <td>{{ viatura.obs_vtr }}</td>
        <td>{{ obterTipoViatura(viatura.tipo_ViaturaId) }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarViatura(viatura)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirViatura(viatura)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.viaturaId)">
        <h1>Editar Viatura</h1>

          <div class="col-md-2">
            <label for="marca" class="form-label">Sigla</label>
            <input type="text" class="form-control" id="marca" name="marca" required v-model="formDataPut.sigla"><br>
          </div>

          <div class="col-md-6">
            <label for="modelo" class="form-label">Obs. Viatura:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formDataPut.obs_vtr"><br>
          </div>
          
          <div class="col-md-3">
          <label for="tipo_ViaturaId" class="form-label">Tipo de Viatura:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_ViaturaId">
            <option v-for="tipoViatura in this.tipoViaturas" :key="tipoViatura.id" :value="tipoViatura.id">{{ tipoViatura.modelo }}</option>
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
            Viatura atualizado com sucesso!
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
        <h1>Excluir Viatura</h1>

        <div class="col-md-2">
            <label for="marca" class="form-label">Sigla</label>
            <input type="text" class="form-control" id="marca" name="marca" required v-model="formDataPut.sigla" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-6">
            <label for="modelo" class="form-label">Obs. Viatura:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formDataPut.obs_vtr" disabled="isInputLocked"><br>
          </div>
          
          <div class="col-md-3">
          <label for="tipo_ViaturaId" class="form-label">Tipo de Viatura:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_ViaturaId" disabled="isInputLocked">
            <option v-for="tipoViatura in this.tipoViaturas" :key="tipoViatura.id" :value="tipoViatura.id">{{ tipoViatura.modelo }}</option>
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
            Deseja excluir Viatura?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.viaturaId)">Excluir</button>
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
            Viatura excluida com sucesso!
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
        sigla: '',
        obs_vtr: '',
        tipo_ViaturaId: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      viaturaId: 0,
      erroModal: false,
    }
  },
  setup() {
    const viaturas = ref([]);
    const tipoViaturas = ref([]);
    const searchTerm = ref(null);
    const dataSourceViaturas = ref([]);

    // Filtro
    const filteredViaturas = computed(() => {
      if (!searchTerm.value) {
        return dataSourceViaturas.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceViaturas.value.filter(viatura => {
        const nomeLowerCase = viatura.sigla.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseViaturas = await axios.get('https://localhost:7255/api/Viatura/Viaturas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceViaturas.value = responseViaturas.data;
        console.log('Viaturas---> ', responseViaturas)
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseTipoViaturas = await axios.get('https://localhost:7255/api/TipoViatura/TipoViaturas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        tipoViaturas.value = responseTipoViaturas.data;
        console.log('Tipo Viaturas---> ', responseTipoViaturas)
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      viaturas,
      tipoViaturas,
      searchTerm,
      filteredViaturas,
      dataSourceViaturas,
    };
  },
  methods: {
    getViatura() {
      axios.get('https://localhost:7255/api/Viatura/Viaturas/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredViaturas = res.data;
            this.dataSourceViaturas = res.data;
            console.log('Viaturas---> ', res.data);
            return;
          }
          this.filteredViaturas = [];
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
    editarViatura(viatura) {
      this.formDataPut.sigla = viatura.sigla.toString();
      this.formDataPut.obs_vtr = viatura.obs_vtr.toString();
      this.formDataPut.tipo_ViaturaId = viatura.tipo_ViaturaId;
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.viaturaId = viatura.id;

      this.editarModal = true;
    },
    excluirViatura(viatura) {
      this.formDataPut.sigla = viatura.sigla.toString();
      this.formDataPut.obs_vtr = viatura.obs_vtr.toString();
      this.formDataPut.tipo_ViaturaId = viatura.tipo_ViaturaId;
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.viaturaId = viatura.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      console.log('formData-> ', id);

      axios.put('https://localhost:7255/api/Viatura/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.sigla = '';
          this.formDataPut.obs_vtr = '';
          this.formDataPut.tipo_ViaturaId = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getViatura();
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
      axios.delete('https://localhost:7255/api/Viatura/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário


          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getViatura();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    obterTipoViatura(viaturaId) {
      const tipoViatura = this.tipoViaturas.find(c => c.id === viaturaId);
      return tipoViatura ? tipoViatura.modelo : 'Tipo de Viatura Desconhecida';
    },
    mounted() {
      this.getViaturas()
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