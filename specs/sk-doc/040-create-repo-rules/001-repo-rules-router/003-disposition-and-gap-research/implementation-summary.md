---
title: "Implementation Summary: Phase 3: Disposition and Rule-Set Gap Research"
description: "Five iterations on a DeepSeek V4 Flash Max executor produced a restraint verdict: the rule set stays seven files, ten section-additions close every real gap, ten plausible new rules are refused, and one subtraction is warranted because a dual-locus restraint ladder disagrees with itself. The run also corrected this phase own spec and critiqued the delegation rule the packet had just written."
trigger_phrases:
  - "research run record"
  - "governor disposition verdict"
  - "ranked recommendations"
  - "forced depth five iterations"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/001-repo-rules-router/003-disposition-and-gap-research"
    last_updated_at: "2026-08-31T05:37:23Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Ran five research iterations and synthesized the ranked list"
    next_safe_action: "Verify each ranked recommendation against the repository"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-disposition-and-gap-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-disposition-and-gap-research |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five research iterations against the shipped rule set, `AGENTS.md`, and the history of the
retired governor directive, on a DeepSeek V4 Flash Max executor. The run's verdict is a
restraint result: **the rule set stays seven files.** Every real gap is a section-addition
to a file that already exists, ten plausible-sounding new rules are refused with the failed
condition named, and the single most useful recommendation is a subtraction.

### A coverage map with numbers instead of impressions

52 prescriptive rows in `AGENTS.md` sections 2, 3, 4 and 7 were mapped to the rule file that
expands each. 33 have a direct expansion, 4 are partial, 7 are design-excluded by the
router's own scope statement, and 8 are true gaps. Naming the design-excluded set separately
is what stops seven false gaps entering the recommendation list.

### The governor verdict: no container, two homes

Of the five clauses in the directive retired by commit `4477a9f1`, three still live in
`AGENTS.md` L140-142 and section 4. Two live nowhere and belong in `blast-radius.md` and
`uncertainty-and-honesty.md` as sections. No new file, and no restored per-turn container -
per-turn force was the only property that container added, and removing it was the point.

This corrected the framing in this phase's own `spec.md`, which claimed the disposition
"now has no home". Three of five clauses do.

### A subtraction backed by a real contradiction

`AGENTS.md` L164 names `code-quality-standards.md` section 1 as the authoritative restraint
ladder, while `overengineering.md` section 1 defines a same-named ladder with a different
taxonomy - and rung 2 disagrees between the two. That is a contradiction, not duplication.

### The delegation rule critiqued rather than assumed correct

The rule phase 2 wrote was read at critique depth: four wrong claims, three overstatements,
seven uncovered areas. The sharpest is that it carries zero `file:line` citations while its
own section 3 demands them of every brief, and never marks its empirical claims about model
behavior as one lens's judgment. The doctrine survives; ranks 7 through 9 fix the file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Findings by question plus the ranked recommendation table phase 4 consumes |
| `research/iterations/iteration-00{1..5}.md` | Created | 910 lines of iteration narrative with line-level citations |
| `research/deltas/iter-00{1..5}.jsonl` | Created | Per-iteration findings, observations and graph events |
| `research/deep-research-state.jsonl` | Created | 5 `iteration` records plus config and executor provenance |
| `research/deep-research-strategy.md` | Created | Session tracking, populated from the config and the question set |
| `research/research-questions.md` | Created | The five questions, corpus, and output contract |
| `research/deep-research-config.json` | Created | Run configuration, including the executor and the forced-depth policy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Through `/deep:research` in `:auto` mode, not a hand-rolled loop. Setup bound the spec folder
as write authority, five iterations, and the `max-iterations` stop policy; the workflow's
`if_cli_devin` branch owns per-iteration dispatch, and this phase executed that branch through
the same shipped modules it names - `renderPromptPack`, `writeFirstRecordExecutor`,
`buildLineageCommand`, `runAuditedExecutorCommand`, `enforceWriteContainment` - rather than a
second adapter.

Forced depth was implemented by setting the convergence floor equal to the cap, so every
convergence stop candidate is overridden and only the terminal cap can end the run. In the
event it never bound: `newInfoRatio` ran 0.85, 0.55, 0.60, 0.55, 0.60 and never approached the
0.05 threshold. Recorded because the opposite result would have mattered.

