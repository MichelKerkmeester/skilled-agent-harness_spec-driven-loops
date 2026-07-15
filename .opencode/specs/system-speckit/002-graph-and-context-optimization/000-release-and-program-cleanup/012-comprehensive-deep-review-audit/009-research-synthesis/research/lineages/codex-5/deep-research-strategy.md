# Deep Research Strategy

## Research Topic
Root-cause synthesis of the system-spec-kit / 026 deep-review audit.

## Known Context
- The charter asks for read-only synthesis of five questions covering doc/schema drift, metadata drift, memory correctness, security severity calibration, and deep-loop blast radius [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md:57].
- The audit parent says the campaign should produce evidence-backed P0/P1/P2 findings and distinguish verified from suspected issues [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/spec.md:43].
- No `resource-map.md` exists in the research-synthesis spec folder at init; resource-map coverage gate skipped.

## Key Questions
- [x] Are schemas, handlers, docs, and catalog/playbook generated or hand-maintained from divergent sources of truth?
- [x] Is metadata drift systemic or isolated, and how broad is the affected packet surface?
- [x] Do entity-density cache staleness and atomic save ordering have real single-user impact?
- [x] Are the P0 security findings genuinely P0 under a local MCP threat model?
- [x] Could deep-loop fan-out failures make prior audit artifacts suspect?

## Answered Questions
- Doc/schema drift is systemic hand-maintained contract drift. Public tool definitions, Zod schemas, allowed-parameter lists, handler behavior, docs, catalog, and playbook are separate surfaces.
- Metadata drift is systemic enough to require generated audit tooling, not isolated clean-up. The 026 tree contains 714 `graph-metadata.json` files; 027 contains 18.
- Memory-correctness issues are reproducible: stale entity-density terms can misroute graph-channel activation until TTL/invalidation, and atomic save can commit index rows before final file promotion.
- Security severity should be calibrated: community fallback scope bypass remains P0 when governed scope is a data boundary; causal bare-ID mutation is P1/P0 depending on whether governed scope is security isolation or local operational partitioning.
- Deep-loop fan-out summaries are suspect when used as proof of lineage success because the pool treats non-throwing worker returns as fulfilled even if the return object contains a non-zero exit code.

## What Worked
- Structured review registries gave a fast severity/finding inventory before reading direct implementation evidence.
- Direct implementation reads exposed root-cause classes that duplicate review titles alone did not show.
- Counting metadata files and orchestration summaries gave blast-radius estimates without mutating reviewed surfaces.

## What Failed
- Raw `rg` over all reports was too noisy and duplicated fan-out text; the registry plus targeted reads was higher signal.
- The slice `orchestration-summary.json` files report `total_cli_lineages=1` despite five report files per slice, so they are not reliable as campaign-wide success evidence.

## Exhausted Approaches
- Re-running `resolveArtifactRoot`: explicitly disallowed by the fan-out prompt and unnecessary because the lineage artifact directory was bound directly.
- Treating each drift item as a one-off documentation typo: rejected because the same split appears across multiple tool surfaces and docs.
- Using orchestration summaries as sole proof: rejected because the fan-out worker can return non-zero child exit codes without causing pool failure.

## Ruled-Out Directions
| Direction | Reason | Evidence |
|---|---|---|
| Single generator already exists for all tool contracts | Tool definitions, runtime schemas, allowlists, handlers, docs, and catalog are separate live sources. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:338] |
| Metadata drift is isolated manual error | Backfill and canonical save exist, but they do not enforce all semantic truth invariants visible in 026/027 drift. | [SOURCE: file:.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193] |
| Entity-density cache staleness is harmless | The cache feeds graph-channel routing and has a 60s TTL; update/delete hooks omit its invalidator. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:153] |
| P0 means remote exploit only | Local scope boundaries can still be violated by default-on global fallback paths. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:987] |
| `succeeded=1` proves child CLI success | `spawnSync` result is returned as data; the pool counts non-throwing returns as fulfilled. | [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85] |

## Next Focus
Synthesis complete. Next remediation planning should prioritize contract-generation/parity tests, scoped fallback hardening, causal authorization, metadata audit tooling, and fan-out exit-code handling.

## Non-Goals
- Do not modify reviewed implementation files.
- Do not rerun the deep-review campaign.
- Do not claim full packet completion outside this lineage.

## Stop Conditions
- All five charter questions answered with cited implementation or review evidence.
- No remaining high-value unknown would change the remediation order.
- New information ratio below convergence threshold trend after all key questions are answered.
