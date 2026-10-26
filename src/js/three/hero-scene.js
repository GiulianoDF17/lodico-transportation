/* =============================================================================
 * HERO 3D SCENE — low-poly Lodico truck built from primitives.
 * Scroll progress p (0 → 1):
 *   0.00–0.46  rear door rolls up, boxes + furniture load into the truck
 *   0.44–0.60  camera lifts from street level to an aerial view
 *   0.56–0.96  truck drives Laval → pont Pie-IX → Montréal-Nord → downtown,
 *              the red route draws itself behind it
 * The map uses the same stylized geography as the SVG service-area map.
 * ========================================================================== */

import {
  Scene, PerspectiveCamera, Color, Fog, HemisphereLight, DirectionalLight, Group, Mesh,
  BoxGeometry, CylinderGeometry, PlaneGeometry, OctahedronGeometry, TorusGeometry,
  MeshStandardMaterial, MeshLambertMaterial, MeshBasicMaterial, Shape, ExtrudeGeometry, Vector3,
  CatmullRomCurve3, TubeGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, LineDashedMaterial,
  BufferGeometry, Line, GridHelper, DoubleSide, MathUtils,
} from 'three';
import { montreal, laval, riveNord, riveSud, bridges, heroRoute, base, roads } from '../../content/map-data.js';
import { createRenderer, visibleLoop, autoResize, canvasTexture, textSprite, fontsReady, condensed } from './common.js';

