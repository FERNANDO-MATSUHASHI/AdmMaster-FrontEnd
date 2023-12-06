<template>
  <main class="atendimento">
  <div class="row">
    <div class="d-flex justify-content">
      <i style="font-size: 40px; margin-left: 35px;" class="fi fi-rr-hand-holding-medical" ></i>
      <div style="margin-left: 20px;" class="col">
        <h1>Adicionar Atendimento</h1>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirAtendimento()">Incluir Atendimento</button>
      </div>

      <div class="d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="emAnalisaAtendimento()">Atendimentos em Análise</button>
      </div>

      <div class="d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="limparPesquisa()">Limpar Pesquisa</button>
      </div>
    </div>
  </div>

  <getAtendimento ref="componentGetAtendimento"></getAtendimento>

  <div class="modal" v-if="showModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="confirmarSimNaoFormulario()">
          <h1>Novo Atendimento</h1>

          <div class="col-md-3">
            <label for="data_nascimento" class="form-label">Data:</label>
            <input type="date" class="form-control" id="data" name="data" required v-model="formData_data"><br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formData.viaturaId">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="rua" class="form-label">QRU:</label>
            <input type="text" class="form-control" id="qru" name="qru" required v-model="formData.qru"  placeholder="Ex... 01/1001223-23"><br>
          </div>

          <div class="col-md-3">
            <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
            <select id="inputState2" class="form-select" required v-model="formData.tipoServicoId">
              <option v-for="tipoServico in tipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{ tipoServico.descricao }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
            <select id="inputState2" class="form-select" required v-model="formData.tipoVeiculoId">
              <option v-for="tipoVeiculo in tipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{ tipoVeiculo.modelo }}</option>
            </select>
            <br>
          </div>
          
          <div class="col-md-3">
            <label for="qth" class="form-label">QTH:</label>
            <input type="text" class="form-control" id="qth" name="qth" required v-model="formData.qth" placeholder="Ex... Marília"><br>
          </div>

          <div class="col-md-3">
            <label for="qti" class="form-label">QTI:</label>
            <input type="text" class="form-control" id="qti" name="qti" v-model="formData.qti" placeholder="Ex... São Paulo"><br>
          </div>

          <div class="col-md-3">
            <label for="km" class="form-label">Km:</label>
            <input type="text" class="form-control" id="km" name="km" v-model="formData.km"  placeholder="Ex... 1000"><br>
          </div>

          <div class="col-md-3">
            <label for="qtd_hora_parada" class="col-form-label">Hora Parada:</label>
            <input type="text" class="form-control" id="qtd_hora_parada" name="qtd_hora_parada" v-model="formData.qtd_hora_parada" placeholder="Ex... 1">
          </div>

          <div class="col-md-3">
            <label for="obs_hora_parada" class="col-form-label">Obs Hora Parada:</label>
            <input type="text" class="form-control" id="obs_hora_parada" name="obs_hora_parada" v-model="formData.obs_hora_parada" placeholder="Ex... das 19:00 às 20:00 esperando o táxi">
          </div>

          <div class="col-md-3">
            <label for="qtd_pedagio" class="col-form-label">Qtd. Pedágio:</label>
            <input type="text" class="form-control" id="qtd_pedagio" name="qtd_pedagio" v-model="formData.qtd_pedagio" placeholder="Ex... 12"><br>
          </div>

          <div class="col-md-3">
            <label for="pedagio" class="col-form-label">Pedágio R$:</label>
            <input type="text" class="form-control" id="pedagio" name="pedagio" v-model="formData.pedagio" placeholder="Ex... 120.00">
          </div>

          <div class="col-md-3">
            <label for="hospedagem" class="col-form-label">Hospedagem R$:</label>
            <input type="text" class="form-control" id="hospedagem" name="hospedagem" v-model="formData.hospedagem" placeholder="Ex... 180.50">
          </div>

          <div class="col-md-3">
            <label for="usuarioId" class="form-label">Colaborador:</label>
            <select id="inputState2" class="form-select" required v-model="formData.usuarioId">
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
            </select>
          </div>

          <div class="col-md-2">
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="noturno" name="noturno" v-model="formData.noturno">
            <label style="margin-left: 35px;" for="noturno" class="form-check-label">Adicional Noturno</label>
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="ris" name="ris" v-model="formData.ris">
            <label style="margin-left: 35px;" for="ris" class="form-check-label">RIS</label>
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins" name="patins" v-model="formData.patins">
            <label style="margin-left: 35px;" for="patins" class="form-check-label">Patins</label>
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra" name="rodaExtra" v-model="formData.rodaExtra">
            <label style="margin-left: 35px;" for="rodaExtra" class="form-check-label">Roda Extra</label>
          </div>

          <div class="col-md-2">
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins" name="cancelado" v-model="formData.cancelado">
            <label style="margin-left: 35px;" for="cancelado" class="form-check-label">Cancelado</label>
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra" name="ativo" v-model="formData.ativo">
            <label style="margin-left: 35px;" for="ativo" class="form-check-label">Ativo</label>
          </div>

          <div class="col-md-4">
            <label for="adicionais" class="col-form-label">Adicionais R$:</label>
            <input type="text" class="form-control" id="adicionais" name="adicionais" v-model="formData.adicionais" placeholder="Ex... 39.50">
            <label for="obs_adicionais" class="col-form-label">Obs:</label>
            <input type="text" class="form-control" id="obs_adicionais" name="obs_adicionais" v-model="formData.obs_adicionais" placeholder="Ex... Almoço">
            <b><label for="valor_total" class="col-form-label">Valor Total R$:</label></b>
            <input type="text" class="form-control" id="valor_total" name="valor_total" style="font-weight: bold;" disabled="isInputLocked" required v-model="formData.valor_total"><br>
          </div>          

          <div class="col-12 d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Calcular</button>
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

    <div class="modal" v-if="confirmarSimNaoModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Confirmar?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            <h5>Valor Total R$ {{ formData.valor_total }}</h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="enviarFormulario()">Cadastrar</button>
            <button type="button" class="btn btn-secondary" @click="voltarModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div> 
