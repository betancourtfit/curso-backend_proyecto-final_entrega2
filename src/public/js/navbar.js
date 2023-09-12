
const authButton = document.getElementById('authButton');
const auth = firebase.auth();

// Detectar el cambio de estado de autenticación
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuario autenticado
        authButton.innerText = 'Signout';
    } else {
        // Usuario no autenticado
        authButton.innerText = 'Signin';
    }
});

// Al hacer clic en el botón
authButton.addEventListener('click', () => {
    if (authButton.innerText === 'Signout') {
        auth.signOut()
            .then(() => {
                console.log('Usuario desautenticado');
            })
            .catch(error => {
                console.error('Error al desautenticar:', error);
            });
    } else {
        // Aquí podrías abrir el popup para que el usuario inicie sesión
        // Por ejemplo, llamando a tu función askForEmail()
    }
});