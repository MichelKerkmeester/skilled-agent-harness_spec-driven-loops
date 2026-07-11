---
title: "Feature Specification: code-review Routing Optimization"
description: "After the live-scoring fix, code-review still trailed every sibling (69 vs 80-100). Its routing accuracy is perfect; the drag is orphan references unreachable from any intent (D5) and gold that under-specifies the router's ALWAYS-tier (D3). This wires the orphans in and aligns the gold."
trigger_phrases:
  - "code-review routing optimization"
  - "orphan references wiring"
  - "code-review D5 D3"
  - "always tier intent mapping"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/002-code-review-optimization"
    last_updated_at: "2026-07-09T05:03:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the code-review routing-optimization spec"
    next_safe_action: "Wire orphan refs into intents, align gold, re-benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
      - ".opencode/skills/sk-code/code-review/manual_testing_playbook/intra-routing-recall/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Wire orphans + map ALWAYS into intents; no thoroughness change — operator-locked"
---
# Feature Specification: code-review Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-09 |
| **Branch** | `002-code-review-optimization` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->

### Problem Statement
After the live-scoring fix (sibling packet 001), `code-review` still scored lowest of all children — CONDITIONAL 69 vs 80-100. Its routing accuracy is perfect (D1intra 100, D2 100: it picks the right checklist every time). The residual comes from two structural issues: (1) **D5 orphan references** — `references/pr_state_dedup.md` and `references/quick_reference.md` are reachable from no `RESOURCE_MAP` intent, and `review_core.md`/`review_ux_single_pass.md`/`fix-completeness-checklist.md` are reachable only via the ALWAYS tier, not an intent; (2) **D3 over-routing** — each scenario's gold lists only the intent asset, so the router's legitimate ALWAYS-tier reference loads read as waste.

### Purpose
`code-review` scores in line with its siblings by making every resource reachable from a meaningful intent and by aligning the gold with what the router actually loads — without changing review thoroughness.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->

### In Scope
- Add 4 `RESOURCE_MAP` intents to reach every previously-orphan file: `CORE` → review_core + review_ux; `COMPLETENESS` → fix-completeness-checklist; `PR_STATE` → pr_state_dedup; `SETUP` → quick_reference (with matching `INTENT_SIGNALS` keywords).
- Align each of the 7 Type-1 scenarios' `expected_resources` to include the ALWAYS references the router loads (`review_core`, `review_ux`) ahead of the intent asset.
- Re-benchmark `code-review` (Mode-A + Mode-B) to confirm the rise and no regression elsewhere.

### Out of Scope
- Narrowing the ALWAYS tier / changing review thoroughness — the "always check the big-three checklists" contract stays.
- The systematic optimization capability + command — that is sibling packet `003`.
- Existing intents/keywords — only additive changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code/code-review/SKILL.md` | Modify | Add 4 intents + RESOURCE_MAP entries (orphan wiring) |
| `sk-code/code-review/manual_testing_playbook/intra-routing-recall/*` | Modify | Prepend ALWAYS refs to each scenario's gold |
| `sk-code/code-review/benchmark/**` | Modify | Re-baselined reports |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No orphan references remain | `router-replay`/D5 reports 0 orphan_reference findings; D5 = 100 |
| REQ-002 | Additive-only router change | Every pre-existing intent, keyword, and map entry is byte-unchanged; new intents route only their own files |
| REQ-003 | Gold reflects the router's actual load | D3 over-routing is no longer 0; Mode-A stays PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | code-review rises in line with siblings | Re-benchmarked Mode-B aggregate materially above 69 |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->

- **SC-001**: D5 = 100 (no orphan references). — target
- **SC-002**: D3 > 0 on the aligned gold; Mode-A verdict stays PASS. — target
- **SC-003**: Live Mode-B aggregate rises materially from 69, closing the gap to the sibling children. — target
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New intent keywords misroute existing scenarios | Medium | Keywords are review-specific and distinct; re-benchmark confirms existing scenarios unchanged |
| Risk | Gold alignment reads as gaming | Low | The added refs are exactly what the router ALWAYS loads (verified from the live trace), not invented |
| Dependency | Sibling 001 scorer fix (asset fold) | Met | Landed in the same session |
<!-- /ANCHOR:risks -->

---

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- None — direction operator-locked (wire orphans + map ALWAYS into intents; no thoroughness change).
<!-- /ANCHOR:questions -->
