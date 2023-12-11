<template>
  <main class="fornecedor">
  <div class="row">
    <div class="d-flex justify-content">
      <i style="font-size: 40px; margin-left: 30px;" class="fi fi-rr-box-open-full"></i>
      <div style="margin-left: 20px;" class="col">
        <h1>Fornecedor</h1>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <button class="btn btn-primary mr-3" @click="incluirFornecedor()">Incluir Fornecedor</button>
      </div>
    </div>
  </div>
  <hr>

  <getFornecedor ref="componentGetFornecedor"></getFornecedor>

<div class="modal" v-if="showModal">
  <div class="modal-content">
    <span class="close" @click="fecharModal()">&times;</span>

    <form id="modalForm" class="row" @submit.prevent="enviarFormulario()">
      <h1>Novo Fornecedor</h1>
      
      <div class="col-md-6">
        <label for="cnpj" class="form-label">CNPJ:</label>
        <input type="text" class="form-control" id="cnpj" name="cnpj" required @input="formatarCNPJ" v-model="formData.cnpj" placeholder="Ex... 12.345.678/0001-60"><br>
      </div>

      <div class="col-md-6">
        <label for="razao_social" class="form-label">Razão Social:</label>
        <input type="text" class="form-control" id="razao_social" name="razao_social" required v-model="formData.razao_social" placeholder="Ex... AdmMaster Ltda - ME"><br>
      </div>

      <div class="col-md-6">
        <label for="nome_fantasia" class="form-label">Nome Fantasia:</label>
        <input type="text" class="form-control" id="nome_fantasia" name="nome_fantasia" required v-model="formData.nome_fantasia" placeholder="Ex... AdmMaster"><br>
      </div>

      <div class="col-md-6">
        <label for="telefone" class="form-label">Telefone:</label>
        <input type="text" class="form-control" id="telefone" name="telefone" required @input="formatarTelefone" v-model="formData.telefone" placeholder="Ex... (14)99989-1020"><br>
      </div>

      <div class="col-md-6">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email" required v-model="formData.email"  placeholder="Ex... teste@teste.com"><br>
      </div>

      <div class="col-md-2">
        <label for="cep" class="form-label">CEP:</label>
        <input type="text" class="form-control" id="cep" name="cep" required v-model="formData.cep" placeholder="Ex... 17506000"><br>
      </div>

      <div class="col-2">
        <br>
        <button type="button" class="btn btn-primary mr-3" @click="pesquisarCEP">Pesquisar</button>
      </div>

      <!-- <PesquisaCEP /> -->

      <div class="col-md-6">
        <label for="rua" class="form-label">Rua:</label>
        <input type="text" class="form-control" id="rua" name="rua" required v-model="formData.rua" disabled="isInputLocked"><br>
      </div>

      <div class="col-md-6">
        <label for="numero" class="form-label">Número:</label>
        <input type="text" class="form-control" id="numero" name="numero" required v-model="formData.numero" placeholder="Ex... 100" ref="numero"><br>
      </div>

      <div class="col-md-6">
        <label for="cidade" class="form-label">Cidade:</label>
        <input type="text" class="form-control" id="cidade" name="cidade" required v-model="formData.cidade" disabled="isInputLocked"><br>
      </div>

      <div class="col-md-6">
        <label for="estado" class="form-label">Estado:</label>
        <input type="text" class="form-control" id="estado" name="estado" required v-model="formData.estado" disabled="isInputLocked"><br>
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

<div class="modal" v-if="erroModal">
    <div class="modal-dialog">
      <div class="msg1">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Erro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"
              @click="fecharModalErro()"></button>
          </div>
          <div class="modal-body">
            CEP inválido!
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="fecharModalErro()">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</main>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import getFornecedor from '../components/fornecedor/getFornecedor.vue';
import PesquisaCEP from '../components/cep/cep.vue';

export default {
  components: {
    axios,
    getFornecedor,
    PesquisaCEP,
  },
  data() {
    return {
      formData: {
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        telefone: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        gerenteId: '',
      },
      showModal: false,
      successModal: false,
      erroModal: false,
    };
  },
  setup() {
    const fornecedores = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('https://localhost:7255/api/Fornecedor/Fornecedor/'+localStorage.getItem('gerenteId'), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fornecedores.value = response.data;
        // console.log('Dados retornados da API Colaborador', response.data);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      fornecedores,
    };
  },
  methods: {
    incluirFornecedor() {
      this.formData.cnpj = '';
      this.formData.razao_social = '';
      this.formData.nome_fantasia = '';
      this.formData.telefone = '';
      this.formData.email = '';
      this.formData.cep = '';
      this.formData.rua = '';
      this.formData.numero = '';
      this.formData.cidade = '';
      this.formData.estado = '';

      this.showModal = true;
    },
    fecharModal() {
      // this.$forceUpdate();
      this.showModal = false;
      this.successModal = false;
      this.erroModal = false;
    },
    fecharModalErro() {
      this.erroModal = false;
    },
    enviarFormulario() {
      this.formData.gerenteId = localStorage.getItem('gerenteId');
      this.formData.cnpj = this.formData.cnpj.replace(/\D/g, '');
      this.formData.telefone = this.formData.telefone.replace(/\D/g, '');

      axios.post('https://localhost:7255/api/Fornecedor', this.formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          console.log('Resposta da API:', response.data);

          // Limpar o formulário
          this.formData.cnpj = '';
          this.formData.razao_social = '';
          this.formData.nome_fantasia = '';
          this.formData.telefone = '';
          this.formData.email = '';
          this.formData.cep = '';
          this.formData.rua = '';
          this.formData.numero = '';
          this.formData.cidade = '';
          this.formData.estado = '';
          this.formData.gerenteId = '';

          // Exibir o modal de sucesso
          this.$refs.componentGetFornecedor.getFornecedor();
          this.successModal = true;
          return;
        })
        .catch(error => {
          console.error('Erro ao enviar formulário:', error);
        });
    },
    formatarCNPJ() {
      // Remova caracteres não numéricos
      const cnpjLimpo = this.formData.cnpj.replace(/\D/g, '');

      // Verifica se o CNPJ tem pelo menos 14 dígitos
      if (cnpjLimpo.length >= 14) {
        // Aplica a máscara de CNPJ (XX.XXX.XXX/XXXX-XX)
        this.formData.cnpj = cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
      }
    },
    formatarTelefone() {
      // Remove todos os caracteres não numéricos
      const telefoneLimpo = this.formData.telefone.replace(/\D/g, '');

      if (telefoneLimpo.length == 10){
        this.formData.telefone = telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');  
      } else {
        this.formData.telefone = telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }      
    },
    async pesquisarCEP() {
      const cep = this.formData.cep;
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
        if (!response.ok) {
          throw new Error('Erro ao buscar endereço.');
        }

        const data = await response.json();
        // console.log('CEP-> ', data);
        this.formData.rua = data.logradouro;
        this.formData.cidade = data.localidade;
        this.formData.estado = data.uf;

        this.$refs.numero.focus();

        return;
      } catch (error) {
        console.error('Erro na requisição:', error.message);
        this.erroModal = true;
        throw error;
      }
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
