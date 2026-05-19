---
title: "Summary: 016/004/013 Bench Harness Hardening + Fixture Audit"
description: "Implementation summary for the hardened Phase 2 bench harness, full fixture audit, corrected fixture, corrected comparison baseline, ADR, README, and verification evidence."
trigger_phrases: ["016/004/013 summary", "bench harness hardening summary", "corrected phase2 baseline"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit"
    last_updated_at: "2026-05-19T10:30:44Z"
    last_updated_by: "codex"
    recent_action: "Shipped corrected measurement baseline"
    next_safe_action: "Use corrected baseline for packets 014-018"
    blockers: []
    key_files:
      - "../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-audited.json"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004013"
      session_id: "016-004-013-summary"
      parent_session_id: "016-004-013"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/004/013 Bench Harness Hardening + Fixture Audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | COMPLETE |
| Completed | 2026-05-19 |
| Level | 1 |
| Scope | Harness hardening, fixture audit, corrected re-bench, ADR/README/spec docs |
| SpawnAgent | Not used |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The Phase 2 benchmark now has a trustworthy measurement baseline. Both bench harnesses share the same embedded `_extract_paths()` helper, the full 18-probe fixture has sqlite evidence for indexed/excluded status, and downstream packets 014-018 have a corrected comparison file to use instead of the contaminated historical `phase2-comparison.md`.

### Harness Hardening

`run-phase2-smoke.sh` and `run-extended-bake-off-with-hybrid-rerank.sh` now strip path wrappers before hit/miss scoring. The helper removes backticks, quotes, import/require/from wrappers, line ranges, and trailing punctuation; it keeps known mirror prefixes and filters non-mirror path-shaped literals unless they resolve on disk.

### Fixture Audit And Correction

`code-retrieval-fixture-audited.json` annotates all 18 probes with `_fixture_status` and `_audit_evidence`. Probe 10 is the only excluded target: the original dist JavaScript path has `vec_count=0`, `fts_count=0`, and matches `**/dist`. `code-retrieval-fixture-corrected.json` repoints probe 10 to `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`.

### Corrected Baseline

The corrected re-bench ran all three lanes against the corrected fixture:

| Lane | Corrected Result |
|---|---:|
| baseline-bge | 14/18 |
| bge-path-class | 14/18 |
| jina-v3 | 14/18 |

The delta file shows the historical 8-probe subset changed from `3/8` to `6/8` for both BGE lanes. Probe 10 is the fixture-only fix; probes 11, 14, and 18 are harness/result-extraction recoveries in the BGE lanes; probe 5 is recorded as a hit-to-miss residual risk to inspect.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh` | Modified | Harden path extraction, add fixture override/output suffix support, preserve historical artifacts |
| `../004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh` | Modified | Apply same extraction hardening to extended bake-off harness |
| `../011-rerank-model-fit-investigation/research/phase2-bench/README.md` | Modified | Document corrected fixture and canonical baseline |
| `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Append ADR-016 |
| `../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-audited.json` | Created | Annotated 18-probe fixture audit |
| `../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json` | Created | Corrected benchmark fixture |
| `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md` | Created | Corrected 18-probe benchmark result |
| `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md` | Created | Historical-vs-corrected delta analysis |
| `scratch/test_path_extraction.py` | Created | Pytest coverage for both harness helpers |
| `evidence/fixture-audit-summary.md` | Created | Human-readable sqlite audit table |
| `plan.md` | Created | Packet plan |
| `tasks.md` | Created | Packet task ledger |
| `implementation-summary.md` | Created | Completion summary and handoff |
| `description.json` | Created | Spec memory metadata |
| `graph-metadata.json` | Created | Spec graph metadata |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The implementation stayed measurement-only: no `ccc reset`, no `ccc index`, no git commit, and no changes to retrieval ranking code. The live DB was read in sqlite read-only mode with sqlite-vec loaded so the audit could count `code_chunks_vec` and `code_chunks_fts` rows directly.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Keep helper embedded in both harnesses | Existing harness callers do not need a new import path or packaging step |
| Add optional `OUTPUT_TAG` and `COMPARISON_OUTPUT` | Corrected runs can preserve historical Phase 2 artifacts by writing `-corrected` files |
| Classify fixture truth by mirror-normalized suffix | Bench hit logic already treats `.opencode`, `.claude`, `.codex`, and `.gemini` mirrors as equivalent |
| Repoint probe 10 instead of skipping | The TypeScript source is indexed and owns the same command behavior the query asks for |
| Record probe 5 as residual risk | The corrected run lost that historical hit; hiding it would make the new baseline less honest |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|---|---|
| Sequential-thinking MCP | Attempted 3 times; tool returned `user cancelled MCP tool call` each time, so planning was documented visibly instead |
| SpawnAgent | PASS: not used |
| `python -m pytest .../scratch/test_path_extraction.py -q` | PASS: 14 passed |
| `bash -n run-phase2-smoke.sh` | PASS |
| `bash -n run-extended-bake-off-with-hybrid-rerank.sh` | PASS |
| `python -m json.tool code-retrieval-fixture-audited.json` | PASS |
| `python -m json.tool code-retrieval-fixture-corrected.json` | PASS |
| Corrected re-bench | PASS: baseline-bge 14/18, bge-path-class 14/18, jina-v3 14/18 |
| `validate.sh --strict` | PASS: see final validation run |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **The sequential-thinking MCP did not execute.** The required tool call was attempted before edits and retried, but every call returned `user cancelled MCP tool call`. The work proceeded with visible planning and explicit verification rather than fabricating tool success.
2. **Probe 5 needs follow-up interpretation.** The corrected run records probe 5 as a hit-to-miss change. The delta file preserves that residual risk instead of folding it into the harness-fix claim.

## Commit Handoff

No git commit was made. Intended commit scope:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/README.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-audited.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/scratch/test_path_extraction.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/evidence/fixture-audit-summary.md`
<!-- /ANCHOR:limitations -->
