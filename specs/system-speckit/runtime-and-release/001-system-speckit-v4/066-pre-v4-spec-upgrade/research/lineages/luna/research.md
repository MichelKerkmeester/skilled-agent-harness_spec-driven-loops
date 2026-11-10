---
title: "Deep Research Synthesis: v3.x Spec Folders to v4 Strict Validation"
trigger_phrases: []
---
# Deep Research Synthesis: v3.x Spec Folders to v4 Strict Validation

## 1. Executive Summary

Every v3.x packet cannot honestly be made to pass v4 `validate.sh --strict` by a generic metadata rewrite alone. The measured active baseline is 797 passes and 380 failures across 1,177 packets; the archived population contains 1,097 packets and has zero passes under the measured default policy. Residuals mix old structural defects, v3.6 continuity/graph contracts, current v4 hardening, and authored truth claims. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:65-84] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50]

The least-invasive route is a deterministic, evidence-producing migration pipeline with four lanes: repair facts derivable from disk; record narrowly scoped historical evidence for findings that are genuinely newer than the packet and cannot be derived; keep inherited defects and new or unclassified findings strict errors; and account for `z_archive` and `z_future` separately, read-only by default. This can meet the no-authored-LLM requirement for the deterministic lane, but it cannot turn authored-content or inherited-defect failures into truthful passes without either source evidence or an explicit policy decision.

The operational order is source-document normalization, structured report inspection, derived repair and re-derivation, strict validation, then a second-run no-op comparison using a frozen scope and before/after fingerprints. A terminal exit code is not enough: graph backfill can return zero with a non-empty `failed[]` summary, and validator detail rows are capped. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/bf-pipeline.sh:18-25] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:603-657] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50]

## 2. Research Scope And Verdict

The research answered five questions:

1. **Deterministic classes and cost:** file/level projection, known structural closure, generated metadata, path/identity normalization, and source-derived frontmatter can be repaired when authoritative inputs exist. The cost is a source fingerprint, a bounded writer, re-derivation, a report, and a proof that no authored meaning was invented. Anchors are only partly mechanical when required content is missing. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh:41-88] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh:160-218] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661-712]
2. **v4-only versus legacy:** v3.0.0.0 already carried files, levels, anchors, naming, frontmatter, links, template source, TOC, and AI-protocol surfaces; v3.6.0.0 added continuity, graph metadata, canonical save, and spec-document structure. Grep convention, generated metadata/drift, metadata path, status cross-document, and scaffold detection are current hardened surfaces in the v4 registry. [SOURCE: git ls-tree v3.0.0.0:.opencode/skill/system-spec-kit/scripts/rules] [SOURCE: git ls-tree v3.6.0.0:.opencode/skills/system-spec-kit/scripts] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:37-56]
3. **Least policy change:** keep strict errors unchanged and use a per-rule, per-packet historical evidence manifest only for a finding that is proven to be a v4-only contract addition and cannot be derived. No packet-level or global grandfather switch should mask inherited defects or new findings. [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84]
4. **Archives:** enumerate active, `z_archive`, and `z_future` separately. Treat frozen `z_archive` snapshots as read-only by default and require an explicit copied-tree migration with identity-preservation rules. Treat `z_future` as a separate explicit population, not as an alias for archive. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:386-413] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:441-487]
5. **Ordering and idempotence:** normalize source documents first, inspect the report, repair and re-derive derived metadata, inspect structured failures, validate strictly, then repeat a dry-run/validation pass against the same scope and compare stable fingerprints. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-80] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:333-379]

Verdict: a full strict pass is achievable without authored LLM edits only where the failure is a deterministic projection of authoritative disk state or where a separately governed historical evidence policy explicitly accounts for a v4-only contract. The research did not execute repair or validation commands, so this is an evidence-backed design and proof contract, not a claim that the current checkout already passes.

## 3. Methodology

