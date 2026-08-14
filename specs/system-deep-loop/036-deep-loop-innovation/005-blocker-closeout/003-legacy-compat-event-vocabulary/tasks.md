---
title: "Tasks: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Task breakdown for 003-legacy-compat-event-vocabulary: confirm-before-build pass over 6 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-legacy-compat-event-vocabulary"
    last_updated_at: "2026-08-07T03:06:00Z"
    last_updated_by: "codex"
    recent_action: "Completed all tasks and reconciled the six-vocabulary evidence packet"
    next_safe_action: "Orchestrator reviews and lands the uncommitted candidate"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

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

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Gate |
|-----------|-------|------|
| M1 | T001-T004 | Census complete; `manualStop` sub-claim corrected |
| M2 | T005-T007 | Six real captured fixtures with provenance |
| M3 | T008-T014 | Six vocabularies with per-stem dispositions |
| M4 | T015-T018 | Six zero-blocked replays |
| M5 | T019-T021 | Suite delta clean; Blocker 2 recorded as discharged |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and census [M1]

The census is evidence for the mapping work. The operator has ruled that this child writes the six vocabularies; the census does not offer an exit from that.

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 6 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [2h] [Evidence: `tasks.md`]

  **T001 confirmation table (HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b`):**

  | Finding | Classification | HEAD evidence |
  |---------|----------------|---------------|
  | `F-022-02` | `CONFIRMED` | `deep-research-ledger-schema/legacy-compatibility.ts:90-94` registers only `config`, `iteration`, `resumed`, `restarted`, and `blocked_stop`; the live research asset emits `graph_convergence`, `config_warning`, and `lock_released` at lines 599-619 and 2035. |
  | `F-022-03` | `CONFIRMED` | `deep-review-ledger-schema/legacy-compatibility.ts:89-94` registers only `config`, `iteration`, `resumed`, `restarted`, and `blocked_stop`; the live review asset emits `graph_convergence`, `claim_adjudication`, `userPaused`, and `synthesis_complete` at lines 569, 1550-1559, 937, and 1989. |
  | `F-023-01` | `CONFIRMED` | `deep-alignment-ledger-schema/legacy-compatibility.ts:90-94` maps every legacy `type: "iteration"` record to `deep_alignment.lane_completed`, regardless of whether the record is an iteration slice. |
  | `F-023-02` | `CONFIRMED` | `deep-alignment-ledger-schema/legacy-compatibility.ts:76-80` requires `runId`/`sessionId`/`authorityEpochId`; the live alignment config at `deep-alignment-auto.yaml:258` emits only `sessionId` among those identity fields. |
  | `F-023-03` | `CONFIRMED` | `deep-ai-council-ledger-schema/legacy-compatibility.ts:194-202` checks `input.event` against a set containing `progress_record`, then maps no `type: "topic_completed"` or `type: "round_completed"`; the live heartbeat shape is emitted at `orchestrate-session.cjs:425-430`, with terminal records at `orchestrate-session.cjs:520-524` and `orchestrate-topic.cjs:257-261`. |
  | `F-024-01` | `CONFIRMED` | `skill-benchmark-ledger-schema/legacy-compatibility.ts:28-30,147-159` recognizes only `benchmark_run_planned` and has no common-bridge delegation; the agent/model variants import and call the common compatibility hooks at their `legacy-compatibility.ts:6-8,177-197` and `:6-8,307-339`. |

  Finding severity remains cutover-readiness and robustness risk: the actor is the operator or a stale local file, not a remote attacker.
- [x] T002 Record the `F-022-02` `manualStop` sub-claim as REFUTED, citing the grep showing it absent at the cited location. Do not carry the sub-claim into the fix. [1h] {deps: T001} [Evidence: `tasks.md`]

  Probe: `rg -n "manualStop" runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` returned `no matches`; the symbol exists in the common improvement bridge, not at the cited research location.
- [x] T003 Run the legacy-state census: enumerate which legacy state logs exist, for which modes, and which must survive migration. [6h] {deps: T001} [Evidence: `legacy-state-census.md`]

  Evidence: `legacy-state-census.md` was authored before mapping edits and records the selected real logs, complete inventory, and must-survive disposition.
- [x] T004 Cite the `021` `runtime` baseline and re-run the scoped verification gate. [1h] {deps: T001} [Evidence: `implementation-summary.md`]

  Evidence: pre-fix HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b`, red real-log replay probes, final `tsc` rc 0, and the serial per-mode/per-file matrix are recorded in `implementation-summary.md`; the prohibited shared-process run is not used because it hangs on the shared SQLite append lock.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Capture real fixtures [M2]

- [x] T005 Enumerate the live stem set per mode from the command assets and the council orchestrator scripts, not from the current mapping [4h] {deps: T003} [Evidence: `implementation-summary.md`]
- [x] T006 Capture a real state log per mode from actual command output; record the producing command and run identifier per fixture [6h] {deps: T005} [Evidence: `fixture-provenance.md`]
- [x] T007 Where a fresh run is impractical, substitute an existing run artifact and record the substitution explicitly [2h] {deps: T006} [Evidence: `fixture-provenance.md`]

### Write the six vocabularies [M3]

- [x] T008 Research: map or pin `graph_convergence`, `config_warning`, `lock_released` (`F-022-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007} [Evidence: `implementation-summary.md`]
- [x] T009 [P] Review: add `graph_convergence`, `claim_adjudication`, `userPaused`, `synthesis_complete` (`F-022-03`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007} [Evidence: `implementation-summary.md`]
- [x] T010 Alignment: separate an iteration slice from terminal lane completion (`F-023-01`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts`) [5h] {deps: T007} [Evidence: `deep-alignment-ledger-schema.vitest.ts`]
- [x] T011 Alignment: accept the identity fields the live config emits rather than requiring `runId`/`authorityEpochId` (`F-023-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts`) [3h] {deps: T010} [Evidence: `deep-alignment-ledger-schema.vitest.ts`]
- [x] T012 [P] Council: match the live heartbeat shape and register `topic_completed` / `round_completed` (`F-023-03`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007} [Evidence: `deep-ai-council-ledger-schema.vitest.ts`]
- [x] T013 [P] Skill-benchmark: delegate unmapped stems to the common upcaster, matching the agent and model variants (`F-024-01`) (`.opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts`) [4h] {deps: T007} [Evidence: `skill-benchmark-ledger-schema.vitest.ts`]
- [x] T014 Record a map-or-pin disposition with a rationale for every stem in all six vocabularies; check every pin against the census [4h] {deps: T008, T009, T011, T012, T013} [Evidence: `decision-record.md`]

  Evidence: ADR-003 and the disposition tables in `implementation-summary.md` cross-reference the census and cover mapped, pinned, compatible, degraded, and delegated outcomes.

### Replay proof [M4]

- [x] T015 Per mode, replay the captured real log and assert zero `blocked:unknown-legacy-record` [6h] {deps: T014} [Evidence: `implementation-summary.md`]
- [x] T016 Multi-slice alignment lane stream: assert the lane does not complete after slice one [3h] {deps: T011} [Evidence: `deep-alignment-ledger-schema.vitest.ts`]
- [x] T017 Assert pinned stems are reported as pins with their rationale, never as blocks [2h] {deps: T014} [Evidence: `implementation-summary.md`]
- [x] T018 Negative test: an unmapped stem blocks loudly with the stem named, and does not silently drop [2h] {deps: T014} [Evidence: `deep-research-ledger-schema.vitest.ts`]

  Evidence: the six named real-log replay tests, the alignment multi-slice test, council heartbeat test, and research unknown-stem negative test are listed with suite digests and candidate hashes in `implementation-summary.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate [M5]

- [x] T019 Re-run TypeScript and the required per-mode/per-file verification matrix; report the scoped delta against the `021` baseline [2h] {deps: T015, T016, T017, T018} [Evidence: `implementation-summary.md`]
- [x] T020 Independent post-build adversarial verification pass targeted at fixture provenance and pin rationales; staffing limitation recorded honestly [5h] {deps: T019} [Evidence: `implementation-summary.md`]
- [x] T021 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-legacy-compat-event-vocabulary --strict` exits 0; record the Blocker 2 discharge handoff [2h] {deps: T020} [Evidence: `validate.sh`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every scoped finding ID resolved to a fix, a `REFUTED` rationale, or an `ALREADY-FIXED` commit citation
- [x] Every confirmed finding carries a negative test that was red pre-fix
- [x] Scoped whole gate re-run and reported as a delta against the captured baseline; the prohibited shared-process run is documented
- [x] Post-build adversarial verification pass recorded with its staffing limitation
- [x] `checklist.md` fully verified with test-name + suite-digest + candidate SHA evidence
- [x] All ADRs have a terminal status (Accepted or Superseded)
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
