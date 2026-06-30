---
title: "Implementation Summary — Land recommended_frameworks data"
description: "Additive recommended_frameworks object added to all 8 active models in model-profiles.json; sk-prompt model-profiles.md rebuilt with accurate counts and schema documentation."
trigger_phrases:
  - "recommended_frameworks"
  - "model-profiles.json"
  - "framework data"
  - "tidd-ec"
  - "costar lean"
  - "rcaf default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/003-land-recommended-frameworks-data"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "agent"
    recent_action: "Populate completion docs"
    next_safe_action: "Proceed to Phase 4 (004-model-hub-and-priority-profiles)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt/references/model-profiles.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "complete-003-land-recommended-frameworks-data"
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
| **Spec Folder** | 003-land-recommended-frameworks-data |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every active model in `sk-prompt/assets/model-profiles.json` now carries a structured `recommended_frameworks` object that tells dispatchers exactly which prompt frameworks to prefer, which to fall back to, and which to avoid — along with pre-planning density guidance, empirical evidence citations, a profile reference path, and a status flag. Before this phase, the file had no per-model framework guidance; dispatchers had to consult scattered docs or rely on tribal knowledge. Now the data lives in one authoritative place and the reference prose in `model-profiles.md` was rebuilt to match.

### recommended_frameworks field

Each of the 8 active model entries gained an additive `recommended_frameworks` object with six sub-fields: `primary`, `fallback`, `avoid`, `preplanning_density`, `evidence`, and `profile_ref`. The assignments are:

- **minimax-m3**: `tidd-ec` primary with `dense` preplanning density, inheriting from the minimax-2.7 empirical baseline.
- **minimax-2.7**: `tidd-ec` primary, empirically verified.
- **mimo-v2.5-pro**: `costar+lean` primary, `race` fallback, `tidd-ec` and `cidi` on the avoid list — empirically validated in the 126 benchmark session.
- **swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1**: `rcaf` primary with `default-unverified` status, pending dedicated benchmarks.

### model-profiles.md rebuild

The reference doc was rebuilt to fix a stale model count (previously wrong), document all 10 models (8 active + 2 legacy), introduce the `recommended_frameworks` schema section explaining every sub-field, and reflect the Architecture-A split between `model-profiles.json` (authoritative data) and `model-profiles.md` (human-readable prose).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modified | Added `recommended_frameworks` object to all 8 active model entries |
| `.opencode/skills/sk-prompt/references/model-profiles.md` | Modified | Rebuilt: corrected model count to 10, documented new field schema, added Architecture-A data/prose split note |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Changes were applied additively — no existing fields were touched. After editing, `jq empty` was run against `model-profiles.json` to confirm valid JSON (exited 0). All 8 active model entries were verified to carry the `recommended_frameworks` field via `jq` inspection. The model-profiles.md rebuild was verified by reading the output and confirming model count accuracy and schema completeness.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Additive field only — no existing keys modified | Preserves backward compatibility; downstream consumers that don't yet read `recommended_frameworks` are unaffected |
| `status: "default-unverified"` for the five rcaf models | Honest signal to dispatchers that rcaf is a safe default but not yet benchmarked for these specific models; avoids over-claiming |
| `status: "empirical"` for minimax-2.7 and mimo-v2.5-pro; `"carried"` for minimax-m3 | empirical entries backed by dedicated benchmark runs (mimo: 126 session; minimax: 120 session); minimax-m3 inherits from minimax-2.7 so carries `"carried"` status |
| Architecture-A split documented in model-profiles.md | The reference doc is the prose layer; the JSON is the data layer. Documenting this prevents future confusion about which file to edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq empty .opencode/skills/sk-prompt/assets/model-profiles.json` | PASS — exits 0, valid JSON |
| All 8 active model entries carry `recommended_frameworks` | PASS — confirmed via `jq '[.models[] | select(.status=="active") | .recommended_frameworks] | length'` = 8 |
| model-profiles.md model count reflects 10 models | PASS — stale count corrected |
| No existing model-profiles.json fields removed or renamed | PASS — additive change only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **rcaf assignments are unverified** Five models (swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1) carry `status: "default-unverified"` on their rcaf assignment. Dedicated benchmark runs are needed to confirm or replace these defaults; that work is scoped to a later phase.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
