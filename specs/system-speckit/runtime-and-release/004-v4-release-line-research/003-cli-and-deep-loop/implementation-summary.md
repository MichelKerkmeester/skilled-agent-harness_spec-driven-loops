---
title: "Implementation Summary: Phase 3: cli-and-deep-loop"
description: "Twenty-six steered deep-research iterations over the CLI executors, the cli hubs and the deep-loop runtime found that the single-executor cli-opencode branch fails every dispatch on OpenCode 2, that the single-executor YAML has drifted from the fan-out runner, that write containment is repo-wide, and that 3,117 lines of runtime have no caller."
trigger_phrases:
  - "cli and deep loop implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/003-cli-and-deep-loop"
    last_updated_at: "2026-11-08T21:46:00Z"
    last_updated_by: "orchestrator-b"
    recent_action: "Closed at 26, depth rule cleared"
    next_safe_action: "Hand the ranked findings to whoever plans the fixes"
    blockers: []
    key_files:
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:9b365e3646b14c212f9219b7208d21a5b0ff09f9b3bc37c5e94483bb148fd412"
      session_id: "orchestrator-b-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 3: cli-and-deep-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cli-and-deep-loop |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cluster now has a ranked, cited audit across every v4 release. The headline: the single-executor `cli-opencode` branch passes `--pure`, which the installed OpenCode rejects, so it fails every dispatch. More broadly, the single-executor half of `/deep:research` and `/deep:review` has drifted from the fan-out runner that owns the same contract in code, so the YAML branches carry defects the runner already fixed.

### Phase 3: cli-and-deep-loop

`research/research.md` holds the findings in the workflow's 17-section shape: five strongest findings, then bugs, drift, misalignment, friction, over-engineering, improvements and extensions, each with a path:line citation, a severity and the release that introduced it where known. The orchestrator's severity corrections are applied there, and every correction is logged in `decision-record.md`.

### Release × finding-type coverage

Cells name the finding ids from `research/research.md`. A dash means the release was read for that type and nothing was found.

