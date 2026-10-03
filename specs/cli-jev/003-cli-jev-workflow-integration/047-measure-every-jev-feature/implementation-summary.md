---
title: "Implementation Summary"
description: "Every one of the 15 unmeasured Jev features now has a result its own scorer printed: 11 live Jev verdicts and 4 zero-call bounds. Five keep, four kill, two stop on margin, four show no headroom."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature"
    last_updated_at: "2026-10-02T18:40:31Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded all 15 results"
    next_safe_action: "Merge worktrees/082-measure-every-jev-feature to main on the operator's go"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-measure-every-jev-feature"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 047-measure-every-jev-feature |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every Jev feature the parent built now has a measured result. Before this phase, 15 of them stopped at a label gate or a zero-call stop, so nobody could say what Jev adds to them. Each now has a line its own scorer printed, listed in `scratch/evidence/results.md`.

### Phase 47: measure every Jev feature

| Result | Features |
|---|---|
| Keep: Jev beats the baseline | 020 routing clarify (28 vs 15 of 54), 022 folder suggestion (39 vs 30 of 40), 024 hallucination grader (55 vs 47 of 56), 025 verdict fallback (24 vs 8 of 24), 030 fan-out merge (53 vs 12 of 60) |
| Kill: Jev loses or adds false flags | 006 goal-criteria lint (both rules), 027 stop second rater (11 vs 17 of 25), 028 stop hint (9 of 11 hints wrong), 033 residue flagger (precision 7 of 13) |
| Stop on margin: Jev wins, but by less than 0.10 | 026 completion claims (102 vs 93 of 110), 031 debug next check (27 vs 29 of 36) |
| Zero-call bound: nothing for Jev to win | 003 goal verifier (0 met turns in 50), 005 compaction recall (no-model truncation keeps 3.55 times the tokens), 021 leaf route (2 tied rows of 58), 034 HVR reader lens (flag-nothing right on 144 of 146) |

Six results rest on fixture corpora because real rows fell short of the gate: 020, 022, 024, 025, 031 (from 042) and 033. Each row of `results.md` names its corpus.

One scorer changed. 027's gold derivation counted a lineage's own run files as outside sources, which made the delegated arbiter's read disagree with the derived gold. It now skips a source that resolves inside the lineage, unless the source is a tracked repository path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs` | Modified | Gold derivation skips the lineage's own files |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-stop-rater.vitest.ts` | Modified | Cases for own, anchored, absent, bare and outside sources |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` | Modified | States the source rule |
| `047-measure-every-jev-feature/scratch/evidence/results.md` | Created | The 15 result rows |
| `047-measure-every-jev-feature/scratch/fixtures/` | Created | Unlabeled fixture rows for 020, 022, 024, 025 and 033 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Features whose gates were open ran first: 006, 021, 030 and 031. 003, 005 and 034 were rerun with zero calls on the current tree. 003's labeled rows had been lost with the removed 071 worktree. They were rebuilt from the Pi sessions and re-joined to the arbiter's surviving labels by id, and all 50 matched. A fresh Opus 5.5 medium arbiter labeled every new row blind, as 042's ADR-001 set out. Luna 6 and DeepSeek V4.1 Flash built the fixtures and the 027 fix. Every live run passed `jev auth status --provider official` first and used `--jev --out`. Label files and run outputs stay in `~/.skilled/.labels/`, outside the repository.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixture sets fill thin corpora | Four features had 0 to 3 real rows against gates of 12 to 100, so no real run could open them |
| 024 got 14 careless-model answers | 42 answers from the fixtures alone held 0 invented names, so the gate's 5 yes rows could not be met |
| 026 added 60 Claude turns to its 50 Pi turns | The Pi turns held no completion claims |
| Fix 027 rather than relabel | The arbiter's reading followed 042's rulings, and the code broke them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `results.md` rows | 15 Done, 0 Pending |
| 027 and 028 suites | 97 passed, 0 failed. The rater suite alone held 58 before the fix |
| Cross-family review of the 027 fix | Four rounds. Each P0 and P1 fixed, except one latent P0 recorded with evidence in the goal log |
| `check-goal.cjs` on the goal | PASS, 5/5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixture results measure constructed cases.** 020, 022, 024, 025, 031 and 033 rest on fixtures, so their results show what Jev does on cases built to reach the gate, not on real traffic.
2. **022's fixture never puts the right folder in `target`.** Its result compares Jev with the top alternative only.
3. **021 prints `no headroom`, not a `stop:` line.** That is its scorer's zero-call bound: 2 tied rows of 58, under its improvable minimum.
4. **A citation's base is inferred.** A path whose first segment exists at the repository root is read as repository-rooted. No real citation is misread today, but a future outside path with an unknown root and a `deep-research-` or `iteration-N.md` name would be dropped.
5. **The arbiter overwrote two old scratchpad files** (`w13.txt`, `w39.txt`) while labeling 033. Neither was needed by this phase.
<!-- /ANCHOR:limitations -->

---


