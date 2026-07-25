const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const hud = document.querySelector("#hud");
const hpFill = document.querySelector("#hpFill");
const hpText = document.querySelector("#hpText");
const crystalText = document.querySelector("#crystalText");
const gearText = document.querySelector("#gearText");
const worldCard = document.querySelector("#worldCard");
const worldName = document.querySelector("#worldName");
const worldKicker = document.querySelector("#worldKicker");
const dialog = document.querySelector("#dialog");
const dialogText = document.querySelector("#dialogText");
const startScreen = document.querySelector("#startScreen");
const gameOverScreen = document.querySelector("#gameOverScreen");
const victoryScreen = document.querySelector("#victoryScreen");
const celebrationLayer = document.querySelector("#celebrationLayer");

const keys = new Set();
let lastTime = 0;
let attackPressed = false;
let interactPressed = false;

const worlds = [
  {
    id: "forest",
    name: "Whisperwood Forest",
    crystal: "Skogskristallen",
    boss: "Root Guardian",
    reward: "Snabbare rörelse",
    color: "#3fe087",
    dark: "#123b2a",
    rect: { x: 120, y: 120, w: 430, h: 300 },
    puzzle: { label: "Runstenar 0/3", count: 3 },
  },
  {
    id: "volcano",
    name: "Emberfall Volcano",
    crystal: "Eldkristallen",
    boss: "Flame Colossus",
    reward: "Starkare attack",
    color: "#ff784a",
    dark: "#4d1a13",
    rect: { x: 720, y: 110, w: 430, h: 310 },
    puzzle: { label: "Lavabroar 0/3", count: 3 },
  },
  {
    id: "frost",
    name: "Frostpeak Ruins",
    crystal: "Iskristallen",
    boss: "Frost Warden",
    reward: "Sköld",
    color: "#86e7ff",
    dark: "#12354b",
    rect: { x: 1220, y: 520, w: 420, h: 310 },
    puzzle: { label: "Isblock 0/3", count: 3 },
  },
  {
    id: "storm",
    name: "Skybreak Cliffs",
    crystal: "Stormkristallen",
    boss: "Thunder Roc",
    reward: "Dash",
    color: "#f7d96a",
    dark: "#443614",
    rect: { x: 650, y: 860, w: 430, h: 300 },
    puzzle: { label: "Vindportaler 0/3", count: 3 },
  },
  {
    id: "shadow",
    name: "Shadowmere Abyss",
    crystal: "Mörkerkristallen",
    boss: "Void Knight",
    reward: "Magisk attack",
    color: "#a47bff",
    dark: "#25123f",
    rect: { x: 90, y: 770, w: 430, h: 320 },
    puzzle: { label: "Ljus/speglar 0/3", count: 3 },
  },
];

const kimaboArena = { x: 810, y: 485, w: 270, h: 230 };

const state = {
  mode: "start",
  camera: { x: 0, y: 0 },
  currentWorld: null,
  particles: [],
  messages: [],
  crystals: new Set(),
  inventory: ["Träsvärd"],
  puzzleProgress: {},
  enemies: [],
  bosses: [],
  puzzleObjects: [],
  victoryTriggered: false,
};

const player = {
  x: 610,
  y: 560,
  r: 18,
  hp: 100,
  maxHp: 100,
  speed: 185,
  attack: 24,
  invulnerable: 0,
  attackCooldown: 0,
  dashCooldown: 0,
  facing: { x: 1, y: 0 },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function inRect(entity, rect) {
  return entity.x > rect.x && entity.x < rect.x + rect.w && entity.y > rect.y && entity.y < rect.y + rect.h;
}

function showDialog(text, duration = 3200) {
  state.messages.push({ text, until: performance.now() + duration });
}

function spawnParticles(x, y, color, amount = 18) {
  for (let i = 0; i < amount; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 220,
      vy: (Math.random() - 0.5) * 220,
      life: 0.7 + Math.random() * 0.45,
      maxLife: 1.1,
      color,
      size: 2 + Math.random() * 4,
    });
  }
}

