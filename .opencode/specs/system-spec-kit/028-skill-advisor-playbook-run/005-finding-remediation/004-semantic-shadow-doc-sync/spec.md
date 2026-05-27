---
title: "Feature Specification: semantic_shadow Doc/Comment Sync (F3)"
description: "Sync the stale SC-004/SC-005 scenarios, feature-catalog attribution doc, and a stale code comment to the live semantic_shadow lane (weight 0.05, shadowOnly:false, live:true). The weight is intentional and stays."
trigger_phrases:
  - "semantic_shadow doc sync"
  - "F3 lane weight doc fix"
  - "SC-004 SC-005 stale"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/004-semantic-shadow-doc-sync"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F3 doc/comment sync"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: semantic_shadow Doc/Comment Sync (F3)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The live `semantic_shadow` lane is an intentional promotion to weight 0.05 / `shadowOnly:false` / `live:true` (source of truth `lib/scorer/lane-registry.ts:12`, exported via `weights-config.ts:18`; asserted by `lanes/__tests__/semantic-shadow-cosine.vitest.ts:212-213`; feature catalog `04--scorer-fusion/01-five-lane-fusion.md:29` agrees). But SC-004 (`004-lane-attribution.md:47,57`) and SC-005 (`005-ablation.md:49`) still assume it is shadow-only/weight-0, a stale comment lingers in `lib/scorer/lanes/semantic-shadow.ts:160`, and the raw `LaneMatch.shadowOnly` returns true (line 167). This produced the SC-004 PARTIAL in the 028 run.

### Purpose
Make the docs (and stale code commentary) match the live behavior so SC-004/SC-005 stop reporting a false drift. The live weight is NOT reverted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update SC-004 to expect `semantic_shadow` fused `shadowOnly:false` when the lane is live.
- Update SC-005 to treat `semantic_shadow` as a non-zero ablation lane.
- Update `feature_catalog/04--scorer-fusion/04-attribution.md` (also says always shadowOnly:true).
- Fix the stale comment / raw `LaneMatch.shadowOnly` semantics in `lanes/semantic-shadow.ts` (or remove that raw flag from any fused-attribution expectation).

### Out of Scope
- Changing the lane weight or `live` flag (intentional — do NOT revert).
- Scorer behavior changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md` | Modify | Expect shadowOnly:false for the live lane |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md` | Modify | Non-zero ablation lane |
| `.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/04-attribution.md` | Modify | Match live behavior |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modify | Fix stale comment / raw shadowOnly semantics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Docs match live lane | SC-004/SC-005 + feature-catalog reflect weight 0.05, live, fused shadowOnly:false |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Code comment no longer claims "0.00 and live=false" | semantic-shadow.ts comment/flag consistent with the registry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A re-run of SC-004/SC-005 against the live build yields PASS (no false drift), with the lane weight unchanged.
- **SC-002**: No code path that depends on `semantic_shadow` weight/live changes behavior (docs/comments only).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the raw shadowOnly flag breaks a consumer | Behavior change | Grep consumers of `LaneMatch.shadowOnly`; prefer adjusting comment + scenario expectation over removing the field |
| Dependency | lane-registry.ts source of truth | None (read-only reference) | Confirm 0.05/live before editing docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the raw `LaneMatch.shadowOnly` field be removed entirely or just corrected in comment + scenario expectations? (prefer minimal: keep field, fix comment + scenario semantics)
<!-- /ANCHOR:questions -->
