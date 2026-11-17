---
title: "Implementation Summary"
description: "Four research segments ran and the research is judged converged on coverage. Their ranked items were built in phases 010 to 016 or declined. Every ranked item and open question now has a recorded outcome, so the phase is Complete."
trigger_phrases:
  - "ux performance cross cli research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research"
    last_updated_at: "2026-11-13T06:58:23Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase: every ranked item is built or declined and question 4 is carried"
    next_safe_action: "None in this phase: the Codex-only arm of phase 007 takes question 4"
    blockers: []
    key_files:
      - "research/research-segment-3.md"
      - "research/research-segment-2.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-ux-performance-cross-cli-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "fddcf466-8e1f-44cf-a132-6f846b676c18"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-13T06:58:23Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-ux-performance-cross-cli-research |
| **Completed** | Not complete. Segment one finished 2026-11-12 and segments two to four 2026-11-13. Two segment one rows and one open question have no recorded outcome |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a ranked list of what command surfacing still loses after phases 005 to 008, with a file, a gain and a check for each item. The list says the open gaps are reachability, attribution and first-run behaviour, not the wording of the brief or its steady-state cost (`research/research.md` section 1).

### Segment One Research

Three lineages ran in parallel, one per lane: `ux` with 5 iterations, `performance` with 5 and `cross-cli` with 3 (`research/fanout-attribution.md`). The orchestrator merged their syntheses into `research/research.md`, which ranks 14 recommendations in section 9 and records the conflicts between lineages in section 8. No code changed in this child.

Of the 14, seven were built in full: ranks 1, 3, 5, 6 and 10 in phase 010, rank 12 in phase 011 and rank 9 in phases 011 and 016. Two were built in part: rank 2 in phase 010 and rank 14 in phase 011. Three were declined: rank 4 and rank 13 because the cold first prompt measured fail-open 0 of 5 inside the hook budget, and rank 8 because the Gate 2 bullet is frozen at the text the operator approved. Ranks 7 and 11 have no recorded disposition. The segment one table of `tasks.md` holds each row.

### Segment Two Research

Three more lineages ran on 2026-11-13 against the built phases 005, 006, 008 and 010 and the after arm of phase 007: `offer-reach` with 4 iterations, `cross-cli-2` with 4 and `ux-cost-2` with 3, against a cap of 4 (`research/deep-research-config-segment-2.json`). The merged synthesis `research/research-segment-2.md` ranks 18 items in section 3. Thirteen were built in phases 012 and 013, both Complete. Five are declined. Ranks 15 to 18 are declined with the reasons in that section. Rank 14, a Gate 2 clause for a brief that names a skill and no command, was declined by the operator on 2026-11-13 (decision Q053). The dispositions are in the segment two table of `tasks.md`.

### Segment Three Research

Segment three ran on 2026-11-13 after the merge to main, against the built phases 011, 012 and 013: `offer-reach-3` with 6 iterations, `cross-cli-3` with 6 and `ux-cost-3` with 5 (`research/research-segment-3.md`). It ranks 16 items. The final dispositions are in `../goal.md` section 4:

- Built in phase 015: ranks 1, 2, 3, 4, 5, 9 and 11.
- Built in phase 016 on the operator's answers: rank 7 as the rename of `/create:skill` to `/create:sk-skill` (decision Q049) and rank 13 with the narrow show-up cue (decision Q045).
- Declined: ranks 8, 14, 15 and 16 with the reasons in the synthesis, and rank 12 by the operator, so the degraded brief keeps carrying only a typed command (decision Q041).
- Measured in segment four first: ranks 6 and 10.

### Segment Four Research

Segment four ran on 2026-11-13 against phases 014 and 015: `embed-text-4` with 3 iterations, `inprocess-timing-4` with 3 and `residual-limits-4` with 4 (`research/research-segment-4.md`). It ranks 9 items. Two were built in phase 016 (commit `ec1869dae8`): richer command text for five commands, which moved plain holdout reach from 3 to 5 of 44, and the brief-cost temp path fix. The other seven are declined. Ranks 5 to 9 are declined with the reasons in the synthesis, among them segment three rank 6 because 0 of 1,283 real records took the local scorer. Ranks 3 and 4, the OpenCode receipt and the longer cap, are declined because the operator chose no more behaviour arms (decision Q046). The later amendment for one Codex-only arm (decision Q052) leaves that decline in place.

### Convergence

