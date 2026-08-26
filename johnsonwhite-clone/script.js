document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    let preloaderDone = false;

    function hidePreloader() {
        if (preloaderDone) return;
        preloaderDone = true;
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Lock scroll while preloader is visible
    document.body.style.overflow = 'hidden';

    // Animate progress bar
    let progress = 0;
    const barInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(barInterval);
        }
        if (preloaderBar) preloaderBar.style.width = progress + '%';
    }, 200);

    // Hide when page fully loads
    window.addEventListener('load', () => {
        progress = 100;
        if (preloaderBar) preloaderBar.style.width = '100%';
        clearInterval(barInterval);
        setTimeout(hidePreloader, 600);
    });

    // Fallback — hide after 4s no matter what
    setTimeout(hidePreloader, 4000);

    // ===== CUSTOM CURSOR (desktop) =====
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');

    if (window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        document.querySelectorAll('a, button, .service-card, .blog-card, .cert-card, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    }

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    let overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) toggleMenu();
        });
    });

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        header.classList.toggle('scrolled', scrolled);
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = nav.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            update();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.about-stats-bar');
    if (statsBar) statsObserver.observe(statsBar);

    // ===== FADE-IN ANIMATIONS =====
    const fadeElements = document.querySelectorAll(
        '.service-card, .step-card, .blog-card, .cert-card, .contact-card, .about-feature, .stat-item, .testimonial-card'
    );
    fadeElements.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const progressBar = document.getElementById('heroProgress');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 6000;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetProgress();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function resetProgress() {
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    progressBar.style.transition = 'width ' + slideDuration + 'ms linear';
                    progressBar.style.width = '100%';
                });
            });
        }
    }

    function startAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
        resetProgress();
    }

    if (dots.length) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                goToSlide(parseInt(dot.dataset.slide));
                startAutoPlay();
            });
        });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
        if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
    });

    // Touch swipe
    let touchStartX = 0;
    const heroEl = document.querySelector('.hero-slider');
    if (heroEl) {
        heroEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        heroEl.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
                startAutoPlay();
            }
        }, { passive: true });
    }

    startAutoPlay();

    // ===== HERO CANVAS (animated particles) =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 174, 238, ${this.opacity})`;
                ctx.fill();
            }
        }

        const count = Math.min(80, Math.floor((w * h) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 174, 238, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const bookingForm = document.getElementById('bookingForm');
    const successPopup = document.getElementById('successPopup');
    const successClose = document.getElementById('successPopupClose');

    // Contact tabs
    document.querySelectorAll('.contact-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.modern-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            const form = document.querySelector(`.modern-form[data-form="${tab.dataset.tab}"]`);
            if (form) form.classList.add('active');
        });
    });

    // Set min date for booking
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date().toISOString().split('T')[0];
        bookingDate.setAttribute('min', today);
    }

    function showSuccessPopup() {
        successPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSuccessPopup() {
        successPopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    successClose.addEventListener('click', closeSuccessPopup);
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) closeSuccessPopup();
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = new FormData(contactForm);

        fetch('https://formsubmit.co/ajax/jwhite0556@gmail.com', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                btn.innerHTML = '<span>Sent!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
                contactForm.reset();

                setTimeout(() => {
                    showSuccessPopup();
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 800);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(() => {
            btn.innerHTML = '<span>Error - Try Again</span><i class="fas fa-exclamation-triangle"></i>';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });

    // ===== BOOKING FORM =====
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Booking...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(bookingForm);

            fetch('https://formsubmit.co/ajax/jwhite0556@gmail.com', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = '<span>Booked!</span><i class="fas fa-check"></i>';
                    btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
                    bookingForm.reset();

                    setTimeout(() => {
                        showSuccessPopup();
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 800);
                } else {
                    throw new Error('Booking submission failed');
                }
            })
            .catch(() => {
                btn.innerHTML = '<span>Error - Try Again</span><i class="fas fa-exclamation-triangle"></i>';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===== TILT EFFECT ON SERVICE CARDS =====
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===== BLOG MODAL =====
    const modal = document.getElementById('blogModal');
    const modalClose = document.getElementById('blogModalClose');
    const modalTag = document.getElementById('blogModalTag');
    const modalTitle = document.getElementById('blogModalTitle');
    const modalDate = document.getElementById('blogModalDate');
    const modalReadTime = document.getElementById('blogModalReadTime');
    const modalBody = document.getElementById('blogModalBody');
    const modalHero = document.getElementById('blogModalHero');
    const modalHeroIcon = document.getElementById('blogModalHeroIcon');
    const modalDateOverlay = document.getElementById('blogModalDateOverlay');

    function openBlogModal(id) {
        const blog = blogData[id];
        if (!blog) return;

        // Hero
        modalHero.style.background = blog.gradient;
        modalHeroIcon.innerHTML = '<i class="' + blog.icon + '"></i>';
        modalDateOverlay.textContent = blog.date;

        // Header
        modalTag.textContent = blog.tag;
        modalTitle.textContent = blog.title;
        modalDate.innerHTML = '<i class="fas fa-calendar-alt"></i> ' + blog.date;
        modalReadTime.innerHTML = '<i class="fas fa-clock"></i> ' + blog.readTime;
        modalBody.innerHTML = blog.content;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset scroll
        var scrollEl = modal.querySelector('.blog-modal-scroll');
        if (scrollEl) scrollEl.scrollTop = 0;
    }

    function closeBlogModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click on blog card
    document.querySelectorAll('.blog-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't open if clicking a link
            if (e.target.closest('.read-more')) {
                e.preventDefault();
            }
            const id = card.getAttribute('data-blog');
            openBlogModal(id);
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeBlogModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBlogModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeBlogModal();
        }
    });

    // ===== SERVICE WORKER REGISTRATION =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }

    // ===== LAZY LOADING IMAGES =====
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});
