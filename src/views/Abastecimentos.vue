<template>
  <main class="abastecimentos">
    <div class="row">
    <div class="d-flex justify-content">
      <img src="../icons/gas-pump-alt.png" style="width: 35px; height: 35px; margin-top: 6px;">
      <div style="margin-left: 20px;" class="col">
        <h1>Abastecimentos</h1>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <button class="btn btn-primary mr-3" @click="incluirAbastecimento()">Incluir Abastecimento</button>
      </div>
    </div>
  </div>
  <hr>

  <getAbastecimento ref="componentGetAbastecimento"></getAbastecimento>

<div class="modal" v-if="showModal">
  <div class="modal-content">
    <span class="close" @click="fecharModal()">&times;</span>

    <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
      <h1>Novo Fornecedor</h1>
      
      <div class="col-md-3">
        <label for="data_nascimento" class="form-label">Data:</label>
        <input type="date" class="form-control" id="data" name="data" required v-model="formData.data_abastecimento"><br>
      </div>

      <div class="col-md-3">
        <label for="viaturaId" class="form-label">Viatura:</label>
        <select id="inputState2" class="form-select" required v-model="formData.viaturaId">
          <option v-for="viatura in viaturas" :key="viatura.id" :value="viatura.id">{{ viatura.sigla }}</option>
        </select>
      </div>

      <div class="col-md-6">
        <label for="fornecedor" class="form-label">Fornecedor:</label>
        <select id="inputState2" class="form-select" required v-model="formData.fornecedorId">
          <option v-for="fornecedor in fornecedores" :key="fornecedor.id" :value="fornecedor.id">{{ fornecedor.nome_fantasia }}</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="tipo_Combustivel" class="form-label">Tipo Combustível:</label>
        <select id="inputState2" class="form-select" required v-model="formData.tipo_combustivelId">
          <option v-for="tipo_Combustivel in tipo_Combustiveis" :key="tipo_Combustivel.id" :value="tipo_Combustivel.id">{{ tipo_Combustivel.nome_combustivel }}</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="valor_unid_abastecimento" class="form-label">Valor Unitário R$:</label>
        <input type="text" class="form-control" id="valor_unid_abastecimento" name="valor_unid_abastecimento" required v-model="formData.valor_unid_abastecimento" placeholder="Ex... 5.69"><br>
      </div>

      <div class="col-md-3">
        <label for="qtd" class="form-label">Quantidade Litros:</label>
        <input type="text" class="form-control" id="qtd" name="qtd" required v-model="formData.qtd" placeholder="Ex... 100.50"><br>
      </div>

      <div class="col-md-3">
        <label for="valor_total_abastecimento" class="form-label">Valor Total R$:</label>
        <input type="text" class="form-control" id="valor_total_abastecimento" name="valor_total_abastecimento" required v-model="formData.valor_total_abastecimento" placeholder="Ex... 100.00"><br>
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
import getAbastecimento from '../components/abastecimento/getAbastecimento.vue';
import PesquisaCEP from '../components/cep/cep.vue';

export default {
  components: {
    axios,
    getAbastecimento,
  },
  data() {
    return {
      formData: {
        data_abastecimento: '',
        valor_unid_abastecimento: '',
        qtd: '',
        valor_total_abastecimento: '',
        viaturaId: '',
        fornecedorId: '',
        tipo_combustivelId: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
    };
  },
  setup() {
    const abastecimentos = ref([]);
    const viaturas = ref([]);
    const fornecedores = ref([]);
    const tipo_Combustiveis = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Abastecimento/Abastecimento/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        abastecimentos.value = response.data;
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

    onMounted(async () => {
      try {
        const responseFornecedores = await axios.get('https://localhost:7255/api/Fornecedor/Fornecedor/'+localStorage.getItem('gerenteId'), {
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
      viaturas,
      fornecedores,
      tipo_Combustiveis
    };
  },
  methods: {
    incluirAbastecimento() {
      this.formData.data_abastecimento = '';
      this.formData.viatura = '';
      this.formData.fornecedor = '';
      this.formData.tipo_Combustivel = '';
      this.formData.valor_unid_abastecimento = '';
      this.formData.valor_total_abastecimento = '';

      this.showModal = true;
    },
    fecharModal() {
      // this.$forceUpdate();
      this.showModal = false;
      this.successModal = false;
    },
    enviarFormulario() {
      this.formData.data = new Date(this.formData_data);
      this.formData.gerenteId = localStorage.getItem('gerenteId');
      console.log('Abastecimento post---> ', this.formData);

      axios.post('https://localhost:7255/api/Abastecimento/', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.data_abastecimento = '';
          this.formData.valor_unid_abastecimento = '';
          this.formData.qtd = '';
          this.formData.valor_total_abastecimento = '';
          this.formData.viaturaId = '';
          this.formData.fornecedorId = '';
          this.formData.tipo_combustivelId = '';
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetAbastecimento.getAbastecimento();
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
