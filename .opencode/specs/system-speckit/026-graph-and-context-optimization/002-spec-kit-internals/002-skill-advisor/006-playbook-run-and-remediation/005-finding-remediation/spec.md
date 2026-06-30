---
title: "Feature Specification: Skill Advisor Finding Remediation"
description: "Phase parent for remediating the 5 key findings from the system-skill-advisor playbook run (028), decomposed into 7 independently-shippable remediation phases backed by deep research."
trigger_phrases:
  - "skill advisor finding remediation"
  - "028 finding remediation"
  - "remediate skill advisor findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p0-remediation"
    recent_action: "6 of 7 phases complete; F4 bridge has a cold-env residual"
    next_safe_action: "Optional: close the F4 cold-env daemon-freshness residual"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-remediation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only. Heavy docs live in children. -->

# Feature Specification: Skill Advisor Finding Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (F4 cold-env residual) |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation |
| **Predecessor** | 028/004-shell-python-daemon (findings source) |
| **Successor** | None |
| **Handoff Criteria** | Each remediation phase validates; deep-research root cause + target files recorded; ready for /speckit:implement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 playbook run surfaced 5 key findings in the `system-skill-advisor` skill: a corpus accuracy regression, PC-005 bench failures + doc gap, semantic_shadow lane-weight doc drift, the OpenCode plugin bridge native-route fail-open, and a stale vitest path in two playbook scenarios. They were recorded but not remediated.

### Purpose
Deep-research each finding to a verified root cause (done — see `research/research.md`, investigated via cli-codex gpt-5.5 high across 5 iterations) and decompose remediation into independently-shippable phases, each with scope, approach, target files, and ordered tasks ready for `/speckit:implement`.

> **Phase-parent note:** This spec.md is the ONLY authored doc at this level. The deep-research packet lives in `research/`; per-phase plans/tasks live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phases 001-006 covering all 5 original findings (F1 split into metric-layer F1a + scorer-layer F1b).
- Phase 007: follow-up P1s surfaced during 002 (regression-harness alias-awareness + stale lane-weight-sweep packet path).
- Each phase: spec + plan + tasks + implementation summary, grounded in evidence.

### Out of Scope
- Executing the fixes (this packet specs them; implementation is the subsequent /speckit:implement pass).
- The infrastructure-gated SKIP scenarios from 028 (separate daemon-harness work).

### Files to Change
Authoring-only at this level; the remediation phases name their own target files (see each child plan + `research/resource-map.md`).

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `005-finding-remediation/00N-*/**` | Create | all | Per-finding remediation phase docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Remediation decomposition. Detail lives in the children; root cause + evidence live in `research/research.md`.

| Phase | Folder | Finding | Focus | Status |
|-------|--------|---------|-------|--------|
| 001 | `001-advisor-validate-alias-matching/` | F1a | Alias-aware gold matching in advisor_validate (recovers 50.78%→74.09% / 42.5%→65.0%) | Done (verified 2026-05-27) |
| 002 | `002-scorer-p0-routing-fixes/` | F1b | Model-B explicit-slash routing, code-mode disambiguation, low-info abstention — both scorers P0 12/12; corpus 45→62 (0 lost); TS↔Python parity | Done (verified 2026-05-27) |
| 003 | `003-pc005-bench-doc-and-gates/` | F2 | PC-005 `--dataset` doc + warm/cold p95 gate calibration | Done (verified 2026-05-27) |
| 004 | `004-semantic-shadow-doc-sync/` | F3 | Sync SC-004/SC-005 + feature-catalog + stale code comment to the live 0.05 lane | Done (verified 2026-05-27) |
| 005 | `005-opencode-bridge-native-route/` | F4 | Bridge direct compat import done+verified; daemon-freshness availability gate flagged (residual cold-env route:python) | Partial |
| 006 | `006-playbook-vitest-path-fix/` | F5 | Correct NC-004/NC-005 vitest invocation path | Done (verified 2026-05-27) |
| 007 | `007-harness-alias-and-stale-path/` | follow-up | Regression-harness alias-awareness (`deep-*` IDs) + stale lane-weight-sweep packet path | Done (verified 2026-05-27) |

### Phase Transition Rules
- Each phase passes `validate.sh` independently before implementation.
- Recommended implementation order: 006 → 004 → 003 → 001 → 005 → 002 (trivial → deepest).
- 001 and 002 both touch F1 but are independent (metric layer vs scorer layer).

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| research | phases | Root cause + target files verified per finding | research/research.md §3 |
| phases | implement | Each phase has scope + approach + tasks | validate.sh per child |
| 002-scorer-p0-routing-fixes | 007-harness-alias-and-stale-path | Out-of-scope P1s surfaced during 002 (alias drift + stale test path) recorded for follow-up | validate.sh per child |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- F1b: restore `mcp-code-mode` as a live route vs relabel `P0-UNC-002`? (resolved in phase 002)
- F2: cold-subprocess p95 budget needs host calibration; is PC-005 a smoke test or a perf cert? (resolved in phase 003)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Deep research**: `research/research.md` (root cause + remediation per finding), `research/resource-map.md` (target files)
- **Findings source**: `../004-shell-python-daemon/implementation-summary.md`
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json`
