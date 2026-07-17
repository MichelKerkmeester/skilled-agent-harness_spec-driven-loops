# Iteration 1: Top-down inventory of 028-alignment surfaces

## Focus
This iteration investigated the strategy's requested starting point: identify the recent system-speckit authoritative implementation/spec scope and map it to maintained catalogs, manual testing playbooks, skill-local READMEs, benchmark indexes, and code READMEs. The narrow interpretation was packet `028-memory-search-intelligence` plus its system-spec-kit memory/search documentation surfaces; later iterations should widen to code graph, skill advisor, deep-loop, command contracts, and stress-test directories.

## Findings
1. Packet 028 is a large post-catalog authority source: its parent says the memory child alone spans 30 child phases, the data-quality lineage spans 49 child phases, review remediation has absorbed scopes, and dark-flag graduation has a 12-child suite; this makes any root catalog/playbook dated before these July updates suspect until revalidated. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:121] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:125] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:127]
2. The root feature catalog and manual testing playbook metadata both still say `last_updated: "2026-06-11"` / version `3.6.0.99`, while packet 028 parent continuity records July 4 completion of the deep-dive program and daemon-side follow-up state; the root indexes may contain newer inline edits, but their metadata no longer reflects the current 028-era implementation baseline. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:10] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:4] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:15]
3. The skill-local benchmark index is materially stale for the 028 memory-search work: it lists only May 17 and May 20 active benchmark rows, while packet 028's benchmark status records corrected Recall@20 re-runs, final keep/delete flag decisions, data-quality benchmark status, and later feature-flag graduation evidence. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:44] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:7] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:106]
4. There is a concrete flag-name mismatch: `feature-flags.md` documents the retained guardrail as `SPECKIT_RETENTION_FORGETTING_V1`, but the generated environment reference and implementation use `SPECKIT_RETENTION_FORGETTING`. Operators following the narrative doc would set an env var the code does not read. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:651]
5. The feature catalog's module-map says the catalog has 19 top-level categories ending at `feature-flag-reference`, but the feature catalog and manual playbook now reference category families `remediation-revalidation`, `implement-and-remove-deprecated-features`, `context-preservation`, `doctor-commands`, and `local-llm-query-intelligence`; this is a code README / catalog topology drift. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md:381] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md:401] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:24] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:37]
6. Manual testing coverage has not visibly caught up with the most recent 028 memory-search flag graduation set: the root playbook's high-water note is scenarios 450-453 as of June 29, while packet 028 now documents later graduated/held/deleted flags such as deterministic multihop, lane champion backfill, true citation emitter, lexical grounding, cite-with-caveat, evidence-gap verdict, and envelope fidelity. Some ablation/dashboard coverage exists, but a direct grep only surfaced evaluation scenarios rather than per-flag operator scenarios for the late 028 set. [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:193] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:73] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:122] [INFERENCE: based on Grep over .opencode/skills/system-spec-kit/manual_testing_playbook for the late-028 flag names returning ablation/dashboard and no direct per-flag scenario index hits]

## Ruled Out
- Treating `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` as complete benchmark authority was ruled out because the file itself defines the spec packet as higher authority when disagreements exist. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:67]
- Treating the root feature catalog metadata as proof of content freshness was ruled out because the catalog contains some newer inline coverage notes while still carrying stale `last_updated` metadata. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:10] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:32]

## Dead Ends
- No definitive dead end yet. The first pass found broad stale surfaces; reducer should not mark the top-down inventory exhausted.

## Edge Cases
- Ambiguous input: The request spans the last ~50 specs across backend, integrations, commands, skills, benchmarks, and stress tests. I selected the narrowest first-pass interpretation: packet 028 memory-search plus system-spec-kit memory/search docs, then deferred sibling subsystems.
- Contradictory evidence: Benchmark README says spec packets are authoritative when docs disagree, and it only lists May benchmark rows; packet 028 has later benchmark evidence. The conflict is unresolved in docs but source-of-truth hierarchy favors the spec packet. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:69]
- Missing dependencies: Code graph was stale/unavailable per strategy known context, so I used direct Glob/Grep/Read file evidence.
- Partial success: Research action count exceeded the ideal per-iteration budget during the broad top-down inventory; I stopped widening and wrote/verified the gathered evidence rather than continuing research.

## Sources Consulted
- `.opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:121`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:7`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:10`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:193`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:651`
- `.opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md:381`

## Assessment
- New information ratio: 1.0
- Questions addressed:
  - Which recent specs and implementation packets define authoritative behavior?
  - Which feature catalogs, manual testing playbooks, READMEs, benchmarks, and code READMEs describe outdated or missing behavior?
  - Where does claimed coverage lack benchmark/playbook evidence?
- Questions answered:
  - Packet 028 is an authoritative late implementation source for the first memory-search audit slice.
  - Benchmark README, root catalog metadata, manual playbook root index, and module-map category topology all show staleness or coverage drift against packet 028.

## Reflection
- What worked and why: Starting from the phase parent and then checking root catalog/playbook/benchmark/code-README surfaces quickly exposed high-signal date, topology, and flag-name drift.
- What did not work and why: The initial inventory was too broad for the per-iteration tool budget; the repository has hundreds of relevant docs and needs narrower subsequent tracks.
- What I would do differently: Next iteration should constrain to one artifact family, preferably feature-catalog category coverage for the late 028 flags, and use targeted grep/read rather than broad inventory globs.

## Recommended Next Focus
Audit `feature_catalog/feature-flag-reference/` and nearby retrieval/scoring catalog entries against `feature-flags.md`, `ENV_REFERENCE.md`, and `lib/search/search-flags.ts` to enumerate every missing, stale, or wrong feature-flag catalog entry before widening to manual playbook and benchmark coverage.
