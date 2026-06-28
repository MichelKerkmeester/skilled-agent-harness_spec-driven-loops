---
title: "Design Enforcement Build (sk-design routing/utilization/pairing/cross-CLI)"
description: "Phase-parent for the buildable backlog from the 037 routing-and-integration research. Holds six dimension sub-parents (D1 residual craft, D2 command specificity, D3 routing/utilization guarantee, D4 mcp-open-design pairing guarantee, D5 cross-CLI survival, D6 corpus ports), each with one phase per recommendation. Children are planned scaffolds: each carries a spec describing what to build, the target file, the acceptance gate, and the research evidence; plan/tasks/checklist are authored when a phase is executed."
trigger_phrases:
  - "design enforcement build"
  - "sk-design routing utilization build"
  - "design enforcement phases"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# Design Enforcement Build

## 1. PURPOSE

Parent for the build-out of the [[037-design-routing-and-integration-research]] backlog: turn the design family's routing, utilization, mcp-open-design pairing, and cross-CLI guarantees from prose into enforced, measurable mechanisms — and land the residual craft and command-specificity work alongside.

Each recommendation from the research is its own phase. The honest target carried from the research: make non-utilization loud and blocking, replace self-attestation with content-bound proof, and measure the residual miss-rate — never claim to certify taste.

## 2. STRUCTURE

Six dimension sub-parents, each holding one phase per recommendation:

| Sub-parent | Dimension | Recommendations |
|------------|-----------|-----------------|
| `001-d1-residual-craft` | Residual feature/reference/asset craft | D1-R1 … D1-R13 |
| `002-d2-command-specificity` | Make `/design:*` commands specific + useful | D2-R1 … D2-R13 |
| `003-d3-routing-utilization` | Guarantee parent→sub-skill routing + utilization | D3-R1 … D3-R12 |
| `004-d4-open-design-pairing` | Guarantee mcp-open-design always loads sk-design | D4-R1 … D4-R11 |
| `005-d5-cross-cli-survival` | Guarantee survival through cli-opencode/codex/claude-code | D5-R1 … D5-R8 |
| `006-d6-corpus-ports` | Port designer-skills-main patterns | D6-R1 … D6-R11 |

## 3. THE SHARED ENFORCEMENT SPINE

D3, D4, and D5 are one system, not three. Build the shared spine first:

1. **Selection** — a parseable router replayed over a scored gold corpus (D3).
2. **Loading** — content-bound proof tokens (file fingerprints), not honor-system checkboxes (D3/D4).
3. **Firing** — deny-by-default preconditions at the tool boundary (D4).
4. **Survival** — inlined payload + parent-side re-validation across the CLI handoff (D5).

Recommended sequencing: the D3/D4 P0 spine items first (they are the load-bearing mechanism the rest plug into), then D2/D5, then the D1/D6 craft and ports.

## 4. CHILD CONTRACT

Each recommendation phase is a planned scaffold: a `spec.md` (objective, why, target file, severity/class, build outline, acceptance gate, research evidence, `status: planned`) plus generated `description.json` and `graph-metadata.json`. `plan.md` / `tasks.md` / `checklist.md` are authored when that phase is executed, at which point the executed phase runs strict validation and a completion claim.

## 5. SCOPE

In scope: scaffolding every D1–D6 recommendation as a phase, with the shared-spine framing and sequencing. Out of scope (this parent): executing the builds, editing any live `sk-design` / `commands/design` / `mcp-open-design` / `cli-*` file. Those happen inside the executed child phases under change control.

## 6. RELATED

- Source research: [[037-design-routing-and-integration-research]] (`research/research.md` §4–§11 carry the full backlog with citations).
- Prior build precedent: the 031–034 impeccable-adoption phases (flat L3 packets).