function launchCelebrationLayer() {
  if (!celebrationLayer) return;

  const colors = ["#f7c66b", "#8de7ff", "#3fe087", "#ff784a", "#a47bff", "#ff4ed8"];
  celebrationLayer.innerHTML = "";

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty("--delay", `${Math.random() * 1.8}s`);
    piece.style.setProperty("--duration", `${2.8 + Math.random() * 2.3}s`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    celebrationLayer.append(piece);
  }

  for (let burst = 0; burst < 8; burst += 1) {
    const originX = 16 + Math.random() * 68;
    const originY = 12 + Math.random() * 52;

    for (let spark = 0; spark < 22; spark += 1) {
      const angle = (spark / 22) * Math.PI * 2;
      const distance = 70 + Math.random() * 115;
      const firework = document.createElement("span");
      firework.className = "firework-spark";
      firework.style.setProperty("--x", `${originX}%`);
      firework.style.setProperty("--y", `${originY}%`);
      firework.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      firework.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      firework.style.setProperty("--delay", `${burst * 0.34 + Math.random() * 0.16}s`);
      firework.style.setProperty("--color", colors[(burst + spark) % colors.length]);
      celebrationLayer.append(firework);
    }
  }

  const starts = [
    ["8%", "72%"],
    ["18%", "18%"],
    ["48%", "88%"],
    ["78%", "18%"],
    ["90%", "70%"],
  ];

  starts.forEach(([x, y], index) => {
    const crystal = document.createElement("span");
    crystal.className = "flying-crystal";
    crystal.style.setProperty("--start-x", x);
    crystal.style.setProperty("--start-y", y);
    crystal.style.setProperty("--to-x", `calc(50vw - ${x})`);
    crystal.style.setProperty("--to-y", `calc(50vh - ${y})`);
    crystal.style.setProperty("--delay", `${index * 0.18}s`);
    crystal.style.setProperty("--color", colors[index]);
    celebrationLayer.append(crystal);
  });
}

function triggerVictory() {
  if (state.victoryTriggered) return;

  state.victoryTriggered = true;
  state.mode = "win";
  hud.hidden = true;
  victoryScreen.hidden = false;
  launchCelebrationLayer();
  showDialog("Kimabo faller! De fem kristallerna flyger samman och världen fylls av ljus.");

  const colors = ["#f7c66b", "#8de7ff", "#3fe087", "#ff784a", "#a47bff", "#ff4ed8"];
  colors.forEach((color, index) => {
    spawnParticles(player.x + Math.cos(index) * 42, player.y + Math.sin(index) * 42, color, 42);
  });
}

function makeEnemy(world, index) {
  const x = world.rect.x + 80 + ((index * 120) % (world.rect.w - 140));
  const y = world.rect.y + 90 + ((index * 70) % (world.rect.h - 130));
  return {
    type: "enemy",
    worldId: world.id,
    x,
    y,
    homeX: x,
    homeY: y,
    r: 15,
    hp: 48,
    maxHp: 48,
    speed: 54,
    phase: Math.random() * Math.PI * 2,
    color: world.color,
    damage: 10,
  };
}

function makeBoss(world) {
  return {
    type: "boss",
    worldId: world.id,
    name: world.boss,
    x: world.rect.x + world.rect.w - 95,
    y: world.rect.y + world.rect.h / 2,
    r: 34,
    hp: 140,
    maxHp: 140,
    color: world.color,
    damage: 18,
    unlocked: false,
    defeated: false,
    attackTimer: 0,
  };
}

function makePuzzleObjects(world) {
  return Array.from({ length: world.puzzle.count }, (_, index) => ({
    id: `${world.id}-puzzle-${index}`,
    worldId: world.id,
    x: world.rect.x + 80 + index * 115,
    y: world.rect.y + world.rect.h - 78 - (index % 2) * 70,
    r: 18,
    active: false,
    color: world.color,
  }));
}

function resetGame() {
  state.mode = "play";
  state.crystals = new Set();
  state.inventory = ["Träsvärd"];
  state.puzzleProgress = {};
  state.enemies = worlds.flatMap((world) => [0, 1, 2].map((index) => makeEnemy(world, index)));
  state.bosses = worlds.map(makeBoss);
  state.puzzleObjects = worlds.flatMap(makePuzzleObjects);
  state.particles = [];
  state.messages = [];
  state.victoryTriggered = false;
  if (celebrationLayer) celebrationLayer.innerHTML = "";
  player.x = 610;
  player.y = 560;
  player.hp = player.maxHp;
  player.speed = 185;
  player.attack = 24;
  player.invulnerable = 0;
  player.attackCooldown = 0;
  hud.hidden = false;
  startScreen.hidden = true;
  gameOverScreen.hidden = true;
  victoryScreen.hidden = true;
  showDialog("Eldren: Samla de fem kristallerna. Varje värld kräver både mod och list.");
}

