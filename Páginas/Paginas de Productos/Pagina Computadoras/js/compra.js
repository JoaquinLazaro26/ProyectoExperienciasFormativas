const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');

cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function () {
            window.location = "index.html";
        })
    }
    else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    }
    else {

        //aqui se coloca el user id generado en el emailJS
        emailjs.init('user_mEvGPs25e6NuT5sFZB4YB')
        const btn = document.getElementById('button');

        document.getElementById('form')
            .addEventListener('submit', function (event) {
                event.preventDefault();

                btn.value = 'Sending...';

                const serviceID = 'default_service';
                const templateID = 'template_9rr00hs';

                const cargandoGif = document.querySelector('#cargando');
                cargandoGif.style.display = 'block';

                const enviado = document.createElement('img');
                enviado.src = 'img/mail.gif';
                enviado.style.display = 'block';
                enviado.width = '150';

                emailjs.sendForm(serviceID, templateID, this)
                    .then(() => {
                        cargandoGif.style.display = 'none';
                        document.querySelector('#loaders').appendChild(enviado);
                        setTimeout(() => {
                            compra.vaciarLocalStorage();
                            enviado.remove();
                            window.location = "index.html";
                        }, 2000);
                    }, (err) => {
                        btn.value = 'Send Email';
                        alert(JSON.stringify(err));
                    });
            });


        /* AGREGAR DATOS DETALLE DEL PEDIDO A UN TEXT AREA */
        const textArea = document.createElement('textarea');
        textArea.id = "detalleCompra";
        textArea.name = "detalleCompra";
        textArea.cols = 60;
        textArea.rows = 10;
        textArea.hidden = true;
        productosLS = compra.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto) {
            textArea.innerHTML += `
                 Producto : ${producto.titulo} <br>
                 Precio : ${producto.precio} <br>
                 Cantidad: ${producto.cantidad} <br>
                --------------------------------------------- <br>
                `;
        });

        carrito.appendChild(textArea);
    }
}

