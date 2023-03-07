import { SignIn } from "./login.js";
new SignIn().checkSignIn();
/*

checkToken()
renderLogin()
const form: InterfaceElement =
  document.getElementById('login-form')
const nameInput: InterfaceElement =
  document.getElementById('username')
const passwordInput: InterfaceElement =
  document.getElementById('password')

form.addEventListener('submit', (e: SubmitEvent): void => {
  e.preventDefault()

  const loginButton: InterfaceElement =
    document.getElementById('login')

  loginButton.innerHTML = `
    <span>
      <i data-feather='loader' class='button_loader'>
      </i>
    </span>
  `
  if (nameInput.value === '') {
    loginButton.innerHTML = `
      <span>
        <i data-feather='loader' class='button_loader'>
        </i>
      </span>
    `
    setTimeout(() => {
      alert('el campo "correo" no puede estar vacío.')
      loginButton.innerHTML = 'Iniciar sesión'
    }, 200)
  }
  else if (passwordInput.value === '') {
    loginButton.innerHTML = `
      <span>
        <i data-feather="loader" class="button_loader"></i>
      </span>
    `
    setTimeout(() => {
      alert('El campo "Contraseña" no puede estar vacío.')
      loginButton.innerHTML = 'Iniciar Sesión'
    }, 200)
  }
  else {
    connect(nameInput.value, passwordInput.value)
  }

  //  @ts-ignore
  feather.replace()
})

*/ 