- Iteration 1 aggregated the packet-local JSONL baselines, active/archive split, rule frequencies, and bounded residual details.
- Iteration 2 traced rule names into the v4 registry, validator orchestrator, bridges, and source-of-truth inputs.
- Iteration 3 compared v3.0.0.0 and v3.6.0.0 tag surfaces with concrete residual rows and built a per-rule provenance matrix.
- Iteration 4 compared repair/backfill scope controls and defined the strict four-lane policy plus explicit archive behavior.
- Iteration 5 traced ordering, report shapes, exit semantics, fingerprint behavior, and repeated-run proof obligations.
- Evidence covered packet specifications, JSONL data, shell and TypeScript tools, validator registry/implementation, environment policy, and versioned Git tag surfaces. Every iteration wrote a cited markdown record and a JSONL delta; every iteration event was accepted by the canonical gateway.

## 4. Measured Baseline And Residual Surface

| Population | Total | Pass | Fail | Pass rate |
| --- | ---: | ---: | ---: | ---: |
| v3.0 active | 170 | 111 | 59 | 65.3% |
| v3.6 active | 1,007 | 686 | 321 | 68.1% |
| Active combined | 1,177 | 797 | 380 | 67.7% |
| Archived combined | 1,097 | 0 | 1,097 | 0% |

Active residuals include anchors, spec-document integrity and sufficiency, file/level requirements, template provenance, grep convention, generated metadata integrity and drift, metadata path consistency, status cross-document consistency, scaffold protection, and AI protocols. The harness caps details to three entries per rule row, so its JSONL is a baseline and representative sample, not a complete repair inventory. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:65-73] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50]

## 5. Deterministic Transformation Boundary

Safe deterministic candidates are facts whose authority is already present in the packet or filesystem:

- required file existence and level projection;
- generated graph and derived metadata when packet identity and source inputs are authoritative;
- metadata disk-path normalization;
- re-derivation after a source change;
- known structural anchor closure when the required document content already exists;
- source-derived frontmatter normalization where the parser has an unambiguous value.

`repair-derived.cjs` makes this boundary concrete by separating derivable, re-derivable, authored, and beyond-reach rules, and by remaining dry by default and idempotent. The cost of each repair is an input fingerprint, a bounded write, a report of changed/unchanged/blocked/beyond cases, and a re-derivation pass. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59-94] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:333-379]

Not safe for silent deterministic invention: missing authored content, template provenance without a source, status values without a declared authority, sufficiency or continuity truth, broken links, malformed content, and convention/trigger claims whose meaning depends on author intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:35-65] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:772-803] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh:38-67]

## 6. v3/v4 Provenance Matrix

| Provenance class | Representative rules | Treatment |
| --- | --- | --- |
| v3.0.0.0 core | files, levels, anchors, naming, frontmatter, links, template source, TOC, AI protocols | Do not assume compatibility debt; repair only deterministic facts and keep genuine defects strict |
| v3.6.0.0 additions | continuity, graph metadata, canonical save, spec-document structure | Use source-derived repair where inputs are authoritative; preserve authored truth and provenance checks |
| Current v4 hardening | grep convention, generated metadata/drift, metadata path, status cross-document, scaffold protection | Enforce for new and unclassified findings; allow no blanket grandfather |

The two tag populations are mixed: v3.0 rows include defects under their own contracts, and v3.6 rows include both legacy defects and current hardened findings. Therefore provenance must be attached per rule and diagnostic row, not inferred from packet tag or a single packet-level switch. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl:1-170] [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl:1-1007] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:214-405]

## 7. Least Validator Policy

The least policy change is strict-by-default with four explicit lanes:

1. **Deterministic repair:** apply only transformations whose inputs and output are derivable from disk.
2. **Historical evidence:** record packet, rule, diagnostic hash, tag provenance, and reason for any narrowly scoped v4-only exception that cannot be derived without authored content.
3. **Unchanged strict errors:** inherited defects, new findings, unclassified rows, authored-content gaps, and failed evidence remain errors.
4. **Scope accounting:** measure archive and future populations separately and mutate them only under an explicit scope manifest.

The generated-metadata grandfather switch may be used in a preflight to measure unstamped history, but it is not a completion policy. The final proof must run with grandfathering disabled. [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:43-50] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:173-183]

## 8. Archive And Future Scope

