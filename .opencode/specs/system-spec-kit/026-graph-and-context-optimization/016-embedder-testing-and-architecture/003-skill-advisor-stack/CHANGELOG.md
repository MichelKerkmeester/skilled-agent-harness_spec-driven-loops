---
title: "Changelog: 003-skill-advisor-stack (skill-advisor pluggable embedder architecture)"
description: "Plain-English changelog of all code changes in the skill-advisor stack. Covers the pluggable EmbedderAdapter layer, jina-v3 swap runbook, INSTALL_GUIDE docs, and skill-graph-db writer cross-wire."
---

# Changelog: 003-skill-advisor-stack

> **Plain-English summary of code changes** to the skill-advisor MCP server. Read this if you want to know what shipped without diving into TypeScript.

Skill-advisor used to be the odd one out in this repo. While `mk-spec-memory` had moved to a clean pluggable-embedder layer (you could swap which model produced its semantic vectors without rewriting code), skill-advisor was still hard-wired to the old shared cascade and stuck on the default `embeddinggemma-300m` model. This stack brings skill-advisor up to the same pattern, ships the operator runbook for a future swap to `jina-embeddings-v3`, documents how the new mechanism works, and closes the read-write asymmetry that the architecture audit caught mid-swap.

The work landed in four sub-phases. The first two were authored on 2026-05-17. The last two landed back-to-back on 2026-05-18 because phase 002's swap execution discovered a missing piece (the writer was still calling the old factory) and we needed phase 004 to ship before the swap was safe to run.

---

## v1.0 — Pluggable EmbedderAdapter layer (003/001)

**Shipped:** 2026-05-17
**Commit:** `ed5eb0e56` — `feat(016/010/001): skill-advisor pluggable embedder architecture mirroring 016`

### What changed

A new `mcp_server/lib/embedders/` folder was added inside the skill-advisor MCP server. It mirrors the same shape that `mk-spec-memory` uses, with five things working together:

- An **adapter interface** (`adapter.ts`) that any embedder backend must implement. The contract is small on purpose: an adapter has a name, a dimension, and a method that turns text into a vector.
- A **registry** (`registry.ts`) holding six pre-wired model manifests: `embeddinggemma-300m`, `jina-embeddings-v3`, `nomic-embed-text-v1.5`, `jina-embeddings-v2-base-code`, `mxbai-embed-large-v1`, and `bge-m3`. Each manifest names the backend (Ollama or the llama-cpp baseline) and the dimension the model produces.
- Two **adapter implementations** under `adapters/`: `ollama.ts` (talks to a local Ollama daemon) and `llama-cpp-baseline.ts` (preserves the legacy shared-provider cascade as a fallback).
- A **schema helper** (`schema.ts`) that adds two new SQLite tables to `skill-graph.sqlite`: a `vec_metadata` pointer table that records which embedder is currently active, and dim-tagged tables (`vec_768` for gemma, `vec_1024` for jina-v3) where the actual vectors live keyed by skill ID.
- A **type module** (`types.ts`) and a **barrel export** (`index.ts`) so consumers can pull the whole layer from a single import path.

The default pointer is `embeddinggemma-300m` so that fresh installations keep behaving the way they did before this change. The semantic-shadow scoring lane (the part of the recommender that compares your prompt embedding against the indexed skills) was rewired to ask the new layer for the active embedder instead of calling the old factory directly.

Two new test files (`tests/embedders/registry.vitest.ts` and `tests/embedders/schema.vitest.ts`) exercise the registry shape and the idempotent migration so future contributors do not accidentally break the manifest contract.

### Why it matters

Before this, swapping the model that produces skill-advisor's semantic vectors meant editing the shared cascade, which has a wide blast radius across the repo. After this, swapping the model is a small one-line database call (set the active pointer) plus a reindex. Operators can experiment with a different embedder for skill recommendation without touching anyone else's code path. It also gets skill-advisor onto the same pattern as `mk-spec-memory` and CocoIndex, which makes the system as a whole easier to reason about and easier to extend.

The migration is idempotent and runs as part of the normal skill-graph init, so existing databases get the new tables on next launch without anyone having to run a manual migration step.

### Files affected

- New: `mcp_server/lib/embedders/adapter.ts` (interface), `registry.ts` (6 manifests), `schema.ts` (vec_metadata + vec_<dim> migrations), `types.ts`, `index.ts` (barrel)
- New: `mcp_server/lib/embedders/adapters/ollama.ts`, `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`
- Modified: `mcp_server/lib/scorer/lanes/semantic-shadow.ts` — rewired query embedding through the new layer
- Modified: `mcp_server/lib/skill-graph/skill-graph-db.ts` — added the schema migrations at init time
- New: `mcp_server/tests/embedders/registry.vitest.ts`, `mcp_server/tests/embedders/schema.vitest.ts`

