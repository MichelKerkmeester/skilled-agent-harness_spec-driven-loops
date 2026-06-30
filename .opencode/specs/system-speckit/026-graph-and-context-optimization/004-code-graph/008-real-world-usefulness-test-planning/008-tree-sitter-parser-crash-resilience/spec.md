---
title: "Tree-sitter parser resilience: eliminate memory-access-out-of-bounds crashes on broad-scope scans"
description: "When scan scope expands beyond skills-only to include agents/commands/specs/plugins, ~17.5% of files (1,640/9,349 in live test) crash the tree-sitter parser with 'memory access out of bounds' on valid TypeScript content. Skills-only scope is clean. The indexer survives via F-003 parse-error preservation but the population is incomplete and the run is noisy."
trigger_phrases:
  - "tree-sitter parser crash"
  - "memory access out of bounds"
  - "code graph scope expansion"
  - "parser resilience"
  - "broad scope scan"
  - "wasm grammar"
  - "skip-list policy"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/008-tree-sitter-parser-crash-resilience"
    last_updated_at: "2026-05-06T13:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec from live-test parser-collapse evidence"
    next_safe_action: "Author plan + tasks; dispatch investigation iteration"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-parser-resilience-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the crash a tree-sitter native version mismatch, a WASM grammar issue, or content-specific?"
      - "Do all crashes share a syntax pattern (decorator stacking, generics depth, template literal nesting)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Tree-sitter parser resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented (Phase 2) |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Live testing of the code-graph (after F-002/F-003/F-018/F-019 remediation landed) showed that broad-scope scans (`agents+commands+specs+plugins=all`) crash the tree-sitter parser with `memory access out of bounds` on roughly 1,640 of 9,349 candidate files (~17.5%). Skills-only scope is parser-clean. Crashes happen on valid TypeScript files, including test files and runtime modules. The F-003 preservation guard prevents data loss, but parsed coverage is incomplete and the failure is loud enough to obscure real signal.

### Purpose
Make broad-scope scans usable by either (a) eliminating the parser crash at the root, or (b) gating affected files behind a structured skip-list with diagnostics so the parser-error rate stays under a small fraction (<2%) even at full active scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproducible isolation of failing files via minimum failing fixtures
- Root-cause investigation across three hypotheses: tree-sitter native version mismatch, WASM grammar bug, content-specific (syntax pattern)
- Per-file skip-list policy with structured diagnostics (file path, error class, last-seen timestamp)
- Telemetry for parser-error rate exposed via `code_graph_status.parseDiagnostics`
- Documentation of recommended scope policy for end users

### Out of Scope
- Replacing tree-sitter with a different parser (Babel, swc, native TS compiler API) — too invasive for this packet
- Rewriting the indexer or persistence layer
- Adding non-TypeScript language support
- Changing the F-002/F-003/F-018/F-019 contracts that already shipped

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/parser.ts` (or equivalent) | Modify | Add structured try/catch + skip-list path |
| `mcp_server/code_graph/lib/parser-skip-list.ts` | Create | Persistent skip-list with last-seen timestamps |
| `mcp_server/code_graph/handlers/scan.ts` | Modify | Surface parser-error rate in scan response |
| `mcp_server/code_graph/handlers/status.ts` | Modify | Expose skip-list size + last-seen cohort in status |
| `mcp_server/code_graph/tests/parser-skip-list.vitest.ts` | Create | Unit + integration coverage for skip-list policy |
| `manual_testing_playbook/02--manual-scan-verify-status/` | Modify | Add scenario for broad-scope scan with skip-list verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Broad-scope scan completes without process crash | Live `code_graph_scan({ scope: { agents: 'all', commands: 'all', specs: 'all', plugins: 'all' } })` exits with `status: ok` and a populated graph |
| REQ-002 | Parser-error rate falls below 2% at full active scope | `parseDiagnostics.errorCount / totalFiles < 0.02` in live verification |
| REQ-003 | Skills-only scope remains parser-clean (zero regression) | Re-running the post-fix manual playbook 02 scenario shows `parseDiagnostics.errorCount: 0` for skills-only scope |
| REQ-004 | Skipped files surface in status output | `code_graph_status` returns `parserSkipList: { count, last_seen_at, sample }` so users can see what was skipped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Root cause documented in `decision-record.md` | At least one of the three hypotheses (version, WASM, content) is confirmed or rejected with citable evidence |
| REQ-006 | Telemetry round-trips through MCP boundary | A status query after a broad-scope scan returns the new fields without breaking existing JSON shape |
| REQ-007 | Recommended scope policy documented | `references/end-user-scope-recommendation.md` (or analog under 008-end-user-scope-default-and-opt-in) updated with the new guidance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `code_graph_scan` over the full active scope (`agents+commands+specs+plugins=all`) completes without `memory access out of bounds` errors and persists ≥85% of candidate files.
- **SC-002**: Skip-list policy is observable: status surfaces count + sample, and an end user can decide whether to investigate or accept.
- **SC-003**: Zero regression on skills-only scope (the existing happy path).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Skip-list grows unbounded as new files trigger crashes | Medium — index coverage degrades silently | Add LRU eviction + last-seen timestamp; expose count in status |
| Risk | Root cause is content-specific and recurs on every TS upgrade | Medium — long-term toil | Capture minimum failing fixtures so the skip-list rationale survives review |
| Risk | Tree-sitter native binding upgrade introduces other regressions | Low — bounded by version pin | Bump in a feature-flagged opt-in path first; flag flip is the migration |
| Dependency | tree-sitter-typescript grammar | External | Vendored version in `package.json`; bump only if hypothesis lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skip-list lookup must be O(1) per file (Map/Set, not linear scan)
- **NFR-P02**: Scan duration on a clean broad-scope run does not regress more than 10% versus skills-only scope (file-count adjusted)

### Reliability
- **NFR-R01**: Skip-list must persist across MCP server restarts (SQLite or JSON sidecar)
- **NFR-R02**: A file leaves the skip-list automatically if it parses cleanly on N consecutive scans (self-healing)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- File deleted from disk while in skip-list: garbage-collect on next scan
- File renamed: skip-list keyed on absolute path; rename = miss = re-attempt = skip if still failing
- Skip-list corrupted on disk: fail open (re-attempt all) with warning log

### Error Scenarios
- Native parser segfaults the worker: fail closed (retain prior index) — already handled by F-003
- Out of memory under broad scope: scope policy advice in status response
- WASM and native bindings disagree on the same file: prefer the one that returns success; record both attempts
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4-6 files modified, 1-2 new modules |
| Risk | 10/25 | Native parser interaction; bounded by skip-list fail-open posture |
| Research | 14/20 | Root cause is unclear — three hypotheses to test |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is the crash deterministic (same file fails every time) or stochastic (varies by run)?
- Does setting `SPECKIT_TREE_SITTER_USE_WASM=true` change the failure cohort?
- Is there overlap between failing files and files that use specific TypeScript features (decorators, conditional types, mapped types, large unions)?
- Should the skip-list be packet-local (per repo) or process-global (shared across repos)?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
**Given** broad-scope scan with no skip-list
**Given** skills-only scope after fix lands
**Given** file that crashes the parser deterministically
**Given** file that recovers after parser upgrade
**Given** skip-list reaches eviction threshold
**Given** corrupted skip-list on disk
-->
