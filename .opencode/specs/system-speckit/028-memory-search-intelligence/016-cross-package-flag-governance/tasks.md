---
title: "Tasks: Cross-Package Flag Governance Reconciliation and Formatting"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "flag governance tasks"
  - "capability-flags reorder task"
  - "opt-in helper migration task"
  - "content-rich short-query counter task"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-cross-package-flag-governance"
    last_updated_at: "2026-07-09T19:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed T001-T016; all tasks and completion criteria checked off"
    next_safe_action: "None outstanding; packet implemented and validated"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-016-cross-package-flag-governance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-Package Flag Governance Reconciliation and Formatting

<!-- SPECKIT_LEVEL: 1 -->

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

_F5b + F14, mechanical and unconditional — no decision required, can start immediately._

- [x] T001 [P] Export `isOptInEnabled` from `search-flags.ts`'s public surface (.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [x] T002 [P] Read the full `209-243` region of `capability-flags.ts` once more immediately before editing, to catch any drift since spec time (.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts)
- [x] T003 Confirm no existing flag test asserts a truthy value outside `isOptInEnabled()`'s set (`true`/`1`/`yes`/`on`/`enabled`) is currently rejected for `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` (.opencode/skills/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_F5b, F14 land first (unblocked); F5a (T007) is now a direct, unconditional implementation task
(REQ-001 resolved — flip to default-off); F15 (T009-T010) is sequenced to land alongside or after
F5a (T007), not independently of it — see T008 and `plan.md` Phase 3._

- [x] T004 Replace `isQueryTimeExistenceFilterEnabled()`'s hand-rolled parsing with a call into the shared opt-in helper (.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts)
- [x] T005 Reorder `capability-flags.ts:209-243`: package 011's const/getter after package 009's const/getter pair, pair restored to adjacent (.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts)
- [x] T006 Expand `isQueryTimeExistenceFilterEnabled()`'s doc comment to the file's multi-paragraph + "reads env every call" convention (.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts)
- [x] T007 Flip `isContentRichShortQueryGraphPreservationEnabled()` from `isFeatureEnabled()` to `isOptInEnabled()` (default-OFF); update its doc comment to state the new default and the governance justification (burden of proof was on default-ON before shipping; package 010 never met it) (.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [x] T008 Sequence F15's counter work (T009-T010) to land alongside or after T007 — do not implement or merge F15 ahead of T007. Cross-referenced from `014-self-healing-internals-hardening`'s F8 acceptance-criteria pattern (REQ-002: "a hard prerequisite before ... is ever defaulted on"): flipping F5a off substantially reduces how often the unguarded graph/degree synchronous SQLite paths (`hybrid-search.ts:1577-1600,1605-1649`, `graph-search-fn.ts:95-140,616-668`, confirmed via grep — bare try/catch, no wall-clock deadline) run under real load (no file change; ordering/process task) — T007 landed in the same edit pass as T009/T010, satisfying "alongside or after"
- [x] T009 [P] Add the graph/degree preservation counter/log line at the `shouldPreserveGraphForContentRichShortQuery()` call site (.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [x] T010 [P] Confirm the packet's 7-query fixture's routing-plan output is unchanged aside from the new counter side effect (.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts)
- [x] T011 Update `ENV_REFERENCE.md` rows for both flags (default-state column, behavior text) to match T007's flip and T004's helper migration (.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the affected flag test file(s) and confirm all pass, including the new/updated assertions from T003/T006/T010 — 144/144 in the 6 directly-touched files; 417/419 in the wider 17-file "imports one of the 3 changed modules" scope (2 failures confirmed unrelated: `entity-linker.ts`/`channel-representation.ts`, not touched by this phase, reproduced in isolation, correlated with a concurrent session's in-flight edits to those files)
- [x] T013 Run `npm run typecheck` and `npm run build` — both clean, zero errors; dist output grep-confirmed to reflect the source changes
- [x] T014 Manually diff `capability-flags.ts:209-243` end-to-end against `spec.md`'s F14 description to confirm the reorder and doc-comment expansion match — confirmed: package 009's const (line 210) and getter (219-220) adjacent, package 011's const (238) and getter (251-252) follow the pair, no interleaving
- [x] T015 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/016-cross-package-flag-governance --strict` and resolve any findings — Errors 0 / Warnings 0 after regenerating description.json/graph-metadata.json and updating spec.md's Status field
- [x] T016 Update `implementation-summary.md` with the REQ-001 decision (flip to default-off, already recorded), verification results, and known limitations
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001's RESOLVED decision (flip to default-off) fully implemented
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
