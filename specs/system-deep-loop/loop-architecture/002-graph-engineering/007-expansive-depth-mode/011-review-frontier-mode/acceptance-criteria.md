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
| AC-001 | REQ-001 | Given a fixed review fixture and the T003 baseline, When the loop runs with `depthMode` absent and with `--depth-mode=default`, Then the registry, dashboard, Next Focus, rendered pack, pivot seed output and fan-out lineage prompt are byte-identical to the baseline | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/<golden review file>` exits 0. Observed 2026-11-17: `npx vitest run review-depth-mode-golden.vitest` 14 of 14 for depthMode absent and --depth-mode=default. Registry, dashboard, Next Focus, prompt pack, pivot seeds and stop config are byte-identical to the pre-phase baseline. The CLI lineage prompt differs only by the expansive-only persona paragraph the leaf contract added, which the check strips; waived, ratified by the operator on 2026-11-18 together with 010's ADR-006 | Waived | ADR-005 |
| AC-002 | REQ-002 | Given one review proposal per failing admission check, When the review admission step runs, Then each is pruned with its own reason and no debt entry or inbox row is written | Review admit suite exits 0. Observed 2026-11-17: `npx vitest run frontier-admit-review.vitest` passes one prune case per check (relevance twice, dedupe, depth, fanout, budget, cycle), each with its own reason; no debt entry or inbox file is written by admission | Met | - |
| AC-003 | REQ-002 | Given a valid review proposal, When it is admitted, Then exactly one `review/frontier-nodes.jsonl` row, one open `searchDebt` entry and one `registry.frontier` node exist for it, and no `inbox.jsonl` file is created | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the admit case. Observed 2026-11-17: frontier-admit-review: a valid review proposal leaves one open frontier-nodes.jsonl row and no inbox.jsonl; deep-review-state-reducer 'projects one open node into the frontier and one deferred search-debt entry' shows one searchDebt entry and one registry.frontier node | Met | - |
| AC-004 | REQ-003 | Given an `all_dimensions_clean` or composite review candidate with one open node and budget left, When `convergence.cjs` decides under expansive mode, Then it returns CONTINUE; at the cap, after failures, when stuck, under `off` or `max-iterations`, or under default mode, the veto does not apply | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision.vitest.ts tests/integration/review-depth-convergence.vitest.ts` exits 0. Observed 2026-11-17: `npx vitest run stop-decision.vitest review-depth-convergence.vitest` 95 passed: review all_dimensions_clean and composite candidates with frontierOpen 2 return CONTINUE frontierOpen; cap, failures, stuck, off, max-iterations, the review floor and default mode keep their decision (D-011-02) | Met | - |
| AC-005 | REQ-004 | Given every review node terminal, When the reducer runs, Then no frontier-owned `searchDebt` entry remains, every node's status is recorded in `registry.frontier`, and no node is written as a `deferred` or `blocked` disposition | Close case exits 0. Observed 2026-11-17: deep-review-state-reducer 'closes an exhausted node and derives an answered one, reporting neither as debt': no frontier searchDebt entry, no frontier class in deferred or blocked, both statuses in registry.frontier | Met | - |
| AC-006 | REQ-005 | Given the flag on, When the review pack is rendered, Then it carries the `frontier_proposal` channel, and the pack allowed-write list matches the review agent definition | `deep-review-deltas-contract` suite exits 0 with a proposal case. Observed 2026-11-17: Under the flag the pack's {frontier_block} carries the frontier_proposal instructions (frontier-admit-review block case, prompt-pack 'review frontier block' cases); deep-review-deltas-contract reduces a delta with a frontier_proposal row without corruption; the pack STATE FILES list and the agent's writable files are unchanged and agree (CHK-141) | Met | - |
| AC-007 | REQ-006 | Given a review state with blocked-stop text, a pivot focus, an open node, a leaf `nextFocus` and an uncovered dimension, When Next Focus is computed under the flag with each source removed in turn, Then the winner follows blocked-stop, pivot, frontier, leaf, dimension | Precedence case exits 0. Observed 2026-11-17: deep-review-state-reducer 'hands next focus to the active frontier node, and keeps the pivot and blocked-stop overrides ahead' in both strategy and dashboard; with the frontier terminal the leaf nextFocus returns | Met | - |
| AC-008 | REQ-007 | Given `--convergence-mode=divergent` and an open review node, When a STOP candidate appears, Then no pivot is prepared; once all nodes are terminal, a pivot may seed from an `exhausted` node and its accepted candidate goes through admission | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/integration/divergent-pivot.vitest.ts` exits 0 with the gating case. Observed 2026-11-17: `npx vitest run divergent-pivot.vitest` gating case: an open node makes buildReviewPivotPreparationInput refuse; with all nodes terminal one 'frontier-unanswered' seed names the exhausted node; the YAML frontier_gate routes an accepted candidate through step_frontier_admit | Met | - |
| AC-009 | REQ-008 | Given a review fan-out with three lineages and seven depth-1 nodes written by the seed step before spawn, When lineage prompts are built, Then each lineage gets `config.depthMode: expansive`, nodes are assigned round-robin beside `review_focus` and written into each lineage store before it spawns, the partition is recorded in `orchestration-summary.json`, the merged registry carries `frontier`, and the merge guard fails when one node is missing | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/fanout-run.vitest.ts tests/unit/fanout-merge.vitest.ts` exits 0. Observed 2026-11-17: `npx vitest run fanout-run.vitest fanout-merge.vitest`: seven nodes dealt 3/2/2 round-robin, store written before spawn without an inbox, config.depthMode expansive and frontier_scope beside review_focus, partition recorded; merged review frontier and a guard that fails when a depth-1 node is missing | Met | - |
| AC-010 | REQ-009 | Given a review STUCK_RECOVERY result under expansive mode with another open node, When the handler runs, Then the active node closes as `exhausted` and `deep_review.recovery_started` resets `stuckCount` to 0 | Review close case exits 0, and `stop-decision-yaml-contract` finds the close call and the event in the sub-branch (a wording check). Observed 2026-11-17: stop-decision-yaml-contract finds close --target review --status exhausted in if_stuck_recovery.if_expansive_open_node and the stuck branch still sets pending_stop_event stuck_recovery, appended as deep_review.recovery_started, which projects to stuckRecovery and resets stuckCount; frontier-admit-review shows the node exhausted after close | Met | - |
| AC-011 | REQ-010 | Given the target-1 pilot pinned to a recorded SHA, When the run ends, Then the merged registry holds the seven subsystem depth-1 nodes plus the sampled determinism node, `jq '.frontier.stats'` shows zero open and zero active with every node terminal, and no frontier-owned `searchDebt` entry stays open. Amended 2026-11-18 by the operator (decision-record Q008): the "stop reason is not `maxIterationsReached`" clause is dropped, because review quality gates that D2 freezes (here `spec_code` traceability on a commit-range target) can hold a drained lineage to the cap | Met 2026-11-18 on pilot run 2 at `cee8682a6c9` (`scratch/pilot-run-2.md`): depth 1 = 8 nodes, all answered (7 subsystems plus the determinism node); merged stats total 22, open 0, active 0 (12 answered, 7 exhausted, 3 pruned); every lineage store 0 open and 0 active; merge guard passed with no missing node; the two open `searchDebt` entries (`SL-004`, `SL-2-04`) are review search-ledger deferrals, not frontier nodes | Met | - |
| AC-012 | REQ-011 | Given seeded, admitted, pruned and closed review nodes in `review/frontier-nodes.jsonl`, When the reducer runs twice, Then both runs produce a byte-identical `frontier` and `searchDebt` | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the reduce-twice case. Observed 2026-11-17: deep-review-state-reducer 'reduces the same store to byte-identical frontier and search debt' | Met | - |
| AC-013 | REQ-012 | Given the flag on and an active node with dimensions left, When `step_read_state` runs, Then `next_dimension` is the node's next uncovered dimension and the rendered pack names the node; with the flag off the rule is unchanged | `stop-decision-yaml-contract` finds the flag-gated `next_dimension` case and the unchanged default rule (a wording check), and the reducer case shows the active node. Observed 2026-11-17: stop-decision-yaml-contract finds the flag-gated next_dimension case and the verbatim default sentence; reducer cases show activeNodeId and activeNextDimension; the frontier block names the node by id | Met | - |
| AC-014 | REQ-013 | Given the review presentation asset and workflow YAML, When the binding surfaces are read, Then `depth_mode` appears beside `convergence_mode` in each of them | `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with the review binding case. Observed 2026-11-17: `npx vitest run stop-decision-yaml-contract.vitest` passes 'deep-review binds depth_mode beside convergence_mode' over the presentation asset and the YAML | Met | - |
| AC-015 | REQ-014 | Given a node with two of four dimensions covered, When the reducer runs, Then `registry.frontier` records those two and the node stays open; once all four are covered it closes `answered` | Reducer case exits 0. Observed 2026-11-17: deep-review-state-reducer 'keeps a node open with two of four dimensions covered and answers it at four' | Met | - |
| AC-016 | REQ-015 | Given the phase's last code change, When docs close the phase, Then the review reference docs, `SKILL.md`, `README.md`, playbook and changelog name `--depth-mode`, the review compiled contract is regenerated and the agent mirrors show no drift | `rg -l -- '--depth-mode'` prints each doc, `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/check-contract-drift.vitest.ts` exits 0 and `/doctor:runtime-mirrors` reports no drift. Observed 2026-11-17: reference docs, SKILL.md and README name --depth-mode, check-contract-drift OK and check-agent-mirror-sync in sync. Observed 2026-11-18: `rg -l -- '--depth-mode'` over `deep-review/` lists ten files: the reference docs, SKILL.md, README, the playbook index, the DRV-076 scenario and the changelog v1.13.0.0; `check-contract-drift.vitest` passes 9 of 9 and `check-contract-drift.cjs` prints OK commands=2; the compiled review contract was regenerated and differs only in its source digest; the checkers behind `/doctor:runtime-mirrors` run in check-only form: runtime mirrors (260), codex agents (11) and prompts (46), agent body parity (11) and the roster all print in sync or OK. The command-catalog checker exits 0 and reports three argument-hint divergences in `/create:changelog`, `/deep:research` and `/deep:review` metadata; those files predate this change and this change does not touch them. | Met | - |
| AC-017 | REQ-016 | Given a fan-out run of either loop type, When `fanout-run.cjs` dispatches a lineage, Then the lineage's env carries `DEEP_LOOP_COVERAGE_DB_DIR` equal to `<lineage>/graph-db`, and every graph-writing step in `deep-review.yaml` and `deep-research.yaml` names that store and how to bind it | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts -t "coverage graph store inside\|lineage-local graph store"` exits 0. Observed 2026-11-18: red first (empty variable for the research and review lineage cases, all six step cases), green after commit `d68f9261a5c`; full runtime suite 190 files, 3414 passed, 11 skipped, 0 failed | Met | - |
| AC-018 | REQ-017 | Given an expansive review whose frontier holds at least one answered node and none open or active and that forms no other candidate, When `convergence.cjs` decides, Then it stops `converged` with reasonDetail `frontier_drained` when every gate passes and the graph allows it, is `BLOCKED` on a failed gate, continues with an open node, forms no candidate under default or absent depth mode or when nothing was answered, and never outranks the cap, consecutive failures, stuck recovery, `off`, `max-iterations` or the floor | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/stop-decision.vitest.ts -t frontier_drained` exits 0. Observed 2026-11-18: 7 of 18 cases red before the candidate existed, all 18 green after commit `d68f9261a5c`; the answered-node cases (nothing answered, no answered count, the `frontierAnswered` fact) red first and green after commit `c22146e2543`, 21 cases in all; the golden review and research suites stay green | Met | - |
| AC-019 | REQ-018 | Given a review iteration whose findings carry `file:line` refs in its delta or state record, When `step_graph_upsert` runs `upsert.cjs` with the state log, delta directory and iteration, Then each finding with a ref gets one `EVIDENCE_FOR` edge to a declared FILE node, a re-upsert adds no edge, a finding without a ref adds none, a leaf finding node folds onto the finding it names in any case and in any later iteration while other node kinds keep their edges, a colliding id of another file and title gets its own node, a ref without a line earns no edge, and an edge to an undeclared node is skipped with a stderr notice and no foreign-key failure for every loop type | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/upsert-script.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0. Observed 2026-11-18: the six evidence cases and the step case red first, green after commit `7c6a2d9a7e5`; the review follow-up cases (lowercase fold, a later RESOLVES edge, a non-finding `finding-` id, a colliding id, a ref without a line, research and context orphan edges) red first and green after commit `c22146e2543`; full runtime suite 190 files, 3432 passed, 11 skipped, 0 failed; pi-5 replay with the derived edges gives `STOP converged all_dimensions_clean`, graph `STOP_ALLOWED` | Met | - |

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

No. AC-011 (the target-1 pilot) runs at integration after merge, and AC-001 is waived under ADR-005, which the operator ratified on 2026-11-18. AC-016 closed on 2026-11-18 once the playbook and changelog were written and checked.
<!-- /ANCHOR:closure -->
