---
title: "Goal: Opt-in expansive depth mode for deep-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research frontier mode goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/010-research-frontier-mode"
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
# Goal: Opt-in expansive depth mode for deep-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** With `--depth-mode=expansive`, a deep-research run admits new scope as bounded frontier nodes, focuses them breadth-first, refuses to stop while nodes are open within budget and stops cleanly once every node is terminal, and without the flag nothing changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The mode is opt-in: with `depthMode` absent or `--depth-mode=default`, every output is byte-identical to the pre-phase baseline. |
| D2 | Admission checks run in the fixed order relevance, dedupe, depth (`maxDepth` 3), fan-out (`maxChildrenPerNode` 6 and the node cap), monotone budget, acyclicity, and only admitted nodes reach `research/inbox.jsonl` with `origin: "frontier"`. |
| D3 | The `frontierOpen` veto only turns a STOP candidate into CONTINUE; it never outranks the cap, consecutive failures, stuck, pause, `convergenceMode: off` or `stopPolicy: max-iterations`, and the `stopReason` enum stays frozen. |
| D4 | `maxIterations` splits 50% / 35% / 15% across depths 0-1, 2 and 3, and unused budget rolls down, never up. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] A golden case under `.skilled/skills/system-deep-loop/runtime/tests/unit/` exits 0, showing the registry, dashboard, Next Focus and rendered prompt pack byte-identical to the baseline with `depthMode` absent and with `--depth-mode=default`.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/frontier-admit.vitest.ts` exits 0, pruning one proposal per failing check with that check's reason and appending exactly one `origin: "frontier"` inbox row for a valid proposal.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/stop-decision.vitest.ts tests/unit/stop-decision-yaml-contract.vitest.ts` exits 0 with the veto table and the `depth_mode` binding case, and `'echoes the input unchanged'` passes unedited.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/deep-research-reduce-state.vitest.ts` exits 0 with the frontier-origin, reduce-twice, node-close, visit-does-not-answer, lowest-depth focus, budget-rollover and dashboard cases.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/check-contract-drift.vitest.ts` exits 0 after the research contract is regenerated, and `rg -l -- '--depth-mode'` prints a file in the deep-research playbook, changelog and `references/` folders.
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test -- tests/unit/fanout-run.vitest.ts tests/unit/fanout-merge.vitest.ts` exits 0 with seeded nodes written to each lineage store before spawn, round-robin `frontier_scope:` assignment, a merged `frontier`, a failing merge guard for a missing depth-1 node and no `frontier_scope:` line without the flag.
- [ ] On the target-2 pilot, `jq '.frontier.stats'` over its `findings-registry.json` shows zero open and zero active nodes, and its stop reason is not `maxIterationsReached`.
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
| Implementation | Done on branch | 13 commits on `worktrees/467-ed-010-research-frontier-mode`, head `6d4adc8ef41` plus the closure commit; T001-T026 and T029 done |
| Merge-time steps | Open | T027, T028 (@markdown in integration), T030 full suite, T031-T032 pilot (D-010-04). Next task on resume: T030 at the merge gate |

### Deviations and findings

| Item | Note |
|------|------|
| Golden and the agent persona | The lineage prompt embeds the agent definition, so the leaf-contract row changed default bytes. The check now strips only that paragraph (D-010-02). |
| Close status was dropped | The reducer case for the close rule showed `buildQuestionFields` dropped `frontierStatus`; it now carries it. |
| Criteria grouping | The rows of `acceptance-criteria.md` are grouped into seven criteria; closure still requires every row there to be `Met`, `Waived` or `Superseded`. |
| Plan review 2026-11-17 | The Fable 5.2 plan review (`../scratch/fable-5-2-plan-review.md`, F010-1 to F010-6, X-1, X-2, X-6, X-7) added the seed step, the node store, the fan-out passthrough and merged `frontier`, the binding surfaces, the `{frontier_block}` variable, the `renderDashboard` target, the docs, contract and mirror tasks, and the `npm test` form. The stuck and pivot checks are YAML wording checks, so they left the criteria for `acceptance-criteria.md`. |
<!-- /ANCHOR:log -->
