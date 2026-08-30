import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add('motion-ready');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setupHero = () => {
  const hero = document.querySelector<HTMLElement>('[data-hero-motion]');
  if (!hero) return;

  const image = hero.querySelector<HTMLElement>('[data-hero-image]');
  const media = [image].filter(Boolean) as HTMLElement[];
  const lines = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-line]'));
  const copy = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-copy]'));
  const header = document.querySelector<HTMLElement>('[data-site-header]');

  gsap.set(media, { scale: 1.1, filter: 'brightness(.78) saturate(.82)' });
  gsap.set(lines, { yPercent: 105, autoAlpha: 0 });
  gsap.set(copy, { y: 18, autoAlpha: 0 });
  gsap.set(header, { y: -20, autoAlpha: 0 });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to(media, { scale: 1.015, filter: 'brightness(1) saturate(1)', duration: 2.7 }, 0)
    .to(header, { y: 0, autoAlpha: 1, duration: .8 }, .15)
    .to(lines, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: .14 }, .45)
    .to(copy, { y: 0, autoAlpha: 1, duration: .75, stagger: .12 }, .9);
};

const setupCounters = () => {
  document.querySelectorAll<HTMLElement>('[data-count-group]').forEach((group) => {
    const values = Array.from(group.querySelectorAll<HTMLElement>('[data-count-value]'));
    if (!values.length) return;

    if (reduceMotion) {
      group.classList.add('is-counted');
      return;
    }

    ScrollTrigger.create({
      trigger: group,
      start: 'top 76%',
      once: true,
      onEnter: () => {
        group.classList.add('is-counting', 'is-counted');
        values.forEach((element, index) => {
          const raw = element.dataset.countValue || element.textContent || '';
          const numericPart = raw.match(/[\d.,]+/)?.[0] || '0';
          const suffix = raw.replace(numericPart, '');
          const decimalPlaces = numericPart.includes(',') ? numericPart.split(',')[1].length : 0;
          const target = Number(numericPart.replaceAll('.', '').replace(',', '.'));
          const state = { value: 0 };

          gsap.to(state, {
            value: target,
            duration: 1.65,
            delay: index * .12,
            ease: 'power2.out',
            onUpdate: () => {
              const current = decimalPlaces
                ? state.value.toFixed(decimalPlaces).replace('.', ',')
                : Math.round(state.value).toLocaleString('vi-VN');
              element.textContent = `${current}${suffix}`;
            },
            onComplete: () => { element.textContent = raw; },
          });
        });
      },
    });
  });
};

