# Research: How pre-v4 spec folders reach a full strict pass without authored LLM edits

Fan-out lineage mimo (session fanout-mimo-1790242274086-9tq1wi) | 5 iterations | stopReason: maxIterationsReached | Synthesis of F-001 to F-032

## Summary

Every spec folder written under spec-kit v3.x can reach a full `validate.sh --strict` pass with zero authored LLM edits, through one deterministic upgrade command whose clearing power is three layers. Layer M applies deterministic transforms over derived fields and structural markers. Layer T provisions templated stubs and boilerplate where a required artifact is simply absent. Layer P is a bounded validator-policy change that grandfathers exactly four finding families for pre-cutoff packets while keeping every post-cutoff finding an error. Projected on the measured residual (upper bound, details truncated to three per rule): active corpora reach 170 of 170 (v3.0.0.0) and 1,007 of 1,007 (v3.6.0.0) at M+T+P (F-010), with M alone already at 138 and 927. The policy surface is bounded to four families, so the "least validator change" question resolves to extending a grandfather pattern that already exists in the rule layer rather than inventing a mechanism (F-019).

## 1. Per-class route table (Q1)

Route key: M = deterministic transform, T = templated stub or boilerplate, P = validator policy (grandfathered advisory pre-cutoff, error post-cutoff). Every cost names what the route consumes or risks.

