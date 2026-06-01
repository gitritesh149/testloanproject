document.addEventListener("DOMContentLoaded", function () {
  // --- 1. ACTIVE LINK PARSER & DROPDOWN HIGHLIGHTS ---
  const currentPath = window.location.pathname;
  const allNavLinks = document.querySelectorAll(".nav-links a");

  // Helper function to clear current active page styles from text links
  function clearActiveNavStates() {
    allNavLinks.forEach((link) => {
      link.parentElement.classList.remove("current-page");
      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) parentDropdown.classList.remove("current-page");
    });
  }

  // Initial load path checker
  allNavLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    if (
      linkHref &&
      linkHref !== "#" &&
      linkHref !== "index.html" &&
      currentPath.includes(linkHref)
    ) {
      if (link.closest(".dropdown-menu")) {
        link.classList.add("active-sublink");
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          parentDropdown.classList.add("current-page");
        }
      } else {
        link.parentElement.classList.add("current-page");
      }
    }
  });

  // Dynamic Same-Page Anchor Click Event Listener Handlers
  allNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const hrefAttr = this.getAttribute("href");

      // Process logic if link targets an ID on the current single-page layout structure
      if (
        hrefAttr &&
        (hrefAttr.includes("#about") ||
          hrefAttr.includes("#contact") ||
          hrefAttr.includes("#offerings"))
      ) {
        clearActiveNavStates();

        // If it's a dropdown trigger on desktop, don't prevent default so it jumps to the section
        if (
          this.classList.contains("dropdown-trigger") &&
          window.innerWidth > 768
        ) {
          // Let the browser jump naturally to #offerings
          this.parentElement.classList.add("current-page");
        } else if (!this.classList.contains("dropdown-trigger")) {
          this.parentElement.classList.add("current-page");
        }

        // For smoother mobile usage, close mobile layout slide overlay upon selection
        if (navLinksContainer.classList.contains("active")) {
          navLinksContainer.classList.remove("active");
        }
      }
    });
  });

  if (currentPath === "/" || currentPath.endsWith("index.html")) {
    // If there's an active hash on fresh entry execution (e.g. index.html#about)
    const initialHash = window.location.hash;
    let matchedAnchor = false;

    if (initialHash) {
      const hashLink = document.querySelector(
        `.nav-links a[href*="${initialHash}"]`,
      );
      if (hashLink) {
        hashLink.parentElement.classList.add("current-page");
        matchedAnchor = true;
      }
    }

    // Fallback default back to Home highlight if no internal section target anchors are matched
    if (!matchedAnchor) {
      const homeLink = document.querySelector(
        '.nav-links a[href="index.html"]',
      );
      if (homeLink) homeLink.parentElement.classList.add("current-page");
    }
  }

  // Dynamic Same-Page Anchor Click Event Listener Handlers
  allNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const hrefAttr = this.getAttribute("href");

      // Process logic if link targets an ID on the current single-page layout structure
      if (
        hrefAttr &&
        (hrefAttr.includes("#about") || hrefAttr.includes("#contact"))
      ) {
        clearActiveNavStates();
        this.parentElement.classList.add("current-page");

        // For smoother mobile usage, close mobile layout slide overlay upon selection
        if (navLinksContainer.classList.contains("active")) {
          navLinksContainer.classList.remove("active");
        }
      }
    });
  });

  // --- 2. MOBILE HAMBURGER AND COLLAPSIBLE TRIGGERS ---
  // const mobileMenuBtn = document.getElementById("mobile-menu");
  // const navLinksContainer = document.querySelector(".nav-links");
  // const dropdownWrapper = document.getElementById("offerings-dropdown");

  // if (mobileMenuBtn) {
  //     mobileMenuBtn.addEventListener("click", function () {
  //         navLinksContainer.classList.toggle("active");
  //     });
  // }

  // if (dropdownWrapper) {
  //     dropdownWrapper.addEventListener("click", function (e) {
  //         if (window.innerWidth <= 768 && e.target.classList.contains("dropdown-trigger")) {
  //             e.preventDefault();
  //             dropdownWrapper.classList.toggle("open");
  //         }
  //     });
  // }

  // --- 2. MOBILE HAMBURGER AND COLLAPSIBLE TRIGGERS ---
  const mobileMenuBtn = document.getElementById("mobile-menu");
  const navLinksContainer = document.querySelector(".nav-links");
  const dropdownWrapper = document.getElementById("offerings-dropdown");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinksContainer.classList.toggle("active");
    });
  }

  if (dropdownWrapper) {
    dropdownWrapper.addEventListener("click", function (e) {
      // Run this logic only on mobile viewports
      if (window.innerWidth <= 768) {
        const trigger = e.target.closest(".dropdown-trigger");

        if (trigger) {
          // If the dropdown menu is NOT open yet, open it first and stay on screen
          if (!dropdownWrapper.classList.contains("open")) {
            e.preventDefault(); // Stop it from jumping down instantly
            dropdownWrapper.classList.add("open");
          } else {
            // If it's already open and they tap it again, let it navigate to #offerings
            // Close the mobile navigation drawer beautifully as they scroll down
            if (navLinksContainer.classList.contains("active")) {
              navLinksContainer.classList.remove("active");
            }
            dropdownWrapper.classList.remove("open");
          }
        }
      }
    });
  }
  // --- 3. HERO IMAGE CAROUSEL AUTO-ANIMATION ENGINE ---
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  let activeSlideIndex = 0;
  const slideIntervalDuration = 5000;

  function progressCarousel() {
    if (carouselSlides.length === 0) return;
    carouselSlides[activeSlideIndex].classList.remove("active");
    activeSlideIndex = (activeSlideIndex + 1) % carouselSlides.length;
    carouselSlides[activeSlideIndex].classList.add("active");
  }

  if (carouselSlides.length > 0) {
    setInterval(progressCarousel, slideIntervalDuration);
  }

  // --- 4. FORM ASYNCHRONOUS SUBMISSION PIPELINE (AJAX) ---
  const contactForm = document.getElementById("loanContactForm");
  const formResponseMsg = document.getElementById("formResponse");
  const submitButton = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Lock browser page redirect execution

      // Interface Loading State adjustments
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = "Processing Submission...";
      }
      formResponseMsg.style.color = "var(--secondary-color)";
      formResponseMsg.innerText = "Sending request securely, please wait...";

      const formDataObject = new FormData(contactForm);

      // Perform asynchronous request execution via Fetch API
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObject,
        headers: {
          Accept: "application/json",
        },
      })
        .then(async (response) => {
          let serverOutput = await response.json();
          if (response.status === 200) {
            // Success state block execution
            formResponseMsg.style.color = "#16a34a"; // Balanced green color hex
            formResponseMsg.innerText =
              "Thank you! Your request was received cleanly. An advisor will contact you shortly.";
            contactForm.reset();
          } else {
            // Operational error block state context
            console.log(response);
            formResponseMsg.style.color = "#dc2626"; // Balanced standard red color hex
            formResponseMsg.innerText =
              serverOutput.message ||
              "An operational interface timeout occurred. Please retry.";
          }
        })
        .catch((error) => {
          // Hard hardware or connection failure baseline response
          console.error(error);
          formResponseMsg.style.color = "#dc2626";
          formResponseMsg.innerText =
            "Network transmission failed. Please confirm active internet connectivity and submit again.";
        })
        .finally(() => {
          // Restoring core submission controls functionality
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerText = "Submit Request";
          }
        });
    });
  }
});
