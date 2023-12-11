<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Modelo" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Descrição</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredTipoServicos.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="tipoServico in filteredTipoServicos">
        <th scope="row">{{ tipoServico.id }}</th>
        <td>{{ tipoServico.descricao }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarTipoServico(tipoServico)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirTipoServico(tipoServico)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.tipoServicoId)">
        <h1>Editar Tipo Serviço</h1>

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
            Tipo de Serviço atualizado com sucesso!
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
        <h1>Excluir Tipo de Serviço</h1>

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
            Deseja excluir Tipo de Serviço?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.tipoServicoId)">Excluir</button>
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
            Tipo de Serviço excluido com sucesso!
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
        descricao: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      tipoServicoId: 0,
      erroModal: false,
    }
  },
  setup() {
    const tipoServicos = ref([]);
    const searchTerm = ref(null);
    const dataSourceTipoServicos = ref([]);

    // Filtro
    const filteredTipoServicos = computed(() => {
      if (!searchTerm.value) {
        return dataSourceTipoServicos.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceTipoServicos.value.filter(tipoServico => {
        const nomeLowerCase = tipoServico.descricao.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseTipoServicos = await axios.get('https://localhost:7255/api/TipoServico/TipoServicos/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceTipoServicos.value = responseTipoServicos.data;
        // console.log('Tipo Servico---> ', responseTipoServicos)
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      tipoServicos,
      searchTerm,
      filteredTipoServicos,
      dataSourceTipoServicos,
    };
  },
  methods: {
    getTipoServico() {
      axios.get('https://localhost:7255/api/TipoServico/TipoServicos/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredTipoVServicos = res.data;
            this.dataSourceTipoServicos = res.data;
            // console.log('TipoServicos---> ', res.data);
            return;
          }
          this.filteredTipoServicos = [];
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
    editarTipoServico(tipoServico) {
      this.formDataPut.descricao = tipoServico.descricao.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoServicoId = tipoServico.id;

      this.editarModal = true;
    },
    excluirTipoServico(tipoServico) {
      this.formDataPut.descricao = tipoServico.descricao.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoServicoId = tipoServico.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      axios.put('https://localhost:7255/api/TipoServico/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.descricao = '',
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getTipoServico();
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
      axios.delete('https://localhost:7255/api/TipoServico/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.descricao = '',
          this.formDataPut.gerenteIdPut = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getTipoServico();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    mounted() {
      this.getTipoServico()
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