### Known limitations at this point

- The new layer is half-wired. Reads (semantic-shadow scoring, vector loading) go through the new path. Writes (the actual reindexing that creates the vectors) still go through the old factory and the old `skill_nodes.embedding` BLOB column. Setting the active pointer to `jina-embeddings-v3` at this stage would silently leave `vec_1024` empty. Phase 002 caught this; phase 004 fixed it.

---

## v1.1 — Jina-v3 swap operator runbook (003/002, PARTIAL)

**Shipped:** 2026-05-17
**Commit:** `105250e5f` — `docs(010/002): runbook + architecture-gap analysis — PARTIAL (40%)`

### What changed

This phase was originally scoped to flip the active embedder pointer to `jina-embeddings-v3`, reindex `skill-graph.sqlite` with the new model, and smoke-test that the semantic-shadow scoring lane still returned sane recommendations. Phase 001 had shipped the pluggable layer, so on paper this was supposed to be a small follow-on.

In practice, the execution surfaced an architectural mismatch the moment we tried to do it. Inspecting `skill-graph-db.ts` revealed that the writer path (`refreshSkillEmbeddings`) was still calling the old `createEmbeddingsProvider()` factory and writing into the legacy `skill_nodes.embedding` BLOB column, while the reader path (`loadSkillEmbeddings`) was already using the new `vec_<active.dim>` tables when a pointer was set. The old factory does not understand the Ollama backend that `jina-embeddings-v3` requires, so flipping the pointer would have caused a silent failure: reads would look for vectors in `vec_1024`, writes would keep filling `vec_768` (or the legacy BLOB), and semantic-shadow scoring would degrade to zero matches for everyone.

A concurrent E-grade deep-review independently caught the same defect from a different angle (logged as P1-1 in the iter-3 findings and P2-11 in the iter-8 findings). Two reviewers, two perspectives, the same finding gave us high confidence the gap was real and not a phantom.

Rather than attempt a risky load-bearing refactor during the autonomous overnight session, the main agent shipped three things:

1. **A comprehensive operator runbook** at `002-jina-swap-and-reindex/evidence/swap-runbook.md` (~200 lines). The runbook documents the architectural state, the safe swap procedure that becomes valid once 004 ships, the rollback procedure, and explicit cross-references to the deep-review findings that surfaced the gap.
2. **A database snapshot** at `mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17` (4KB) as rollback insurance for whichever future session executes the runbook.
3. **A scaffolded follow-on packet** (003/004) targeting the writer cross-wire as a single-file refactor with its own deep-review.

### Why it matters

This is the unglamorous-but-important kind of release. No code shipped, no behavior changed, but the runbook makes the swap repeatable and the analysis prevents anyone from flipping the pointer and breaking the semantic-shadow lane in production. It also documents the read-write asymmetry as a known architectural debt so future contributors do not have to rediscover it from scratch.

The packet completed at 40% because the runbook and the analysis shipped but the swap itself did not. Phase 004 unblocked execution on 2026-05-18; the runbook is now safe to follow.

### Files affected

- New: `002-jina-swap-and-reindex/evidence/swap-runbook.md` (~200 lines, operator-grade)
- New: `mcp_server/database/skill-graph.sqlite.snap-pre-jina-2026-05-17` (4KB DB snapshot)
- Modified: `002-jina-swap-and-reindex/implementation-summary.md` — recorded the architecture-gap discovery and the deferral decision

### Gotcha worth remembering

The phase shipped as PARTIAL because the runbook is operator-discipline only. No production active-pointer change happened in this commit. The default embedder remains `embeddinggemma-300m` until an operator runs the runbook against a server that has phase 004's writer cross-wire shipped.

---

## v1.2 — INSTALL_GUIDE and README docs (003/003)

**Shipped:** 2026-05-18
**Commit:** `e5daebb03` — `docs(010/003): skill-advisor INSTALL_GUIDE + README pluggable layer docs`

### What changed

Two skill-advisor documentation surfaces got reality-aligned updates so an operator landing on either one can understand the pluggable embedder layer without spelunking through TypeScript.

**INSTALL_GUIDE.md** got a new section 12 titled "Choosing an embedder", roughly 95 lines, broken into six subsections:

