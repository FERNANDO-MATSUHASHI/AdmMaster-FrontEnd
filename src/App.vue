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
                <a style="margin-right: 20px;">{{ this.formLogado.nome }}</a>

                <a type="button" class="btn-secondary dropdown-toggle bg-dark" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false"><i class="fas fa-user fa-fw" style="color: white;"></i>

                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                    <button class="dropdown-item" type="button" @click="Perfil()">Perfil</button>
                
                    <button class="dropdown-item" type="button" @click="Logout()">Logout</button>
                </ul>
            </div>
        </nav>

        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <a class="nav-link" v-if="this.formLogado.cargoId === 1">
                                <i class="fi fi-rr-user-add"></i>
                                <router-link to="/Colaborador" class="nav-link">Colaboradores</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-hand-holding-medical"></i>
                                <router-link to="/Atendimento" class="nav-link">Atendimento</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-usd-circle"></i>
                                <router-link to="/Comissoes" class="nav-link">Comissões</router-link>
                            </a>
                            <a class="nav-link" v-if="this.formLogado.cargoId === 1">
                                <i class="fi fi-rr-chart-histogram"></i>
                                <router-link to="/Faturamento" class="nav-link">Faturamento</router-link>
                            </a>
                            <a class="nav-link" v-if="this.formLogado.cargoId === 1">
                                <i class="fi fi-rr-add"></i>
                                <router-link to="/DespesasAtendimento" class="nav-link">Despesas de Atendimento</router-link>
                            </a>
                            <a v-if="this.formLogado.cargoId === 1" class="nav-link" href="#" data-bs-toggle="collapse" data-bs-target="#collapseGastos" aria-expanded="false" aria-controls="collapseGastos">
                                <div class="sb-nav-link-icon"><i class="fi fi-rr-hand-holding-usd" style="color:white"></i></div>
                                Gastos da Frota
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div v-if="this.formLogado.cargoId === 1" class="collapse" id="collapseGastos" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                    <a class="nav-link">
                                        <router-link to="/Fornecedor" class="nav-link">Fornecedor</router-link>
                                    </a>

                                    <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                        Gastos
                                        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                                    </a>
                                    <div class="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                        <nav class="sb-sidenav-menu-nested nav">
                                            <router-link to="/Abastecimentos" class="nav-link">Abastecimentos</router-link>
                                            <router-link to="/Manutencao" class="nav-link">Manutenção</router-link>
                                        </nav>
                                    </div>
                                </nav>
                            </div>

                            <div class="sb-sidenav-menu-heading" v-if="this.formLogado.cargoId === 1">Cadastros</div>
                            <a v-if="this.formLogado.cargoId === 1" class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseViatura" aria-expanded="false" aria-controls="collapseLayouts">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Viatura
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseViatura" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link to="/TipoViatura" class="nav-link">Tipo de Viatura</router-link>
                                    <router-link to="/Viatura" class="nav-link">Viatura</router-link>
                                </nav>
                            </div>
                            <a v-if="this.formLogado.cargoId === 1" class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseVeiculo" aria-expanded="false" aria-controls="collapseLayouts">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Veículo
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseVeiculo" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link to="/TipoVeiculo" class="nav-link">Tipo de Veículo Removido</router-link>
                                    <router-link to="/TipoServico" class="nav-link">Tipo de Serviço</router-link>
                                    <router-link to="/Veiculo" class="nav-link">Veículo Valores</router-link>
                                </nav>
                            </div>
                            <a v-if="this.formLogado.cargoId === 1" class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseEmpresas" aria-expanded="false" aria-controls="collapseLayouts">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Empresas
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseEmpresas" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link to="/Empresa" class="nav-link">Empresas Parceiras</router-link>
                                </nav>
                            </div>
                            <a v-if="this.formLogado.cargoId === 1" class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseTipoCombustivel" aria-expanded="false" aria-controls="collapseLayouts">
                                <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Tipo Combustível
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                            </a>
                            <div class="collapse" id="collapseTipoCombustivel" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav">
                                    <router-link to="/TipoCombustivel" class="nav-link">Tipo Combustível</router-link>
                                </nav>
                            </div>




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

    <div class="modal1 overlay" v-if="showModal">
        <div class="modal-content1">
            <span class="close" @click="fecharModal()">&times;</span>
            <h1>Perfil</h1>
            <hr class="perfil-line">
            <br>
            <br>
            <h4><strong>Nome:</strong> {{ this.formLogado.nome }}</h4>
            <h4><strong>E-mail:</strong> {{ this.formLogado.email }}</h4>
            <h4><strong>Data de Nascimento:</strong> {{ parseData(this.formLogado.data_nascimento) }}</h4>
            <h4><strong>Gerente Id:</strong> {{ this.formLogado.gerenteId }}</h4>
            <h4><strong>Cargo:</strong> {{ obterNomeDoCargo(this.formLogado.cargoId) }}</h4>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { RouterView, RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

export default {
    components: {
        axios,
        RouterView,
        RouterLink
    },
    data() {
        return {
            formLogin: {
                email: 'matsu_zf@hotmail.com',
                senha: '1736',
            },
            formLogado: {
                nome: '',
                email: '',
                data_nascimento: '',
                gerenteId: '',
                cargoId: '',
            },
            visivel: false,
            showModal: false,
        };
    },
    setup() {
    const cargos = ref([]);

    onMounted(async () => {
      try {
        const responseCargo = await axios.get('https://localhost:7255/api/Cargo');
        cargos.value = responseCargo.data;
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    });

    return {
      cargos
    };
  },
    methods: {
        Login() {
            axios.post('https://localhost:7255/api/Usuario/Login', this.formLogin, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    // console.log('Resposta da API:', response.data);

                    localStorage.setItem('token', response.data);

                    const emailModificado = this.formLogin.email.replace('@', '%40');
                    const url = 'https://localhost:7255/api/Usuario/Email?email=' + emailModificado;

                    axios.get(url, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                    })
                        .then(response => {
                            // console.log('Resposta da API email: ', response.data);
                            this.formLogado.nome = response.data.nome;
                            this.formLogado.email = response.data.email;
                            this.formLogado.data_nascimento = response.data.data_nascimento;
                            this.formLogado.gerenteId = response.data.gerenteId;
                            localStorage.setItem('gerenteId', response.data.gerenteId);
                            localStorage.setItem('cargoId', response.data.cargoId);
                            localStorage.setItem('IdUsuarioLogado', response.data.id);
                            // console.log('Id Usuário Logado Login-> ', localStorage.getItem('IdUsuarioLogado'));
                            this.formLogado.cargoId = response.data.cargoId;
                        })
                        .catch(error => {
                            console.error('Erro ao enviar formulário:', error);
                            // Exibir o modal de erro
                            const erroModal = new bootstrap.Modal(document.getElementById('erroModal'));
                            erroModal.show();
                        });

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
        Logout() {
            // this.$router.push('/').then(() => {
            //     window.location.reload();
            // });
            window.location.reload();
        },
        fecharModal() {
            this.showModal = false;
        },
        Perfil() {
            this.showModal = true;
        },
        parseData(dataString) {
            const data = new Date(dataString);
            const dia = data.getUTCDate();
            const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
            const ano = data.getUTCFullYear();

            // Formatar a data como "DD/MM/YYYY"
            return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
        },
        // Método para obter o nome do cargo com base no cargoId
        obterNomeDoCargo(idcargo) {
            const cargo = this.cargos.find(c => c.id === idcargo);
            return cargo ? cargo.descricao : 'Cargo Desconhecido';
        },
    },
    mounted() {
    },
};
</script>

<style>
footer {
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

.perfil-line {
  margin: 20px 0; /* Adapte conforme necessário */
  border: 0;
  border-top: 1px solid #4b4b4b; /* Cor da linha */
}

.modal1 {
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

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Fundo escurecido */
    z-index: 1000;
}

.modal-content1 {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 30%;
    height: 40vh;
    border-radius: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
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