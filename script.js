/* ========================================
   TIMUR FILIMONOV — PORTFOLIO
   Scroll Reveal System
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        ".reveal-up, .reveal-left, .reveal-right, .project-reveal, .credential-reveal"
    );


    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -60px 0px"
        }
    );


    animatedElements.forEach((element) => {
        observer.observe(element);
    });



    /* ========================================
       STAGGERED GROUPS
    ======================================== */

    const groups = document.querySelectorAll(".reveal-group");


    const groupObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                const items =
                    entry.target.querySelectorAll(".reveal-item");


                items.forEach((item, index) => {

                    setTimeout(() => {

                        item.classList.add("is-visible");

                    }, index * 110);

                });


                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.15
        }
    );


    groups.forEach((group) => {
        groupObserver.observe(group);
    });



    /* ========================================
       CREDENTIAL STAGGER
    ======================================== */

    const credentials =
        document.querySelectorAll(".credential-reveal");


    credentials.forEach((credential, index) => {

        credential.style.transitionDelay =
            `${Math.min(index * 80, 240)}ms`;

    });

});
