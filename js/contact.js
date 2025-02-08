// Filtrar errores de CORS
window.addEventListener('error', function(e) {
    if (e.message.includes('ERR_BLOCKED_BY_CLIENT') || 
        e.message.includes('net::ERR_BLOCKED_BY_CLIENT')) {
        e.stopPropagation();
        return true;
    }
}, true);

// Función para proteger el email contra bots
function protectContactInfo() {
    const email = ['raulgarciademarina', 'yahoo.es'].join('@');
    
    // Mostrar email
    const emailContainer = document.getElementById('emailContainer');
    if (emailContainer) {
        emailContainer.querySelector('.contact-text').textContent = email;
    }
    return email;
}

// Función para copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Podríamos mostrar un tooltip o notificación de éxito
        console.log('Copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

// Generar QR code usando una API
function generateQR(email) {
    console.log('Intentando generar QR code...');
    
    // Verificar que el contenedor existe
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) {
        console.error('No se encontró el contenedor del QR code');
        return;
    }
    
    try {
        console.log('Preparando datos para el QR code...');
        
        // Limpiar el contenedor
        qrContainer.innerHTML = '';
        
        // Crear el vCard con la información de contacto
        const vCard = [
            'BEGIN:VCARD',
            'VERSION:3.0', 
            'FN:Raúl García de Marina Maroto',    // Nombre completo como se muestra
            'TITLE:Senior QA Automation Engineer',
            'ORG:Kairos DS',
            'EMAIL;TYPE=WORK,INTERNET:' + email,
            'URL:https://linkedin.com/in/raúl-garcía-de-marina-maroto-38334153',
            'URL:https://github.com/rgarciademarina',
            'NOTE:Especialista en automatización de pruebas y desarrollo de frameworks de testing',
            'END:VCARD'
        ].join('\n');
        
        // Crear la URL del QR code con el vCard
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vCard)}`;
        
        // Crear la imagen
        const img = document.createElement('img');
        img.src = qrUrl;
        img.alt = 'QR Code para contacto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        qrContainer.appendChild(img);
        
        // Añadir enlace debajo del QR
        const linkContainer = document.createElement('div');
        linkContainer.style.marginTop = '10px';
        linkContainer.style.textAlign = 'center';
        linkContainer.innerHTML = '<a href="https://linkedin.com/in/raúl-garcía-de-marina-maroto-38334153" target="_blank" class="btn btn-outline-primary btn-sm">Ver perfil completo</a>';
        qrContainer.appendChild(linkContainer);
        
        console.log('QR code generado exitosamente');
    } catch (error) {
        console.error('Error al generar el QR code:', error);
        console.error(error.stack);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando funcionalidades...');
    
    // Proteger información de contacto y obtener email
    const email = protectContactInfo();
    
    // Generar QR code con el email
    generateQR(email);
    
    // Configurar botones de copiar
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textElement = button.parentElement.querySelector('.contact-text');
            if (textElement) {
                copyToClipboard(textElement.textContent.trim());
            }
        });
    });
    
    // Configurar formulario
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Verificación simple
            const verification = document.getElementById('verification');
            if (verification && verification.value !== '5') {
                alert('La verificación es incorrecta. Por favor, intenta de nuevo.');
                return;
            }
            
            try {
                const formData = new FormData(form);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const json = await response.json();
                if (json.ok) {
                    alert('¡Mensaje enviado con éxito!');
                    form.reset();
                } else {
                    throw new Error('Error al enviar el mensaje');
                }
            } catch (error) {
                alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
                console.error('Error:', error);
            }
        });
    }
});
