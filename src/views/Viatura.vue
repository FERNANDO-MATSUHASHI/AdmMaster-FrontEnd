<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-light-emergency-on"></i>
        <div style="margin-left: 20px;" class="col">
          <h1>Viatura</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirViatura()">Incluir Viatura</button>
        </div>
      </div>
    </div>
    <hr>

    <getViatura ref="componentGetViatura"></getViatura>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Nova Viatura</h1>
          
          <div class="col-md-2">
            <label for="marca" class="form-label">Sigla</label>
            <input type="text" class="form-control" id="marca" name="marca" required v-model="formData.sigla" placeholder="Ex... L123"><br>
          </div>

          <div class="col-md-6">
            <label for="modelo" class="form-label">Obs. Viatura:</label>
            <input type="text" class="form-control" id="modelo" name="modelo" required v-model="formData.obs_vtr" placeholder="Ex... Carrinho de Moto, 4 Patins"><br>
          </div>
          
          <div class="col-md-3">
          <label for="tipo_ViaturaId" class="form-label">Tipo de Viatura:</label>
          <select id="inputState2" class="form-select" required v-model="formData.tipo_ViaturaId">
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
import getViatura from '../components/viatura/getViatura.vue';

export default {
  components: {
    axios,
    getViatura,
  },
  data() {
    return {
      formData: {
        sigla: '',
        pbs_vtr: '',
        tipo_ViaturaId: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const viaturas = ref([]);
    const tipoViaturas = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Viatura/Viaturas/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        viaturas.value = response.data;
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
    };
  },
  methods: {
    incluirViatura() {
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

      axios.post('https://localhost:7255/api/Viatura', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.sigla = '';
          this.formData.pbs_vtr = '';
          this.formData.tipo_ViaturaId = '';
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetViatura.getViatura();
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