const setupChapters = () => {
  document.querySelectorAll<HTMLElement>('[data-chapter]').forEach((chapter) => {
    gsap.from(chapter.querySelectorAll(':scope > *'), {
      y: 24,
      duration: .9,
      stagger: .08,
      ease: 'power2.out',
      scrollTrigger: { trigger: chapter, start: 'top 84%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-media-reveal]').forEach((media) => {
    const image = media.querySelector<HTMLElement>('img');
    if (!image) return;
    gsap.from(image, {
      scale: 1.055,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: media, start: 'top 82%', once: true },
    });
  });
};

const setupCinematicVideo = () => {
  const section = document.querySelector<HTMLElement>('[data-cinematic-video]');
  if (!section) return;
  const frame = section.querySelector<HTMLElement>('[data-cinematic-frame]');
  const video = section.querySelector<HTMLVideoElement>('[data-cinematic-media]');
  const curtainTop = section.querySelector<HTMLElement>('[data-cinematic-curtain-top]');
  const curtainBottom = section.querySelector<HTMLElement>('[data-cinematic-curtain-bottom]');
  const overlay = section.querySelector<HTMLElement>('[data-cinematic-overlay]');
  const caption = section.querySelector<HTMLElement>('.cinematic-caption');
  if (!frame || !video || !curtainTop || !curtainBottom || !overlay) return;

  if (reduceMotion) {
    video.pause();
    section.dataset.cinematicStatus = 'reduced';
    return;
  }

  video.muted = true;
  video.play().catch(() => undefined);
  gsap.set(frame, { scale: .94, clipPath: 'inset(8% 6% 8% 6%)' });
  gsap.set(video, { scale: 1.08, filter: 'saturate(.78) contrast(1.04) brightness(.86)' });
  gsap.set(overlay, { clipPath: 'inset(0% 0% 0% 0%)', xPercent: 0, autoAlpha: 1 });
  gsap.set(caption, { autoAlpha: 0, y: 12 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 88%',
      end: 'bottom 12%',
      scrub: 1,
      invalidateOnRefresh: true,
      onEnter: () => { video.play().catch(() => undefined); section.dataset.cinematicStatus = 'active'; },
      onEnterBack: () => { video.play().catch(() => undefined); section.dataset.cinematicStatus = 'active'; },
      onLeave: () => { video.pause(); section.dataset.cinematicStatus = 'complete'; },
      onLeaveBack: () => { video.pause(); section.dataset.cinematicStatus = 'idle'; },
    },
  });

  timeline
    .to(overlay, { clipPath: 'inset(0% 0% 0% 100%)', xPercent: 4, autoAlpha: .92, ease: 'power3.inOut', duration: 1.1 }, 0)
    .to(curtainTop, { yPercent: -105, ease: 'power2.inOut', duration: 1 }, 0)
    .to(curtainBottom, { yPercent: 105, ease: 'power2.inOut', duration: 1 }, 0)
    .to(frame, { scale: 1, clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1.15 }, 0)
    .to(video, { scale: 1, filter: 'saturate(.94) contrast(1.02) brightness(.96)', ease: 'power1.inOut', duration: 1.35 }, 0)
    .to(caption, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: .45 }, .45)
    .to({}, { duration: .85 })
    .to(caption, { autoAlpha: 0, y: -10, ease: 'power1.in', duration: .35 })
    .fromTo(overlay, { clipPath: 'inset(0% 100% 0% 0%)', xPercent: -4, autoAlpha: 1 }, { clipPath: 'inset(0% 0% 0% 0%)', xPercent: 0, autoAlpha: 1, ease: 'power3.inOut', duration: .72, immediateRender: false }, '<')
    .to(frame, { scale: .965, clipPath: 'inset(5% 4% 5% 4%)', ease: 'power2.inOut', duration: .8 })
    .to(curtainTop, { yPercent: 0, ease: 'power2.inOut', duration: .75 }, '<')
    .to(curtainBottom, { yPercent: 0, ease: 'power2.inOut', duration: .75 }, '<');
};

const setupMap = () => {
  const map = document.querySelector<HTMLElement>('[data-location-map]');
  if (!map) return;

  const stage = map.querySelector<HTMLElement>('[data-map-stage]');
  const image = map.querySelector<HTMLElement>('[data-map-image]');
  const parallaxLayer = map.querySelector<HTMLElement>('[data-map-parallax]');
  const radiusPaths = Array.from(map.querySelectorAll<SVGElement>('[data-map-radius-ring]'));
  const routePaths = Array.from(map.querySelectorAll<SVGPathElement>('[data-pdf-route="true"]'));
  const routeFlowPaths = Array.from(map.querySelectorAll<SVGPathElement>('[data-map-route-flow]'));
  const siteShape = map.querySelector<SVGPathElement>('[data-pdf-site="true"]');
  const pin = map.querySelector<HTMLElement>('[data-map-pin]');
  const pinPulse = pin?.parentElement?.querySelector<HTMLElement>('[data-map-pin-pulse]');
  const mapLabels = Array.from(map.querySelectorAll<HTMLElement>('[data-map-label]'));
  const curtain = map.querySelector<HTMLElement>('[data-map-curtain]');
  const revealFrame = map.querySelector<HTMLElement>('[data-map-frame]');
  const zoomIn = map.querySelector<HTMLButtonElement>('[data-map-zoom-in]');
  const zoomOut = map.querySelector<HTMLButtonElement>('[data-map-zoom-out]');
  const zoomLevel = map.querySelector<HTMLElement>('[data-map-zoom-level]');
  if (!stage || !image) return;

  let manualScale = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let mapRect = map.getBoundingClientRect();

  const updateZoomDisplay = () => {
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(manualScale * 100)}%`;
    }
  };

  const applyManualTransform = () => {
    gsap.to(stage, {
      scale: manualScale,
      x: panX,
      y: panY,
      duration: .65,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    map.dataset.mapZoom = manualScale.toFixed(2);
    updateZoomDisplay();
    // Keep map labels readable at any zoom: counter-scale them
    gsap.to(mapLabels, { scale: manualScale === 1 ? 1 : 1 / manualScale, duration: .55, ease: 'power2.out', overwrite: 'auto', transformOrigin: '50% 50%' });
  };

  zoomIn?.addEventListener('click', () => {
    manualScale = Math.min(2.4, manualScale + .25);
    applyManualTransform();
  });
  zoomOut?.addEventListener('click', () => {
    manualScale = Math.max(1, manualScale - .25);
    if (manualScale === 1) panX = panY = 0;
    applyManualTransform();
  });

  // Track pointers for 1-finger pan & 2-finger pinch
  const activePointers = new Map<number, { clientX: number; clientY: number }>();
  let initialPinchDistance = 0;
  let initialPinchScale = 1;
  let lastTapTime = 0;

  const getDistance = (p1: { clientX: number; clientY: number }, p2: { clientX: number; clientY: number }) => {
    return Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
  };

  stage.addEventListener('pointerdown', (event) => {
    const now = Date.now();
    if (now - lastTapTime < 280 && activePointers.size === 0) {
      // Double tap / double click to zoom in
      manualScale = Math.min(2.4, manualScale + 0.35);
      applyManualTransform();
      lastTapTime = 0;
      return;
    }
    lastTapTime = now;

    activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
    stage.setPointerCapture(event.pointerId);
    mapRect = map.getBoundingClientRect();

    if (activePointers.size === 1) {
      dragging = true;
      startX = event.clientX - panX;
      startY = event.clientY - panY;
    } else if (activePointers.size === 2) {
      dragging = false;
      const pts = Array.from(activePointers.values());
      initialPinchDistance = getDistance(pts[0], pts[1]);
      initialPinchScale = manualScale;
    }
  });

  stage.addEventListener('pointermove', (event) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

    if (activePointers.size === 2 && initialPinchDistance > 0) {
      const pts = Array.from(activePointers.values());
      const currentDist = getDistance(pts[0], pts[1]);
      const nextScale = Math.min(2.4, Math.max(1, initialPinchScale * (currentDist / initialPinchDistance)));
      manualScale = nextScale;
      if (manualScale === 1) panX = panY = 0;
      applyManualTransform();
      return;
    }

    if (!dragging) return;
    const limX = mapRect.width * (manualScale - 1) / 2 + mapRect.width * .06;
    const limY = mapRect.height * (manualScale - 1) / 2 + mapRect.height * .06;
    panX = Math.max(-limX, Math.min(limX, event.clientX - startX));
    panY = Math.max(-limY, Math.min(limY, event.clientY - startY));
    gsap.set(stage, { x: panX, y: panY });
  });

  const endPointer = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size === 1) {
      const remaining = Array.from(activePointers.values())[0];
      dragging = true;
      startX = remaining.clientX - panX;
      startY = remaining.clientY - panY;
    } else if (activePointers.size === 0) {
      dragging = false;
      initialPinchDistance = 0;
    }
  };
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  if (reduceMotion) {
    map.classList.add('is-map-active');
    gsap.set(curtain, { autoAlpha: 0 });
    gsap.set(revealFrame, { autoAlpha: .45 });
    gsap.set(parallaxLayer, { yPercent: 0 });
    gsap.set(radiusPaths, { opacity: .9 });
    gsap.set(routePaths, { opacity: 1 });
    gsap.set(routeFlowPaths, { opacity: .8 });
    gsap.set(siteShape, { opacity: 1 });
    gsap.set(pin, { opacity: 1 });
    gsap.set(pinPulse, { opacity: .9 });
    gsap.set(mapLabels, { opacity: 1 });
    return;
  }

  gsap.set(radiusPaths, { autoAlpha: 0 });
  gsap.set(routePaths, { autoAlpha: 0, transformOrigin: '50% 50%' });
  gsap.set(routeFlowPaths, { autoAlpha: 0, strokeDashoffset: 0 });
  gsap.set(siteShape, { autoAlpha: 0, scale: .84, transformOrigin: '50% 50%' });
  gsap.set(pin, { autoAlpha: 0, scale: .82, y: 12 });
  gsap.set(pinPulse, { autoAlpha: 0, scale: .6 });
  gsap.set(mapLabels, { autoAlpha: 0, y: 10 });
  gsap.set(image, { scale: 1.18, xPercent: -2.5, yPercent: 1.5, clipPath: 'inset(7% 6% 7% 6%)', filter: 'saturate(.28) sepia(.18) contrast(.9) brightness(.72)' });
  gsap.set(curtain, { clipPath: 'inset(0% 0% 0% 0%)', xPercent: 0, autoAlpha: 1 });
  gsap.set(revealFrame, { autoAlpha: 0, scale: .94 });

  if (parallaxLayer) {
    gsap.fromTo(parallaxLayer,
      { yPercent: -2.5 },
      {
        yPercent: 2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: map,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: map,
      start: 'top 58%',
      once: true,
      onEnter: () => map.classList.add('is-map-active'),
    },
    defaults: { ease: 'power2.out' },
  });

  timeline
    .to(curtain, { clipPath: 'inset(0% 0% 0% 100%)', xPercent: 4, autoAlpha: 0, duration: 1.25, ease: 'power3.inOut' }, 0)
    .to(image, { scale: 1.025, xPercent: 0, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', filter: 'saturate(.76) sepia(.03) contrast(1.05) brightness(1.03)', duration: 2.65, ease: 'power3.out' }, .12)
    .to(revealFrame, { autoAlpha: .5, scale: 1, duration: .85, ease: 'power2.out' }, .4)
    .to(radiusPaths, { autoAlpha: 1, duration: 1.1, stagger: .05, ease: 'power1.out' }, .35)
    .to(routePaths, { autoAlpha: 1, duration: .38, stagger: .08, ease: 'power1.out' }, .72)
    .to(routeFlowPaths, { autoAlpha: .9, duration: .45, stagger: .12 }, .92)
    .to(siteShape, { autoAlpha: 1, scale: 1, duration: .55, ease: 'back.out(1.6)' }, 1.05)
    .to(pin, { autoAlpha: 1, scale: 1, y: 0, duration: .7, ease: 'back.out(1.6)' }, 1.12)
    .to(pinPulse, { autoAlpha: .9, scale: 1, duration: .45, ease: 'back.out(1.8)' }, 1.16)
    .to(mapLabels, { autoAlpha: 1, y: 0, duration: .6, stagger: .14, ease: 'power2.out' }, 1.28)
    .call(() => {
      map.dataset.routeStatus = 'active';
      gsap.set(curtain, { autoAlpha: 0, clipPath: 'inset(0% 0% 0% 100%)', xPercent: 4 });
      gsap.to(image, { scale: 1.045, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut', overwrite: false });
      gsap.to(pin, { y: '-=4', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', overwrite: false });
      gsap.to(pinPulse, { scale: 2.8, autoAlpha: 0, duration: 1.8, repeat: -1, ease: 'power2.out', overwrite: false });
      gsap.to(siteShape, { opacity: .82, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', overwrite: false });
      routeFlowPaths.forEach((route, index) => {
        gsap.to(route, { strokeDashoffset: -88, duration: index === 0 ? 2.4 : 2.8, repeat: -1, ease: 'none', overwrite: false });
      });
    });
};

const setupAmenityMasterplan = () => {
  const root = document.querySelector<HTMLElement>('[data-amenity-masterplan]');
  if (!root) return;
  const canvases = Array.from(root.querySelectorAll<HTMLElement>('[data-amenity-canvas]'));
    const canvas = canvases.find((c) => c.offsetWidth > 0) || canvases[0];
    const mql = window.matchMedia('(max-width:900px)');
    let lastM = mql.matches;
    mql.addEventListener('change', (e) => { if (e.matches !== lastM) { lastM = e.matches; window.location.reload(); } });
  const zoomLabel = root.querySelector<HTMLElement>('[data-amenity-zoom]');
  const pins = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-amenity-pin]'));
  const focusButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-amenity-focus]'));
  const groups = Array.from(root.querySelectorAll<HTMLElement>('.amenity-group'));
  if (!canvas || !zoomLabel) return;

  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let selectedId = '';

  // Track which groups were opened explicitly by user clicking accordion summary
  const userOpenedGroups = new Set<HTMLElement>();
  groups.forEach((group) => {
    if (group.classList.contains('is-open')) {
      userOpenedGroups.add(group);
    }
    const summary = group.querySelector<HTMLButtonElement>('.amenity-group-summary');
    summary?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = group.classList.contains('is-open');
      if (isOpen) {
        group.classList.remove('is-open');
        summary.setAttribute('aria-expanded', 'false');
        userOpenedGroups.delete(group);
      } else {
        group.classList.add('is-open');
        summary.setAttribute('aria-expanded', 'true');
        userOpenedGroups.add(group);
      }
    });
  });

  // Hover-temporary opened group
  let tempOpenedGroup: HTMLElement | null = null;

  const getOwningGroup = (button: HTMLButtonElement | undefined): HTMLElement | null => {
    return button?.closest<HTMLElement>('.amenity-group') || null;
  };

  const setGroupOpenState = (group: HTMLElement, open: boolean) => {
    group.classList.toggle('is-open', open);
    const summary = group.querySelector<HTMLButtonElement>('.amenity-group-summary');
    summary?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const setActive = (id: string, isPreview = false) => {
    // Phân biệt hover (isPreview) vs chọn thật — hover chỉ is-preview, không sáng chói
    pins.forEach((pin) => {
      const isMatch = pin.dataset.amenityPin === id;
      pin.classList.toggle('is-active', !isPreview && isMatch);
      pin.classList.toggle('is-preview', isPreview && isMatch);
    });
    focusButtons.forEach((button) => {
      const match = button.dataset.amenityFocus === id;
      button.classList.toggle('is-active', !isPreview && match);
      button.classList.toggle('is-preview', isPreview && match);
      if (match && id && !isPreview) {
        button.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
    if (!isPreview) root.dataset.amenityActive = id;

    const targetButton = focusButtons.find((button) => button.dataset.amenityFocus === id);
    const owningGroup = getOwningGroup(targetButton);

    if (isPreview) {
      // Hover preview: chỉ highlight nhẹ, KHÔNG mở/đóng group, KHÔNG glow
    } else {
      if (owningGroup) {
        userOpenedGroups.add(owningGroup);
        setGroupOpenState(owningGroup, true);
      }
      tempOpenedGroup = null;
    }
  };

  const preview = (id: string) => {
    setActive(id, true);
  };

  const restoreSelection = () => {
    if (tempOpenedGroup && !userOpenedGroups.has(tempOpenedGroup)) {
      setGroupOpenState(tempOpenedGroup, false);
      tempOpenedGroup = null;
    }
    // dọn is-preview trước khi trả về chọn thật
    pins.forEach((p) => p.classList.remove('is-preview'));
    focusButtons.forEach((b) => b.classList.remove('is-preview'));
    setActive(selectedId, false);
  };

  const handleInteraction = (id: string) => {
    if (selectedId === id) {
      // Toggle close → chỉ bỏ chọn, KHÔNG zoom/reset pan
      selectedId = '';
      setActive('', false);
    } else {
      // Chỉ chọn/soi sáng pin + giữ group mở, KHÔNG zoom, KHÔNG pan
      selectedId = id;
      setActive(id, false);
    }
  };

  const applyZoom = () => {
    gsap.to(canvas, { scale: zoom, x: panX, y: panY, duration: reduceMotion ? 0 : .65, ease: 'power3.out', overwrite: 'auto' });
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  };

  root.querySelector<HTMLButtonElement>('[data-amenity-zoom-in]')?.addEventListener('click', () => { zoom = Math.min(1.55, zoom + .15); applyZoom(); });
  root.querySelector<HTMLButtonElement>('[data-amenity-zoom-out]')?.addEventListener('click', () => { zoom = Math.max(1, zoom - .15); if (zoom === 1) panX = panY = 0; applyZoom(); });

  // Drag-to-pan + pinch for masterplan canvas (mirrors setupMap's map stage)
  const aPointers = new Map<number, { x: number; y: number }>();
  let aPinchDist = 0;
  let aPinchScale = 1;
  let aDragX = 0;
  let aDragY = 0;
  let aDragging = false;
  let aLastTap = 0;

  canvas.addEventListener('pointerdown', (e) => {
    const now = Date.now();
    if (now - aLastTap < 280 && aPointers.size === 0) {
      zoom = Math.min(1.55, zoom + .2);
      applyZoom();
      aLastTap = 0;
      return;
    }
    aLastTap = now;
    aPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
    if (aPointers.size === 1) {
      aDragging = true;
      aDragX = e.clientX - panX;
      aDragY = e.clientY - panY;
    } else if (aPointers.size === 2) {
      aDragging = false;
      const pts = Array.from(aPointers.values());
      aPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      aPinchScale = zoom;
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!aPointers.has(e.pointerId)) return;
    aPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (aPointers.size === 2 && aPinchDist > 0) {
      const pts = Array.from(aPointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      zoom = Math.min(1.55, Math.max(1, aPinchScale * (dist / aPinchDist)));
      if (zoom === 1) panX = panY = 0;
      applyZoom();
      return;
    }
    if (!aDragging) return;
    const crect = canvas.parentElement?.getBoundingClientRect();
    const cw = crect ? crect.width : canvas.clientWidth;
    const ch = crect ? crect.height : canvas.clientHeight;
    // Lim pan theo độ tràn THỰC của ảnh fit so với khung canvas (ảnh cao/rộng hơn khung vẫn kéo được ở zoom 1)
    const fitEl = canvas.querySelector<HTMLElement>('[data-amenity-fit]');
    const frect = fitEl?.getBoundingClientRect();
    const limX = Math.max(40, ((frect ? frect.width : cw) * zoom - cw) / 2 + 20);
    const limY = Math.max(40, ((frect ? frect.height : ch) * zoom - ch) / 2 + 20);
    panX = Math.max(-limX, Math.min(limX, e.clientX - aDragX));
    panY = Math.max(-limY, Math.min(limY, e.clientY - aDragY));
    gsap.set(canvas, { x: panX, y: panY });
  });

  const aEnd = (e: PointerEvent) => {
    aPointers.delete(e.pointerId);
    if (aPointers.size <= 1) {
      aDragging = aPointers.size === 1;
      aPinchDist = 0;
    }
  };
  canvas.addEventListener('pointerup', aEnd);
  canvas.addEventListener('pointercancel', aEnd);

  pins.forEach((pin) => {
    const id = pin.dataset.amenityPin || '';
    pin.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') preview(id);
    });
    pin.addEventListener('focus', () => preview(id));
    pin.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') restoreSelection();
    });
    pin.addEventListener('blur', restoreSelection);
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      handleInteraction(id);
    });
  });

  focusButtons.forEach((button) => {
    const id = button.dataset.amenityFocus || '';
    // Bỏ hover sáng chữ phải: chỉ click mới soi sáng (is-active), rê vào không đổi màu
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      handleInteraction(id);
    });
  });

  if (reduceMotion) return;

  const heading = root.querySelector('.amenity-masterplan-heading');
  const railIntro = root.querySelector('.amenity-rail-intro');
  const listPrimaryButtons = root.querySelectorAll('.amenity-list-primary button');
  const groupElements = root.querySelectorAll('.amenity-group');

  gsap.set(heading, { y: 28, autoAlpha: 0 });
  gsap.set(canvas, { scale: 1.08, autoAlpha: .72 });
  gsap.set(pins, { autoAlpha: 0, scale: .72 });
  if (railIntro) gsap.set(railIntro, { y: 20, autoAlpha: 0 });
  if (listPrimaryButtons.length) gsap.set(listPrimaryButtons, { y: 14, autoAlpha: 0 });
  if (groupElements.length) gsap.set(groupElements, { y: 16, autoAlpha: 0 });

  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 78%', once: true } });

  tl.to(heading, { y: 0, autoAlpha: 1, duration: .85, ease: 'power3.out' })
    .to(canvas, { scale: 1, autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, '<.08')
    .to(pins, { autoAlpha: 1, scale: 1, duration: .55, stagger: .05, ease: 'back.out(1.5)' }, '<.25');

  if (railIntro) {
    tl.to(railIntro, { y: 0, autoAlpha: 1, duration: .6, ease: 'power2.out' }, '<.15');
  }
  if (listPrimaryButtons.length) {
    tl.to(listPrimaryButtons, { y: 0, autoAlpha: 1, duration: .45, stagger: .07, ease: 'power2.out' }, '-=.3');
  }
  if (groupElements.length) {
    tl.to(groupElements, { y: 0, autoAlpha: 1, duration: .55, stagger: .12, ease: 'power2.out' }, '-=.2');
  }
};

if (!reduceMotion) {
  setupHero();
  setupChapters();
}
setupCounters();
setupMap();
setupAmenityMasterplan();
setupCinematicVideo();

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
