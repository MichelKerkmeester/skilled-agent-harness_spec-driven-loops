---
title: "Feature Specification: Phase 12: derive-status-explicit-bypass-fix"
description: "deriveStatus's explicit frontmatter/table status branch runs before the phase-010 completion-evidence gate and returns 'complete' unconditionally; the MCP validation orchestrator also never wires the new enforcement flag through to the validator."
trigger_phrases:
  - "deriveStatus explicit status bypass fix"
  - "orchestrator status completion consistency wiring"
  - "gpt followup audit T2 remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/049-derive-status-explicit-bypass-fix"
    last_updated_at: "2026-07-04T17:11:49.896Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped and tested"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-012-derive-status-bypass-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: derive-status-explicit-bypass-fix

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 048-create-sh-parent-corruption-fix |
| **Successor** | None |
| **Handoff Criteria** | Explicit-status folders route through the same completion-evidence gate as the no-checklist fallback; `orchestrator.ts` wires the enforcement flag through; regression tests pin both, plus the P2 edge-case advisory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of packet 028, closing Target 2 of the 10-iteration GPT-5.5 xhigh adversarial follow-up review (`review-report.md`, session `gpt-followup-audit-20260702T104647Z`) — an independent audit of phase 010's own shipped `deriveStatus` completion-evidence fix (commits `ea2bb09b7a`, `ca9bea9f78`, `b70a441388`) against that phase's `spec.md` REQ-001 through REQ-005.

**Scope Boundary**: `deriveStatus`'s explicit-status precedence branch, `orchestrator.ts`'s wiring of the enforcement flag, their regression tests, and a documentation amendment to phase 010's own `spec.md`. Does NOT touch the 7 other pre-existing `generated-metadata-integrity.ts` violation codes (traced end-to-end in review iteration 7, confirmed not regressed by the phase-010 fix). Does NOT re-open the 213-folder bulk-correction question (still deferred, operator's call, unaffected by this phase).

**Dependencies**:
- None. Builds on phase 010's shipped fix but does not require phase 011 to land first (different files, no shared call path).

**Deliverables**:
- `deriveStatus`'s explicit-status branch routes a `complete` claim through the same completion-evidence gate the no-checklist fallback already uses, rather than returning immediately
- `mcp_server/lib/validation/orchestrator.ts` passes `statusCompletionConsistencyEnforced` through to `resolveGeneratedMetadataIntegrity`, matching the existing CLI-bridge wiring pattern
- Regression tests for both fixes, plus an orchestrator-level enforced-mode test
- P2 advisory: direct parser tests for the edge cases already verified correct by code-reading (malformed/quoted `completion_pct`, comments-only `tasks.md`, empty `implementation-summary.md`, derive-only concurrency)
- Phase 010's `spec.md` REQ-001/REQ-002/REQ-005 amended to state explicitly that explicit frontmatter/table `complete` status must also satisfy the completion-evidence gate, not stand alone