function unlockRewards(world) {
  state.crystals.add(world.id);
  state.inventory.push(world.reward);
  if (world.id === "forest") player.speed += 35;
  if (world.id === "volcano") player.attack += 16;
  if (world.id === "frost") player.maxHp += 25;
  if (world.id === "storm") player.dashCooldown = 0;
  if (world.id === "shadow") player.attack += 10;
  player.hp = player.maxHp;
  spawnParticles(player.x, player.y, world.color, 48);
  showDialog(`${world.crystal} lyser upp! Ny kraft: ${world.reward}.`);
}

function currentWorldForPlayer() {
  return worlds.find((world) => inRect(player, world.rect)) ?? null;
}

function updateWorldState() {
  const world = currentWorldForPlayer();
  state.currentWorld = world;
  worldCard.hidden = !world;
  if (world) {
    worldName.textContent = world.name;
    const progress = state.puzzleProgress[world.id] ?? 0;
    worldKicker.textContent = state.crystals.has(world.id) ? "Kristall säkrad" : `${world.puzzle.label.replace("0", progress)}`;
  }
}

function updatePlayer(dt) {
  let mx = 0;
  let my = 0;
  if (keys.has("arrowleft") || keys.has("a")) mx -= 1;
  if (keys.has("arrowright") || keys.has("d")) mx += 1;
  if (keys.has("arrowup") || keys.has("w")) my -= 1;
  if (keys.has("arrowdown") || keys.has("s")) my += 1;

  if (mx || my) {
    const mag = Math.hypot(mx, my);
    mx /= mag;
    my /= mag;
    player.facing = { x: mx, y: my };
    player.x += mx * player.speed * dt;
    player.y += my * player.speed * dt;
  }

  if ((keys.has("shift") || keys.has("x")) && state.crystals.has("storm") && player.dashCooldown <= 0) {
    player.x += player.facing.x * 110;
    player.y += player.facing.y * 110;
    player.dashCooldown = 1.2;
    spawnParticles(player.x, player.y, "#f7d96a", 12);
  }

  player.x = clamp(player.x, 40, 1720);
  player.y = clamp(player.y, 60, 1230);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
}

function attack() {
  if (player.attackCooldown > 0) return;
  player.attackCooldown = 0.34;
  const attackPoint = {
    x: player.x + player.facing.x * 42,
    y: player.y + player.facing.y * 42,
  };
  const radius = state.crystals.has("shadow") ? 74 : 56;
  spawnParticles(attackPoint.x, attackPoint.y, state.crystals.has("shadow") ? "#a47bff" : "#ffe39b", 14);

  [...state.enemies, ...state.bosses].forEach((target) => {
    if (target.defeated || target.hp <= 0) return;
    if (dist(attackPoint, target) < radius + target.r) {
      target.hp -= player.attack;
      target.hit = 0.14;
      spawnParticles(target.x, target.y, target.color, 10);
      if (target.hp <= 0) defeatTarget(target);
    }
  });
}

function defeatTarget(target) {
  if (target.type === "enemy") {
    showDialog("En fiende föll. Kristallvägen blir säkrare.");
    return;
  }
  if (target.worldId === "kimabo") {
    triggerVictory();
    return;
  }
  target.defeated = true;
  const world = worlds.find((item) => item.id === target.worldId);
  if (world && !state.crystals.has(world.id)) unlockRewards(world);
}

function interact() {
  const nearbyPuzzle = state.puzzleObjects.find((item) => !item.active && dist(player, item) < 48);
  if (nearbyPuzzle) {
    nearbyPuzzle.active = true;
    state.puzzleProgress[nearbyPuzzle.worldId] = (state.puzzleProgress[nearbyPuzzle.worldId] ?? 0) + 1;
    const world = worlds.find((item) => item.id === nearbyPuzzle.worldId);
    spawnParticles(nearbyPuzzle.x, nearbyPuzzle.y, nearbyPuzzle.color, 22);
    if (world && state.puzzleProgress[world.id] >= world.puzzle.count) {
      const boss = state.bosses.find((item) => item.worldId === world.id);
      if (boss) boss.unlocked = true;
      showDialog(`${world.boss} vaknar. Besegra bossen för att få ${world.crystal}.`);
    } else {
      showDialog("Runan svarar. Något långt borta börjar röra sig.");
    }
    return;
  }

  if (state.crystals.size === 5 && inRect(player, kimaboArena)) {
    const kimabo = state.bosses.find((boss) => boss.worldId === "kimabo");
    if (!kimabo) spawnKimabo();
  } else {
    showDialog(state.crystals.size === 5 ? "Porten till Kimabo finns i mittenarenan." : "Samla alla fem kristaller innan Kimabo kan nås.");
  }
}

