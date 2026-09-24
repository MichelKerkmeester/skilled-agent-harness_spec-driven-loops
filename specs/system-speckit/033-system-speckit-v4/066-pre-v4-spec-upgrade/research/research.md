---
title: "Research: Pre-v4 spec folders to a full v4 strict pass"
description: "Merged synthesis of two deep-research lineages on how v3.x spec folders reach validate.sh --strict without authored LLM edits: three repair layers, one open scope decision on the upgrade-time finding baseline."
trigger_phrases:
  - "pre-v4 spec upgrade research"
  - "legacy spec folder strict pass"
  - "upgrade-time finding baseline"
importance_tier: "important"
contextType: "research"
---
# Research: Pre-v4 spec folders to a full v4 strict pass

Merged synthesis of lineages `luna` (cli-codex `gpt-5.6-luna`, max effort, fast tier) and `mimo` (cli-pi `llmgateway/mimo-v2.6-pro`, high thinking). Per-lineage syntheses: `lineages/luna/research.md`, `lineages/mimo/research.md`. Merged registry: `findings-registry.json` (79 key findings), attribution in `fanout-attribution.md`.

---

## 1. Executive Summary

A full `validate.sh --strict` pass for every v3.x packet without authored LLM edits is reachable, but only by combining three layers, and the third is a policy decision rather than a transformation.

1. **Deterministic transforms** over derived fields, structural markers and disk identity. The measured existing-tool pipeline reaches 111 of 170 (v3.0) and 686 of 1,007 (v3.6) active packets. The `mimo` lineage projects widened transforms to 138 of 170 and 927 of 1,007. That projection is an upper bound from truncated validator details, not a measured run.
2. **Templated stubs** for required documents that never existed. Projected 143 of 170 and 962 of 1,007.
3. **A validator policy** that accepts findings recorded at upgrade time. Projected 170 of 170 and 1,007 of 1,007.

Both lineages converged on the mechanism for layer 3: a per-finding baseline written by the upgrade command, keyed on packet, rule and diagnostic, under which a recorded finding reports as advisory and every new finding stays a strict error. They disagree on its scope. `luna` would record only findings from rules that did not exist when the packet was written, leaving packets that were already defective under their own v3 rules failing. `mimo` would also record four families of inherited defects, which is what closes the gap to 100%. That is an operator decision, not a finding either lineage can settle.

---

## 2. Research Scope And Verdict

Answers to the five questions in `../spec.md` §10:

1. **Per-rule routes.** Every residual rule has a named route (§5). Twenty rule classes fail somewhere in the data. In `mimo`'s route table, sixteen of them have a deterministic route for at least part of their instances. `FILE_EXISTS`, `AI_PROTOCOLS` and `PLACEHOLDER_FILLED` need templated content, and `FOLDER_NAMING` has only a policy route. Four families have no safe transform: legacy folder names, unresolvable broken links, empty sections, and trigger-phrase quality.
2. **v4 artifact versus v3 defect.** Rule provenance splits the twenty classes into three eras (§6), verified against the tag trees. Seven rules are v4-only, three arrived at v3.6, ten existed at v3.0.
3. **Least validator change.** An upgrade-time per-finding baseline. The existing creation-date cutoff pattern in `check-ac-closure.sh` is the precedent, but keyed on the `Created` date alone it cannot keep new findings in an old packet as errors (§7).
4. **Archives.** Four separate exclusion mechanisms exist, one of them deliberate: `repair-derived.cjs` freezes `z_archive` because pre-rename snapshots record their old location on purpose (§8).
5. **Order and idempotence.** All document edits precede all derivation, because every source edit invalidates a stored fingerprint. Idempotence is provable with a path-and-hash tree manifest diffed between two runs (§9, §10).

Verdict: 100% without authored LLM edits holds only if the operator accepts layer 3 at `mimo`'s scope. At `luna`'s scope the ceiling is layers 1 and 2 plus the v4-only share of layer 3, below 100%, with the remainder being packets that were already failing their own era's rules.

---

## 3. Methodology

