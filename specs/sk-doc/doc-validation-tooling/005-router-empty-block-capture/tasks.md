---
title: "Tasks: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router empty block capture tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. `AU` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout`. `C` is `AU/009-sk-design/lib/registry-compiler.cjs`. `D` is `AU/002-system-deep-loop/lib/registry-compiler.cjs`. Both are authored files. `SYNC` is `node .skilled/bin/compiled-route-sync.cjs`. `CMP` is `node specs/sk-doc/doc-validation-tooling/005-router-empty-block-capture/scratch/compare-captures.cjs`. Run every command from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the script tests pass before any edit (`S/tests`). Verify: `node --test S/tests/` exits 0.
- [x] T002 Read how compiled routing detects a changed compiler and record the answer in `spec.md` section 7 (`.skilled/bin/compiled-route-sync.cjs`). Verify: `rg -c 'Decision: unknown' specs/sk-doc/doc-validation-tooling/005-router-empty-block-capture/spec.md` prints nothing and exits 1.
- [x] T003 Record the capture baseline (`specs/sk-doc/doc-validation-tooling/005-router-empty-block-capture/scratch/compare-captures.cjs`). Verify: `CMP` prints `identical=56 differ=1` twice.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a case with a one-line empty block followed by another literal, and watch it fail (`S/tests/generate-router-intent-signals-orphans.test.cjs`). Verify: `node --test S/tests/generate-router-intent-signals-orphans.test.cjs` exits 1 and names the new case.
- [x] T005 Replace the `INTENT_SIGNALS` pattern in `declaredPhrases` (`S/generate-router-intent-signals.cjs`). Verify: `node --test S/tests/generate-router-intent-signals-orphans.test.cjs` exits 0.
- [x] T006 Replace the `INTENT_SIGNALS` pattern in `declaredPhrases` and add the empty-block case (`S/ci-router-vocabulary-reach.cjs`). Verify: `node --test S/tests/ci-router-vocabulary-reach.test.cjs` exits 0.
- [x] T007 Replace the `INTENT_SIGNALS` and `RESOURCE_MAP` patterns in `parseRouter` and add the empty-block case (`S/ci-hub-vocabulary-source.cjs`). Verify: `node --test S/tests/ci-hub-vocabulary-source.test.cjs` exits 0.
- [x] T008 Replace the `INTENT_SIGNALS` and `RESOURCE_MAP` patterns in `parseIntentLayer` (`C`). Verify: `rg -c '\(\?=\\n\\\}\)' C` prints 2.
- [x] T013 Replace the `RESOURCE_MAP` pattern at its one site (`D`). Verify: `rg -c '\(\?=\\n\\\}\)' D` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run every sk-doc script test (`S/tests`). Verify: `node --test S/tests/` exits 0.
- [x] T010 Rebuild the served closure from the edited authored files (`.skilled/bin/compiled-route-sync.cjs`). Verify: `SYNC` exits 0 and prints the rollback path it retained.
- [x] T014 Verify the rebuilt closure and the compiled routing tests (`.skilled/bin/tests`). Verify: `SYNC --verify` exits 0 and `node --test .skilled/bin/tests/` fails no test that passed before T008.
- [x] T015 Finalize the rebuild (`.skilled/bin/compiled-route-sync.cjs`). Verify: after `SYNC --finalize <rollback path>`, `SYNC --check` prints `all 55 served copies match their authored files`.
- [x] T011 Confirm no hub's generated signals changed (`S/generate-router-intent-signals.cjs`). Verify: `node S/generate-router-intent-signals.cjs --check` exits with the same status and prints the same hubs as it did before T005.
- [x] T012 Confirm no copy of the old pattern remains (`S`). Verify: `rg -l '\(\[\\s\\S\]\*\?\)\\n\\\}' .skilled --glob '*.cjs' --glob '!**/node_modules/**'` prints nothing and exits 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `CMP` prints `identical=56 differ=1` for both block names
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
