# Iteration 2: Validator Provenance and Deterministic Boundary

## Focus

Map representative residual rule families to the v4 validator implementation, identify their source-of-truth inputs, and compare the current contract with the v3.0.0.0 and v3.6.0.0 rule surfaces.

## Actions Taken

- Read the current validator registry, `validate.sh` dispatch, native orchestrator, and rule bridges.
- Read the corresponding v3.0.0.0 and v3.6.0.0 rule files from the tags as read-only history.
- Traced generated metadata, continuity, status, template provenance, and authored-content checks to their actual inputs.
- Classified each residual family as deterministic, deterministic only with a policy gate, or not safely auto-clearable without authored content.

## Findings

1. v4 has one validator front-end and a registry-driven dispatch surface: `validate.sh` deliberately implements no rules of its own, while the registry assigns rule ids, scripts, categories, and severities. An upgrade must target the current registry contract rather than rely on old v3 script names or exit-code behavior. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:5-10] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:214-385]

2. Several residual classes are inherited structural contracts, not purely v4 inventions. v3.0.0.0 already checked anchors and required files, and its validator surface included level matching, template headers, and document integrity. v3.6.0.0 retained template-source and graph-metadata checks and added a canonical-save rollout with a dated `save_lineage` cutoff. These classes should be treated as legacy defects or stale generated artifacts unless evidence shows the v4 rule strengthened the contract. [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:9-13] [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-files.sh:9-16] [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/scripts/rules/check-template-source.sh:9-11] [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save.sh:6-9]

3. `FILE_EXISTS` and `LEVEL_MATCH` are deterministic classification rules with a shared contract source. `FILE_EXISTS` derives required documents from the level helper, adds lifecycle documents after completed task items, and has a phase-parent branch; `LEVEL_MATCH` parses declarations from `spec.md`, compares the declared level, and repeats the shared required-file check. A migration can calculate these decisions reproducibly, but creating a missing document does not by itself make its content sufficient or truthful. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh:9-16] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh:41-88] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh:23-55] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh:160-218]

4. `ANCHORS_VALID` is partly mechanical and partly template-dependent. The native orchestrator checks only documents whose rendered template defines anchors, then detects no anchors, duplicates, unclosed anchors, and orphan closures. Closing a known unclosed anchor is safe to automate; inventing required sections or content for a document with no anchors is not justified by the pair-check alone. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661-712]

5. `TEMPLATE_SOURCE` and `GREP_CONVENTION` are provenance-sensitive authored metadata rules. `TEMPLATE_SOURCE` checks a marker in the first 60 lines of contract-selected documents, while the grep helper shares its parser and trigger judge with the retrofit and explicitly rejects malformed frontmatter, duplicate aliases, and generic trigger phrases. A marker can be inserted deterministically only when the template provenance is known; trigger phrases cannot be safely synthesized from packet paths without changing the retrieval contract. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:35-65] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention.sh:9-15] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs:4-10] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs:183-215] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs:261-277]

6. Generated metadata is a strong deterministic-repair candidate, but only through the canonical writer. The strict metadata bridge validates shared schemas plus path-prefix and status-enum invariants; disk-path consistency compares metadata to the actual folder through a dedicated helper; and the graph backfill has a dry-run path, sorted review candidates, archive-aware traversal, and per-folder failure reporting. Regeneration must preserve manual graph fields and surface failures rather than treating a zero process exit as proof. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/generated-metadata-integrity.ts:5-9] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/generated-metadata-integrity.ts:72-99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh:34-99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:441-487] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:546-654]

7. `STATUS_CROSS_DOC_CONSISTENCY` is mechanically comparable but policy-dependent to repair. The rule classifies `spec.md` and `implementation-summary.md` into buckets and defaults enforcement on; the code does not declare which document is authoritative. Therefore a deterministic upgrade may report or reconcile only when a source-of-truth policy is supplied by task completion, canonical-save state, or an explicit status precedence table. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh:31-67]

8. `FRONTMATTER_MEMORY_BLOCK` and `SPEC_DOC_SUFFICIENCY` are continuity/content gates, not simple key-presence repairs. The orchestrator checks required continuity keys and broken parent session ids, while the shared sufficiency model counts support evidence and anchors. Adding empty fields or fabricated fingerprints could make a shape check pass while leaving the historical packet undiscoverable or ungrounded. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:772-803] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:852-901] [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts:360-399]

