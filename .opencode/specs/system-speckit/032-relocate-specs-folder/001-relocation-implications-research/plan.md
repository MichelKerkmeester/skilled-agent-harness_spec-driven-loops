---
title: "Implementation Plan: Relocation Implications Research"
description: "Dispatch and run a dual-executor deep-research loop (cli-devin GLM-5.2 High, cli-cursor Grok 4.5 High), 10 iterations each, then read the synthesized findings."
trigger_phrases:
  - "relocation research plan"
  - "dual executor deep research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/001-relocation-implications-research"
    last_updated_at: "2026-08-06T13:28:45Z"
    last_updated_by: "claude-code"
    recent_action: "Both lineages ran; grok converged clean, glm needed a sandboxMode retry"
    next_safe_action: "Read research/research.md before scoping phase 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Relocation Implications Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A — research phase, no code changes |
| **Framework** | `system-deep-loop` / `deep-research` (`/deep:research:auto`), CLI fan-out via `cli-devin` and `cli-cursor` |
| **Storage** | `research/deep-research-state.jsonl`, `research/lineages/<label>/`, `research/research.md` |
| **Testing** | Deep-research convergence + quality guards (source diversity, focus alignment, no single-weak-source) |

### Overview
Dispatch `/deep:research:auto` against this phase folder with two CLI lineages running in parallel — `cli-devin` at `--model=glm-5-2` and `cli-cursor` at `--model=cursor-grok-4.5-high` — each capped at 10 iterations, then read the synthesized `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Both target CLIs (`devin`, `cursor-agent`) confirmed on PATH
- [x] Model tiers resolved against each CLI's enforced allowlist (GLM-5.2 High = `glm-5-2` on cli-devin; Grok 4.5 High = `cursor-grok-4.5-high` on cli-cursor, since neither CLI exposes a Grok "Max" tier)

### Definition of Done
- [x] Both lineages complete (grok converged at iteration 6; glm converged at iteration 5 after a sandboxMode retry — see plan.md Phase 2 for the glm failure/retry story)
- [x] `research/research.md` synthesized with source-cited findings from both lineages, including a reconciled disagreement (glm: proceed via back-symlink flip; grok: conditional-go behind a coordinated cutover) and 3 discovery-layer literals grok found that glm's lineage never inspected
- [x] `validate.sh --recursive --strict` on the parent packet passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized, fresh-context-per-iteration research loop, fanned out across two independent CLI lineages that converge independently (not a shared conversation).

### Key Components
- **Lineage `glm`**: `cli-devin` executor, model `glm-5-2` (GLM-5.2 High), writes to `research/lineages/glm/`
- **Lineage `grok`**: `cli-cursor` executor, model `cursor-grok-4.5-high`, writes to `research/lineages/grok/`
- **Synthesis step**: the `/deep:research` YAML workflow merges both lineages into the canonical `research/research.md`

### Data Flow
Each lineage runs its own iterate → write iteration markdown → append JSONL delta → convergence-check loop, isolated from the other. When both lineages stop (converged or `max-iterations`), the workflow synthesizes across both into one `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase spec folder scaffolded and validated
- [x] CLI auth pre-flight (`devin auth status`, `cursor-agent about`)
- [x] Model tiers resolved and confirmed with the operator (Grok "Max" does not exist; using `cursor-grok-4.5-high`)

### Phase 2: Dispatch & Loop
- [x] Ran `fanout-run.cjs` directly (the same runtime `/deep:research:auto` delegates to for multi-executor dispatch) with both lineages, `--concurrency=2`
- [x] grok converged at iteration 6 (`all_questions_answered`) on the first dispatch
- [x] glm's first dispatch failed instantly (Devin org policy blocks `--sandbox`'s forced autonomous mode); reproduced the root cause directly, got operator approval, retried with `sandboxMode: danger-full-access` (no `--sandbox`) — converged at iteration 5

### Phase 3: Synthesis & Review
- [x] `research/research.md` synthesized from both lineages, with 10/10 spot-checked citations independently re-verified against the actual files
- [ ] Operator reviews the ranked implications and recommendation before scoping phase 002
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence quality guards | Source diversity, focus alignment, no single-weak-source | Deep-research workflow (built-in, blocking before STOP) |
| Structural | Phase-folder shape after dispatch | `validate.sh --recursive --strict` |
| Manual | Findings review | Operator reads `research/research.md` before phase 002 is scoped |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `devin` CLI + Devin account OAuth | External | Green (confirmed via `devin auth status`) | GLM lineage cannot dispatch |
| `cursor-agent` CLI + Cursor account OAuth | External | Green (confirmed via `cursor-agent about`) | Grok lineage cannot dispatch |
| `system-deep-loop` / `deep-research` runtime | Internal | Green | No fan-out execution path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Operator wants to stop the research loop early, or a lineage is stuck/unrecoverable.
- **Procedure**: No code or path changes exist to revert — this phase only writes into its own `research/` state. Kill the dispatched lineage process(es) by their captured PID (per `cli-devin`/`cli-cursor` single-dispatch discipline); the phase folder and parent packet are unaffected.
<!-- /ANCHOR:rollback -->
