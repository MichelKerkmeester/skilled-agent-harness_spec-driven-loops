---
title: "Tasks: Phase 9: deep-review-p2-remediation"
description: "Ordered tasks for the seven P2 findings, the SL-510 measurement and the predecessor block removal, each with its verify command."
trigger_phrases:
  - "deep review p2 remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: deep-review-p2-remediation

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

Commands run from the worktree root. `H` is `.skilled/hooks/session-handover/history`. `PB` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the suite baselines (`H`, `.skilled/hooks`, `.skilled/hooks/shared/tests/session-readers`). Verify: engine 139 passed, hooks vitest 501 passed, readers 102 passed with 0 skipped, handover node:test 390 passed, hook-state 18 passed, both typechecks exit 0.
- [x] T002 Reproduce each finding before editing (`spec.md`). Verify: the Measured Behavior block holds the raw runtime label, the schema skip, the four bound-drift runs and the predecessor block.
- [x] T003 Measure SL-510 on synthetic and real stores (`scratch/measure-search-index.mjs`, `scratch/measure-real-transcript.mjs`). Verify: each run prints one JSON line with `searchIndexHeapMegabytes` and exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add `.skilled/hooks/**` to the push and pull_request path filters (`.github/workflows/spec-kit-check.yml`). Verify: `rg -c "'.skilled/hooks/\*\*'" .github/workflows/spec-kit-check.yml` prints 2.
- [x] T005 [P] Replace the schema skip with an existence assertion (`.skilled/hooks/shared/tests/session-readers/project.test.mjs`). Verify: `rg -c "not published" .skilled/hooks/shared/tests/session-readers/project.test.mjs` prints 0.
- [x] T006 Withhold the offer for a runtime label that is not one plain lowercase word (`H/lib/lookup-offer.ts`). Verify: `npm --prefix H run typecheck` exits 0.
- [x] T007 Add the unsafe-label edge case (`H/tests/history-locator.vitest.ts`). Verify: the engine suite prints 140 passed.
- [x] T008 [P] Point Source Files at the moved suites and add Vibe to lines 147 and 166 (`PB/compaction-history-lookup.md`). Verify: every backticked path in its Source Files list exists, and `rg -c "Codex or Vibe|Codex and Vibe|Codex, or Vibe|Codex or a Vibe" PB/compaction-history-lookup.md` rises by 2.
- [x] T009 [P] Make line 18 say the claim prints the section (`PB/hop-recall-conversation.md`). Verify: `rg -n "hop prints no lookup offer" PB/hop-recall-conversation.md` prints nothing.
- [x] T010 [P] Remove the predecessor block and its two mentions (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n -i predecessor .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing and the file parses as YAML.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the unsafe-label control (`H/dist/lookup-offer.js`). Verify: after `npm --prefix H run build`, `buildHistoryLookupSection` returns null for `codex;touch /tmp/x` and still returns a section for `codex`.
- [x] T012 Rerun the schema control (`project.test.mjs`). Verify: with the schema moved aside the suite exits non-zero, and with it restored it prints 11 passed, 0 skipped (the old skip became two tests).
- [x] T013 Rerun the whole gate (`H`, `.skilled/hooks`, readers, handover, hook-state, typechecks). Verify: every count is at or above its T001 baseline with exit 0, and `sync-runtime-mirrors.cjs --check` exits 0.
- [x] T014 Fill the parent phase map row and transition row for this phase (`../spec.md`). Verify: `rg -c "Phase 9 scope|Criteria TBD" ../spec.md` prints 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: `../review/review-report.md` section 3, staged on main
<!-- /ANCHOR:cross-refs -->

---
