---
title: "Implementation Plan: Phase 4: apply-catalogs-and-playbooks [template:level_1/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-apply-catalogs-and-playbooks"
    last_updated_at: "2026-06-23T07:33:11Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-apply-catalogs-and-playbooks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: apply-catalogs-and-playbooks

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
| **Language/Stack** | Node engine over Markdown frontmatter |
| **Framework** | sk-doc versioning engine |
| **Storage** | None (files on disk; the precomputed manifest) |
| **Testing** | Engine verify and gate modes (full corpus) |

### Overview
This phase versioned the bulk of the corpus, every feature-catalog and testing-playbook doc, roots and per-feature leaves alike. The approach reused the same manifest computed in the prior phase, applied the catalog and playbook slice with no further git so over seventeen hundred files versioned in seconds, and relied on the deterministic verify and gate as the exhaustive check since per-file model review is infeasible at this scale.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (catalog and playbook leaves carry no version; frontmatter varies, often only a title and description)
- [x] Success criteria measurable (verify reports zero mismatches and zero corrupted frontmatter; applied count equals the manifest in-scope count)
- [x] Dependencies identified (phase 2 engine; phase 3 proven on the core docs)

### Definition of Done
- [x] All acceptance criteria met (full catalog and playbook corpus versioned; counts reconciled to the manifest)
- [x] Tests passing (verify and gate exit 0 over the slice and the full corpus)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Apply-from-manifest at scale: the largest, most mechanical phase, isolated so a bad run cannot poison the standard or the engine.

### Key Components
- **Full catalog and playbook apply**: the engine inserts the 4-part version across every feature-catalog and testing-playbook doc, roots and per-feature leaves treated identically, reading values from the precomputed manifest.
- **Field-relative insertion on light frontmatter**: most playbook leaves carry only a title and description, so the version goes last before the closing fence rather than at a fixed line, never inside an array block.
- **Deterministic guarantee**: verify and gate run over the slice and then the full corpus as the exhaustive correctness check, since a per-file model review of this many files is past any feasible budget.

### Data Flow
The engine reads each catalog and playbook doc's computed version from the manifest and inserts it line-wise as the last frontmatter key; verify and gate then re-read every file across the slice and the whole corpus to confirm value, position, and intact frontmatter.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reused the precomputed manifest from the prior phase rather than re-running the heavy git compute
- [x] Scoped the apply to the catalog and playbook classes, roots and leaves

### Phase 2: Core Implementation
- [x] Applied the version across all feature-catalog docs (roots and per-feature leaves)
- [x] Applied the version across all testing-playbook docs (roots and per-feature leaves)
- [x] Relied on field-relative insertion to handle the light two-field frontmatter on leaves without reflow

### Phase 3: Verification
- [x] Ran verify over the catalog and playbook classes
- [x] Ran gate over the catalog and playbook classes
- [x] Ran a full-corpus gate across all classes and reconciled the applied count to the manifest
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Covered by the engine suite from the prior phase | Fixture harness (Node) |
| Integration | verify and gate over the catalog and playbook slice | Engine verify and gate modes |
| Manual | Full-corpus gate and count reconciliation against the manifest | Engine gate mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 engine and manifest | Internal | Green | Supplies the computed values and the apply/verify/gate modes |
| Phase 3 proven on core docs | Internal | Green | Confirms the apply pipeline before the high-volume run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: verify or gate reports a mismatch, a corrupted frontmatter, or a count that does not reconcile to the manifest.
- **Procedure**: Re-run the engine from the manifest to reconcile, or revert the touched docs by git. Insertion is idempotent and line-wise, so an over-apply backs out by removing the single inserted line; the apply is resumable per skill so a partial run can continue rather than restart.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
