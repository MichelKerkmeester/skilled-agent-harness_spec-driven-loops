---
title: "Tasks: Pasted-Context Stripping Before Scoring"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "pasted context stripping tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Pasted-Context Stripping Before Scoring

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

`A` is `.skilled/skills/system-skill-advisor/runtime/`. `PROBE` is the Measured Behavior command in `spec.md`, run from the repository root. `GATES` is `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts`, run from `A`.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rebuild the runtime if the CLI reports a stale build (exit 69), then re-run the probe pair before any change (`spec.md`). Verify: `PROBE` prints `sk-code` first on line 1 and `sk-doc` first on line 2.
  - Evidence: line 1 `sk-code 0.82` first, line 2 `sk-doc 0.9268` first (sending session, 2026-11-18).
- [x] T002 Design step: write the smallest stripping rule and why it is smallest (`implementation-summary.md`, Key Decisions). The candidate is a leading span that opens with a reported-speech cue (such as `you replied:` or `you said:`) or a quote, and ends at a task marker (such as `Now:`). Stripping only the advisor's own output lines is ruled out, because the probe holds no advisor line. Verify: the rule, applied in a `node -e` one-liner, turns the probe prompt and a `You said:` variant into `Refactor the session store module to remove duplicated locking code`, and applied a second time returns its input unchanged. The same one-liner returns three inline negatives unchanged: a task with a quoted cue inside it (`Fix the parser so a line with "you said:" in it is kept`), a task with `Now:` mid-sentence (`Refactor the timer so the label Now: shows the current time`) and a cue with no marker (`You said: the build is green, so commit it`). It turns a nested paste (`Earlier you replied: You said: run the tests. Now: Refactor the session store module to remove duplicated locking code`) into the plain task in one pass. Key Decisions states that one pass is enough, because the rule strips through the first task marker and a second pass finds no leading cue.
  - Evidence: `tmp/p002-briefs/rule.cjs` turns the probe, the `You said:` variant and the nested paste into the task, leaves the negatives unchanged, and every output is idempotent. Deviation: the function repeats until stable instead of one pass, so the handler call and the scorer call agree; recorded in `implementation-summary.md` Key Decisions.
- [x] T003 Count existing corpus prompts the rule matches (`A/scripts/routing-accuracy/*.jsonl`, `A/scripts/fixtures/*.jsonl`). Verify: the same one-liner over every prompt field prints 0 matches, or the summary lists each match with its reviewed outcome.
  - Evidence: 0 of 700 existing prompts change; after T008, 1 of 701 (the new row).
- [x] T004 Confirm the placement before editing code (`A/handlers/advisor-recommend.ts`, `A/lib/scorer/lanes/semantic-shadow.ts`). Score the stripped probe text in-process with `scoreAdvisorPrompt`, and re-read the embedding lookup at `semantic-shadow.ts:249` and `:328`. Verify: the top skill is `sk-code`, and the lookup still compares the stored prompt with the scored prompt by equality, which is why the handler must strip before it embeds.
  - Evidence: confirmed in the sending session; handler lines 16, 533-536, 569 and 582 and `fusion.ts:1274` matched before wave 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the rule as one exported function next to `shouldFireAdvisor`, exported so phase 003's guard and bench can import it (`A/lib/prompt-policy.ts`). Verify: `npm --prefix A run typecheck` exits 0, and `rg -n '^export function' A/lib/prompt-policy.ts` lists the new function.
  - Evidence: Luna leaf 1; `npm run typecheck` exit 0; `rg` lists `export function stripLeadingPastedReply`.
- [x] T006 Call the function at the entry of `scoreAdvisorPrompt`, before `prompt.toLowerCase()` at `:1278`, and score the result (`A/lib/scorer/fusion.ts`). Verify: `npm --prefix A run typecheck` exits 0.
  - Evidence: Luna leaf 2; typecheck exit 0; `rg` prints 2 lines in `fusion.ts`.
- [x] T007 Strip `input.prompt` once in `computeRecommendationOutput` and pass the result to `withSemanticShadowPromptEmbedding`, the cache key and `scoreAdvisorPrompt` (`A/handlers/advisor-recommend.ts`). Verify: `npm --prefix A run typecheck` exits 0 and `git diff --stat -- A/lib A/handlers` lists only `prompt-policy.ts`, `fusion.ts` and `advisor-recommend.ts`.
  - Evidence: Luna leaf 3; typecheck exit 0; `git diff --stat -- A/lib A/handlers` lists only the three planned files. The leaf split the scorer call over several lines because the brief's `rg -c` count was wrong for the one-line form; behavior is unchanged.
