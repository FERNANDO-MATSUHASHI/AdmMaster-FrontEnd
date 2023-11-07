<template>
  <div class="row">
    <div class="d-flex justify-content">
      <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-add"></i>
      <div style="margin-left: 20px;">
        <h1>Despesas de Atendimento</h1>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <button class="btn btn-primary mr-3" @click="abrirModal('novo')">Incluir Despesa</button>
      </div>
    </div>
  </div>
  <hr>

  <div class="input-group input-group-sm mb-3">
    <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por Nome " />
  </div>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">QRU</th>
        <th scope="col">Nome</th>
        <th scope="col">Data do Atendimento</th>
        <th scope="col">Viatura</th>
        <th scope="col">Tipo</th>
        <th scope="col">Descrição</th>
        <th scope="col">Valor</th>
        <th scope="col" class="text-center">Opções</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="dataSourceDespesas.length == 0">
        <td colspan="6" class="text-center">Nenhum dado encontrado.</td>
      </tr>
      <tr v-else v-for="despesa in dataSourceDespesas">
        <th scope="row">{{ despesa.atendimento.qru }}</th>
        <td>{{ despesa.atendimento.usuario.nome }}</td>
        <td>{{ new Date(despesa.atendimento.data ?? '').toLocaleString() }}</td>
        <td class="d-flex justify-content-around"><div style="width: 60%;"> {{ despesa.atendimento.viatura.id }}</div> <div style="width: 40%;"><i style="color: red; cursor: pointer;" @click="abrirViaturaModal(despesa.atendimento.viaturaId)" class="fi fi-rr-light-emergency-on"></i></div></td>
        <td>{{ despesa.tipo}}</td>
        <td>{{ despesa.descricao}}</td>
        <td>{{ despesa.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}</td>
        <td>
          <div class="d-flex justify-content-around">
            <!-- Ícone de editar -->
            <i style="cursor: pointer;" class="fi-rr-edit" @click="abrirModal('editar', despesa)"></i>
            <!-- Ícone de excluir -->
            <i style="cursor: pointer;" class="fi-rr-trash" @click="excluirDespesa(despesa)"></i>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>

      <form id="modalForm" class="row" @submit.prevent="">
        <h1>{{ headerModal }}</h1>

        <div class="col-md-6">
          <label for="atendimento" class="form-label">Atendimentos: </label>
          <select id="atendimento" class="form-select" required v-model="dados.atendimentoId">
            <option v-if="dataSourceAtendimentos.length == 0" :value="0" selected disabled>Nenhum Atendimento Disponível</option>
            <option v-else v-for="atendimento in dataSourceAtendimentos" :value="atendimento.id">Atendimento - Qru: {{ atendimento.qru }}</option>
          </select>
        </div>

        <div class="col-md-6">
          <label for="valor" class="form-label">Valor: </label>
          <input type="number" class="form-control" id="valor" name="valor" required v-model="dados.valor"><br>
        </div>

        <div class="col-md-6">
          <label for="tipo" class="form-label">Tipo: </label>
          <input type="text" class="form-control" id="tipo" name="tipo" required v-model="dados.tipo"><br>
        </div>

        <div class="col-md-6">
          <label for="descricao" class="form-label">Descrição: </label>
          <input type="text" class="form-control" id="descricao" name="descricao" required v-model="dados.descricao"><br>
        </div>

        <div class="col-12 d-flex justify-content-end" style="gap: 2%;">
          <button v-if="acao == 'editar'" type="button" class="btn btn-primary" @click.native="editarDespesa()">Salvar</button>
          <button v-if="acao == 'novo'" type="button" class="btn btn-primary" @click.native="incluirDespesa()">Salvar</button>
          <button type="button" class="btn btn-danger" @click.native="fecharModal()">Fechar</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal" v-if="showViaturaModal">
    <div class="modal-content">
      <span class="close" @click="fecharViaturaModal()">&times;</span>

      <form id="modalForm" class="row" @submit.prevent="">

        <div class="col-md-6">
          <label for="sigla" class="form-label">Sigla: </label>
          <input type="text" class="form-control" id="sigla" name="sigla" disabled v-model="dataSourceViatura.sigla"><br>
        </div>
  
        <div class="col-md-6">
          <label for="obs_vtr" class="form-label">Observação da Viatura: </label>
          <input type="text" class="form-control" id="obs_vtr" name="obs_vtr" disabled v-model="dataSourceViatura.obs_vtr"><br>
        </div>
  
        <div class="col-md-6">
          <label for="marca" class="form-label">Marca: </label>
          <input type="text" class="form-control" id="marca" name="marca" disabled :value="dataSourceViatura.tipo_Viatura.marca"><br>
        </div>
  
        <div class="col-md-6">
          <label for="modelo" class="form-label">Modelo: </label>
          <input type="text" class="form-control" id="modelo" name="modelo" disabled v-model="dataSourceViatura.tipo_Viatura.modelo"><br>
        </div>
  
        <div class="col-md-6">
          <label for="placa" class="form-label">Placa: </label>
          <input type="text" class="form-control" id="placa" name="placa" disabled v-model="dataSourceViatura.tipo_Viatura.placa"><br>
        </div>
  
        <div class="col-md-6">
          <label for="descricao" class="form-label">Descrição: </label>
          <input type="text" class="form-control" id="descricao" name="descricao" disabled v-model="dataSourceViatura.tipo_Viatura.descricao"><br>
        </div>
      </form>
      
      <div class="col-12 d-flex justify-content-end" style="gap: 2%;">
        <button type="button" class="btn btn-danger" @click.native="fecharViaturaModal()">Fechar</button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dataSourceDespesas: [],
      dataSourceAtendimentos: [],
      dataSourceViatura: [],
      searchTerm: null,
      acao: '',
      showModal: false,
      showViaturaModal: false,
      headerModal: '',
      DespesaId: null,
      dados: {
        atendimentoId: null,
        tipo: null,
        descricao: null,
        valor: null
      }
    }
  },
  watch: {
    searchTerm() {
      if (!this.searchTerm) {
        return;
      }
      this.dataSourceDespesas.filter(x => this.searchTerm.toLowerCase().includes(x.atendimento.usuario.nome.toLowerCase()))
    }
  },
  methods: {
    getDespesas () {
      axios.get('https://localhost:7255/api/DespesasAtendimento/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then(res => {
        if (!res.data) {
          this.dataSourceDespesas = [];
          return;
        }
        this.dataSourceDespesas = res.data.$values;
        console.log(res.data.$values)
        return;
      });
    },

    getAtendimentos () {
      return new Promise ( (resolve, reject) => {
        axios.get('https://localhost:7255/api/Atendimento/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    abrirModal (acao, dados=null) {
      this.showModal = true;
      this.acao = acao;

      if (this.acao == 'novo') {
        this.getAtendimentos()
        .then(res => {
          if (!res.data) {
            this.dataSourceAtendimentos = [];
            return;
          }
          this.dataSourceAtendimentos = res.data.$values;
          return;
        })
      }

      if (this.acao == 'editar') {
        this.DespesaId = dados.id;
        this.dados.valor = dados.valor;
        this.dados.tipo = dados.tipo;
        this.dados.descricao = dados.descricao;

        this.getAtendimentos()
        .then(res => {
          if (!res.data) {
            this.dataSourceAtendimentos = [];
            return;
          }
          this.dataSourceAtendimentos = res.data.$values;
          return;
        })
        .then(() => {
          this.dados.atendimentoId = dados.atendimento.id;
        })
      }
    },

    incluirDespesa () {
      axios.post('https://localhost:7255/api/DespesasAtendimento/', this.dados, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => {
        this.getDespesas();
        this.fecharModal();
        return;
      })
      .catch(error => {
        console.log(error)
      })
    },

    editarDespesa () {
      axios.put('https://localhost:7255/api/DespesasAtendimento/' + this.DespesaId, this.dados, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => {
        if (res.status == 200) {
          this.getDespesas();
          this.fecharModal();
          return;
        }
      })
    },

    excluirDespesa (dados) {
      var msg = `Deseja excluir a Despesa QRU: ${dados.atendimento.qru} ?`;
      if (confirm(msg)) {
        axios.delete('https://localhost:7255/api/DespesasAtendimento/' + dados.id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(res => {
          this.getDespesas();
          return;
        })
        .catch(error => {
          console.log(error)
        })
      }
    },

    getViatura (id) {
      axios.get('https://localhost:7255/api/Viatura/' + id, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
      })
      .then(res => {
        this.dataSourceViatura = res.data;
        console.log(this.dataSourceViatura)
        return;
      })
    },

    fecharModal () {
      this.showModal = false;

      this.dados.atendimentoId = null;
      this.dados.valor = null;
    },

    abrirViaturaModal (viaturaId) {
      this.showViaturaModal = true;
      this.getViatura(viaturaId);
    },

    fecharViaturaModal () {
      this.showViaturaModal = false;
      this.dataSourceViatura = {};
    }
  },
  mounted() {
    this.getDespesas()
  }
}

</script>

<style>
.msg {
  background-color: #fefefe;
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