//
//  login.ts
//
//  Generated by Poll Castillo on 15/02/2023.
//

import { getUserInfo } from "./endpoints.js";
import { renderLayout } from "./layout/interface.js";
import { InterfaceElement } from "./types.js";

const loginContainer: InterfaceElement =
  document.getElementById('login-container')
const app: InterfaceElement =
  document.getElementById('app')

export const renderLogin = async (): Promise<void> => {
  loginContainer.style.display = 'flex'
  loginContainer.innerHTML = `
    <div class="login_window">
      <div class="login_header">
        <img src="./public/src/assets/pictures/app_logo.png">
        <h1 class="login_title">Iniciar Sesión</h1>
        <p>Inicie sesión con los datos proporcionados por el proveedor.</p>
      </div>
      <div class="login_content">
        <form id="login-form">
          <div class="input">
            <label for="username">
              <i data-feather="user"></i>
            </label>
            <input type="text" id="username"
              placeholder="johndoe@mail.com">
          </div>

          <div class="input">
            <label for="password">
              <i data-feather="key"></i>
            </label>
            <input type="password" id="password"
              placeholder="••••••••••••">
          </div>
          <button class="btn btn_primary" id="login">Iniciar Sesión</button>
        </form>
      </div>

      <div class="login_footer">
        <div class="login_icons">
          <i data-feather="home"></i>
          <i data-feather="user"></i>
          <i data-feather="inbox"></i>
          <i data-feather="file"></i>
          <i data-feather="monitor"></i>
          <i data-feather="smartphone"></i>
        </div>
        <p>Accede a todas nuestras herramientas</p>

        <div class="foot_brief">
          <p>Desarrollado por</p>
          <img src="./public/src/assets/pictures/login_logo.png">
        </div>
      </div>
    </div>
  `
  //  @ts-ignore
  feather.replace()
}

export const checkToken = async (): Promise<void> => {
  const accessToken =
    <string>localStorage.getItem('access_token')

  const user = await getUserInfo()

  if (!accessToken) {
    app.style.display = 'none'
  }
  else if (accessToken === 'undefined') {
    console.log('Error: el token no está definido')
  }
  else if (accessToken === null || accessToken === 'null') {
    console.log('Error: no se ha podido generar el token correctamente.')
  }
  else if (user.attributes.userType === 'GUARD') {
    console.log('Error: la plataforma no admite usuarios de tipo guardia.')
    logout()
  }
  else {
    app.style.display = 'block'
    loginContainer.style.display = 'none'
    renderLayout()
  }
}

export const logout = (): void => {
  localStorage.removeItem('access_token')
  checkToken()
  window.location.reload()
}