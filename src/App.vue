<script setup>
import {normalizeClass, reactive, ref, setBlockTracking } from 'vue';

const visivel = ref(false);
const mudarStatus = () => {
    visivel.value = !visivel.value;
}
</script>


<template>
    <!-- <div v-if="status == 1"> -->
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
                                                <input class="form-control" id="inputEmail" type="email" placeholder="name@example.com" />
                                                <label for="inputEmail">Email</label>
                                            </div>
                                            <div class="form-floating mb-3">
                                                <input class="form-control" id="inputPassword" type="password" placeholder="Password" />
                                                <label for="inputPassword">Senha</label>
                                            </div>
                                            <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <a class="small"></a>
                                                <button id="buttonPrevious" type="button" @click="mudarStatus()" class="btn btn-dark">Login</button>
                                            </div>
                                        </form>
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

    <!-- <nav v-if="status == 2"> -->
        <div :style="{ display: visivel ? 'block' : 'none' }">
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <!-- Navbar Brand-->
            <router-link to="/" class="navbar-brand ps-3"><img src="/AdmMasterNome.png" alt="" style="width: 80%;"></router-link>
            <!-- Sidebar Toggle-->
            <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
            <!-- Navbar Search-->
            <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            </form>
            <!-- Navbar-->
            <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="#!">Settings</a></li>
                        <li><a class="dropdown-item" href="#!">Activity Log</a></li>
                        <li><hr class="dropdown-divider" /></li>
                        <li><a class="dropdown-item" href="#!">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <a class="nav-link">
                                <i class="fas fa-tachometer-alt"></i>
                                <router-link to="/" class="nav-link">Home</router-link>
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-user-add"></i>
                                <router-link to="/Colaborador" class="nav-link">Colaboradores</router-link> 
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-usd-circle"></i>
                                <router-link to="/GerarComissoes" class="nav-link">Gerar Comissões</router-link>
                            </a> 
                            <a class="nav-link">
                                <i class="fi fi-rr-chart-histogram"></i>
                                <router-link to="/Faturamento" class="nav-link">Faturamento</router-link> 
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-hand-holding-usd"></i>
                                <router-link to="/GastosFrota" class="nav-link">Gastos da Frota</router-link> 
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-add"></i>
                                <router-link to="/DespesasAtendimento" class="nav-link">Despesas de Atendimento</router-link> 
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-search-dollar"></i>
                                <router-link to="/RecebimentoComissao" class="nav-link">Recebimento de Comissão</router-link> 
                            </a>
                            <a class="nav-link">
                                <i class="fi fi-rr-hand-holding-medical"></i>
                                <router-link to="/AdicionarAtendimento" class="nav-link">Adicionar Atendimento</router-link> 
                            </a>
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
    <!-- </nav> -->
</template>

<style>
.visivel {
  display: block;
}

.invisivel {
  display: none;
}
</style>