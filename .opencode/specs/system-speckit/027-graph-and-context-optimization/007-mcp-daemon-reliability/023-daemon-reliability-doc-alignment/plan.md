---
title: "Implementation Plan: Daemon-reliability doc alignment"
description: "Audit the doc surfaces with gpt-5.5, then add ENV_REFERENCE flags + catalog entries + playbook scenarios + README/SKILL touches for 018-022, keeping indexes and counts consistent."
trigger_phrases:
  - "daemon reliability doc alignment plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/023-daemon-reliability-doc-alignment"
    last_updated_at: "2026-06-07T18:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented the doc alignment"
    next_safe_action: "Changelog + sk-code/sk-doc cross-check"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-023-daemon-reliability-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Daemon-reliability doc alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs (skill assets) |
| **Framework** | sk-doc templates |
| **Storage** | N/A |
| **Testing** | grep-traceability + link check + playbook count self-check |

### Overview
A gpt-5.5 (cli-codex) audit + grep pre-scan confirmed 018-022 were undocumented. Two @markdown agents authored the 5 catalog entries + 5 playbook scenarios from the 421 entries as templates; the orchestrator added the ENV_REFERENCE flag rows, the catalog/playbook index entries, the file-count bump, the README/SKILL touches, and the 419 cross-reference.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gap audited (gpt-5.5 + grep)
- [x] Templates identified (the 421 entries)
- [x] Index/count invariants understood

### Definition of Done
- [x] All surfaces aligned
- [x] Counts consistent + 0 broken links
- [x] Docs validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit -> parallel authoring (agents) -> orchestrator-owned indexes/counts -> verify.

### Key Components
- **ENV_REFERENCE table** (orchestrator).
- **5 catalog entries + index** (@markdown agent + orchestrator index).
- **5 playbook scenarios + table + count** (@markdown agent + orchestrator index/count).

### Data Flow
gpt-5.5 audit -> gap list -> agents write per-entry files -> orchestrator wires indexes + counts + READMEs -> link check + count self-check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| ENV_REFERENCE.md | feature-flags table | add 8 rows | grep for each flag |
| feature_catalog (+index) | catalog | add 5 entries + index refs | link check + grep-traceability |
| manual_testing_playbook (+index) | playbook | add 5 scenarios + rows + count | count self-check (391) + link check |
| READMEs + SKILL | runtime docs | add lifecycle rows / pointers | link check |

Required inventories:
- Consumers: operators reading ENV_REFERENCE / catalog / playbook / READMEs.
- Matrix axes: {5 features} x {5 surfaces} -> the audit matrix.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] gpt-5.5 (cli-codex) doc-alignment audit + grep pre-scan
- [x] Define exact entry slugs + playbook IDs (422-426)

### Phase 2: Core Implementation
- [x] ENV_REFERENCE 8 rows (orchestrator)
- [x] 5 catalog entries (@markdown) + 5 index sections (orchestrator)
- [x] 5 playbook scenarios (@markdown) + table rows + count bump + 419 note (orchestrator)
- [x] README (mcp_server/bin/root/database) + SKILL touches (orchestrator)

### Phase 3: Verification
- [x] Count self-check (391 playbook / 325 catalog)
- [x] Repo-wide markdown link check (0 broken)
- [x] validate.sh --strict for this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link integrity | all docs | check-markdown-links.cjs |
| Count invariant | playbook | the embedded count self-check |
| Traceability | catalog SOURCE FILES | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 421 entries (templates) | Internal | Green | models for the new entries |
| 018-022 packets | Internal | Green | source of truth for content |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: doc inconsistency or broken links.
- **Procedure**: `git revert` the doc-alignment commit; the features + their packets are unaffected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit ──► Author ──► Wire indexes ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Author |
| Author | Audit | Wire |
| Wire | Author | Verify |
| Verify | Wire | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Low | <1 hour |
| Authoring | Med | 2-3 hours (parallel agents) |
| Verification | Low | <1 hour |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Counts verified against reality
- [x] Links verified (0 broken)
- [x] No code touched

### Rollback Procedure
1. `git revert` the doc-alignment commit.
2. Re-run the link check + count self-check to confirm the prior baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
