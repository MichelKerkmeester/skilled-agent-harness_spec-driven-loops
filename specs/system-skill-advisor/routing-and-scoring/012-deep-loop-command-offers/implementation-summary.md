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
    last_updated_at: "2026-11-22T16:17:21Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the last two misses and replaced the holdouts blind"
    next_safe_action: "Land the follow-up commit on main after the operator approves the push"
    packet_purpose: "Purpose: A deep-loop command is offered when, and only when, the request asks for the loop itself."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/commands/deep/assets/deep-research-presentation.txt"
      - ".skilled/commands/deep/assets/deep-review-presentation.txt"
      - ".skilled/skills/system-deep-loop/hub-router.json"
    session_dedup:
      fingerprint: "sha256:be3c1cf825dec43154e6e89151dc30d9aa421979155a23e38aa40cd792c6b0db"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "91021a9f-dca3-4cb7-9743-2973efffa465"
      workspace: "/Users/michelkerkmeester/worktrees/public/516-deep-loop-command-offers"
      savedAt: "2026-11-22T16:17:21Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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

What stays open:
1. **The blind -03 holdouts score 1 of 3.**
   - The review row gets `/deep:review`.
   - "I'd like a twelve-iteration research loop comparing…" reaches the research mode without the command. A spelled-out count and "I'd like a" are not read as a loop ask.
   - "Why does the code audit loop I launched on Tuesday keep spinning … without ever converging?" goes to sk-code. "code audit loop" is not read as a deep run.
   - They are reported, not tuned, so the rows stay blind.
2. **The question tool is untested.** The behaviour turns ran in `-p` mode, which has no question tool, so they printed the §5 fallback list. A live interactive turn would confirm the tool is used.
<!-- /ANCHOR:limitations -->
