// Navbar scroll effect
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Si el href es solo "#", no intentamos seleccionar ningún elemento
            if (href === "#") {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Inicializar las secciones con opacidad pero visible
    sections.forEach(section => {
        if (section.id !== 'home') { // No aplicar a la sección home
            section.style.opacity = '0';
            observer.observe(section);
        }
    });

    // Active navigation highlight
    function updateActiveNav() {
        const navbarHeight = navbar.offsetHeight;
        const scrollPosition = window.scrollY + navbarHeight;
        let currentSection = null;
        let smallestHeight = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if we're within this section's bounds
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight && 
                sectionHeight < smallestHeight) {
                currentSection = section;
                smallestHeight = sectionHeight;
            }
        });

        if (currentSection) {
            const id = currentSection.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Ejecutar al cargar y al scroll
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // Modal functionality
    const modal = document.querySelector('.modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalText = modal.querySelector('.modal-text');
    const modalTags = modal.querySelector('.modal-tags');
    const prevButton = modal.querySelector('.prev-button');
    const nextButton = modal.querySelector('.next-button');
    const closeButton = modal.querySelector('.close-modal');
    let currentCardIndex = 0;
    const cards = document.querySelectorAll('.about-card');

    // Event listeners para las tarjetas
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(card, index);
        });
    });

    // Función para abrir el modal con una tarjeta específica
    function openModal(card, index) {
        currentCardIndex = index;
        
        const image = card.querySelector('.about-image');
        const title = card.querySelector('h3');
        const textContent = card.querySelector('.about-text p');
        let tags = card.querySelector('.about-text .tech-stack');
        if (!tags) {
            tags = card.querySelector('.about-text .timeline-tech-stack');
        }

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = title.textContent;
        modalText.innerHTML = textContent.innerHTML;
        modalTags.innerHTML = tags ? tags.innerHTML : '';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateNavigationButtons();
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Función para actualizar la visibilidad de los botones de navegación
    function updateNavigationButtons() {
        prevButton.style.visibility = currentCardIndex > 0 ? 'visible' : 'hidden';
        nextButton.style.visibility = currentCardIndex < cards.length - 1 ? 'visible' : 'hidden';
    }

    // Función para navegar entre tarjetas
    function navigateModal(direction) {
        const newIndex = currentCardIndex + direction;
        if (newIndex >= 0 && newIndex < cards.length) {
            openModal(cards[newIndex], newIndex);
        }
    }

    // Event listeners para los botones
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCardIndex > 0) {
            navigateModal(-1);
        }
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCardIndex < cards.length - 1) {
            navigateModal(1);
        }
    });

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Event listener para cerrar el modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                if (currentCardIndex > 0) {
                    navigateModal(-1);
                }
                break;
            case 'ArrowRight':
                if (currentCardIndex < cards.length - 1) {
                    navigateModal(1);
                }
                break;
        }
    });

    // Asegurar que el menú se cierra correctamente
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Cerrar el menú al hacer clic en el botón hamburguesa cuando está abierto
    navbarToggler.addEventListener('click', function() {
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Añadir funcionalidad para cerrar el menú en móvil
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                // Usar el método de Bootstrap para cerrar el menú
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar el reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('Por favor, completa el captcha');
                return;
            }

            // Obtener los datos del formulario
            const formData = {
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                message: document.querySelector('#message').value,
                'g-recaptcha-response': recaptchaResponse
            };

            // Aquí puedes añadir el código para enviar los datos a tu servidor
            console.log('Formulario enviado:', formData);
            
            // Resetear el formulario y el captcha
            contactForm.reset();
            grecaptcha.reset();
            
            // Mostrar mensaje de éxito
            alert('Mensaje enviado correctamente');
        });
    }
});

// Polyfill para NodeList.forEach en IE
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Función de depuración para inspeccionar el estado de las traducciones
function debugTranslations() {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
        console.log("=== DEBUG TRANSLATIONS ===");
        console.log("Current Language:", window.i18nManager.currentLang);
        
        // Inspeccionar la tercera experiencia
        const thirdExperience = document.querySelectorAll('.timeline-item')[2];
        if (thirdExperience) {
            console.log("Third Experience Found:", thirdExperience);
            
            // Comprobar sus elementos de traducción
            const items = thirdExperience.querySelectorAll('[data-i18n]');
            console.log("Translation Items in Third Experience:", items.length);
            
            items.forEach((item, index) => {
                const key = item.getAttribute('data-i18n');
                console.log(`Item ${index}:`, {
                    key: key,
                    text: item.textContent,
                    langPath: window.i18nManager.currentLang + '.' + key.replace(/\./g, '.')
                });
            });
        } else {
            console.log("Third Experience Not Found");
        }
        
        console.log("=== END DEBUG ===");
    }, 500);
}

// Setup language buttons
document.addEventListener('DOMContentLoaded', function() {
    if (window.i18nManager) {
        // Configurar el idioma según la URL o el almacenamiento local
        window.i18nManager.initialize();
        
        // Evento para cambiar el idioma
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', function(e) {
                e.preventDefault();
                window.i18nManager.toggleLanguage(e);
            });
        }
    }
});

// Image overlay functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.getElementById('profileImage');
    const imageOverlay = document.getElementById('imageOverlay');
    const closeButton = imageOverlay.querySelector('.close-button');
    const overlayImage = imageOverlay.querySelector('.overlay-image');
    
    function openOverlay() {
        imageOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeOverlay() {
        imageOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Click events
    profileImage.addEventListener('click', openOverlay);
    closeButton.addEventListener('click', closeOverlay);
    imageOverlay.addEventListener('click', function(e) {
        if (e.target === imageOverlay) {
            closeOverlay();
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageOverlay.classList.contains('active')) {
            closeOverlay();
        }
    });
    
    // Touch events for mobile
    let touchStartY;
    imageOverlay.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    imageOverlay.addEventListener('touchmove', function(e) {
        if (!touchStartY) return;
        
        const touchEndY = e.touches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        // If user swipes up more than 50px, close the overlay
        if (Math.abs(diff) > 50) {
            closeOverlay();
            touchStartY = null;
        }
    });
    
    imageOverlay.addEventListener('touchend', function() {
        touchStartY = null;
    });
});

// Show More Experience Button
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenExperience = document.querySelector('.hidden-experience');

    if (showMoreBtn && hiddenExperience) {
        showMoreBtn.addEventListener('click', function() {
            hiddenExperience.classList.toggle('show');
            this.classList.toggle('active');
            
            if (hiddenExperience.classList.contains('show')) {
                this.innerHTML = 'Ver menos <i class="bi bi-chevron-up"></i>';
            } else {
                this.innerHTML = 'Ver más experiencia <i class="bi bi-chevron-down"></i>';
            }

            // Reiniciar las animaciones AOS para la experiencia oculta
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }
});