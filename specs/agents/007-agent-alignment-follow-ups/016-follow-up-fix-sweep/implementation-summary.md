---
title: "Implementation Summary"
description: "Every deep-review stop path that reaches synthesis now writes the terminal gate record with its real stop reason, an unknown gate is refused, a registry-less lineage keeps its failed gates in the merge, and stale lines from children 008 to 014 are corrected. The SC-002 probe passed."
trigger_phrases:
  - "follow up fix sweep implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/016-follow-up-fix-sweep"
    last_updated_at: "2026-11-15T09:36:26Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Commit and push complete; open a follow-up packet for the two recorded upstream gaps"
    packet_purpose: "Purpose: Every deep-review run that reaches synthesis gets a verdict from a terminal gate record with its true stop reason, and the docs the earlier children touched say what the files now do."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:72765fc2597828c1165adaa3a7b0708150209f565dd2aab5d2acea10a01b8dce"
      session_id: "scaffold-016-follow-up-fix-sweep"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T09:36:26Z"
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
| **Spec Folder** | 016-follow-up-fix-sweep |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every deep-review run that reaches synthesis now writes the terminal gate record first, with the reason it really stopped. Before, the auto three-errors path and the confirm workflow's two ordinary manual stops wrote none and kept the P0-only verdict, and the pivot manual stops were recorded as `converged`.

The record also refuses a gate whose status is `unknown`, so a gate nobody judged can no longer pass. A fan-out lineage with no registry but a failed gate in its state log now fails the merged verdict instead of dropping out. The rest fixes text that earlier children left stale, and two agent rules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts` | Modified | `stopReason` adds `manualStop` and `error`; a terminal record with an `unknown` gate is refused |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modified | Stop reason passed through; the three-errors rule records the gates with reason `error` |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modified | Every manual stop into `gate_pre_synthesis` sets `manualStop`, then records the gates |
| `compiled/deep-review.contract.markdown`, `compiled/deep-ai-council.contract.markdown` | Regenerated | Source digests |
| `runtime/scripts/fanout-merge.cjs` | Modified | A rebuilt registry is kept when the log has a terminal row |
| `runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modified | A passing terminal record clears an earlier blocked stop: gate obligations resolve, status returns to active, outcome is `converged` only for a converged stop |
| Reducer unit tests | Modified | Passing, max-iterations and failing terminal cases |
| Council feature catalog, feature page, playbook scenario and index | Modified | Agent named `ai-council`; the skill keeps `deep-ai-council` |
| Schema and merge unit tests | Modified | Accept, refuse and registry-less merge cases |
| `.skilled/agents/orchestrate.md` and its five mirrors | Modified | A LOW-confidence @review pass is surfaced and re-dispatched once |
| `.skilled/agents/markdown.md` and its four mirrors | Modified | `DQI=n/a` only for an output that is not markdown, with the substitute check named |
| `cli-prompt-quality-card.md`, `agent-mirror-crosswalk.md` | Modified | `TEST: NOT RUN`; `gpt-6-luna`; pins read by any invocation that passes no model; `.devin` reach |
| `scaffold-debug-delegation.sh`, its playbook page, the council `folder-layout.md` | Modified | Pointers that resolve |
| Prerequisites playbook page | Modified | `SPECIFY_FEATURE` prefix and fresh evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fresh Fable 5.2 review at medium effort read each open item and proposed the fixes; the operator answered its three questions. After baselining in `scratch/baseline.txt`, DeepSeek V4.1 Flash `--thinking max` built the code tasks one dispatch at a time in dependency order, and the four doc tasks in parallel on separate files. I read every diff, applied the agent edits to each runtime mirror, recompiled both contracts and ran the checks in `scratch/after.txt`. The SC-002 probe ran in a new Opus session with a stream-json transcript.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the gates with stop reason `error` on the three-errors path | The operator chose it on 2026-11-15 (Q1 A) |
| Keep `@debug` fixing by default | The operator chose it on 2026-11-15 (Q2 A) |
| A LOW-confidence @review pass is surfaced and re-dispatched once, written into the existing checklist line | The operator chose it (Q3 B), and `orchestrate.md` is at 599 of its 600-line cap |
| A passing terminal record clears the blocked outcome (reverses the earlier comment-only choice) | A repro showed `synthesis_started` throws `blocked to converging` after a legal recovery; only gates still failing at the terminal stop count |
| Outcome `converged` only when the record's stop reason is `converged` | A max-iterations stop that passes its gates did not converge; its outcome goes to `active` |
| A passing record returns the status to active only from `blocked` | From `converging` that transition is forbidden; any other state keeps its status |
| Upstream's deletion of the council skill wins in the merge, and the 016 YAML changes are ported into its merged `deep-review.yaml` | Operator answer 2026-11-15: "Port and push". The skill was retired in `adbba5a06a9`; the auto and confirm workflows became one file |
| I applied the @review round-1 fixes myself [DEVIATION] | Each was a few lines named exactly by the review; the mutation checks prove the tests |
| I wrote the prerequisites playbook change myself [DEVIATION] | Its evidence block needed the command's real output from this run |
| I applied the agent edits to the `.claude` orchestrate fork by hand [DEVIATION] | The fork script does not reproduce that fork at HEAD (20 lines differ) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Acceptance criteria: 10 total, 10 Met, none waived ([acceptance-criteria.md](acceptance-criteria.md)).

