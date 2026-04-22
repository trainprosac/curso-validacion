// ==========================================================================
// 1. CONFIGURACIÓN PRINCIPAL
// ==========================================================================

// PEGA AQUÍ LA URL DE TU APLICACIÓN WEB DE APPS SCRIPT (la que termina en /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbx9Z1UNm0a8UT_XOMS74m-_ucxEnRXTCFEStV3tEsv62ZlqvX3iYTdxgylPmCwAS_bWTw/exec'; 

const NUMERO_WHATSAPP = '51987260390';
const CORREO_CONTACTO = 'gerencia@trainprosac.com';

// ==========================================================================
// 2. LA LÓGICA DE VALIDACIÓN SEGURA
// ==========================================================================
async function verificarCertificado() {
    
    const input = document.getElementById('inputCodigo');
    const resultadoDiv = document.getElementById('resultado-validacion');
    
    if(!input) return; 
    const codigoIngresado = input.value.trim();

    if(codigoIngresado === "") {
        resultadoDiv.innerHTML = "<span style='color:#ff4d4d; font-weight:bold;'>❌ Ingresa un código.</span>";
        return;
    }

    resultadoDiv.innerHTML = "<span style='color: var(--texto-secundario);'>Procesando solicitud de forma segura...</span>";

    try {
        // Ahora enviamos el código a Google, no descargamos la tabla
        const response = await fetch(`${API_URL}?codigo=${encodeURIComponent(codigoIngresado)}`);
        const d = await response.json(); // Google nos responde con un JSON

        if(d.encontrado) {
            // Generamos las alertas dependiendo del estado
            let alertaHTML = "";
            let estadoSeguro = d.estado || ""; 
            
            if (estadoSeguro.includes("vencido")) {
                alertaHTML = `<div style="background-color: rgba(255, 77, 77, 0.1); border-left: 4px solid #ff4d4d; color: #ff4d4d; padding: 12px; margin-top: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center;">⚠️ El certificado es válido, pero ya ha caducado.</div>`;
            } else if (estadoSeguro.includes("por vencer")) {
                alertaHTML = `<div style="background-color: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; color: #ffc107; padding: 12px; margin-top: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center;">⚠️ El certificado está próximo a vencer.</div>`;
            }

            const mensajeWA = `Hola, quisiera solicitar más información sobre el certificado código ${codigoIngresado} a nombre de ${d.titular}.`;
            const linkWA = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensajeWA)}`;
            const linkCorreo = `mailto:${CORREO_CONTACTO}?subject=Consulta sobre Certificado ${codigoIngresado}&body=${encodeURIComponent(mensajeWA)}`;

            resultadoDiv.innerHTML = `
                <div class="resultado-tarjeta">
                    <h3 style="color:var(--color-exito); text-align:center; margin-top:0; margin-bottom:5px;">✓ CERTIFICADO VÁLIDO</h3>
                    
                    ${alertaHTML}
                    
                    <p style="margin-bottom: 5px; color: var(--texto-secundario); font-size: 12px; text-transform: uppercase;">Titular del Certificado</p>
                    <p style="margin-top: 0; font-size: 18px; font-weight: bold;">${d.titular}</p>
                    
                    <p style="margin-bottom: 5px; color: var(--texto-secundario); font-size: 12px; text-transform: uppercase;">Programa / Tema</p>
                    <p style="margin-top: 0; font-size: 18px; font-weight: bold;">${d.tema}</p>
                    
                    <p style="margin-bottom: 5px; color: var(--texto-secundario); font-size: 12px; text-transform: uppercase;">Estado / Fecha de Vencimiento</p>
                    <p style="margin-top: 0; font-size: 18px; font-weight: bold; color: var(--color-acento-hover);">${d.vencimiento}</p>
                    
                    <div style="margin-top: 25px; padding-top: 20px; text-align: center; border-top: 1px dashed var(--borde-suave);">
                        <p style="font-size: 14px; color: var(--texto-secundario); font-weight: 600; margin-bottom: 15px;">¿Necesitas validar más detalles?</p>
                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                            <a href="${linkWA}" target="_blank" style="background: #25D366; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold;">Soporte WhatsApp</a>
                            <a href="${linkCorreo}" style="background: transparent; border: 1px solid var(--color-acento); color: var(--color-acento-hover); padding: 12px 20px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold;">Enviar Correo</a>
                        </div>
                    </div>
                </div>`;
        
        } else {
            resultadoDiv.innerHTML = "<span style='color:#ff4d4d; font-weight:bold;'>❌ El certificado no figura en la base de datos oficial.</span>";
        }
    } catch (e) {
        resultadoDiv.innerHTML = "<span style='color:#ff4d4d; font-weight:bold;'>Error de conexión con el servidor.</span>";
    }
}