const S = 2; // map units → world units
const CX = 57;
const CY = 38;
const LAND = 0.4; // land height
const W = (x, y, h = 0) => new Vector3((x - CX) * S, h, -(y - CY) * S);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* ---------- Map ---------- */
function shapeFrom(poly) {
  const sh = new Shape();
  poly.forEach(([x, y], i) => (i ? sh.lineTo((x - CX) * S, (y - CY) * S) : sh.moveTo((x - CX) * S, (y - CY) * S)));
  return sh;
}
function landMesh(poly, depth, color, edgeColor) {
  const geo = new ExtrudeGeometry(shapeFrom(poly), { depth, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  const mesh = new Mesh(geo, new MeshLambertMaterial({ color }));
  mesh.receiveShadow = true;
  const edges = new LineSegments(new EdgesGeometry(geo, 30), new LineBasicMaterial({ color: edgeColor }));
  const g = new Group();
  g.add(mesh, edges);
  return g;
}
function yAt(line, x) {
  for (let i = 0; i < line.length - 1; i++) {
    const [x1, y1] = line[i];
    const [x2, y2] = line[i + 1];
    if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2)) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return line[0][1];
}

function buildMap(scene, strings) {
  const map = new Group();
  const water = new Mesh(new PlaneGeometry(600, 600), new MeshLambertMaterial({ color: 0x060607 }));
  water.rotation.x = -Math.PI / 2;
  water.receiveShadow = true;
  map.add(water);
  const grid = new GridHelper(400, 200, 0x161616, 0x141414);
  grid.position.y = 0.01;
  map.add(grid);

  map.add(landMesh(riveNord, 0.25, 0x101010, 0x232323));
  map.add(landMesh(riveSud, 0.25, 0x101010, 0x232323));
  map.add(landMesh(laval, LAND, 0x1d1d1d, 0x555555));
  map.add(landMesh(montreal, LAND, 0x1d1d1d, 0x555555));

  // Roads (faint)
  const roadMat = new LineBasicMaterial({ color: 0x3a3a3a });
  roads.forEach((r) => {
    map.add(new Line(new BufferGeometry().setFromPoints(r.map(([x, y]) => W(x, y, LAND + 0.02))), roadMat));
  });

  // Bridges over the Rivière des Prairies
  const mtlNorth = montreal.slice(0, 11);
  const lavalSouth = laval.slice(6).reverse();
  bridges.forEach((b) => {
    const y1 = yAt(lavalSouth, b.x) + 0.4;
    const y2 = yAt(mtlNorth, b.x) - 0.4;
    const len = (y1 - y2) * S;
    const isPie = b.id === 'pie-ix';
    const deck = new Mesh(
      new BoxGeometry(isPie ? 0.9 : 0.5, 0.12, len),
      new MeshLambertMaterial({ color: isPie ? 0x4a4a4a : 0x2c2c2c }),
    );
    deck.position.copy(W(b.x, (y1 + y2) / 2, LAND + 0.04));
    deck.receiveShadow = true;
    map.add(deck);
  });

  // Labels
  const lab = (text, x, y, opts) => {
    const s = textSprite(text, opts);
    s.position.copy(W(x, y, opts.lift ?? 1.2));
    map.add(s);
    return s;
  };
  lab('LAVAL', 50, 53.5, { height: 4.6, color: '#4a4a4a' });
  lab(strings.lang === 'fr' ? 'MONTRÉAL' : 'MONTREAL', 50, 32, { height: 4.6, color: '#4a4a4a' });
  lab('RIVIÈRE DES PRAIRIES', 73, 45.6, { height: 0.75, color: '#6b6b6b', font: 'mono', weight: 700, lift: 0.6 });
  lab('PONT PIE-IX', 64, 45.3, { height: 0.85, color: '#f2efe8', font: 'mono', weight: 700, bg: '#0a0a0a' });
  lab('BASE LODICO — MONTRÉAL-NORD', 52.5, 40.2, { height: 0.85, color: '#ffffff', font: 'mono', weight: 700, bg: '#e10600', lift: 0.9 });

  // Lodico base marker
  const red = new MeshStandardMaterial({ color: 0xe10600, emissive: 0x500000, roughness: 0.5 });
  const pole = new Mesh(new BoxGeometry(0.35, 1.4, 0.35), red);
  pole.position.copy(W(base[0], base[1], LAND + 0.7));
  const gem = new Mesh(new OctahedronGeometry(0.55), red);
  gem.position.copy(W(base[0], base[1], LAND + 2));
  map.add(pole, gem);

  scene.add(map);
  return { gem };
}

/* ---------- Route ---------- */
function buildRoute(scene) {
  const pts = heroRoute.map(([x, y], i) => W(x, y, LAND + (i === 2 || i === 3 ? 0.14 : 0.06)));
  const curve = new CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  const segs = 480;
  const radial = 6;
  const tube = new Mesh(new TubeGeometry(curve, segs, 0.2, radial, false), new MeshBasicMaterial({ color: 0xe10600 }));
  tube.geometry.setDrawRange(0, 0);
  scene.add(tube);

  // Dashed preview of the full route
  const dashed = new Line(
    new BufferGeometry().setFromPoints(curve.getSpacedPoints(200)),
    new LineDashedMaterial({ color: 0x5a5a5a, dashSize: 0.6, gapSize: 0.5 }),
  );
  dashed.computeLineDistances();
  dashed.position.y = 0.02;
  scene.add(dashed);

  // End marker (B)
  const ring = new Mesh(new TorusGeometry(0.9, 0.14, 6, 24), new MeshBasicMaterial({ color: 0xe10600 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(curve.getPointAt(1));
  ring.position.y = LAND + 0.08;
  scene.add(ring);

  return {
    curve,
    draw(u) {
      tube.geometry.setDrawRange(0, Math.floor(u * segs) * radial * 6);
    },
  };
}

/* ---------- Truck (forward = +X, origin on the ground) ---------- */
function liveryTexture() {
  return canvasTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e10600';
    ctx.fillRect(0, h * 0.7, w, h * 0.09);
    ctx.fillRect(0, h * 0.82, w, h * 0.02);
    ctx.fillStyle = '#f2efe8';
    ctx.font = '900 300px "Archivo Variable", Impact, sans-serif';
    condensed(ctx);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('LODICO', w / 2, h * 0.6);
    ctx.font = '700 34px "JetBrains Mono Variable", monospace';
    ctx.fillStyle = '#9a9a9a';
    ctx.fillText('TRANSPORT · MONTRÉAL ⇄ LAVAL', w / 2, h * 0.95);
  });
}
function doorTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d6d1c6';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#a9a398';
    for (let y = 10; y < h; y += 22) ctx.fillRect(0, y, w, 3);
    ctx.fillStyle = '#e10600';
    ctx.fillRect(w * 0.42, h - 30, w * 0.16, 12);
  });
}
function cardboardTexture() {
  return canvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#b98a5b';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(232,227,214,0.85)';
    ctx.fillRect(w * 0.42, 0, w * 0.16, h);
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(18, 48); ctx.lineTo(28, 34); ctx.lineTo(38, 48);
    ctx.moveTo(28, 34); ctx.lineTo(28, 62);
    ctx.stroke();
  });
}

