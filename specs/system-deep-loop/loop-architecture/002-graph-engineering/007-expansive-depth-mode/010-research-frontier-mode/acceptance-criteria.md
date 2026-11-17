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
| AC-001 | REQ-001 | Given a fixed research fixture and the baseline captured in T002, When the loop runs with `depthMode` absent and again with `--depth-mode=default`, Then the registry, dashboard, Next Focus and rendered prompt pack are byte-identical to the baseline | Golden case in `.skilled/skills/system-deep-loop/runtime/tests/unit/` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given one proposal per failing check (no evidence anchor, duplicate, depth 4, seventh child, growing budget, cycle), When `step_frontier_admit` runs, Then each is pruned with its own check's reason and none reaches `research/inbox.jsonl` | `npx vitest run .skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` exits 0 | Unmet | - |
| AC-003 | REQ-002 | Given a valid proposal, When it is admitted, Then exactly one inbox row with `origin: "frontier"` and the node id is appended | Admission suite case plus `rg -c '"origin":"frontier"'` on the fixture inbox prints 1 | Unmet | - |
| AC-004 | REQ-003 | Given an inbox row with `origin: "frontier"`, When the reducer runs, Then the registry question keeps origin `frontier` and is not rewritten to `operator` | `npx vitest run .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` exits 0 with the origin case | Unmet | - |
| AC-005 | REQ-004 | Given a `composite_converged` candidate with one open node and budget left, When `convergence.cjs` decides under expansive mode, Then it returns CONTINUE with a `frontierOpen` reasonDetail; under default mode, at the cap, after three failures, when stuck, under `off` or under `max-iterations`, the veto does not apply | `npx vitest run .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` exits 0 with the table | Unmet | - |
| AC-006 | REQ-004 | Given the frozen `stopReason` enum, When this phase lands, Then the enum has the same members | `stop-decision-yaml-contract` suite exits 0 unchanged | Unmet | - |
| AC-007 | REQ-005 | Given a node that closes as `exhausted`, When the reducer and graph upsert run, Then its question is resolved with the status recorded and it no longer lowers question coverage or source diversity | Close case in the reducer and coverage-graph suites exits 0 | Unmet | - |
| AC-008 | REQ-006 | Given the frontier Next Focus for an open node, When one non-error iteration runs with that focus and lists no answered question, Then the node's question stays unresolved | Reducer case exits 0 | Unmet | - |
| AC-009 | REQ-007 | Given open nodes at depths 1 and 2, When Next Focus is computed under the flag with no pivot or blocked stop, Then a depth-1 node is chosen | Reducer case exits 0 | Unmet | - |
| AC-010 | REQ-008 | Given `maxIterations` 10 and an unspent depth-1 share, When depth 2 begins, Then its budget includes the rollover, and a spent band closes its open nodes as `exhausted: budget` | Budget case exits 0 | Unmet | - |
| AC-011 | REQ-009 | Given a STUCK_RECOVERY result under expansive mode with another open node, When the handler runs, Then the active node closes as `exhausted`, focus advances and a `stuckRecovery` event resets `stuckCount` to 0 | Convergence counter case exits 0 | Unmet | - |
| AC-012 | REQ-010 | Given a fan-out run with three lineages and five open depth-1 nodes, When lineage prompts are built, Then nodes are assigned round-robin, the merge guard fails if one node is missing, and a run without the flag has no `frontier_scope:` line | `fanout-run` and `fanout-merge` suites exit 0 | Unmet | - |
| AC-013 | REQ-011 | Given `--convergence-mode=divergent` and an open frontier node, When a STOP candidate appears, Then no Council pivot is prepared until every node is terminal | Composition case exits 0 | Unmet | - |
| AC-014 | REQ-012 | Given the target-2 pilot rooted at the prompt-policy gate, When the run ends, Then `jq '.frontier.stats'` shows zero open and zero active nodes and the stop reason is not `maxIterationsReached` | Pilot `findings-registry.json` and its stop record | Unmet | - |
| AC-015 | REQ-013 | Given an expansive fixture, When the dashboard is rendered, Then it shows frontier size, pruned nodes, revisits and budget per depth | Dashboard fixture assertion exits 0 | Unmet | - |

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

No. The phase is Planned and no criterion has been verified yet.
<!-- /ANCHOR:closure -->
