---
title: "Feature Specification: Parser Quarantine Recovery (029 Phase 006)"
description: "Add a production recovery path for the global tree-sitter parser quarantine so an explicit full scan self-clears it (F-RUNTIME-2)."
trigger_phrases:
  - "parser quarantine recovery"
  - "f-runtime-2 tree-sitter quarantine"
  - "029 phase 006 parser recovery"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 006 spec for parser-quarantine recovery"
    next_safe_action: "Add resetParserHealth and wire into full scan"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parser Quarantine Recovery (029 Phase 006)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
029 finding F-RUNTIME-2: a single B2 fault ("memory access out of bounds") sets the module-level `parserHealth = 'quarantined'` (`tree-sitter-parser.ts:813-815`), after which every parse early-returns a sentinel (`:770-772`). A full scan then produces zero nodes, which the scan handler's zero-node guard (`scan.ts:490-498`) rejects to protect the existing graph — so the graph can never refresh until a launcher restart. The only existing reset is the test-only `__resetParserHealth()` (`:68`). This blocked playbook scenarios 002, 005, 022, 024.

### Purpose
Add a production recovery path so an explicit full scan (`code_graph_scan({incremental:false})`) clears the quarantine and re-initializes the parser on a fresh WASM heap, without requiring a daemon restart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New exported `resetParserHealth()` in `tree-sitter-parser.ts` (full reset: flag + parserInstance + initPromise + grammarCache).
- Call it at the start of an explicit full scan in `scan.ts`.
- Unit test for the recovery behavior.
- tsc build + vitest + alignment verifier.

### Out of Scope
- Softening the single-B2 global-quarantine trigger (heap-corruption quarantine is correct safety; only the missing recovery is the bug).
- Persisting quarantine state across processes.
- Re-architecting the zero-node guard.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/tree-sitter-parser.ts` | Modify | Add `resetParserHealth()` |
| `mcp_server/handlers/scan.ts` | Modify | Call reset on explicit full scan |
| `mcp_server/tests/parser-skip-list.vitest.ts` | Modify | Add recovery test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Production recovery exists | `resetParserHealth()` exported; clears quarantine + drops instance/initPromise + grammarCache |
| REQ-002 | Full scan triggers recovery | `scan.ts` calls it when `args.incremental === false`, before indexFiles |
| REQ-003 | Build + tests pass | tsc clean; new vitest passes; existing parser tests still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Recovery verified live | After rebuild + daemon restart, a quarantined parser recovers on full scan (or noted if not reproducible) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A quarantined parser is cleared by an explicit full scan (no daemon restart needed).
- **SC-002**: Scenarios 002/005/022/024 are no longer environment-blocked by F-RUNTIME-2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reset on every full scan masks a persistent heap fault | quarantine→reset→re-quarantine loop | Acceptable: an explicit full scan is a deliberate retry; if it re-quarantines, operator gets the same signal. Trigger unchanged |
| Risk | Nulling parserInstance breaks in-flight parses | crash | Reset runs before indexFiles, not mid-scan; ensureInit re-creates the instance lazily |
| Risk | Existing parser tests rely on `__resetParserHealth` | test breakage | Keep `__resetParserHealth` unchanged; add a separate `resetParserHealth` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reset adds a one-time fresh WASM init on the next full scan after a quarantine — negligible.

### Security
- **NFR-S01**: No new external surface; internal module state only.

### Reliability
- **NFR-R01**: Recovery verified by unit test (quarantine → reset → parse re-engages).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Reset on an incremental scan: NOT triggered (only explicit full scan) — preserves the safety of not masking quarantine on routine reads.

### Error Scenarios
- If web-tree-sitter re-init itself fails after reset, `ensureInit` nulls promise/instance and the next call retries (existing behavior).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 2 source files + 1 test, small diffs |
| Risk | 14/25 | Core parser runtime; mitigated by keeping trigger + adding test |
| Research | 6/20 | Root cause + init flow already mapped |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Re-running 002/005/022/024: full batched re-dispatch vs verify-fix-and-note? (Decide based on dispatch budget; the fix itself is unit-tested.)
<!-- /ANCHOR:questions -->
