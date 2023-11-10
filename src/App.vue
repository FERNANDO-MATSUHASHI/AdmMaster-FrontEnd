<template>
    <div :style="{ display: visivel ? 'none' : 'block' }">
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
                                        <div class="modal fade" id="erroModal" tabindex="-1"
                                            aria-labelledby="successModalLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="successModalLabel">Erro</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
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
            <div id="layoutAuthentication_footer">
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; AdmMaster 2023</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>


    <div :style="{ display: visivel ? 'block' : 'none' }">
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <!-- Navbar Brand-->
            <router-link to="/" class="navbar-brand ps-3"><img src="/AdmMasterNome.png" alt=""
                    style="width: 80%;"></router-link>
            <!-- Sidebar Toggle-->
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
                    class="fas fa-bars"></i></button>
            <!-- Navbar Search-->
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            </form>
            <!-- Navbar-->
            <div class="btn-group">
                <a type="button" class="btn-secondary dropdown-toggle bg-dark" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false"><i class="fas fa-user fa-fw" style="color: white;"></i>

                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                    <button class="dropdown-item" type="button">Perfil</button>
                    <button class="dropdown-item" type="button">Configurações</button>
                    <button class="dropdown-item" type="button" @click="Logout()">Logout</button>
                </ul>
            </div>
        </nav>

        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <a class="nav-link">
                                <i class="fi fi-rr-user-add"></i>
                                <router-link to="/Colaborador" class="nav-link">Colaboradores</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-hand-holding-medical"></i>
                                <router-link to="/AdicionarAtendimento" class="nav-link">Adicionar Atendimento</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-usd-circle"></i>
                                <router-link to="/Comissoes" class="nav-link">Comissões</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-chart-histogram"></i>
                                <router-link to="/Faturamento" class="nav-link">Faturamento</router-link>
                            </a>
                            <!-- <a class="nav-link">
                                <i class="fi fi-rr-hand-holding-usd"></i>
                                <router-link to="/GastosFrota" class="nav-link">Gastos da Frota</router-link>
                            </a> -->
                            <a class="nav-link">
                                <i class="fi fi-rr-add"></i>
                                <router-link to="/DespesasAtendimento" class="nav-link">Despesas de
                                    Atendimento</router-link>
                            </a>
                            <!-- <a class="nav-link">
                                <i class="fi fi-rr-search-dollar"></i>
                                <router-link to="/RecebimentoComissao" class="nav-link">Recebimento de
                                    Comissão</router-link>
                            </a> -->
                        </div>
                    </div>
                </nav>
            </div>
            <div id="layoutSidenav_content">
                <div class="main container mt-5">
                    <router-view></router-view>
                </div>
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; AdmMaster 2023</div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { RouterView, RouterLink } from 'vue-router';
$('#erroModal').modal('hide');

export default {
    components: {
        axios,
        RouterView,
        RouterLink
    },
  data() {
    return {
        formLogin: {
<<<<<<< HEAD
            email: 'matsu_zf@hotmail.com',
            senha: '1736',
=======
            email: 'alfredinho32@gmail.com',
            senha: '123',
>>>>>>> cb72bbad4cf6d17bfa76f78886d3927f4e978863
        },
        visivel: false,
    };
  },
  methods: {
    Login () {
        axios.post('https://localhost:7255/api/Usuario/Login', this.formLogin, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            // console.log('Resposta da API:', response.data);

            localStorage.setItem('token', response.data)

            // Limpar o formulário
            this.formLogin.email = '';
            this.formLogin.senha = '';
            this.visivel = !this.visivel;
        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error);
            // Exibir o modal de erro
            const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
            erroModal.show();
        });
    },
    Logout (){
        this.visivel = !this.visivel;
    }
  },
  mounted() {
  },
};
</script>

<style>
footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
}

.visivel {
    display: block;
}

.invisivel {
    display: none;
}

.dropdown-menu {
    transform: translateX(-70%);
}

a:not([href]):not([tabindex]),
a:not([href]):not([tabindex]):focus,
a:not([href]):not([tabindex]):hover {
    color: white !important;
}
</style>