document.addEventListener('DOMContentLoaded', () => {
    // --- Header scroll effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

  // --- Mobile hamburger menu ---
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            // ZMĚNA: Přidána/Odebrána třída 'active' pro oba (hamburger i menu)
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            
            // ZMĚNA: Podmínka nyní kontroluje třídu 'active'
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        nav.querySelectorAll('.nav-link, .nav-mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                // ZMĚNA: Odebírá třídu 'active'
                nav.classList.remove('active'); 
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
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // --- Smooth scroll pro kotvy ---
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

// --- Real-time Otevírací doba ---
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');

    if (statusBadge && statusText) {
        function checkOpenStatus() {
            const now = new Date();
            const day = now.getDay(); // 0 = Neděle, 1 = Pondělí, ... 6 = Sobota
            const hour = now.getHours();

            // Nastavení standardní otevírací doby (Po-Pá, 8:00 - 18:00)
            const isWeekday = day >= 1 && day <= 5;
            const isWorkingHour = hour >= 8 && hour < 18;

            if (isWeekday && isWorkingHour) {
                statusBadge.classList.add('status-open');
                statusBadge.classList.remove('status-closed');
                statusText.textContent = 'Nyní máme otevřeno';
            } else {
                statusBadge.classList.add('status-closed');
                statusBadge.classList.remove('status-open');
                statusText.textContent = 'Nyní máme zavřeno';
            }
        }

        // Spustit ihned při načtení
        checkOpenStatus();

        // Kontrolovat každou minutu, kdyby měl uživatel web dlouho otevřený
        setInterval(checkOpenStatus, 60000);
    }


    // --- Blog Modální okno ---
    const blogModal = document.getElementById('blog-modal');
    const modalBody = document.getElementById('blog-modal-body');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (blogModal && modalBody) {
        // Funkce pro zavření modálu
        const closeBlogModal = () => {
            blogModal.classList.remove('active');
            document.body.style.overflow = ''; // Vrátí scrollování stránce
        };

        // Otevření modálu kliknutím na tlačítko "Číst více"
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.dataset.target;
                const hiddenContent = document.getElementById(targetId);
                const cardBody = trigger.closest('.blog-body');

                if (hiddenContent && cardBody) {
                    // Získání informací z karty
                    const date = cardBody.querySelector('.blog-date').textContent;
                    const title = cardBody.querySelector('.blog-title').textContent;

                    // Vložení HTML do modálu
                    modalBody.innerHTML = `
                        <span class="blog-date" style="display:block; font-size:0.9rem; font-weight:600; color:var(--primary); margin-bottom:12px;">${date}</span>
                        <h3 style="font-family:var(--font-display); font-size:2rem; line-height:1.2; color:var(--gray-900); margin-bottom:24px;">${title}</h3>
                        <div class="modal-text-content">
                            ${hiddenContent.innerHTML}
                        </div>
                    `;

                    // Zobrazení a zablokování scrollování stránky pod ním
                    blogModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Event listenery pro zavření
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBlogModal);

        // Zavření kliknutím mimo obsah okna (do tmavého pozadí)
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) closeBlogModal();
        });

        // Zavření klávesou ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogModal.classList.contains('active')) {
                closeBlogModal();
            }
        });
    }
