export type Planet = {
  id: string;
  name: string;
  kind: "Stjärna" | "Planet";
  subtitle: string;
  shortDescription: string;
  distanceFromSun: string;
  diameter: string;
  orbitalPeriod: string;
  temperature: string;
  color: string;
  glowColor: string;
  size: number;
  textureGradient: string;
};

export const planets: Planet[] = [
  {
    id: "sun",
    name: "Solen",
    kind: "Stjärna",
    subtitle: "Systemets glödande centrum",
    shortDescription:
      "En levande motor av plasma och ljus. Varje bana börjar här, där värme, gravitation och tid sätter rytmen för hela systemet.",
    distanceFromSun: "0 km",
    diameter: "1,39M km",
    orbitalPeriod: "Centrum",
    temperature: "5 500°C yta",
    color: "#f59e0b",
    glowColor: "rgba(249, 115, 22, 0.62)",
    size: 1.34,
    textureGradient:
      "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.22) 0 13%, transparent 14%), radial-gradient(circle at 70% 82%, rgba(251,146,60,0.28) 0 22%, transparent 23%), linear-gradient(145deg, #fff3a3 0%, #f59e0b 38%, #c2410c 72%, #451a03 100%)",
  },
  {
    id: "mercury",
    name: "Merkurius",
    kind: "Planet",
    subtitle: "Den brända budbäraren",
    shortDescription:
      "En kraterfylld värld närmast solen, formad av extrema temperaturskiften och en tystnad som nästan känns månlik.",
    distanceFromSun: "57,9M km",
    diameter: "4 879 km",
    orbitalPeriod: "88 dagar",
    temperature: "-173 till 427°C",
    color: "#9b7a62",
    glowColor: "rgba(202, 137, 88, 0.38)",
    size: 0.74,
    textureGradient:
      "radial-gradient(circle at 34% 28%, #c7a17f 0 8%, transparent 9%), radial-gradient(circle at 64% 62%, #6f5747 0 10%, transparent 11%), linear-gradient(145deg, #b08b6d 0%, #705847 46%, #3a3029 100%)",
  },
  {
    id: "venus",
    name: "Venus",
    kind: "Planet",
    subtitle: "Den beslöjade ugnen",
    shortDescription:
      "En lysande planet gömd under täta moln, vacker på avstånd och brutalt het under sin gyllene atmosfär.",
    distanceFromSun: "108,2M km",
    diameter: "12 104 km",
    orbitalPeriod: "225 dagar",
    temperature: "464°C",
    color: "#d7a45d",
    glowColor: "rgba(251, 191, 36, 0.38)",
    size: 0.96,
    textureGradient:
      "repeating-linear-gradient(165deg, rgba(255,255,255,0.16) 0 9px, transparent 10px 28px), radial-gradient(circle at 38% 24%, #ffe0a3 0 9%, transparent 10%), linear-gradient(145deg, #e8bd73 0%, #b8793f 54%, #5b3624 100%)",
  },
  {
    id: "earth",
    name: "Jorden",
    kind: "Planet",
    subtitle: "Den levande havsvärlden",
    shortDescription:
      "Blå hav, gröna landskap och en tunn atmosfär gör jorden till den enda kända världen där liv har format om ytan.",
    distanceFromSun: "149,6M km",
    diameter: "12 742 km",
    orbitalPeriod: "365 dagar",
    temperature: "15°C medel",
    color: "#2f8fd6",
    glowColor: "rgba(56, 189, 248, 0.42)",
    size: 1,
    textureGradient:
      "radial-gradient(circle at 32% 38%, #52b788 0 10%, transparent 11%), radial-gradient(circle at 58% 55%, #2d6a4f 0 11%, transparent 12%), radial-gradient(circle at 72% 28%, rgba(255,255,255,0.65) 0 7%, transparent 8%), linear-gradient(145deg, #4cc9f0 0%, #1d4ed8 54%, #05264f 100%)",
  },
  {
    id: "mars",
    name: "Mars",
    kind: "Planet",
    subtitle: "Det röda arkivet",
    shortDescription:
      "En kall ökenplanet med torra flodbäddar, järnrik sand och spår av en äldre, våtare värld.",
    distanceFromSun: "227,9M km",
    diameter: "6 779 km",
    orbitalPeriod: "687 dagar",
    temperature: "-63°C medel",
    color: "#c05234",
    glowColor: "rgba(248, 113, 113, 0.36)",
    size: 0.82,
    textureGradient:
      "radial-gradient(circle at 63% 35%, #7f2d1f 0 8%, transparent 9%), radial-gradient(circle at 32% 64%, #e27b52 0 12%, transparent 13%), linear-gradient(145deg, #d9784c 0%, #8f3523 56%, #371711 100%)",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "Planet",
    subtitle: "Stormarnas maskin",
    shortDescription:
      "Den största planeten roterar som en kolossal vädermaskin, randad av snabba vindar och stormar större än jorden.",
    distanceFromSun: "778,5M km",
    diameter: "139 820 km",
    orbitalPeriod: "11,9 år",
    temperature: "-110°C moln",
    color: "#c79058",
    glowColor: "rgba(253, 186, 116, 0.4)",
    size: 1.72,
    textureGradient:
      "repeating-linear-gradient(180deg, #d8a56d 0 11px, #7c4a2b 12px 22px, #ead0aa 23px 34px, #9b623b 35px 48px), radial-gradient(circle at 66% 58%, #8f2d22 0 8%, transparent 9%)",
  },
  {
    id: "saturn",
    name: "Saturnus",
    kind: "Planet",
    subtitle: "Den ringprydda arkitekten",
    shortDescription:
      "En blek gasjätte omgiven av ett tunt system av is och sten, så elegant att den nästan känns formgiven.",
    distanceFromSun: "1,43B km",
    diameter: "116 460 km",
    orbitalPeriod: "29,5 år",
    temperature: "-140°C moln",
    color: "#d7bf83",
    glowColor: "rgba(250, 204, 21, 0.3)",
    size: 1.42,
    textureGradient:
      "repeating-linear-gradient(180deg, #ead9a6 0 13px, #c5a965 14px 25px, #f8edc8 26px 36px), linear-gradient(145deg, #e9d7a2 0%, #9f8547 100%)",
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "Planet",
    subtitle: "Den lutande isjätten",
    shortDescription:
      "En stilla cyan värld som roterar på sidan, avlägsen och märklig, med årstider som sträcker sig över decennier.",
    distanceFromSun: "2,87B km",
    diameter: "50 724 km",
    orbitalPeriod: "84 år",
    temperature: "-195°C",
    color: "#86dce2",
    glowColor: "rgba(103, 232, 249, 0.36)",
    size: 1.12,
    textureGradient:
      "radial-gradient(circle at 36% 24%, rgba(255,255,255,0.38) 0 12%, transparent 13%), linear-gradient(145deg, #a5f3fc 0%, #5bb7c5 54%, #1f5f6d 100%)",
  },
  {
    id: "neptune",
    name: "Neptunus",
    kind: "Planet",
    subtitle: "Den blå horisonten",
    shortDescription:
      "En avlägsen stormvärld där djupblå moln rusar genom mörkret vid kanten av de kända planeterna.",
    distanceFromSun: "4,5B km",
    diameter: "49 244 km",
    orbitalPeriod: "164,8 år",
    temperature: "-200°C",
    color: "#3b61d9",
    glowColor: "rgba(96, 165, 250, 0.42)",
    size: 1.1,
    textureGradient:
      "radial-gradient(circle at 64% 34%, #8fb6ff 0 8%, transparent 9%), linear-gradient(145deg, #5b7cfa 0%, #244bb5 54%, #071a4f 100%)",
  },
];
