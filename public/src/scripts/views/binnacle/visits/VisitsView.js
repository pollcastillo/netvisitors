//
//  VisitsView.ts
//
//  Generated by Poll Castillo on 09/03/2023.
//
import { Config } from "../../../Configs.js";
import { getEntityData, getEntitiesData, getUserInfo } from "../../../endpoints.js";
import { CloseDialog, drawTagsIntoTables, renderRightSidebar, filterDataByHeaderType, verifyUserType, inputObserver, generateCsv } from "../../../tools.js";
import { UIContentLayout, UIRightSidebar } from "./Layout.js";
import { UITableSkeletonTemplate } from "./Template.js";
// Local configs
const tableRows = Config.tableRows;
let currentPage = Config.currentPage;
const pageName = 'Visitas';
const currentUserData = async() => {
    const currentUser = await getUserInfo();
    const user = await getEntityData('User', `${currentUser.attributes.id}`);
    return user;
}
const GetVisits = async () => {
    const currentUser = await currentUserData(); //usuario logueado
    const visits = await getEntitiesData('Visit');
    const FCustomer = visits.filter(async (data) => {
        const userCustomer = await getEntityData('User', `${data.user.id}`);
        userCustomer.customer.id === `${currentUser.customer.id}`
    });
    return FCustomer;
};
export class Visits {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.siebarDialogContainer = document.getElementById('entity-editor-container');
        this.appContainer = document.getElementById('datatable-container');
        this.render = async () => {
            let visitsArray = await GetVisits();
            this.appContainer.innerHTML = '';
            this.appContainer.innerHTML = UIContentLayout;
            // Getting interface elements
            const viewTitle = document.getElementById('view-title');
            const tableBody = document.getElementById('datatable-body');
            // Changing interface element content
            viewTitle.innerText = pageName;
            tableBody.innerHTML = UITableSkeletonTemplate.repeat(tableRows);
            // Exec functions
            this.load(tableBody, currentPage, visitsArray);
            this.searchVisit(tableBody, visitsArray);
            new filterDataByHeaderType().filter();
            this.pagination(visitsArray, tableRows, currentPage);
            this.export();
            // Rendering icons
        };
        this.load = (tableBody, currentPage, visits) => {
            tableBody.innerHTML = ''; // clean table
            // configuring max table row size
            currentPage--;
            let start = tableRows * currentPage;
            let end = start + tableRows;
            let paginatedItems = visits.slice(start, end);
            // Show message if page is empty
            if (visits.length === 0) {
                let row = document.createElement('TR');
                row.innerHTML = `
            <td>No existen datos<td>
            <td></td>
            <td></td>
            `;
                tableBody.appendChild(row);
            }
            else {
                for (let i = 0; i < paginatedItems.length; i++) {
                    let visit = paginatedItems[i]; // getting visit items
                    let row = document.createElement('TR');
                    row.innerHTML += `
                    <td style="white-space: nowrap">${visit.firstName} ${visit.firstLastName} ${visit.secondLastName}</td>
                    <td>${visit.dni}</td>
                    <td id="table-date">${visit.createdDate}</td>
                    <td id="table-time" style="white-space: nowrap">${visit.creationTime}</td>
                    <td>${verifyUserType(visit.user.userType)}</td>
                    <td class="tag"><span>${visit.visitState.name}</span></td>
                    <td id="table-time">${visit.citadel.description}</td>

                    <td>
                        <button class="button" id="entity-details" data-entityId="${visit.id}">
                            <i class="table_icon fa-regular fa-magnifying-glass"></i>
                        </button>
                    </td>
                `;
                    tableBody.appendChild(row);
                    drawTagsIntoTables();
                }
                this.previewVisit();
                this.fixCreatedDate();
            }
        };
        this.searchVisit = async (tableBody, visits) => {
            const search = document.getElementById('search');
            await search.addEventListener('keyup', () => {
                const arrayVisits = visits.filter((visit) => `${visit.dni}${visit.firstName}${visit.firstLastName}${visit.secondLastName}${visit.createdDate}${visit.visitState.name}${visit.user.userType}${visit.creationTime}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase()));
                let filteredVisit = arrayVisits.length;
                let result = arrayVisits;
                if (filteredVisit >= Config.tableRows)
                    filteredVisit = Config.tableRows;
                this.load(tableBody, currentPage, result);
            });
        };
        this.previewVisit = async () => {
            const openButtons = document.querySelectorAll('#entity-details');
            openButtons.forEach((openButton) => {
                const entityId = openButton.dataset.entityid;
                openButton.addEventListener('click', () => {
                    renderInterface(entityId);
                });
            });
            const renderInterface = async (entity) => {
                let entityData = await getEntityData('Visit', entity);
                console.log(entityData);
                renderRightSidebar(UIRightSidebar);
                const visitName = document.getElementById('visit-name');
                visitName.value = `${entityData.firstName} ${entityData.firstLastName}`;
                const visitReason = document.getElementById('visit-reason');
                visitReason.value = entityData.reason;
                const visitAutorizedBy = document.getElementById('visit-authorizedby');
                visitAutorizedBy.value = entityData.authorizer;
                const visitStatus = document.getElementById('visit-status');
                visitStatus.innerText = entityData.visitState.name;
                const visitCitadel = document.getElementById('visit-citadel');
                visitCitadel.value = entityData.citadel.description;
                const visitCitadelID = document.getElementById('visit-citadelid');
                visitCitadelID.value = entityData.citadel.name;
                const visitDepartment = document.getElementById('visit-department');
                visitDepartment.value = entityData.department.name;
                console.log(entityData.citadel.name);
                this.closeRightSidebar();
                drawTagsIntoTables();
            };
        };
        this.closeRightSidebar = () => {
            const closeButton = document.getElementById('close');
            const editor = document.getElementById('entity-editor-container');
            closeButton.addEventListener('click', () => {
                new CloseDialog().x(editor);
            });
        };
        this.fixCreatedDate = () => {
            const tableDate = document.querySelectorAll('#table-date');
            tableDate.forEach((date) => {
                const separateDateAndTime = date.innerText.split('T');
                date.innerText = separateDateAndTime[0];
            });
        };
        this.export = () => {
            const exportNotes = document.getElementById('export-entities');
            exportNotes.addEventListener('click', async() => {
                this.dialogContainer.style.display = 'block';
                this.dialogContainer.innerHTML = `
                    <div class="dialog_content" id="dialog-content">
                        <div class="dialog">
                            <div class="dialog_container padding_8">
                                <div class="dialog_header">
                                    <h2>Seleccionar la fecha</h2>
                                </div>

                                <div class="dialog_message padding_8">
                                    <div class="form_group">
                                        <div class="form_input">
                                            <label class="form_label" for="start-date">Desde:</label>
                                            <input type="date" class="input_date input_date-start" id="start-date" name="start-date">
                                        </div>
                        
                                        <div class="form_input">
                                            <label class="form_label" for="end-date">Hasta:</label>
                                            <input type="date" class="input_date input_date-end" id="end-date" name="end-date">
                                        </div>
                                    </div>
                                </div>

                                <div class="dialog_footer">
                                    <button class="btn btn_primary" id="cancel">Cancelar</button>
                                    <button class="btn btn_danger" id="export-data">Exportar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                let fecha = new Date(); //Fecha actual
                let mes = fecha.getMonth()+1; //obteniendo mes
                let dia = fecha.getDate(); //obteniendo dia
                let anio = fecha.getFullYear(); //obteniendo año
                if(dia<10)
                    dia='0'+dia; //agrega cero si el menor de 10
                if(mes<10)
                    mes='0'+mes //agrega cero si el menor de 10

                document.getElementById("start-date").value = anio+"-"+mes+"-"+dia;
                document.getElementById("end-date").value = anio+"-"+mes+"-"+dia;
                inputObserver();
                const _closeButton = document.getElementById('cancel');
                const exportButton = document.getElementById('export-data');
                const _dialog = document.getElementById('dialog-content');
                exportButton.addEventListener('click', async() => {
                    let rows = [];
                    const _values = {
                        start: document.getElementById('start-date'),
                        end: document.getElementById('end-date'),
                    }
                    const visits = await GetVisits();
                    for(let i=0; i < visits.length; i++){
                        let visit = visits[i]
                        if(visit.ingressDate >= _values.start.value && visit.ingressDate <= _values.end.value){
                            let obj = {
                                "Nombre": `${visit.firstName} ${visit.firstLastName} ${visit.secondLastName}`,
                                "DNI": `${visit.dni}`,
                                "Fecha Creación": `${visit.creationDate}`,
                                "Hora Creación": `${visit.creationTime}`,
                                "Usuario": `${visit.user.firstName} ${visit.user.lastName}`,
                                "Tipo": `${verifyUserType(visit.user.userType)}`,
                                "Departamento": `${visit.department.name}`,
                                "Estado": `${visit.visitState.name}`,
                                "Verificado": `${visit.verifiedDocument ? 'Si' : 'No'}`,
                                "Favorita": `${visit.favorite ? 'Si' : 'No'}`,
                                "Teléfono": `${visit.phoneNumber}`,
                                "Autorizado": `${visit.authorizer}`,
                                "Fecha Ingreso": `${visit.ingressDate}`,
                                "Hora Ingreso": `${visit.ingressTime}`,
                                "Emitido Ingreso": `${visit.ingressIssuedId.firstName} ${visit.ingressIssuedId.lastName}`,
                                "Fecha Salida": `${visit.egressDate}`,
                                "Hora Salida": `${visit.egressTime}`,
                                "Emitido Salida": `${visit.egressIssuedId?.firstName} ${visit.egressIssuedId?.lastName}`,
                                "Asunto": `${visit.reason.split("\n").join("(salto)")}`,
                              }
                              rows.push(obj);
                        }
                        
                    }
                    generateCsv(rows, "Visitas");
                    
                    
                });
                _closeButton.onclick = () => {
                    new CloseDialog().x(_dialog);
                };
            });
        };
    }
    pagination(items, limitRows, currentPage) {
        const tableBody = document.getElementById('datatable-body');
        const paginationWrapper = document.getElementById('pagination-container');
        paginationWrapper.innerHTML = '';
        let pageCount;
        pageCount = Math.ceil(items.length / limitRows);
        let button;
        for (let i = 1; i < pageCount + 1; i++) {
            button = setupButtons(i, items, currentPage, tableBody, limitRows);
            paginationWrapper.appendChild(button);
        }
        function setupButtons(page, items, currentPage, tableBody, limitRows) {
            const button = document.createElement('button');
            button.classList.add('pagination_button');
            button.innerText = page;
            button.addEventListener('click', () => {
                currentPage = page;
                new Visits().load(tableBody, page, items);
            });
            return button;
        }
    }
}
