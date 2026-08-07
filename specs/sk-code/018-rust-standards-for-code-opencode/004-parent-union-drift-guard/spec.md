---
title: "Feature Specification: Phase 4 — Parent-Hub Union & Drift Guard"
description: "Mirror the child RUST routing into the parent-hub union in shared/references/smart_routing.md (the re-prefixed RUST resource entry plus parent CODE_QUALITY and the human-facing overlay), and make the sk-code-router-sync drift-guard vitest pass. Corrects the charter: the union lives in smart_routing.md, not sk-code/SKILL.md."
trigger_phrases:
  - "018 phase 004 parent union drift guard"
  - "smart_routing.md rust union"
  - "sk-code-router-sync drift guard rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/004-parent-union-drift-guard"
    last_updated_at: "2026-07-11T09:56:28Z"
    last_updated_by: "claude-code"
    recent_action: "Mirrored RUST into the smart_routing.md parent union; drift guard green"
    next_safe_action: "Wire the six registration touchpoints (phase 005)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 — Parent-Hub Union & Drift Guard

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
| **Predecessor** | 003-surface-routing |
| **Successor** | 005-touchpoints-and-multilang |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent hub keeps a union projection of every child's routing map, enforced by a drift-guard vitest. When the child adds RUST (phase 003) but the parent union does not mirror it, the guard fails. The research corrected a charter assumption here: the union is NOT in `sk-code/SKILL.md`; it lives in `shared/references/smart_routing.md`.

### Purpose
Add the re-prefixed RUST entry to the parent union and the parent CODE_QUALITY, so the drift guard passes and the parent-hub union equality holds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the parent `RUST` `RESOURCE_MAP` entry (`code-opencode/references/rust/*`) in `smart_routing.md`.
- Add `code-opencode/assets/checklists/rust_checklist.md` under the parent `CODE_QUALITY`.
- Add the RUST intent to the parent and a human-facing parent overlay row.
- Make `sk-code-router-sync.vitest.ts` pass.

### Out of Scope
- The child SKILL.md routing (phase 003).
- The six registration touchpoints (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Modify | Parent RUST union + parent CODE_QUALITY + intent + overlay row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent union mirrors child | Parent RUST entries equal the child map re-prefixed with exactly one `code-opencode/` |
| REQ-002 | Checklist under parent CODE_QUALITY | `code-opencode/assets/checklists/rust_checklist.md` present in the parent CODE_QUALITY set |
| REQ-003 | Drift guard green | `npx vitest run .../tests/sk-code-router-sync.vitest.ts` exits 0 with no orphan/missing-projection findings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent map equals the child union plus the fixed parent-owned allowlist.
- **SC-002**: The drift-guard vitest passes; no Rust path is orphaned.
- **SC-003**: No unrelated parent-only resource is introduced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing `sk-code/SKILL.md` by mistake (charter's wrong assumption) | Guard still fails | Target `smart_routing.md` only, per research.md §3 |
| Dependency | Phase 003 child RUST map exists | Union would mirror nothing | Sequence 004 after 003 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm the exact parent-owned allowlist the guard expects, from `sk-code-router-sync.vitest.ts`, at apply time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2C + Gate 1)
- **Predecessor**: ../003-surface-routing/ · **Successor**: ../005-touchpoints-and-multilang/
