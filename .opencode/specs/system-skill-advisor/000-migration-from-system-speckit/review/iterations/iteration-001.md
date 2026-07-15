# Deep Review Iteration 001

## Dispatcher
- target_agent: deep-review
- resolved_route: /deep:review:auto -> .opencode/agents/deep-review.md
- agent_definition_loaded: true
- mode: review
- Budget profile: verify
- Focus: correctness + traceability for structural migration path and numbering integrity only

## Files Reviewed
- .opencode/specs/system-skill-advisor/**/graph-metadata.json
- .opencode/specs/system-skill-advisor/**/*.md and .json for pre-move path references
- Listed touched system-speckit parent packets and numbered children where relevant
- git diff HEAD~5..HEAD rename set for pre-move path seeds
- .opencode/skills/sk-code/code-review/references/review_core.md

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Stale pre-move children remain in the skill-advisor CLI parent** -- .opencode/specs/system-skill-advisor/011-skill-advisor-cli/graph-metadata.json:8 -- The `children_ids` array still includes four old `system-spec-kit/027-xce-research-based-refinement/.../003-skill-advisor-cli/...` children at lines 8-11 before the migrated `system-skill-advisor/011-skill-advisor-cli/...` children at lines 12-15. Exact fix: remove lines 8-11 or replace them with the existing `system-skill-advisor/011-skill-advisor-cli/{000,001,002,003}-...` children already present at lines 12-15.
   - Finding class: cross-consumer
   - Scope proof: JSON parse resolved the old children under `.opencode/specs/system-spec-kit/...`, which does not exist on disk; direct read confirms the migrated children exist in the same array.
   - Affected surface hints: ["graph-metadata children_ids", "system-skill-advisor/011-skill-advisor-cli"]
   - Claim adjudication: {"type":"missing-child-reference","claim":"The parent still points at pre-move, non-existent child folders.","evidenceRefs":[".opencode/specs/system-skill-advisor/011-skill-advisor-cli/graph-metadata.json:8",".opencode/specs/system-skill-advisor/011-skill-advisor-cli/graph-metadata.json:12"],"counterevidenceSought":"Checked for `.opencode/specs/system-spec-kit` and found no such directory; checked same array for migrated replacements.","alternativeExplanation":"Intentional historical aliases would belong in aliases/supersedes, not active children_ids.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If `system-spec-kit` is a documented runtime alias that resolves during graph traversal."}

2. **Two migrated research iteration metadata files still declare old packet paths** -- .opencode/specs/system-skill-advisor/004-skill-graph/004-skill-graph-metadata-routing-boosts/research/iterations/graph-metadata.json:3 -- This file has `packet_id` and `spec_folder` set to `system-spec-kit/026-graph-and-context-optimization/research/011-skill-advisor-graph-pt-01/iterations` at lines 3-4 while its actual folder is `system-skill-advisor/004-skill-graph/004-skill-graph-metadata-routing-boosts/research/iterations`. The same issue exists in `.opencode/specs/system-skill-advisor/006-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning/research/iterations/graph-metadata.json:3` with old `system-spec-kit/026-graph-and-context-optimization/research/013-advisor-phrase-booster-tailoring-pt-01/iterations`. Exact fix: set each file's `packet_id` and `spec_folder` to its actual `system-skill-advisor/.../research/iterations` path.
   - Finding class: matrix/evidence
   - Scope proof: direct metadata read confirms the first mismatch; filesystem audit found the paired mismatch in the second moved research iterations folder.
   - Affected surface hints: ["graph-metadata packet_id", "graph-metadata spec_folder", "research/iterations packets"]
   - Claim adjudication: {"type":"metadata-path-mismatch","claim":"Moved packet metadata still identifies the old system-spec-kit research locations.","evidenceRefs":[".opencode/specs/system-skill-advisor/004-skill-graph/004-skill-graph-metadata-routing-boosts/research/iterations/graph-metadata.json:3",".opencode/specs/system-skill-advisor/006-skill-advisor-routing-engine/002-advisor-phrase-booster-tuning/research/iterations/graph-metadata.json:3"],"counterevidenceSought":"Compared metadata values to actual on-disk folder paths under `.opencode/specs`.","alternativeExplanation":"Aliases are present separately in metadata, but active `packet_id`/`spec_folder` must identify the folder itself.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If graph traversal intentionally keys these research iteration packets by their legacy parent after a move."}

3. **Touched system-speckit parents retain `system-spec-kit` children_ids that resolve nowhere** -- .opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/graph-metadata.json:6 -- Several touched parent descendants keep active child entries under `system-spec-kit/...` even though the on-disk track is `system-speckit/...`. Confirmed affected files include `.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/001-resource-map-deep-loop-fix/graph-metadata.json:6`, `.opencode/specs/system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/002-template-levels/graph-metadata.json:6`, `.opencode/specs/system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/graph-metadata.json:6`, and `.opencode/specs/system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/graph-metadata.json:6`. Exact fix: change each active `children_ids` entry prefix from `system-spec-kit/...` to the matching existing `system-speckit/...` path, or remove stale duplicates if a corrected child entry is already present.
   - Finding class: cross-consumer
   - Scope proof: direct filesystem check found no `.opencode/specs/system-spec-kit` directory; direct read of the 022 arc shows stale and corrected duplicate children in the same array.
   - Affected surface hints: ["system-speckit touched parents", "graph-metadata children_ids"]
   - Claim adjudication: {"type":"missing-child-reference","claim":"Active children_ids in touched system-speckit parents point to non-existent system-spec-kit folders.","evidenceRefs":[".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json:7",".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/graph-metadata.json:20"],"counterevidenceSought":"Checked the purported system-spec-kit root and compared duplicate corrected system-speckit entries where present.","alternativeExplanation":"Legacy aliases may be useful, but not as active child IDs that graph traversal treats as folders.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If the graph loader normalizes system-spec-kit to system-speckit before existence checks."}

