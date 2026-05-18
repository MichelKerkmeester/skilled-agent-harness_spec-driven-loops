---
title: "Tasks: Tree-sitter parser resilience"
description: "Phase 1 investigation, Phase 2 skip-list MVP, Phase 3 verification. Tasks numbered T001-T022."
trigger_phrases:
  - "parser resilience tasks"
  - "skip-list tasks"
  - "tree-sitter investigation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test/007-tree-sitter-parser-resilience"
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
    completion_pct: 95
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

- [x] T001 Capture broad-scope crash cohort: re-run `code_graph_scan` with `agents+commands+specs+plugins=all`, capture the exact list of crashing file paths (Evidence: `research/iterations/iteration-001.md` enumerated 121 unique `parse_diagnostics` files)
- [x] T002 [P] Build minimum failing fixtures: extract 5-10 smallest standalone `.ts` files that reproduce `memory access out of bounds` (Evidence: `research/iterations/iteration-002.md` isolated a 20-line OOB config and size-matched controls)
- [x] T003 Test hypothesis A (version): pin tree-sitter native binding to N-1 and N-2 versions and record which versions crash on the same fixtures (Evidence: `research/iterations/iteration-001.md` ruled out native binding because the stack is WASM-only)
- [x] T004 [P] Test hypothesis B (WASM): re-run failing fixtures through web-tree-sitter WASM grammar and record outcome (Evidence: `research/iterations/iteration-002.md` confirmed the bash WASM symbol fault, and `research/iterations/iteration-004.md` tested the 0.26.8 path)
- [x] T005 [P] Test hypothesis C (content): grep failing fixtures for shared patterns (decorator stacks, generics depth ≥4, template-literal nesting, mapped/conditional types, large unions) and produce a syntax-cohort table (Evidence: `research/iterations/iteration-004.md` closed Hypothesis C as non-primary)
- [x] T006 Synthesize findings into `decision-record.md`: which hypothesis is supported by the strongest evidence, what the discriminating signal is (Evidence: `research/research.md` §17 instructs Phase 1 to move complete via deep-research synthesis)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Skip-list MVP: persistent skip-list with structured telemetry, schema v5 bump, and an env-flagged kill switch.*

- [x] T007 Schema v5: add `parser_skip_list` table to `mcp_server/code_graph/lib/code-graph-db.ts` (columns: file_path PK, error_class, last_seen_at, attempt_count, last_success_at) (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `upgrades a legacy v4 database to schema v5 with parser_skip_list`)
- [x] T008 Migration: v4 → v5 round-trip with backfill from existing parse_diagnostics rows (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `seeds B1 rows from parse_diagnostics during migration`)
- [x] T009 Skip-list module: `mcp_server/code_graph/lib/parser-skip-list.ts` exporting `addToSkipList`, `lookupSkipList`, `recordSuccess`, `getSkipListSummary`, `seedFromProduction`. **Default seed: 70 production B1 file paths backfilled from `parse_diagnostics`** (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` cases `inserts a fresh runtime row with attempt_count=1`, `returns an entry for lookup hits`, `summarizes count, most recent timestamp, and five recent paths`)
- [x] T010 Parser wrapper: in `mcp_server/code_graph/lib/tree-sitter-parser.ts:712`, add pre-`parse()` skip-list lookup. In catch block at `:741-756`, on B1/B2 throw, upsert into skip-list and emit ParseFailure. (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` cases `classifies B1, B2, and OTHER parser errors` and `quarantines after B2 and returns a sentinel on subsequent fresh paths`)
- [x] T011 Self-heal policy: **MANUAL REVIEW ONLY**. Quarterly dashboard review. Do NOT auto-unskip on N consecutive successes. (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `keeps entries after recordSuccess because self-heal is manual-review-only`)
- [x] T012 [P] Status surface: add `parserSkipList: { count, lastSeenAt, sample }` to `mcp_server/code_graph/handlers/status.ts` response (Evidence: commit `81b3e7ce9`, status mock updates)
- [x] T013 [P] Scan surface: add `parserSkipList.added` and `parserSkipList.healed` deltas to `mcp_server/code_graph/handlers/scan.ts` response (Evidence: commit `81b3e7ce9`, scan mock updates)
- [x] T014 Env flag: `SPECKIT_PARSER_SKIP_LIST_ENABLED` (default true). When false, parser wrapper rethrows legacy behavior. (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `bypasses the skip-list when SPECKIT_PARSER_SKIP_LIST_ENABLED=false`)
- [x] T015 [P] Vitest: `mcp_server/code_graph/tests/parser-skip-list.vitest.ts` covering add, lookup, manual-review-only success recording, migration, summary, seed backfill and corrupted-state fail-open (Evidence: commit `81b3e7ce9`, 13 parser skip-list cases)
- [x] T016 R-1' process quarantine sentinel (defense-in-depth, NEW post-research): on B2 throw, mark singleton `QUARANTINED_SENTINEL` in `tree-sitter-parser.ts`, fail subsequent parse calls fast with structured error. ~10 LOC. (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `quarantines after B2 and returns a sentinel on subsequent fresh paths`)
- [x] T017 [P] Status surface: add `parserHealth: 'ok' | 'quarantined'` field to `code_graph_status` response when quarantine sentinel is set. Surface alongside skip-list count. Quarantine state cleared by MCP server restart only. (Evidence: commit `81b3e7ce9`, `parser-skip-list.vitest.ts` case `quarantines after B2 and returns a sentinel on subsequent fresh paths`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Build: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` (exit 0) (Evidence: Phase 2 verification recorded `npm run build` exit 0)
- [x] T019 Live driver: `node /tmp/cg-driver.mjs scan '{"incremental":false,"includeSkills":true,"includeAgents":"all","includeCommands":"all","includeSpecs":"all","includePlugins":"all"}'` returns `status: ok` with `<2%` parser-error rate (Evidence: broad-scope scan completed with 0 B2 and 0.72% parser-error rate)
- [x] T020 [P] Skills-only regression check: `node /tmp/cg-driver.mjs scan '{"incremental":false,"includeSkills":true}'` returns zero parser errors (Evidence: skills-only regression returned zero parser errors)
- [x] T021 [P] Status check: `node /tmp/cg-driver.mjs status '{}'` shows new `parserSkipList` and `parserHealth` fields with sane shape (Evidence: status response surfaced `parserSkipList` and `parserHealth`)
- [ ] T022 Manual playbook 02 scenario: DEFERRED to follow-up packet. Add and pass a "broad-scope scan with skip-list verification" scenario in `manual_testing_playbook/02--manual-scan-verify-status/`. Scenario must verify: (1) `code_graph_scan` over full active scope completes with skip-list pre-filtering 70 known-bad .sh paths, (2) zero B1 throws observed, (3) zero B2 cascades observed, (4) `parserHealth: 'ok'` in status, (5) skills-only scope still returns zero parser errors (regression check)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All non-deferred tasks marked `[x]` (T001-T022, with T022 deferred to follow-up packet)
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items 100% verified with evidence
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
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