Archive behavior must be explicit because the tools disagree by default. Frontmatter excludes `z_archive` unless `--include-archive` is passed; graph backfill exposes `--active-only`, `--include-archive`, and `--all`; derived repair freezes `z_archive` and has no include switch; the harness labels both `z_archive` and `z_future`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:124-182] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:319-365] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:386-413]

The migration must freeze one scope manifest before writing and report active, `z_archive`, `z_future`, skipped, and unreadable counts. `z_archive` snapshots are read-only by default because their recorded location may intentionally preserve history; a mutation requires a copied tree, explicit identity rules, and a separate evidence result. `z_future` is neither silently skipped nor silently treated as archive: it is enumerated and requires its own operator-selected mode. [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/validate-all.cjs:38-50] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:441-487]

## 9. Ordered Execution And Failure Propagation

The proof-preserving stage order is:

1. Freeze and hash the scope manifest plus source/derived inputs.
2. Run source-document/frontmatter normalization and capture its report.
3. Stop or quarantine on source-stage failures; do not silently continue.
4. Run derived repair and graph backfill, re-deriving after every source edit.
5. Parse every structured summary, including graph `failed[]`, `reviewFlags[]`, drift, skipped, and prune candidates; combine this with exit status.
6. Run `validate.sh --strict` and retain per-packet and aggregate rule results.
7. Run the no-op proof against the same scope.

The existing wrappers demonstrate the required order but use `set -uo pipefail` and continue after printing stage statuses. A new orchestrator must make failure propagation explicit. Frontmatter's `failed` count and exit status are jointly useful; graph's non-empty `failed[]` is authoritative even when the process exits zero. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/bf-pipeline.sh:1-25] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/fullrun.sh:1-23] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:546-581] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts:730-743]

## 10. Idempotence And Fingerprint Proof

The first run must record source hashes, derived metadata hashes, graph content hashes, scope membership, tool versions, ignored volatile fields, changed/unchanged counts, and all failure/review categories. Stable graph candidate ordering and deterministic content hashes make before/after comparison reproducible; volatile fields must be named rather than silently discarded. [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:117-151] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:603-609]

The second run is a no-op only if all of the following hold: source backfill reports no changes and no failures; derived repair reports no pending repairable facts and no failures; graph comparison reports `changed=0` apart from the declared volatile fields; scope hashes are identical; and strict validation produces identical aggregate and per-rule residual counts. Any changed scope, non-empty failure/review array, changed hash, or count drift fails the proof even if the last process exit code is zero. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:579-593] [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/backfill-frontmatter.ts:573-590] [SOURCE: .skilled/skills/system-speckit/runtime/cli/graph/backfill-graph-metadata.ts:603-646]

## 11. Recommendations

Build one deterministic upgrade command around the existing tools, but add the missing contract around them:

