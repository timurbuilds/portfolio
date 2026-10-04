/* ========================================
   TIMUR FILIMONOV — PORTFOLIO
   Interaction & Animation System
   Recruiter Edition
======================================== */


/* ========================================
   ENABLE JAVASCRIPT MODE
======================================== */

/*
   Your HTML should begin with:

   <html lang="en" class="no-js">

   This immediately replaces "no-js" with "js".

   Why:
   CSS only hides reveal elements when
   JavaScript is actually available.

   If JavaScript fails or is disabled,
   important content remains visible.
*/

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");


document.addEventListener("DOMContentLoaded", () => {


    /* ========================================
       SETTINGS
    ========================================= */

    const reducedMotionQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    const revealSelector = [
        ".reveal-up",
        ".reveal-left",
        ".reveal-right",
        ".reveal-project",
        ".reveal-credential"
    ].join(", ");


    const allAnimatedSelector = [
        revealSelector,
        ".reveal-child"
    ].join(", ");


    const supportsIntersectionObserver =
        "IntersectionObserver" in window;



    /* ========================================
       HELPER — REVEAL EVERYTHING
    ========================================= */

    /*
       Used when:
       - reduced motion is enabled
       - IntersectionObserver is unsupported

       This guarantees that portfolio content
       can never remain accidentally invisible.
    */

    const revealEverything = () => {

        document
            .querySelectorAll(allAnimatedSelector)
            .forEach((element) => {

                element.classList.add(
                    "is-visible"
                );

            });

    };



    /* ========================================
       SCROLL REVEAL SYSTEM
    ========================================= */

    if (
        reducedMotionQuery.matches ||
        !supportsIntersectionObserver
    ) {

        revealEverything();

    } else {


        /* ========================================
           STANDARD REVEALS
        ========================================= */

        const revealElements =
            document.querySelectorAll(
                revealSelector
            );


        const revealObserver =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        /*
                           Each element animates
                           only once.
                        */

                        observer.unobserve(
                            entry.target
                        );

                    });

                },

                {
                    threshold: 0.14,

                    rootMargin:
                        "0px 0px -45px 0px"
                }

            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });



        /* ========================================
           STAGGERED GROUPS
        ========================================= */

        /*
           Used for groups such as:

           - Quick Facts
           - Skills

           Each child appears shortly after
           the previous one.
        */

        const staggerGroups =
            document.querySelectorAll(
                ".reveal-stagger"
            );


        const staggerObserver =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const children =
                            entry.target.querySelectorAll(
                                ".reveal-child"
                            );


                        children.forEach(
                            (child, index) => {

                                const delay =
                                    index * 85;


                                window.setTimeout(() => {

                                    /*
                                       Respect a reduced-motion
                                       preference even if it was
                                       changed while the page
                                       was already open.
                                    */

                                    child.classList.add(
                                        "is-visible"
                                    );

                                }, delay);

                            }
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -30px 0px"
                }

            );


        staggerGroups.forEach((group) => {

            staggerObserver.observe(group);

        });

    }



    /* ========================================
       REDUCED MOTION — LIVE CHANGE
    ========================================= */

    /*
       Some operating systems allow the
       accessibility setting to change while
       the browser is already open.

       If that happens, reveal everything
       immediately.
    */

    const handleMotionPreferenceChange =
        (event) => {

            if (event.matches) {

                revealEverything();

            }

        };


    if (
        typeof reducedMotionQuery.addEventListener
        === "function"
    ) {

        reducedMotionQuery.addEventListener(
            "change",
            handleMotionPreferenceChange
        );

    } else if (
        typeof reducedMotionQuery.addListener
        === "function"
    ) {

        /*
           Older Safari fallback.
        */

        reducedMotionQuery.addListener(
            handleMotionPreferenceChange
        );

    }



    /* ========================================
       ACTIVE NAVIGATION
    ========================================= */

    /*
       Highlights the navigation item belonging
       to the section that is currently most
       relevant in the viewport.

       This version is more reliable than simply
       reacting to whichever observer entry
       happened to fire last.
    */

    const sections =
        Array.from(
            document.querySelectorAll(
                "main section[id]"
            )
        );


    const navLinks =
        Array.from(
            document.querySelectorAll(
                '.nav-links a[href^="#"]'
            )
        );


    const navLinkMap =
        new Map();


    navLinks.forEach((link) => {

        const href =
            link.getAttribute("href");


        if (
            href &&
            href.length > 1
        ) {

            navLinkMap.set(
                href.slice(1),
                link
            );

        }

    });



    /* ---------- Active Link Helper ---------- */

    const setActiveNavigation =
        (sectionId) => {

            navLinks.forEach((link) => {

                const destination =
                    link
                        .getAttribute("href")
                        ?.slice(1);


                const isCurrent =
                    destination === sectionId;


                link.classList.toggle(
                    "active",
                    isCurrent
                );


                if (isCurrent) {

                    link.setAttribute(
                        "aria-current",
                        "location"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            });

        };



    if (
        sections.length > 0 &&
        navLinks.length > 0 &&
        supportsIntersectionObserver
    ) {

        const visibleSections =
            new Map();


        const sectionObserver =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            visibleSections.set(
                                entry.target.id,
                                entry.intersectionRatio
                            );

                        } else {

                            visibleSections.delete(
                                entry.target.id
                            );

                        }

                    });


                    /*
                       Find the visible section with
                       the strongest presence inside
                       the observer's active region.
                    */

                    let activeSection = null;
                    let strongestRatio = -1;


                    visibleSections.forEach(
                        (ratio, sectionId) => {

                            if (
                                ratio > strongestRatio &&
                                navLinkMap.has(sectionId)
                            ) {

                                strongestRatio = ratio;
                                activeSection = sectionId;

                            }

                        }
                    );


                    if (activeSection) {

                        setActiveNavigation(
                            activeSection
                        );

                    }

                },

                {
                    /*
                       The center of the screen acts
                       as the active reading zone.
                    */

                    rootMargin:
                        "-30% 0px -55% 0px",

                    threshold: [
                        0,
                        0.15,
                        0.3,
                        0.5,
                        0.75
                    ]
                }

            );


        sections.forEach((section) => {

            /*
               Only observe sections represented
               in the navigation.
            */

            if (
                navLinkMap.has(section.id)
            ) {

                sectionObserver.observe(
                    section
                );

            }

        });

    }



    /* ========================================
       INTERNAL LINK NAVIGATION
    ========================================= */

    /*
       CSS already performs smooth scrolling.

       JavaScript improves keyboard accessibility
       by moving focus to the destination.

       Unlike the previous version, there is no
       arbitrary 400 ms delay.
    */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                let target;


                try {

                    target =
                        document.querySelector(
                            targetId
                        );

                } catch {

                    return;

                }


                if (!target) {
                    return;
                }


                /*
                   Sections normally cannot receive
                   keyboard focus.

                   tabindex="-1" makes this possible
                   without adding them to the normal
                   Tab order.
                */

                if (
                    !target.hasAttribute("tabindex")
                ) {

                    target.setAttribute(
                        "tabindex",
                        "-1"
                    );

                }


                /*
                   Allow the browser to process the
                   anchor navigation first.

                   requestAnimationFrame is cleaner
                   than waiting a fixed 400 ms.
                */

                window.requestAnimationFrame(() => {

                    target.focus({
                        preventScroll: true
                    });

                });


                /*
                   Immediately update navigation
                   feedback after intentional
                   navigation.
                */

                if (
                    navLinkMap.has(target.id)
                ) {

                    setActiveNavigation(
                        target.id
                    );

                }

            }
        );

    });



    /* ========================================
       HEADER SCROLL STATE
    ========================================= */

    /*
       Adds .scrolled to the sticky header
       after the visitor begins scrolling.

       This gives the navigation slightly more
       separation from the page without making
       the header visually heavy.

       Corresponding CSS is provided below.
    */

    const siteHeader =
        document.querySelector(
            ".site-header"
        );


    if (siteHeader) {

        let scrollTicking = false;


        const updateHeaderState = () => {

            siteHeader.classList.toggle(
                "scrolled",
                window.scrollY > 18
            );


            scrollTicking = false;

        };


        const handleScroll = () => {

            if (scrollTicking) {
                return;
            }


            scrollTicking = true;


            window.requestAnimationFrame(
                updateHeaderState
            );

        };


        updateHeaderState();


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );

    }



    /* ========================================
       EXTERNAL LINK SECURITY
    ========================================= */

    /*
       For links opening in a new tab,
       automatically ensure:

       rel="noopener noreferrer"

       This is especially useful for:
       - LinkedIn
       - GitHub
       - Coursera credentials

       Your existing HTML can still contain
       these attributes manually; this simply
       provides a safety net.
    */

    const newTabLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    newTabLinks.forEach((link) => {

        const existingRel =
            link
                .getAttribute("rel")
                ?.split(/\s+/)
                .filter(Boolean) || [];


        const relValues =
            new Set(existingRel);


        relValues.add("noopener");
        relValues.add("noreferrer");


        link.setAttribute(
            "rel",
            Array.from(relValues).join(" ")
        );

    });



    /* ========================================
       HERO ENTRANCE
    ========================================= */

    /*
       Hero entrance animation remains CSS-based.

       JavaScript does NOT animate the hero.

       Your CSS handles:

       .hero-reveal

       This is intentional because the hero is
       already visible when the page loads and
       does not need IntersectionObserver.
    */



    /* ========================================
       CURRENT YEAR
    ========================================= */

    /*
       If your footer contains:

       <span id="current-year"></span>

       the year updates automatically.
    */

    const yearElement =
        document.getElementById(
            "current-year"
        );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

});
