---
title: "Implementation Plan: Catalog/playbook alignment audit for local embeddings default set"
description: "Plans the documentation-only audit handoff for catalog and playbook alignment with local embedding defaults."
trigger_phrases:
  - "catalog playbook audit plan"
  - "embedding provider cascade"
  - "manual playbook update matrix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/020-catalog-playbook-alignment-audit"
    last_updated_at: "2026-05-13T15:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Applied code graph scan remediation follow-up"
    next_safe_action: "Restart MCP server if needed, then rerun code_graph_scan"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000020"
      session_id: "020-catalog-playbook-alignment-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which catalog and playbook entries need update/delete/edit/create actions after local embedding defaults changed?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Catalog/playbook alignment audit for local embeddings default set

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec documentation plus TypeScript code graph handler/tests |
| **Framework** | Spec Kit Level 3 packet under a phase parent |
| **Storage** | File-backed spec folder metadata |
| **Testing** | `validate.sh --strict`, focused Vitest, TypeScript typecheck, alignment drift |

### Overview

Create a Level 3 child phase that records audit findings for stale feature catalog and manual testing playbook expectations after local embedding defaults changed, then apply the approved documentation follow-ups. Verification exposed a separate code graph scan refresh loop, so this packet now includes a targeted TypeScript follow-up for `code_graph_scan` and its focused tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: dispatch-supplied source-of-truth defaults and exact target file list.
- [x] Write boundary confirmed: docs in the approved follow-up set plus targeted code graph scan handler/test remediation.

### Definition of Done
- [x] All acceptance criteria captured in `spec.md`.
- [x] P0/P1 and P2/P3 findings mapped to concrete follow-on actions.
- [x] Approved catalog/playbook and related reference docs are updated.
- [x] Strict validation and placeholder checks run.
- [x] Focused code graph scan test and TypeScript typecheck run after runtime remediation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Audit and follow-up packet: source-of-truth defaults -> impact classification -> exact path/action matrix -> applied documentation updates.

### Key Components
- **Memory default matrix**: Provider cascade and local/fallback model identifiers.
- **CocoIndex default matrix**: Default model, query prompt, and code-only include behavior.
- **Impact matrix**: Required updates, review/caveat candidates, and non-impact surfaces.
- **Verification ledger**: Validation commands and evidence that the applied documentation updates stayed in scope.

### Data Flow

Dispatch findings feed this packet. The approved follow-up edits update catalog/playbook docs without re-opening provider-default decisions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| system-spec-kit feature flag catalog/playbook | Documents memory embedding/API feature flags and manual validation. | Updated to include cascade and local/fallback defaults. | Paired files and root summaries now name current local/fallback behavior. |
| system-spec-kit pipeline catalog/playbook | Documents embeddings and retry API behavior. | Updated to validate current provider profile/model IDs. | Scenario now names active local profile and model IDs. |
| mcp-coco-index catalog/playbook | Documents CocoIndex embedding provider selection and settings. | Updated stale `all-MiniLM-L6-v2`/Voyage expectations. | Docs now name EmbeddingGemma and `InstructionRetrieval`. |
| mcp-coco-index project settings scenario | Inspects project defaults and include/exclude behavior. | Caveated for code-only include and specs/docs exclusion. | Scenario no longer requires docs/spec formats in the default include set. |
| mcp-coco-index path taxonomy and intent reranking docs | Discuss docs/spec classification or reranking. | Caveated. | Text now states docs/spec behavior protects explicit opt-in or legacy indexes, not default inclusion. |
| system-spec-kit reranker docs | Reranker-specific `llama-cpp` context. | No embedding-default update. | Preserve distinction between reranker backend and embedding provider cascade. |
| Code Graph docs | Structural graph, no embedding defaults. | Non-impact. | No update required. |
| Skill Advisor docs | Local/native scorer implementation language. | Non-impact unless caveat is needed. | Clarify `local/native` means scorer implementation, not embedding provider cascade. |
| code graph scan handler | Explicit scan path for stale structural graph refresh. | Runtime remediation. | Incremental scans now stay incremental across Git HEAD drift, refresh candidate manifests after promotion, and report structural persistence errors first. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold and Scope
- [x] Create Level 3 child phase from system-spec-kit scaffolding.
- [x] Read sk-doc and system-spec-kit template guidance.
- [x] Confirm parent phase exists and write scope is limited to child folder.

