---
title: "Feature Specification: command asset-layer (YAML + .txt) improvement research"
description: "A two-lineage deep-research fan-out (5x GPT-5.6-Sol xhigh/fast via cli-codex + 5x GLM-5.2 max via cli-opencode, 10 forced iterations, non-convergence) drilling the command asset layer — the _auto.yaml / _confirm.yaml workflow YAMLs, the _presentation.txt display assets, and the doctor route-manifest _routes.yaml — and producing a cross-model asset-layer backlog (A-K/A-W/A-G) at research/research.md that refines the 013 remediation phases."
status: in_progress
trigger_phrases:
  - "command asset layer research"
  - "command yaml txt research"
  - "presentation asset research"
  - "workflow yaml mode research"
  - "route manifest yaml research"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/014-command-asset-layer-research"
    last_updated_at: "2026-07-16T08:42:19Z"
    last_updated_by: "claude"
    recent_action: "Completed 2-lineage asset-layer deep-research run; synthesized cross-model backlog"
    next_safe_action: "Author 013 remediation phases from research.md asset-layer deltas"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/commands/doctor/_routes.yaml"
    open_questions:
      - "Is the mode_matrix.default_policy enum exhaustive or do speckit/deep add a fifth policy"
      - "Does the doctor manifest subtype need a blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY"
    answered_questions:
      - "Executor = 2-lineage fan-out: 5x cli-codex/gpt-5.6-sol xhigh/fast + 5x cli-opencode/glm-5.2 max"
      - "Stop policy = max-iterations; both lineages reached maxIterationsReached with no early convergence"
      - "AL4 false-cycle defect proven, not hypothesized: comments parsed as route edges"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: command asset-layer (YAML + .txt) improvement research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 012 cross-model research named the command asset layer — the `_auto.yaml` / `_confirm.yaml` workflow YAMLs, the `_presentation.txt` display assets, and the `doctor` route-manifest `_routes.yaml` — as the system's strongest, most-consistent structure, yet left six asset-layer defects at headline resolution: mode-completeness is unchecked, mode-default policy is invisible, presentation ownership has no typed representation, the route-cycle detector misreads YAML comments as edges, the doctor route-manifest shape is unnamed, and some `.txt` ownership labels are wrong. This packet runs a deep-research fan-out that takes those six defects from headline to contract-ready detail. It is a research-and-synthesis packet: the deliverable is `research/research.md`, a cross-model backlog of candidate deltas (target paths + acceptance criteria) that refines the 013 remediation phases; it ships no runtime change itself.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Run a two-lineage deep-research fan-out with forced non-convergence: 5 iterations of GPT-5.6-Sol at `xhigh` reasoning / `fast` service tier via `cli-codex`, and 5 iterations of GLM-5.2 at `max` reasoning via `cli-opencode` (10 total).
- Read the shipped `_auto.yaml` / `_confirm.yaml` / `_presentation.txt` / `_routes.yaml` corpus, the command validators and the benchmark adapter, and the 012 asset-layer findings.
- Reconcile the two lineage syntheses into `research/research.md`: a cross-model agreement matrix, model-unique findings, and a reconciled asset-layer backlog (A-K / A-W / A-G tiers) mapping each delta to a 012 tier, an AL defect, and a 013 phase.
- Preserve run provenance under each `research/lineages/<label>/` boundary and verify forced non-convergence from the run telemetry.

**Out of scope:**
- Implementing any delta; the deltas refine the 013 remediation phases and are authored there.
- Touching shipped runtime — the validators, adapter, canon, and command corpus are read-only inputs.
- Memory-DB reindex of the researched corpus.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** Both lineages complete all 5 iterations each (10 total) with `stopReason` in the max-iterations family and no early convergence; provenance is recorded per lineage.
- **REQ-002 (P0):** `research/research.md` synthesizes findings across the two model lineages with evidence citations (file:line) and candidate deltas distinguished by priority; agreements are strengthened and disagreements flagged.
- **REQ-003 (P0):** Each backlog delta names a target path and an acceptance criterion and maps onto a 013 remediation phase, so the phases can be authored from real, verified detail.
- **REQ-004 (P1):** All six 012 asset-layer defects (AL1–AL6) map to at least one delta with a target and an acceptance criterion.
- **REQ-005 (P1):** The AL4 route-cycle defect is confirmed against the real parser with cited offending lines rather than left as a hypothesis.
- **REQ-006 (P1):** All writes stay inside each lineage's `research/` boundary; no shipped runtime is modified during the run.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both lineages report `maxIterationsReached` (5/5 each), confirming forced non-convergence rather than early stop.
- `research/research.md` carries a cross-model agreement matrix, model-unique findings, and the A-K/A-W/A-G backlog with per-delta targets and acceptance criteria.
- Every AL1–AL6 defect is covered by a delta, and the dependency spine sequences A-K1 (false-cycle fix) independently ahead of the contract-and-check tiers.
- The packet's four Level-1 docs pass `validate.sh --strict` with Errors: 0 Warnings: 0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Two-model drift — mitigated by the cross-model agreement matrix, which separates independently-corroborated findings from single-lineage claims flagged for a verify pass.
- False-cycle blast radius — the proven AL4 defect means some of 066's P0 cycle findings are not real and some real cycles could be missed; A-K1 must land before those P0s are acted on.
- Contract-before-check ordering — the mode matrix, doctor subtype, and presentation fields describe shapes that must exist as typed data before their checks can read them; the backlog sequences the contract (A-K2) ahead of the A-W checks.
- Dependencies: the 012 asset-layer findings, the shipped command asset triads, the `validate-command-references.cjs` and `sk-doc-command.cjs` validators, and the create-command canon.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the `mode_matrix.default_policy` enum `{confirm, conditional-auto, ask, confirm-only}` exhaustive, or do the remaining `speckit/*` and `deep/*` families add a fifth policy? (verify before codifying A-K2 / phase 001)
- Should the doctor manifest subtype carry a blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY, such as a required `_routes.yaml` + route-validate gate?
- Does the intent-aware presentation-leak check (A-W3) need a curated display-vocabulary allowlist before promotion to avoid noise?
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 013-command-canon-remediation. Successor: none (highest-numbered child).
