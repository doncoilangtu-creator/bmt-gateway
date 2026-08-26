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
  const radiusPaths = Array.from(map.querySelectorAll<SVGPathElement>('[data-pdf-radius="true"]'));
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
  if (!stage || !image) return;

  let manualScale = 1;
  let panX = 0;
  let panY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let mapRect = map.getBoundingClientRect();

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

  stage.addEventListener('pointerdown', (event) => {
    dragging = true;
    mapRect = map.getBoundingClientRect();
    startX = event.clientX - panX;
    startY = event.clientY - panY;
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    // pan limit scales with zoom: centered expansion + the stage's 6% inset bleed
    const limX = mapRect.width * (manualScale - 1) / 2 + mapRect.width * .06;
    const limY = mapRect.height * (manualScale - 1) / 2 + mapRect.height * .06;
    panX = Math.max(-limX, Math.min(limX, event.clientX - startX));
    panY = Math.max(-limY, Math.min(limY, event.clientY - startY));
    gsap.set(stage, { x: panX, y: panY });
  });
  const endDrag = () => { dragging = false; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

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
  const canvas = root.querySelector<HTMLElement>('[data-amenity-canvas]');
  const zoomLabel = root.querySelector<HTMLElement>('[data-amenity-zoom]');
  const pins = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-amenity-pin]'));
  const focusButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-amenity-focus]'));
  const groups = Array.from(root.querySelectorAll<HTMLElement>('.amenity-group'));
  if (!canvas || !zoomLabel) return;

  let zoom = 1;
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
    pins.forEach((pin) => pin.classList.toggle('is-active', pin.dataset.amenityPin === id));
    focusButtons.forEach((button) => {
      const match = button.dataset.amenityFocus === id;
      button.classList.toggle('is-active', match);
      if (match && id) {
        button.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
    root.dataset.amenityActive = id;

    const targetButton = focusButtons.find((button) => button.dataset.amenityFocus === id);
    const owningGroup = getOwningGroup(targetButton);

    if (isPreview) {
      if (owningGroup && !owningGroup.classList.contains('is-open')) {
        // Close previous temp if different
        if (tempOpenedGroup && tempOpenedGroup !== owningGroup && !userOpenedGroups.has(tempOpenedGroup)) {
          setGroupOpenState(tempOpenedGroup, false);
        }
        tempOpenedGroup = owningGroup;
        setGroupOpenState(owningGroup, true);
      }
    } else {
      // Permanent selection
      if (owningGroup) {
        userOpenedGroups.add(owningGroup);
        setGroupOpenState(owningGroup, true);
      }
      tempOpenedGroup = null;
    }
  };

  const preview = (id: string) => setActive(id, true);

  const restoreSelection = () => {
    if (tempOpenedGroup && !userOpenedGroups.has(tempOpenedGroup)) {
      setGroupOpenState(tempOpenedGroup, false);
      tempOpenedGroup = null;
    }
    setActive(selectedId, false);
  };

  const applyZoom = () => {
    gsap.to(canvas, { scale: zoom, duration: reduceMotion ? 0 : .65, ease: 'power3.out' });
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  };

  root.querySelector<HTMLButtonElement>('[data-amenity-zoom-in]')?.addEventListener('click', () => { zoom = Math.min(1.55, zoom + .15); applyZoom(); });
  root.querySelector<HTMLButtonElement>('[data-amenity-zoom-out]')?.addEventListener('click', () => { zoom = Math.max(1, zoom - .15); applyZoom(); });

  pins.forEach((pin) => {
    const id = pin.dataset.amenityPin || '';
    pin.addEventListener('pointerenter', () => preview(id));
    pin.addEventListener('mouseenter', () => preview(id));
    pin.addEventListener('focus', () => preview(id));
    pin.addEventListener('pointerleave', restoreSelection);
    pin.addEventListener('mouseleave', restoreSelection);
    pin.addEventListener('blur', restoreSelection);
    pin.addEventListener('click', () => { selectedId = id; setActive(id, false); });
  });

  focusButtons.forEach((button) => {
    const id = button.dataset.amenityFocus || '';
    button.addEventListener('pointerenter', () => preview(id));
    button.addEventListener('mouseenter', () => preview(id));
    button.addEventListener('focus', () => preview(id));
    button.addEventListener('pointerleave', restoreSelection);
    button.addEventListener('mouseleave', restoreSelection);
    button.addEventListener('blur', restoreSelection);
    button.addEventListener('click', () => { selectedId = id; setActive(id, false); });
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
