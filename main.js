// ===== MAIN JAVASCRIPT - FUNCIONALIDADES PROFESIONALES =====

class DashboardApp {
    constructor() {
        this.isLoading = true;
        this.scrollHandlers = [];
        this.init();
    }

    async init() {
        try {
            await this.showLoadingScreen();
            this.setupEventListeners();
            this.setupScrollAnimations();
            this.setupNavigation();
            this.setupFormHandling();
            this.setupIntersectionObserver();
            this.setupAnimations();
            this.setupDropdownMenu();
            this.initializePlatforms();
            this.setupBackToTop();
            this.setupTypewriterEffect();
            
            // Inicializar componentes después de la carga
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
            
        } catch (error) {
            this.handleError(error, 'inicialización');
        }
    }

    // ===== LOADING SCREEN =====
    async showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.querySelector('.progress-bar');
        
        if (loadingScreen && progressBar) {
            // Simular progreso de carga
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = `${progress}%`;
            }, 200);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
                this.isLoading = false;
            }, 500);
        }
    }

    // ===== CONFIGURACIÓN DE EVENT LISTENERS =====
    setupEventListeners() {
        // Hamburger menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer clic en un enlace
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));

        // Smooth scroll para enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Prevenir comportamiento por defecto en enlaces vacíos
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => e.preventDefault());
        });

        // Manejar redimensionado de ventana
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    // ===== MANEJO DEL SCROLL =====
    handleScroll() {
        this.updateHeaderOnScroll();
        this.updateActiveNavLink();
        this.handleBackToTop();
        this.handleScrollAnimations();
    }

    updateHeaderOnScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;

        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleBackToTop() {
        const backToTop = document.getElementById('backToTop');
        const scrollY = window.scrollY;

        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ===== ACTUALIZACIÓN DE ENLACES ACTIVOS =====
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== ANIMACIONES AL SCROLL =====
    setupScrollAnimations() {
        // Inicializar elementos para animación
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
        });

        // Ejecutar una vez al cargar
        setTimeout(() => {
            this.handleScrollAnimations();
        }, 100);
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate');
        
        elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('animated');
            }
        });
    }

    // ===== OBSERVER PARA ANIMACIONES =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        document.querySelectorAll('.service-card, .book-card, .dashboard-card').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== NAVEGACIÓN MEJORADA =====
    setupNavigation() {
        // Agregar clase active al enlace actual basado en hash URL
        const currentHash = window.location.hash;
        if (currentHash) {
            const currentLink = document.querySelector(`.nav-link[href="${currentHash}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    }

    // ===== MENÚ DESPLEGABLE =====
    setupDropdownMenu() {
        const dropdownToggle = document.getElementById('dropdownToggle');
        const dropdownContent = document.getElementById('dropdownContent');
        
        if (dropdownToggle && dropdownContent) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle('active');
            });

            // Cerrar al hacer clic en un enlace del dropdown
            dropdownContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    dropdownContent.classList.remove('active');
                });
            });

            // Cerrar al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!dropdownToggle.contains(e.target) && !dropdownContent.contains(e.target)) {
                    dropdownContent.classList.remove('active');
                }
            });
        }
    }

    // ===== PLATAFORMAS DESPLEGABLES MEJORADAS =====
    initializePlatforms() {
        // Agregar event listeners a las plataformas
        document.querySelectorAll('.platform-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const platformId = header.getAttribute('data-platform') || 
                                header.replaceWith(header.cloneNode(true));
                
                if (platformId) {
                    this.togglePlatform(platformId);
                }
            });
            
            // Mejorar accesibilidad con teclado
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
        });

        // Actualizar estados ARIA
        this.updatePlatformsAria();
    }

    updatePlatformsAria() {
        document.querySelectorAll('.platform-header').forEach(header => {
            const platformContent = header.nextElementSibling;
            if (platformContent && platformContent.classList.contains('platform-content')) {
                const isExpanded = platformContent.classList.contains('active');
                header.setAttribute('aria-expanded', isExpanded.toString());
            }
        });
    }

    openPlatform(platformId) {
        const platform = document.getElementById(platformId);
        const header = platform?.previousElementSibling;
        const arrow = header?.querySelector('.platform-arrow');
        
        if (platform && arrow && header) {
            platform.classList.add('active');
            arrow.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
            
            // Forzar reflow para asegurar la animación
            platform.style.display = 'block';
            setTimeout(() => {
                platform.style.maxHeight = platform.scrollHeight + 'px';
            }, 10);
        }
    }

    closePlatform(platformId) {
        const platform = document.getElementById(platformId);
        const header = platform?.previousElementSibling;
        const arrow = header?.querySelector('.platform-arrow');
        
        if (platform && arrow && header) {
            platform.classList.remove('active');
            arrow.classList.remove('active');
            header.setAttribute('aria-expanded', 'false');
            platform.style.maxHeight = '0';
            
            setTimeout(() => {
                if (!platform.classList.contains('active')) {
                    platform.style.display = 'none';
                }
            }, 300);
        }
    }

    togglePlatform(platformId) {
        const platform = document.getElementById(platformId);
        if (!platform) {
            console.error('Plataforma no encontrada:', platformId);
            return;
        }

        const header = platform.previousElementSibling;
        const arrow = header?.querySelector('.platform-arrow');
        const platformCard = header?.closest('.platform-card');

        if (!header || !arrow) {
            console.error('Elementos de la plataforma no encontrados para:', platformId);
            return;
        }

        const isOpening = !platform.classList.contains('active');
        
        // Cerrar otras plataformas si se está abriendo una nueva
        if (isOpening) {
            document.querySelectorAll('.platform-content').forEach(content => {
                if (content.id !== platformId && content.classList.contains('active')) {
                    this.closePlatform(content.id);
                }
            });
        }
        
        // Alternar plataforma actual
        if (isOpening) {
            this.openPlatform(platformId);
        } else {
            this.closePlatform(platformId);
        }
        
        // Efecto visual adicional
        if (isOpening && platformCard) {
            platformCard.classList.add('platform-highlight');
            setTimeout(() => {
                platformCard.classList.remove('platform-highlight');
            }, 1000);
        }
        
        // Animar el contenido interno
        if (isOpening) {
            const miniGrid = platform.querySelector('.dashboard-mini-grid');
            if (miniGrid) {
                miniGrid.style.opacity = '0';
                miniGrid.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    miniGrid.style.opacity = '1';
                    miniGrid.style.transform = 'translateY(0)';
                    miniGrid.style.transition = 'all 0.5s ease 0.2s';
                }, 50);
            }
        }
    }

    // ===== EFECTO MÁQUINA DE ESCRIBIR =====
    setupTypewriterEffect() {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            // El efecto se aplica via CSS, aquí solo nos aseguramos que funcione
            typingElement.style.visibility = 'visible';
        }
    }

    // ===== MANEJO DE FORMULARIOS =====
    setupFormHandling() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Validación en tiempo real para todos los formularios
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
            input.addEventListener('focus', this.clearFieldError.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        
        if (!formGroup) return true;

        // Remover errores previos
        this.clearFieldError({ target: field });

        let isValid = true;
        let errorMessage = '';

        // Validaciones
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un teléfono válido';
            }
        } else if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                errorMessage = 'Por favor ingresa una URL válida';
            }
        }

        if (!isValid) {
            this.showFieldError(formGroup, errorMessage);
        }

        return isValid;
    }

    showFieldError(formGroup, message) {
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.fontWeight = 'var(--font-weight-medium)';
    }

    clearFieldError(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Validar todos los campos
        let isValid = true;
        const formInputs = form.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            const event = new Event('blur');
            input.dispatchEvent(event);
            if (input.closest('.form-group.error')) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Por favor corrige los errores en el formulario', 'error');
            this.shakeElement(form);
            return;
        }

        // Mostrar estado de carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML || 'Enviar';
        
        if (submitBtn) {
            submitBtn.innerHTML = '<div class="spinner"></div> Enviando...';
            submitBtn.disabled = true;
        }

        // Simular envío (en producción sería una petición real)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showNotification('📚 Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
            form.reset();
            
            // Efecto de confeti visual
            this.showSuccessEffect();
            
        } catch (error) {
            this.showNotification('❌ Error al enviar el mensaje. Intenta nuevamente.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    }

    // ===== NOTIFICACIONES =====
    showNotification(message, type = 'info') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Cerrar notificación">&times;</button>
            </div>
        `;

        // Aplicar estilos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '10000',
            maxWidth: '400px',
            animation: 'slideInFromRight 0.3s ease-out'
        });

        const notificationContent = notification.querySelector('.notification-content');
        Object.assign(notificationContent.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
        });

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s'
        });

        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutToRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        });

        closeBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255,255,255,0.2)';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });

        // Soporte para teclado
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeBtn.click();
            }
        });

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutToRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: 'var(--info)'
        };
        return colors[type] || colors.info;
    }

    // ===== ANIMACIONES ADICIONALES =====
    setupAnimations() {
        // Contadores animados
        this.setupCounterAnimation();
        
        // Efectos de hover avanzados
        this.setupHoverEffects();

        // Animaciones de iconos
        this.setupIconAnimations();

        // Efectos de parallax suave
        this.setupParallaxEffects();
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                const suffix = counter.getAttribute('data-target') === '98' ? '%' : 
                              counter.getAttribute('data-target') === '1000' ? '+' : '';
                counter.textContent = target + suffix;
            }
        };

        updateCounter();
    }

    setupHoverEffects() {
        // Efecto de tilt en tarjetas (solo en desktop)
        if (window.innerWidth >= 768) {
            const cards = document.querySelectorAll('.service-card, .book-card, .dashboard-card, .value-card, .mv-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const cardRect = card.getBoundingClientRect();
                    const x = e.clientX - cardRect.left;
                    const y = e.clientY - cardRect.top;
                    
                    const centerX = cardRect.width / 2;
                    const centerY = cardRect.height / 2;
                    
                    const rotateY = (x - centerX) / 25;
                    const rotateX = (centerY - y) / 25;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                });
            });
        }

        // Efecto hover en botones
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    setupIconAnimations() {
        // Animación de iconos al hover
        const icons = document.querySelectorAll('.service-icon, .mv-icon, .value-icon, .method-icon-simple');
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    setupParallaxEffects() {
        // Efecto parallax suave para el hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // ===== EFECTOS VISUALES =====
    shakeElement(element) {
        element.classList.add('animate-shake');
        setTimeout(() => {
            element.classList.remove('animate-shake');
        }, 500);
    }

    showSuccessEffect() {
        // Efecto visual simple de éxito
        const successElements = document.querySelectorAll('.btn-primary');
        successElements.forEach(btn => {
            const originalBg = btn.style.background;
            btn.style.background = 'var(--success)';
            setTimeout(() => {
                btn.style.background = originalBg;
            }, 1000);
        });
    }

    // ===== MANEJO DE REDIMENSIONADO =====
    handleResize() {
        // Re-inicializar efectos que dependen del tamaño de pantalla
        this.setupHoverEffects();
        
        // Cerrar menús en móvil al cambiar a desktop
        if (window.innerWidth >= 768) {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    }

    // ===== UTILIDADES =====
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // ===== MANEJO DE ERRORES =====
    handleError(error, context = '') {
        console.error(`Error en ${context}:`, error);
        this.showNotification(`❌ Ha ocurrido un error${context ? ' en ' + context : ''}`, 'error');
    }
}

// ===== FUNCIONES GLOBALES =====

// Función para alternar plataformas (compatible con onclick del HTML)
function togglePlatform(platformId) {
    if (window.dashboardApp) {
        window.dashboardApp.togglePlatform(platformId);
    } else {
        // Fallback si la app no está cargada
        const platform = document.getElementById(platformId);
        const header = platform?.previousElementSibling;
        const arrow = header?.querySelector('.platform-arrow');
        
        if (platform && arrow && header) {
            const isActive = platform.classList.contains('active');
            
            if (!isActive) {
                // Cerrar otros
                document.querySelectorAll('.platform-content').forEach(content => {
                    if (content.id !== platformId) {
                        content.classList.remove('active');
                        const otherArrow = content.previousElementSibling.querySelector('.platform-arrow');
                        if (otherArrow) otherArrow.classList.remove('active');
                    }
                });
            }
            
            platform.classList.toggle('active');
            arrow.classList.toggle('active');
            
            // Actualizar display y max-height
            if (platform.classList.contains('active')) {
                platform.style.display = 'block';
                setTimeout(() => {
                    platform.style.maxHeight = platform.scrollHeight + 'px';
                }, 10);
            } else {
                platform.style.maxHeight = '0';
                setTimeout(() => {
                    platform.style.display = 'none';
                }, 300);
            }
        }
    }
}

// Función para scroll a plataformas específicas
function scrollToPlatform(platformId) {
    const platformElement = document.getElementById(platformId + '-platform');
    if (platformElement) {
        // Cerrar el menú dropdown
        const dropdownContent = document.getElementById('dropdownContent');
        if (dropdownContent) {
            dropdownContent.classList.remove('active');
        }
        
        // Abrir la plataforma específica
        if (window.dashboardApp) {
            window.dashboardApp.openPlatform(platformId);
        } else {
            togglePlatform(platformId);
        }
        
        // Scroll suave a la plataforma
        platformElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Efecto visual de highlight
        platformElement.classList.add('platform-highlight');
        setTimeout(() => {
            platformElement.classList.remove('platform-highlight');
        }, 2000);
    }
}

// Función debounce global
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new DashboardApp();
        window.dashboardApp = app;
        
        // Agregar estilos CSS dinámicos para animaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutToRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: inline-block;
                margin-right: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .typing-animation {
                overflow: hidden;
                border-right: 3px solid var(--botones-acentos);
                white-space: nowrap;
                animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
            }

            @keyframes typing {
                from { width: 0; }
                to { width: 100%; }
            }

            @keyframes blink-caret {
                from, to { border-color: transparent; }
                50% { border-color: var(--botones-acentos); }
            }

            @keyframes bookBounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateX(-50%) translateY(0) rotate(0deg);
                }
                40% {
                    transform: translateX(-50%) translateY(-3px) rotate(5deg);
                }
                60% {
                    transform: translateX(-50%) translateY(-2px) rotate(-3deg);
                }
            }

            @keyframes slideInListItem {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Estilos para plataformas desplegables */
            .platform-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease-in-out;
                display: none;
            }

            .platform-content.active {
                display: block;
                max-height: 800px;
            }

            .platform-arrow {
                transition: transform 0.3s ease-in-out;
            }

            .platform-arrow.active {
                transform: rotate(180deg);
            }

            .platform-header {
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .platform-header:hover {
                background-color: var(--fondo-oscuro) !important;
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        
        // Fallback: mostrar mensaje de error al usuario
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #e74c3c;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
        `;
        errorDiv.textContent = 'Error al cargar la aplicación. Por favor, recarga la página.';
        document.body.appendChild(errorDiv);
    }
});

// ===== MANEJO DE ERRORES GLOBALES =====
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
});

// ===== POLYFILLS PARA NAVEGADORES ANTIGUOS =====
// IntersectionObserver polyfill
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver no soportado, cargando polyfill...');
    // En un entorno real, aquí cargarías el polyfill
}

// Smooth scroll polyfill
if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('Scroll behavior no soportado, consider adding polyfill');
}