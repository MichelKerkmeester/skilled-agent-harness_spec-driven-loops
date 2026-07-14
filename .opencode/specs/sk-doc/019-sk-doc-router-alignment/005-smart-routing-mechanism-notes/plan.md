---
title: "Implementation Plan: sk-doc Smart Routing Mechanism Notes"
description: "Analyze the 10 create-* packets for keyed resource subdirs; the 3 already-conformant packets need nothing, the 7 flat-resource packets get a documented N/A routing note via a GPT batch modeled on create-readme; verify all 10 stay --check PASS."
trigger_phrases:
  - "017 plan smart routing mechanism notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/005-smart-routing-mechanism-notes"
    last_updated_at: "2026-07-12T14:23:42Z"
    last_updated_by: "claude-code"
    recent_action: "6 packets got N/A notes; create-benchmark documented exception; 10/10 PASS"
    next_safe_action: "Terminal gates"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-doc Smart Routing Mechanism Notes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Documentation authoring on sk-doc packet SKILL.md files; no code/runtime change.
### Overview
Give each create-* packet either the keyed-discovery router mechanism (where keyed subdirs exist) or a documented N/A routing note (flat resources), avoiding a force-fit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Per-packet keyed-subdir analysis complete; create-readme's note identified as the precedent.
### Definition of Done
All 10 packets: mechanism present or documented note; `package_skill.py --check` PASS unchanged; validate_document on edited files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Per-packet judgment, not blind copy. keyed:>0 + mechanism present → leave (create-skill). keyed:0 + no note → add an honest routing note + resilience rules modeled on create-readme. Word-capped packet (create-benchmark) → documented exception (already family-routes).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Analyze 10 packets (mechanism-present? keyed-subdirs? existing note?).
2. GPT batch: add N/A notes to the 7 flat-resource packets.
3. Verify + reconcile (revert create-benchmark's over-cap note; confirm create-command warnings pre-existing).
4. Confirm 10/10 --check PASS.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`package_skill.py --check` PASS for all 10; `validate_document.py` on each edited SKILL.md; grep confirms the N/A note text present in each of the 6 edited packets.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- create-skill SKILL.md §2 + skill_smart_router.md (mechanism authority); create-readme's note (precedent).
- Sibling 015 (header split, on v4).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Additive SKILL.md notes + changelogs. Rollback = revert the commit.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../009-packet-smart-routing-conformance/`
