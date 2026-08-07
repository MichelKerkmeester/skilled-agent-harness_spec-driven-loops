---
title: "Tasks: Phase 7 — Split code-opencode Rust References"
description: "Task checklist with evidence for the code-opencode Rust reference split + router rewire."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7 — Split code-opencode Rust References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence for its claim.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Compute heading-aligned, fence-aware split boundaries for the 4 Rust docs — 21 parts (7/5/5/4)
- [x] T002 Dry-run the deterministic splitter (lossless, ≤500/part) — coverage 1..EOF contiguous; max part 464 lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Apply split: 21 parts created, 4 sources deleted
- [x] T004 Rewire `code-opencode/SKILL.md` RESOURCE_MAP RUST (3→17) + CODE_QUALITY (checklist→4)
- [x] T005 Rewire `shared/references/smart_routing.md` RUST RESOURCE_MAP + prose table
- [x] T006 Rewire `surface-slice-sync.vitest.ts` RUST_TRIO + line-132 path
- [x] T007 Rewire internal Rust cross-links (11 sibling + universal_patterns + checklist §7) + playbook `expected_resources` (17 parts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Gate: `sk-code-router-sync` + `surface-slice-sync` + `code-surface-path-parse` = 21/21; dangling grep clean; broader-suite 11 fails identical to clean-HEAD baseline (0 regressions)
- [ ] T009 Commit phase 007
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All parts ≤500 lines; router guards green; parent union == child map; `validate.sh --strict` on this child passes; committed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md` (scope), `plan.md` (approach), `implementation-summary.md` (outcome)
- Router contract: `../../../../skills/sk-code/shared/references/smart_routing.md`
<!-- /ANCHOR:cross-refs -->
