---
title: "Implementation Plan: command asset-layer improvement research"
description: "Plan for the two-lineage command asset-layer deep-research fan-out — forced non-convergence, cross-model synthesis at research/research.md, and the A-K/A-W/A-G backlog that refines the 013 remediation phases; research-and-synthesis only, no runtime change."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/014-command-asset-layer-research"
    last_updated_at: "2026-07-16T08:31:41Z"
    last_updated_by: "claude"
    recent_action: "Completed 2-lineage asset-layer deep-research run; synthesized cross-model backlog"
    next_safe_action: "Author 013 remediation phases from research.md asset-layer deltas"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/orchestration-summary.json"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: command asset-layer improvement research

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a two-lineage deep-research fan-out over the command asset layer and reconcile the two model perspectives into one cross-model backlog. Lineage `gpt56-sol-xhigh-fast` runs GPT-5.6-Sol at `xhigh` reasoning / `fast` tier via `cli-codex`; lineage `glm52-max` runs GLM-5.2 at `max` reasoning via `cli-opencode`. Each runs 5 forced iterations under `stopPolicy: max-iterations` (convergence telemetry-only). The deliverable is `research/research.md`: per-RQ findings with file:line citations and a tiered backlog (A-K keystone, A-W wholesale, A-G generation) whose deltas each carry a target path, an acceptance criterion, and a mapping to a 013 remediation phase. The packet implements nothing; it produces the verified detail the 013 phases are authored from.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Both lineages complete 5/5 iterations (10 total) with `stopReason` in the max-iterations family and no early convergence.
- `research/research.md` carries a cross-model agreement matrix, model-unique findings, and the A-K/A-W/A-G backlog with per-delta targets and acceptance criteria.
- All six 012 asset-layer defects (AL1–AL6) map to a delta; the AL4 false-cycle defect is confirmed against the real parser with cited lines.
- The packet's four Level-1 docs pass `validate.sh --strict` with Errors: 0 Warnings: 0.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The driver is the skill-owned `fanout-run.cjs` with `--loop-type research`. It spawns two independent lineages, each running its own `phase_init → phase_main_loop → phase_synthesis` and writing only inside its `research/lineages/<label>/` boundary — state (`deep-research-state.jsonl`), per-iteration records (`iterations/iteration-001..005.md`), deltas, and logs. One research question is explored per iteration, each broadening a distinct angle across the five RQs (workflow-YAML schema, presentation ownership, mode completeness, route-manifest + cycle parsing, generation + ergonomics). Convergence telemetry is recorded but never stops the loop. After both lineages finish, the synthesis pass reconciles the two `lineages/*/research.md` files into the packet-level `research/research.md`, keeping instrument provenance (`orchestration-summary.json`, `observability-events.jsonl`) beside it. The shipped command corpus, validators, adapter, and canon are read-only inputs throughout.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fan-out run
Launch both lineages through `fanout-run.cjs --loop-type research` under forced non-convergence, drilling the five RQs across five iterations per lineage against the shipped asset corpus and validators.

### Phase 2: Cross-model synthesis
Reconcile the two lineage syntheses into `research/research.md`: build the agreement matrix, isolate model-unique findings, and assemble the tiered A-K/A-W/A-G backlog with per-delta targets, acceptance criteria, and 012→013 mappings.

### Phase 3: Provenance verification
Verify forced non-convergence and the artifact boundary from the run telemetry, and confirm all six AL defects are covered before the backlog feeds the downstream remediation phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification is provenance-and-coverage, not code tests. Confirm both lineages reached `maxIterationsReached` at 5/5 from the state logs and `orchestration-summary.json`; confirm each iteration recorded `mode: research` and its correct executor; confirm every write stayed inside a lineage boundary; confirm the backlog covers AL1–AL6 with targets and acceptance criteria; and confirm the AL4 false-cycle claim against the real `validate-command-references.cjs` extraction with cited offending lines. Finally run `validate.sh --strict` on the packet and require Errors: 0 Warnings: 0.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the 012 cross-model research for the six asset-layer defects it deepens, the shipped command asset triads and `doctor` route manifest as the researched corpus, the `validate-command-references.cjs` and `sk-doc-command.cjs` validators plus the create-command canon as read-only evidence, and the skill-owned `fanout-run.cjs` deep-research driver. Feeds the 013 remediation phases (001–005), which are authored from the backlog deltas.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The packet mutates no shipped runtime, so rollback is limited to the packet folder: discard `research/research.md` and the Level-1 docs to return to the pre-run scaffold. The reused deep-research driver, the researched command corpus, and the validators are untouched and need no reversion.
<!-- /ANCHOR:rollback -->
