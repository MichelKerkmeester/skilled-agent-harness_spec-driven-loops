---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "advisor council removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/004-advisor-council-removal"
    last_updated_at: "2026-11-15T01:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed child 004 with every acceptance row Met"
    next_safe_action: "Close child 005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-advisor-council-removal"
      parent_session_id: null
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
| **Spec Folder** | 004-advisor-council-removal |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The skill advisor no longer scores council wording for the deep-loop hub. A prompt that asks to convene a council now returns `/speckit:ai-council` at confidence 0.84.

### Phase 4: advisor-council-removal

Before this child, the hub's council lanes and the new command row competed for the same prompt, and both ended at 0.25, so nothing was offered. The lanes are removed from the TypeScript scorer and the Python router. You ask for a council and the advisor names the one command that runs it.

Removing the lanes was not enough on its own. The council prompt compares plans, which the scorer read as a read-only request and capped. A prompt that asks to convene a council is lifted off that floor for the council command row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/aliases.ts`, `lanes/explicit.ts`, `lanes/lexical.ts`, `fusion.ts` | Modified | No hub council lanes, and the read-only lift for the council command |
| `runtime/scripts/skill_advisor.py` | Modified | The Python router drops the council mode and its deep-signal words |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modified | No `/deep:ai-council` rows |
| `runtime/tests/routing-parity-deep-council.vitest.ts` | Deleted | It tested a route that no longer exists |
| `runtime/scripts/routing-accuracy/command-prompts.jsonl`, `holdout-prompts.jsonl` | Modified | Three command rows and two holdout rows for the retired command are removed |
| `runtime/scripts/routing-accuracy/scorer-eval-baseline.json`, `command-routing-baseline.json` | Recaptured | Baselines for the smaller corpora |
| `.github/workflows/routing-registry-drift.yml` | Modified | The deleted test leaves the list |
| `runtime/tests/command-metadata-e2e.vitest.ts` | Modified | The command census is 27 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Two DeepSeek dispatches did the TypeScript scorer and the Python router with their parity tests. Each diff was read. The advisor was rebuilt and its server restarted before each replay, because the server holds the compiled scorer. The first suite run had 1707 passed and 1 failed on the command census, which was corrected from 28 to 27 and rerun green. The work is in commit `adbba5a06a` with child 002.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| A read-only lift in `fusion.ts` | Without it the council prompt stayed capped after the lanes left. The lift is limited to the council command row and four convene phrasings. |
| This child was committed before child 003 | The commit gate compares the hub registry with the advisor's mode map, so the advisor change had to land with the hub change. |
| The holdout builder was not rerun | `build-holdout.mjs --write` would add 16 rows that have nothing to do with the council. The two council rows were removed by hand instead. |
| The `deliberation` boost and the `architecture decision` signal were removed by hand | Both pushed non-council prompts toward the hub after the mode was gone. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `advisor_recommend` for "convene an ai council to compare three migration plans" | `/speckit:ai-council` at 0.8412 |
| Hub stage two for the same prompt | `defer` |
| Advisor vitest suite at close | 178 files passed, 1708 passed, 6 skipped |
| Scorer baseline | Holdout top-1 moved from 50 of 66 to 49 of 64. Every other metric is unchanged |
| `npm run typecheck` in the advisor | Exit 0 |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A question about councils is not a request for one.** "what is an ai council and how does it compare to a review" routes to `sk-code` at 0.89. That was seen and not investigated here.
2. **The holdout builder is 16 rows behind.** Its next `--write` will add them. Review that diff on its own.
<!-- /ANCHOR:limitations -->

---


