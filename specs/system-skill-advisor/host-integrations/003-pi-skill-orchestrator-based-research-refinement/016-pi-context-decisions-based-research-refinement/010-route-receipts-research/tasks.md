---
title: "Tasks: Route Receipts Research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "route receipts research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Route Receipts Research

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

`A` is `.skilled/skills/system-skill-advisor/runtime/`. `R` is this phase's `research/` folder. `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose`, run from `A`.

Every task here is a conductor task. This phase has no Luna leaves, because it changes no code. The research iterations run on the cli-claude-code executor named in `plan.md`.

Tasks T007 to T011 run only when T005 records the over-suppresses branch. On the no-guard branch they are marked `[x]` with the note "not run, Q0 took the no-guard branch". T006 runs only on the no-guard branch. On the over-suppresses branch it is marked `[x]` with the note "not needed, Q0 took the over-suppresses branch".
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 006 to 009 are done, since Q0 must measure the final strip rule and the research must read the hook after its last edit (`../006-strip-rule-boundary-edges/tasks.md` to `../009-crash-fallback-edge-cases/tasks.md`). Verify: `grep -c '^- \[ \] T[0-9]' ../00[6-9]-*/tasks.md` prints `:0` for all four files. Evidence: All four print `:0`.
- [x] T002 Rebuild the advisor runtime so the in-process probes read current code (`A/dist/`). Verify: `npm --prefix A run build` exits 0, and `git rev-parse --short HEAD` prints the commit recorded in T005. Evidence: Build exit 0 at `18ce562e8b3`.
- [x] T003 Q0: run the follow-up bench once on the final strip rule (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints one `advisor-scorer-calibration` line with a `collateral` count and one `advisor-follow-up-routing` line with `"N":9`. Evidence: Exit 0; `N=9`, `C=19`, `Tests 1 passed (1)`.
- [x] T004 Q0: read the policy reason from each raw follow-up with a one-off probe on `dist/`, as in `spec.md` Measured Behavior, and count raw-text `H` with the same guarded test the bench uses at `A/bench/scorer-calibration.bench.ts:232-233` (`A/dist/runtime/lib/prompt-policy.js`). Verify: the probe prints nine lines, one reason per follow-up, and no file under `A` changes (`git status --short -- A` prints nothing). Evidence: Nine reasons printed; raw-text `H=4`; `git status --short -- A` printed nothing.
- [x] T005 Q0: record `N`, stripped-text `H`, raw-text `H`, `Hsame`, `C`, the `C` row ids, the commit and the branch, decided on the stripped-text `H` by 003's rule: `H >= 5` and `C > 0` is over-suppresses, `H < 5` is no guard (`implementation-summary.md`). Verify: `rg -n 'Q0 branch' implementation-summary.md` prints one line naming over-suppresses or no guard. Evidence: `Q0 branch: over-suppresses` recorded.
- [ ] T006 Only on the no-guard branch: stop, tell the operator the Q0 numbers and ask whether phase 011 closes as not built (`implementation-summary.md`). Verify: `rg -n 'Operator decision' implementation-summary.md` prints one line, and `ls R/deep-research-state.jsonl` fails because the file does not exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Run `/deep:research:auto` for 3 iterations on the second account with the flags in `plan.md` section 4 (`R/deep-research-config.json`). Verify: `node -e 'const c=require("./R/deep-research-config.json").executor;console.log(c.kind,c.model,c.reasoningEffort,c.configDir)'` prints `cli-claude-code claude-opus-5-5 high /Users/michelkerkmeester/.claude-account2`.
- [ ] T008 Let the loop write its synthesis (`R/research.md`). Verify: `rg -n '^#+ .*Q[1-5]' R/research.md` prints a heading for each of Q1 to Q5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Count the iteration records (`R/deep-research-state.jsonl`). Verify: `rg -c '"type":"iteration"' R/deep-research-state.jsonl` prints 3.
- [ ] T010 Confirm Q5 froze literal values: the harness, the success threshold on the nine pairs, the false-carry prompt pair and its expected route (`R/research.md`). Verify: `rg -n 'false-carry' R/research.md` prints at least one line that quotes both prompts and names the expected skill.
- [ ] T011 Re-check every citation behind a recommended design (`R/research.md`). Verify: the verification note lists each one as resolved or failed, with none unchecked.
- [ ] T012 Confirm the run wrote nothing outside this phase (`git`). Verify: `git status --short` lists no run-made change outside `010-route-receipts-research/`.
- [ ] T013 Record the outcome and validate this phase (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T006 or T007 to T011 noted as not run, depending on the Q0 branch
- [ ] No `[B]` blocked tasks remaining
- [ ] `implementation-summary.md` names the Q0 branch, and on the over-suppresses branch `R/research.md` answers Q1 to Q5 with every cited line re-checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/review-fable-5-2.md` N4 and `../001-deep-research/research/review-overengineering-opus-high.md` Group 1
- **Build**: See `../011-route-receipts-build/spec.md`, whose T001 applies this phase's amendment
<!-- /ANCHOR:cross-refs -->

---
