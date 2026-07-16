---
title: "Implementation Summary: Phase 9: deep-research Frontmatter Alignment"
description: "All 15 deep-research reference/asset docs now carry the canonical contract; first net-new authoring phase proved the phrase-distinctiveness recipe."
trigger_phrases:
  - "deep-research frontmatter summary"
  - "research frontmatter authoring complete"
  - "research doc contract evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/004-deep-research-frontmatter-alignment"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 15 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-009-deep-research"
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
| **Spec Folder** | 004-deep-research-frontmatter-alignment |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

deep-research's 15 reference and asset docs now carry exactly the canonical frontmatter contract, making the skill fully valid routing signal for the advisor doc harvest. Unlike the pilot's pure normalization, this was the campaign's first net-new authoring phase: every doc had title+description only, so all trigger phrases, tiers, and contextTypes were authored from doc content while staying distinctive against the five sibling deep-* skills whose docs already carry phrases.

### Net-new phrase authoring

Each doc gained 5-8 lowercase multi-word phrases sourced from its headings and opening sections. Because deep-review, deep-context, and the other siblings had already claimed generic loop vocabulary (bare "stopreason values", "registry fingerprint", "tiered error recovery", "findings registry"), loop-generic phrases were research-prefixed ("research stopreason values", "research registry fingerprint", "research tiered error recovery", "research findings registry"). Genuinely deep-research-specific terms ("question entropy", "mad noise floor", "spec check protocol", "post-synthesis write-back") stayed bare since no sibling claims them.

### Tier and contextType judgment

Five formal contract docs moved to `important`: `convergence.md` (live stop-contract hub), `loop_protocol.md` (canonical lifecycle spec), `spec_check_protocol.md` (canonical bounded-mutation and advisory-lock contract), `capability_matrix.md` (single source of truth for runtime parity), and `state_format.md` (state packet ownership and file-protection hub). The 10 descriptive docs stay `normal`. contextType follows sibling precedent: `implementation` for the 11 runtime-behavior references, `general` for the cheat sheet and dashboard template, `planning` for the strategy template and `convergence_reference_only.md` (non-executable future design material).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-research/references/convergence/convergence.md` | Modified | Full contract authored; tier `important` |
| `.opencode/skills/deep-research/references/convergence/convergence_graph.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/convergence/convergence_recovery.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/convergence/convergence_reference_only.md` | Modified | Full contract authored; contextType `planning` |
| `.opencode/skills/deep-research/references/convergence/convergence_signals.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/guides/capability_matrix.md` | Modified | Full contract authored; tier `important` |
| `.opencode/skills/deep-research/references/guides/quick_reference.md` | Modified | Full contract authored; contextType `general` |
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Modified | Full contract authored; tier `important` |
| `.opencode/skills/deep-research/references/protocol/spec_check_protocol.md` | Modified | Full contract authored; tier `important` |
| `.opencode/skills/deep-research/references/state/state_format.md` | Modified | Full contract authored; tier `important` |
| `.opencode/skills/deep-research/references/state/state_jsonl.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/state/state_outputs.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/references/state/state_reducer_registry.md` | Modified | Full contract authored |
| `.opencode/skills/deep-research/assets/deep_research_dashboard.md` | Modified | Full contract authored; contextType `general` |
| `.opencode/skills/deep-research/assets/deep_research_strategy.md` | Modified | Full contract authored; contextType `planning` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single assertion-guarded Python patch rebuilt each leading YAML fence in place (title/description lines kept verbatim, body bytes untouched), verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Research-prefix loop-generic phrases | Five sibling deep-* skills already claim the bare forms ("stopreason values", "findings registry"); prefixing keeps doc-trigger routing unambiguous across the loop family. |
| `state_jsonl.md` and `state_reducer_registry.md` stay `normal` | deep-review tiered its analogues `important` but deep-context kept them `normal`; keeping the important set scarce preserves dampening, and the important `state_format.md` hub routes to both. |
| `convergence_reference_only.md` gets `planning` | The doc explicitly holds non-executable future design material outside the live stop contract, so it reads as forward-looking design, not runtime behavior. |
| Asset templates split `general`/`planning` | Mirrors deep-review's dashboard (`general`, read-back surface) vs strategy (`planning`, forward-looking session tracking) precedent. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill deep-research --coverage` | PASS — docs=15, carrying-detailed-block=15, violations=0 |
| Python local-mode smoke ("research stop contract stuck recovery", flag on) | PASS — deep-research first at 0.95 with `!research stop contract(signal)` in the match reason |
| Diff hygiene | PASS — git diff shows insertion-only frontmatter hunks (all at line 3) in the 15 files |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon adopts `SPECKIT_ADVISOR_DOC_TRIGGERS` only after a session cycle, so `matchedDocs` cannot be observed live per phase (tracked as packet 145 T025).
2. **Phrase distinctiveness is point-in-time.** Later campaign phases (010-022) author their own phrases; the bare deep-research claims ("question entropy", "mad noise floor") rely on those phases honoring the same prefix-when-generic rule.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
