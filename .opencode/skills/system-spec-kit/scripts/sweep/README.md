---
title: "Sweep: strict-pass freshness regression gate"
description: "Runs validate.sh --strict across every spec folder and flags regressions against a stored baseline of prior passes."
---

# Sweep

---

## 1. OVERVIEW

`scripts/sweep/` holds the strict-pass freshness sweep, a CI gate that walks every spec folder under `.opencode/specs` (and legacy `specs`), runs `scripts/spec/validate.sh --strict` on each and classifies the result against a prior baseline. A folder that failed with no baseline record is `first-run`, not a regression. A folder that passed before and fails now is a `regression`. This distinguishes genuinely new breakage from a folder that was already failing.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `strict-pass-freshness.ts` | CLI entrypoint. `--roots <path[,path...]>` scopes the sweep, `--baseline <report.json>` supplies the prior-pass set, `--format json\|text` controls output. Classifies each folder as `pass`, `regression`, `new-failure`, `first-run` or `error`. |

## 3. CONSUMERS

- `.github/workflows/strict-pass-freshness-sweep.yml` runs this script in CI and gates on its regression count.
- `.opencode/skills/system-spec-kit/scripts/lib/status-classifier.sh` shares the same pass/fail classification vocabulary.

## 4. VALIDATION

```bash
npx vitest run .opencode/skills/system-spec-kit/scripts/tests/strict-pass-freshness.vitest.ts
npx vitest run .opencode/skills/system-spec-kit/scripts/tests/validation-gate-hardening.vitest.ts
```

## 5. RELATED

- [`../spec/validate.sh`](../spec/validate.sh): the per-folder validator this sweep drives.
- [`ENV-REFERENCE.md`](../../mcp-server/ENV-REFERENCE.md): documents the sweep's environment-driven configuration.
