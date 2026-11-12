---
title: "Tasks: Phase 16: local-test-timing-profile"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "local test timing profile tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: local-test-timing-profile

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

Four shell variables keep the verify commands short. Set all four from the repository root before running a task: `S=.skilled/skills/system-spec-kit/runtime`, `A=.skilled/skills/system-skill-advisor/runtime`, `D=.skilled/skills/system-deep-loop/runtime` and `T=specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile/scratch/local-test-timings.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the spec-kit command the lane declares (`$S/package.json`). Verify: `node -p "require('./.skilled/skills/system-spec-kit/runtime/package.json').scripts.test"` prints `node scripts/run-tests.mjs`.
- [ ] T002 Confirm the advisor command the suite declares (`$A/package.json`). Verify: `node -p "require('./.skilled/skills/system-skill-advisor/runtime/package.json').scripts.test"` prints `vitest run`.
- [ ] T003 Confirm the deep-loop command the suite declares (`$D/package.json`). Verify: `node -p "require('./.skilled/skills/system-deep-loop/runtime/package.json').scripts.test"` prints `vitest run --no-coverage`.
- [ ] T004 Create the timing record with its run conditions and table header (`$T`). The header names the date, the Node version `node --version` prints, one run per suite, that no other vitest process was running, that wall seconds are `/usr/bin/time -p` real including npm startup, and that exit 0 is pass and any other status is fail. Verify: `rg -c '^\| Runtime \| Command \| Wall seconds \| Exit \|$' "$T"` prints `1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Time the spec-kit suite once and write its row (`$T`). Run `(cd "$S" && /usr/bin/time -p npm test); printf 'exit=%s\n' $?` after confirming `pgrep -fl vitest` prints nothing, then write `| .skilled/skills/system-spec-kit/runtime | npm test | <real seconds> | <exit status> |`. Verify: `rg -c '^\| \.skilled/skills/system-spec-kit/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' "$T"` prints `1`.
- [ ] T006 Time the advisor suite once and write its row (`$T`). Run `(cd "$A" && /usr/bin/time -p npm test); printf 'exit=%s\n' $?` after confirming `pgrep -fl vitest` prints nothing, then write `| .skilled/skills/system-skill-advisor/runtime | npm test | <real seconds> | <exit status> |`. Verify: `rg -c '^\| \.skilled/skills/system-skill-advisor/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' "$T"` prints `1`.
- [ ] T007 Time the deep-loop suite once and write its row (`$T`). Run `(cd "$D" && /usr/bin/time -p npm test); printf 'exit=%s\n' $?` after confirming `pgrep -fl vitest` prints nothing, then write `| .skilled/skills/system-deep-loop/runtime | npm test | <real seconds> | <exit status> |`. Verify: `rg -c '^\| \.skilled/skills/system-deep-loop/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' "$T"` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm the record holds one complete row per runtime (`$T`). Verify: `rg -c '^\| \.skilled/skills/(system-spec-kit|system-skill-advisor|system-deep-loop)/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' "$T"` prints `3`.
- [ ] T009 Confirm the record holds exactly three data rows and no other (`$T`). Verify: `rg -c '^\| \.skilled/skills/' "$T"` prints `3`.
- [ ] T010 Confirm the three runs changed no tracked file (`$S`). Verify: `git status --porcelain --untracked-files=no -- "$S" "$A" "$D" | wc -l` prints `0`.
- [ ] T011 Record the three measurements and the commands that produced them in `implementation-summary.md`, one row per runtime. Verify: `rg -c 'system-spec-kit/runtime|system-skill-advisor/runtime|system-deep-loop/runtime' specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile/implementation-summary.md` prints `3`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `$T` holds one row per runtime with its command, wall seconds and exit status: `rg -c '^\| \.skilled/skills/(system-spec-kit|system-skill-advisor|system-deep-loop)/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' "$T"` prints `3`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile --strict --quiet` prints `RESULT: PASSED`
- [ ] `implementation-summary.md` names the three measured commands and their results
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
