# Iteration 2: Live retired memory surfaces

## Focus
Angle 1a. Hunt live code or config that still serves or describes the retired memory database, memory MCP tools or spec-memory launcher. Exclude advisor MCP and historical spec prose.

## Findings

### F-I2-001 — Default database path is still the retired memory filename. CONFIRMED. P1
`runtime/shared/paths.js` still exports `DB_PATH` from `MEMORY_DB_PATH` or from `getStartupEmbeddingProfile().getDatabasePath(...)`, and `resolveDatabaseDir()` still lands on `runtime/database`. The comment states the retired spec-kit memory server was this directory's original owner and that the override is still spelled `MEMORY_DB_PATH`. [SOURCE: .opencode/skills/system-spec-kit/runtime/shared/paths.js:123-148]
`EmbeddingProfile.getCanonicalDatabasePath` still joins `context-index.sqlite`. [SOURCE: .opencode/skills/system-spec-kit/runtime/shared/embeddings/profile.js:54-57]
The vitest setup says that with neither env var set, the resolver derives `<runtime>/database/context-index.sqlite`, and that this filename is the retired memory server's. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:26-39]
D5 preserves the HF model server and shared embeddings. The 052 LOG kept `runtime/database/` because the model server resolves its default directory there. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:202]
That does not require the live default file still to be named `context-index.sqlite` or the override still to be `MEMORY_DB_PATH`. D6/D7 call a hook or env that describes a surface that no longer exists debt.
Smallest fix: rename the derived file and the env var to an embeddings/advisor-owned name (`SPECKIT_DB_PATH` already has a sibling `SPEC_KIT_DB_DIR`), keep `MEMORY_DB_PATH` as a one-release alias, and stop documenting the old filename as canonical.

### F-I2-002 — HF local provider still keys its lease off MEMORY_DB_PATH. CONFIRMED. P1
`hf-local.js` reads `process.env.MEMORY_DB_PATH` as the database the provider owns and writes its lease beside. [SOURCE: .opencode/skills/system-spec-kit/runtime/shared/embeddings/providers/hf-local.js:207-213]
`factory.js` still forwards `MEMORY_DB_PATH` into the provider environment and treats a set value as the first resolved path. [SOURCE: .opencode/skills/system-spec-kit/runtime/shared/embeddings/factory.js:161-162,259-262]
The live caller named in `paths.js` is the skill-advisor launcher. [SOURCE: .opencode/skills/system-spec-kit/runtime/shared/paths.js:126-128]
This is preserved-set adjacency, not a memory MCP server. It is still a retired-surface name on a live path.
Smallest fix: same rename as F-I2-001, applied in factory, hf-local and the advisor launcher together.

### F-I2-003 — Cognitive working-memory source is gone. Scripts still require the contract. CONFIRMED. P1
Read of `.opencode/skills/system-spec-kit/runtime/lib/cognitive/working-memory.ts` and `attention-decay.ts` returned not found. A content search of `runtime/lib` for those module names hits only the extraction README. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:27]
`scripts/tests/test-integration.vitest.ts` still has a `cognitive memory export parity` suite that requires `runtime/dist/lib/cognitive/working-memory.js`, `attention-decay.js` and `co-activation.js`, then asserts `init`, `setAttentionScore`, `getSessionMemories` and decay-tier math. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:168-197]
INFERRED: a dirty `dist/` tree from before the delete can make this test pass. What would confirm: run that one test after a clean runtime rebuild, without reading `dist` contents here.
This is both angle 1 (retired surface still described and possibly still loaded) and angle 4 (a test that can pass only because a compiled retired surface remains).
Smallest fix: delete the parity suite, or restore a documented successor module if some consumer still needs the contract. Do not leave an assertion against `dist/` of a deleted tree.

### F-I2-004 — Entity extractor still frames "memory content". CONFIRMED. P2
`ExtractedEntity` is documented as "A single entity extracted from memory content." [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:37-40]
The extraction README still says the pipeline inserts "working-memory attention or extracted record data". [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/README.md:27]
The module itself is rule-based extraction with a `better-sqlite3` type import, not an MCP server. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:8-10]
Smallest fix: reword to spec-folder or continuity entities. Drop the working-memory sentence.

### F-I2-005 — Spec-memory launcher and MCP registrations are absent on the checked live configs. CONFIRMED. P2 (negative)
`opencode.json`, `.claude/mcp.json` and `.opencode/hooks` have no `spec-memory`, `system-spec-memory` or `mk-spec-memory` hits. `.opencode/bin` has none either.
`parity-check.mjs` still `pgrep`s `system-spec-memory` and `context-server`, and the comment says a running process is an observation, never a dependency. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:793-816]
That is a successor guard, not a launcher. Phrase-variant fixtures still contain historical `mk-spec-memory` strings. Those are index inventory, not a live server.
Smallest fix: none for the configs. Keep the pgrep as a negative proof. Do not treat fixture phrases as residue.

### F-I2-006 — HF model server default directory is runtime/database, not a memory MCP. CONFIRMED. P2 (not a miss)
`defaultDbDir()` joins `system-spec-kit/runtime/database`. [SOURCE: .opencode/bin/hf-model-server.cjs:78-80]
The listen-target comment says the old fallback was the memory server's database directory, which no longer exists. [SOURCE: .opencode/bin/hf-model-server.cjs:130-137]
Ruled out as a "memory MCP still running" finding. The remaining miss is the shared filename and env var in F-I2-001, not this default directory.

## Sources Consulted
- .opencode/skills/system-spec-kit/runtime/shared/paths.js:123-148
- .opencode/skills/system-spec-kit/runtime/shared/embeddings/profile.js:54-73
- .opencode/skills/system-spec-kit/runtime/shared/embeddings/factory.js:161-262
- .opencode/skills/system-spec-kit/runtime/shared/embeddings/providers/hf-local.js:207-213
- .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts
- .opencode/skills/system-spec-kit/runtime/lib/extraction/entity-extractor.ts:1-40
- .opencode/skills/system-spec-kit/scripts/tests/test-integration.vitest.ts:168-197
- .opencode/bin/hf-model-server.cjs:75-137
- .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:793-816
- opencode.json, .claude/mcp.json, .opencode/hooks, .opencode/bin (negative greps)

## Assessment
- newInfoRatio: 0.85
- Novelty justification: First live-code residue. Charter documents did not record MEMORY_DB_PATH or the deleted cognitive source versus the scripts parity suite.
- Confidence: high on file:line. Dist existence left inferred.

## Reflection
- Worked: searching runtime lib and shared, then confirming source-file absence by targeted Read.
- Failed: grepping the whole system-spec-kit tree. Phrase-variant fixtures drowned the signal.
- Ruled out: treating advisor MCP or hf-model-server's `runtime/database` directory as a still-running memory MCP.

## Dead Ends
- Fixture phrase lists as evidence of a live launcher.
- `.opencode/bin` and hook-path greps for `spec-memory` (clean).

## Recommended Next Focus
Angle 1b. zvec lane, system-plugins home and mcp-server identity of `.opencode/skills/system-spec-kit/runtime` on live code, configs and mirrors.
