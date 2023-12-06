<template>
  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Viatura " />
  </div>

  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">Data</th>
        <th scope="col">Viatura</th>
        <th scope="col">Tipo Manutenção</th>
        <th scope="col">Descrição</th>
        <th scope="col">Valor</th>
        <th scope="col">Opções</th>
      </tr>
    </thead>

    <tbody>
      <tr v-if="this.filteredManutencoes.length == 0">
        <td colspan="18" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr style="color: aliceblue;">{{ this.valorTotal = 0 }}</tr>
      <tr v-for="manutencao in filteredManutencoes">
        <th scope="row">{{ parseDataBrasil(manutencao.data_manutencao) }}</th>
        <td>{{ obterViatura(manutencao.viaturaId) }}</td>
        <td>{{ manutencao.nome_manutencao }}</td>
        <td>{{ manutencao.descricao_manutencao }}</td>
        <td>{{ manutencao.valor_total_manutencao.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}</td>
        <td>
        {{ somaValor(manutencao.valor_total_manutencao) }}
          <!-- Ícone de editar -->
          <i class="fi-rr-edit" @click="editarManutencao(manutencao)" data-toggle="tooltip" data-placement="top" title="Editar"
            style="margin-right: 15px; font-size: 20px; cursor: pointer;"></i>
          <!-- Ícone de excluir -->
          <i class="fi-rr-trash" style="font-size: 21px; cursor: pointer;" @click="excluirManutencao(manutencao)" data-toggle="tooltip" data-placement="top" title="Excluir"></i>
        </td>
      </tr>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th>Total de Manutenção:</th>
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

      <form id="modalForm" class="row" @submit.prevent="editarFormulario(this.manutencaoId)">
        <h1>Editar Manuteção</h1>
        
        <div class="col-md-2">
            <label for="data_manutencao" class="form-label">Data:</label>
            <input type="date" class="form-control" id="data_manutencao" name="data_manutencao" required v-model="formDataPut.data_manutencao"><br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" required v-model="formDataPut.viaturaId">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="nome_manutencao" class="form-label">Tipo Manutenção</label>
            <input type="text" class="form-control" id="nome_manutencao" name="nome_manutencao" required v-model="formDataPut.nome_manutencao" placeholder="Ex... Revisão 100 mil Km"><br>
          </div>

          <div class="col-md-6">
            <label for="descricao_manutencao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao_manutencao" name="descricao_manutencao" required v-model="formDataPut.descricao_manutencao" placeholder="Ex... Troca de Óleo"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_total_manutencao" class="form-label">Valor Total:</label>
            <input type="text" class="form-control" id="valor_total_manutencao" name="valor_total_manutencao" required v-model="formDataPut.valor_total_manutencao" placeholder="Ex... 1500.00"><br>
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
            Colaborador atualizado com sucesso!
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
        <h1>Excluir Manutenção</h1>

        <div class="col-md-2">
            <label for="data_manutencao" class="form-label">Data:</label>
            <input type="date" class="form-control" id="data_manutencao" name="data_manutencao" disabled="isInputLocked" v-model="formDataPut.data_manutencao"><br>
          </div>

          <div class="col-md-3">
            <label for="viaturaId" class="form-label">Viatura:</label>
            <select id="inputState2" class="form-select" disabled="isInputLocked" v-model="formDataPut.viaturaId">
              <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
            </select>
          </div>

          <div class="col-md-6">
            <label for="nome_manutencao" class="form-label">Tipo Manutenção</label>
            <input type="text" class="form-control" id="nome_manutencao" name="nome_manutencao" disabled="isInputLocked" v-model="formDataPut.nome_manutencao"><br>
          </div>

          <div class="col-md-6">
            <label for="descricao_manutencao" class="form-label">Descrição:</label>
            <input type="text" class="form-control" id="descricao_manutencao" name="descricao_manutencao" disabled="isInputLocked" v-model="formDataPut.descricao_manutencao"><br>
          </div>

          <div class="col-md-2">
            <label for="valor_total_manutencao" class="form-label">Valor Total:</label>
            <input type="text" class="form-control" id="valor_total_manutencao" name="valor_total_manutencao" disabled="isInputLocked" v-model="formDataPut.valor_total_manutencao"><br>
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
            Deseja excluir Manutenção?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="excluirFormulario(this.manutencaoId)">Excluir</button>
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
            Manutenção excluido com sucesso!
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
        data_manutencao: '',
        nome_manutencao: '',
        descricao_manutencao: '',
        viaturaId: '',
        valor_total_manutencao: '',
        gerenteId: '',
      },
      editarModal: false,
      successModal: false,
      excluirModal: false,
      excluirSimNaoModal: false,
      successExcluirModal: false,
      manutencaoId: '',
      erroModal: false,
    }
  },
  setup() {
    const manutencoes = ref([]);
    const searchTerm = ref(null);
    const dataSourceManutencoes = ref([]);
    const viaturas = ref([]);

    // Filtro
    const filteredManutencoes = computed(() => {
      if (!searchTerm.value) {
        return dataSourceManutencoes.value;
      }
      const searchTermLowerCase = searchTerm.value.toLowerCase();
      return dataSourceManutencoes.value.filter(manutencao => {
        const nomeLowerCase = manutencao.viatura.sigla.toLowerCase();
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Manutencao/Manutencao/' + localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        dataSourceManutencoes.value = response.data;
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
      searchTerm,
      filteredManutencoes,
      dataSourceManutencoes,
      viaturas
    };
  },
  methods: {
    getManutencao() {
      axios.get('https://localhost:7255/api/Manutencao/Manutencao/'+localStorage.getItem('gerenteId'), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.filteredManutencoes = res.data;
            this.dataSourceManutencoes = res.data;
            console.log('Manutenções---> ', res.data);
            return;
          }
          this.filteredManutencoes = [];
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
    editarManutencao(manutencao) {
      this.manutencaoId = manutencao.id;
      this.formDataPut.data_manutencao = this.parseData(manutencao.data_manutencao);
      this.formDataPut.nome_manutencao = manutencao.nome_manutencao.toString();
      this.formDataPut.descricao_manutencao = manutencao.descricao_manutencao.toString();
      this.formDataPut.viaturaId = manutencao.viaturaId.toString();
      this.formDataPut.valor_total_manutencao = manutencao.valor_total_manutencao.toFixed(2);
      this.formDataPut.gerenteId = manutencao.gerenteId.toString();

      this.editarModal = true;
    },
    excluirManutencao(manutencao) {
      this.manutencaoId = manutencao.id;
      this.formDataPut.data_manutencao = this.parseData(manutencao.data_manutencao);
      this.formDataPut.nome_manutencao = manutencao.nome_manutencao.toString();
      this.formDataPut.descricao_manutencao = manutencao.descricao_manutencao.toString();
      this.formDataPut.viaturaId = manutencao.viaturaId.toString();
      this.formDataPut.valor_total_manutencao = manutencao.valor_total_manutencao.toFixed(2);
      this.formDataPut.gerenteId = manutencao.gerenteId.toString();

      this.excluirModal = true;
    },
    editarFormulario(id) {
      console.log('Manutenção id--> ', id);
      this.formDataPut.data_manutencao = new Date(this.formDataPut.data_manutencao);
      console.log('Manutenção--> ', this.formDataPut.data_manutencao);

      axios.put('https://localhost:7255/api/Manutencao/' + id, this.formDataPut, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.data_manutencao = '';
          this.formDataPut.nome_manutencao = '';
          this.formDataPut.descricao_manutencao = '';
          this.formDataPut.data_nascimento = '',
          this.formDataPut.viaturaId = '';
          this.formDataPut.valor_total_manutencao = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.editarModal = false;
          this.successModal = true;
          this.getManutencao();
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
      console.log('Id Manutencao-> ', id);

      axios.delete('https://localhost:7255/api/Manutencao/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          // Limpar o formulário
          this.formDataPut.data_manutencao = '';
          this.formDataPut.nome_manutencao = '';
          this.formDataPut.descricao_manutencao = '';
          this.formDataPut.data_nascimento = '',
          this.formDataPut.viaturaId = '';
          this.formDataPut.valor_total_manutencao = '';
          this.formDataPut.gerenteId = '';

          // Exibir o modal de sucesso
          this.excluirModal = false;
          this.excluirSimNaoModal = false;
          this.successExcluirModal = true;
          this.getManutencao();
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    parseData(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      return `${ano}-${mes}-${dia}`;
    },
    parseDataBrasil(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate();
      const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();

      // Formatar a data como "DD/MM/YYYY"
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
    },
    parseDataMais(dataString) {
      const data = new Date(dataString);
      const dia = data.getUTCDate().toString().padStart(2, '0');
      const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0'); // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
      const ano = data.getUTCFullYear();
      console.log('Retorno da data-> ', mes);

      return `${ano}-${dia}-${mes}`;
    },
    // Método para obter o nome do cargo com base no cargoId
    obterViatura(idViatura) {
      const viatura = this.viaturas.find(c => c.id === idViatura);
      return viatura ? viatura.sigla : 'Viatura Desconhecida';
    },
    somaValor(valor) {
      this.valorTotal += parseFloat(valor);
    },
    mounted() {
      this.getManutencao()
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