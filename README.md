# Codex Portfolio

En modern portfolio och konsultsida för en frontendutvecklare. Projektet är byggt för att fungera både vid jobbsök och som enkel säljande webbnärvaro för frilansuppdrag.

## Tech stack

- React
- TypeScript
- Vite
- React Router
- Modern CSS med design tokens
- lucide-react för ikoner

## Kom igång

Installera beroenden:

```bash
npm install
```

Starta utvecklingsserver:

```bash
npm run dev
```

Bygg för produktion:

```bash
npm run build
```

Förhandsgranska produktionsbygget:

```bash
npm run preview
```

## Anpassning

Projektdata finns i `src/data/projects.ts`. Kontaktuppgifter och sociala länkar finns i `src/data/site.ts`.

## Assets och case

- Råa projektbilder: `assets/source/cases/`
- Optimerade WebP-bilder: `public/assets/cases/`
- Case-dokumentation: `docs/cases/`
- Tonalitet: `docs/content-tone.md`
- Förbättringslista: `TODO.md`

Optimera bildmaterial efter nya captures:

```bash
npm run assets:optimize
```

Kontaktformuläret är förberett för Netlify Forms och börjar ta emot meddelanden efter nästa deploy
på Netlify.

Första interna projektet är `Solar Expanse`, en scrollstyrd 3D-demo byggd med Three.js. Den finns på `/projects/solar-expanse`.

## Kontakt

- Email: markusbylund@hotmail.com
- LinkedIn: https://www.linkedin.com/in/markusbylund/
- GitHub: https://github.com/markusbylund
