# SHL AMCAT Portal — Clone

A working clone of the SHL AMCAT candidate test-delivery portal, built with plain HTML/CSS/JS (no build step, no backend).

## Run locally
```
python -m http.server 8123
```
then open http://127.0.0.1:8123

## Features
- 8 assessments: English Comprehension, Logical Ability, Quantitative Ability (Advanced), Personality (72 statements, toggle slider), Computer Programming, Automata Pro (coding), Automata Fix (debug-the-code, test cases actually evaluate your fix), Computer Science
- Candidate onboarding flow: Data Protection Notice → Personal Information
- Per-section timers, question navigator, resizable code editor
- Desktop kiosk launcher: `launcher/SHL-Portal.vbs` (shortcut on the Desktop)

## Deploy (Netlify)
1. Push this repo to GitHub (done — `S-Coderr/Sam`).
2. On app.netlify.com: **Add new site → Import an existing project → GitHub → pick this repo** → Deploy. `netlify.toml` makes it zero-config (publish dir = repo root, no build).
3. Netlify now auto-deploys every push to `main` — that's the CI/CD.

### Optional: GitHub Actions deploy
`.github/workflows/deploy.yml` deploys on every push to `main` once you add two repository secrets (**Settings → Secrets and variables → Actions**):
- `NETLIFY_AUTH_TOKEN` — Netlify: User settings → Applications → New access token
- `NETLIFY_SITE_ID` — Netlify: Site configuration → Site information → Site ID

If you use Netlify's Git integration (step 2), the Action is not needed — pick one path, not both.
