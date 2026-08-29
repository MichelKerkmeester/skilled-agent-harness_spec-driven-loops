---
title: "Tasks: Phase 10 — Split code-webflow Other References"
description: "Task checklist with evidence for the code-webflow non-implementation reference split and router rewire."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10 — Split code-webflow Other References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Compute heading-aligned boundaries for the 8 docs — 31 parts; debugging split at §2 Rules H3
- [x] T002 Dry-run the splitter — coverage contiguous 1..EOF; all parts ≤478 lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Apply split: 31 parts created, 8 sources deleted (0 parts >500)
- [x] T004 Rewire code-webflow/SKILL.md RESOURCE_MAP (rewire_paths.py)
- [x] T005 Rewire parent smart_routing.md union (rewire_paths.py, code-webflow-prefixed)
- [x] T006 Rewire 16 cross-link/playbook files (rewire_xlinks.py surface=code-webflow)
- [x] T007 Verify no vitest constant needed (webflow slice tests are prompt-based)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Gate: 3 router guards 21/21; dangling grep clean; full-suite 11 fails == baseline (0 regressions)
- [ ] T009 Commit phase 010
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All parts ≤500 lines; router guards green; parent union == child map; `validate.sh --strict` = 0 errors; committed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md`, `plan.md`, `implementation-summary.md`
- Router contract: `../../../../skills/sk-code/shared/references/smart_routing.md`
<!-- /ANCHOR:cross-refs -->
