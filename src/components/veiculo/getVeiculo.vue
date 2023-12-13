<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Descrição" />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Viatura</th>
        <th scope="col">Valor Saída</th>
        <th scope="col">Valor Km</th>
        <th scope="col">Adicional Noturno</th>
        <th scope="col">RIS</th>
        <th scope="col">Patins</th>
        <th scope="col">Roda Extra</th>
        <th scope="col">Hora Parada</th>
        <th scope="col">Descrição</th>
        <th scope="col">Tipo de Serviço</th>
        <th scope="col">Tipo de Veículo</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredVeiculos.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-for="veiculo in filteredVeiculos">
        <th scope="row">{{ veiculo.id }}</th>
        <td>{{ obterViatura(veiculo.viaturaId) }}</td>
        <td>{{ veiculo.valor_saida.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.valor_km.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.adicional_noturno.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.ris.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.patins.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.rodaExtra.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.hora_parada.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>{{ veiculo.descricao }}</td>
        <td>{{ obterDescricaoTipo(veiculo.tipo_ServicoId) }}</td>
        <td>{{ obterDescricaoTipoVeiculo(veiculo.tipo_VeiculoId) }}</td>
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarVeiculo(veiculo)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirVeiculo(veiculo)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.veiculoId)">
        <h1>Editar Veículo Valores</h1>

        <div class="col-md-2">
            <label for="valor_saida" class="form-label">Valor Saída R$:</label>
            <input type="text" class="form-control" id="valor_saida" name="valor_saida" required v-model="formDataPut.valor_saida" placeholder="Ex... 164.00"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_km" class="form-label">Valor Km R$:</label>
            <input type="text" class="form-control" id="valor_km" name="valor_km" required v-model="formDataPut.valor_km" placeholder="Ex... 2.70"><br>
          </div>

          <div class="col-md-2">
            <label for="adicional_noturno" class="form-label">Adicional Noturno R$:</label>
            <input type="text" class="form-control" id="adicional_noturno" name="adicional_noturno" v-model="formDataPut.adicional_noturno" placeholder="Ex... 23.92"><br>
          </div>

          <div class="col-md-2">
            <label for="ris" class="form-label">RIS R$:</label>
            <input type="text" class="form-control" id="ris" name="ris" v-model="formDataPut.ris" placeholder="Ex... 10.00"><br>
          </div>

          <div class="col-md-2">
            <label for="patins" class="form-label">Patins R$:</label>
            <input type="text" class="form-control" id="patins" name="patins" v-model="formDataPut.patins" placeholder="Ex... 107.00"><br>
          </div>

          <div class="col-md-2">
            <label for="rodaExtra" class="form-label">Roda Extra R$:</label>
            <input type="text" class="form-control" id="rodaExtra" name="rodaExtra" v-model="formDataPut.rodaExtra" placeholder="Ex... 107.00"><br>
          </div>

          <div class="col-md-2">
            <label for="hora_parada" class="form-label">Hora Parada R$:</label>
            <input type="text" class="form-control" id="hora_parada" name="hora_parada" required v-model="formDataPut.hora_parada" placeholder="Ex... 30.30"><br>
          </div>
          
          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formDataPut.descricao" placeholder="Ex... Auto"><br>
          </div>

          <div class="col-md-3">
            <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_ServicoId">
              <option v-for="tipoServico in tipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{ tipoServico.descricao }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_VeiculoId">
              <option v-for="tipoVeiculo in tipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{ tipoVeiculo.modelo }}</option>
            </select>
            <br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId">
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
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Veículo Valores atualizado com sucesso!
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
        <h1>Excluir Veículo Valores</h1>

          <div class="col-md-2">
            <label for="valor_saida" class="form-label">Valor Saída R$:</label>
            <input type="text" class="form-control" id="valor_saida" name="valor_saida" required v-model="formDataPut.valor_saida" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_km" class="form-label">Valor Km R$:</label>
            <input type="text" class="form-control" id="valor_km" name="valor_km" required v-model="formDataPut.valor_km" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="adicional_noturno" class="form-label">Adicional Noturno R$:</label>
            <input type="text" class="form-control" id="adicional_noturno" name="adicional_noturno" v-model="formDataPut.adicional_noturno" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="ris" class="form-label">RIS R$:</label>
            <input type="text" class="form-control" id="ris" name="ris" v-model="formDataPut.ris" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="patins" class="form-label">Patins R$:</label>
            <input type="text" class="form-control" id="patins" name="patins" v-model="formDataPut.patins" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="rodaExtra" class="form-label">Roda Extra R$:</label>
            <input type="text" class="form-control" id="rodaExtra" name="rodaExtra" v-model="formDataPut.rodaExtra" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-2">
            <label for="hora_parada" class="form-label">Hora Parada R$:</label>
            <input type="text" class="form-control" id="hora_parada" name="hora_parada" required v-model="formDataPut.hora_parada" disabled="isInputLocked"><br>
          </div>
          
          <div class="col-md-6">
            <label for="descricao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao" name="descricao" required v-model="formDataPut.descricao" disabled="isInputLocked"><br>
          </div>

          <div class="col-md-3">
            <label for="tipoServicoId" class="form-label">Tipo Serviço:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_ServicoId" disabled="isInputLocked">
              <option v-for="tipoServico in tipoServicos" :key="tipoServico.id" :value="tipoServico.id">{{ tipoServico.descricao }}</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="tipoVeiculoId" class="form-label">Tipo Veículo:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_VeiculoId" disabled="isInputLocked">
              <option v-for="tipoVeiculo in tipoVeiculos" :key="tipoVeiculo.id" :value="tipoVeiculo.id">{{ tipoVeiculo.modelo }}</option>
            </select>
            <br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId" disabled="isInputLocked">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
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
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Excluir</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Deseja excluir Veículo Valor?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.veiculoId)">Excluir</button>
            <button type="button" class="btn btn-secondary" @click="fecharModal()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" v-if="successExcluirModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Sucesso</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModal()"></button>
          </div>
          <div class="modal-body">
            Veículo Valor excluido com sucesso!
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
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      veiculoId: 0,
      erroModal: false,
    }
  },
  setup() {
    const veiculos = ref([]);
    const tipoServicos = ref([]);
    const tipoVeiculos = ref([]);
    const viaturas = ref ([]);
    const searchTerm = ref(null);
    const dataSourceVeiculos = ref([]);

    // Filtro
    const filteredVeiculos = computed(() => {
      if (!searchTerm.value) {
        return dataSourceVeiculos.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceVeiculos.value.filter(veiculo => {
        const nomeLowerCase = veiculo.descricao.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseVeiculos = await axios.get('https://localhost:7255/api/Veiculo/Veiculos/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceVeiculos.value = responseVeiculos.data;
        // console.log('Tipo Veículos---> ', responseTipoVeiculos)
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
      searchTerm,
      filteredVeiculos,
      dataSourceVeiculos,
    };
  },
  methods: {
    getVeiculo() {
      axios.get('https://localhost:7255/api/Veiculo/Veiculos/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredVeiculos = res.data;
            this.dataSourceVeiculos = res.data;
            // console.log('Veiculos---> ', res.data);
            return;
          }
          this.filteredVeiculos = [];
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
    editarVeiculo(veiculo) {
      this.formDataPut.valor_saida = veiculo.valor_saida.toFixed(2);
      this.formDataPut.valor_km = veiculo.valor_km.toFixed(2);
      this.formDataPut.adicional_noturno = veiculo.adicional_noturno.toFixed(2);
      this.formDataPut.ris = veiculo.ris.toFixed(2);
      this.formDataPut.patins = veiculo.patins.toFixed(2);
      this.formDataPut.rodaExtra = veiculo.rodaExtra.toFixed(2);
      this.formDataPut.hora_parada = veiculo.hora_parada.toFixed(2);
      this.formDataPut.descricao = veiculo.descricao.toString();
      this.formDataPut.tipo_ServicoId = veiculo.tipo_ServicoId.toString();
      this.formDataPut.tipo_VeiculoId = veiculo.tipo_VeiculoId.toString();
      this.formDataPut.viaturaId = veiculo.viaturaId.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.veiculoId = veiculo.id;

      this.editarModal = true;
    },
    excluirVeiculo(veiculo) {
      this.formDataPut.valor_saida = veiculo.valor_saida.toFixed(2);
      this.formDataPut.valor_km = veiculo.valor_km.toFixed(2);
      this.formDataPut.adicional_noturno = veiculo.adicional_noturno.toFixed(2);
      this.formDataPut.ris = veiculo.ris.toFixed(2);
      this.formDataPut.patins = veiculo.patins.toFixed(2);
      this.formDataPut.rodaExtra = veiculo.rodaExtra.toFixed(2);
      this.formDataPut.hora_parada = veiculo.hora_parada.toFixed(2);
      this.formDataPut.descricao = veiculo.descricao.toString();
      this.formDataPut.tipo_ServicoId = veiculo.tipo_ServicoId.toString();
      this.formDataPut.tipo_VeiculoId = veiculo.tipo_VeiculoId.toString();
      this.formDataPut.viaturaId = veiculo.viaturaId.toString();
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      this.veiculoId = veiculo.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      axios.put('https://localhost:7255/api/Veiculo/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.valor_saida = '';
          this.formDataPut.valor_km = '',
          this.formDataPut.adicional_noturno = '';
          this.formDataPut.ris = '';
          this.formDataPut.patins = '',
          this.formDataPut.rodaExtra = '';
          this.formDataPut.hora_parada = '';
          this.formDataPut.descricao = '',
          this.formDataPut.tipo_ServicoId = '';
          this.formDataPut.tipo_VeiculoId = '';
          this.formDataPut.viaturaId = '',
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getVeiculo();
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
      axios.delete('https://localhost:7255/api/Veiculo/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.valor_saida = '';
          this.formDataPut.valor_km = '',
          this.formDataPut.adicional_noturno = '';
          this.formDataPut.ris = '';
          this.formDataPut.patins = '',
          this.formDataPut.rodaExtra = '';
          this.formDataPut.hora_parada = '';
          this.formDataPut.descricao = '',
          this.formDataPut.tipo_ServicoId = '';
          this.formDataPut.tipo_VeiculoId = '';
          this.formDataPut.viaturaId = '',
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getVeiculo();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
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
    mounted() {
      this.getVeiculo()
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