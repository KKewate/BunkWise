# BunkWise - Agile Project Plan

**Project:** BunkWise, a smart attendance calculator for students
**Team:** 2 members (Member A, Member B)
**Tech:** Node.js, Express, vanilla HTML/JS, Jest, ESLint, GitHub Actions, Render

## 1. Problem and vision
Most colleges require 75% attendance. Students track it on paper and guess how many lectures they can skip. BunkWise tells them exactly how many lectures they can safely miss, or how many they must attend in a row to get back above the limit.

## 2. User stories (Product Backlog)

| ID  | User story | Priority | Points |
|-----|-----------|----------|--------|
| US1 | As a student, I want to enter attended and total lectures for a subject so that I can see my current attendance percentage. | High | 3 |
| US2 | As a student, I want to know how many more lectures I can skip while staying above my required percentage so that I can plan my free days. | High | 5 |
| US3 | As a student below the limit, I want to know how many lectures I must attend in a row to recover so that I can avoid a shortage. | High | 5 |
| US4 | As a student, I want to track several subjects and see my overall attendance so that I get the full picture in one place. | Medium | 5 |
| US5 | As a student, I want to set my own required percentage (for example 80%) so that the tool matches my college's rule. | Medium | 2 |

Total: 20 story points.

## 3. Sprint planning

### Sprint 1 (1 week) - Core calculator and pipeline
- **Goal:** a working calculator API with the CI/CD pipeline running end to end.
- **Backlog:** US1, US2, US3, repo and branching setup, GitHub Actions pipeline.
- **Capacity:** 2 members, about 13 points.
- **Output:** `/api/calculate` endpoint, unit tests, green pipeline.

### Sprint 2 (1 week) - Multi-subject and customisation
- **Goal:** full user experience and live deployment.
- **Backlog:** US4, US5, frontend UI, Render deployment, final demo.
- **Capacity:** about 7 points plus deployment and report work.
- **Output:** web UI, `/api/summary`, deployed app.

### Ceremonies
- Sprint planning on Day 1, short daily stand-up (10 minutes), sprint review and demo on the last day, retrospective after the review.
- Roles: Member A is Scrum Master and DevOps (pipeline), Member B is Product Owner and Developer. Swap in Sprint 2.

## 4. Definition of Done (DoD)
A story is done only when:
1. Code is merged to `main` through a pull request reviewed by the other member.
2. The CI pipeline passes: build, automated tests and lint.
3. Unit and API tests exist for the story and pass.
4. ESLint reports no errors and no warnings.
5. Acceptance criteria are verified.
6. The change is deployed to the live demo environment.
7. README or docs are updated.

## 5. Acceptance criteria

### US2 - Skippable lectures
- **Given** a student has attended 36 of 40 lectures and the target is 75%, **when** they calculate, **then** the app shows 90% attendance and says they can skip 8 more lectures.
- **Given** a student is exactly at the target (30 of 40), **when** they calculate, **then** the app shows 0 skippable lectures and warns them not to miss the next one.
- **Given** attended is greater than total, **when** they calculate, **then** the API returns HTTP 400 with a clear error message.

### US3 - Recovery plan
- **Given** a student has attended 20 of 40 lectures and the target is 75%, **when** they calculate, **then** the app says they must attend the next 40 lectures in a row.
- **Given** a target of 100% and one missed lecture, **when** they calculate, **then** the app says the target cannot be reached.

## 6. Pipeline design

```
GitHub (push / PR) -> Build -> Automated Testing -> Code Quality Check -> Deployment
```

| Stage | Tool | What it does |
|-------|------|--------------|
| Build | `npm ci`, `npm run build` | Installs dependencies, builds `dist/`, uploads it as an artifact |
| Test | Jest and Supertest | 22 unit and API tests with a coverage report |
| Quality | ESLint | Fails on any error or warning |
| Deploy | Render deploy hook | Runs only on pushes to `main` |

## 7. Sprint review checklist
- [ ] Board shows all stories in Done
- [ ] Pipeline green on `main`
- [ ] Live URL works
- [ ] Failure demo screenshot (red run) and fix screenshot (green run) captured
