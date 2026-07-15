---
title: "Feature Specification: Phase 10: generated-metadata-status-integrity"
description: "deriveStatus marks a folder complete from implementation-summary.md presence alone, ignoring completion_pct and open tasks; 213 folders are already mislabeled repo-wide, and no --strict rule catches this class of defect."
trigger_phrases:
  - "generated metadata status integrity"
  - "deriveStatus false complete"
  - "graph metadata status defect"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/013-generated-metadata-status-integrity"
    last_updated_at: "2026-07-04T17:11:47.506Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Shipped, tested and committed as ea2bb09b7a"
    next_safe_action: "Decide separately on bulk-correcting the 213-folder backlog"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-010-status-integrity-20260702"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: generated-metadata-status-integrity

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | ../012-drift-audit-deep-history-correction/spec.md |
| **Successor** | ../014-create-sh-parent-corruption-fix/spec.md |
| **Handoff Criteria** | `deriveStatus` gates `complete` on real completion evidence; new validator rule ships in non-blocking report mode; 6-file test suite green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of packet 028, closing an unrelated defect a 10-iteration GLM-5.2 diagnostic review surfaced while auditing a different packet's stalled phase folder (`032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer`). Packet 028 phase 005 (`003-spec-data-quality`) already owns this repo's generated-metadata build and full-repo JSON migration history, making it the natural home for a defect in that same generator.

**Scope Boundary**: `graph-metadata-parser.ts`'s status-derivation logic and the `generated-metadata-integrity.ts` validator only. Does NOT bulk-correct the 213 already-mislabeled folders on disk (deferred, operator's call, separate action after this fix ships and the new rule's report-mode output is reviewed). Does NOT touch phase 009's own folder in packet 032 (owned by a separate concurrent session).

**Dependencies**:
- None. This is an isolated fix to shared system-spec-kit tooling.

