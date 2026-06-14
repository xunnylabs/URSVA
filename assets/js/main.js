const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector(".contact-form");

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

document.querySelectorAll(".home-header .site-nav").forEach((navElement) => {
  const pill = navElement.querySelector(".nav-glass-pill");
  const navLinks = navElement.querySelectorAll(":scope > a, :scope > .nav-item > .nav-link");
  const activeLink = navElement.querySelector(":scope > a.active, :scope > .nav-item > .nav-link.active") || navLinks[0];

  if (!pill || !navLinks.length || !activeLink) {
    return;
  }

  const movePillTo = (target) => {
    const navRect = navElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    pill.style.top = `${targetRect.top - navRect.top}px`;
    pill.style.width = `${targetRect.width}px`;
    pill.style.height = `${targetRect.height}px`;
    pill.style.opacity = "1";
    pill.style.transform = `translate3d(${targetRect.left - navRect.left}px, 0, 0)`;
  };

  const returnToActive = () => movePillTo(activeLink);

  window.setTimeout(returnToActive, 0);
  window.addEventListener("resize", returnToActive);

  navLinks.forEach((link) => {
    link.addEventListener("pointerenter", () => movePillTo(link));
    link.addEventListener("mouseenter", () => movePillTo(link));
    link.addEventListener("focus", () => movePillTo(link));
  });

  navElement.addEventListener("pointerleave", returnToActive);
  navElement.addEventListener("mouseleave", returnToActive);
  navElement.addEventListener("pointerover", (event) => {
    const link = event.target.closest("a");
    if (link && navElement.contains(link)) {
      movePillTo(link);
    }
  });
  navElement.addEventListener("mouseover", (event) => {
    const link = event.target.closest("a");
    if (link && navElement.contains(link)) {
      movePillTo(link);
    }
  });
  navElement.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!navElement.contains(document.activeElement)) {
        returnToActive();
      }
    }, 0);
  });
});

document.querySelectorAll(".services-menu").forEach((menu) => {
  let closeTimer;
  const trigger = menu.querySelector(".nav-link");

  const openMenu = () => {
    window.clearTimeout(closeTimer);
    menu.classList.add("menu-open");
  };

  const scheduleClose = () => {
    if (menu.classList.contains("menu-locked")) {
      return;
    }

    closeTimer = window.setTimeout(() => {
      menu.classList.remove("menu-open");
    }, 900);
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
      menu.classList.toggle("menu-locked", shouldLock);
      menu.classList.toggle("menu-open", shouldLock);
    });
  }

  menu.querySelectorAll(".mega-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".services-menu.menu-locked").forEach((menu) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("menu-open", "menu-locked");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".services-menu").forEach((menu) => {
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

  element.addEventListener("pointermove", () => {
    element.classList.add("is-hovering");
  });

  element.addEventListener("pointerleave", () => {
    element.classList.remove("is-hovering");
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

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.classList.add("submitted");
    const button = contactForm.querySelector("button");
    if (button) {
      button.textContent = "Request Ready";
    }
  });
}
