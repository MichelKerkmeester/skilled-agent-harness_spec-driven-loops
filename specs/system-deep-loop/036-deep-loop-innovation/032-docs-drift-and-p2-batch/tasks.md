---
title: "Tasks: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "Task breakdown for 032-docs-drift-and-p2-batch: confirm-before-build pass over 29 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "docs drift p2 batch"
  - "registry roster drift readme"
  - "derive counts from registry"
  - "p2 backlog deep loop"
  - "deep loop 032 docs"
importance_tier: "normal"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown from the WS1 phase-tree proposal"
    next_safe_action: "Execute T001 before any other task"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Batch the P2 Backlog and the Three Doc-Contract P1s

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and collapse

Four merge groups are the same fix reported by different iterations. Collapsing them first is what stops the same edit being made twice. Tasks below are representative per lane rather than one per finding.

- [ ] T001 **CONFIRM BEFORE BUILD.** For each of the 29 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [5h]
- [ ] T002 Collapse the four merge groups into single work units, keeping all IDs mapped: {`F-001-01`,`F-026-01`}, {`F-001-02`,`F-026-02`}, {`F-001-03`,`F-026-03`,`F-038-05`}, {`F-026-08`,`F-035-04`} [2h] {deps: T001}
- [ ] T003 Name the authoritative source for each duplicated fact, so the other mentions become links [3h] {deps: T002}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: single-source the documentation

- [ ] T004 Replace duplicated roster facts (families, lanes, adapters, backend kinds, scenario counts) with links to the named authoritative source [10h] {deps: T003}
- [ ] T005 Correct the documentation claims that contradict implementation: corruption repair, the nonexistent convergence flag, the loop-type restriction, output locations, and council completion (`F-038-02`, `F-038-03`, `F-038-04`, `F-038-06`, `F-026-07`) [8h] {deps: T003}
- [ ] T006 [P] Backfill the benchmark report index and fix the broken evidence link and the inert profile/taxonomy assets (`F-033-04`, `F-033-06`, `F-033-03`, `F-033-05`) (`.opencode/skills/system-deep-loop/benchmark/reports/README.md`, `.opencode/skills/system-deep-loop/deep-improvement/assets/`) [5h] {deps: T003}
- [ ] T007 [P] Generate help text from the real command and leaf tables (`F-032-06`, `F-032-07`) (`.opencode/skills/system-deep-loop/runtime/scripts/{verify-iteration,render-command-contract}.cjs`) [4h] {deps: T003}
- [ ] T008 [P] Fix the dead link and the empty trailing heading (`F-001-01`/`F-026-01`, `F-035-05`) (`.opencode/skills/system-deep-loop/runtime/scripts/README.md`, `.opencode/skills/system-deep-loop/deep-review/SKILL.md`) [2h] {deps: T002}

### Lane A: drift checks

- [ ] T009 Add a drift check deriving family, lane, adapter and scenario counts from `mode-registry.json` and the playbook indices, failing on mismatch [8h] {deps: T004}
- [ ] T010 Add a folder-versus-index drift check for the benchmark report index [3h] {deps: T006}
- [ ] T011 Run a local-link scan across every touched document and drive it to zero broken links [3h] {deps: T005, T008}

### Lane B: code hygiene

- [ ] T012 [P] Locale-independent policy digest ordering (`F-002-03`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts`, after `024`) [4h] {deps: T001}
- [ ] T013 [P] Type frozen wave collections as readonly and remove the mutable-array casts (`F-036-05`) (`.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts`) [3h] {deps: T001}
- [ ] T014 Adopt `027`'s shared strict validator in the research and review mode gates rather than patching them locally (`F-031-01`, `F-031-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts`) [5h] {deps: T001}
- [ ] T015 [P] Persist convergence snapshots so a sliding-window baseline accumulates (`F-003-04`) (`.opencode/skills/system-deep-loop/commands/deep/assets/deep-research-auto.yaml`) [4h] {deps: T001}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate

- [ ] T016 Re-run `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck && npm test`; report the delta against the `021` baseline [2h] {deps: T009, T010, T011, T012, T013, T014, T015}
- [ ] T017 Verification pass, then `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch --strict` exits 0 [3h] {deps: T016}
- [ ] T018 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation --recursive --strict` against the bounded child manifest `021` landed, closing the remediation tree [2h] {deps: T017}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [ ] Every confirmed finding carries a negative test that was red pre-fix
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass recorded
- [ ] `checklist.md` fully verified with test-name + suite-digest + SHA evidence
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source register**: `../016-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
