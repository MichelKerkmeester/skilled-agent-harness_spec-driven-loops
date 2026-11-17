---
title: "Acceptance Criteria: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review frontier mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode"
    last_updated_at: "2026-11-17T14:34:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-review-frontier-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Opt-in expansive depth mode for deep-review: admission into candidateCoverage and searchDebt

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `011-review-frontier-mode`
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
| AC-001 | REQ-001 | Given a fixed review fixture and the T003 baseline, When the loop runs with `depthMode` absent and with `--depth-mode=default`, Then the registry, dashboard, Next Focus, rendered pack, pivot seed output and fan-out lineage prompt are byte-identical to the baseline | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/<golden review file>` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given one review proposal per failing admission check, When the review admission step runs, Then each is pruned with its own reason and no debt entry or inbox row is written | Review admit suite exits 0 | Unmet | - |
| AC-003 | REQ-002 | Given a valid review proposal, When it is admitted, Then exactly one `review/frontier-nodes.jsonl` row, one open `searchDebt` entry and one `registry.frontier` node exist for it, and no `inbox.jsonl` file is created | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the admit case | Unmet | - |
| AC-004 | REQ-003 | Given an `all_dimensions_clean` or composite review candidate with one open node and budget left, When `convergence.cjs` decides under expansive mode, Then it returns CONTINUE; at the cap, after failures, when stuck, under `off` or `max-iterations`, or under default mode, the veto does not apply | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision.vitest.ts tests/integration/review-depth-convergence.vitest.ts` exits 0 | Unmet | - |
| AC-005 | REQ-004 | Given every review node terminal, When the reducer runs, Then no frontier-owned `searchDebt` entry remains, every node's status is recorded in `registry.frontier`, and no node is written as a `deferred` or `blocked` disposition | Close case exits 0 | Unmet | - |
| AC-006 | REQ-005 | Given the flag on, When the review pack is rendered, Then it carries the `frontier_proposal` channel, and the pack allowed-write list matches the review agent definition | `deep-review-deltas-contract` suite exits 0 with a proposal case | Unmet | - |
| AC-007 | REQ-006 | Given a review state with blocked-stop text, a pivot focus, an open node, a leaf `nextFocus` and an uncovered dimension, When Next Focus is computed under the flag with each source removed in turn, Then the winner follows blocked-stop, pivot, frontier, leaf, dimension | Precedence case exits 0 | Unmet | - |
| AC-008 | REQ-007 | Given `--convergence-mode=divergent` and an open review node, When a STOP candidate appears, Then no pivot is prepared; once all nodes are terminal, a pivot may seed from an `exhausted` node and its accepted candidate goes through admission | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/integration/divergent-pivot.vitest.ts` exits 0 with the gating case | Unmet | - |
| AC-009 | REQ-008 | Given a review fan-out with three lineages and seven depth-1 nodes written by the seed step before spawn, When lineage prompts are built, Then each lineage gets `config.depthMode: expansive`, nodes are assigned round-robin beside `review_focus` and written into each lineage store before it spawns, the partition is recorded in `orchestration-summary.json`, the merged registry carries `frontier`, and the merge guard fails when one node is missing | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/fanout-run.vitest.ts tests/unit/fanout-merge.vitest.ts` exits 0 | Unmet | - |
| AC-010 | REQ-009 | Given a review STUCK_RECOVERY result under expansive mode with another open node, When the handler runs, Then the active node closes as `exhausted` and `deep_review.recovery_started` resets `stuckCount` to 0 | Review close case exits 0, and `stop-decision-yaml-contract` finds the close call and the event in the sub-branch (a wording check) | Unmet | - |
| AC-011 | REQ-010 | Given the target-1 pilot pinned to a recorded SHA, When the run ends, Then `jq '.frontier.stats'` on the merged registry shows seven depth-1 nodes, zero open and zero active, and the stop reason is not `maxIterationsReached` | Pilot merged registry and stop record | Unmet | - |
| AC-012 | REQ-011 | Given seeded, admitted, pruned and closed review nodes in `review/frontier-nodes.jsonl`, When the reducer runs twice, Then both runs produce a byte-identical `frontier` and `searchDebt` | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the reduce-twice case | Unmet | - |
| AC-013 | REQ-012 | Given the flag on and an active node with dimensions left, When `step_read_state` runs, Then `next_dimension` is the node's next uncovered dimension and the rendered pack names the node; with the flag off the rule is unchanged | `stop-decision-yaml-contract` finds the flag-gated `next_dimension` case and the unchanged default rule (a wording check), and the reducer case shows the active node | Unmet | - |
| AC-014 | REQ-013 | Given the review presentation asset and workflow YAML, When the binding surfaces are read, Then `depth_mode` appears beside `convergence_mode` in each of them | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with the review binding case | Unmet | - |
| AC-015 | REQ-014 | Given a node with two of four dimensions covered, When the reducer runs, Then `registry.frontier` records those two and the node stays open; once all four are covered it closes `answered` | Reducer case exits 0 | Unmet | - |
| AC-016 | REQ-015 | Given the phase's last code change, When docs close the phase, Then the review reference docs, `SKILL.md`, `README.md`, playbook and changelog name `--depth-mode`, the review compiled contract is regenerated and the agent mirrors show no drift | `rg -l -- '--depth-mode'` prints each doc, `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/check-contract-drift.vitest.ts` exits 0 and `/doctor:runtime-mirrors` reports no drift | Unmet | - |

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
