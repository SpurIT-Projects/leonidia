/*
 * Леонидия - JavaScript функциональность
 * Современный интерактивный функционал для стоматологического сайта
 */

(function() {
    'use strict';

    // Ожидание полной загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        initializeWebsite();
    });

    function initializeWebsite() {
        // Инициализация всех компонентов
        initMobileMenu();
        initScrollToTop();
        initSmoothScrolling();
        initHeaderScroll();
        initFormHandling();
        initAnimations();
        initPageTransitions();
        
        console.log('Леонидия: Сайт успешно инициализирован');
    }

    // ===== МОБИЛЬНОЕ МЕНЮ =====
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Анимация гамбургера
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.transform = hamburger.classList.contains('active') 
                    ? `rotate(${index === 0 ? '45' : index === 1 ? '0' : '-45'}deg) translate(${index === 0 ? '5px, 5px' : index === 1 ? '0, 0' : '-5px, 5px'})`
                    : 'none';
                bar.style.opacity = index === 1 && hamburger.classList.contains('active') ? '0' : '1';
            });
        });

        // Закрытие меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ===== КНОПКА "НАВЕРХ" =====
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        
        if (!scrollTopBtn) return;

        // Показ/скрытие кнопки при скролле
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        // Обработчик клика
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ =====
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Обновление активной ссылки в навигации
                    updateActiveNavLink(targetId);
                }
            });
        });
    }

    // ===== ЭФФЕКТЫ ПРИ СКРОЛЛЕ ХЕДЕРА =====
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        
        if (!header) return;

        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            // Изменение прозрачности хедера
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Скрытие/показ хедера при скролле
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });

        // Добавляем CSS класс для анимации
        header.style.transition = 'transform 0.3s ease-in-out, background-color 0.3s ease';
    }

    // ===== ОБНОВЛЕНИЕ АКТИВНОЙ ССЫЛКИ =====
    function updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== ОБРАБОТКА ФОРМ =====
    function initFormHandling() {
        const appointmentForm = document.getElementById('appointment-form');
        
        if (!appointmentForm) return;

        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Валидация
            if (!validateForm(data)) {
                return;
            }

            // Имитация отправки формы
            submitAppointmentForm(data);
        });

        // Валидация в реальном времени
        const inputs = appointmentForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    // ===== ВАЛИДАЦИЯ ФОРМЫ =====
    function validateForm(data) {
        let isValid = true;
        
        // Проверка обязательных полей
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'Введите корректное имя (минимум 2 символа)');
            isValid = false;
        }

        if (!data.phone || !isValidPhone(data.phone)) {
            showFieldError('phone', 'Введите корректный номер телефона');
            isValid = false;
        }

        if (data.email && !isValidEmail(data.email)) {
            showFieldError('email', 'Введите корректный email адрес');
            isValid = false;
        }

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        
        clearFieldError(field);

        switch (name) {
            case 'name':
                if (value.length < 2) {
                    showFieldError(name, 'Имя должно содержать минимум 2 символа');
                    return false;
                }
                break;
            
            case 'phone':
                if (!isValidPhone(value)) {
                    showFieldError(name, 'Введите корректный номер телефона');
                    return false;
                }
                break;
            
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(name, 'Введите корректный email адрес');
                    return false;
                }
                break;
        }
        
        return true;
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ =====
    function isValidPhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        // Удаляем предыдущую ошибку
        clearFieldError(field);

        // Добавляем класс ошибки
        field.classList.add('error');

        // Создаем элемент с сообщением об ошибке
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // ===== ОТПРАВКА ФОРМЫ =====
    function submitAppointmentForm(data) {
        const submitBtn = document.querySelector('#appointment-form button[type="submit"]');
        
        if (!submitBtn) return;

        // Показываем индикатор загрузки
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        // Имитация отправки (в реальном проекте здесь должен быть AJAX запрос)
        setTimeout(() => {
            // Успешная отправка
            showSuccessMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            
            // Сброс формы
            document.getElementById('appointment-form').reset();
            
            // Восстановление кнопки
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    }

    // ===== УВЕДОМЛЕНИЯ =====
    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    function showErrorMessage(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Наблюдение за элементами для анимации
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature, .contact-card, .about-content > *, .hero-content > *'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ===== ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ =====
    function initPageTransitions() {
        // Автоматический скролл наверх при переходах
        window.addEventListener('beforeunload', function() {
            window.scrollTo(0, 0);
        });

        // Плавное появление страницы
        document.body.classList.add('page-loaded');
    }

    // ===== ДОПОЛНИТЕЛЬНЫЕ ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ =====

    // Обработка кнопок "Записаться"
    document.addEventListener('click', function(e) {
        if (e.target.matches('.appointment-btn, .btn-primary') && 
            (e.target.textContent.includes('Записаться') || e.target.textContent.includes('прием'))) {
            e.preventDefault();
            
            // Скролл к форме записи
            const contactSection = document.getElementById('contacts');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Фокус на поле имени
                setTimeout(() => {
                    const nameField = document.getElementById('name');
                    if (nameField) {
                        nameField.focus();
                    }
                }, 500);
            }
        }
    });

    // Обработка телефонных ссылок
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="tel:"]')) {
            // Аналитика клика по телефону (можно добавить GTM/GA4)
            console.log('Клик по телефону:', e.target.href);
        }
    });

    // ===== УТИЛИТЫ =====

    // Дебаунс для оптимизации обработчиков событий
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Троттлинг для скролл-событий
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Определение мобильного устройства
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Глобальный объект для API
    window.LeonidiaWebsite = {
        showNotification,
        scrollToSection: function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        },
        isMobile
    };

})();