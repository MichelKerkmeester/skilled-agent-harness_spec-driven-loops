---
title: "Feature Specification: GPT Behavioral Hardening — Follow-Up Research"
description: "Deep-research follow-up investigating real-world GPT-backed OpenCode deep-loop symptoms after phases 002-005: ai-council subagent-only conversion, orchestrate hardening v2, a sub-agent-enforcement plugin, a GPT-vs-Claude benchmark, and the 006/FIX-5 unpark decision."
trigger_phrases:
  - "gpt behavioral hardening"
  - "ai-council subagent only"
  - "orchestrate hardening v2"
  - "gpt vs claude benchmark"
importance_tier: "critical"
contextType: "research"
predecessor_research: "../001-deep-agent-router-and-orchestration/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research"
    last_updated_at: "2026-07-01T05:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phases 008-013 drafted from §4 breakdown"
    next_safe_action: "Implement phase 008 per its plan.md/tasks.md"
    blockers: []
    key_files:
      - "research-prompt.md"
      - "research/research.md"
      - "../goal-prompt.md"
      - "../005-gpt-verification-smoke/spec.md"
      - "../006-host-hard-identity-fix5/decision-record.md"
      - "../008-mode-d-ai-council-identity-fix/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-007-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Confirm a genuine OPENCODE_PID-free external shell exists before starting phase 012 (research.md §5)."
      - "glm-critical's reproducible stall (GLM quota exhaustion) is worth a follow-up on the deep-research runtime's failure detection, independent of this packet."
    answered_questions:
      - "Does GLM-5.2's --variant/--reasoning map to max thinking as expected? Confirmed yes (126 vs 67 reasoning tokens, max vs high)."
      - "Is the ai-council route-proof validator a guaranteed FAIL? No -- corrected in round 2: it passes on non-canonical values that disagree with the registry (research.md §2)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: GPT Behavioral Hardening — Follow-Up Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (research) — see `research/research.md` for the consolidated synthesis and recommended phase 008-012 breakdown |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../005-gpt-verification-smoke/` (inconclusive acceptance-gate result) + `../006-host-hard-identity-fix5/` (parked, interim) |
| **Successor** | TBD — this research's own synthesis proposes the next phase breakdown |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 002-004 landed and were independently re-verified as code-complete. Phase 005 (the GPT verification smoke, the packet's acceptance gate) never reached a clean pass or a clean disproof — every command-owned smoke was blocked upstream (`cli-opencode` self-invocation guard) before real leaf-dispatch behavior could be observed. Phase 006 (host hard identity / FIX-5) stayed parked on that inconclusive result. Independently, the operator now reports the same underlying symptom class persisting in real-world OpenCode usage: slow `@orchestrate`, wrong sub-agent invocation, stuck pre-defined flows, and GPT overthinking/needing literal instructions. This is corroborating evidence that the agent-layer fix (002-004) has not been proven sufficient.

### Purpose

Investigate what's still needed to make GPT-backed OpenCode behave reliably for deep-loop dispatch: decisive smoke evidence, `ai-council` subagent-only conversion, `@orchestrate` hardening to match `deep.md`'s determinism, a sub-agent-enforcement plugin, a GPT-vs-Claude behavioral benchmark, and a real (not just criterion-restated) FIX-5 unpark decision. Full question set: `research-prompt.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

See `research-prompt.md` §3 (KQ1-KQ9).

### Out of Scope

- Implementing any code changes (this is a research-only phase; implementation is deferred to whatever phase(s) this research's synthesis proposes).
- Re-deriving the original mis-route root-cause taxonomy or route-proof validator mechanics (already established in phases 001-002).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Deep-research synthesis (via `/deep:research`) |
| `research/iterations/*.md` | Create | Per-iteration research state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research charter executed | `/deep:research` runs >=30 iterations against `research-prompt.md`, GLM-5.2 max-thinking + GPT-5.5 high-fast lineages, without early convergence |
| REQ-002 | All KQs answered | KQ1-KQ9 each have an evidence-backed recommendation with file:line citations |
| REQ-003 | Phase breakdown proposed | Synthesis proposes concrete next phase(s) (numbering continuing from 007) for implementable recommendations |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research runs to >=30 iterations without stopping early on a shallow convergence signal.
- **SC-002**: KQ9 (FIX-5 unpark decision) produces a clear decision criterion distinct from — and more decisive than — phase 006's existing (already-inconclusive) trigger language.
- **SC-003**: `validate.sh --strict` passes on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | GLM-5.2 `--variant`/`reasoning_effort` mapping is unverified | Research may not actually run at "max thinking" | Smoke-test one call before the full 30-iteration launch (per `sk-prompt-models/references/models/glm-5.2.md`) |
| Risk | `antiConvergence.minIterations` defaults to 3, locked field in the optimizer manifest | Research could converge well before 30 iterations despite `--max-iterations=30` | Explicitly raise `minIterations` (or set `convergenceMode`) in this run's own `deep-research-config.json` after init, before iteration 1 |
| Dependency | Phase 005/006 evidence | Research must cite, not re-derive | `../005-gpt-verification-smoke/`, `../006-host-hard-identity-fix5/decision-record.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions` and `research-prompt.md` §8 pre-launch checklist.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research charter**: `research-prompt.md`
- **Goal / session objective**: `../goal-prompt.md`
- **Predecessor phases**: `../005-gpt-verification-smoke/`, `../006-host-hard-identity-fix5/`
- **Parent Spec**: `../spec.md`
