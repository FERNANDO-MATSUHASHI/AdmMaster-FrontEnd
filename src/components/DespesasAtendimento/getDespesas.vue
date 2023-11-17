<template>
    <div class="row" style="padding: 10px 0; display: flex; align-items: center;">

        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <span>QRU: </span>
            <input type="text" v-model="qru">
        </div>

        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <span>Data Inicial: </span>
            <input type="date" v-model="dataInicial"/>
        </div>

        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <span>Data Final: </span>
            <input type="date" v-model="dataFinal"/>
        </div>

        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <button class="btn btn-primary" @click="buscarDespesas">Pesquisar</button>
        </div>

    </div>

    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">QRU</th>
                <th scope="col">Nome</th>
                <th scope="col">Data do Atendimento</th>
                <th scope="col">Viatura</th>
                <th scope="col">Tipo</th>
                <th scope="col">Descrição</th>
                <th scope="col">Valor</th>
                <th scope="col" class="text-center">Opções</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="dataSourceDespesas.length == 0">
                <td colspan="8" class="text-center">Nenhum dado encontrado.</td>
            </tr>
            <tr v-else v-for="despesa in dataSourceDespesas">
                <th scope="row">{{ despesa.atendimento.qru }}</th>
                <td>{{ despesa.atendimento.usuario.nome }}</td>
                <td>{{ parseData(despesa.atendimento.data) }}</td>
                <td class="d-flex justify-content-around"><div style="width: 60%;"> {{ despesa.atendimento.viaturaId }}</div> <div style="width: 40%;"><i style="color: red; cursor: pointer;" @click="abrirViaturaModal(despesa.atendimento.viaturaId)" class="fi fi-rr-light-emergency-on"></i></div></td>
                <td>{{ despesa.tipo}}</td>
                <td>{{ despesa.descricao}}</td>
                <td>{{ despesa.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }}</td>
                <td>
                    <div class="d-flex justify-content-around">
                        <!-- Ícone de editar -->
                        <i style="cursor: pointer;" class="fi-rr-edit" @click="abrirModal(despesa)"></i>
                        <!-- Ícone de excluir -->
                        <i style="cursor: pointer;" class="fi-rr-trash" @click="excluirDespesa(despesa)"></i>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="modal" v-if="showModal">
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>Editar Despesa</h1>
                <span class="close" @click="fecharModal()">&times;</span>
            </div>

            <form id="modalForm" class="row" @submit.prevent="">

                <div class="col-md-6">
                    <label for="atendimento" class="form-label">Atendimentos: </label>
                    <select id="atendimento" class="form-select" required v-model="atendimentoId">
                        <option v-if="dataSourceAtendimentos.length == 0" :value="0" selected disabled>Nenhum Atendimento Disponível</option>
                        <option v-else v-for="atendimento in dataSourceAtendimentos" :value="atendimento.id">Atendimento - Qru: {{ atendimento.qru }}</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label for="valor" class="form-label">Valor: </label>
                    <input type="number" class="form-control" id="valor" name="valor" required v-model="valor"><br>
                </div>

                <div class="col-md-6">
                    <label for="tipo" class="form-label">Tipo: </label>
                    <input type="text" class="form-control" id="tipo" name="tipo" required v-model="tipo"><br>
                </div>

                <div class="col-md-6">
                    <label for="descricao" class="form-label">Descrição: </label>
                    <input type="text" class="form-control" id="descricao" name="descricao" required v-model="descricao"><br>
                </div>

                <div class="col-12 d-flex justify-content-end" style="gap: 2%;">
                    <button type="button" class="btn btn-primary" @click.native="editarDespesa()">Salvar</button>
                    <button type="button" class="btn btn-danger" @click.native="fecharModal()">Fechar</button>
                </div>
            </form>
        </div>
    </div>

    <div class="modal" v-if="showViaturaModal">
        <div class="modal-content">
            <span class="close" @click="fecharViaturaModal()">&times;</span>

            <form id="modalForm" class="row" @submit.prevent="">

                <div class="col-md-6">
                    <label for="sigla" class="form-label">Sigla: </label>
                    <input type="text" class="form-control" id="sigla" name="sigla" disabled v-model="dataSourceViatura.sigla"><br>
                </div>
        
                <div class="col-md-6">
                    <label for="obs_vtr" class="form-label">Observação da Viatura: </label>
                    <input type="text" class="form-control" id="obs_vtr" name="obs_vtr" disabled v-model="dataSourceViatura.obs_vtr"><br>
                </div>
        
                <div class="col-md-6">
                    <label for="marca" class="form-label">Marca: </label>
                    <input type="text" class="form-control" id="marca" name="marca" disabled :value="dataSourceViatura.tipo_Viatura.marca"><br>
                </div>
        
                <div class="col-md-6">
                    <label for="modelo" class="form-label">Modelo: </label>
                    <input type="text" class="form-control" id="modelo" name="modelo" disabled v-model="dataSourceViatura.tipo_Viatura.modelo"><br>
                </div>
        
                <div class="col-md-6">
                    <label for="placa" class="form-label">Placa: </label>
                    <input type="text" class="form-control" id="placa" name="placa" disabled v-model="dataSourceViatura.tipo_Viatura.placa"><br>
                </div>
        
                <div class="col-md-6">
                    <label for="descricao" class="form-label">Descrição: </label>
                    <input type="text" class="form-control" id="descricao" name="descricao" disabled v-model="dataSourceViatura.tipo_Viatura.descricao"><br>
                </div>
            </form>
            
            <div class="col-12 d-flex justify-content-end" style="gap: 2%;">
                <button type="button" class="btn btn-danger" @click.native="fecharViaturaModal()">Fechar</button>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {addNotification, dialogConfirm, dialogAlert} from '../../assets/common.js';

