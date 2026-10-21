---
title: "Tasks: Phase 50: sk-doc-ci-outside-failures"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk doc ci outside failures tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 50: sk-doc-ci-outside-failures

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read CI run 39637734898 at `c2550f5451` and run 39634199709, and name the producer behind each failure: the bare `package_skill` import and the plain-text `AGENTS.md` cell (`.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`, `.skilled/skills/mcp-tooling/mcp-figma/feature-catalog/feature-catalog.md`)
- [x] T002 Write the briefs and dispatch them through `cli-pi` on `llmgateway`: fix 1 to DeepSeek v4.1 flash max, fix 2 and the docs to DeepSeek v4.1 flash high, and a separate read-only DeepSeek review at high (`.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`, `.skilled/skills/mcp-tooling/mcp-figma/feature-catalog/feature-catalog.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `sys.path.insert(0, str(Path(__file__).resolve().parent))` before the `package_skill` import, the pattern the file already uses for the shared scripts folder (`.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`)
- [x] T004 Reword the init-agent cell to "the target repo's agent instructions file (AGENTS)", so the row keeps the other session's intent and stops naming a `*.md` path (`.skilled/skills/mcp-tooling/mcp-figma/feature-catalog/feature-catalog.md`)
- [x] T005 Read-only DeepSeek review at high of both edits, with no P0 or P1 found and neither feature's behaviour changed (`.skilled/skills/mcp-tooling/mcp-figma/feature-catalog/feature-catalog.md`, `.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`)
- [x] T006 Fill this phase's four docs, its description and the parent map and handoff rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `../spec.md`)
- [x] T007 Run `test_create_skill_contract.py` after the fix: 29 passed (`.skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py`)
- [x] T008 Run `validate_catalog_package.py` after the fix: exit 0 with 0 FAIL packages (`.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run strict validation of this folder: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/050-sk-doc-ci-outside-failures --strict` - `RESULT: PASSED`
- [x] T010 Run the full sk-doc runner with CI's skip list - 37 passed, 1 skipped, exit 0
- [x] T011 Push the two fixes and this packet to main - commit `96b3395920`, pushed as `c2550f5451..96b3395920`; the tip afterwards is `e9193b07f1`, a CI bot trigger-index rebuild
- [x] T012 Confirm sk-doc Script Tests is green on CI at the pushed commit - run 39648027339 on `96b3395920` and run 39648353041 on tip `e9193b07f1`, both success
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
