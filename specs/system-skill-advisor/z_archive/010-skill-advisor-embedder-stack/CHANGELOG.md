---
title: "Changelog: 003-skill-advisor-stack (pluggable embedder parity + writer cross-wire)"
description: "Consolidated plain-English changelog for the skill-advisor MCP server. Covers the local pluggable EmbedderAdapter layer mirroring mk-spec-memory, the jina-v3 swap operator runbook with deferred execution, INSTALL_GUIDE and README docs, the writer cross-wire that closed the read/write asymmetry and a scaffolded follow-on for shared embedder logic alignment."
trigger_phrases:
  - "003-skill-advisor-stack changelog"
  - "skill-advisor embedder parity changelog"
  - "skill-advisor pluggable layer changelog"
  - "016/003 consolidated changelog"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 003-skill-advisor-stack

> Plain-English changelog covering all 5 sub-phases of the skill-advisor embedder parity stack. Read this if you want to understand what shipped without diving into TypeScript.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/` (phase parent, 5 sub-phases, numbering skips 005)
>
> **Stack:** `.opencode/skills/system-skill-advisor/mcp_server/`. The TypeScript MCP (model context protocol) server that powers the skill recommendation tool.

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/` (Phase Parent)

### Summary

Skill-advisor was the last system in this repo still on the legacy `embeddinggemma-300m` cascade with no pluggable swap mechanism. mk-spec-memory had already moved to the new pluggable EmbedderAdapter pattern in the 002 sibling stack. CocoIndex had its own Python-side `registered_embedders.py`. Skill-advisor was the odd one out. This stack brings skill-advisor to parity by shipping a local pluggable EmbedderAdapter layer, operator documentation and the writer cross-wire that unblocks the production jina-v3 swap.

Phase 001 shipped the pluggable architecture with 6 registered embedders and dim-tagged vec tables in `skill-graph.sqlite`. Phase 002 attempted the actual jina-v3 swap and discovered an architectural mismatch: the writer path was still calling the legacy factory while the reader was already using the new layer. Rather than risk an unsupervised refactor, phase 002 shipped a comprehensive operator runbook plus a DB snapshot for rollback insurance and deferred the swap. Phase 003 documented the half-wired state honestly in INSTALL_GUIDE section 12 and the README. Phase 004 closed the read/write asymmetry by refactoring the writer to dispatch on the active pointer, then absorbed three advisories from a follow-on deep-review in a same-day cleanup commit. Phase 006 is a scaffolded follow-on to extract shared embedder logic between spec-memory and skill-advisor and align the defaults, no implementation has shipped yet.

The operator-visible payoff is that the skill recommendation tool can now run on any registered model without source edits. The honest caveat is that the production active pointer stayed on `embeddinggemma-300m` through phases 001 to 004 and any default flip to nomic-embed-text-v1.5 (the mk-spec-memory choice) would land in phase 006 if implemented.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [pluggable-architecture](./001-pluggable-architecture/) | Complete | 2026-05-17 |
| 002 | [jina-swap-and-reindex](./002-jina-swap-and-reindex/) | PARTIAL (40%) | 2026-05-17 |
| 003 | [install-guide-docs](./003-install-guide-docs/) | Complete | 2026-05-18 |
| 004 | [skill-graph-db-writer-cross-wire](./004-skill-graph-db-writer-cross-wire/) | Implemented | 2026-05-18 |
| 006 | [shared-embedder-logic-with-spec-memory](./006-shared-embedder-logic-with-spec-memory/) | Planned (scaffold only) | not yet |

> The phase numbering skips 005 by design. There is no `005-*` folder under this packet.

### Added

New subsystems and capabilities that did not exist before this stack.

#### Pluggable embedder layer (001)

