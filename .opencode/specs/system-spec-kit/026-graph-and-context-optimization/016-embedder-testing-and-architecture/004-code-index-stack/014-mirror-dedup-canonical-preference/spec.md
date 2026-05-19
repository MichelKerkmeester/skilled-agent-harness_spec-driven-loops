---
title: "Spec: 016/004/014 Mirror Dedup with Canonical Preference"
description: "Hardens CocoIndex's _dedup_and_rank_hybrid_rows() so the 4 runtime mirrors (.opencode/.codex/.gemini/.claude) collapse to ONE canonical representative before the rerank window is selected. Operator-configurable canonical mirror via COCOINDEX_CANONICAL_MIRROR (default .opencode). Eliminates redundant rerank slots, gives every embedder + reranker a cleaner candidate set, addresses the mirror-pollution failure mode documented in 011/research iter 2 + iter 5. Embedder-agnostic, reranker-agnostic, future-proof for any new mirror that gets added."
trigger_phrases:
  - "016/004/014 mirror dedup"
  - "canonical mirror preference"
  - "cocoindex mirror collapse"
  - "rerank window mirror pollution"
  - "COCOINDEX_CANONICAL_MIRROR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference"
    last_updated_at: "2026-05-19T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented mirror-aware dedup, tests, bench evidence, ADR, and docs"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004014"
      session_id: "016-004-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Why is this needed if corrected bench shows 14/18 already? It's still an architectural defect — 4 copies of every mirrored file means up to 75% of rerank slots are redundant in worst case, and any future packet (015 chunking, 016 query expansion) gets noisier signals without it. Future-proof move."
      - "Canonical mirror configurable? Yes — COCOINDEX_CANONICAL_MIRROR env var (default '.opencode'). Operators on Codex/Gemini/Claude installations can change."
      - "Where does collapse happen? Before rerank-window selection. _dedup_and_rank_hybrid_rows() in query.py is the existing hook point."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/014 Mirror Dedup with Canonical Preference

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (2026-05-19) |
| Type | Code hardening — query.py + config.py + tests |
| Owner | cli-codex gpt-5.5 high fast (dispatched by main agent) |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 2 of 6 (architectural cleanup; prerequisite for 015 chunking and 016 query expansion) |
| Sibling packets | 013 (bench harness — shipped), 015 (tree-sitter chunking), 016 (query expansion), 017 (hybrid recalib), 018 (rerank matrix re-bench) |
| Triggered by | 011/research/cocoindex-internals-deep-dive iter 2 confirmed 4 mirrors (.opencode/.codex/.gemini/.claude) get indexed identically with same content_hash + line range + path_class. Iter 5 documented the rerank window having `.gemini/.../structural-indexer.ts` competing with `.gemini/.../indexer-types.ts` — different files but same mirror. Whatever dedup runs currently isn't sufficient to canonicalize mirror representatives. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex indexes every project file under 4 runtime mirror prefixes — `.opencode/`, `.codex/`, `.gemini/`, `.claude/`. These mirrors are byproducts of multi-runtime support (Claude Code, OpenCode, Codex, Gemini all see the same `.opencode/skills/<X>` content through their own prefix). They share:

- **Identical content** (hashes match per Iter 2 sqlite forensics)
- **Identical line ranges** (chunked identically)
- **Identical `path_class`** (all classified as `implementation`)
- **Different `file_path` strings** (only the prefix differs)

The existing `_dedup_and_rank_hybrid_rows()` in `query.py:481-515` is supposed to collapse aliases, but Phase 2 bench artifacts show 4-mirror sets in the rerank window for several probes. Either the dedup keys don't span mirror prefixes, or the dedup runs after the rerank-window cut.

Consequences:
1. **Up to 75% of rerank slots are redundant**: if `structural-indexer.ts` enters dense top-20 via all 4 mirrors, 4 of 20 slots are duplicates.
2. **Diversity loss**: the rerank window shows the same file 4 ways instead of 4 different files, harming top-5 diversity for the user.
3. **Future-proofing risk**: any new mirror (e.g. `.cursor/`, `.windsurf/`) makes the problem worse.
4. **Downstream pollution**: 015 (chunking) and 016 (query expansion) will produce noisier signals as long as mirrors compete for the same rank.

The fix is canonical-mirror preference: configure a canonical mirror prefix (default `.opencode/`), and during dedup keep only the canonical-mirror copy when multiple mirrors of the same file are in the candidate set. Falls back to dropping by content_hash + path-stem when canonical-mirror copy is absent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **New config var `COCOINDEX_CANONICAL_MIRROR`** in `config.py` — string, default `'.opencode'`. Valid values: `.opencode`, `.codex`, `.gemini`, `.claude`, or any custom mirror prefix the operator names. Validation: must be a recognized mirror or end with `/`. Document the contract.
- **Mirror-aware dedup keys** in `_dedup_and_rank_hybrid_rows()` (`query.py:481-515`). Two-pass dedup:
  - Pass 1: collapse exact-duplicate mirror groups. For each file with multiple mirror representatives in the candidate set, keep only the canonical-mirror copy (drop the others). If the canonical isn't present, keep the first non-canonical encountered. Tie-break by chunk_id stability.
  - Pass 2: existing content_hash + line-range dedup runs as before, covering non-mirror collision cases.
