document.addEventListener("DOMContentLoaded", () => {
    const sliderWrapper = document.querySelector(".explor-hero-slider");
    const VIEW_DURATION = 4500; 
    const SHRINK_LEAD_TIME = 600; 

    const swiper = new Swiper(".explorSwiper", {
        loop: true,
        speed: 900, 
        allowTouchMove: false,
        effect: "creative",
        creativeEffect: {
            prev: {
                translate: ["-100%", 0, 0],
            },
            next: {
                translate: ["100%", 0, 0],
            },
        },
        autoplay: {
            delay: VIEW_DURATION,
            disableOnInteraction: false,
        },
        on: {
            autoplayTimeLeft(s, time, progress) {
                if (time <= SHRINK_LEAD_TIME && !sliderWrapper.classList.contains("is-shrinking")) {
                    sliderWrapper.classList.add("is-shrinking");
                }
            },
            slideChangeTransitionEnd() {
                setTimeout(() => {
                    sliderWrapper.classList.remove("is-shrinking");
                }, 50);
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all interactive menu blocks
    const megaMenus = document.querySelectorAll(".mega-dropdown-wrapper");

    megaMenus.forEach((menu) => {
        const links = menu.querySelectorAll(".mega-menu-links a[data-mega-img]");
        const targetImg = menu.querySelector(".dynamic-mega-target");

        if (!targetImg) return;

        // Save the default standalone image source when opening panel
        const defaultSrc = targetImg.getAttribute("src");

        links.forEach((link) => {
            link.addEventListener("mouseenter", function () {
                const hoverSrc = this.getAttribute("data-mega-img");
                
                if (hoverSrc && targetImg.getAttribute("src") !== hoverSrc) {
                    // Apply a smooth crossfade effect
                    targetImg.classList.add("image-faded");
                    
                    setTimeout(() => {
                        targetImg.setAttribute("src", hoverSrc);
                        targetImg.classList.remove("image-faded");
                    }, 100);
                }
            });
        });

        // Optional: Reverts back to your default template graphic when mouse completely exits the menu box
        menu.addEventListener("mouseleave", function () {
            targetImg.setAttribute("src", defaultSrc);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll(".trek-destination-item");
    const displayImage = document.querySelector(".trek-dynamic-image");
    const cardHeader = document.querySelector(".trek-card-title");
    const labelDays = document.getElementById("trek-stat-days");
    const labelDiff = document.getElementById("trek-stat-diff");
    
    // Ribbon Elements
    const ribbonDiff = document.getElementById("ribbon-difficulty");
    const ribbonDays = document.getElementById("ribbon-duration");
    const ribbonAlt = document.getElementById("ribbon-altitude");

    listItems.forEach(element => {
        element.addEventListener("mouseenter", function () {
            // Re-apply Active selection states visually
            listItems.forEach(item => item.classList.remove("trek-item-active"));
            this.classList.add("trek-item-active");

            // Extract Custom Dataset Parameters
            const viewSource = this.getAttribute("data-peak-view");
            const headingText = this.getAttribute("data-trek-name");
            const durationVal = this.getAttribute("data-duration");
            const difficultyVal = this.getAttribute("data-level");
            const altitudeVal = this.getAttribute("data-elev");

            // Smooth cross-fade transition overlay trigger
            displayImage.style.filter = "brightness(0.7) contrast(1.1)";
            
            setTimeout(() => {
                displayImage.src = viewSource;
                cardHeader.textContent = headingText;
                labelDays.textContent = durationVal;
                labelDiff.textContent = difficultyVal;

                // Sync side ribbon text layouts safely
                ribbonDiff.textContent = `[${difficultyVal.toUpperCase()}]`;
                ribbonDays.textContent = `[${durationVal.toUpperCase()}]`;
                ribbonAlt.textContent = `[MAX ALT: ${altitudeVal}]`;

                displayImage.style.filter = "brightness(1) contrast(1)";
            }, 150);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const facilityCols = document.querySelectorAll(".adv-facility-col");
    const desktopBg = document.getElementById("advDesktopBg");
    const desktopTitle = document.getElementById("advDesktopMasterTitle");

    let mobileObserver = null;

    function resetLayoutEngine() {
        const isDesktop = window.innerWidth >= 992;

        if (isDesktop) {
            // Disconnect mobile engines if active
            if (mobileObserver) {
                mobileObserver.disconnect();
                mobileObserver = null;
            }
            facilityCols.forEach(col => col.classList.remove("adv-mobile-active"));

            // Bind interactions directly to desktop target elements
            facilityCols.forEach(col => {
                const targets = col.querySelectorAll(".adv-thumb-wrapper, .adv-item-label");
                targets.forEach(target => {
                    target.colContext = col; 
                    target.removeEventListener("mouseenter", handleElementEnter);
                    target.addEventListener("mouseenter", handleElementEnter);
                    // 'mouseleave' listeners are omitted entirely to keep the current state active/sticky
                });
            });
        } else {
            // Strip Inner Desktop Element Listeners
            facilityCols.forEach(col => {
                const targets = col.querySelectorAll(".adv-thumb-wrapper, .adv-item-label");
                targets.forEach(target => {
                    target.removeEventListener("mouseenter", handleElementEnter);
                });
            });

            // Initialize strict unique single element observer for mobile (UNTOUCHED)
            if (!mobileObserver) {
                const observerOptions = {
                    root: null,
                    rootMargin: "-30% 0px -30% 0px",
                    threshold: 0.15
                };

                mobileObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            facilityCols.forEach(c => c.classList.remove("adv-mobile-active"));
                            entry.target.classList.add("adv-mobile-active");
                        }
                    });
                }, observerOptions);

                facilityCols.forEach(col => mobileObserver.observe(col));
            }
        }
    }

    // Strict Element Hover Processing (Switches state and keeps it)
    function handleElementEnter() {
        const parentCol = this.colContext;
        if (!parentCol) return;

        // 1. Remove the active/hovered state from all columns first
        facilityCols.forEach(col => col.classList.remove("adv-element-hovered"));

        // 2. Add the active state exclusively to the newly hovered column
        parentCol.classList.add("adv-element-hovered");

        const targetBg = parentCol.getAttribute("data-bg");
        const targetTitle = parentCol.getAttribute("data-desktop-title");

        // 3. Update main background image
        if (desktopBg && targetBg) {
            desktopBg.style.backgroundImage = `url('${targetBg}')`;
        }

        // 4. Update central master title text smoothly
        if (desktopTitle && targetTitle) {
            desktopTitle.classList.add("is-switching");
            setTimeout(() => {
                desktopTitle.textContent = targetTitle;
                desktopTitle.classList.remove("is-switching");
            }, 180);
        }
    }

    // Initial engine execution
    resetLayoutEngine();

    // Viewport resize monitoring system
    window.addEventListener("resize", () => {
        clearTimeout(window.advResizeTimer);
        window.advResizeTimer = setTimeout(resetLayoutEngine, 150);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const fadeTargets = document.querySelectorAll(".vibe-fade-element");

    const scrollObserverOptions = {
        root: null, // Track viewport window scroll natively
        rootMargin: "0px 0px -10% 0px", // Trigger when cards enter 10% past screen baseline
        threshold: 0.05
    };

    const intersectionFadeEngine = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("vibe-activated");
                observer.unobserve(entry.target); // Disable watch tracking once item has loaded cleanly
            }
        });
    }, scrollObserverOptions);

    fadeTargets.forEach(element => intersectionFadeEngine.observe(element));
});


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".nt-gallery-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // 1. Remove the active class from all cards
      cards.forEach((c) => c.classList.remove("active"));
      
      // 2. Add the active class to the currently hovered card
      card.classList.add("active");
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
        function getLeftOffset() {
            const container = document.querySelector('.container');
            if (!container) return 24;
            const style = window.getComputedStyle(container);
            const paddingLeft = parseFloat(style.paddingLeft) || 0;
            const rect = container.getBoundingClientRect();
            return rect.left + paddingLeft;
        }

        const swiper = new Swiper('.ets-tours-slider', {
            slidesPerView: 1,
            spaceBetween: 28,
            loop: false,
            slidesOffsetBefore: 24, 
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                576: { slidesPerView: 1.3 },
                768: { slidesPerView: 3.2 },
                1200: { slidesPerView: 4 }
            },
            on: {
                init: function () {
                    this.params.slidesOffsetBefore = getLeftOffset();
                    this.update();
                },
                resize: function () {
                    this.params.slidesOffsetBefore = getLeftOffset();
                    this.update();
                }
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const targetGallery = document.getElementById('dynGallery');
        const targetGrid = document.getElementById('dynGrid');

        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('dyn-adv-animate');
                }
            });
        }, { threshold: 0.10 });

        if (targetGallery) animationObserver.observe(targetGallery);
        if (targetGrid) animationObserver.observe(targetGrid);
    });

    const swiper = new Swiper('.tm-swiper', {
      slidesPerView: 1.4,       /* Shows parts of neighboring cards on tiny screens */
      centeredSlides: true,     /* Ensures active card stays dead center */
      loop: true,               /* Endless scrolling carousel */
      spaceBetween: 20,         /* Space between cards */
      
      // Arrow navigation assignments
      navigation: {
        nextEl: '.tm-next',
        prevEl: '.tm-prev',
      },
      
      // Responsive Breakpoints
      breakpoints: {
        576: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 3,     /* Displays exactly 3 items at a time on desktop layout */
          spaceBetween: 40,
        }
      }
    });

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    gsap.to(".cta-capsule-card", {
        width: "100%",
        maxWidth: "100%",
        
        // Flatten ALL corners completely on full expansion
        borderRadius: "0vh",
        
        ease: "none",
        scrollTrigger: {
            trigger: ".cta-scroll-trigger",
            start: "top 80%",       // Adjusted slightly so the 100vh impact is highly visible
            end: "top 0%",          // Reaches full flat width exactly when top touches the view top
            scrub: 1.2              // Smooth fluid track interaction
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Changing the variable name to 'islandHeroSlider' prevents any 'already declared' conflicts
    const islandHeroSlider = new Swiper('.isl-swiper-container', {
      loop: true,
      speed: 1000,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.isl-next-hook',
        prevEl: '.isl-prev-hook',
      },
    });
  });

    document.addEventListener("DOMContentLoaded", () => {
        const footerSection = document.querySelector('.et-ft-wrapper');
        const headerContainer = document.querySelector('.header-container');

        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.15 // Triggers when 15% of the footer is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Add the class to run the animation when scrolling IN
                    headerContainer.classList.add('animate');
                } else {
                    // 2. Remove the class when it scrolls OUT so it can animate again next time!
                    headerContainer.classList.remove('animate');
                }
            });
        }, observerOptions);

        if (footerSection) {
            observer.observe(footerSection);
        }
    });
    

    // This initializes the library and ensures elements NEVER disappear when scrolling past
  AOS.init({
    once: false,      // CRITICAL: Animates only once; will never disappear or reset
    duration: 1000,  // Animation duration in milliseconds
    easing: 'ease-out-cubic',
     mirror: true  
  });

  document.addEventListener("DOMContentLoaded", function () {
    
    // Start AOS for the structural fade-up
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        offset: 100,
        once: false,   // Tells AOS that animations should not happen only once
    mirror: true   // Forces elements to animate out and back in while scrolling past them
    });

    

    // --- Counter Engine ---
    const counters = document.querySelectorAll('.resort-glance-num');
    
    const runCounter = (counter) => {
        const targetAttr = counter.getAttribute('data-target');
        const target = parseInt(targetAttr, 10);
        const hasPercent = targetAttr.includes('%') || counter.textContent.includes('%');
        
        let count = 0;
        const speed = 30; 
        const increment = Math.ceil(target / speed);

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.textContent = count + (hasPercent ? '%' : '');
                setTimeout(updateCount, 30);
            } else {
                counter.textContent = target + (hasPercent ? '%' : '');
            }
        };
        updateCount();
    };

    // Trigger count when scrolled into view
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(c => observer.observe(c));
    } else {
        counters.forEach(c => runCounter(c));
    }
});