Skill-advisor previously had no swap mechanism for the model that produces its semantic vectors. Changing the embedder meant editing the shared `factory.ts` cascade with a wide blast radius. Phase 001 added a local `mcp_server/lib/embedders/` folder that mirrors the 002-spec-memory-stack pattern: an `EmbedderAdapter` interface, a `MANIFESTS` registry of 6 pre-wired models (`embeddinggemma-300m`, `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `jina-embeddings-v2-base-code`, `mxbai-embed-large-v1`, `bge-m3`), two adapter implementations (Ollama HTTP plus a llama-cpp baseline shim) and a schema helper that adds `vec_metadata` plus dim-tagged `vec_<dim>` tables to `skill-graph.sqlite`.

&nbsp;

#### Operator runbook for embedder swap (002)

Phase 002 was scoped to flip the active pointer from gemma to jina-v3 and reindex. Execution surfaced an architectural mismatch (covered under Fixed below) and the phase pivoted. Instead of attempting a risky unsupervised refactor, phase 002 shipped a 200-line operator runbook at `evidence/swap-runbook.md` documenting the architectural state, the safe swap procedure (only valid after phase 004 ships) and the rollback procedure. A 4 KB database snapshot at `mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17` was captured as rollback insurance for whichever future session executes the runbook.

&nbsp;

#### Round-trip integration test (004)

The new dispatch-on-pointer writer path needed test coverage that exercised the actual SQLite write end-to-end, not just unit-level mocks. Phase 004 added `mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts`, a 4-case integration test that covers the adapter path writing to `vec_<dim>` with correct dimensions, idempotency on re-run with no source changes, the `ADAPTER-UNAVAILABLE` graceful-skip path and the legacy fallback when no pointer is set. All 4 cases pass.

### Changed

Structural or behavioural changes to existing systems.

#### Semantic-shadow lane rewired (001)

The semantic-shadow scoring lane (the part of the recommender that compares a prompt embedding against indexed skills) previously called the shared embeddings factory directly. Phase 001 rewired it to ask the new pluggable layer for the active embedder instead. Reads now flow through `getAdapter(active.name)` and respect whatever the `vec_metadata` pointer says. The legacy path is preserved as a fallback for installations that have not opted into the new layer.

&nbsp;

#### Skill-graph DB schema migration (001)

`skill-graph.sqlite` previously had no concept of dim-tagged vector tables or an active-embedder pointer. Phase 001 added an idempotent migration at init time that creates `vec_metadata` (with `active_embedder_name` and `active_embedder_dim` keys, default values `embeddinggemma-300m` and `768`) and the dim-tagged `vec_768` and `vec_1024` tables. Existing databases get the new tables on next launch without anyone having to run a manual migration step.

&nbsp;

#### Refresh-embeddings writer cross-wire (004)

The writer path was the missing half of the pluggable layer. Phase 001 wired reads but `refreshSkillEmbeddings` was still calling `createEmbeddingsProvider()` and writing into the legacy `skill_nodes.embedding` BLOB (binary-large-object) column. Phase 004 converted `refreshSkillEmbeddings` into a dispatcher that branches on whether an active pointer is set. When set the dispatcher calls a new `refreshSkillEmbeddingsViaAdapter()` helper that resolves the active manifest, calls `adapter.embed()` with the correct input type and writes vectors into the `vec_<active.dim>` table keyed by skill ID with INSERT OR REPLACE so re-runs stay idempotent. When unset the dispatcher calls `refreshSkillEmbeddingsLegacy()`, which is the original behaviour renamed and preserved unchanged.

&nbsp;

#### INSTALL_GUIDE and README docs (003)

Two skill-advisor documentation surfaces got reality-aligned updates so an operator landing on either one can understand the pluggable layer without spelunking through TypeScript. `INSTALL_GUIDE.md` gained a new section 12 ("Choosing an embedder", ~95 lines, six subsections covering the current active default, registered alternatives, swap mechanism via `setActiveEmbedder()`, operator-safe runbook reference, device-selection honesty and cross-references). The existing "Related Resources" section was renumbered from 12 to 13 and the table of contents updated. The README got a smaller pluggable-embedder subsection inside the Configuration block plus a Related Documents row pointing to the canonical embedder-pluggability narrative.

### Fixed

Specific defects and asymmetries closed by this stack.

#### Read/write asymmetry in the embedder layer (004)

After phase 001 the new layer was half-wired. Reads (semantic-shadow scoring, vector loading) went through the new path. Writes (the actual reindexing that creates the vectors) still went through the old factory and the legacy `skill_nodes.embedding` BLOB column. Setting the active pointer to `jina-embeddings-v3` at that stage would have caused a silent failure: reads would look for vectors in `vec_1024`, writes would keep filling `vec_768` (or the legacy BLOB) and semantic-shadow scoring would silently degrade to zero matches. Phase 002 caught the defect in production-readiness review. A concurrent E-grade deep-review independently flagged the same gap as P1-1 in iter-3 and P2-11 in iter-8. Phase 004 closed the asymmetry by routing writes through the same adapter layer as reads.

&nbsp;

#### Doc-versus-implementation drift on swap mechanism (003)

Earlier drafts of the install guide and README described an environment-variable swap mechanism that did not exist in the code. The actual swap surface is `setActiveEmbedder(db, name, dim)`, a database helper. Phase 003 closed the drift by documenting the real surface ("no env var, no MCP tool") and explicitly calling out the discrepancy as scar tissue so it does not regrow.

&nbsp;

#### Deep-review advisories applied same day (004)

After the initial 004 commit, a 5-iteration cli-devin SWE-1.6 deep-review returned a PASS-with-advisories verdict (0 P0, 1 P1, 2 P2). A follow-on commit applied all three advisories in one cleanup pass: P1-1 moved the dimension mismatch check from per-row to a single early-fail at the top of `refreshSkillEmbeddingsViaAdapter` so a misconfigured pointer fails fast, P2-1 clarified the outcome signalling for the `ADAPTER-UNAVAILABLE` case so callers can tell zero-work apart from zero-successful-work and P2-2 surfaced the `ADAPTER-UNAVAILABLE` warning through `console.warn` so it appears in daemon logs.

### Verification

Cross-phase tests, reviews and parity checks that gate the stack.

- **Registry and schema unit tests (001)** -- `tests/embedders/registry.vitest.ts` and `tests/embedders/schema.vitest.ts` exercise manifest lookup, the idempotent migration and the active-embedder pointer roundtrip. 4 of 4 tests pass.
- **Round-trip integration test (004)** -- `tests/skill-graph/refresh-roundtrip.vitest.ts` covers both code paths plus the two failure modes (unknown manifest, dim mismatch). 4 of 4 cases pass.
- **Build and strict-validate (001, 003, 004)** -- `npm run build` is clean and `bash validate.sh <packet> --strict` returns PASSED with 0 errors and 0 warnings on each packet.
- **Truth-checks against source on docs (003)** -- the 6 manifest entries in INSTALL_GUIDE section 12 are sourced from `registry.ts`, the default in section 12.1 is sourced from `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts` and the swap signature in section 12.3 is sourced from the `setActiveEmbedder()` signature in `schema.ts`. No invented numbers.
- **Operator runbook completeness (002)** -- `evidence/swap-runbook.md` is 200 lines, the architecture-gap analysis cites file-and-line evidence and the DB snapshot exists at the expected path.
- **F-grade deep-review on the writer cross-wire (004)** -- 5-iteration cli-devin SWE-1.6 review returned PASS-with-advisories. 0 P0, 1 P1, 2 P2. All three advisories applied in commit `ab0c7de71`.

### Files Changed

High-signal source files touched across the 5 phases.

| File | What changed |
|---|---|
| `mcp_server/lib/embedders/adapter.ts` | EmbedderAdapter interface contract (new in 001) |
| `mcp_server/lib/embedders/registry.ts` | MANIFESTS array with 6 registered embedders (new in 001) |
| `mcp_server/lib/embedders/adapters/ollama.ts` | OllamaAdapter for jina-v3 and other Ollama-hosted models (new in 001) |
| `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` | LlamaCppBaselineAdapter shim preserving the legacy provider cascade (new in 001) |
| `mcp_server/lib/embedders/schema.ts` | `vec_metadata` pointer keys and `vec_<dim>` table helpers (new in 001) |
| `mcp_server/lib/embedders/types.ts` and `index.ts` | Shared types and barrel export (new in 001) |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Migration adding the new tables at init (001) plus dispatch-on-pointer refactor of `refreshSkillEmbeddings` (004) |
| `mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Rewired to use registry dispatch instead of legacy factory (001) |
| `mcp_server/tests/embedders/registry.vitest.ts` | Adapter resolution and manifest contract tests (new in 001) |
| `mcp_server/tests/embedders/schema.vitest.ts` | Active-embedder pointer roundtrip tests (new in 001) |
| `mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` | 4-case round-trip integration test for refreshSkillEmbeddings (new in 004) |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Added section 12 "Choosing an embedder" (003) |
| `.opencode/skills/system-skill-advisor/README.md` | Added pluggable-layer subsection and cross-links (003) |
| `002-jina-swap-and-reindex/evidence/swap-runbook.md` | 200-line operator runbook with architecture context and rollback procedure (new in 002) |
| `mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17` | 4 KB DB snapshot for rollback insurance (new in 002) |

### Follow-Ups

- **Phase 006 has not shipped.** The packet is a scaffold only (spec, plan, tasks present). It plans to extract a shared embedder factory between `mk-spec-memory` and `skill-advisor` and align skill-advisor's active default to spec-memory's nomic choice. A follow-on session needs to execute the extract + align work.
- **Production pointer still on gemma.** Phases 001 to 004 shipped the infrastructure but no one has run the phase 002 runbook yet. The skill-advisor active pointer is still `embeddinggemma-300m`. An operator can now safely execute the runbook against any environment where phase 004's writer cross-wire is deployed.
- **Legacy BLOB column not removed.** `skill_nodes.embedding` is still populated by the legacy path for installations without an active pointer. A future cleanup packet should drop the column once all consumers move to the dim-tagged tables.
- **Documentation parity with mk-spec-memory.** INSTALL_GUIDE section 12 describes 6 registered embedders. mk-spec-memory's equivalent ships 8 (per its current registry). The two should converge once phase 006 extracts the shared logic.
- **Numerical-claim audit cadence.** Phase 003 caught one drift (env-var promise that did not exist) by truth-checking against source. A periodic re-audit of section 12's claim list against the live `registry.ts` and `schema.ts` would catch future drift before it ships.
