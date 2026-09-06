# Deep Research Synthesis — system-spec-kit Code Standards Audit (r2)

**Lineage:** deepseek-v4-flash-code-standards-r2 | **Session:** fanout-deepseek-v4-flash-code-standards-r2-1788688046281-s8w696 | **Generation:** 1

## 1. Overview

Read-only, evidence-based audit of `.opencode/skills/system-spec-kit/shared/**` and `.opencode/skills/system-spec-kit/runtime/**` (excluding `node_modules/` and `dist/`) against this repo's code standards (sk-code-opencode, sk-code-quality, universal code-quality-standards). This is the **r2** lineage: the two prior passes already inventoried and fixed a broad deviation set (see the orchestrator's "already found and fixed" list), so this lineage scoped to the remaining priority surfaces and ran exactly 5 iterations (config.maxIterations, stopPolicy `max-iterations`). Output is a citation-complete deviation inventory feeding a remediation packet. Audit-only; no code was edited.

## 2. Methodology

One priority surface per iteration, reading the relevant standard clause before the code and verifying claims by direct source read + repo-wide import/test grep:

| Run | Surface | Angle |
|-----|---------|-------|
| 1 | `runtime/cli/core/` + `runtime/cli/extractors/` (TS) | error handling, dead exports, duplicate helpers, naming, coverage floor |
| 2 | `runtime/cli/{spec-folder,continuity,graph,templates,utils}/` (TS) | boundary, naming, coverage, duplicated helpers |
| 3 | `runtime/cli/rules/*.sh` + `runtime/cli/spec/*.sh` | exit codes, quoting, sourcing, documented vs parsed flags, dead helpers |
| 4 | `runtime/hooks/lib`, `runtime/hooks/pi`, spec-gate `.mjs` adapters | runtime parity, swallowed errors, path handling, hook conventions |
| 5 | `shared/**` (algorithms, contracts, ranking, scoring, chunking, predicates, embeddings) | dead code, boundaries, coverage floor, retired residue |

## 3. Findings (11 total: 4 P1, 7 P2)

### 3.1 P1 — duplicate helpers (4)

- **F1.1** `runtime/cli/core/quality-scorer.ts:140` / `runtime/cli/extractors/quality-scorer.ts:105` — two `quality-scorer.ts` modules export the same-named `scoreMemoryQuality` with divergent logic (legacy 8-param vs `QualityInputs`-based). The legacy core export is referenced only by tests (`tests/quality-scorer-disambiguation.vitest.ts:9`, `tests/description-enrichment.vitest.ts:3`); production `core/workflow.ts:40` uses the extractors one. Clause: `typescript/style-guide/overview-strict-and-naming.md` §5; `shared/code-organization/imports-and-exports.md` §1.
- **F2.1** `runtime/cli/graph/backfill-graph-metadata.ts:240` / `runtime/cli/graph/migrate-generated-json.ts:149` — byte-identical local `resolveRepoRoot()`, plus a divergent constant-anchored pair at `runtime/cli/continuity/migrate-trigger-phrase-residual.ts:181` and `continuity/backfill-frontmatter.ts` (4 root resolvers in the cli package; no canonical `@spec-kit/shared`/`runtime/lib` root resolver exists). Clause: `imports-and-exports.md` §1; `universal/code-quality-standards.md` §7 rung 4.
- **F2.2** *(coverage)* see §3.2.
- **F4.1** `runtime/hooks/cursor/spec-gate-classify.mjs:26-43` and `runtime/hooks/devin/spec-gate-classify.mjs:29,42` — reimplement `readStdin()` + inline fail-open `JSON.parse`, while `claude/spec-gate-classify.mjs:22-23` and `codex` import `parseJsonFailOpen, readStdin` from `../lib/hook-adapter-shared.mjs` (which exists precisely to dedupe this; see its header). Clause: `imports-and-exports.md` §1; `universal/code-quality-standards.md` §7 rung 4.

### 3.2 P1 — coverage floor (1)

- **F2.2** `runtime/cli/utils/fact-coercion.ts:26,104` — live public coercion util consumed by 5 extractors and barreled at `utils/index.ts:62-69`, with a non-trivial drop path (nullish, object-shaped, unserializable object), but **no focused happy-path/edge test reference** in `runtime/cli/tests`. Clause: `universal/code-quality-standards.md` §4 P1#2.

### 3.3 P2 — dead / vestigial code (4)

- **F1.2** `runtime/cli/core/memory-indexer.ts:9-26` — retired type-only stub; exported `IndexingStatusValue`/`WorkflowIndexingStatus` imported nowhere and not barreled; module body documents the wrappers as retired.
- **F1.3** `runtime/cli/extractors/session-activity-signal.ts:5` — redundant re-export shim duplicating `extractors/index.ts:14`; no importer; `extractors/README.md:74` lists the shim as a module though the real definition lives in `lib/`.
- **F3.1** `runtime/cli/spec/progressive-validate.sh:172` — `log_suggest()` defined but never invoked (repo-wide zero references).
- **F5.1** `shared/embeddings/providers/ollama.ts:425` (`__ollamaProviderTestables`) and `shared/parsing/secret-scrubber.ts:246` (`__secretScrubberTestables`) — exported test-only helpers with zero in-repo test consumer, while the family pattern (`__embeddingCircuitTestables`, `__hfLocalProviderTestables`) is consumed.

