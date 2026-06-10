---
description: Audit the project for old QGEN theme files and plan the CI v2.1 replacement. Does not edit files.
argument-hint: [optional focus area]
allowed-tools: Read, Glob, Grep, LS, Bash
---

# QGEN CI v2.1 Audit Only

Audit this repository for replacing the old theme with:

`qgen-survival-shift-ci-v2_1-theme-kit/`

Do not edit files.

User notes:

`$ARGUMENTS`

Inspect and report:

1. Whether `qgen-survival-shift-ci-v2_1-theme-kit/` exists
2. Whether old theme folders exist:
   - `survival-shift-theme-kit/`
   - `qgen-survival-shift-ci-v2-theme-kit/`
   - old `survival-signal-*` files
3. Current Tailwind v4 setup
4. Current global CSS files
5. Current survey page and component files
6. Current result/dashboard files
7. Current scoring logic files
8. Current JSONL and Google Sheets sync files
9. Assets that should be copied to `public/assets/qgen-survival-shift/`
10. Recommended implementation plan

Important scoring rule:

Higher score is better.

- 80–100 Stable
- 60–79 At Risk
- 40–59 Crisis or Visible
- 20–39 Emerging
- 0–19 Deepening / Severe

Stop after the audit.
