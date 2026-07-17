---
title: "Tasks: Vitest baseline recovery"
description: "Task ledger for baseline capture, triage, repair, verification, and changelog correction."
trigger_phrases:
  - "vitest baseline recovery tasks"
  - "baseline triage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery"
    last_updated_at: "2026-05-08T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored baseline recovery tasks"
    next_safe_action: "Continue follow-up repairs"
    blockers: ["post-run still has 196 failures"]
---
# Tasks: Vitest baseline recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or command) [evidence]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run pre-recovery full vitest suite (`pnpm vitest run --reporter=json --outputFile=/tmp/vitest-baseline-pre-recovery.json`).
- [ ] T002 Copy pre-recovery JSON to packet scratch (`scratch/vitest-baseline-pre-recovery.json`).
- [ ] T003 Generate failing-test inventory from pre-recovery JSON (`scratch/triage-inventory.json`).
- [ ] T004 [P] Confirm forbidden Unit A files are not part of planned edits.
- [ ] T005 [P] Author Level 2 plan/tasks/checklist/implementation-summary skeletons.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Triage

- [ ] T006 Classify every failing test as fixture-drift, runtime-regression, environmental, or flaky.
- [ ] T007 Record per-test classification and action in packet scratch.
- [ ] T008 Use git log/blame for ambiguous drift lineage.

### Recovery Actions

- [ ] T009 Fix fixture-drift expectations with `// drift:` packet comments.
- [ ] T010 Fix runtime regressions that fit the <=30 LOC single-file rule.
- [ ] T011 Annotate larger runtime regressions with `it.fails.skip` and `// followup: 026/000/002-vitest-baseline-recovery-followup`.
- [ ] T012 Annotate environmental failures with `it.skip` and `// REASON: <env requirement>`.
- [ ] T013 Run five-sample checks for flaky candidates and annotate with `// flake-rate: ~X/5 runs`.
- [ ] T014 Update `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` verification table row.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run post-recovery full vitest suite (`pnpm vitest run --reporter=json --outputFile=/tmp/vitest-baseline-post-recovery.json`).
- [ ] T016 Copy post-recovery JSON to packet scratch (`scratch/vitest-baseline-post-recovery.json`).
- [ ] T017 Compare pre/post JSON and verify zero new failures against the pre-recovery triage baseline.
- [ ] T018 Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit`.
- [ ] T019 Run strict packet validation (`validate.sh --strict`).
- [ ] T020 Fill `implementation-summary.md` with bucket counts, decisions, verification, and limitations.
- [ ] T021 Mark checklist evidence for all P0/P1 requirements.
- [ ] T022 Update `description.json` and `graph-metadata.json` to complete / 100%.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 198 baseline failures classified.
- [ ] REQ-001 through REQ-003 closed.
- [ ] REQ-004 through REQ-007 closed.
- [ ] v3.4.1.0 changelog row updated.
- [ ] Strict validation exits 0.
- [ ] Final answer includes 4-bucket count summary.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation summary**: `implementation-summary.md`
- **Follow-up placeholder**: `026/000/002-vitest-baseline-recovery-followup`

<!-- /ANCHOR:cross-refs -->
