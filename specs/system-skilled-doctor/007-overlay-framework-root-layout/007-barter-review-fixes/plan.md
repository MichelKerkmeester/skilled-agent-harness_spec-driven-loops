---
title: "Implementation Plan: Phase 7: fix the Barter findings from the extended deep review of the overlay layout"
description: "Fix the six Barter-side review findings in ai-speckit's overlay sources, re-apply them onto the vendored tree, and prove each fix with a hook or plugin test and Barter's full gate set, in one commit."
trigger_phrases:
  - "barter review fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: fix the Barter findings from the extended deep review of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (commit gate), CommonJS (edit guard core, plugin tests), ESM (git-write gate) |
| **Framework** | The Skilled doctor overlay engine, vendored in `ai-speckit/skilled` |
| **Storage** | None |
| **Testing** | `node --test`, the overlay checks, `tests/run-all.sh` |

### Overview
Each fix lands in the overlay source under `ai-speckit/overlays/` and reaches the vendored tree through `apply`. The three hooks each read `overlayDir` from `skilled/.skilled-overlays.json` with `../overlays` as the fallback, because they run in bash, CommonJS and ESM with no shared module. Proof is one test per behavior change plus Barter's full gate set, recorded in ai-speckit's 039 record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding re-checked against the code (`review-report.md` §2 and §3)
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `overlay-engine.cjs status --audit` prints `RESULT: PASSED`, both checks `RESULT: PASSED`, `bash tests/run-all.sh` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Overlay source, then apply.

### Key Components
- **Commit gate (`overlays/root/opencode/scripts/git-hooks/pre-commit`)**: fails closed on a staged vendored path when no manifest is found.
- **Edit guard core and git-write gate**: read the overlay folder from the setting the engine reads.

### Data Flow
`skilled/.skilled-overlays.json` names `overlayDir`. Each hook resolves it against `skilled/`, falls back to `../overlays`, and reads `overlay-manifest.json` there.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads the six findings against the hook sources. Implementation changes the overlay sources and applies them. Verification runs the new tests and Barter's full gate set. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test` on `pre-commit.test.cjs` (6 of 6), the guard core and git-write gate tests with their `"../ovl"` cases, the plugin test that loads the real bridge, and `compiled-routing-byte-parity.test.cjs` (5 of 5). Then `status --audit`, both checks and `bash tests/run-all.sh`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node and bash, as already used by the hooks. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a hook refuses a legitimate commit or edit. Run `git -C <ai-speckit> revert 5dd004f3faa`, which restores the previous hooks, tests and docs together.
<!-- /ANCHOR:rollback -->

---
