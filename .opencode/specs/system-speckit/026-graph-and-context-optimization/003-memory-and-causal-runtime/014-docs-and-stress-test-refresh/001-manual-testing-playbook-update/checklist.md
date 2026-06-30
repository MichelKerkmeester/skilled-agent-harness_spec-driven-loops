---
title: "Verification Checklist: Manual Testing Playbook Refresh"
description: "Verification Date: 2026-06-02"
trigger_phrases:
  - "manual testing playbook refresh checklist"
  - "EX-037 EX-042 verification gates"
  - "checkpoint enrichment frontproxy skgit scenario checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored EX-037..EX-042 playbook scenarios and wired the master index"
    next_safe_action: "None binding; six EX scenarios shipped and wired into the master index"
    blockers: []
    key_files:
      - "manual_testing_playbook/manual_testing_playbook.md"
      - "manual_testing_playbook/05--lifecycle/"
      - "manual_testing_playbook/04--maintenance/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-testing-playbook-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Manual Testing Playbook Refresh

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009)
- [x] CHK-002 [P0] Technical approach defined in plan.md (3 phases, additive)
- [x] CHK-003 [P1] Source anchors identified and read (checkpoints.ts, vector-index-schema.ts, enrichment-state.ts, memory-index.ts, launcher-session-proxy.cjs, sk-git SKILL.md)
- [x] CHK-004 [P0] New EX IDs chosen above the existing maximum (EX-036)
- [x] CHK-005 [P0] Destructive scenarios marked sandbox-only per global playbook policy
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New feature files match the validated EX section shape (EX-014/EX-015)
- [x] CHK-011 [P0] No existing scenario, ID, or section restructured (additive only)
- [x] CHK-012 [P1] Master-index entries match the existing `### EX-### | Title` shape with Description, Scenario Contract, Test Execution links
- [x] CHK-013 [P1] Feature files reuse existing source-link/metadata footers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Six EX feature files authored (EX-037..EX-042) under topic-appropriate `NN--category/` folders
- [x] CHK-021 [P0] Master index wired: `### EX-037`..`### EX-042` entries link to the new feature files
- [x] CHK-022 [P1] Each scenario's behavioral claims trace to a cited source anchor in Source Metadata
- [x] CHK-023 [P1] Front-proxy scenario states `-32001` live retryable-recycle and `-32002` terminal fail-closed
- [x] CHK-024 [P1] sk-git scenario documents the `wt/{NNNN}-{name}` / `.worktrees/{NNNN}-{name}` / 4-digit max+1 rule
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each new scenario maps to a concrete shipped behavior with a source anchor (not speculative).
- [x] CHK-FIX-002 [P0] Same-format producer inventory completed: new files mirror `EX-014`/`EX-015` and the `05--lifecycle` checkpoint block.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: master-index `## 7` block updated; `## 12` cross-reference reviewed (no row required for new EX existing-feature entries beyond the directory link).
- [x] CHK-FIX-004 [P1] Accuracy guardrails honored: `-32001` not described as removed; server count stays "36".
- [x] CHK-FIX-005 [P1] Matrix axes listed where relevant: checkpoint format (v1/v2) x includeEmbeddings x shard-attached covered by EX-037 narrative.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced in the new scenarios
- [x] CHK-031 [P0] Destructive checkpoint/restore steps scoped to a disposable sandbox
- [x] CHK-032 [P1] sk-git scenario performs no push/commit/merge; only creates and inspects a worktree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized
- [x] CHK-041 [P1] implementation-summary.md reflects real files changed and validate result
- [x] CHK-042 [P2] decision-record.md ADR statuses current
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New feature files placed under existing `NN--category/` folders only
- [x] CHK-051 [P1] No edits outside the playbook artifact and this child packet
- [x] CHK-052 [P1] No sibling-child or parent-metadata edits
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | All authored-and-wired P0s verified; see implementation-summary.md |
| P1 Items | 12 | Met — see implementation-summary.md verification table |
| P2 Items | 2 | Met (docs synchronized) |

**Verification Date**: 2026-06-02 — six EX scenarios authored, wired, and validated
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-003)
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (new top-level section; renumber; one merged scenario)
- [x] CHK-103 [P2] Folder-placement boundary documented (topic affinity per scenario)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Checkpoint-v2 scenario notes the sandbox-only `VACUUM INTO` runtime warning (NFR-P01)
- [x] CHK-111 [P2] No runtime hot path touched (documentation-only)
- [x] CHK-112 [P2] N/A — no measurable performance change introduced
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented (revert feature file + single index entry)
- [x] CHK-121 [P0] No daemon restart required (documentation-only)
- [x] CHK-122 [P1] Orchestrator owns all git writes
- [x] CHK-123 [P1] Changes confined to the playbook artifact and this child packet
- [x] CHK-124 [P2] N/A — no host-level precheck
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] Accuracy guardrails honored before any completion claim
- [x] CHK-131 [P1] No new dependencies introduced
- [x] CHK-132 [P2] Comment-hygiene observed (no spec-folder/packet ids in code; prose docs only)
- [x] CHK-133 [P2] Destructive-data review: sandbox-only checkpoint scenarios
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet documents synchronized at completion
- [x] CHK-141 [P1] Each new scenario cites its source anchor
- [x] CHK-142 [P2] Master-index links resolve to the new feature files
- [x] CHK-143 [P2] Knowledge transfer captured in implementation-summary.md
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Orchestrator | [ ] Approved | |
| Doc reviewer | Quality gate | [ ] Approved | |
| Operator | Live-run witness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
