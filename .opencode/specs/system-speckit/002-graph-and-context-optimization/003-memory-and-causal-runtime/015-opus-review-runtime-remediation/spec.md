---
title: "Feature Specification: Opus Review Runtime Remediation (013 cross-review)"
description: "Remediate the independent Opus 4.8 cross-review of the deployed 013 memory runtime and docs: 4 P1 correctness fixes (checkpoint-restore data-loss crash window, front-proxy UTF-8 frame corruption, reconcileMoves spec_folder omission, incomplete version/tool-count doc sweep) plus 17 P2 advisories."
trigger_phrases:
  - "opus review runtime remediation"
  - "013 cross-review fixes"
  - "checkpoint restore data loss crash window"
  - "front-proxy utf-8 frame corruption"
  - "reconcileMoves spec_folder omission"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Opus Review Runtime Remediation (013 cross-review)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

An independent Opus 4.8 cross-review of the deployed 013 memory runtime (checkpoint v2, MCP front-proxy, memory_save enrichment, the needs-rebuild sentinel) and its packet docs surfaced 4 P1 correctness defects and 17 P2 advisories. The P1 defects are: a checkpoint-restore data-loss crash window where a crash after the live DB is renamed to `.bak` but before the snapshot is in place can leave no live database; a front-proxy UTF-8 frame corruption where multi-byte sequences split across socket reads are decoded per-chunk and mangled; a `reconcileMoves` omission that drops `spec_folder` when rewriting moved-file rows; and an incomplete version/tool-count documentation sweep that leaves stale `SCHEMA_VERSION` and tool-count claims across runtime docs. This packet remediates each cited finding surgically — the exact defect, minimal diff, a focused vitest proving every behavior-changing fix — and leaves all other 013 workstreams untouched.

**Key Decisions**: Fix only the exact cited issues with minimal diffs; prove each runtime-behavior fix with a focused vitest; no restructuring and no cross-workstream edits.

**Critical Dependencies**: The deployed 013 runtime surfaces under review (`checkpoints.ts` restore swap, `launcher-session-proxy.cjs` frame decoding, `incremental-index.ts` row rewrite), the existing vitest harness, and the accuracy of the cross-review findings against the current source.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deployed 013 runtime shipped and is live, but an independent Opus 4.8 cross-review found correctness defects that the original implementation and its review missed. Three are runtime-behavior bugs that can corrupt data or crash under specific timing or input (restore crash window, front-proxy multi-byte frame split, `reconcileMoves` field omission). One is a documentation-accuracy gap (stale version and tool-count claims). Seventeen further advisories are lower-severity hardening and clarity items.

### Purpose
Remediate every cited finding against the actual deployed source: fix the 4 P1 defects with minimal, verified diffs and resolve the 17 P2 advisories, without restructuring the runtime or touching unrelated 013 workstreams. Each fix that changes runtime behavior is proven by a focused vitest that is added or extended and run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **P1-1**: Close the checkpoint-restore data-loss crash window — order the file swap so a crash never leaves the live database absent, and make boot recovery reconstruct a consistent state from whatever partial swap is on disk.
- **P1-2**: Fix front-proxy UTF-8 frame corruption — buffer raw bytes across socket reads and decode only on complete-frame boundaries so split multi-byte sequences are never mangled.
- **P1-3**: Fix `reconcileMoves` `spec_folder` omission — preserve `spec_folder` when rewriting moved-file rows so moved files keep their folder association.
- **P1-4**: Complete the version/tool-count documentation sweep — reconcile stale `SCHEMA_VERSION` and tool-count claims to the deployed values across the runtime docs the review cited.
- **17 P2 advisories**: lower-severity hardening, error-message, and clarity fixes confined to the exact lines the review cited.

