// Views
import { Dashboard } from "../views/dashboard/dashboard.js";
import { Notes } from "../views/binnacle/Notes/NotesView.js";
import { Clients } from "../views/users/clients/clients.js";
import { Visits } from "../views/binnacle/Visits/VisitsView.js";
import { Employees } from "../views/users/employees/employees.js";
import { Contractors } from "../views/users/contractors/Contractors.js";
import { AssistControl } from "../views/binnacle/AssistControl/AssistControl.js";
export const renderSidebar = () => {
    const sidebar = document.getElementById('app-sidebar');
    sidebar.innerHTML = `
    <div class="app_sidebar_container">
      <div class="app_sidebar_container_menu">
        <div class="sidebar_top">
          <div class="sidebar_header"></div>

          <div class="sidebar_items">
            <div class="sidebar_item">
              <span class="sidebar_item_label" id="render-dashboard">
                <i class="fa-regular fa-chart-simple"></i> <div class="label">Dashboard</div>
              </span>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
              <i class="fa-regular fa-user"></i> <div class="label">Usuarios</div>
              </span>

              <div class="sidebar_subitems">
                <div class="sidebar_subitem" id="render-clients">
                  <span class="sidebar_subitem_label">
                    <i class="fa-regular fa-user-group"></i> Clientes
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label" id="render-employees">
                    <i class="fa-regular fa-users"></i> Empleados
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label" id="render-contractors">
                    <i class="fa-regular fa-briefcase"></i> Contratistas
                  </span>
                </div>

              </div>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
              <i class="fa-regular fa-book"></i> <div class="label">Bitácora</div>
              </span>

              <div class="sidebar_subitems">
                <div class="sidebar_subitem" id="render-notes">
                  <span class="sidebar_subitem_label">
                    <i class="fa-regular fa-notes"></i> Notas
                  </span>
                </div>

                <div class="sidebar_subitem" id="render-visits">
                  <span class="sidebar_subitem_label">
                    <i class="fa-regular fa-user"></i> Visits
                  </span>
                </div>

                <div class="sidebar_subitem" id="render-assistControl">
                  <span class="sidebar_subitem_label">
                    <i class="fa-regular fa-marker"></i> Control de asistencia
                  </span>
                </div>
              </div>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i class="fa-regular fa-building"></i> <div class="label">Empresas</div>
              </span>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i class="fa-regular fa-shield"></i> <div class="label">Superusuarios</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
    //  @ts-ignore
    feather.replace();
    getSidebarItems();
    renders();
};
const getSidebarItems = () => {
    const sidebarItems = document.querySelectorAll('.sidebar_item');
    const sidebarSubitems = document.querySelectorAll('.sidebar_subitem');
    sidebarItems.forEach((sidebarItem) => {
        sidebarItem.addEventListener('click', () => {
            sidebarItems.forEach((sidebarItem) => sidebarItem.classList.remove('isActive'));
            sidebarItem.classList.add('isActive');
        });
    });
    sidebarSubitems.forEach((sidebarSubitem) => {
        sidebarSubitem.addEventListener('click', () => {
            sidebarSubitems.forEach((sidebarSubitem) => sidebarSubitem.classList.remove('isActive'));
            sidebarSubitem.classList.add('isActive');
        });
    });
};
const renders = () => {
    document.getElementById('render-dashboard')?.addEventListener('click', () => {
        new Dashboard().render();
    });
    document.getElementById('render-clients')?.addEventListener('click', () => {
        new Clients().render();
    });
    document.getElementById('render-employees')?.addEventListener('click', () => {
        new Employees().render();
    });
    document.getElementById('render-contractors')?.addEventListener('click', () => {
        new Contractors().render();
    });
    // render notes
    document.getElementById('render-notes')?.addEventListener('click', () => {
        new Notes().render();
    });
    // render visits
    document.getElementById('render-visits')?.addEventListener('click', () => {
        new Visits().render();
    });
    // render AssistControl
    document.getElementById('render-assistControl')?.addEventListener('click', () => {
        new AssistControl().render();
    });
};
// setNewPassword()
