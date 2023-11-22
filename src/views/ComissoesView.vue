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
        <input type="date" class="form-control" id="data_inicial" name="data_inicial" required
          v-model="original_dataInicial">
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

    <div v-if="showComissao">
    <div class="input-group input-group-sm mb-3" style="margin-top: 2%;">
      <input type="text" class="form-control" v-model="searchTerm" placeholder="Pesquisa por QRU" />
    </div>

    <table class="tabela1 table table-hover">
      <tr>
        <th scope="col">Data</th>
        <th scope="col">QRU</th>
        <th scope="col">Colaborador</th>
        <th scope="col">Valor Bruto</th>
        <th scope="col">Valor Comissão</th>
      </tr>
      <getComissao v-for="comissao in filteredComissao" 
        :key="comissao.id"
        :id="comissao.id"
        :data="comissao.data"
        :atendimentoNome="comissao.atendimentoNome"
        :usuarioNome="comissao.usuarioNome"
        :valorAtendimento="comissao.valorAtendimento"
        :valorComissao="comissao.valorComissao"
        :comissoes="comissoes"/>
        <tr>
      <th></th>
      <th></th>
      <th>Porcentagem da Comissão: {{ comissoes.porcentagem }} %</th>
      <th>Valor Total Bruto: R$ {{ comissoes.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}</th>
      <th>Valor Comissão: R$ {{ comissoes.totalComissao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}</th>
      </tr>
      <br>
      <br>
    </table>
    </div>

  </main>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
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
    const searchTerm = ref(null);

    // Filtro
    const filteredComissao = computed(() => {
      if (!searchTerm.value) {
        console.log('Filtro-> ', comissoes.value.listaAuxiliar)
        return comissoes.value.listaAuxiliar;
      }
      const searchTermLowerCase = searchTerm.value;
      return comissoes.value.listaAuxiliar.filter(comissao => {
        const nomeLowerCase = comissao.atendimentoNome;
        return nomeLowerCase.includes(searchTermLowerCase);
      });
    });

    onMounted(async () => {
      try {
        const responseUsuarios = await axios.get('https://localhost:7255/api/Usuario/Colaboradores/'+localStorage.getItem('gerenteId'), {
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
      searchTerm,
      filteredComissao,
    }
  },
  methods: {
    pesquisar() {
      // Converter Date em DateTime
      const dataInicial = new Date(this.original_dataInicial);
      dataInicial.setDate(dataInicial.getDate());
      this.formData.dataInicial = dataInicial;

      const dataFinal = new Date(this.original_dataFinal);
      dataFinal.setDate(dataFinal.getDate());
      this.formData.dataFinal = dataFinal;
      // this.formData.usuarioId = localStorage.getItem('gerenteId');

      axios.post('https://localhost:7255/api/Comissao', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          this.comissoes = response.data;
          console.log('Comissões ComissoesView-> ', this.comissoes.listaAuxiliar);
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
  width: 67vw;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: -9%;
}
</style>