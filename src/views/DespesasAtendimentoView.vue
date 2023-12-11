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

  <getDespesas ref="componentGetDespesas"></getDespesas>

  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <span class="close" @click="fecharModal()">&times;</span>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1>Adicionar Despesa</h1>

      </div>

      <form id="modalForm" class="row" @submit.prevent="">

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
          <button type="button" class="btn btn-primary" @click.native="incluirDespesa()">Salvar</button>
          <button type="button" class="btn btn-danger" @click.native="fecharModal()">Fechar</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import getDespesas from '../components/DespesasAtendimento/getDespesas.vue';
import {addNotification, dialogConfirm, dialogAlert} from '../assets/common.js';

export default {
  components: {
    getDespesas
  },
  data() {
    return {
      dataSourceDespesas: [],
      dataSourceAtendimentos: [],
      showModal: false,
      dados: {
        atendimentoId: null,
        gerenteId: null,
        tipo: null,
        descricao: null,
        valor: null
      }
    }
  },
  methods: {
    getAtendimentos () {
      return new Promise ( (resolve, reject) => {
        axios.get('https://localhost:7255/api/Atendimento/Gerente/'+localStorage.getItem('gerenteId'), {
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
    abrirModal () {
      this.showModal = true;

      this.getAtendimentos()
      .then(res => {
        if (!res.data) {
          this.dataSourceAtendimentos = [];
          return;
        }
        this.dataSourceAtendimentos = res.data;
        return;
      })

    },
    incluirDespesa () {
      if (!this.dados.atendimentoId) {
          addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Selecione um Atendimento.'});
          return;
      }

      if (!this.dados.tipo) {
          addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque um tipo de despesa.'});
          return;
      }

      if (!this.dados.valor) {
          addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque um valor.'});
          return;
      }

      if (!this.dados.descricao) {
          addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque uma descrição.'});
          return;
      }

      this.dados.gerenteId = localStorage.getItem('gerenteId');

      axios.post('https://localhost:7255/api/DespesasAtendimento/', this.dados, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => {
        this.$refs.componentGetDespesas.getDespesas();
        addNotification({backgroundColor: '#17B169', mensagem: 'Operação realizada com sucesso.'});
        this.fecharModal();
        return;
      })
      .catch(error => {
        console.log(error)
      })
    },
    fecharModal () {
      this.showModal = false;

      this.dados.atendimentoId = null;
      this.dados.valor = null;
    }
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