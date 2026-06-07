---
title: "FS-002 -- Scope Binding and Code-Graph Seeding"
description: "This scenario validates Scope Binding and Code-Graph Seeding for `FS-002`. It focuses on how the host extracts anchors from the operator-supplied scope and expands them via code_graph_query into ranked SLICE nodes before the first sweep."
---

# FS-002 -- Scope Binding and Code-Graph Seeding

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FS-002`.

---

## 1. OVERVIEW

This scenario validates Scope Binding and Code-Graph Seeding for `FS-002`. It focuses on how the host extracts anchors from the operator-supplied scope, calls `code_graph_query` with 2-5 word concept descriptions to get blast-radius / calls, and writes the resulting ranked SLICE frontier into `deep-context-strategy.md` before the first iteration runs.

### Why This Matters

The frontier is the scope boundary for every executor seat in every sweep. A poorly seeded frontier means every seat wastes token budget on tangential code; a correctly seeded frontier ensures every agreement-eligible finding is relevant to the target feature. Verifying this contract prevents the most common failure mode: a whole-repo sweep masquerading as a focused context loop.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FS-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `step_seed_frontier` calls `code_graph_query` with scope-derived concept descriptions and falls back to Glob+Grep when the code graph is stale.
- Real user request: `Verify that deep-context seeds a focused SLICE frontier from the scope before any executor sweeps.`
- Prompt: `As a manual-testing orchestrator, validate the scope-binding and frontier-seeding contract for deep-context against the command entrypoint, auto YAML, SKILL.md §3, and loop_protocol.md §4. Verify step_seed_frontier calls code_graph_query with 2-5 word concept descriptions from the scope and falls back to Glob+Grep when the graph is stale. Verify the result is written to deep-context-strategy.md. Return a concise user-facing verdict.`
- Expected execution process: Read the auto YAML for `step_seed_frontier`; read `loop_protocol.md` §4 for frontier seeding rules; read SKILL.md §3 step 1 for code_graph_query usage; read `start-context-loop.md` section 5 for background frontier seeding; confirm Glob+Grep fallback is documented.
- Expected signals: `step_seed_frontier` appears in the auto YAML; `loop_protocol.md` §4 describes "2-5 word concept descriptions"; Glob+Grep fallback is documented in both SKILL.md and loop_protocol.md; `deep-context-strategy.md` is named as the frontier destination.
- Desired user-visible outcome: The strategy file contains code-graph-verified SLICE anchors from the scope before any executor sees the scope, and the fallback path is documented for stale-graph conditions.
- Pass/fail: PASS if `step_seed_frontier` is in the auto YAML and loop_protocol.md §4 documents both code_graph_query and Glob+Grep fallback; FAIL if either is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local; it is doc-verification only — stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FS-002 | Scope Binding and Code-Graph Seeding | Verify frontier seeding uses code_graph_query with scope anchors | `Verify that deep-context seeds a focused SLICE frontier from the scope before any executor sweeps.` | 1. `rg "step_seed_frontier" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` -> 2. `rg "code_graph_query\|code-graph\|blast.radius" .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 3. `rg "Glob.*Grep\|Grep.*Glob\|fallback" .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 4. `rg "strategy.md\|strategy" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Step 1: `step_seed_frontier` found; Step 2: `code_graph_query` and blast-radius documented; Step 3: Glob+Grep fallback documented; Step 4: `strategy.md` appears as frontier output target | Grep outputs from all four commands | PASS if all four steps return matches; FAIL if step_seed_frontier or the fallback path is undocumented | 1. Check loop_protocol.md path. 2. Search for alternative frontier-seeding step names in the YAML. 3. Confirm `references/protocol/loop_protocol.md` exists in the deep-context skill. |

### Optional Supplemental Checks

Confirm that SKILL.md §3 step 1 also documents the "never sweep the whole repo" invariant for frontier seeding:

```bash
rg "whole.*repo\|never.*repo\|whole-repo" .opencode/skills/deep-context/SKILL.md .opencode/skills/deep-context/references/protocol/loop_protocol.md
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/01--frontier-seeding/scope-binding-and-code-graph-seeding.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Primary: `step_seed_frontier` in phase_init |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | Loop protocol §4: frontier seeding rules, code_graph_query usage, Glob+Grep fallback |
| `.opencode/skills/deep-context/SKILL.md` | SKILL.md §3 step 1 describing frontier seeding and scope anchors |
| `.opencode/commands/deep/start-context-loop.md` | Command section 5: background read-only frontier seeding before setup prompt |

---

## 5. SOURCE METADATA

- Group: Frontier Seeding
- Playbook ID: FS-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--frontier-seeding/scope-binding-and-code-graph-seeding.md`
