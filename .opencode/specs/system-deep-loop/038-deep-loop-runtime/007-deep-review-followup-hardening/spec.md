---
title: "Feature Specification: Deep-Review Followup Hardening"
description: "Phase parent closing every open item from the 2026-07-02 deep-review of packet deep-loops/030: orchestrator validation parity, lineage timestamp truthfulness, cross-mode session-id parity tests, and the section-counts validator bug."
trigger_phrases:
  - "deep review followup hardening"
  - "orchestrator validation parity"
  - "lineage timestamp guard"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/007-deep-review-followup-hardening"
    last_updated_at: "2026-07-04T16:33:19.513Z"
    last_updated_by: "claude-fable-5"
    recent_action: "All 4 children complete; packet closed"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-followup-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Deep-Review Followup Hardening

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../description.json` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence` |
| **Phase** | 015 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-07-02 10-iteration deep-review of packet `deep-loops/030-agent-loops-improved` (verdict CONDITIONAL, 0 P0 / 5 P1 / 1 P2) and its same-day remediation left four verified, unowned defects open: the Node validation path silently skips strict-only shell rules and unconditionally requires completion docs from unstarted folders (two native-vs-shell parity gaps in the same orchestrator, plus a missing vitest harness for its registry bridge); deep-loop LEAF executors can fabricate JSONL timestamps with nothing detecting it (observed live: a tidy invented 12:01-12:10 sequence predating the actual run); the session-id resolve fix shipped for all three loop-mode YAMLs has no parity test keeping the three modes aligned; and the SECTION_COUNTS validator sums every doc-type's section expectations against spec.md alone, producing a known repo-wide false warning.

### Purpose
Close all four with tested fixes so the validation surface tells the truth in both directions (no silently skipped strict rules, no false demands on unstarted work), fabricated lineage telemetry is detected at the orchestration boundary, cross-mode workflow parity is pinned by tests instead of discipline, and SECTION_COUNTS warns only when a real expectation is violated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/lib/validation/orchestrator.ts`: strict-aware registry-rule filter, started-work exemption in `validateFileExists`, plus direct vitest coverage and the single dist rebuild that ships them (child 001).
- `deep-loop-runtime`: post-lineage timestamp sanity validation against the real run window (child 002).
- Cross-mode workflow YAML parity tests for the session-id resolve step in review/context/research (child 003).
- `scripts/rules/check-section-counts.sh`: per-doc-type expectations instead of the summed-against-spec.md bug (child 004).

### Out of Scope
- Sliding-window convergence mode: owned by `deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode`.
- Any new validation rules beyond fixing the four named defects.
- The two PHASE_PARENT_CONTENT false positives accepted by design in packet 030.

### Files to Change

| File Path | Change Type | Child |
|-----------|-------------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/` (new vitest file) | Create | 001 |
| `.opencode/skills/deep-loop-runtime/` (timestamp validation + tests) | Modify/Create | 002 |
| `.opencode/skills/deep-loop-runtime/tests/` or scripts tests (YAML parity) | Create | 003 |
| `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Modify | 004 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-orchestrator-validation-parity` | Strict-only filter fix, FILE_EXISTS started-work exemption, registry-bridge vitest coverage, single gated dist rebuild | Complete |
| 002 | `002-lineage-timestamp-guard` | Detect fabricated lineage JSONL timestamps against the real run window at the fan-out boundary | Complete |
| 003 | `003-session-id-parity-tests` | Pin review/context/research session-id resolve parity with tests | Complete |
| 004 | `004-section-counts-manifest-fix` | SECTION_COUNTS compares per-doc-type expectations, not a summed total against spec.md | Complete |

### Phase Transition Rules

- Children 002, 003, and 004 are independent and may run in any order.
- Child 001 runs LAST: its dist rebuild is gated on no concurrent session holding uncommitted work in the mcp_server package.
- Each child MUST pass its own verification before being marked Complete; child 001 additionally re-runs `test-validation-extended.sh` and clears packet 030's known child-007 FILE_EXISTS error.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. All four defects were verified against live code and recorded during the 2026-07-02 review-and-remediation session; evidence references live in each child's spec.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Origin review**: `.opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/gpt/review-report.md` (GPT-F003, GPT-F006)
- **Deferred-seam record**: `.opencode/specs/deep-loops/030-agent-loops-improved/changelog/011-followup-remediation/changelog-011-006-validate-sh-registry-bridge.md` (Follow-Ups)
- **Sibling implementation**: `deep-loops/030-agent-loops-improved/011-followup-remediation/007-sliding-window-convergence-mode` (runs in parallel with this packet)
