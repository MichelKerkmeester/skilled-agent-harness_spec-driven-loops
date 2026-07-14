---
title: "Feature Specification: MiniMax 2.7 efficiency deep-research"
description: "Deep-research charter: how to best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API, producing concrete deltas for sk-prompt-models and cli-opencode."
trigger_phrases:
  - "minimax efficiency deep research"
  - "minimax-2.7 best use research"
  - "cli-opencode minimax optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed 10-iteration deep-research loop"
    next_safe_action: "Open a follow-on packet to apply research.md P0/P1 deltas"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-minimax-efficiency-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: minimax-efficiency-deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-minimax-provider-integration |
| **Successor** | None |
| **Handoff Criteria** | Loop converges or hits 10 iterations; `research/research.md` + `resource-map.md` exist; follow-on delta list captured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the MiniMax 2.7 direct-API provider optimization for cli-opencode and sk-prompt-models specification.

**Scope Boundary**: Research + synthesis ONLY. The loop produces findings and a follow-on delta list; it does NOT implement the deltas (a later packet acts on `research.md`). Bounded mutations to this folder's `spec.md` findings fence are allowed per the deep-research contract.

**Dependencies**:
- Phase 001 complete (the `minimax` provider must exist for research to reference the real config)
- 114's reusable infra as the extension target: `model-profiles.json`, context-budget engine, output-verification pipeline, quota-fallback, permissions matrix, pattern-index

**Deliverables**:
- `research/research.md` (17-section consolidated output) + `research/resource-map.md`
- Concrete delta list: proposed `sk-prompt-models` pattern-index rows + cli-opencode budget/verification/`--variant` recommendations for MiniMax 2.7

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 001 wires the `minimax` provider, we still have no guidance for using MiniMax 2.7 efficiently through cli-opencode: no context-budget tuple, no output-verification recipe, no prompt-quality / `--variant` mapping, no routing heuristics vs the other small models. Without this, MiniMax 2.7 is selectable but not optimized.

### Purpose
A converged research output (`research.md`) plus a concrete delta list that tells us exactly how to update `sk-prompt-models` and `cli-opencode` to make best use of MiniMax 2.7 via the direct API.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 10-iteration deep-research loop (executor cli-codex gpt-5.5, high reasoning, fast tier, :auto)
- Research questions: MiniMax-2.7 context-budget defaults; output-verification recipe; prompt-quality / RCAF patterns; `--variant`/reasoning-effort mapping for `minimax`; quota-pool + fallback wiring; permissions-matrix applicability; cost/latency profile; routing heuristics vs deepseek/qwen/glm
- Synthesis into `research.md` + a follow-on delta list

### Out of Scope
- Implementing the deltas (separate follow-on packet) - keeps research and implementation cleanly separable
- Re-researching small-model patterns already settled by 114 - extend, don't redo

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-minimax-efficiency-deep-research/research/**` | Create | Loop state: `deep-research-state.jsonl`, `deltas/`, `iterations/iteration-NNN.md`, `research.md`, `resource-map.md` |
| `002-minimax-efficiency-deep-research/spec.md` | Modify | Bounded findings-fence writeback at synthesis (per deep-research contract) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the loop to convergence or 10 iterations | `deep-research-state.jsonl` has up to 10 iteration records; stop reason logged (converged/max_iterations) |
| REQ-002 | Produce a consolidated research output | `research/research.md` exists with the standard sections; `resource-map.md` emitted at convergence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture an actionable delta list | `research.md` ends with concrete proposed edits to `sk-prompt-models` + `cli-opencode` for a follow-on packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Loop reaches a clean stop (converged at newInfoRatio ≤ 0.05 or 10 iterations) with all quality gates satisfied
- **SC-002**: `research.md` answers the in-scope research questions and lists concrete, file-level deltas for the follow-on implementation packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex gpt-5.5 (fast tier) executor | Med — loop cannot run without it | codex CLI is authed via ChatGPT OAuth; read cli-codex SKILL.md before dispatch |
| Risk | Thin public info on MiniMax 2.7 → low-confidence findings | Med | `--search`-enabled research; flag UNKNOWNs explicitly; lean on transferable small-model patterns from 114 |
| Risk | Loop fails to converge in 10 iters | Low | Hard cap at 10; partial findings still produce a usable delta list |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How much reliable public data exists on MiniMax 2.7's API (context window, pricing, reasoning controls)? (Determines finding confidence.)
- Should MiniMax 2.7 become a default for any task class, or remain opt-in until usage data accumulates? (Routing-heuristic output.)
<!-- /ANCHOR:questions -->

---

## 8. DEEP-RESEARCH FINDINGS

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Deep-research loop complete: 10 iterations (cli-codex gpt-5.5 high/fast), stop reason maxIterationsReached, newInfoRatio 0.92 → 0.12. All 5 questions answered at patch-planning level. Canonical synthesis: `research/research.md`.

**Outcome:** MiniMax 2.7 = 204,800-token, native-tool, separate-pool (`minimax-api`, fail-fast) direct provider. Best-use work is docs/metadata/routing extending 114 infra — no MiniMax-specific runtime logic. 143,360 active budget under the 70% rule; omit `--variant` until a live ablation proves it.

**Prioritized deltas for the follow-on packet** (full detail in research.md §10):
- P0: `model-profiles.json` (context_length 204800); `per-model-budgets.json` (minimax row); `cli-opencode/references/context-budget.md` (window/active-budget table); `cli_reference.md` (`--variant` omit-by-default + direct-provider subsection).
- P1: `cli-opencode/SKILL.md` routing table; `cli_prompt_quality_card.md` budget-awareness table; `sk-prompt-models/SKILL.md` dispatch matrix; `pattern-index.md` three link-only MiniMax rows.
- P2 (optional, needs live key): `--variant` ablation playbook.

**Runtime-deferred (needs `MINIMAX_API_KEY`):** exact slug casing, real `--variant` behavior, latency envelope, RPM/TPM error shapes, live pricing.
<!-- END GENERATED: deep-research/spec-findings -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