function buildTruck() {
  const g = new Group();
  const mat = {
    body: new MeshStandardMaterial({ color: 0x0e0e0e, roughness: 0.5, metalness: 0.25 }),
    red: new MeshStandardMaterial({ color: 0xc80500, roughness: 0.42, metalness: 0.2 }),
    dark: new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85 }),
    glass: new MeshStandardMaterial({ color: 0x050505, roughness: 0.08, metalness: 0.8 }),
    inner: new MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 }),
    floor: new MeshStandardMaterial({ color: 0x4a3524, roughness: 0.9 }),
    tire: new MeshStandardMaterial({ color: 0x080808, roughness: 0.9 }),
    hub: new MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.4, metalness: 0.6 }),
    tail: new MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff1a0a, emissiveIntensity: 1.6 }),
    head: new MeshStandardMaterial({ color: 0xfff6e0, emissive: 0xfff2d0, emissiveIntensity: 1.2 }),
  };
  const livery = new MeshStandardMaterial({ map: liveryTexture(), roughness: 0.5, metalness: 0.2 });
  const add = (geo, m, x, y, z, cast = true) => {
    const mesh = new Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = cast;
    mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };

  const L = 1.6, H = 1.05, Wd = 0.96, x0 = -1.25, y0 = 0.47;
  const cx = x0 + L / 2;
  add(new BoxGeometry(2.42, 0.16, 0.78), mat.dark, -0.05, 0.36, 0);
  // Cargo box walls: [+x, -x, +y, -y, +z, -z]; livery on the outer faces
  add(new BoxGeometry(L, H, 0.03), [mat.body, mat.body, mat.body, mat.body, livery, mat.inner], cx, y0 + H / 2, Wd / 2);
  add(new BoxGeometry(L, H, 0.03), [mat.body, mat.body, mat.body, mat.body, mat.inner, livery], cx, y0 + H / 2, -Wd / 2);
  add(new BoxGeometry(L, 0.04, Wd), [mat.body, mat.body, mat.body, mat.inner, mat.body, mat.body], cx, y0 + H, 0);
  add(new BoxGeometry(0.04, H, Wd), mat.body, x0 + L - 0.02, y0 + H / 2, 0);
  add(new BoxGeometry(L, 0.04, Wd - 0.04), mat.floor, cx, y0 + 0.02, 0, false);
  // Red rear frame
  add(new BoxGeometry(0.05, 0.06, Wd + 0.04), mat.red, x0 - 0.01, y0 + H, 0);
  add(new BoxGeometry(0.05, H, 0.05), mat.red, x0 - 0.01, y0 + H / 2, Wd / 2);
  add(new BoxGeometry(0.05, H, 0.05), mat.red, x0 - 0.01, y0 + H / 2, -Wd / 2);
  add(new BoxGeometry(0.08, 0.06, Wd + 0.06), mat.dark, x0 - 0.02, y0 - 0.02, 0);

  // Roll-up rear door: pivot at the top, scale.y shrinks to "roll up"
  const door = new Group();
  const doorGeo = new PlaneGeometry(Wd - 0.06, H - 0.06);
  doorGeo.translate(0, -(H - 0.06) / 2, 0);
  const doorMesh = new Mesh(doorGeo, new MeshStandardMaterial({ map: doorTexture(), roughness: 0.6, metalness: 0.3, side: DoubleSide }));
  doorMesh.rotation.y = -Math.PI / 2;
  door.add(doorMesh);
  door.position.set(x0 - 0.03, y0 + H - 0.04, 0);
  g.add(door);

  // Cab
  add(new BoxGeometry(0.78, 0.56, 0.92), mat.red, 0.77, 0.74, 0);
  add(new BoxGeometry(0.5, 0.44, 0.9), mat.red, 0.64, 1.24, 0);
  const shield = add(new BoxGeometry(0.03, 0.38, 0.8), mat.glass, 0.9, 1.23, 0, false);
  shield.rotation.z = -0.22;
  add(new BoxGeometry(0.34, 0.26, 0.92), mat.glass, 0.66, 1.27, 0, false);
  add(new BoxGeometry(0.08, 0.14, 0.96), mat.dark, 1.17, 0.5, 0);
  add(new BoxGeometry(0.02, 0.22, 0.5), mat.dark, 1.165, 0.8, 0, false);
  add(new BoxGeometry(0.03, 0.09, 0.16), mat.head, 1.165, 0.66, 0.33, false);
  add(new BoxGeometry(0.03, 0.09, 0.16), mat.head, 1.165, 0.66, -0.33, false);
  add(new BoxGeometry(0.03, 0.12, 0.08), mat.tail, x0 - 0.05, 0.62, 0.42, false);
  add(new BoxGeometry(0.03, 0.12, 0.08), mat.tail, x0 - 0.05, 0.62, -0.42, false);

  // Wheels
  const wheels = [];
  const tireGeo = new CylinderGeometry(0.22, 0.22, 0.17, 12);
  tireGeo.rotateX(Math.PI / 2);
  const hubGeo = new CylinderGeometry(0.1, 0.1, 0.18, 8);
  hubGeo.rotateX(Math.PI / 2);
  [[-0.78, 0.44], [-0.78, -0.44], [-0.32, 0.44], [-0.32, -0.44], [0.82, 0.44], [0.82, -0.44]].forEach(([x, z]) => {
    const w = new Group();
    const tire = new Mesh(tireGeo, mat.tire);
    tire.castShadow = true;
    w.add(tire, new Mesh(hubGeo, mat.hub));
    w.position.set(x, 0.22, z);
    g.add(w);
    wheels.push(w);
  });

  return { group: g, door, wheels };
}

