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
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/009-cross-package-flag-governance"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
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

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

> Includes the cross-cutting flag/read-policy contract items surfaced by the audit (this child owns cross-package flag governance).

- [x] T017 [P1] The ENV-reference drift guard recognizes only literal `env.SPECKIT_*` reads — flags passed as strings to `isFeatureEnabled()`/`isOptInEnabled()` or held in constants are invisible, prose tokens count as documentation, and documented-but-removed flags pass (`mcp_server/tests/env-reference-drift.vitest.ts:53`). Extract tokens from helper call sites and constants, parse structured ENV rows, assert bidirectional parity including default polarity. DONE 2026-07-10 — drift guard now collects helper-call string literals + flag constants across shipped MCP source, parses structured ENV rows, asserts bidirectional parity incl. default polarity; 12 previously-invisible registrations covered; 2 documented-but-nonexistent rows removed (grep-confirmed dead). Sonnet-max verified. Known scope note: reverse parity covers the Feature Flags Reference Table section only.
- [x] T018 [P1] `db-state.ts` re-parses `SPECKIT_GRAPH_UNIFIED` raw (`!== 'false'`), diverging from the canonical parser on `0`/case/padding during rebind (`mcp_server/core/db-state.ts:234` vs `lib/search/graph-flags.ts:18`). Call `isGraphUnifiedEnabled()` or receive the resolved state. DONE 2026-07-10 — both raw SPECKIT_GRAPH_UNIFIED reads in db-state rebind replaced with canonical isGraphUnifiedEnabled(); rebind test covers 0/padded-FALSE/off/unset (flag-graph-unified-rebind.vitest.ts). Sonnet-max verified ACCEPT.
- [x] T019 [P2] The flag-ceiling guard inventories only `search-flags.ts`, missing `capability-flags.ts` and `graph-flags.ts` — the exact alternate homes involved in F5 (`mcp_server/tests/flag-ceiling.vitest.ts:217`). Inventory all registration modules or derive from one canonical flag manifest. DONE 2026-07-10 — ceiling guard inventories all three flag modules with disjoint ceiling/acknowledgement sets; duplicate content-rich entry removed from ACKNOWLEDGED_UNCEILINGED_FLAGS. Sonnet-max verified ACCEPT.
- [x] T020 [P2] The shared-parser migration expanded the accepted truthy set for the query-time existence flag (`yes`/`on`/`enabled` now activate it) while claiming behavior preservation (`lib/search/search-flags.ts:33`, `lib/config/capability-flags.ts:252`). Preserve the strict set via a shared strict helper or amend the spec/migration notes; add a parser matrix test (unset/whitespace/case/true/1/yes/on/enabled/false/0/invalid). DONE 2026-07-10 — DECISION: strict {true,1} vocabulary preserved for the hot-path query-time existence flag via isStrictOptInEnabled (accidental broad-truthy expansion reverted); parser matrix tests for both vocabulary classes. Sonnet-max verified ACCEPT.
- [x] T021 [P2] `ENV_REFERENCE.md:275` documents the relevance-gap flag as default `true` yet instructs "Set `true` to enable" with default-OFF prose; code is default-ON with explicit opt-out (`search-flags.ts:1051-1059`). Rewrite the row. DONE 2026-07-10 — relevance-gap ENV row rewritten: default-ON with explicit opt-out, prose self-consistent; regression pinned in env-reference-drift suite. Sonnet-max verified ACCEPT.
- [x] T022 [P2] `spec.md:139` of this packet describes the retired default-ON preservation state as current, contradicting its own F5 resolution (`:77-79`). Rewrite in past tense as the pre-fix baseline. DONE 2026-07-10 — 016 spec stale default-ON sentence — resolved by the same doc-reconciliation wave as the flag work; current spec text matches the shipped default-OFF/opt-in reality per the governance contract. Covered by the accepted lane + orchestrator reconciliation.
- [x] T023 [P1] Archived/deprecated read policy has drifted in three places: `resolveIncludeCold()` short-circuits before the `deprecated`/`archived` exclusions (`mcp_server/lib/search/active-row-predicate.ts:83`), while `tool-schemas.ts:342/:345` still claims archived rows are always excluded and the handler honors `includeArchived` (`handlers/memory-search.ts:1113`). Pick one canonical policy; fix code or schema+tier docs; add default-policy tests with the cold-tier flag unset/true/false. DONE 2026-07-10 — canonical fail-closed policy: archived/deprecated excluded by default; includeArchived:true the explicit override; explicit includeCold:true preserved as the graduated vector-lane admit path (first attempt REJECTED for discarding it — redo restored, verifier enumerated the full truth table + proved SQL/JS parity; option-less callers stay fail-closed; end-to-end SPECKIT_INCLUDE_ARCHIVED_VECTOR test added). Sonnet-max verified ACCEPT after redo.
- [x] T024 [P1] `trackAccess` schema/doc contract is inverted: advertised default `false`/"off by default" vs deliberate handler default `true` (`mcp_server/tool-schemas.ts:337` vs `handlers/memory-search.ts:1095`). Update schema and stale interface comments to default-ON; add an omitted-parameter test proving tracking occurs and explicit `false` disables it. DONE 2026-07-10 — trackAccess schema + interface comments now advertise default-ON truthfully (tool-schemas.ts:337-341; handler default untouched); omitted-param + explicit-false handler tests (flag-track-access-default.vitest.ts). Sonnet-max verified ACCEPT.
- [x] T025 [P2] Stale engine-flag docs: `ENV_REFERENCE.md:262` describes the retired legacy-BM25 auto-fallback (code routes to `packed-inmemory`, `lib/search/bm25-index.ts:393-411`), and `lib/telemetry/README.md:91` advertises the removed `SPECKIT_NOVELTY_BOOST`. Correct both. DONE 2026-07-10 — ENV BM25 row documents packed-inmemory auto fallback; retired SPECKIT_NOVELTY_BOOST row removed from telemetry README; regressions pinned in the drift suite. Sonnet-max verified ACCEPT.
