---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE (interim, superseded by phase 004). Promoted the inconclusive bakeoff-006 TIE finding as a placeholder; kept default-unverified + RCAF; registry cited run 006. Phase 004 run 007 later promoted COSTAR (empirical)."
trigger_phrases:
  - "kimi promote status"
  - "registry promotion tie finding"
  - "phase 003 complete"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support/003-promote-results"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Promoted TIE finding; kept default-unverified, RCAF retained"
    next_safe_action: "Card-sync guard + tree-wide strict validate close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-small-model/references/models/kimi-k2.7-code.md"
      - ".opencode/skills/sk-prompt-small-model/references/models/_index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-promote-results"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **SUPERSEDED BY PHASE 004 (run 007).** This phase promoted the **inconclusive** run-006 finding (RCAF retained, `status: default-unverified`) into the registry as a placeholder, since run 006's easy fixtures saturated and named no winner. Phase 004 then superseded that promotion: run 007 on strict adversarial validators promoted **COSTAR (primary), TIDD-EC fallback, RCAF retired**, status **empirical**. The live registry, `kimi-k2.7-code.md`, and `_index.md` now hold the phase-004 result. Everything below describes the interim run-006 placeholder this phase wrote, not the current registry state.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-promote-results |
| **Status** | DONE - promoted the TIE finding; kept default-unverified + RCAF |
| **Created** | 2026-06-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE (interim, superseded by phase 004).** The bakeoff-006 **finding** — a TIE, not a winning framework — was folded into the registry and the kimi reference doc as a placeholder. Because no framework empirically won run 006, this phase kept `primary: rcaf` and `status: default-unverified` and pointed the evidence at run `006` with the TIE rationale, honoring the rule "TIE/INCONCLUSIVE → keep default-unverified and record why." Phase 004's run 007 on strict validators later replaced this placeholder: the registry now holds `primary: costar`, `fallback: tidd-ec`, `avoid: [rcaf]`, `status: empirical`, evidence `007-kimi-k2.7-discriminating`.

### Built: promote the bakeoff-006 finding into the registry

The phase edited the `kimi-k2.7-code.recommended_frameworks` block in `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json`: it **kept** `primary: "rcaf"` and `preplanning_density: "medium"`, **kept** `status: "default-unverified"` (NOT flipped to empirical, because the verdict was a saturated TIE — no framework won), and **populated** `evidence.benchmark = "006-kimi-k2.7-prompt-framework"` plus a `sample` string describing the TIE/saturation and the subjective secondary ranking. It then rewrote §1 Core Principle, §3 (Recommended Framework), and §4 (Benchmark Evidence) of `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.7-code.md` to report the TIE/saturated result, the subjective secondary judge ranking with its caveat, and the conclusion that framework choice does not affect correctness for this model so RCAF is retained. The sibling `_index.md` status note was updated to "default-unverified (bakeoff 006: TIE, correctness-saturated)". Finally the parent `spec.md` phase map flipped phases 2 + 3 to Complete.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `model-profiles.json` | Modified | Kept `kimi-k2.7-code.recommended_frameworks.primary: rcaf` + `status: default-unverified`; populated `evidence` (benchmark `006`, null scores, TIE/saturation sample, confidence low) |
| `references/models/kimi-k2.7-code.md` | Modified | Rewrote §1/§3/§4 to report the TIE, the subjective secondary ranking + caveat, and "framework choice does not affect correctness; RCAF retained" |
| `references/models/_index.md` | Modified | Status note → "default-unverified (bakeoff 006: TIE, correctness-saturated)" |
| Parent `spec.md` phase map | Modified | Phases 2 + 3 flipped to Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery was a registry DATA edit followed by a reference-doc mirror. The `recommended_frameworks` block was edited first (the source of truth), keeping `primary`/`status` and adding the run-`006` evidence; then §1/§3/§4 of the kimi reference doc were rewritten to match, and the `_index.md` status note updated. The card-sync guard `check-prompt-quality-card-sync.sh .` and a tree-wide `validate.sh --strict` across the parent and all children are the orchestrator's closing gate, run after these edits to confirm registry/reference parity and packet consistency. Both children strict-validate at exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote the finding, not a winner | The verdict was a TIE (correctness saturated), so there was no empirically-best framework to promote; what got promoted is the finding that framework choice does not affect correctness for this model |
| Kept `status: default-unverified` (did NOT flip to empirical) | Honest reporting - a saturated TIE with no framework winning is not empirical evidence for any single choice; this matches the caveat the kimi reference doc already records |
| Kept `primary: rcaf` | Nothing beat RCAF, so the convention default stands; the subjective secondary signal (COSTAR/CIDI clarity) is too weak to override it |
| Edited the registry DATA first, then mirrored §1/§3/§4 + `_index.md` | The registry is the source of truth; mirroring after keeps the card-sync guard satisfied in one pass |
| Gate completion on the card-sync guard | The guard is the existing CI-wired check that proves registry/reference parity for prompt-framework choices |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh .` | CLOSING GATE (orchestrator re-runs after the edits; registry §3/§4 already match) |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <children> --strict` | PASS (exit 0 on both children); parent + tree-wide sweep is the orchestrator's closing gate |
| `recommended_frameworks.status` is `default-unverified` with a documented TIE reason | PASS (status held at `default-unverified`; `evidence.sample` records the TIE/saturation rationale) |
| Reference doc §1/§3/§4 report the TIE and match the registry | PASS at phase close (RCAF retained, run `006` cited, `_index.md` aligned); since superseded by phase 004 (registry/doc now cite run `007`, COSTAR) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Status held `default-unverified` at this phase (since superseded).** This phase's promotion did not make RCAF empirical for this model; it recorded that run 006 could not discriminate frameworks (correctness saturated), so the status stayed as Phase 001 set it and only the evidence was populated. Phase 004's run 007 later flipped the registry to `empirical` (COSTAR), so `default-unverified` is no longer the live state.
2. **No empirical winner existed from run 006.** At this phase's close the dispatch recommendation for kimi-k2.7-code was still the convention default, not a measured best. The follow-up bakeoff with harder, less-saturating fixtures became phase 004 (run 007), which discriminated and promoted COSTAR (empirical), retiring RCAF.
3. **Secondary ranking is advisory only.** The COSTAR/CIDI clarity edge from the gpt-5.5 judge is subjective and was not strong enough to change `primary`; it is recorded as a hint, not a basis for promotion.
4. **Card-sync + tree-wide validate are the closing gate.** Both children validate at exit 0, but the full parent + children strict sweep and the card-sync guard run is owned by the orchestrator's final step.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