No segment reached the 0.05 novelty threshold. Segment four judged the research converged on coverage, because every open item needs a build, a live arm, a week of real traffic or an operator decision, which a research lane may not create (`research/research-segment-4.md` section 6). The goal log records the same judgment.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Lineage state, iterations, the merged registry and the merged synthesis |
| `research/lineages/offer-reach/`, `research/lineages/cross-cli-2/`, `research/lineages/ux-cost-2/`, `research/research-segment-2.md` | Created | Segment two lineages and its merged synthesis |
| `research/lineages/offer-reach-3/`, `research/lineages/cross-cli-3/`, `research/lineages/ux-cost-3/`, `research/research-segment-3.md` | Created | Segment three lineages and its merged synthesis |
| `research/lineages/embed-text-4/`, `research/lineages/inprocess-timing-4/`, `research/lineages/residual-limits-4/`, `research/research-segment-4.md` | Created | Segment four lineages and its merged synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | The packet documents and the disposition tables |
| `../spec.md` | Modified | The phase 9 row in the Phase Documentation Map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Segment one ran on 2026-11-12 with DeepSeek v4.1 flash at max effort through OpenCode Go (`research/deep-research-config.json`). Segments two to four used the same executor with caps of 4, 6 and 8 iterations (`research/deep-research-config-segment-2.json` to `-segment-4.json`). Each segment's merge re-checked the load-bearing lineage claims against source before ranking, in section 2 of each later synthesis and section 15 of `research/research.md`. Segments three and four were drafted by Opus 5.5 and their dispositions were decided by the coordinator and the operator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep this child research only | Each accepted recommendation touches a different surface, so each gets its own build phase with its own baseline and check |
| Run a second segment after phases 005 to 008 are built | Open question 1 in `research/research.md` section 12, whether an offer moves a start, can only be answered against the built brief and the phase 007 after arm |
| Run segment three after the merge to main | Segment two did not converge, and segment three should read the measured gains of phases 012 and 013 rather than predicted ones. The operator set the timing on 2026-11-13 |
| Measure segment three ranks 6 and 10 in a fourth segment before any build | Both carried floor risk and had no measured gain. Segment four built rank 10's command text and declined rank 6 on its numbers |
| Stop after segment four | No lineage came near 0.05, and every open item needs a build, an arm, real traffic or the operator. The research is recorded as converged on coverage |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq -c '{total, succeeded, failed}' research/orchestration-summary.json` | PASS: `{"total":3,"succeeded":3,"failed":0}` |
| `rg -c '^\| [0-9]+ \| ' research/research.md` | PASS: 14 ranked rows |
| `ls research/lineages/<label>/iterations \| wc -l` for `offer-reach`, `cross-cli-2` and `ux-cost-2` | 4, 4 and 3 |
| `rg -c '^\| [0-9]+ \| ' research/research-segment-2.md` | PASS: 18 ranked rows |
| `ls research/lineages/<label>/iterations \| wc -l` for `offer-reach-3`, `cross-cli-3` and `ux-cost-3` | 6, 6 and 5 |
| `ls research/lineages/<label>/iterations \| wc -l` for `embed-text-4`, `inprocess-timing-4` and `residual-limits-4` | 3, 3 and 4 |
| `git log --oneline -1 ec1869dae8` | The phase 016 commit that builds segment three ranks 7 and 13 and segment four ranks 1 and 2 |
| `validate.sh --strict` on this folder, 2026-11-13 | PASS: `Errors: 0 Warnings: 1` and `RESULT: PASSED`. The warning is `SOURCE_TAGS` on lineage iteration files under `research/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Flash executor.** Numbers the orchestrator did not re-check carry only the lineage's citation (`research/research.md` section 15). A build phase measures its own baseline before it claims a gain.
2. **Five late declines rest on judgment.** The coordinator declined segment one ranks 7 and 11 and three guards of rank 14 on 2026-11-13, with the reasons in the `tasks.md` disposition table, after a read-only second opinion checked each reason against the files. Rank 7 is declined because no behaviour arm is left to measure it, not because the need is gone: the final arm reads pi 6 of 12 and dsh 9 of 12.
3. **One segment one question is carried, not answered.** Question 4 of `research/research.md` section 12, how a failed host invocation shows up, is carried in `tasks.md` T008 to the Codex-only arm of phase 007, because Codex received no brief in any earlier arm.
4. **Converged on coverage, not on the threshold.** No lineage of any segment came near 0.05. The T012 Verify asks for a converged stop reason in the segment three synthesis, which records that it did not converge, so T012 is closed on the segment four judgment of convergence on coverage.
5. **Follow-ups carried forward, not part of this phase.**
   - Plain holdout reach reads 5 of 44 after phase 016. The operator called it low on 2026-11-13 and it is logged for a follow-up packet (`../goal.md` section 4).
   - Write discipline on Devin and OpenCode is tracked for a separate packet, by operator answer of 2026-11-13.
   - The live brief cost is unmeasured by a committed script, which still refuses with `degraded_brief`. Segment four reads a median of 306 bytes from a lineage's own output, not rerun.
   - Segment four section 7 lists eight open questions, each with its owner.
<!-- /ANCHOR:limitations -->
