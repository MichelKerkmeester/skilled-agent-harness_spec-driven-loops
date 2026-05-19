---
title: "Spec: 016/004/013 Bench Harness Hardening + Full Fixture Audit"
description: "Measurement-quality prerequisite for the cocoindex-retrieval-pipeline future-proofing arc (013→018). Hardens the path-extraction regex in run-phase2-smoke.sh (strips backticks, import statement wrappers, mock-data literals, quoted paths) so true hits are not misclassified as misses. Then audits all 18 probes in the baseline fixture against live DB presence — flags any probe whose expected_source_path is unindexed (per CocoIndex project settings exclusions, e.g. probe 10's `**/dist` exclusion). Outputs a hardened harness + a corrected fixture (or annotated probe-status table). Without this, no downstream packet's bench result is trustworthy."
trigger_phrases:
  - "016/004/013 bench harness hardening"
  - "phase 2 path extraction regex fix"
  - "code retrieval fixture audit"
  - "probe 10 fixture truth"
  - "bench measurement quality"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit"
    last_updated_at: "2026-05-19T12:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet; first of 6-packet future-proofing arc"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for Phase 1-3 implementation"
    blockers: []
    key_files:
      - ".opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh"
      - ".opencode/specs/.../011-rerank-model-fit-investigation/research/phase2-bench/probe-subset.json"
      - ".opencode/specs/.../002-baseline-fixture/evidence/code-retrieval-fixture.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004013"
      session_id: "016-004-013"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Prerequisite for 014-018? Yes — every downstream change needs trustworthy bench measurements."
      - "Scope of fixture audit? All 18 probes in baseline fixture, plus the 8-probe Phase 2 subset."
      - "Strict mode for missing-from-DB probes? Annotate as `_fixture_excluded` rather than delete, so the historical Phase 2 bench result remains interpretable."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/013 Bench Harness Hardening + Full Fixture Audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (2026-05-19) |
| Type | Code hardening + fixture audit |
| Owner | cli-codex gpt-5.5 high fast (dispatched by main agent) |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 1 of 6 (prerequisite — measurement quality) |
| Sibling packets | 014 (mirror dedup), 015 (tree-sitter chunking), 016 (query expansion), 017 (hybrid recalib), 018 (rerank matrix re-bench) |
| Triggered by | Phase 2 bench surfaced measurement-quality defects: probe 10 expects an unindexed `.js` dist file (fixture bug, not retrieval bug); path-extraction regex misclassifies hits as misses when results contain backticks / import statements / quoted paths |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Phase 2 bench produced a verdict that DeepSeek synthesized into a recommendation, but the deep-dive surfaced TWO measurement-quality defects that undermine the verdict's reliability:

