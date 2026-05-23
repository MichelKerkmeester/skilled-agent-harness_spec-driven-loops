---
title: "Plan: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment"
description: "Implementation plan for documentation-only JSDoc/TSDoc alignment in the rerank sidecar launcher and sidecar worker."
trigger_phrases:
  - "021 002 plan"
  - "rerank sidecar alignment plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code"
    last_updated_at: "2026-05-23T12:05:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
    session_dedup:
      fingerprint: "sha256:0210020210020210020210020210020210020210020210020210020210020210"
      session_id: "021-002-sk-code-rerank-sidecar-worker-docs"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Rerank Sidecar CJS and Sidecar Worker sk-code Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
This packet touches one CommonJS launcher under `.opencode/bin/lib` and one TypeScript worker under the mcp-server embedders lib. Both are already covered by targeted verifier/test commands; the change type is documentation-only alignment.

### Overview
Scaffold and validate the Level 2 packet, add CJS module/section/JSDoc coverage to `ensure-rerank-sidecar.cjs`, add TSDoc coverage to the listed `sidecar-worker.ts` helpers, verify that the source diff is comment-only, then run the requested drift, vitest, typecheck, and spec validation gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Packet folder scaffolded from sibling shape and strict-validated before source edits.
- Target source files read before editing.
- sk-code OpenCode JavaScript and TypeScript style references read.

### Definition of Done
- Source diffs are documentation/comment-only.
- Both drift verifier scopes exit 0.
- Requested embedders vitest, launcher vitest, and mcp-server typecheck exit 0.
- Checklist, ADR, implementation summary, and strict validation are complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use additive documentation around existing code. Section dividers split existing logical regions, and docblocks describe behavior as implemented rather than changing code to fit the docs.

### Key Components
- `ensure-rerank-sidecar.cjs` launcher helpers for configuration, owner tokens, ledger state, reaper cleanup, and process spawning.
- `sidecar-worker.ts` helper functions for provider resolution, request validation, parent liveness, JSON responses, and request error shaping.

### Data Flow
No data flow changes. Existing launcher and worker inputs/outputs remain untouched; the docs clarify their contracts for future maintainers and drift tooling.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Risk | Guard |
|---------|------|-------|
| CommonJS launcher docs | Medium | Diff audit proves comments/header additions only |
| TypeScript worker docs | Medium | Typecheck and vitest confirm no behavior drift |
| Packet docs | Low | Strict validate before and after implementation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Copy sibling Level 2 packet shape into the pre-approved folder.
- Rewrite metadata/content for 021/002 and run strict scaffold validation.
- Read both target files and relevant sk-code OpenCode JS/TS style guidance.

### Phase 2: Core Implementation
- Add `ensure-rerank-sidecar.cjs` module header, section dividers, and JSDoc.
- Add `sidecar-worker.ts` TSDoc on the listed helpers.
- Inspect diff to confirm source edits are comments/docblocks only.

### Phase 3: Verification
- Run both alignment drift verifier scopes.
- Run requested embedders vitest, launcher vitest, and mcp-server typecheck.
- Fill checklist, ADR, implementation summary, and final strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Coverage |
|-------|----------|
| Alignment verifier | `.opencode/bin/lib` and mcp-server embedders lib drift scopes |
| Worker regression | Full `mcp_server/tests/embedders/` vitest run |
| Launcher regression | `ensure-rerank-sidecar.vitest.ts` vitest run |
| Static check | mcp-server workspace typecheck |
| Spec check | Packet strict validation before source edits and at completion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use |
|------------|-----|
| Commit `fbb8a23cda` | CommonJS boxed header/JSDoc precedent |
| Commit `e5113fedc4` | Council primitive documentation sweep precedent |
| Commit `8dfafc7189` | TypeScript TSDoc and section divider precedent |
| Commit `f081112aab` | Recent alignment style precedent |
| `verify_alignment_drift.py` | Required proof that sk-code alignment drift is closed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the two approved source files and this packet folder. Because source edits are comments/docblocks only, rollback should not require fixture or data cleanup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Criteria |
|-------|------------|---------------|
| Setup | User pre-approved folder | Strict scaffold validation exits 0 |
| CJS docs | Setup | `ensure-rerank-sidecar.cjs` diff is comment-only |
| Worker docs | Setup | `sidecar-worker.ts` diff is comment-only |
| Verification | Source docs | Requested commands exit 0 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Scaffold | Small | Sibling packet provides Level 2 shape |
| CJS JSDoc | Medium | 40+ helpers and multiple error paths |
| Worker TSDoc | Small | 19 listed helpers |
| Verification/docs | Medium | Full requested command set plus diff audit |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm source edits are documentation-only.
- Confirm no sibling tests/source files changed.

### Rollback Procedure
- Revert the two approved source file doc additions.
- Restore packet docs to DEFERRED if a verifier failure blocks completion.

### Data Reversal
No persistent data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->
