---
title: "Feature Specification: Phase 3 — Surface Detection & Routing"
description: "Wire Rust into the code-opencode surface SKILL.md: .rs plus Cargo.toml/Cargo.lock detection, a RUST INTENT_SIGNALS entry, a RUST RESOURCE_MAP pointing at references/rust/*, CODE_QUALITY registration of rust_checklist.md, the human-facing reference map, and a surface-wide Rust non-negotiable."
trigger_phrases:
  - "018 phase 003 surface routing"
  - "code-opencode skill.md rust detection"
  - "rust intent signals resource map"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — Surface Detection & Routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 002-standard-docs |
| **Successor** | 004-parent-union-drift-guard |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `code-opencode/SKILL.md` surface router does not detect Rust files or route a RUST intent, so even with the Rust docs authored (phase 002) nothing selects them.

### Purpose
Add Rust detection and routing to the surface SKILL.md so a Rust task loads the Rust trio and checklist, consistent with how the other languages are wired.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Detection: `.rs` selects Rust; local `Cargo.toml`/`Cargo.lock` are fallback markers after the OpenCode surface is established.
- A `RUST` `INTENT_SIGNALS` entry (weight 1) with the keyword list from `research.md` Deliverable 2B.
- A `RUST` `RESOURCE_MAP` entry pointing at `references/rust/{style_guide,quality_standards,quick_reference}.md`.
- Register `rust_checklist.md` under `CODE_QUALITY`; add Rust to the human-facing reference map.
- Add the surface-wide Rust non-negotiable line (Rust preserves the TypeScript contract).

### Out of Scope
- The parent-hub union in `smart_routing.md` (phase 004).
- The six registration touchpoints and the multi-language routing change (phase 005).
- Authoring the Rust docs (phase 002).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-opencode/SKILL.md` | Modify | Detection rule, RUST intent + resource map, CODE_QUALITY registration, reference map, surface non-negotiable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detection added | A `.rs` file (or Cargo marker after surface detection) selects Rust in SKILL.md |
| REQ-002 | RUST intent + resource added | `INTENT_SIGNALS` has a RUST entry; `RESOURCE_MAP` routes RUST to the three `references/rust/*` files |
| REQ-003 | Checklist registered | `rust_checklist.md` is listed under `CODE_QUALITY` and the human-facing inventory |
| REQ-004 | Line anchoring | Each edit is re-anchored to current SKILL.md line numbers (research line refs are estimates) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Rust prompt routes to the Rust trio; the checklist resolves under CODE_QUALITY.
- **SC-002**: The child RESOURCE_MAP stays internally consistent (every routed path exists after phase 002).
- **SC-003**: No existing language routing regresses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing at stale research line numbers | Wrong-place edits | Re-anchor to live SKILL.md lines at apply time |
| Dependency | Phase 002 files exist | Routed paths would be dangling | Sequence 003 after 002 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final RUST keyword list is drafted in `research.md` Deliverable 2B; confirm no collision with existing intents during apply.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2B)
- **Predecessor**: ../002-standard-docs/ · **Successor**: ../004-parent-union-drift-guard/
