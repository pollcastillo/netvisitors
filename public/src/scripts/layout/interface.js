//
//  interface.ts
//
//  Generated by Poll Castillo on 15/02/2023.
//
import { getUserInfo } from "../endpoints.js";
import { renderSidebar } from "./sidebar.js";
import { Dashboard } from "../views/dashboard/dashboard.js";
import { SignIn } from "../login.js";
const sidebar = document.getElementById('app-sidebar');
const app = document.getElementById('app');
const userAndPreferences = document.getElementById('app-topbar');
export const renderLayout = async () => {
    const data = await getUserInfo();
    if (data.error) {
        new SignIn().signOut();
    }
    else {
        activeElements(data);
    }
};
const activeElements = (data) => {
    app.style.display = 'grid';
    app.classList.add('bg_dots');
    sidebar.style.display = 'inline-flex';
    userAndPreferences.style.display = 'flex';
    renderInterface(data);
    renderSidebar();
};
const renderInterface = (data) => {
    renderUserOptions(userAndPreferences, data);
};
const renderUserOptions = async (block, data) => {
    console.log(data);
    block.innerHTML = `
    <div class="user">
      <span class="welcome">Bienvenido</span>
      <span class="separator"></span>
      <div class="userAvatar">
        <i class="fa-solid fa-user"></i>
      </div>

      <div class="nameAndCustomer">
        <p id="current-username" class="name">
          ${data.attributes.firstName} ${data.attributes.lastName}
        </p>
        <p id="current-user-customer" class="customer">${data.attributes.username}</p>
      </div>

      <div class="settings_button">
        <button id="settings-button">
          <i class="fa-solid fa-gear"></i>
        </button>
      </div>

      <div class="user_settings" id="user-settings">
        <button class="btn btn_transparent btn_widder">Preferencias</button>
        <button class="btn btn_transparent btn_widder">Cambiar Contraseña</button>
        <br>
        <button class="btn btn_primary btn_widder" id="logout">Cerrar sesión</button>
      </div>

    </div>
  `;
    renderSetting();
};
const renderSetting = () => {
    const options = document.getElementById('settings-button');
    options.addEventListener('click', () => {
        const settingOptions = document.querySelector("#user-settings");
        const logoutButton = settingOptions.querySelector("#logout");
        settingOptions.classList.toggle("user_settings_visible");
        logoutButton.addEventListener("click", () => {
            new SignIn().signOut();
        });
    });
};
new Dashboard().render();
