//
//  WebAccess.ts
//
//  Generated by Poll Castillo on 02/03/2023
//
import { deleteEntity, getEntitiesData, getEntityData } from "../../../endpoints.js";
import { drawTagsIntoTables, inputObserver, inputSelect } from "../../../tools.js";
const tableRows = 16;
const currentPage = 1;
const userType = "CUSTOMER";
const SUser = false;
const tableLayout = `
  <div class="datatable" id="datatable">
    <div class="datatable_header">
      <div class="datatable_title" id="datatable-title"><h1>Clientes</h1></div>
      <div class="datatable_tools" id="datatable-tools">
        <input type="search"
        class="search_input"
        placeholder="Buscar"
        id="search">

        <button
          class="datatable_button add_user"
          id="new-entity">
          <span data-feather="user-plus"></span>
        </button>

        <button
          class="datatable_button import_user"
          id="import-entities">
          Importar
        </button>
      </div>
    </div>

    <table class="datatable_content">
      <thead><tr>
        <th><span data-type="name">
          Nombre <i data-feather="filter"></i>
        </span></th>

        <th colspan="2"><span data-type="id">
          ID <i data-feather="filter"></i>
        </span></th>

        <!-- th class="header_filled header_key"></!-->

        <th class="thead_centered"><span data-type="status">
          Estado <i data-feather="filter"></i>
        </span></th>

        <th><span data-type="citadel">
          Ciudadela <i data-feather="filter"></i>
        </span></th>

        <th class="header_filled"></th>

      </tr></thead>
      <tbody id="datatable-body" class="datatable_body">

      </tbody>
    </table>

    <div class="datatable_footer">
      <div class="datatable_pagination" id="pagination-container"></div>
    </div>
  </div>`;
const tableLayoutTemplate = `
    <tr>
        <td>Cargando</td>
        <td>Cargando</td>
        <td>Cargando</td>
        <td>Cargando</td>
        <td class="entity_options">
            <button class="button" id="edit-data">
                <i data-feather="edit-2" class="table_icon"></i>
            </button>
            <button class="button" id="remove-entity">
                <i data-feather="trash" class="table_icon"></i>
            </button>
            <button class="button" id="convert-toSuperuser">
                <i data-feather="shield" class="table_icon"></i>
            </button>
        </td>
    </tr>`;