4. **One touched system-speckit child uses the wrong packet_id/spec_folder spelling** -- .opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose/graph-metadata.json:3 -- The file declares `packet_id` and `spec_folder` under `system-spec-kit/...` while it lives under `system-speckit/...`. Exact fix: change both fields to `system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose`.
   - Finding class: instance-only
   - Scope proof: filesystem audit compared the graph-metadata fields against the actual folder path under `.opencode/specs`.
   - Affected surface hints: ["graph-metadata packet_id", "graph-metadata spec_folder"]
   - Claim adjudication: {"type":"metadata-path-mismatch","claim":"The child metadata path does not match its actual folder.","evidenceRefs":[".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose/graph-metadata.json:3"],"counterevidenceSought":"Compared active file path to metadata values; no `.opencode/specs/system-spec-kit` root exists.","alternativeExplanation":"None within active metadata semantics.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If this `002b` folder is intentionally outside graph traversal despite having graph-metadata.json."}

5. **028 migration left stale renumbered path references in scoped docs** -- .opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation/tasks.md:102 -- Scoped docs still reference pre-renumber paths such as `004-review-remediation`, `005-dark-flag-graduation`, `006-speckit-surface-alignment`, and `003-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark` after the last-five-commit rename set moved those folders. Exact fix: update each referenced path to the current renamed path shown by `git diff --name-status HEAD~5..HEAD` (for example, old `004-review-remediation` now resolves under current `003-review-remediation`, and old `005-dark-flag-graduation` under current `004-dark-flag-graduation` in that rename set).
   - Finding class: matrix/evidence
   - Scope proof: git rename seed plus direct scoped text scan found stale references at `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md:24`, `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout/plan.md:115`, `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation/tasks.md:102-107 and 145-150`, `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/changelog-006-speckit-surface-alignment.md:17`, `.opencode/specs/system-speckit/028-memory-search-intelligence/changelog/changelog-028-root.md:108 and 138`, `.opencode/specs/system-speckit/028-memory-search-intelligence/research/iterations/iteration-006.md:12`, and `.opencode/specs/system-speckit/028-memory-search-intelligence/research/research.md:104`.
   - Affected surface hints: ["028 memory-search-intelligence docs", "pre-move cross references"]
   - Claim adjudication: {"type":"stale-cross-reference","claim":"Scoped docs still point at paths renamed in the last five commits.","evidenceRefs":[".opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/045-drift-audit-remediation/tasks.md:102","git diff --name-status HEAD~5..HEAD"],"counterevidenceSought":"Checked old rename-source directories; referenced paths no longer exist as folders.","alternativeExplanation":"Some historical changelog mentions may intentionally document old names, but dispatch asked for any stale cross reference to pre-move paths in scoped packets.","finalSeverity":"P1","confidence":"medium-high","downgradeTrigger":"If changelog/research historical references are explicitly exempted from migration cross-reference correctness."}

6. **Three touched parent folders have numbered-child gaps after moves** -- .opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc:1 -- Direct numbered-child scan found missing `004` under the 022 arc, missing `007` under `.opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency:1`, and missing `007-028` plus `030-044` under `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality:1` among existing `001-053`. Exact fix: either restore omitted child folders if the gaps are accidental, or renumber the direct children and update matching graph-metadata/cross references so each touched parent has a continuous numbered sequence.
   - Finding class: matrix/evidence
   - Scope proof: direct filesystem listing of direct child folder prefixes under the touched parents.
   - Affected surface hints: ["numbered child folders", "parent children_ids", "cross references"]
   - Claim adjudication: {"type":"numbering-gap","claim":"Touched parent numbered children are not contiguous after migration moves.","evidenceRefs":[".opencode/specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc:1",".opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality:1"],"counterevidenceSought":"Checked only direct children whose names begin with three digits and a hyphen.","alternativeExplanation":"Intentional reserved numbers would need explicit waiver; none was in the bound setup.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"If these parents permit non-contiguous numbering by policy."}

### P2 Findings
None.

## Traceability Checks
- Checked category 1 stale pre-move cross references using the last-five-commit rename set and scoped text scan.
- Checked category 2 missing `children_ids` folders by resolving active child entries under `.opencode/specs`.
- Checked category 3 `packet_id`/`spec_folder` by comparing graph-metadata values to actual folder paths.
- Checked category 4 numbering gaps by scanning direct numbered child folders of the touched parents.
- Checked category 5 orphaned empty shells by testing old rename-source directories for empty remaining folders.

## Integration Evidence
- git diff HEAD~5..HEAD used only as rename provenance for pre-move path detection.
- Code graph was not used because direct filesystem evidence was sufficient and the startup graph was stale/unavailable.

## Edge Cases
- First-run review state was absent; initialized local review state under the pre-bound packet.
- Historical changelog/research mentions are included only where they point at rename-source paths in the requested scope.
- Category 5 clean result: no old rename-source directory remained as an empty shell.

## Confirmed-Clean Surfaces
- No orphaned empty shell folders among the 239 old rename-source directories checked.
- No active P0 blocker found in the five requested structural categories.

## Ruled Out
- Template header mismatches, anchor mismatches, missing prose sections, scaffold-never-touched flags, and generic frontmatter narrative warnings were intentionally excluded per dispatch.
- Security and maintainability dimensions were not reviewed.

## Next Focus
- dimension: none
- focus area: fix verification after path/numbering corrections
- reason: all five requested structural categories were covered in this iteration
- rotation status: complete
- blocked/productive carry-forward: direct filesystem audit productive
- required evidence: rerun metadata path, child existence, cross-reference, numbering, and empty-shell checks
