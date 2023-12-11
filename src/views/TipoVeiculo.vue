<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-light-emergency-on"></i>
        <div style="margin-left: 20px;" class="col">
          <h1>Tipo de Veículo</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirTipoVeiculo()">Incluir Tipo de Veículo</button>
        </div>
      </div>
    </div>
    <hr>

    <getTipoVeiculo ref="componentGetTipoVeiculo"></getTipoVeiculo>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Novo Tipo de Veiculo</h1>
          
          <div class="col-md-2">
            <label for="modelo" class="form-label">Modelo:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formData.modelo" placeholder="Ex... Auto"><br>
          </div>
          
          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formData.descricao" placeholder="Ex... Automóvel de Passeio"><br>
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

  </main>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import getTipoVeiculo from '../components/tipoVeiculo/getTipoVeiculo.vue';

export default {
  components: {
    axios,
    getTipoVeiculo,
  },
  data() {
    return {
      formData: {
        modelo: '',
        descricao: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const tipoVeiculos = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/TipoVeiculo/TipoVeiculos/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        tipoVeiculos.value = response.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      tipoVeiculos,
    };
  },
  methods: {
    incluirTipoVeiculo() {
      this.showModal = true;
    },
    fecharModal() {
      this.showModal = false;
      this.successModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    enviarFormulario() {
      this.formData.gerenteId = localStorage.getItem('gerenteId');
      // console.log('Gerente Id-> ', localStorage.getItem('gerenteId'));
      // console.log('formData.gerenteId-> ', this.formData.gerenteId);
      console.log('formData-> ', this.formData);

      axios.post('https://localhost:7255/api/TipoVeiculo', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.modelo = '';
          this.formData.descricao = '',
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetTipoVeiculo.getTipoVeiculo();
          this.successModal = true;
          return;
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
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
