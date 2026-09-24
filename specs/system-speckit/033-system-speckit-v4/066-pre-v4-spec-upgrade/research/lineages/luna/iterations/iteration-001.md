# Iteration 1: Residual Baseline and Failure Surface

## Focus

Establish the measured residual baseline for the v3.0.0.0 and v3.6.0.0 packet populations, separate active from archived packets, and classify whether the observed residuals are predominantly mechanical, metadata-derived, or semantic/policy-sensitive.

## Actions Taken

- Read the packet objective and measured pipeline results in `spec.md`.
- Read the JSONL aggregation contract and the bounded detail emission in `scratch/harness/agg.cjs` and `scratch/harness/validate-all.cjs`.
- Reviewed the aggregate counts and representative packet rows in both residual data files without running validation or repair tooling.
- Derived a combined active baseline of 1,177 packets, 797 passes, and 380 failures from the two tag populations.

## Findings

1. The current two-tool pipeline already passes 111 of 170 active v3.0.0.0 packets and 686 of 1,007 active v3.6.0.0 packets. The active failure surface is therefore 380 packets, not the full historical population. This establishes a deterministic upgrade target for active packets while preserving the packet's measured baseline. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:65-71]

2. The combined active baseline is 797/1,177 passes, or approximately 67.7%, leaving approximately 32.3% with at least one residual. This is a useful denominator for measuring later ordering and policy changes; it is not evidence that a single transformation can clear all residuals. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:67-71] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]

3. Active failures are concentrated differently by tag. v3.0.0.0 is led by ANCHORS_VALID, SPEC_DOC_SUFFICIENCY, GREP_CONVENTION, SPEC_DOC_INTEGRITY, and STATUS_CROSS_DOC_CONSISTENCY; v3.6.0.0 adds high-frequency GENERATED_METADATA_INTEGRITY, GREP_CONVENTION, ANCHORS_VALID, STATUS_CROSS_DOC_CONSISTENCY, LEVEL_MATCH, and FILE_EXISTS. The upgrade design must therefore compose several deterministic classes rather than assume one missing-frontmatter repair is sufficient. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:216-220] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:1-170] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:1-1007]

4. Archived packets are a separate policy problem: 186 v3.0.0.0 archived packets and 911 v3.6.0.0 archived packets all fail the current measured pipeline, while the repair tools skip `z_archive` and `z_future` by default. An active-only upgrade cannot satisfy the requirement that every historical spec folder pass unless archive inclusion or an explicit archived-packet policy is addressed. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:71-73] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:39-45]

5. The residual JSONL is suitable for frequency and packet-level targeting but not for a complete repair inventory: `validate-all.cjs` writes a single line per packet and caps stored details at three per rule. Later iterations must inspect rule implementations and packet fixtures before claiming that a class is fully deterministic. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-3] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:32-50]

6. Representative rows show at least two different repair modes. Missing frontmatter and missing required files are mechanically detectable, while status classification and cross-document consistency depend on interpreting packet state. Examples include a missing frontmatter failure in v3.0.0.0, a planned-status classification in v3.0.0.0, and a generated-metadata path mismatch in v3.6.0.0. A no-authored-LLM design must keep these classes distinct rather than treating every residual as text generation. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:5] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:120] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:24]

7. The packet itself records ordering sensitivity: frontmatter backfill changes source documents, while repair-derived can trust an exit code even when a graph-metadata tool reports non-empty failures. This makes pipeline ordering and failure propagation first-class research questions, not implementation details to defer until after the residual classes are catalogued. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-80]

8. The baseline rules out a success criterion based only on exit status or active-packet pass rate. The harness aggregation explicitly separates active and archived populations and counts rule occurrences, so an upgrade proof must report both populations and preserve per-rule diagnostics. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:73-80]

## Questions Answered

- Baseline coverage is established: 797 of 1,177 active packets pass after the measured v3-era two-tool pipeline, while all 1,097 archived packets remain failing under the current default policy.
- The residual surface is mixed: structural/metadata failures can plausibly be transformed deterministically, but status and cross-document consistency require explicit policy and evidence rules.

## Questions Remaining

- Which specific residual rules can be cleared by deterministic transformations, and what input provenance is required for each?
- Which residuals are v4-only contract additions versus defects already present in v3 packets?
- Which validator-policy changes preserve new v4 findings as errors?
- What explicit archive inclusion behavior is safe and reversible?
- What pipeline order and idempotence checks prove deterministic output and complete failure reporting?

## Dead Ends

- An active-only migration scope is ruled out because the archived populations are non-zero and entirely failing under the measured policy.
- Treating the residual JSONL as a complete repair specification is ruled out because per-rule details are intentionally capped.
- Authored LLM edits remain out of scope; the packet asks for a deterministic, no-authored-content path. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:83-84]

## Scope Violations

None. Repository validation, repair tools, and target-packet writes were not executed.

## Sources Consulted

- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:65-84]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:212-220]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-50]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:1-170]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:1-1007]

## Assessment

- newInfoRatio: 0.88
- Novelty justification: This is the first evidence pass that fixes the active/archived denominators, quantifies the combined active baseline, and separates mechanically observable residuals from policy-sensitive examples.
- Confidence: high for the measured counts and archive split; medium for repair determinism because rule implementations and provenance paths have not yet been mapped.

## Reflection

- What worked: packet-local aggregation and representative JSONL rows expose the scale and heterogeneity of the migration surface without mutating repository state.
- What failed or was ruled out: relying on a single pass rate, exit code, or capped detail sample cannot prove complete repair coverage.

## Recommended Next Focus

Iteration 2: map each residual rule family to its validator implementation, source-of-truth inputs, and v3 template/provenance path so deterministic, policy, and authored-content classes can be separated.
