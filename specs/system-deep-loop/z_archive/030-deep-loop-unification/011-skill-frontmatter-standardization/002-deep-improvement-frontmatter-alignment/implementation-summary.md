---
title: "Implementation Summary: Phase 7: deep-improvement Frontmatter Alignment"
description: "All 22 deep-improvement reference/asset docs now conform to the canonical contract, the largest single-skill normalization in the campaign so far."
trigger_phrases:
  - "deep-improvement frontmatter summary"
  - "frontmatter alignment complete"
  - "doc contract normalization evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/002-deep-improvement-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:54:32Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 22 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/references/shared/promotion_gate_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-007-deep-improvement"
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
| **Spec Folder** | 002-deep-improvement-frontmatter-alignment |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 22 deep-improvement reference and asset docs (18 references + 4 non-README assets) now carry exactly the canonical frontmatter contract. This is the largest phase of the campaign so far and the first to exercise every drift state at once: enum fixes, partial-block completion, net-new phrase authoring, and a doc with no frontmatter at all.

### Contract normalization

Baseline had four distinct states. 5 fully-detailed docs used `contextType: reference`, a natural-but-wrong value outside the canonical enum. 12 docs carried trigger_phrases but no tier or contextType. 3 docs (the agent_improvement asset templates) had title+description only. `references/shared/heldout_and_gold_sets.md` had no frontmatter fence at all and received the full block. Every doc now declares the 5-field contract with no leftover keys.

### Phrase repair

Four docs had phrase sets that violated the multi-word policy and were rebuilt from actual content: `profiling_audit_log.md` (single tokens plus a "DAI-004" finding id, also scrubbed from the description), `mixed_executor_methodology.md` (all 4 phrases were single hyphenated tokens), `integration_scanning.md` and `skill_benchmark/operator_guide.md` (command-name tokens like `scan-integration` and `start-skill-benchmark-loop`). Mixed-case Lane C phrases were lowercased.

### Tier and contextType judgment

`important` is reserved for formal contract/invariant docs: kept on `candidate_proposal_format.md`, `score_dimensions.md`, `promotion_gate_contract.md`, and `scoring_contract.md`; added to `evaluator_contract.md`, `promotion_rules.md`, and `heldout_and_gold_sets.md` (a binding cross-lane evaluation convention). The two Lane C how-to guides (`operator_guide.md`, `scenario_authoring.md`) were demoted from `important` to `normal` since they are guidance, not contracts. contextType is `implementation` for most docs, `planning` for the charter and strategy run-templates, `research` for the pilot-derived `guardrails_teachings.md` and the `mixed_executor_methodology.md` evaluation methodology, and `general` for `quick_reference.md` and `heldout_and_gold_sets.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-improvement/references/agent_improvement/*.md` (6) | Modified | Enum fix x2 (`important` kept); tier+contextType added x4; phrase repair x2 |
| `.opencode/skills/deep-improvement/references/model_benchmark/*.md` (3) | Modified | Tier+contextType added; `evaluator_contract.md` to `important`; phrase rebuild for mixed_executor_methodology |
| `.opencode/skills/deep-improvement/references/shared/*.md` (6) | Modified | Tier+contextType added; full block authored for `heldout_and_gold_sets.md`; `promotion_rules.md` to `important` |
| `.opencode/skills/deep-improvement/references/skill_benchmark/*.md` (3) | Modified | Enum fix; 2 guides demoted to `normal`; command-token phrase replaced |
| `.opencode/skills/deep-improvement/assets/**/*.md` (4 non-README) | Modified | Full blocks for 3 templates (`planning`/`implementation`); reviewer-schema completed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One assertion-guarded Python pass rewrote all 22 leading fences in place (per-file title guard before replacement, body bytes untouched), then the contract checker in coverage mode and a daemon-independent Python advisor smoke verified the result. The guard discipline mattered here: several deep-improvement files carry pre-existing uncommitted body modifications from another session, and spot-checked diffs confirm this phase added only frontmatter hunks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `important` on 7 contract docs, including 3 newly promoted | The tier policy reserves `important` for formal contract/invariant docs; evaluator_contract, promotion_rules, and the held-out/gold convention all gate promotion evidence, so they meet the bar. |
| Demote both Lane C guides from `important` to `normal` | operator_guide and scenario_authoring are how-to guidance; only `scoring_contract.md` is the authoritative Lane C computation, so it alone keeps the elevated tier. |
| `planning` contextType for charter and strategy templates | Both are run-planning artifacts (policy boundary, goal/hypothesis), not behavior documentation, so `implementation` would misfile them. |
| `research` contextType for guardrails_teachings and mixed_executor_methodology | One distills pilot evidence (T1-T12), the other is evaluation-sweep methodology; neither documents a runnable surface. |
| Rebuild phrases instead of keeping single tokens | Single tokens like "profiling" or "adjudication" are routing noise; the checker passes them but the advisor doc-trigger lane needs distinctive multi-word signal. The "DAI-004" finding id was also a perishable label. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill deep-improvement --coverage` | PASS — docs=22, carrying-detailed-block=22, violations=0 |
| Python local-mode smoke ("legal-stop gate bundles", flag on) | PASS — deep-improvement at 0.77, passes_threshold true, reason `Matched: !legal-stop gate bundles(signal)` |
| Diff hygiene | PASS — spot-checked git diff shows only frontmatter hunks from this phase; pre-existing body hunks from another session untouched |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the launcher allowlist fix, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
2. **Several skill files still carry unrelated uncommitted body changes.** Those hunks belong to another active session; rollback of this phase must revert frontmatter hunks per file rather than checking out whole files.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
