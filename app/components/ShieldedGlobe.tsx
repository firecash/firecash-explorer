// The shielded globe — the explorer's hero visual.
//
// A dot-matrix Earth that pulses once for every REAL transaction the live feed
// sees, at a RANDOM land point: the frequency is true, the locations are
// deliberately unknowable — which is exactly the product. Arcs occasionally
// link two random points to read as "value moved; endpoints private".
//
// Self-contained three.js scene: no textures fetched, land dots baked into
// app/assets/landdots.json, canvas-generated sprites, auto-rotation with
// drag-to-spin inertia, paused when the tab is hidden or scrolled away.

import dots from "../assets/landdots.json";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const TEAL = new THREE.Color("#17d6be");
const TEAL_BRIGHT = new THREE.Color("#5ff2df");
const DOT = new THREE.Color("#37c9b5");

const R = 1;

function latLngToVec3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/** Round soft-edged sprite texture, drawn on a canvas (nothing fetched). */
function discTexture(inner: string, outer: string): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

interface Pulse {
  sprite: THREE.Sprite;
  ring: THREE.Mesh;
  born: number;
}

interface Arc {
  line: THREE.Line;
  geom: THREE.BufferGeometry;
  born: number;
  points: number;
}

/**
 * `txIds`: the latest transaction ids from the live feed. Every id not seen
 * before spawns one pulse — real activity, randomized location.
 */
