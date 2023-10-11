<script setup>
</script>

<template>
    <nav>
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <!-- Navbar Brand-->
            <router-link to="/" class="navbar-brand ps-3">Adm - Master</router-link>
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
                            <div class="sb-sidenav-menu-heading"></div>
                            <a class="nav-link">
                                <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
                            </a>
                            <a class="nav-link">
                                <div><i class="fi fi-rr-user-add"></i></div>
                                <router-link to="/colaborador" class="nav-link">Colaboradores</router-link> 
                            </a>
                            <a class="nav-link">
                                <div><i class="fi fi-rr-usd-circle"></i></div>
                                <router-link to="/" class="nav-link">Gerar Comissões</router-link>
                            </a> 
                            <a class="nav-link">
                                <div><i class="fi fi-rr-chart-histogram"></i></div>
                                <router-link to="/" class="nav-link">Faturamento</router-link> 
                            </a>
                            <a class="nav-link">
                                <div><i class="fi fi-rr-hand-holding-usd"></i></div>
                                <router-link to="/" class="nav-link">Gastos da Frota</router-link> 
                            </a>
                            <a class="nav-link">
                                <div><i class="fi fi-rr-add"></i></div>
                                <router-link to="/" class="nav-link">Despesas de Atendimento</router-link> 
                            </a>
                            <a class="nav-link">
                                <div><i class="fi fi-rr-search-dollar"></i></div>
                                <router-link to="/" class="nav-link">Recebimento de Comissão</router-link> 
                            </a>
                        </div>
                    </div>
                </nav>
            </div>

            <div id="layoutSidenav_content">
                <div class="main">
            <router-view></router-view>
        </div>
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; Your Website 2023</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div> 
        </div>

    </nav>
</template>
