export const experienceTemplate = (exp) => `
    <div class="timeline-item" data-aos="fade-left">
        <div class="timeline-content">
            <div class="timeline-date">${exp.period}</div>
            <h4 class="timeline-title">${exp.title}</h4>
            <h5 class="timeline-company">${exp.company}</h5>
            <div class="timeline-tech-stack">
                ${exp.techStack.map(tech => `
                    <span class="tech-badge">${tech}</span>
                `).join('')}
            </div>
            <ul class="timeline-achievements">
                ${exp.details.map(detail => `
                    <li data-i18n="${detail}"></li>
                `).join('')}
            </ul>
        </div>
    </div>
`;

export const renderExperience = (experiences, container) => {
    container.innerHTML = experiences.map(exp => experienceTemplate(exp)).join('');
    
    // Aplicar traducciones inmediatamente
    if (window.i18nManager) {
        window.i18nManager.translatePage();
    }
};