- **12.1 Current active default** spells out that `embeddinggemma-300m @ 768d via llama-cpp` is the production pointer and that `jina-embeddings-v3` is registered but not yet active. It also names the half-wired read/write split so a reader understands why the flip is deferred.
- **12.2 Registered alternatives** lists all six manifests in a table with name, dimension, backend, Ollama tag or GGUF path, max input length, and notes. The table is sourced directly from `registry.ts` so the values are not invented.
- **12.3 Swap mechanism** documents `setActiveEmbedder(db, name, dim)` as the canonical surface. The phrasing is explicit: this is a database helper, not an environment variable, and not an MCP tool. (Phase 002 had flagged the env-var promise in earlier drafts as a doc-vs-implementation drift; this section closes that drift.)
- **12.4 Operator-safe swap runbook** is a one-paragraph pointer to the phase 002 runbook with the explicit "do not flip in production until 003/004 ships" caveat. By the time this section was authored, 004 had landed, so the caveat is informational rather than blocking.
- **12.5 Device selection** acknowledges that skill-advisor does not ship its own Metal/CUDA detection shim. Backend defaults inherit from Ollama (which handles device selection itself) or from the shared baseline cascade. The honest framing prevents an operator from expecting an Apple Silicon auto-detect feature that does not exist on this side.
- **12.6 Cross-references** links to the canonical embedder-pluggability narrative, the `mk-spec-memory` analog, the adapter contract, the schema helpers, and the phase 004 follow-on.

The existing "RELATED RESOURCES" section was renumbered from 12 to 13 to make room for the new section, and the table of contents at the top of the file was updated to include the new entry.

**README.md** got two small additions:

- A new "Pluggable embedder layer" subsection inside the Configuration section, about 18 lines. It names all six registered candidates, identifies the current active default, and points readers to INSTALL_GUIDE section 12 for the full story.
- A cross-link row inside the Related Documents table pointing to the canonical embedder-pluggability narrative.

### Why it matters

Before this update, a new operator looking at skill-advisor's documentation would either see no mention of the pluggable layer (and assume the model was hard-wired) or see incorrect mentions of an env-var swap mechanism (which had been drafted earlier but is not how the new layer actually works). After this update, the docs match the code line-for-line: six registered embedders, `embeddinggemma-300m` as the current default, `setActiveEmbedder()` as the swap surface, phase 002's runbook as the operator playbook, no false MPS auto-detect promise, no env-var promise.

The phase also tightened one numerical drift: the canonical embedder-pluggability narrative claims eight registered embedders (that is true for `mk-spec-memory`, not skill-advisor). The new docs document skill-advisor's actual six rather than parroting the wrong number from a sibling skill.

### Files affected

- Modified: `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` — added section 12 (six subsections), renumbered the old section 12 to 13, updated TOC
- Modified: `.opencode/skills/system-skill-advisor/README.md` — added pluggable-embedder configuration subsection and a related-documents row

### Note on docs-vs-code

This phase shipped after phase 002 caught the doc drift. Every claim in the new sections was cross-checked against the actual source code: `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts`, the `MANIFESTS` array length in `registry.ts`, and the `setActiveEmbedder()` signature in `schema.ts`. The "no env var, no MCP tool" phrasing in section 12.3 is deliberate scar tissue from the phase 002 finding so the drift does not regrow.

---

## v1.3 — Skill-graph writer cross-wire (003/004)

**Shipped:** 2026-05-18
**Commits:**
- `c0ec765f4` — `feat(010/004): wire skill-graph-db writer to EmbedderAdapter layer`
- `ab0c7de71` — `fix(010/004): apply F review advisories (P1-1 + P2-1 + P2-2)`

### What changed

This is the phase that unblocked the jina-v3 swap. It refactored the writer path in `mcp_server/lib/skill-graph/skill-graph-db.ts` so that the reindex operation now respects the active embedder pointer instead of always falling back to the old factory.

The core change converted `refreshSkillEmbeddings()` from a single hard-coded path into a dispatcher that branches on whether an active embedder pointer is set:

- **When a pointer is set** (the post-swap state), the dispatcher calls a new helper `refreshSkillEmbeddingsViaAdapter()`. The helper resolves the active manifest through `getAdapter(active.name)` from the new layer, calls the adapter's `embed()` method with the appropriate input type, and writes the resulting vectors into the `vec_<active.dim>` table keyed by skill ID. The write uses INSERT OR REPLACE so re-running the reindex is idempotent.
- **When no pointer is set** (the fresh-install or legacy state), the dispatcher calls `refreshSkillEmbeddingsLegacy()`, which is the original behavior renamed and preserved unchanged. This keeps backward compatibility for any installation that has not opted into the new layer.

Two error paths were added explicitly because `getAdapter` returns `EmbedderAdapter | undefined`:

- If the active pointer names a manifest that the registry no longer knows about, the helper emits an `ADAPTER-UNAVAILABLE` warning and skips embedding for that skill rather than crashing.
- If the resolved adapter's dimension does not match the active pointer's recorded dimension, the helper emits an `EMBEDDING-FAILED` warning for that row.

