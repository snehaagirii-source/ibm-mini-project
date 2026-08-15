/* =========================================================
   LOCALFIX
   Frontend JavaScript
   ========================================================= */


/* =========================================================
   01. PAGE READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();
    initializeFlashMessages();
    initializePasswordToggle();
    initializeSearch();
    initializeCategoryFilters();
    initializeBookingForm();
    initializeAnimations();
    initializeImageFallback();
    initializeConfirmButtons();

});


/* =========================================================
   02. MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.querySelector(".mobile-menu-button");

    const navMenu =
        document.querySelector(".nav-menu");


    if (!menuButton || !navMenu) {
        return;
    }


    menuButton.addEventListener("click", function () {

        navMenu.classList.toggle("mobile-active");

        menuButton.classList.toggle("active");

    });


    const navLinks =
        navMenu.querySelectorAll("a");


    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("mobile-active");

            menuButton.classList.remove("active");

        });

    });

}


/* =========================================================
   03. FLASH MESSAGE AUTO CLOSE
   ========================================================= */

function initializeFlashMessages() {

    const flashMessages =
        document.querySelectorAll(".flash-message");


    flashMessages.forEach(function (message) {

        const closeButton =
            message.querySelector(".flash-close");


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    closeFlashMessage(message);

                }
            );

        }


        setTimeout(function () {

            closeFlashMessage(message);

        }, 5000);

    });

}


function closeFlashMessage(message) {

    if (!message) {
        return;
    }


    message.style.opacity = "0";

    message.style.transform =
        "translateX(30px)";


    message.style.transition =
        "opacity 0.3s ease, transform 0.3s ease";


    setTimeout(function () {

        message.remove();

    }, 300);

}


/* =========================================================
   04. PASSWORD VISIBILITY
   ========================================================= */

function initializePasswordToggle() {

    const passwordButtons =
        document.querySelectorAll(
            "[data-password-toggle]"
        );


    passwordButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.getAttribute(
                        "data-password-toggle"
                    );


                const passwordInput =
                    document.getElementById(targetId);


                if (!passwordInput) {
                    return;
                }


                if (
                    passwordInput.type === "password"
                ) {

                    passwordInput.type =
                        "text";

                    button.textContent =
                        "Hide";

                } else {

                    passwordInput.type =
                        "password";

                    button.textContent =
                        "Show";

                }

            }
        );

    });

}


/* =========================================================
   05. PROVIDER SEARCH
   ========================================================= */

function initializeSearch() {

    const searchInput =
        document.querySelector(
            "#providerSearch"
        );


    const providerCards =
        document.querySelectorAll(
            ".service-provider-card"
        );


    const resultsCount =
        document.querySelector(
            "#resultsCount"
        );


    if (!searchInput || providerCards.length === 0) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            let visibleCount = 0;


            providerCards.forEach(function (card) {

                const providerName =
                    card.dataset.name
                        ? card.dataset.name.toLowerCase()
                        : "";


                const providerService =
                    card.dataset.service
                        ? card.dataset.service.toLowerCase()
                        : "";


                const providerLocation =
                    card.dataset.location
                        ? card.dataset.location.toLowerCase()
                        : "";


                const cardText =
                    card.textContent.toLowerCase();


                const matches =
                    providerName.includes(searchValue) ||
                    providerService.includes(searchValue) ||
                    providerLocation.includes(searchValue) ||
                    cardText.includes(searchValue);


                if (matches) {

                    card.style.display =
                        "";

                    visibleCount++;

                } else {

                    card.style.display =
                        "none";

                }

            });


            updateResultsCount(
                visibleCount,
                resultsCount
            );


            showNoResultsMessage(
                visibleCount
            );

        }
    );

}


/* =========================================================
   06. RESULTS COUNT
   ========================================================= */

function updateResultsCount(
    count,
    resultsElement
) {

    if (!resultsElement) {
        return;
    }


    resultsElement.textContent =
        count + (
            count === 1
                ? " provider"
                : " providers"
        );

}


