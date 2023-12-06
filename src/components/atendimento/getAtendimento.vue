<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por QRU" />
  </div>

  <table class="tabela table table-hover">
    <thead>
      <tr>
        <th scope="col">Data</th>
        <th scope="col">Sigla</th>
        <th scope="col">QRU</th>
        <th scope="col">RIS</th>
        <th scope="col">Tipo Serviço</th>
        <th scope="col">Tipo Veículo</th>
        <th scope="col">QTH</th>
        <th scope="col">QTI</th>
        <th scope="col">Km</th>
        <th scope="col">Adic. Noturno</th>
        <th scope="col">Valor</th>
        <th scope="col">Colaborador</th>
        <th scope="col">Opções</th>
        <th scope="col">Cancelado</th>
        <th scope="col">Ativo</th>
        <th scope="col">Em Análise</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredAtendimentos.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="atendimento in filteredAtendimentos">
        <th class="largura" scope="row">{{ parseDataGet(atendimento.data) }}</th>
        <td>{{ obterViatura(atendimento.viaturaId) }}</td>
        <td class="largura">{{ atendimento.qru }}</td>
        <td>{{ atendimento.ris ? 'Sim' : 'Não' }}</td>
        <td>{{ obterDescricaoTipo(atendimento.tipoServicoId) }}</td>
        <td>{{ obterDescricaoTipoVeiculo(atendimento.tipoVeiculoId) }}</td>
        <td>{{ atendimento.qth }}</td>
        <td>{{ atendimento.qti }}</td>
        <td>{{ atendimento.km }}</td>
        <td>{{ atendimento.noturno ? 'Sim' : 'Não' }}</td>
        <td>{{ atendimento.valor_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ obterUsuario(atendimento.usuarioId) }}</td>

        <td>
          <i class="fi-rr-edit" style="font-size: 20px; cursor: pointer;" @click="editarAtendimento(atendimento)" data-toggle="tooltip" data-placement="top" title="Editar"></i>
          <i class="fi fi-rr-add" style="margin-left: 12px; font-size: 20px; cursor: pointer;"  @click="maisInfoAtendimento(atendimento)"  data-toggle="tooltip" data-placement="top" title="Mais Informações"></i>
        </td>

        <td :style="{ color: atendimento.cancelado ? 'red' : 'black' }"><i style="cursor: pointer;" @click="cancelado(atendimento)" data-toggle="tooltip" data-placement="top" title="Serviço Cancelado - Alterar Status">{{ atendimento.cancelado ? 'Sim' : 'Não' }}</i></td>
        <td :style="{ color: atendimento.ativo ? 'black' : 'red' }"><i style="cursor: pointer;" @click="ativo(atendimento)" data-toggle="tooltip" data-placement="top" title="Serviço Ativo - Alterar Status">{{ atendimento.ativo ? 'Sim' : 'Não' }}</i></td>

        <td :style="{ color: atendimento.em_analise ? 'red' : 'black' }"><i style="cursor: pointer;" @click="emAnalise(atendimento)" data-toggle="tooltip" data-placement="top" title="Serviço em Análise - Alterar Status">{{ atendimento.em_analise ? 'Sim' : 'Não' }}</i></td>

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

      <form id="modalForm" class="row" @submit.prevent="confirmarSimNaoFormulario()">
        <h1>Editar Atendimento</h1>

        <div class="col-md-3">
          <label for="data_nascimento" class="form-label">Data:</label>
          <input type="date" class="form-control" id="data" name="data" required v-model="formDataPut.data"><br>
        </div>

        <div class="col-md-3">
          <label for="viaturaId" class="form-label">Viatura:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId">
            <option v-for="viatura in this.viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="rua" class="form-label">QRU:</label>
          <input type="text" class="form-control" id="qru" name="qru" required v-model="formDataPut.qru"><br>
        </div>

        <div class="col-md-3">
          <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.tipoServicoId">
            <option v-for="tipoServico in this.tipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{
              tipoServico.descricao }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.tipoVeiculoId">
            <option v-for="tipoVeiculo in this.tipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{
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
          <input type="text" class="form-control" id="hospedagem" name="hospedagem" v-model="formDataPut.hospedagem">
        </div>

        <div class="col-md-3">
          <label for="usuarioId" class="form-label">Colaborador:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.usuarioId">
            <option v-for="usuario in this.usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
          </select>
        </div>

        <div class="col-md-2">
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="noturno"
            name="noturno" v-model="formDataPut.noturno">
          <label style="margin-left: 35px;" for="noturno" class="form-check-label">Adicional Noturno</label>
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="ris" name="ris"
            v-model="formDataPut.ris">
          <label style="margin-left: 35px;" for="ris" class="form-check-label">RIS</label>
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins"
            name="patins" v-model="formDataPut.patins">
          <label style="margin-left: 35px;" for="patins" class="form-check-label">Patins</label>
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra"
            name="rodaExtra" v-model="formDataPut.rodaExtra">
          <label style="margin-left: 35px;" for="rodaExtra" class="form-check-label">Roda Extra</label>
        </div>

        <div class="col-md-2">
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins" name="cancelado" v-model="formDataPut.cancelado">
            <label style="margin-left: 35px;" for="cancelado" class="form-check-label">Cancelado</label>
            <br>
            <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra" name="ativo" v-model="formDataPut.ativo">
            <label style="margin-left: 35px;" for="ativo" class="form-check-label">Ativo</label>
          </div>

        <div class="col-md-4">
          <label for="adicionais" class="col-form-label">Adicionais R$:</label>
          <input type="text" class="form-control" id="adicionais" name="adicionais" v-model="formDataPut.adicionais">
          <label for="obs_adicionais" class="col-form-label">Obs:</label>
          <input type="text" class="form-control" id="obs_adicionais" name="obs_adicionais"
            v-model="formDataPut.obs_adicionais">
          <b><label for="valor_total" class="col-form-label">Valor Total R$:</label></b>
          <input type="text" class="form-control" id="valor_total" name="valor_total" style="font-weight: bold;"
            disabled="isInputLocked" required v-model="formDataPut.valor_total"><br>
        </div>

        <div class="col-12 d-flex justify-content-between">
          <button type="submit" class="btn btn-primary">Calcular</button>
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
      <div class="msg1">
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
            <button type="button" class="btn btn-danger" @click="alterarEmAnalise(this.atendimentoID)">Sim</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Não</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="canceladoModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Mudança de Status</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Mudar o Status do Cancelamento?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="alterarCancelado(this.atendimentoID)">Sim</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Não</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="ativoModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Mudança de Status</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Mudar o Status Ativo?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="alterarAtivo(this.atendimentoID)">Sim</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Não</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="confirmarSimNaoModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Confirmar?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="voltarModal()"></button>
          </div>
          <div class="modal-body">
            <h5>Valor Total R$ {{ formDataPut.valor_total }}</h5>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="editarFormulario(this.atendimentoID)">Cadastrar</button>
            <button type="button" class="btn btn-secondary" @click="voltarModal()">Fechar</button>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Formulário Mais Informações -->
  <div class="modal" v-if="maisInfoModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>

      <form id="modalForm" class="row">
        <h1>Informações do Atendimento</h1>

        <div class="col-md-2">
          <label for="rua" class="form-label">QRU:</label>
          <input type="text" class="form-control" id="qru" name="qru" required v-model="formDataPut.qru" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-2">
          <label for="qtd_hora_parada" class="col-form-label">Hora Parada:</label>
          <input type="text" class="form-control" id="qtd_hora_parada" name="qtd_hora_parada" v-model="formDataPut.qtd_hora_parada" disabled="isInputLocked">
        </div>

        <div class="col-md-3">
          <label for="obs_hora_parada" class="col-form-label">Obs Hora Parada:</label>
          <input type="text" class="form-control" id="obs_hora_parada" name="obs_hora_parada" v-model="formDataPut.obs_hora_parada" disabled="isInputLocked">
        </div>

        <div class="col-md-2">
          <label for="qtd_pedagio" class="col-form-label">Qtd. Pedágio:</label>
          <input type="text" class="form-control" id="qtd_pedagio" name="qtd_pedagio" v-model="formDataPut.qtd_pedagio" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-3">
          <label for="pedagio" class="col-form-label">Pedágio R$:</label>
          <input type="text" class="form-control" id="pedagio" name="pedagio" v-model="formDataPut.pedagio" disabled="isInputLocked">
        </div>

        <div class="col-md-3">
          <label for="hospedagem" class="col-form-label">Hospedagem R$:</label>
          <input type="text" class="form-control" id="hospedagem" name="hospedagem" v-model="formDataPut.hospedagem" disabled="isInputLocked">
        </div>

        <div class="col-md-2">
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="patins" name="patins" v-model="formDataPut.patins" disabled="isInputLocked">
          <label style="margin-left: 35px;" for="patins" class="form-check-label">Patins</label>
          <br>
          <input style="font-size: 20px; margin-left: 5px;" type="checkbox" class="form-check-input" id="rodaExtra" name="rodaExtra" v-model="formDataPut.rodaExtra" disabled="isInputLocked">
          <label style="margin-left: 35px;" for="rodaExtra" class="form-check-label">Roda Extra</label>
        </div>

        <div class="col-md-4">
          <label for="adicionais" class="col-form-label">Adicionais R$:</label>
          <input type="text" class="form-control" id="adicionais" name="adicionais" v-model="formDataPut.adicionais" disabled="isInputLocked">
        </div>

        <div class="col-md-3">
          <label for="obs_adicionais" class="col-form-label">Obs:</label>
          <input type="text" class="form-control" id="obs_adicionais" name="obs_adicionais" v-model="formDataPut.obs_adicionais" disabled="isInputLocked">
        </div>

      </form>
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
        em_analise: false,
        cancelado: false,
        ativo: true
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      emAnaliseModal: false,
      formData_nascimentoPut: '',
      atendimentoID: 0,
      maisInfoModal: false,
      canceladoModal: false,
      ativoModal: false
    }
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
        const response = await axios.get('https://localhost:7255/api/Atendimento/Gerente/' + localStorage.getItem('gerenteId'), {
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
        const responseUsuarios = await axios.get('https://localhost:7255/api/Usuario/Colaboradores/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        usuarios.value = responseUsuarios.data;
        // console.log('Colaboradores-> ', responseUsuarios.data);
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
    getAtendimentos() {
      axios.get('https://localhost:7255/api/Atendimento/Gerente/' + localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredAtendimentos = res.data;
            this.atendimentos = res.data;
            return;
          }
          this.filteredAtendimentos = [];
          return;
        });
    },
    getAtendimentosEmAnalise() {
      axios.get('https://localhost:7255/api/Atendimento/Em_Analise/' + localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredAtendimentos = res.data;
            this.atendimentos = res.data;
            return;
          }
          this.filteredAtendimentos = [];
          return;
        });
      //https://localhost:7255/api/Atendimento/Em_Analise/2
    },
    fecharModal() {
      this.editarModal = false;
      this.successModal = false;
      this.excluirModal = false;
      this.excluirSimNaoModal = false;
      this.successExcluirModal = false;
      this.emAnaliseModal = false;
      this.maisInfoModal = false;
      this.canceladoModal= false;
      this.ativoModal= false;
    },
    voltarModal() {
      this.confirmarSimNaoModal = false;
      this.editarModal = true;
    },
    editarAtendimento(atendimento) {
      this.formDataPut.data = this.parseData(atendimento.data);
      this.formDataPut.viaturaId = atendimento.viaturaId;
      this.formDataPut.qru = atendimento.qru.toString();
      this.formDataPut.ris = atendimento.ris;
      this.formDataPut.patins = atendimento.patins;
      this.formDataPut.rodaExtra = atendimento.rodaExtra;
      this.formDataPut.tipoServicoId = atendimento.tipoServicoId;
      this.formDataPut.tipoVeiculoId = atendimento.tipoVeiculoId;
      this.formDataPut.qth = atendimento.qth.toString();
      this.formDataPut.qti = atendimento.qti.toString();
      this.formDataPut.km = atendimento.km.toString();
      this.formDataPut.noturno = atendimento.noturno;
      this.formDataPut.qtd_hora_parada = atendimento.qtd_hora_parada.toString();
      this.formDataPut.obs_hora_parada = atendimento.obs_hora_parada.toString();
      this.formDataPut.hospedagem = atendimento.hospedagem.toString();
      this.formDataPut.qtd_pedagio = atendimento.qtd_pedagio.toString();
      this.formDataPut.pedagio = atendimento.pedagio.toString();
      this.formDataPut.adicionais = atendimento.adicionais.toString();
      this.formDataPut.obs_adicionais = atendimento.obs_adicionais.toString();
      this.formDataPut.valor_total = atendimento.valor_total.toString();
      this.formDataPut.em_analise = atendimento.em_analise;
      this.formDataPut.cancelado = atendimento.cancelado;
      this.formDataPut.ativo = atendimento.ativo;
      this.formDataPut.usuarioId = atendimento.usuarioId;
      this.formDataPut.gerenteId = atendimento.gerenteId;
      this.atendimentoID = atendimento.id;

      this.editarModal = true;
    },
    editarFormulario(id) {
      // this.formDataPut.data = new Date(this.formDataPut.data);
      // const dateString = this.formDataPut.data;
      // const parts = dateString.split('/');
      // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      this.formDataPut.data = this.parseData(this.formDataPut.data);
      // console.log('Data-> ', this.formDataPut.data);
      console.log('formDataPut-> ', this.formDataPut);


      axios.put('https://localhost:7255/api/Atendimento/' + id, this.formDataPut, {
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
          this.formDataPut.gerenteId = '';
          this.formDataPut.em_analise = false;
          this.formDataPut.cancelado = false;
          this.formDataPut.ativo = true;

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.confirmarSimNaoModal = false;
          this.successModal = true;
          this.getAtendimentos();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    confirmarSimNaoFormulario() {
      const tipoViatura = this.veiculos.filter(viatura => viatura.viaturaId === this.formDataPut.viaturaId);
      const tipoServicoLoc = tipoViatura.filter(servico => servico.tipo_ServicoId === this.formDataPut.tipoServicoId)
      const tipoVeiculoLoc = tipoServicoLoc.filter(veiculo => veiculo.tipo_VeiculoId === this.formDataPut.tipoVeiculoId);

      // Efetuando a Soma

      if (this.formDataPut.km == "") {
        this.kmTotal = "0";
      } else {
        this.kmTotal = (Number(this.formDataPut.km) * Number(tipoVeiculoLoc[0].valor_km));
      }
      if (this.formDataPut.qtd_hora_parada == "") {
        this.horaTotal = "0";
      } else {
        this.horaTotal = (Number(this.formDataPut.qtd_hora_parada) * Number(tipoVeiculoLoc[0].hora_parada));
      }
      if (this.formDataPut.pedagio == "") {
        this.formDataPut.pedagio = "0";
      }
      if (this.formDataPut.qtd_pedagio == "") {
        this.formDataPut.qtd_pedagio = "0";
      }
      if (this.formDataPut.hospedagem == "") {
        this.formDataPut.hospedagem = "0";
      }
      if (this.formDataPut.adicionais == "") {
        this.formDataPut.adicionais = "0";
      }

      if (this.formDataPut.noturno == true) {
        this.formDataPut.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formDataPut.pedagio) + Number(this.formDataPut.hospedagem) + Number(this.formDataPut.adicionais) + Number(tipoVeiculoLoc[0].adicional_noturno)).toFixed(2);
      } else {
        this.formDataPut.valor_total = (Number(tipoVeiculoLoc[0].valor_saida) + Number(this.kmTotal) + Number(this.horaTotal) + Number(this.formDataPut.pedagio) + Number(this.formDataPut.hospedagem) + Number(this.formDataPut.adicionais)).toFixed(2);
      }

      if (this.formDataPut.ris == true) {
        this.formDataPut.valor_total = ((Number(this.formDataPut.valor_total)) + (Number(tipoVeiculoLoc[0].ris))).toFixed(2)
      }
      if (this.formDataPut.patins == true) {
        this.formDataPut.valor_total = ((Number(this.formDataPut.valor_total)) + (Number(tipoVeiculoLoc[0].patins))).toFixed(2)
      }
      if (this.formDataPut.rodaExtra == true) {
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

      // return `${dia}/${mes}/${ano}`;
      return `${ano}-${mes}-${dia}`;
    },
    parseDataGet(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      return `${dia}/${mes}/${ano}`;
    },
    emAnalise(atendimento) {
      this.formDataPut.data = this.parseDataGet(atendimento.data);
      this.formDataPut.viaturaId = atendimento.viaturaId;
      this.formDataPut.qru = atendimento.qru.toString();
      this.formDataPut.ris = atendimento.ris;
      this.formDataPut.patins = atendimento.patins;
      this.formDataPut.rodaExtra = atendimento.rodaExtra;
      this.formDataPut.tipoServicoId = atendimento.tipoServicoId;
      this.formDataPut.tipoVeiculoId = atendimento.tipoVeiculoId;
      this.formDataPut.qth = atendimento.qth.toString();
      this.formDataPut.qti = atendimento.qti.toString();
      this.formDataPut.km = atendimento.km.toString();
      this.formDataPut.noturno = atendimento.noturno;
      this.formDataPut.qtd_hora_parada = atendimento.qtd_hora_parada.toString();
      this.formDataPut.obs_hora_parada = atendimento.obs_hora_parada.toString();
      this.formDataPut.hospedagem = atendimento.hospedagem.toString();
      this.formDataPut.qtd_pedagio = atendimento.qtd_pedagio.toString();
      this.formDataPut.pedagio = atendimento.pedagio.toString();
      this.formDataPut.adicionais = atendimento.adicionais.toString();
      this.formDataPut.obs_adicionais = atendimento.obs_adicionais.toString();
      this.formDataPut.valor_total = atendimento.valor_total.toString();
      this.formDataPut.usuarioId = atendimento.usuarioId;
      this.formDataPut.gerenteId = atendimento.gerenteId;
      this.formDataPut.em_analise = atendimento.em_analise;
      this.formDataPut.cancelado = atendimento.cancelado;
      this.formDataPut.ativo = atendimento.ativo;
      this.atendimentoID = atendimento.id;

      this.emAnaliseModal = true;
    },
    alterarEmAnalise(id) {
      // Condição para mudança do Status da Análise
      if (this.formDataPut.em_analise == true) {
        this.formDataPut.em_analise = false;
      } else {
        this.formDataPut.em_analise = true;
      };


      // this.formDataPut.data = new Date(this.formDataPut.data);
      const dateString = this.formDataPut.data;
      const parts = dateString.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      this.formDataPut.data = formattedDate;

      // console.log('Dados Atendimento data-> ', this.formDataPut.data);

      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');



      axios.put('https://localhost:7255/api/Atendimento/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
          this.formDataPut.gerenteId = '';
          this.formDataPut.em_analise = false;
          this.formDataPut.cancelado = false;
          this.formDataPut.ativo = true;

          this.emAnaliseModal = false;
          this.getAtendimentos();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    cancelado(atendimento) {
      this.formDataPut.data = this.parseDataGet(atendimento.data);
      this.formDataPut.viaturaId = atendimento.viaturaId;
      this.formDataPut.qru = atendimento.qru.toString();
      this.formDataPut.ris = atendimento.ris;
      this.formDataPut.patins = atendimento.patins;
      this.formDataPut.rodaExtra = atendimento.rodaExtra;
      this.formDataPut.tipoServicoId = atendimento.tipoServicoId;
      this.formDataPut.tipoVeiculoId = atendimento.tipoVeiculoId;
      this.formDataPut.qth = atendimento.qth.toString();
      this.formDataPut.qti = atendimento.qti.toString();
      this.formDataPut.km = atendimento.km.toString();
      this.formDataPut.noturno = atendimento.noturno;
      this.formDataPut.qtd_hora_parada = atendimento.qtd_hora_parada.toString();
      this.formDataPut.obs_hora_parada = atendimento.obs_hora_parada.toString();
      this.formDataPut.hospedagem = atendimento.hospedagem.toString();
      this.formDataPut.qtd_pedagio = atendimento.qtd_pedagio.toString();
      this.formDataPut.pedagio = atendimento.pedagio.toString();
      this.formDataPut.adicionais = atendimento.adicionais.toString();
      this.formDataPut.obs_adicionais = atendimento.obs_adicionais.toString();
      this.formDataPut.valor_total = atendimento.valor_total.toString();
      this.formDataPut.usuarioId = atendimento.usuarioId;
      this.formDataPut.gerenteId = atendimento.gerenteId;
      this.formDataPut.em_analise = atendimento.em_analise;
      this.formDataPut.cancelado = atendimento.cancelado;
      this.formDataPut.ativo = atendimento.ativo;
      this.atendimentoID = atendimento.id;

      this.canceladoModal = true;
    },
    alterarCancelado(id) {
      // Condição para mudança do Status Cancelado
      if (this.formDataPut.cancelado == true) {
        this.formDataPut.cancelado = false;
      } else {
        this.formDataPut.cancelado = true;
      };

      // this.formDataPut.data = new Date(this.formDataPut.data);
      const dateString = this.formDataPut.data;
      const parts = dateString.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      this.formDataPut.data = formattedDate;

      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');

      axios.put('https://localhost:7255/api/Atendimento/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
          this.formDataPut.gerenteId = '';
          this.formDataPut.em_analise = false;
          this.formDataPut.cancelado = false;
          this.formDataPut.ativo = true;

          this.canceladoModal = false;
          this.getAtendimentos();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    ativo(atendimento) {
      this.formDataPut.data = this.parseDataGet(atendimento.data);
      this.formDataPut.viaturaId = atendimento.viaturaId;
      this.formDataPut.qru = atendimento.qru.toString();
      this.formDataPut.ris = atendimento.ris;
      this.formDataPut.patins = atendimento.patins;
      this.formDataPut.rodaExtra = atendimento.rodaExtra;
      this.formDataPut.tipoServicoId = atendimento.tipoServicoId;
      this.formDataPut.tipoVeiculoId = atendimento.tipoVeiculoId;
      this.formDataPut.qth = atendimento.qth.toString();
      this.formDataPut.qti = atendimento.qti.toString();
      this.formDataPut.km = atendimento.km.toString();
      this.formDataPut.noturno = atendimento.noturno;
      this.formDataPut.qtd_hora_parada = atendimento.qtd_hora_parada.toString();
      this.formDataPut.obs_hora_parada = atendimento.obs_hora_parada.toString();
      this.formDataPut.hospedagem = atendimento.hospedagem.toString();
      this.formDataPut.qtd_pedagio = atendimento.qtd_pedagio.toString();
      this.formDataPut.pedagio = atendimento.pedagio.toString();
      this.formDataPut.adicionais = atendimento.adicionais.toString();
      this.formDataPut.obs_adicionais = atendimento.obs_adicionais.toString();
      this.formDataPut.valor_total = atendimento.valor_total.toString();
      this.formDataPut.usuarioId = atendimento.usuarioId;
      this.formDataPut.gerenteId = atendimento.gerenteId;
      this.formDataPut.em_analise = atendimento.em_analise;
      this.formDataPut.cancelado = atendimento.cancelado;
      this.formDataPut.ativo = atendimento.ativo;
      this.atendimentoID = atendimento.id;

      this.ativoModal = true;
    },
    alterarAtivo(id) {
      // Condição para mudança do Status Ativo
      if (this.formDataPut.ativo == true) {
        this.formDataPut.ativo = false;
      } else {
        this.formDataPut.ativo = true;
      };

      // this.formDataPut.data = new Date(this.formDataPut.data);
      const dateString = this.formDataPut.data;
      const parts = dateString.split('/');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      this.formDataPut.data = formattedDate;

      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');

      axios.put('https://localhost:7255/api/Atendimento/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
          this.formDataPut.gerenteId = '';
          this.formDataPut.em_analise = false;
          this.formDataPut.cancelado = false;
          this.formDataPut.ativo = true;

          this.ativoModal = false;
          this.getAtendimentos();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    calcularSomaEditar() {
      // Calcula a soma dos valores dos campos de entrada
      this.formDataPut.valor_total = this.formDataPut.km * 2.70;
    },
    // Método para obter a viatura com base no viaturaId
    obterViatura(viaturaId) {
      const viatura = this.viaturas.find(c => c.id === viaturaId);
      return viatura ? viatura.sigla : 'Viatura Desconhecida';
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
    // Método para obter o Colaborador com base no usuarioId
    obterUsuario(usuarioId) {
      const usuario = this.usuarios.find(c => c.id === usuarioId);
      return usuario ? usuario.nome : 'Colaborador Desconhecido';
    },
    maisInfoAtendimento(atendimento) {
      this.formDataPut.qru = atendimento.qru.toString();
      this.formDataPut.patins = atendimento.patins;
      this.formDataPut.rodaExtra = atendimento.rodaExtra;
      this.formDataPut.qtd_hora_parada = atendimento.qtd_hora_parada.toString();
      this.formDataPut.obs_hora_parada = atendimento.obs_hora_parada.toString();
      this.formDataPut.hospedagem = atendimento.hospedagem.toString();
      this.formDataPut.qtd_pedagio = atendimento.qtd_pedagio.toString();
      this.formDataPut.pedagio = atendimento.pedagio.toString();
      this.formDataPut.adicionais = atendimento.adicionais.toString();
      this.formDataPut.obs_adicionais = atendimento.obs_adicionais.toString();

      this.maisInfoModal = true;
    },
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

.largura {
  white-space: nowrap;
}

.tooltip-content {
  cursor: pointer;
}
</style>