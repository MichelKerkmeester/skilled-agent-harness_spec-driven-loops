---
title: "Implementation Summary: 101/003 Deep AI Council Graph Support"
description: "Implemented dedicated derived council graph support with SQLite storage, MCP handlers, strict schemas, bounded queries, convergence signals, references, and tests."
trigger_phrases:
  - "101/003 summary"
  - "deep-ai-council graph summary"
  - "council_graph_upsert"
  - "council graph implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/003-deep-ai-council-graph-support"
    last_updated_at: "2026-05-11T05:20:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Fixed deep-review findings for council graph support"
    next_safe_action: "Run final verification and report outcome"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts
      - .opencode/skills/deep-ai-council/references/graph_support.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-003-graph-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not reuse deep-loop graph as-is for council support."
      - "Dedicated derived council graph selected over deep-loop reuse and deferral."
      - "Council graph rows are derived and replayable from ai-council artifacts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 101/003 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support` |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 003 now implements a dedicated council graph as a derived SQLite projection. The implementation deliberately keeps `ai-council-state.jsonl` and packet-local `ai-council/**` artifacts as source-of-truth and does not overload `deep_loop_graph_*` research/review semantics.

### Dedicated Graph Surface

The MCP server now exposes bounded council graph tools for upsert, query, status, and convergence assessment. The tool family is separate from deep-loop graph tools and uses council-specific node kinds, relations, query modes, and convergence signals.

### Storage And Query Layer

The graph layer stores derived council sessions, rounds, seats, claims, evidence, disagreements, decisions, recommendations, and convergence snapshots in `council-graph.sqlite`. Query helpers return bounded unresolved disagreements, evidence chains, decision support, blocker summaries, and hot nodes without dumping full packet artifacts. Prompt-safe metadata output is allowlisted and size-bounded.

### Council Guidance

The `deep-ai-council` skill guidance now documents when to use the derived graph, how to preserve artifact authority, and how rollback works by deleting/rebuilding graph rows rather than rewriting council history.

### Deep Review Remediation

The follow-up deep review reported three P1 findings and one P2 advisory. The implementation now returns explicit no-op success for empty upserts, adds real `CONTINUE` convergence test coverage, redacts arbitrary query metadata, and exposes a bounded namespace-scoped recovery payload through `council_graph_status`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` | Added | SQLite schema, idempotent upsert, derived graph storage, validation, and status support |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` | Added | Bounded query helpers and convergence support |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/` | Added/Updated | MCP handlers for `council_graph_upsert`, `council_graph_query`, `council_graph_status`, and `council_graph_convergence`; empty upsert and recovery payloads fixed after review |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Updated | Tool descriptors for dedicated council graph operations |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Updated | Strict input schemas for council graph calls |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Updated | Dispatch registration for council graph handlers |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` | Added/Updated | Storage, query, status, convergence, empty upsert, continue branch, and hostile metadata coverage |
| `.opencode/skills/deep-ai-council/SKILL.md` | Updated | Skill-level derived graph routing guidance |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | Added/Updated | Derived graph workflow, prompt-safe metadata, and bounded rollback guidance |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/05--scope-boundaries/001-graph-support-explicitly-out-of-scope.md` | Updated | Boundary scenario now distinguishes derived graph support from artifact authority |
| `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `checklist.md`, `graph-metadata.json`, `description.json` | Updated | Phase 003 documentation, decisions, metadata, and verification tracking |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the Phase 003 ADR: build a dedicated derived projection rather than adapting the research/review deep-loop graph. The storage layer owns validation and persistence, handlers own prompt-safe MCP response boundaries, and tests cover the first council graph slice without changing deep-loop graph semantics.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Implement `council_graph_*` tools | Keeps council semantics explicit and avoids hidden coupling to `deep_loop_graph_*` |
| Store rows in `council-graph.sqlite` | Allows independent recovery and rollback for derived council graph state |
| Treat graph data as replayable | Preserves `ai-council/**` artifacts as the durable source-of-truth |
| Bound query output | Prevents prompt bloat and accidental artifact dumps |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Council graph unit tests | PASS - `npx vitest run tests/council-graph.vitest.ts` passed 3 tests |
| Deep review remediation unit tests | PASS - `npx vitest run tests/council-graph.vitest.ts` passed 6 tests after P1/P2 fixes |
| Post-remediation MCP regression slice | PASS - `npx vitest run tests/council-graph.vitest.ts tests/context-server.vitest.ts tests/layer-definitions.vitest.ts` passed 486 tests |
| MCP regression slice | PASS - `npx vitest run tests/council-graph.vitest.ts tests/context-server.vitest.ts tests/layer-definitions.vitest.ts` passed 483 tests |
| TypeScript typecheck | PASS - `npm run typecheck --prefix ".opencode/skills/system-spec-kit"` passed |
| Deep AI Council skill validation | PASS - `python3 ".opencode/skills/sk-doc/scripts/quick_validate.py" ".opencode/skills/deep-ai-council"` passed |
| System Spec Kit alignment verifier | PASS WITH WARNINGS - `python3 ".opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py" --root ".opencode/skills/system-spec-kit/mcp_server"` passed with 6 non-blocking TS header warnings |
| Deep AI Council alignment verifier | PASS - `python3 ".opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py" --root ".opencode/skills/deep-ai-council"` passed |
| Strict spec validation | PASS - `bash ".opencode/skills/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support" --strict` passed with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Derived projection only** The graph does not replace packet-local council artifacts and must be rebuilt from them when authority matters.
2. **No visualization** The implementation adds MCP/query support only; graph UI or diagrams remain out of scope.
3. **Reducer ownership remains caller-driven** The first slice exposes upsert/query/status/convergence surfaces, while broader automatic replay from every council artifact can be added later if needed.
<!-- /ANCHOR:limitations -->
