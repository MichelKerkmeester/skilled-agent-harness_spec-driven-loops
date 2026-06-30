---
title: "Implementation Plan: Parser Quarantine Recovery (029 Phase 006)"
description: "Add resetParserHealth and wire it into explicit full scans; test the recovery."
trigger_phrases:
  - "parser quarantine recovery plan"
  - "f-runtime-2 plan"
  - "029 phase 006 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 006 plan"
    next_safe_action: "Edit tree-sitter-parser and scan handler"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parser Quarantine Recovery (029 Phase 006)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mk-code-index MCP server) |
| **Framework** | web-tree-sitter parser + scan handler |
| **Storage** | n/a (in-memory parser state) |
| **Testing** | vitest + tsc + verify_alignment_drift.py |

### Overview
Add a full-reset recovery function to the parser module and invoke it at the start of an explicit full scan, so a quarantine self-clears via a deliberate retry rather than a daemon restart.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Quarantine trigger + init flow + scan injection point mapped
- [x] sk-code loaded (OPENCODE/TypeScript surface)

### Definition of Done
- [ ] resetParserHealth added + wired into full scan
- [ ] tsc build clean; new + existing parser tests pass
- [ ] alignment verifier clean on changed scope
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Module-singleton reset + lazy re-init on next parse.

### Key Components
- **`resetParserHealth()`** — clears `parserHealth`, `parserInstance`, `initPromise`, `grammarCache`.
- **scan handler** — calls reset when `args.incremental === false`.

### Data Flow
Full scan request → resetParserHealth() → indexFiles → ensureInit rebuilds fresh WASM instance → parse produces nodes → zero-node guard not tripped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `tree-sitter-parser.ts` quarantine singleton | sets parserHealth on B2 | add reset fn (trigger unchanged) | vitest recovery test |
| `scan.ts` full-scan path | indexes files | call reset before indexFiles on full scan | grep + test |
| `parser-skip-list.vitest.ts` | parser tests | add recovery test | vitest pass |

Required inventories:
- Consumers of parser health: `rg -n 'getParserHealth|parserHealth|__resetParserHealth' mcp_server` → status.ts (read-only), tests. `resetParserHealth` is additive; no consumer of the old API changes.
- Other scan entry points that should also recover: only the explicit full-scan path is the deliberate retry; incremental intentionally excluded.
- Algorithm invariant: reset only on `args.incremental === false`; quarantine still fires on B2 within a scan.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm build + test baseline green before edits

### Phase 2: Core Implementation
- [ ] Add `resetParserHealth()` to tree-sitter-parser.ts
- [ ] Import + call it in scan.ts on explicit full scan
- [ ] Add recovery test to parser-skip-list.vitest.ts

### Phase 3: Verification
- [ ] tsc build clean
- [ ] vitest (parser-skip-list + code-graph-scan) pass
- [ ] verify_alignment_drift.py clean
- [ ] (optional) live: restart daemon, confirm recovery
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | quarantine → reset → re-engage | vitest |
| Build | type-check | tsc |
| Alignment | changed scope drift | verify_alignment_drift.py |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest + tsc toolchain | Internal | Green | cannot verify |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests fail or recovery loops pathologically.
- **Procedure**: `git checkout -- mcp_server/lib/tree-sitter-parser.ts mcp_server/handlers/scan.ts mcp_server/tests/parser-skip-list.vitest.ts`; rebuild.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (parser + scan + test) ──► Verification (build/test/align)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verification |
| Verification | Core | re-run 002/005/022/024 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 min |
| Core | Med | 30-45 min |
| Verification | Med | 30 min |
| **Total** | | **~1.5 h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Changed files are git-tracked (revertable)
- [ ] Build baseline recorded

### Rollback Procedure
1. `git checkout --` the 3 changed source/test files
2. Rebuild dist (`tsc`)
3. Restart launcher daemon if it loaded the new dist

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
