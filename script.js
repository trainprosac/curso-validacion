// =========================================================
// TRAINPRO - SISTEMA DE VERIFICACIÓN
// =========================================================


// ---------------------------------------------------------
// CONSULTA MANUAL
// ---------------------------------------------------------
function abrirResultadoCertificado() {

    const input = document.getElementById('inputCodigo');

    if (!input) return;

    const codigo = input.value.trim();


    if (!codigo) {

        const resultado =
            document.getElementById('resultado-validacion');

        if (resultado) {

            resultado.innerHTML =
                "<span style='color:#c62828;font-weight:bold;'>Ingresa un código.</span>";

        }

        input.focus();

        return;
    }


    window.location.href =
        `certificado.html?codigo=${encodeURIComponent(codigo)}`;
}


// ---------------------------------------------------------
// COMPATIBILIDAD CON QR ANTIGUOS
// ---------------------------------------------------------
// Los certificados ya emitidos pueden contener enlaces como:
//
// verificar.html?codigo=XXXX
//
// Los enviamos automáticamente a la nueva página:
//
// certificado.html?codigo=XXXX
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    const params =
        new URLSearchParams(window.location.search);

    const codigo =
        (params.get('codigo') || '').trim();


    if (codigo) {

        window.location.replace(
            `certificado.html?codigo=${encodeURIComponent(codigo)}`
        );

    }

});
