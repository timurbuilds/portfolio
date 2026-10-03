/* ========================================
   TIMUR FILIMONOV — PORTFOLIO
   Scroll Animation System
======================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ========================================
       ACCESSIBILITY CHECK
    ========================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        document
            .querySelectorAll(
                ".reveal-up, " +
                ".reveal-left, " +
                ".reveal-right, " +
                ".reveal-project, " +
                ".reveal-credential, " +
                ".reveal-child"
            )
            .forEach((element) => {

                element.classList.add("is-visible");

            });

        return;
    }


    /* ========================================
       NORMAL SCROLL REVEALS
    ========================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal-up, " +
            ".reveal-left, " +
            ".reveal-right, " +
            ".reveal-project, " +
            ".reveal-credential"
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
                        Stop observing after the
                        animation has happened once.
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

       Used for:
       - Quick facts
       - Skills
    ========================================= */

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

                            setTimeout(() => {

                                child.classList.add(
                                    "is-visible"
                                );

                            }, index * 100);

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

});
