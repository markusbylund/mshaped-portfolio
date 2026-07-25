# Playdate Planner

Mobile-first UX/UI case study for coordinating playdates between families.

## Innehåll

- Svensk high-fidelity prototyp
- Bottom navigation
- Dashboard
- Kalender
- Vänner
- Förfrågningar
- Profil
- Interaktivt bokningsflöde

Projektet är isolerat från portfolion för att senare kunna lyftas ut till egen app eller domän.

## Användare med Supabase Auth

Playdate Planner använder Supabase Auth när följande miljövariabler finns:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Lokal utveckling:

1. Kopiera `.env.example` till `.env`.
2. Fyll i värdena från Supabase.
3. Kör `npm run dev`.

Netlify:

1. Gå till Site configuration.
2. Öppna Environment variables.
3. Lägg till `VITE_SUPABASE_URL`.
4. Lägg till `VITE_SUPABASE_ANON_KEY`.
5. Kör en ny deploy.

För snabb test med vänner kan e-postbekräftelse stängas av i Supabase under Authentication settings.
