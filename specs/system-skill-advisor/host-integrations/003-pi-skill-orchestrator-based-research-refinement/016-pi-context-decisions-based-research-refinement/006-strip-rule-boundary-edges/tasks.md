---
title: "Tasks: Strip-Rule Boundary Edges"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "strip rule boundary edges tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Strip-Rule Boundary Edges

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

`A` is `.skilled/skills/system-skill-advisor/runtime/`. `PH` is this phase folder, `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges/`, and `SCRATCH` is `PH/scratch/`. `POLICY`, `GATES`, `BENCH` and any other `npx vitest` or `node scripts/` command run from `A`. All remaining commands run from the repository root.
- `POLICY` is `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts`.
- `GATES` is `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts`, the phase 002 T012 gate.
- `BENCH` is `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose`, the phase 003 bench.
- `COUNT` is `node SCRATCH/count-corpus-strips.mjs`, the phase 002 T003 count over the built rule plus the harder corpus.
- `PROBE` is `printf '%s' '{"prompt":"<p>"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json`.

**Who runs what.** Luna leaves write T005, T006, T008, T010 and T011, one file each, with the literal text from `plan.md` section 3. The conductor runs every other task: the baselines, the red run, the choosing procedure, the typecheck, the build, the counts, the gates, the bench, the probes, comment hygiene, the refutation pass, the summary and strict validation.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the rule before editing (`A/lib/prompt-policy.ts`). Verify: `sed -n 225,249p A/lib/prompt-policy.ts` shows `const PASTED_REPLY_CUE`, `const TASK_MARKER`, `function stripPastedReplyOnce` and `export function stripLeadingPastedReply`.
  - Evidence: lines 225-249 showed `const PASTED_REPLY_CUE`, `const TASK_MARKER`, `function stripPastedReplyOnce` and `export function stripLeadingPastedReply`.
- [x] T002 Record the corpus count baseline (`SCRATCH/count-corpus-strips.mjs`). Verify: `COUNT` prints `{"jsonl":701,"jsonlChanged":["rr-paste-208"],"harder":24,"harderChanged":[]}`.
  - Evidence: `COUNT` exit 0: `{"jsonl":701,"jsonlChanged":["rr-paste-208"],"harder":24,"harderChanged":[]}`.