Two independent lineages ran five iterations each with `stopPolicy: max-iterations`, over the same brief (`../spec.md`) and the same evidence (`../scratch/harness/data/`, one JSON line per packet after the measured two-tool pipeline).

| Lineage | Executor | Iterations | Wall clock | Notes |
|---|---|---|---|---|
| `luna` | cli-codex `gpt-5.6-luna`, max, fast | 5 of 5 | 32 min | One attempt |
| `mimo` | cli-pi `llmgateway/mimo-v2.6-pro`, high | 5 of 5 | 60 min over three attempts (attempt 3: 46 min) | Attempts 1 and 2 exited 0 without their expected artifact and were retried as `salvage_miss`. The lineage error log holds a `429 Too Many Requests` from the gateway's upstream provider. State resumed on attempt 3 |

### Orchestrator verification

Every claim this synthesis repeats was checked against the repository or the data, not taken from the lineage report.

| Claim | Check | Result |
|---|---|---|
| Rule eras (§6) | `git ls-tree` of each tag's rules directory; `spec-doc-structure.ts` at v3.6 | Confirmed |
| `backfill-graph-metadata` exits 0 with a non-empty `failed[]` | `runtime/cli/graph/backfill-graph-metadata.ts:730-743`; reproduced in the harness run | Confirmed |
| `repair-derived` freezes `z_archive` deliberately | `runtime/cli/spec/repair-derived.cjs:386-389` | Confirmed |
| Creation-date cutoff precedent | `runtime/cli/rules/check-ac-closure.sh:46-61,228-254` | Confirmed, keyed on the `spec.md` metadata `Created` row |
| Status rule compares two documents by bucket | `runtime/cli/rules/check-status-cross-doc-consistency.sh:31-51` | Confirmed |
| Grep-convention entry status comes from the helper's `status` line | `runtime/cli/rules/check-grep-convention.sh:51` | Confirmed |
| `FILE_EXISTS` and `LEVEL_MATCH` report the same absence | Co-occurrence in the data: 63 of 65 (v3.0), 98 of 98 (v3.6) | Confirmed |
| Per-rule enforce switches and the generated-metadata grandfather flag | `runtime/ENV-REFERENCE.md:43-50` | Confirmed |
| Residual counts in §4 | Recounted from `../scratch/harness/data/*.jsonl` | Confirmed |
| `mimo` F-016: the v3.0 command assets emit no anchor markers, so "no anchors found" on a v3.0 document is a template-era artifact | `git show v3.0.0.0` of `.opencode/command/spec_kit/assets/` and `.opencode/skill/system-spec-kit/templates/level_2/` | Refuted. `spec_kit_complete_*.yaml` has 44 lines naming `ANCHOR` each, and the level 2 templates carry 20 (`spec.md`, `plan.md`) and 12 (`tasks.md`, `implementation-summary.md`) marker lines |
| Tier projections 138/927, 143/962, 170/1,007 | Not re-derived | INFERRED, `mimo` classification over details capped at three per rule |

Citation defects found: `lineages/luna/iterations/iteration-005.md` cites `.skilled/skills/system-speckit/...`, a directory that does not exist (the skill is `system-spec-kit`), and cites the packet's own harness scripts `bf-pipeline.sh` and `fullrun.sh` as runtime tools under `runtime/cli/`. Those citations do not resolve and are not repeated here. The claims they backed were re-checked independently above where this synthesis uses them.

---

## 4. Measured Baseline And Residual Surface

Measured on 2026-09-24 with real packets extracted from each tag and today's validator (see `../spec.md` §2).

| Active packets passing `--strict` | v3.0.0.0 (170) | v3.6.0.0 (1,007) |
|---|---|---|
| As upgraded | 2 | 0 |
| `repair-derived --apply` | 74 | 592 |
| `backfill-frontmatter --apply`, then `repair-derived --apply` | 111 | 686 |

Archived packets pass 0 of 186 (v3.0) and 0 of 911 (v3.6) in every row. After the two-tool pipeline, 59 (v3.0) and 321 (v3.6) active packets still fail. They carry 84 and 519 rule-level errors across 10 and 16 rule classes: 17 distinct classes on active packets, 20 once archived packets are counted. Most failing packets fail exactly one rule: 42 of 59 (v3.0) and 209 of 321 (v3.6).

