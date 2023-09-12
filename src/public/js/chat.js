
const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let email
let password

const auth = firebase.auth();

function askForEmail() {
    Swal.fire({
        title: "Identificación de usuario",
        text: "Por favor ingrese su email",
        input: "text",
        inputPlaceholder: "Email",
        inputValidator: (valor) => {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Expresión regular para validar email

            if (!valor) {
                return "Ingrese un email válido";
            } else if (!valor.includes('@')) {
                return "El email debe incluir '@'";
            } else if (!valor.match(emailRegex)) {
                return "El formato del email no es correcto";
            }
        },
        allowOutsideClick: false
    }).then(resultado => {
        email = resultado.value;
        askForPassword();
    });
}


function askForPassword() {
    Swal.fire({
        title: "Contraseña",
        input: "password",
        inputPlaceholder: "Ingrese su contraseña",
        inputValidator: (valor) => {
            return !valor && "Ingrese una contraseña válida";
        },
        allowOutsideClick: false
    }).then(resPassword => {
        password = resPassword.value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Autenticación exitosa
                console.log("Usuario autenticado:", userCredential.user);
                socket.emit('display-inicial');

                // Desautenticar después de 5 minutos
                setTimeout(() => {
                    auth.signOut();
                }, 5 * 60 * 1000);
            })
            .catch((error) => {
                // Error en la autenticación
                console.error("Error en la autenticación:", error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la autenticación',
                    text: error.message,
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Al hacer clic en OK, vuelve a empezar desde la solicitud de email
                    askForEmail();
                });
            });
    }).catch((error) => {
        console.error("Error al solicitar contraseña:", error);
    });
}

// Llamar a la función para iniciar el proceso
// askForEmail();


auth.onAuthStateChanged(user => {
    if (user) {
        // El usuario ya ha iniciado sesión
        console.log("Usuario ya autenticado:", user);
        socket.emit('display-inicial');
        // Aquí podrías establecer también el timeout de 5 minutos para desloguear al usuario.
    } else {
        // No hay usuario autenticado, iniciar el proceso de autenticación
        askForEmail();
    }
});



botonChat.addEventListener('click', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // El usuario está autenticado
            if (valInput.value.trim().length > 0) {
                socket.emit('add-message', {email: user.email, mensaje: valInput.value });
                firebase.analytics().logEvent('mensaje_enviado', { longitud: valInput.value.length });
                valInput.value = "";
            } else {
                console.error("Mensaje vacío.");
                // Muestra un mensaje al usuario indicando que el mensaje no puede estar vacío.
            }
        } else {
            // El usuario no está autenticado
            console.error("Usuario no autenticado.");
            // Muestra un mensaje al usuario indicando que debe autenticarse para enviar mensajes.
        }
    });
});


socket.on('show-messages', (arrayMensajes) => {
    parrafosMensajes.innerHTML = ""
    // Invertimos el orden del array
    const reversedMensajes = arrayMensajes.reverse();

    reversedMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `
        <div class="card mt-3">
            <div class="card-header">
                <span class="badge badge-primary text-dark">${mensaje.postTime}</span> <i class="fas fa-user-circle"></i> ${mensaje.email}
            </div>
            <div class="card-body">
                <p class="card-text">${mensaje.message}</p>
            </div>
        </div>`;
    });
})