- [x] T003 Record the follow-up bench baseline (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints `"N":9`, `"H":5`, `"Hsame":2` and `"collateral":19`.
  - Evidence: `BENCH` exit 0: `"N":9`, `"H":5`, `"Hsame":2`, `"collateral":19`.
- [x] T004 Record the policy test baseline (`A/tests/legacy/advisor-prompt-policy.vitest.ts`). Verify: `POLICY` exits 0 and prints its pass count.
  - Evidence: `POLICY` exit 0, 1 file, 6 of 6.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Create the shared fixture with the 17 rows in `plan.md` section 3, every row's `expected` set to the table's text (`A/tests/fixtures/pasted-reply-strip-cases.json`). Verify: `node -e 'const f=require("./A/tests/fixtures/pasted-reply-strip-cases.json");console.log(f.cases.length,new Set(f.cases.map(c=>c.id)).size)'` from the repository root prints `17 17`.
  - Evidence: Luna leaf; `cmp` against the conductor-generated JSON prints SAME, 17 rows with 17 unique ids. The leaf also added the README tree row by amendment.
- [x] T006 [P] Add the fixture-driven `describe` block and the `stripLeadingPastedReply` import (`A/tests/legacy/advisor-prompt-policy.vitest.ts`). Verify: `git diff --stat -- A/tests/legacy/advisor-prompt-policy.vitest.ts` lists one file.
  - Evidence: Luna leaf; diff matches the brief: the fixture-reading import block and one `describe` with `it.each` over the rows.
- [x] T007 Run the new test red against the shipped rule (`A/tests/legacy/advisor-prompt-policy.vitest.ts`). Verify: `POLICY` fails exactly five rows, `quote-requirement-kept`, `marker-inside-reply`, `assistant-response-header`, `quote-led-straight` and `quote-led-curly`, and every pre-existing test still passes.
  - Evidence: `POLICY` 5 failed, 18 passed: exactly `quote-requirement-kept`, `marker-inside-reply`, `assistant-response-header`, `quote-led-straight` and `quote-led-curly`.
- [x] T008 Replace `PASTED_REPLY_CUE` with the cue in `plan.md` section 3 (`A/lib/prompt-policy.ts:225`). Verify: `POLICY` fails only `marker-inside-reply`.
  - Evidence: Luna leaf; `POLICY` then failed only `marker-inside-reply` (1 failed, 22 passed).
- [x] T009 Run the choosing procedure in `plan.md` section 3, steps 1 to 4, and record each step's output and the winner (`implementation-summary.md`, Key Decisions). Verify: `node SCRATCH/candidate-rules.cjs A/scripts/routing-accuracy A/scripts/fixtures` prints one `misses=` line per candidate, and `rg -n 'Marker rule' PH/implementation-summary.md` prints one line naming first-marker or last-marker.
  - Evidence: The candidate script's cue and marker match plan section 3 character for character. Steps 1 and 2 tie: first-marker misses `markerInReply`, last-marker misses `twoMarkersUser`, each changes only `rr-paste-208` of 701 rows and 0 of 24 harder rows. Step 3: first-marker's miss routes `sk-doc` (ideal `sk-code`), last-marker's miss routes `sk-code` (ideal `sk-code`). Last-marker wins.
- [x] T010 Only if last-marker wins: replace `TASK_MARKER` and `stripPastedReplyOnce` with the last-marker text in `plan.md` section 3 (`A/lib/prompt-policy.ts:226-234`). Verify: `POLICY` fails only `two-markers-in-user-task`. If first-marker wins, mark `[x]` with the note "not needed, first-marker kept".
  - Evidence: Luna leaf; `POLICY` then failed only `two-markers-in-user-task`, received `"also update its tests."`.
- [x] T011 Record the known miss: set the missed row's `expected` to the chosen rule's actual output and add an `ideal` field with the table's text (`A/tests/fixtures/pasted-reply-strip-cases.json`). Verify: `POLICY` exits 0, and `node -e 'console.log(require("./A/tests/fixtures/pasted-reply-strip-cases.json").cases.filter(c=>c.ideal).map(c=>c.id))'` prints the one missed id.
  - Evidence: Luna leaf; the row now holds `expected` `also update its tests.` and the `ideal` text; `POLICY` exit 0, 23 of 23; the node check prints `17 [ 'two-markers-in-user-task' ]`. The same leaf added the README key-files row.
- [x] T012 Run the typecheck (`A/`). Verify: `npm --prefix A run typecheck` exits 0.
  - Evidence: `npm --prefix A run typecheck` exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rebuild the advisor runtime (`A/dist/`). Verify: `npm --prefix A run build` exits 0.
  - Evidence: `npm --prefix A run build` exit 0 at 17:39:39.
- [x] T014 Recount the corpus on the built rule (`SCRATCH/count-corpus-strips.mjs`). Verify: `COUNT` prints the T002 line unchanged.
  - Evidence: `COUNT` printed the T002 line unchanged.
- [x] T015 Run the corpus gates (`A/tests/parity/`, `A/tests/legacy/`, `A/bench/`). Verify: `GATES` exits 0.
  - Evidence: `GATES` exit 0, 11 files, 67 of 67.
- [x] T016 Only if T014 or T015 shows routing moved: rerun phase 002's recaptures T009, T010 and T011 in that order, after T013, because each script scores through `dist/` (`A/scripts/routing-accuracy/scorer-eval-baseline.json`, `A/bench/scorer-calibration-baseline.json`, `A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: each script, run from `A`, exits 0, each diff moves only the rows T014 named, and `GATES` exits 0. If nothing moved, mark `[x]` with the note "not needed, no routing moved".
  - Evidence: not needed, no routing moved: T014 unchanged and T015 green.
- [x] T017 Rerun the follow-up bench (`A/bench/scorer-calibration.bench.ts`). Verify: `BENCH` exits 0 and prints `"N":9`, `"H":5`, `"Hsame":2` and `"collateral":19`, and `test -f A/bench/scorer-calibration-baseline.json && git diff --stat -- A/bench/scorer-calibration-baseline.json` prints nothing and exits 0.
  - Evidence: `BENCH` exit 0: `"N":9`, `"H":5`, `"Hsame":2`, `"collateral":19`; `git diff --stat` on the calibration baseline printed nothing.
- [x] T018 Probe the rebuilt daemon (`A/dist/`). Restart the daemon after T013 and confirm its start time is later than the build. Verify: `PROBE` with the phase 002 probe text and with the `assistant-response-header` input each list `sk-code` first.
  - Evidence: The worktree daemon (launcher pid 31698, server pid 31863) started 17:40:11, after the 17:39:39 build. `PROBE` with the 002 probe text and with the `assistant-response-header` input both list `sk-code` first, not degraded.
- [x] T019 Check comment hygiene in the changed code (`A/lib/`, `A/tests/`). Verify: `git diff --stat -- A/lib A/tests` lists this phase's changed files, and `git diff -U0 -- A/lib A/tests | rg -n '^\+.*(N3|R[0-9]|016-|phase 0|finding)'` prints nothing and exits 1.
  - Evidence: `git diff --stat -- A/lib A/tests` lists `prompt-policy.ts`, `fixtures/README.md` and `advisor-prompt-policy.vitest.ts`, plus the untracked new fixture; the hygiene `rg` printed nothing, exit 1.
- [x] T020 Run one read-only Luna refutation pass over this phase's diff and check each finding (`implementation-summary.md`, Verification). Verify: `rg -n 'Refutation pass' PH/implementation-summary.md` prints one line with a verdict per finding.
  - Evidence: Luna `xhigh` read-only pass returned REFUTED with two findings; the conductor checked both and recorded them as known limitations 2 and 3 in `implementation-summary.md` (by design under D2, and a corpus-absent prose edge).
- [x] T021 Record the files, the marker rule, the tie-break output, `N`, `H` and `C` from T017, and the remaining miss (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PH --strict --quiet` prints `RESULT: PASSED`.
  - Evidence: summary records files, the last-marker rule, the tie-break outputs, `N` 9, `H` 5, `C` 19 and the remaining miss; strict validation below.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `POLICY` exits 0 on all 17 fixture rows, `COUNT` matches T002 and `BENCH` prints `"N":9` and `"H":5`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Refutation findings 1 to 3**: `tmp/p002-briefs/out/last-refute.txt` at the repository root
- **Phase 002 cases**: `../002-pasted-context-stripping/tasks.md` T002 and `tmp/p002-briefs/rule.cjs`
<!-- /ANCHOR:cross-refs -->

---