/* =========================================================
   07. NO RESULTS MESSAGE
   ========================================================= */

function showNoResultsMessage(count) {

    let noResults =
        document.querySelector(
            ".js-no-results"
        );


    if (count === 0) {

        if (noResults) {
            noResults.style.display =
                "block";

            return;
        }


        const grid =
            document.querySelector(
                ".restaurant-style-grid"
            );


        if (!grid) {
            return;
        }


        noResults =
            document.createElement("div");


        noResults.className =
            "no-results js-no-results";


        noResults.innerHTML = `

            <div class="no-results-icon">
                ⌕
            </div>

            <h2>
                No providers found
            </h2>

            <p>
                Try searching for another service,
                provider or location.
            </p>

            <button
                type="button"
                class="btn btn-secondary"
                onclick="clearProviderSearch()"
            >
                Clear Search
            </button>

        `;


        grid.appendChild(noResults);


    } else {

        if (noResults) {

            noResults.style.display =
                "none";

        }

    }

}


/* =========================================================
   08. CLEAR SEARCH
   ========================================================= */

function clearProviderSearch() {

    const searchInput =
        document.querySelector(
            "#providerSearch"
        );


    if (searchInput) {

        searchInput.value = "";

        searchInput.dispatchEvent(
            new Event("input")
        );

        searchInput.focus();

    }


    const activeFilter =
        document.querySelector(
            ".filter-chip.active"
        );


    if (activeFilter) {

        document
            .querySelectorAll(".filter-chip")
            .forEach(function (chip) {

                chip.classList.remove(
                    "active"
                );

            });


        const allFilter =
            document.querySelector(
                '[data-category="all"]'
            );


        if (allFilter) {

            allFilter.classList.add(
                "active"
            );

        }

    }

}


/* =========================================================
   09. CATEGORY FILTERS
   ========================================================= */

