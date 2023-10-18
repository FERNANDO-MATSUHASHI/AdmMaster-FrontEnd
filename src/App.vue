<script setup>
</script>
 
<template>
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <!-- Navbar Brand-->
        <router-link to="/" class="navbar-brand ps-3"><img src="/public/AdmMasterNome.png" alt=""
                style="width: 80%;"></router-link>
        <!-- Sidebar Toggle-->
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i
                class="fas fa-bars"></i></button>
        <!-- Navbar Search-->
        <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        </form>
        <!-- Navbar-->
        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="#!">Settings</a></li>
                    <li><a class="dropdown-item" href="#!">Activity Log</a></li>
                    <li>
                        <hr class="dropdown-divider" />
                    </li>
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
</template>

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
</style>