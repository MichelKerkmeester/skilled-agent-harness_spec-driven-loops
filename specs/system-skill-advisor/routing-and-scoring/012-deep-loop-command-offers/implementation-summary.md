---
title: "Implementation Summary"
description: "A request that asks for the loop itself now gets the deep-loop command, and the AI offers it as one question with the flags filled in."
trigger_phrases:
  - "deep loop command offers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers"
    last_updated_at: "2026-11-24T19:01:17Z"
    last_updated_by: "generate-context"
    recent_action: "Tenth fix round committed, docs at the final tree"
    next_safe_action: "Rerun the traceability review at 7 iterations per lineage so T084 and AC-040 can close"
    packet_purpose: "Purpose: A deep-loop command is offered when, and only when, the request asks for the loop itself."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"
      - "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:7220985625e3d464b944bb777a267782f32dc6e88eba4dd057714755b390db4f"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "520c649a-ce93-4135-91b0-cec71dd35a54"
      workspace: "/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review"
      savedAt: "2026-11-24T11:14:31Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-deep-loop-command-offers |
| **Completed** | 2026-11-23, closed again after the fresh-review round; reopened 2026-11-24 for the sixth fix round (`tasks.md` T066 to T085), again for the seventh fix round (`tasks.md` T086 and T087), again for the eighth (`tasks.md` T088 to T093), which fixes the four code findings of the second traceability rerun at `2520456bd3f`, again for the ninth (`tasks.md` T094 to T101), which fixes the third rerun's code findings at `3db3085bcf0` and `5ace62e10e6`, and again for the tenth (`tasks.md` T102 to T105), which fixes the fourth rerun's parity gap and reducer numbering at `9f1190407eb` and moves closure evidence to name-based citations, with the traceability review rerun (T084) still open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ask for a loop in plain words, such as "run 8 more review iterations with cli-codex" or "start a research loop on caching", and the advisor now attaches `/deep:review` or `/deep:research`. Before, it attached a command only when the request said "deep research" or "deep review". Depth words alone, such as "thorough" or "in depth", no longer offer a loop.

### Offer the right deep-loop command and flags from explicit loop wording

The command gate now reads loop wording instead of depth wording. That means:
- a deep loop by name
- an iteration count
- iterations, or multiple, several or many passes
- a typed command

A deferred hub route now picks its mode when the prompt asks for a loop and carries exactly one mode cue. Once the command arrives, its presentation file shows how to offer it. The offer is one question through the question tool, with three options:
- A, recommended: run `:auto` with the composed flags and `--spec-folder`
- B: `:confirm`
- C: no loop

