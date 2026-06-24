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