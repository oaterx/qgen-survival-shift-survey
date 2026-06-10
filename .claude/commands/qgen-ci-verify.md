---
description: Verify that the QGEN Survival Shift CI v2.1 theme replacement is correct.
argument-hint: [optional check focus]
allowed-tools: Read, Glob, Grep, LS, Bash
---

# Verify QGEN Survival Shift CI v2.1 Implementation

Verify that the current app uses the updated QGEN Survival Shift CI v2.1 theme.

User notes:

`$ARGUMENTS`

Check:

1. Only `qgen-survival-shift-ci-v2_1-theme-kit/` is used as source of truth.
2. Old theme files are removed, archived, or ignored.
3. Main colors are correct:
   - Paper White `#F4F4F0`
   - Absolute Black `#0A0A0A`
   - Soft Black / Charcoal `#1A1A1A`
   - Ash Gray `#6E6E6E`
   - Accent Signal `#C96F3B`
4. Accent Signal is not overused as a large background.
5. Tailwind v4 theme has been applied.
6. Survey cards are readable and mobile-friendly.
7. Selected options have accessible state beyond color.
8. Production assets are copied into `public/assets/qgen-survival-shift/`.
9. Score logic follows the sheet:
   - higher score is better
   - 80–100 Stable
   - 60–79 At Risk
   - 40–59 Crisis or Visible
   - 20–39 Emerging
   - 0–19 Deepening / Severe
10. No database or separate backend framework was added.
11. JSONL + Google Sheets sync is preserved.
12. Docker / Cloud Run compatibility is not broken.

Run available checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`

If a script does not exist, report it as missing instead of failing silently.

Return a clear pass/fail report with any remaining issues.