</main>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import getAtendimento from '../components/atendimento/getAtendimento.vue';
import getAtendimentosEmAnalise from '../components/atendimento/getAtendimento.vue';

export default {
  components: {
    axios,
    getAtendimento,
    getAtendimentosEmAnalise,
  },
  data() {
    return {
      formData: {
        data: '',
        viaturaId: '',
        qru: '',
        ris: false,
        patins: false,
        rodaExtra: false,
        tipoVeiculoId: '',
        qth: '',
        qti: '',
        km: '',
        noturno: false,
        qtd_hora_parada: '',
        obs_hora_parada: '',
        hospedagem: '',
        qtd_pedagio: '',
        pedagio: '',
        adicionais: '',
        obs_adicionais: '',
        valor_total: '',
        em_analise: false,
        cancelado: false,
        ativo: true,
        usuarioId: '',
        gerenteId: '',
        tipoServicoId: '',
      },
      showModal: false,
      successModal: false,
      confirmarSimNaoModal: false,
      formData_data: '',
      kmTotal: '',
      horaTotal: '',
    };
  },
  setup() {
    const atendimentos = ref([]);
    const searchTerm = ref(null);
    const tipoServicos = ref([]);
    const viaturas = ref([]);
    const usuarios = ref([]);
    const tipoVeiculos = ref([]);
    const veiculos = ref([]);   
    const tipoServicoLoc = ref([]);

    // Filtro
    const filteredAtendimentos = computed(() => {
      if (!searchTerm.value) {
        return atendimentos.value;
      }
      const searchTermLowerCase = searchTerm.value;
      return atendimentos.value.filter(atendimento => {
        const nomeLowerCase = atendimento.qru;
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        // console.log('GerenteId-> ', localStorage.getItem('gerenteId'));
        const response = await axios.get('https://localhost:7255/api/Atendimento/Gerente/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        atendimentos.value = response.data;
        
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseTipoServicos = await axios.get('https://localhost:7255/api/TipoServico');
        tipoServicos.value = responseTipoServicos.data;
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

    onMounted(async () => {
      try {
        const responseVeiculos = await axios.get('https://localhost:7255/api/Veiculo');
        veiculos.value = responseVeiculos.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseVeiculo = await axios.get('https://localhost:7255/api/TipoVeiculo');
        tipoVeiculos.value = responseVeiculo.data;
        // console.log('Veiculos: ', responseVeiculo.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseUsuarios = await axios.get('https://localhost:7255/api/Usuario/Colaboradores/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        usuarios.value = responseUsuarios.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      atendimentos,
      tipoServicos,
      viaturas,
      usuarios,
      tipoVeiculos,
      searchTerm,
      veiculos,
      filteredAtendimentos,
      tipoServicoLoc
    };
  },
  methods: {
    incluirAtendimento() {
      this.showModal = true;
    },
    fecharModal() {
      this.showModal = false;
      this.confirmarSimNaoModal = false;
      this.successModal = false; 
    },
    voltarModal() {
      this.confirmarSimNaoModal = false;
      this.showModal = true;
    },
    enviarFormulario() {
      this.formData.data = new Date(this.formData_data);
      if (this.formData.km == ""){
        this.formData.km = "0";
      }
      if (this.formData.qtd_hora_parada == ""){
        this.formData.qtd_hora_parada = "0";
      }
      if (this.formData.pedagio == ""){
        this.formData.pedagio = "0";
      }
      if (this.formData.qtd_pedagio == ""){
        this.formData.qtd_pedagio = "0";
      }
      if (this.formData.hospedagem == ""){
        this.formData.hospedagem = "0";
      }
      if (this.formData.adicionais == ""){
        this.formData.adicionais = "0";
      }
      this.formData.gerenteId = localStorage.getItem('gerenteId');

      axios.post('https://localhost:7255/api/Atendimento', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.data = '';
          this.formData.viaturaId = '';
          this.formData.qru = '';
          this.formData.ris = false;
          this.formData.patins = false;
          this.formData.rodaExtra = false;
          this.formData.tipoVeiculoId = '',
          this.formData.qth = '';
          this.formData.qti = '';
          this.formData.km = '';
          this.formData.noturno = false;
          this.formData.qtd_hora_parada = '';
          this.formData.obs_hora_parada = '';
          this.formData.hospedagem = '';
          this.formData.qtd_pedagio = '';
          this.formData.pedagio = '';
          this.formData.adicionais = '';
          this.formData.obs_adicionais = '';
          this.formData.valor_total = '';
          this.formData.em_analise = false;
          this.formData.cancelado = false;
          this.formData.ativo = true;
          this.formData.usuarioId = '';
          this.formData.tipoServicoId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetAtendimento.getAtendimentos();
          this.showModal = false;
          this.confirmarSimNaoModal = false;
          this.successModal = true;
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    confirmarSimNaoFormulario() {
      const tipoViatura = this.veiculos.filter(viatura => viatura.viaturaId === this.formData.viaturaId);
      const tipoServicoLoc = tipoViatura.filter(servico => servico.tipo_ServicoId === this.formData.tipoServicoId)
      const tipoVeiculoLoc = tipoServicoLoc.filter(veiculo => veiculo.tipo_VeiculoId === this.formData.tipoVeiculoId);
      // console.log('tipoVeiculoLoc-> ', tipoVeiculoLoc);

      // Efetuando a Soma
      
      if (this.formData.km == ""){
        this.kmTotal = "0";
      } else {
        this.kmTotal = (Number(this.formData.km) * Number(tipoVeiculoLoc[0].valor_km));
      }
      if (this.formData.qtd_hora_parada == ""){
        this.horaTotal = "0";
      } else {
        this.horaTotal = (Number(this.formData.qtd_hora_parada) * Number(tipoVeiculoLoc[0].hora_parada));
      }
      if (this.formData.pedagio == ""){
        this.formData.pedagio = "0";
      }
      if (this.formData.qtd_pedagio == ""){
        this.formData.qtd_pedagio = "0";
      }
      if (this.formData.hospedagem == ""){
        this.formData.hospedagem = "0";
      } 
      if (this.formData.adicionais == ""){
        this.formData.adicionais = "0";
      }      
      
      if (this.formData.noturno == true){
        this.formData.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formData.pedagio) + Number(this.formData.hospedagem) + Number(this.formData.adicionais) + Number(tipoVeiculoLoc[0].adicional_noturno)).toFixed(2);
      } else {
        this.formData.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formData.pedagio) + Number(this.formData.hospedagem) + Number(this.formData.adicionais)).toFixed(2);
      }

      if (this.formData.ris == true){
        this.formData.valor_total = ((Number(this.formData.valor_total)) + (Number(tipoVeiculoLoc[0].ris))).toFixed(2)
      }
      if (this.formData.patins == true){
        this.formData.valor_total = ((Number(this.formData.valor_total)) + (Number(tipoVeiculoLoc[0].patins))).toFixed(2)
      }
      if (this.formData.rodaExtra == true){
        this.formData.valor_total = ((Number(this.formData.valor_total)) + (Number(tipoVeiculoLoc[0].rodaExtra))).toFixed(2)
      }      

      this.showModal = false;
      this.confirmarSimNaoModal = true;
    },
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate();
      const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // Formatar a data como "DD/MM/YYYY"
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    },
    emAnalisaAtendimento() {
      this.$refs.componentGetAtendimento.getAtendimentosEmAnalise();
    },
    limparPesquisa() {
      this.$refs.componentGetAtendimento.getAtendimentos();
    }
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