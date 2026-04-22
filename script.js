// ==========================================================================
// 1. CONFIGURACIÓN PRINCIPAL
// ==========================================================================

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQIoFtMp-CxDA4AdaDS4Kqb0DhcuGLe90dbVSQGFV7e3OfztbDPg4hXDehcjsfDrc5trQSXro7qZIwl/pub?gid=1088449560&single=true&output=csv';
const NUMERO_WHATSAPP = '51999999999';
const CORREO_CONTACTO = 'gerencia@trainprosac.com';

// ==========================================================================
// 2. FUNCIÓN PARA LEER EXCEL
// ==========================================================================
function parseCSVRow(str) {
    let arr = []; let quote = false; let col = '';
    for (let i = 0; i < str.length; i++) {
        let cc = str[i];
        if (cc === '"') { quote = !quote; } 
        else if (cc === ',' && !quote) { arr.push(col.trim()); col = ''; } 
        else { col += cc; }
    }
    arr.push(col.trim()); return arr;
}

// ==========================================================================
// 3. LA LÓGICA DE VALIDACIÓN
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

    resultadoDiv.innerHTML = "<span style='color: var(--texto-secundario);'>Procesando solicitud...</span>";

    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        const filas = data.split('\n'); 
        
        let encontrado = false;
        let d = {}; 

        for(let i = 1; i < filas.length; i++) {
            if (filas[i].trim() === "") continue; 
            
            let cols = parseCSVRow(filas[i]);
            
            // Verificamos si la columna 5 (Código) coincide
            if (cols.length >= 8 && cols[5] === codigoIngresado) {
                encontrado = true;
                // Guardamos los datos, incluyendo la columna 8 (ESTADO)
                d = { 
                    titular: cols[1], 
                    vencimiento: cols[3], 
                    tema: cols[4],
                    estado: cols[8] ? cols[8].trim().toLowerCase() : "" // Convertimos a minúsculas para comparar fácil
                };
                break; 
            }
        }

        if(encontrado) {
            
            // Generamos las alertas dependiendo del estado
            let alertaHTML = "";
            if (d.estado.includes("vencido")) {
                alertaHTML = `<div style="background-color: rgba(255, 77, 77, 0.1); border-left: 4px solid #ff4d4d; color: #ff4d4d; padding: 12px; margin-top: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center;">⚠️ El certificado es válido, pero ya ha caducado.</div>`;
            } else if (d.estado.includes("por vencer")) {
                alertaHTML = `<div style="background-color: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; color: #ffc107; padding: 12px; margin-top: 15px; margin-bottom: 15px; border-radius: 4px; font-weight: bold; font-size: 14px; text-align: center;">⚠️ El certificado está próximo a vencer.</div>`;
            }

            const mensajeWA = `Hola, quisiera solicitar más información sobre el certificado código ${codigoIngresado} a nombre de ${d.titular}.`;
            const linkWA = `https://wa.me/${51987260390}?text=${encodeURIComponent(mensajeWA)}`;
            const linkCorreo = `mailto:${CORREO_CONTACTO}?subject=Consulta sobre Certificado ${codigoIngresado}&body=${encodeURIComponent(mensajeWA)}`;

            // Inyectamos el HTML incluyendo la variable alertaHTML
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