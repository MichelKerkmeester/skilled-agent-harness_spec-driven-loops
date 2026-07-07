---
title: "Implementation Summary: Advisor observability"
description: "Skill advisor now exposes prompt-safe recommendation attribution on demand and semantic-lane health diagnostics through advisor_status."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability"
    last_updated_at: "2026-06-10T22:36:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed advisor observability implementation"
    next_safe_action: "Handle the unrelated Claude settings parity failure in a separate allowed scope if required"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advisor-observability"
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
| **Spec Folder** | 004-advisor-observability |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor now makes routing decisions debuggable without exposing user prompt text. Operators can request `includeAttribution` to see `why_recommended` lane summaries, and they can request semantic health from `advisor_status` to diagnose vector-lane degradation without reading console logs.

### Prompt-Safe Recommendation Attribution

`advisor_recommend` keeps its default compact payload unchanged. When `options.includeAttribution` is true, each recommendation includes the existing numeric `laneBreakdown` plus `why_recommended`, which reports the dominant lane, top contributing lanes, and matched feature categories such as `phrase_match`, `token_match`, and `semantic_similarity`. It never returns matched prompt phrases, prompt tokens, raw scorer evidence strings, or the original prompt.

### Semantic-Lane Health

`advisor_status` now accepts `includeSemanticHealth` or `debug` and returns `semanticLaneHealth` with the active embedder, vector coverage, dimension mismatch flag, last vector refresh timestamp, disabled reason, and lane-enabled state. The semantic-shadow lane also records disabled reasons for database absence, adapter unavailability, dimension mismatch, prompt embedding failure, skill-vector load failure, and empty vector coverage.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `handlers/advisor-recommend.ts` | Modified | Adds opt-in prompt-safe `why_recommended` without changing ranking fields |
| `handlers/advisor-status.ts` | Modified | Adds opt-in semantic-lane health diagnostics |
| `lib/scorer/lanes/semantic-shadow.ts` | Modified | Records degraded-vector disabled reasons for status consumers |
| `schemas/advisor-tool-schemas.ts` | Modified | Validates the new optional attribution and health response fields |
| `tests/handlers/advisor-recommend.vitest.ts` | Modified | Covers attribution gating, prompt safety, and no ranking drift |
| `tests/handlers/advisor-status.vitest.ts` | Modified | Covers compact default status, semantic health fields, and dim mismatch disabled reason |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rollout is additive and opt-in: default recommendation and status outputs remain compact, while debug callers can request the new fields. Typecheck, build, targeted tests, and full-suite rerun provide the verification record below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Emit feature categories instead of raw scorer evidence | Raw evidence can include prompt-derived phrase or token values; category labels explain the lane source without leaking prompt text. |
| Keep semantic health opt-in | Status remains compact for normal hook use while preserving a debug path for maintenance. |
| Do not change scorer fusion or lane weights | The phase is observability-only; no ranking behavior should move. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS |
| `npx vitest run tests/handlers/advisor-recommend.vitest.ts tests/handlers/advisor-status.vitest.ts tests/scorer/semantic-lane-promotion.vitest.ts` | PASS: 3 files, 33 tests |
| `npm run build` | PASS |
| `npm test` after build | PARTIAL: 69 files passed, 1 failed file, 431 tests passed, 35 failed in `tests/hooks/settings-driven-invocation-parity.vitest.ts` because `.claude/settings.local.json` lacks the expected `hooks` block; this path is outside the allowed write scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Full suite residual** `tests/hooks/settings-driven-invocation-parity.vitest.ts` remains red because the checked `.claude/settings.local.json` hook shape is outside this phase's allowed write paths.
2. **MCP descriptor text** Tool descriptor files are outside the allowed write paths, so the Zod schema and handler accept the new options but descriptor copy was not updated in this phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
