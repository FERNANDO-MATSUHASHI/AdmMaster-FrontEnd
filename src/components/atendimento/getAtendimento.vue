  <script setup>
  const props = defineProps(["id", "data", "qru", "ris", "patins", "rodaExtra", "tipoServicoId", "tipoVeiculoId", "qth", "qti", "km", "noturno", "qtd_hora_parada", "obs_hora_parada", "hospedagem", "qtd_pedagio", "pedagio", "adicionais", "obs_adicionais", "valor_total", "em_analise", "viaturaId", "usuarioId", "data_original", "viaturaId_original", "tipoServicoId_original", "tipoVeiculoId_original", "usuarioId_original", "listTipoServicos", "listViaturas", "listUsuarios", "listTipoVeiculos", "listVeiculos"]);

  </script>

  <template>
    <tbody>
      <tr>
        <th scope="row">{{ data }}</th>
        <td>{{ viaturaId }}</td>
        <td>{{ qru }}</td>
        <td>{{ ris ? 'Sim' : 'Não' }}</td>
        <td>{{ patins ? 'Sim' : 'Não' }}</td>
        <td>{{ rodaExtra ? 'Sim' : 'Não' }}</td>
        <td>{{ tipoServicoId }}</td>
        <td>{{ tipoVeiculoId }}</td>
        <td>{{ qth }}</td>
        <td>{{ qti }}</td>
        <td>{{ km }}</td>
        <td>{{ noturno ? 'Sim' : 'Não' }}</td>
        <td>{{ qtd_hora_parada }}</td>
        <td>{{ obs_hora_parada }}</td>
        <td>{{ hospedagem }}</td>
        <td>{{ qtd_pedagio }}</td>
        <td>{{ pedagio }}</td>
        <td>{{ adicionais }}</td>
        <td>{{ obs_adicionais }}</td>
        <td>{{ valor_total }}</td>
        <td>{{ usuarioId }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" style="font-size: 20px; cursor: pointer;" @click="editarAtendimento()"></i>
        </td>
        <td><i style="cursor: pointer;" @click="emAnalise()">{{ em_analise ? 'Sim' : 'Não' }}</i></td>

      </tr>
    </tbody>

    <!-- Formulário Editar -->
    <div class="modal" v-if="editarModal">
      <div class="modal-content">
        <span class="close" @click="fecharModal()">&times;</span>

        <form id="modalForm" class="row" @submit.prevent="confirmarSimNaoFormulario()">
          <h1>Editar Atendimento</h1>

          <div class="col-md-3">
            <label for="data_nascimento" class="form-label">Data:</label>
            <input type="date" class="form-control" id="data" name="data" required v-model="formDataPut.data"><br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId">
              <option v-for="viatura in listViaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="rua" class="form-label">QRU:</label>
            <input type="text" class="form-control" id="qru" name="qru" required v-model="formDataPut.qru"><br>
          </div>

          <div class="col-md-3">
            <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipoServicoId">
              <option v-for="tipoServico in listTipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{
                tipoServico.descricao }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipoVeiculoId">
              <option v-for="tipoVeiculo in listTipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{
                tipoVeiculo.modelo }}</option>
            </select>
            <br>
          </div>

          <div class="col-md-3">
            <label for="qth" class="form-label">QTH:</label>
            <input type="text" class="form-control" id="qth" name="qth" required v-model="formDataPut.qth"><br>
          </div>

          <div class="col-md-3">
            <label for="qti" class="form-label">QTI:</label>
            <input type="text" class="form-control" id="qti" name="qti" v-model="formDataPut.qti"><br>
          </div>

          <div class="col-md-3">
            <label for="km" class="form-label">Km:</label>
            <input type="text" class="form-control" id="km" name="km" v-model="formDataPut.km"><br>
          </div>

          <div class="col-md-3">
            <label for="qtd_hora_parada" class="col-form-label">Hora Parada:</label>
            <input type="text" class="form-control" id="qtd_hora_parada" name="qtd_hora_parada" 
              v-model="formDataPut.qtd_hora_parada">
          </div>

          <div class="col-md-3">
            <label for="obs_hora_parada" class="col-form-label">Obs Hora Parada:</label>
            <input type="text" class="form-control" id="obs_hora_parada" name="obs_hora_parada" 
              v-model="formDataPut.obs_hora_parada">
          </div>

          <div class="col-md-3">
            <label for="qtd_pedagio" class="col-form-label">Qtd. Pedágio:</label>
            <input type="text" class="form-control" id="qtd_pedagio" name="qtd_pedagio" 
              v-model="formDataPut.qtd_pedagio"><br>
          </div>

          <div class="col-md-3">
            <label for="pedagio" class="col-form-label">Pedágio R$:</label>
            <input type="text" class="form-control" id="pedagio" name="pedagio" v-model="formDataPut.pedagio">
          </div>

          <div class="col-md-3">
            <label for="hospedagem" class="col-form-label">Hospedagem R$:</label>
            <input type="text" class="form-control" id="hospedagem" name="hospedagem" 
              v-model="formDataPut.hospedagem">
          </div>

          <div class="col-md-3">
            <label for="usuarioId" class="form-label">Colaborador:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.usuarioId">
              <option v-for="usuario in listUsuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
            </select>
          </div>

          <div class="col-md-2">
              <br>
              <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="noturno" name="noturno" v-model="formDataPut.noturno">
              <label style="margin-left: 35px;" for="noturno" class="form-check-label">Adicional Noturno</label>
              <br>
              <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="ris" name="ris" v-model="formDataPut.ris">
              <label style="margin-left: 35px;" for="ris" class="form-check-label">RIS</label>
              <br>
              <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins" name="patins" v-model="formDataPut.patins">
              <label style="margin-left: 35px;" for="patins" class="form-check-label">Patins</label>
              <br>
              <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra" name="rodaExtra" v-model="formDataPut.rodaExtra">
              <label style="margin-left: 35px;" for="rodaExtra" class="form-check-label">Roda Extra</label>
            </div>

            <div class="col-md-4">
              <label for="adicionais" class="col-form-label">Adicionais R$:</label>
              <input type="text" class="form-control" id="adicionais" name="adicionais" v-model="formDataPut.adicionais">
              <label for="obs_adicionais" class="col-form-label">Obs:</label>
              <input type="text" class="form-control" id="obs_adicionais" name="obs_adicionais" v-model="formDataPut.obs_adicionais">
              <b><label for="valor_total" class="col-form-label">Valor Total R$:</label></b>
              <input type="text" class="form-control" id="valor_total" name="valor_total" style="font-weight: bold;" disabled="isInputLocked" required v-model="formDataPut.valor_total"><br>
            </div> 

          <div class="col-12 d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Calcular</button>
          </div>

        </form>
      </div>
    </div>

    <div class="modal" v-if="successModal">
      <div class="modal-dialog">
        <div class="msg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
                @click="fecharModal()"></button>
            </div>
            <div class="modal-body">
              Atendimento atualizado com sucesso!
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" @click="fecharModal()">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="emAnaliseModal">
      <div class="modal-dialog">
        <div class="msg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="successModalLabel">Mudança de Status</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
                @click="fecharModal()"></button>
            </div>
            <div class="modal-body">
              Mudar o Status de Em Análise?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" @click="alterarEmAnalise()">Sim</button>
              <button type="button" class="btn btn-secondary" @click="fecharModal()">Não</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" v-if="confirmarSimNaoModal">
        <div class="modal-dialog">
          <div class="msg">
          <div class="modal-content">
            
            <div class="modal-header">
              <h5 class="modal-title" id="successModalLabel">Confirmar?</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar" @click="voltarModal()"></button>
            </div>
            <div class="modal-body">
              <h5>Valor Total R$ {{ formDataPut.valor_total }}</h5>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="editarFormulario()">Cadastrar</button>
              <button type="button" class="btn btn-secondary" @click="voltarModal()">Fechar</button>
            </div>
            
          </div>
          </div>
        </div>
      </div>
  </template>

  <script>
  import axios from 'axios';

  export default {
    components: {
      axios
    },
    data() {
      return {
        formDataPut: {
          data: '',
          viaturaId: '',
          qru: '',
          ris: false,
          patins: false,
          rodaExtra: false,
          tipoServicoId: '',
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
          usuarioId: '',
          em_analise: false
        },
        editarModal: false,
        successModal: false,
        excluirModal: false,
        excluirSimNaoModal: false,
        successExcluirModal: false,
        emAnaliseModal: false,
        formData_nascimentoPut: '',
      }
    },
    methods: {
      fecharModal() {
        this.editarModal = false;
        this.successModal = false;
        this.excluirModal = false;
        this.excluirSimNaoModal = false;
        this.successExcluirModal = false;
        this.emAnaliseModal = false;
      },
      voltarModal() {
        this.confirmarSimNaoModal = false;
        this.editarModal = true;
      },
      editarAtendimento() {
        this.formDataPut.data = this.parseData(this.data_original);
        this.formDataPut.viaturaId = this.viaturaId_original;
        this.formDataPut.qru = this.qru.toString();
        this.formDataPut.ris = this.ris;
        this.formDataPut.patins = this.patins;
        this.formDataPut.rodaExtra = this.rodaExtra;
        this.formDataPut.tipoServicoId = this.tipoServicoId_original;
        this.formDataPut.tipoVeiculoId = this.tipoVeiculoId_original;
        this.formDataPut.qth = this.qth.toString();
        this.formDataPut.qti = this.qti.toString();
        this.formDataPut.km = this.km.toString();
        this.formDataPut.noturno = this.noturno;
        this.formDataPut.qtd_hora_parada = this.qtd_hora_parada.toString();
        this.formDataPut.obs_hora_parada = this.obs_hora_parada.toString();
        this.formDataPut.hospedagem = this.hospedagem;
        this.formDataPut.qtd_pedagio = this.qtd_pedagio.toString();
        this.formDataPut.pedagio = this.pedagio;
        this.formDataPut.adicionais = this.adicionais;
        this.formDataPut.obs_adicionais = this.obs_adicionais.toString();
        this.formDataPut.valor_total = this.valor_total;
        this.formDataPut.em_analise = this.em_analise;
        this.formDataPut.usuarioId = this.usuarioId_original;

        this.editarModal = true;
      },
      editarFormulario() {
        this.formDataPut.data = new Date(this.formDataPut.data);

        axios.put('https://localhost:7255/api/Atendimento/' + this.id, this.formDataPut, {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => {
            // Limpar o formulário
            this.formDataPut.data = '';
            this.formDataPut.viaturaId = '';
            this.formDataPut.qru = '';
            this.formDataPut.ris = false;
            this.formDataPut.patins = false;
            this.formDataPut.rodaExtra = false;
            this.formDataPut.tipoServicoId = '';
            this.formDataPut.tipoVeiculoId = '';
            this.formDataPut.qth = '';
            this.formDataPut.qti = '';
            this.formDataPut.km = '';
            this.formDataPut.noturno = false;
            this.formDataPut.qtd_hora_parada = '';
            this.formDataPut.obs_hora_parada = '';
            this.formDataPut.hospedagem = '';
            this.formDataPut.qtd_pedagio = '';
            this.formDataPut.pedagio = '';
            this.formDataPut.adicionais = '';
            this.formDataPut.obs_adicionais = '';
            this.formDataPut.valor_total = '';
            this.formDataPut.usuarioId = '';
            this.formDataPut.em_analise = false;

            // Exibir o modal de sucesso
            this.editarModal = false;
            this.confirmarSimNaoModal = false;
            this.successModal = true;
          })
          .catch(error => {
            console.error('Erro ao enviar formulário:', error);
          });
      },
      confirmarSimNaoFormulario() {
        const tipoViatura = this.listVeiculos.filter(viatura => viatura.viaturaId === this.formDataPut.viaturaId);
        const tipoServicoLoc = tipoViatura.filter(servico => servico.tipo_ServicoId === this.formDataPut.tipoServicoId)
        const tipoVeiculoLoc = tipoServicoLoc.filter(veiculo => veiculo.tipo_VeiculoId === this.formDataPut.tipoVeiculoId);

        // Efetuando a Soma
        
        if (this.formDataPut.km == ""){
          this.kmTotal = "0";
        } else {
          this.kmTotal = (Number(this.formDataPut.km) * Number(tipoVeiculoLoc[0].valor_km));
        }
        if (this.formDataPut.qtd_hora_parada == ""){
          this.horaTotal = "0";
        } else {
          this.horaTotal = (Number(this.formDataPut.qtd_hora_parada) * Number(tipoVeiculoLoc[0].hora_parada));
        }
        if (this.formDataPut.pedagio == ""){
          this.formDataPut.pedagio = "0";
        }
        if (this.formDataPut.qtd_pedagio == ""){
          this.formDataPut.qtd_pedagio = "0";
        }
        if (this.formDataPut.hospedagem == ""){
          this.formDataPut.hospedagem = "0";
        }      
        if (this.formDataPut.adicionais == ""){
          this.formDataPut.adicionais = "0";
        }
        
        if (this.formDataPut.noturno == true){
          this.formDataPut.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formDataPut.pedagio) + Number(this.formDataPut.hospedagem) + Number(this.formDataPut.adicionais) + Number(tipoVeiculoLoc[0].adicional_noturno)).toFixed(2);
        } else {
          this.formDataPut.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formDataPut.pedagio) + Number(this.formDataPut.hospedagem) + Number(this.formDataPut.adicionais)).toFixed(2);
        }

        if (this.formDataPut.ris == true){
          this.formDataPut.valor_total = ((Number(this.formDataPut.valor_total)) + (Number(tipoVeiculoLoc[0].ris))).toFixed(2)
        }
        if (this.formDataPut.patins == true){
          this.formDataPut.valor_total = ((Number(this.formDataPut.valor_total)) + (Number(tipoVeiculoLoc[0].patins))).toFixed(2)
        }
        if (this.formDataPut.rodaExtra == true){
          this.formDataPut.valor_total = ((Number(this.formDataPut.valor_total)) + (Number(tipoVeiculoLoc[0].rodaExtra))).toFixed(2)
        } 

        this.editarModal = false;
        this.confirmarSimNaoModal = true;
      },
      parseData(dataString) {
        const data = new Date(dataString);
        const dia = data.getUTCDate().toString().padStart(2, '0');
        const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
        const ano = data.getUTCFullYear();

        return `${ano}-${mes}-${dia}`;
      },
      emAnalise() {
        this.emAnaliseModal = true;
      },
      alterarEmAnalise() {
        this.formDataPut.data = this.parseData(this.data_original);
        this.formDataPut.viaturaId = this.viaturaId_original;
        this.formDataPut.qru = this.qru.toString();
        this.formDataPut.ris = this.ris;
        this.formDataPut.patins = this.patins;
        this.formDataPut.rodaExtra = this.rodaExtra;
        this.formDataPut.tipoServicoId = this.tipoServicoId_original;
        this.formDataPut.tipoVeiculoId = this.tipoVeiculoId_original;
        this.formDataPut.qth = this.qth.toString();
        this.formDataPut.qti = this.qti.toString();
        this.formDataPut.km = this.km.toString();
        this.formDataPut.noturno = this.noturno;
        this.formDataPut.qtd_hora_parada = this.qtd_hora_parada.toString();
        this.formDataPut.obs_hora_parada = this.obs_hora_parada.toString();
        this.formDataPut.hospedagem = this.hospedagem;
        this.formDataPut.qtd_pedagio = this.qtd_pedagio.toString();
        this.formDataPut.pedagio = this.pedagio;
        this.formDataPut.adicionais = this.adicionais;
        this.formDataPut.obs_adicionais = this.obs_adicionais.toString();
        this.formDataPut.valor_total = this.valor_total;
        this.formDataPut.usuarioId = this.usuarioId_original;

        // Condição para mudança do Status da Análise
        if (this.em_analise == true){
          this.formDataPut.em_analise = false;
        }else{
          this.formDataPut.em_analise = true;
        };

        this.formDataPut.data = new Date(this.formDataPut.data);

        axios.put('https://localhost:7255/api/Atendimento/' + this.id, this.formDataPut, {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => {
            // Limpar o formulário
            this.formDataPut.data = '';
            this.formDataPut.viaturaId = '';
            this.formDataPut.qru = '';
            this.formDataPut.ris = false;
            this.formDataPut.patins = false;
            this.formDataPut.rodaExtra = false;
            this.formDataPut.tipoServicoId = '';
            this.formDataPut.tipoVeiculoId = '';
            this.formDataPut.qth = '';
            this.formDataPut.qti = '';
            this.formDataPut.km = '';
            this.formDataPut.noturno = false;
            this.formDataPut.qtd_hora_parada = '';
            this.formDataPut.obs_hora_parada = '';
            this.formDataPut.hospedagem = '';
            this.formDataPut.qtd_pedagio = '';
            this.formDataPut.pedagio = '';
            this.formDataPut.adicionais = '';
            this.formDataPut.obs_adicionais = '';
            this.formDataPut.valor_total = '';
            this.formDataPut.usuarioId = '';
            this.formDataPut.em_analise = false;

            this.emAnaliseModal = false;
          })
          .catch(error => {
            console.error('Erro ao enviar formulário:', error);
          });
      },
      calcularSomaEditar() {
        // Calcula a soma dos valores dos campos de entrada
        this.formDataPut.valor_total = this.formDataPut.km * 2.70;
      }
    }
  }
  </script>

  <style>
  .msg {
    background-color: #fefefe;
  }

  .close {
    margin-right: auto;
  }

  .row {
    text-align: left;
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