**Defect 1 — path-extraction regex too permissive**. `run-phase2-smoke.sh:139-149` extracts paths from `ccc search` output by matching `[contains "/" and "."]` tokens, then strips line-range suffixes. It does NOT strip:
- Backticks (` `` ` `): when a result line is `` `.opencode/...config.py` `` the wrapper stays in the path and the normalized form fails to match the fixture's clean path
- Import statement wrappers: `import('../../lib/structural-indexer.js')` extracts as a "path" that doesn't match
- Mock data literals: `'./measurement-fixtures.js'` is a path-shape but a mock literal, not a real top-5 hit
- Double-quoted paths

Result: true hits are misclassified as misses (probe 11 baseline-bge inspection showed exactly this — the expected `config.py` was in the result but wrapped in backticks, scored as a miss).

**Defect 2 — probe 10 fixture-truth mismatch**. Probe 10's `expected_source_path` is `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`. The CocoIndex project settings exclude `**/dist`, so this file is NOT indexed (0 vec rows, 0 FTS rows per Iter 5 sqlite forensics). The fixture expects retrieval of an impossible-to-retrieve file. **This probe cannot be a hit under ANY reranker, embedder, or pipeline change.** It's a fixture bug.

Without fixing these, every downstream packet (014-018) ships changes whose bench impact cannot be measured cleanly: Defect 1 inflates miss rates by hiding real hits, Defect 2 reserves one of every 8/18 probes as a guaranteed miss regardless of code quality.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Path-extraction regex hardening** in `phase2-bench/run-phase2-smoke.sh` (the Python heredoc, lines ~127-168). New behavior: strip backticks, single-/double-quoted wrappers, `import('...')` / `require('...')` / `from '...'` wrappers, drop tokens that don't pass a filesystem-existence check OR don't match a known mirror-prefix pattern. Backward-compatible (existing harness still works on its current outputs).
- **Same regex applied to `004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh`** (Phase 1 / extended bake-off harness — same Python heredoc, same defect).
- **Full 18-probe fixture audit** against the live DB. For each probe in `002-baseline-fixture/evidence/code-retrieval-fixture.json`: query the vec table (`SELECT COUNT(*) FROM code_chunks_vec JOIN code_chunks USING(chunk_id) WHERE file_path LIKE '%expected%'`) + FTS table to confirm the expected file is indexed. If not, classify as `_fixture_excluded` with the exclusion reason (settings.yml pattern hit, file does not exist, etc.).
- **Corrected fixture variant**: emit `code-retrieval-fixture-audited.json` with `_fixture_status: indexed|excluded|missing` annotations per probe, and a separate `code-retrieval-fixture-corrected.json` that EITHER (a) changes excluded probes' expected paths to indexed alternatives (e.g. probe 10's `.js` → `.ts` source) OR (b) drops them entirely if no defensible alternative exists. The audit decision matrix is documented per probe.
- **Re-run Phase 2 smoke bench** against the hardened harness + corrected fixture to get a CLEAN baseline that downstream packets compare against. Commit the corrected `phase2-comparison-corrected.md` as the new reference point.
- **Unit tests** for the path-extraction logic (Python pytest) covering: backtick wrapping, import wrapping, quote wrapping, mirror-prefix stripping, line-range stripping, missing-from-FS tokens.
- **Documentation**: append decision rationale to `phase2-bench/README.md` + write ADR-016 in `004-spec-memory-embedder-bake-off/decision-record.md` (or sibling decision record) documenting the harness/fixture defects + how they were resolved + the new measurement contract for downstream packets.

Out of scope:
- Pipeline changes (chunking, dedup, query expansion, hybrid weights, reranker swaps) — those are 014-018
- Fixture EXPANSION beyond the 18 probes — separate work
- mk-spec-memory side bench (this packet is CocoIndex-side only)
- Voyage/OpenAI/cloud-side reranker testing
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `run-phase2-smoke.sh` Python heredoc has a `_extract_paths(output)` helper that strips: backticks, single-/double-quoted wrappers, `import()` / `require()` / `from '...'` wrappers, line-range suffixes, trailing punctuation. Returns deduplicated list preserving rank order. |
| R2 | Path-existence sanity check: a candidate "path" that contains `/` and `.` but doesn't match any mirror-prefix pattern AND doesn't exist on filesystem is discarded. (Prevents `'./measurement-fixtures.js'` mock literals from polluting top-5.) |
| R3 | Same regex applied to `run-extended-bake-off-with-hybrid-rerank.sh` (the Phase 1 / extended bake-off harness). Backward-compat: existing CSV/JSONL output schema unchanged. |
| R4 | Pytest module `phase2-bench/test_path_extraction.py` (or sibling location) with ≥6 tests covering each wrapper pattern + edge cases (empty output, no paths, mirror prefix only, line-range only). All pass. |
| R5 | `code-retrieval-fixture-audited.json` exists with per-probe `_fixture_status` field ∈ {`indexed`, `excluded`, `missing`} + `_audit_evidence` field citing the sqlite COUNT result. |
| R6 | `code-retrieval-fixture-corrected.json` exists with excluded probes either (a) re-pointed to indexed alternatives with `_corrected_from` field documenting the original, OR (b) marked `_skip: true` with rationale. Probe 10 specifically must be re-pointed to the indexed `.ts` source OR marked skip with explicit rationale. |
| R7 | Phase 2 smoke re-run against hardened harness + corrected fixture → emit `phase2-comparison-corrected.md` with new hit/miss matrix. All 3 lanes (baseline-bge, bge-path-class, jina-v3) re-bench with same env vars as original Phase 2. |
| R8 | ADR-016 appended to `004-spec-memory-embedder-bake-off/decision-record.md` documenting: defects found, fixes applied, new measurement contract (all downstream 014-018 bench results compare against `phase2-comparison-corrected.md`). |
| R9 | `phase2-bench/README.md` updated with the corrected fixture + hardened harness usage. |
| R10 | Strict-validate PASSED on this packet. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All R1-R10 satisfied.
- `phase2-comparison-corrected.md` shows new baseline numbers (likely higher hit rate than original Phase 2 due to recovered false-misses).
- Probe 10's classification clarified: either re-pointed (with bench-validated retrieval of the `.ts` source) or marked skip with documented reason.
- Pytest path-extraction tests green.
- ADR-016 shipped + cross-linked from `phase2-bench/README.md`.
- Strict-validate PASSED.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — Path-extraction hardening (~45 min):
1. Extract the current Python heredoc's path-extraction logic into a standalone helper function.
2. Add wrapper-stripping (backticks, quotes, import/require/from), filesystem-existence sanity check (with mirror-prefix awareness so `.opencode/.../foo.py` is checked against the live FS).
3. Apply the same helper to `run-phase2-smoke.sh` AND `run-extended-bake-off-with-hybrid-rerank.sh`.
4. Pytest module exercising each wrapper pattern + edge case.

Phase 2 — Fixture audit (~30 min):
1. For each probe in `code-retrieval-fixture.json`: run a sqlite query against `target_sqlite.db` to check if `expected_source_path` (or its sibling stems) has indexed chunks. Capture COUNT + sample chunk_ids.
2. Generate `code-retrieval-fixture-audited.json` with `_fixture_status` per probe.
3. For excluded probes: read the project settings (`settings.py` + `.cocoindex_code/settings.yml`) to identify the exclusion reason; document in `_audit_evidence`.
4. Generate `code-retrieval-fixture-corrected.json` with corrective actions per excluded probe.

Phase 3 — Re-bench + documentation (~30 min):
1. Re-run `run-phase2-smoke.sh` with the corrected fixture (`FIXTURE_OVERRIDE` env var already supported).
2. Generate `phase2-comparison-corrected.md`.
3. Append ADR-016.
4. Update `phase2-bench/README.md`.
5. Run strict-validate.

Total: ~1.5-2.5 hours wall (cli-codex dispatch).
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Audit reveals more excluded probes than just probe 10**. If 3-5 probes are excluded by project settings, the corrected fixture has fewer measurable probes. Mitigation: the audit IS the deliverable; if the fixture is broken, exposing that is correct.
- **Path-existence check is slow** if run per-result. Mitigation: cache filesystem existence by (mirror-prefix, path-stem) tuple.
- **Hardened regex may over-strip**. If a legitimate path contains characters the new regex strips, we get false misses. Mitigation: pytest coverage + manual review of the new fixture corrected results.

Dependencies:
- Live `target_sqlite.db` at `.cocoindex_code/target_sqlite.db` (built under bge-code-v1 per current state)
- Existing Phase 2 bench artifacts at `phase2-bench/` (for comparison)
- Project settings at `cocoindex_code/settings.py` + `.cocoindex_code/settings.yml`
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Measurement Integrity
- The corrected harness must not overwrite historical Phase 2 artifacts.
- The fixture audit must be reproducible from live sqlite evidence, not source-tree inspection alone.
- The corrected baseline must be embedder-agnostic and usable by BGE, jina-v3, mxbai, and future reranker lanes.

### Compatibility
- Existing harness callers must keep working with default output paths.
- JSONL and CSV row schemas must remain unchanged.
- The hardened path extraction must not introduce a new packaged module dependency.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Backtick-wrapped mirror paths in `ccc search` output should count as the same file as clean fixture paths.
- `import(...)`, `require(...)`, and `from '...'` snippets should be unwrapped first, then filtered by mirror-prefix or filesystem existence.
- Mock literals such as `./measurement-fixtures.js` should not occupy top-5 measured result slots unless they resolve to a real file from the harness working directory.
- Excluded fixture targets should be annotated rather than deleted so historical results stay interpretable.
- Corrected re-bench artifacts should use explicit suffixes so a rerun does not destroy the original comparison.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY NOTES

This packet is Level 2 because measurement correctness spans shell, embedded Python, sqlite audit evidence, generated JSON fixtures, markdown decision records, and strict packet validation. It intentionally avoids a shared helper module because the two current harnesses are standalone scripts and the compatibility risk of adding import/package plumbing is higher than the duplication cost.
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- For probes whose expected file is excluded (probe 10's dist), is re-pointing to the `.ts` source the right call, or should the probe be dropped entirely? Operator decision deferred to the corrected fixture audit step — the cli-codex dispatch decides per-probe with rationale, operator reviews the corrected fixture pre-commit.
- Should the harness write a third output `phase2-comparison-baseline-vs-corrected-delta.md` showing which probes flipped due to harness fix vs fixture fix? Recommended yes; cheap; clarifies how much of the corrected-baseline improvement is measurement vs fixture.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Arc parent**: `../spec.md` (004-code-index-stack)
- **Trigger**: 011's Phase 2 bench + cocoindex-internals-deep-dive iter 5 (probe 10 fixture-truth) + iter 5 (path normalization in baseline)
- **Downstream packets that depend on this**: 014 (mirror dedup), 015 (tree-sitter chunking), 016 (query expansion), 017 (hybrid recalib), 018 (rerank matrix re-bench)
- **Phase 2 bench artifacts** that compare against: `phase2-bench/baseline-bge.results.jsonl`, `phase2-bench/jina-v3.results.jsonl`, `phase2-bench/phase2-comparison.md`
- **ADR target**: `../004-spec-memory-embedder-bake-off/decision-record.md` (ADR-016, the bench harness + fixture correction decision)
<!-- /ANCHOR:cross-links -->