**Deliverables**:
- `deriveStatus` gated on `completion_pct >= 100 AND no open tasks.md items`, not file-presence alone
- A new cross-field `validate.sh --strict` rule joining `derived.status === 'complete'` to `completion_pct`/tasks.md content
- The new rule ships in non-blocking report mode behind a new capability flag (matching this codebase's own `SPECKIT_GENERATOR_HARDENING`/`SPECKIT_GENERATED_METADATA_DRIFT_GATE` graduated-rollout convention), so it does not immediately turn 213 already-corrupted folders repo-wide into new strict failures for other concurrent sessions
- Regression tests pinning both the fixed `deriveStatus` behavior and the new validator rule

**Changelog**:
- When this phase closes, refresh the matching file in ../../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deriveStatus` (`graph-metadata-parser.ts:1215-1218`) returns `status: 'complete'` whenever `implementation-summary.md` exists and `checklist.md` does not, regardless of whether the doc is a real completed summary or an unfilled Level-1 scaffold. A repo-wide sweep (2,425 folders) found 213 folders already mislabeled `complete` on disk today, with up to 363 exposed to the defect class (296 of those have no `completion_pct` field at all, an edge case the fix must handle explicitly). No rule in the `validate.sh --strict` chain cross-checks `derived.status` against `completion_pct` or open tasks, so this class of defect is currently undetectable by strict validation.

### Purpose
`deriveStatus` reports `complete` only when real completion evidence (completion_pct >= 100 and no open tasks.md items) supports it, and a new non-blocking `--strict` rule flags any existing `graph-metadata.json` where `derived.status: complete` disagrees with that evidence, so this defect class stops being invisible to validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix `deriveStatus`'s `!checklistDoc` branch (`graph-metadata-parser.ts:1215-1218`) to check `completion_pct` (from `implementation-summary.md`'s frontmatter) and open `tasks.md` items before returning `complete`
- Add `parseCompletionPct`/`hasOpenTaskItems` helper functions (or equivalent) to extract that evidence
- Add a new cross-field validator check to `generated-metadata-integrity.ts` that flags `derived.status === 'complete'` folders whose source docs disagree
- Add a new capability flag gating the new validator check in non-blocking report mode by default (matching `SPECKIT_GENERATOR_HARDENING`'s graduated-rollout convention)
- Document the new flag in `ENV_REFERENCE.md`'s feature flags reference table
- Regression tests for both the `deriveStatus` fix and the new validator rule

### Out of Scope
- Bulk-correcting the 213 already-mislabeled folders on disk - separate action, operator's call, after this fix ships and report-mode output is reviewed
- Graduating the new validator rule to a hard error - deferred until the 213-folder backlog is reviewed
- Phase 009's own folder in packet 032 - owned by a separate concurrent session, untouched by this phase
- The reducer schema-mismatch bug the diagnostic review's own synthesis pass hit in `reduce-state.cjs` - a deep-loop-runtime issue, not a spec-kit generated-metadata issue, out of scope here

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Gate the `!checklistDoc` branch of `deriveStatus` on real completion evidence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` | Modify | Add the cross-field status/completion-evidence validator check |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Add the new report-mode-default capability flag |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document the new flag |
| Matching `.test.ts`/`.vitest.ts` files for the three modules above | Modify | Regression coverage for both fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `deriveStatus`'s `!checklistDoc` branch no longer returns `complete` from file-presence alone | A folder with an unfilled `implementation-summary.md` scaffold (no `completion_pct`, or `completion_pct` under 100, or open `tasks.md` items) and no `checklist.md` derives a non-`complete` status |
| REQ-002 | The null-`completion_pct` edge case (296 folders repo-wide) does not silently resolve to `complete` | A folder with no parseable `completion_pct` field derives a non-`complete` status with `reviewRequired: true` (or preserves a pre-existing valid status), never a fresh false-positive `complete` |

> **Amendment (2026-07-02, phase 012):** REQ-001/REQ-002/REQ-005 apply to explicit frontmatter/table `complete`-style status claims too, not only the no-checklist fallback. The originally shipped fix (this phase) left a second bypass open at `deriveStatus`'s explicit-status branch (`graph-metadata-parser.ts:1185-1195`), which ran ahead of the completion-evidence gate below and let any doc's own `status: complete`/`Status: Done` claim return immediately without evidence — the same defect class, a different code path. Phase 012 closed that gap; an explicit `complete` claim now requires the same `completion_pct >= 100 && !openTasks` evidence (or a genuine checklist-complete result) as every other path. Non-`complete` explicit statuses (`in_progress`, `planned`, `blocked`) are unaffected and still return immediately, since they carry no equivalent false-positive risk. See `047-generated-metadata-status-integrity/review/review-report.md` (T2-P1-001) and `../049-derive-status-explicit-bypass-fix/`.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A new `validate.sh --strict` rule flags `derived.status: complete` folders whose completion evidence disagrees | Running the new check against a folder with `status: complete` but `completion_pct < 100` or open tasks produces a violation |
| REQ-004 | The new rule ships non-blocking (report/info mode) by default | A fresh `validate.sh --strict` run against one of the 213 already-mislabeled folders does NOT newly fail because of this rule alone, unless the new flag is explicitly opted into enforced mode |
| REQ-005 | Regression tests pin both fixes | `node --test` (or the relevant vitest suite) covers: the corrected `deriveStatus` branch, the null-`completion_pct` edge case, and the new validator rule in both report and enforced mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A synthetic Level-1 folder with an unfilled `implementation-summary.md` scaffold and no `checklist.md` no longer derives `status: complete`
- **SC-002**: A fresh, repo-wide `validate.sh --strict` pass on a sample of the 213 already-mislabeled folders shows the new rule in non-blocking report mode, not as new hard failures
- **SC-003**: The existing 6-file `mk-goal-*.test.cjs` suite and the system-spec-kit test suite touching `graph-metadata-parser.ts`/`generated-metadata-integrity.ts` all pass after the change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Enabling the new rule as a hard error by default would immediately fail 213 folders across multiple concurrently-active sessions' packets | High - could break other sessions' in-flight `validate.sh --strict` gates without warning | Ship report-mode-only by default via a new capability flag, matching the codebase's own established graduated-rollout convention |
| Risk | `completion_pct` extraction regex (`extractFrontmatterScalar`) may not reliably parse every real-world doc's nested `_memory.continuity.completion_pct` YAML shape | Medium - could produce false negatives (treating a genuinely complete folder as unknown) | Verify extraction against several real completed and real scaffold docs from this session's own work before finalizing |
| Dependency | None | N/A | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The diagnostic review already resolved the design questions (gate on completion_pct + open tasks; ship the validator rule non-blocking first).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
