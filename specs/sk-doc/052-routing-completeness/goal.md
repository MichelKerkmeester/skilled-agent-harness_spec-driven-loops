---
title: "Goal: Routing Completeness"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness"
    last_updated_at: "2026-09-05T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed phase 008, the re-measurement after closure, and reconciled the parent with the tree"
    next_safe_action: "Hand register rows 42 to 44 to their owners"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-052-routing-completeness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phases 1 to 6 are Complete on disk and in the map; the log's earlier note about the map reading Pending is resolved."
      - "The phase implementation summaries were written back in bed94b42cc; the log's earlier note about them scaffolding is resolved."
---
# Goal: Routing Completeness

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove routing with numbers instead of assertions, then fix, own or close every finding those numbers produced.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The advisor daemon governs; every number here comes from it |
| D2 | The scorer does not change here, because changing it voids every number |
| D3 | Gate A counts declared signals reaching one mode; Gate B counts realistic phrasings reaching the intended mode |
| D4 | Every finding is fixed, owned by a phase, or closed as a decision |
| D5 | Vocabulary work that moves no Gate B row is reported as such |
| D6 | Phase 007 re-reads each decision against packet 049 first |
| D7 | A number is re-measured after any move of the tree it was measured on, and what moved is repaired or owned, never absorbed |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative and binds
as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-transport-and-baseline | `001-transport-and-baseline/goal.md` |
| 002-gate-a-signal-closure | `002-gate-a-signal-closure/goal.md` |
| 003-gate-b-realistic-corpus | `003-gate-b-realistic-corpus/goal.md` |
| 004-cross-hub-vocabulary | `004-cross-hub-vocabulary/goal.md` |
| 005-hub-surface-truth | `005-hub-surface-truth/goal.md` |
| 006-validator-and-template-debt | `006-validator-and-template-debt/goal.md` |
| 007-spec-kit-residue | `007-spec-kit-residue/goal.md` |
| 008-drift-after-closure | `008-drift-after-closure/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these into the objective verbatim. Nothing dereferences a path.

- [x] `validate.sh --strict --recursive` prints RESULT: PASSED for all nine folders. Run 2026-09-05 from the final tree
- [x] Every findings-register row reads Fixed, Planned or Decision. 45 distinct rows: 25 Fixed, 13 Planned, 7 Decision, counting the three that live only in the closed-by-decision table
- [x] Gate A and Gate B each have a committed corpus that reproduces its number on a second run. Gate A 345 then 343 of 388 across 2026-09-04 and 2026-09-05 with both moved rows ruled; Gate B 21 then 20 of 180
- [x] All eight phases hold a goal.md with criteria checkable by exit code, count or artifact
- [x] Each of the eight ADRs in 007 is implemented or recorded superseded, with its reason. A ninth, ADR-009, rules on the residue itself
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
| 001 transport and baseline | Done | `03f5db4876` settles which scorer governs |
| 002 Gate A signal closure | Done | `dbc8678c9d` measures 234 of 444; `08eb67a0de` resolves half the vocabulary that reached nothing; `726af58b4c` closes at 345 of 388 |
| 003 Gate B realistic corpus | Done | `4a5de9e52b` measures 8 of 180; `8c6d6fd455` drops the command-surface modes from the denominator |
| 004 cross-hub vocabulary | Done | `4a5de9e52b` re-scoped the phase the Gate B number invalidated |
| 005 hub surface truth | Done | `8bb9011584` records the findings closed and the check that keeps them closed |
| 006 validator and template debt | Done | `a1a213d2cf` authored the phase; `82938b3e1c`, `970a033381`, `cac56b9082` and `cb9fdb44f3` shipped it |
| 007 spec-kit residue | Done | Nine decisions ruled, two implemented. The suite runs to the end sharded, 12 of 12 shards in 34m00s, and its 181 failures split into 31 grouped by mechanism and 150 inside 049's delete |
| 008 drift after closure | Done | Both gates re-run on 2026-09-05 with per-row artifacts; scaffold suite 9 of 9 after three loader paths; one signal retired, two findings owned |
| Findings register | Done | `d7f70069b9` gives every finding an owner and every phase a runnable gate; phase 008 adds rows 41 to 45 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 004 narrowed after measurement | It was scoped believing vocabulary collision was the main obstacle. Gate B showed 94 of 180 prompts match no declared word in any form, so keyword ownership cannot reach them |
| The semantic lane left off | Enabling it is a scoring change, and D2 forbids one here. It moves to its own packet under `specs/system-skill-advisor/` |
| Phase 007 overtaken by packet 049 | `specs/system-speckit/049-memory-decommission` deletes the tree most of the residue lives in. The 007 goal carries the per-decision mapping, and ADR-009 extends the same test to the residue itself. 049 has since closed and the tree is gone |
| The parent documents lagged the tree | The map read Pending for six closed phases, the goal's criteria were unchecked though met, and the roadmap called 049 Pending after it closed. Reconciled in phase 008; the validator had passed throughout, which is a finding about the validator recorded in the register |
| The spec-kit scaffolder broke two days after closure | `b4c2484696` nested the CLI workspace and the render wrapper lost its loader. Every Level 3 scaffold wrote no documents until phase 008 fixed three path literals |
<!-- /ANCHOR:log -->
