<script setup>
import { reactive, ref } from 'vue';
import router from '@/router';
let status = reactive(ref(1));

const Logout = () => {
    router.push('/');
}
</script>

<template>
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <!-- Navbar Brand-->
        <router-link to="/home" class="navbar-brand ps-3"><img src="/AdmMasterNome.png" alt=""
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
                            <router-link to="/DespesasAtendimento" class="nav-link">Despesas de
                                Atendimento</router-link>
                        </a>
                        <a class="nav-link">
                            <i class="fi fi-rr-search-dollar"></i>
                            <router-link to="/RecebimentoComissao" class="nav-link">Recebimento de
                                Comissão</router-link>
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
                <div class="d-flex justify-content-center mt-5">
                    <img src="\AdmMasterLogo.png" alt="">
                </div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style>
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