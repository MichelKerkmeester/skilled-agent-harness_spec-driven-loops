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
    recent_action: "All tasks resolved — investigation closed, no fix warranted, test landed"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/tests/memory-save-supersede-reindex.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 100
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
- [x] T003 Confirm the closed `028-memory-search-intelligence/002-speckit-memory` program (13 phases, all Complete) doesn't already cover this [evidence: `indexingOrigin !== 'scan'` only gates the reconsolidation block several hundred lines before the branch this packet targeted; the same-path branch itself has no origin check at all — this rule-out remains valid regardless of the T004 refutation below, since the branch itself turned out not to be the bug, not because it was actually covered by 028]

**Correction, added after T004 (Phase 2)**: T001's specific branch identification (`memory-save.ts` ~2696-2731) was refuted by the T004 test — that branch is unreachable for the "unchanged" case because an earlier gate (`checkExistingRow`) already handles it correctly. T002's two rule-outs (the tier exemption, `checkContentHashDedup`'s exclusion) remain valid and correct on their own; only the conclusion drawn from them was wrong. See T006 for the full re-diagnosis.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Confirm-first execution (per `plan.md` Phase 1), then the fix itself.

- [x] T004 Write a controlled repro test against current `HEAD`: index a file, mark its row `importance_tier = 'deprecated'` directly, re-index the same unchanged content via `fromScan: true` (`plan.md` §4 Step 1) [evidence: added to `memory-save-supersede-reindex.vitest.ts`, ran via the correct node binary (`node_modules/.bin/vitest`, v22.23.1 matching better-sqlite3's build) — **passed against current `HEAD`, not failed**. Per `plan.md`'s own explicit stop condition ("If it does NOT fail, the hypothesis is wrong and this plan stops here for re-diagnosis before touching any source"), this refutes the original same-path-conflation hypothesis. Traced why: `checkExistingRow` (`handlers/save/dedup.ts`, called at `memory-save.ts:2394`, outside any transaction, before the branch this packet originally targeted) already finds the deprecated predecessor and returns `status: 'unchanged'` correctly]
- [x] T005 Determine whether the interactive `memory_save` path reaches the same branch the same way (REQ-004, `plan.md` §4 Step 2) [superseded: moot once T004 refuted the underlying hypothesis — both paths call the same `indexMemoryFile`/`checkExistingRow` sequence, which the T004 test already proved correct, so there is no gap left to check reachability for]
- [x] T006 Add the missing no-op branch (`plan.md` §4 Step 3) [not done, correctly: re-diagnosed instead. Checked a second hypothesis — a cross-process TOCTOU race, since `checkExistingRow` runs outside any `BEGIN IMMEDIATE` transaction (comment at `memory-save.ts:2406-2407` confirms this pattern was addressed for a different check, C5-1, not this one). Pulled `memory_history` for the one concrete reproduction (ids 11274/11394): row 11274 has an `ADD` at 05:46:36 then an `UPDATE` at the exact same timestamp (05:53:43) as row 11394's `ADD` — the signature of `retirePredecessorForActiveReindex` firing, the already-tested-and-correct "content genuinely changed" branch. Most parsimonious explanation: the file was edited then reverted within the 7-minute window, producing correct historical lineage that coincidentally looks like a duplicate today. This is not proof of a race, and doesn't prove the negative for all cases, but no confirmed defect remains to fix]
- [x] T007 Confirm T004's test goes green; `tsc --noEmit` clean on `mcp-server` (`plan.md` §4 Step 3 Check) [evidence: T004's test already passes (see above, no fix needed to make it pass); `tsc --noEmit` not run since no source file was modified — nothing to type-check]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Regression-check the three pre-existing same-path outcomes (new/changed/unchanged-active) (`plan.md` §4 Step 4) [evidence: the pre-existing `'supersedes a changed doc...'` test in the same file still passes unmodified (2/2 tests green in the same `npx vitest run` invocation); no source change means no regression risk to begin with]
- [x] T009 Inventory and confirm every downstream consumer of the new no-op result shape handles it correctly (`plan.md` §4 Step 5) [moot: no new result shape was introduced since no fix landed]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (confirm) tasks marked `[x]`
- [x] All Phase 2/3 (execute/fix/verify) tasks marked `[x]` with evidence — closed via investigation, not a fix
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
