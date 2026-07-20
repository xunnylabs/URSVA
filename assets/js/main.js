const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector(".contact-form");

const isPagesPath = window.location.pathname.includes("/pages/");
const linkPrefix = isPagesPath ? "" : "pages/";
const homeHref = isPagesPath ? "../index.html" : "index.html";
const pageLinks = [
  { label: "Home", href: homeHref, key: "home" },
  { label: "Services", href: `${linkPrefix}services.html`, key: "services" },
  { label: "Resources", href: `${linkPrefix}blog.html`, key: "resources" },
  { label: "About", href: `${linkPrefix}about.html`, key: "about" },
];

const getActivePageKey = () => {
  const path = window.location.pathname;

  if (path.includes("services.html")) return "services";
  if (path.includes("how-it-works.html")) return "services";
  if (path.includes("pricing.html")) return "services";
  if (path.includes("blog.html")) return "resources";
  if (path.includes("faq.html")) return "resources";
  if (path.includes("testimonials.html")) return "resources";
  if (path.includes("about.html")) return "about";
  if (path.includes("contact.html")) return "about";
  return "home";
};

const floatingNav = document.createElement("div");
floatingNav.className = "floating-nav";
floatingNav.innerHTML = `
  <div class="floating-nav-panel" id="floatingNavPanel">
    ${pageLinks
      .map(
        (link) =>
          `<a href="${link.href}" class="${link.key === getActivePageKey() ? "is-active" : ""}">${link.label}</a>`
      )
      .join("")}
    <a class="floating-nav-cta" href="${linkPrefix}contact.html">Book Consultation</a>
  </div>
  <button class="floating-nav-toggle" type="button" aria-expanded="false" aria-controls="floatingNavPanel">
    <span>Menu</span>
    <span class="floating-nav-icon" aria-hidden="true"><span></span><span></span><span></span></span>
  </button>
`;

document.body.appendChild(floatingNav);

const floatingToggle = floatingNav.querySelector(".floating-nav-toggle");
const floatingPanel = floatingNav.querySelector(".floating-nav-panel");

const setFloatingNavOpen = (isOpen) => {
  floatingNav.classList.toggle("is-open", isOpen);
  floatingToggle?.setAttribute("aria-expanded", String(isOpen));

  if (floatingPanel) {
    floatingPanel.style.setProperty("opacity", isOpen ? "1" : "0", "important");
    floatingPanel.style.setProperty("transform", isOpen ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)", "important");
    floatingPanel.style.setProperty("pointer-events", isOpen ? "auto" : "none", "important");
  }
};

if (floatingToggle) {
  floatingToggle.addEventListener("click", () => {
    setFloatingNavOpen(!floatingNav.classList.contains("is-open"));
  });
}

document.addEventListener("click", (event) => {
  if (!floatingNav.contains(event.target)) {
    setFloatingNavOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setFloatingNavOpen(false);
  }
});

document.querySelectorAll("[data-animated-heading]").forEach((heading) => {
  const text = heading.dataset.headingLines || heading.textContent || "";
  const fragment = document.createDocumentFragment();
  let index = 0;

  text.split("|").forEach((line, lineIndex, lines) => {
    const lineElement = document.createElement("span");
    lineElement.className = "heading-line";

    Array.from(line).forEach((char) => {
      const character = document.createElement("span");
      character.className = "char";
      character.style.setProperty("--char-index", index);
      character.textContent = char === " " ? "\u00a0" : char;
      lineElement.appendChild(character);
      index += 1;
    });

    fragment.appendChild(lineElement);

    if (lineIndex < lines.length - 1) {
      index += 1;
    }
  });

  heading.textContent = "";
  heading.appendChild(fragment);

  window.setTimeout(() => {
    heading.classList.add("is-visible");
  }, 80);
});

document.querySelectorAll("[data-hero-tabs]").forEach((tabGroup) => {
  const tabs = Array.from(tabGroup.querySelectorAll("[data-hero-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-hero-panel]"));
  const tabOrder = tabs.map((tab) => tab.dataset.heroTab);
  let activeIndex = Math.max(0, tabOrder.indexOf(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.heroTab));
  let autoCycle;

  const activateTab = (key) => {
    activeIndex = Math.max(0, tabOrder.indexOf(key));

    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.heroTab === key);
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.heroPanel === key);
    });
  };

  const startAutoCycle = () => {
    window.clearInterval(autoCycle);
    autoCycle = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % tabOrder.length;
      activateTab(tabOrder[activeIndex]);
    }, 4000);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.heroTab);
      startAutoCycle();
    });
  });

  if (tabOrder.length) {
    activateTab(tabOrder[activeIndex]);
    startAutoCycle();
  }
});

