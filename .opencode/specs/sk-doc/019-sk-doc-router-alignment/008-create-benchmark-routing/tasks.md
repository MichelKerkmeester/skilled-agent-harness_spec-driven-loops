---
title: "Tasks: create-benchmark routing via redundant-alias swap"
description: "Confirm redundancy, swap three surfaces, verify."
trigger_phrases:
  - "008 tasks create-benchmark routing swap"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/008-create-benchmark-routing"
    last_updated_at: "2026-07-13T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Terminal validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: create-benchmark routing via redundant-alias swap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirm `skill-benchmark-report` is redundant [EVIDENCE: `skill-benchmark` is a substring of `skill-benchmark-report`; "generate a skill-benchmark-report" routes to create-benchmark even after removal]
- [x] T002 Locate the alias in all three surfaces [EVIDENCE: SKILL.md keyword line + mode-registry aliases + hub-router vocabularyClasses; 13 further SKILL.md hits are prose filenames]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Swap `skill-benchmark-report` -> `benchmark package` in the packet `Keyword triggers:` line (prose filenames untouched)
- [x] T004 Mirror the swap into `mode-registry.json` aliases and `hub-router.json` vocabularyClasses
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Route + coverage [EVIDENCE: "create a benchmark package" -> create-benchmark (6); "generate a skill-benchmark-report" -> create-benchmark (6), coverage preserved]
- [x] T006 Battery + guards [EVIDENCE: battery 11/11; vocab-sync score 100 no drift 0 collisions; d5 connectivity 100 / hub-registry 100]
- [x] T007 `package_skill.py --check` [EVIDENCE: errors 0, 4997 words < 5000 cap]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
Benchmark prompt routes correctly, coverage preserved, guards green, under cap. Met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./implementation-summary.md`
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md`, `hub-router.json`, `mode-registry.json`
<!-- /ANCHOR:cross-refs -->
