export type MapPoint = {
  x: number;
  z: number;
};

export type LevelZone = {
  id: "camp" | "trail" | "runes" | "lanterns" | "temple";
  name: string;
  subtitle: string;
  center: MapPoint;
  radius: number;
  color: number;
};

export type PathSegment = {
  from: MapPoint;
  to: MapPoint;
  width: number;
};

export const levelOne = {
  id: "whisperwood",
  name: "Whisperwood Forest",
  bounds: { x: 27, z: 25 },
  playerSpawn: { x: 0, z: 20 },
  bossSpawn: { x: 0, z: -18 },
  crystalSpawn: { x: 0, z: -18 },
  portalSpawn: { x: 0, z: -21 },
  zones: [
    {
      id: "camp",
      name: "Visklägret",
      subtitle: "Äventyret börjar",
      center: { x: 0, z: 20 },
      radius: 5.5,
      color: 0x68c978,
    },
    {
      id: "trail",
      name: "Mossstigen",
      subtitle: "Följ lyktorna norrut",
      center: { x: 0, z: 11 },
      radius: 5,
      color: 0x59bd69,
    },
    {
      id: "runes",
      name: "Runlunden",
      subtitle: "Stenarna minns ordningen",
      center: { x: -10, z: 1 },
      radius: 7,
      color: 0x4bad66,
    },
    {
      id: "lanterns",
      name: "Lyktvattnen",
      subtitle: "Två ljus öppnar vägen",
      center: { x: 10, z: 0 },
      radius: 7.5,
      color: 0x50b873,
    },
    {
      id: "temple",
      name: "Root Temple",
      subtitle: "Björnvaktens arena",
      center: { x: 0, z: -17 },
      radius: 8,
      color: 0x42965c,
    },
  ] satisfies LevelZone[],
  paths: [
    { from: { x: 0, z: 20 }, to: { x: 0, z: 11 }, width: 3.7 },
    { from: { x: 0, z: 11 }, to: { x: -10, z: 1 }, width: 3.4 },
    { from: { x: -10, z: 1 }, to: { x: 0, z: -7 }, width: 3.4 },
    { from: { x: 0, z: -7 }, to: { x: 10, z: 0 }, width: 3.4 },
    { from: { x: 10, z: 0 }, to: { x: 0, z: -17 }, width: 3.7 },
  ] satisfies PathSegment[],
  runePositions: [
    { x: -14, z: 2 },
    { x: -10, z: -2.5 },
    { x: -6, z: 2 },
  ],
  lanternPositions: [
    { x: 6.5, z: 1.8 },
    { x: 13.5, z: -1.5 },
  ],
  enemySpawns: [
    { x: -2.5, z: 12 },
    { x: 3, z: 8.5 },
    { x: -5.5, z: -7 },
    { x: 6, z: -8.5 },
  ],
} as const;