A table maps request signals to flags. The executor stays native unless the request names one. Setup now goes through the question tool, with the recommended options marked. A completed or stuck run names `--extend=N`, `--restart` and `/doctor:deep-loop` instead of dead-ending.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | `LOOP_WORDING`, `LOOP_NAMES`, `LOOP_REQUEST`, `MODE_CUES`, `deferredLoopCommand` |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Loop wording beside investigate, look into or audit scores the hub; an iteration count pushes sk-code down on a review; council and depth boosts removed |
| `.skilled/skills/system-skill-advisor/runtime/tests/` (3 files) | Modified | Cases for the flips, the depth-only losses and the near-misses |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | Modified | Six near-miss rows and three fresh holdout rows |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Modified | Recaptured |
| `.skilled/skills/system-skill-advisor/{runtime/lib/README.md, feature-catalog, manual-testing-playbook}` | Modified | Describe the loop-wording gate |
| `.skilled/commands/deep/research.md`, `review.md` | Modified | Step 0 points to the offer section |
| `.skilled/commands/deep/assets/deep-*-presentation.txt` | Modified | Offer section, question-tool setup, recommended options, `=` examples, extend and doctor next steps |
| `.skilled/commands/deep/assets/deep-*.yaml` | Modified | The completed-packet message names `--extend` and `--restart`, plus new next steps |
| `.skilled/commands/deep/assets/legacy/*.body.markdown`, `assets/compiled/*` | Modified | Step 0 in the base bodies; contracts recompiled |
| `.skilled/skills/system-deep-loop/{SKILL.md, ROUTER.md, hub-router.json, graph-metadata.json}` | Modified | Doctor pointer; the "iterative research" and "multi-round research" aliases |
| `.skilled/skills/system-deep-loop/deep-research/`, `deep-review/` | Modified | Depth-only triggers removed, Gate 2 lines and command spacing fixed, `=` flags |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Modified | Regenerated |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Fresh-review round: the Python copy of the refusal, subject, symptom and typed-command rules |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` and both suites | Modified | Fresh-review round: 35 new shared cases and the `typedReviewKept` check |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | Fresh-review round: the refusal rule as built, the brief options and the final counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only analysis ran first: 84 live advisor probes, saved in `scratch/routing-analysis.md`. The operator then chose the decisions in `scratch/decisions.md`. Seven workers did the build, each running Opus at medium effort through `claude -p` on the operator's first Claude account, in worktree `worktrees/516-deep-loop-command-offers`:
- packet docs
- advisor code
- command docs
- hub routing
- doc drift
- follow-ups
- fresh holdouts

Each worker changed only its own files and ran its own checks. The orchestrator reviewed each diff, reran the whole suites and the probes from the final tree, and committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Explicit loop asks only, replacing the depth-wording rule from packet 008 | "thorough" asks for care in one pass, not a multi-iteration run that spends money |
| A yes runs `:auto` with the composed flags | The operator answers once instead of twice |
| Native executor unless the request names one | That is the command's own default, and fan-out needs named executors |
| The advisor carries only the command, never the flags | Flag knowledge stays in the command's contract, where it is maintained |
| "autonomous research" alias dropped | Its out-of-domain replay pulled a slide-deck prompt to the hub |
| Three holdout rows replaced by a worker that never saw the tuned probes | The analysis had read the old ones |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor `npm test` after `npm run build` | 178 files, 2469 passed, 4 skipped, 0 failed (baseline 2450 passed) |
| Deep-loop runtime `npm test` | 222 files, 4039 passed, 11 skipped, 0 failed |
| 84 probes rerun against their pre-change baseline | 11 top results changed. Gained the command: E1, E3, F2, V6, H1a, H1b, H7, H10. R7 lost it (depth wording, intended). H3b no longer misroutes to the hub. K2 now tops the hub. No negative changed |
| Routing corpus, recaptured | `false_offer` 2 of 41; the two are new near-miss rows that are false offers by construction, and the 35 earlier rows stay at 0. Fresh deep holdouts 1 of 2 |
| `sync-runtime-mirrors.cjs --check` | PASS: 260 mirrors across 10 trees |
| `check-contract-drift.cjs`, `check-documentation-drift.cjs`, agent mirror sync, command catalog mirror | All OK, exit 0 |
| `parent-skill-check.cjs .skilled/skills/system-deep-loop` | OK, 0 warnings |
| `validate-command-references.cjs` | 1 failure, already there before this work: `speckit-resume.yaml:104` names a gitignored telemetry file that a fresh worktree lacks |
| After D10: advisor `npm test` | 179 files, 2497 passed, 4 skipped, 0 failed |
| After D10: probe rerun against the first landing | 7 changes, all intended: V4 gains `/deep:review`; F7, F10 and D1 get `/doctor:deep-loop`; N7 and N9 lose their false offers; R5 is unchanged |
| After D10: corpus | `false_offer` 0 of 45 |
| Second round: advisor `npm test` | 179 files, 2502 passed, 4 skipped, 0 failed; `false_offer` 0 of 45; blind deep holdouts 1 of 2 attached, doctor holdout missed |
| Third round: advisor `npm test` | 179 files, 2532 passed, 4 skipped, 0 failed; `false_offer` 0 of 45; blind -04 holdouts 2 of 3 live |
| Fourth round: advisor `npm test` | 180 files, 2619 passed, 4 skipped, 0 failed. One run before it failed two process-timing tests (`skill-advisor-launcher-orphan-reaping`, `directive-lifecycle`), which passed 3 of 3 alone and in the clean rerun. Python suite pass=130, fail=0 with 63 fixture cases. TypeScript and Python predicates agree on 72 prompts |
| Fourth round: live probes | 31 review-fix probes and 14 G and R probes all match their expected outcome (`scratch/probes/review-fix-r4.json`, `review-fix-g-r4.json`), and the 31 are unchanged from `review-fix-final.json` |
| Fourth round: deep-loop runtime `npm test` | 222 files, 4039 passed, 11 skipped, 0 failed. A first run alongside other work failed one 15 ms timing test in `fanout-pool.vitest.ts`, which passed 3 of 3 alone and in the full rerun |
| Fourth round: corpora and drift | Command-routing baseline and scorer eval baseline recaptured without `--write`: 0 differences apart from the capture SHA. Contract drift, documentation drift, mirror sync (260) and command catalog mirror all OK |
| Closure pass: spec-baseline probe | `scratch/probes/results-after.json`, 69 lines, all `exit 0 live`. Every gain, no-gain, keep and negative row matches `acceptance-criteria.md`. Stage-one rows: R2 tops `system-spec-kit` with `/deep:research` second, V2, V4 and H10 top the hub with `/deep:review`, H7 with `/deep:research`. N9 and H3b carry no deep command |
| Closure pass: advisor suite | `npm run build` exit 0, then 180 files, 2619 passed, 4 skipped, 0 failed. Three depth words gained gate cases ("thoroughly", "exhaustive", "deep dive"), and the two gate files report 294 passed. Mirror sync passes 260 mirrors, and command references resolve across 84 asset files |
| Closure pass: corpus | Recapture equals the committed baseline apart from the capture fields. Over the 35 rows that existed before the packet, `false_offer` 0 and `false_offer_attached` 0, as before the code change. Over the 22 new silent rows, `false_offer` 0, and one attached offer: `nm-system-deep-loop-05` (V7) carries `/create:manual-testing-playbook` |
| Closure pass: alias replay | K2 tops the hub on the research route. Out-of-domain replays in `scratch/probes/results-ac017-ood.json`: three stay off the hub, and "write a memo on multi-round research funding for the grant committee" tops it with no command (ADR-002, accepted: the alias stays) |
| Final rerun on `958fa817187` | Advisor `npm run build` exit 0, then 180 files, 2622 passed, 4 skipped, 0 failed. The 69 spec-baseline probes, rerun in the worktree and in the primary checkout (`scratch/probes/results-final-958fa81-worktree.json`, `results-final-958fa81-primary.json`), keep every gain, stage-one, lose and `/deep:*` line, with policy `ask` on each. One negative row differs per checkout, with no command in either: in the worktree H5 tops `sk-doc` over `sk-code` by 0.000004, and in the primary checkout N12 tops the operator's private `local-webflow` skill. No advisor code changed after the committed rerun. Mirrors PASS 260, command references OK |
| Fresh-review round: prompt hook | Every REQ-015 to REQ-019 prompt and control gives its stated result (`scratch/probes/fresh-review-hook.txt`) |
| Fresh-review round: suites | `npm run build` exit 0, then 180 files, 2696 passed, 4 skipped, 0 failed (baseline 2624). Python `pass=130, fail=0` with 98 fixture cases. TypeScript and Python predicates agree on 227 prompts |
| Fresh-review round: probes and corpus | 69 probes `exit 0 live`, 0 changes against `results-final-958fa81-worktree.json` (`scratch/probes/results-fresh-review.json`). Corpus `false_offer` 0 of 57. One holdout refusal row stopped carrying a command, so the baseline was rewritten with `--write` |
| Merge of origin/main | Main brought `a299bbcba42`, which edited the same gate. Its curly-apostrophe helper `lowerFolded`, its negated loop questions ("why doesn't my deep review converge") and its exported `LOOP_WANT_LEADS` were kept beside this round's `hasLoopAsk` and "how many" questions, in TypeScript and Python. Its new test, which wants a shared run case for every loop word, failed on this round's `deep-research` spelling, so the case `hyphen-deep-research` was added. The trigger index and its three fixtures were regenerated, not hand-merged (`--check` exit 0) |
| Merged tree: suites | `npm run build` exit 0, then 180 files, 2735 passed, 4 skipped, 0 failed. Python `pass=130, fail=0` with 118 fixture cases. TypeScript and Python predicates agree on 227 prompts |
| Merged tree: probes | 69 probes `exit 0 live`, 0 changes against `results-final-958fa81-worktree.json`, so main introduced no probe change |
| Sixth round: advisor `npm run build` and `npx vitest run` | exit 0, then 184 files, 3029 passed, 4 skipped, 0 failed (baseline 2735 passed on the merged tree) |
| Sixth round: Python suite | `python3 tests/python/test_skill_advisor.py` prints `cases=203` and `pass=136, fail=0` |
| Sixth round: shared fixture and drift guard | The 203 cases pass in both suites. The drift guard compares eleven vocabulary pairs across the two copies, and a scratch edit adding `sixty` to the TypeScript count words alone failed it before the edit was reverted |
| Sixth round: 69 probes | Every line reads `exit 0 live`, and the compare against `results-final-958fa81-worktree.json` prints `changes=0 guarded_failures=0` |
| Sixth round: deep-loop runtime | `npx vitest run tests/unit` reports 190 files, 3626 passed, 2 skipped, 0 failed (baseline 3625) |
| Sixth round: reducer replay | A replay of the three lineages on a temp copy gave 0 missing structured findings. The committed `review/` folder is unchanged and stays as the record of the pre-fix round |
| Sixth round: corpus | `false_offer` 0 of 57 |
| Sixth round: independent verification | A verification pass over the whole diff raised one P2 and three P1s. The P2, a drift guard that skipped the command decline and ask leads, is fixed. The three P1s are one gap that predates the round, recorded as limitation 8 |
| Seventh round: advisor suite and Python suite | `npx vitest run` in `$ADV` reports 184 files, 3,126 passed, 4 skipped, 0 failed; `python3 tests/python/test_skill_advisor.py` prints `pass=136, fail=0` |
| Seventh round: drift guard | The refusal-lead alternation is an exported list on both sides and then the twelfth compared pair, `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` each have a per-entry case, and `LEAD_WINDOW` and `ADVISOR_PROMPT_MAX_CHARS` are read back from the Python source and compared; the eighth round reads those surfaces at `tests/deep-loop-offer-cases.vitest.ts` `VOCABULARY_PAIRS`, `:90`, `:247`, `:255`, `:262`, `:271`, `:293`, `:303` and `:313` |
| Seventh round: closure docs | REQ-011 names the two aliases the hub carries with ADR-007 and AC-043, limitation 8 states the served-brief layer, every repointed acceptance evidence cell resolves to the line that holds its observation, and `validate.sh --strict` passes on this packet |
| `validate.sh --strict` on this packet | RESULT: PASSED |
| Eighth round: the four code findings | Plural loop names ask for the run, `how do` and `how can` questions and effort complaints do not, and the degraded brief prints a supplied command only where the tracked table names it for that row's skill. The cases are in `tests/fixtures/deep-loop-offer-cases.json` (285 cases), read by both suites, with the degraded path pinned in `tests/cli-degraded-command-contract.vitest.ts` |
| Eighth round: advisor suite | `npx vitest run` in `$ADV` reports 184 files, 3,188 passed, 4 skipped, 0 failed, exit 0 |
| Eighth round: Python suite and shared fixture | `python3 tests/python/test_skill_advisor.py` prints `cases=285` and `pass=136, fail=0`, and the fixture holds 285 cases |
| Eighth round: 69 probes | All 69 lines read `exit 0 live`, and the compare against `results-final-958fa81-worktree.json` prints `changes=0 guarded_failures=0`, so the eighth-round gate changes moved no probe |
| Eighth round: vocabulary drift guard | It compares fifteen vocabulary pairs and the two numbers, and ten of the fifteen lists carry a per-entry case; the five that cannot are named with their reasons in `spec.md` REQ-031 |
| Eighth round: closure docs | Every count and evidence cell the review named now names the final tree, REQ-006 points at the fixture and the guards file, REQ-031 at the lists a fixture row can pin, REQ-039 owns the corpus recapture, and `validate.sh --strict` passes |
| Ninth round: code findings | A no-edit clause keeps a read-only loop, a refused loop phrase supplies no mode cue, the routed route reads the ask's mode, pronoun reruns, past-run summaries, effort manners and a comma-led typed doctor read as REQ-043 and REQ-044 state, and the scorer reads a plural loop noun, all at `3db3085bcf0` and `5ace62e10e6` |
| Ninth round: advisor suite | `npm run build` exit 0, then `npx vitest run` in `$ADV` reports 186 files, 3,415 passed, 4 skipped, 0 failed |
| Ninth round: Python suite and shared fixture | `python3 tests/python/test_skill_advisor.py` prints `pass=136, fail=0`, and the fixture holds 347 cases |
| Ninth round: 69 probes | The compare against `results-final-958fa81-worktree.json` prints `changes=0 guarded_failures=0` |
| Ninth round: deep-loop runtime | `npx vitest run tests/unit` reports 190 files, 3,632 passed, 2 skipped, 0 failed. The two skipped cases are `--claude-config-dir` cases that skip under a Claude Code parent and fail outside one, as they did before this round |
| Tenth round: code findings | The Python fallback keeps no run row on a mode-free ask, the fixture spells it `"none"`, and the reducer keeps the strategy's section numbers, at `9f1190407eb` |
| Tenth round: advisor suite | `npm run build` exit 0, then `npx vitest run` in `$ADV` reports 186 files, 3,418 passed, 4 skipped, 0 failed |
| Tenth round: Python suite and probes | `PY` prints `cases=347` and `pass=136, fail=0`, and the probe compare prints `changes=0 guarded_failures=0` |
| Tenth round: deep-loop runtime | `npx vitest run tests/unit` reports 191 files, 3,634 passed, 2 skipped, 0 failed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The operator then asked for the remaining open items to be fixed (decision D10). Fixes added after the first landing:
- **Past runs:** a request to read or summarize a past run's output gets no new run.
- **Writing about a method:** a piece written about a loop method neither tops the hub nor carries a command.
- **Questions about the loop:** a question about how the loop works gets no run.
- **Several passes:** review over several passes now gets `/deep:review`.
- **Stuck runs:** a complaint about a stuck, non-converging or stale run now gets `/doctor:deep-loop`.
- **Explain questions:** an explain question no longer gets a run-policy doctor row.
- **Behaviour run:** done. F3 and F5 asked the offer, and F6 asked it on 1 of 4 runs after the routing-step edit (limitation 5). The earlier plan-mode operator turns on F3, F5 and F6 each opened with the offer: one turn that asks the spec-folder and run questions together, with a recommended option A carrying the composed command.

A second round, also on "fix open", fixed both phrasings that still missed:
- **Review called "code":** "give the scheduler code many passes of review" now gets `/deep:review`. Naming the target "code" had scored the code skill twice.
- **Checks that open with "inspect":** "inspect the queue worker for defects iteratively" now gets `/deep:review`. A prompt opening with "inspect" was read as a request to explain, which capped every skill.

That round also replaced the holdout rows a second time, with -03 rows written by a worker that saw none of the tuning.

A third round, on "do for me / fix":
- **Spelled-out counts:** counts written as words ("twelve-iteration", "ten rounds") now count as loop asks.
- **Want verbs:** "I'd like a / I want a / set up a" before a loop name now counts as a loop ask.
- **Stuck runs named other ways:** complaints about a loop named some other way ("audit loop", "the review I started") now get `/doctor:deep-loop`.
- **Live check, done:** a claude TUI on the operator's first account, in plan mode, was driven through a pseudo-terminal with "run 5 review iterations on the advisor runtime". It opened one question-tool dialog with two tabs, Spec folder and Deep review. The second tab offered "A) Run it (Recommended): `/deep:review:auto ".skilled/skills/system-skill-advisor/runtime" --max-iterations=5 --stop-policy=max-iterations`", a `:confirm` option and a no-loop option.
- **Holdouts:** the holdout rows were rewritten blind a third time (-04).

A fourth round fixed the findings of a read-only review of this epic. The operator asked for every P1 and P2 finding to be fixed. The work was built in worktree `worktrees/522-deep-loop-offer-review-fixes` and checked with 31 live probes (`scratch/probes/review-fix-cases.json`):
- **Convergence and coverage graphs:** "my k-means convergence is stuck" and "the coverage graph is empty in my jest report" no longer get `/doctor:deep-loop`. Those words now name a deep run only beside a review or research noun.
- **Continue, resume and extend:** "resume the review loop on the auth module" now gets `/deep:review`.
- **An explicit run beside another reading:** "run deep research to explain why the last CI run failed" and "run 10 research iterations … so I can write an article about it" keep their command. A run ask now wins when it comes first or opens its own clause. "write a blog post about how to run a deep review" stays a piece about the loop.
- **Counts that name the subject:** digit counts after "first", "last" or "the" give no offer, and neither do "in one iteration", "failed after 3 iterations", "needed more iterations to converge" and "3 rounds of the clinical trial". "do one more iteration" and "stop after 10 iterations" still ask for the loop.
- **Loop names that are not runs:** "set up a review loop for PR approvals" and "run tests until the review loop passes" get no `/deep:review`.
- **Mode edges:** "run 5 research iterations on review tooling" now picks research, "what is a deep review? run one on the auth module" gets `/deep:review`, and "I would like a deep loop reviewing the session store" gets `/deep:review`.
- **The doctor row:** the lexical lane topped the run-policy `/doctor:deep-loop` row on "research why the model needed more iterations to converge". The same row already topped that prompt without "more" before this round. On the operator's choice, the row now passes only on a prompt that names a deep run or types the command.
- **Docs:** both offer sections and the v4.2.0.0 changelog now say that a bare "iterations" describing the subject is not a loop ask.
- **A negated run ask:** the run-ask rule had made "summarize the last deep review report, but do not run another deep review" offer `/deep:review`. A run ask with "do not", "don't", "never", "no need to" or "without" within two words before it no longer outranks the past-run or write-about reading, so that prompt and "write an article about deep research. Don't start a new deep research." get no command again. This round did not cover a refusal with no such reading beside it: "never run deep research on this" still got the offer until the fresh-review round below.
- **Rounds of a named review:** "run 3 rounds of the security audit" and "do 3 rounds of the code review" ask for the loop again. After "of", a round may name one review with its determiner, as long as nothing but a preposition or clause word follows it. A first, looser version also offered the loop on "3 rounds of peer review" and "rounds of budget review meetings", which main did not, so those prompts are now fixture cases. "3 rounds of the clinical trial results" stays a subject.
- **Argument hints:** on the operator's choice (Q013), both `/deep:*` hints now list `--stop-policy`, `--lineage-mode` and `--extend-minutes`, review lists `--review-focus`, and `--model`, `--reasoning-effort` and `--count` sit under `--executor`. The 140-character budget is a soft warning, so `validate_document.py` still prints it.

A fifth round fixed the gate gaps a fresh review found outside the probe set. The operator approved the plan, and the work was built in worktree `worktrees/529-deep-loop-offer-gate-fixes`. Every prompt was checked through the Claude prompt hook (`scratch/probes/fresh-review-hook.txt`):
- **Refusals in words:** "don't do deep research", "never run deep research on this", "no need to run a deep review here", "I'm not asking for a deep review", "no deep review, please" and "a deep review is not needed" carry no command. The gate now reads each loop phrase on its own and skips one that a refusal leads or that a need word after it turns down. "why not run a deep review" and "no, run a deep review" still ask.
- **How many:** "how many iterations does deep research run by default?" and "how many passes does the deep review do" are questions about the loop.
- **Spellings:** "deep-review" and "deep-research" count, except inside a path such as `deep-review.md`. A curly apostrophe reads as a straight one in the run-ask and write-about checks.
- **Denied symptoms:** "the deep research run is not stuck, run 5 more iterations" gets `/deep:research`. A negation before a state word denies the symptom, and a counted run ask cancels the stuck reading unless a refusal leads it.
- **Loop as subject (ADR-004):** an edit verb before the name, or a code, file or result noun or a result verb after it, makes the loop the subject. So do iterations of something that is not the loop, a count that did something ("several passes of the linter failed") and a hyphen count or `multi-pass` that describes another noun. A wanted loop "for every PR" or one "that approves PRs" is a standing process. Probe H10, "a multi-pass security and correctness audit", first lost its command, so up to three words may stand before the loop's noun.
- **Python typed check:** the fallback now reads a typed `/deep:*` command with the TypeScript boundary rule, and it ports the ask-policy part of `commandOnlyMentioned`. A stuck run dropped the run row even when the command was typed, which the sixth round reversed under ADR-005.

A sixth round fixed the findings of a three-lineage deep review of this packet (`review/review-report.md`), which returned FAIL on its coverage gate. The operator asked for the round to run autonomously (Q035). It was built in worktree `worktrees/533-deep-loop-offers-deep-review`, with the two gate copies and the shared fixture edited by four serial lanes and four parallel lanes beside them. Both gates read one 203-case fixture, so every prompt below is checked in TypeScript and in Python:

- **Refusals in more verbs:** "skip the deep review and just answer", "avoid deep research", "instead of a deep review", "no need for a deep review", "I refuse a deep review here" and "do not even think about running a deep review" carry no command. A refusal lead stops at a conjunction, and "skip straight to the deep review of the parser" still asks.
- **A stuck run that refuses a run or a fix:** "the deep research run is stuck. please don't run anything" and "my deep research run is stuck and I don't want a fix" lose the `/doctor:deep-loop` row, both at the gate and in the fused doctor row, in both copies.
- **Two typed commands:** each typed `/deep:*` keeps its own command, so "run /deep:review on the parser, then /create:changelog" and "/deep:review the parser and then /doctor:deep-loop" keep `/deep:review`.
- **A deferred route's mode cue** reads only loop names that are asks, and the defect check reads its -ing forms, so "run a deep loop checking the parser for bugs" picks review.
- **The typed-on-stuck exception (ADR-005):** the Python fallback keeps the typed run row on a stuck complaint and marks it `typed`, so both served heads read `/deep:review (ask)` and the native and fallback split limitation 6 recorded is gone.
- **The degraded brief paths** carry the command, its policy, its owner and the typed marker, so a command the prompt typed prints plain `/deep:review (ask)` on the CLI degraded path and on the Python subprocess path, while an untyped deep row keeps its three options.
- **Long prompts:** each match is read against a 400-character window in both copies, and the Python gate reads the same 10,000-unit head the native schema accepts, so a 96,000-character prompt finishes the gate in about 0.1 seconds.
- **The vocabulary drift guard:** the count words, run symptoms, artifact-after nouns, past-run read verbs, iterative verbs and the two command lead lists are exported arrays in TypeScript and named tuples in Python. The guard compares eleven pairs and needs a fixture case per entry, and a one-sided edit fails it.
- **The reducer:** a refinement filed against another file or dimension keeps its own registry entry, and a replay of the three lineages gave 0 missing structured findings.
- **A new known limitation:** the Python fallback serves the hub without a command for an untyped loop ask (limitation 8).

A seventh round corrected the closure-doc drift the traceability review found (`review/review-report.md`, three lineages, FAIL on its coverage gate). Limitation 8 was rewritten to the layer the gap is in, REQ-011 was amended from three research aliases to the two the hub carries (ADR-007) and gained AC-043 as its owning row, thirteen acceptance evidence cells and the T069 line citation were repointed to the lines that hold their evidence, the ticked decision-count task and the changelog suite count were corrected to what the tree shows, and the drift guard gained the refusal-lead pair, the two pinned numbers and a per-entry case for the two lists that had none. The rerun of that review (T084, AC-040) stays open.

An eighth round fixed the four code findings and the closure-doc drift the second traceability rerun found (`review/review-report.md`, three DeepSeek V4.1 Flash lineages of five iterations, FAIL on its coverage gate). At `2520456bd3f` the gate learned plural loop names, so "run two deep reviews of the auth module" asks for the run while a plural loop that reports a past run, names a symptom or asks a question still does not; a question leading with "how do" or "how can" stays a question, so "how can a deep research loop stop early?" asks for no run while a run the same prompt adds in a later clause still counts; and a complaint about a loop's own speed or cost is no run ask, so "the deep review loop is too slow" and "improve the deep review" carry no command while "run a fast deep review on the parser" and "improve the parser with a deep review" keep it. On the degraded CLI path a supplied command string now prints only where the tracked table names it for the row's own skill, so a string the child process invented cannot reach the brief. The docs pass corrected the counts the seventh round left stale, repointed every evidence cell that landed beside its evidence, moved REQ-006's test-file pointer to the shared fixture and the guards file, and narrowed REQ-031 to the ten lists a fixture row can pin, with the five that cannot named and their reasons given. REQ-039 now owns the corpus recapture. T084 and AC-040 stay open.

A ninth round fixed the third traceability rerun's findings (`review/review-report.md`, generation 5, three DeepSeek V4.1 Flash lineages of seven iterations, FAIL on its coverage and scope gates). "run a deep review of the parser but don't change anything" keeps `/deep:review`, because a review loop writes no code. "skip the deep research, run a deep review on the parser" serves `/deep:review`, since a refused loop phrase no longer supplies the mode cue. "run a deep loop to review the research loop config" serves `/deep:review` on the routed research route. "the deep review didn't finish, run it again" serves the run rather than the diagnosis, and "summarize the deep reviews from last week" carries no doctor command. "run a deep review slower" keeps its command, and "the deep research run is stuck, /doctor:deep-loop" serves the doctor. The scorer's explicit lane now reads "loops" as it reads "loop", so "run two research loops on the cache" keeps `/deep:research`. "run two deep loops on the cache layer" names no mode and serves the hub with no command, by operator decision (ADR-008). The drift guard now compares the mode vocabulary on four surfaces and pins the exception grammar with shared rows. In the review reducer, a direction one iteration ruled out reads as reopenable, and a heading-first strategy section keeps one heading. The duplicate-command guard can now withhold. The docs pass repointed every evidence cell that cites this file, found by row label rather than by offset.

A tenth round fixed the fourth traceability rerun's findings (`review/review-report.md`, generation 6, FAIL on its coverage gate, with no new word-rule gap in the gate). The Python fallback now keeps no run row on "run two deep loops on the cache layer", as the native gate and ADR-008 do, and the fixture spells that absence `"none"`, so a copy that keeps both rows fails the test. The review reducer keeps a strategy's own section numbers. Every acceptance and task citation now names its evidence by symbol, test title, fixture row id, summary row label or task id, and each acceptance row ends with one `Evidence:` tail that a script checks against the tree, so a later edit above a cited line no longer breaks a cell silently.

What stays open:
1. **The blind -04 holdouts score 2 of 3.**
   - The doctor and review rows hit.
   - "Dig into how hospitals de-identify patient records …, and spend eight iterations on it" gets no recommendation: "dig into" is not read as a research cue.
   - It is reported, not tuned, so the rows stay blind.
2. **The argument hints are over the soft budget.** Both hints now list every offer flag (Q013), so `validate_document.py` warns that each is over 140 characters. The warning is soft, and no failure from a long hint is recorded.
3. **"Write a memo on" is not read as writing about a topic.** "write a memo on iterative research funding for the grant committee" gets `/deep:research pol=ask`, and so does the same memo on "deep research funding", which was a loop ask before this packet. No guard is added for one phrasing.
4. **The multi-round research alias also catches a memo about research funding.** The operator kept it for K2 (ADR-002), so that memo can surface the hub as a skill suggestion with no command.
5. **The F6 session asks the offer only some of the time.** Three `claude -p` runs on "extend the finished deep review by 3 iterations" each stopped before spending, but none asked the offer with options A, B and C. The plan-mode run (`scratch/behaviour/F6-plan-mode.md`, $0.22) composed `/deep:review <packet> :auto --extend=3` and wrote a plan for approval. The run outside plan mode (`scratch/behaviour/F6.md`, $0.18) asked the spec-folder question and named `--extend=3` as the command it would run, after reading only the flag table. Step 0 of both command documents now names the three options, and the flag table sends a composed flag into option A. The run after that edit (`scratch/behaviour/F6-after-step0.md`, $0.16) asked which review was meant before it opened the command document, so the edit was never read. The session acts on the brief's `ask` alone, and the offer format lives one document away from it. Three more samples after the edit split: sample 1 (`scratch/behaviour/F6-sample-1.md`, $0.20) loaded `/deep:review` and asked the offer with `--extend=3` in the recommended option A, while samples 2 and 3 ($0.11 and $0.17) asked which review was meant first, since about 30 finished reviews exist. So 1 of 4 runs since the edit asked the offer, and AC-008 is recorded as waived under ADR-003 with that rate disclosed. The earlier F6 recording answered another prompt ("8 more") and is kept as `scratch/behaviour/F6-other-prompt.md`.
6. **A typed command on a stuck run.** "my deep review run is stuck, /deep:review again" gets `/doctor:deep-loop` from `attachCommand`, and the served head carries the typed `/deep:review (ask)` by operator decision (ADR-005). The Python fallback keeps and marks the same run row, so the two served heads agree, but the diagnosis no longer reaches a reader who typed the command. The reader chose the run, and the `ask` policy still stops before any spend.
7. **One known miss of the word rules.** "multi-pass compiler design review" offers the loop again, since three words may now stand before the loop's noun. The refusal leads leave "skip to the deep review of the parser" and "skip it and deep review the parser" asking, and withhold on "skip the deep review on this branch".
8. **An untyped loop ask reaches the served fallback brief as the hub skill, with no command.** The Python gate does not drop it: `_apply_deep_loop_offer_gate` keeps the run row whenever `asks_for_loop_run` is true, typed or not. The command is lost one layer later, in the brief that serves the result: `analyze_request` returns the `system-deep-loop` hub as a skill record, and `degradedRecommendations` in `skill-advisor-cli.ts` attaches a command only to a row the prompt typed. So "run a deep review on the parser", "do 3 rounds of review on the scheduler" and "my deep research run is stuck, don't fix it yet, just diagnose it" serve `/deep:review`, `/deep:review` and `/doctor:deep-loop` through the native gate, and the hub with no command through the fallback. The gap predates this round: the same three prompts served the same fallback heads at `bd771c9cbae`, and `degradedRecommendations` only ever attached a command the prompt typed, so nothing here regressed. The fallback serves only when the daemon is unreachable.
<!-- /ANCHOR:limitations -->
