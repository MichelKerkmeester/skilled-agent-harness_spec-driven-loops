# Iteration 4: Minimal Policy and Explicit Archive Inclusion

## Focus

Design the least-invasive migration policy that preserves new v4 findings as strict errors while allowing deterministic treatment of legacy residuals, and define safe explicit inclusion semantics for archived and future packets.

## Actions Taken

- Read the existing derived-repair contract, its derivable/authored split, dry-run/apply behavior, and archive traversal rules.
- Read frontmatter backfill options, graph backfill scope controls, and the validation harness’s active/archive classification.
- Compared the tools’ default archive behavior and identified where a scope manifest is needed to make the “every folder” claim auditable.
- Kept this iteration at policy/design level; no repair or validation command was run.

## Findings

1. The least-invasive validator policy is to keep v4 strict errors unchanged and put migration exceptions in a separate, scoped evidence manifest. The current registry already distinguishes authored-template, structural, and operational rules, while the environment documentation exposes narrow grandfather/enforcement flags. A global downgrade would hide new findings in packets that were created after the v4 contract. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:37-56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:277-385] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50]

2. `repair-derived.cjs` already encodes the right safety boundary for deterministic migration: it repairs only a small `DERIVABLE` set, separates `REDERIVABLE` metadata rules, reports authored rules as blocked, reports derivable-but-unsettled cases as beyond reach, and states dry-by-default/idempotent behavior. This should be the migration contract, with its report promoted to a machine-readable evidence ledger rather than expanding the derivable set to make the pass rate green. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59-94] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:333-379]

3. The v4 strict gate should remain an error for new or unclassified findings. A pre-v4 exception is defensible only when it names the packet, rule, diagnostic detail hash, tag provenance, and reason the fact cannot be derived without authored content; it must not convert a `FILE_EXISTS`, broken-link, malformed-anchor, or other inherited defect into a pass. This preserves the distinction between “known historical debt” and “validator defect.” [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22]

4. Archive inclusion is currently tool-specific and therefore unsafe as an implicit global policy. Frontmatter backfill excludes `z_archive` by default and exposes `--include-archive`; graph backfill exposes `--active-only`, `--include-archive`, and `--all`; `repair-derived.cjs` has no archive flag and freezes `z_archive` during discovery; the validation harness still walks and labels both `z_archive` and `z_future`. A one-command upgrade needs an explicit scope manifest with separate active, archived, future, skipped, and unreadable counts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:124-144] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:151-182] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:319-365] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:386-413] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:14-20] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-45]

5. `z_archive` is not an ordinary active packet tree: the derived repair tool documents snapshots as frozen because their recorded location may intentionally be the old location. Therefore safe archive handling must default to read-only validation/reporting, and any repair of archived material must be an explicit, separately labeled migration of a copied snapshot with identity-preservation rules. Blindly enabling archive traversal for the same in-place writer would rewrite historical evidence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:386-413] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:71-73]

6. `z_future` needs a distinct policy from `z_archive`. The validation harness labels it as archived for measurement, but the backfill and repair tools do not expose one consistent “include future” contract. The safest proof is to enumerate it separately and require an explicit operator-selected inclusion mode; otherwise the final claim must say that future packets were measured but not mutated. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-45] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:441-487] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:389-413]

7. The existing generated-metadata grandfather switch is useful as a temporary migration telemetry mode but too broad as the completion policy. It can report a tree that has not been restamped, but current documentation says the default is enforcing and separately records path/status graduation. The upgrade should use the flag only in an isolated preflight, capture all violations, then run strict with the flag off; it must not be the final pass condition. [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:173-183]

8. A safe minimal policy has four lanes: (A) deterministic repair and re-derive for facts from disk; (B) explicit per-rule grandfather records for historical v4-only findings that cannot be derived; (C) unchanged strict errors for inherited defects and all new/unclassified findings; and (D) read-only archive/future accounting unless an explicit scope manifest authorizes a copied-tree migration. This preserves strictness while making the no-authored-LLM boundary operational. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:75-94] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:57-77] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:567-581]

9. The proof obligation for “every folder” is broader than a final zero exit code. The validation harness can emit one row per packet with an archived label, rule list, and bounded details; the migration ledger should retain the before/after row counts, per-rule residuals, skipped-scope reasons, and exact scope manifest. This prevents archive omission or a silently unreadable packet from appearing as a successful pass. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-3] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/agg.cjs:5-17]

## Questions Answered

- Least-invasive policy: preserve strict errors, use the existing deterministic repair boundary, and permit only explicit per-rule historical exceptions backed by immutable provenance evidence.
- Safe archive behavior: enumerate active, `z_archive`, and `z_future` separately; default archived/future treatment to read-only reporting; require explicit scope authorization and copied-tree identity rules before any historical mutation.

## Questions Remaining

- What exact ordered stages and fingerprints prove the pipeline is idempotent after source-doc and metadata writes?
- Which deterministic transformations can be applied to archived copies without violating frozen snapshot identity?
- What evidence-manifest schema and expiry rule make historical exceptions auditable without weakening future packets?

## Dead Ends

- A global `SPECKIT_GENERATED_METADATA_GRANDFATHER` final run is ruled out because it converts unresolved metadata integrity into telemetry rather than a strict proof.
- Reusing active repair defaults for `z_archive` is ruled out because snapshots are intentionally frozen by the repair tool.
- Treating `z_future` as equivalent to `z_archive` is ruled out because the tools expose inconsistent inclusion semantics.

## Scope Violations

None. Tool contracts and source files were read only; no repair, validation, archive mutation, or target write was executed.

## Sources Consulted

- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59-94]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:333-413]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:124-182]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:319-365]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:546-654]
- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:1-50]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50]

## Assessment

- newInfoRatio: 0.69
- Novelty justification: This iteration converts the provenance split into an explicit four-lane migration policy and exposes archive inclusion as a separate scope/audit contract rather than an incidental tool default.
- Confidence: high for current tool options and frozen-archive behavior; medium for the final exception-manifest shape until ordering and idempotence are proved.

## Reflection

- What worked: the existing repair tool’s derivable/authored/beyond categories and the separate archive flags provide a concrete minimal policy surface.
- What failed or was ruled out: a single global grandfather switch, a packet-level exception, and implicit archive traversal cannot support an auditable every-folder claim.

## Recommended Next Focus

Iteration 5: prove the ordered pipeline and idempotence contract, including before/after fingerprints, failure propagation, repeated-run no-op behavior, and the final evidence ledger needed for synthesis.
