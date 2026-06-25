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

    let defaultBg = desktopBg ? desktopBg.style.backgroundImage : "";
    const defaultTitle = "ACTIVITIES";
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

            // Bind desktop hover states
            facilityCols.forEach(col => {
                col.removeEventListener("mouseenter", handleDesktopEnter);
                col.removeEventListener("mouseleave", handleDesktopLeave);
                col.addEventListener("mouseenter", handleDesktopEnter);
                col.addEventListener("mouseleave", handleDesktopLeave);
            });
        } else {
            // Strip Desktop Listeners
            facilityCols.forEach(col => {
                col.removeEventListener("mouseenter", handleDesktopEnter);
                col.removeEventListener("mouseleave", handleDesktopLeave);
            });

            // Initialize strict unique single element observer for mobile
            if (!mobileObserver) {
                const observerOptions = {
                    root: null,
                    rootMargin: "-30% 0px -30% 0px", // Limits trigger zone cleanly to screen center strip
                    threshold: 0.15
                };

                mobileObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Strip any active states from other elements
                            facilityCols.forEach(c => c.classList.remove("adv-mobile-active"));
                            // Apply exclusively to the current visible section
                            entry.target.classList.add("adv-mobile-active");
                        }
                    });
                }, observerOptions);

                facilityCols.forEach(col => mobileObserver.observe(col));
            }
        }
    }

    // Desktop hover processing functions
    function handleDesktopEnter() {
        const targetBg = this.getAttribute("data-bg");
        const targetTitle = this.getAttribute("data-desktop-title");

        if (desktopBg && targetBg) {
            desktopBg.style.backgroundImage = `url('${targetBg}')`;
        }

        if (desktopTitle && targetTitle) {
            desktopTitle.classList.add("is-switching");
            setTimeout(() => {
                desktopTitle.textContent = targetTitle;
                desktopTitle.classList.remove("is-switching");
            }, 180);
        }
    }

    function handleDesktopLeave() {
        if (desktopBg) {
            desktopBg.style.backgroundImage = defaultBg;
        }

        if (desktopTitle) {
            desktopTitle.classList.add("is-switching");
            setTimeout(() => {
                desktopTitle.textContent = defaultTitle;
                desktopTitle.classList.remove("is-switching");
            }, 180);
        }
    }

    // Initial setup running
    resetLayoutEngine();

    // Viewport watch monitoring system
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

    