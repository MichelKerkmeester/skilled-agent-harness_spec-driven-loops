---
title: "Tasks: hub intent keyword coverage for create-agent and create-changelog"
description: "Diagnose, edit three surfaces, verify routing + guards."
trigger_phrases:
  - "007 tasks hub intent keyword coverage"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/007-hub-intent-keyword-coverage"
    last_updated_at: "2026-07-13T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Terminal validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: hub intent keyword coverage for create-agent and create-changelog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirm the tie via router-replay scores [EVIDENCE: "create an agent file" scored create-skill/create-skill-parent/create-readme all 4, create-agent tied, tiebreak lost]
- [x] T002 Confirm the three-surface sync contract and clean baseline [EVIDENCE: vocab-sync score 100 pre-edit]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Add `agent file`, `new agent`, `agent persona` and `changelog`, `changelog entry` to the two packet `Keyword triggers:` lines
- [x] T004 Mirror the additions into `mode-registry.json` aliases and `hub-router.json` vocabularyClasses
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 Routing battery 13 prompts [EVIDENCE: 12/13 route correctly; both target modes fixed (create-agent 8/16, create-changelog 9/3); 1 fail is the pre-existing create-benchmark case]
- [x] T006 Guards green [EVIDENCE: vocab-sync score 100 driftDetected false 0 collisions; d5 connectivity 100 / hub-registry 100]
- [x] T007 `package_skill.py --check` errors 0 on both edited packets [EVIDENCE: create-agent errors 0; create-changelog errors 0, 3469 words < 5000 cap]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
Both target modes route correctly, no regression, all guards green. Met. The create-benchmark instance is recorded as an out-of-scope follow-up.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./implementation-summary.md`
- `.opencode/skills/sk-doc/{create-agent,create-changelog}/SKILL.md`, `hub-router.json`, `mode-registry.json`
<!-- /ANCHOR:cross-refs -->
