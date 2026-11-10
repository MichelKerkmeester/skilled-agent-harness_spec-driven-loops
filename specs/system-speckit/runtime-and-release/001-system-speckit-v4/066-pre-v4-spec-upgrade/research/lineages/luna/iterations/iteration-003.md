# Iteration 3: Tag-Era Provenance and Residual Classification

## Focus

Audit the validator surfaces shipped at v3.0.0.0 and v3.6.0.0 against the current v4 rule registry and concrete residual details, separating defects that were already invalid under v3 from contracts added or hardened after those tags.

## Actions Taken

- Enumerated the rule scripts and validation modules present in each requested tag.
- Counted active residual incidence by the provisional legacy, v3.6-era, and current-hardened rule groups.
- Inspected detailed JSONL rows for missing files, anchors, frontmatter, metadata identity, status, scaffold markers, links, TOC, and canonical-save lineage.
- Read the current enforcement and grandfather flags to distinguish a rule’s existence from its present strictness.

## Findings

1. The v3.0.0.0 tag contains exact rule implementations for anchors, files, folder naming, frontmatter, level matching, document integrity, template source, TOC policy, and AI protocols. These are legacy contracts: a v3.0 packet failing one of them is a genuine pre-v4 defect, subject to the v4 implementation’s compatibility changes. [SOURCE: git ls-tree v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules] [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:9-13] [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh:9-11]

2. The v3.6.0.0 tag adds graph-metadata shape/presence, a canonical-save bridge, `spec-doc-structure.ts`, and graph backfill. Its validation module names `FRONTMATTER_MEMORY_BLOCK` and `SPEC_DOC_SUFFICIENCY`, so those failures in v3.6 packets are not wholly v4 inventions; the v3.0 population did not carry that module. [SOURCE: git ls-tree v3.6.0.0:.opencode/skills/system-spec-kit/scripts] [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:99-126] [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save.sh:6-9]

