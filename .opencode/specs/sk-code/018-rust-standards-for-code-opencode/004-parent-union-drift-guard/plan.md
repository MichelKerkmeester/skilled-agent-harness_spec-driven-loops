---
title: "Implementation Plan: Phase 4 — Parent-Hub Union & Drift Guard"
description: "Apply the parent-hub union edits in shared/references/smart_routing.md (re-prefixed RUST resource entry, parent CODE_QUALITY, intent, overlay) and make the sk-code-router-sync drift-guard vitest pass."
trigger_phrases:
  - "018 phase 004 plan"
  - "parent union drift guard plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/004-parent-union-drift-guard"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase plan from the 018 research manifest"
    next_safe_action: "Apply the smart_routing.md union edits, then run the drift guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4 — Parent-Hub Union & Drift Guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Target** | `shared/references/smart_routing.md` (parent union) |
| **Source** | `research.md` Deliverable 2C + Gate 1 |
| **Guard** | `sk-code-router-sync.vitest.ts` |
| **Testing** | Drift-guard vitest exits 0 |

### Overview
Mirror the child RUST map into the parent union with exactly one `code-opencode/` prefix, add parent CODE_QUALITY + intent + overlay, and prove the drift guard green. The union is in `smart_routing.md`, not `sk-code/SKILL.md` (charter correction).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 child RUST map exists
- [ ] `smart_routing.md` RESOURCE_MAP + intent block located

### Definition of Done
- [ ] Parent RUST union + CODE_QUALITY + overlay added
- [ ] `sk-code-router-sync.vitest.ts` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent map equals the set union of child maps (re-prefixed) plus the fixed parent-owned allowlist. The checklist belongs under CODE_QUALITY, not RUST, because the guard compares resources per intent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Union
Add the re-prefixed RUST resource entry and parent CODE_QUALITY.

### Step 2: Intent + overlay
Add the parent RUST intent and human-facing overlay row.

### Step 3: Guard
Run the drift-guard vitest; resolve any orphan/missing-projection finding.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Drift guard: `npx vitest run .../sk-code-router-sync.vitest.ts` exits 0.
- Equality: parent resources equal the re-prefixed child union plus the allowlist.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 003 (child RUST map).
- `research.md` Deliverable 2C + Gate 1.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert the `smart_routing.md` edits (single file); the drift guard returns to its pre-Rust state.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2C)
