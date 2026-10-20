---
title: "Tasks: Phase 19: plugins-compat-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugins compat docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: plugins-compat-docs

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

- [x] T001 Audit the plugins README against the code by loading each plugin's v1 factory with a stub host (`scratch/list-plugin-hooks.mjs`, output `scratch/plugin-hook-keys.txt`) (orchestrator) Done: all 17 files audited on `origin/main` at `1001ab297f`, with hook keys, bridge behavior, switch names and test lists collected.
- [x] T002 Record the facts with their sources (`scratch/facts.md`) (orchestrator) Done: every fact names its file and line, including the six drift items, the three kill-switch exceptions and the 12-name registration list.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply the README edits (`.opencode/plugins/README.md`) (GLM 5.3 Flash through cli-pi, from short literal briefs) Done: the version statement with the proof date, the six drift fixes and the ARCHITECTURE.md link.
- [x] T004 Write the architecture doc (`.opencode/plugins/ARCHITECTURE.md`) (GLM 5.3 Flash through cli-pi) Done: the sk-doc architecture template's eight fixed sections, each claim with a repo source.
- [x] T005 Fill this folder's docs and the parent handoff row (`spec.md`, `plan.md`, `tasks.md`, `../spec.md`) (orchestrator) Done.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Luna review until PASS (`.opencode/plugins/README.md`, `.opencode/plugins/ARCHITECTURE.md`) (Luna through cli-codex, read-only) Done: PASS on round 25 with no findings, after 24 rounds whose findings were all fixed (`scratch/verify/luna-pass.txt`).
- [x] T007 Run the sk-doc validator on both files (`validate_document.py` from `.skilled/skills/sk-doc/shared/scripts/`) (orchestrator) Done: README VALID with 0 issues, ARCHITECTURE.md VALID with 1 warning, the document-type fallback to README rules (`scratch/verify/validate-README.txt`, `scratch/verify/validate-ARCHITECTURE.txt`).
- [x] T008 Run `test_readme_manifest.py` and the plugin suite `node --test .opencode/plugins/tests/` (orchestrator) Done: manifest reproduced True (`scratch/verify/manifest.txt`) and the suite passes 397 of 397 with 0 fail (`scratch/verify/plugins.txt`).
- [x] T009 Run strict validation of this folder and recursive validation of the 082 parent (`validate.sh --strict`, then `--recursive`) (orchestrator) Done: 019 strict `RESULT: PASSED` with 0 errors, 082 recursive 15 of 15 `RESULT: PASSED` (`scratch/verify/validate-019.txt`, `validate-082.txt`).
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