const scrollHeroStages = Array.from(document.querySelectorAll("[data-scroll-hero]"));

if (scrollHeroStages.length) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let scrollFrame;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);

  const updateScrollHero = () => {
    scrollFrame = undefined;

    scrollHeroStages.forEach((stage) => {
      const hero = stage.closest(".stellar-hero");

      if (!hero) {
        return;
      }

      if (prefersReducedMotion) {
        hero.style.setProperty("--hero-image-opacity", "1");
        hero.style.setProperty("--hero-image-y", "0px");
        hero.style.setProperty("--hero-image-scale", "1");
        hero.style.setProperty("--hero-caption-opacity", "1");
        hero.style.setProperty("--hero-caption-y", "0px");
        return;
      }

      const heroStart = hero.offsetTop;
      const viewport = window.innerHeight || 1;
      const rawProgress = clamp((window.scrollY - heroStart) / (viewport * 0.58), 0, 1);
      const imageProgress = easeOut(rawProgress);
      const captionProgress = easeOut(clamp((rawProgress - 0.34) / 0.66, 0, 1));

      hero.style.setProperty("--hero-image-opacity", String(clamp(rawProgress * 1.2, 0, 1)));
      hero.style.setProperty("--hero-image-y", `${Math.round((1 - imageProgress) * 70)}px`);
      hero.style.setProperty("--hero-image-scale", String(0.96 + imageProgress * 0.04));
      hero.style.setProperty("--hero-caption-opacity", String(captionProgress));
      hero.style.setProperty("--hero-caption-y", `${Math.round((1 - captionProgress) * 24)}px`);
    });
  };

  const requestScrollHeroUpdate = () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(updateScrollHero);
  };

  updateScrollHero();
  window.addEventListener("scroll", requestScrollHeroUpdate, { passive: true });
  window.addEventListener("resize", requestScrollHeroUpdate);
}

document.querySelectorAll(".nav-dropdown").forEach((menu) => {
  let closeTimer;
  const trigger = menu.querySelector(".nav-link");

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    document.querySelectorAll(".nav-dropdown").forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.classList.remove("menu-open", "menu-locked");
      }
    });
    menu.classList.add("menu-open");
  };

  const scheduleClose = () => {
    if (menu.classList.contains("menu-locked")) {
      return;
    }

    window.clearTimeout(closeTimer);
    menu.classList.remove("menu-open");
  };

  const closeMenu = () => {
    window.clearTimeout(closeTimer);
    menu.classList.remove("menu-open", "menu-locked");
  };

  menu.addEventListener("pointerenter", () => {
    openMenu();
  });

  menu.addEventListener("pointerleave", () => {
    scheduleClose();
  });

  menu.addEventListener("focusin", () => {
    openMenu();
  });

  menu.addEventListener("focusout", () => {
    scheduleClose();
  });

  const megaMenu = menu.querySelector(".mega-menu");
  if (megaMenu) {
    megaMenu.addEventListener("pointerenter", openMenu);
    megaMenu.addEventListener("pointerleave", scheduleClose);
  }

  if (trigger) {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      window.clearTimeout(closeTimer);
      const shouldLock = !menu.classList.contains("menu-locked");

      document.querySelectorAll(".nav-dropdown").forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.remove("menu-open", "menu-locked");
        }
      });

      menu.classList.toggle("menu-locked", shouldLock);
      menu.classList.toggle("menu-open", shouldLock);
    });
  }

  menu.querySelectorAll(".mega-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".nav-dropdown.menu-locked").forEach((menu) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("menu-open", "menu-locked");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".nav-dropdown").forEach((menu) => {
      menu.classList.remove("menu-open", "menu-locked");
    });
  }
});

document.querySelectorAll(".spotlight-border").forEach((card) => {
  card.addEventListener("pointerenter", () => {
    card.classList.add("is-hovering");
  });

  card.addEventListener("pointermove", (event) => {
    card.classList.add("is-hovering");
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-hovering");
    card.style.setProperty("--spot-x", "-9999px");
    card.style.setProperty("--spot-y", "-9999px");
  });
});

