<template>
  <main class="faturamento">
  <div class="row">
    <div class="d-flex justify-content">
      <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-hand-holding-medical" ></i>
      <div style="margin-left: 20px;" class="col">
        <h1>Adicionar Atendimento</h1>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center">
          <button class="btn btn-primary mr-3" @click="incluirAtendimento()">Incluir Atendimento</button>
      </div>
    </div>
  </div>

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
            <input type="text" class="form-control" id="qru" name="qru" required v-model="formData.qru"><br>
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
            <input type="text" class="form-control" id="qth" name="qth" required v-model="formData.qth"><br>
          </div>

          <div class="col-md-3">
            <label for="qti" class="form-label">QTI:</label>
            <input type="text" class="form-control" id="qti" name="qti" v-model="formData.qti"><br>
          </div>

          <div class="col-md-3">
            <label for="km" class="form-label">Km:</label>
            <input type="text" class="form-control" id="km" name="km" v-model="formData.km"><br>
          </div>

          <div class="col-md-3">
            <label for="qtd_hora_parada" class="col-form-label">Hora Parada:</label>
            <input type="text" class="form-control" id="qtd_hora_parada" name="qtd_hora_parada" v-model="formData.qtd_hora_parada">
          </div>

          <div class="col-md-3">
            <label for="obs_hora_parada" class="col-form-label">Obs Hora Parada:</label>
            <input type="text" class="form-control" id="obs_hora_parada" name="obs_hora_parada" v-model="formData.obs_hora_parada">
          </div>

          <div class="col-md-3">
            <label for="qtd_pedagio" class="col-form-label">Qtd. Pedágio:</label>
            <input type="text" class="form-control" id="qtd_pedagio" name="qtd_pedagio" v-model="formData.qtd_pedagio"><br>
          </div>

          <div class="col-md-3">
            <label for="pedagio" class="col-form-label">Pedágio R$:</label>
            <input type="text" class="form-control" id="pedagio" name="pedagio" v-model="formData.pedagio">
          </div>

          <div class="col-md-3">
            <label for="hospedagem" class="col-form-label">Hospedagem R$:</label>
            <input type="text" class="form-control" id="hospedagem" name="hospedagem" v-model="formData.hospedagem">
          </div>

          <div class="col-md-3">
            <label for="usuarioId" class="form-label">Usuário:</label>
            <select id="inputState2" class="form-select" required v-model="formData.usuarioId">
              <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <br>
            <label for="noturno" class="form-check-label">Adicional Noturno</label>
            <input style="font-size: 20px; margin-left: 20px;" type="checkbox" class="form-check-input" id="noturno" name="noturno" v-model="formData.noturno">
          </div>

          <div class="col-md-3">
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

    <div class="input-group input-group-sm mb-3">
      <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por QRU" />
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Data</th>
          <th scope="col">Sigla</th>
          <th scope="col">QRU</th>
          <th scope="col">Tipo Serviço</th>
          <th scope="col">Tipo Veículo</th>
          <th scope="col">QTH</th>
          <th scope="col">QTI</th>
          <th scope="col">Km</th>
          <th scope="col">Adic. Noturno</th>
          <th scope="col">Hora Parada</th>
          <th scope="col">Obs.</th>
          <th scope="col">Hospedagem</th>
          <th scope="col">Qtd. Pedágio</th>
          <th scope="col">Pedágio</th>
          <th scope="col">Valor R$</th>
          <th scope="col">Usuário</th>
          <th scope="col"></th>
          <th scope="col">Em Análise</th>
        </tr>
      </thead>
      <getAtendimento v-for="atendimento in filteredAtendimentos" 
        :key="atendimento.id" 
        :id="atendimento.id"
        :data="this.parseData(atendimento.data)"
        :viaturaId="obterViatura(atendimento.viaturaId)"
        :qru="atendimento.qru"
        :tipoServicoId="obterDescricaoTipo(atendimento.tipoServicoId)" 
        :tipoVeiculoId="obterDescricaoTipoVeiculo(atendimento.tipoVeiculoId)" 
        :qth="atendimento.qth"
        :qti="atendimento.qti"
        :km="atendimento.km"
        :noturno="atendimento.noturno"
        :qtd_hora_parada="atendimento.qtd_hora_parada"
        :obs_hora_parada="atendimento.obs_hora_parada"
        :hospedagem="atendimento.hospedagem.toFixed(2)"
        :qtd_pedagio="atendimento.qtd_pedagio"
        :pedagio="atendimento.pedagio.toFixed(2)"
        :valor_total="atendimento.valor_total.toFixed(2)"        
        :usuarioId="obterUsuario(atendimento.usuarioId)"
        :data_original="atendimento.data"
        :viaturaId_original="atendimento.viaturaId"
        :tipoServicoId_original="atendimento.tipoServicoId"
        :tipoVeiculoId_original="atendimento.tipoVeiculoId"
        :usuarioId_original="atendimento.usuarioId"
        :listTipoServicos="tipoServicos"
        :listTipoVeiculos="tipoVeiculos"
        :listViaturas="viaturas"
        :listUsuarios="usuarios"
        :listVeiculos="veiculos"
        :em_analise="atendimento.em_analise"/>
    </table>
