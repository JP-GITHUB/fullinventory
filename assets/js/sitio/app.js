'use strict';
var Aviso;

Aviso = (function () {
    "use strict";
    var elem = $(".bb-alert");
    var hideHandler, that = {};
    that.show = function (text, tipo) {
        clearTimeout(hideHandler);
        elem.removeClass("alert-warning alert-success alert-danger alert-alert alert-info");
        switch (tipo) {
            case 'success':
                elem.addClass("alert-success");
                break;
            case 'warning':
                elem.addClass("alert-warning");
                break;
            case 'danger':
                elem.addClass("alert-danger");
                break;
            case 'alert':
                elem.addClass("alert-alert");
                break;
            case 'info':
            default:
                elem.addClass("alert-info");
                break;
        }
        elem.find("span").html(text);
        elem.delay(200).fadeIn().delay(2000).fadeOut();
    };
    return that;
}());

$(document).ready(function () {
    inicializar_box();
    $('#aside-productos a').click(function (e) {
        e.preventDefault();
        $("#content-web").load("Producto/listar", function () { });
    });

    $('#aside-inventario a').click(function (e) {
        e.preventDefault();
        $("#content-web").load("Inventario/listar", function () { });
    });

    $('#aside-locales a').click(function (e) {
        e.preventDefault();
        $("#content-web").load("", function () { });
    });

    $('#aside-proveedores a').click(function (e) {
        e.preventDefault();
        $("#content-web").load("Proveedor/listar", function () { });
    });
});

//Proveedores

function show_frm_agregar_proveedor() {

    $(".modal-content").load("Proveedor/agregar", function () {

        $("#codigo_proveedor").blur(function () {
            if (existe_proveedor(this.value)) {

                this.value = '';
                Aviso.show('El código ingresado ya existe', "danger");
            }
        });

        $("#btn_guardar_proveedor").click(function (e) {
            e.preventDefault();
            agregar_proveedor();
        });
    });
}

function existe_proveedor(codigo) {

    var proveedor = {};
    var existe = false;

    proveedor.codigo = codigo;

    $.ajax({
        method: "POST",
        url: "Proveedor/existe_proveedor",
        data: proveedor,
        async: false
    })
        .done(function (obj) {

            existe = obj.existe;
        });
    return existe;
}

function agregar_proveedor() {
    var proveedor = {};
    proveedor.codigo = $("#codigo_proveedor").val();
    proveedor.nombre = $("#nombre_proveedor").val();
    proveedor.telefono = $("#telefono_proveedor").val();
    proveedor.direccion = $("#direccion_proveedor").val();
    proveedor.comuna = $("#comuna_proveedor").val();

    $.ajax({
        method: "POST",
        url: "Proveedor/agregar_proveedor",
        data: proveedor
    })
        .done(function (obj) {
            $('#contenModal').modal('hide');
            if (obj.estado) {
                buscar_proveedor();
                Aviso.show(obj.mensaje, "success");
            } else {
                Aviso.show(obj.mensaje, "danger");
            }
        });
}

function buscar_proveedor() {

    var input_filtro = $("#input-filtro").val();

    if (input_filtro == "") {
        recargar_proveedores();
    } else {
        $.ajax({
            method: "POST",
            url: "Proveedor/buscar_proveedor",
            data: { filtro: input_filtro }
        })
            .done(function (obj) {
                $("#content-web").html(obj);
            });
    }

}

function recargar_proveedores() {

    $("#content-web").load("Proveedor/listar");
}

function modificar_proveedor($codigo) {

    var proveedor = {};
    proveedor.codigo = $codigo;

    $.ajax({
        method: "POST",
        url: "Proveedor/modificar_producto",
        data: proveedor
    })
        .done(function (obj) {

            $(".modal-content").html(obj);

            $('#btn_guardar_cambios_proveedor').off("click");

            $("#btn_guardar_cambios_proveedor").click(function () {

                guardar_cambios_proveedor();

            });

        });
}

function cambiar_estado_proveedor(codigo, estado) {

    bootbox.addLocale("es", {
        OK: 'SI',
        CANCEL: 'NO',
        CONFIRM: 'SI'
    });
    bootbox.setLocale("es");
    bootbox.confirm({
        message: '¿Esta seguro que desea ' + ((estado == '1') ? 'Desactivar' : 'Activar') + ' el proveedor seleccionado?',
        title: 'Confirmar',
        callback: function (result) {
            if (result) {
                var proveedor = {};
                proveedor.codigo = codigo;
                proveedor.id_estado = estado;

                $.ajax({
                    method: "POST",
                    url: "Proveedor/cambiar_estado_proveedor",
                    data: proveedor
                })
                    .done(function (obj) {
                        if (obj.estado) {
                            buscar_proveedor();
                            Aviso.show(obj.mensaje, "success");
                        } else {
                            Aviso.show(obj.mensaje, "danger");
                        }
                    });
            } else {
                Aviso.show("No se realizaron cambios", "danger");
            }
        }
    });
}


