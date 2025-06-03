document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (event) {
        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const email = document.getElementById('email').value.trim();
        if (!email) {
            document.getElementById('emailError').textContent = 'El email es obligatorio.';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('emailError').textContent = 'Debes ingresar un formato de email válido.';
            isValid = false;
        }

        const password = document.getElementById('password').value.trim();
        if (!password) {
            document.getElementById('passwordError').textContent = 'La contraseña es obligatoria.';
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});