---

## 5. Deterministic Transformation Boundary

Route key: **M** deterministic transform, **T** templated stub or boilerplate, **P** validator policy. Routes from `mimo` §1, with `luna`'s safety objection where it disagrees.

| Rule | Route | Action | Objection or cost |
|---|---|---|---|
| `GENERATED_METADATA_INTEGRITY` | M | Regenerate sidecars through the canonical writer, canonicalize `specFolder`, recompute `source_fingerprint`, map status into the enum | Sidecar churn. `luna`: only through the canonical writer, never by hand |
| `GENERATED_METADATA_DRIFT` | M | Refresh stored `description` and `causal_summary` from the extractor | Stored text replaced by extractor output |
| `METADATA_DISK_PATH_CONSISTENCY` | M | Rewrite recorded paths to the disk-canonical path | Active packets only. Destructive for deliberate archive snapshots |
| `CANONICAL_SAVE_LINEAGE_REQUIRED`, `GRAPH_METADATA_CHILD_IDENTITY` | M | Graph refresh from disk identity | None beyond churn |
| `ANCHORS_VALID` | M | Close unclosed and orphan markers, dedupe, synthesize markers around heading-mapped sections | `luna`: closing known markers is safe, inventing required sections is not |
| `TEMPLATE_SOURCE` | M | Insert one provenance comment in the first 70 lines with an honest legacy value | One comment per document |
| `SCAFFOLD_NEVER_TOUCHED` | M | Replace scaffold titles and continuity placeholders with derived values | Continuity text becomes templated |
| `FRONTMATTER_VALID`, `FRONTMATTER_MEMORY_BLOCK` | M, T | Derive empty fields, recompute fingerprints, compact narrative continuity | `luna`: empty fields or fabricated fingerprints pass a shape check and leave the packet ungrounded |
| `STATUS_CROSS_DOC_CONSISTENCY` | M (`mimo`), P (`luna`) | Derive the state from `tasks.md` completion and rewrite one document's Status | `luna`: the rule names no authoritative document, so this is a meaning-bearing choice |
| `FILE_EXISTS`, `LEVEL_MATCH` | T | Provision a level-appropriate stub with a provenance note; one stub clears both rules | `luna`: a created document is not a truthful one. Stub must also clear placeholder and sufficiency rules |
| `AI_PROTOCOLS` | T | Instantiate standard protocol sections from the era's template | Boilerplate inserted into historical plans |
| `GREP_CONVENTION` | M, P | Synthesize missing frontmatter, repair malformed YAML (M). Trigger-quality complaints (P) | Derived triggers are weak by construction |
| `SPEC_DOC_INTEGRITY` | M, P | Rewrite stale folder metadata, retarget links that resolve (M). Unresolvable links (P) | `mimo` estimates that about 200 of the 295 packets failing this rule, counted over both tags with archives, have a link no transform can fix. Not measured |
| `SPEC_DOC_SUFFICIENCY` | M, P | Repair anchor parse failures (M). Empty sections and missing citations (P) | Cannot be filled without authored content |
| `PLACEHOLDER_FILLED` | T | Fill leftover template placeholders from folder identity | Two instances, both archived |
| `TOC_POLICY` | M | Structural heading edit | One instance |
| `FOLDER_NAMING` | P | None | A rename breaks every cross-packet pointer |

Ordering constraint (`mimo` F-030): these transforms interact. Frontmatter insertion moves the `TEMPLATE_SOURCE` 70-line window, and one anchor marker feeds two rules. They run as one composed pass per document, not as independent steps.

---

## 6. v3/v4 Provenance Matrix

Verified by `git ls-tree` on each tag's rules directory and by `spec-doc-structure.ts` at `v3.6.0.0`.

