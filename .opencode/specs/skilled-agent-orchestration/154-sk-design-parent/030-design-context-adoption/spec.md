---
title: "Feature Specification: adopt the sk-design context-loading contract"
description: "Level-1 build phase implementing the converged 029 deep-research recommendations: an enforceable sk-design context-loading contract wired across the live design + dispatch skills (shared contract + cards, hub bundle rule, mode SKILL hooks, a contrast-pair worksheet, a cli-opencode design dispatch template, a MiniMax-M3 design-task variant, and manual-test cases for the four observed misses). Implemented by four cli-codex gpt-5.5 agents and verified by a fresh opus reviewer aligned to sk-doc."
trigger_phrases:
  - "sk-design context contract adoption"
  - "design context loading build"
  - "adopt context manifest sk-design"
  - "context loading contract implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/030-design-context-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + opus-verified the context-loading contract across 18 files"
    next_safe_action: "Optional follow-ups: stale template-count cleanup; executable router auto-load"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../029-design-context-loading/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-030-design-context-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The contract is wired via shared vocabulary + bundle routing + proof-field cards + dispatch templates + playbook tests, reinforcing existing mode language rather than duplicating it"
      - "Per-mode executable router auto-load of the contract is intentionally deferred (research §17 open question)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: adopt the sk-design context-loading contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This build phase implements the converged recommendations of the sibling research phase `029-design-context-loading` (research §15–16): a small, enforceable context-loading contract that stops design/UI work — by the orchestrator, dispatched sub-agents, or small models — from under-loading the sk-design register/dials, foundations contrast discipline, audit contract, and interface pre-flight. It was implemented by four file-disjoint cli-codex `gpt-5.5` @ high agents and verified by a fresh opus reviewer aligned to `sk-doc`.

**Key Decisions**: reinforce existing mode language rather than duplicate it; keep changes additive (no router/anchor edits); defer per-mode executable auto-load of the contract to a later packet (research §17).

**Critical Dependencies**: the live `sk-design` hub + five modes + shared register, `cli-opencode`, `sk-prompt-models` (MiniMax-M3 profile), and the `029` research as the spec.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../029-design-context-loading/spec.md (research) |
| **Type** | Build (adopts research recommendations) |
| **Handoff Criteria** | The contract + cards + worksheet + SKILL hooks + dispatch template + MiniMax-M3 variant + four playbook scenarios exist and validate; smart-router blocks + anchors intact; cross-refs resolve; opus verification recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Research `029` proved the recurring design misses (skipped register, late contrast → a WCAG-AA P1, ad-hoc audit instead of the pre-flight card, thinnest context to a small model) come from missing *proof fields*, not from agents needing to "read more." The strong context lived in always-load and conditional resources but nothing forced it to be loaded and proven, especially under delegation.

### Purpose
Wire the research's enforceable contract into the live skills so the right context is loaded and proven for design/UI build work — across the orchestrator, sub-agents, and small models — with additive, low-risk edits and manual-test coverage for the four misses.

> **Phase note:** the spec is the `029` research; this phase is its build/adoption sibling (mirroring the 022→023 pattern).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shared: `context_loading_contract.md` + `assets/context_loaded_card.md` + `assets/proof_of_application_card.md`.
- Hub + mode hooks: a build/UI bundle rule in `sk-design/SKILL.md`; reinforced load-and-prove loops in interface/foundations/audit SKILLs; `design-foundations/assets/contrast_pair_inventory.md`.
- Dispatch: a design/UI dispatch template in `cli-opencode/assets/prompt_templates.md`; a Design-Task variant in `sk-prompt-models/.../minimax-m3.md`.
- Manual-test scenarios for the four misses across four playbooks.

### Out of Scope
- Per-mode executable router auto-load of the contract (research §17 — later packet).
- The pre-existing stale "13-template" inventory in cli-opencode (separate cleanup).
- Any non-listed file; any change to mode workflows beyond additive hooks.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/shared/context_loading_contract.md` + 2 cards | Created | The contract + pre/post cards |
| `sk-design/design-foundations/assets/contrast_pair_inventory.md` | Created | Contrast-pair worksheet |
| `sk-design/SKILL.md`, interface/foundations/audit `SKILL.md` | Edited | Additive bundle rule + load-and-prove hooks |
| `cli-opencode/assets/prompt_templates.md`, `sk-prompt-models/.../minimax-m3.md` | Edited | Design dispatch template + MiniMax-M3 variant |
| 4 `manual_testing_playbook/` trees | Edited/Created | Four miss scenarios + index rows |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Spec-folder wrapper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The contract + cards + worksheet exist and are coherent | The four proof fields match research §6–9; the gate table matches §12 |
| REQ-002 | No router/anchor/frontmatter damage | Each edited SKILL.md keeps its smart-router blocks + anchors; edits are additive |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cross-references resolve | Every cited path (cards, contract, audit_contract, oklch_workflow, promotion gate) exists |
| REQ-004 | Dispatch contracts carry the manifest | Template + MiniMax-M3 variant carry the manifest + four proof fields + the two cards |
| REQ-005 | The four misses have manual-test coverage | One scenario per playbook, validating the guard fires |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 files pass `sk-doc` `validate_document.py` (0 issues each); the smart-router blocks + anchors of the edited SKILLs are intact.
- **SC-002**: A fresh opus reviewer confirms coherence + cross-refs + sk-doc alignment (verdict recorded), and the four playbook scenarios test the four observed misses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Additive edits damage a smart-router block | A design mode stops routing | Additive-only rule; independent + opus re-check confirmed intact |
| Risk | Contract duplicates mode content | Drift between sources | Reinforce-and-cite, not restate; opus verified no duplication |
| Dependency | `029` research | No spec to build from | Converged research.md is the spec |
| Dependency | cli-codex `gpt-5.5` executor | Agents cannot run | Validated; `gpt-5.5` @ high used (the `-fast`/`-codex` variants are unavailable on this Codex) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Implementation complete. Deferred (research §17, by design): whether the contract should also be wired into the per-mode executable router auto-load, and whether contrast-pair checking should be backed by a deterministic script. Two non-blocking residuals remain for optional cleanup: the pre-existing stale "13-template" inventory in cli-opencode, and the cosmetic placement of the new design dispatch template after the file's RELATED RESOURCES section.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Spec (research)**: `../029-design-context-loading/research/research.md`
- **Sibling research→adoption precedent**: `../022-mifb-design-research/` → `../023-mifb-design-adoption/`
- **Target skills**: `.opencode/skills/sk-design/`, `.opencode/skills/cli-opencode/`, `.opencode/skills/sk-prompt-models/`
