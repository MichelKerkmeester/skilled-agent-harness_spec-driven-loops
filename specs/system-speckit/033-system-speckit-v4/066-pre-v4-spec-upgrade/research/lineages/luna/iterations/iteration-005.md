# Iteration 5: Ordered Execution, Idempotence, and Evidence Closure

## Focus

Prove the ordered execution, before/after fingerprint, failure-propagation, repeated-run no-op, and evidence-ledger contracts needed for a deterministic upgrade command.

## Actions Taken

- Read the packet's stated ordering requirement and the existing frontmatter, derived-repair, graph-backfill, validation, and shell-pipeline implementations.
- Traced every stage's report shape and exit-code behavior, including the graph backfill case where a non-empty `failed[]` summary can coexist with exit code zero.
- Compared dry-run and apply semantics to define a second-run no-op proof without executing repository tooling.
- Kept the iteration read-only with respect to the packet and production tools; only the lineage artifacts are being written.

## Findings

1. The required order is source-document normalization first, derived metadata repair and re-derivation second, and strict validation last. The packet explicitly warns that frontmatter edits stale sidecars when repair runs in the opposite order, while the existing pipeline wrapper already places frontmatter backfill before derived repair. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-80] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/bf-pipeline.sh:18-25] [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:346-376]

2. The shell wrappers do not themselves provide fail-closed orchestration. Both use `set -uo pipefail` and continue through later stages after printing a preceding command's status. A deterministic upgrade wrapper therefore must capture each stage result, stop or quarantine on failure according to an explicit policy, and make final completion depend on parsed reports plus strict validation rather than wrapper control flow. [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/fullrun.sh:1-23] [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/bf-pipeline.sh:1-25]

3. Graph backfill requires structured failure inspection. Its summary includes created, refreshed, changed, skipped, failed, review flags, drift, and prune candidates; the run path prints the summary but does not make a non-empty `failed[]` list an automatic nonzero exit. The orchestrator must therefore persist and inspect the JSON summary before allowing the next stage. [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:546-581] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:603-657] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:730-743] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-80]

4. Frontmatter backfill has a stronger but still two-part proof contract: its report distinguishes changed, unchanged, failed, malformed-skipped, and skipped directories, and its exit code is nonzero only when the failure count is nonzero. The upgrade ledger should retain both the report and exit status so a successful process with skipped or unchanged files cannot be mistaken for a complete repair. [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:426-448] [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:542-607]

5. Derived repair must re-derive after a source edit. Its implementation classifies authored versus derivable facts, writes source-derived fixes, and then re-derives metadata because a source change invalidates the prior fingerprint. The resulting exit contract distinguishes clean, dry-run-pending, and failed outcomes, which should be recorded as separate ledger fields. [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:333-379] [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:579-593]

6. A repeated-run no-op is testable without authored edits: snapshot the source and derived fingerprints before the first apply, require the second dry-run to report no pending repairs and no changes, require graph metadata comparison to report `changed=0` apart from explicitly volatile fields, and rerun strict validation with identical per-rule counts. The tools expose dry-run and equality behavior sufficient to make these assertions observable. [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:7-22] [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:573-590] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:603-646]

7. Stable graph artifacts make fingerprint comparison practical. The graph tool sorts prune candidates and computes deterministic content hashes, while its metadata comparison deliberately ignores only volatile fields. The evidence ledger should record the hash algorithm, input scope, ignored-field list, and before/after hash so a no-op claim is reproducible. [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:117-151] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:603-609]

8. The evidence ledger must retain stage-level stdout/stderr or parsed report references, exit status, changed and failed counts, skipped reasons, scope partition, before/after fingerprints, and the final validator rows. `validate-all.cjs` emits one JSON row per packet but caps displayed details, so aggregate counts and tool reports must remain alongside the bounded residual examples. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-3] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]

9. Scope must be frozen before mutation and partitioned into active, `z_archive`, `z_future`, skipped, and unreadable populations. The tools do not share one archive default: frontmatter has `--include-archive`, graph has multiple scope switches, derived repair freezes `z_archive`, and validation labels both archive classes. The second proof pass must use the same manifest and report any scope drift. [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:124-182] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:319-365] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:441-487] [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:386-413]

10. The resulting proof can establish a no-authored-LLM upgrade only for the deterministic lane. Authored-content, provenance, status-truth, sufficiency, and unresolved inherited defects remain explicit strict failures or evidence-backed review exceptions; they cannot be converted to pass by an empty-shape rewrite or by checking only a final process exit code. [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:7-22] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:82-84]

## Questions Answered

- Ordered execution: normalize source documents, capture the report, repair and re-derive derived metadata, capture structured failures, then run strict validation.
- Failure propagation: treat every non-empty failure array, review-required result, skipped scope, and validation failure as ledger evidence; do not rely on shell exit status alone.
- Idempotence: require stable scope and fingerprints, a second-run zero-change dry-run, and identical strict residual counts.
- Evidence completeness: retain stage reports, counts, fingerprints, scope partitions, and bounded plus aggregate residuals.

## Questions Remaining

- The final synthesis must combine these proof obligations with the per-rule provenance matrix and state the limit of the no-authored-content claim.

## Dead Ends

- Relying on wrapper exit status alone is ruled out because graph backfill can report failures while exiting zero.
- Running derived repair before source normalization is ruled out because source edits stale derived fingerprints.
- Treating a bounded validator detail stream as a complete inventory is ruled out because details are intentionally capped.
- Treating archive inclusion as one shared tool default is ruled out because the existing commands expose incompatible traversal semantics.

## Scope Violations

None. Source files and packet evidence were read only; no repository validation, repair, generated-context, git, or nested executor command was run.

## Sources Consulted

- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/bf-pipeline.sh:1-25]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/fullrun.sh:1-23]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:7-22]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:333-413]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/repair-derived.cjs:579-593]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:426-607]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:117-151]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:546-743]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-50]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]

## Assessment

- newInfoRatio: 0.62
- Novelty justification: The existing tools expose enough report, hash, and traversal behavior to define an observable ordered pipeline and a repeated-run no-op proof, while their gaps require explicit failure parsing and scope accounting.
- Confidence: high for stage ordering and report semantics; medium for the exact implementation of a future wrapper because no production orchestrator was changed or executed in this read-only research run.

## Reflection

- What worked: tracing source edits through re-derivation, structured tool summaries, and stable graph comparisons turned “deterministic” into concrete ledger assertions.
- What failed or was ruled out: shell status alone, implicit archive scope, first-pass validation without fingerprints, and bounded residual details as the sole evidence source.

## Recommended Next Focus

Synthesis: combine the five iterations into the final answer, mark the research questions resolved, and record stopReason `maxIterationsReached`.