| Era | Rules | Meaning of a finding on an old packet |
|---|---|---|
| Existed at v3.0.0.0 | `ANCHORS_VALID`, `FILE_EXISTS`, `LEVEL_MATCH`, `TEMPLATE_SOURCE`, `FOLDER_NAMING`, `SPEC_DOC_INTEGRITY`, `AI_PROTOCOLS`, `TOC_POLICY`, `FRONTMATTER_VALID`, placeholder checks | The packet was checkable against this contract when it was written |
| Added at v3.6.0.0 | `FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_SUFFICIENCY`, `CANONICAL_SAVE_LINEAGE_REQUIRED` | Contract artifact for v3.0 packets, possible defect for v3.6 packets |
| v4 only | `GREP_CONVENTION`, `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `METADATA_DISK_PATH_CONSISTENCY`, `STATUS_CROSS_DOC_CONSISTENCY`, `SCAFFOLD_NEVER_TOUCHED`, `GRAPH_METADATA_CHILD_IDENTITY` | Always a contract artifact: the old packet could not have satisfied a rule that did not exist |

Residue (both lineages): a rule existing at a tag shows the check existed, not that the tag's workflow enforced it on every packet. Confirming enforcement means running each tag's own validator over a known-failing fixture. Within an era the split is per pattern, not per rule. Duplicate and unclosed anchors, status contradictions, broken links and stale paths are defects under any era. `mimo` F-016 also classed "no anchors found" on a v3.0 document as a template-era artifact, on the premise that the v3.0 command assets emitted no anchor markers. That premise is refuted (§3): the v3.0 templates and command assets both carry markers. The pattern is also not v3.0-specific. Among the capped details it appears 22 times on active v3.0 packets and 101 times on active v3.6 packets. A document with no anchors was written outside the template in either era, so it is a defect under the era's own rule. The M route that synthesizes markers around heading-mapped sections still applies. Only the provenance label changes, and that decides whether the finding may enter a v4-only baseline (§7).

---

## 7. Least Validator Policy

Both lineages rejected a global downgrade, a packet-level switch, and the existing `SPECKIT_GENERATED_METADATA_GRANDFATHER` flag as a completion policy. Each would hide new findings in packets created after v4.

**Converged mechanism.** The upgrade command writes a per-finding baseline: packet, rule id, diagnostic hash, tag provenance, and the reason no transform applies. The validator reports a finding that matches a baseline entry as advisory. Any finding not in the baseline, including a new finding in an upgraded packet, stays a strict error. This is the same regression-only principle `.github/workflows/changed-packet-validation.yml:114-160` already applies in CI.

**Why not a date cutoff alone.** `check-ac-closure.sh` keys grandfathering on the `spec.md` `Created` row. Applied here it would keep an old packet advisory forever, so a new mistake in a reopened packet would pass (`mimo` F-025). It would also enforce every rule on v3 packets created after the v4 release by a user who upgraded late. A date can serve as a cheap pre-filter, not as the policy.

**The open scope decision.**

| Scope | Baseline records | Result |
|---|---|---|
| `luna` | Findings from v4-only rules, plus v3.6 rules on v3.0 packets, that no transform can clear | Below 100%. Packets already failing their own era's rules keep failing |
| `mimo` | The above, plus four inherited families: legacy folder names, unresolvable links, empty sections and citations, trigger quality | 100% projected |

---

## 8. Archive And Future Scope

Four independent exclusion mechanisms exist (`mimo` F-022): `repair-derived`'s frozen trees, its packet-name gate, `backfill-frontmatter`'s `--include-archive`, and `backfill-graph-metadata`'s archive segment match over `z_archive` and `z_future`. They do not agree, and `z_future` is not frozen by `repair-derived` (`repair-derived.cjs:389` lists `z_archive` only).

Both lineages agree on the rule: count active, `z_archive` and `z_future` separately, and never repair an archive in place by default. `z_archive` holds pre-rename snapshots whose old recorded location is the point of keeping them, so a path "repair" destroys what the copy preserved (`repair-derived.cjs:386-388`). An include mode may transform additively (sidecar creation, enum mapping) and must send snapshots, non-numeric folders and fixture folders to the baseline instead of rewriting them.

---

## 9. Ordered Execution And Failure Propagation

The ordering law is fingerprint invalidation: every source edit stales the stored fingerprint, so every document edit runs before any derivation.

1. Freeze the scope manifest and capture the strict baseline, read-only.
2. Provision stubs for missing required documents.
3. One composed rewrite pass per document (frontmatter, markers, placeholders), then one status pass per folder.
4. `backfill-frontmatter --apply --skip-templates`.
5. `repair-derived --apply`, which ends in re-derivation.
6. Write the finding baseline for what remains.
7. `validate.sh --strict` as the gate.
8. Second run as the idempotence check.

No step may be judged by its exit code. `backfill-graph-metadata` exits 0 with failures, and `repair-derived` trusts that exit code, so a refused write reports as repaired. The upgrade command must parse each tool's structured report and fail closed on a non-empty failure list.

---

## 10. Idempotence And Fingerprint Proof

Four checks (`mimo` F-031, `luna` iteration 5): a report-mode rerun plans zero edits; a path-plus-sha256 manifest of the tree is identical between run one and run two; strict validation JSON is identical between runs; and the files an apply run changes match the files its dry run listed. After each step, assert that no rule class appears that was absent before it.

---

## 11. Recommendations

1. Build one dry-run-by-default upgrade command that runs §9 in order and fails closed on any tool's reported failure.
2. Fix the two measured tool defects first: `backfill-graph-metadata` exits non-zero when `failed[]` is non-empty, and `repair-derived` stops trusting a child's exit code alone.
3. Implement the M-route transforms in §5 as one composed pass per document.
4. Implement the upgrade-time finding baseline in the validator, with new findings always strict.
5. Decide the baseline scope (§7) and whether T-route stubs are acceptable. Those two choices set the final pass rate.
6. Count `z_archive` and `z_future` separately and leave them read-only unless an include mode is asked for.
7. Measure, do not project: re-run the harness over both tags after the build. The §2 projections are upper bounds.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Lineage |
|---|---|---|---|
| Global severity downgrade or packet-level grandfather switch | Hides new findings in packets created after v4 | `ENV-REFERENCE.md:43-50` | both |
| Generated-metadata grandfather flag as the final pass | Turns unresolved violations into telemetry | `ENV-REFERENCE.md:43` | both |
| Creation-date cutoff as the whole policy | A reopened old packet would pass new mistakes; late upgraders' v3 packets would be fully enforced | `check-ac-closure.sh:228-254` | `mimo` F-025 |
| Blanking a Status field to reach the not-applicable branch | Masks every future status finding | `check-status-cross-doc-consistency.sh:44-47` | `mimo` |
| Canonicalizing status tokens in place | The rule compares two documents' buckets, so one-sided token edits change nothing | `check-status-cross-doc-consistency.sh:31-51` | `mimo` F-018 corrected F-009 |
| Automatic folder renames | Break every cross-packet pointer, parent id and link | `mimo` F-027 | `mimo` |
| In-place repair of `z_archive` | Destroys the deliberately old recorded location of pre-rename snapshots | `repair-derived.cjs:386-388` | both |
| Treating `z_future` as `z_archive` | The tools do not share one inclusion rule for it | `repair-derived.cjs:389` | both |
| Judging a step by its exit code | Graph backfill exits 0 with failures | `backfill-graph-metadata.ts:730-743` | both |
| Derived repair before source normalization | Source edits stale the fingerprints it just wrote | measured, `../spec.md` §2 | both |
| Authored LLM edits or empty-shape rewrites | Invent historical meaning, outside the packet's scope | `../spec.md` §3 | both |
| Classing "no anchors found" on v3.0 documents as a template-era artifact | Its premise, that the v3.0 command assets emitted no markers, is false, and the pattern is as common in v3.6 | `git show v3.0.0.0` of the command assets and templates | `mimo` F-016, refuted in §3 |
| Treating capped details as the full inventory | Details are capped at three per rule | `../scratch/harness/validate-all.cjs` | both |

---

## Divergence Map

No divergent pivots were run: `convergenceMode` was `default` with `stopPolicy: max-iterations`, so every iteration ran and convergence was telemetry only.

The lineages diverged in method and in one conclusion:

- **Method.** `luna` classified by rule and contract, mostly from implementation reading. `mimo` classified by detail pattern, from a census of every detail string in the data, then checked implementations.
- **Conclusion.** Both reached the upgrade-time finding baseline independently. They split on its scope (§7) and on whether T-route stubs and evidence-derived status rewrites count as honest (§5). The split is a policy question the evidence cannot settle, so it is escalated rather than averaged.
- **Remaining frontier.** Measured results of the widened transforms, and whether each tag's own workflow enforced its rules.

---

## 12. Open Questions

1. Baseline scope: `luna`'s (v4-only findings, below 100%) or `mimo`'s (plus four inherited families, 100%)? **Resolved 2026-09-24 by the operator: `mimo`'s scope.**
2. Are T-route stubs for missing required documents acceptable in historical packets? **Resolved: no. Missing documents are recorded in the baseline.**
3. Is deriving a packet's status from `tasks.md` completion acceptable, or does status stay a baseline entry? **Resolved: status stays a baseline entry.**
4. The measured, not projected, pass rate of the widened transforms.
5. Whether each tag's own workflow enforced its rules, which settles how many inherited findings were already known to users.

---

## 13. Confidence Assessment

- **High:** the measured baseline, the rule eras, the tool defects, the ordering law, the archive rationale. Each was verified in §3.
- **Medium:** the per-rule routes. They are grounded in rule implementations, but instance coverage is bounded by the three-detail cap.
- **Low until measured:** the tier projections of 81%, 84% and 100% (v3.0) and 92%, 96% and 100% (v3.6).

---

## 14. Source Diversity

Two model families (OpenAI via Codex, Xiaomi MiMo via LLM Gateway) over the same brief, with different methods (§Divergence Map). Sources: rule implementations under `.skilled/skills/system-spec-kit/runtime/`, the two tag trees through read-only git, and the packet's measured residual data. No web sources were needed.

---

## 15. Implementation Handoff

Next: `/speckit:plan` on this packet. §12 questions 1 to 3 are resolved: the baseline takes `mimo`'s scope, and the T-route and the status rewrite both become baseline entries, so the build has two layers, transforms and baseline. The plan's proof gate is the harness in `../scratch/harness/` run over both tags, reporting measured pass counts and an empty second-run diff.

---

## 16. Convergence Report

- Stop reason: maxIterationsReached (`stopPolicy: max-iterations`)
- Total iterations: 10 (5 per lineage)
- Questions answered: `luna` 5 / 5, `mimo` 4 / 5 by each lineage's own terminal record. Every question has a design-level answer from at least one lineage, with the scope decision escalated
- Last iterations: `luna` new-info ratio 0.78, 0.69, 0.62 (iterations 3 to 5); `mimo` 0.75, 0.75, 0.70. Neither lineage approached the 0.05 threshold
- Convergence threshold: 0.05 (telemetry only)
- Divergence summary: no divergent pivots recorded
- Run: 2 of 2 lineages succeeded, both `completed_with_containment_advisory`. The advisories were caused by another session editing `sweep-track-roots.mjs` in the same checkout, preserved and not reverted.
- Lineage state: the append gateway refused `mimo`'s projections for iterations 3 to 5 and its terminal record (`refused:ATTRIBUTION_COLLAPSE`), so those rows were written to its state log directly. Two early rows fall before attempt 3's window (`orchestration-summary.json`, `timestamp_anomalies`).
- Synthesis invariant: the synthesis step recorded `synthesis_incomplete` with one failure, `missing_synthesis_artifacts` for the root `deep-research-dashboard.md`. Fan-out keeps one dashboard per lineage and no fan-out step writes a root dashboard. The other invariants held: 79 registry findings against 79 source findings, no reconstruction gap, no parse failure.

---

## 17. References

- `../spec.md` and `../scratch/harness/`
- `lineages/luna/research.md`, `lineages/mimo/research.md`, and their `iterations/`
- `findings-registry.json`, `fanout-attribution.md`, `resource-map.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention.sh`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`
- `.github/workflows/changed-packet-validation.yml`
