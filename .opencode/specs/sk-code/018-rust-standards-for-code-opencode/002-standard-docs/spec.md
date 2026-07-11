---
title: "Feature Specification: Phase 2 — Author the Rust Standard Docs"
description: "Author the five Rust standard documents for the code-opencode surface (style_guide, quality_standards, quick_reference, rust_checklist, and the 004 playbook entry) from the research.md Rust standard synthesis and template-conformance map. Content-only: no routing or registration wiring."
trigger_phrases:
  - "018 phase 002 rust standard docs"
  - "author rust trio code-opencode"
  - "rust checklist and playbook authoring"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/002-standard-docs"
    last_updated_at: "2026-07-11T09:32:39Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and wrote the five Rust standard docs for code-opencode"
    next_safe_action: "Wire Rust surface routing in code-opencode/SKILL.md (phase 003)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Author the Rust Standard Docs

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
| **Predecessor** | 001-research |
| **Successor** | 003-surface-routing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research produced a complete Rust standard (section skeletons, consolidated rules, the four repo non-negotiables) but nothing is authored yet. Routing added in later phases has no real targets to point at until these files exist.

### Purpose
Author the five Rust documents so the `code-opencode` surface carries conformant Rust guidance, matching the structure and tone of the existing TypeScript/Python/shell trios.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the Rust reference trio, the checklist, and the playbook entry from `research.md` Deliverable 1 (Rust standard synthesis) and Deliverable 3 (template-conformance map).
- Carry the four non-negotiables (interop boundary is a stability contract; byte-for-byte determinism/parity; no unsafe without a documented invariant + test; panics are never boundary errors), each naming the contract it protects.
- Match the section skeletons and directive tone of the existing language trios.

### Out of Scope
- Any `SKILL.md`, routing, parent-hub, drift-guard, or verifier edits (phases 003–005).
- Writing Rust, scaffolding a crate, or live benchmarking.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-opencode/references/rust/style_guide.md` | Create | Idioms, API design, error handling, module/workspace layout |
| `.opencode/skills/sk-code/code-opencode/references/rust/quality_standards.md` | Create | P0/P1/P2 quality rules: lint tiers, testing/parity, determinism, unsafe, supply-chain |
| `.opencode/skills/sk-code/code-opencode/references/rust/quick_reference.md` | Create | Compact recipes, templates, gate command sequence |
| `.opencode/skills/sk-code/code-opencode/assets/checklists/rust_checklist.md` | Create | P0/P1/P2 checkboxes with the evidence discipline of the TS checklist |
| `.opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/004-rust-standards.md` | Create | Rust standards routing scenario (intent RUST) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rust trio authored | The three `references/rust/*.md` files exist with the section skeletons from `research.md` Deliverable 1 and the four non-negotiables |
| REQ-002 | Checklist authored | `rust_checklist.md` exists with P0/P1/P2 checkboxes and a review-evidence template, mirroring `typescript_checklist.md` |
| REQ-003 | Playbook entry authored | `004-rust-standards.md` exists with `expected_intent: RUST` and the Rust `expected_resources` trio |
| REQ-004 | Template conformance | Each file matches the section-skeleton/placement map in `research.md` Deliverable 3 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five files exist and read as a coherent Rust standard.
- **SC-002**: Every non-negotiable names the parity/interop contract it protects.
- **SC-003**: No routing/registration file is touched in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generic Rust prose that ignores the interop/parity framing | Low-value docs | Author strictly from `research.md`, which is weighted to the framing invariant |
| Dependency | `research.md` Deliverables 1 + 3 | No content source | Present in `001-research/research/research.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Exact prose depth per file resolves during authoring against the conformance map.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Manifest**: ../001-research/research/research.md (Deliverables 1 + 3)
- **Successor**: ../003-surface-routing/
