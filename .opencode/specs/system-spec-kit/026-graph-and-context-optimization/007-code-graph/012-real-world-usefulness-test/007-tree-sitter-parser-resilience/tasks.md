---
title: "Tasks: Tree-sitter parser resilience"
description: "Phase 1 investigation, Phase 2 skip-list MVP, Phase 3 verification. Tasks numbered T001-T020."
trigger_phrases:
  - "parser resilience tasks"
  - "skip-list tasks"
  - "tree-sitter investigation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/012-real-world-usefulness-test/007-tree-sitter-parser-resilience"
    last_updated_at: "2026-05-06T13:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks after spec + plan landed"
    next_safe_action: "Author checklist + description.json"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-parser-resilience-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Tree-sitter parser resilience

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

*Investigation track: root-cause discrimination across three hypotheses (native version, WASM grammar, content-specific syntax).*

- [ ] T001 Capture broad-scope crash cohort: re-run `code_graph_scan` with `agents+commands+specs+plugins=all`, capture the exact list of crashing file paths (mcp_server/database/code-graph.sqlite parse_diagnostics)
- [ ] T002 [P] Build minimum failing fixtures: extract 5-10 smallest standalone `.ts` files that reproduce `memory access out of bounds`
- [ ] T003 Test hypothesis A (version): pin tree-sitter native binding to N-1 and N-2 versions; record which versions crash on the same fixtures
- [ ] T004 [P] Test hypothesis B (WASM): re-run failing fixtures through web-tree-sitter WASM grammar (if path exists in current build); record outcome
- [ ] T005 [P] Test hypothesis C (content): grep failing fixtures for shared patterns (decorator stacks, generics depth ≥4, template-literal nesting, mapped/conditional types, large unions); produce a syntax-cohort table
- [ ] T006 Synthesize findings into `decision-record.md`: which hypothesis is supported by the strongest evidence, what the discriminating signal is
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Skip-list MVP: persistent skip-list with structured telemetry, schema v5 bump, and an env-flagged kill switch.*

- [ ] T007 Schema v5: add `parser_skip_list` table to `mcp_server/code_graph/lib/code-graph-db.ts` (columns: file_path PK, error_class, last_seen_at, attempt_count, last_success_at)
- [ ] T008 Migration: v4 → v5 round-trip with backfill from existing parse_diagnostics rows
- [ ] T009 Skip-list module: `mcp_server/code_graph/lib/parser-skip-list.ts` exporting `addToSkipList`, `lookupSkipList`, `recordSuccess`, `evictStale`
- [ ] T010 Parser wrapper: in `mcp_server/code_graph/lib/parser.ts` (or equivalent), wrap tree-sitter call; on crash → upsert skip-list + emit ParseFailure
- [ ] T011 Self-heal policy: after N consecutive scan-time successes, remove file from skip-list
- [ ] T012 [P] Status surface: add `parserSkipList: { count, last_seen_at, sample }` to `mcp_server/code_graph/handlers/status.ts` response
- [ ] T013 [P] Scan surface: add `parserSkipList.added` and `parserSkipList.healed` deltas to `mcp_server/code_graph/handlers/scan.ts` response
- [ ] T014 Env flag: `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default true); when false, parser wrapper rethrows (legacy behavior)
- [ ] T015 [P] Vitest: `mcp_server/code_graph/tests/parser-skip-list.vitest.ts` covering add, lookup, eviction, self-heal, migration, concurrent scans, corrupted-state fail-open (≥10 cases)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Build: `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` (exit 0)
- [ ] T017 Live driver: `node /tmp/cg-driver.mjs scan '{"incremental":false,"includeSkills":true,"includeAgents":"all","includeCommands":"all","includeSpecs":"all","includePlugins":"all"}'` returns `status: ok` with `<2%` parser-error rate
- [ ] T018 [P] Skills-only regression check: `node /tmp/cg-driver.mjs scan '{"incremental":false,"includeSkills":true}'` returns zero parser errors
- [ ] T019 [P] Status check: `node /tmp/cg-driver.mjs status '{}'` shows new `parserSkipList` field with sane shape
- [ ] T020 Manual playbook 02 scenario: add and pass a "broad-scope scan with skip-list verification" scenario in `manual_testing_playbook/02--manual-scan-verify-status/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T001-T020)
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items 100% verified with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
- [ ] `decision-record.md` records the landed hypothesis
- [ ] `implementation-summary.md` filled (post-implementation per Rule 13)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling packets**:
  - `001-execution`, `002-native-rerun`, `003-deep-research-issues` (this packet's source signal)
  - `004-remediation`, `005-scope-guard`, `006-cluster-a-to-e` (the remediation that closed F-002/F-003/F-008/F-011/F-018/F-019)
- **Live test artifacts**: `/tmp/cg-driver.mjs` (direct-handler driver script)
- **Source-of-truth schema**: `mcp_server/code_graph/lib/code-graph-db.ts`
<!-- /ANCHOR:cross-refs -->
