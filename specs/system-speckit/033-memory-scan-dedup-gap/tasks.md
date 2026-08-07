---
title: "Tasks: Memory-Index Scan-Path Same-Path Dedup Gap"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory scan dedup gap tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-memory-scan-dedup-gap"
    last_updated_at: "2026-08-07T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Tasks scoped from plan.md's 5 steps"
    next_safe_action: "Execute T001-T005 in order"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Memory-Index Scan-Path Same-Path Dedup Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Confirm the root cause and scope the fix — this phase's own work, done.

- [x] T001 Root-cause the duplicate-row symptom to an exact file:line via direct code read, not inference [evidence: `memory-save.ts` ~2696-2731 — the `samePathSupersededPredecessorId != null ? createAppendOnlyMemoryRecord(...) : createMemoryRecord(...)` ternary conflates "no existing row" with "existing row, content unchanged"]
- [x] T002 Rule out the two more obvious hypotheses before settling on the real one [evidence: (a) `idx_memory_logical_key_active_unique`'s tier exemption is intentional/correct — confirmed via schema read and cross-reference against the closed 028 program's own problem statement, which relies on this exemption for retire/succeed lineage; (b) `checkContentHashDedup`'s same-path exclusion is intentional/correct — confirmed via its own code comment and the fact it explicitly excludes `file_path`/`canonical_file_path` matches by design, deferring same-path handling downstream]
- [x] T003 Confirm the closed `028-memory-search-intelligence/002-speckit-memory` program (13 phases, all Complete) doesn't already cover this [evidence: `indexingOrigin !== 'scan'` only gates the reconsolidation block several hundred lines before the branch this packet targets; the same-path branch itself has no origin check at all, so both scan and interactive `memory_save` reach it identically — a distinct gap from what that program's Files to Change list touches]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Confirm-first execution (per `plan.md` Phase 1), then the fix itself.

- [ ] T004 Write a controlled repro test against current `HEAD`: index a file, mark its row `importance_tier = 'deprecated'` directly, re-index the same unchanged content via `fromScan: true` (`plan.md` §4 Step 1) — must fail (red) before any fix lands
- [ ] T005 Determine whether the interactive `memory_save` path reaches the same branch the same way (REQ-004, `plan.md` §4 Step 2)
- [ ] T006 Add the missing no-op branch: existing row found, content unchanged → return existing as a no-op, matching `checkContentHashDedup`'s `{status: 'duplicate', ...}` shape (`plan.md` §4 Step 3)
- [ ] T007 Confirm T004's test goes green; `tsc --noEmit` clean on `mcp-server` (`plan.md` §4 Step 3 Check)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Regression-check the three pre-existing same-path outcomes (new/changed/unchanged-active) — run existing suites, read the assertions, not just the pass/fail (`plan.md` §4 Step 4)
- [ ] T009 Inventory and confirm every downstream consumer of the new no-op result shape handles it correctly (`plan.md` §4 Step 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (confirm) tasks marked `[x]`
- [ ] All Phase 2/3 (execute/fix/verify) tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior art (closed program, not reopened)**: `specs/system-speckit/028-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes/` — fixed the interactive save path's reconsolidation/PE-gate lanes; this packet's finding is a distinct branch that program's fixes don't reach.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
