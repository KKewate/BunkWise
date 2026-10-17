# BunkWise

A smart attendance calculator for students. Enter attended and total lectures per subject and BunkWise tells you how many lectures you can skip, or how many you must attend to stay above your required percentage (default 75%).

## Run locally

```bash
npm install
npm start          # http://localhost:3000
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start the server |
| `npm run build` | Copy and validate the frontend into `dist/` |
| `npm test` | Run Jest tests with coverage |
| `npm run lint` | Run ESLint (fails on warnings) |

## API

| Method | Route | Body |
|--------|-------|------|
| GET | `/api/health` | none |
| POST | `/api/calculate` | `{ "attended": 36, "total": 40, "target": 75 }` |
| POST | `/api/summary` | `{ "target": 75, "subjects": [{ "name": "Maths", "attended": 30, "total": 40 }] }` |

## CI/CD

GitHub Actions (`.github/workflows/ci-cd.yml`): Build -> Test -> Code Quality -> Deploy (Render). See `docs/agile-plan.md` for the Agile plan.
