document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.item-quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            const productId = this.dataset.productId;
            const newQuantity = this.value;

            fetch('/products/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: productId, quantity: newQuantity })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert('Error al actualizar el carrito: ' + data.error);
                    } else {
                        window.location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error al actualizar la cantidad:', error);
                    alert('Hubo un error al actualizar la cantidad.');
                });
        });
    });

    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.productId;

            if (confirm('¿Estás seguro de que quieres quitar este producto del carrito?')) {
                fetch(`/products/remove/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert('Error al quitar el producto: ' + data.error);
                        } else {
                            window.location.reload(); 
                        }
                    })
                    .catch(error => {
                        console.error('Error al quitar el producto:', error);
                        alert('Hubo un error al quitar el producto.');
                    });
            }
        });
    });

    document.querySelector('.checkout-button').addEventListener('click', function () {
        alert('Funcionalidad de compra no implementada aún.');
    });
});