- [x] T008 Add one row with the probe's pasted prompt, using the next free `rr-` id and the fields every row carries: `bucket` `true_write`, `source_type` `synthetic-realistic`, `gate3_triggers` `yes`, `gate3_reason_category` `file_write`, `skill_top_1` `sk-code`, `skill_correct` `yes` and a short `notes` (`A/scripts/routing-accuracy/labeled-prompts.jsonl`). Verify: `wc -l` on the file prints 196, and the row parses with `node -e` and `JSON.parse`.
  - Evidence: Luna leaf 4; `wc -l` prints 196; the row parses as JSON.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Recapture the ratchet baseline (`A/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` exits 0, and `git diff` on the file shows the new corpus hash, totals up by one and `full_corpus_top1.correct` up by one, nothing else.
  - Evidence: needs `npm run build` first, because the script scores through `dist/`. After the build: exit 0, total 196, correct 161; diff holds only hash, sha and counts.
- [x] T010 Rewrite the calibration baseline (`A/bench/scorer-calibration-baseline.json`). Verify: `SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE=1 SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts` exits 0, and `git diff` shows the new hash, 196 rows and Brier and ECE moved by one row's weight.
  - Evidence: exit 0. The committed baseline was stale (200 rows, April), so the file diff is wider than one row; the isolated 195-to-196 effect is Brier 0.215213 to 0.21428 and ECE 0.137733 to 0.136112.
- [x] T011 Run the divergence ratchet and recapture its ledger only if it names the new row (`A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0, and any ledger diff adds only the new row's entry.
  - Evidence: first run named only `rr-paste-208`; capture added it with nothing resolved or changed; reason rewritten honestly; `scoringInstant` moves to 2026-11-18 because the ratchet requires it; 9 of 9 pass.
- [x] T012 Run every corpus gate (`A/tests/parity/`). Verify: `GATES` exits 0.
  - Evidence: `GATES` exit 0, 67 of 67, after the operator-approved amendment that moved the `advisor-corpus-parity.vitest.ts` size pin from 195 to 196.
- [x] T013 Rebuild and re-run the probe pair (`A/dist/`). Confirm the daemon answering the probe started after the build. Run three probes from the repository root, in this order. Verify: `npm --prefix A run build` exits 0, then:
  - Semantic lane, first. No vitest gate can see a wrong placement, so this probe is the only check. It runs before `PROBE` and before any plain-task run, so the answer is scored fresh and not served from the stripped prompt's cache entry: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code","options":{"includeAttribution":true}}' --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s).data.recommendations.find(x=>x.skillId==="sk-code");console.log((r.laneContributions.find(l=>l.lane==="semantic_shadow")||{rawScore:0}).rawScore)})'` prints a value above 0. The same command on the plain task is the control. If the control also prints 0, the lane is off in this daemon and the check proves nothing; record that in `implementation-summary.md`.
  - Probe pair. `PROBE` prints `sk-code` first on both lines.
  - Compiled route. Run `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "$p" --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const r of JSON.parse(s).data.recommendations)console.log(r.skillId+" "+JSON.stringify(r.compiledRoute??null))})'` once with `p` set to `Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code` and once with `p` set to the plain task. Verify: both runs print the same `compiledRoute` values. If the pasted run shows a route the plain run lacks, record it as a follow-up in `implementation-summary.md`. This phase does not fix it.
  - Evidence: build exit 0; daemon started 14:56:58 after the 14:53:15 build on socket dir `/tmp/sa474`. Semantic lane prints 0 on the pasted probe and on the control, so it is off and proves nothing. `PROBE` prints `sk-code` first on both lines. Compiled route differs (pasted `route` to `sk-code-review`, plain `defer`); recorded as a follow-up.
- [x] T014 Check comment hygiene in the changed code (`A/lib/`, `A/handlers/`). Verify: `git diff -U0 -- A/lib A/handlers | rg -n '^\+.*(N3|R[0-9]|016-|phase 0)'` prints nothing.
  - Evidence: `rg` printed nothing (exit 1).
- [x] T015 Record the files, the rule and every command output (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
  - Evidence: summary records files, rule, every command output and the refutation verdicts; strict validation below.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `PROBE` prints `sk-code` first on both lines and `GATES` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/review-overengineering-opus-high.md`, Orchestrator Verification
<!-- /ANCHOR:cross-refs -->

---
