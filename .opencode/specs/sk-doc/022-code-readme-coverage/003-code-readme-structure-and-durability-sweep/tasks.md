---
title: "Tasks: Code README Structure And Durability Sweep"
description: "Task list for child 003: confirm and re-triage 88 structural findings against 001's ruling, build the durability and conformance gates, sweep four lanes (D, C, A, B), then verify."
trigger_phrases:
  - "code readme structure sweep tasks"
  - "readme durability sweep tasks"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list across setup, gate construction, four lanes and verification"
    next_safe_action: "Start T001: confirm all 88 findings against HEAD"
    blockers:
      - "Hard gate: 001's tree ruling must land before lane expansion"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-003-code-readme-structure-and-durability-sweep"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Code README Structure And Durability Sweep

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`

Status: Planned — no task is started.

> **Authoring gate.** Per-finding tasks for the four lanes are deliberately NOT authored below. Twenty-six findings dissolve outright and roughly fifty shrink depending on `001`'s tree ruling; writing 88 file-level tasks before the ruling would guarantee that exempted findings get worked. Phase 1 produces the surviving set, and only then is each lane's per-file task list expanded from the lane batch tasks in Phase 3 to Phase 6. Every lane batch is marked `[B]` until Phase 1 closes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*(originally: Confirm And Re-Triage — Hard Gate)*

- [ ] **T001 Confirm all 88 findings against HEAD.** Findings are hypotheses. Re-verify every ID at current HEAD and record confirmed / drifted / refuted with file:line. Carry the known magnitude correction: `RA-005-18` is **24** non-README files, not 25. Spot-verify the four findings whose defect is more than "structural":
  - `RA-002-09` — `:114` still links `skill-readme-template.md`; `:94`, `:103` still carry `026` predecessor text
  - `RA-002-24` — unnumbered H2 sequence still present; `:112` still embeds a `.opencode/specs/` path
  - `RA-005-32` — `:28` still narrates packet moves
  - `RA-004-40` — still frames deferred work as current orientation
- [ ] **T002 Re-triage against `001`'s rulings.** Re-classify every surviving finding against the tree-equivalence ruling **[OPERATOR-DECISION: Q1 — tree vs table]** and the format-applicability ruling **[OPERATOR-DECISION: Q2 — format-rule applicability]**, and **delete** the ones the ruling exempts. Carrying an exempted finding into a task list is this phase's main failure mode {deps: T001}
- [ ] T003 Publish the surviving finding count per lane before any `tasks.md` expansion. Expected 88 if fenced trees are mandatory, ~62 if a complete table satisfies a flat folder {deps: T002}
- [ ] T004 Confirm the Q4 disposition. If `019` widened to the whole `system-deep-loop` skill, remove lane B from this phase entirely {deps: T003}
- [ ] T005 Confirm the Q6 disposition: which lanes are authorized to run at the published survivor count {deps: T003}
- [ ] T006 Confirm `002` has landed, so the sweep is purely structural, and note the one shared file (`deep-research/scripts/README.md`) for lane B sequencing {deps: T003}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Gate Construction

- [ ] T010 Tune the durability pattern against `001`'s conformant control fixture so a legitimate example command does not trip it {deps: T003}
- [ ] T011 Wire the durability grep as a CI job over all code-folder READMEs {deps: T010}
- [ ] T012 Prove the CI job fails on a seeded violation and names the file and line {deps: T011}
- [ ] T013 [P] Confirm `001`'s code-folder validator mode is runnable over an arbitrary file list {deps: T003}
- [ ] T014 [P] Confirm `002`'s referenced-path resolution script is runnable over an arbitrary file list {deps: T006}

### Lane D — system-spec-kit / system-skill-advisor / bin / .pi

- [ ] T020 [B] Expand the surviving lane-D findings into per-file tasks {deps: T003, T005}
- [ ] T021 [B] Sweep the lane-D file set: structural conformance and durability strip only {deps: T020}
- [ ] T022 [B] Conformance gate: `001` validator mode over lane D → zero blocking {deps: T021}
- [ ] T023 [B] Durability gate over lane D → zero matches {deps: T021}
- [ ] T024 [B] Template-authority gate over lane D → `rg -l "skill-readme-template"` empty {deps: T021}
- [ ] T025 [B] No-truth-drift gate: `002` resolution script over lane D → zero unresolved {deps: T021}
- [ ] T026 [B] Record any gate mechanics that needed adjustment, before the larger lanes run {deps: T022, T023, T024, T025}

### Lane C — sk-doc / sk-git / mcp-* / sk-prompt

- [ ] T030 [B] Expand the surviving lane-C findings into per-file tasks {deps: T026}
- [ ] T031 [B] Sweep the lane-C file set {deps: T030}
- [ ] T032 [B] Run all four gates over lane C {deps: T031}
- [ ] T033 [B] Decide whether `RA-005-12`'s residual TOC defect is filed fresh in this lane; do not revive the refuted ID {deps: T030}
- [ ] T034 [B] Decide whether `RA-005-10` re-enters as a narrow missing-tree item; only applicable if the ruling made fenced trees mandatory {deps: T030}

### Lane A — sk-code / sk-design

- [ ] T040 [B] Expand the surviving lane-A findings into per-file tasks {deps: T032}
- [ ] T041 [B] Sweep the lane-A file set {deps: T040}
- [ ] T042 [B] Repoint `RA-002-09` at the code template and strip the `026` predecessor text {deps: T041}
- [ ] T043 [B] Fix the `RA-002-24` heading sequence and remove the embedded `.opencode/specs/` path {deps: T041}
- [ ] T044 [B] Run all four gates over lane A {deps: T041}

### Lane B — system-deep-loop Outside runtime/

- [ ] T050 [B] Confirm lane B is still in this phase per the Q4 disposition {deps: T004}
- [ ] T051 [B] Expand the surviving lane-B findings into per-file tasks {deps: T044, T050}
- [ ] T052 [B] Sweep the lane-B file set {deps: T051}
- [ ] T053 [B] `RA-004-40`: fix the orientation framing only. The governance contradiction in the same sentence stays with WS1 `F-036-05` {deps: T052}
- [ ] T054 [B] `RA-008-09`: sequence after `002`'s repair of the same file; do not re-derive its facts {deps: T052}
- [ ] T055 [B] Run all four gates over lane B {deps: T052}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T060 Second reader audits 10% of each executed lane (≈9 files total) against source {deps: T026, T032, T044, T055}
- [ ] T061 Hand the escalation list to `002`: every truth defect uncovered during the sweep, with its source evidence, filed as a `002` checklist row {deps: T060}
- [ ] T062 CI durability job green on the repository and still failing on the seeded violation {deps: T012}
- [ ] T063 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep --strict` → Errors: 0 {deps: T060}
- [ ] T064 Mark every checklist item with evidence; set every ADR status to Accepted {deps: T063}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All authorized tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining among the authorized lanes
- [ ] Surviving finding count published before any lane expansion
- [ ] All four gates green per executed lane
- [ ] Durability gate live in CI
- [ ] Escalation list handed to `002`
- [ ] `validate.sh --strict` → Errors: 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `sk-doc/022-code-readme-coverage`
- **Upstream**: `001` (hard gate), `002` (soft gate, and the escalation target)
- **Adjacent**: `system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes`; WS1 `032-docs-drift-and-p2-batch`
<!-- /ANCHOR:cross-refs -->
