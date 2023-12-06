<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <img src="../icons/tools.png" style="width: 35px; height: 35px; margin-top: 6px;">
        <div style="margin-left: 20px;" class="col">
          <h1>Manutenção</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirManutencao()">Incluir Manutenção</button>
        </div>
      </div>
    </div>
    <hr>

    <getManutencao ref="componentGetManutencao"></getManutencao>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Nova Manutenção</h1>

          <div class="col-md-2">
            <label for="data_manutencao" class="form-label">Data:</label>
            <input type="date" class="form-control" id="data_manutencao" name="data_manutencao" required v-model="formData.data_manutencao"><br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formData.viaturaId">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="nome_manutencao" class="form-label">Tipo Manutenção</label>
            <input type="text" class="form-control" id="nome_manutencao" name="nome_manutencao" required v-model="formData.nome_manutencao" placeholder="Ex... Revisão 100 mil Km"><br>
          </div>

          <div class="col-md-6">
            <label for="descricao_manutencao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao_manutencao" name="descricao_manutencao" required v-model="formData.descricao_manutencao" placeholder="Ex... Troca de Óleo"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_total_manutencao" class="form-label">Valor Total:</label>
            <input type="text" class="form-control" id="valor_total_manutencao" name="valor_total_manutencao" required v-model="formData.valor_total_manutencao" placeholder="Ex... 1500.00"><br>
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
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
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
import getManutencao from '../components/manutencao/getManutencao.vue';

export default {
  components: {
    axios,
    getManutencao,
  },
  data() {
    return {
      formData: {
        data_manutencao: '',
        nome_manutencao: '',
        descricao_manutencao: '',
        viaturaId: '',
        valor_total_manutencao: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const manutencoes = ref([]);
    const viaturas = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Manutencao/Manutencao/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        manutencoes.value = response.data;
        // console.log('Dados retornados da API Colaborador', response.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseViaturas = await axios.get('https://localhost:7255/api/Viatura');
        viaturas.value = responseViaturas.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      manutencoes,
      viaturas,
    };
  },
  methods: {
    incluirManutencao() {
      this.showModal = true;
    },
    fecharModal() {
      // this.$forceUpdate();
      this.showModal = false;
      this.successModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    enviarFormulario() {
      this.formData.data_manutencao = new Date(this.formData.data_manutencao);
      this.formData.gerenteId = localStorage.getItem('gerenteId');

      axios.post('https://localhost:7255/api/Manutencao', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.data_manutencao = '';
          this.formData.nome_manutencao = '';
          this.formData.descricao_manutencao = '';
          this.formData.data_nascimento = '',
          this.formData.viaturaId = '';
          this.formData.valor_total_manutencao = '';
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetManutencao.getManutencao();
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
}</style>
