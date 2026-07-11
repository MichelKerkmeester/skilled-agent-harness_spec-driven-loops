---
title: "Implementation Plan: Phase 3 — Surface Detection & Routing"
description: "Apply the code-opencode SKILL.md routing edits from research.md Deliverable 2B — Rust detection, RUST intent/resource, checklist registration, and the surface non-negotiable — re-anchored to live line numbers."
trigger_phrases:
  - "018 phase 003 plan"
  - "code-opencode routing plan rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/003-surface-routing"
    last_updated_at: "2026-07-11T09:56:28Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the seven code-opencode SKILL.md Rust routing edits"
    next_safe_action: "Mirror the RUST routing into the parent union (phase 004)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 — Surface Detection & Routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Target** | `code-opencode/SKILL.md` SMART ROUTING block |
| **Source** | `research.md` Deliverable 2B |
| **Output** | Detection rule, RUST intent + resource, CODE_QUALITY registration, surface non-negotiable |
| **Testing** | Child map self-consistency; existing-language routing unchanged |

### Overview
Add Rust to the surface router so a Rust task loads the trio and checklist. All edits re-anchored to live line numbers at apply time (research line refs are estimates).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 files exist (routed paths resolve)
- [ ] Current SKILL.md INTENT_SIGNALS/RESOURCE_MAP lines located

### Definition of Done
- [ ] Detection, RUST intent, RUST resource, and CODE_QUALITY registration added
- [ ] No existing-language routing regresses
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror an existing language entry (e.g. python) for the RUST intent/resource; keep detection surface-first, extension-first (`.rs`, then Cargo markers).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Detection
Add `.rs` + Cargo marker detection after surface selection.

### Phase 2: Routing
Add RUST INTENT_SIGNALS + RESOURCE_MAP; register the checklist under CODE_QUALITY; extend the human-facing reference map.

### Phase 3: Non-negotiable
Add the surface-wide Rust-preserves-the-TypeScript-contract rule.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Self-consistency: every routed RUST path exists (phase 002).
- Regression: existing language intents/resources unchanged.
- Full router-replay is exercised in phase 006.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002 (authored Rust files).
- `research.md` Deliverable 2B.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert the SKILL.md edits (single file); no other file changes in this phase.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2B)
