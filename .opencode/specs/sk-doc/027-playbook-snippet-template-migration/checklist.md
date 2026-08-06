---
title: "Verification Checklist: sk-doc manual-testing-playbook snippet template migration"
description: "Verification evidence for the routing-gold snippet migration."
trigger_phrases:
  - "playbook migration checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/027-playbook-snippet-template-migration"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author checklist"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-playbook-snippet-template-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: sk-doc manual-testing-playbook snippet template migration

<!-- ANCHOR:protocol -->
## 1. Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required gate or contract invariant | Cannot close the packet |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. Pre-Implementation

- [x] CHK-001 [P0] Frontmatter field consumers verified before dropping anything [evidence: `validate-playbook-topology.cjs` reads `expected_workflow_mode`/`expected_leaf_resources`; `load-playbook-scenarios.cjs` derives `category` from directory]
- [x] CHK-002 [P0] Stage mapping and four shapes established [evidence: loader defaults absent `stage` to `routing`; 18/8/5/1 shape clustering]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. Code Quality

- [x] CHK-010 [P0] Frontmatter matches the field map (REQ-003) [evidence: `description` 32/32, `stage` 32/32, dropped keys 0/32]
- [x] CHK-011 [P0] Section structure matches the scaffold (REQ-004) [evidence: `## 4. SOURCE FILES` 32/32, `## 5. SOURCE METADATA` 32/32, 9-col table 0/32]
- [x] CHK-012 [P0] Gate-critical fields preserved [evidence: variant `bundle-rules-compiled-routing.md` keeps `route_shape` and the full `evidence_*` block]
- [x] CHK-013 [P1] Template documents routing-gold fields (REQ-006) [evidence: scaffold gained `expected_workflow_mode`/`expected_leaf_resources`; `validate-playbook-topology.cjs` cited in the note]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. Testing

- [x] CHK-020 [P0] Topology gate green after migration (REQ-001) [evidence: `verdict=PASS valid=32 blocked=0`]
- [x] CHK-021 [P0] Package validator reports no new violations (REQ-002) [evidence: `SKIP ... scenarios=32 ... violations=0 warnings=0`]
- [x] CHK-022 [P0] No invented content in minimal files (REQ-005) [evidence: 13 minimal files carry a prompt-only `### Note`, no commands or evidence]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. Fix Completeness

- [x] CHK-030 [P1] Full-old content preserved through the reshape [evidence: `skill-creation.md` Commands carries the original Setup routing-trace block verbatim]
- [x] CHK-031 [P1] Root-index bijection intact (REQ-007) [evidence: 32/32 files referenced, 0 orphans, root index unmodified]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. Security

- [x] CHK-032 [P1] No runtime, validator, or loader code changed [evidence: `git status` limited to the 32 snippets, the template, and packet docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. Documentation

- [x] CHK-033 [P0] Every requirement REQ-001..REQ-007 has recorded evidence [evidence: traced through `tasks.md` T001..T009]
- [x] CHK-034 [P1] Packet validates (SC-004) [evidence: `validate.sh --strict` Errors 0 on packet 027]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. File Organization

- [x] CHK-035 [P1] Migration committed durably in a hostile tree [evidence: commits `e2583ed579` (32 snippets) and `3862efb0ac` (template)]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 8 | 0/8 |
| P1 items | 7 | 0/7 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
