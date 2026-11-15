---
title: "Implementation Summary"
description: "Open search debt now makes the final deep-review verdict CONDITIONAL on the single-executor path, the fan-out merge and the dashboard, through one shared function."
trigger_phrases:
  - "search debt verdict implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/031-search-debt-verdict"
    last_updated_at: "2026-11-15T20:53:04Z"
    last_updated_by: "generate-context"
    recent_action: "Built phase 031 search debt verdict rule"
    next_safe_action: "Commit phase 031, then build phase 032"
    packet_purpose: "Purpose: Make open search debt one of the verdict function's inputs, so the final verdict, the merge and the dashboard agree."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/031-search-debt-verdict/implementation-summary.md"
      - ".skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml"
    session_dedup:
      fingerprint: "sha256:b70ab37dccdb8da524a137f5adce4cd81d03d0a01af0840894d5f7b4666b0f88"
      session_id: "scaffold-031-search-debt-verdict"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T20:53:04Z"
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
| **Spec Folder** | 031-search-debt-verdict |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review that ends with deferred or blocked bug classes in its search debt now ends CONDITIONAL, as its dashboard already said. Before this phase the final verdict and the fan-out merge ignored debt, so the same registry could read CONDITIONAL on the dashboard and PASS in the report.

### Phase 31: search-debt-verdict

`deriveReviewVerdict` in `review-verdict.cjs` takes `openSearchDebt`: with no active P0 and no failed gate, an active P1 or open debt gives CONDITIONAL. The CLI reads the registry's `searchDebt` in registry mode, requires `--search-debt N` in bound mode and prints `search_debt`. `fanout-merge.cjs` unions debt across lineages, one entry per bug class, feeds it to the merged and per-lineage verdicts, and now prints `active_p2` and `search_debt`. The reducer's dashboard verdict calls the shared function. The contract's CONDITIONAL and PASS conditions name open search debt, and the snapshot is re-rendered. `deep-review.yaml` binds and passes the debt on the fan-out path, keeps the merged counts through the hydrate step, and tells the report that a debt-only CONDITIONAL is cleared by another review over the deferred classes. Eleven skill docs that state the verdict rule now include debt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs` | Modified | Debt input, flag and output |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/review-verdict.vitest.ts` | Modified | Debt cases |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Debt union; prints active_p2 and search_debt |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Union, verdict and CLI output |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Dashboard uses the shared function |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/review-dashboard-verdict.vitest.ts` | Created | Debt alone and debt with P0 |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modified | CONDITIONAL and PASS conditions |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract-snapshot.md` | Regenerated | Conditions |
| `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` | Modified | Version constant matches the published snapshot |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | Bind and pass debt; hydrate keeps merged counts; report wording |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Source digests |
| `.skilled/skills/system-deep-loop/deep-review/ and .skilled/skills/system-deep-loop/runtime/feature-catalog/ docs` | Modified | Verdict rule includes debt |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built each task in its own dispatch, and the conductor read every diff and reran the checks. The merge task found that the merge never printed `active_p2`, although the workflow binds `p2_count` from it and, since the verdict script took over the fan-out verdict, passes it as a required flag; a fan-out review would have halted at its verdict step. The merge now prints it, and a CLI test checks every bound key. Re-rendering the snapshot exposed a version line hand-raised to 1.11.1.0 in an earlier commit while the renderer still wrote 1.11.0.0; the renderer constant now matches.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Debt makes CONDITIONAL | Operator decision 2026-11-15; the dashboard and the report step already said so |
| Union debt by bug class across lineages | Strongest restriction, like the merged findings: a class any lineage still owes is owed |
| Hydrate keeps the merged counts | The fan-out verdict reads `p0_count` to `p2_count` after the hydrate step, so a hand recount there would replace the merge's values |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `review-verdict.vitest.ts` | PASS: 16 of 16 |
| Merge tests with the verdict tests | PASS: 100 of 100 |
| `review-dashboard-verdict.vitest.ts` | PASS: 2 of 2 |
| Runtime suite | PASS: 184 files, 3,087 passed, 9 skipped (baseline 183 files, 3,075 passed) |
| `npm run typecheck` | PASS: no errors |
| Contract drift and snapshot check | PASS: `OK commands=2`, snapshot up to date |
| spec-kit `deep-review-contract-parity.vitest.ts` | PASS: 12 of 12 |
| `check-documentation-drift.cjs` | PASS: no errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fan-out debt is a union, not a reconciliation.** A class one lineage deferred and another covered still counts as debt.
2. **Recorded reviews keep their verdicts.** None of 60 recent registries would change: 5 carry debt, all with a P1, P0 or failed gate already.
<!-- /ANCHOR:limitations -->

---
