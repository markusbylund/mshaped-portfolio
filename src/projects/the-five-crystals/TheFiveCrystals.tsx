import { ArrowLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";
import { levelOne } from "./levelOne";
import "./the-five-crystals.css";

type GameMode = "intro" | "playing" | "gameover" | "victory";
type SliceStage = "puzzle" | "boss" | "crystal" | "complete";

type Actor = {
  mesh: THREE.Object3D;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  phase: number;
  alive: boolean;
  home: THREE.Vector3;
  hpBar?: THREE.Group;
};

type Rune = {
  mesh: THREE.Mesh;
  index: number;
  active: boolean;
  beam?: THREE.Mesh;
};

const keys = new Set<string>();
const rootColor = 0x62e68f;
const goldColor = 0xf7c66b;
const dangerColor = 0xff5f57;

function createTextSprite(text: string, color = "#fff7e8", size = 42) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 160;
  const context = canvas.getContext("2d")!;
  context.font = `800 ${size}px system-ui`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.shadowColor = "rgba(0,0,0,.75)";
  context.shadowBlur = 18;
  context.fillText(text, 384, 92);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(6.6, 1.4, 1);
  return sprite;
}

function createCrystalMaterial(color: number) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.35,
    roughness: 0.22,
    metalness: 0.08,
  });
}

function createHpBar(width = 1.6) {
  const group = new THREE.Group();
  group.renderOrder = 12;
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 0.13),
    new THREE.MeshBasicMaterial({
      color: 0x20141c,
      transparent: true,
      opacity: 0.92,
      depthTest: false,
      depthWrite: false,
    }),
  );
  const fill = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 0.13),
    new THREE.MeshBasicMaterial({ color: dangerColor, depthTest: false, depthWrite: false }),
  );
  back.renderOrder = 12;
  fill.renderOrder = 13;
  fill.position.z = 0.01;
  fill.userData.fullWidth = width;
  fill.userData.kind = "hp-fill";
  group.add(back, fill);
  return group;
}

function makeCanvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createHeroCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 420;
  const ctx = canvas.getContext("2d")!;

  const cape = ctx.createLinearGradient(110, 150, 220, 350);
  cape.addColorStop(0, "#1d67d7");
  cape.addColorStop(1, "#123f98");
  ctx.fillStyle = cape;
  ctx.beginPath();
  ctx.moveTo(105, 142);
  ctx.bezierCurveTo(74, 205, 70, 294, 104, 352);
  ctx.lineTo(218, 352);
  ctx.bezierCurveTo(244, 285, 236, 205, 212, 142);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(10, 33, 78, .18)";
  ctx.beginPath();
  ctx.ellipse(160, 360, 72, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  const tunic = ctx.createLinearGradient(92, 150, 230, 315);
  tunic.addColorStop(0, "#55d7ff");
  tunic.addColorStop(0.55, "#249be8");
  tunic.addColorStop(1, "#1567b9");
  ctx.fillStyle = tunic;
  ctx.beginPath();
  ctx.moveTo(112, 150);
  ctx.quadraticCurveTo(160, 124, 208, 150);
  ctx.lineTo(228, 304);
  ctx.quadraticCurveTo(160, 336, 92, 304);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#173f83";
  ctx.beginPath();
  ctx.moveTo(126, 172);
  ctx.lineTo(194, 172);
  ctx.lineTo(206, 296);
  ctx.quadraticCurveTo(160, 316, 114, 296);
  ctx.closePath();
  ctx.globalAlpha = 0.28;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#ffd36b";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(116, 214);
  ctx.quadraticCurveTo(160, 232, 204, 214);
  ctx.stroke();

  ctx.fillStyle = "#6b3b21";
  ctx.fillRect(105, 235, 110, 18);
  ctx.fillStyle = "#f4c45f";
  ctx.fillRect(151, 231, 18, 26);

  ctx.fillStyle = "#243e68";
  ctx.beginPath();
  ctx.roundRect(101, 304, 42, 46, 12);
  ctx.roundRect(177, 304, 42, 46, 12);
  ctx.fill();

  ctx.fillStyle = "#ffd1a5";
  ctx.beginPath();
  ctx.ellipse(88, 215, 18, 28, -0.28, 0, Math.PI * 2);
  ctx.ellipse(232, 215, 18, 28, 0.28, 0, Math.PI * 2);
  ctx.fill();

  const face = ctx.createRadialGradient(145, 116, 20, 160, 132, 70);
  face.addColorStop(0, "#ffe0b8");
  face.addColorStop(1, "#f3b980");
  ctx.fillStyle = face;
  ctx.beginPath();
  ctx.ellipse(160, 130, 58, 54, 0, 0, Math.PI * 2);
  ctx.fill();

  const hood = ctx.createLinearGradient(90, 46, 222, 172);
  hood.addColorStop(0, "#45a6ff");
  hood.addColorStop(0.55, "#2666e4");
  hood.addColorStop(1, "#173ba0");
  ctx.fillStyle = hood;
  ctx.beginPath();
  ctx.moveTo(160, 32);
  ctx.bezierCurveTo(86, 54, 84, 142, 112, 178);
  ctx.bezierCurveTo(134, 158, 186, 158, 208, 178);
  ctx.bezierCurveTo(236, 142, 234, 54, 160, 32);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffd36b";
  ctx.beginPath();
  ctx.arc(160, 145, 62, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.lineWidth = 13;
  ctx.strokeStyle = "#ffd36b";
  ctx.stroke();

  ctx.fillStyle = "#2b221c";
  ctx.beginPath();
  ctx.ellipse(141, 132, 5, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(179, 132, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(121, 70);
  ctx.quadraticCurveTo(158, 50, 198, 71);
  ctx.stroke();

  return canvas;
}

function createSwordCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 360;
  const ctx = canvas.getContext("2d")!;

  const blade = ctx.createLinearGradient(45, 32, 78, 250);
  blade.addColorStop(0, "#ffffff");
  blade.addColorStop(0.48, "#bfefff");
  blade.addColorStop(1, "#6dbce7");
  ctx.fillStyle = blade;
  ctx.beginPath();
  ctx.moveTo(60, 18);
  ctx.lineTo(84, 235);
  ctx.lineTo(60, 278);
  ctx.lineTo(36, 235);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,.85)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 42);
  ctx.lineTo(60, 246);
  ctx.stroke();

  ctx.fillStyle = "#f7c66b";
  ctx.beginPath();
  ctx.roundRect(22, 260, 76, 18, 8);
  ctx.fill();

  ctx.fillStyle = "#744421";
  ctx.beginPath();
  ctx.roundRect(50, 276, 20, 54, 9);
  ctx.fill();

  ctx.fillStyle = "#f7c66b";
  ctx.beginPath();
  ctx.arc(60, 338, 13, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createBearBossCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 420;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "rgba(47, 25, 15, .25)";
  ctx.beginPath();
  ctx.ellipse(210, 360, 118, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  const fur = ctx.createRadialGradient(172, 118, 35, 210, 220, 190);
  fur.addColorStop(0, "#b97843");
  fur.addColorStop(0.55, "#7a4327");
  fur.addColorStop(1, "#3c251b");

  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(210, 235, 112, 128, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(210, 132, 91, 78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(136, 92, 33, 0, Math.PI * 2);
  ctx.arc(284, 92, 33, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffc95f";
  ctx.beginPath();
  ctx.roundRect(106, 210, 208, 28, 14);
  ctx.fill();
  ctx.fillStyle = "#275f36";
  ctx.beginPath();
  ctx.roundRect(125, 238, 170, 48, 16);
  ctx.fill();

  ctx.fillStyle = "#d59a62";
  ctx.beginPath();
  ctx.ellipse(210, 152, 45, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#20140f";
  ctx.beginPath();
  ctx.ellipse(178, 123, 7, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(242, 123, 7, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(210, 151, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#20140f";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(198, 171);
  ctx.quadraticCurveTo(210, 181, 222, 171);
  ctx.stroke();

  ctx.fillStyle = "#2d6b3d";
  ctx.beginPath();
  ctx.roundRect(78, 206, 58, 116, 28);
  ctx.roundRect(284, 206, 58, 116, 28);
  ctx.fill();

  ctx.fillStyle = "#f7c66b";
  ctx.beginPath();
  ctx.moveTo(210, 36);
  ctx.lineTo(235, 76);
  ctx.lineTo(210, 66);
  ctx.lineTo(185, 76);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 240, 176, .55)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(150, 82);
  ctx.quadraticCurveTo(210, 46, 270, 82);
  ctx.stroke();

  return canvas;
}

export function TheFiveCrystals() {
  const frameRef = useRef<HTMLElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<GameMode>("intro");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hud, setHud] = useState({
    hp: 100,
    maxHp: 100,
    crystals: 0,
    stage: "puzzle" as SliceStage,
    currentZone: levelOne.zones[0].name,
    playerX: Number(levelOne.playerSpawn.x),
    playerZ: Number(levelOne.playerSpawn.z),
    objective: "Aktivera runstenarna i ordning: 1, 2, 3.",
    message: "Whisperwood väntar. Starta äventyret när du är redo.",
    bossHp: 0,
    bossMaxHp: 1,
  });

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
      window.setTimeout(() => window.dispatchEvent(new Event("resize")), 80);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.append(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9dddf4);
    scene.fog = new THREE.FogExp2(0x9dddf4, 0.022);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 120);
    camera.position.set(0, 10.5, 11.5);

    const ambient = new THREE.AmbientLight(0xfff7d6, 1.1);
    scene.add(ambient);

    const moon = new THREE.DirectionalLight(0xffffff, 1.75);
    moon.position.set(-7, 13, 8);
    moon.castShadow = true;
    moon.shadow.mapSize.set(1024, 1024);
    scene.add(moon);

    const root = new THREE.Group();
    scene.add(root);

    const playerGroup = new THREE.Group();
    const heroMaterial = new THREE.SpriteMaterial({
      map: makeCanvasTexture(createHeroCanvas()),
      transparent: true,
      depthWrite: false,
    });
    const heroSprite = new THREE.Sprite(heroMaterial);
    heroSprite.position.set(0, 1.12, 0);
    heroSprite.scale.set(1.55, 2.05, 1);

    const swordMaterial = new THREE.SpriteMaterial({
      map: makeCanvasTexture(createSwordCanvas()),
      transparent: true,
      depthWrite: false,
      rotation: -0.88,
    });
    const swordPivot = new THREE.Group();
    swordPivot.position.set(0.58, 1.05, -0.06);
    const swordSprite = new THREE.Sprite(swordMaterial);
    swordSprite.position.set(0.12, 0.08, 0);
    swordSprite.scale.set(0.42, 1.28, 1);
    swordPivot.add(swordSprite);

    const weaponPivot = new THREE.Group();
    weaponPivot.position.set(0.64, 0.38, 0.08);
    weaponPivot.visible = false;

    const playerShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.64, 32),
      new THREE.MeshBasicMaterial({ color: 0x12351e, transparent: true, opacity: 0.18, depthWrite: false }),
    );
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.y = 0.025;

    const attackRange = new THREE.Mesh(
      new THREE.RingGeometry(1.15, 1.55, 42),
      new THREE.MeshBasicMaterial({ color: 0x77d8ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide }),
    );
    attackRange.rotation.x = -Math.PI / 2;
    attackRange.position.y = 0.035;
    attackRange.visible = false;
    playerGroup.add(playerShadow, attackRange, swordPivot, weaponPivot, heroSprite);

    const player = {
      mesh: playerGroup,
      hp: 100,
      maxHp: 100,
      attack: 28,
      speed: 5.3,
      invulnerable: 0,
      cooldown: 0,
      swing: 0,
      facing: new THREE.Vector3(0, 0, -1),
      attackRange,
      swordPivot,
      weaponPivot,
      weaponModel: null as THREE.Object3D | null,
      swordMaterial,
      heroSprite,
    };
    player.mesh.position.set(0, 0.82, 5.8);
    root.add(player.mesh);

    const gltfLoader = new GLTFLoader();
    let playerModel: THREE.Object3D | null = null;
    let playerMixer: THREE.AnimationMixer | null = null;
    let enemyMixers: THREE.AnimationMixer[] = [];
    let bossMixer: THREE.AnimationMixer | null = null;
    let activeCharacterAction = "";
    const characterActions = new Map<string, THREE.AnimationAction>();
    type EnemyAssetLibrary = {
      rogue: THREE.Object3D;
      barbarian: THREE.Object3D;
      axe: THREE.Object3D;
      walkClip?: THREE.AnimationClip;
      idleClip?: THREE.AnimationClip;
    };
    let enemyLibrary: EnemyAssetLibrary | null = null;
    let enemyLibraryPromise: Promise<EnemyAssetLibrary | null> | null = null;

    function loadEnemyLibrary() {
      if (enemyLibrary) return Promise.resolve(enemyLibrary);
      if (enemyLibraryPromise) return enemyLibraryPromise;
      const base = "/games/the-five-crystals/assets/kaykit";
      enemyLibraryPromise = Promise.all([
        gltfLoader.loadAsync(`${base}/Rogue_Hooded.glb`),
        gltfLoader.loadAsync(`${base}/Barbarian.glb`),
        gltfLoader.loadAsync(`${base}/axe_1handed.gltf`),
        gltfLoader.loadAsync(`${base}/Rig_Medium_MovementBasic.glb`),
        gltfLoader.loadAsync(`${base}/Rig_Medium_General.glb`),
      ]).then(([rogue, barbarian, axe, movement, general]) => {
        enemyLibrary = {
          rogue: rogue.scene,
          barbarian: barbarian.scene,
          axe: axe.scene,
          walkClip: movement.animations.find((clip) => clip.name === "Walking_A"),
          idleClip: general.animations.find((clip) => clip.name === "Idle_B"),
        };
        return enemyLibrary;
      });
      return enemyLibraryPromise;
    }

    function playCharacterAction(name: "idle" | "walk" | "attack") {
      if (activeCharacterAction === name || !characterActions.has(name)) return;
      const next = characterActions.get(name)!;
      const previous = characterActions.get(activeCharacterAction);
      previous?.fadeOut(0.12);
      next.reset().fadeIn(0.12);
      if (name === "attack") {
        next.setLoop(THREE.LoopOnce, 1);
        next.clampWhenFinished = true;
      } else {
        next.setLoop(THREE.LoopRepeat, Infinity);
      }
      next.play();
      activeCharacterAction = name;
    }

    async function loadKayKitPlayer() {
      try {
        const base = "/games/the-five-crystals/assets/kaykit";
        const [knight, movement, general, sword] = await Promise.all([
          gltfLoader.loadAsync(`${base}/Knight.glb`),
          gltfLoader.loadAsync(`${base}/Rig_Medium_MovementBasic.glb`),
          gltfLoader.loadAsync(`${base}/Rig_Medium_General.glb`),
          gltfLoader.loadAsync(`${base}/sword_1handed.gltf`),
        ]);

        playerModel = knight.scene;
        playerModel.position.y = -0.82;
        playerModel.scale.setScalar(0.9);
        playerModel.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        sword.scene.position.set(0, 0, 0);
        sword.scene.rotation.set(0, 0, 0);
        sword.scene.scale.setScalar(1.08);
        sword.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.frustumCulled = false;
            object.renderOrder = 8;
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              material.depthTest = false;
              material.depthWrite = false;
              material.needsUpdate = true;
            });
          }
        });
        const handSlot = playerModel.getObjectByName("handslot.r");
        if (handSlot) {
          handSlot.add(sword.scene);
          weaponPivot.visible = false;
        } else {
          sword.scene.position.set(0, 0.18, 0);
          sword.scene.scale.setScalar(0.68);
          weaponPivot.add(sword.scene);
          weaponPivot.visible = true;
        }
        player.weaponModel = sword.scene;

        playerMixer = new THREE.AnimationMixer(playerModel);
        const idleClip = general.animations.find((clip) => clip.name === "Idle_A");
        const walkClip = movement.animations.find((clip) => clip.name === "Walking_A");
        const attackClip = general.animations.find((clip) => clip.name === "Use_Item");
        if (idleClip) characterActions.set("idle", playerMixer.clipAction(idleClip));
        if (walkClip) characterActions.set("walk", playerMixer.clipAction(walkClip));
        if (attackClip) characterActions.set("attack", playerMixer.clipAction(attackClip));

        playerGroup.add(playerModel);
        heroSprite.visible = false;
        swordSprite.visible = false;
        playerShadow.visible = false;
        playCharacterAction("idle");
      } catch (error) {
        console.warn("KayKit player assets could not be loaded; using fallback sprite.", error);
      }
    }

    void loadKayKitPlayer();

    const game = {
      mode: "intro" as GameMode,
      stage: "puzzle" as SliceStage,
      puzzlePhase: "runes" as "runes" | "lanterns",
      runes: [] as Rune[],
      lanterns: [] as Rune[],
      enemies: [] as Actor[],
      boss: null as Actor | null,
      particles: [] as THREE.Mesh[],
      puzzleStep: 0,
      worldVersion: 0,
      fallbackNature: null as THREE.Group | null,
      waterSurfaces: [] as THREE.Mesh[],
      crystal: null as THREE.Mesh | null,
      portal: null as THREE.Mesh | null,
      message: "Whisperwood väntar. Starta äventyret när du är redo.",
    };

    const makeMaterial = (color: number, emissive = 0x000000, emissiveIntensity = 0.35) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity,
        roughness: 0.6,
        metalness: 0.04,
      });

    const natureTreePositions = [
      [-18, -19], [-13, -21], [-7, -24], [7, -24], [13, -21], [18, -18],
      [-22, -10], [-18, -5], [-20, 3], [-17, 10], [-14, 17], [-9, 24],
      [22, -10], [19, -4], [21, 5], [18, 12], [14, 19], [8, 25],
      [-3, 27], [3, 27], [-24, 15], [24, 16], [-24, -1], [24, 0],
      [-4, 6], [4, 6], [-4, -11], [4, -11],
    ] as const;

    function addForestTemple() {
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(38, 72),
        makeMaterial(0x389f5c, 0x176538, 0.1),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.08;
      floor.receiveShadow = true;
      root.add(floor);

      levelOne.zones.forEach((zone) => {
        const clearing = new THREE.Mesh(
          new THREE.CircleGeometry(zone.radius, 48),
          makeMaterial(zone.color, zone.color, 0.08),
        );
        clearing.rotation.x = -Math.PI / 2;
        clearing.position.set(zone.center.x, 0.015, zone.center.z);
        clearing.receiveShadow = true;
        root.add(clearing);

        const label = createTextSprite(zone.name, "#f5ffe8", zone.id === "temple" ? 40 : 28);
        label.position.set(zone.center.x, 3.6, zone.center.z);
        label.scale.set(zone.id === "temple" ? 6 : 4.5, 1.1, 1);
        root.add(label);
      });

      levelOne.paths.forEach((segment) => {
        const dx = segment.to.x - segment.from.x;
        const dz = segment.to.z - segment.from.z;
        const length = Math.hypot(dx, dz);
        const pathMaterial = makeMaterial(0x9cc77b, 0x315d31, 0.045);
        const path = new THREE.Mesh(
          new THREE.BoxGeometry(segment.width, 0.06, length + 1.8),
          pathMaterial,
        );
        path.position.set(
          (segment.from.x + segment.to.x) / 2,
          0.04,
          (segment.from.z + segment.to.z) / 2,
        );
        path.rotation.y = Math.atan2(dx, dz);
        path.receiveShadow = true;
        root.add(path);

        [segment.from, segment.to].forEach((point) => {
          const cap = new THREE.Mesh(
            new THREE.CircleGeometry(segment.width / 2, 28),
            pathMaterial,
          );
          cap.rotation.x = -Math.PI / 2;
          cap.position.set(point.x, 0.045, point.z);
          cap.receiveShadow = true;
          root.add(cap);
        });
      });

      const markerMaterial = makeMaterial(0x5b6f51, 0x1d3520, 0.04);
      [
        [-1.8, 15.6], [1.9, 13.8], [-4.2, 7.3], [-7.1, 4.3],
        [-5.1, -3.5], [4.3, -3.8], [7.1, -5.3], [3.8, -12.2],
      ].forEach(([x, z], index) => {
        const marker = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 + (index % 2) * 0.09, 0), markerMaterial);
        marker.position.set(x, 0.2, z);
        marker.rotation.set(index * 0.31, index * 0.72, 0);
        marker.castShadow = true;
        root.add(marker);
      });

      const camp = new THREE.Group();
      const tent = new THREE.Mesh(
        new THREE.ConeGeometry(1.25, 2.2, 4),
        makeMaterial(0xf0b84f, 0x6b3b16, 0.08),
      );
      tent.position.set(2.8, 1.05, 20.8);
      tent.rotation.y = Math.PI / 4;
      tent.castShadow = true;

      const fireLight = new THREE.PointLight(0xff9d45, 2.2, 8);
      fireLight.position.set(-2.5, 1.2, 20.4);
      const fire = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 0.95, 7),
        makeMaterial(0xffb447, 0xff5f20, 1.2),
      );
      fire.position.set(-2.5, 0.48, 20.4);

      const signPost = new THREE.Group();
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.14, 1.7, 7),
        makeMaterial(0x724521, 0x321b0b, 0.05),
      );
      post.position.y = 0.85;
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(1.25, 0.48, 0.16),
        makeMaterial(0xa66a32, 0x4a260f, 0.05),
      );
      sign.position.set(0.28, 1.45, 0);
      sign.rotation.z = -0.08;
      signPost.add(post, sign);
      signPost.position.set(0, 0, 15.3);
      camp.add(tent, fire, fireLight, signPost);
      root.add(camp);

      const pondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x56c8e8,
        emissive: 0x174a60,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.78,
        roughness: 0.18,
        metalness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      });
      [
        [6.8, 0.16, 3.2, 2.8, 1.1],
        [13.4, 0.16, 2.1, 3.1, 1.2],
        [10.2, 0.16, -4.1, 2.2, 0.85],
      ].forEach(([x, y, z, sx, sz]) => {
        const pond = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.08, 24), pondMaterial);
        pond.position.set(x, y, z);
        pond.scale.set(sx, 1, sz);
        root.add(pond);
        game.waterSurfaces.push(pond);

        const ripple = new THREE.Mesh(
          new THREE.RingGeometry(0.48, 0.53, 34),
          new THREE.MeshBasicMaterial({ color: 0xc6f7ff, transparent: true, opacity: 0.32, side: THREE.DoubleSide }),
        );
        ripple.rotation.x = -Math.PI / 2;
        ripple.position.set(x, y + 0.06, z);
        ripple.scale.set(sx, sz, 1);
        ripple.userData.rippleOffset = x * 0.1;
        ripple.userData.rippleScale = new THREE.Vector3(sx, sz, 1);
        root.add(ripple);
      });

      const bridge = new THREE.Group();
      const bridgeMaterial = makeMaterial(0x8b5f35, 0x3d2513, 0.06);
      for (let index = -3; index <= 3; index += 1) {
        const plank = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 2.5), bridgeMaterial);
        plank.position.set(index * 0.73, 0.29 + Math.abs(index) * 0.006, 0);
        plank.rotation.y = 0.04 * (index % 2);
        plank.castShadow = true;
        bridge.add(plank);
      }
      bridge.position.set(10.2, 0, -4.05);
      root.add(bridge);

      const trailLights = new THREE.Group();
      [[-2.2, 12.8], [2.1, 9.8], [-4.7, 6.5]].forEach(([x, z], index) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 1.55, 7), makeMaterial(0x76502b));
        post.position.set(x, 0.78, z);
        const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), makeMaterial(0xffdf7a, 0xffa23b, 1.1));
        lamp.position.set(x, 1.58, z);
        const light = new THREE.PointLight(0xffc767, 0.7, 4);
        light.position.copy(lamp.position);
        trailLights.add(post, lamp, light);
        lamp.rotation.y = index;
      });
      root.add(trailLights);

      const runeCircle = new THREE.Group();
      for (let index = 0; index < 10; index += 1) {
        const angle = (index / 10) * Math.PI * 2;
        const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34, 0), markerMaterial);
        stone.position.set(-10 + Math.cos(angle) * 5.35, 0.22, 1 + Math.sin(angle) * 5.35);
        stone.scale.y = 0.66;
        runeCircle.add(stone);
      }
      root.add(runeCircle);

      const templeGlow = new THREE.PointLight(rootColor, 2.8, 24);
      templeGlow.position.set(0, 5.8, -2);
      root.add(templeGlow);

      const gate = new THREE.Group();
      const pillarMaterial = makeMaterial(0x6a5542, 0x243b25, 0.14);
      [-2.6, 2.6].forEach((x) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.6, 4.5, 9), pillarMaterial);
        pillar.position.set(x, 2, -22);
        pillar.castShadow = true;
        gate.add(pillar);
      });
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.5, 0.8), pillarMaterial);
      lintel.position.set(0, 4.1, -22);
      lintel.castShadow = true;
      gate.add(lintel);
      root.add(gate);

      const trunkMaterial = makeMaterial(0x7d4b28, 0x4a2411, 0.06);
      const crownMaterial = makeMaterial(0x2fbf63, 0x1d8a45, 0.18);
      const fallbackNature = new THREE.Group();
      natureTreePositions.forEach(([x, z], index) => {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 1.8, 7), trunkMaterial);
        trunk.position.y = 0.9;
        trunk.castShadow = true;
        const crown = new THREE.Mesh(new THREE.ConeGeometry(1.18, 2.6, 8), crownMaterial);
        crown.position.y = 2.55;
        crown.rotation.y = index * 0.4;
        crown.castShadow = true;
        tree.add(trunk, crown);
        tree.position.set(x, 0, z);
        fallbackNature.add(tree);
      });
      root.add(fallbackNature);
      game.fallbackNature = fallbackNature;

      for (let i = 0; i < 34; i += 1) {
        const ember = new THREE.Mesh(
          new THREE.SphereGeometry(0.035 + Math.random() * 0.045, 8, 8),
          new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? rootColor : 0xfff0b8 }),
        );
        ember.position.set((Math.random() - 0.5) * 34, 2 + Math.random() * 8, (Math.random() - 0.5) * 28);
        root.add(ember);
      }

      for (let i = 0; i < 28; i += 1) {
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 8, 8),
          new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffe56a : 0xff8cc8 }),
        );
        flower.position.set((Math.random() - 0.5) * 30, 0.34, (Math.random() - 0.5) * 24);
        root.add(flower);
      }

    }

    async function loadNatureAssets(worldVersion: number) {
      try {
        const base = "/games/the-five-crystals/assets/nature";
        const [treeOne, treeTwo, rockOne, rockTwo, grass] = await Promise.all([
          gltfLoader.loadAsync(`${base}/CommonTree_1.gltf`),
          gltfLoader.loadAsync(`${base}/CommonTree_2.gltf`),
          gltfLoader.loadAsync(`${base}/Rock_Medium_1.gltf`),
          gltfLoader.loadAsync(`${base}/Rock_Medium_2.gltf`),
          gltfLoader.loadAsync(`${base}/Grass_Common_Short.gltf`),
        ]);
        if (worldVersion !== game.worldVersion || game.mode !== "playing") return;

        const premiumNature = new THREE.Group();
        natureTreePositions.forEach(([x, z], index) => {
          const tree = (index % 2 === 0 ? treeOne.scene : treeTwo.scene).clone(true);
          const scale = 0.56 + (index % 4) * 0.035;
          tree.scale.setScalar(scale);
          tree.position.set(x, 0, z);
          tree.rotation.y = index * 1.37;
          tree.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          premiumNature.add(tree);
        });

        const rockPositions = [
          [-12, 5], [-7, 8], [7, 11], [13, 6], [-15, -7], [15, -9],
          [-7, -16], [7, -16], [-2, 16], [4, 18],
        ] as const;
        rockPositions.forEach(([x, z], index) => {
          const rock = (index % 2 === 0 ? rockOne.scene : rockTwo.scene).clone(true);
          rock.scale.setScalar(0.42 + (index % 3) * 0.08);
          rock.position.set(x, 0, z);
          rock.rotation.y = index * 0.83;
          rock.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          premiumNature.add(rock);
        });

        const grassPositions = [
          [-6, 18], [6, 17], [-3, 13], [4, 12], [-13, 5], [-8, 6],
          [-15, -2], [-7, -3], [6, 5], [14, 4], [15, -4], [7, -6],
          [-8, -12], [8, -13], [-5, -20], [5, -21],
        ] as const;
        grassPositions.forEach(([x, z], index) => {
          const patch = grass.scene.clone(true);
          patch.position.set(x, 0, z);
          patch.rotation.y = index * 1.17;
          patch.scale.setScalar(0.62 + (index % 3) * 0.08);
          patch.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          premiumNature.add(patch);
        });

        if (game.fallbackNature) root.remove(game.fallbackNature);
        game.fallbackNature = null;
        root.add(premiumNature);
      } catch (error) {
        console.warn("Nature MegaKit assets could not be loaded; using fallback nature.", error);
      }
    }

    function addRunes() {
      const positions = levelOne.runePositions.map(
        (position) => new THREE.Vector3(position.x, 0.45, position.z),
      );

      positions.forEach((position, index) => {
        const rune = new THREE.Mesh(
          new THREE.CylinderGeometry(0.58, 0.72, 1.05, 6),
          makeMaterial(0x211e28, 0x13261c, 0.2),
        );
        rune.position.copy(position);
        rune.castShadow = true;
        rune.userData.kind = "rune";
        rune.userData.index = index;
        root.add(rune);

        const label = createTextSprite(String(index + 1), "#d9ffe4", 52);
        label.position.set(position.x, 1.62, position.z);
        root.add(label);

        game.runes.push({ mesh: rune, index, active: false });
      });
    }

    function spawnLanternPuzzle() {
      game.puzzlePhase = "lanterns";
      game.puzzleStep = 0;
      game.message = "Runorna öppnar skogens andra sigill. Tänd de två skogslyktorna vid vattnet.";

      levelOne.lanternPositions
        .map((position) => new THREE.Vector3(position.x, 0.52, position.z))
        .forEach((position, index) => {
        const lantern = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.58, 1.15, 8),
          makeMaterial(0x315438, 0x15321f, 0.25),
        );
        lantern.position.copy(position);
        lantern.castShadow = true;
        lantern.userData.kind = "lantern";
        lantern.userData.index = index;
        root.add(lantern);

        const label = createTextSprite("Ljus", "#fff0a8", 30);
        label.position.set(position.x, 1.62, position.z);
        root.add(label);

        game.lanterns.push({ mesh: lantern, index, active: false });
      });

      updateHud();
    }

    function addEnemies() {
      const enemyGeo = new THREE.CapsuleGeometry(0.4, 0.38, 6, 10);
      const enemyMat = makeMaterial(0xb06b38, 0x5b2416, 0.35);
      levelOne.enemySpawns.forEach(({ x, z }, index) => {
        const mesh = new THREE.Mesh(enemyGeo, enemyMat.clone());
        mesh.position.set(x, 0.76, z);
        mesh.userData.baseScale = 1;
        mesh.userData.groundY = 0.76;
        mesh.castShadow = true;
        root.add(mesh);
        const hpBar = createHpBar(1.25);
        hpBar.position.set(x, 1.55, z);
        root.add(hpBar);
        game.enemies.push({
          mesh,
          hp: 44,
          maxHp: 44,
          speed: 2.15,
          damage: 9,
          phase: index * 2,
          alive: true,
          home: mesh.position.clone(),
          hpBar,
        });
      });
    }

    async function upgradeEnemiesWithKayKit(worldVersion: number) {
      try {
        const library = await loadEnemyLibrary();
        if (!library || worldVersion !== game.worldVersion || game.mode !== "playing") return;
        enemyMixers.forEach((mixer) => mixer.stopAllAction());
        enemyMixers = [];

        game.enemies.forEach((enemy, index) => {
          const model = cloneSkeleton(library.rogue);
          model.position.copy(enemy.mesh.position);
          model.position.y = 0;
          model.scale.setScalar(0.82);
          model.userData.baseScale = 0.82;
          model.userData.groundY = 0;
          model.userData.hpHeight = 2.35;
          model.rotation.y = index % 2 === 0 ? Math.PI : 0;
          model.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });

          root.remove(enemy.mesh);
          root.add(model);
          enemy.mesh = model;
          enemy.home.copy(model.position);

          if (library.walkClip) {
            const mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(library.walkClip).play();
            enemyMixers.push(mixer);
          }
        });
      } catch (error) {
        console.warn("KayKit enemy assets could not be loaded; using fallback enemies.", error);
      }
    }

    function resetWorld() {
      [...root.children].forEach((child) => {
        if (child !== player.mesh) root.remove(child);
      });

      game.stage = "puzzle";
      game.worldVersion += 1;
      game.puzzlePhase = "runes";
      game.runes = [];
      game.lanterns = [];
      game.waterSurfaces = [];
      enemyMixers.forEach((mixer) => mixer.stopAllAction());
      enemyMixers = [];
      bossMixer?.stopAllAction();
      bossMixer = null;
      game.enemies = [];
      game.boss = null;
      game.particles = [];
      game.puzzleStep = 0;
      game.crystal = null;
      game.portal = null;
      game.message = "Aktivera runstenarna i ordning: 1, 2, 3.";

      player.hp = player.maxHp;
      player.cooldown = 0;
      player.swing = 0;
      player.invulnerable = 0;
      player.facing.set(0, 0, -1);
      player.mesh.position.set(levelOne.playerSpawn.x, 0.82, levelOne.playerSpawn.z);
      player.swordPivot.position.set(0.58, 1.05, -0.06);
      player.weaponPivot.position.set(0.64, 0.38, 0.08);
      player.weaponPivot.rotation.set(0, 0, -0.22);
      player.swordMaterial.rotation = -0.88;
      player.heroSprite.position.y = 1.12;
      player.heroSprite.scale.set(1.55, 2.05, 1);

      addForestTemple();
      void loadNatureAssets(game.worldVersion);
      addRunes();
      addEnemies();
      void upgradeEnemiesWithKayKit(game.worldVersion);
      updateHud();
    }

    function startGame() {
      game.mode = "playing";
      setMode("playing");
      resetWorld();
    }

    function spawnParticles(position: THREE.Vector3, color: number, amount = 14, power = 4) {
      for (let i = 0; i < amount; i += 1) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.055 + Math.random() * 0.035, 8, 8),
          new THREE.MeshBasicMaterial({ color }),
        );
        particle.position.copy(position);
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * power,
          1.2 + Math.random() * power,
          (Math.random() - 0.5) * power,
        );
        particle.userData.life = 0.45 + Math.random() * 0.45;
        root.add(particle);
        game.particles.push(particle);
      }
    }

    async function upgradeBossWithKayKit(actor: Actor, worldVersion: number) {
      try {
        const library = await loadEnemyLibrary();
        if (!library || worldVersion !== game.worldVersion || !actor.alive) return;
        const model = cloneSkeleton(library.barbarian);
        model.position.set(actor.mesh.position.x, 0, actor.mesh.position.z);
        model.scale.setScalar(1.35);
        model.userData.baseScale = 1.35;
        model.userData.groundY = 0;
        model.userData.hpHeight = 3.15;
        model.userData.shadow = actor.mesh.userData.shadow;
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        const handSlot = model.getObjectByName("handslot.r");
        if (handSlot) {
          const axe = library.axe.clone(true);
          axe.position.set(0, 0, 0);
          axe.rotation.set(0, 0, 0);
          axe.scale.setScalar(1.12);
          axe.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.frustumCulled = false;
            }
          });
          handSlot.add(axe);
        }

        root.remove(actor.mesh);
        root.add(model);
        actor.mesh = model;
        actor.home.copy(model.position);

        if (library.idleClip) {
          bossMixer = new THREE.AnimationMixer(model);
          bossMixer.clipAction(library.idleClip).play();
        }
      } catch (error) {
        console.warn("KayKit boss asset could not be loaded; using fallback boss.", error);
      }
    }

    function spawnBoss() {
      if (game.boss) return;

      const bossMaterial = new THREE.SpriteMaterial({
        map: makeCanvasTexture(createBearBossCanvas()),
        transparent: true,
        depthWrite: false,
      });
      const bossMesh = new THREE.Sprite(bossMaterial);
      bossMesh.position.set(levelOne.bossSpawn.x, 1.55, levelOne.bossSpawn.z);
      bossMesh.scale.set(2.7, 2.7, 1);
      bossMesh.userData.baseScale = 2.7;
      bossMesh.userData.groundY = 1.55;
      root.add(bossMesh);

      const bossShadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.15, 32),
        new THREE.MeshBasicMaterial({ color: 0x1c160f, transparent: true, opacity: 0.22, depthWrite: false }),
      );
      bossShadow.rotation.x = -Math.PI / 2;
      bossShadow.position.set(levelOne.bossSpawn.x, 0.04, levelOne.bossSpawn.z);
      root.add(bossShadow);
      bossMesh.userData.shadow = bossShadow;

      const label = createTextSprite("Rotbarbaren", "#d9ffe4", 38);
      label.position.set(levelOne.bossSpawn.x, 3.65, levelOne.bossSpawn.z);
      root.add(label);

      const hpBar = createHpBar(2.65);
      hpBar.position.set(levelOne.bossSpawn.x, 3.15, levelOne.bossSpawn.z);
      root.add(hpBar);

      game.boss = {
        mesh: bossMesh,
        hp: 180,
        maxHp: 180,
        speed: 1.65,
        damage: 17,
        phase: 0,
        alive: true,
        home: bossMesh.position.clone(),
        hpBar,
      };
      game.stage = "boss";
      game.message = "Rotbarbaren vaknar. Håll avstånd och attackera efter hans rusningar.";
      spawnParticles(bossMesh.position, rootColor, 26, 5);
      void upgradeBossWithKayKit(game.boss, game.worldVersion);
      updateHud();
    }

    function spawnCrystal() {
      if (game.crystal) return;

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.72, 0),
        createCrystalMaterial(rootColor),
      );
      crystal.position.set(levelOne.crystalSpawn.x, 1.2, levelOne.crystalSpawn.z);
      crystal.castShadow = true;
      crystal.userData.kind = "crystal";
      root.add(crystal);
      game.crystal = crystal;
      game.stage = "crystal";
      game.message = "Skogskristallen är fri. Gå fram till den och tryck E.";
      spawnParticles(crystal.position, rootColor, 38, 6);
      updateHud();
    }

    function openPortal() {
      const portal = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.16, 18, 44),
        createCrystalMaterial(goldColor),
      );
      portal.position.set(levelOne.portalSpawn.x, 1.35, levelOne.portalSpawn.z);
      portal.rotation.x = Math.PI / 2;
      root.add(portal);
      game.portal = portal;
      game.stage = "complete";
      game.message = "Root Temple är klart. Portalen till nästa värld är låst för kommande iteration.";
      spawnParticles(portal.position, goldColor, 46, 7);
      updateHud();
    }

    function updateHud() {
      const boss = game.boss?.alive ? game.boss : null;
      const currentZone = [...levelOne.zones].sort((a, b) => {
        const distanceA = Math.hypot(
          player.mesh.position.x - a.center.x,
          player.mesh.position.z - a.center.z,
        );
        const distanceB = Math.hypot(
          player.mesh.position.x - b.center.x,
          player.mesh.position.z - b.center.z,
        );
        return distanceA - distanceB;
      })[0];
      setHud({
        hp: Math.max(0, Math.round(player.hp)),
        maxHp: player.maxHp,
        crystals: game.stage === "complete" ? 1 : 0,
        stage: game.stage,
        currentZone: currentZone.name,
        playerX: player.mesh.position.x,
        playerZ: player.mesh.position.z,
        objective:
          game.stage === "puzzle"
            ? game.puzzlePhase === "lanterns"
              ? "Tänd de två skogslyktorna vid vattnet."
              : "Aktivera runstenarna i ordning: 1, 2, 3."
            : game.stage === "boss"
              ? "Besegra Rotbarbaren."
              : game.stage === "crystal"
                ? "Samla Skogskristallen."
                : "Första templet är klart.",
        message: game.message,
        bossHp: boss ? Math.max(0, Math.round(boss.hp)) : 0,
        bossMaxHp: boss?.maxHp ?? 1,
      });
    }

    function damagePlayer(amount: number, source: THREE.Vector3) {
      if (player.invulnerable > 0 || game.mode !== "playing") return;
      player.hp -= amount;
      player.invulnerable = 0.7;
      const push = player.mesh.position.clone().sub(source);
      push.y = 0;
      if (push.lengthSq() < 0.0001) {
        push.copy(player.facing).multiplyScalar(-1);
      }
      push.normalize().multiplyScalar(0.85);
      player.mesh.position.add(push);
      spawnParticles(player.mesh.position, 0xff6473, 16, 4);

      if (player.hp <= 0) {
        game.mode = "gameover";
        setMode("gameover");
      }
      updateHud();
    }

    function attack() {
      if (game.mode !== "playing" || player.cooldown > 0) return;
      player.cooldown = 0.38;
      player.swing = 1;
      playCharacterAction("attack");
      player.attackRange.visible = true;
      player.attackRange.userData.life = 0.22;

      const attackPoint = player.mesh.position.clone().add(player.facing.clone().multiplyScalar(1.28));
      const slash = new THREE.Mesh(
        new THREE.TorusGeometry(0.78, 0.045, 8, 36, Math.PI * 1.25),
        new THREE.MeshBasicMaterial({ color: 0xf7f0a3, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
      );
      slash.position.copy(attackPoint);
      slash.position.y = 0.9;
      slash.rotation.x = Math.PI / 2;
      slash.rotation.z = Math.atan2(player.facing.x, player.facing.z) - Math.PI * 0.65;
      slash.userData.life = 0.2;
      slash.userData.velocity = player.facing.clone().multiplyScalar(1.1);
      root.add(slash);
      game.particles.push(slash);
      spawnParticles(attackPoint, goldColor, 13, 3.4);

      const targets = [...game.enemies, game.boss].filter(Boolean) as Actor[];
      targets.forEach((actor) => {
        if (!actor.alive) return;
        const targetPosition = actor.mesh.position.clone();
        targetPosition.y = attackPoint.y;
        const distanceToAttack = targetPosition.distanceTo(attackPoint);
        const distanceToPlayer = Math.hypot(
          actor.mesh.position.x - player.mesh.position.x,
          actor.mesh.position.z - player.mesh.position.z,
        );
        const overlapHit = actor === game.boss && distanceToPlayer < 1.45;
        if (distanceToAttack > (actor === game.boss ? 2 : 1.65) && !overlapHit) return;

        actor.hp -= player.attack;
        const baseScale = (actor.mesh.userData.baseScale as number | undefined) ?? 1;
        actor.mesh.scale.setScalar(baseScale * 1.12);
        spawnParticles(actor.mesh.position, actor === game.boss ? rootColor : goldColor, 18, 4);

        if (actor.hp <= 0) {
          actor.alive = false;
          actor.mesh.visible = false;
          if (actor.hpBar) actor.hpBar.visible = false;
          if (actor.mesh.userData.crown) actor.mesh.userData.crown.visible = false;
          if (actor.mesh.userData.shadow) actor.mesh.userData.shadow.visible = false;
          if (actor === game.boss) {
            game.message = "Rotbarbaren faller. Skogskristallen visar sig.";
            spawnCrystal();
          }
        }
      });
    }

    function activateRune(rune: Rune) {
      if (rune.active || game.stage !== "puzzle") return;

      if (rune.index !== game.puzzleStep) {
        game.message = "Fel ordning. Runorna slocknar och du får börja om.";
        game.puzzleStep = 0;
        game.runes.forEach((item) => {
          item.active = false;
          item.mesh.material = makeMaterial(0x211e28, 0x13261c, 0.2);
          if (item.beam) {
            root.remove(item.beam);
            item.beam = undefined;
          }
        });
        player.mesh.position.set(-10, 0.82, 6);
        spawnParticles(player.mesh.position, 0xff6473, 18, 4);
        updateHud();
        return;
      }

      rune.active = true;
      rune.mesh.material = createCrystalMaterial(rootColor);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.18, 2.2, 10),
        new THREE.MeshBasicMaterial({ color: rootColor, transparent: true, opacity: 0.62 }),
      );
      beam.position.set(rune.mesh.position.x, 1.55, rune.mesh.position.z);
      root.add(beam);
      rune.beam = beam;
      game.puzzleStep += 1;
      game.message =
        game.puzzleStep < 3
          ? `Runsten ${game.puzzleStep} tänd. Hitta nästa i ordningen.`
          : "Alla runor lyser. Ett nytt sigill vaknar...";
      spawnParticles(rune.mesh.position, rootColor, 22, 4.5);

      if (game.puzzleStep >= 3) {
        window.setTimeout(spawnLanternPuzzle, 450);
      }
      updateHud();
    }

    function activateLantern(lantern: Rune) {
      if (lantern.active || game.stage !== "puzzle" || game.puzzlePhase !== "lanterns") return;

      lantern.active = true;
      lantern.mesh.material = createCrystalMaterial(goldColor);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.22, 2.4, 10),
        new THREE.MeshBasicMaterial({ color: goldColor, transparent: true, opacity: 0.58 }),
      );
      beam.position.set(lantern.mesh.position.x, 1.7, lantern.mesh.position.z);
      root.add(beam);
      lantern.beam = beam;
      game.puzzleStep += 1;
      spawnParticles(lantern.mesh.position, goldColor, 24, 4.6);

      if (game.puzzleStep >= 2) {
        game.message = "Skogslyktorna brinner. Rotbarbaren vaknar vid roten.";
        window.setTimeout(spawnBoss, 500);
      } else {
        game.message = "En skogslykta lyser. Hitta den andra vid vattnet.";
      }
      updateHud();
    }

    function interact() {
      if (game.mode !== "playing") return;

      if (game.crystal && game.stage === "crystal" && game.crystal.position.distanceTo(player.mesh.position) < 2) {
        root.remove(game.crystal);
        game.crystal = null;
        player.speed = 6.15;
        game.message = "Skogskristallen är samlad. Du rör dig snabbare nu.";
        openPortal();
        return;
      }

      const nearestRune =
        game.puzzlePhase === "runes"
          ? game.runes
              .map((rune) => ({ rune, distance: rune.mesh.position.distanceTo(player.mesh.position) }))
              .filter((item) => item.distance < 1.8 && !item.rune.active)
              .sort((a, b) => a.distance - b.distance)[0]?.rune
          : undefined;

      if (nearestRune) {
        activateRune(nearestRune);
        return;
      }

      const nearestLantern = game.lanterns
        .map((lantern) => ({ lantern, distance: lantern.mesh.position.distanceTo(player.mesh.position) }))
        .filter((item) => item.distance < 1.8 && !item.lantern.active)
        .sort((a, b) => a.distance - b.distance)[0]?.lantern;

      if (nearestLantern) {
        activateLantern(nearestLantern);
        return;
      }

      if (game.portal && game.portal.position.distanceTo(player.mesh.position) < 2) {
        game.mode = "victory";
        setMode("victory");
        return;
      }

      game.message =
        game.stage === "complete"
          ? "Gå in i portalen för att avsluta denna slice."
          : "Kom närmare en lysande runsten eller kristallen och tryck E.";
      updateHud();
    }

    function updatePlayer(dt: number) {
      const movement = new THREE.Vector3();
      if (keys.has("w") || keys.has("arrowup")) movement.z -= 1;
      if (keys.has("s") || keys.has("arrowdown")) movement.z += 1;
      if (keys.has("a") || keys.has("arrowleft")) movement.x -= 1;
      if (keys.has("d") || keys.has("arrowright")) movement.x += 1;

      if (movement.lengthSq() > 0) {
        movement.normalize();
        player.facing.copy(movement);
        player.mesh.position.add(movement.multiplyScalar(player.speed * dt));
        player.mesh.rotation.y = 0;
        if (playerModel) {
          playerModel.rotation.y = Math.atan2(player.facing.x, player.facing.z);
        }
      }

      player.mesh.position.x = THREE.MathUtils.clamp(
        player.mesh.position.x,
        -levelOne.bounds.x,
        levelOne.bounds.x,
      );
      player.mesh.position.z = THREE.MathUtils.clamp(
        player.mesh.position.z,
        -levelOne.bounds.z,
        levelOne.bounds.z,
      );
      player.cooldown = Math.max(0, player.cooldown - dt);
      player.invulnerable = Math.max(0, player.invulnerable - dt);
      player.mesh.scale.setScalar(player.invulnerable > 0 ? 1.08 : 1);

      const walking = movement.lengthSq() > 0;
      const walkTime = performance.now() * 0.008;
      const bob = walking ? Math.abs(Math.sin(walkTime)) * 0.06 : 0;
      const swordSide = player.facing.x < -0.35 ? -1 : 1;
      const swordBaseX = 0.58 * swordSide;
      const swordBaseZ = player.facing.z > 0.35 ? 0.1 : -0.06;
      const swordIdleRotation = swordSide > 0 ? -0.88 : 0.88;
      const weaponIdleRotation = swordSide > 0 ? -0.22 : 0.22;
      player.heroSprite.position.y = 1.12 + bob;
      player.heroSprite.scale.set(1.55 + bob * 0.08, 2.05 - bob * 0.08, 1);

      if (player.swing > 0) {
        player.swing = Math.max(0, player.swing - dt * 4.8);
        const progress = 1 - player.swing;
        const windup = Math.sin(progress * Math.PI);
        const cut = Math.min(1, progress * 1.35);
        player.swordPivot.position.set(swordBaseX + swordSide * cut * 0.22, 1.08 + windup * 0.08, swordBaseZ);
        player.swordMaterial.rotation = swordSide > 0 ? -1.6 + cut * 2.65 : 1.6 - cut * 2.65;
        player.weaponPivot.position.set(swordSide * (0.62 + cut * 0.14), 0.38 + windup * 0.1, swordBaseZ + 0.14);
        player.weaponPivot.rotation.z = swordSide > 0 ? -0.95 + cut * 1.75 : 0.95 - cut * 1.75;
        player.weaponPivot.rotation.y = swordSide > 0 ? 0 : Math.PI;
        player.mesh.scale.setScalar(player.invulnerable > 0 ? 1.08 : 1 + windup * 0.035);
      } else {
        player.swordPivot.position.x = THREE.MathUtils.lerp(player.swordPivot.position.x, swordBaseX, 0.22);
        player.swordPivot.position.y = THREE.MathUtils.lerp(player.swordPivot.position.y, 1.05, 0.22);
        player.swordPivot.position.z = THREE.MathUtils.lerp(player.swordPivot.position.z, swordBaseZ, 0.22);
        player.swordMaterial.rotation = THREE.MathUtils.lerp(player.swordMaterial.rotation, swordIdleRotation, 0.22);
        player.weaponPivot.position.x = THREE.MathUtils.lerp(player.weaponPivot.position.x, swordSide * 0.64, 0.25);
        player.weaponPivot.position.y = THREE.MathUtils.lerp(player.weaponPivot.position.y, 0.38 + bob, 0.25);
        player.weaponPivot.position.z = THREE.MathUtils.lerp(player.weaponPivot.position.z, swordBaseZ + 0.14, 0.25);
        player.weaponPivot.rotation.z = THREE.MathUtils.lerp(player.weaponPivot.rotation.z, weaponIdleRotation, 0.25);
        player.weaponPivot.rotation.y = swordSide > 0 ? 0 : Math.PI;
        playCharacterAction(walking ? "walk" : "idle");
      }

      if (player.attackRange.visible) {
        player.attackRange.userData.life -= dt;
        player.attackRange.visible = player.attackRange.userData.life > 0;
      }
    }

    function updateHpBar(actor: Actor) {
      if (!actor.hpBar) return;
      const hpHeight = (actor.mesh.userData.hpHeight as number | undefined) ?? 0.98;
      actor.hpBar.position.set(actor.mesh.position.x, actor.mesh.position.y + hpHeight, actor.mesh.position.z);
      actor.hpBar.lookAt(camera.position);
      const fill = actor.hpBar.children.find((child) => child.userData.kind === "hp-fill") as THREE.Mesh | undefined;
      if (!fill) return;
      const percent = THREE.MathUtils.clamp(actor.hp / actor.maxHp, 0, 1);
      const width = fill.userData.fullWidth as number;
      fill.scale.x = percent;
      fill.position.x = -(width * (1 - percent)) / 2;
    }

    function updateActors(dt: number) {
      game.enemies.forEach((enemy) => {
        if (!enemy.alive) return;

        enemy.phase += dt;
        const toPlayer = player.mesh.position.clone().sub(enemy.mesh.position);
        if (toPlayer.length() < 5.5) {
          enemy.mesh.position.add(toPlayer.normalize().multiplyScalar(enemy.speed * dt));
        } else {
          enemy.mesh.position.x = enemy.home.x + Math.sin(enemy.phase * 1.7) * 1.1;
        }

        const enemyScale = (enemy.mesh.userData.baseScale as number | undefined) ?? 1;
        if (enemyScale < 0.95) {
          enemy.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
        } else {
          enemy.mesh.rotation.y += dt * 2.2;
        }
        enemy.mesh.scale.lerp(new THREE.Vector3(enemyScale, enemyScale, enemyScale), 0.16);
        if (enemy.mesh.position.distanceTo(player.mesh.position) < 0.95) {
          damagePlayer(enemy.damage, enemy.mesh.position);
        }
        updateHpBar(enemy);
      });

      if (game.boss?.alive) {
        const boss = game.boss;
        boss.phase += dt;
        const toPlayer = new THREE.Vector3(
          player.mesh.position.x - boss.mesh.position.x,
          0,
          player.mesh.position.z - boss.mesh.position.z,
        );
        const planarDistance = toPlayer.length();
        const collisionRadius = 1.3;
        const rush = Math.sin(boss.phase * 1.45) > 0.58 ? 1.9 : 1;

        if (planarDistance > collisionRadius) {
          const moveDistance = Math.min(
            boss.speed * rush * dt,
            planarDistance - collisionRadius,
          );
          boss.mesh.position.add(toPlayer.normalize().multiplyScalar(moveDistance));
        } else {
          const separation =
            planarDistance > 0.001
              ? toPlayer.normalize()
              : player.facing.clone().multiplyScalar(-1).setY(0).normalize();
          player.mesh.position.add(
            separation.multiplyScalar(Math.max(0.04, collisionRadius - planarDistance + 0.02)),
          );
        }

        const bossGroundY = (boss.mesh.userData.groundY as number | undefined) ?? 1.55;
        boss.mesh.position.y = bossGroundY + Math.sin(boss.phase * 4.5) * 0.13;
        const bossScale = (boss.mesh.userData.baseScale as number | undefined) ?? 2.7;
        if (bossScale < 2) {
          boss.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
        } else {
          boss.mesh.rotation.y += dt * 1.6;
        }
        boss.mesh.scale.lerp(new THREE.Vector3(bossScale, bossScale, bossScale), 0.12);

        const shadow = boss.mesh.userData.shadow as THREE.Mesh | undefined;
        if (shadow) {
          shadow.position.set(boss.mesh.position.x, 0.04, boss.mesh.position.z);
        }
        updateHpBar(boss);

        const contactDistance = Math.hypot(
          boss.mesh.position.x - player.mesh.position.x,
          boss.mesh.position.z - player.mesh.position.z,
        );
        if (contactDistance <= collisionRadius + 0.06) {
          damagePlayer(boss.damage, boss.mesh.position);
        }
      }

      if (game.crystal) {
        game.crystal.rotation.y += dt * 1.6;
        game.crystal.position.y = 1.2 + Math.sin(performance.now() * 0.003) * 0.14;
        if (game.crystal.position.distanceTo(player.mesh.position) < 1.25) interact();
      }

      if (game.portal) {
        game.portal.rotation.z += dt * 1.2;
        game.portal.scale.setScalar(1 + Math.sin(performance.now() * 0.004) * 0.035);
      }
    }

    function updateParticles(dt: number) {
      game.particles = game.particles.filter((particle) => {
        particle.userData.life -= dt;

        if (particle.userData.velocity) {
          particle.position.add(particle.userData.velocity.clone().multiplyScalar(dt));
          particle.userData.velocity.y -= 4.6 * dt;
        }

        if ("opacity" in particle.material) {
          (particle.material as THREE.Material & { opacity: number }).opacity = Math.max(
            0,
            particle.userData.life * 4,
          );
        }

        particle.scale.multiplyScalar(0.975);
        if (particle.userData.life <= 0) {
          root.remove(particle);
          return false;
        }
        return true;
      });
    }

    function updateCamera(dt: number) {
      const target = player.mesh.position.clone().add(new THREE.Vector3(0, 7.9, 9.2));
      camera.position.lerp(target, 1 - Math.pow(0.001, dt));
      camera.lookAt(player.mesh.position.x, player.mesh.position.y + 0.5, player.mesh.position.z);
    }

    const clock = new THREE.Clock();
    let animationFrame = 0;
    let hudTimer = 0;

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.033);

      if (game.mode === "playing") {
        updatePlayer(dt);
        playerMixer?.update(dt);
        enemyMixers.forEach((mixer) => mixer.update(dt));
        bossMixer?.update(dt);
        updateActors(dt);
        updateParticles(dt);
        updateCamera(dt);
        hudTimer += dt;
        if (hudTimer > 0.12) {
          hudTimer = 0;
          updateHud();
        }
      }

      game.runes.forEach((rune) => {
        rune.mesh.rotation.y += dt * (rune.active ? 1.3 : 0.35);
      });

      const waterTime = clock.elapsedTime;
      game.waterSurfaces.forEach((surface, index) => {
        surface.position.y = 0.16 + Math.sin(waterTime * 1.25 + index) * 0.012;
      });

      root.children.forEach((child) => {
        if (typeof child.userData.rippleOffset === "number") {
          const pulse = (Math.sin(waterTime * 1.6 + child.userData.rippleOffset) + 1) / 2;
          const rippleScale = child.userData.rippleScale as THREE.Vector3;
          child.scale.copy(rippleScale).multiplyScalar(1 + pulse * 0.08);
          const material = (child as THREE.Mesh).material;
          if (material instanceof THREE.MeshBasicMaterial) material.opacity = 0.16 + pulse * 0.2;
        }
      });

      root.children.forEach((child) => {
        if (child instanceof THREE.Sprite) child.lookAt(camera.position);
      });

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    }

    function onKeyDown(event: KeyboardEvent) {
      keys.add(event.key.toLowerCase());
      if (event.key === " ") {
        event.preventDefault();
        attack();
      }
      if (event.key.toLowerCase() === "e") interact();
    }

    function onKeyUp(event: KeyboardEvent) {
      keys.delete(event.key.toLowerCase());
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button === 0) attack();
    }

    function onResize() {
      const currentMount = mountRef.current;
      if (!currentMount) return;
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
    }

    addForestTemple();
    addRunes();
    addEnemies();
    root.children.forEach((child) => {
      if (child !== player.mesh) child.visible = false;
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    mount.dataset.ready = "true";
    (mount as HTMLDivElement & { startCrystalsGame?: () => void }).startCrystalsGame = startGame;
    if (new URLSearchParams(window.location.search).get("autostart") === "1") {
      window.setTimeout(startGame, 250);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.dispose();
      mount.innerHTML = "";
      keys.clear();
    };
  }, []);

  function startThreeGame() {
    const mount = mountRef.current as (HTMLDivElement & { startCrystalsGame?: () => void }) | null;
    mount?.startCrystalsGame?.();
    setMode("playing");
  }

  async function toggleFullscreen() {
    const frame = frameRef.current;
    if (!frame || !document.fullscreenEnabled) return;

    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
    } else {
      await frame.requestFullscreen();
    }
  }

  return (
    <div className="crystals-route">
      <div className="crystals-topbar">
        <Link to="/projects">
          <ArrowLeft size={17} />
          Projekt
        </Link>
        <a href="/games/the-five-crystals/index.html" target="_blank" rel="noreferrer">
          Öppna 2D-versionen
          <ExternalLink size={16} />
        </a>
      </div>

      <section
        className="crystals-frame crystals-frame-3d"
        aria-label="The Five Crystals 3D MVP"
        ref={frameRef}
      >
        <div className="crystals-canvas" ref={mountRef} />

        <button
          className="fullscreen-toggle"
          onClick={toggleFullscreen}
          type="button"
          aria-label={isFullscreen ? "Avsluta fullscreen" : "Spela i fullscreen"}
          title={isFullscreen ? "Avsluta fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          <span>{isFullscreen ? "Avsluta" : "Fullscreen"}</span>
        </button>

        <div className="crystals-hud">
          <div className="player-card">
            <span className="hero-portrait">S</span>
            <section>
              <strong>S.Phil</strong>
              <span>Level 1</span>
              <i className="hp-track">
                <b style={{ width: `${(hud.hp / hud.maxHp) * 100}%` }} />
              </i>
              <small>
                HP {hud.hp}/{hud.maxHp}
              </small>
            </section>
          </div>
          <div className="resource-card">
            <span>Kristaller</span>
            <strong>{hud.crystals}/5</strong>
          </div>
          <div className="resource-card">
            <span>Utrustning</span>
            <strong>{hud.stage === "complete" ? "Skogskristallen" : "Träsvärd"}</strong>
          </div>
        </div>

        <div className="action-wheel" aria-label="Kontroller">
          <span className="action-button action-y">
            <b>Y</b>
            Verktyg
          </span>
          <span className="action-button action-x">
            <b>X</b>
            Kristall
          </span>
          <span className="action-button action-b">
            <b>B</b>
            Dodge
          </span>
          <span className="action-button action-a">
            <b>A</b>
            Attack
          </span>
        </div>

        <aside className="temple-panel">
          <span>Uppdrag</span>
          <strong>Whisperwood: Root Temple</strong>
          <p>{hud.objective}</p>
          <small>{hud.message}</small>

          {hud.bossHp > 0 ? (
            <div className="boss-meter" aria-label="Rotbarbaren HP">
              <span>Rotbarbaren</span>
              <b style={{ width: `${(hud.bossHp / hud.bossMaxHp) * 100}%` }} />
            </div>
          ) : null}
        </aside>

        <div className="level-map" aria-label="Karta över Whisperwood">
          <div className="level-map-heading">
            <span>Bana 1</span>
            <strong>{hud.currentZone}</strong>
          </div>
          <div className="level-map-field">
            {levelOne.zones.map((zone) => (
              <i
                className={`map-zone ${zone.name === hud.currentZone ? "active" : ""}`}
                key={zone.id}
                title={zone.name}
                style={{
                  left: `${((zone.center.x + levelOne.bounds.x) / (levelOne.bounds.x * 2)) * 100}%`,
                  top: `${((levelOne.bounds.z - zone.center.z) / (levelOne.bounds.z * 2)) * 100}%`,
                }}
              />
            ))}
            <b
              className="map-player"
              style={{
                left: `${((hud.playerX + levelOne.bounds.x) / (levelOne.bounds.x * 2)) * 100}%`,
                top: `${((levelOne.bounds.z - hud.playerZ) / (levelOne.bounds.z * 2)) * 100}%`,
              }}
            />
          </div>
        </div>

        {mode === "intro" ? (
          <div className="crystals-overlay">
            <div>
              <p className="crystals-eyebrow">Spelbar 3D MVP</p>
              <h1>The Five Crystals</h1>
              <p>
                Första målet är enkelt: klara Root Temple, lös runpusslet, besegra väktaren och samla
                Skogskristallen.
              </p>
              <div className="crystals-controls">
                <span>WASD / piltangenter</span>
                <span>Attack: mellanslag eller vänsterklick</span>
                <span>Interagera: E</span>
              </div>
              <button onClick={startThreeGame} type="button">
                Starta Root Temple
              </button>
            </div>
          </div>
        ) : null}

        {mode === "gameover" ? (
          <div className="crystals-overlay">
            <div>
              <p className="crystals-eyebrow">Rotbarbaren vann</p>
              <h2>Game Over</h2>
              <p>Testa igen. Håll dig i rörelse, aktivera runorna och attackera bossen efter hans rusningar.</p>
              <button onClick={startThreeGame} type="button">
                Försök igen
              </button>
            </div>
          </div>
        ) : null}

        {mode === "victory" ? (
          <div className="crystals-overlay victory-overlay">
            <div className="victory-crystals" aria-hidden="true">
              <i style={{ "--crystal": "#62e68f" } as React.CSSProperties} />
              <i style={{ "--crystal": "#f7c66b" } as React.CSSProperties} />
              <i style={{ "--crystal": "#8be7ff" } as React.CSSProperties} />
            </div>
            <div>
              <p className="crystals-eyebrow">Första kristallen är säkrad</p>
              <h2>Root Temple klart</h2>
              <p>
                Skogskristallen lyser och nästa värld kan byggas ovanpå samma spelkänsla utan att vi
                behöver stressa fram allt på en gång.
              </p>
              <button onClick={startThreeGame} type="button">
                Spela slicen igen
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
