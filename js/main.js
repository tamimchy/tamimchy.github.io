(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const nav = document.querySelector("[data-nav]");

  const closeMenu = () => {
    menuToggle?.classList.remove("is-open");
    mobileMenu?.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const open = mobileMenu?.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", !!open);
    document.body.classList.toggle("is-menu-open", !!open);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Custom cursor + labels ---------- */
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor__dot");
  const cursorRing = document.querySelector(".cursor__ring");
  const cursorLabel = document.querySelector("[data-cursor-label]");
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ring = { x: mouse.x, y: mouse.y };
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && cursorDot && cursorRing && finePointer) {
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      if (cursorLabel) {
        cursorLabel.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -140%)`;
      }
    });

    window.addEventListener("mousedown", () => cursor.classList.add("is-pressed"));
    window.addEventListener("mouseup", () => cursor.classList.remove("is-pressed"));

    document.querySelectorAll("a, button, [data-magnetic], .project, [data-bay], .fx").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        const label = el.getAttribute("data-cursor-text");
        if (label && cursorLabel) {
          cursorLabel.textContent = label;
          cursor.classList.add("has-label");
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover", "has-label");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });

    const tickCursor = () => {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      cursorRing.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      requestAnimationFrame(tickCursor);
    };
    tickCursor();
  }

  /* ---------- Cursor trail ---------- */
  const trailCanvas = document.querySelector("[data-trail]");
  if (trailCanvas && finePointer && !reduceMotion) {
    const ctx = trailCanvas.getContext("2d");
    const points = [];
    const resizeTrail = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    resizeTrail();
    window.addEventListener("resize", resizeTrail);
    window.addEventListener("mousemove", (e) => {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (points.length > 28) points.shift();
    });
    const drawTrail = () => {
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        p.life *= 0.92;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 226, 197, ${0.35 * p.life})`;
        ctx.fill();
      }
      requestAnimationFrame(drawTrail);
    };
    drawTrail();
  }

  /* ---------- HUD coords ---------- */
  const mouseX = document.querySelector("[data-mouse-x]");
  const mouseY = document.querySelector("[data-mouse-y]");
  window.addEventListener("mousemove", (e) => {
    if (mouseX) mouseX.textContent = ((e.clientX / window.innerWidth) * 100).toFixed(2);
    if (mouseY) mouseY.textContent = ((e.clientY / window.innerHeight) * 100).toFixed(2);
  });

  /* ---------- Magnetic ---------- */
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      if (reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  /* ---------- Hero / contact parallax ---------- */
  const hero = document.querySelector("[data-hero]");
  const parallaxSlow = document.querySelector("[data-parallax-slow]");
  const parallaxMid = document.querySelector("[data-parallax-mid]");
  const parallaxFast = document.querySelector("[data-parallax-fast]");

  if (hero && !reduceMotion) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (parallaxSlow) parallaxSlow.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
      if (parallaxMid) parallaxMid.style.transform = `translate(${x * 28}px, ${y * 20}px)`;
    });
  }

  if (parallaxFast && !reduceMotion) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      parallaxFast.style.translate = `${x}px ${y}px`;
    });
  }

  /* ---------- 3D tilt portrait ---------- */
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      if (reduceMotion) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  /* ---------- Project scrub ---------- */
  document.querySelectorAll("[data-project]").forEach((project) => {
    const video = project.querySelector("video");
    if (!video) return;

    const showPosterFrame = () => {
      try {
        if (video.readyState >= 1) video.currentTime = 0.12;
      } catch (_) {}
    };
    video.addEventListener("loadedmetadata", showPosterFrame);
    if (video.readyState >= 1) showPosterFrame();

    const play = () => {
      project.classList.add("is-active");
      video.play().catch(() => {});
    };
    const pause = () => {
      project.classList.remove("is-active");
      video.pause();
      showPosterFrame();
    };

    project.addEventListener("mouseenter", play);
    project.addEventListener("mouseleave", pause);
    project.addEventListener("focusin", play);
    project.addEventListener("focusout", pause);
    project.addEventListener("mousemove", (e) => {
      if (!video.duration || !project.classList.contains("is-active")) return;
      const rect = project.getBoundingClientRect();
      const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      video.currentTime = ratio * video.duration;
    });
  });

  /* ---------- Edit bay footage hover ---------- */
  document.querySelectorAll("[data-bay]").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-active");
      video.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-active");
      video.pause();
    });
  });

  /* ---------- AE transition demos ---------- */
  document.querySelectorAll("[data-fx]").forEach((fx) => {
    let timer;
    const play = () => {
      fx.classList.remove("is-playing");
      void fx.offsetWidth;
      fx.classList.add("is-playing");
      clearTimeout(timer);
      timer = setTimeout(() => fx.classList.remove("is-playing"), 1000);
    };
    fx.addEventListener("mouseenter", play);
    fx.addEventListener("click", play);
  });

  /* ---------- Nav hide (class only — never leave GSAP transform on nav) ---------- */
  let lastY = 0;
  const onNavScroll = (y) => {
    if (!nav) return;
    if (y > lastY && y > 140) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  };

  /* ---------- Progress bar ---------- */
  const progressEl = document.querySelector("[data-progress]");
  const updateProgress = (y) => {
    if (!progressEl) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    progressEl.style.width = `${pct}%`;
  };

  /* ---------- Loader ---------- */
  const loader = document.querySelector("[data-loader]");
  const loaderName = document.querySelector("[data-loader-name]");
  const loaderBar = document.querySelector("[data-loader-bar]");
  const loaderPct = document.querySelector("[data-loader-pct]");
  const shutter = document.querySelector("[data-shutter]");

  const runLoader = () =>
    new Promise((resolve) => {
      if (!loader || reduceMotion || typeof gsap === "undefined") {
        document.body.classList.remove("is-loading");
        loader?.remove();
        resolve();
        return;
      }

      const target = "TAMIM";
      const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const state = { pct: 0 };

      const scramble = gsap.timeline({
        onUpdate: () => {
          if (!loaderName) return;
          loaderName.textContent = [...target]
            .map((ch, i) => {
              if (state.pct / 100 > (i + 1) / target.length) return ch;
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join("");
        },
      });

      scramble.to(state, {
        pct: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(state.pct);
          if (loaderBar) loaderBar.style.width = `${v}%`;
          if (loaderPct) loaderPct.textContent = String(v);
        },
      });

      scramble.add(() => {
        if (loaderName) loaderName.textContent = target;
      });

      scramble.to(
        shutter,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.85,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.classList.remove("is-loading");
            loader.classList.add("is-done");
            loader.remove();
            resolve();
          },
        },
        "+=0.15"
      );
    });

  const markShown = (el) => el?.classList.add("is-shown");

  const forceShowAll = () => {
    document
      .querySelectorAll(
        "[data-reveal], [data-split], [data-process-step], [data-chip], [data-project], [data-bay], [data-review], .fx, .stat, .section-eyebrow"
      )
      .forEach((el) => {
        markShown(el);
        el.classList.add("is-revealed");
      });
  };

  const boot = async () => {
    if (reduceMotion || typeof gsap === "undefined") {
      forceShowAll();
      document.body.classList.remove("is-loading", "has-motion");
      loader?.remove();
      window.addEventListener("scroll", () => {
        onNavScroll(window.scrollY);
        updateProgress(window.scrollY);
      }, { passive: true });
      return;
    }

    document.body.classList.add("has-motion");
    gsap.registerPlugin(ScrollTrigger);
    await runLoader();

    /* Failsafe: never leave About/Contact blank */
    window.setTimeout(forceShowAll, 3500);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) markShown(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    document
      .querySelectorAll(
        "[data-reveal], [data-split], [data-process-step], [data-chip], .section-eyebrow"
      )
      .forEach((el) => revealObserver.observe(el));

    /* ---------- Lenis ---------- */
    let lenis;
    if (typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ({ scroll }) => {
        ScrollTrigger.update();
        onNavScroll(scroll);
        updateProgress(scroll);
      });

      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      window.addEventListener(
        "scroll",
        () => {
          onNavScroll(window.scrollY);
          updateProgress(window.scrollY);
        },
        { passive: true }
      );
    }

    /* ---------- Split text (chars + words) ---------- */
    const splitText = (el, { words = false } = {}) => {
      const text = el.textContent.trim();
      el.textContent = "";
      el.setAttribute("aria-label", text);

      if (!words) {
        [...text].forEach((char) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char === " " ? "\u00A0" : char;
          el.appendChild(span);
        });
        return el.querySelectorAll(".char");
      }

      text.split(/\s+/).forEach((word) => {
        const wordEl = document.createElement("span");
        wordEl.className = "word";
        [...word].forEach((char) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char;
          wordEl.appendChild(span);
        });
        el.appendChild(wordEl);
      });
      return el.querySelectorAll(".char");
    };

    const heroBrand = document.querySelector("[data-hero-brand]");
    if (heroBrand) splitText(heroBrand);

    document.querySelectorAll("[data-split]").forEach((el) => {
      const chars = splitText(el, { words: true });
      gsap.set(chars, { yPercent: 110, opacity: 0 });
      markShown(el);
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.028,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => markShown(el),
        },
      });
    });

    gsap.utils.toArray("[data-reveal]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 36, filter: "blur(6px)" },
        {
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          delay: (i % 4) * 0.04,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
            onEnter: () => markShown(el),
            onRefresh: (self) => {
              if (self.progress > 0) markShown(el);
            },
          },
        }
      );
    });

    /* Eyebrow line draw */
    gsap.utils.toArray(".section-eyebrow").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => markShown(el),
      });
    });

    /* ---------- Hero intro ---------- */
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero__video", { scale: 1.25, filter: "brightness(0.2)", duration: 2 }, 0)
      .from(".hero__brand .char", { yPercent: 110, opacity: 0, stagger: 0.045, duration: 1.1 }, 0.1)
      .from(".hero__surname", { opacity: 0, y: 18, letterSpacing: "0.6em", duration: 0.8 }, 0.4)
      .from(".hero__status", { opacity: 0, y: 20, duration: 0.7 }, 0.3)
      .from(".hero__tagline", { opacity: 0, y: 24, duration: 0.8 }, 0.5)
      .from(".hero__actions .btn", { opacity: 0, y: 24, stagger: 0.1, duration: 0.7 }, 0.65)
      .from(".hero__meta-item", { opacity: 0, y: 16, stagger: 0.08, duration: 0.6 }, 0.8)
      .from(".hero__scroll", { opacity: 0, duration: 0.6 }, 0.95)
      .from(".nav", { opacity: 0, duration: 0.7, clearProps: "transform" }, 0.2);

    gsap.to(".hero__video", {
      yPercent: 22,
      scale: 1.12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    gsap.to(".hero__content", {
      y: -60,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    /* ---------- Marquee (direction follows scroll) ---------- */
    const marqueeTrack = document.querySelector("[data-marquee] .marquee__track");
    let marqueeTween;
    if (marqueeTrack) {
      marqueeTween = gsap.to(marqueeTrack, {
        xPercent: -50,
        ease: "none",
        duration: 26,
        repeat: -1,
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const dir = self.direction;
          if (marqueeTween) marqueeTween.timeScale(dir >= 0 ? 1 : -1);
        },
      });
    }

    /* ---------- Reel scale pin (Mat Voyce style) ---------- */
    const reelFrame = document.querySelector("[data-reel-frame]");
    const reelPin = document.querySelector("[data-reel-pin]");
    if (reelFrame && reelPin) {
      gsap.fromTo(
        reelFrame,
        { scale: 0.72, rotateX: 8, borderRadius: "18px", filter: "brightness(0.7)" },
        {
          scale: 1,
          rotateX: 0,
          borderRadius: "0px",
          filter: "brightness(1)",
          ease: "none",
          scrollTrigger: {
            trigger: reelPin,
            start: "top 70%",
            end: "top 15%",
            scrub: true,
          },
        }
      );
      gsap.to(".reel__glow", {
        opacity: 1,
        scrollTrigger: { trigger: reelPin, start: "top 60%", end: "top 20%", scrub: true },
      });
    }

    /* ---------- Fiverr reviews cascade ---------- */
    gsap.utils.toArray("[data-review]").forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: (i % 2) * 0.08,
            ease: "power3.out",
            onStart: () => card.classList.add("is-revealed"),
          });
        },
      });
    });

    /* ---------- Process line scrub ---------- */
    gsap.to("[data-process-line]", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: ".process", start: "top 70%", end: "top 30%", scrub: true },
    });

    /* ---------- Craft chips ---------- */
    gsap.utils.toArray("[data-chip]").forEach((chip, i) => {
      ScrollTrigger.create({
        trigger: chip,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(chip, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.06,
            ease: "power3.out",
            onStart: () => markShown(chip),
          });
        },
      });
    });

    /* ---------- FX cards cascade ---------- */
    gsap.utils.toArray(".fx").forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.08,
            ease: "power3.out",
            onStart: () => card.classList.add("is-revealed"),
          });
        },
      });
    });

    /* ---------- Edit bay cards ---------- */
    gsap.utils.toArray("[data-bay]").forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: (i % 3) * 0.1,
            ease: "power3.out",
            onStart: () => card.classList.add("is-revealed"),
          });
        },
      });
    });

    /* ---------- Montages clip reveals + image parallax ---------- */
    gsap.utils.toArray("[data-project]").forEach((project) => {
      const media = project.querySelector(".project__media video");

      ScrollTrigger.create({
        trigger: project,
        start: "top 90%",
        once: true,
        onEnter: () => {
          project.classList.add("is-revealed");
          gsap.from(project.querySelector(".project__info"), {
            y: 18,
            opacity: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
          });
        },
      });

      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: project,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });

    /* ---------- Stats ---------- */
    gsap.utils.toArray(".stat").forEach((stat, i) => {
      ScrollTrigger.create({
        trigger: stat,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(stat, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: "back.out(1.4)",
            onStart: () => markShown(stat),
          });
        },
      });
    });

    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.getAttribute("data-count")) || 0;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.floor(obj.val));
            },
          });
          gsap.fromTo(
            el,
            { textShadow: "0 0 0 rgba(45,226,197,0)" },
            { textShadow: "0 0 24px rgba(45,226,197,0.45)", duration: 0.4, yoyo: true, repeat: 1 }
          );
        },
      });
    });

    /* ---------- Skills stagger ---------- */
    gsap.from("[data-skill]", {
      y: 18,
      opacity: 0,
      scale: 0.96,
      stagger: 0.07,
      duration: 0.55,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".about__skills",
        start: "top 88%",
        once: true,
        onEnter: () => markShown(document.querySelector(".about__skills")),
      },
    });

    /* ---------- About image zoom scrub ---------- */
    const portraitImg = document.querySelector(".about__portrait img");
    if (portraitImg) {
      gsap.fromTo(
        portraitImg,
        { scale: 1.2, filter: "grayscale(0.6)" },
        {
          scale: 1,
          filter: "grayscale(0.2)",
          ease: "none",
          scrollTrigger: {
            trigger: ".about__portrait",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    /* ---------- Floaters + contact ---------- */
    gsap.utils.toArray("[data-floater]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0.15, y: 80 },
        {
          opacity: 0.7,
          y: (i % 2 === 0 ? -1 : 1) * 50,
          x: (i % 2 === 0 ? 1 : -1) * 30,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    gsap.from(".contact__mail", {
      scale: 0.92,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".contact__mail", start: "top 90%", once: true },
    });

    gsap.from(".contact__links a", {
      y: 16,
      opacity: 0,
      stagger: 0.1,
      duration: 0.55,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact__links", start: "top 92%", once: true },
    });

    gsap.to(".contact__orbit", {
      scale: 1.08,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    /* ---------- Process steps ---------- */
    gsap.utils.toArray("[data-process-step]").forEach((step, i) => {
      gsap.fromTo(
        step,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: i * 0.1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: step,
            start: "top 88%",
            once: true,
            onEnter: () => markShown(step),
          },
        }
      );
      const heading = step.querySelector("h3");
      if (heading) {
        gsap.from(heading, {
          x: -18,
          duration: 0.65,
          delay: i * 0.1 + 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: step, start: "top 88%", once: true },
        });
      }
    });

    /* ---------- Footer fade ---------- */
    gsap.from(".footer", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: ".footer", start: "top 98%", once: true },
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  boot();
})();