</main>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import getAtendimento from '../components/atendimento/getAtendimento.vue';
import ColaboradorViewVue from './ColaboradorView.vue';

axios.interceptors.request.use((config) => {
    // console.log('Dados a serem enviados:', config.data);
    return config;
});

export default {
  components: {
    axios,
    getAtendimento,
  },
  data() {
    return {
      formData: {
        data: '',
        viaturaId: '',
        qru: '',
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
        valor_total: '',
        em_analise: false,
        usuarioId: '',
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
    const kmTotal = ref('');
    const horaTotal = ref('');

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
        const response = await axios.get('https://localhost:7255/api/Atendimento', {
          // headers: {
          //   'Authorization': `Bearer ${localStorage.getItem('token')}`
          // }
        });
        atendimentos.value = response.data;
        // console.log('Dados retornados da API Atemdimento', response.data);
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
        const responseUsuarios = await axios.get('https://localhost:7255/api/Usuario', {
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

      axios.post('https://localhost:7255/api/Atendimento', this.formData, {
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // },
      })
        .then(response => {
          // console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.data = '';
          this.formData.viaturaId = '';
          this.formData.qru = '';
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
          this.formData.valor_total = '';
          this.formData.em_analise = false;
          this.formData.usuarioId = '';
          this.formData.tipoServicoId = '';

          // Exibir o modal de sucesso
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
      
      if (this.formData.noturno == true){
        this.formData.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formData.pedagio) + Number(this.formData.hospedagem) + Number(tipoVeiculoLoc[0].adicional_noturno)).toFixed(2);
      } else {
        this.formData.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formData.pedagio) + Number(this.formData.hospedagem)).toFixed(2);
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
    // Método para obter a descrição do Tipo de Serviço com base no tipoServicoId
    obterDescricaoTipo(tipoServicoId) {
      const tipoServico = this.tipoServicos.find(c => c.id === tipoServicoId);
      return tipoServico ? tipoServico.descricao : 'Tipo de Serviço Desconhecido';
    },
    // Método para obter a descrição do Tipo de Veículo com base no tipoVeiculoId
    obterDescricaoTipoVeiculo(tipoVeiculoId) {
      const tipoVeiculo = this.tipoVeiculos.find(c => c.id === tipoVeiculoId);
      return tipoVeiculo ? tipoVeiculo.modelo : 'Tipo de Veículo Desconhecido';
    },
    // Método para obter a viatura com base no viaturaId
    obterViatura(viaturaId) {
      const viatura = this.viaturas.find(c => c.id === viaturaId);
      return viatura ? viatura.sigla : 'Viatura Desconhecida';
    },
    // Método para obter o Usuário com base no usuarioId
    obterUsuario(usuarioId) {
      const usuario = this.usuarios.find(c => c.id === usuarioId);
      return usuario ? usuario.nome : 'Usuário Desconhecido';
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