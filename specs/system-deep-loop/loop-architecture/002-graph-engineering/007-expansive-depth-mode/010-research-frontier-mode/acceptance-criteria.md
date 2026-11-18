---
title: "Acceptance Criteria: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "research frontier mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode"
    last_updated_at: "2026-11-17T14:34:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-research-frontier-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Opt-in expansive depth mode for deep-research: frontier admission, veto, close rules

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `010-research-frontier-mode`
**Level:** 3
**Status:** Planned
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixed research fixture and the baseline captured in T002, When the loop runs with `depthMode` absent and again with `--depth-mode=default`, Then the registry, dashboard, Next Focus, rendered prompt pack, fan-out lineage prompt and `stopDecisionConfig` echo are byte-identical to the baseline | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/<golden file>` exits 0. Observed 2026-11-17: `npx vitest run research-depth-mode-golden.vitest` 12 of 12. Registry, dashboard, Next Focus, prompt pack and stop config are byte-identical. The CLI lineage prompt differs from the baseline by the one expansive-only persona paragraph the leaf contract added, which the check strips; waived, ratified by the operator on 2026-11-18 | Waived | ADR-006 |
| AC-002 | REQ-002 | Given one proposal per failing check (no evidence anchor, duplicate, depth 4, seventh child, growing budget, cycle), When `step_frontier_admit` runs, Then each is pruned with its own check's reason and none reaches `research/inbox.jsonl` | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/frontier-admit.vitest.ts` exits 0. Observed 2026-11-17: `npx vitest run frontier-admit.vitest` 23 of 23, and 24 of 24 on integration `2c9405692a1` after the seed-once case: one row per failing check, first failure wins, pruned rows add no inbox line | Met | - |
| AC-003 | REQ-002 | Given a valid proposal, When it is admitted, Then exactly one inbox row with `origin: "frontier"` and the node id is appended | Admission suite case plus `rg -c '"origin":"frontier"'` on the fixture inbox prints 1. Observed 2026-11-17: Admit case asserts one inbox row with `origin: frontier` and the node id; CLI smoke admitted F-2-004 with one inbox row | Met | - |
| AC-004 | REQ-003 | Given an inbox row with `origin: "frontier"`, When the reducer runs, Then the registry question keeps origin `frontier` and is not rewritten to `operator` | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-research-reduce-state.vitest.ts` exits 0 with the origin case. Observed 2026-11-17: `npx vitest run deep-research-reduce-state.vitest` 48 of 48 with the origin case, and 49 of 49 on integration `2c9405692a1` after the reworded-focus visit case | Met | - |
| AC-005 | REQ-004 | Given a `composite_converged` candidate with one open node and budget left, When `convergence.cjs` decides under expansive mode, Then it returns CONTINUE with a `frontierOpen` reasonDetail; under default mode, at the cap, after three failures, when stuck, under `off` or under `max-iterations`, the veto does not apply | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision.vitest.ts` exits 0 with the table, and `'echoes the input unchanged'` passes unedited. Observed 2026-11-17: `npx vitest run stop-decision.vitest` 79 of 79 with the eight-row precedence table; `'echoes the input unchanged'` passes unedited | Met | - |
| AC-006 | REQ-004 | Given the frozen `stopReason` enum, When this phase lands, Then the enum has the same members | `stop-decision-yaml-contract` suite exits 0 unchanged. Observed 2026-11-17: `git diff b5fb87abad8` shows no change to `stop_reasons_enum`; `stop-decision-yaml-contract.vitest` 22 of 22 | Met | - |
| AC-007 | REQ-005 | Given a node that closes as `exhausted`, When the reducer and graph upsert run, Then its question is resolved with the status recorded and it no longer lowers question coverage or source diversity | Close case in the reducer and coverage-graph suites exits 0. Observed 2026-11-17: Reducer close case (`frontierStatus: exhausted`) and the `frontier-admit.vitest` graph close case: coverage and source diversity equal the base graph | Met | - |
| AC-008 | REQ-006 | Given the frontier Next Focus for an open node, When one non-error iteration runs with that focus and lists no answered question, Then the node's question stays unresolved | Reducer case exits 0. Observed 2026-11-17: Reducer focus case: one visit with the frontier focus leaves the question open | Met | - |
| AC-009 | REQ-007 | Given open nodes at depths 1 and 2, When Next Focus is computed under the flag with no pivot or blocked stop, Then a depth-1 node is chosen | Reducer case exits 0. Observed 2026-11-17: Reducer focus case picks F-1-001 over F-2-002 | Met | - |
| AC-010 | REQ-008 | Given `maxIterations` 10 and an unspent depth-1 share, When depth 2 begins, Then its budget includes the rollover, and a spent band closes its open nodes as `exhausted: budget` | Budget case exits 0. Observed 2026-11-17: Roll-down case gives depth 2 6.5 iterations and keeps its node open; no-roll-up case closes depth 1 at 5 as `exhausted: budget` | Met | - |
| AC-011 | REQ-009 | Given a STUCK_RECOVERY result under expansive mode with another open node, When the handler runs, Then the active node closes as `exhausted`, focus advances and a `stuckRecovery` event resets `stuckCount` to 0 | `frontier-admit` close case exits 0, and `stop-decision-yaml-contract` finds the close call and the `stuckRecovery` append in the sub-branch (a wording check). Observed 2026-11-17: `frontier-admit` close case and the yaml-contract stuck case (close call plus `stuckRecovery` append, a wording check) | Met | - |
| AC-012 | REQ-010 | Given a fan-out run with three lineages and five depth-1 nodes written by the seed step before spawn, When lineage prompts are built, Then each lineage gets `config.depthMode: expansive`, nodes are assigned round-robin and written into each lineage's node store before it spawns, the partition is recorded in `orchestration-summary.json`, the merged registry carries `frontier`, the merge guard fails if one partitioned node is missing, and a run without the flag or with `--depth-mode default` has no `frontier_scope:` or `depthMode` line | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/fanout-run.vitest.ts tests/unit/fanout-merge.vitest.ts` exits 0. Observed 2026-11-17: `npx vitest run fanout-run.vitest fanout-merge.vitest`: 203 and 84 passing, with partition, store-before-spawn, no-flag, default, merged-frontier and guard-fail cases | Met | - |
| AC-013 | REQ-011 | Given `--convergence-mode=divergent` and an open frontier node, When a STOP candidate appears, Then no Council pivot is prepared until every node is terminal | `stop-decision-yaml-contract` finds the gate in the divergent branch (a wording check), and the reducer case shows zero open and zero active nodes only once all are terminal. Observed 2026-11-17: yaml-contract finds `frontier_gate` in the divergent branch; reducer close case shows zero open nodes only after every node is terminal | Met | - |
| AC-014 | REQ-012 | Given the target-2 pilot rooted at the prompt-policy gate, When the run ends, Then `jq '.frontier.stats'` shows zero open and zero active nodes with every node terminal, and the stop checks show the frontier at zero open before the iteration cap. Amended 2026-11-18 by the operator (decision-record Q003): the earlier "stop reason is not `maxIterationsReached`" clause is dropped, because the default-run stop gates that D2 freezes block a non-cap stop | Met 2026-11-18 on run 2 (`scratch/pilot-run-2.md`): final stats total 16, open 0, active 0, answered 16; the stop check before iteration 15 of 16 recorded `frontierOpen` 0, two iterations before the cap | Met | - |
| AC-015 | REQ-013 | Given an expansive fixture, When `renderDashboard` renders the dashboard, Then it shows frontier size, pruned nodes, revisits and budget per depth | Reducer dashboard case in `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-research-reduce-state.vitest.ts` exits 0. Observed 2026-11-17: Reducer dashboard case asserts size, pruned, revisits and per-band budget, and no section on a default run | Met | - |
| AC-016 | REQ-014 | Given a state with seeded, admitted, pruned and closed nodes in `research/frontier-nodes.jsonl`, When the reducer runs twice, Then both runs produce a byte-identical `frontier` with each node's last status | Reduce-twice case in `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-research-reduce-state.vitest.ts` exits 0. Observed 2026-11-17: Reducer two-reduce case gives identical `frontier` JSON | Met | - |
| AC-017 | REQ-015 | Given a single-executor run under the flag, When `phase_init` finishes, Then the node store holds open depth-1 nodes before iteration 1 | `frontier-admit` seed case exits 0, and `stop-decision-yaml-contract` finds `step_frontier_seed` after `step_create_config` and before `step_fanout_spawn`. Observed 2026-11-17: `frontier-admit` seed case; yaml-contract finds `step_frontier_seed` after `step_create_config` and before `step_fanout_spawn` | Met | - |
| AC-018 | REQ-016 | Given the research presentation asset and workflow YAML, When the binding surfaces are read, Then `depth_mode` appears beside `convergence_mode` in the presentation, `user_inputs`, `step_preflight_contract`, `step_read_state` and the `convergence.cjs` call | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with the binding case. Observed 2026-11-17: `stop-decision-yaml-contract.vitest` 22 of 22 with the binding case | Met | - |
| AC-019 | REQ-017 | Given the phase's last code change, When docs close the phase, Then the reference docs, `SKILL.md`, `README.md`, playbook and changelog name `--depth-mode`, the research compiled contract is regenerated and the agent mirrors show no drift | `rg -l -- '--depth-mode'` prints the SKILL.md, the README, the four reference docs, the playbook root and DR-068, and the changelog entry. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run check-contract-drift.vitest` prints `Tests  9 passed (9)`, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`. `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync — OK`. The doctor route `doctor-runtime-mirrors.yaml` runs that same mirror script; the slash command `/doctor:runtime-mirrors` itself was not run in this session. Observed 2026-11-17 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Yes. AC-014 is met under the amended criterion (decision-record Q003) on the run-2 pilot evidence.
<!-- /ANCHOR:closure -->
