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
    recent_action: "Authored Level-2 tasks; Q5-C1 + Q7-lease both PENDING"
    next_safe_action: "Begin Phase 1 setup tasks (T001-T005)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 0
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

**Candidate status (per 030 §14 — Wave-0 shipped record):** Q5-C1 and Q7-lease are BOTH **PENDING** — neither appears in `030 §14` (the only code-graph candidate shipped is Q4-C1, `e21caf5de6`). Q5-C1 gate: tier-2 BUILD (SymbolKind + render-tolerance, shared-infra-dep on the render path). Q7-lease gate: shared-infra-dep on a metrics sink (none today). No tasks are pre-checked.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the live `language === 'doc'` early-return line range (currently `:1237-1249`) (`.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`)
- [ ] T002 Confirm the `SymbolKind` union line and `generateSymbolId` kind-agnosticism (`indexer-types.ts:13-16`, `:100`)
- [ ] T003 [P] Inventory `SymbolKind` consumers + `code-graph-context` render path for closed-vocab assumptions — the `q5-f4` render-tolerance confirm (`rg -n ': SymbolKind\|SymbolKind\b' mcp_server/lib`; `code-graph-context.ts`)
- [ ] T004 [P] Confirm the default-glob `**/*.md` omission and decide json/yaml/toml-first vs markdown opt-in (REQ-006) (`indexer-types.ts:156-177`)
- [ ] T005 [P] Confirm zero existing doc-symbol / lease-metric tokens — PENDING baseline (`rg -n 'extractMarkdownHeadings\|extractConfigKeys\|emitLeaseMetric'`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Track A: extend `SymbolKind` union with `'heading' \| 'key'` (REQ-003) (`indexer-types.ts:13-16`)
- [ ] T007 Track A: add non-code render tolerance for `heading`/`key` kinds (REQ-004) (`code-graph-context.ts`)
- [ ] T008 Track A: build `extractMarkdownHeadings(content)` — ATX `^#{1,6} ` + Setext, fenced-code-aware, parent-`CONTAINS`-child nesting by level, content-derived ids (REQ-001) (`lib/doc-symbol-extractor.ts` new)
- [ ] T009 Track A: build `extractConfigKeys(content, language)` — json/yaml/toml top-level + nested shallow key walk → `key` nodes, content-derived ids (REQ-002) (`lib/doc-symbol-extractor.ts` new)
- [ ] T010 Track A: replace the empty `if (language === 'doc')` early-return with the extractor output, preserving `contentHash`/`parseHealth:'clean'`/`detectorProvenance` (REQ-001/002/005) (`structural-indexer.ts:1237-1249`)
- [ ] T011 Track A: record the markdown glob decision (json/yaml/toml-first; `**/*.md` opt-in) (REQ-006) (`indexer-types.ts:156-177` + spec)
- [ ] T012 [P] Track B: classify lease-lifecycle transitions (held-by-other / bridged-secondary / stale-reclaimed / respawned) at the existing lease decision sites (REQ-007) (`.opencode/bin/mk-code-index-launcher.cjs` ~`:136`, `:290-334`)
- [ ] T013 [P] Track B: add the sink-agnostic `emitLeaseMetric(class, …)` stub, no-op default, no behavior change without a sink (REQ-008) (`mk-code-index-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Unit: heading nesting by level, ATX/Setext, fenced-code headings skipped; config keys top-level + nested; malformed config → 0 nodes; id stability across two rescans (REQ-001/002) (`lib/*.vitest.ts`)
- [ ] T015 Behavior: a `code_graph_context` query returning a doc node renders without error (non-code kind tolerated); code-lane node/edge sets byte-identical to baseline (REQ-004/005)
- [ ] T016 Track B: lease classifier returns the correct class per transition; `emitLeaseMetric()` no-ops with no sink and changes no lease decision (REQ-007/008)
- [ ] T017 `node --check` / `tsc` clean; vitest green; docs reconciled (spec/plan/tasks)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (`code_graph_scan` over markdown + config; query a heading/key node; observe lease classes)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
