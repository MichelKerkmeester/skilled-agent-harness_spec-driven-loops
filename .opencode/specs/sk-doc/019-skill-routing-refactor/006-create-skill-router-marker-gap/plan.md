---
title: "Implementation Plan: create-skill router-marker conformance gap analysis"
description: "Read-only analysis plan: run the checker across all ten packets, score three axes per packet, interpret the create-skill standard, and record the keep-vs-wire decision framing. No SKILL.md edits."
trigger_phrases:
  - "006 plan router marker gap analysis"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/006-router-conformance-gap-analysis"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Analysis executed from live checker output"
    next_safe_action: "Operator decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: create-skill router-marker conformance gap analysis

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Read-only analysis of sk-doc packet SKILL.md routing conformance. No code or routing change.
### Overview
Score each packet on mechanism / N/A-note / warning, interpret the standard, and frame the decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Live checker output captured for all ten packets.
### Definition of Done
Per-packet table, evidence-backed verdict, and keep-vs-wire framing recorded in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Evidence-first: derive every claim from `package_skill.py --check --json`, then interpret severity + precedent + mechanism intent. No force-fit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Run the checker across all ten packets; capture errors/warnings.
2. Score the three axes per packet; build the conformance table.
3. Interpret the standard (severity tier, create-readme precedent, mechanism intent).
4. Record the verdict and the keep-vs-wire decision framing + recommendation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Re-run `package_skill.py --check` to confirm the table matches live output; no SKILL.md is modified, so no routing regression is possible.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Sibling `005-smart-routing-mechanism-notes` (the N/A-note posture under analysis).
- create-skill `§2` + `skill_smart_router.md` (mechanism authority).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Analysis-only packet; no runtime change. Rollback = revert the commit.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../005-smart-routing-mechanism-notes/`
