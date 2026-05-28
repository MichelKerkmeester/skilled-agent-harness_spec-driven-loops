---
title: "Implementation Summary: Parser Quarantine Recovery (029 Phase 006)"
description: "Added resetParserHealth() recovery wired into explicit full scans; build + 54 tests + alignment pass; the 4 previously-SKIPped scenarios re-verified live."
trigger_phrases:
  - "parser quarantine recovery summary"
  - "f-runtime-2 summary"
  - "029 phase 006 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-graph-playbook-validation/006-parser-quarantine-recovery"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Shipped parser-quarantine recovery; re-verified 002/005/024 PASS, 022 PARTIAL"
    next_safe_action: "Reconcile parent matrix and validate packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-code-graph-playbook-validation/006-parser-quarantine-recovery |
| **Completed** | 2026-05-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The global tree-sitter parser quarantine now self-recovers on an explicit full scan, so a single B2 fault no longer strands the runtime until a launcher restart.

### `resetParserHealth()` (production recovery)
Added to `tree-sitter-parser.ts`. Unlike the test-only `__resetParserHealth` (flag flip), it does a full reset: clears `parserHealth`, nulls `parserInstance` + `initPromise`, and clears `grammarCache`. The next `getParser()` sees `isReady()` false and re-runs `init()` + `loadAllLanguages()`, rebuilding a fresh web-tree-sitter instance on a clean heap.

### Wired into explicit full scans
`scan.ts` calls `resetParserHealth()` when `args.incremental === false`, before `indexFiles()`. An explicit full scan is a deliberate retry, so it clears a prior quarantine; incremental scans intentionally do NOT reset (safety preserved). The single-B2 quarantine trigger is unchanged — the bug was the missing recovery, not the trigger.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/tree-sitter-parser.ts` | Modified | Add `resetParserHealth()` |
| `mcp_server/handlers/scan.ts` | Modified | Reset on explicit full scan + import |
| `mcp_server/tests/parser-skip-list.vitest.ts` | Modified | Recovery test (full reset → isReady false → re-engage) |
| `mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Add `resetParserHealth` to the parser mock |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surgical TypeScript edits guided by sk-code (OPENCODE/TypeScript surface). Verified by tsc build, vitest, and the alignment verifier; then validated end-to-end by restarting the daemon (loading the rebuilt dist) and re-running the 4 scenarios the quarantine had blocked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recovery path, not trigger softening | A B2 ("memory access out of bounds") quarantine is correct heap-corruption safety; the defect was the missing recovery |
| Full reset (drop instance + grammars), not flag flip | A flag flip reuses the corrupted WASM instance; nulling instance + clearing grammars forces a fresh heap via `getParser()`'s existing re-init path |
| Reset only on explicit full scan | A deliberate `incremental:false` retry; routine incremental scans must not mask a live quarantine |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| tsc build | PASS (BUILD_OK) |
| vitest parser-skip-list + code-graph-scan | PASS (54/54) |
| verify_alignment_drift.py (mcp_server) | PASS (125 files, 0 violations) |
| Live: scenario 002 (was SKIP) | PASS — 57 content edits → broad-stale block, `requiredAction:code_graph_scan` |
| Live: scenario 005 (was SKIP) | PASS — verify#1 blocked → rescan ACCEPTED (2425 nodes, no `zero_node_scan_rejected`) → verify#2 ok + pass-rate |
| Live: scenario 024 (was SKIP) | PASS — multi-file diff → 2 affectedFiles, 16 symbols, canonicalized, empty-diff error |
| Live: scenario 022 (was SKIP) | PARTIAL — single non-blocked, union 7≥1, minConfidence≤unfiltered all hold; transitive==nontransitive only because the test subject had a single importer (shallow topology), not a tool defect |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **022 transitive expansion not strictly demonstrated.** The blast_radius tool is correct (union + confidence + non-blocked all hold), but the chosen `$WORK` subject had no transitive dependents, so `transitive > nontransitive` couldn't be shown. Re-verify with a subject that has multi-hop dependents.
2. **Quarantine recovery is per-process in-memory.** A full scan recovers within a process; quarantine is still not persisted across restarts (by design). Persisting it for operator awareness remains a possible future enhancement.
<!-- /ANCHOR:limitations -->
