---
title: "Implementation Plan: Phase 3: land-recommended-frameworks-data [template:level_1/plan.md]"
description: "Add the additive recommended_frameworks object to all 8 active models in model-profiles.json; rebuild model-profiles.md with accurate counts and schema documentation."
trigger_phrases:
  - "recommended_frameworks plan"
  - "framework assignment plan"
  - "model-profiles.json plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/003-land-recommended-frameworks-data"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: land-recommended-frameworks-data

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON (data), Markdown (docs) |
| **Framework** | sk-prompt model-profiles architecture |
| **Storage** | Flat files — model-profiles.json, model-profiles.md |
| **Testing** | `jq empty` for JSON validity; manual field count verification |

### Overview

This phase adds a `recommended_frameworks` object to all 8 active model entries in `sk-prompt/assets/model-profiles.json`. The object encodes primary, fallback, and avoid framework assignments along with preplanning density, evidence citations, a profile reference path, and a verification status flag. Empirically verified assignments (tidd-ec for MiniMax models, costar+lean for MiMo) are set with `status: "empirical"`; the remaining five models receive `rcaf` as a `default-unverified` safe default. The `model-profiles.md` reference doc is rebuilt to match with correct counts and schema documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing — `jq empty` exits 0
- [x] Docs updated — spec/plan/tasks/implementation-summary complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-first: authoritative JSON (`model-profiles.json`) is the single source of truth; `model-profiles.md` is the human-readable prose layer derived from it (Architecture-A split).

### Key Components
- **model-profiles.json**: Holds all per-model data including the new `recommended_frameworks` object
- **model-profiles.md**: Reference doc that documents schema, lists all models, and explains the data/prose split

### Data Flow
Dispatchers read `model-profiles.json` to pick prompt frameworks. The `recommended_frameworks.primary` field is the first lookup; `fallback` is used when primary fails; `avoid` is a hard exclusion list. The `status` field lets dispatchers weight empirical vs. unverified assignments.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-profiles.json` | Authoritative model data | Added `recommended_frameworks` to all 8 active entries | `jq empty` passes; count query returns 8 |
| `model-profiles.md` | Human-readable reference | Rebuilt with correct count and schema section | Manual read confirms accuracy |
| cli-opencode, cli-devin, sk-prompt-small-model | Downstream consumers | Unchanged in this phase; pick up new field in later phases | Not a consumer yet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reviewed existing model-profiles.json schema; Phase 2 substrate confirmed in place
- [x] Collected empirical framework assignments from 120 and 126 benchmark sessions
- [x] Confirmed six sub-fields of the `recommended_frameworks` object

### Phase 2: Core Implementation
- [x] Added `recommended_frameworks` to minimax-m3: tidd-ec primary, dense preplanning, empirical status
- [x] Added `recommended_frameworks` to minimax-2.7: tidd-ec primary, empirical status
- [x] Added `recommended_frameworks` to mimo-v2.5-pro: costar+lean primary, race fallback, tidd-ec+cidi avoided, empirical status
- [x] Added `recommended_frameworks` to swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1: rcaf primary, default-unverified status

### Phase 3: Verification
- [x] `jq empty` passed on model-profiles.json
- [x] All 8 active model entries confirmed to carry the field
- [x] model-profiles.md rebuilt with correct count (10), schema section, and Architecture-A note
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | model-profiles.json validity | `jq empty` |
| Count | 8 active models carry the field | `jq '[...] | length'` |
| Manual | model-profiles.md accuracy | Direct read and review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 (002-repair-and-extend-sync-substrate) | Internal | Green — complete | JSON schema not in place; can't add new fields |
| Benchmark results from 120 and 126 sessions | Internal | Green — available | Assignments would revert to all `default-unverified` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `jq empty` fails or downstream consumer reports parse error
- **Procedure**: Revert the `recommended_frameworks` additions via git; the field is purely additive so reverting to the pre-phase state leaves all other model data intact
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