1. Generate a read-only scope manifest and baseline strict results before any write.
2. Normalize source documents first; persist the full frontmatter report.
3. Apply only bounded derived repair and graph backfill; re-derive after source edits.
4. Parse structured reports and fail closed on failures, review flags, drift, or unexpected skips.
5. Preserve a per-rule historical evidence manifest instead of changing global validator severity.
6. Validate active packets strictly; enumerate `z_archive` and `z_future` separately and mutate them only under explicit copied-tree scope.
7. Repeat the pipeline in dry-run mode and compare scope, fingerprints, counts, and residuals.
8. Claim “full pass without authored LLM edits” only for packets whose remaining failures are cleared by the deterministic lane or are explicitly governed by the evidence policy. Do not claim the current repository is already green until the command is actually run and its JSON failures are inspected.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Active-only upgrade | It cannot meet the every-folder requirement; all measured archived packets fail under the default policy | `spec.md:71-73` | 1 |
| Treat capped validator details as the full inventory | Details are capped per rule and omit the complete repair population | `scratch/harness/validate-all.cjs:38-50` | 1, 5 |
| Treat all v3.0 residuals as compatibility debt | v3.0 contains genuine defects under pre-v4 contracts | `scratch/harness/data/v3.0.0.0.final.jsonl:12,45,117,131,159` | 3 |
| Treat all v3.6 residuals as legacy defects | v3.6 mixes legacy and current hardened findings | `scratch/harness/data/v3.6.0.0.pipeline.jsonl:2,586,721,818` | 3 |
| Packet-level grandfather switch | Mixed rows need per-rule provenance and new v4 findings must remain errors | `spec.md:75-84`; `ENV-REFERENCE.md:43-50` | 3, 4 |
| Global generated-metadata grandfather as final proof | It changes unresolved violations into telemetry instead of strict evidence | `ENV-REFERENCE.md:43-50,173-183` | 4 |
| Reuse active repair defaults for `z_archive` | Derived repair treats archived snapshots as frozen | `repair-derived.cjs:386-413` | 4 |
| Treat `z_future` as equivalent to `z_archive` | Tools expose no common inclusion semantics and future packets need explicit policy | `validate-all.cjs:38-45`; `backfill-graph-metadata.ts:441-487` | 4 |
| Rely on shell exit status alone | Graph backfill can return zero with non-empty `failed[]` | `backfill-graph-metadata.ts:603-657,730-743` | 5 |
| Run derived repair before source normalization | Source edits stale prior derived fingerprints | `spec.md:75-80`; `repair-derived.cjs:346-376` | 5 |
| Use authored LLM edits or empty-shape rewrites | They invent historical meaning and do not satisfy the no-authored-content scope | `repair-derived.cjs:7-22`; `spec.md:82-84` | 1-5 |

## 12. Open Questions

The five research questions are resolved at the design level. Implementation-time unknowns remain: the exact shape of a production evidence-manifest schema and expiry process, the operator’s policy for copied `z_archive`/`z_future` migrations, and the measured result of running the proposed command against the live tree. Those are execution and governance questions, not unresolved evidence about the researched tool contracts.

## 13. Confidence Assessment

| Claim | Confidence | Basis |
| --- | --- | --- |
| Active/archive measured baseline | High | Packet specification and JSONL harness aggregation |
| v3.0/v3.6 rule provenance split | High | Tag surfaces plus concrete residual rows |
| Deterministic/authored boundary | High | Registry, orchestrator, and repair-derived classifications |
| Strict four-lane policy | Medium-High | Directly grounded in current tool contracts; manifest schema remains a design choice |
| Archive read-only default | High | Frozen-tree implementation and tool-specific switches |
| Ordered pipeline and failure obligations | High | Packet requirement plus wrapper/report implementation |
| Full pass without authored edits in the live repository | Not established | No repair or validation command was run in this lineage |

## 14. Source Diversity

Evidence spans the packet specification, two tag-population JSONL datasets, a packet-local validation harness, the v4 validator registry and TypeScript orchestrator, shell rule bridges, environment policy, frontmatter and graph backfill implementations, derived repair, two pipeline wrappers, and Git tag surfaces. Five iterations cross-checked counts, implementations, provenance, policy, and idempotence; no single weak source carries the conclusion.

## 15. Implementation Handoff

The follow-up implementation should first create the read-only scope/fingerprint/evidence ledger and fixture the four lanes. It should then run source normalization before derived repair, parse all structured summaries, keep strict validation enabled, and prove the second-run no-op. Archive and future work should use copied-tree or read-only modes until identity policy is explicit. No production code, validator, packet spec, harness input, or generated context was changed in this research run.

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Iterations: 5/5
- Tracked questions answered: 5/5
- Iteration statuses: 5 `insight`
- New-information trend: `0.88 -> 0.82 -> 0.78 -> 0.69 -> 0.62`
- Average newInfoRatio: `0.758`
- Convergence threshold: `0.05`
- Early convergence: telemetry only; the configured five-iteration cap was honored
- Terminal event: `synthesis_complete` with `stopReason` `maxIterationsReached`

## 17. References

- `iterations/iteration-001.md` through `iterations/iteration-005.md`
- `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `findings-registry.json`
- `deep-research-dashboard.md`
- `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md`
- `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.0.0.0.final.jsonl`
- `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/scratch/harness/data/v3.6.0.0.pipeline.jsonl`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/bf-pipeline.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/fullrun.sh`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`