function initializeCategoryFilters() {

    const filters =
        document.querySelectorAll(
            ".filter-chip"
        );


    const providerCards =
        document.querySelectorAll(
            ".service-provider-card"
        );


    if (
        filters.length === 0 ||
        providerCards.length === 0
    ) {

        return;

    }


    filters.forEach(function (filter) {

        filter.addEventListener(
            "click",
            function () {

                filters.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add(
                    "active"
                );


                const category =
                    filter.dataset.category;


                let visibleCount = 0;


                providerCards.forEach(
                    function (card) {

                        const service =
                            card.dataset.service
                                ? card.dataset.service
                                    .toLowerCase()
                                : "";


                        if (
                            category === "all" ||
                            service.includes(
                                category.toLowerCase()
                            )
                        ) {

                            card.style.display =
                                "";

                            visibleCount++;

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                const searchInput =
                    document.querySelector(
                        "#providerSearch"
                    );


                if (searchInput) {

                    searchInput.value = "";

                }


                const resultsCount =
                    document.querySelector(
                        "#resultsCount"
                    );


                updateResultsCount(
                    visibleCount,
                    resultsCount
                );


                showNoResultsMessage(
                    visibleCount
                );

            }
        );

    });

}


/* =========================================================
   10. SORT PROVIDERS
   ========================================================= */

function sortProviders(sortType) {

    const grid =
        document.querySelector(
            ".restaurant-style-grid"
        );


    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".service-provider-card"
            )
        );


    cards.sort(function (a, b) {

        if (sortType === "rating") {

            const ratingA =
                parseFloat(
                    a.dataset.rating || 0
                );


            const ratingB =
                parseFloat(
                    b.dataset.rating || 0
                );


            return ratingB - ratingA;

        }


        if (sortType === "price-low") {

            const priceA =
                parseFloat(
                    a.dataset.price || 0
                );


            const priceB =
                parseFloat(
                    b.dataset.price || 0
                );


            return priceA - priceB;

        }


        if (sortType === "price-high") {

            const priceA =
                parseFloat(
                    a.dataset.price || 0
                );


            const priceB =
                parseFloat(
                    b.dataset.price || 0
                );


            return priceB - priceA;

        }


        return 0;

    });


    cards.forEach(function (card) {

        grid.appendChild(card);

    });

}


/* =========================================================
   11. BOOKING FORM
   ========================================================= */

function initializeBookingForm() {

    const bookingForm =
        document.querySelector(
            "#bookingForm"
        );


    if (!bookingForm) {
        return;
    }


    const dateInput =
        bookingForm.querySelector(
            'input[type="date"]'
        );


    const timeInput =
        bookingForm.querySelector(
            'input[type="time"]'
        );


    if (dateInput) {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        const todayString =
            `${year}-${month}-${day}`;


        dateInput.min =
            todayString;

    }


    bookingForm.addEventListener(
        "submit",
        function (event) {

            if (
                !validateBookingForm(
                    bookingForm
                )
            ) {

                event.preventDefault();

            }

        }
    );


    if (dateInput) {

        dateInput.addEventListener(
            "change",
            function () {

                validateBookingDate(
                    dateInput
                );

            }
        );

    }


    if (timeInput) {

        timeInput.addEventListener(
            "change",
            function () {

                validateBookingTime(
                    dateInput,
                    timeInput
                );

            }
        );

    }

}


/* =========================================================
   12. BOOKING VALIDATION
   ========================================================= */

function validateBookingForm(form) {

    let valid = true;


    const requiredInputs =
        form.querySelectorAll(
            "[required]"
        );


    requiredInputs.forEach(
        function (input) {

            if (
                !input.value.trim()
            ) {

                markInvalid(
                    input
                );

                valid = false;

            } else {

                clearInvalid(
                    input
                );

            }

        }
    );


    const dateInput =
        form.querySelector(
            'input[type="date"]'
        );


    const timeInput =
        form.querySelector(
            'input[type="time"]'
        );


    if (dateInput) {

        if (
            !validateBookingDate(
                dateInput
            )
        ) {

            valid = false;

        }

    }


    if (
        dateInput &&
        timeInput &&
        dateInput.value &&
        timeInput.value
    ) {

        if (
            !validateBookingTime(
                dateInput,
                timeInput
            )
        ) {

            valid = false;

        }

    }


    if (!valid) {

        showTemporaryNotice(
            "Please check the highlighted fields."
        );

    }


    return valid;

}


/* =========================================================
   13. DATE VALIDATION
   ========================================================= */

function validateBookingDate(
    dateInput
) {

    if (!dateInput.value) {
        return true;
    }


    const selectedDate =
        new Date(
            dateInput.value +
            "T00:00:00"
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if (selectedDate < today) {

        markInvalid(
            dateInput
        );

        return false;

    }


    clearInvalid(
        dateInput
    );


    return true;

}


/* =========================================================
   14. TIME VALIDATION
   ========================================================= */

function validateBookingTime(
    dateInput,
    timeInput
) {

    if (
        !dateInput ||
        !timeInput ||
        !dateInput.value ||
        !timeInput.value
    ) {

        return true;

    }


    const selectedDate =
        new Date(
            dateInput.value +
            "T" +
            timeInput.value
        );


    const now =
        new Date();


    if (
        selectedDate < now
    ) {

        markInvalid(
            timeInput
        );

        showTemporaryNotice(
            "Please select a future time."
        );

        return false;

    }


    clearInvalid(
        timeInput
    );


    return true;

}


/* =========================================================
   15. INPUT ERROR
   ========================================================= */

function markInvalid(input) {

    input.classList.add(
        "input-error"
    );


    input.style.borderColor =
        "rgba(255, 92, 117, 0.65)";


    input.style.boxShadow =
        "0 0 0 3px rgba(255, 92, 117, 0.05)";

}


function clearInvalid(input) {

    input.classList.remove(
        "input-error"
    );


    input.style.borderColor = "";

    input.style.boxShadow = "";

}


/* =========================================================
   16. TEMPORARY NOTICE
   ========================================================= */

function showTemporaryNotice(
    message
) {

    let notice =
        document.querySelector(
            ".js-temporary-notice"
        );


    if (notice) {

        notice.remove();

    }


    notice =
        document.createElement(
            "div"
        );


    notice.className =
        "flash-message flash-error js-temporary-notice";


    notice.innerHTML = `

        <div class="flash-icon">
            !
        </div>

        <div class="flash-text">
            ${message}
        </div>

        <button
            type="button"
            class="flash-close"
        >
            ×
        </button>

    `;


    document.body.appendChild(
        notice
    );


    const closeButton =
        notice.querySelector(
            ".flash-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                closeFlashMessage(
                    notice
                );

            }
        );

    }


    setTimeout(
        function () {

            closeFlashMessage(
                notice
            );

        },
        4000
    );

}


