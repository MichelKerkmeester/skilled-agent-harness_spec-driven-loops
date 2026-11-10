---
title: "Implementation Summary: Phase 4: advisor-hooks-relaunch"
description: "Twenty steered deep-research iterations over the skill advisor, the runtime hooks and session relaunch found a menu detector that misses the commonest menu form, a Stop hook with no stdin deadline, dispatch-audit logs scattered by the session cwd, and Hermes still shipping in the doctor payload."
trigger_phrases:
  - "advisor hooks relaunch implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/004-advisor-hooks-relaunch"
    last_updated_at: "2026-11-08T22:02:00Z"
    last_updated_by: "orchestrator-b"
    recent_action: "Re-synthesized after the 20-iteration reopen"
    next_safe_action: "Hand the ranked findings to whoever plans the fixes"
    blockers: []
    key_files:
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:07f5e3753e268534c916f3ccefb1eb718ef0e1688132478f75fe048ed8294925"
      session_id: "orchestrator-b-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 4: advisor-hooks-relaunch

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-advisor-hooks-relaunch |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor, hooks and relaunch cluster now has a ranked, cited audit across every v4 release. Most release claims hold. The defects that matter are a menu detector that misses `1.` menus, a Stop hook that can hang on stdin, dispatch-audit logs that land wherever the session's working directory is, and Hermes still shipping in the doctor's AGENTS.md payload.

### Phase 4: advisor-hooks-relaunch

`research/research.md` holds the findings in the workflow's 17-section shape, each with a path:line citation, a severity and the release that introduced it where known. Five executor claims were corrected or downgraded on evidence the orchestrator ran. Every correction is in the steering log in `decision-record.md`.

### Release × finding-type coverage

Cells name the finding ids from `research/research.md`. A dash means the release was read for that type and nothing was found.