A new round-trip integration test (`mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts`, four cases, all passing) exercises both code paths plus the two failure modes:

- Adapter path writes to `vec_<dim>` and the rows have the expected dimension and model ID
- Adapter path is idempotent (a second run with no source changes embeds zero new rows, skips the rest)
- Adapter path with an unknown manifest returns `ADAPTER-UNAVAILABLE` and embeds zero
- Legacy path with no pointer set falls back to `createEmbeddingsProvider` and writes the BLOB column

After the initial commit, a single-commit deep-review (F-grade, five iterations, `cli-devin SWE-1.6`) returned a PASS-with-advisories verdict (zero P0, one P1, two P2). The follow-on commit `ab0c7de71` applied all three advisories in one cleanup pass:

- **P1-1 (error-handling)** — moved the dimension mismatch check from per-row to a single early-fail at the top of `refreshSkillEmbeddingsViaAdapter`, so a misconfigured pointer fails fast and stops writing partial rows into the wrong vector table
- **P2-1 (regression-risk)** — clarified the outcome signaling for the `ADAPTER-UNAVAILABLE` case so callers can tell the difference between zero work and zero successful work
- **P2-2 (observability)** — surfaced the `ADAPTER-UNAVAILABLE` warning through `console.warn` so it appears in daemon logs instead of only the return value

### Why it matters

This is the change that makes the jina-v3 swap actually safe. Before this phase, setting the active embedder pointer to `jina-embeddings-v3` would have left the writer happily filling `vec_768` (or the legacy BLOB) while the reader looked for vectors in `vec_1024`. Semantic-shadow scoring would have silently degraded to zero matches and there would have been no error to alert anyone.

After this phase, the writer respects the pointer. Setting the pointer to `jina-embeddings-v3` and running the reindex now produces 1024-dim vectors in `vec_1024`, which is exactly what the reader is looking for. The semantic-shadow lane stays populated, recommendations stay sane, and the operator runbook from phase 002 becomes safe to execute on a real database.

The legacy path is preserved (no breaking change for fresh installs), the new path is covered by tests (no silent regression), and the failure modes are now observable in daemon logs (no silent degradation). The F review verdict confirmed the refactor was a clean dispatch-on-pointer pattern with no scope creep.

### Files affected

- Modified: `mcp_server/lib/skill-graph/skill-graph-db.ts` — converted `refreshSkillEmbeddings` into a dispatcher, added `refreshSkillEmbeddingsViaAdapter` helper, renamed the original implementation to `refreshSkillEmbeddingsLegacy`
- New: `mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — four-case round-trip integration test
- Plus the follow-on cleanup applied to the same two files for the F review advisories

### Out of scope

This phase wired the writer to use the new adapter layer when a pointer is set. It did not flip the pointer (that is what phase 002's runbook does), did not remove the legacy `skill_nodes.embedding` BLOB column (deferred to a future legacy-column deprecation packet), and did not change the old `createEmbeddingsProvider` factory itself (other consumers depend on it).

---

## How the four phases fit together

For anyone landing on this changelog cold:

1. **Phase 001 (v1.0)** shipped the pluggable layer that lets you swap embedder models without rewriting code, but only wired up the read side.
2. **Phase 002 (v1.1)** tried to execute the swap to `jina-embeddings-v3`, caught the architectural mismatch (the writer was still hard-wired to the old factory), and shipped the operator runbook plus a deferral to phase 004.
3. **Phase 003 (v1.2)** documented the pluggable layer in INSTALL_GUIDE and README, reflecting the actual half-wired-then-fully-wired state honestly so operators are not misled into flipping the pointer prematurely.
4. **Phase 004 (v1.3)** wired the writer path, closed the read-write asymmetry, and made the phase 002 runbook safe to execute. The F deep-review returned PASS-with-advisories and the three advisories were applied in a same-day cleanup commit.

The default embedder is still `embeddinggemma-300m` after this stack ships. The infrastructure is now in place for an operator to follow the phase 002 runbook and flip to `jina-embeddings-v3` (or any of the other registered models) without breaking the semantic-shadow scoring lane.

---

## Related resources

- Spec parent: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/spec.md`
- Operator runbook (jina-v3 swap): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/002-jina-swap-and-reindex/evidence/swap-runbook.md`
- F deep-review (003/004 writer cross-wire): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire/review/review-report.md`
- Canonical embedder-pluggability narrative: `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`
- Skill-advisor docs: `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` section 12, `.opencode/skills/system-skill-advisor/README.md` Configuration section