function spawnKimabo() {
  state.bosses.push({
    type: "boss",
    worldId: "kimabo",
    name: "Kimabo",
    x: kimaboArena.x + kimaboArena.w / 2,
    y: kimaboArena.y + kimaboArena.h / 2,
    r: 54,
    hp: 420,
    maxHp: 420,
    color: "#ff4ed8",
    damage: 24,
    unlocked: true,
    defeated: false,
    attackTimer: 0,
  });
  showDialog("Kimabo stiger fram ur mörkret. Alla kristaller darrar.");
}

function damagePlayer(amount, source) {
  if (player.invulnerable > 0) return;
  const shield = state.crystals.has("frost") ? 0.7 : 1;
  player.hp -= Math.round(amount * shield);
  player.invulnerable = 0.65;
  spawnParticles(player.x, player.y, "#ff5f6d", 18);
  if (source) {
    const pushX = player.x - source.x;
    const pushY = player.y - source.y;
    const mag = Math.hypot(pushX, pushY) || 1;
    player.x += (pushX / mag) * 34;
    player.y += (pushY / mag) * 34;
  }
  if (player.hp <= 0) {
    state.mode = "gameover";
    hud.hidden = true;
    gameOverScreen.hidden = false;
  }
}

function updateEnemies(dt) {
  state.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    enemy.phase += dt;
    const chase = dist(player, enemy) < 160;
    if (chase) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const mag = Math.hypot(dx, dy) || 1;
      enemy.x += (dx / mag) * enemy.speed * 1.35 * dt;
      enemy.y += (dy / mag) * enemy.speed * 1.35 * dt;
    } else {
      enemy.x = enemy.homeX + Math.cos(enemy.phase) * 42;
      enemy.y = enemy.homeY + Math.sin(enemy.phase * 0.8) * 36;
    }
    if (dist(player, enemy) < player.r + enemy.r) damagePlayer(enemy.damage, enemy);
    enemy.hit = Math.max(0, (enemy.hit ?? 0) - dt);
  });
}

function updateBosses(dt) {
  state.bosses.forEach((boss) => {
    if (boss.defeated || boss.hp <= 0 || !boss.unlocked) return;
    boss.attackTimer += dt;
    const dx = player.x - boss.x;
    const dy = player.y - boss.y;
    const mag = Math.hypot(dx, dy) || 1;
    const speed = boss.worldId === "kimabo" ? 82 : 48;
    boss.x += (dx / mag) * speed * dt;
    boss.y += (dy / mag) * speed * dt;

    if (boss.attackTimer > (boss.worldId === "kimabo" ? 1.05 : 1.55)) {
      boss.attackTimer = 0;
      const amount = boss.worldId === "kimabo" ? 34 : 18;
      spawnParticles(player.x, player.y, boss.color, amount);
      if (dist(player, boss) < (boss.worldId === "kimabo" ? 150 : 105)) damagePlayer(boss.damage, boss);
    }

    if (dist(player, boss) < player.r + boss.r) damagePlayer(boss.damage, boss);
    boss.hit = Math.max(0, (boss.hit ?? 0) - dt);

    if (boss.worldId === "kimabo" && boss.hp <= 0) triggerVictory();
  });
}

function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.96;
    particle.vy *= 0.96;
    return particle.life > 0;
  });
}

function updateUi() {
  hpFill.style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
  hpText.textContent = `${Math.max(0, player.hp)}/${player.maxHp}`;
  crystalText.textContent = `${state.crystals.size}/5`;
  gearText.textContent = state.inventory.at(-1) ?? "Träsvärd";
  const now = performance.now();
  state.messages = state.messages.filter((message) => message.until > now);
  dialog.hidden = state.messages.length === 0;
  if (state.messages.length) dialogText.textContent = state.messages[0].text;
}

function drawRoundedRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawWorld(world) {
  drawRoundedRect(world.rect.x, world.rect.y, world.rect.w, world.rect.h, 40, world.dark, `${world.color}55`);
  const gradient = ctx.createRadialGradient(
    world.rect.x + world.rect.w / 2,
    world.rect.y + world.rect.h / 2,
    20,
    world.rect.x + world.rect.w / 2,
    world.rect.y + world.rect.h / 2,
    world.rect.w * 0.7,
  );
  gradient.addColorStop(0, `${world.color}33`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(world.rect.x, world.rect.y, world.rect.w, world.rect.h);
  ctx.fillStyle = "#fff7e8";
  ctx.globalAlpha = 0.8;
  ctx.font = "900 20px system-ui";
  ctx.fillText(world.name, world.rect.x + 28, world.rect.y + 38);
  ctx.globalAlpha = 1;
}

function drawEntity(entity, label) {
  ctx.save();
  ctx.shadowColor = entity.color;
  ctx.shadowBlur = entity.hit ? 30 : 18;
  ctx.fillStyle = entity.hit ? "#fff7e8" : entity.color;
  ctx.beginPath();
  ctx.arc(entity.x, entity.y, entity.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (label) {
    ctx.fillStyle = "rgba(255,247,232,.88)";
    ctx.font = "800 13px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, entity.x, entity.y - entity.r - 12);
  }

  if (entity.maxHp && entity.hp < entity.maxHp && entity.hp > 0) {
    const w = entity.r * 2.2;
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(entity.x - w / 2, entity.y + entity.r + 8, w, 5);
    ctx.fillStyle = "#ff5f6d";
    ctx.fillRect(entity.x - w / 2, entity.y + entity.r + 8, w * (entity.hp / entity.maxHp), 5);
  }
  ctx.restore();
}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-state.camera.x, -state.camera.y);

  const bg = ctx.createLinearGradient(0, 0, 1800, 1300);
  bg.addColorStop(0, "#101b25");
  bg.addColorStop(0.55, "#161229");
  bg.addColorStop(1, "#090711");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1800, 1300);

  for (let i = 0; i < 130; i += 1) {
    const x = (i * 137) % 1800;
    const y = (i * 73) % 1300;
    ctx.fillStyle = i % 5 === 0 ? "rgba(247,198,107,.35)" : "rgba(255,255,255,.13)";
    ctx.fillRect(x, y, 2, 2);
  }

  worlds.forEach(drawWorld);
  drawRoundedRect(kimaboArena.x, kimaboArena.y, kimaboArena.w, kimaboArena.h, 42, "#190b24", "#ff4ed855");
  ctx.fillStyle = state.crystals.size === 5 ? "#ff95e6" : "rgba(255,255,255,.36)";
  ctx.font = "900 20px system-ui";
  ctx.fillText(state.crystals.size === 5 ? "Kimabos arena är öppen" : "Kimabos arena är låst", kimaboArena.x + 28, kimaboArena.y + 42);

  state.puzzleObjects.forEach((item) => {
    ctx.save();
    ctx.shadowColor = item.color;
    ctx.shadowBlur = item.active ? 26 : 10;
    ctx.strokeStyle = item.active ? item.color : "rgba(255,255,255,.42)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(item.x - item.r, item.y - item.r, item.r * 2, item.r * 2);
    ctx.stroke();
    ctx.restore();
  });

  state.enemies.filter((enemy) => enemy.hp > 0).forEach((enemy) => drawEntity(enemy));
  state.bosses
    .filter((boss) => boss.unlocked && !boss.defeated && boss.hp > 0)
    .forEach((boss) => drawEntity(boss, boss.name));

  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.save();
  ctx.shadowColor = player.invulnerable > 0 ? "#ff5f6d" : "#8de7ff";
  ctx.shadowBlur = player.invulnerable > 0 ? 30 : 18;
  ctx.fillStyle = player.invulnerable > 0 ? "#fff7e8" : "#8de7ff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#101021";
  ctx.beginPath();
  ctx.arc(player.x + player.facing.x * 7, player.y + player.facing.y * 7, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function updateCamera() {
  state.camera.x += (player.x - canvas.width / 2 - state.camera.x) * 0.08;
  state.camera.y += (player.y - canvas.height / 2 - state.camera.y) * 0.08;
  state.camera.x = clamp(state.camera.x, 0, 1800 - canvas.width);
  state.camera.y = clamp(state.camera.y, 0, 1300 - canvas.height);
}

function loop(timestamp) {
  const dt = Math.min(0.033, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  if (state.mode === "play") {
    if (attackPressed) attack();
    if (interactPressed) interact();
    attackPressed = false;
    interactPressed = false;
    updatePlayer(dt);
    updateEnemies(dt);
    updateBosses(dt);
    updateParticles(dt);
    updateWorldState();
    updateCamera();
    updateUi();
  }

  if (state.mode === "win") {
    updateParticles(dt);
    updateUi();
  }

  drawMap();
  requestAnimationFrame(loop);
}

document.querySelector("#startButton").addEventListener("click", resetGame);
document.querySelectorAll("[data-restart]").forEach((button) => button.addEventListener("click", resetGame));

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys.add(key);
  if (key === " ") {
    event.preventDefault();
    attackPressed = true;
  }
  if (key === "e") interactPressed = true;
});

window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));

canvas.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || state.mode !== "play") return;
  attackPressed = true;
  canvas.setPointerCapture(event.pointerId);
});

requestAnimationFrame(loop);
