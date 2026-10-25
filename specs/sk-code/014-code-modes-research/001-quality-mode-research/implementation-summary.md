---
title: "Implementation Summary"
description: "Status Complete. Fifteen research iterations, ten on Luna and five on DeepSeek V4.1 Flash Max, and the refreshed synthesis are done. All eleven acceptance criteria are Met."
trigger_phrases:
  - "quality mode research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/001-quality-mode-research"
    last_updated_at: "2026-10-25T13:20:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed AC-011 and the phase"
    next_safe_action: "None. The phase is closed"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "decision-record.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "May the narrowed AC-011 check skip a line that only states the sibling folder was not read? Yes, the operator ruled so on 2026-10-25."
      - "The executor leftover files were deleted with the operator's approval."
      - "The executor alternation runs per iteration, set by the operator's run brief."
      - "AC-011: the operator approved deleting the containment copies and narrowing the check, recorded as ADR-001."
      - "Second model: the operator ruled for five more iterations on DeepSeek flash through cli-devin, recorded as ADR-002."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-quality-mode-research |
| **Status** | Complete |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fifteen deep-research iterations on `sk-code-quality` and a ranked synthesis in `research/research.md`. The synthesis holds the four required sections and 14 ranked recommendations, each labelled OBSERVED, DERIVED or INFERRED with a quoted source tag. Iterations 11 to 15 are a second-model re-check, and sections 6a and 6b hold its verdict per row and the refreshed order.

### Phase 1: quality-mode-research

The second model confirmed 12 of the 14 rows and refuted part of the reasoning behind ranks 4 and 10, without rejecting either change. The refreshed top five is naming the CI surface and routing workflow targets to it, reporting a skipped check as skipped, probing each enforcement layer and the host hook wiring, splitting the always-loaded checklist after the P0 decision, and adding behavior fixtures that measure catch rate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/iterations/iteration-001.md` to `iteration-015.md` | Created | One record per angle, 11 to 15 for the second pass |
| `research/deep-research-state.jsonl` and the ledger, config, strategy, registry, dashboard, deltas, prompts and receipts | Created | Loop state written by the workflow and its gateway |
| `research/research.md` | Created, then refreshed | The synthesis, the ranked list, the second-model verdicts and the refreshed order |
| `research/synthesis-v1.md` | Created | The first synthesis, kept before the run was reopened |
| `research/resource-map.md` | Created | Emitted by the reducer from the iteration deltas |
| `research/containment/` | Deleted by the operator | Quarantine copies of the sibling run's files, removed with the operator's approval before the second pass |
| `decision-record.md` | Created | ADR-001 narrows AC-011, ADR-002 adds the second-model pass |
| `spec.md` | Modified | The bounded pre-init topic note, the generated findings fence and the iteration count ADR-002 raised |
| `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | Evidence and status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both passes ran through the `/deep:research:auto` workflow. The orchestrating session interpreted `deep-research-auto.yaml` step by step: lock, state read, graph convergence, the prompt-pack render, the YAML's dispatch branch, `verify-iteration.cjs`, the reducer, graph upsert and telemetry. Synthesis used the closeout script and the gateway.

| Iterations | Executor |
|------------|----------|
| 1 to 10 | cli-codex `gpt-6-luna`, reasoning `max`, tier `fast`. The even slots were planned for cli-pi `deepseek-v4.1-flash-1017` through llmgateway, but three probes at 08:49Z, 09:05Z and 09:26Z each got `402 ... daily pacing allowance on the pro plan`, so pi was retired and the even slots ran on Luna |
| 11 to 15 | cli-devin `--model deepseek-v4-1-flash-max`, which Devin resolves to `deepseek-v4-1-flash-1017-max`, DeepSeek V4.1 Flash Max, through the YAML's `if_cli_devin` branch with `--permission-mode dangerous`, timeout 1200 s |

Iterations 11, 12, 14 and 15 verified on the first dispatch. Iteration 13's first dispatch sent its gateway call to `research/deltas/` rather than `research/`, so `verify-iteration.cjs` reported `state_record_missing`. The workflow's one redispatch verified. The completed lineage was reopened in place, as ADR-002 records: `research/synthesis-v1.md` keeps the first synthesis, the config's `status` and `maxIterations` were edited so classification takes the `resume` branch, and a `resumed` event went through the gateway with the session id unchanged. This child ran first and released its lock before child 002 started.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One flat lineage with the dispatch branch chosen per iteration | The workflow fixes one executor per lineage. Choosing the YAML's own branch per iteration kept every other step intact. Executor provenance is recorded per iteration. |
| The plan angle is bound as each iteration's focus | The child goal freezes the angle order. The second pass bound one re-check angle per iteration the same way. |
| The child-dispatch preamble and a persona pointer are prepended to each rendered prompt | Codex and Devin load `AGENTS.md` and would otherwise stop at Gate 3. The cli skills require both. |
| The artifact staging step was skipped | It runs `git add`, and the operator's brief forbids staging. |
| The boundary check is narrowed to `sk-code-quality/` and `sk-code-review/` | The operator directed this, because other work edits `.skilled/` in the same worktree. |
| AC-011 narrowed to the research content | ADR-001, the operator's ruling of 2026-10-25. |
| Five second-model iterations on cli-devin DeepSeek | ADR-002, the operator's ruling of 2026-10-25. |
| Rank numbers kept, refreshed order added beside them | The rest of the synthesis cites the first-pass rank numbers. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| AC-001 to AC-010 | Met, re-run after iteration 15, with command output in `acceptance-criteria.md` |
| Second-model claims | The orchestrator opened the lines behind each refuted or new claim and re-ran one routing replay before they entered the synthesis |
| Boundary | `sk-code-quality/` and `sk-code-review/` show no diff and no untracked file against `f8671e07c2` |
| AC-011 | Met. The amended check, which skips a line that only states the sibling folder was not read, prints nothing. Devin's session records show no call that read the sibling folder |
| Strict validation | Recorded in AC-010 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some sub-claims stay untested.** The second model left the Obsidian drift and stage-two routing of rank 2, the user-surface leg of rank 8, the stage-two match of rank 12 and the hook attribution of rank 14 untested.
2. **Stray dispatch files.** Iteration 13's first dispatch left a ledger, a state projection and lock folders under `research/deltas/`, and iteration 14 left `research/.iter-014-event.json`. They are kept for the operator to decide on.
3. **Shared hub files moved during the first run.** Citations into `ROUTER.md`, `stack-detection.md`, `hub-router.json` and the hub `SKILL.md` were re-located to current line numbers. `sk-code-quality/` and `sk-code-review/` did not change.
4. **No measured catch rate.** The packet's own benchmark scores routing only, so the gate's catch rate and cost stay unknown.
<!-- /ANCHOR:limitations -->

---