### Out of Scope
- Any change to 013 workstreams not named in a cited finding (checkpoint v2 selection gate, needs-rebuild sentinel internals, memory_save enrichment beyond the cited lines).
- Restructuring, renaming, or "cleanup" of files beyond the minimal diff each finding requires.
- New features, new tools, or schema-version bumps beyond what a cited fix strictly needs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/storage/checkpoints.ts` | Modify | P1-1: reorder restore swap and harden boot recovery against the crash window. |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modify | P1-2: buffer bytes across reads; decode UTF-8 only on complete-frame boundaries. |
| `lib/storage/incremental-index.ts` | Modify | P1-3: carry `spec_folder` through the moved-row rewrite. |
| Runtime docs cited by the review | Modify | P1-4: reconcile stale `SCHEMA_VERSION` and tool-count claims to deployed values. |
| P2-cited source/doc lines | Modify | 17 P2 advisories, each confined to the exact cited line(s). |
| `checkpoints-restore-crash-window.vitest.ts` | Create/Extend | Prove P1-1: crash mid-swap recovers a live DB. |
| `front-proxy-utf8-frame.vitest.ts` | Create/Extend | Prove P1-2: split multi-byte frame decodes intact. |
| `reconcile-moves-spec-folder.vitest.ts` | Create/Extend | Prove P1-3: moved row keeps `spec_folder`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every cited finding is verified against the current deployed source before any edit. | Each fix references the actual line/behavior in the deployed file; no fix introduces new drift relative to source. |
| REQ-002 | Each fix that changes runtime behavior has a focused vitest that proves it, and the test is run. | P1-1, P1-2, P1-3 each gain or extend a vitest that fails on the old behavior and passes on the fix; the run output is recorded. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | P1-1: restore never leaves the live database absent across a crash. | The swap orders snapshot-into-place before retiring the live file, or recovery reconstructs a live DB from any partial on-disk state; the crash-window vitest proves a live DB survives a crash mid-swap. |
| REQ-004 | P1-2: split multi-byte UTF-8 sequences decode intact. | Bytes are buffered across reads and decoded only on complete-frame boundaries; the frame vitest feeds a multi-byte sequence split across two reads and asserts the decoded frame is byte-identical to the source. |
| REQ-005 | P1-3: `reconcileMoves` preserves `spec_folder`. | The moved-row rewrite carries `spec_folder` forward; the reconcile vitest asserts a moved row keeps its original `spec_folder`. |
| REQ-006 | P1-4: documented `SCHEMA_VERSION` and tool counts match the deployed runtime. | The cited runtime docs state the deployed `SCHEMA_VERSION` and the deployed tool count; no stale value remains in the cited locations. |

### P2 - Advisory (resolve OR document deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The 17 P2 advisories are resolved or explicitly deferred with reason. | Each P2 finding is either fixed at its cited line or recorded as deferred with a one-line rationale in implementation-summary.md. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 4 P1 findings are fixed with minimal diffs verified against deployed source, and the 3 runtime-behavior fixes (P1-1, P1-2, P1-3) each pass a focused vitest.
- **SC-002**: P1-4 leaves no stale `SCHEMA_VERSION` or tool-count claim in the cited runtime docs.
- **SC-003**: The 17 P2 advisories are each resolved or explicitly deferred with a documented reason.
- **SC-004**: No file outside a cited finding is modified, and `validate.sh --strict` on this packet passes (Errors: 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cross-review accuracy vs current source | A finding may not match the deployed line, risking a wrong fix | Verify each cited finding against the actual file before editing; report UNKNOWN if the source does not match. |
| Risk | Reordering the restore swap regresses the existing journal recovery | High | Keep the two-phase journal semantics; add the crash-window vitest before and after to prove recovery still rolls forward/back correctly. |
| Risk | Byte-buffering the front-proxy changes frame timing | Med | Decode only on complete-frame boundaries; assert byte-identical output with a split-sequence vitest. |
| Risk | Touching adjacent code while fixing a cited line (scope creep) | Med | Minimal diff per finding; SCOPE LOCK on non-cited files; no opportunistic cleanup. |
| Risk | A P2 fix changes runtime behavior without a test | Med | Any P2 that alters behavior is treated like a P1 and gains a focused vitest. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Byte-buffering in the front-proxy must not add per-frame allocation beyond a single accumulating buffer drained on frame completion.

### Security
- **NFR-S01**: No fix may widen an input-trust boundary; the front-proxy buffering must bound the accumulator so a never-completing frame cannot exhaust memory.

### Reliability
- **NFR-R01**: After P1-1, a crash at any point in the restore swap must leave the daemon able to boot to a single consistent live database with no manual `cp`.

---

## 8. EDGE CASES

### Data Boundaries
- Restore crash exactly between `.bak` rename and snapshot rename: recovery must still produce a live DB.
- A UTF-8 frame whose final multi-byte sequence is split across the last two reads: decode must wait for completion.
- A moved-file row whose `spec_folder` is NULL: rewrite must preserve NULL, not coerce it.

### Error Scenarios
- Front-proxy receives a truncated frame that never completes: bounded accumulator, clean error, no unbounded growth.
- `reconcileMoves` encounters a row with no matching destination: existing behavior unchanged; only `spec_folder` carry-through is added.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 3 runtime + docs + 3 test files, LOC: targeted, Systems: storage, front-proxy, reconcile |
| Risk | 20/25 | Auth: N, API: N, Breaking: N (surgical), live-DB restore ordering and frame-decode correctness risk |
| Research | 10/20 | Findings pre-identified by cross-review; each must be verified against deployed source |
| Multi-Agent | 5/15 | Single executor per fix, orchestrator-verified |
| Coordination | 9/15 | P1s independent; each gated by its own vitest plus typecheck |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Restore-swap reorder regresses journal recovery | H | M | Preserve journal phases; crash-window vitest proves recovery both directions. |
| R-002 | Front-proxy buffering mishandles frame boundaries | H | L | Decode only on complete frames; split-sequence vitest asserts byte-identity. |
| R-003 | `spec_folder` carry-through coerces NULL or wrong value | M | L | Preserve the source value verbatim; reconcile vitest covers NULL and set cases. |
| R-004 | Scope creep into non-cited 013 code | M | M | SCOPE LOCK; minimal diff per finding; no cross-workstream edits. |

---

## 11. USER STORIES

### US-001: Crash-safe restore (Priority: P1)

**As an** operator restoring a checkpoint, **I want** a crash mid-swap to never leave me with no live database, **so that** recovery is automatic and I never fall back to a manual file copy.

**Acceptance Criteria**:
1. Given a restore that crashes between the `.bak` rename and the snapshot rename, When the daemon boots, Then recovery reconstructs a single consistent live database.

### US-002: Intact multi-byte frames (Priority: P1)

**As a** client of the MCP front-proxy, **I want** multi-byte UTF-8 payloads to arrive uncorrupted even when the OS splits them across reads, **so that** non-ASCII content round-trips correctly.

**Acceptance Criteria**:
1. Given a frame whose multi-byte sequence is split across two socket reads, When the proxy decodes it, Then the decoded frame is byte-identical to the source.

---

## 12. OPEN QUESTIONS

- For P1-1, is forward-recovery (keep the new snapshot if it is fully in place) preferred over always rolling back to `.bak`, or should the policy match the existing two-phase journal exactly?
- For the 17 P2 advisories, which (if any) should be deferred rather than fixed in this packet, and on what schedule?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
