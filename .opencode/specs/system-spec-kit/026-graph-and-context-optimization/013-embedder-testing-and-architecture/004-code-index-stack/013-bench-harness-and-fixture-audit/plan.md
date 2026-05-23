---
title: "Plan: 016/004/013 Bench Harness Hardening + Fixture Audit"
description: "Implementation plan for hardening Phase 2 bench measurement quality, auditing the 18-probe fixture against the live CocoIndex DB, and producing the corrected baseline for downstream packets 014-018."
trigger_phrases: ["016/004/013 plan", "bench harness hardening plan", "fixture audit plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit"
    last_updated_at: "2026-05-19T10:30:44Z"
    last_updated_by: "codex"
    recent_action: "Implemented hardened bench baseline"
    next_safe_action: "Use corrected comparison for packets 014-018"
    blockers: []
    key_files:
      - "../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md"
      - "../004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004013"
      session_id: "016-004-013-plan"
      parent_session_id: "016-004-013"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/004/013 Bench Harness Hardening + Fixture Audit

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet hardens the Phase 2 measurement harness before any retrieval pipeline changes are evaluated. The work has three moving parts: parser hardening in both harness scripts, a full sqlite-backed fixture audit, and corrected benchmark artifacts that become the baseline for packets 014-018.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Parser correctness | `_extract_paths()` exists in both harnesses and pytest covers wrapper, line-range, mirror-prefix, missing-file, empty-output, and dedupe cases |
| Fixture truth | All 18 probes have `_fixture_status` and `_audit_evidence` with vec/FTS counts |
| Historical preservation | Original fixture and `phase2-comparison.md` remain untouched; corrected artifacts use explicit suffixes |
| Re-bench | Corrected fixture runs across baseline-bge, bge-path-class, and jina-v3 lanes |
| Strict validate | Packet validates with `validate.sh --strict` |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No retrieval pipeline behavior changes are in scope. The harness remains bash-driven with embedded Python; the new helper is local to each heredoc to keep current callers working without introducing a shared module dependency. The audit uses read-only sqlite access to `.cocoindex_code/target_sqlite.db`, loading sqlite-vec for `code_chunks_vec` and cross-checking `code_chunks_fts`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Read `spec.md`, both harness scripts, the baseline fixture, current Phase 2 artifacts, and CocoIndex exclusion settings.
- Confirm DB schema and sqlite-vec loading path.

### Phase 2: Implementation

- Add `_extract_paths()` to both harnesses with wrapper stripping, mirror awareness, filesystem sanity filtering, and rank-order dedupe.
- Add pytest coverage by extracting the helper block from both scripts.
- Generate audited and corrected fixture artifacts from the live DB.
- Re-run Phase 2 smoke bench using corrected fixture and corrected output paths.

### Phase 3: Verification

- Run pytest, shell syntax checks, JSON validation, corrected re-bench, and strict spec validation.
- Update README and ADR-016 with the new measurement contract.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `python -m pytest .../scratch/test_path_extraction.py -q` | Path extraction helper behavior in both harnesses |
| `bash -n run-phase2-smoke.sh` | Phase 2 harness shell syntax |
| `bash -n run-extended-bake-off-with-hybrid-rerank.sh` | Extended bake-off harness shell syntax |
| `python -m json.tool` | Audited and corrected fixtures are valid JSON |
| Corrected re-bench command | Three lanes run against corrected fixture and emit corrected comparison |
| `validate.sh --strict` | Packet documentation contract |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Live DB: `.cocoindex_code/target_sqlite.db`
- Canonical Python: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python`
- Settings: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` and `.cocoindex_code/settings.yml`
- Historical Phase 2 artifacts in `../011-rerank-model-fit-investigation/research/phase2-bench/`
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two harness edits, stop using `code-retrieval-fixture-corrected.json`, and treat `phase2-comparison-corrected.md` as superseded. No DB reset or re-index is required because this packet does not mutate CocoIndex index state.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | Existing spec, harnesses, fixture, DB, settings | Implementation |
| Implementation | Setup evidence | Verification |
| Verification | Harness edits, fixtures, corrected re-bench artifacts | Completion claim |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|---|---|---|
| Setup | Medium | Read spec, harnesses, fixture, DB schema, settings, existing artifacts |
| Implementation | Medium | Hardened two embedded helpers, generated fixtures, ran corrected bench |
| Verification | Medium | Pytest, bash syntax, JSON validation, strict validation, docs |
| Total | Medium | One focused implementation pass |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Historical artifacts preserved with original names.
- [x] Corrected artifacts use `-corrected` or `-audited` suffixes.
- [x] No live DB mutation, reset, or re-index performed.

### Rollback Procedure
1. Revert the two harness file changes.
2. Stop referencing `code-retrieval-fixture-corrected.json` in downstream packet work.
3. Supersede ADR-016 if a replacement measurement contract is chosen.
4. Re-run the old harness only if a historical comparison needs to be reproduced.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: remove generated corrected artifacts or mark them superseded; no database reversal is required.
<!-- /ANCHOR:enhanced-rollback -->
