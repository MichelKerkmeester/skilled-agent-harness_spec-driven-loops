# Iteration R2 - Wiring the Zod Schemas into validate.sh --strict (gpt-5.5, automation)

## TITLE

Cohort R2 retrieval and automation. Model gpt-5.5. Angle designs the exact change that wires the existing graph metadata zod schema plus a shared description schema plus a frontmatter schema into validate.sh strict mode as a hard rule, replacing the legacy-grandfathered-only check, and measures the real migration surface.

## FINDINGS

The quick win is an adherence and logic gate, not a retrieval-rank win. It prevents malformed artifacts before indexing instead of squeezing more rows through the truncated top-3, which is exactly why it dodges the 028 floor.

Strict mode does not currently enforce the schemas. The shell path reads only `legacy_grandfathered` before deciding whether strict warnings fail (`validate.sh:175-183`, bypass at `:912-927`, `:932-947`, `:1061-1063`). The validator is split. The TypeScript orchestrator runs first and exits before the shell shape rules can fire (`validate.sh:838-886` called at `:1046-1048`), and the orchestrator only checks graph-metadata presence, not shape (`orchestrator.ts:397`). The registry already names shape rules but they are warn-severity shell rules bypassed whenever the orchestrator path runs.

The write path already has the right choke point. The context generator calls the workflow, which refreshes description.json then graph-metadata.json on every canonical save before auto-indexing (`workflow.ts:1663-1720`, `:1756-1780`, indexing at `:1823-1844`). That makes an on-write gate feasible without touching retrieval ranking. Both schemas already exist. The graph zod schema is real and parsed at write time (`graph-metadata-schema.ts:61-71`), and a description zod schema exists but is not exported through the public api barrel (`description-schema.ts:51-69`). So neither needs inventing, the description one needs becoming a shared validation-facing export.

The migration surface is larger than the rough number because both spec roots exist on disk. A read-only corpus scan found 2022 graph-metadata.json files and 2004 description.json files in `.opencode/specs`, with the legacy `specs` root mirroring the same counts. Of the graph files 14 fail a minimal strict shape scan, mostly research iteration files that contain plain text beginning `Packet:` instead of JSON. Zero description files fail the proposed basic schema. So the graph and description hard gate is low-risk after a targeted sweep of those 14 text-instead-of-JSON files. The frontmatter gate is the higher-risk piece. The same scan found 9284 canonical markdown docs under `.opencode/specs`, with 287 missing frontmatter and 913 missing the memory continuity block.

## CONCRETE CHANGE

Add one strict-only metadata contract validator and run it in both validation paths. Hard failures under strict mode. The graph file must parse as JSON and pass `graphMetadataSchema.safeParse`, not the migration-tolerant content validator. The description file must parse and pass a shared description schema requiring `specFolder`, `description`, `keywords`, and `lastUpdated` with tracking fields optional but typed. Canonical markdown docs must have schema-valid frontmatter including the top-level scalars, non-empty trigger phrases, and the memory continuity block.

Placement. Add a metadata-artifact-schemas module under the validation lib. Share the description schema out of its current module and import the graph schema. Wire the rule into the orchestrator since validate.sh exits through it before shell rules run, and add a shell fallback in the strict-validators block so source-only checkouts still enforce it. Remove the legacy-grandfathered strict-warning bypass so strict mode fails on schema errors with exit code 2. Run the same validator inside the workflow after the description and graph refresh and before auto-indexing so bad JSON never gets indexed.

## EVIDENCE

- validate.sh checks only legacy_grandfathered: `validate.sh:175-183`, bypass `:912-927`, `:932-947`, `:1061-1063`.
- Orchestrator runs first and only checks presence: `validate.sh:838-886`, `:1046-1048`, `orchestrator.ts:397`.
- Both schemas already exist: `graph-metadata-schema.ts:61-71`, `description-schema.ts:51-69`.
- Write path choke point before indexing: `workflow.ts:1663-1720`, `:1756-1780`, `:1823-1844`.
- Corpus scan counts: 2022 graph and 2004 description files per root with 14 graph failures and 0 description failures, both roots mirrored.
- Frontmatter surface: 9284 docs, 287 missing frontmatter, 913 missing the memory continuity block.
- External support for schema and frontmatter linting: `stage-0-external-findings.md:63-65`, candidate ranking at `:93`, adherence ceiling at `:103-107`.

## READER

Adherence and logic are primary. This does not beat the production 3-result floor directly. It improves the quality of the indexed material that retrieval later sees, so retrieval benefit is secondary hygiene only.

## ON-WRITE OR RETROACTIVE

Both. On-write is a hard gate after metadata refresh and before auto-index. Retroactive is a dry-run-first sweep that repairs the 14 invalid graph files through the graph-metadata refresh and the research-metadata backfill, regenerates any invalid descriptions, and backfills the missing continuity blocks, then enables the hard rule broadly.

## RISK

The graph and description hard gate is low-risk after the 14-file sweep. The frontmatter hard gate is the real hazard. With 287 docs missing frontmatter and 913 missing the continuity block, a corpus-wide frontmatter gate would break unrelated packet validation on day one. Stage the frontmatter gate as warn first then error only after the backfill report is reviewed and applied. The two roots double the apparent surface, so deduplicate against the live root before quoting a repair count.
