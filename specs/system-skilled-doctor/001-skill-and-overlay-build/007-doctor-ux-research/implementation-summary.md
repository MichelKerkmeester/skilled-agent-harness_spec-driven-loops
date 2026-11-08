---
title: "Implementation Summary"
description: "Five cli-devin deep-research iterations ranked 22 improvements to the doctor overlay engine and the external-repo onboarding path; six Tier 1 items are confirmed against the code."
trigger_phrases:
  - "doctor ux research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/007-doctor-ux-research"
    last_updated_at: "2026-11-08T16:39:25Z"
    last_updated_by: "generate-context"
    recent_action: "Ran 5 deep-research iterations and synthesized ranked, code-checked recommendations"
    next_safe_action: "Plan a build phase from research.md Tier 1 items 1 to 6"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-005.md"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/hooks/overlay-guard/lib/overlay-guard.cjs"
      - "INSTALL-SKILLED.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-doctor-ux-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "b2bc3af2-2d66-4d13-9d70-784e628579d2"
      workspace: "/Users/michelkerkmeester/worktrees/public/330-doctor-ux-research"
      savedAt: "2026-11-08T16:39:25Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions:
      - "Q2"
      - "Q5"
    answered_questions:
      - "Q1"
      - "Q3"
      - "Q4"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-doctor-ux-research |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You now have a ranked, code-checked list of what to fix in the doctor overlay engine and the onboarding path for external repositories. The six Tier 1 items are the failures a new external repository is most likely to hit. Each one was confirmed against the code.

### Phase 7: doctor-ux-research

The research found that the backup and rollback design is sound, but the copy path builds a tree that cannot run. The engine never checks the tree against its pin, the guard allows writes it cannot judge, rollback ignores the live tree, and re-pin backups end up in your commits. `research/research.md` holds the full ranking, and the Tier 1 list is ready for a build phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Deep-research state, five iterations, resource map and `research.md` |
| `spec.md`, `plan.md`, `tasks.md` | Modified | Filled the scaffold for a research packet and wrote back the findings |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The deep-research auto workflow ran each iteration as a fresh Devin process on `deepseek-v4-1-flash-max`. `verify-iteration.cjs` checked the narrative, route proof and delta after each one, and the reducer refreshed the state between iterations. The orchestrator then re-read the code behind every Tier 1 finding before writing the synthesis.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Per-iteration ceiling of 1800 seconds instead of 900 | DeepSeek at max effort can run long, and a timeout discards the whole iteration |
| Rank the link path above the copy path for now | The copy path misses builds and finishing steps until Tier 1 item 1 lands |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `verify-iteration.cjs`, iterations 1 to 5 | PASS: OK for each, ratios 0.72, 0.78, 0.74, 0.76, 0.60 |
| Write containment | PASS: no writes outside `research/` |
| Tier 1 code check | 7 confirmed, 1 unconfirmed (`/doctor:mcp install` target) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Q2 and Q5 are partial.** Command messages and the doc-against-code diff were sampled, not surveyed. `/doctor:helper` and `/doctor:update` were not examined. A follow-up research pass can close them.
<!-- /ANCHOR:limitations -->

---


