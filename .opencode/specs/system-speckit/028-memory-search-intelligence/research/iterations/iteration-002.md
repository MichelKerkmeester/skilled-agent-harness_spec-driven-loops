# Iteration 2: Feature-flag catalog coverage for late 028 memory-search work

## Focus
This iteration followed iteration 1's recommended next focus and broadened from top-level inventory into a specific artifact family: feature-catalog flag-reference coverage. I compared packet 028's current flag narrative against the feature catalog, generated environment reference, and implementation flag readers. The selected interpretation is catalog-to-code/spec alignment for memory-search and generated-metadata flags; manual playbook and benchmark coverage remain deferred.

## Findings
1. The dedicated feature-catalog flag table `19--feature-flag-reference/1-search-pipeline-features-speckit.md` is stale for packet 028: it does not list the five packet-028 default-on survivors (`SPECKIT_DERIVED_ID_PROVENANCE`, `SPECKIT_CONFIDENCE_CALIBRATION`, `SPECKIT_RETENTION_FORGETTING_V1`/actual `SPECKIT_RETENTION_FORGETTING`, `SPECKIT_WORLD_SUMMARY_PRELUDE`, `SPECKIT_TEMPORAL_EDGES`) even though the packet declares them as the final surviving switches. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:31] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:17] [INFERENCE: grep for those survivor env vars in .opencode/skills/system-spec-kit/feature_catalog found only temporal-edge feature files, not the feature-flag-reference table]
2. The same feature-catalog flag table omits the built-but-held late-028 tail-lane flags `SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL`, and `SPECKIT_TRUE_CITATION_EMITTER`; the env reference and implementation both document/read the first two as opt-in tail-lane flags, while the packet explains their deep-K graduation/held status. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:73] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:128] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:994] [INFERENCE: grep for these env vars in .opencode/skills/system-spec-kit/feature_catalog returned no matching feature-catalog entries]
3. The feature catalog also lacks the 028/005 generated-metadata and data-quality flag set as cataloged features. `ENV_REFERENCE.md` has a dedicated Data Quality and Generator Hardening section for `SPECKIT_GENERATOR_HARDENING`, `SPECKIT_GENERATED_METADATA_GRANDFATHER`, `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, `SPECKIT_GENERATED_METADATA_Z_EXCLUSION`, `SPECKIT_LEXICAL_GROUNDING`, and `SPECKIT_FALSE_CONFIRM_MAX_RATE`, but a targeted catalog grep found no feature-catalog entries for those env var names. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:150] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:156] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:163] [INFERENCE: grep for the listed data-quality env vars in .opencode/skills/system-spec-kit/feature_catalog returned no files]
4. A high-impact naming drift remains confirmed and is more actionable after this pass: packet 028 says the retention switch is `SPECKIT_RETENTION_FORGETTING_V1`, while `ENV_REFERENCE.md` and the live resolver use `SPECKIT_RETENTION_FORGETTING`; because the feature-catalog flag table omits both names, it cannot currently prevent an operator from copying the stale packet name. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:651]
5. The feature-catalog flag-reference file is versioned `3.6.0.55`, older than the root catalog's `3.6.0.99`, while the current env reference documents 298 unique variables and a packet-028 Data Quality section; this is a secondary freshness signal that the split flag-reference asset has not kept pace with the generated env surface. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:10] [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:11] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:148]

## Ruled Out
- Treating `ENV_REFERENCE.md` as the missing feature catalog was ruled out: it is a generated/config reference, while the feature catalog explicitly owns implemented behavior, source references, and validation scope for feature consumers. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:17]
- Treating temporal-edge catalog entries as complete late-028 coverage was ruled out because only `SPECKIT_TEMPORAL_EDGES` surfaced in catalog grep, leaving the rest of the survivor and tail-lane flag set absent. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/10--graph-signal-activation/temporal-edges.md:25] [INFERENCE: grep result for the late-028 flag set found only temporal-edge feature files]

## Dead Ends
- No dead-end approach yet. Targeted catalog grep was productive and should continue against manual testing and command presentation assets.

## Edge Cases
- Ambiguous input: "feature catalogs" could mean the root aggregate, per-category files, or generated env reference. I selected the dedicated `19--feature-flag-reference` catalog asset plus catalog-wide grep because iteration 1 identified feature-flag reference drift.
- Contradictory evidence: The env reference is more complete than the feature catalog, but it does not contradict the gap; it confirms that the code/config surface exists while the feature-catalog asset is missing it.
- Missing dependencies: Code graph remains stale/unavailable per strategy; direct file search/read was sufficient for this catalog slice.
- Partial success: This pass did not audit every root feature-catalog section; it focused on flag-reference coverage and deferred manual playbook/benchmark surfaces.

## Sources Consulted
- `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:31`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:17`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:73`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:128`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:150`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:994`
- `.opencode/skills/system-spec-kit/feature_catalog/10--graph-signal-activation/temporal-edges.md:25`

## Assessment
- New information ratio: 1.0
- Questions addressed:
  - Which feature catalogs describe outdated or missing behavior?
  - Where does implemented behavior lack corresponding catalog coverage?
  - Which gaps affect MCP/tool contracts and memory retrieval flags?
- Questions answered:
  - The dedicated feature-flag catalog omits late packet-028 survivor, held, and generated-metadata flags already documented in packet and env/code references.
  - The retention flag naming mismatch is not mitigated by catalog coverage because both old and current names are absent from the feature-flag catalog table.

## Reflection
- What worked and why: Comparing packet flags to the dedicated flag-reference file and then running catalog-wide targeted grep gave a compact absence proof without rereading the whole 5k-line catalog.
- What did not work and why: The catalog-wide grep cannot prove semantic coverage when a file describes a feature without naming the env var, so missing-env-var findings should be treated as strong coverage-gap signals rather than absolute absence of any prose.
- What I would do differently: For the next pass, use manual playbook index/scenario searches for the same late-028 flag set to test whether operator validation coverage exists even when catalog coverage is missing.

## Recommended Next Focus
Audit `manual_testing_playbook/` for scenarios covering late-028 flags and eval/verdict behavior: deterministic multihop, lane champion backfill, true citation emitter, lexical grounding, false-confirm max-rate, noise-floor subtraction, cite-with-caveat, evidence-gap verdict, envelope fidelity, generated-metadata enforcement, and retention forgetting.
