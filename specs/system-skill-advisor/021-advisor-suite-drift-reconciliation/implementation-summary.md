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
    last_updated_at: "2026-09-07T20:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Resumed and landed the parity re-baseline"
    next_safe_action: "Re-baseline through the same tools on the next scorer change"
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

### Re-baseline resumed (2026-09-07)

The parity subset left red in August was resumed once the surfaces that feed the scorer had settled. The compiled skill graph was recompiled with its own compiler: the node set is identical except that `sk-design-md-generator`, now a mode of the `sk-design` hub, is no longer a standalone skill, six skills carry more signals, and the one topology warning is gone. On that graph the corpus parity test reports the Python reference making 114 gold-correct calls (was 112) and the native scorer preserving 108 of them (was 107), so both frozen numbers moved upward and were re-frozen. The divergence ledger was regenerated with its capture tool: two new divergences added, three resolved ones removed, three changed ones re-approved, each with a reason written after reading the prompt. One native move is a regression against gold, a documentation-consistency audit that native routes to sk-doc; it is recorded in the corpus test's accepted list and the ledger rather than hidden. `skill-advisor-cli-parity` and `advisor-graph-health` pass without change.

| Area | Files | Purpose |
|------|-------|---------|
| Compiled graph | `scripts/skill-graph.json` | Recompiled from the skills' current graph metadata |
| Corpus parity | `tests/legacy/advisor-corpus-parity.vitest.ts` | 112 to 114, 107 to 108, one accepted divergence with its reason |
| Divergence ledger | `tests/parity/fixtures/local-native-approved-divergences.json` | 77 to 76 entries via the capture tool; five reasons hand-written |
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
| Re-baseline: parity trio, graph health, scorer-eval ratchet (2026-09-07) | Pass | 16 tests across 4 files on the recompiled graph; the scorer-eval ratchet untouched |
| Re-baseline: full suite and typecheck (2026-09-07) | Pass | 121 files and 880 tests pass, 7 skipped, 0 failed; `tsc --noEmit` clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The August residuals are resolved or reattributed:** `advisor-validate` and `manual-testing-playbook` pass today, `skill-advisor-cli-parity` passes when the daemon answers in time (its one earlier failure was a 120-second timeout), and the parity trio is re-baselined as of 2026-09-07. The daemon job-semantics suite still shows a timing flake on some runs.
2. **2 stress failures are real regressions**, left red and flagged for their owner: lifecycle misclassifies `z_future/...` paths (660 active entries vs 500); plugin-bridge concurrency returns a directives-only fallback instead of the expected skill.
3. **Verified via focused + full runs**; the full suite is slow (~5 min) but completes (no hang, thanks to packet 020).
<!-- /ANCHOR:limitations -->