function guardar_cambios_proveedor() {
    var proveedor = {};
    proveedor.codigo = $("#codigo_proveedor").val();
    proveedor.nombre = $("#nombre_proveedor").val();
    proveedor.telefono = $("#telefono_proveedor").val();
    proveedor.direccion = $("#direccion_proveedor").val();
    proveedor.comuna = $("#comuna_proveedor").val();

    $.ajax({
        method: "POST",
        url: "Proveedor/guardar_cambios_proveedor",
        data: proveedor
    })
        .done(function (obj) {
            $('#contenModal').modal('hide');
            if (obj.estado) {
                buscar_proveedor();
                Aviso.show(obj.mensaje, "success");
            } else {
                Aviso.show(obj.mensaje, "danger");
            }
        });
}


//Productos
function show_frm_agregar() {
    $(".modal-content").load("Producto/agregar", function () {
        $("#btn-guardar-producto").click(function (e) {
            e.preventDefault();
            guardar_producto();
        });
    });
}

function modificar_producto(codigo_producto) {
    $(".modal-content").load("Producto/modificar", { "codigo_producto": codigo_producto }, function () {
        $("#btn_guardar_cambios").click(function (e) {
            e.preventDefault();
            modificar_producto();
        });
    });
}

function agregar_producto() {
    var producto = {};
    producto.codigo = $("#codigo-producto").val();
    producto.nombre = $("#nombre-producto").val();
    producto.descripcion = $("#descripcion-producto").val();
    producto.imagen = $("#imagen-producto").val();
    producto.cantidad = $("#cantidad-producto").val();
    producto.codproveedor = $("#codproveedor-producto").val();

    $.ajax({
        method: "POST",
        url: "Producto/agregar_producto",
        data: producto
    })
        .done(function (obj) {
            if (obj.estado) {
                $('#productosModal').modal('hide');
                buscar_productos();
                Aviso.show("Producto Ingresado Correctamente", "success");
            } else {
                Aviso.show(obj.mensaje, "danger");
            }
        });
}

function recargar_productos() {
    $("#content-web").load("Producto/listar");
}

function modificar_producto() {
    var producto = {};
    producto.codigo = $("#codigo-producto").val();
    producto.nombre = $("#nombre-producto").val();
    producto.descripcion = $("#descripcion-producto").val();
    producto.imagen = $("#imagen-producto").val();
    producto.cantidad = $("#cantidad-producto").val();
    producto.codproveedor = $("#codproveedor-producto").val();

    $.ajax({
        method: "POST",
        url: "Producto/modificar_producto",
        data: producto
    })
        .done(function (obj) {
            if (obj.estado) {
                $('#productosModal').modal('hide');
                Aviso.show(obj.mensaje, "success");
                buscar_productos();

            } else {
                Aviso.show(obj.mensaje, "danger");
            }
        });
}

function buscar_productos() {
    var input_filtro = $("#input-filtro").val();

    if (input_filtro == "") {
        recargar_productos();
    } else {
        $.ajax({
            method: "POST",
            url: "Producto/buscar_productos",
            data: { filtro: input_filtro }
        })
            .done(function (obj) {
                $("#content-web").html(obj);
            });
    }
}

function mostrar_historial(producto, departamento) {
    $(".section-historial").load("/inventario/historial/" + departamento + "/" + producto, function () {
        $('#example').DataTable({
            "columns": [
                { "data": "tipo" },
                { "data": "fecha_movimiento" },
                { "data": "cantidad" }
            ],
            "scrollX": "100%",
            "scrollCollapse": true,
            "searching": false
        });

        mostrar_grafico();

        $(".section-inventario").addClass("hidden");
        $(".section-historial").removeClass("hidden");

        $("#btn-volver-inventario").click(function () {
            $(".section-inventario").removeClass("hidden");
            $(".section-historial").addClass("hidden");
        });
    });
}

function mostrar_grafico() {

    //Obtener info Grafico.

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Grafico de Movimientos'
        },
        /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
        xAxis: {
            categories: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidades'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Ventas',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            name: 'Mermas',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            name: 'Total',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }]
    });
}


function inicializar_box() {
    Aviso = (function () {
        var elem,
            hideHandler,
            that = {};

        that.init = function (options) {
            elem = $(options.selector);
        };

        that.show = function (text, tipo) {
            clearTimeout(hideHandler);
            elem.removeClass("alert-warning alert-success alert-danger alert-alert alert-info");

            switch (tipo) {
                case 'success':
                    elem.addClass("alert-success");
                    break;
                case 'warning':
                    elem.addClass("alert-warning");
                    break;
                case 'danger':
                    elem.addClass("alert-danger");
                    break;
                case 'alert':
                    elem.addClass("alert-alert");
                    break;
                case 'info':
                default:
                    elem.addClass("alert-info");
                    break;
            }
            elem.find("span").html(text);
            elem.delay(200).fadeIn().delay(2000).fadeOut();
        };

        return that;
    }());

    Aviso.init({
        "selector": ".bb-alert"
    });
}