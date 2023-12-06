<template>
  <div class="row" style="padding: 10px 0; display: flex; align-items: center;">

    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Fornecedor " />
    </div>

    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <span>Data Inicial: </span>
      <input type="date" v-model="dataInicial" />
    </div>

    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <span>Data Final: </span>
      <input type="date" v-model="dataFinal" />
    </div>

    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
      <button class="btn btn-primary mr-5" @click="buscarAbastecimentos">Pesquisar</button>
      <button style="" class="btn btn-primary mr-2" @click="limparPesquisa()">Limpar Pesquisa</button>
    </div>

  </div>


  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Data</th>
        <th scope="col" style="width: 200px;">Viatura</th>
        <th scope="col">Fornecedor</th>
        <th scope="col">Tipo Combustível</th>
        <th scope="col" style="width: 150px;">Valor Unid.</th>
        <th scope="col">Valor Total</th>
        <th scope="col" style="width: 150px;">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredAbastecimentos.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr style="color: aliceblue;">{{ this.valorTotal = 0 }}</tr>
      <tr v-for="abastecimento in filteredAbastecimentos">
        <th scope="row">{{ parseData(abastecimento.data_abastecimento) }}</th>
        <td>{{ abastecimento.viatura.sigla }}</td>
        <td>{{ abastecimento.fornecedor.nome_fantasia }}</td>
        <td>{{ abastecimento.tipo_Combustivel.nome_combustivel }}</td>
        <td>{{ abastecimento.valor_unid_abastecimento.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}
        </td>
        <td>{{ abastecimento.valor_total_abastecimento.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}
        </td>
        {{ somaValor(abastecimento.valor_total_abastecimento) }}
        <td>
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarAbastecimento(abastecimento)" data-toggle="tooltip" data-placement="top"
            title="Editar" style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirAbastecimento(abastecimento)"
            data-toggle="tooltip" data-placement="top" title="Excluir"></i>
        </td>
      </tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th>Total de Abastecimentos:</th>
      <th> {{ this.valorTotal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</th>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.abastecimentoId)">
        <h1>Editar Abastecimento</h1>

        <div class="col-md-3">
          <label for="data_nascimento" class="form-label">Data:</label>
          <input type="date" class="form-control" id="data" name="data" required
            v-model="formDataPut.data_abastecimento"><br>
        </div>

        <div class="col-md-3">
          <label for="viaturaId" class="form-label">Viatura:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId">
            <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="fornecedor" class="form-label">Fornecedor:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.fornecedorId">
            <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">{{
              fornecedor.nome_fantasia }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="tipo_Combustivel" class="form-label">Tipo Combustível:</label>
          <select id="inputState2" class="form-select" required v-model="formDataPut.tipo_combustivelId">
            <option v-for="tipo_Combustivel in tipo_Combustiveis" :key="tipo_Combustivel.id" :value="tipo_Combustivel.id">
              {{ tipo_Combustivel.nome_combustivel }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="valor_unid_abastecimento" class="form-label">Valor Unitário R$:</label>
          <input type="text" class="form-control" id="valor_unid_abastecimento" name="valor_unid_abastecimento" required
            v-model="formDataPut.valor_unid_abastecimento" placeholder="Ex... 5.69"><br>
        </div>

        <div class="col-md-3">
          <label for="valor_total_abastecimento" class="form-label">Valor Total R$:</label>
          <input type="text" class="form-control" id="valor_total_abastecimento" name="valor_total_abastecimento" required
            v-model="formDataPut.valor_total_abastecimento" placeholder="Ex... 100.00"><br>
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
            Fornecedor atualizado com sucesso!
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
        <h1>Excluir Abastecimento</h1>

        <div class="col-md-3">
          <label for="data_nascimento" class="form-label">Data:</label>
          <input type="date" class="form-control" id="data" name="data" v-model="formDataPut.data_abastecimento"
            disabled="isInputLocked"><br>
        </div>

        <div class="col-md-3">
          <label for="viaturaId" class="form-label">Viatura:</label>
          <select id="inputState2" class="form-select" v-model="formDataPut.viaturaId" disabled="isInputLocked">
            <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="fornecedor" class="form-label">Fornecedor:</label>
          <select id="inputState2" class="form-select" v-model="formDataPut.fornecedorId" disabled="isInputLocked">
            <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">{{
              fornecedor.nome_fantasia }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="tipo_Combustivel" class="form-label">Tipo Combustível:</label>
          <select id="inputState2" class="form-select" v-model="formDataPut.tipo_combustivelId" disabled="isInputLocked">
            <option v-for="tipo_Combustivel in tipo_Combustiveis" :key="tipo_Combustivel.id" :value="tipo_Combustivel.id">
              {{ tipo_Combustivel.nome_combustivel }}</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="valor_unid_abastecimento" class="form-label">Valor Unitário R$:</label>
          <input type="text" class="form-control" id="valor_unid_abastecimento" name="valor_unid_abastecimento"
            v-model="formDataPut.valor_unid_abastecimento" disabled="isInputLocked"><br>
        </div>

        <div class="col-md-3">
          <label for="valor_total_abastecimento" class="form-label">Valor Total R$:</label>
          <input type="text" class="form-control" id="valor_total_abastecimento" name="valor_total_abastecimento"
            v-model="formDataPut.valor_total_abastecimento" disabled="isInputLocked"><br>
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
            Deseja excluir Abastecimento?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.abastecimentoId)">Excluir</button>
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
            Abastecimento excluido com sucesso!
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
        data_abastecimento: '',
        valor_unid_abastecimento: '',
        valor_total_abastecimento: '',
        viaturaId: '',
        fornecedorId: '',
        tipo_combustivelId: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      erroModal: false,
      maisInfoModal: false,
      abastecimentoId: 0,
    }
  },
  setup() {
    const abastecimentos = ref([]);
    const searchTerm = ref(null);
    const dataSourceAbastecimentos = ref([]);
    const viaturas = ref([]);
    const fornecedores = ref([]);
    const tipo_Combustiveis = ref([]);

    // Filtro
    const filteredAbastecimentos = computed(() => {
      console.log('Abastecimentos---> ', filteredAbastecimentos);
      if (!searchTerm.value) {
        return dataSourceAbastecimentos.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceAbastecimentos.value.filter(abastecimento => {
        const nomeLowerCase = abastecimento.fornecedor.nome_fantasia.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseAbastecimentos = await axios.get('https://localhost:7255/api/Abastecimento/Abastecimento/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceAbastecimentos.value = responseAbastecimentos.data;
        // console.log('Dados retornados da API Fornecedor', responsFornecedores.data);
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
        const responseFornecedores = await axios.get('https://localhost:7255/api/Fornecedor/Fornecedor/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fornecedores.value = responseFornecedores.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    onMounted(async () => {
      try {
        const responseTipo_Combustiveis = await axios.get('https://localhost:7255/api/TipoCombustivel');
        tipo_Combustiveis.value = responseTipo_Combustiveis.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      abastecimentos,
      searchTerm,
      filteredAbastecimentos,
      dataSourceAbastecimentos,
      viaturas,
      fornecedores,
      tipo_Combustiveis
    };
  },
  methods: {
    getAbastecimento() {
      axios.get('https://localhost:7255/api/Abastecimento/Abastecimento/' + localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredAbastecimentos = res.data;
            this.dataSourceAbastecimentos = res.data;
            return;
          }
          this.filteredFornecedores = [];
          return;
        });
    },
    fecharModal() {
      this.editarModal = false;
      this.successModal = false;
      this.excluirModal = false;
      this.excluirSimNaoModal = false;
      this.maisInfoModal = false;
      this.successExcluirModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    editarAbastecimento(abastecimento) {
      this.formDataPut.data_abastecimento = this.parseDataUSA(abastecimento.data_abastecimento);
      this.formDataPut.valor_unid_abastecimento = abastecimento.valor_unid_abastecimento.toFixed(2).toString();
      this.formDataPut.valor_total_abastecimento = abastecimento.valor_total_abastecimento.toFixed(2).toString();
      this.formDataPut.viaturaId = abastecimento.viatura.tipo_ViaturaId;
      this.formDataPut.fornecedorId = abastecimento.fornecedor.id;
      this.formDataPut.tipo_combustivelId = abastecimento.tipo_Combustivel.id;
      this.formDataPut.gerenteId = abastecimento.gerenteId;
      this.abastecimentoId = abastecimento.id;

      this.editarModal = true;
    },
    excluirAbastecimento(abastecimento) {
      this.formDataPut.data_abastecimento = this.parseDataUSA(abastecimento.data_abastecimento);
      this.formDataPut.valor_unid_abastecimento = abastecimento.valor_unid_abastecimento.toFixed(2).toString();
      this.formDataPut.valor_total_abastecimento = abastecimento.valor_total_abastecimento.toFixed(2).toString();
      this.formDataPut.viaturaId = abastecimento.viatura.tipo_ViaturaId;
      this.formDataPut.fornecedorId = abastecimento.fornecedor.id;
      this.formDataPut.tipo_combustivelId = abastecimento.tipo_Combustivel.id;
      this.formDataPut.gerenteId = abastecimento.gerenteId;
      this.abastecimentoId = abastecimento.id;

      this.excluirModal = true;
    },
    editarFormulario(id) {
      this.formDataPut.data_abastecimento = this.parseDataUSA(this.formDataPut.data_abastecimento);
      // this.formDataPut.gerenteId = localStorage.getItem('gerenteId');

      console.log('Abastecimento Gravar---> ', id);

      axios.put('https://localhost:7255/api/Abastecimento/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.data_abastecimento = '',
            this.formDataPut.valor_unid_abastecimento = '',
            this.formDataPut.valor_total_abastecimento = '',
            this.formDataPut.viaturaId = '',
            this.formDataPut.fornecedorId = '',
            this.formDataPut.tipo_combustivelId = '',
            this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getAbastecimento();
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
      console.log('Id Fornecedor-> ', id);

      axios.delete('https://localhost:7255/api/Abastecimento/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.data_abastecimento = '',
            this.formDataPut.valor_unid_abastecimento = '',
            this.formDataPut.valor_total_abastecimento = '',
            this.formDataPut.viaturaId = '',
            this.formDataPut.fornecedorId = '',
            this.formDataPut.tipo_combustivelId = '',
            this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getAbastecimento();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate();
      const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // Formatar a data como "DD/MM/YYYY"
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    },
    parseDataUSA(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // return `${dia}/${mes}/${ano}`;
      return `${ano}-${mes}-${dia}`;
    },
    buscarAbastecimentos() {
      this.formDataPut.gerenteId = localStorage.getItem('gerenteId');
      const fornecedorId = this.formDataPut.fornecedorId;
      // console.log(this.formDataPut.gerenteId, this.dataInicial, this.dataFinal)
      if (this.dataInicial && !this.dataFinal) {
        alert("Por Favor, Selecione uma Data Final.");
        return;
      }
      if (!this.dataInicial && this.dataFinal) {
        alert("Por Favor, Selecione uma Data Inicial.");
        return;
      }
      if (new Date(this.dataInicial) > new Date(this.dataFinal)) {
        alert("Data Inicial não pode ser maior que a Data Final.");
        return;
      }

      let url = 'https://localhost:7255/api/Abastecimento/GetAbastecimentosByFilter?';
      url += fornecedorId && this.dataInicial && this.dataFinal ? `fornecedorId=${fornecedorId}&gerenteId=${this.formDataPut.gerenteId}&dataInicial=${this.dataInicial}&dataFinal=${this.dataFinal}` : '';
      url += !fornecedorId && this.dataInicial && this.dataFinal ? `gerenteId=${this.formDataPut.gerenteId}&dataInicial=${this.dataInicial}&dataFinal=${this.dataFinal}` : '';

      console.log(url)

      axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => {
          // console.log('Abastecimentos Filter---> ', res);
          this.dataSourceAbastecimentos = res.data;
          this.valorTotal = 0;
          return;
        })
        .catch(error => {
          console.log(error)
        })
    },
    somaValor(valor) {
      this.valorTotal += parseFloat(valor);
    },
    limparPesquisa() {
      this.getAbastecimento();
    },
    mounted() {
      this.getFornecedor()
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