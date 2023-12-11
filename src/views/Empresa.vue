<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <img src="../icons/construcao.png" style="width: 35px; height: 35px; margin-top: 6px;">
        <div style="margin-left: 20px;" class="col">
          <h1>Empresas Perceiras</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirEmpresa()">Incluir Empresa Parceira</button>
        </div>
      </div>
    </div>
    <hr>

    <getEmpresa ref="componentGetEmpresa"></getEmpresa>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Nova Empresa Parceira</h1>
          
          <div class="col-md-6">
            <label for="nome_empresa" class="form-label">Nome da Empresa:</label>
            <input type="text" class="form-control" id="nome_empresa" name="nome_empresa" required v-model="formData.nome_empresa" placeholder="Ex... VW"><br>
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
import getEmpresa from '../components/empresa/getEmpresa.vue';

export default {
  components: {
    axios,
    getEmpresa,
  },
  data() {
    return {
      formData: {
        nome_empresa: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const empresas = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Empresa/Empresas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        empresas.value = response.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      empresas,
    };
  },
  methods: {
    incluirEmpresa() {
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

      axios.post('https://localhost:7255/api/Empresa', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.nome_empresa = '';
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetEmpresa.getEmpresa();
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
