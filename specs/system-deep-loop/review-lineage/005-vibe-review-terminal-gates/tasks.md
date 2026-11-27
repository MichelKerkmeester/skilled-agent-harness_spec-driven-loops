---
title: "Tasks: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe review terminal gates tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fan-out review lineages that skip the terminal stop gate and record rows under the wrong run

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `E` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm neither lineage recorded a gate (`E/review/lineages/*/deep-review-ledger/frames`). Verify: grep for `terminal_gates` over the frames finds 0 files.
- [x] T002 Confirm the Vibe sessions never ran the gate (`E/review/lineages/*/vibe-output`). Verify: structured command fields hold 0 `terminal-gates.cjs` and 0 `convergence.cjs` runs in each lineage.
- [x] T003 Find where vibe-1 got the root id (`E/review/lineages/vibe-1/vibe-output/session/chunks`). Verify: the config write command sets `cfg.sessionId=root.sessionId` and prints the root id.
- [x] T004 Record the clean suite baseline (`RT`). Verify: `npx vitest run --no-coverage` prints `225 passed` files and `4071 passed`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the stop gate and run identity lines to the lineage prompt (`RT/scripts/fanout-run.cjs`). Verify: the built review prompt holds `terminal-gates.cjs --config-path`.
- [x] T006 Add `lineageScopeRefusal` and call it before the append (`RT/scripts/append-mode-event.cjs`). Verify: a root-scoped lineage row exits 2 with `LINEAGE_SCOPE_MISMATCH`.
- [x] T007 Add `assertReviewLineageStopGate` to the close-out (`RT/scripts/synthesis-closeout.cjs`). Verify: a lineage with no `terminal_gates` row exits 1 and stages nothing.
- [x] T008 Regenerate the default golden prompts (`RT/tests/fixtures/golden-*-default/lineage-prompt.txt`). Verify: `GOLDEN_UPDATE=1` run, then the golden tests pass without it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new tests against the unchanged scripts (`RT/tests/unit/fanout-lineage-run-identity.vitest.ts`). Verify: 5 of 9 fail.
- [x] T010 Run the new tests with the change. Verify: 9 of 9 pass.
- [x] T011 Run the full suite and the typecheck (`RT`). Verify: `226 passed` files, `4080 passed`, `npm run typecheck` exits 0.
- [x] T012 Validate this packet and the track. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The suite passes with only the 9 new tests added
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