### 3.4 P2 — structure / naming / shell (3)

- **F3.2** `runtime/cli/rules/check-files.sh:20-51` + siblings — inconsistent standalone-entry across the `rules/` family: only some rules guard `run_check "$@"` behind `BASH_SOURCE[0] == "$0"` (`check-template-source.sh:100-103`), while unguarded rules document `# Exit codes: 0 - Success` even though a direct run is a silent no-op.
- **F4.2** `runtime/hooks/cursor/spec-gate-classify.mjs:6-19,75-76` — documented dormant (`beforeSubmitPrompt` never fires) and emitting a divergent `permission`/`agent_message` output shape vs siblings' `hookSpecificOutput`/`additionalContext`.
- **F5.2** `shared/ranking/matrix-math.ts:18,38,63,85,104` — no co-located `shared/ranking/*.test.ts`; the five helpers are covered only transitively via `learned-combiner` (tests live in `runtime/tests/`), so low-level edge cases (singular matrix, dimension mismatch) are not isolated.

## 4. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| `core/quality-scorer.ts` snake_case dimension keys = naming violation | reason codes / memory-metadata field names under the documented snake_case exception | `source:runtime/cli/core/post-save-review.ts:108` | 1 |
| `@spec-kit/runtime/api` + `@spec-kit/shared/*` imports in spec-folder/continuity/utils = boundary break | package-alias boundary-compliant; no `dist/` import | `source:runtime/cli/spec-folder/generate-description.ts:27` | 2 |
| `run_check` (defined, never locally called) = dead code | loader-contract entry point invoked by validate.sh and tests | `source:runtime/cli/tests/test-validation-extended.sh:616-623` | 3 |
| `rc=20/21` in `check-graph-metadata-child-drift.sh` = shell exit-code deviation | inline Node subprocess exit codes, documented internal contract | `source:runtime/cli/rules/check-graph-metadata-child-drift.sh:141-145` | 3 |
| `catch (_) {}` in `spec-gate-core.mjs` = swallowed errors | documented fail-open path; header states every entrypoint fails OPEN | `source:runtime/hooks/lib/spec-gate/spec-gate-core.mjs` header + `:377` | 4 |
| `providers/ollama.ts` + `adapters/ollama.ts` coexistence = duplication | documented two-layer design (`IEmbeddingProvider` providers vs `EmbedderAdapter` adapters) | `source:shared/embeddings/providers/README.md` + `adapters/README.md` | 5 |
| `shared/ipc/socket-server.ts` = unimported/retired | live, imported by the MCP server | `source:system-skill-advisor/mcp-server/lib/ipc/socket-server.ts:16` | 5 |
| Blanket snake_case scan in core/extractors = naming detector | returns only contract/domain-mapped keys | `source:runtime/cli/core/post-save-review.ts:447` | 1 |

## 5. Confirming Baselines (no-finding)

- Every `rules/*.sh` and `spec/*.sh` script (42 total) has `set -euo pipefail`; all `source` paths quoted; no bash `exit`/`return` outside 0/1/2/126/127; `calculate-completeness.sh` and `archive.sh` document exactly the flags they parse.
- No `any`, empty `catch {}`, non-`unknown` catch param, or `process.exit`/`console.log` in `core/` and `extractors/`.
- No `dist/`-path import or snake_case declaration in `spec-folder/`, `continuity/`, `graph/`, `templates/`, `utils/`.
- The embeddings providers and IPC subsystem are live and correctly layered.

## 6. Open Questions

- Whether the four local root resolvers (`resolveRepoRoot`/constant-anchored) intentionally diverge, or a single shared resolver should be introduced.
- Whether `matrix-math.ts`'s five helpers need a direct edge-case test or transitives coverage is deemed sufficient.

## 7. Recommendations

1. Resolve the `scoreMemoryQuality` name collision (F1.1) — rename the legacy export or fold description-provenance into the canonical scorer.
2. Consolidate the repo-root resolver (F2.1) into one shared util and update `graph/` + `continuity/`.
3. Unify the spec-gate classify adapters on `hook-adapter-shared.mjs` (F4.1).
4. Add a focused test for `fact-coercion.ts` (F2.2).
5. Remove the dead/vestigial items (F1.2, F1.3, F3.1, F5.1) and normalize the rules standalone-entry pattern (F3.2).

## 8. Convergence Report

- **Stop reason:** `maxIterationsReached` (config.stopPolicy = `max-iterations`, cap 5).
- **Total iterations:** 5.
- **Questions answered / total:** 5 / 5.
- **Findings:** 11 (4 P1, 7 P2); 5 confirming baselines.
- **newInfoRatio trend:** 0.90 → 0.80 → 0.40 → 0.55 → 0.30 (convergence threshold 3 treated as telemetry only, per the human instruction to broaden review angles rather than synthesize early).
- **Quality guards:** source diversity satisfied (5 distinct source surfaces), focus alignment satisfied (one surface per iteration), no single-weak-source threshold triggered.

## 9. References

Standards consulted: `sk-code-opencode/references/{typescript,shell,shared}/**`; `sk-code-quality/SKILL.md`; `shared/references/universal/code-quality-standards.md`. Iteration evidence: `iterations/iteration-001.md` … `iteration-005.md`; state: `deep-research-state.jsonl`. `resource-map.md` not present at init; coverage gate skipped.
