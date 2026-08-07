---
title: "Implementation Summary: resolve 005 deep-research follow-on findings"
description: "Four fix groups applied and verified: SKILL.md two-mechanism trajectory correction, target-profiles .gitkeep restore + runnable vitest config, cli-devin recipe field strip with doc realignment + version bump, and a 2-citation cross-skill evergreen sweep."
trigger_phrases:
  - "resolve 005 deep-research followons summary"
  - "009 followon summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/015-deep-agent-improvement-deep-research-followon-findings"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "four-fix-groups-applied-and-verified"
    next_safe_action: "commit-and-push"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/deep-agent-improvement/SKILL.md"
      - ".opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json"
      - ".opencode/skills/deep-research/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000009004"
      session_id: "131-000-009-followons"
      parent_session_id: "131-000-009-followons"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "LG-0001: two distinct mechanisms confirmed in code; the 005 reword was wrong and is corrected"
      - "target-profiles refs are by-design (intentionally-empty catalog); fix was restoring the missing .gitkeep, not repointing config"
      - "cli-devin verification/bayesian/fallback recipe fields are not valid devin agent-config keys; stripped + deferred-documented like mcp_servers"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary

> **Status**: COMPLETE. All four fix groups applied and verified.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/002-deep-research-followon-findings` |
| **Completed** | 2026-05-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four independent fix groups closing the remaining 005 deep-research follow-ons + 008 residuals across four skills.

- **F1 — LG-0001 correction (deep-agent-improvement).** `SKILL.md` §6 "Dimension Trajectory" paragraph rewritten to describe two distinct convergence signals: `mutation-coverage.cjs` `checkConvergenceEligibility()` (`DEFAULT_STABILITY_DELTA = 2`, the +/-2 tolerance-band eligibility, confirmed at `scripts/mutation-coverage.cjs:36`) and `reduce-state.cjs` `stopOnDimensionPlateau` (exact-repeat plateau stop). The 005 reword had collapsed both into "exact-repeat", which was wrong — the original +/-2 text correctly described the trajectory mechanism.
- **F2 — config + vitest (deep-agent-improvement).** Restored the missing `assets/target-profiles/.gitkeep` (the `target_manifest.jsonc` comment documents this dir as an intentionally-empty catalog referenced for path consistency; it had gone missing — the config refs are by-design, not vestigial). Added `scripts/vitest.config.mjs` (include `tests/**/*.vitest.ts`, which sits outside Vitest's default globs) so the previously-unrunnable suite executes.
- **F3 — cli-devin recipe drift / T122 (cli-devin).** Stripped `verification_enabled`, `verification_languages`, `bayesian_scoring_enabled`, `bayesian_score_file`, and `fallback_chain` from all three `assets/agent-config-*.json` recipes, plus the three stale `system_instructions` describing them and the vestigial `agent-state/tool-scores-*` write scopes. Realigned the 3 Phase-004 feature docs (`output-verification.md`, `quota-fallback.md`, `confidence-scoring-rubric.md`) to mark the recipe fields deferred (same constraint as `mcp_servers`), added a "Rejected custom fields" note to `agent-config-recipes.md` §2, bumped `SKILL.md` `1.0.6.3 → 1.0.6.4`, and added `changelog/v1.0.6.4.md`.
- **F4 — cross-skill evergreen sweep (deep-research, deep-ai-council).** Reworded `deep-research/README.md:235` (dropped "arc 118 ... 117 SPLIT") and `deep-ai-council/references/depth_dispatch.md:24` (dropped "packet 129").
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`sk-code` (OPENCODE surface) for the JSON recipes, JSONC/JSON config, and the new `.mjs` vitest config; `sk-doc` for the markdown doc edits and the changelog. Each fix group verified with its surface-appropriate check (JSON validity, the documented `devin --agent-config` strict-parse smoke, `vitest run`, `verify_alignment_drift.py`, and an evergreen re-grep). The investigation-before-fix on LG-0001 reversed the 005 conclusion (confirmed two mechanisms in code), and F2's investigation reframed the "vestigial config" as a missing by-design dir.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F1 corrects (not re-confirms) the 005 reword | `mutation-coverage.cjs:36` `DEFAULT_STABILITY_DELTA = 2` + `feature_catalog/01--evaluation-loop/06-plateau-detection.md` prove the +/-2 trajectory eligibility and the exact-repeat plateau are separate; Devin's iter-1 "same mechanism" verdict (applied in 005) was a false positive |
| F2 restores `.gitkeep` rather than repointing config | The `target_manifest.jsonc` comment documents `target-profiles` as an intentionally-empty catalog (distinct from `benchmark-profiles`); the refs are by-design, so the fix is making the documented dir exist |
| F3 strips fields rather than wait for devin support | The strict parser rejects them today (dispatch fails); `agent-config-recipes.md` §2 already documented the correct minimal schema, so the strip restores conformance. Features are deferred-documented exactly like `mcp_servers` |
| F3 keeps the detailed 5-thought `sequential_thinking` instruction | It is the empirically-better enforcement wording from the original recipes; system_instructions strings are opaque to the strict parser, so detail costs nothing at parse time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| F1 SKILL.md §6 corrected (both mechanisms + source files named) | PASS |
| F2 target-profiles/.gitkeep restored | PASS |
| F2 vitest suite runs (config added) | PASS — 8 files, 99/99 tests, 400ms |
| F3 JSON validity (3 recipes) | PASS |
| F3 devin strict-parse smoke (3 recipes vs `devin 2026.5.6-12`) | PASS — all 3 return `ok`, exit 0 (no "Failed to parse agent config") |
| F3 contract docs aligned + version bump + changelog | PASS |
| F4 2 citations reworded | PASS |
| sk-code alignment drift (deep-agent-improvement) | PASS — 39 files, 0 violations |
| Evergreen re-grep (touched runtime docs, excl changelog) | PASS — 0 arc/packet citations |
| Strict validate (009) | PASS (see commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The cli-devin output-verification, quota-fallback, and Bayesian-confidence features have no recipe-level opt-in until Devin supports custom `--agent-config` fields (the same deferral as `mcp_servers`). The features' post-dispatch design is documented but currently inert at the recipe layer; activation would require a Devin-supported channel. This is a deferred capability, not a regression — the fields never parsed against the current binary.
<!-- /ANCHOR:limitations -->
