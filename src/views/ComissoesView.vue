<template>
  <main class="gerarComissoes">
    <div class="row">
      <div class="d-flex justify-content">
        <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-usd-circle"></i>
        <div style="margin-left: 20px;">
          <h1>Comissões</h1>
          <div class="linha-horizontal"></div>
        </div>
      </div>
    </div><br>

    <div class="col-11 d-flex justify-content-end align-items-center">
      <div class="col-md-3">
        <label for="data_inicial" class="form-label">Data Inicial:</label>
        <input type="date" class="form-control" id="data_inicial" name="data_inicial" required v-model="original_dataInicial">
      </div>
      <div class="col-md-3">
        <label for="data_final" class="form-label">Data Final:</label>
        <input type="date" class="form-control" id="data_final" name="data_final" required v-model="original_dataFinal">
      </div>
      <div class="col-md-3">
        <label for="usuarioId" class="form-label">Colaborador:</label>
        <select id="inputState2" class="form-select" required v-model="formData.usuarioId">
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">{{ usuario.nome }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <br>
        <button class="btn btn-primary" @click="pesquisar()">Pesquisar</button>        
      </div>

    </div>
    <div>
        <getComissao :comissoes="comissoes" :formData="formData" v-if="showComissao"/>
      </div>
  </main>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { DateTime } from 'luxon';
import getComissao from '../components/comissao/getComissao.vue';

export default {
  components: {
    axios,
    getComissao,
  },
  data() {
    return {
      formData: {
        dataInicial: '',
        dataFinal: '',
        usuarioId: '',
      },
      original_dataInicial: '',
      original_dataFinal: '',
      showComissao: false,
    }
  },
  setup() {
    const usuarios = ref([]);
    const comissoes = ref([]);

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
      usuarios,
      comissoes,
    }
  },
  methods: {
    pesquisar() {
      // Converter Date em DateTime
      // this.formData.dataInicial = new Date(this.original_dataInicial);
      // this.formData.dataFinal = new Date(this.original_dataFinal);

      const dataInicial = new Date(this.original_dataInicial);
      dataInicial.setDate(dataInicial.getDate());
      this.formData.dataInicial = dataInicial;
      
      const dataFinal = new Date(this.original_dataFinal);
      dataFinal.setDate(dataFinal.getDate());
      this.formData.dataFinal = dataFinal;


      // const dataInicial = DateTime.fromFormat(this.original_dataInicial, 'yyyy-MM-dd', { zone: 'America/Sao_Paulo' })
      // this.formData.dataInicial = dataInicial.toFormat('EEE MMM dd yyyy HH:mm:ss \'GMT-0300\' (\'Horário Padrão de Brasília\')');

      // const dataFinal = DateTime.fromFormat(this.original_dataFinal, 'yyyy-MM-dd', { zone: 'America/Sao_Paulo' })
      // this.formData.dataFinal = dataFinal.toFormat('EEE MMM dd yyyy HH:mm:ss \'GMT-0300\' (\'Horário Padrão de Brasília\')');



      console.log('Pesquisar-> Data Inicial ', this.formData.dataInicial);
      console.log('Pesquisar-> Data Final ', this.formData.dataFinal);
      // console.log('Pesquisar-> Data Usuário ', this.formData.usuarioId);

      axios.post('https://localhost:7255/api/Comissao', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          this.comissoes = response.data;
          // console.log('Comissões ComissoesView-> ', this.comissoes.listaAuxiliar);
          this.showComissao = true;
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    }
  }
}
</script>

<style>
.linha-horizontal {
  border-top: 2px solid #8a888881;
  width: 73vw;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -9%;
}
</style>