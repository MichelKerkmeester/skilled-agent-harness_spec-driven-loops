---
title: "Implementation Summary: command-recipe choreography relocation + validator repair"
description: "Executed the SOL ultra advisory (option C): removed the dead Lane C wrapper-prose branch, repaired sk-design's command-surface validator from INVALID/10 to VALID (stopping it fabricating a slash-command for the null-command transport), strengthened its asset-level choreography check to a structural thin-router contract, and de-drifted the stale recipe fixture + de-masked the self-masking unit test — delivered by a GPT-5.6 SOL MAX (fast) swarm, adversarially verified by a fresh Sonnet review that found no P0/P1."
trigger_phrases:
  - "command recipe choreography relocation summary"
  - "design command surface validator repair summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/006-fix-design-command-validation"
    last_updated_at: "2026-07-20T06:37:55Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wave 1 + Wave 2 landed + Sonnet-verified; all gates green"
    next_safe_action: "Commit and integrate to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-fix-design-command-validation |
| **Completed** | 2026-07-14 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Executed the GPT-5.6 SOL ultra advisory (option C) in two waves. Wave 1 was a solo SOL MAX agent; Wave 2 was a two-agent SOL MAX (fast) swarm on disjoint surfaces. A fresh Sonnet reviewer then adversarially verified all five files.

### Wave 1 — Lane C dead-branch cleanup (REQ-001)
The wrapper-prose choreography branch in `validateRecipeChoreography()` was dead once the `/design:*` commands became thin routers (no wrapper carries a `## CHOREOGRAPHY` section). Removed the `extractSection()` + `normalizedIncludes()` helpers, the `wrapperMarkdown` plumbing, and the step-matching loop (net −39 lines in `score-skill-benchmark.cjs`). The substantive `sameJsonValue(recipe.choreography, record.choreography)` equality check survives unchanged. `wrapperPathForCommand()` + the wrapper read were retained — heading and `argument-hint` checks still consume them.

### Wave 2, Agent A — validator repair + strengthen (REQ-002, REQ-003)
`design-command-surface-check.mjs` reported `STATUS=INVALID invalid=10` because `commandSetForModes()` mapped **every** workflow mode to `` `/design:${mode}` ``, fabricating `/design:design-mcp-open-design` — a command that `mode-registry.json` declares `command: null` by design. The metadata honestly lists the transport sibling as `"design-mcp-open-design (no standalone command; …)"`, so both the sibling-membership and coverage checks failed. Fix (validator-only, metadata untouched): `readNoCommandTokens()` + `commandTokenForMode()` model the transport as the canonical no-command token `design-mcp-open-design`; `parseSiblingReference()` + `isAllowedSiblingReference()` accept a sibling iff its leading token exactly matches an allowed token, with a single balanced parenthetical permitted **only** on a no-command token. The discriminator check is now stricter than before, not weaker. Separately, the now-reachable asset-level choreography check was strengthened from a `wordOverlapRatio < 0.5` fuzzy match to a structural contract: ordered unique `step_N_<name>` keys with `purpose`/`action`/`output`, auto/confirm business-step parity (with `step_0_show_prompt` the sole confirm-only exemption), and canonical `load_hub`/`load_mode`/`run_*`/`prepare_handoff` witnesses — no positional `order === step_N` inference. A new colocated `design-command-surface-check.test.mjs` (`node --test`) proves 7 negative mutations fail.

