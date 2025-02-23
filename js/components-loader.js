import { experienceData } from './experience-data.js';
import { renderExperience } from './templates.js';

class ComponentsLoader {
    constructor() {
        this.loadedComponents = new Set();
    }

    async loadComponent(elementId, componentPath) {
        if (this.loadedComponents.has(elementId)) {
            return;
        }

        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            document.getElementById(elementId).innerHTML = content;
            this.loadedComponents.add(elementId);

            // Si es la sección de experiencia, cargar los datos dinámicamente
            if (elementId === 'experience-section') {
                this.loadExperienceData();
            }

            // Actualizar las traducciones después de cargar el componente
            if (window.i18nManager) {
                window.i18nManager.translatePage();
            }
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    loadExperienceData() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        renderExperience(experienceData, timeline);

        // Actualizar las traducciones después de cargar el componente
        if (window.i18nManager) {
            window.i18nManager.translatePage();
        }
    }
}

// Crear una instancia global del loader
window.componentsLoader = new ComponentsLoader();

// Cargar todos los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    await window.componentsLoader.loadComponent('navbar-container', 'components/navbar.html');
    await window.componentsLoader.loadComponent('about-section', 'components/about.html');
    await window.componentsLoader.loadComponent('experience-section', 'components/experience.html');
});
