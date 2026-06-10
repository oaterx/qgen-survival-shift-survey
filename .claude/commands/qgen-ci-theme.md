---
description: Replace the old survey theme with QGEN Survival Shift CI v2.1. Audit first, then wait for approval before editing.
argument-hint: [optional notes, e.g. "apply to respondent flow only"]
allowed-tools: Read, Glob, Grep, LS, Bash, Edit, MultiEdit, Write
---

# QGEN Survival Shift CI v2.1 Theme Replacement

You are working inside the existing survey webapp repository.

Use only the updated theme kit as the source of truth:

`qgen-survival-shift-ci-v2_1-theme-kit/`

Ignore and do not use older theme folders or files, including but not limited to:

- `survival-shift-theme-kit/`
- `qgen-survival-shift-ci-v2-theme-kit/`
- `survival-signal-theme-pack.zip`
- `SURVIVAL_SIGNAL_THEME.md`
- `survival-signal-theme.css`
- any old “Survival Signal” or old “Shadow Collage Assessment UI” direction

User notes / task argument:

`$ARGUMENTS`

---

## Project stack

This project uses:

- Next.js 16
- React 19
- TypeScript
- Tailwind v4
- file-based JSONL storage
- Google Sheets sync
- Docker on Cloud Run
- no database
- no separate backend framework

Do not add:

- Prisma
- PostgreSQL
- MongoDB
- Supabase
- Express
- NestJS
- Fastify
- a separate backend service
- any database layer

Preserve the current file-based JSONL + Google Sheets architecture.

---

## Source of truth files to read first

Before making any changes, read these files if they exist:

- `qgen-survival-shift-ci-v2_1-theme-kit/README_TH.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/README.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/docs/CI_V2_1_VERIFICATION_REPORT.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/docs/THEME_SPEC_DETAILED.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/docs/NEXTJS16_TAILWIND4_CLOUDRUN_IMPLEMENTATION.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/docs/SURVEY_WEBAPP_SPEC.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/prompts/CLAUDE_CODE_NEXT16_TAILWIND4_MASTER_PROMPT.md`
- `qgen-survival-shift-ci-v2_1-theme-kit/theme/tailwind/tailwind-v4-theme.css`
- `qgen-survival-shift-ci-v2_1-theme-kit/theme/tokens/design-tokens.json`

If any file is missing, continue with the files that exist and report what is missing.

---

## Updated CI rules

The updated QGEN Survival Shift CI v2.1 is the only visual source of truth.

Use this visual system:

- Paper White background: `#F4F4F0`
- Absolute Black primary text: `#0A0A0A`
- Soft Black / Charcoal: `#1A1A1A`
- Ash Gray supporting text: `#6E6E6E`
- Accent Signal: `#C96F3B`

Use the accent color only for:

- primary CTA
- progress fill
- selected choice
- active state
- signal line
- score ring
- important metric emphasis

Do not use the accent color as a large section background.

The UI should feel:

- light and friendly
- quick and clear
- actionable
- private and trustworthy
- quiet, not flashy
- research-backed, but not heavy

Use:

- readable cards
- generous spacing
- quiet texture
- minimal signal lines
- mono outline icons
- low-opacity production collage/crop assets

Avoid:

- generic blue/purple SaaS styling
- playful quiz styling
- emoji rating UI
- confetti result screens
- neon gradients
- heavy collage behind question text
- old orange-heavy risk dashboard styling

---

## Score model

The score follows the sheet.

Higher score is better.

Use this mapping:

- `80–100` = `Stable`
- `60–79` = `At Risk`
- `40–59` = `Crisis or Visible`
- `20–39` = `Emerging`
- `0–19` = `Deepening / Severe`

Do not use old logic where a higher score means higher risk.

If current code has functions like `getRiskLevel`, `riskScore`, `riskLevel`, `scoreToRisk`, `calculateRisk`, or similar, inspect them carefully and update naming or logic so the model is not inverted.

If the app needs a risk value, derive it explicitly as:

`risk = 100 - survivalHealthScore`

Do not silently mix risk score and health score.

---

## Required first phase: audit only

First inspect the project and report the following.

Do not edit files in this phase.

Report:

1. Current theme folders and files
2. Existing Tailwind v4 setup
3. Existing global CSS files
4. Existing survey page files
5. Existing survey components
6. Existing result/dashboard components
7. Existing scoring logic files
8. Existing storage files for JSONL and Google Sheets sync
9. Old theme files/tokens/assets that should be removed, archived, or ignored
10. Production assets from the v2.1 kit that should be copied into `public/assets/qgen-survival-shift/`
11. Files you plan to edit
12. Risks or ambiguities before implementation

After reporting the audit, stop and ask for approval before editing.

---

## Implementation phase after approval

After the user approves, implement the replacement.

### 1. Theme tokens

Apply the Tailwind v4 theme from:

`qgen-survival-shift-ci-v2_1-theme-kit/theme/tailwind/tailwind-v4-theme.css`

Use it in the project’s main CSS, usually one of:

- `src/app/globals.css`
- `app/globals.css`
- `src/styles/globals.css`
- `src/styles/tailwind.css`

Do not keep old token names if they conflict with the new CI.

### 2. Assets

Copy production assets from the v2.1 kit into:

`public/assets/qgen-survival-shift/`

Recommended structure:

- `public/assets/qgen-survival-shift/crops/`
- `public/assets/qgen-survival-shift/svg/`
- `public/assets/qgen-survival-shift/palette/`
- `public/assets/qgen-survival-shift/reference-slides/`

Use the collage/crop assets as production assets, but keep them subtle and never place them behind dense text without sufficient contrast.

### 3. Survey UI

Update the survey UI to match the updated CI:

- Paper White page background
- clean white or very light cards
- black primary question text
- gray helper text
- accent signal only for action/progress/selection
- large enough touch targets
- accessible focus states
- mobile-first layout
- option cards stack vertically on mobile
- selected state uses more than color: border, background, icon/check, and ARIA state

### 4. Result UI

Update result page/dashboard to match the score model:

- higher score is better
- show status label from the sheet
- avoid inverted risk messaging
- keep score presentation calm and clear
- use signal accent carefully
- show interpretation cards with concise language

### 5. Storage and deployment

Preserve:

- file-based JSONL append flow
- Google Sheets sync
- Docker / Cloud Run compatibility

Do not introduce a database or separate backend framework.

If Cloud Run filesystem persistence is relevant, treat JSONL as local append/cache/export and Google Sheets as the durable external sink unless the project already has another approved storage mount.

### 6. Quality checks

Run available checks if present:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`

If scripts are missing, report that clearly.

### 7. Final report

After implementation, report:

1. Files changed
2. Theme files replaced
3. Old files ignored or archived
4. Assets copied
5. Score logic updated
6. Commands run
7. Any remaining risks