3. The current v4 surface adds or hardens a distinct group: `GREP_CONVENTION`, `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `METADATA_DISK_PATH_CONSISTENCY`, `STATUS_CROSS_DOC_CONSISTENCY`, and `SCAFFOLD_NEVER_TOUCHED` are in the current registry, while the exact rule scripts are absent from both tag-era rule directories. This is a provisional v4-contract group, not proof that each underlying packet defect is harmless legacy data. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:37-56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:214-285] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:376-405] [SOURCE: git ls-tree v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules] [SOURCE: git ls-tree v3.6.0.0:.opencode/skills/system-spec-kit/scripts/rules]

4. Active residual incidence confirms that the two tag populations need different migration lanes. v3.0.0.0 has 21 ANCHORS_VALID, 10 SPEC_DOC_INTEGRITY, 6 FILE_EXISTS, 6 LEVEL_MATCH, 4 TEMPLATE_SOURCE, 12 SPEC_DOC_SUFFICIENCY, 11 GREP_CONVENTION, 9 STATUS_CROSS_DOC_CONSISTENCY, and 4 SCAFFOLD_NEVER_TOUCHED rule hits across its active rows; v3.6.0.0 has 78 GREP_CONVENTION, 70 GENERATED_METADATA_INTEGRITY, 63 STATUS_CROSS_DOC_CONSISTENCY, 34 FRONTMATTER_MEMORY_BLOCK, and 32 SCAFFOLD_NEVER_TOUCHED among other classes. These are rule incidences, not independent packet counts, because one row can fail several rules. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:1-170] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:1-1007] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]

5. Concrete v3.0 residuals show genuine legacy defects under rules that predate v4: an implementation summary has no anchors; a packet has malformed or missing level declarations and missing plan/tasks; a packet lacks template-source markers; a Level 3+ packet has zero AI protocol components; and a spec links to feature files that do not exist. These cases cannot be cleared by downgrading v4 policy without hiding defects already recognized by v3-era contracts. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:12] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:45] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:117] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:131] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:159]

6. Concrete v3.6 residuals show both legacy defects and new/hardened contract exposure: missing `plan.md`/`tasks.md`, orphaned anchors, missing link targets, and invalid folder names are structural defects; invalid continuity fingerprints and broken parent session ids are v3.6-era continuity defects; metadata path drift, duplicate trigger phrases, and scaffold placeholders are current hardened findings. The migration must classify by rule provenance and detail, not by tag alone. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:2] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:3] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:586] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:721] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:818]

7. The current policy history confirms that several v4 findings are rollout hardening rather than timeless packet shape. Generated metadata is now default-enforcing under strict with an explicit grandfather flag; metadata disk-path and status cross-document checks graduated from advisory to enforcing after tree-wide census; and the docs record the graduation date and residual policy. A migration can preserve new findings as errors while using a bounded, evidence-backed grandfather mode only for pre-existing data that cannot be deterministically derived. [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:173-183]

8. The metadata-path residuals are the clearest deterministic lane. One v3.6 row supplies both the stored and expected `description.specFolder`, and the current rule compares generated metadata against the actual on-disk folder through a helper. When the packet path is authoritative and manual metadata is preserved, a canonical refresh can correct the path and make the result auditable; this does not justify auto-changing folder names or hand-authored descriptions. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh:34-45] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh:89-99]

9. Status and retrieval residuals are not equally deterministic. A status row reports `spec.md` as planned/in-progress and `implementation-summary.md` as complete, but the validator only compares the buckets; it does not choose which historical document wins. A grep row reports missing frontmatter and generic single-token triggers, so adding a marker or repeating a generic packet name would not satisfy the intended retrieval quality. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:120] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh:38-67] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs:183-215]

10. The correct provenance output is not a single “v4-only” label per packet. It is a per-rule matrix: legacy-contract defect, v3.6-era continuity/metadata defect, current-v4 hardening finding, or mixed case requiring source-of-truth policy. That matrix supports a no-authored-LLM path: deterministic writers may repair derived artifacts, while legacy authored defects and unresolved truth claims remain explicit failures or human-review exceptions. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:37-56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:376-405]

## Questions Answered

- A provisional v3-versus-v4 provenance split is established. Basic file, level, anchor, naming, frontmatter, template-source, link, TOC, and AI checks predate v4; v3.6 adds continuity and graph/canonical-save surfaces; the current registry adds or hardens retrieval, generated-metadata, path, status, scaffold, and drift checks.
- The residual data contains both genuine v3 defects and v4 contract exposure. Tag age alone is insufficient; rule id plus diagnostic detail determines the lane.

## Questions Remaining

- Which policy-gated rows can be grandfathered without weakening new v4 findings, and what evidence threshold is sufficient?
- What explicit source-of-truth precedence resolves status and metadata conflicts?
- Which archive traversal behavior can be enabled without accidental inclusion of `z_future` or non-packet directories?
- What exact ordered pipeline and idempotence proof turns the lanes into one command?

## Dead Ends

- Treating all v3.0 residuals as v4-only compatibility debt is ruled out by the v3.0 rule surface and concrete missing-file, link, anchor, and AI-protocol failures.
- Treating all v3.6 residuals as legacy defects is ruled out by current-only metadata path, status, grep, scaffold, and drift diagnostics.
- Treating one packet-level grandfather switch as sufficient is ruled out because residuals are mixed within individual rows.

## Scope Violations

None. Tag history, current source, and residual JSONL were read only; no validator or repair command was run.

## Sources Consulted

- [SOURCE: git ls-tree v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules]
- [SOURCE: git ls-tree v3.6.0.0:.opencode/skills/system-spec-kit/scripts]
- [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh:9-80]
- [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:99-126]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:173-183]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:1-170]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:1-1007]

## Assessment

- newInfoRatio: 0.78
- Novelty justification: This iteration ties rule incidence to exact tag-era validator surfaces and concrete diagnostics, replacing a coarse v4-only versus legacy split with a per-rule provenance matrix.
- Confidence: high for exact rule-file presence and sampled diagnostic classification; medium for introduction dates and migration policy because changelog/commit attribution still needs synthesis with ordering and archive behavior.

## Reflection

- What worked: tag file inventories, current enforcement documentation, and residual detail rows corroborate each other and expose mixed rows that a packet-level policy would mishandle.
- What failed or was ruled out: rule presence alone cannot prove compatibility, and tag age alone cannot distinguish a v3 defect from a current contract hardening.

## Recommended Next Focus

Iteration 4: design the least-invasive validator-policy and archive-inclusion contract, preserving new v4 findings as errors while allowing only evidence-backed deterministic treatment of legacy residuals.