**Changelog**:
- When this phase closes, refresh the matching file in ../../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deriveStatus` (`graph-metadata-parser.ts:1185-1195`) reads any doc's own explicit `status:` frontmatter field or `spec.md`'s METADATA table status, ranked `implementation-summary.md` > `checklist.md` > `tasks.md` > `plan.md` > `spec.md`, and returns that value immediately when present — including `complete` — before the phase-010 completion-evidence fallback (`:1215-1239`) ever runs. This is the same defect class phase 010 closed (a folder can claim `complete` without real completion evidence), reachable via a different code path the phase-010 fix did not touch. The current test suite (`graph-metadata-schema.vitest.ts:510-520`) pins this bypass as expected behavior, masking the gap. Separately, `mcp_server/lib/validation/orchestrator.ts:563-568` calls `resolveGeneratedMetadataIntegrity` without passing `statusCompletionConsistencyEnforced`, so `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true` has no effect through that entrypoint even though the CLI bridge (`scripts/validation/generated-metadata-integrity.ts`) wires it correctly.

### Purpose
`deriveStatus` never returns `complete` from an explicit status claim alone; it always requires the same completion-evidence support the no-checklist fallback requires. The MCP validation orchestrator enforces the new gate identically to the CLI bridge when the flag is enabled.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `deriveStatus`'s explicit-status branch (`:1185-1195`) so a `complete` claim falls through to the same completion-evidence derivation the no-checklist branch uses, instead of returning immediately; non-`complete` explicit statuses (`in_progress`, `planned`, `blocked`) are unaffected
- Pass `statusCompletionConsistencyEnforced: isStatusCompletionConsistencyGateEnabled()` into `orchestrator.ts`'s `resolveGeneratedMetadataIntegrity` call (`:563-568`), mirroring the CLI bridge's existing pattern
- Add regression tests: explicit `status: Done`-style frontmatter without completion evidence no longer derives `complete`; the same status WITH real evidence still derives `complete`; an orchestrator-level `validateFolder` test with the flag enabled and a status/completion mismatch fixture
- Update the existing pinned test (`graph-metadata-schema.vitest.ts:510-520`) that currently asserts the bypass as correct, since that assertion encodes the bug being fixed
- (P2, advisory) Add direct parser tests for the 5 edge cases review iteration 6 verified correct by code-reading but left untested
- Amend phase 010's `spec.md` REQ-001/REQ-002/REQ-005 wording to state the completion-evidence requirement applies to explicit-status claims too

### Out of Scope
- The 7 other pre-existing `generated-metadata-integrity.ts` violation codes — traced and confirmed not regressed (review iteration 7); no code change needed
- The 213-folder bulk-correction backlog — still deferred, operator's call
- `create.sh` parent-corruption fix — tracked separately in phase 011
- Whether `orchestrator.ts` is a supported/reachable validation entrypoint at all — the review flagged this as T2-P1-002/003's own downgrade trigger; this phase wires it correctly regardless, since downgrading requires a maintainer confirmation this phase does not have standing to make

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Route explicit `complete` status through the completion-evidence gate |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | Wire `statusCompletionConsistencyEnforced` into `resolveGeneratedMetadataIntegrity` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modify | Fix the pinned-bypass test; add explicit-status + evidence coverage; add P2 edge-case tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | Modify | Add orchestrator-level enforced-mode regression test |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/047-generated-metadata-status-integrity/spec.md` | Amend | Clarify REQ-001/REQ-002/REQ-005 wording per review's Spec Seed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deriveStatus` never returns `complete` from an explicit status claim alone | A folder whose `implementation-summary.md` frontmatter says `status: complete` (or `spec.md`'s table says `Status: Complete`) but has no completion evidence (no `completion_pct`, or `completion_pct < 100`, or open `tasks.md` items) derives a non-`complete` status |
| REQ-002 | Genuinely complete folders still derive `complete` | A folder with `status: complete` frontmatter AND `completion_pct >= 100` AND no open tasks (or a checklist showing all items checked) still derives `complete` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `orchestrator.ts` enforces the new gate identically to the CLI bridge | With `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE=true`, `validateFolder()` on a status/completion-mismatch fixture returns an error-level `STATUS_COMPLETE_EVIDENCE_MISMATCH` entry |
| REQ-004 | Regression tests pin both fixes | New tests cover: explicit-status-without-evidence non-complete, explicit-status-with-evidence still-complete, orchestrator-level enforced-mode mismatch |
| REQ-005 | The pinned test that currently asserts the old bypass behavior is corrected | `graph-metadata-schema.vitest.ts:510-520`'s assertion matches the fixed behavior, not the bug |

### P2 - Advisory (does not block)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Direct parser tests exist for the 5 previously-verified-by-reading edge cases | Tests added for malformed/quoted `completion_pct`, comments-only `tasks.md`, whitespace-only `implementation-summary.md`, and derive-only concurrency |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A synthetic folder with explicit `status: complete` frontmatter and no completion evidence no longer derives `complete`
- **SC-002**: A synthetic folder with explicit `status: complete` frontmatter AND real completion evidence still derives `complete`
- **SC-003**: An orchestrator-level `validateFolder()` call with the flag enabled catches a status/completion mismatch the same way the CLI bridge does
- **SC-004**: Full targeted suite (the 2 test files above, plus phase 010's original suite) green, fresh run pasted as evidence
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Routing explicit `complete` status through the evidence gate could newly reclassify folders repo-wide that currently rely on the explicit-status shortcut | Medium - could shift `derived.status` for folders outside this session's control on next regeneration | This only affects folders whose `derived.status` is actively regenerated (not stored data); the change is symmetric with phase 010's own precedent (ship the code fix, defer any bulk data correction as a separate operator-approved action) |
| Risk | Fixing the pinned test at `graph-metadata-schema.vitest.ts:510-520` could mask that the ORIGINAL test author intended the bypass deliberately | Low - the review's REQ-by-REQ audit (iteration 5) and phase 010's own spec.md wording both support closing the gap, not preserving it | Amend phase 010's spec.md wording alongside the code fix, so the record shows an explicit, reasoned choice rather than a silent contradiction |
| Dependency | None | N/A | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The review's Spec Seed and Plan Seed already resolved the design questions.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../047-generated-metadata-status-integrity/review/review-report.md` (T2-P1-001, T2-P1-002, T2-P1-003, T2-P2-001)
<!-- /ANCHOR:cross-refs -->
