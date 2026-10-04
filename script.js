/* ========================================
   TIMUR FILIMONOV — PORTFOLIO
   Interaction & Animation System
======================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ========================================
       SETTINGS
    ========================================= */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


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



    /* ========================================
       ACCESSIBILITY / FALLBACK
    ========================================= */

    /*
        If the visitor prefers reduced motion,
        or IntersectionObserver is unsupported,
        immediately reveal everything.

        This prevents content from accidentally
        remaining invisible.
    */

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        document
            .querySelectorAll(allAnimatedSelector)
            .forEach((element) => {

                element.classList.add("is-visible");

            });

        return;
    }



    /* ========================================
       STANDARD SCROLL REVEALS
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
                        Each element animates only once.
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
        Used for groups where individual items
        should appear sequentially.

        Current examples:
        - Quick facts
        - Skills
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

                            /*
                                Slight stagger creates hierarchy
                                without making the site feel slow.
                            */

                            const delay =
                                index * 90;


                            window.setTimeout(() => {

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



    /* ========================================
       ACTIVE NAVIGATION
    ========================================= */

    /*
        Highlights the navigation link
        corresponding to the section currently
        being viewed.

        Example:
        When Experience is on screen,
        "Experience" receives .active.
    */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-links a[href^='#']"
        );


    if (
        sections.length > 0 &&
        navLinks.length > 0
    ) {

        const sectionObserver =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const currentSection =
                            entry.target.id;


                        navLinks.forEach((link) => {

                            const destination =
                                link
                                    .getAttribute("href")
                                    .replace("#", "");


                            const isCurrent =
                                destination === currentSection;


                            link.classList.toggle(
                                "active",
                                isCurrent
                            );


                            if (isCurrent) {

                                link.setAttribute(
                                    "aria-current",
                                    "page"
                                );

                            } else {

                                link.removeAttribute(
                                    "aria-current"
                                );

                            }

                        });

                    });

                },

                {
                    /*
                        Creates an imaginary center
                        region of the viewport.

                        A section becomes active when
                        it occupies this area.
                    */

                    rootMargin:
                        "-35% 0px -55% 0px",

                    threshold: 0
                }

            );


        sections.forEach((section) => {

            sectionObserver.observe(section);

        });

    }



    /* ========================================
       INTERNAL LINK SCROLLING
    ========================================= */

    /*
        CSS already provides smooth scrolling.

        This section improves accessibility by
        moving keyboard focus to the destination
        after an internal navigation link is used.
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


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                /*
                    Do not interfere with normal
                    scrolling behavior.

                    We only make the destination
                    programmatically focusable.
                */

                if (
                    !target.hasAttribute("tabindex")
                ) {

                    target.setAttribute(
                        "tabindex",
                        "-1"
                    );

                }

            }
        );

    });



    /* ========================================
       OPTIONAL CURRENT YEAR
    ========================================= */

    /*
        If you later change your footer to:

        <span id="current-year"></span>

        JavaScript will automatically insert
        the current year.

        Nothing happens if the element does
        not exist.
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
