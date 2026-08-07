---
title: "Implementation Plan: semantic_shadow Doc/Comment Sync (F3)"
description: "Edit SC-004/SC-005 + feature-catalog + the stale semantic-shadow.ts comment to match the live 0.05/live lane; do not change the weight."
trigger_phrases:
  - "F3 plan doc sync"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/005-finding-remediation/004-semantic-shadow-doc-sync"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: semantic_shadow Doc/Comment Sync (F3)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + a TS comment |
| **Framework** | system-skill-advisor scorer-fusion docs |
| **Storage** | n/a |
| **Testing** | re-run SC-004/SC-005; semantic-shadow vitest unchanged |

### Overview
Pure documentation/comment alignment to the verified source of truth. The live lane (0.05, live, fused shadowOnly:false) is correct; the scenarios and one code comment are stale.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source of truth confirmed (lane-registry.ts:12, vitest:212-213) — research §3 F3
- [x] Stale doc/comment sites identified

### Definition of Done
- [x] SC-004/SC-005 + feature-catalog + comment updated
- [x] SC-004/SC-005 re-run PASS; semantic-shadow vitest still green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs/comment-only sync to code-of-record.

### Key Components
- **lane-registry.ts / weights-config.ts**: source of truth (read-only)
- **SC-004/SC-005 + feature-catalog**: stale consumer docs
- **lanes/semantic-shadow.ts**: stale comment + raw flag

### Data Flow
Registry (0.05/live) → fusion derives shadowOnly:false → docs must describe that, not the legacy shadow-only state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `004-lane-attribution.md:47,57` | scenario expectation | expect shadowOnly:false | SC-004 re-run PASS |
| `005-ablation.md:49` | scenario expectation | non-zero ablation lane | SC-005 re-run PASS |
| `feature_catalog/scorer-fusion/04-attribution.md` | catalog doc | match live | doc review |
| `lanes/semantic-shadow.ts:160,167` | stale comment + raw flag | correct comment; keep/clarify flag | grep consumers of LaneMatch.shadowOnly |

Inventory: grep `LaneMatch.shadowOnly` / `shadowOnly` consumers before touching the raw flag — prefer comment fix only.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm lane-registry.ts:12 (0.05/live) and vitest:212-213 still assert fused shadowOnly:false
- [x] Grep consumers of raw `LaneMatch.shadowOnly`

### Phase 2: Core Implementation
- [x] Update SC-004 expectation (shadowOnly:false for live lane)
- [x] Update SC-005 (non-zero ablation lane)
- [x] Update feature_catalog/04-attribution.md
- [x] Fix the stale comment in semantic-shadow.ts (and clarify raw flag semantics)

### Phase 3: Verification
- [x] Re-run SC-004/SC-005 against the live build — PASS
- [x] semantic-shadow vitest still green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scenario | SC-004/SC-005 | advisor_recommend MCP + manual |
| Unit | semantic-shadow lane | semantic-shadow-cosine.vitest.ts (unchanged) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| lane-registry source of truth | Internal | Green | reference only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer relied on the raw shadowOnly:true semantics.
- **Procedure**: Docs-only edits revert trivially; restrict the change to comments + scenario expectations if a raw-flag consumer surfaces.
<!-- /ANCHOR:rollback -->
