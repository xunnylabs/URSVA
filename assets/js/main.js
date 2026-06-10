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
