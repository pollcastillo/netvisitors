import { Dashboard } from "../views/dashboard/dashboard.js";
export const renderSidebar = () => {
    console.log('rendering sidebar...');
    const sidebar = document.getElementById('app-sidebar');
    sidebar.innerHTML = `
    <div class="app_sidebar_container">
      <div class="app_sidebar_container_menu">
        <div class="sidebar_top">
          <div class="sidebar_header"></div>

          <div class="sidebar_items">
            <div class="sidebar_item">
              <span class="sidebar_item_label" id="render-dashboard">
                <i data-feather="bar-chart-2"></i>Dashboard
              </span>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i data-feather="user"></i>Usuarios
              </span>

              <div class="sidebar_subitems">
                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label">
                      • Clientes
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label">
                    • Guardias
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label">
                    • Empleados
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label">
                    • Contratistas
                  </span>
                </div>

                <div class="sidebar_subitem">
                  <span class="sidebar_subitem_label">
                    • Emergencia
                  </span>
                </div>
              </div>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i data-feather="bar-chart-2"></i>Dashboard
              </span>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i data-feather="bar-chart-2"></i>Dashboard
              </span>
            </div>

            <div class="sidebar_item">
              <span class="sidebar_item_label">
                <i data-feather="bar-chart-2"></i>Dashboard
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
    console.log(sidebarSubitems);
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
};