Before any prompt was composed, the executor's own contract was read, as `AGENTS.md` Dispatch
Rules require and as phase 2's rule now states. That read produced three preflight checks that
would otherwise have been assumptions: the self-invocation guard (this runtime is not Devin),
`devin auth status` (OAuth live), and a roster probe confirming `deepseek-v4-flash-max` is a
real uid for the Max thinking tier rather than a family name with a suffix guessed onto it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Convergence floor set equal to the cap | It is the mechanism this workflow actually has for `--stop-policy=max-iterations`; the operator asked for five iterations, and a converged loop stopping at three would have delivered less than was asked |
| One research question per iteration | Each RQ builds on the last - the coverage map is the input to the move-down classification, which is the input to the governor criterion. Parallel questions would have lost that chain |
| Executor read before prompt composition | Required by `AGENTS.md`, and it caught the model-uid question: the Max tier is baked into the uid on this surface, not set by a flag |
| Fold the gateway's nested projection into the canonical log | The projection contract's `relativePath` already contains `research/`, so passing `--run-directory` the artifact dir (as the workflow's `state_write_protocol` specifies) writes one level too deep. Folding keeps the reducer reading real state; the contract mismatch is recorded as a limitation rather than patched here |
| Research writes nothing outside its folder | Keeping the write out of the research phase is what makes the recommendations reviewable instead of already-applied |
| Let the run correct this phase's own spec | The RQ3 finding contradicts the problem statement written before the research ran. The correction is recorded rather than the framing defended |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration count read from the state log, not a run summary | PASS - 5 records with `type: "iteration"`, iterations 1 through 5 |
| Convergence could not shorten the run | PASS - floor equals cap in the config; ratios 0.85/0.55/0.60/0.55/0.60 never approached 0.05 |
| Executor is DeepSeek V4 Flash at max thinking | PASS - `deepseek-v4-flash-max` recorded in config and in 5 `iteration_start` executor records; roster-verified as "DeepSeek V4 Flash Max" before dispatch |
| Write containment | PASS - 0 containment violations across 5 dispatches; every doctrine file's mtime (07:53-07:57) predates the run's first write (08:02) |
| Artifacts present | PASS - 5 iteration narratives (910 lines), 5 delta files, ledger sequences 1-5 with receipts |
| Every RQ answered | PASS - RQ1 through RQ5 each have an explicit answer section in `research.md` |
| Subtraction candidate present | PASS - the dual-locus restraint ladder, with both loci read first-hand |
| Recommendations decidable without transcripts | PASS - 10 ranked rows, each naming target file, change, failure prevented, and evidence |
| Reducer state | PASS - `iterationsCompleted: 5`, `corruptionCount: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One executor family, on operator instruction.** The delegation rule this packet shipped says a judgment question answered by one lens is not a finding. This run is one lens. The tension was recorded in `spec.md` open questions before the run rather than discovered after, and phase 4 verifies each recommendation against the repository instead of adopting the list on the executor's confidence.
2. **No prior context was available.** The `system-spec-memory` MCP server failed to connect this session, so `memory_context` never ran. That is a connection failure, not evidence that no prior context exists - anything the memory layer holds about this packet was unavailable to every iteration.
3. **The append gateway's projection path double-nests.** The legacy projection contract's `relativePath` is `research/deep-research-state.jsonl`, but the workflow's `state_write_protocol` passes `--run-directory {artifact_dir}`, which already ends in `research/`. Every iteration's record therefore landed at `research/research/deep-research-state.jsonl` and had to be folded back. This is a `system-deep-loop` contract mismatch, outside this packet's scope; it is recorded here so the next run does not rediscover it, and the nested file is left in place rather than deleted because it is real ledger-derived state.
4. **Tool-call budget exceeded in iteration 1.** Roughly seven extra calls went to discovering the gateway's `stable-identity-missing` refusal and its required `runId`/`lineageId` fields. Iterations 2 through 5 carried that knowledge forward. No finding was affected.
5. **The findings are hypotheses.** Nothing here has been tested against the repository by anything but the run that produced it. That is phase 4's job, and a low adoption rate would be a finding about this research rather than a failure of the adoption.
<!-- /ANCHOR:limitations -->

---


