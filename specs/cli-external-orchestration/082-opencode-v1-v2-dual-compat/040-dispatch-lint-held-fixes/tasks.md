---
title: "Tasks: Phase 40: dispatch-lint-held-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "dispatch lint held fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 40: dispatch-lint-held-fixes

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

- [x] T001 Scaffold this packet and register it in the parent phase map
- [x] T002 Capture suite baselines (`scratch/suites/baseline/`)
- [x] T003 Snapshot the pre-change engine and write the corpus comparison (`scratch/corpus-diff.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Codex dispatch inside an expansion is dispatch evidence, 006 (`lib/dispatch-audit.mjs`)
- [ ] T005 Resolver returns every dispatch in a chain, N03 (`lib/dispatch-audit.mjs`)
- [ ] T006 Resolver reads a heredoc that a shell runs or a script the call writes and runs, N05 (`lib/dispatch-audit.mjs`)
- [ ] T007 Audit matching resolves the way the preflight does, N06 (`lib/dispatch-audit.mjs`)
- [ ] T008 Codex and Devin audit adapters use the shared pipeline, N07 and N08 (`codex/`, `devin/dispatch-audit-posttooluse.mjs`)
- [ ] T009 Claude with flags before `-p` meets the permission-mode check, 012 (`lib/dispatch-rule-checks.mjs`)
- [ ] T010 Stdin and model checks read real arguments and redirects only, N04 (`lib/dispatch-rule-checks.mjs`)
- [ ] T011 Preflight adapters lint every resolved dispatch, N03 (`claude/`, `codex/`, `devin/dispatch-preflight-lint.mjs`)
- [ ] T012 Pi resolves wrapped dispatches before authorization, N01 (`pi/dispatch-preflight-lint.ts`)
- [ ] T013 Pi counts only a positive, unquoted deep-loop directive, N02 (`pi/dispatch-preflight-lint.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Each new test fails on the pre-change engine (`scratch/mutation/`)
- [ ] T015 Corpus comparison moves only commands a finding names (`scratch/corpus-diff.txt`)
- [ ] T016 Suites at or above baseline (`scratch/suites/final/`), Luna verdicts (`scratch/luna/`)
- [ ] T017 README and playbook lines that describe the changed behaviour
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
