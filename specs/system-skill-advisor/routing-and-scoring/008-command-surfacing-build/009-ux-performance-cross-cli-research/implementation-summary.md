---
title: "Implementation Summary"
description: "Segments one and two of the research are done. Segment one ranked 14 recommendations. Segment two ranked 18 items: 13 were built in phases 012 and 013, one waits on the operator and four are declined. Segment two did not converge, so segment three follows the merge to main."
trigger_phrases:
  - "ux performance cross cli research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research"
    last_updated_at: "2026-11-13T08:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the merged segment two research and its dispositions"
    next_safe_action: "Run segment three after the branch is merged to main"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-ux-performance-cross-cli-research"
      parent_session_id: null
    completion_pct: 50
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
| **Completed** | Not complete. Segment one finished 2026-11-12 and segment two 2026-11-13. Segment three has not run |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a ranked list of what command surfacing still loses after phases 005 to 008, with a file, a gain and a check for each item. The list says the open gaps are reachability, attribution and first-run behaviour, not the wording of the brief or its steady-state cost (`research/research.md` section 1).

### Segment One Research

Three lineages ran in parallel, one per lane: `ux` with 5 iterations, `performance` with 5 and `cross-cli` with 3 (`research/fanout-attribution.md`). The orchestrator merged their syntheses into `research/research.md`, which ranks 14 recommendations in section 9 and records the conflicts between lineages in section 8. No code changed in this child.

### Segment Two Research

Three more lineages ran on 2026-11-13 against the built phases 005, 006, 008 and 010 and the after arm of phase 007: `offer-reach` with 4 iterations, `cross-cli-2` with 4 and `ux-cost-2` with 3, against a cap of 4 (`research/deep-research-config-segment-2.json`). The merged synthesis `research/research-segment-2.md` ranks 18 items in section 3. Thirteen were built in phases 012 and 013, both Complete. Rank 14, a Gate 2 clause for a brief that names a skill and no command, waits on the operator. Ranks 15 to 18 are declined with the reasons in that section. The dispositions are in the segment two table of `tasks.md`.

Segment two did not converge. `offer-reach` and `cross-cli-2` stopped at their cap with novelty still high and only `ux-cost-2` converged (section 5). Segment three continues those two lanes. Its launcher is prepared and has not run. It starts after the branch is merged to main, by operator instruction of 2026-11-13.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Lineage state, iterations, the merged registry and the merged synthesis |
| `research/lineages/offer-reach/`, `research/lineages/cross-cli-2/`, `research/lineages/ux-cost-2/`, `research/research-segment-2.md` | Created | Segment two lineages and its merged synthesis |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | The packet documents and the disposition table |
| `../spec.md` | Modified | The phase 9 row in the Phase Documentation Map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out ran on 2026-11-12 with DeepSeek v4.1 flash at max effort through OpenCode Go (`research/deep-research-config.json`). All three lineages succeeded with no failures (`research/orchestration-summary.json`). The orchestrator re-checked the load-bearing claims against source and marked them `[CHECKED]` (`research/research.md` section 15).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep this child research only | Each accepted recommendation touches a different surface, so each gets its own build phase with its own baseline and check |
| Run a second segment after phases 005 to 008 are built | Open question 1 in `research/research.md` section 12, whether an offer moves a start, can only be answered against the built brief and the phase 007 after arm |
| Run segment three after the merge to main | Segment two did not converge, and segment three should read the measured gains of phases 012 and 013 rather than predicted ones. The operator set the timing on 2026-11-13 |
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Flash executor.** Numbers the orchestrator did not re-check carry only the lineage's citation (`research/research.md` section 15). A build phase measures its own baseline before it claims a gain.
2. **Segment one dispositions are still open.** The segment one disposition table in `tasks.md` has no values yet. The segment two table is filled.
3. **Segment two did not converge.** Two of three lineages stopped at their iteration cap. Segment three carries convergence.
4. **Questions carried into segment three.** Plain reach on the holdout split is 1 of 44 while the tune split reads 23 of 45, so the phase 012 gains do not transfer to unseen wording. Hook health shows in `/doctor:setup` only after a run with `SKILL_ADVISOR_DEBUG=1`. The fallback scorer loses the mode label, the doctor hand-off and plain offers when the daemon is unreachable (`../012-plain-offer-reach/scratch/live-heads.txt`). Claude Code sees 32 of 44 tracked commands. Questions 3 and 4 of `research/research.md` section 12 are not answered.
5. **Rank 14 waits on the operator.** The Gate 2 bullet is frozen at the text the operator approved.
<!-- /ANCHOR:limitations -->
