---
title: "Implementation Plan: Code README Structure And Durability Sweep"
description: "Plan for child 003: re-triage 88 structural findings against 001's ruling, build the four-gate CI-backed durability check, then sweep lanes D, C, A and B in order before verifying."
trigger_phrases:
  - "code readme structure sweep plan"
  - "readme durability sweep plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/003-code-readme-structure-and-durability-sweep"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the re-triage, gate-construction and four-lane sweep plan"
    next_safe_action: "Re-verify all 88 findings against HEAD (Phase 1)"
    blockers:
      - "Hard-blocked on child 001's ruling landing before any task list is authored"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Code README Structure And Durability Sweep

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Change class** | Documentation structure only. No factual rewrites, no code behavior. |
| **Surfaces** | ~85 README files across 10 skill hubs plus `.opencode/bin`, `.opencode/scripts` and `.pi` |
| **Gates** | `001`'s code-folder validator mode, a durability grep, a template-authority grep, and `002`'s resolution gate |
| **Blocked by** | `001` — hard. The task list must not exist before the ruling. |

### Overview

The phase is a re-triage followed by four sequential lane sweeps, then a CI gate.

The re-triage is the load-bearing step. Seventy-six of 88 findings cite a missing Directory Tree; the ruling decides how many of those survive. Carrying an exempted finding into a task list is this phase's main failure mode, so the surviving count is published before `tasks.md` is authored.

Lane order is **D → C → A → B**. D is the smallest set and validates the gate mechanics before they are applied at scale. B runs last because it is adjacent to WS1 `032` and to `019`'s tree, and because one of its files is also touched by `002`.

The durability grep gate is the durable output. It is worth shipping even if the operator defers lanes A and B, because it stops the class from growing without repainting anything.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All 88 findings re-verified against HEAD
- [ ] `001`'s ruling recorded and its validator mode runnable
- [ ] Re-triage complete and the surviving count published
- [ ] `002` complete, so the sweep is purely structural

### Definition of Done
- [ ] Validator mode: zero blocking per lane
- [ ] Durability grep: zero per lane
- [ ] Template-authority grep: empty per lane
- [ ] Resolution gate: zero unresolved per lane
- [ ] Second-reader 10% sample per lane recorded
- [ ] Durability gate live in CI and failing on a seeded violation
- [ ] `validate.sh --strict` → Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The four gates, run per lane

| Gate | Command shape | Pass condition |
|------|---------------|----------------|
| Conformance | `001`'s code-folder validator mode over the lane file set | Zero blocking issues |
| Durability | `rg -n "\.opencode/specs/\|[Pp]acket [0-9]\|Spec [0-9]{2,}\|ADR-[0-9]\|[Pp]hase [0-9]+ \|\b026\b\|[Ff]ormerly the\|merged into this hub" <lane files>` | No matches |
| Template authority | `rg -l "skill-readme-template" <lane files>` | Empty |
| No truth drift | `002`'s referenced-path resolution script over the lane file set | Zero unresolved |

### The escalation rule

A structural sweep that starts correcting facts stops being reviewable. When a lane uncovers a false claim, the file's structural work continues and the factual defect is filed as a new row in `002`'s checklist with its source evidence. It is never fixed in this phase.

### Lane isolation

Each lane is its own commit range and its own checklist section. A lane can be reverted without touching another. Files are assigned to the lane that owns their hub; no file appears twice.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and re-triage (hard gate)
- [ ] Re-verify all 88 findings against HEAD
- [ ] Re-classify every finding against `001`'s tree and format rulings
- [ ] Delete the exempted findings from scope; publish the surviving count
- [ ] Confirm the Q4 and Q6 dispositions before lane authoring

### Phase 2: Gate construction
- [ ] Tune the durability pattern against `001`'s conformant control fixture so a legitimate example does not trip it
- [ ] Wire the durability grep as a CI job and prove it fails on a seeded violation

### Phase 3: Lane D — spec-kit / skill-advisor / bin / .pi (14)
- [ ] Sweep, then run all four gates
- [ ] Record the gate mechanics that needed adjustment before the larger lanes

### Phase 4: Lane C — sk-doc / sk-git / mcp-* / sk-prompt (19)
- [ ] Sweep, then run all four gates

### Phase 5: Lane A — sk-code / sk-design (26)
- [ ] Sweep, then run all four gates

### Phase 6: Lane B — system-deep-loop outside runtime (29)
- [ ] Confirm `002` has landed for the shared file
- [ ] Sweep, then run all four gates