9. `AI_PROTOCOLS`, `SCAFFOLD_NEVER_TOUCHED`, `SPEC_DOC_INTEGRITY`, and `TOC_POLICY` inspect authored intent or packet claims. AI protocols require named sections/components for Level 3+, scaffold detection is activated by a Complete status and placeholder signatures, document integrity resolves links and metadata pointers, and TOC policy forbids headings in non-research documents. These can be reported deterministically and some can be transformed structurally, but a blanket auto-clear would either author historical guidance, hide a scaffolded packet, delete/move prose, or guess the intended link target. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ai-protocols.sh:147-206] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh:42-55] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh:96-137] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-spec-doc-integrity.sh:119-180] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-toc-policy.sh:9-12] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-toc-policy.sh:25-63]

10. The first safe classification boundary is therefore three-tiered: deterministic transformation candidates are generated metadata, path/identity normalization, known anchor closure, and level/file projection; policy-gated candidates are status reconciliation, template provenance, frontmatter/trigger normalization, archive inclusion, and folder naming; authored-content or truth-claim residuals must remain errors or explicit review findings. This boundary answers the “without authored LLM edits” constraint more precisely than calling every JSONL residual a repair task. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:196-231] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:620-712] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh:50-67]

## Questions Answered

- Which rule families are structurally deterministic? Generated metadata, path/identity normalization, required-file and level projection, and bounded anchor pairing have machine-readable inputs and stable validators.
- Which residuals are not safe to auto-clear? Sufficiency, trigger quality, scaffold truth claims, missing authored protocol content, and unresolved links require content or explicit policy evidence.
- Which current checks are v4-only versus inherited? The tag comparison confirms that basic anchors/files/levels/template provenance/document integrity predate v4, while the current registry adds or hardens metadata/path, status, canonical-save, and shared-judge behavior. Exact per-rule introduction commits remain to be audited.

## Questions Remaining

- What exact source-of-truth precedence can reconcile statuses and generated metadata without overwriting manual evidence?
- Which current rule strengthens a v3 contract versus merely renames or centralizes it?
- What archive traversal flag and audit record prove that archived folders were intentionally included?
- What ordering keeps source-doc edits ahead of metadata refresh and preserves idempotence?

## Dead Ends

- A blanket “regenerate everything” strategy is ruled out: generated metadata is safe only through its canonical writer and authored/manual fields need preservation.
- Adding empty required files or frontmatter keys is ruled out as a full solution because sufficiency and provenance gates inspect content and history.
- Treating the current rule registry as proof that every rule was introduced in v4 is ruled out; v3 tag files already contain several of the structural contracts.

## Scope Violations

None. Tag inspection and validator source reading were read-only; no validator, repair tool, or packet was executed or modified.

## Sources Consulted

- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:5-10]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:196-385]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:601-712]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:772-901]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:441-654]
- [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:9-13]
- [SOURCE: git show v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules/check-files.sh:9-16]
- [SOURCE: git show v3.6.0.0:.opencode/skills/system-spec-kit/scripts/rules/check-canonical-save.sh:6-9]

## Assessment

- newInfoRatio: 0.82
- Novelty justification: This iteration connects the residual labels to executable rule inputs and versioned rule surfaces, producing a defensible three-tier boundary for no-authored-content migration.
- Confidence: high for current rule mechanics; medium for v3-versus-v4 introduction classification until the remaining tag diffs and changelog provenance are audited.

## Reflection

- What worked: reading the registry, native orchestrator, shell bridges, and v3 tag files together exposed where a deterministic writer can rely on machine-readable state and where it would invent historical intent.
- What failed or was ruled out: rule names alone do not identify provenance, and old exit status cannot substitute for the current registry's per-rule severity and strict-mode behavior.

## Recommended Next Focus

Iteration 3: audit v3 tag provenance and residual examples against current validator requirements, distinguishing newly introduced v4 contracts from genuine v3 packet defects and selecting grandfather/policy candidates.
