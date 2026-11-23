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
    last_updated_at: "2026-11-23T09:35:16Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed negated run asks and rounds-of-review scope; added offer flags to both deep hints"
    next_safe_action: "Commit worktree 522 through sk-git when the operator asks, then close the earlier note"
    packet_purpose: "Purpose: A deep-loop command is offered when, and only when, the request asks for the loop itself."
    blockers:
      - "acceptance-criteria.md rows still Unmet from earlier rounds"
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"
      - ".skilled/commands/deep/research.md"
      - ".skilled/commands/deep/review.md"
    session_dedup:
      fingerprint: "sha256:ed7b946f01a8d67757861c8b82afd7ac188ebd3ba5da180a7ed674f999f68fb6"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "5789dc27-c573-44e7-afdc-52d0e17986b0"
      workspace: "/Users/michelkerkmeester/worktrees/public/522-deep-loop-offer-review-fixes"
      savedAt: "2026-11-23T09:35:16Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| **Completed** | 2026-11-22 |
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
| `validate.sh --strict` on this packet | RESULT: PASSED |
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
- **Behaviour run:** done. Three plan-mode operator turns on F3, F5 and F6 each opened with the offer: one turn that asks the spec-folder and run questions together, with a recommended option A carrying the composed command.

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
- **A negated run ask:** the run-ask rule had made "summarize the last deep review report, but do not run another deep review" offer `/deep:review`. A run ask with "do not", "don't", "never", "no need to" or "without" within two words before it is now skipped, so that prompt and "write an article about deep research. Don't start a new deep research." get no command again.
- **Rounds of a named review:** "run 3 rounds of the security audit" and "do 3 rounds of the code review" ask for the loop again. After "of", a round may name one review with its determiner, as long as nothing but a preposition or clause word follows it. A first, looser version also offered the loop on "3 rounds of peer review" and "rounds of budget review meetings", which main did not, so those prompts are now fixture cases. "3 rounds of the clinical trial results" stays a subject.
- **Argument hints:** on the operator's choice (Q013), both `/deep:*` hints now list `--stop-policy`, `--lineage-mode` and `--extend-minutes`, review lists `--review-focus`, and `--model`, `--reasoning-effort` and `--count` sit under `--executor`. The 140-character budget is a soft warning, so `validate_document.py` still prints it.

What stays open:
1. **The blind -04 holdouts score 2 of 3.**
   - The doctor and review rows hit.
   - "Dig into how hospitals de-identify patient records …, and spend eight iterations on it" gets no recommendation: "dig into" is not read as a research cue.
   - It is reported, not tuned, so the rows stay blind.
2. **The argument hints are over the soft budget.** Both hints now list every offer flag (Q013), so `validate_document.py` warns that each is over 140 characters. The warning is soft, and no failure from a long hint is recorded.
<!-- /ANCHOR:limitations -->