export default function ShieldedGlobe({ txIds }: { txIds: string[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef<Set<string>>(new Set());
  const spawnQueueRef = useRef(0);
  const primedRef = useRef(false);

  // Feed watcher: count unseen txids into a spawn queue the render loop drains.
  useEffect(() => {
    let fresh = 0;
    for (const id of txIds) {
      if (!seenRef.current.has(id)) {
        seenRef.current.add(id);
        fresh++;
      }
    }
    // The first snapshot is history, not "just happened" — prime silently, then
    // give the scene a couple of pulses so it never opens dead.
    if (!primedRef.current) {
      primedRef.current = true;
      spawnQueueRef.current = Math.min(2, fresh);
      return;
    }
    spawnQueueRef.current = Math.min(spawnQueueRef.current + fresh, 6);
    if (seenRef.current.size > 4000) seenRef.current = new Set(txIds);
  }, [txIds]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 10);
    camera.position.set(0, 0.25, 3.05);
    camera.lookAt(0, 0, 0);

    const globe = new THREE.Group();
    // A pleasant opening pose (Atlantic between the Americas, Europe & Africa).
    globe.rotation.y = 2.1;
    globe.rotation.x = 0.28;
    scene.add(globe);

    // Occluder sphere: hides the far-side dots so the globe reads as solid.
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.992, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0e1118 }),
    );
    globe.add(body);

    // Faint wire graticule for depth.
    const grid = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.994, 36, 24),
      new THREE.MeshBasicMaterial({ color: 0x1b2733, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    globe.add(grid);

    // The land dot-matrix.
    const positions = new Float32Array(dots.length * 3);
    (dots as [number, number][]).forEach(([lat, lng], i) => {
      const v = latLngToVec3(lat, lng, R);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    });
    const dotGeom = new THREE.BufferGeometry();
    dotGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dotTex = discTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)");
    const dotMat = new THREE.PointsMaterial({
      size: 0.028,
      map: dotTex,
      color: DOT,
      transparent: true,
      opacity: 1,
      alphaTest: 0.05,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    globe.add(new THREE.Points(dotGeom, dotMat));

    // Atmosphere halo behind everything.
    const haloTex = discTexture("rgba(23,214,190,0.24)", "rgba(23,214,190,0)");
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false }));
    halo.scale.setScalar(3.1);
    halo.position.z = -0.4;
    scene.add(halo);

    // --- Transaction pulses -------------------------------------------------
    const pulseTex = discTexture("rgba(95,242,223,1)", "rgba(23,214,190,0)");
    const pulses: Pulse[] = [];
    const arcs: Arc[] = [];
    const PULSE_LIFE = 2.0;
    const ARC_LIFE = 2.6;

    const randomDot = () => (dots as [number, number][])[Math.floor(Math.random() * dots.length)];

    const spawnPulse = (now: number) => {
      const [lat, lng] = randomDot();
      const pos = latLngToVec3(lat, lng, R * 1.005);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: pulseTex, transparent: true, depthWrite: false, color: TEAL_BRIGHT }),
      );
      sprite.position.copy(pos);
      sprite.scale.setScalar(0.001);
      globe.add(sprite);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 1, 40),
        new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
      );
      ring.position.copy(pos);
      ring.lookAt(pos.clone().multiplyScalar(2));
      ring.scale.setScalar(0.001);
      globe.add(ring);
      pulses.push({ sprite, ring, born: now });

      // Roughly every third pulse also draws a private arc to a second point.
      if (Math.random() < 0.34 && arcs.length < 3) {
        const [lat2, lng2] = randomDot();
        const a = latLngToVec3(lat, lng, R * 1.002);
        const b = latLngToVec3(lat2, lng2, R * 1.002);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const lift = 1 + a.distanceTo(b) * 0.45;
        mid.normalize().multiplyScalar(R * lift);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const pts = curve.getPoints(48);
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(
          geom,
          new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.75, depthWrite: false }),
        );
        geom.setDrawRange(0, 0);
        globe.add(line);
        arcs.push({ line, geom, born: now, points: pts.length });
      }
    };

    // --- Interaction: drag to spin, with inertia ---------------------------
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    const el = renderer.domElement;
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y"; // vertical page scroll still works on touch
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = dx * 0.005;
      velY = dy * 0.003;
      globe.rotation.y += velX;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + velY, -0.9, 0.9);
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      el.style.cursor = "grab";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    // --- Sizing / visibility ------------------------------------------------
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver((entries) => (visible = entries[0]?.isIntersecting ?? true));
    io.observe(mount);

    // --- Render loop --------------------------------------------------------
    let raf = 0;
    let lastSpawn = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const dt = clock.getDelta();
      const now = clock.elapsedTime;

      if (!dragging) {
        // Slow ambient rotation + inertia carried out of the last drag.
        globe.rotation.y += 0.045 * dt + velX * 0.9;
        globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + velY * 0.9, -0.9, 0.9);
        velX *= 0.94;
        velY *= 0.94;
      }

      // Drain the spawn queue at a natural rhythm (≤ ~6/s, never a machine-gun).
      if (spawnQueueRef.current > 0 && now - lastSpawn > 0.16) {
        spawnQueueRef.current--;
        lastSpawn = now;
        spawnPulse(now);
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const t = (now - p.born) / PULSE_LIFE;
        if (t >= 1) {
          globe.remove(p.sprite);
          globe.remove(p.ring);
          (p.sprite.material as THREE.SpriteMaterial).dispose();
          (p.ring.material as THREE.Material).dispose();
          p.ring.geometry.dispose();
          pulses.splice(i, 1);
          continue;
        }
        const ease = 1 - Math.pow(1 - t, 3);
        p.sprite.scale.setScalar(0.02 + 0.1 * ease);
        (p.sprite.material as THREE.SpriteMaterial).opacity = 1 - t;
        p.ring.scale.setScalar(0.01 + 0.16 * ease);
        (p.ring.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - t);
      }

      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        const t = (now - a.born) / ARC_LIFE;
        if (t >= 1) {
          globe.remove(a.line);
          a.geom.dispose();
          (a.line.material as THREE.Material).dispose();
          arcs.splice(i, 1);
          continue;
        }
        // Draw out over the first 40%, hold, fade the last 30%.
        const draw = Math.min(1, t / 0.4);
        a.geom.setDrawRange(0, Math.floor(a.points * draw));
        (a.line.material as THREE.LineBasicMaterial).opacity = t > 0.7 ? 0.75 * (1 - (t - 0.7) / 0.3) : 0.75;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      renderer.dispose();
      dotGeom.dispose();
      dotMat.dispose();
      dotTex.dispose();
      pulseTex.dispose();
      haloTex.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
