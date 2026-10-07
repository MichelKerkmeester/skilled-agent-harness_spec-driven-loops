---
title: "Tasks: Plugin scanner readiness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugin scanner readiness tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Plugin scanner readiness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scan a fresh clone of `main` with the catalog thresholds (score 76, 75 high findings)
- [x] T002 Record baselines for every affected test suite
- [x] T003 Check CI and tests for dependencies on tracked `context/` files (`routing-registry-drift.yml`, README verdict baseline, trigger index)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Load model code from a temp module in the runner child (`code-task-scorer.cjs`)
- [x] T005 [P] Use `execFileSync` for terser (`minify-webflow.mjs`)
- [x] T006 [P] Reword the comment the eval pattern matched (`score-pi-transport.mjs`)
- [x] T007 [P] Use `execFileSync` argument arrays in five spec-kit and deep-loop test files
- [x] T008 [P] Pin 50 action references to commit SHAs (`.github/workflows/*.yml`)
- [x] T009 [P] Add the `github-actions` ecosystem (`.github/dependabot.yml`)
- [x] T010 [P] Add the vulnerability reporting policy (`SECURITY.md`)
- [x] T011 Ignore `specs/**/context/` and drop the vendored `image-size/dist` exception (`.gitignore`)
- [x] T012 Rebuild the README verdict baseline against an index without `context/` (`baseline-readme-verdicts.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun every affected suite and compare with its baseline
- [x] T014 Exercise the scorer's define-error, pass and timeout paths and the minify script on an awkward path
- [x] T015 Rescan the exported final tree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