/* =========================================================
   17. IMAGE FALLBACK
   ========================================================= */

function initializeImageFallback() {

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(function (image) {

        image.addEventListener(
            "error",
            function () {

                image.style.display =
                    "none";


                const parent =
                    image.parentElement;


                if (
                    parent &&
                    !parent.querySelector(
                        ".image-error-placeholder"
                    )
                ) {

                    const placeholder =
                        document.createElement(
                            "div"
                        );


                    placeholder.className =
                        "image-error-placeholder";


                    placeholder.style.cssText = `
                        width: 100%;
                        height: 100%;
                        min-height: 150px;
                        display: grid;
                        place-items: center;
                        background:
                            linear-gradient(
                                135deg,
                                #101e2c,
                                #18102b
                            );
                        color: #42f5e9;
                        font-size: 3rem;
                    `;


                    placeholder.innerHTML =
                        "✦";


                    parent.appendChild(
                        placeholder
                    );

                }

            }
        );

    });

}


/* =========================================================
   18. CONFIRM BUTTONS
   ========================================================= */

function initializeConfirmButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-confirm]"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                const message =
                    button.dataset.confirm ||
                    "Are you sure you want to continue?";


                const confirmed =
                    window.confirm(
                        message
                    );


                if (!confirmed) {

                    event.preventDefault();

                }

            }
        );

    });

}


/* =========================================================
   19. SMOOTH SCROLL
   ========================================================= */

function initializeSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


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


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =========================================================
   20. SCROLL ANIMATIONS
   ========================================================= */

function initializeAnimations() {

    const animatedElements =
        document.querySelectorAll(
            ".category-card, " +
            ".service-provider-card, " +
            ".step-card, " +
            ".booking-item, " +
            ".admin-stat-card"
        );


    if (
        animatedElements.length === 0
    ) {

        return;

    }


    if (
        !("IntersectionObserver" in window)
    ) {

        animatedElements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    animatedElements.forEach(
        function (element) {

            element.classList.add(
                "scroll-hidden"
            );

        }
    );


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.remove(
                                "scroll-hidden"
                            );


                            entry.target.classList.add(
                                "scroll-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.1
            }
        );


    animatedElements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   21. PROVIDER CARD HOVER
   ========================================================= */

function initializeProviderCardEffects() {

    const cards =
        document.querySelectorAll(
            ".service-provider-card"
        );


    cards.forEach(function (card) {

        card.addEventListener(
            "mouseenter",
            function () {

                card.style.setProperty(
                    "--card-glow",
                    "1"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            function () {

                card.style.setProperty(
                    "--card-glow",
                    "0"
                );

            }
        );

    });

}


/* =========================================================
   22. COPY PHONE NUMBER
   ========================================================= */

function copyText(text) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .then(function () {

                showTemporaryNotice(
                    "Copied successfully."
                );

            })
            .catch(function () {

                fallbackCopyText(text);

            });

    } else {

        fallbackCopyText(text);

    }

}


function fallbackCopyText(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value = text;

    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-999999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showTemporaryNotice(
            "Copied successfully."
        );

    } catch (error) {

        showTemporaryNotice(
            "Unable to copy."
        );

    }


    textarea.remove();

}


