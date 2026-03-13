document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    }, { passive: true });

    // --- Mobile hamburger menu ---
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click OR the new mobile CTA button
        nav.querySelectorAll('.nav-link, .nav-mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observerNav.observe(section));

    // --- Scroll animations ---
    const animateElements = document.querySelectorAll('[data-animate]');
    const observerAnimate = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerAnimate.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    animateElements.forEach(el => observerAnimate.observe(el));

    // --- Booking form multi-step ---
    const panels = document.querySelectorAll('.booking-panel');
    const steps = document.querySelectorAll('.booking-step');
    const stepLines = document.querySelectorAll('.step-line');

    function goToStep(stepNum) {
        panels.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(`step-${stepNum}`);
        if (target) target.classList.add('active');

        steps.forEach(s => {
            const sNum = parseInt(s.dataset.step);
            s.classList.remove('active', 'completed');
            if (sNum === stepNum) s.classList.add('active');
            else if (sNum < stepNum) s.classList.add('completed');
        });

        stepLines.forEach((line, i) => {
            line.classList.toggle('active', i < stepNum - 1);
        });

        // Ukázat / skrýt pole pro voucher v kroku 3
        if (stepNum === 3) {
            const selectedService = document.querySelector('input[name="service"]:checked');
            const voucherFields = document.getElementById('voucher-fields');
            if (voucherFields) {
                if (selectedService && selectedService.value === 'voucher') {
                    voucherFields.style.display = 'block';
                } else {
                    voucherFields.style.display = 'none';
                }
            }
        }
    }

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            let next = parseInt(btn.dataset.next);

            // Přeskočení kroku 2, pokud je vybrán Voucher
            if (next === 2) {
                const selectedService = document.querySelector('input[name="service"]:checked');
                if (selectedService && selectedService.value === 'voucher') {
                    next = 3; // Jdeme rovnou na krok 3
                }
            }

            goToStep(next);
        });
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            let back = parseInt(btn.dataset.back);

            // Správné vrácení zpět z kroku 3, pokud byl vybrán Voucher
            if (back === 2) {
                const selectedService = document.querySelector('input[name="service"]:checked');
                if (selectedService && selectedService.value === 'voucher') {
                    back = 1; // Jdeme rovnou na krok 1
                }
            }

            goToStep(back);
        });
    });

    // --- Time slot selection ---
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
    });

    // --- Czech calendar with Flatpickr ---
    const dateInput = document.getElementById('booking-date');
    if (dateInput && typeof flatpickr !== 'undefined') {
        flatpickr(dateInput, {
            locale: 'cs',
            dateFormat: 'j. n. Y',
            minDate: 'today',
            disableMobile: true,
            inline: false,
            static: true,
            monthSelectorType: 'static',
            prevArrow: '←',
            nextArrow: '→',
        });
    }

    // --- Gallery toggle ---
    const galleryToggle = document.getElementById('gallery-toggle');
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryToggle && galleryGrid) {
        galleryToggle.addEventListener('click', () => {
            const isExpanded = galleryGrid.classList.toggle('expanded');
            galleryToggle.textContent = isExpanded ? 'Skrýt proměny' : 'Zobrazit další proměny';
        });
    }

    // --- FAQ accordion ---
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });

    // --- Cookie banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookies-accepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'false');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
