---
title: "Implementation Plan: sk-doc Packet Smart Routing Conformance"
description: "Split the merged WHEN TO USE + SMART_ROUTING header and ensure a REFERENCES H2 across the 7 non-benchmark failing packets, verify each against package_skill.py --check, and confirm the hub stays canon-clean."
trigger_phrases:
  - "015 plan smart routing conformance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/009-packet-smart-routing-conformance"
    last_updated_at: "2026-07-14T08:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "7/7 packets normalized + verified PASS; committed"
    next_safe_action: "Roll into the goal branch; create-benchmark handled by 016"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-doc Packet Smart Routing Conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
sk-doc documentation authoring; no code, no runtime change. Fix the packet SKILL.md files, never the checker.
### Overview
Split the merged header into separate WHEN TO USE and SMART ROUTING H2s and ensure a REFERENCES H2 in each failing packet, so the canonical checker passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Baseline `package_skill.py --check` captured (8/10 FAIL confirmed) and the substring-match root cause pinned at package_skill.py validate_sections.
### Definition of Done
`--check` PASS for all 10 packets; `parent-skill-check.cjs` clean; `validate_document.py` 0 issues on each edited SKILL.md; content preserved (structural-only).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Per-packet independent normalization (disjoint files), each self-verified by the deterministic `package_skill.py --check` gate. create-benchmark is co-owned by 016 (same file gets the new-family sections), so its normalization lands there.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Baseline: run `--check` on all 10, pin the root cause.
2. Normalize the 7 non-benchmark failing packets in parallel: split header, add/rename/promote a REFERENCES H2, add keyword-triggers / SUCCESS CRITERIA where missing, renumber, version-bump, changelog.
3. Verify each: `--check` PASS + `validate_document.py` 0 issues.
4. Hub gate: `parent-skill-check.cjs` clean.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Deterministic: `package_skill.py --check` per packet (Result: PASS), `validate_document.py` per edited SKILL.md (0 issues), `parent-skill-check.cjs` for the hub. Content preservation checked by scoping edits to structural moves + additions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `create-skill/scripts/package_skill.py` (the canonical checker — read, never modified).
- `sk-doc/shared/scripts/validate_document.py`.
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (node tooling; run from a tree with node_modules).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
All changes are per-packet SKILL.md edits + changelog additions. Rollback = revert the commit; no runtime/data state.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../016-benchmark-authoring-centralization/`
- `.opencode/skills/sk-doc/create-skill/SKILL.md` (canon), `.../create-skill/scripts/package_skill.py` (checker)
