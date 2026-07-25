# Mshaped - förbättringslista

Senast uppdaterad: 25 juni 2026

## Innehåll som behöver Markus

- [ ] Byt placeholder-adressen `hello@example.com` mot riktig e-postadress.
- [ ] Byt placeholder-länkar för LinkedIn och GitHub mot riktiga profiler.
- [ ] Ta ett professionellt porträtt för en framtida personlig variant av "Bakom Mshaped".
- [x] Skriv en kort personlig bakgrund med erfarenhetsinriktning och önskade uppdrag.
- [x] Bestäm tonalitet. Mshaped använder "jag"; "vi" används endast om samarbetet med kunden.

Tonaliteten är dokumenterad i `docs/content-tone.md`.

## Projekt och case

- [x] Ta riktiga desktop- och mobilskärmbilder av Solar Expanse.
- [x] Ta riktiga desktop- och mobilskärmbilder av Playdate Planner.
- [x] Ta riktiga desktop- och mobilskärmbilder av The Five Crystals.
- [x] Välj en huvudbild och två kompletterande bilder per projekt.
- [x] Dokumentera problem, målgrupp, lösning, Markus roll och designbeslut per case.
- [ ] Lägg till GitHub-länkar där koden kan visas offentligt.
- [x] Säkerställ att inga mätbara resultat publiceras utan verkligt underlag.
- [ ] Lägg till kundcitat först när riktiga uppdrag, citat och godkännanden finns.

Case-dokumentation finns i `docs/cases/`.

## Förtroende

- [ ] Lägg till riktiga kund- eller samarbetslogotyper när sådana finns och får publiceras.
- [x] Beskriv arbetssättet med ett konkret exempel från Playdate Planner.
- [ ] Lägg till plats, tillgänglighet och önskad uppdragsform i kontaktsektionen.
- [x] Lägg till vanliga frågor om omfattning, process och leverans.

## Visuell förfining

- [x] Ersätt monogram-placeholdern med en egen Mshaped-brandbild.
- [x] Lägg till lokalt hostade display- och brödtexttypsnitt.
- [x] Skapa konsekventa bildmallar i 16:10 och 4:5.
- [x] Kontrollera projekt- och brandbilder i dark och light mode.
- [x] Lägg till subtila scroll-reveals med stöd för `prefers-reduced-motion`.

Råmaterial finns i `assets/source/`. Optimerade filer finns i `public/assets/`.

## Kvalitet och lansering

- [ ] Slutför manuell skärmläsartestning. Automatiserad tillgänglighet och tangentbordsflöden är kontrollerade.
- [x] Kör Lighthouse för prestanda, SEO, tillgänglighet och best practices.
- [x] Lägg till Open Graph-bild och unik metadata för alla huvudsidor och case.
- [x] Komprimera projektbilder och brandmaterial till WebP.
- [x] Koppla kontaktformuläret till Netlify Forms.
- [ ] Testa sidan på fysiska iOS- och Android-enheter.

Senaste Lighthouse-körning:

- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Performance: 35 lokalt utan Netlifys textkomprimering

Rapporter finns i `reports/lighthouse/`.

## Nästa prioriterade iteration

1. Fyll i riktig e-post, LinkedIn, GitHub, plats och tillgänglighet.
2. Testa Netlify-formuläret efter deploy och aktivera e-postnotiser i Netlify.
3. Lägg in GitHub-länkar för projekt som kan vara offentliga.
4. Genomför skärmläsartest med VoiceOver eller NVDA.
5. Testa på en riktig iPhone och Android-telefon.
6. Lägg till verkliga resultat, kundlogotyper och citat först när underlag finns.
7. Optimera den stora Three.js-chunken och mät prestanda på den deployade Netlify-versionen.
