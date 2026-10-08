---
title: "Goal: Phase 2: phase-scaffold-graph-metadata"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "planning-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: phase-scaffold-graph-metadata

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the early exit in create.sh --phase mode and run graph-metadata derivation for parent and children before exit, so every phase scaffold passes strict validation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Call backfill-graph-metadata.ts for the parent and each child in create.sh --phase mode, before the original exit point |
| D2 | Refresh the parent's children_ids field from the newly created children directories |
| D3 | Add a --phase test case to scaffold-passes-its-own-gate.vitest.ts |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [ ] A phase parent scaffolded with --phase passes validate.sh --strict on GENERATED_METADATA_* rules (command: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent-path> --strict; exit status 0)
- [ ] Each child of the parent passes validate.sh --strict on GENERATED_METADATA_* rules (command: for each child, bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child-path> --strict; exit status 0)
- [ ] Parent's graph-metadata.json children_ids list contains all created children (command: node -e 'console.log(require("./graph-metadata.json").children_ids.length)'; count > 0)
- [ ] scaffold-passes-its-own-gate.vitest.ts includes a --phase test case that creates parent with 2 children and validates all three (command: grep -n -e '--phase' <test-file>)
- [ ] Full spec-kit test suite passes with no new failures (npm test in spec-kit directory)

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

*To be filled as this phase executes.*
<!-- /ANCHOR:log -->

---
