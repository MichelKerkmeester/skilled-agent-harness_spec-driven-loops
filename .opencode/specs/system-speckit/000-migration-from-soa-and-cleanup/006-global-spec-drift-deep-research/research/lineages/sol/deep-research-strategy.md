# Deep Research Strategy: Global Spec Drift and Context Optimization

## Research Topic

Spec drift and prior context-optimization efforts across all `.opencode/specs/*`.

## Known Context

- The owning packet requires a full-tree sweep across every spec track, not only migration phases 001-005. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:42-50]
- The three-lineage run uses normal convergence with a ten-iteration cap per lineage because forced-depth is not wired through research fan-out. [SOURCE: .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/spec.md:44-50]
- Research outputs must remain inside this detached lineage directory. The artifact root is bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not executed.
- `resource-map.md` is not present in the owning spec folder; the resource-map coverage gate is skipped at initialization.
- Trigger-memory retrieval timed out at initialization. Direct repository evidence is the primary source for this lineage.

## Key Questions

- [x] Q1. What is the current global inventory and where do structural, naming, numbering, or ownership conventions drift across spec tracks?
- [x] Q2. What residual migration residue remains, including stale paths, legacy names, archive placement, and parent/child topology mismatches?
- [x] Q3. Where do status, completion, checklist, continuity, description, and graph metadata disagree or provide unreliable completion evidence?
- [x] Q4. Which prior context-optimization efforts were attempted, what mechanisms did they use, and what evidence exists about their outcomes or limitations?
- [x] Q5. What findings materially affect the planned memory-database teardown, and how should each finding be triaged without performing remediation in this research lineage?

## Non-Goals

- Do not modify, repair, renumber, archive, delete, or regenerate any researched spec packet.
- Do not execute the downstream memory-database teardown.
- Do not treat archived or future packets as defects solely because of their lifecycle classification.
- Do not claim runtime behavior from spec prose without identifying it as documented intent or corroborating it with current repository evidence.

## Stop Conditions

- Stop at legal convergence after at least three evidence iterations when the weighted convergence candidate and quality gates pass.
- Stop at ten iterations regardless of remaining novelty.
- Stop on unrecoverable state corruption or inability to preserve the lineage-only write boundary.

## Answered Questions

- [x] Q1. The active fleet is 2,168 candidates; primary drift is completion semantics, deferred sk-doc/deep-loop topology, one broken ownership pointer, phase-parent policy shape, and limited derived-index residue. (iteration 6)
- [x] Q2. Migration residue separates into completed clean tracks, accepted operator-skipped live debt, explicit reindex follow-ups, policy-age residue, and harmless historical records. (iteration 6)
- [x] Q3. Completion drift occurs across spec status, graph status, checklist state, continuity percentages/fingerprints, unfilled status templates, and parent/child rollups. (iteration 3)
- [x] Q4. Prior efforts implemented bounded compaction injection, source-aware priming, in-workflow snapshots, in-memory quality metrics, hookless bootstrap, and thin continuity; outcome evidence is mostly bounded verification or projected benefit, with narrative compaction explicitly deferred. (iteration 4)
- [x] Q5. Teardown requires merged durable research, triage, fresh confirmation, daemon stop, allowlisted deletion, exclusion proof, and irreversible-history acknowledgement; rebuilding cannot repair source metadata drift. (iteration 5)

## What Worked

- A single bounded repository traversal produced a reproducible inventory and exposed measurement false positives before policy classification. (iteration 1)
- Current filesystem numbering plus migration phase summaries separated accidental drift from accepted/skipped decisions. (iteration 2)
- Conservative state-prefix classification plus source verification exposed semantic drift without confusing metadata absence or nuanced prose. (iteration 3)
- Mechanism-by-mechanism tracing across implementation summaries, research iterations, and handover evidence separated shipped controls from projections and deferrals. (iteration 4)
- Comparing the teardown allowlist and rebuild contract with source-tree drift separated hard gates, irreversible history, rebuildable derived state, and deferred source remediation. (iteration 5)
- A severity/ownership/rebuildability taxonomy closed the global inventory without misclassifying accepted historical evidence. (iteration 6)
- Exact current-path checks independently reproduced the highest-impact topology, pointer, status, and rebuild-boundary findings. (iteration 7)
- Current implementation source corroborated the optimization mechanism map and corrected one archived graph-threshold limitation. (iteration 8)
- Current command and implementation inventories corrected deep-context's terminal state to active removal and confirmed automatic narrative compaction remains absent. (iteration 9)

