/* =============================================================================
 * "HOW IT WORKS" 3D BOX — a moving box that reacts to the 4 steps:
 *   01 Request        label slides onto the box
 *   02 Quote/confirm  flaps open, items drop in
 *   03 Moving day     flaps close, tape runs across, box lifts and travels
 *   04 Done           box set down, flaps open, red "LIVRÉ" stamp
 * ========================================================================== */

import {
  Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Group, Mesh, BoxGeometry,
  PlaneGeometry, CylinderGeometry, MeshStandardMaterial, MeshBasicMaterial, ShadowMaterial, GridHelper,
} from 'three';
import { createRenderer, visibleLoop, autoResize, canvasTexture, fontsReady, condensed } from './common.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
const range = (p, a, b) => smooth(clamp01((p - a) / (b - a)));

function faceTexture(draw) {
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#b98a5b';
    ctx.fillRect(0, 0, w, h);
    // subtle fibres
    ctx.fillStyle = 'rgba(80,50,20,0.06)';
    for (let i = 0; i < 40; i++) ctx.fillRect(0, Math.random() * h, w, 1 + Math.random() * 2);
    draw(ctx, w, h);
  });
}

export async function createBoxScene(canvas, s) {
  await fontsReady();
  const renderer = createRenderer(canvas, { shadows: true });
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(3.4, 2.6, 4.2);
  camera.lookAt(0, 0.55, 0);

  scene.add(new HemisphereLight(0xffffff, 0x222222, 1.3));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
  const rim = new DirectionalLight(0xff3b2f, 1.2);
  rim.position.set(-4, 2, -3);
  scene.add(key, rim);

  const floor = new Mesh(new PlaneGeometry(20, 20), new ShadowMaterial({ opacity: 0.55 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  const grid = new GridHelper(12, 24, 0x262626, 0x1c1c1c);
  grid.position.y = 0.001;
  scene.add(floor, grid);

  // ---- Box textures ----
  const front = faceTexture((ctx, w, h) => {
    ctx.fillStyle = '#2a1c10';
    ctx.font = '900 120px "Archivo Variable", Impact, sans-serif';
    condensed(ctx);
    ctx.textAlign = 'center';
    ctx.fillText('LODICO', w / 2, 150);
    ctx.font = '700 26px "JetBrains Mono Variable", monospace';
    ctx.fillText('TRANSPORT · MTL ⇄ LVL', w / 2, 196);
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#2a1c10';
    [w / 2 - 60, w / 2 + 20].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 470); ctx.lineTo(x, 380);
      ctx.moveTo(x - 26, 404); ctx.lineTo(x, 376); ctx.lineTo(x + 26, 404);
      ctx.stroke();
    });
    ctx.font = '700 22px "JetBrains Mono Variable", monospace';
    ctx.fillText(s.up, w / 2, 500);
  });
  const side = faceTexture((ctx, w, h) => {
    ctx.strokeStyle = '#c40500';
    ctx.lineWidth = 10;
    ctx.strokeRect(60, 150, w - 120, 170);
    ctx.fillStyle = '#c40500';
    ctx.font = '900 130px "Archivo Variable", Impact, sans-serif';
    condensed(ctx);
    ctx.textAlign = 'center';
    ctx.fillText(s.fragile, w / 2, 285);
    // glass icon
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 34, 360); ctx.lineTo(w / 2 + 34, 360); ctx.lineTo(w / 2 + 24, 420);
    ctx.quadraticCurveTo(w / 2, 450, w / 2 - 24, 420); ctx.closePath();
    ctx.moveTo(w / 2, 440); ctx.lineTo(w / 2, 480); ctx.moveTo(w / 2 - 26, 482); ctx.lineTo(w / 2 + 26, 482);
    ctx.stroke();
  });
  const plain = faceTexture(() => {});
  const inner = new MeshStandardMaterial({ color: 0x7a5636, roughness: 1 });
  const m = (map) => new MeshStandardMaterial({ map, roughness: 0.95 });

  // ---- Box body (open top) ----
  const W = 1.5, H = 1.0, D = 1.05, T = 0.025;
  const box = new Group();
  const wall = (w, h, d, x, y, z, outer, faceIdx) => {
    const mats = Array(6).fill(inner);
    mats[faceIdx] = outer;
    const mesh = new Mesh(new BoxGeometry(w, h, d), mats);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    box.add(mesh);
  };
  wall(W, H, T, 0, H / 2, D / 2, m(front), 4);
  wall(W, H, T, 0, H / 2, -D / 2, m(plain), 5);
  wall(T, H, D, W / 2, H / 2, 0, m(side), 0);
  wall(T, H, D, -W / 2, H / 2, 0, m(side), 1);
  wall(W, T, D, 0, T / 2, 0, inner, 2);

  // ---- Flaps ----
  const flapMat = [inner, inner, m(plain), inner, inner, inner];
  const flaps = [];
  const flap = (size, pivotPos, meshOffset, axis, sign, y) => {
    const pivot = new Group();
    pivot.position.set(pivotPos[0], H + y, pivotPos[2]);
    const mesh = new Mesh(new BoxGeometry(...size), flapMat);
    mesh.position.set(...meshOffset);
    mesh.castShadow = true;
    pivot.add(mesh);
    box.add(pivot);
    flaps.push({ pivot, axis, sign });
  };
  flap([W - 0.02, T, D / 2], [0, 0, D / 2], [0, 0, -D / 4], 'x', 1, 0.03);
  flap([W - 0.02, T, D / 2], [0, 0, -D / 2], [0, 0, D / 4], 'x', -1, 0.03);
  flap([D / 2, T, D - 0.02], [W / 2, 0, 0], [-D / 4, 0, 0], 'z', -1, 0.005);
  flap([D / 2, T, D - 0.02], [-W / 2, 0, 0], [D / 4, 0, 0], 'z', 1, 0.005);

  // ---- Tape across the closed top ----
  const tape = new Mesh(new BoxGeometry(0.22, 0.012, D + 0.06), new MeshStandardMaterial({ color: 0xe8e3d6, roughness: 0.4 }));
  tape.position.set(0, H + 0.05, 0);
  box.add(tape);

  // ---- Shipping label + stamp on the front ----
  const labelTex = canvasTexture(512, 320, (ctx, w, h) => {
    ctx.fillStyle = '#f2efe8';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, w, 70);
    ctx.fillStyle = '#f2efe8';
    ctx.font = '700 30px "JetBrains Mono Variable", monospace';
    ctx.fillText(s.label, 22, 46);
    ctx.fillStyle = '#0a0a0a';
    ctx.font = '700 26px "JetBrains Mono Variable", monospace';
    ctx.fillText('A · LAVAL', 22, 120);
    ctx.fillText('B · MONTRÉAL', 22, 160);
    ctx.fillStyle = '#c40500';
    ctx.fillText('LT-0001', 22, 200);
    ctx.fillStyle = '#0a0a0a';
    let x = 22;
    for (let i = 0; i < 46; i++) {
      const bw = 2 + ((i * 7) % 5);
      ctx.fillRect(x, 230, bw, 70);
      x += bw + 3;
    }
  });
  const label = new Mesh(new PlaneGeometry(0.62, 0.39), new MeshStandardMaterial({ map: labelTex, roughness: 0.6 }));
  label.position.set(0.32, 0.4, D / 2 + 0.016);
  box.add(label);

  const stampTex = canvasTexture(512, 200, (ctx, w, h) => {
    ctx.strokeStyle = '#e10600';
    ctx.lineWidth = 16;
    ctx.strokeRect(12, 12, w - 24, h - 24);
    ctx.lineWidth = 5;
    ctx.strokeRect(32, 32, w - 64, h - 64);
    ctx.fillStyle = '#e10600';
    ctx.font = '900 120px "Archivo Variable", Impact, sans-serif';
    condensed(ctx);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.delivered, w / 2, h / 2 + 8);
  });
  const stamp = new Mesh(
    new PlaneGeometry(0.56, 0.22),
    new MeshBasicMaterial({ map: stampTex, transparent: true, depthWrite: false }),
  );
  stamp.position.set(0.3, 0.43, D / 2 + 0.024);
  stamp.rotation.z = 0.2;
  box.add(stamp);

  // ---- Items dropping in at step 2 ----
  const drops = [
    new Mesh(new BoxGeometry(0.4, 0.22, 0.3), new MeshStandardMaterial({ color: 0xc80500, roughness: 0.6 })),
    new Mesh(new BoxGeometry(0.34, 0.34, 0.34), m(plain)),
    new Mesh(new CylinderGeometry(0.12, 0.12, 0.44, 10), new MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.4 })),
  ];
  const dropSlots = [[-0.35, 0.14, 0.1], [0.3, 0.2, -0.15], [0.05, 0.25, 0.25]];
  drops.forEach((d) => {
    d.castShadow = true;
    box.add(d);
  });

  scene.add(box);

  let progress = 0;
  let drawn = -1;
  let needsDraw = true;
  const resize = (w, h) => {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    needsDraw = true;
  };
  const stopResize = autoResize(canvas, renderer, resize);

  function frame() {
    if (!needsDraw && drawn === progress) return;
    needsDraw = false;
    drawn = progress;
    const p = progress;
    const time = p * 40; // wobble is driven by scroll, not by a clock

    const labelIn = range(p, 0.02, 0.14);
    label.scale.setScalar(Math.max(0.001, labelIn));
    label.position.x = 0.32 + (1 - labelIn) * 0.6;

    const open = range(p, 0.25, 0.37) * (1 - range(p, 0.5, 0.6)) + range(p, 0.8, 0.9);
    flaps.forEach((f, i) => {
      const delay = i < 2 ? 0 : 0.0; // long flaps sit on top of short ones
      const a = clamp01(open - delay) * (i < 2 ? 2.35 : 2.1) * f.sign;
      if (f.axis === 'x') f.pivot.rotation.x = a;
      else f.pivot.rotation.z = a;
      f.pivot.position.y = H + (i < 2 ? 0.03 : 0.005) * (1 - open) + 0.005;
    });

    const tapeOn = range(p, 0.58, 0.66) * (p < 0.79 ? 1 : 0);
    tape.visible = tapeOn > 0.01;
    tape.scale.z = Math.max(0.001, tapeOn);

    drops.forEach((d, i) => {
      const t = range(p, 0.36 + i * 0.04, 0.46 + i * 0.04);
      const [x, y, z] = dropSlots[i];
      d.position.set(x, y + (1 - t) * (2.2 + i * 0.3), z);
      d.rotation.y = (1 - t) * 2 + i;
      d.visible = t > 0.001;
    });

    const travel = range(p, 0.62, 0.7) * (1 - range(p, 0.74, 0.8));
    box.position.y = travel * 0.45 + Math.sin(time * 6) * 0.02 * travel;
    box.position.x = Math.sin(range(p, 0.62, 0.8) * Math.PI) * 0.3;
    box.rotation.z = travel * 0.06;
    box.rotation.y = -0.55 + p * 0.9 + Math.sin(time * 0.8) * 0.03;

    const st = range(p, 0.88, 0.95);
    stamp.visible = st > 0.01;
    stamp.scale.setScalar(1 + (1 - st) * 1.4);
    stamp.material.opacity = st;

    renderer.render(scene, camera);
  }

  const stopLoop = visibleLoop(canvas, frame);
  frame();
  return {
    setProgress(p) {
      progress = p;
    },
    dispose() {
      stopLoop();
      stopResize();
      renderer.dispose();
    },
  };
}
