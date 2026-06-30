---
title: "Implementation Summary: advisor + adjacent-116 realignment"
description: "Applied safe adjacent-116 renames (optimizer manifest, gemini deep command, graph-aware-stop, config.ts flag) and corrected the research's advisor-scorer findings: the alias system makes sk-deep-* refs functionally correct, so the fixture/corpus/fusion.ts renames were reverted to preserve the blessed corpus parity gate."
trigger_phrases:
  - "advisor adjacent 116 realignment"
  - "advisor scorer alias sk-deep correction"
  - "corpus parity gate deep-research"
  - "015 003 advisor rework"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment"
    last_updated_at: "2026-05-26T09:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Applied safe adjacent-116 renames and reverted the unsafe advisor-scorer changes"
    next_safe_action: "Hand the deferred advisor-scorer realignment to a scorer-owner follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "70859d71-f191-429c-96cd-6b73bb9745d8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-adjacent-116-realignment |
| **Completed** | 2026-05-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase handled the adjacent-116 surface, and its main outcome is a **correction to the research**: the advisor scorer's `sk-deep-*` references are NOT live bugs — they are protected by an alias system, and the 197-prompt corpus parity gate is blessed against the current behavior. So the safe renames were applied and the advisor-scorer renames were reverted.

### Safe renames applied

`optimizer-manifest.json` `configPaths` now point at the real `deep-research/assets/` + `deep-review/assets/` config files (verified to exist). `.gemini/commands/deep/start-research-loop.toml` skill paths `sk-deep-*` → `deep-*`. `scripts/tests/graph-aware-stop.vitest.ts` reducer fixture path → `deep-research/` (test passes). `resource-map-extractor.vitest.ts` synthetic finding paths renamed (input+expected paired). `system-code-graph/mcp_server/core/config.ts` got a flag comment for the latent `defaultDir` vs documented-default mismatch (A-07, no behavior change).

### The advisor-scorer correction (reverted)

The research flagged `skill_advisor_regression_cases.jsonl` (A-01) + `labeled-prompts.jsonl` (A-02) as P1 live bugs. Investigation showed `lib/scorer/aliases.ts` puts BOTH `deep-research` (canonical) AND `sk-deep-research` (legacy alias) in the same group, so `canonicalSkillId('sk-deep-research') === 'deep-research'` — the gold labels resolve correctly. Confirmed empirically: at HEAD the `advisor-corpus-parity` + `python-ts-parity` gates PASS. Renaming the labels + activating `fusion.ts`'s dead `=== 'sk-deep-research'` bonuses broke the gate (decision count 45 → 86). All five advisor-scorer files were reverted to HEAD; parity is green again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Modified | configPaths sk-deep-*→deep-* (verified resolve) |
| `.gemini/commands/deep/start-research-loop.toml` | Modified | skill paths sk-deep-*→deep-* |
| `system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` | Modified | reducer fixture path→deep-research (passes) |
| `system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Modified | synthetic fixture paths (paired) |
| `system-code-graph/mcp_server/core/config.ts` | Modified | latent default-mismatch flag comment |
| advisor scorer/fixture/corpus (5 files) | Reverted to HEAD | not bugs — alias-protected; preserve corpus parity |
| 2 contract-parity vitest files | Reverted + FIXME | dormant; assert pre-116 unshipped contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Safe renames via literal node replacement scoped to specific files (aliases.ts/changelogs/historical-packet-names excluded). The `fusion.ts` scorer logic was dispatched to cli-codex (gpt-5.5/high/fast), but its parity impact was caught by running the advisor suite, then reverted after a `git checkout HEAD` baseline confirmed the gate passes without the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Revert all 5 advisor-scorer files (incl A-01/A-02) | Empirically: parity gate PASSES at HEAD, FAILS with the rename (45→86); the alias system makes sk-deep-* functionally correct — they were never bugs |
| Keep aliases.ts untouched | The legacy `sk-deep-*` entries are intentional backward-compat |
| Revert 2 contract-parity tests to dormant + FIXME | Activating them asserts a pre-116/REQ-030-retracted contract absent from shipped docs; reconciling is out of scope |
| Defer fusion.ts dead-bonus + graph-metadata regen | Needs scorer-owner judgment + corpus re-blessing; tracked as a follow-up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor scorer suite (6 files) | PASS — 53 tests |
| Advisor corpus + python-ts parity gates | PASS (after revert) |
| optimizer-manifest.json validity + path resolution | PASS — valid JSON, deep-*/assets configs exist |
| Full advisor suite | 450 passed, 4 skipped, 1 pre-existing failure (graph-health, see limitations) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor-scorer 116 realignment deferred.** `fusion.ts` has dead deep-research/deep-review bonus branches gated on pre-116 ids; reactivating them + renaming the corpus/fixture requires re-blessing the 197-prompt parity gate — a scorer-owner task (follow-up task #23).
2. **Pre-existing advisor-graph-health failure.** `deep-research`/`deep-review`/`deep-agent-improvement` `graph-metadata.json` carry stale `derived.key_files`/`entities` pointing at moved reference docs. Pre-dates this packet (no graph-metadata was modified here); needs skill-graph regeneration (follow-up #23).
3. **Research correction.** The 015/001 research over-flagged A-01/A-02 as P1 live bugs without accounting for the alias canonicalization; corrected here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
-->