| Rule | Route | Deterministic action | Cost / caveat |
|------|-------|----------------------|---------------|
| GENERATED_METADATA_INTEGRITY | M | Regenerate sidecars; canonicalize specfolder to root-relative; recompute source_fingerprint; map status into the enum; recompute completion evidence from tasks.md; schema-fill migration_source and depends_on/related_to source fields | Sidecar churn; schema fills adopt derived values and freeze any misclassification |
| GENERATED_METADATA_DRIFT | M | Refresh stored description and causal_summary from the fresh deterministic extraction | Stored values replaced by extraction-heuristic output |
| METADATA_DISK_PATH_CONSISTENCY | M (active) | Rewrite recorded specfolder, packet_id, parent_id and continuity pointer to the disk-canonical path | In-document rewrites bounded to the frontmatter pointer line precedent (F-026); see archives in section 4 |
| ANCHORS_VALID | M | Synthesize missing anchor markers around heading-mapped sections; repair unclosed, duplicate and orphan markers | Marker placement needs a heading-to-anchor map; unmappable headings fall to P |
| SPEC_DOC_INTEGRITY | M + P | Stale folder metadata: rewrite to disk path. Broken markdown links: retarget when the target resolves to an existing file, else beyond-reach to P | Unresolvable links have no safe deterministic fix (F-032) |
| GREP_CONVENTION | M + P | Missing frontmatter: synthesize from folder metadata. Malformed YAML and duplicate keys: structural repair. Generic-trigger and naming-exception quality complaints: P | Trigger-phrase enrichment without authored text is low quality by definition |
| SPEC_DOC_SUFFICIENCY | M + P | Anchor parse failures and missing required anchors: marker repair/synthesis (M). Empty sections and missing-citation findings: P | Empty sections cannot be filled without authored content; placeholders would trip PLACEHOLDER_FILLED |
| FILE_EXISTS | T | Provision a level-appropriate stub carrying a provenance note | New files that never existed historically; stub shape must clear sufficiency and placeholder rules |
| LEVEL_MATCH | T + M | Required-file missing: same stub as FILE_EXISTS (one absence, two rules, F-012). Invalid or missing level declaration: rewrite declaration to the derived level | Level derivation adopts the tooling's own classification |
| STATUS_CROSS_DOC_CONSISTENCY | M (evidence-derived) | Pairwise bucket alignment: derive the true state from tasks.md completion evidence and rewrite one document's Status to the canonical bucket token the rule reports | Status values lose prose nuance; must adopt the rule's classification, never re-derive it (F-009, F-018) |
| TEMPLATE_SOURCE | M | Insert one provenance comment within the first 70 lines with an honest legacy value | One comment line per document; no content bytes changed (F-020) |
| SCAFFOLD_NEVER_TOUCHED | M | Replace scaffold placeholders (title template marks, continuity recent_action and next_safe_action, scaffold packet pointers) with compact derived or templated values | Continuity fields become templated text |
| FRONTMATTER_MEMORY_BLOCK | M + T | Recompute fingerprints (M); complete missing continuity fields (M); compact narrative recent_action and next_safe_action (T) | Compaction is templated, not authored |
| FRONTMATTER_VALID | M | Derive empty required frontmatter fields from folder identity and defaults | trigger_phrases derived from title tokens are weaker than authored ones |
| CANONICAL_SAVE_LINEAGE_REQUIRED | M | Graph refresh with a valid saveLineage value (the tool's own remediation text) | None beyond sidecar churn |
| GRAPH_METADATA_CHILD_IDENTITY | M | Regenerate graph metadata from disk identity | None beyond sidecar churn |
| FOLDER_NAMING | P | No safe rename: renames break cross-packet references (pointers, parent ids, links) and non-digit folders are unreachable by repair-derived's name gate | Grandfather pre-cutoff; errors post-cutoff (F-027) |
| AI_PROTOCOLS | T | Instantiate the standard protocol sections from the era-appropriate template | Boilerplate inserted into historical plans; use P where the template era is uncertain |
| PLACEHOLDER_FILLED | T | Fill residual [your_value_here] marks from folder identity | Derived title/tags; two instances total |
| TOC_POLICY | M | Structural heading edit (single instance) | Negligible |

## 2. Provenance: v4 artifact versus v3 defect (Q2)

Tag-tree evidence sorts the 20 rules into three eras (F-015). Seven rules exist at neither v3.0.0.0 (2026-03-27) nor v3.6.0.0 (2026-06-18): GREP_CONVENTION, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT, SCAFFOLD_NEVER_TOUCHED, METADATA_DISK_PATH_CONSISTENCY, STATUS_CROSS_DOC_CONSISTENCY and GRAPH_METADATA_CHILD_IDENTITY. Their findings are artifacts of new contracts over old documents: missing sidecars v3 never required, fingerprint expectations from the generator-hardening rollout, cross-document bucket checks no v3 rule performed. Three rules appear only at v3.6 (FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_SUFFICIENCY, CANONICAL_SAVE_LINEAGE_REQUIRED): their findings against v3.0-corpus documents are artifacts of mid-window additions, against v3.6-corpus documents defects under that contract. Ten rules exist at v3.0. The within-era split is per pattern (F-016): "no anchors found" is a template-era artifact for v3.0 documents because the v3.0 authoring flow emitted no anchor markers while the v3.6 flow does, but duplicate and unclosed anchors, cross-document status contradictions, broken links and stale paths are genuine defects the documents carried regardless of rule era.

Residue: rule-id presence shows the check existed, not that the tag's validate flow enforced it. Enforcement-at-tag is INFERRED; confirming it means running each tag's validator over a known-failing fixture.

## 3. The validator-policy layer (Q3)

The least change is an extension of an existing pattern, not a new mechanism (F-019). check-ac-closure.sh already grandfathers packets created before a rollout cutoff (default 2026-08-30, SPECKIT_AC_CLOSURE_CUTOFF override with ISO validation) to advisory verdicts on every branch, keying on the spec.md metadata Created row, treating the boundary day as grandfathered and an unparseable date as grandfathered. Extending that pattern to the four-family policy surface (FOLDER_NAMING, unresolvable links, empty sections and missing citations, warn-level trigger quality) satisfies the packet's risk item directly: post-cutoff packets keep every finding an error.

One gap needs closure before build (F-025): Created-only keying keeps a pre-cutoff packet advisory even after later edits, which contradicts the edge case "upgrade then later edit: new findings in an upgraded packet are ordinary errors". Recommended closure: a finding-level baseline manifest recorded at upgrade time, so the validator errors on any finding not in the manifest for touched packets, with a touch-date comparison as the cheap pre-filter. This mirrors the CI precedent the packet cites (changed-packet validation blocks only regressions). Rejected alternatives: global ENFORCE=false demotion (weakens rules for new documents), blanking a Status field to reach a not-applicable branch (masks future findings), and any route that rewrites content semantics.

The reporting vocabulary already exists: repair-derived's beyond-reach bucket names exactly the DERIVABLE-but-unfixable findings (F-032), so the policy layer converts reported-but-uncleared findings into grandfathered advisories rather than inventing categories.

## 4. Archives (Q4)

Archive exclusion is four mechanisms (F-022): repair-derived's FROZEN_TREES (z_archive, scratch, node_modules, .git and any .backup- name) whose code comment gives the reason, that pre-rename snapshots record deliberately historical locations and "repairing" them destroys what the copy preserved; repair-derived's packet-shape selection gate; backfill-frontmatter's /z_archive/ exclusion behind --include-archive; and backfill-graph-metadata's ARCHIVE_SEGMENT_RE over both z_archive and z_future. The measured pipeline ran archives excluded at the frontmatter step. Correction to the packet's section 2: z_future is excluded only at the graph-metadata layer, since repair-derived name-matches 37 of its 39 packets and freezes none (F-023).

A safe include mode (for REQ-004) transforms moved packets additively (sidecar creation, enum canonicalization, description refresh) while routing snapshots, non-digit folders and fixture-shaped folders to the policy layer. What breaks without that split (F-024): snapshot-location rewrites destroy pre-rename copies, drift refresh churns frozen historical sidecars, and passing METADATA_DISK_PATH inside archives writes archive-segment paths into continuity pointers, which is correct for genuinely moved packets and destructive for deliberate snapshots.

## 5. Pipeline order and idempotence proof (Q5)

The ordering law is fingerprint invalidation (F-028): every source-document edit invalidates its stored fingerprint, so all document edits precede all derivation. repair-derived encodes this internally (edits first, re-derive last, re-derive even after partial failure).

Canonical order (F-029):

1. Folder-level stub adds (FILE_EXISTS, LEVEL_MATCH absences).
2. One composed per-document rewrite pass (frontmatter synthesis, marker synthesis, placeholder fills) plus one pairwise status-alignment pass per folder.
3. backfill-frontmatter --apply --skip-templates.
4. repair-derived --apply (residual derivable fixes, ending in re-derive).
5. validate --strict as the gate.
6. The second-run idempotence check.

Composition is mandatory (F-030): frontmatter insertion shifts the TEMPLATE_SOURCE 70-line window, anchor markers feed two rules at once, and status alignment is pairwise across two documents, so sequential single-purpose steps re-trigger each other.

Idempotence proof (F-031), four checks: step fixed point (report-mode reruns plan zero edits and no stale re-derive); the SC-002 artifact (path-plus-sha256 tree manifest diffed between run one and run two is empty); validate --strict JSON identity between runs; and apply-versus-dry-run file-list parity as the NFR-R01 guard at run scale. Plus the interaction guard: enumerate every rule class first, then assert after each step that no new class appears.

## 6. Answer to the research question

A single dry-run-by-default command (REQ-001) runs the section 5 pipeline with the section 1 routes and installs the section 3 policy layer scoped by the section 4 archive split. On the measured population this clears every active packet at both tags (F-010 projection, to be confirmed by the packet-level harness check) and every archived packet under REQ-004's explicit include. Idempotence and failure honesty are provable with existing tool surfaces (F-031, F-032), and no step requires an LLM call.

## 7. Residuals and what would confirm them

- The projection tiers are upper bounds because the harness truncates details to three per rule (F-014). Confirmation: run the route table against the full validator output in the build step's harness pass (the Q1 packet-level check).
- Enforcement-at-tag is inferred (F-015). Confirmation: run each tag's own validator over a known-failing fixture.
- The graph-metadata child's archive switch default is inferred (F-023). Confirmation: read the switch resolution in backfill-graph-metadata or run it once against an archive folder in a sandbox.
- The later-edit gap closure needs the operator's choice between baseline manifest and touch-date coupling; the recommendation is manifest plus touch-date pre-filter (F-025).

## 8. Convergence report

- Stop reason: maxIterationsReached (stop policy max-iterations; early convergence treated as telemetry and review angles broadened through iteration 5).
- Total iterations: 5 (F-001 to F-032, 32 findings, 12 ruled-out directions).
- Questions answered: 4 of 5 in full (Q2 provenance, Q3 policy layer, Q4 archives, Q5 order and proof); Q1 answered at class level with the packet-level harness check outstanding. Ratio: 0.8 fully, 1.0 with the class-level answer counted.
- newInfoRatio trend: 1.00, 0.70, 0.75, 0.75, 0.70 (mean 0.78), declining into synthesis as the mechanism surface saturated.
- One substantive correction during the run (F-009 superseded by F-018; F-023 corrects spec.md section 2's skip attribution), both recorded in the deltas and registry.

## 9. Deviations and lineage notes

- The append gateway committed every iteration record to deep-research-ledger (sequences 1-4, covering iterations 2-5; iteration 1 predates the ledger) but its state-log projection was refused with ATTRIBUTION_COLLAPSE (the rebuild would drop keys from the fat legacy config row). The readable rows are hand-appended in the iteration-1 shape; the documented config-row migration was rejected because a projection replace would also drop three non-ledger legacy rows. The synthesis_complete event type was refused at the gateway's lossless-mapping check (legacy-event-has-no-lossless-mode-event), so the terminal synthesis record lives in the readable state log only.
- reduce-state.cjs cannot target a fan-out lineage (its resolver hardcodes {specFolder}/research/), so reducer-owned surfaces (strategy machine-owned sections, findings-registry.json, dashboard) were refreshed by hand inside the lineage.
- Iteration 1's containment advisory stands: one dashboard write used a mistyped path and created a file outside the repository; preserved per contract. Gateway stdout captures were written to /tmp scratch files outside the repository and left in place for the same reason.

## 10. References

- specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md sections 2, 3, 5 and 10
- scratch/harness/data/v3.0.0.0.final.jsonl and scratch/harness/data/v3.6.0.0.pipeline.jsonl (356 and 1,918 rows)
- scratch/harness/validate-all.cjs, classify.cjs, agg.cjs, bf-pipeline.sh, fullrun.sh
- .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts, spec-doc-structure.ts, generated-metadata-integrity.ts
- .skilled/skills/system-spec-kit/runtime/cli/rules/ (check-status-cross-doc-consistency.sh, check-grep-convention.sh, check-ac-closure.sh, check-files.sh and siblings)
- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs, runtime/cli/continuity/backfill-frontmatter.ts, runtime/cli/graph/backfill-graph-metadata.ts
- git tag trees v3.0.0.0 and v3.6.0.0 (rule-id and template-contract greps)
- Per-iteration evidence chains: iterations/iteration-001.md through iteration-005.md and deltas/iter-001.jsonl through iter-005.jsonl
- Source inventory: resource-map.md (emitted from the converged deltas)