/* =========================================================
   23. BOOKING PRICE PREVIEW
   ========================================================= */

function updateBookingPrice() {

    const priceElement =
        document.querySelector(
            "[data-provider-price]"
        );


    const totalElement =
        document.querySelector(
            "[data-booking-total]"
        );


    if (
        !priceElement ||
        !totalElement
    ) {

        return;

    }


    const price =
        parseFloat(
            priceElement.dataset.providerPrice ||
            priceElement.textContent.replace(
                /[^0-9.]/g,
                ""
            )
        );


    if (
        Number.isNaN(price)
    ) {

        return;

    }


    totalElement.textContent =
        "₹" +
        price.toLocaleString(
            "en-IN"
        );

}


/* =========================================================
   24. ADMIN DASHBOARD
   ========================================================= */

function initializeAdminDashboard() {

    const adminSearch =
        document.querySelector(
            "#adminSearch"
        );


    const adminItems =
        document.querySelectorAll(
            ".admin-provider-item"
        );


    if (
        !adminSearch ||
        adminItems.length === 0
    ) {

        return;

    }


    adminSearch.addEventListener(
        "input",
        function () {

            const value =
                adminSearch.value
                    .toLowerCase()
                    .trim();


            adminItems.forEach(
                function (item) {

                    const text =
                        item.textContent
                            .toLowerCase();


                    if (
                        text.includes(value)
                    ) {

                        item.style.display =
                            "";

                    } else {

                        item.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =========================================================
   25. WINDOW SCROLL EFFECT
   ========================================================= */

function initializeNavbarScroll() {

    const header =
        document.querySelector(
            ".site-header"
        );


    if (!header) {
        return;
    }


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 20
            ) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}


/* =========================================================
   26. PROVIDER CARD KEYBOARD ACCESS
   ========================================================= */

function initializeKeyboardNavigation() {

    const cards =
        document.querySelectorAll(
            ".service-provider-card"
        );


    cards.forEach(function (card) {

        card.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    const link =
                        card.querySelector(
                            "a"
                        );


                    if (link) {

                        event.preventDefault();

                        link.click();

                    }

                }

            }
        );

    });

}


/* =========================================================
   27. PREVENT DOUBLE BOOKING SUBMIT
   ========================================================= */

function preventDoubleSubmit() {

    const forms =
        document.querySelectorAll(
            "form"
        );


    forms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function () {

                const submitButton =
                    form.querySelector(
                        'button[type="submit"]'
                    );


                if (!submitButton) {
                    return;
                }


                if (
                    submitButton.dataset.submitted ===
                    "true"
                ) {

                    return;

                }


                submitButton.dataset.submitted =
                    "true";


                const originalText =
                    submitButton.innerHTML;


                submitButton.dataset.originalText =
                    originalText;


                submitButton.innerHTML =
                    `
                    <span>
                        Processing...
                    </span>
                    `;


                submitButton.style.opacity =
                    "0.7";


                submitButton.style.pointerEvents =
                    "none";

            }
        );

    });

}


/* =========================================================
   28. INITIALIZE EXTRA FEATURES
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeSmoothScroll();

        initializeProviderCardEffects();

        initializeAdminDashboard();

        initializeNavbarScroll();

        initializeKeyboardNavigation();

        preventDoubleSubmit();

        updateBookingPrice();

    }
);


/* =========================================================
   29. GLOBAL HELPERS
   ========================================================= */

window.clearProviderSearch =
    clearProviderSearch;

window.sortProviders =
    sortProviders;

window.copyText =
    copyText;

window.updateBookingPrice =
    updateBookingPrice;


/* =========================================================
   END OF LOCALFIX JAVASCRIPT
   ========================================================= */