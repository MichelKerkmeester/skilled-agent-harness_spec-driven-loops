---
title: "Implementation Plan: Tree-sitter parser resilience via root-cause investigation + skip-list policy"
description: "Three-phase plan: (1) reproducible isolation of failing files, (2) root-cause discrimination across three hypotheses (version / WASM / content), (3) skip-list MVP with structured telemetry. Defer grammar bump or parser swap unless the investigation forces it."
trigger_phrases:
  - "tree-sitter resilience plan"
  - "skip-list MVP"
  - "parser root cause"
  - "broad scope investigation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/008-tree-sitter-parser-crash-resilience"
    last_updated_at: "2026-05-06T13:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan after spec landed"
    next_safe_action: "Author tasks + checklist"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-parser-resilience-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Tree-sitter parser resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (NodeNext ESM), Node 20+ |
| **Framework** | MCP server (`@modelcontextprotocol/sdk`) |
| **Storage** | SQLite (`mcp_server/database/code-graph.sqlite`) |
| **Testing** | Vitest |
| **Parser** | tree-sitter native + tree-sitter-typescript grammar |

### Overview
Investigate the parser-collapse signal surfaced during live testing of the post-F-002/F-003/F-018/F-019 code graph. Discriminate among three hypotheses (version mismatch, WASM grammar bug, content-specific syntax) using minimum failing fixtures. Ship a skip-list policy that keeps broad-scope scans usable while the root cause is being pinned down, plus telemetry that exposes which files are skipped and why.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` REQ-001..REQ-007)
- [x] Success criteria measurable (SC-001/2/3)
- [x] Three explicit hypotheses to test (version, WASM, content)
- [ ] Reproducer fixture committed (post-investigation)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-004)
- [ ] Vitest suite for skip-list passes (≥10 cases)
- [ ] Live `code_graph_scan` over full active scope completes with `<2%` parser-error rate
- [ ] Manual playbook 02 scenario added and passes
- [ ] `decision-record.md` documents which hypothesis landed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defensive parser wrapper + persistent skip-list (LRU with last-seen timestamps) + process-quarantine sentinel (defense-in-depth, post-research).

**Mechanism (confirmed by 7-iteration deep research, see `research/research.md`):** `tree-sitter-bash.wasm` is missing the `external_scanner_reset` exported symbol; `web-tree-sitter@0.24.7` masks this via `allowUndefined:true`; bash B1 stub-throws corrupt WASM module-level linear memory; after ~80 cumulative B1 throws, ANY language `parse()` begins throwing B2 `memory access out of bounds`. Reset-on-throw at the parser-instance level was empirically rejected (R-1, iter 6) — the corruption is module-level, not instance-level. **The architecture: prevent bash B1 throws via skip-list (R-3 primary), and on B2 quarantine the singleton (R-1' defense-in-depth) until process restart.**

### Key Components
- **Parser wrapper** (`code_graph/lib/parser.ts`): wraps the tree-sitter call in a structured try/catch. On failure, emits a structured `ParseFailure { path, errorClass, attemptedAt }` and updates the skip-list.
- **Skip-list module** (`code_graph/lib/parser-skip-list.ts`): persistent state (SQLite table `parser_skip_list` or JSON sidecar). LRU eviction; self-healing on N consecutive successful re-attempts.
- **Telemetry surface** (`scan.ts` + `status.ts` handlers): expose skip-list count and a sample to status responses.

### Data Flow
```
File enumeration → parser wrapper → tree-sitter call
   │                    │
   │                    ├── success → AST → existing indexer path
   │                    └── failure → skip-list upsert → ParseFailure record
   │                                       │
   └── scan complete → aggregate parseDiagnostics → status response includes skip-list summary
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code_graph/lib/tree-sitter-parser.ts:712` | Producer of AST nodes (singleton at `:42`, alloc `:78-94`) | Pre-parse skip-list lookup; catch hook at `:741-756`; quarantine sentinel on B2 | Vitest: forced-throw + B2 fixture |
| `code_graph/handlers/scan.ts` | Consumer of parseDiagnostics | Add skip-list count to response payload | Live driver script JSON shape diff |
| `code_graph/handlers/status.ts` | Consumer of indexer state | Expose skipListSummary | Vitest: stub DB → status response shape |
| `code_graph/lib/code-graph-db.ts` | Schema owner | Add `parser_skip_list` table (v5 schema bump) | Migration test: v4 → v5 round-trip |
| `manual_testing_playbook/02--manual-scan-verify-status/` | Scenario library | Add broad-scope scenario | Playbook run captures pass |

Required inventories:
- Producer search: `rg -n 'tree[-_]?sitter|parseSync|parseAsync' .opencode/skills/system-spec-kit/mcp_server/code_graph/`
- Consumer search: `rg -n 'parseDiagnostics|parseHealth|parseError' .opencode/skills/system-spec-kit/mcp_server/code_graph/`
- Schema search: `rg -n 'CREATE TABLE|SCHEMA_VERSION' .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
- Algorithm invariant: skip-list operations must be idempotent under concurrent scans; verify via Vitest with two scans racing on the same file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation (root-cause discrimination)
- [ ] Capture 5-10 minimum failing fixtures from the live broad-scope crash cohort
- [ ] Test hypothesis A: bisect tree-sitter native binding versions against a working baseline
- [ ] Test hypothesis B: re-run with `SPECKIT_TREE_SITTER_USE_WASM=true` (if path exists) or vendored WASM grammar
- [ ] Test hypothesis C: manually classify failing files by syntax pattern (decorators, generics depth, template literal nesting, conditional types)
- [ ] Write `decision-record.md` with the discriminating evidence

