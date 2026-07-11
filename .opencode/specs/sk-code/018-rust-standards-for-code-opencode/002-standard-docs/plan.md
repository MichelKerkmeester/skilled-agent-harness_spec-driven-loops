---
title: "Implementation Plan: Phase 2 — Author the Rust Standard Docs"
description: "Author the Rust reference trio, checklist, and playbook entry from the research.md Rust standard synthesis and template-conformance map, matching the existing language trios; content-only, no routing wiring."
trigger_phrases:
  - "018 phase 002 plan"
  - "rust standard docs plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2 — Author the Rust Standard Docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-code` / `code-opencode` language standards |
| **Source** | `research.md` Deliverable 1 (Rust standard synthesis) + Deliverable 3 (conformance map) |
| **Output** | 5 new markdown files (Rust trio + checklist + playbook) |
| **Testing** | Structural conformance to the TS/Python/shell trios; no routing yet |

### Overview
Author the five Rust documents directly from the research synthesis, preserving the section skeletons, directive tone, and the four repo non-negotiables. This phase writes content only; routing and registration are phases 003–005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `research.md` Deliverables 1 + 3 available
- [ ] Existing TS/Python/shell trios read as structural references

### Definition of Done
- [ ] All five files exist with the research section skeletons
- [ ] Each non-negotiable names the parity/interop contract it protects
- [ ] No routing/registration file touched
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc-authoring only. Each file mirrors its sibling in an existing language trio: `style_guide.md` (idioms/API/layout), `quality_standards.md` (P0/P1/P2 policy), `quick_reference.md` (recipes/commands), `rust_checklist.md` (checkboxes + evidence), and the playbook scenario (`004-rust-standards.md`).

### Key Decision
Interop/build content lives in the Rust trio, not a new shared file; only language-neutral parity vocabulary belongs in `references/shared/` (per research.md Deliverable 3).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trio
Author `style_guide.md`, `quality_standards.md`, `quick_reference.md` from Deliverable 1.

### Phase 2: Checklist
Author `rust_checklist.md` (P0/P1/P2 + review-evidence template), mirroring `typescript_checklist.md`.

### Phase 3: Playbook
Author `004-rust-standards.md` with `expected_intent: RUST` and the Rust `expected_resources`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Conformance: each file matches the section-skeleton/placement map in Deliverable 3.
- Cross-check: non-negotiables present and each names its contract.
- No router/verifier runs in this phase (they arrive in 003–006).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `research.md` Deliverables 1 + 3 (content source).
- Existing `code-opencode` trios (structural template).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This phase only creates new files; rollback is deleting the five new files. No existing file is modified.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: spec.md
- **Manifest**: ../001-research/research/research.md