/* ---------- Cargo (boxes + furniture) ---------- */
function buildCargo(truck) {
  const cardboard = new MeshStandardMaterial({ map: cardboardTexture(), roughness: 0.9 });
  const sofaMat = new MeshStandardMaterial({ color: 0x5a5651, roughness: 0.95 });
  const white = new MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.4, metalness: 0.1 });
  const wood = new MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.8 });
  const mattress = new MeshStandardMaterial({ color: 0xd8d2c4, roughness: 1 });
  const redMat = new MeshStandardMaterial({ color: 0xc80500, roughness: 0.5 });

  const box = (s) => new Mesh(new BoxGeometry(s, s, s), cardboard);
  const sofa = () => {
    const g = new Group();
    const seat = new Mesh(new BoxGeometry(0.3, 0.16, 0.8), sofaMat);
    seat.position.y = -0.06;
    const back = new Mesh(new BoxGeometry(0.1, 0.34, 0.8), sofaMat);
    back.position.set(0.12, 0, 0);
    const armA = new Mesh(new BoxGeometry(0.34, 0.24, 0.07), sofaMat);
    armA.position.set(0, -0.03, 0.4);
    const armB = armA.clone();
    armB.position.z = -0.4;
    g.add(seat, back, armA, armB);
    return g;
  };
  const fridge = () => {
    const g = new Group();
    g.add(new Mesh(new BoxGeometry(0.3, 0.62, 0.3), white));
    const handle = new Mesh(new BoxGeometry(0.02, 0.22, 0.02), new MeshStandardMaterial({ color: 0x333333 }));
    handle.position.set(-0.16, 0.08, 0.1);
    g.add(handle);
    return g;
  };
  const dresser = () => {
    const g = new Group();
    g.add(new Mesh(new BoxGeometry(0.3, 0.4, 0.5), wood));
    return g;
  };
  const lamp = () => {
    const g = new Group();
    const pole = new Mesh(new CylinderGeometry(0.015, 0.015, 0.36, 6), redMat);
    const shade = new Mesh(new CylinderGeometry(0.06, 0.11, 0.12, 8), redMat);
    shade.position.y = 0.2;
    const foot = new Mesh(new CylinderGeometry(0.07, 0.07, 0.03, 8), redMat);
    foot.position.y = -0.17;
    g.add(pole, shade, foot);
    return g;
  };

  // [object, half-height, slot (truck-local), start (truck-local), final yaw]
  const defs = [
    [fridge(), 0.31, [0.15, 0.8, 0.27], [-1.7, 0.31, 1.15]],
    [new Mesh(new BoxGeometry(0.12, 0.78, 0.66), mattress), 0.39, [0.17, 0.88, -0.18], [-2.3, 0.39, 1.7]],
    [sofa(), 0.17, [-0.28, 0.66, 0], [-2.7, 0.17, 1.1]],
    [dresser(), 0.2, [-0.86, 0.69, -0.2], [-3.2, 0.2, 1.6]],
    [box(0.26), 0.13, [-0.62, 0.62, -0.3], [-1.9, 0.13, 1.9]],
    [box(0.26), 0.13, [-0.62, 0.62, 0.02], [-2.2, 0.13, 2.25]],
    [box(0.26), 0.13, [-0.62, 0.62, 0.32], [-2.5, 0.13, 2.0]],
    [box(0.24), 0.12, [-0.62, 0.88, -0.14], [-2.0, 0.39, 1.95]],
    [box(0.24), 0.12, [-0.62, 0.88, 0.16], [-2.9, 0.12, 2.2]],
    [box(0.22), 0.11, [-0.98, 0.6, 0.24], [-3.3, 0.11, 2.15]],
    [lamp(), 0.19, [-1.02, 0.68, -0.05], [-3.5, 0.19, 1.5]],
  ];
  const items = defs.map(([obj, , slot, start], i) => {
    obj.traverse((m) => {
      if (m.isMesh) m.castShadow = true;
    });
    const s = new Vector3(...start);
    const e = new Vector3(...slot);
    const c = new Vector3(-1.95, Math.max(1.35, e.y + 0.55), (s.z + e.z) / 2);
    obj.position.copy(s);
    obj.rotation.y = (i % 3) * 0.6 - 0.5;
    truck.group.add(obj);
    return { obj, s, c, e, yaw0: obj.rotation.y, from: 0.08 + i * 0.075, dur: 0.16 };
  });
  return items;
}

