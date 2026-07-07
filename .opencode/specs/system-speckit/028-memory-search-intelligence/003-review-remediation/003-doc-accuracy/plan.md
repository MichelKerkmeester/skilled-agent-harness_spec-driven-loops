---
title: "Implementation Plan: Doc Accuracy Remediation"
description: "Fix approach for the changelog mislabel and the iteration-9 doc staleness cluster."
trigger_phrases:
  - "028 doc accuracy plan"
  - "doc staleness cluster fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-review-remediation/003-doc-accuracy"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING doc-accuracy plan"
    next_safe_action: "Trace each doc claim to a commit before editing"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-plan-006-003-doc-accuracy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Doc Accuracy Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | Spec Kit documentation and changelog surfaces |
| **Storage** | Repository files, git history |
| **Testing** | Git-log tracing, sibling strict validation, strict spec validation |

### Overview
This phase reconciles the packet narrative docs with committed code. It corrects the Memory rollup mislabel, advances the frozen timeline and before-vs-after narratives, completes the default-off flag inventories and reconciles the sibling status tables. Every status edit must trace to a commit or an implementation-summary. No code changes here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The five mislabeled rollup rows (009/011/017/018/020) are traced to their commits.
- [ ] The commit range omitted by the timeline and before-vs-after is enumerated.
- [ ] Phase 001 has already applied its benchmark-status re-run update, so this phase can layer on top.

### Definition of Done
- [ ] The changelog rollup matches committed code.
- [ ] The timeline and before-vs-after cover the full commit range.
- [ ] The flag inventories are complete and the sibling status tables agree.
- [ ] Strict validation exits 0 for this child phase and for the edited 005 sibling.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only accuracy reconciliation against committed code.

### Key Components
- **Rollup reclassification**: correct the Planned-vs-shipped rows traceable to named commits.
- **Narrative refresh**: advance the timeline and before-vs-after past commit 30.
- **Inventory completion**: add the missing default-off flags to both inventories.
- **Sibling reconciliation**: align the 005 phase-map, root changelog and fingerprint.

### Data Flow
Each doc claim is checked against `git log` and the relevant implementation-summary, then edited to match. The flag inventories are checked against `search-flags.ts` and the per-track changelogs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `changelog-001-root.md:36` | Mislabels shipped rows as Planned | Reclassify against commits | Rows trace to `ed53661043`, `5308401d95`, `8f8776e329` |
| `timeline.md` | Frozen at commit 30 | Refresh diagram and Section E | Covers the shipped schema cluster |
| `before-vs-after.md` | CURRENT STATE at commit 30 | Advance and correct cleanup claims | Matches changelog-003-root |
| `benchmark-status.md` | Incomplete flag inventory | Add missing flag(s) | `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` listed |
| `ENV_REFERENCE.md` | Missing 17 new flags | Add flags with defaults | All 17 getters documented |
| `000-release-cleanup/spec.md` | Stale phase-map, zero-hash fingerprint | Reconcile and recompute | `validate.sh 000-release-cleanup --strict` exits 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Trace each mislabeled rollup row to its commit and child implementation-summary.
- [ ] Enumerate the commits omitted by the timeline and before-vs-after.
- [ ] Confirm phase 001 has applied its benchmark-status re-run update.

### Phase 2: Core Implementation
- [ ] Reclassify the Memory rollup rows (P1-6), keeping phase 008 as no-code-shipped where its child agrees.
- [ ] Refresh the timeline diagram and Section E shipped-vs-held classification.
- [ ] Advance before-vs-after CURRENT STATE and correct the release-cleanup PENDING claims.
- [ ] Complete the default-off flag inventories in `benchmark-status.md` and `ENV_REFERENCE.md`.
- [ ] Reconcile the 005 phase-map and replace the zero-hash fingerprint with a real one.

### Phase 3: Verification
- [ ] Confirm every status edit traces to a commit or implementation-summary.
- [ ] Re-run `validate.sh 000-release-cleanup --strict` after editing the sibling spec.
- [ ] Run strict validation for this child folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Commit tracing | Status claims | `git log`, `git show` |
| Flag inventory | Default-off flags | `rg` over `search-flags.ts` |
| Sibling validation | 005 phase parent | `validate.sh --strict` |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 benchmark-status update | Internal | Pending | Inventory fix must layer on the re-run, not revert it |
| Branch commit history | Internal | Green | Cannot trace status claims without it |
| Spec-kit validator | Internal | Green | Cannot claim phase validation without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A status edit overstates progress or reverts the phase-001 benchmark update.
- **Procedure**: Revert the specific doc edit, restore the prior text and re-trace the claim before retrying.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 003 | `../001-eval-benchmark-fidelity/spec.md` | benchmark-status.md must carry the phase-001 re-run before the inventory fix |
| 003 | `../spec.md` | Parent roster orders the remediation phases |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Rollup reclassification | Small | Five rows traced to commits |
| Narrative refresh | Medium | Timeline and before-vs-after span many commits |
| Inventory and sibling reconciliation | Medium | Two inventories plus the 005 sibling |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior doc text before each edit.
- Revert any status change that cannot be traced to a commit.
- Re-run `validate.sh --strict` on this child and the edited 005 sibling after rollback.
<!-- /ANCHOR:enhanced-rollback -->
