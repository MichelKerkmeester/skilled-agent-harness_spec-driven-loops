---
title: "Tasks: Phase 7: dispatch-recognition-and-hard-rules"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dispatch recognition and hard rules tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: dispatch-recognition-and-hard-rules

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`L` is `.skilled/hooks/dispatch/lib`. `V` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. Test commands run from `.skilled/hooks/dispatch` unless they name a repository-root path.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every rule id and check name cli-mistral-vibe declares (`V/hard-rules.json`). Verify: `node -e "for (const r of require('./V/hard-rules.json')) console.log(r.id, r.check)"` prints one line per rule, naming `print-mode-only`, `isolated-vibe-home`, `output-dir-required`, `no-repo-root-cwd`, `vibe-closed-roster` and `stdin-redirect-required`.
- [x] T002 Record the rule-check baseline (`L/dispatch-rule-checks.test.mjs`). Verify: `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `pass 53` and `fail 0`.
- [x] T003 Confirm a Vibe dispatch resolves to no packet (`L/dispatch-audit.mjs`). Verify: `resolveDispatchPackets('vibe -p hi </dev/null')` returns `[]`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Recognize a `vibe`, `vibe-rs` or `vibe-acp` word in command position as cli-mistral-vibe, except `-v`, `--version`, `-h`, `--help`, `config`, `mcp` and `help`, in `DISPATCH_SHAPES`, `EXECUTOR_BASENAMES` and `EXECUTOR_SKILLS` (`L/dispatch-audit.mjs`). Verify: `resolveDispatchPackets` names `cli-mistral-vibe` for `vibe -p hi </dev/null`, `vibe --prompt-file p.md </dev/null`, a bare `vibe`, `vibe-rs -p hi </dev/null` and `vibe-acp`, returns `[]` for `vibe --version`, `vibe config schema` and `rg -c vibe file`, and still names `cli-pi` for `pi --offline -p hi </dev/null`.
- [x] T005 Add the Vibe print shape to `HEADLESS_DISPATCH_SHAPES` once phase 005 lists `stdin-redirect-required` among its rules (`L/dispatch-rule-checks.mjs`). Verify: `CHECKS['stdin-redirect-required']('vibe -p hi')` returns `false`, the same command with `</dev/null` returns `true`, and a test pins the verdict on `opencode run x </dev/null && vibe -p hi`.
- [x] T006 Add the `print-mode-only` check (`L/dispatch-rule-checks.mjs`). Verify: it returns `false` for a bare `vibe` and for `vibe-acp`, and `true` for `vibe -p hi </dev/null`. Whether `vibe --prompt-file` without `-p` passes follows phase 004's answer.
- [x] T007 Add the `isolated-vibe-home` check (`L/dispatch-rule-checks.mjs`). Verify: it returns `false` for no `VIBE_HOME`, for `VIBE_HOME=~/.vibe` and for a `VIBE_HOME` inside the checkout, and `true` for a `VIBE_HOME` under a temporary directory.
- [x] T008 Add the `output-dir-required` check (`L/dispatch-rule-checks.mjs`). Verify: it returns `false` for a `vibe -p` command with no `--output-dir` and `true` with `--output-dir` set outside the checkout.
- [x] T009 Add the Vibe roster check as `vibe-closed-roster` (`L/dispatch-rule-checks.mjs`). Verify: it returns `false` with no `--model` and with an alias missing from `V/references/providers-and-models.md`, `true` for each roster alias that file lists, and the dsh `closed-roster` cases still pass.
- [x] T010 Add the `no-repo-root-cwd` check (`L/dispatch-rule-checks.mjs`). Verify: it returns `false` when the shell's directory or `--workdir` is the repository root, and `true` for a scratch directory.
- [x] T011 Assert that every cli-mistral-vibe rule names a known check that is not `closed-roster` (`L/dispatch-rule-checks.test.mjs`). Verify: the test passes on `V/hard-rules.json` and fails on a copy whose first rule names a missing check or `closed-roster`.
- [x] T012 Add a refusing and an accepting `evaluateDispatch` case per rule (`L/dispatch-rule-checks.test.mjs`). Verify: each refusing case returns its own rule id and each accepting case returns `[]`.
- [x] T013 Add recognition cases for each dispatch form and each session-free form in T004 (`L/dispatch-audit.test.mjs`). Verify: the dispatch cases fail on the T003 tree and pass after T004, and the session-free cases return `[]` on both trees.
- [x] T014 Add one row per new check to the check table (`.skilled/hooks/dispatch/README.md`). Verify: `rg -c 'vibe' .skilled/hooks/dispatch/README.md` prints a number at least as large as the count of new checks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the rule-check suites (`L/dispatch-rule-checks.test.mjs`). Verify: `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `fail 0` and a pass count above 53.
- [x] T016 Run the recognition suite (`L/dispatch-audit.test.mjs`). Verify: `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` prints `1 passed (1)` and more than 128 tests.
- [x] T017 Pass the documented dispatch from cli-mistral-vibe's skill through the preflight (`V/SKILL.md`). Verify: `evaluateDispatch(<documented command>, '.skilled/skills')` returns `[]`.
- [x] T018 Pass the session-free commands through the preflight (`L/dispatch-rule-checks.test.mjs`). Verify: `evaluateDispatch` returns `[]` for `vibe --version`, `vibe --help`, `vibe config schema` and `vibe mcp list`.
- [x] T019 Confirm no existing case changed (`L/dispatch-rule-checks.test.mjs`). Verify: `git diff -U0 -- .skilled/hooks/dispatch/lib/*.test.mjs .skilled/hooks/dispatch/tests | rg '^-[^-]'` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every cli-mistral-vibe rule refuses its own violating command
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