const getUsers = async (userType, superUser) => {
    const users = await getEntitiesData('User');
    const FSuper = users.filter((data) => data.isSuper === superUser);
    const data = FSuper.filter((data) => `${data.userType}`.includes(userType));
    return data;
};
export class WebAccess {
    constructor() {
        this.dialogContainer = document.getElementById('app-dialogs');
        this.entityDialogContainer = document.getElementById('entity-editor-container');
        this.content = document.getElementById('datatable-container');
    }
    async render() {
        let data = await getUsers(userType, SUser);
        this.content.innerHTML = '';
        this.content.innerHTML = tableLayout;
        const tableBody = document.getElementById('datatable-body');
        tableBody.innerHTML = tableLayoutTemplate.repeat(tableRows);
        this.load(tableBody, currentPage, data);
        // @ts-ignore
        feather.replace();
    }
    load(table, currentPage, data) {
        table.innerHTML = '';
        currentPage--;
        let start = tableRows * currentPage;
        let end = start + tableRows;
        let paginatedItems = data.slice(start, end);
        if (data.length === 0) {
            let row = document.createElement('tr');
            row.innerHTML = `
        <td>los datos no coinciden con su búsqueda</td>
        <td></td>
        <td></td>
      `;
            table.appendChild(row);
        }
        else {
            for (let i = 0; i < paginatedItems.length; i++) {
                let client = paginatedItems[i];
                let row = document.createElement('tr');
                row.innerHTML += `
          <td>${client.firstName} ${client.lastName}</dt>
          <td>${client.username}</dt>
          <td class="key"><button class="button"><i data-feather="key" class="table_icon"></i></button></td>
          <td class="tag"><span>${client.state.name}</span></dt>
          <td>${client.citadel.description}</dt>
          <td class="entity_options">
            <button class="button" id="edit-entity" data-entityId="${client.id}">
              <i data-feather="edit-2" class="table_icon"></i>
            </button>

            <button class="button" id="remove-entity" data-entityId="${client.id}">
              <i data-feather="trash" class="table_icon"></i>
            </button>

            <button class="button" id="convert-entity" data-entityId="${client.id}">
              <i data-feather="shield" class="table_icon"></i>
            </button>
          </dt>
        `;
                table.appendChild(row);
                drawTagsIntoTables();
            }
        }
        const tableBody = {};
        this.register(this.entityDialogContainer, data);
        this.import();
        this.edit(this.entityDialogContainer, data);
        this.remove();
        this.convertToSuper();
    }
    register(container, data) {
        const registerButton = document.getElementById('new-entity');
        registerButton.addEventListener('click', () => {
            RInterface(container, data);
        });
        const RInterface = async (container, data) => {
            console.log(container);
            console.log(data);
        };
    }
    import() {
        const importButton = document.getElementById('import-entities');
        importButton.addEventListener('click', () => {
            alert('Importing...');
        });
    }
    edit(container, data) {
        // Edit entity
        const edit = document.querySelectorAll('#edit-entity');
        edit.forEach((edit) => {
            const entityId = edit.dataset.entityid;
            edit.addEventListener('click', () => {
                RInterface('User', entityId);
            });
        });
        const RInterface = async (entities, entityID) => {
            const data = await getEntityData(entities, entityID);
            this.entityDialogContainer.innerHTML = '';
            this.entityDialogContainer.style.display = 'block';
            this.entityDialogContainer.innerHTML = `
        <div class="entity_editor" id="entity-editor">
          <div class="entity_editor_header">
            <div class="user_info">
              <div class="avatar"><i data-feather="user"></i></div>
              <h1 class="entity_editor_title">Editar <br><small>${data.firstName} ${data.lastName}</small></h1>
            </div>

            <button class="btn btn_close_editor" id="close"><i data-feather="x"></i></button>
          </div>

          <!-- EDITOR BODY -->
          <div class="entity_editor_body">
            <div class="material_input">
              <input type="text" id="entity-firstname" class="input_filled" value="${data.firstName}">
              <label for="entity-firstname">Nombre</label>
            </div>

            <div class="material_input">
              <input type="text" id="entity-lastname" class="input_filled" value="${data.lastName}">
              <label for="entity-lastname">Apellido</label>
            </div>

            <div class="material_input">
              <input type="text" id="entity-secondlastname" class="input_filled" value="${data.secondLastName}">
              <label for="entity-secondlastname">2do Apellido</label>
            </div>

            <div class="material_input">
              <input type="text"
                id="entity-phone"
                class="input_filled"
                maxlength="10"
                value="${data.phone}">
              <label for="entity-phone">Teléfono</label>
            </div>

            <div class="material_input">
              <input type="text" id="entity-username" class="input_filled" value="${data.username}" readonly>
              <label for="entity-username">Nombre de usuario</label>
            </div>

            <div class="material_input_select">
              <label for="entity-state">Estado</label>
              <input type="text" id="entity-state" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="material_input_select">
              <label for="entity-business">Empresa</label>
              <input type="text" id="entity-business" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="material_input_select">
              <label for="entity-citadel">Ciudadela</label>
              <input type="text" id="entity-citadel" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="material_input_select">
              <label for="entity-customer">Cliente</label>
              <input type="text" id="entity-customer" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <div class="material_input_select">
              <label for="entity-department">Departamento</label>
              <input type="text" id="entity-department" class="input_select" readonly placeholder="cargando...">
              <div id="input-options" class="input_options">
              </div>
            </div>

            <br><br><br>
            <div class="material_input">
              <input type="password" id="tempPass" >
              <label for="tempPass">Clave temporal</label>
            </div>

          </div>
          <!-- END EDITOR BODY -->

          <div class="entity_editor_footer">
            <button class="btn btn_primary btn_widder" id="update-changes">Guardar</button>
          </div>
        </div>
      `;
            // @ts-ignore
            feather.replace();
            inputObserver();
            inputSelect('Business', 'entity-citadel');
            inputSelect('Customer', 'entity-customer');
            inputSelect('State', 'entity-state', data.state.name);
            inputSelect('Department', 'entity-department');
            inputSelect('Business', 'entity-business');
            this.close();
            UUpdate(entityID);
        };
        const UUpdate = async (entityId) => {
            const updateButton = document.getElementById('update-changes');
            updateButton.addEventListener('click', () => {
                console.log('updating');
            });
        };
    }
    remove() {
        const remove = document.querySelectorAll('#remove-entity');
        remove.forEach((remove) => {
            const entityId = remove.dataset.entityid;
            remove.addEventListener('click', () => {
                this.dialogContainer.style.display = 'block';
                this.dialogContainer.innerHTML = `
          <div class="dialog_content" id="dialog-content">
            <div class="dialog dialog_danger">
              <div class="dialog_container">
                <div class="dialog_header">
                  <h2>¿Deseas eliminar este cliente?</h2>
                </div>

                <div class="dialog_message">
                  <p>Esta acción no se puede revertir</p>
                </div>

                <div class="dialog_footer">
                  <button class="btn btn_primary" id="cancel">Cancelar</button>
                  <button class="btn btn_danger" id="delete">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        `;
                // delete button
                // cancel button
                // dialog content
                const deleteButton = document.getElementById('delete');
                const cancelButton = document.getElementById('cancel');
                const dialogContent = document.getElementById('dialog-content');
                deleteButton.onclick = () => {
                    deleteEntity('User', entityId);
                    new Close().x(dialogContent, this.dialogContainer);
                    this.render();
                };
                cancelButton.onclick = () => {
                    new Close().x(dialogContent, this.dialogContainer);
                    this.render();
                };
            });
        });
    }
    convertToSuper() {
        const convert = document.querySelectorAll('#convert-entity');
        convert.forEach((convert) => {
            const entityId = convert.dataset.entityid;
            convert.addEventListener('click', () => {
                alert('Converting...');
            });
        });
    }
    close() {
        const closeButton = document.getElementById('close');
        const editor = document.getElementById('entity-editor');
        closeButton.addEventListener('click', () => {
            new Close().x(editor, this.entityDialogContainer);
        });
    }
}
class Close {
    x(dialog, container) {
        container.style.display = 'none';
        dialog.remove();
    }
}
