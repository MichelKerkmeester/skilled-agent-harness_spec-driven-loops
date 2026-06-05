---
title: "Implementation Plan: Phase 6: catalog-playbook-accuracy"
description: "Doc-only remediation plan for 10 verified defects in feature_catalog and manual_testing_playbook. Each fix is a targeted text replacement in one or two markdown files; F2 also patches a single test assertion."
trigger_phrases:
  - "catalog playbook accuracy plan"
  - "feature catalog doc fixes"
  - "playbook remediation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "026/000-release-and-program-cleanup/013-comprehensive-audit-remediation/006-catalog-playbook-accuracy"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Fill plan.md with real content"
    next_safe_action: "implement fixes in sequence F1 through F10"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "subagent-F-catalog-playbook-implement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: catalog-playbook-accuracy

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | N/A |
| **Storage** | N/A |
| **Testing** | grep/ls verification; one vitest assertion update |

### Overview

Each finding is a targeted text replacement in one or two markdown files. Sequencing: F1 and F7 both touch feature_catalog.md lines 3946-3950 — do them as one edit. F6 and F9 both touch 313-category-overview.md — do F6 first. F2 patches README.md (5 occurrences) and one test assertion. F3 patches two lines in the playbook root. F4 patches five scenario files. F5 patches scenario 232 and the playbook root. F8, F10 are single-file patches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Verified backlog JSON extracted; all findings CONFIRMED
- [x] All target file paths confirmed to exist on disk
- [x] All replacement target files Read before edit

### Definition of Done
- [x] All acceptance criteria met (grep verifications clean)
- [x] Tests passing (F2 test expectation updated)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Direct text replacement — surgical edits to markdown and one TypeScript test file.

### Key Components
- **feature_catalog.md**: master catalog — coverage claims (F1/F7)
- **214-feature-catalog-code-references.md**: leaf — cleanup-complete claim (F7)
- **README.md**: skill README — tool count (F2)
- **review-fixes.vitest.ts**: test file — tool count assertion (F2)
- **manual_testing_playbook.md**: root playbook — release gate + garbled text (F3/F5)
- **Scenario files (5)**: broken catalog links (F4)
- **Scenario 232**: garbled contract fields (F5)
- **313-category-overview.md**: stale paths + scenario numbers (F6/F9)
- **Playbook 24 README**: scenario numbers (F9)
- **Scenario 234**: wrong verifier path (F8)
- **Scenario 032 + Catalog 253**: stale MCP call shapes (F10)

### Data Flow

No runtime data flow. All changes are static documentation accuracy fixes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| feature_catalog.md:3946,3950 | Universal coverage claims | Replace with ~69% partial-coverage language | grep 'every source file' returns 0 |
| 214-feature-catalog-code-references.md:30 | Cleanup-complete claim | Qualify with known-residual note | Read line |
| README.md (5 lines) | 36-tool count | Replace with 37-tool | grep '36-tool' returns 0 |
| review-fixes.vitest.ts:117 | toBe(36) test assertion | Change to toBe(37) | Test passes |
| manual_testing_playbook.md:166,173 | 380 scenario threshold | Change to 384 | bash check runs clean |
| 5 scenario files | Broken catalog links | Replace with correct paths | ls each target file |
| 232 scenario:18,21 + playbook:2692 | Garbled contract text | Clean natural-language replacement | grep 'sort -u\`' returns 0 |
| 313-category-overview.md:40-47 | Stale implementation paths + scenario range | Fix paths; update range | ls paths; grep stale numbers |
| Playbook 24 README | Scenario numbers 401-415 | Update to 361-375 | grep stale numbers returns 0 |
| Scenario 234:38 | Wrong verifier path | Fix to assets/scripts/ | path resolves |
| Scenario 032:37 | Stale session_bootstrap call | Replace with session_bootstrap({}) | grep 'includeGraphStatus' returns 0 |
| Catalog 253:28 | Stale memory_ingest_start call | Replace with { paths: [...] } | grep 'dryRun' returns 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Feature Catalog Fixes (F1, F7, F6, F2-README)
- [x] F1+F7: Fix coverage and cleanup-complete claims in feature_catalog.md
- [x] F7: Fix cleanup-complete claim in 214 leaf
- [x] F6: Fix stale paths in 313-category-overview.md
- [x] F2: Update README.md 36-tool -> 37-tool (5 occurrences)

### Phase 2: Test and Playbook Root (F2-test, F3, F5-root)
- [x] F2: Update review-fixes.vitest.ts toBe(36) -> toBe(37)
- [x] F3: Update playbook root release gate 380 -> 384
- [x] F5: Fix garbled text at playbook root line 2692

### Phase 3: Scenario File Fixes (F4, F5-scenario, F8, F9, F10)
- [x] F4: Fix 5 broken catalog links
- [x] F5: Fix garbled contract fields in scenario 232
- [x] F9: Update scenario numbers in playbook 24 README
- [x] F8: Fix verifier path in scenario 234
- [x] F10: Fix stale MCP call shapes in 032 and 253
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All changed text | grep/rg per finding |
| ls verification | 5 catalog link targets | ls |
| Manual | Playbook release gate bash block | bash |
| vitest (deferred to central) | F2 test assertion | Noted in brief |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cluster A phase-label removal | External | Unknown — coordinate | F7 claim needs qualification until A lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh shows errors or grep verification fails after edit
- **Procedure**: Revert the specific file to its prior text via git checkout; re-apply correct replacement
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
