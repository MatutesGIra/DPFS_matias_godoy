document.addEventListener('DOMContentLoaded', function () {

    console.log("createProductValidation.js se ha cargado y se está ejecutando.");
    const form = document.getElementById('createProductForm');

    const imageInput = document.getElementById('image');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (!imagePreviewContainer) {
        console.error("El elemento con ID 'imagePreviewContainer' no fue encontrado.");
        return;
    }

    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                imagePreviewContainer.innerHTML = '';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = "Vista previa de la imagen";
                img.style.maxWidth = '150px'; 
                img.style.maxHeight = '150px';
                img.style.marginTop = '10px';
                img.style.border = '1px solid #ddd';
                img.style.borderRadius = '4px';

                imagePreviewContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        } else {
            imagePreviewContainer.innerHTML = '';
        }
    });

    form.addEventListener('submit', function (event) {
        let isValid = true;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const name = document.getElementById('name').value.trim();
        if (!name) {
            document.getElementById('nameError').textContent = 'El nombre es obligatorio.';
            isValid = false;
        } else if (name.length < 5) {
            document.getElementById('nameError').textContent = 'El nombre debe tener al menos 5 caracteres.';
            isValid = false;
        }

        const description = document.getElementById('description').value.trim();
        if (!description) {
            document.getElementById('descriptionError').textContent = 'La descripción es obligatoria.';
            isValid = false;
        } else if (description.length < 20) {
            document.getElementById('descriptionError').textContent = 'La descripción debe tener al menos 20 caracteres.';
            isValid = false;
        }

        const image = document.getElementById('image').files[0];
        if (image) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(image.type)) {
                document.getElementById('imageError').textContent = 'Debes seleccionar un archivo JPG, JPEG, PNG o GIF.';
                isValid = false;
            }
        }
        const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

        categoryCheckboxes.forEach(checkbox => {
            const updateCategoryItemStyle = () => {
                const categoryItem = checkbox.closest('.category-item');
                if (categoryItem) {
                    if (checkbox.checked) {
                        categoryItem.style.backgroundColor = 'var(--color-verde)';
                        categoryItem.style.borderColor = 'var(--color-verde)';
                        categoryItem.style.color = 'white';
                    } else {
                        categoryItem.style.backgroundColor = '#f0f0f0';
                        categoryItem.style.borderColor = '#ccc';
                        categoryItem.style.color = 'inherit';
                    }
                }
            };

            updateCategoryItemStyle();

            checkbox.addEventListener('change', updateCategoryItemStyle);
        });

        if (!isValid) {
            event.preventDefault();
        }
    });
});