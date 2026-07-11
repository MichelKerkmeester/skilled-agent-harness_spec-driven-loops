---
title: "Tasks: Phase 8 — Split code-opencode Other-Language & Shared References"
description: "Task checklist with evidence for the code-opencode non-Rust + shared reference split and router rewire."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8 — Split code-opencode Other-Language & Shared References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Compute heading-aligned boundaries for the 9 docs — 20 parts (3/2/2/2/2/2/2/3/2)
- [x] T002 Dry-run the splitter — coverage contiguous 1..EOF; all parts ≤~340 lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Apply split: 20 parts created, 9 sources deleted (0 parts >500)
- [x] T004 Rewire child SKILL.md TYPESCRIPT/SHELL/JAVASCRIPT + DEFAULT_RESOURCE + IMPLEMENTATION shared tier (rewire_paths.py)
- [x] T005 Rewire parent smart_routing.md union (rewire_paths.py, re-prefixed)
- [x] T006 Rewire surface-slice-sync.vitest.ts TS_TRIO → 7 typescript parts
- [x] T007 Rewire 16 cross-link/playbook files (rewire_xlinks.py; expected_resources→all parts, nav→first part, code-webflow excluded)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Gate: 3 router guards 21/21; dangling grep clean; full-suite 11 fails == baseline (0 regressions)
- [ ] T009 Commit phase 008
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