### Phase 7: Verification
- [ ] Second-reader 10% sample per lane
- [ ] `validate.sh --strict` per lane
- [ ] Escalation list handed to `002` with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target |
|-----------|-------|-------|--------|
| Conformance | Each lane's file set | `001` validator mode | Zero blocking |
| Durability | Each lane's file set | `rg` | Zero matches |
| Template authority | Each lane's file set | `rg -l` | Empty |
| No truth drift | Each lane's file set | `002` resolution script | Zero unresolved |
| CI gate | Seeded violation | CI run | Job fails, names file and line |
| Sample audit | 10% per lane (≈9 files) | Second reader vs source | Verdicts match |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001` ruling | Internal | Pending | **Hard** — no task list may be authored |
| `001` validator mode | Internal | Pending | **Hard** — the phase cannot be verified |
| `002` completion | Internal | Pending | Soft — sweep would mix structure with truth |
| `002` resolution script | Internal | Pending | REQ-005 gate unavailable |
| WS1 `032` | External | Independent | Lane B sequencing only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lane's sweep is found to have changed meaning rather than structure.
- **Procedure**: revert that lane's commit range. Lanes are independent, so no other lane is affected.
- **The CI gate** is separable: it can stay live even if every lane is reverted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
001 ruling ──> Phase 1 (re-triage) ──> Phase 2 (gates) ──> Lane D ──> Lane C ──> Lane A ──> Lane B ──> Phase 7
                                                                                              ▲
                                                                            002 complete ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Re-triage | `001` ruling | All |
| 2 Gates | 1 | All lanes |
| 3 Lane D | 2 | Lane C |
| 4 Lane C | 3 | Lane A |
| 5 Lane A | 4 | Lane B |
| 6 Lane B | 5, `002` | 7 |
| 7 Verification | All | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Each lane is its own commit range
- [ ] Pre-sweep gate output captured per lane as the baseline delta reference

### Rollback procedure
1. Revert the offending lane's commit range.
2. Re-run all four gates over the remaining lanes; they must stay green.
3. Re-open the affected finding IDs rather than patching over the revert.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│ 001 ruling        │────►│ Phase 1: Confirm     │────►│ Phase 2: Gate       │
│ (external, hard)  │     │ and re-triage        │     │ construction        │
└─────────────────┘     └──────────┬─────────┘     └────────┬──────────┘
                                    │                          │
                    002 completion  │                          ▼
                    (soft, structural-only) ─────┐   Lane D (smallest, validates gates)
                                    │              │            │
                                    │              │            ▼
                                    │              │   Lane C ──► Lane A ──► Lane B
                                    │              │                          │
                                    └──────────────┴──────────────────────────┤
                                                                               ▼
                                                                    Phase 3: Verification
                                                                               │
                                                                               ▼
                                                        Escalation list handed to 002
```

External dependencies (from §6 DEPENDENCIES) gate the whole phase: `001`'s ruling and validator mode are a hard blocker on Phase 1 and every gate run, `002`'s completion and resolution script gate the no-truth-drift check per lane, and WS1 `032` only affects lane B's sequencing.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. `001`'s ruling — external, CRITICAL
2. Re-triage and published survivor count — CRITICAL, decides the phase size
3. Durability gate tuned and wired — CRITICAL, the durable output
4. Lane D — CRITICAL, validates gate mechanics
5. Lanes C, A, B — scale-out, each gated by the previous

**Total Critical Path**: `001` ruling → re-triage → gate construction → Lane D → Lane C → Lane A → Lane B → verification. Lane B additionally waits on `002` completion for its shared file.

**Parallel opportunities**: none within a lane's gate sequence. The CI gate work (Phase 2) is independent of the sweeps once tuned.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Re-triage closed | Surviving finding count published; exempted findings dropped | End of Phase 1 |
| M2 | Gates live | Durability grep tuned, wired to CI, and proven to fail on a seeded violation | End of Phase 2 |
| M3 | Lane D clean | All four gates green over the smallest lane; gate mechanics recorded | Lane D close |
| M4 | Lane C clean | All four gates green over lane C | Lane C close |
| M5 | Lane A clean | All four gates green over lane A | Lane A close |
| M6 | Lane B clean | All four gates green over lane B, sequenced after `002`'s shared-file repair | Lane B close |
| M7 | Program verified | Second-reader sample recorded; `validate.sh --strict` → Errors: 0; escalation list handed to `002` | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md`.

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Truth defects escalate to `002`; the sweep never rewrites a claim | Proposed |
| ADR-002 | Lane order D → C → A → B, smallest first to validate the gates | Proposed |
| ADR-003 | The durability grep gate ships regardless of how many lanes run | Proposed — **[OPERATOR-DECISION: Q6 — is the sweep worth doing?]** |
<!-- /ANCHOR:l3-adr-summary -->
