<!-- PesquisaCEP.vue -->
<template>
    <div>
      <!-- <label for="cep">CEP:</label>
      <input type="text" id="cep" v-model="cep" @input="formatarCEP">
      <button @click="pesquisarCEP">Pesquisar</button> -->
      <form>
        
      <div class="col-md-2">
        <label for="cep" class="form-label">CEP:</label>
        <input type="text" class="form-control" id="cep" name="cep" required v-model="cep" placeholder="Ex... 17506000"><br>
      </div>
      <div class="col-2">
        <br>
        <button type="button" class="btn btn-primary mr-3" @click="pesquisarCEP">Pesquisar</button>
      </div>
    </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cep: '',
        endereco: null,
      };
    },
    methods: {
      formatarCEP() {
        // Remova caracteres não numéricos
        this.cep = this.cep.replace(/\D/g, '');
      },
      async pesquisarCEP() {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${this.cep}/json/`);
          if (!response.ok) {
            throw new Error('Erro ao buscar endereço.');
          }
          const data = await response.json();
          this.endereco = data;
        } catch (error) {
          console.error('Erro na requisição:', error.message);
        }
      },
    },
  };
  </script>
  