### Phase 2: Skip-list MVP
- [ ] Add `parser_skip_list` table (schema v5 bump) with LRU + last-seen
- [ ] Wrap parser entry with structured try/catch + skip-list upsert
- [ ] Surface `parserSkipList` summary in `status` and `scan` responses
- [ ] Vitest: 10+ cases (fresh add, eviction, self-heal, schema migration v4→v5, concurrent scan, corrupted state fail-open)

### Phase 3: Verification
- [ ] Live `code_graph_scan` over `agents+commands+specs+plugins=all` returns `status: ok`, `<2%` parser-error rate
- [ ] Skills-only scope still returns zero parser errors (no regression)
- [ ] Manual playbook 02 scenario added and passes
- [ ] End-user scope-recommendation doc updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Skip-list operations (add, lookup, evict, self-heal) | Vitest |
| Integration | Parser wrapper + skip-list + status response | Vitest with stubbed parser |
| Migration | v4 → v5 schema round-trip | Vitest with temp SQLite |
| Live | Full active-scope scan via `/tmp/cg-driver.mjs` | Direct dist driver |
| Regression | Skills-only scope returns zero parser errors | Manual playbook 02 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tree-sitter native binding | External | Green | Bisect blocked → fall back to skip-list-only path |
| tree-sitter-typescript grammar | External | Green | Same as above |
| F-003 parse-error preservation | Internal | Green | Already shipped; relied on for index continuity |
| F-011 parse_diagnostics table | Internal | Green | Skip-list extends this surface |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: schema v5 migration corrupts existing v4 index OR live verification shows regression in skills-only scope
- **Procedure**: revert the migration commit; SQLite v4 schema continues to work (skip-list module is opt-in via env flag during rollout)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Investigation) ──► Phase 2 (Skip-list MVP) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigation | None | Skip-list MVP (informs design) |
| Skip-list MVP | Investigation | Verification |
| Verification | Skip-list MVP | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Investigation | Med | 4-8 hours (cli-codex deep-research, 5-7 iterations) |
| Skip-list MVP | Med | 6-10 hours (schema bump, wrapper, vitest) |
| Verification | Low | 1-2 hours (driver runs, playbook scenario) |
| **Total** | | **11-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Schema v4 → v5 migration tested round-trip
- [ ] Skip-list disabled by default behind env flag (`SPECKIT_PARSER_SKIP_LIST_ENABLED`)
- [ ] Live driver run captures pre/post status response shape

### Rollback Procedure
1. Set `SPECKIT_PARSER_SKIP_LIST_ENABLED=false` (kill switch — table stays, code stops writing)
2. If schema corruption suspected: revert migration commit, restart MCP server, verify v4 schema intact
3. Re-run skills-only scope scan to confirm no regression
4. Document rollback in `implementation-summary.md::limitations`

### Data Reversal
- **Has data migrations?** Yes (parser_skip_list table)
- **Reversal procedure**: drop the table; index data is unaffected (skip-list is auxiliary)
<!-- /ANCHOR:enhanced-rollback -->