### Phase 2: Audit Capture
- [x] Record memory provider cascade and local/fallback defaults.
- [x] Record CocoIndex model, query prompt, and default include/exclude behavior.
- [x] Record Code Graph, reranker, and Skill Advisor non-impact caveats.
- [x] Map P0/P1 and P2/P3 target paths to actions.

### Phase 3: Follow-up Application
- [x] Update system-spec-kit catalog and playbook entries.
- [x] Update mcp-coco-index catalog/playbook/default references.
- [x] Add code-only include/default exclusion caveats where needed.
- [x] Refresh this packet and parent metadata.

### Phase 4: Verification
- [x] Fill scaffold placeholders across required Level 3 docs.
- [x] Run strict spec validation.
- [x] Run placeholder marker check.
- [x] Verify stale default wording is removed from current-default claims.
- [x] Attempt code graph refresh and record stale/timeout status.

### Phase 5: Code Graph Scan Remediation
- [x] Diagnose stale/timing-out code graph refresh behavior.
- [x] Update `code_graph_scan` to honor incremental scans across Git HEAD drift.
- [x] Refresh candidate manifest after successful incremental scans.
- [x] Prioritize structural persistence errors in failed-scan metadata.
- [x] Add focused regression tests and run TypeScript typecheck.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Level 3 doc contract and anchors | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
| Placeholder scan | Obvious scaffold markers and sample text | `grep`/Python text scan over child folder markdown |
| Scope verification | Ensure only documentation/metadata files changed for this follow-up | Git diff review outside target scope |
| Manual content check | Source-of-truth defaults and target path matrix | Human review against dispatch findings |
| Code graph regression | Incremental HEAD drift and failed-scan metadata ordering | `npm exec -- vitest run code_graph/tests/code-graph-scan.vitest.ts` |
| Type safety | TypeScript compile contract | `npm run typecheck` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Dispatch source-of-truth defaults | Input | Green | Cannot produce deterministic audit without exact cascade/model IDs. |
| system-spec-kit Level 3 templates | Internal | Green | Required for compliant spec docs. |
| Strict validator | Internal | Green | Required before completion claim. |
| Target catalog/playbook docs | Documentation update targets | Green | Updated by approved follow-up scope. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit packet or applied documentation updates contain wrong source-of-truth defaults.
- **Procedure**: Revert only this packet and the scoped documentation files changed by this follow-up, then reapply corrected findings.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Scaffold -> Audit Capture -> Validation -> Follow-on Docs Packet
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | Parent phase folder and templates | Audit Capture |
| Audit Capture | Dispatch findings | Validation |
| Validation | Completed packet docs | Follow-on catalog/playbook edits |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Audit Capture | Medium | 30 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **50 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime deployment needed.
- [x] No data migration needed.
- [x] Target docs are documentation-only and in scope for the approved follow-up.

### Rollback Procedure
1. Revert this child phase folder and scoped documentation edits.
2. Re-run scaffold if a corrected audit packet is needed.
3. Reapply corrected documentation updates.
4. Re-run strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File revert only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Memory defaults ─┐
                 ├──► Audit matrix ───► Follow-on system-spec-kit docs updates
CocoIndex defaults┘             └──────► Follow-on mcp-coco-index docs updates

Reranker / Code Graph / Skill Advisor caveats ───► Non-impact guardrails
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Memory defaults | Dispatch source of truth | Cascade/model requirements | system-spec-kit update guidance |
| CocoIndex defaults | Dispatch source of truth | Model/prompt/include guidance | mcp-coco-index update guidance |
| Non-impact guardrails | Surface classification | Caveat/no-op guidance | Avoids scope drift |
| Validation | Completed docs | Completion evidence | Status claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Scaffold Level 3 packet.
2. Replace template placeholders with audit findings.
3. Preserve exact source-of-truth provider cascade and model IDs.
4. Validate packet structure and placeholder removal.
5. Apply and verify the approved target-doc updates.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Deliverable | Status |
|-----------|-------------|--------|
| M1 | Level 3 child folder scaffolded | Complete |
| M2 | Audit matrix captured | Complete |
| M3 | Validation evidence recorded | Complete |
| M4 | Follow-on action list ready | Complete |
<!-- /ANCHOR:milestones -->
