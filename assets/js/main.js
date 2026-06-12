const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const contactForm = document.querySelector(".contact-form");

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

document.querySelectorAll(".pricing-button, .mega-service-link").forEach((element) => {
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
