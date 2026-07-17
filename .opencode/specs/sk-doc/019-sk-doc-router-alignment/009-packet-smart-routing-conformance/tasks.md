---
title: "Tasks: sk-doc Packet Smart Routing Conformance"
description: "Per-packet normalization + verification task checklist with evidence."
trigger_phrases:
  - "015 tasks smart routing conformance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/009-packet-smart-routing-conformance"
    last_updated_at: "2026-07-14T08:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; 9/10 packets PASS (create-benchmark deferred to 016)"
    next_safe_action: "Commit and continue with 016"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-doc Packet Smart Routing Conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Baseline `package_skill.py --check` on all 10 packets — 8 FAIL (create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-benchmark, create-changelog, create-quality-control, create-flowchart); root cause pinned at the substring matcher
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 create-agent — split header; promoted OVERFLOW REFERENCES H3 → `## REFERENCES` H2; added keyword-triggers + SUCCESS CRITERIA; v1.0.1.0
- [x] T003 create-command — split header; REFERENCES satisfied by DEEP DETAIL REFERENCES; added SUCCESS CRITERIA; v1.0.1.0
- [x] T004 create-feature-catalog — split header; authored REFERENCES H2; added SUCCESS CRITERIA; v1.0.1.0
- [x] T005 create-manual-testing-playbook — split header; renamed RESOURCES FOR DEEP DETAIL → `& REFERENCES`; added keyword-triggers + SUCCESS CRITERIA; v1.0.1.0
- [x] T006 create-changelog — split header; promoted OVERFLOW REFERENCES → `## REFERENCES` H2; v1.0.1.0
- [x] T007 create-quality-control — split header only (REFERENCES + SUCCESS CRITERIA already present); v1.0.1.0
- [x] T008 create-flowchart — REFERENCES-only fix: promoted trailing reference pointer to `## References` H2 (header already valid); v1.0.1.0
- [ ] T009 create-benchmark — header normalization deferred to packet 016 (same file gains the new-family sections there)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 Independent re-verify `package_skill.py --check` — 9/10 PASS (all but create-benchmark, owned by 016)
- [x] T011 `validate_document.py` on each edited SKILL.md — 0 issues each
- [x] T012 `parent-skill-check.cjs` on sk-doc hub — OK, 0 warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
9/10 packets PASS `--check` (create-benchmark by 016 → 10/10); hub canon-clean; content preserved; each edit verified. Met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./implementation-summary.md`
- `../016-benchmark-authoring-centralization/` (owns create-benchmark's normalization)
<!-- /ANCHOR:cross-refs -->