| Check | Result |
|-------|--------|
| `npm run typecheck` in the runtime | exit 0 |
| `npm test` in the runtime, after the open-item fixes | 2996 passed, 0 failed (`scratch/after-fix-open.txt`) |
| @review gate on the open-item fixes, round 1 | REQUESTED_CHANGES 88/100: one P1 (DAC-001 objective reversed) and three P2s; all four fixed |
| Merge of `origin/main` (`scratch/after-merge.txt`) | 3016 passed, 0 failed; typecheck 0; census 92/25/67, where the new spoken stem `deep_research.run_restarted` is upstream's (`f921b2c65b0`); drift `OK commands=2`; mirrors in sync |
| @review gate on the merge port, round 1 | REQUESTED_CHANGES 72/100. Fixed: the stop-reason rule now reads `reason`, because a manual stop after a blocked or stuck pass was recorded as `converged`; the override gate's wording names its `run_first`. Two P1/P2 items predate the merge and are listed under Known Limitations |
| @review gate on the merge port, round 2 | APPROVED 85/100, no findings; known limitations 2 and 3 do not block the push |
| @review gate on the open-item fixes, round 2 | APPROVED 95/100; its one P2 (mirror count in `output-schema.md`) fixed |
| `npm test` in the runtime, first pass | 2989 passed; the 2 failures were the stale deep-ai-council contract digest and pass 43/43 after the recompile (baseline 2990 passed, 0 failed) |
| `check-contract-drift.cjs` | `OK commands=3` |
| Stem census | 92 / 24 / 68, no violations |
| Contract parity | 19 passed |
| `check-agent-mirror-sync.cjs` | all comparable mirrors in sync |
| Stale-string searches | each printed nothing |
| @review gate, first pass | APPROVED 94/100; three P2s fixed: the scaffold's exec bit, crosswalk "eleven", playbook placeholder |
| SC-002 probe (`scratch/sc-002-summary.txt`) | PASS: subagent on `claude-sonnet-5-5`, reply starts `FRAMEWORK:` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gates are still judged by the executing agent.** The workflows state the three gate rules; the schema can refuse a record that contradicts itself but cannot check a judgment.
2. **The duration stop and manual-stop gaps moved to 017.** Both were already on upstream main; child `017-terminal-record-gaps` closes them with the operator's choices.
3. **The fork script misses the orchestrate fork.** `regen-claude-fork.sh` does not reproduce `.claude/agents/orchestrate.md` at HEAD, so a later edit there needs the same hand step.
<!-- /ANCHOR:limitations -->

---


