---
title: "Goal: Opt-in expansive depth mode for deep-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review frontier mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-17-expansive-depth-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Opt-in expansive depth mode for deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** With `--depth-mode=expansive`, a deep-review run decomposes its target into admitted sub-target nodes held in `candidateCoverage`, `searchDebt` and `registry.frontier`, focuses and closes them breadth-first and partitions depth-1 nodes across fan-out lineages, and without the flag nothing changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The mode is opt-in: with `depthMode` absent or `--depth-mode=default`, every review output is byte-identical to the pre-phase baseline. |
| D2 | Review admission uses the same six ordered checks as the research frontier and writes into `searchDebt` and `registry.frontier`; review never writes an inbox row. |
| D3 | Under the flag the effective review focus precedence is blocked-stop text, pivot focus, frontier node, leaf `nextFocus`, first uncovered dimension. |
| D4 | The pivot boundary regexes and the configured-target ban do not change. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] A golden review case under `.skilled/skills/system-deep-loop/runtime/tests/unit/` exits 0, showing the registry, dashboard, Next Focus, rendered pack, pivot seed output and fan-out lineage prompt byte-identical to the baseline with `depthMode` absent and with `--depth-mode=default`.
- [ ] The review admit suite exits 0, pruning one proposal per failing check with its own reason, and a valid proposal leaves exactly one `review/frontier-nodes.jsonl` row, one open `searchDebt` entry and one `registry.frontier` node with no `inbox.jsonl` created.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision.vitest.ts tests/integration/review-depth-convergence.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with the review veto cases, the `depth_mode` binding case and the flag-gated `next_dimension` case.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with the reduce-twice, close, per-node dimension and focus-precedence cases, with no frontier-owned `searchDebt` entry left and no node written as a `deferred` or `blocked` disposition once every node is terminal.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-review-deltas-contract.vitest.ts tests/integration/divergent-pivot.vitest.ts tests/unit/check-contract-drift.vitest.ts` exits 0 with a `frontier_proposal` case, the gating case and the regenerated review contract.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/fanout-run.vitest.ts tests/unit/fanout-merge.vitest.ts` exits 0 with seven seeded depth-1 nodes written to the lineage stores before spawn and assigned round-robin across three lineages beside `review_focus`, a merged `frontier` and a failing merge guard for a missing node.
- [ ] On the target-1 pilot, `jq '.frontier.stats'` over the merged registry shows seven depth-1 nodes, zero open and zero active, and its stop reason is not `maxIterationsReached`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Implementation | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Criteria grouping | The rows of `acceptance-criteria.md` are grouped into seven criteria; closure still requires every row there to be `Met`, `Waived` or `Superseded`. |
| Plan review 2026-11-17 | The Fable 5.2 plan review (`../scratch/fable-5-2-plan-review.md`, F011-1 to F011-6, X-1 to X-4, X-6, X-7) added the review node store, steering through `next_dimension`, the seed step, the fan-out passthrough and merged `frontier`, the binding surfaces, per-node dimension coverage, the `renderDashboard` target, the 003, 004 and 012 dependencies, the docs, contract and mirror tasks, and the `npm test` form. |
<!-- /ANCHOR:log -->
