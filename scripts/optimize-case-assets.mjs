import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceRoot = path.join(root, "assets", "source", "cases");
const outputRoot = path.join(root, "public", "assets", "cases");

const cases = [
  {
    slug: "solar-expanse",
    cover: "solar-expanse-desktop.png",
    detail: "solar-expanse-detail-mercury.png",
    mobile: "solar-expanse-mobile.png",
  },
  {
    slug: "playdate-planner",
    cover: "playdate-planner-desktop.png",
    detail: "playdate-planner-prototype.png",
    mobile: "playdate-planner-mobile.png",
  },
  {
    slug: "the-five-crystals",
    cover: "the-five-crystals-desktop.png",
    detail: "the-five-crystals-gameplay.png",
    mobile: "the-five-crystals-mobile.png",
  },
];

async function optimizeCase(caseConfig) {
  const sourceDir = path.join(sourceRoot, caseConfig.slug);
  const outputDir = path.join(outputRoot, caseConfig.slug);
  await mkdir(outputDir, { recursive: true });

  await sharp(path.join(sourceDir, caseConfig.cover))
    .resize(1440, 900, { fit: "cover", position: "center" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(outputDir, "cover-16x10.webp"));

  await sharp(path.join(sourceDir, caseConfig.detail))
    .resize(1440, 900, { fit: "cover", position: "center" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(outputDir, "detail-01.webp"));

  await sharp(path.join(sourceDir, caseConfig.mobile))
    .resize(430, 538, { fit: "cover", position: "top" })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(outputDir, "mobile-4x5.webp"));
}

await Promise.all(cases.map(optimizeCase));

const socialSource = path.join(root, "assets", "source", "social", "mshaped-og.png");
const socialOutput = path.join(root, "public", "assets", "social", "mshaped-og.webp");
await mkdir(path.dirname(socialOutput), { recursive: true });
await sharp(socialSource)
  .resize(1200, 630, { fit: "cover", position: "top" })
  .webp({ quality: 86, effort: 6 })
  .toFile(socialOutput);

const brandSource = path.join(root, "assets", "source", "brand", "mshaped-brand.png");
const brandOutput = path.join(root, "public", "assets", "brand", "mshaped-brand.webp");
await mkdir(path.dirname(brandOutput), { recursive: true });
await sharp(brandSource)
  .resize(1200, 1200, { fit: "cover", position: "center" })
  .webp({ quality: 86, effort: 6 })
  .toFile(brandOutput);

const logoSource = path.join(root, "assets", "source", "brand", "mshaped-orange-logo.png.png");
const logoOutput = path.join(root, "public", "assets", "brand", "mshaped-logo.webp");
await mkdir(path.dirname(logoOutput), { recursive: true });
const logoImage = sharp(logoSource)
  .resize(420, 420, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .ensureAlpha();
const { data: logoRaw, info: logoInfo } = await logoImage.raw().toBuffer({ resolveWithObject: true });
for (let index = 0; index < logoRaw.length; index += 4) {
  const red = logoRaw[index];
  const green = logoRaw[index + 1];
  const blue = logoRaw[index + 2];
  const isBackground = red > 236 && green > 236 && blue > 236;
  if (isBackground) {
    logoRaw[index + 3] = 0;
  } else {
    logoRaw[index] = 249;
    logoRaw[index + 1] = 115;
    logoRaw[index + 2] = 22;
  }
}
await sharp(logoRaw, {
  raw: {
    width: logoInfo.width,
    height: logoInfo.height,
    channels: 4,
  },
})
  .webp({ quality: 92, effort: 6 })
  .toFile(logoOutput);

const goldLogoSource = path.join(root, "assets", "source", "brand", "mshaped-gold-logo.png.png");
const goldLogoOutput = path.join(root, "public", "assets", "brand", "mshaped-gold-logo.webp");
await sharp(goldLogoSource)
  .resize(900, 1350, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 90, effort: 6 })
  .toFile(goldLogoOutput);

const heroDesktopSource = path.join(root, "assets", "source", "hero", "mshaped-hero-desktop.png.png");
const heroDesktopOutput = path.join(root, "public", "assets", "hero", "mshaped-hero-desktop.webp");
await mkdir(path.dirname(heroDesktopOutput), { recursive: true });
await sharp(heroDesktopSource)
  .resize(2200, 1238, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 6 })
  .toFile(heroDesktopOutput);

const heroMobileSource = path.join(root, "assets", "source", "hero", "mshaped-hero-mobile.png.png");
const heroMobileOutput = path.join(root, "public", "assets", "hero", "mshaped-hero-mobile.webp");
await sharp(heroMobileSource)
  .resize(940, 1670, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 6 })
  .toFile(heroMobileOutput);

const legacyHeroOutput = path.join(root, "public", "assets", "hero", "mshaped-hero.webp");
await sharp(heroDesktopSource)
  .resize(2200, 1238, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 6 })
  .toFile(legacyHeroOutput);

const ctaSource = path.join(root, "assets", "source", "cta", "mshaped-cta-bg.png.png");
const ctaOutput = path.join(root, "public", "assets", "cta", "mshaped-cta-bg.webp");
await mkdir(path.dirname(ctaOutput), { recursive: true });
await sharp(ctaSource)
  .resize(2200, 550, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 6 })
  .toFile(ctaOutput);

const menuSource = path.join(root, "assets", "source", "navigation", "mobile-menu-bg.png.png");
const menuOutput = path.join(root, "public", "assets", "navigation", "mobile-menu-bg.webp");
await mkdir(path.dirname(menuOutput), { recursive: true });
await sharp(menuSource)
  .resize(900, 1946, { fit: "cover", position: "center" })
  .webp({ quality: 88, effort: 6 })
  .toFile(menuOutput);

const output = await Promise.all(
  cases.map(async ({ slug }) => ({
    slug,
    files: await readdir(path.join(outputRoot, slug)),
  })),
);

console.log(JSON.stringify(output, null, 2));
