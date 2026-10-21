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

- [x] T004 Codex dispatch inside an expansion is dispatch evidence, 006 (`lib/dispatch-audit.mjs`) [EVIDENCE: 2cb94baa32, `scratch/mutation/b1-codex-expansion.txt`]
- [x] T005 Resolver returns every dispatch in a chain, N03 (`lib/dispatch-audit.mjs`) [EVIDENCE: fdc0fc8741 c0805c2350, `scratch/mutation/b2-every-dispatch.txt`, `b12-every-repeat*.txt`]
- [x] T006 Resolver reads a heredoc that a shell runs or a script the call writes and runs, N05 (`lib/dispatch-audit.mjs`) [EVIDENCE: 72b98dd2b3 9fb6fc7d7e 06bfa6eb1d, `scratch/mutation/b3-heredoc-run.txt`, `b3b-heredoc-order.txt`, `b16-heredoc-word.txt`]
- [x] T007 Audit matching resolves the way the preflight does, N06 (`lib/dispatch-audit.mjs`) [EVIDENCE: 237e6f863b, `scratch/mutation/b4-audit-match.txt`]
- [x] T008 Codex and Devin audit adapters use the shared pipeline, N07 and N08 (`codex/`, `devin/dispatch-audit-posttooluse.mjs`) [EVIDENCE: f006480388, `scratch/mutation/b5-adapter-audit.txt`]
- [x] T009 Claude with flags before `-p` meets the permission-mode check, 012 (`lib/dispatch-rule-checks.mjs`) [EVIDENCE: d5e869aaae, `scratch/mutation/b6-claude-permission.txt`]
- [x] T010 Stdin and model checks read real arguments and redirects only, N04 (`lib/dispatch-rule-checks.mjs`) [EVIDENCE: 17d2a25f4c 92e672a7c2 1db655bfe5, `scratch/mutation/b7-quoted-args.txt`, `b11-quote-blanking.txt`, `b15-pipe-count.txt`]
- [x] T011 Preflight adapters lint every resolved dispatch, N03 (`claude/`, `codex/`, `devin/dispatch-preflight-lint.mjs`) [EVIDENCE: a207f963dd, `scratch/mutation/b8-lint-every-dispatch.txt`]
- [x] T012 Pi resolves wrapped dispatches before authorization, N01 (`pi/dispatch-preflight-lint.ts`) [EVIDENCE: 7bda6731b4, `scratch/mutation/b9-pi-wrapped.txt`]
- [x] T013 Pi counts only a positive, unquoted deep-loop directive, N02 (`pi/dispatch-preflight-lint.ts`) [EVIDENCE: 2cac0da1fa 22f6b903a5, `scratch/mutation/b10-pi-directive*.txt`, `b14-pi-not.txt`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Each new test fails on the pre-change engine (`scratch/mutation/`) [EVIDENCE: every `scratch/mutation/*.txt` ends `exit 1 against the base sources`]
- [x] T015 Corpus comparison moves only commands a finding names (`scratch/corpus-diff.txt`) [EVIDENCE: `scratch/corpus-diff.txt`: 18 of 260 commands move, each from N06 (audit), N03 (packets) or N04 (four corpus strings whose escapes the extractor dropped); the real escaped commands keep their verdicts]
- [x] T016 Suites at or above baseline (`scratch/suites/final/`), Luna verdicts (`scratch/luna/`) [EVIDENCE: `scratch/suites/final/`: hooks node 840 (836), hooks vitest 401 (217), plugins 481 (481), battery 51 (51), rule-checks 42 (38), audit vitest 124 (114); Luna rounds 1-10 in `scratch/luna/`; round 10 left one known gap the base also has, recorded in implementation-summary.md]
- [x] T017 README and playbook lines that describe the changed behaviour [EVIDENCE: 1da140c77f]
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