export default {
    components: {
        axios
    },
    data() {
        return {
            dataSourceDespesas: [],
            dataSourceAtendimentos: [],
            dataSourceViatura: [],
            showViaturaModal: false,
            /* Dados da pesquisar Despesas */
            qru: null,
            dataInicial: null,
            dataFinal: null,
            /* Deixar o Modal fechado */
            showModal: false,
            /* Dados do Modal */
            DespesaId: null,
            atendimentoId: null,
            valor: null,
            tipo: null,
            descricao: null
        }
    },
    methods: {
        getDespesas () {
            axios.get('https://localhost:7255/api/DespesasAtendimento/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
            .then(res => {
                if (res.status == 200) {
                    this.dataSourceDespesas = res.data;
                    return;
                }
                    this.dataSourceDespesas = [];
                return;
            });
        },

        getAtendimentos () {
            return new Promise ( (resolve, reject) => {
                axios.get('https://localhost:7255/api/Atendimento/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                .then(res => {
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },

        getViatura (id) {
            return new Promise ((resolve, reject) => {
                axios.get('https://localhost:7255/api/DespesasAtendimento/Viatura/' + id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                .then(res => {
                    resolve(res);
                    // console.log('Sigla VTR-> ', res.data.sigla);
                })
                .catch(error => {
                    reject(error);
                })
            })
        },

        buscarDespesas () {
            console.log(this.qru, this.dataInicial, this.dataFinal)
            if (this.dataInicial && !this.dataFinal) {
                alert("Por Favor, Selecione uma Data Final.");
                return;
            }
            if (!this.dataInicial && this.dataFinal) {
                alert("Por Favor, Selecione uma Data Inicial.");
                return;
            }
            if (new Date(this.dataInicial) > new Date(this.dataFinal)) {
                alert("Data Inicial não pode ser maior que a Data Final.");
                return;
            }

            let url = 'https://localhost:7255/api/DespesasAtendimento/GetDespesasByFilter?';
            url += this.qru && this.dataInicial && this.dataFinal ? `${url}qru=${this.qru}&dataInicial=${this.dataInicial}&dataFinal=${this.dataFinal}` : '';
            url += !this.qru && this.dataInicial && this.dataFinal ? `${url}dataInicial=${this.dataInicial}&dataFinal=${this.dataFinal}` : '';
            url += this.qru && !this.dataInicial && !this.dataFinal ? url+`qru=${this.qru}` : '';

            console.log(url)

            axios.get(url, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(res => {
                console.log(res);
                this.dataSourceDespesas = res.data;
                return;
            })
            .catch(error => {
                console.log(error)
            })
        },

        abrirModal (dados) {
            this.showModal = true;

            this.DespesaId = dados.id;
            this.valor = dados.valor;
            this.tipo = dados.tipo;
            this.descricao = dados.descricao;

            this.getAtendimentos()
            .then(res => {
                if (!res.data) {
                    this.dataSourceAtendimentos = [];
                    return;
                }
                this.dataSourceAtendimentos = res.data;
                return;
            })
            .then(() => {
                this.atendimentoId = dados.atendimento.id;
            });
        },

        abrirViaturaModal (viaturaId) {
            this.getViatura(viaturaId)
            .then(res => {
                if (res.status == 200) {
                this.dataSourceViatura = res.data;
                return;
                }
                this.dataSourceViatura = [];
                return;
            })
            .then(() => {
                this.showViaturaModal = true;
            })
        },

        fecharViaturaModal () {
            this.showViaturaModal = false;
            this.dataSourceViatura = {};
        },

        editarDespesa () {
            if (!this.atendimentoId) {
                addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Selecione um Atendimento.'});
                return;
            }

            if (!this.tipo) {
                addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque um tipo de despesa.'});
                return;
            }

            if (!this.valor) {
                addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque um valor.'});
                return;
            }

            if (!this.descricao) {
                addNotification({backgroundColor: '#FFC000', mensagem: 'Por Favor, Coloque uma descrição.'});
                return;
            }

            let obj = {
                DespesaId: this.DespesaId,
                atendimentoId: this.atendimentoId,
                valor: this.valor,
                tipo: this.tipo,
                descricao: this.descricao
            }
            axios.put('https://localhost:7255/api/DespesasAtendimento/' + this.DespesaId, obj, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(res => {
                if (res.status == 200) {
                    this.getDespesas();
                    addNotification({backgroundColor: '#17B169', mensagem: 'Operação realizada com sucesso.'});
                    this.fecharModal();
                    return;
                }
            });
        },

        excluirDespesa (dados) {
            dialogConfirm({
                header: 'Excluir Despesa',
                mensagem: `Deseja excluir a Despesa QRU: ${dados.atendimento.qru}?`,
                okAction: {
                    callback: () => {
                        axios.delete('https://localhost:7255/api/DespesasAtendimento/' + dados.id, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            },
                        })
                        .then(res => {
                            this.getDespesas();
                            addNotification({backgroundColor: '#17B169', mensagem: 'Operação realizada com sucesso.'});
                            return;
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    }
                }
            });
        },

        fecharModal () {
            this.showModal = false;
        },
        parseData(dataString) {
            const data = new Date(dataString);
            const dia = data.getUTCDate();
            const mes = data.getUTCMonth() + 1; // O mês é baseado em zero (janeiro = 0, fevereiro = 1, ...)
            const ano = data.getUTCFullYear();

            // Formatar a data como "DD/MM/YYYY"
            return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano}`;
        },
    },
    mounted() {
        this.getDespesas()
    }
}

</script>