document.querySelectorAll(".pricing-button, .mega-service-link, .hero .button").forEach((element) => {
  element.addEventListener("pointerenter", () => {
    element.classList.add("is-hovering");
  });

  element.addEventListener("pointermove", (event) => {
    element.classList.add("is-hovering");

    if (element.classList.contains("mega-service-link")) {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    }
  });

  element.addEventListener("pointerleave", () => {
    element.classList.remove("is-hovering");
    element.style.removeProperty("--glow-x");
    element.style.removeProperty("--glow-y");
  });
});

const fadeUpElements = document.querySelectorAll(".fade-up");

if ("IntersectionObserver" in window) {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  fadeUpElements.forEach((element) => fadeObserver.observe(element));

  window.setTimeout(() => {
    fadeUpElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (isInView) {
        element.classList.add("is-visible");
        fadeObserver.unobserve(element);
      }
    });
  }, 120);
} else {
  fadeUpElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-interactive-onboarding]").forEach((section) => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = Array.from(section.querySelectorAll(".onboarding-step"));
  const visuals = Array.from(section.querySelectorAll(".onboarding-visual"));

  if (!prefersReducedMotion) {
    section.classList.add("is-animated");

    const revealVisibleSteps = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;

      steps.forEach((step) => {
        if (step.classList.contains("is-visible")) {
          return;
        }

        const rect = step.getBoundingClientRect();
        const isVisible = rect.top < viewportHeight * 0.86 && rect.bottom > viewportHeight * 0.08;

        if (isVisible) {
          step.classList.add("is-visible");
        }
      });
    };

    if ("IntersectionObserver" in window) {
      const stepObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              stepObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
      );

      steps.forEach((step, index) => {
        step.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
        stepObserver.observe(step);
      });
    } else {
      steps.forEach((step) => step.classList.add("is-visible"));
    }

    revealVisibleSteps();
    window.addEventListener("scroll", revealVisibleSteps, { passive: true });
    window.addEventListener("resize", revealVisibleSteps);
  } else {
    steps.forEach((step) => step.classList.add("is-visible"));
  }

  visuals.forEach((visual) => {
    let rafId;

    const resetTilt = () => {
      visual.classList.remove("is-hovering");
      visual.style.removeProperty("--tilt-x");
      visual.style.removeProperty("--tilt-y");
      visual.style.removeProperty("--tilt-shift-x");
      visual.style.removeProperty("--tilt-shift-y");
      visual.style.removeProperty("--scene-x");
      visual.style.removeProperty("--scene-y");
    };

    visual.addEventListener("pointermove", (event) => {
      if (prefersReducedMotion) {
        return;
      }

      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const rect = visual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 10;
        const rotateX = (0.5 - y) * 8;

        visual.classList.add("is-hovering");
        visual.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        visual.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
        visual.style.setProperty("--tilt-shift-x", `${((x - 0.5) * 8).toFixed(1)}px`);
        visual.style.setProperty("--tilt-shift-y", `${((y - 0.5) * 6).toFixed(1)}px`);
        visual.style.setProperty("--scene-x", `${(x * 100).toFixed(1)}%`);
        visual.style.setProperty("--scene-y", `${(y * 100).toFixed(1)}%`);
      });
    });

    visual.addEventListener("pointerleave", () => {
      window.cancelAnimationFrame(rafId);
      resetTilt();
    });
  });
});

if (contactForm) {
  const serviceChips = contactForm.querySelectorAll(".service-chip");
  const selectedServicesInput = contactForm.querySelector("input[name='selected_services']");
  const submitButton = contactForm.querySelector(".contact-submit");

  const updateSelectedServices = () => {
    const selectedServices = Array.from(serviceChips)
      .filter((chip) => chip.classList.contains("is-selected"))
      .map((chip) => chip.textContent.trim());

    if (selectedServicesInput) {
      selectedServicesInput.value = selectedServices.join(", ");
    }
  };

  serviceChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-selected");
      updateSelectedServices();
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000);
    });

    contactForm.classList.add("submitted");
    if (submitButton) {
      submitButton.textContent = "Sent";
    }
  });
}
