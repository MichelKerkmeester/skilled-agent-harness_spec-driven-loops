---
title: "Implementation Summary: Advisor Suite Drift Reconciliation"
description: "LUNA-MAX reconciled the advisor suite drift to legitimate current behavior — default suite 40->4 failures, no gate weakened, real regressions left red."
trigger_phrases:
  - "advisor suite drift summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/021-advisor-suite-drift-reconciliation"
    last_updated_at: "2026-08-15T17:14:48Z"
    last_updated_by: "claude-code"
    recent_action: "LUNA-MAX reconciled 6 clusters; default suite 40->4 failures; diff reviewed clean"
    next_safe_action: "Owner decision on the 4 residual reds (2 real regressions, corpus floor, env)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Advisor Suite Drift Reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-advisor-suite-drift-reconciliation |
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Executor** | cli-codex `gpt-5.6-luna` max/fast (guardrailed) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Reconciled the advisor test suite to the behavior left by concurrent skill renames, retirements, new hubs, and hook rewiring — without weakening a single gate. The default suite went from **40 failures to 4**; the 4 residuals are deliberate (real regressions + a corpus floor + an environment failure).

### Files Changed (23, all under `system-skill-advisor/mcp-server`)

| Area | Files | Purpose |
|------|-------|---------|
| Scorer routing tables | `lib/scorer/{fusion,lanes/explicit,lanes/lexical}.ts` | Re-point retired `mcp-chrome-devtools` vocabulary to `mcp-tooling`; weights unchanged |
| Baselines / ledgers | `scripts/routing-accuracy/{scorer-eval-baseline.json,holdout-prompts.jsonl}`, new `capture-local-native-divergence-ledger.mjs`, `tests/parity/fixtures/policy-plan/baseline-contexts.json` | Regenerated via owning tooling |
| Corpus / fixtures | `tests/scorer/fixtures/{harder-intent,intent}-prompt-corpus.ts`, `scripts/fixtures/skill-advisor-regression-cases.jsonl`, `tests/parity/fixtures/executor-delegation-cases.json` | Renamed-skill expectations updated |
| Cross-language copies | `scripts/skill_advisor.py`, `scripts/skill_graph_compiler.py` | Synced Python catalog to the TS inventory |
| Test expectations | settings-parity, launcher-bootstrap, corpus-parity, python-ts-parity, bm25, executor-delegation, cli-parity, vocabulary-agreement | Updated to current correct behavior |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delegated to GPT-5.6 LUNA MAX via cli-codex, scope-locked with a hard no-gate-weakening guardrail. The executor regenerated baselines via their own capture tools, re-pointed the retired skill's routing vocabulary to `mcp-tooling` (weights preserved), synced the Python catalog to the TS inventory, updated stale test expectations, and left every real regression red with a written reason. The parent then verified independently: a red-flag scan (no `.skip` added, no leak assertion removed, no floor lowered), a source-diff read (scorer edits are pure renames; the `deep-improvement` Python removal makes it agree with TS), a full-suite re-run (`40 -> 4`), and a clean typecheck.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Delegate to LUNA MAX, not a cheaper model | Distinguishing "legitimate drift" from "real regression" across six clusters is judgment-heavy |
| Regenerate baselines only via owning tooling | Hand-edited baseline bytes would bless arbitrary changes |
| Ratchet counts up, never down | `python-ts-parity` accuracy improved `106->110`; locking the gain in is correct, lowering would mask |
| Leave the 2 stress failures red | They are behavior regressions (path misclassification, plugin-bridge fallback), not stale expectations |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Notes |
|-------|--------|-------|
| Full suite (parent re-run) | Pass | `40 failed -> 4 failed`, `871 passed`, `7 skipped` |
| Typecheck | Pass | `tsc --noEmit` exit 0 |
| Red-flag scan | Pass | no skipped tests, no removed leak assertion, no lowered floor |
| Scorer source review | Pass | pure `mcp-chrome-devtools`→`mcp-tooling` renames, weights preserved |
| Cross-language sync | Pass | `deep-improvement` removed from Python to match TS (0 standalone TS refs) |
| node_modules | Pass | intact through repeated suite runs (packet 020 guard) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **4 default-suite residuals remain red by design:** `advisor-validate` (2 — review-corpus floor at 31 vs 32, needs corpus authoring), `skill-advisor-cli-parity` (1 — CLI/socket EPERM/timeout, environment-specific), `manual-testing-playbook` (1 — expects a stale 47-scenario layout, finds 0).
2. **2 stress failures are real regressions**, left red and flagged for their owner: lifecycle misclassifies `z_future/...` paths (660 active entries vs 500); plugin-bridge concurrency returns a directives-only fallback instead of the expected skill.
3. **Verified via focused + full runs**; the full suite is slow (~5 min) but completes (no hang, thanks to packet 020).
<!-- /ANCHOR:limitations -->
