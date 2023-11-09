<script setup>
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const formLogin = ref({
    email: 'asdrubal@teste.com',
    senha: '123',
    // email: '',
    // senha: '',
});

axios.interceptors.request.use((config) => {
    console.log('Dados a serem enviados:', config.data);
    return config;
});

const Login = () => {
    axios.post('https://localhost:7255/api/Usuario/Login', formLogin.value, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            console.log('Resposta da API:', response.data);

            // Limpar o formulário
            formLogin.value.email = '';
            formLogin.value.senha = '';
            router.push('/home');
        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error);
            // Exibir o modal de erro
            const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
            erroModal.show();
        });
};
</script>

<template>
    <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
            <main>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-5">
                            <div class="card shadow-lg border-0 rounded-lg mt-5">
                                <div class="card-header">
                                    <div class="d-flex justify-content-center">
                                        <img src="/AdmMasterLogo.png" alt="" style="width: 70%;">
                                    </div>
                                    <h3 class="text-center font-weight-light my-4">Login</h3>
                                </div>
                                <div class="card-body">
                                    <form>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputEmail" type="email"
                                                placeholder="name@example.com" v-model="formLogin.email" />
                                            <label for="inputEmail">Email</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input class="form-control" id="inputPassword" type="password"
                                                placeholder="Password" v-model="formLogin.senha" />
                                            <label for="inputPassword">Senha</label>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                            <a class="small"></a>
                                            <button id="buttonPrevious" type="button" @click="Login()"
                                                class="btn btn-dark">Login</button>
                                        </div>
                                    </form>
                                    <div class="modal fade" id="erroModal" tabindex="-1" aria-labelledby="successModalLabel"
                                        aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="successModalLabel">Erro</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                        aria-label="Fechar"></button>
                                                </div>
                                                <div class="modal-body">
                                                    e-mail e/ou senha incorretos!
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-primary"
                                                        data-bs-dismiss="modal">Fechar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-center py-3">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style>
.dropdown-menu {
    transform: translateX(-70%);
}

a:not([href]):not([tabindex]),
a:not([href]):not([tabindex]):focus,
a:not([href]):not([tabindex]):hover {
    color: white !important;
}
</style>