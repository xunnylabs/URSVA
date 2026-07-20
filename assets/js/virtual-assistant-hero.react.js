import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const e = React.createElement;

const sceneCopy = [
  "Your workday, supported.",
  "Still moving when priorities change.",
  "Reliable support across every hour.",
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getLayerOpacity(progress) {
  if (progress <= 0.45) {
    const sunset = progress / 0.45;

    return {
      day: 1 - sunset,
      sunset,
      night: 0,
    };
  }

  const night = (progress - 0.45) / 0.55;

  return {
    day: 0,
    sunset: 1 - night,
    night,
  };
}

function getPhase(progress) {
  if (progress < 0.34) return 0;
  if (progress < 0.72) return 1;
  return 2;
}

function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (source) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = resolve;
          image.src = source;
        })
    )
  );
}

function ScrollIndicator({ hidden }) {
  return e(
    "div",
    { className: `daynight-scroll-indicator ${hidden ? "is-hidden" : ""}`, "aria-hidden": "true" },
    e("span", null),
    "Move cursor through the day"
  );
}

function AssistantScene({ images, isReady, onInteract }) {
  const layers = [
    { key: "day", src: images.day },
    { key: "sunset", src: images.sunset },
    { key: "night", src: images.night },
  ];

  return e(
    "div",
    {
      className: `daynight-scene ${isReady ? "is-ready" : ""}`,
      onPointerEnter: onInteract,
      onPointerMove: onInteract,
    },
    e(
      "figure",
      { className: "daynight-frame" },
      layers.map((layer) =>
        e("img", {
          alt: "",
          "aria-hidden": "true",
          className: `daynight-image ${layer.key}`,
          decoding: "async",
          fetchPriority: layer.key === "day" ? "high" : "auto",
          key: layer.key,
          src: layer.src,
        })
      ),
      e("div", { className: "window-reflection", "aria-hidden": "true" }),
      e("div", { className: "lamp-glow", "aria-hidden": "true" }),
      e("div", { className: "monitor-glow", "aria-hidden": "true" }),
      e(
        "div",
        { className: "city-lights", "aria-hidden": "true" },
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null),
        e("i", null)
      )
    )
  );
}

function HeroDayNight({ contactHref, images }) {
  const heroRef = useRef(null);
  const sceneRef = useRef(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  const [phase, setPhase] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const imageList = useMemo(() => [images.day, images.sunset, images.night], [images]);
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const setSceneProgress = (progress) => {
    const nextProgress = reducedMotion ? 0 : clamp(progress, 0, 1);
    const opacity = getLayerOpacity(nextProgress);
    const nextPhase = getPhase(nextProgress);
    const hero = heroRef.current;

    progressRef.current = nextProgress;

    if (hero) {
      hero.style.setProperty("--day-opacity", opacity.day.toFixed(3));
      hero.style.setProperty("--sunset-opacity", opacity.sunset.toFixed(3));
      hero.style.setProperty("--night-opacity", opacity.night.toFixed(3));
      hero.style.setProperty("--night-progress", opacity.night.toFixed(3));
      hero.style.setProperty("--hero-progress", nextProgress.toFixed(3));
    }

    setPhase((currentPhase) => (currentPhase === nextPhase ? currentPhase : nextPhase));

    if (nextProgress > 0.025) {
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    preloadImages(imageList).then(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageList]);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const cycle = 11000;

    const update = (time) => {
      if (mobileQuery.matches && !reducedMotion) {
        setSceneProgress((time % cycle) / cycle);
      }

      animationFrameRef.current = window.requestAnimationFrame(update);
    };

    setSceneProgress(0);
    animationFrameRef.current = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isReady, reducedMotion]);

  const handleSceneInteract = (event) => {
    const scene = sceneRef.current;

    setHasInteracted(true);

    if (!scene || !event.clientX) {
      return;
    }

    const rect = scene.getBoundingClientRect();
    const xProgress = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const yProgress = clamp((event.clientY - rect.top) / rect.height, 0, 1);

    pointerRef.current = {
      x: (xProgress - 0.5) * 2,
      y: (yProgress - 0.5) * 2,
    };

    scene.style.setProperty("--scene-x", pointerRef.current.x.toFixed(3));
    scene.style.setProperty("--scene-y", pointerRef.current.y.toFixed(3));

    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    setSceneProgress(Math.abs(xProgress - 0.5) > Math.abs(yProgress - 0.5) ? xProgress : yProgress);
  };

  return e(
    "div",
    { className: "daynight-hero-shell", ref: heroRef },
    e(
      "div",
      { className: "daynight-hero-sticky", ref: sceneRef, onPointerEnter: handleSceneInteract, onPointerMove: handleSceneInteract },
      e(AssistantScene, {
        images,
        isReady,
        onInteract: handleSceneInteract,
      }),
      e("div", { className: "daynight-bottom-blur", "aria-hidden": "true" }),
      e("div", { className: "daynight-vignette", "aria-hidden": "true" }),
      e(
        "div",
        { className: "daynight-hero-grid" },
        e(
          "div",
          { className: "daynight-copy" },
          e(
            "div",
            { className: "stellar-rating react-fade", style: { animationDelay: "0.1s" } },
            e("span", { className: "rating-icon" }, "✦"),
            e("span", null, "Trusted support for lean teams ready to scale smarter")
          ),
          e(
            "h1",
            { className: "stellar-heading react-fade", style: { animationDelay: "0.2s" } },
            "Scale your operations ",
            e("span", null, "without overhiring.")
          ),
          e(
            "p",
            { className: "stellar-subheading react-fade", style: { animationDelay: "0.3s" } },
            "Structured support, client coordination, and workflow automation that keep your business moving without adding unnecessary headcount."
          ),
          e(
            "p",
            { className: "daynight-supporting-line", "aria-live": "polite" },
            sceneCopy[phase]
          ),
          e(
            "div",
            { className: "stellar-actions react-fade", style: { animationDelay: "0.4s" } },
            e("a", { className: "button primary", href: contactHref }, "Book a Free Consultation"),
            e("a", { className: "button secondary", href: "pages/how-it-works.html" }, "See How It Works")
        )
        )
      ),
      e(ScrollIndicator, { hidden: hasInteracted || reducedMotion })
    )
  );
}

document.querySelectorAll("#virtual-assistant-hero-root").forEach((rootElement) => {
  createRoot(rootElement).render(
    e(HeroDayNight, {
      contactHref: rootElement.dataset.contact || "pages/contact.html",
      images: {
        day: rootElement.dataset.dayImage || "assets/images/ursva-assistant-day-hero.jpeg",
        sunset: rootElement.dataset.sunsetImage || "assets/images/ursva-assistant-sunset-hero.jpeg",
        night: rootElement.dataset.nightImage || "assets/images/ursva-assistant-night-hero.jpeg",
      },
    })
  );
});
