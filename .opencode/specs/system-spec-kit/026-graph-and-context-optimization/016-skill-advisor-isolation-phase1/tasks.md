---
title: "Tasks: Skill Advisor Isolation — Phase 1"
description: "Task list for Phase 1 of extracted-skills isolation: removing system-skill-advisor coupling from system-spec-kit."
trigger_phrases:
  - "skill advisor isolation tasks"
  - "phase 1 tasks skill advisor"
importance_tier: "normal"
contextType: "implementation"
---

# Tasks: Skill Advisor Isolation — Phase 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1.1: tsconfig.json

- [x] T001 Remove skill-advisor include line from tsconfig.json
- [x] T002 Remove 5 skill-advisor exclude lines from tsconfig.json
- [x] T003 Validate JSON syntax

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 1.2: vitest.config.ts

- [x] T004 Remove 3 skill-advisor include lines
- [x] T005 Remove 1 skill-advisor exclude line

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 1.3: vitest.stress.config.ts

- [x] T006 Remove 2 skill-advisor exclude lines

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 1.4: Test/stress file relocation

- [x] T007 `git mv` spec-kit-skill-advisor-plugin.vitest.ts to skill-advisor tests/
- [x] T008 `git mv` hooks-parity-stress.vitest.ts to skill-advisor stress_test/
- [x] T009 `git mv` opencode-plugin-bridge-stress.vitest.ts to skill-advisor stress_test/
- [x] T010 `git mv` README.md to skill-advisor stress_test/
- [x] T011 Remove empty spec-kit stress_test/skill-advisor/ directory

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 1.5: Feature catalog relocation

- [x] T012 `git mv` 26-skill-graph-scan.md → 06--mcp-surface/06-skill-graph-scan.md
- [x] T013 `git mv` 27-skill-graph-query.md → 06--mcp-surface/07-skill-graph-query.md
- [x] T014 `git mv` 28-skill-graph-status.md → 06--mcp-surface/08-skill-graph-status.md
- [x] T015 `git mv` 29-skill-graph-validate.md → 06--mcp-surface/09-skill-graph-validate.md
- [x] T016 Update feature_catalog.md with new entries

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:phase-6 -->
## Phase 1.6: Playbook relocation

- [x] T017 `git mv` 283-skill-graph-status.md → 01--native-mcp-tools/007-skill-graph-status.md
- [x] T018 `git mv` 284-skill-graph-query.md → 01--native-mcp-tools/008-skill-graph-query.md
- [x] T019 `git mv` 285-skill-graph-validate.md → 01--native-mcp-tools/009-skill-graph-validate.md
- [x] T020 Update manual_testing_playbook.md with new entries

<!-- /ANCHOR:phase-6 -->
---

<!-- ANCHOR:phase-7 -->
## Phase 1.7: Skill-advisor vitest config

- [x] T021 Verify broad include patterns cover moved files (no edits needed)

<!-- /ANCHOR:phase-7 -->
---

<!-- ANCHOR:phase-8 -->
## Phase 1.8: Packet scaffolding

- [x] T022 Create 016-skill-advisor-isolation-phase1 spec folder
- [x] T023 Write spec.md
- [x] T024 Write plan.md
- [x] T025 Write tasks.md
- [x] T026 Write checklist.md
- [x] T027 Write implementation-summary.md

<!-- /ANCHOR:phase-8 -->
---

<!-- ANCHOR:phase-9 -->
## Phase 1.9: Verification

- [x] T028 `grep system-skill-advisor` on tsconfig.json, vitest.config.ts, vitest.stress.config.ts
- [x] T029 `tsc --noEmit` on spec-kit mcp_server
- [x] T030 `vitest run` on moved skill-advisor test
- [x] T031 `validate.sh --strict` on 016 packet

<!-- /ANCHOR:phase-9 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Zero system-skill-advisor references in spec-kit configs
- [x] All moved files at destination
- [x] Skill-advisor vitest passes
- [x] 016 packet passes strict validation (or warnings only)

<!-- /ANCHOR:completion -->
