---
title: "Tasks: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code graph doc symbol lane tasks"
  - "q5-c1 doc symbol extractor tasks"
  - "lease classification telemetry tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented and verified Q5-C1 + Q7-lease tasks"
    next_safe_action: "Run strict validation and hand off"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

**Candidate status:** Q5-C1 and Q7-lease are **DONE in this phase**. Q5-C1 shipped the `heading`/`key` doc-symbol lane, and Q7-lease shipped launcher-side classification plus a no-op-default emit sink. The metrics-dashboard wiring remains out of scope because no launcher metrics sink exists today.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the live `language === 'doc'` early-return line range (currently `:1237-1249`) (`.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`) — confirmed and replaced in the doc branch only
- [x] T002 Confirm the `SymbolKind` union line and `generateSymbolId` kind-agnosticism (`indexer-types.ts:13-16`, `:100`) — union extended; existing ID helper used by new kinds
- [x] T003 [P] Inventory `SymbolKind` consumers + `code-graph-context` render path for closed-vocab assumptions — render path now has explicit `heading`/`key` coverage
- [x] T004 [P] Confirm the default-glob `**/*.md` omission and decide json/yaml/toml-first vs markdown opt-in — markdown remains opt-in; config docs exercise the lane by default
- [x] T005 [P] Confirm zero existing doc-symbol / lease-metric tokens — baseline had no extractor/emit tokens before this phase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Track A: extend `SymbolKind` union with `'heading' \| 'key'` (REQ-003) (`indexer-types.ts:13-16`)
- [x] T007 Track A: add non-code render tolerance for `heading`/`key` kinds (REQ-004) (`code-graph-context.ts`)
- [x] T008 Track A: build `extractMarkdownHeadings(content)` — ATX `^#{1,6} ` + Setext, fenced-code-aware, parent-`CONTAINS`-child nesting by level, content-derived ids (REQ-001) (`lib/doc-symbol-extractor.ts`)
- [x] T009 Track A: build `extractConfigKeys(content, language)` — json/yaml/toml top-level + nested shallow key walk → `key` nodes, content-derived ids (REQ-002) (`lib/doc-symbol-extractor.ts`)
- [x] T010 Track A: replace the empty `if (language === 'doc')` early-return with the extractor output, preserving `contentHash`/`parseHealth:'clean'`/`detectorProvenance` (REQ-001/002/005) (`structural-indexer.ts:1237-1249`)
- [x] T011 Track A: record the markdown glob decision (json/yaml/toml-first; `**/*.md` opt-in) (REQ-006) (`indexer-types.ts:156-177` + spec)
- [x] T012 [P] Track B: classify lease-lifecycle transitions (held-by-other / bridged-secondary / stale-reclaimed / respawned) at the existing lease decision sites (REQ-007) (`.opencode/bin/mk-code-index-launcher.cjs`)
- [x] T013 [P] Track B: add the sink-agnostic `emitLeaseMetric(class, …)` stub, no-op default, no behavior change without a sink (REQ-008) (`mk-code-index-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Unit: heading nesting by level, ATX/Setext, fenced-code headings skipped; config keys top-level + nested; malformed config → 0 nodes; id stability across two rescans (REQ-001/002) (`doc-symbol-extractor.vitest.ts`)
- [x] T015 Behavior: a `code_graph_context` query returning a doc node renders without error (non-code kind tolerated); code-lane parser path remains separate from the doc branch (REQ-004/005)
- [x] T016 Track B: lease classifier returns the correct class per transition; `emitLeaseMetric()` no-ops with no sink and changes no lease decision (REQ-007/008)
- [x] T017 `node --check` / `tsc` clean; vitest green; docs reconciled (spec/plan/tasks)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated verification passed for doc scan behavior, context rendering, and lease classes; no live daemon manual scan was required for this bounded phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
