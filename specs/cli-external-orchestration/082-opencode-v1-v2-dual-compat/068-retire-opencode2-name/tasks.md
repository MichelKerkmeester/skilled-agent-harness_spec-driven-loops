---
title: "Tasks: Phase 68: retire-opencode2-name"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retire opencode2 name tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 68: retire-opencode2-name

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

- [x] T001 Remove `~/.local/bin/opencode2`, keeping its target in the backup folder
- [x] T002 Find that v1's auto-update moved the package to 1.19.4 and pointed `opencode` back at v1; confirm v1 never wrote to `opencode.db` (`session` still 1,339 rows, quick_check `ok`)
- [x] T003 Relink `opencode` to v2 and add `OPENCODE_DISABLE_AUTOUPDATE=1` to `opencode1`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Retire `opencode2` and write the new launcher (`scripts/opencode-setup.sh`)
- [x] T005 Cover the retirement and the launcher (`scripts/tests/opencode-setup-both.test.cjs`)
- [x] T006 Rewrite 182 `opencode2 <subcommand>` uses to `opencode` and triage the remaining mentions (cli-opencode docs and playbooks, feature catalog, sk-git reference)
- [x] T007 Run v1 scenarios through `opencode1` where it exists (`run-plugin-scenario.sh`)
- [x] T008 Classify listings by form (`scripts/tests/opencode2-models-form.test.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 config-shape, battery and cli-opencode suites 88 of 88; dispatch-audit 124 of 124 under vitest
- [x] T010 shellcheck clean on the helper; launcher byte-identical to the machine's
- [ ] T011 CI green on the pushed commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All local tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] CI green on the pushed commit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
