---
title: "Feature Specification: Routing Coverage — Deep Research"
description: "The 25-iteration deep-research pass that this 015 packet is built from: investigate how to fully integrate, enable-by-default, and verify the compiled skill-router, and dig for gaps beyond the four named ones. Ran 25 iterations with no early convergence across four models (10 SOL-high, 3 SOL-ultra, 5 TERRA-xhigh via cli-codex; 2 GLM-max, 5 MiniMax via cli-opencode), 1 codex parallel with 1 opencode. Output: 143 findings consolidated by a fresh-Opus synthesis (47 findings), adversarially verified by a Sonnet pass (all 8 spine claims CONFIRMED), reconciled into an orchestrator review that is the authoring brief for children 002-011."
trigger_phrases:
  - "compiled routing deep research"
  - "routing coverage research 25 iterations"
  - "compiled router synthesis verification"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Routing Coverage — Deep Research

## EXECUTIVE SUMMARY

A 25-iteration deep-research loop (no early convergence) investigating how to make the compiled skill-router perfectly integrated, enabled by default, and verified — and to surface gaps beyond the four named coverage gaps. The research reframed the whole program: default-on is a **structural no-op end-to-end** (the OpenCode bridge drops the compiled decision; the flag is stripped from both daemon env allowlists), so the load-bearing work is a **P0 activation foundation**, and the four named gaps are downstream. Outputs drive children 002-011.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete — 25/25 iterations, 143 findings; synthesis + adversarial verification + orchestrator review authored. |
| **Created** | 2026-07-20 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Blast radius** | Read-only research; no runtime change. Produced the authoring brief for the 015 implementation children. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The compiled skill-router is shipped but inert. A review found four coverage gaps (feature catalogs 0/24, benchmark legacy-only, manual playbooks 0/39, durable results 0 outside specs), and the operator asked to research how to close them, enable-by-default, and verify — plus dig for unnamed gaps — before committing to an implementation spec.

### Purpose

Produce a verified, ranked, actionable findings base that a phased implementation spec (015 children 002-011) can be authored from, with byte-identical/reversible invariants and the frozen scorer never touched.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 25 research iterations across four models with a fixed per-iteration model schedule and no early convergence.
- A fresh-Opus synthesis, a Sonnet adversarial verification, and an orchestrator reconciliation.
- Coverage of all seven workstreams (catalogs, benchmark, playbooks, archiving, activation, sk-code alignment, sk-doc templates) plus unnamed gaps.

### Out of Scope

- Any runtime, code, or MD change — [why] research only; implementation lives in children 002-011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/research/` | Create | Deep-research state (iterations, deltas, findings-registry, progress log) |
| `001-research/synthesis-v1.md` | Create | Fresh-Opus consolidation of 143 findings → 47 |
| `001-research/verification-v1.md` | Create | Sonnet adversarial verification (all 8 spine claims CONFIRMED) |
| `001-research/review-v1.md` | Create | Orchestrator reconciliation + authoring brief for 002-011 |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 25 iterations with the specified model mix and no early convergence. | 25 `iterations/iteration-NNN.md` + `deep-research-state.jsonl`; findings-registry non-empty; zero weak iterations. |
| REQ-002 | Synthesize into a ranked, deduplicated, actionable findings base. | `synthesis-v1.md` with per-workstream findings, unnamed gaps, a P0→P4 safety graph, and a child-spec breakdown. |
| REQ-003 | Adversarially verify the synthesis's load-bearing claims against live source. | `verification-v1.md` with per-claim CONFIRMED/REFUTED/UNCERTAIN and a verdict. |
| REQ-004 | Reconcile into an authoring brief. | `review-v1.md` with the verified spine, corrections, omissions, and the confirmed 002-011 breakdown. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 25/25 iterations completed with no early-convergence stop.
- **SC-002**: Synthesis + verification + review authored; verdict SPEC-READY-WITH-CORRECTIONS.
- **SC-003**: Every load-bearing claim distinguishes CONFIRMED (file:line) from INFERRED.
- **SC-004**: No recommendation edits the frozen scorer or changes a routing decision.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research findings contain hallucinated `file:line` | A spec built on a wrong citation | Sonnet adversarial verify re-checked ~50 citations against live source; treat registry lines as ±2-10, re-anchor on symbol |
| Dependency | The four models (SOL/TERRA via cli-codex; GLM/MiniMax via cli-opencode) | Research breadth | All authed + smoke-tested before the run |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-01**: Read-only — no runtime mutation during research.
- **NFR-02**: Canonical deep-research artifacts (state.jsonl, iterations/, findings-registry.json) in-tree, not `/tmp`.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A weak/0-finding iteration: none occurred (opencode iterations retried once on transient failure).
- Model-slug mismatch (MiniMax Token-Plan vs Direct API): caught by smoke-test, corrected to `minimax/MiniMax-M3` before the run.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 25 iterations + synthesis + verify + review; no code |
| Risk | 8/25 | Read-only; verification pass mitigates citation risk |
| Research | 18/20 | The entire packet is research |
| **Total** | **36/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking — the reconciled review (`review-v1.md`) resolves the contradictions the synthesis flagged (ADR-003 governance, the all-7-manifests-compiled-serving claim). Residual INFERRED items are flagged for verify-at-build-time in each child.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Synthesis**: `synthesis-v1.md`
- **Verification**: `verification-v1.md`
- **Orchestrator review / authoring brief**: `review-v1.md`
- **Raw research state**: `research/` (iterations, deltas, findings-registry, progress log)
- **Parent program**: `../spec.md`