### Wave 2, Agent B — fixture refresh + test de-mask (REQ-004, REQ-005)
`designRecipe()` built the expected recipe from a **live** clone of `command-metadata.json`, so it structurally could not detect fixture drift. The fixture `sk_design_command_recipe_valid.private.json` was stale on three live-mirroring fields (`argumentHint`, `argumentGrammar`, `choreography` 4→5 rows). Refreshed those three so the fixture deep-equals the live-derived recipe, then re-pointed `designRecipe('/design:interface')` to load the committed fixture gold (live-derivation retained as a fallback for non-interface commands). A negative test drifts the in-memory gold and asserts `scoreCommandRecipe` flags a `metadata` miss — proving the tripwire fires.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Remove dead wrapper-prose branch + helpers; keep recipe↔metadata equality |
| `sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | No-command transport token model; strengthen choreography to a structural contract; add test seam |
| `sk-design/shared/scripts/design-command-surface-check.test.mjs` | Add | 7 `node --test` negative choreography/discriminator cases |
| `deep-improvement/assets/skill_benchmark/fixtures/sk_design/sk_design_command_recipe_valid.private.json` | Modify | Refresh 3 stale fields to current live metadata |
| `deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | De-mask `designRecipe()` to load gold; add drift-tripwire test |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Wave 1 was one GPT-5.6 SOL MAX (fast, workspace-write) agent; the orchestrator independently re-ran the suite and audited the diff. Wave 2 dispatched two SOL MAX (fast) agents in parallel (operator-authorized swarm) on disjoint surfaces — Agent A on the sk-design validator, Agent B on the deep-improvement fixture + vitest. Agent B's first run correctly **halted on a Logic-Sync**: refreshing only choreography would have left the de-masked test red because `argumentHint`/`argumentGrammar` were also stale. The orchestrator confirmed the broader drift, amended the brief (authorizing the full three-field refresh — squarely within the already-approved "refresh to current metadata" decision), and re-dispatched; the second run landed clean. A fresh Sonnet (xhigh) reviewer then adversarially verified all five files, including constructing a simulated drifted repo and running the real exported `scoreCommandRecipe` to prove the de-mask tripwire actually fires. The orchestrator independently re-ran the validator, both test runners, and audited scope + hygiene throughout.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair the validator, do not delete the transport sibling | The metadata deliberately surfaces the transport in every command's discriminator; the bug was the validator fabricating a `/design:*` command for a `command:null` transport, not the presence of the sibling. Deleting it would lose intended discoverability behavior |
| Validator-only fix; leave `command-metadata.json` untouched | The metadata's honest `"…(no standalone command…)"` label is correct; the fix belongs in the validator's token model, accepted via exact-token match + a single balanced parenthetical only on a no-command token |
| Structural, not positional, choreography contract | 5 coarse metadata rows vs ~6–7 YAML business steps — a positional `order === step_N` match would false-reject correct commands; enforce step-key structure + auto/confirm parity + witnesses instead |
| Full three-field fixture refresh (not choreography-only) | De-masking to load committed gold requires the gold to match live on every live-mirroring field; `argumentHint` + `argumentGrammar` were stale too. Amended in-scope after Agent B's Logic-Sync halt |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lane C suite after cleanup (orchestrator) | `56 passed / 0 failed` |
| Validator status (orchestrator, direct) | `STATUS=VALID STAGE=complete` / `invalid=0 drift=0` (was `invalid=10`) |
| Validator negative tests (orchestrator, `node --test`) | `7 passed / 0 failed` |
| Full skill-benchmark suite after de-mask (orchestrator) | `57 passed / 0 failed` (56 + drift-tripwire test) |
| De-mask is real, not vacuous | Sonnet built a simulated drifted `skillRoot`, ran the real `scoreCommandRecipe` with the unmutated fixture → `valid:false`, `firstFailingSubcheck:"metadata"` |
| Sibling predicate is exact-match | Rejects `/design:audittt`, `/design:audit (…)`, `design-mcp-open-design garbage (x)`, nested-paren, unicode confusables (Sonnet-traced) |
| Fresh Sonnet review | No P0, no P1; all 5 files SOUND; 2 informational P2s (pre-existing) |
| `node --check` both edited `.mjs` | exit 0 |
| Comment hygiene | Durable WHY only; no ids/paths (Sonnet-confirmed across all 5) |
| Scope / frozen artifacts | Exactly 5 files; `deep-improvement/benchmark/` run-reports untouched |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`designRecipe()` gold-loading covers only `/design:interface` (P2, pre-existing scope).** The four other design commands still fall back to live-derivation, so their command-recipe scenarios remain masked against fixture-vs-live drift — unchanged from before, and no test currently exercises the fallback. If those commands ever get dedicated recipe-drift tests, extend the gold-loading path.
2. **The `commandRecipe` lane remains a `/design:*`-specific extension inside a general D1–D5 scorer (P2 layering debt).** Recorded in `decision-record.md` (ADR-003) with the recommended long-term direction: a target-owned adapter interface rather than broadening the special case, if a second consumer ever appears.
3. **Sibling tokenization trims leading whitespace (P2, non-exploitable).** A minor tolerance widening vs the old exact-string equality; the trimmed value still names the identical correct sibling, and the core acceptance predicate is unchanged.

<!-- /ANCHOR:limitations -->