| Release | Drift | Misalignment | Bug | Improvement | UX | Over-engineering | Extension |
|---------|-------|--------------|-----|-------------|----|------------------|-----------|
| v4.0.0.0 | D4, D8 | - | - | - | record_executor_audit position | - | - |
| v4.0.0.1 | - | - | - | - | - | - | - |
| v4.0.0.2 | - | - | - | - | - | O6 | - |
| v4.0.0.3 | Strongest 2 | M1, M4 | B3 | I2 | U1, U2 | - | E2 |
| v4.0.0.4 | - | - | - | - | U6 | - | - |
| v4.0.0.5 | - | - | - | - | U6 | - | - |
| v4.0.0.6, v4.0.0.7 | retired-packet fixture paths | - | - | - | - | O5 | - |
| v4.0.0.8 | D3 | - | - | I1 | - | - | - |
| v4.0.0.9 | D6 | - | - | - | - | - | - |
| v4.0.0.10, v4.0.0.11 | - | - | - | - | - | - | - |
| v4.0.0.12 | - | - | - | - | U6 | - | - |
| v4.0.0.13 | - | - | B3 (binary) | - | - | - | - |
| v4.0.0.14 | - | - | B6 | - | U4 | O3 | - |
| v4.0.0.15 | D9 | - | - | - | U5 | - | - |
| v4.0.0.16 | Pi fast tier | - | Strongest 3 | I3 | U3 | - | E1 |
| v4.0.1.0 | D7 | M2, M3 | - | - | - | - | - |
| v4.0.2.0 | D10 | - | B1, B8 | - | - | - | - |
| Confirm-mode YAMLs | B3 and Strongest 2 repeated | - | B9 | - | - | - | E3 (`confirm_parity`) |
| Council runtime | D12 | - | B4 (narrowed), B10 | - | U8 | O7 | - |
| Per-executor hard rules | B8 (codex, devin, claude-code) | - | - | - | - | O7 (rule triplication) | - |
| cli-classifier and Jev | D14 | - | B11 | - | - | O8 | - |
| Review and council YAML pairs, reducer | D15 | - | B12, B13, B14, B15, B16 | - | - | O8 | - |
| /deep docs and cli packets | D14, D16 | - | - | - | - | - | - |
| Unattributed | D1, D2, D11, D13 | M5, M6 | B2, B4, B5, B7 | I4 | U7 | O1, O2, O4 | E3 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Ranked synthesis with release coverage, verification log and convergence report |
| `research/` state, iterations, deltas, registry, resource map | Created | Workflow state for 26 generation-2 iterations |
| `research_archive/20261108T201434Z/` | Created | Generation 1, archived at the executor switch |
| `spec.md` | Modified | Generated findings fence under Open Questions, REQ-001 wording, status |
| `plan.md`, `tasks.md`, `decision-record.md`, `timeline.md` | Modified | Final state, decisions D-01 to D-18, full steering log |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`deep-research-auto.yaml` ran one loop pass per call. Generation 1 ran on `cli-devin` until the Devin daily quota ran out at iteration 3. Generation 2 restarted on `cli-pi` `opencode-go/deepseek-v4.1-flash` at thinking max and ran 26 iterations, each validated by `verify-iteration.cjs` (exit 0 on all 26). After each iteration the orchestrator opened at least two citations, corrected or downgraded the claims that did not hold, and set the next focus on unread releases. The checkpoint after iteration 10 extended the run to 15. After the first close, the lead reopened it under the depth rule, and it ran to 20 with the rule at 2 of 3; reopened again to 25 and then 30, it read new ground, found five more verified P1s in iterations 21 to 23, and cleared the rule at iteration 26 (iterations 24 to 26 clean). Synthesis ran `reduce-state.cjs --emit-resource-map`, `synthesis-closeout.cjs` (event `synthesis_complete`), the spec writeback and the terminal telemetry row.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Switch to `cli-pi` through a generation-2 restart | Devin returned `resource_exhausted`, and `cli-deepseek-harness` cannot dispatch on the single-executor path |
| Extend to 15, then reopen to 20 | Two releases were unread at iteration 10; the lead's depth rule then required more passes while new P1s kept surviving verification |
| Restore `--pure` to P0 | The orchestrator observed OpenCode v2.2.5 reject it |
| Downgrade four claimed P0s | Their harm was inferred or avoidable by a careful runner, never observed |
| Move the executor's stray zip files to the scratchpad | It undoes the run's own write outside its folder and keeps the files recoverable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -c '"type":"iteration"' research/deep-research-state.jsonl` | 26 |
| Depth-rule score at close | 3 of 3 clean (iterations 24, 25, 26) |
| `verify-iteration.cjs` per iteration | exit 0 on all 26 generation-2 iterations |
| B3 `--pure`, run by the orchestrator | `Unrecognized flag: --pure in command opencode run` on OpenCode v2.2.5; `PONG` without the flag |
| `synthesis-closeout.cjs` | exit 0, staged `synthesis_complete`, gateway exit 0 |
| Top finding 1: no dsh branch | Reproduced the builder throw `cli-deepseek-harness requires a lineage directory` |
| Top finding 3: repo-wide containment | Read `write-containment.ts:1133-1143`; the same zip sits in three sibling quarantines |
| Top finding 4: unknown options | `status.cjs --bogus-flag` refuses; `append-mode-event.cjs:58-72` accepts any `--key`; 7 of 27 scripts handle it |
| Top finding 5: stop rule owner | `convergence.cjs` has 0 `stopPolicy` or `minIterations` references |
| Repository outside this folder | `git status --porcelain` shows only the two entries present before the run |
| `validate.sh --strict` | `Summary: Errors: 0  Warnings: 2`, `RESULT: PASSED` (warnings: Level 1 with a decision record, and 5 unresolved SOURCE tags that sit inside quarantined copies of sibling iteration files) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One P1 rests on executor evidence only.** B16 (review restart bookkeeping) was not opened by the orchestrator.
2. **Two strategy questions stayed unticked.** They were investigated, but the state log drops `answeredQuestions` (finding D1), so the report says 9 of 11.
3. **Generation 1 used a different executor.** Its two productive iterations ran on `cli-devin`; their findings were re-verified and carried into generation 2's known context.
<!-- /ANCHOR:limitations -->

---
