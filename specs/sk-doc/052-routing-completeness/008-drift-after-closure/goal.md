---
title: "Goal: Drift After Closure"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/008-drift-after-closure"
    last_updated_at: "2026-09-05T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed every criterion on the re-run artifacts and the green scaffold suite"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-052-008-drift-after-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Drift After Closure

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Re-measure every number the packet closed on, repair what the measurement proves and scope allows, and record the rest with an owner.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Measure before editing. Both gates and every phase check run first, and only what fails or moves is touched |
| D2 | The parent's D2 binds here: no scoring change, and no pin re-baselined on a scorer nobody has judged |
| D3 | A drifted signal is retired only when the losing hub's own written boundary says the phrase was never its |
| D4 | A moved number with no known mechanism is recorded with its evidence and an owner, never absorbed into a re-pin |
| D5 | Phase 007's stale paths and the parent's unfilled sections are reconciled here, since they are drift of the same kind |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] Gate A re-run artifact committed with 388 rows and every bucket change ruled. Two changed: one retired, one recorded under ADR-003
- [x] Gate B re-run artifact committed with 180 rows and the hit count recorded. 20 of 180, 93 empty, 0 errors
- [x] The scaffold suite passes in full from the final tree. 9 of 9, against 1 failed before the fix
- [x] Every hub gate is green after the retirement. Doctor check OK on five hubs, guard fresh, three skill-root gates 14 of 14
- [x] Strict recursive validation prints RESULT: PASSED for all nine folders, and the placeholder checker reports zero patterns on the parent, phase 007, and this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Gate B re-run | Done | `research/gate-b-rerun-2026-09-05.tsv`, generation 593 |
| Gate A re-run | Done | `research/gate-a-rerun-2026-09-05.tsv`, two rows moved |
| Scaffold loader paths | Done | Three literals, suite 9 of 9, scratch packet eleven documents. The same edit landed concurrently in `743e626543` from packet 054 phase 002 |
| Signal retirement | Done | Mint `already-exists`, guard fresh, live replay on `system-spec-kit` |
| Parity pin | Recorded | ADR-002, three readings across two regimes, file unedited |
| `trigger_phrases` | Recorded | ADR-003, owner `system-skill-advisor` |
| Phase 007 and parent reconciled | Done | Six key files exist, phase map eight rows Complete, roadmap names 049 Complete |

### Deviations and findings

| Item | Note |
|------|------|
| Level 3 over the script's Level 1 | The size score is honest and the phase is small, but it rules on three decisions, and the packet convention is to go higher when the script and judgment differ |
| The parity suite stays red | Deliberate. Re-pinning is a scoring judgment D2 forbids, and the number is regime-dependent; the next owner has all three readings |
| The mint changed nothing | Intent signals are not among the manifest's hashed inputs, so the retirement reached the daemon through the metadata rescan rather than through a re-mint. The guard was still run, since the rule is to run it after any routing edit |
<!-- /ANCHOR:log -->