## What Failed

- Trigger-memory preflight timed out; continue with direct repository evidence and record the limitation.
- Unqualified missing-file and keyword counts mixed live packets with archives, backups, fixtures, scratch data, and frontmatter boilerplate. (iteration 1)
- Lexical legacy-name matching could not distinguish durable historical packet names from broken path references. (iteration 2)
- Broad terminal-language matching overcounted phrases such as `planning complete`; exact lifecycle classification needs provenance. (iteration 3)
- Completion labels and broad test counts did not establish longitudinal context-quality improvement; baseline/post-change observations are generally absent. (iteration 4)
- Binary blocker/non-blocker labels obscured distinct teardown concerns: authorization, irreversible loss, rebuildability, and accepted source-tree deferral. (iteration 5)
- A flat defect list could not distinguish active integrity failures from owner-accepted debt and informational history. (iteration 6)
- Independent verification found no falsifying evidence; repeating the same exact-path checks is exhausted. (iteration 7)
- Structural caller verification was unavailable because the code graph is empty; direct imports and source reads were used without claiming graph coverage. (iteration 8)
- Broad current-route and compaction lexical checks produced no additional mechanism and are exhausted. (iteration 9)

## Exhausted Approaches

- Exact-path rechecks for sk-doc duplicate prefixes, the broken packet pointer, and the two sample status contradictions are exhausted after independent confirmation. (iteration 7)
- Current-source verification of bootstrap, metrics, compaction, and lifecycle routing is exhausted after confirming implementation presence and the threshold correction. (iteration 8)
- Active deep-context route and automatic narrative-compaction checks are exhausted after current inventory plus later-phase corroboration. (iteration 9)

## Ruled-Out Directions

- Modifying parent packet `spec.md` during detached init was ruled out because the explicit lineage boundary forbids writes outside this artifact directory.
- Nested `opencode run` dispatch was ruled out because this process is already the detached cli-opencode lineage spawned by the workflow runtime.
- Treating every `spec.md` as a live packet and every missing heavy document as drift was ruled out; classification must precede conformance checks. (iteration 1)
- Treating every numbering gap as data loss was ruled out by documented regrouping, intentional deletion, and sentinel-number exceptions. (iteration 2)
- Treating any single status surface as authoritative was ruled out by bidirectional spec/graph/checklist/continuity contradictions. (iteration 3)
- Treating projected token/latency benefits or packet completion as measured optimization outcomes was ruled out. (iteration 4)
- Treating teardown or `/doctor:update` as source-tree remediation or historical restoration was ruled out. (iteration 5)
- Treating all residual findings as one undifferentiated defect class was ruled out. (iteration 6)
- Dismissing the high-impact findings as transcript or aggregation artifacts was ruled out by current-file verification. (iteration 7)
- Carrying archived implementation limitations forward without current-source verification was ruled out. (iteration 8)
- Freezing current-state conclusions at intermediate migration states was ruled out. (iteration 9)

## Carried-Forward Open Questions

None yet.

## Next Focus

Synthesis complete. Await the parent workflow's GLM/SOL/LUNA registry merge; do not treat this lineage output alone as phase-007 authorization.

## Research Boundaries

- Maximum iterations: 10
- Minimum convergence floor: 3 evidence iterations
- Convergence threshold: 0.05
- Stop policy: convergence
- Write root: `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/006-global-spec-drift-deep-research/research/lineages/sol`
- Researched `.opencode/specs/**` files are read-only.
