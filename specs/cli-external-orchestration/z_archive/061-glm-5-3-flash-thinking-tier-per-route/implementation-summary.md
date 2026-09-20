---
title: "Implementation Summary: GLM-5.3-Flash restored to max on the two routes that have it"
description: "A week-old pin sent GLM-5.3-Flash to a thinking tier neither fan-out provider offers. Removing it restored max, and the guard test that had been failing since the regression landed went green without being edited."
trigger_phrases:
  - "implementation"
  - "glm max restored"
  - "xhigh override removed"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/061-glm-5-3-flash-thinking-tier-per-route"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Shipped the fix; 204/204 green"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-061-glm-thinking-tier"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 061-glm-5-3-flash-thinking-tier-per-route |
| **Completed** | 2026-09-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

For a week, every deep-loop fan-out lineage running GLM-5.3-Flash sent `--thinking xhigh` to a provider that does not offer that tier. The pin responsible was added on 2026-08-29 under the belief that `xhigh` was the model's top tier. On OpenRouter and opencode-go the ladder is `low`/`high`/`max`, with no `xhigh` at all — so the change suppressed the real ceiling and substituted one that does not exist.

The fix removes the override. `isFlashMaxPinnedModel` already matched both GLM literals and already returned `max`; the override was intercepting that answer. Deleting it and its call restores correct behavior without adding a branch.

The `xhigh` belief was not invented — it is true on **Cline**. But the Cline route dispatches directly under its own tier map in `.pi/models.json` and never reaches this code, so a Cline-only fact had been generalized across two routes it does not describe. The code comments and both catalogs now say the ceiling is per-route and name Cline as the exception.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Removed `isGlmFlashXhighPinnedModel` and its call; comment states the per-route rule |
| `runtime/scripts/fanout-run.cjs` | Modified | Same removal in the mirror, comments kept in sync |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | Four GLM assertions `xhigh` → `max`; dead import dropped; `glm-5.1` pass-through added |
| `cli-opencode/references/providers-and-models.md` | Modified | Two rows corrected to the real ladder |
| `cli-pi/references/providers-and-models.md` | Modified | Two rows corrected likewise |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first, which is the only reason this was found at all. The suites were run before any edit while preparing a different packet, and came back `203 passed / 1 failed`. That failure was not noise: `fanout-run.vitest.ts:1541` asserted `max` and had been red since the regression landed.

Ground truth came from `opencode models <provider> --verbose` rather than from the docs, which turned out to repeat the same error as the code. Then the producer was located, its consumers inventoried, and the override deleted.

The decisive evidence is the negative control. `fanout-run.vitest.ts` was left untouched and went from red to green on its own — the diff on that file is empty. Had the fix required editing it, that would have been a sign of papering over the symptom rather than fixing the cause. The assertions that were edited are the ones in the *other* suite, which had been updated to match the bug.

Final gate: `204 passed / 204`. `node --check` clean. `npm run typecheck` reports errors only in two files this change never touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the override rather than make it provider-aware | Both literals reaching the pin are already route-bound, and Cline's ceiling is enforced elsewhere — branching would handle no case that removal does not |
| Leave `fanout-run.vitest.ts` alone | It was already correct. Editing it would have destroyed the only independent check that the fix works |
| Fix only the GLM half of the August commit | Its DeepSeek reasoning is sound; a wholesale revert would have removed a correct change alongside the wrong one |
| Own packet, not folded into the DevPass work | Different root cause, and a defect touching live dispatch deserves a revert story that is not entangled with a feature |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both guard suites | PASS — 204/204, from a baseline of 203 passed / 1 failed |
| Negative control | PASS — the previously-red test went green with an empty diff |
| `node --check fanout-run.cjs` | PASS |
| `npm run typecheck` | PASS for this change — remaining errors are in `deep-review-state-contract.ts` and `append-mode-event.ts`, neither touched here; zero in `executor-config.ts` |
| Scoped diff | PASS — exactly 5 files for this fix, index empty. The `.pi/` config changes in the same tree are the operator's own, not part of this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The old behavior's failure mode was never observed.** No dispatch of `--thinking xhigh` was sent to OpenRouter or opencode-go, so whether they rejected it or silently ignored it is unknown. `max` is correct either way, but this determines whether fan-out output produced since 2026-08-29 was quietly degraded — worth knowing before trusting those runs.
2. **Only the two fan-out routes were corrected.** The `llmgateway` GLM route carries both `xhigh` and `max` and is not yet on any roster; it belongs to the DevPass packet, which is still unimplemented.
3. **Verified by unit test, not by live dispatch.** The command builders are proven to emit `--thinking max`; no real GLM-5.3-Flash turn was run to confirm the provider accepts it.
4. **A working-tree change was reverted before it was understood.** Two `.pi/` config files turned out to be a deliberate operator change and were restored intact. The lesson is the general one: an unexplained edit in a shared tree is a question to ask, not noise to clear — reverting first and reporting second gets that order backwards.
<!-- /ANCHOR:limitations -->