| Release | Drift | Misalignment | Bug | Improvement | UX | Over-engineering | Extension |
|---------|-------|--------------|-----|-------------|----|------------------|-----------|
| v4.0.0.0 | - | M5 | - | - | - | O4 | - |
| v4.0.0.1 | D6 | - | - | - | - | - | - |
| v4.0.0.2 | - | - | B4 | - | - | - | - |
| v4.0.0.3 | D7 | - | - | - | - | - | - |
| v4.0.0.4 | - | - | - | - | - | - | - |
| v4.0.0.5 | - | - | B10 | - | - | - | - |
| v4.0.0.6 | - | - | B6 | - | surface hint | - | - |
| v4.0.0.7 | D1, D8 | - | - | I3 | - | - | - |
| v4.0.0.8 | D8 | - | B2 | I4 | - | O2 | - |
| v4.0.0.9 | D8 | - | - | - | - | - | - |
| v4.0.0.10 | - | - | B6 | - | - | - | - |
| v4.0.0.11 | Hermes in the note | - | - | - | - | - | - |
| v4.0.0.12 | D9 | - | - | I2 | U1, U2 | O3 | E3 |
| v4.0.0.13 | D7 | - | - | - | - | - | - |
| v4.0.0.14 | D2 | - | - | - | U3 | - | - |
| v4.0.0.15 | - | M2, M3 | - | - | U5 | - | - |
| v4.0.0.16 | history cap | - | B10 | - | - | - | - |
| v4.0.1.0 | D3, D4 | - | - | - | U4 | - | - |
| v4.0.2.0 | D2 | - | - | - | dsh not a relaunch runtime | - | - |
| Dispatch audit, goal, decision capture | D11 | M6 | B11, B12 | I5 | U6 | - | E4 |
| Conventions sweep | D12 | M6 | - | - | - | - | - |
| Unattributed | D5, D10 | M1, M4 | B1, B3, B5, B7, B8, B9 | I1 | - | O1 | E1, E2 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Ranked synthesis with release coverage, verification log and convergence report |
| `research/` state, iterations, deltas, registry, resource map | Created | Workflow state for 20 distinct generation-2 iterations |
| `research_archive/20261108T201439Z/` | Created | Generation 1, archived at the executor switch |
| `spec.md` | Modified | Generated findings fence under Open Questions, REQ-001 wording, status |
| `plan.md`, `tasks.md`, `decision-record.md`, `timeline.md` | Modified | Final state, decisions D-01 to D-18, full steering log |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`deep-research-auto.yaml` ran one loop pass per call. Generation 1 ran on `cli-devin` until the Devin daily quota ran out at iteration 3. Generation 2 restarted on `cli-pi` `opencode-go/deepseek-v4.1-flash` at thinking max and ran 20 distinct iterations. Each passed `verify-iteration.cjs`; iterations 15 and 19 passed only after the workflow's one redispatch. After each iteration the orchestrator opened at least two citations and re-ran behavioural claims: the advisor, the detector and the plugin suite. The checkpoint after iteration 10 extended the run to 15. After the first close, the lead reopened it under the depth rule; the dispatch-audit P1 at iteration 18 was the last new one, and the next three distinct iterations were clean, so the rule cleared at the ceiling of 20. Synthesis ran `reduce-state.cjs --emit-resource-map`, `synthesis-closeout.cjs` (event `synthesis_complete`), the spec writeback and the terminal telemetry row.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Switch to `cli-pi` through a generation-2 restart | Devin returned `resource_exhausted`, and `cli-deepseek-harness` cannot dispatch on the single-executor path |
| Extend to 15, then reopen to 20 | Six releases were only partly read at iteration 10; the lead's depth rule then required passes until three in a row added no new P1 |
| Downgrade the front-door disagreement to P2 | No operator sees the Python ranking |
| Correct five executor claims | Each failed a check the orchestrator ran: a clean-environment suite run, the lead-phrase rule, the child-session comment, an existing fixture, a count nobody could reproduce |
| Keep the cross-cluster git-hook findings as P2s | They are verified, but they belong to cluster 005 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations in `research/deep-research-state.jsonl` | 20 distinct iterations; 22 `"type":"iteration"` rows because iterations 15 and 19 were redispatched once |
| Depth-bar score at close | 3 of 3 clean: the last three distinct iterations (19, 21, 22) added no new P1 to `research/research.md`. Their one raw P1 entry, f-iter019-004 (no Claude or Codex goal adapter), is listed there as refuted: both runtimes use the host's native goal command by design. newInfoRatio 0.62, 0.50 and 0.30 |
| `verify-iteration.cjs` per iteration | exit 0 on all 20; iteration 15 after one redispatch (`route_proof_missing`), iteration 19 after one (`delta_file_missing`) |
| Top finding 3 (reopened run): dispatch-audit cwd | Read `dispatch-audit-posttooluse.mjs:56-57`; `git check-ignore -v` on the stray log printed `.gitignore:263` |
| `synthesis-closeout.cjs` | exit 0, staged `synthesis_complete`, gateway exit 0 |
| Top finding 1: menu detector | Reproduced the `1.` false negative and the `1)` false positive through `detectProseMenu` |
| Top finding 2: Stop hook stdin | Read `ask-surface-stop.cjs:83` and `advisory-stop.cjs:44` |
| Front doors (now P2) | Ran Node and Python on the same prompt; the rankings differ, but no operator reaches the Python one |
| Top finding 4: Hermes in the manifest | `agents-md-manifest.cjs --check` exit 1; 3 `hermes` hits |
| Top finding 5: doctor routing | "my hooks are not firing, what do I run" returned no doctor command in the top three |
| Repository outside this folder | `git status --porcelain` shows only the two entries present before the run |
| `validate.sh --strict` | `Summary: Errors: 0`, `RESULT: PASSED` at close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A stray audit log was left in place.** `specs/system-speckit/runtime-and-release/004-v4-release-line-research/.skilled/logs/cli-dispatch-audit.log` was written by the session's Bash audit hook and holds records from other agents, so this run did not delete it.
2. **Three strategy questions stayed unticked.** They were investigated, but the state log drops `answeredQuestions`, so the report says 8 of 11.
3. **The workflow counts rows, not iterations.** Each redispatch left a duplicate row, so iteration numbers skip 16 and 20 and the terminal status row counts 22.
<!-- /ANCHOR:limitations -->

---
