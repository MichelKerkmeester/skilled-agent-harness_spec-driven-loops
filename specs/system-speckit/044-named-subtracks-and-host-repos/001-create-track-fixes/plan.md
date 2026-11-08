---
title: "Implementation Plan: Phase 1: create-track-fixes"
description: "Fix create.sh --track in one script: normalize the value once, then refuse a symlinked, three-segment or undeclared sub-track before any folder is made. Each fix starts from a red case in create-track-refresh.vitest.ts."
trigger_phrases:
  - "create track fixes plan"
  - "create.sh track guard plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: create-track-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash (`create.sh`), TypeScript tests run by Vitest |
| **Framework** | None; spec-kit CLI script and its Vitest project `cli` |
| **Storage** | `graph-metadata.json` and `description.json` per track and sub-track |
| **Testing** | Vitest in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
One runtime script changes: `runtime/cli/spec/create.sh`. `TRACK` is stripped of a trailing slash once, right after option parsing, and a guard runs before `mkdir -p "$SPECS_DIR"` that refuses a symlinked, three-segment or undeclared two-segment value. Each behavior starts as a red case in `create-track-refresh.vitest.ts`, shown failing on the unchanged script, then turned green. The containment test's nested-path fixture declares its sub-track so it still checks the accepted path; its flat symlink case stays unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `scratch/baseline.txt` holds the pass and fail count of `create-track-refresh.vitest.ts`, `create-track-containment.vitest.ts` and `create-root-numbering.vitest.ts`, taken before the first edit.
- [x] The operator has answered D-001, or T007 and T009 are held for the undeclared case only.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.

### Definition of Done
- [x] Every requirement in `spec.md` section 4 is met with evidence.
- [x] `npm run build` in `runtime/` exits 0, then the section 5 command prints zero failures and the baseline totals plus the new cases.
- [x] `bash -n create.sh` exits 0, and the four Measured Behavior commands, rerun, show the fixed results.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script guard. The component is `create.sh`, in the three places the review names.

### Key Components
- **`validate_track_value`** (`create.sh:1171-1182`): strips the slash only in a local copy today, so `TRACK` keeps it. The strip moves to where `TRACK` is first set, and this function keeps refusing absolute, `.`, `..` and empty segments.
- **The `SPECS_DIR` build** (`create.sh:1340-1347`): gains the guard before `mkdir -p`. The guard counts segments, tests the sub-track with `-L`, and calls the script's own `is_declared_subtrack`.
- **`refresh_track_root`** (`create.sh:1044-1058`): unchanged. It keeps its early return for a value the guard now refuses, so a later refactor cannot reach it with one.

### Data Flow
`--track` value, then normalized `TRACK`, then guard (refuse or continue), then `mkdir -p`, packet write, and `refresh_track_root` for the sub-track and its track.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and the callers of a slash `--track`. Implementation adds each red case, then the normalization and the guard. Verification reruns the three test files and the Measured Behavior commands. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from `.skilled/skills/system-spec-kit/runtime/cli` after `npm run build` in `runtime/`:

```bash
npx vitest run --config ../../vitest.config.ts --project cli tests/create-track-refresh.vitest.ts tests/create-track-containment.vitest.ts tests/create-root-numbering.vitest.ts
bash -n spec/create.sh
```

Every new case is shown failing on the unchanged script first. The cases reuse `buildSubtrackTree`, which already holds the declared `demo/sub`, the undeclared `demo/loose` and the symlinked `demo/linked`; the three-segment case needs no fixture folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. The Vitest `cli` project and a current `runtime/dist` build. Phase 002 depends on this phase landing first, because it aligns the `is_declared_subtrack` copy that this phase's guard calls.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a flat-track case fails after the change, or a host reports that a `--track` value that worked now exits non-zero. Revert the one commit with `git revert <sha>`. Each of T008 and T009 lands as its own commit, so a revert removes the guard and keeps the normalization.
<!-- /ANCHOR:rollback -->

---
