<template>
  <main class="colaborador">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-file-invoice-dollar"></i>
        <div style="margin-left: 20px;" class="col">
          <h1>Veículo Valores</h1>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirVeiculo()">Incluir Veículo Valores</button>
        </div>
      </div>
    </div>
    <hr>

    <getVeiculo ref="componentGetVeiculo"></getVeiculo>

    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
          <h1>Novo Veiculo Valores</h1>
          
          <div class="col-md-2">
            <label for="valor_saida" class="form-label">Valor Saída R$:</label>
            <input type="text" class="form-control" id="valor_saida" name="valor_saida" required v-model="formData.valor_saida" placeholder="Ex... 164.00"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_km" class="form-label">Valor Km R$:</label>
            <input type="text" class="form-control" id="valor_km" name="valor_km" required v-model="formData.valor_km" placeholder="Ex... 2.70"><br>
          </div>

          <div class="col-md-2">
            <label for="adicional_noturno" class="form-label">Adicional Noturno R$:</label>
            <input type="text" class="form-control" id="adicional_noturno" name="adicional_noturno" v-model="formData.adicional_noturno" placeholder="Ex... 23.92"><br>
          </div>

          <div class="col-md-2">
            <label for="ris" class="form-label">RIS R$:</label>
            <input type="text" class="form-control" id="ris" name="ris" v-model="formData.ris" placeholder="Ex... 10.00"><br>
          </div>

          <div class="col-md-2">
            <label for="patins" class="form-label">Patins R$:</label>
            <input type="text" class="form-control" id="patins" name="patins" v-model="formData.patins" placeholder="Ex... 107.00"><br>
          </div>

          <div class="col-md-2">
            <label for="rodaExtra" class="form-label">Roda Extra R$:</label>
            <input type="text" class="form-control" id="rodaExtra" name="rodaExtra" v-model="formData.rodaExtra" placeholder="Ex... 107.00"><br>
          </div>

          <div class="col-md-2">
            <label for="hora_parada" class="form-label">Hora Parada R$:</label>
            <input type="text" class="form-control" id="hora_parada" name="hora_parada" required v-model="formData.hora_parada" placeholder="Ex... 30.30"><br>
          </div>
          
          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formData.descricao" placeholder="Ex... Auto"><br>
          </div>

          <div class="col-md-3">
            <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
            <select id="inputState2" class="form-select" required v-model="formData.tipo_ServicoId">
              <option v-for="tipoServico in tipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{ tipoServico.descricao }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
            <select id="inputState2" class="form-select" required v-model="formData.tipo_VeiculoId">
              <option v-for="tipoVeiculo in tipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{ tipoVeiculo.modelo }}</option>
            </select>
            <br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formData.viaturaId">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
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
import getVeiculo from '../components/veiculo/getVeiculo.vue';

export default {
  components: {
    axios,
    getVeiculo,
  },
  data() {
    return {
      formData: {
        valor_saida: '',
        valor_km: '',
        adicional_noturno: '',
        ris: '',
        patins: '',
        rodaExtra: '',
        hora_parada: '',
        descricao: '',
        tipo_ServicoId: '',
        tipo_VeiculoId: '',
        viaturaId: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const veiculos = ref([]);
    const tipoServicos = ref([]);
    const tipoVeiculos = ref([]);
    const viaturas = ref ([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Veiculo/Veiculos/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        veiculos.value = response.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseTipoServicos = await axios.get('https://localhost:7255/api/TipoServico/TipoServicos/' + localStorage.getItem('gerenteId'));
        tipoServicos.value = responseTipoServicos.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseViaturas = await axios.get('https://localhost:7255/api/Viatura/Viaturas/' + localStorage.getItem('gerenteId'));
        viaturas.value = responseViaturas.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseVeiculo = await axios.get('https://localhost:7255/api/TipoVeiculo/TipoVeiculos/' + localStorage.getItem('gerenteId'));
        tipoVeiculos.value = responseVeiculo.data;
        // console.log('Veiculos: ', responseVeiculo.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      veiculos,
      tipoServicos,
      tipoVeiculos,
      viaturas,
    };
  },
  methods: {
    incluirVeiculo() {
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

      axios.post('https://localhost:7255/api/Veiculo', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.valor_saida = '';
          this.formData.valor_km = '',
          this.formData.adicional_noturno = '';
          this.formData.ris = '';
          this.formData.patins = '',
          this.formData.rodaExtra = '';
          this.formData.hora_parada = '';
          this.formData.descricao = '',
          this.formData.tipo_ServicoId = '';
          this.formData.tipo_VeiculoId = '';
          this.formData.viaturaId = '',
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetVeiculo.getVeiculo();
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
