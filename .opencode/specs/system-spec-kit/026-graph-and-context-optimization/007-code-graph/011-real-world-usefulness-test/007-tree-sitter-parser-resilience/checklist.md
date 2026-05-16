---
title: "Verification Checklist: Tree-sitter parser resilience"
description: "Level 2 verification checklist with P0 hard blockers and P1 required items. Verification Date: 2026-05-06"
trigger_phrases:
  - "parser resilience checklist"
  - "verification gate"
  - "skip-list verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/007-tree-sitter-parser-resilience"
    last_updated_at: "2026-05-06T13:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Author description.json + validate"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-06-parser-resilience-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Tree-sitter parser resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001..REQ-007 documented in `spec.md`
- [ ] CHK-002 [P0] Three-phase plan defined (Investigation → Skip-list MVP → Verification)
- [ ] CHK-003 [P1] Crash cohort enumerated: full list of files that fail under broad scope captured to `scratch/`
- [ ] CHK-004 [P1] Minimum failing fixtures committed (5-10 standalone `.ts` files reproducing the crash)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:investigation -->
## Investigation (Phase 1)

- [ ] CHK-INV-001 [P0] Hypothesis A (version): bisect outcome recorded with version pins and pass/fail per fixture
- [ ] CHK-INV-002 [P0] Hypothesis B (WASM): WASM-vs-native outcome recorded per fixture
- [ ] CHK-INV-003 [P0] Hypothesis C (content): syntax-cohort table produced (decorators, generics depth, template-literal nesting, mapped/conditional types)
- [ ] CHK-INV-004 [P0] `decision-record.md` cites the discriminating evidence for the landed hypothesis
- [ ] CHK-INV-005 [P1] Adjacent question answered: deterministic vs stochastic crash behavior
<!-- /ANCHOR:investigation -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run build` exits 0 in `mcp_server/`
- [ ] CHK-011 [P0] No new TypeScript errors or warnings
- [ ] CHK-012 [P0] Skip-list lookup is O(1) (Map/Set or indexed SQLite query)
- [ ] CHK-013 [P1] Parser wrapper rethrows when `SPECKIT_PARSER_SKIP_LIST_ENABLED=false` (kill-switch verified)
- [ ] CHK-014 [P1] No log spam: parser failures logged once per file per scan, not per attempt
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Vitest `parser-skip-list.vitest.ts` ≥10 cases, all pass
- [ ] CHK-021 [P0] Vitest schema migration v4 → v5 round-trip passes
- [ ] CHK-022 [P0] Live driver: full active scope scan returns `status: ok` with `<2%` parser-error rate (REQ-001, REQ-002)
- [ ] CHK-023 [P0] Live driver: skills-only scope shows zero parser errors (REQ-003 — no regression)
- [ ] CHK-024 [P0] Live driver: status response includes `parserSkipList: { count, last_seen_at, sample }` (REQ-004)
- [ ] CHK-025 [P1] Concurrent scan vitest case: two scans on the same file produce idempotent skip-list state
- [ ] CHK-026 [P1] Self-heal vitest case: file re-parses cleanly after N successes → leaves skip-list
- [ ] CHK-027 [P1] Manual playbook 02 scenario added and passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class declared: this packet is `algorithmic` (parser-error handling) + `instance-only` for the failing fixtures themselves
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: confirmed only one tree-sitter call site (the parser wrapper). Run: `rg -n 'tree[-_]?sitter|parseSync|parseAsync' .opencode/skills/system-spec-kit/mcp_server/code_graph/`
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: status, scan, code-graph-db consumers of `parseDiagnostics` audited for skip-list integration. Run: `rg -n 'parseDiagnostics|parseHealth|parseError' .opencode/skills/system-spec-kit/mcp_server/code_graph/`
- [ ] CHK-FIX-004 [P0] Adversarial table tests: corrupted skip-list, missing file, concurrent writers, schema mismatch
- [ ] CHK-FIX-005 [P1] Matrix axes documented: { scope: skills-only|broad } × { skip-list: enabled|disabled } × { skip-list state: empty|populated|corrupt } = 12 row-coverage minimum
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: `SPECKIT_PARSER_SKIP_LIST_ENABLED=false` and corrupted JSON sidecar
- [ ] CHK-FIX-007 [P1] Evidence pinned to fix SHA range, not a moving branch-relative reference
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in skip-list (file paths only; no source content stored)
- [ ] CHK-031 [P0] Skip-list path validation: reject paths outside the workspace root (avoid traversal poisoning)
- [ ] CHK-032 [P1] Skip-list size cap enforced (LRU eviction at 5,000 entries default; configurable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` synchronized
- [ ] CHK-041 [P0] `decision-record.md` records investigation outcome (REQ-005)
- [ ] CHK-042 [P1] `implementation-summary.md` filled post-implementation (HVR-compliant voice)
- [ ] CHK-043 [P1] End-user scope-recommendation doc updated (REQ-007)
- [ ] CHK-044 [P2] Public README at `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` references skip-list policy
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Investigation logs and minimum failing fixtures parked in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion claim (move keepers to `assets/` if any)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: TBD (post-implementation)
<!-- /ANCHOR:summary -->