/* ---------- Scene ---------- */
export async function createHeroScene(canvas, strings) {
  await fontsReady();
  const renderer = createRenderer(canvas, { shadows: true });
  const scene = new Scene();
  scene.background = new Color(0x0a0a0a);
  scene.fog = new Fog(0x0a0a0a, 26, 90);

  const camera = new PerspectiveCamera(36, 1, 0.1, 400);
  const hemi = new HemisphereLight(0xffffff, 0x1a1a1a, 1.1);
  const sun = new DirectionalLight(0xffffff, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 40 });
  sun.shadow.bias = -0.0008;
  const rim = new DirectionalLight(0xff5040, 0.7);
  scene.add(hemi, sun, sun.target, rim, rim.target);

  const { gem } = buildMap(scene, strings);
  const route = buildRoute(scene);
  const truck = buildTruck();
  truck.group.position.y = LAND;
  scene.add(truck.group);
  const cargo = buildCargo(truck);

  // Pickup marker (A)
  const start = route.curve.getPointAt(0);
  const pad = new Mesh(new BoxGeometry(1, 0.05, 1), new MeshBasicMaterial({ color: 0xe10600 }));
  pad.position.set(start.x, LAND + 0.03, start.z);

  let progress = 0;
  let viewW = 1;
  let viewH = 1;
  let lastU = 0;
  let wheelSpin = 0;

  const tmpA = new Vector3();
  const tmpB = new Vector3();
  const camPos = new Vector3();
  const camTarget = new Vector3();
  const up = new Vector3(0, 1, 0);

  const resize = (w, h) => {
    viewW = w;
    viewH = h;
    needsDraw = true;
    camera.aspect = w / h;
    // Shift the picture right so the headline on the left stays clear
    const shift = w > 1300 ? 0.17 : 0.2;
    camera.setViewOffset(w, h, -w * shift, 0, w, h);
    camera.updateProjectionMatrix();
  };
  const stopResize = autoResize(canvas, renderer, resize);

  let drawn = -1;
  let needsDraw = true;
  function frame() {
    if (!needsDraw && drawn === progress) return;
    needsDraw = false;
    drawn = progress;
    const p = progress;
    const load = clamp01(p / 0.46);
    const lift = smooth(clamp01((p - 0.44) / 0.16));
    const u = easeInOut(clamp01((p - 0.56) / 0.4));

    // Truck pose along the route
    const pos = route.curve.getPointAt(u, tmpA);
    const tan = route.curve.getTangentAt(Math.max(0.0001, Math.min(0.9999, u)), tmpB);
    const heading = Math.atan2(-tan.z, tan.x);
    truck.group.position.set(pos.x, pos.y - 0.02 + (u > 0 ? Math.sin(u * 160) * 0.006 : 0), pos.z);
    truck.group.rotation.y = heading;
    const scale = 1 + lift * 0.55;
    truck.group.scale.setScalar(scale);

    // Wheels spin with distance travelled
    const du = u - lastU;
    lastU = u;
    wheelSpin -= du * route.curve.getLength() / (0.22 * scale);
    truck.wheels.forEach((w) => (w.rotation.z = wheelSpin));

    // Rear door rolls up, then down
    const doorOpen = load < 0.08 ? load / 0.08 : load > 0.94 ? 1 - (load - 0.94) / 0.06 : 1;
    truck.door.scale.y = 1 - smooth(clamp01(doorOpen)) * 0.95;

    // Cargo flies in along arcs
    cargo.forEach((it) => {
      const t = easeInOut(clamp01((load - it.from) / it.dur));
      const a = 1 - t;
      it.obj.position.set(
        a * a * it.s.x + 2 * a * t * it.c.x + t * t * it.e.x,
        a * a * it.s.y + 2 * a * t * it.c.y + t * t * it.e.y,
        a * a * it.s.z + 2 * a * t * it.c.z + t * t * it.e.z,
      );
      it.obj.rotation.y = MathUtils.lerp(it.yaw0, 0, t);
      it.obj.visible = !(load >= 1 && u > 0.02);
    });

    // Route draws behind the truck
    route.draw(u);
    pad.visible = true;

    // Camera: street-level orbit → aerial follow
    const orbit = heading + (load * 0.55 - 0.25);
    const near = new Vector3(-3.4, 3.3, 8.6).applyAxisAngle(up, orbit).add(pos);
    const nearT = new Vector3(-1.4, 0.7, 0.9).applyAxisAngle(up, heading).add(pos);
    const height = 30 - Math.sin(u * Math.PI) * 4;
    const far = new Vector3(pos.x + 5, pos.y + height, pos.z + 26);
    const farT = new Vector3(pos.x - 1, pos.y, pos.z + 2);
    camPos.lerpVectors(near, far, lift);
    camTarget.lerpVectors(nearT, farT, lift);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    // Lights follow the truck so shadows stay crisp
    sun.position.set(pos.x + 6, pos.y + 12, pos.z + 5);
    sun.target.position.copy(pos);
    rim.position.set(pos.x - 6, pos.y + 3, pos.z - 6);
    rim.target.position.copy(pos);

    gem.rotation.y = p * 12;
    renderer.render(scene, camera);
  }
  scene.add(pad);

  const stopLoop = visibleLoop(canvas, frame);
  resize(canvas.clientWidth || viewW, canvas.clientHeight || viewH);
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
