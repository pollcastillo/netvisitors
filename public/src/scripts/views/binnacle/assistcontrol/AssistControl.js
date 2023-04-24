//
//  AssistControl.ts
//
//  Generated by Poll Castillo on 15/03/2023.
//
import { Config } from "../../../Configs.js";
import { getEntityData, getEntitiesData } from "../../../endpoints.js";
import { CloseDialog, drawTagsIntoTables, generateCsv, renderRightSidebar } from "../../../tools.js";
import { UIContentLayout, UIRightSidebar } from "./Layout.js";
import { UITableSkeletonTemplate } from "./Template.js";
// Local configs
const tableRows = Config.tableRows;
let currentPage = Config.currentPage;
const pageName = 'Control de asistencias';
const GetAssistControl = async () => {
    const assistControl = await getEntitiesData('Marcation');
    return assistControl;
};
export class AssistControl {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.siebarDialogContainer = document.getElementById('entity-editor-container');
        this.appContainer = document.getElementById('datatable-container');
        this.render = async () => {
            let assistControlArray = await GetAssistControl();
            this.appContainer.innerHTML = '';
            this.appContainer.innerHTML = UIContentLayout;
            // Getting interface elements
            const viewTitle = document.getElementById('view-title');
            const tableBody = document.getElementById('datatable-body');
            // Changing interface element content
            viewTitle.innerText = pageName;
            tableBody.innerHTML = UITableSkeletonTemplate.repeat(tableRows);
            // Exec functions
            this.load(tableBody, currentPage, assistControlArray);
            this.searchVisit(tableBody, assistControlArray);
            this.pagination(assistControlArray, tableRows, currentPage);
            this.export();
            // Rendering icons
        };
        this.load = (tableBody, currentPage, assistControl) => {
            tableBody.innerHTML = ''; // clean table
            // configuring max table row size
            currentPage--;
            let start = tableRows * currentPage;
            let end = start + tableRows;
            let paginatedItems = assistControl.slice(start, end);
            // Show message if page is empty
            if (assistControl.length === 0) {
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
                    let assistControl = paginatedItems[i]; // getting visit items
                    let row = document.createElement('TR');
                    row.innerHTML += `
                    <td style="white-space: nowrap">${assistControl.user.firstName} ${assistControl.user.lastName} ${assistControl.user.secondLastName}</td>
                    <td>${assistControl.dni}</td>
                    <td id="table-date">${assistControl.ingressTime}</td>
                    <td id="table-date">${assistControl.egressTime}</td>
                    <td class="tag"><span>${assistControl.marcationState.name}</span></td>

                    <td>
                        <button class="button" id="entity-details" data-entityId="${assistControl.id}">
                            <i class="table_icon fa-regular fa-magnifying-glass"></i>
                        </button>
                    </td>
                `;
                    tableBody.appendChild(row);
                    drawTagsIntoTables();
                }
                this.previewAssist();
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
        this.previewAssist = async () => {
            const openButtons = document.querySelectorAll('#entity-details');
            openButtons.forEach((openButton) => {
                const entityId = openButton.dataset.entityid;
                openButton.addEventListener('click', () => {
                    renderInterface(entityId);
                });
            });
            const renderInterface = async (entity) => {
                let markingData = await getEntityData('Marcation', entity);
                console.log(markingData);
                renderRightSidebar(UIRightSidebar);
                const _values = {
                    status: document.getElementById('marking-status'),
                    name: document.getElementById('marking-name'),
                    dni: document.getElementById('marking-dni'),
                    type: document.getElementById('marking-type'),
                    department: document.getElementById('marking-department'),
                    contractor: document.getElementById('marking-contractor'),
                    // Start marking
                    startDate: document.getElementById('marking-start-date'),
                    startTime: document.getElementById('marking-start-time'),
                    startGuardID: document.getElementById('marking-start-guard-id'),
                    startGuardName: document.getElementById('marking-start-guard-name'),
                    // End marking
                    endDate: document.getElementById('marking-end-date'),
                    endTime: document.getElementById('marking-end-time'),
                    endGuardID: document.getElementById('marking-end-guard-id'),
                    endGuardName: document.getElementById('marking-end-guard-name')
                };
                _values.status.innerText = markingData.marcationState.name;
                _values.name.value = markingData.user.firstName + ' ' + markingData.user.lastName;
                _values.dni.value = markingData.user.dni;
                _values.type.value = markingData.user.userType;
                _values.department.value = markingData.user.department;
                _values.contractor.value = markingData.user.contractor;
                // Start marking
                _values.startDate.value = markingData.ingressDate;
                _values.startTime.value = markingData.ingressTime;
                _values.startGuardID.value = markingData.ingressIssued.username;
                _values.startGuardName.value = markingData.ingressIssued.firstName + ' ' + markingData.ingressIssued.lastName;
                // End marking
                _values.endDate.value = markingData.egressDate;
                _values.endTime.value = markingData.egressTime;
                _values.endGuardID.value = markingData.egressIssued.username;
                _values.endGuardName.value = markingData.egressIssued.firstName + ' ' + markingData.egressIssued.lastName;
                drawTagsIntoTables();
                this.closeRightSidebar();
                drawTagsIntoTables();
            };
        };
        this.export = () => {
            const exportAssisControl = document.getElementById('export-entities');
            exportAssisControl.addEventListener('click', async () => {
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
                let date = new Date(); //Fecha actual
                let month = date.getMonth() + 1; //obteniendo mes
                let day = date.getDate(); //obteniendo dia
                let year = date.getFullYear(); //obteniendo año
                if (day < 10)
                    day = '0' + day; //agrega cero si el menor de 10
                if (month < 10)
                    month = '0' + month; //agrega cero si el menor de 10
                const startDate = document.getElementById("start-date");
                const endDate = document.getElementById("end-date");
                startDate.value = year + "-" + month + "-" + day;
                endDate.value = year + "-" + month + "-" + day;
                const _closeButton = document.getElementById('cancel');
                const _exportButton = document.getElementById('export-data');
                const _dialog = document.getElementById('dialog-content');
                _exportButton.addEventListener('click', async () => {
                    let rows = [];
                    const _values = {
                        start: document.getElementById('start-date'),
                        end: document.getElementById('end-date'),
                    };
                    const marcations = await GetAssistControl();
                    for (let i = 0; i < marcations.length; i++) {
                        let marcation = marcations[i];
                        // @ts-ignore
                        if (marcation.ingressDate >= _values.start.value && marcation.ingressDate <= _values.end.value) {
                            let obj = {
                                "DNI": `${marcation.user.dni}`,
                                "Usuario": `${marcation.user.firstName} ${marcation.user.lastName}`,
                                "Fecha Ingreso": `${marcation.ingressDate}`,
                                "Hora Ingreso": `${marcation.ingressTime}`,
                                "Emitido Ingreso": `${marcation.ingressIssued.firstName} ${marcation.ingressIssued.lastName}`,
                                "Fecha Salida": `${marcation.egressDate}`,
                                "Hora Salida": `${marcation.egressTime}`,
                                "Emitido Salida": `${marcation.egressIssued?.firstName} ${marcation.egressIssued?.lastName}`,
                            };
                            rows.push(obj);
                        }
                    }
                    generateCsv(rows, "Marcaciones");
                });
                _closeButton.onclick = () => {
                    new CloseDialog().x(_dialog);
                };
            });
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
                new AssistControl().load(tableBody, page, items);
            });
            return button;
        }
    }
}
