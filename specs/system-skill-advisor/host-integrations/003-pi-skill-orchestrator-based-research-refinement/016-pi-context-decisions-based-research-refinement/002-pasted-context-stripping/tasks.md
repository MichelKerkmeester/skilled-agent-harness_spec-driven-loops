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

- [ ] T001 Rebuild the runtime if the CLI reports a stale build (exit 69), then re-run the probe pair before any change (`spec.md`). Verify: `PROBE` prints `sk-code` first on line 1 and `sk-doc` first on line 2.
- [ ] T002 Design step: write the smallest stripping rule and why it is smallest (`implementation-summary.md`, Key Decisions). The candidate is a leading span that opens with a reported-speech cue (such as `you replied:` or `you said:`) or a quote, and ends at a task marker (such as `Now:`). Stripping only the advisor's own output lines is ruled out, because the probe holds no advisor line. Verify: the rule, applied in a `node -e` one-liner, turns the probe prompt and a `You said:` variant into `Refactor the session store module to remove duplicated locking code`, and applied a second time returns its input unchanged. The same one-liner returns three inline negatives unchanged: a task with a quoted cue inside it (`Fix the parser so a line with "you said:" in it is kept`), a task with `Now:` mid-sentence (`Refactor the timer so the label Now: shows the current time`) and a cue with no marker (`You said: the build is green, so commit it`). It turns a nested paste (`Earlier you replied: You said: run the tests. Now: Refactor the session store module to remove duplicated locking code`) into the plain task in one pass. Key Decisions states that one pass is enough, because the rule strips through the first task marker and a second pass finds no leading cue.
- [ ] T003 Count existing corpus prompts the rule matches (`A/scripts/routing-accuracy/*.jsonl`, `A/scripts/fixtures/*.jsonl`). Verify: the same one-liner over every prompt field prints 0 matches, or the summary lists each match with its reviewed outcome.
- [ ] T004 Confirm the placement before editing code (`A/handlers/advisor-recommend.ts`, `A/lib/scorer/lanes/semantic-shadow.ts`). Score the stripped probe text in-process with `scoreAdvisorPrompt`, and re-read the embedding lookup at `semantic-shadow.ts:249` and `:328`. Verify: the top skill is `sk-code`, and the lookup still compares the stored prompt with the scored prompt by equality, which is why the handler must strip before it embeds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the rule as one exported function next to `shouldFireAdvisor`, exported so phase 003's guard and bench can import it (`A/lib/prompt-policy.ts`). Verify: `npm --prefix A run typecheck` exits 0, and `rg -n '^export function' A/lib/prompt-policy.ts` lists the new function.
- [ ] T006 Call the function at the entry of `scoreAdvisorPrompt`, before `prompt.toLowerCase()` at `:1278`, and score the result (`A/lib/scorer/fusion.ts`). Verify: `npm --prefix A run typecheck` exits 0.
- [ ] T007 Strip `input.prompt` once in `computeRecommendationOutput` and pass the result to `withSemanticShadowPromptEmbedding`, the cache key and `scoreAdvisorPrompt` (`A/handlers/advisor-recommend.ts`). Verify: `npm --prefix A run typecheck` exits 0 and `git diff --stat -- A/lib A/handlers` lists only `prompt-policy.ts`, `fusion.ts` and `advisor-recommend.ts`.
- [ ] T008 Add one row with the probe's pasted prompt, using the next free `rr-` id and the fields every row carries: `bucket` `true_write`, `source_type` `synthetic-realistic`, `gate3_triggers` `yes`, `gate3_reason_category` `file_write`, `skill_top_1` `sk-code`, `skill_correct` `yes` and a short `notes` (`A/scripts/routing-accuracy/labeled-prompts.jsonl`). Verify: `wc -l` on the file prints 196, and the row parses with `node -e` and `JSON.parse`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Recapture the ratchet baseline (`A/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` exits 0, and `git diff` on the file shows the new corpus hash, totals up by one and `full_corpus_top1.correct` up by one, nothing else.
- [ ] T010 Rewrite the calibration baseline (`A/bench/scorer-calibration-baseline.json`). Verify: `SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE=1 SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts` exits 0, and `git diff` shows the new hash, 196 rows and Brier and ECE moved by one row's weight.
- [ ] T011 Run the divergence ratchet and recapture its ledger only if it names the new row (`A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0, and any ledger diff adds only the new row's entry.
- [ ] T012 Run every corpus gate (`A/tests/parity/`). Verify: `GATES` exits 0.
- [ ] T013 Rebuild and re-run the probe pair (`A/dist/`). Confirm the daemon answering the probe started after the build. Run three probes from the repository root, in this order. Verify: `npm --prefix A run build` exits 0, then:
  - Semantic lane, first. No vitest gate can see a wrong placement, so this probe is the only check. It runs before `PROBE` and before any plain-task run, so the answer is scored fresh and not served from the stripped prompt's cache entry: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code","options":{"includeAttribution":true}}' --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s).data.recommendations.find(x=>x.skillId==="sk-code");console.log((r.laneContributions.find(l=>l.lane==="semantic_shadow")||{rawScore:0}).rawScore)})'` prints a value above 0. The same command on the plain task is the control. If the control also prints 0, the lane is off in this daemon and the check proves nothing; record that in `implementation-summary.md`.
  - Probe pair. `PROBE` prints `sk-code` first on both lines.
  - Compiled route. Run `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "$p" --format json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const r of JSON.parse(s).data.recommendations)console.log(r.skillId+" "+JSON.stringify(r.compiledRoute??null))})'` once with `p` set to `Earlier you replied: I ran /deep:review on the hook changes. Now: Refactor the session store module to remove duplicated locking code` and once with `p` set to the plain task. Verify: both runs print the same `compiledRoute` values. If the pasted run shows a route the plain run lacks, record it as a follow-up in `implementation-summary.md`. This phase does not fix it.
- [ ] T014 Check comment hygiene in the changed code (`A/lib/`, `A/handlers/`). Verify: `git diff -U0 -- A/lib A/handlers | rg -n '^\+.*(N3|R[0-9]|016-|phase 0)'` prints nothing.
- [ ] T015 Record the files, the rule and every command output (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `PROBE` prints `sk-code` first on both lines and `GATES` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/review-overengineering-opus-high.md`, Orchestrator Verification
<!-- /ANCHOR:cross-refs -->

---
