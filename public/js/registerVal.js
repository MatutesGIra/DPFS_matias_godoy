document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const avatarInput = document.getElementById('avatar');
    const avatarPreviewContainer = document.getElementById('avatarPreviewContainer');

    avatarInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                avatarPreviewContainer.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Vista previa del avatar';
                avatarPreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreviewContainer.innerHTML = '';
        }
    });

    form.addEventListener('submit', function (event) {
        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const firstNameInput = document.getElementById('firstName');
        const firstName = firstNameInput.value.trim();
        if (!firstName) {
            showError('firstNameError', 'El nombre es obligatorio.');
            isValid = false;
        } else if (firstName.length < 2) {
            showError('firstNameError', 'El nombre debe tener al menos 2 caracteres.');
            isValid = false;
        }

        const lastNameInput = document.getElementById('lastName');
        const lastName = lastNameInput.value.trim();
        if (!lastName) {
            showError('lastNameError', 'El apellido es obligatorio.');
            isValid = false;
        } else if (lastName.length < 2) {
            showError('lastNameError', 'El apellido debe tener al menos 2 caracteres.');
            isValid = false;
        }

        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();
        if (!username) {
            showError('usernameError', 'El nombre de usuario es obligatorio.');
            isValid = false;
        } else if (username.length < 4) {
            showError('usernameError', 'El nombre de usuario debe tener al menos 4 caracteres.');
            isValid = false;
        }

        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        if (!email) {
            showError('emailError', 'El email es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Debes ingresar un formato de email válido.');
            isValid = false;
        }

        const passwordInput = document.getElementById('password');
        const password = passwordInput.value.trim();
        if (!password) {
            showError('passwordError', 'La contraseña es obligatoria.');
            isValid = false;
        } else if (password.length < 8) {
            showError('passwordError', 'La contraseña debe tener al menos 8 caracteres.');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            showError('passwordError', 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.');
            isValid = false;
        }

        const confirmPasswordInput = document.getElementById('confirm_password');
        const confirmPassword = confirmPasswordInput.value.trim();
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Debes confirmar la contraseña.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Las contraseñas no coinciden.');
            isValid = false;
        }

        const dateOfBirthInput = document.getElementById('dateOfBirth');
        const dateOfBirth = dateOfBirthInput.value;
        if (!dateOfBirth) {
            showError('dateOfBirthError', 'La fecha de nacimiento es obligatoria.');
            isValid = false;
        } else if (!isValidDateOfBirth(dateOfBirth)) {
            showError('dateOfBirthError', 'Debes ser mayor de 18 años para registrarte.');
            isValid = false;
        }

        const avatar = avatarInput.files[0];
        if (avatar) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(avatar.type)) {
                showError('avatarError', 'Debes seleccionar un archivo JPG, JPEG, PNG o GIF.');
                isValid = false;
            }
        } else {
            showError('avatarError', 'La imagen de perfil es obligatoria.');
            isValid = false;
        }

        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            showError('termsError', 'Debes aceptar los Términos y Condiciones.');
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidDateOfBirth(dateString) {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    }

    document.getElementById('firstName').addEventListener('blur', function () {
        const firstName = this.value.trim();
        if (!firstName) {
            showError('firstNameError', 'El nombre es obligatorio.');
        } else if (firstName.length < 2) {
            showError('firstNameError', 'El nombre debe tener al menos 2 caracteres.');
        } else {
            showError('firstNameError', '');
        }
    });
    document.getElementById('lastName').addEventListener('blur', function () {
        const lastName = this.value.trim();
        if (!lastName) {
            showError('lastNameError', 'El apellido es obligatorio.');
        } else if (lastName.length < 2) {
            showError('lastNameError', 'El apellido debe tener al menos 2 caracteres.');
        } else {
            showError('lastNameError', '');
        }
    });
    document.getElementById('username').addEventListener('blur', function () {
        const username = this.value.trim();
        if (!username) {
            showError('usernameError', 'El nombre de usuario es obligatorio.');
        } else if (username.length < 4) {
            showError('usernameError', 'El nombre de usuario debe tener al menos 4 caracteres.');
        } else {
            showError('usernameError', '');
        }
    });
    document.getElementById('email').addEventListener('blur', function () {
        const email = this.value.trim();
        if (!email) {
            showError('emailError', 'El email es obligatorio.');
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Debes ingresar un formato de email válido.');
        } else {
            showError('emailError', '');
        }
    });
    document.getElementById('password').addEventListener('blur', function () {
        const password = this.value.trim();
        if (!password) {
            showError('passwordError', 'La contraseña es obligatoria.');
        } else if (password.length < 8) {
            showError('passwordError', 'La contraseña debe tener al menos 8 caracteres.');
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]/.test(password)) {
            showError('passwordError', 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.');
        } else {
            showError('passwordError', '');
        }
        const confirmPasswordInput = document.getElementById('confirm_password');
        if (confirmPasswordInput && confirmPasswordInput.value.trim() !== '') {
            const confirmPassword = confirmPasswordInput.value.trim();
            if (password !== confirmPassword) {
                showError('confirmPasswordError', 'Las contraseñas no coinciden.');
            } else {
                showError('confirmPasswordError', '');
            }
        }
    });
    document.getElementById('confirm_password').addEventListener('blur', function () {
        const password = document.getElementById('password').value.trim();
        const confirmPassword = this.value.trim();
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Debes confirmar la contraseña.');
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Las contraseñas no coinciden.');
        } else {
            showError('confirmPasswordError', '');
        }
    });
    document.getElementById('dateOfBirth').addEventListener('blur', function () {
        const dateOfBirth = this.value;
        if (!dateOfBirth) {
            showError('dateOfBirthError', 'La fecha de nacimiento es obligatoria.');
        } else if (!isValidDateOfBirth(dateOfBirth)) {
            showError('dateOfBirthError', 'Debes ser mayor de 18 años para registrarte.');
        } else {
            showError('dateOfBirthError', '');
        }
    });
    avatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                showError('avatarError', 'Debes seleccionar un archivo JPG, JPEG, PNG o GIF.');
            } else {
                showError('avatarError', '');
            }
        } else {
            showError('avatarError', 'La imagen de perfil es obligatoria.');
        }
    });
    document.getElementById('terms').addEventListener('change', function () {
        if (!this.checked) {
            showError('termsError', 'Debes aceptar los Términos y Condiciones.');
        } else {
            showError('termsError', '');
        }
    });
});