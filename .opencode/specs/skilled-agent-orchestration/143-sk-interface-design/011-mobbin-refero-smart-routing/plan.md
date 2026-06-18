---
title: "Implementation Plan: Phase 11: mobbin-refero-smart-routing [template:level_1/plan.md]"
description: "Plan to add a hybrid initiative/ask decision gate for the Mobbin/Refero reference MCPs in sk-interface-design."
trigger_phrases:
  - "mobbin refero routing plan"
  - "design reference decision gate plan"
  - "phase 011 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/011-mobbin-refero-smart-routing"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added the hybrid initiative/ask decision gate for Mobbin/Refero"
    next_safe_action: "Strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/design-grounding/design_references_mcp.md"
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mobbin-refero-smart-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: mobbin-refero-smart-routing

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs |
| **Framework** | OpenCode skill contract; Code Mode for Mobbin/Refero |
| **Storage** | `.opencode/skills/sk-interface-design/` |
| **Testing** | Read-through of the gate; `validate.sh --strict` |

### Overview
Add a decision procedure the skill runs at the critique step: judge whether a real-world reference helps (convention-heavy category), then take the initiative, ask, or fall back, and pick Mobbin vs Refero by surface. The logic lives in the owner doc; SKILL.md surfaces it in routing and rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (strict validate)
- [x] Docs updated (gate + SKILL.md + changelog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A decision gate at STEP 2 (critique), layered onto the existing one-reference critique-against flow, defaulting toward asking when unsure to respect paid/remote calls.

### Key Components
- **Category taxonomy**: convention-heavy categories where a real-world default is worth naming
- **Initiative/ask/fall-back gate**: the hybrid autonomy
- **Source pick**: Mobbin (app/iOS) vs Refero (web/styles)
- **SKILL.md surface**: resource row INITIATIVE/ASK + ALWAYS rule 7

### Data Flow
After grounding, the skill classifies the brief's category, decides initiative vs ask vs fall back, optionally pulls one reference, names the default, and proceeds with the existing deviate-and-keep-the-floor steps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate
- [x] Add the "Deciding whether to consult" gate to design_references_mcp.md §3 (taxonomy + initiative/ask/fall-back + source pick)
- [x] Add the §1 pointer to the gate

### Phase 2: Surface
- [x] Reframe the SKILL.md §2 resource row to INITIATIVE/ASK
- [x] Add SKILL.md §4 ALWAYS rule 7

### Phase 3: Verify
- [x] Version bump + changelog; strict-validate; reconcile parent map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Readability | The gate is explicit and actionable | Manual read of §3 + SKILL.md |
| Guardrails | One-reference/no-chooser/read-live preserved | grep the hard rules in design_references_mcp.md |
| Structure | Phase validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010 decouple | Internal | Green | design_references_mcp already generalized |
| Mobbin/Refero tool catalogs | Internal | Green | Unchanged; the gate references them |
| Code Mode | Tooling | Green | The invocation path for the references |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The initiative proves too eager or the gate confuses the flow.
- **Procedure**: Revert the §3 gate + SKILL.md edits from git; the prior ON_DEMAND behavior returns. Documentation-only, fully reversible.
<!-- /ANCHOR:rollback -->
