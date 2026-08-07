---
title: "Verification Checklist: Phase 001 - shared standalone skill README template refinement"
description: "Verification evidence for the shared standalone skill README template refinement."
trigger_phrases:
  - "phase 001 checklist"
  - "readme template refinement verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/001-readme-template-refinement"
    last_updated_at: "2026-08-04T12:40:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 001 verification checklist"
    next_safe_action: "Record template refinement evidence on execution"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-readme-template-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Phase 001 - shared standalone skill README template refinement

<!-- ANCHOR:protocol -->
## 1. Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required message or structure invariant | Cannot close the phase |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. Pre-Implementation

- [x] CHK-001 [P0] Sources read before writing: handover §2-§4, current template, `hvr-rules.md`, pilot README [evidence: read list recorded in the phase notes before any edit] [evidence: read list recorded: handover, current template, hvr-rules, pilot README]
- [x] CHK-002 [P0] Gap inventory between the current template and each handover §2 directive captured [evidence: gap list table noting each directive and the missing template guidance] [evidence: gap list table: 5 gaps mapped to directives]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## 3. Code Quality

- [x] CHK-010 [P0] Template identity guidance is purpose-first: the outcome opens before any tool name [evidence: identity guidance block quoted and opening with the delivered outcome] [evidence: identity guidance opens with outcome (`git diff` quote)]
- [x] CHK-011 [P0] Capability section pattern present, modeled on the pilot's Plugin Knowledge Layer [evidence: pattern and example prose present in the template] [evidence: capability pattern + example prose present]
- [x] CHK-012 [P0] HVR enforcement block embedded with banned forms and scripted grep commands [evidence: banned forms listed verbatim with the grep commands and the `hvr-rules.md` link] [evidence: banned forms verbatim + `rg -n` commands + hvr-rules link]
- [x] CHK-013 [P0] Versioning conventions documented: README version field and per-skill changelog entry [evidence: version field and changelog entry instructions present] [evidence: version field + changelog entry instructions present]
- [x] CHK-014 [P0] Validation checklist names pitch, AT A GLANCE, numbered ALL-CAPS H2, OVERVIEW required, command output expectations, link verification, `validate_document.py --type readme`, each with a pass criterion [evidence: checklist section read with all seven items named] [evidence: all 7 checklist items named with pass criteria]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. Testing

- [x] CHK-020 [P0] HVR grep on the template body returns zero em dashes, semicolons, Oxford commas and banned words [evidence: rg output with zero matches outside code fences] [evidence: `rg` HVR scan zero matches outside code fences]
- [x] CHK-021 [P0] Throwaway sample README built from the refined template validates with zero issues and is deleted [evidence: validate_document.py output plus a `git status` showing no residue] [evidence: `validate_document.py` exit 0 on throwaway sample; `git status` no residue]
- [x] CHK-022 [P1] Section model retained: numbered ALL-CAPS H2 with `---` dividers, AT A GLANCE first with four one-line rows, QUICK START with expected outputs, OVERVIEW the only required section [evidence: heading grep and section model read] [evidence: heading grep: H2 1-9, dividers, AT A GLANCE first]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## 5. Fix Completeness

- [x] CHK-030 [P1] Handover §2 cross-check table maps every directive to a template location with no gaps [evidence: cross-check table with all eight directives mapped] [evidence: 8-row cross-check table, no gaps]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## 6. Security

- [x] CHK-031 [P1] No vault, plugin, runtime or other skill files touched [evidence: `git status` shows only the template and the phase docs] [evidence: `git status` only template + phase docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## 7. Documentation

- [x] CHK-032 [P0] Every requirement REQ-001..REQ-008 has verified acceptance evidence recorded in this checklist [evidence: each REQ row marked verified] [evidence: REQ-001..REQ-008 rows verified]
- [x] CHK-033 [P1] Phase validation errors zero [evidence: validate.sh errors 0] [evidence: `validate.sh` errors 0]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## 8. File Organization

- [x] CHK-034 [P1] No files moved or renamed and `git status` shows only the template and the four phase docs [evidence: git status output] [evidence: `git status` clean scope]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## 9. Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 10 | 0/10 |
| P1 items | 5 | 0/5 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
