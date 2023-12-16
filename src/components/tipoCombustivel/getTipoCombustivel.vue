<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Nome Combustível" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nome Combustível</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredTipoCombustiveis.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="tipoCombustivel in filteredTipoCombustiveis">
        <th scope="row">{{ tipoCombustivel.id }}</th>
        <td>{{ tipoCombustivel.nome_combustivel }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarTipoCombustivel(tipoCombustivel)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirTipoCombustivel(tipoCombustivel)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.tipoCombustivelId)">
        <h1>Editar Tipo de Combustível</h1>

          <div class="col-md-11">
            <label for="nome_combustivel" class="form-label">Nome do Combustível:</label>
            <input type="text" class="form-control" id="nome_combustivel" name="nome_combustivel" required v-model="formDataPut.nome_combustivel"><br>
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
        <div style="width: 400px;" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Tipo de Combustível atualizado com sucesso!
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
        <h1>Excluir Tipo de Combustível</h1>

        <div class="col-md-12">
            <label for="nome_combustivel" class="form-label">Nome do Combustível</label>
            <input type="text" class="form-control" id="nome_combustivel" name="nome_combustivel" required v-model="formDataPut.nome_combustivel" disabled="isInputLocked"><br>
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
        <div style="width: 400px;" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Excluir</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Deseja excluir Tipo de Combustível?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.tipoCombustivelId)">Excluir</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-if="successExcluirModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div style="width: 400px;" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Tipo de Combustível excluida com sucesso!
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
        nome_combustivel: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      tipoCombustivelId: 0,
      erroModal: false,
    }
  },
  setup() {
    const combustiveis = ref([]);
    const searchTerm = ref(null);
    const dataSourceTipoCombustiveis = ref([]);

    // Filtro
    const filteredTipoCombustiveis = computed(() => {
      if (!searchTerm.value) {
        return dataSourceTipoCombustiveis.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceTipoCombustiveis.value.filter(TipoCombustivel => {
        const nomeLowerCase = TipoCombustivel.nome_combustivel.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseTipoCombustiveis = await axios.get('https://localhost:7255/api/TipoCombustivel/TipoCombustivel/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceTipoCombustiveis.value = responseTipoCombustiveis.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      combustiveis,
      searchTerm,
      filteredTipoCombustiveis,
      dataSourceTipoCombustiveis,
    };
  },
  methods: {
    getTipoCombustivel() {
      axios.get('https://localhost:7255/api/TipoCombustivel/TipoCombustivel/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredTipoCombustiveis = res.data;
            this.dataSourceTipoCombustiveis = res.data;
            return;
          }
          this.filteredTipoCombustiveis = [];
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
    editarTipoCombustivel(tipoCombustivel) {
      this.formDataPut.nome_combustivel = tipoCombustivel.nome_combustivel.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoCombustivelId = tipoCombustivel.id;

      this.editarModal = true;
    },
    excluirTipoCombustivel(tipoCombustivel) {
      this.formDataPut.nome_combustivel = tipoCombustivel.nome_combustivel.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.tipoCombustivelId = tipoCombustivel.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');

      axios.put('https://localhost:7255/api/TipoCombustivel/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.nome_combustivel = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getTipoCombustivel();
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
      axios.delete('https://localhost:7255/api/TipoCombustivel/' + id, {
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
          this.getTipoCombustivel();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    mounted() {
      this.getTipoCombustivel()
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
  width: 30%;
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