- **Path-stem helper** in `indexer.py` or a sibling helper module (or extend `classify_path`'s helper module): `extract_path_stem(file_path: str, mirror_prefixes: set[str]) -> str` returns the path with mirror prefix stripped. Reused by both dedup logic and downstream packets (015, 016).
- **Recognition of all 4 known mirrors** as default mirror prefixes: `.opencode/`, `.codex/`, `.gemini/`, `.claude/`. Operator can extend via `COCOINDEX_MIRROR_PREFIXES` (JSON list, default = these 4).
- **Bench gate**: after the fix, re-run the 18-probe corrected bench (via `run-phase2-smoke.sh` against `code-retrieval-fixture-corrected.json`) for the 3 lanes (baseline-bge, bge-path-class, jina-v3). Compare to the 13-shipped baseline `phase2-comparison-corrected.md`. Expectation: hit rate IS unchanged OR slightly improves (mirror collapse shouldn't hurt; might help by giving rerank more diverse top-K).
- **Test coverage** in `mcp_server/tests/test_query.py` (or a new `test_dedup_mirrors.py`): ≥5 tests covering:
  - 4-mirror collapse → 1 canonical kept
  - Canonical absent → first encountered kept
  - Mixed mirror + non-mirror same-stem files → only mirror copies collapse, non-mirror standalone preserved
  - Empty candidate set
  - Single candidate (no dedup needed)
- **Documentation**: append ADR-017 to `004-spec-memory-embedder-bake-off/decision-record.md` documenting the mirror-collapse design + canonical-mirror policy. Update `cocoindex_code/README.md` if it documents dedup behavior. Cross-link from `phase2-bench/README.md`.

Out of scope:
- Tree-sitter chunking (that's 015)
- Query expansion (that's 016)
- Rerank window size changes (out of arc)
- mk-spec-memory side mirror handling (different codebase, different stack)
- Adding new mirrors (Cursor/Windsurf/etc.) — operator decision, just ensure config-extensibility supports it
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `COCOINDEX_CANONICAL_MIRROR` env var added to `config.py` with default `.opencode`. Loaded via existing parser pattern. Validation rejects empty / whitespace-only with logged warning, falls back to default. |
| R2 | `COCOINDEX_MIRROR_PREFIXES` env var added (JSON list, default `[".opencode/", ".codex/", ".gemini/", ".claude/"]`). Parsed via existing `_parse_json_string_list_env` helper. Trailing slash normalized. |
| R3 | `extract_path_stem(file_path, mirror_prefixes)` helper exists (location of operator's choice — `cocoindex_code/path_utils.py` recommended). Strips any matching mirror prefix; returns original path if no mirror matches. Pure function, easy to test. |
| R4 | `_dedup_and_rank_hybrid_rows()` in `query.py` updated to run mirror-collapse pass before existing content_hash+line dedup. Mirror-collapse selects canonical-mirror copy when present, else first non-canonical encountered. Backward compatible: with empty `COCOINDEX_MIRROR_PREFIXES` or single-mirror corpora, behavior is unchanged. |
| R5 | ≥5 unit tests in `mcp_server/tests/test_query.py` (or sibling) covering the cases listed in §3 SCOPE. All pass under `.venv/bin/python -m pytest mcp_server/tests/test_query.py`. |
| R6 | Re-run the corrected 18-probe bench against the new dedup logic: `bash phase2-bench/run-phase2-smoke.sh` with `FIXTURE_OVERRIDE=...corrected.json OUTPUT_TAG=-014-dedup`. Output saved as `phase2-comparison-014-dedup.md` in `014-mirror-dedup-canonical-preference/evidence/`. Compare against shipped `phase2-comparison-corrected.md`. |
| R7 | Hit rate is unchanged (14/18) or higher; NO regression on any probe. p95 latency delta < 10% from corrected baseline. If regression, investigate before commit; if hit-rate stays at 14/18, that's fine — the win is architectural cleanliness + future-proofness for downstream packets. |
| R8 | ADR-017 appended to `016/002/004-spec-memory-embedder-bake-off/decision-record.md`: canonical-mirror policy, default `.opencode`, env-var configurability, dedup pass ordering, rollback path (set `COCOINDEX_MIRROR_PREFIXES='[]'` to disable). |
| R9 | Strict-validate PASSED on the 014 packet. |
| R10 | Existing `test_reranker.py` + `test_rerankers_jina_v3.py` + other query-related tests still pass — zero regression from the dedup change. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1-R10 satisfied.
- Mirror-collapse demonstrably reduces redundant candidates in the rerank window (verifiable via rerank-scores JSONL: fewer `.gemini/` + `.codex/` + `.claude/` entries when `.opencode/` is canonical and present).
- 18-probe bench hit rate unchanged or improved.
- Zero regression on existing pytest suite.
- ADR-017 shipped.
- Strict-validate PASSED.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — config + helpers (~30 min):
1. Add `COCOINDEX_CANONICAL_MIRROR` + `COCOINDEX_MIRROR_PREFIXES` to `config.py` with validation. Defaults: `.opencode` + 4-mirror list.
2. Create `cocoindex_code/path_utils.py` (or extend existing helper module) with `extract_path_stem()` + `is_mirror_path()` + `select_canonical_mirror_copy()`. Pure functions, no I/O.
3. Unit tests for the helpers (separate from query.py tests).

Phase 2 — query.py integration (~30 min):
1. Update `_dedup_and_rank_hybrid_rows()` to call mirror-collapse pass BEFORE existing dedup.
2. Group candidates by path-stem. For each group with ≥2 entries from different mirror prefixes, keep canonical copy if present else first non-canonical.
3. Preserve existing dedup semantics for non-mirror cases.

Phase 3 — bench gate (~30 min):
1. Restart daemon to pick up config changes.
2. Re-run `run-phase2-smoke.sh` with `FIXTURE_OVERRIDE` + `OUTPUT_TAG=-014-dedup`.
3. Diff against `phase2-comparison-corrected.md`. Annotate any deltas.

Phase 4 — docs + validate (~15 min):
1. ADR-017 append.
2. Update `cocoindex_code/README.md` dedup section if present.
3. Cross-link from `phase2-bench/README.md`.
4. Write `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` per canonical L2 template.
5. Run strict-validate. Iterate until PASS.

Total: ~1.5-2 hours wall.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Canonical-mirror choice affects all queries**: if operator's runtime is Codex (not Claude), `.opencode/` canonical is still correct (it's the canonical source-of-truth directory). The mirror prefixes are runtime artifacts. Risk: operator confusion. Mitigation: clear ADR + README docs.
- **Dedup over-collapses**: if a NON-mirror file happens to have the same content_hash + same path-stem as a mirror file (vanishingly rare), it'd be collapsed. Mitigation: require BOTH file_path-starts-with-mirror-prefix AND content_hash match to collapse.
- **Existing tests may rely on multi-mirror candidate sets**. Mitigation: run full test suite; fix or update tests that assumed multi-mirror behavior.
- **Bench non-determinism noted in 013** (probe 5 variance): may make exact hit-rate comparison hard. Mitigation: run 014 bench 2× and use the better-or-tied result; if variance dominates, document.

Dependencies:
- 013 shipped (hardened harness + corrected fixture). REQUIRED — bench gate uses corrected fixture.
- Live `target_sqlite.db` at `.cocoindex_code/target_sqlite.db` (built under bge-code-v1).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Mirror collapse must not add material query latency; Phase 2 bench p95 stays within 10% of the 013 corrected baseline.
- **NFR-P02**: Helper functions stay linear over the candidate set and configured prefix count.

### Reliability
- **NFR-R01**: Existing source-realpath/content-hash plus line-range dedup remains unchanged after mirror collapse.
- **NFR-R02**: `COCOINDEX_MIRROR_PREFIXES='[]'` disables mirror collapse cleanly after daemon restart.

### Compatibility
- **NFR-C01**: Dedup remains embedder-agnostic and reranker-agnostic.
- **NFR-C02**: Custom mirror prefixes are supported through JSON env config without code changes.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Empty candidate set**: returns no results and `dedupedAliases=0`.
- **Single candidate**: passes through unchanged.
- **Canonical absent**: keeps the first ranked mirror copy.
- **Mixed mirror and non-mirror same stem**: collapses only mirror aliases; non-mirror files remain eligible for Pass B.
- **Empty mirror prefix list**: skips Pass A entirely.
- **Multiple chunks from one mirrored file**: chunks are not collapsed together unless their existing dedup keys also match.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|------:|-------|
| Scope | 18/25 | Config, helper module, query hook, tests, README, ADR, packet docs |
| Risk | 16/25 | Query ranking behavior changes, but rollback env and full tests reduce blast radius |
| Research | 14/20 | Existing deep-dive and corrected baseline evidence are available |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should dedup ALSO collapse non-mirror duplicate-content files (e.g., a vendored library copied in two places)? Recommended: NO — that's a separate concern. Mirror dedup is the only addition; existing content_hash dedup handles vendor cases.
- Should we add a `COCOINDEX_DEDUP_LEVEL` knob to choose strictness (off / mirror-only / mirror+content)? Recommended: NO for this packet — start with mirror-only collapse, layer additional levels in a follow-on if probe analysis warrants.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Arc parent: `../spec.md` (004-code-index-stack)
- Predecessor packet (shipped): `../013-bench-harness-and-fixture-audit/` (hardened harness + corrected fixture)
- Trigger evidence: `../011-rerank-model-fit-investigation/research/cocoindex-internals-deep-dive/iterations/iteration-002.md` (4-mirror confirmation), `iteration-005.md` (rerank-window mirror pollution)
- Successor packets: 015 (tree-sitter chunking — depends on extract_path_stem helper), 016 (query expansion — also uses the helper)
- ADR target: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` (append ADR-017)
- Baseline bench result: `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md`
<!-- /ANCHOR:cross-links -->
