# Task 7D2 Phase Documentation Evidence

## Resolved Paths

- Manifest: `scratch/topology-migration-manifest.json` (`status: applied`).
- Former root phase 020: `002-speckit-memory/028-query-time-filter-benchmark`.
- Former root phase 022: `002-speckit-memory/031-drift-marker-native-consolidation`.
- Related active benchmark pointer: `005-dark-flag-graduation/002-retrieval-class-weights`.

## Evidence Mapping

| Document | Reconciliation | Explicit evidence |
|---|---|---|
| Former phase 020 `plan.md` | Planned/0% to completed/100%; checked ready, done, implementation, verification, and safety rows; corrected benchmark state and migrated related pointer | Local tasks T001-T020 and checklist rows are checked; implementation summary records benchmark metrics, soak/e2e/aggregate results, build, typecheck, and regression tests |
| Former phase 022 `plan.md` | Planned/0% to completed/100%; checked implementation phases and safety rows | Local tasks T001-T026 and implementation summary record builds, eight tests, API-boundary pass, source/dist alignment, and hook smoke |
| Former phase 022 `tasks.md` | Planned/0% to completed/100%; corrected strict-validator command to final migrated path | Existing task rows are complete; manifest resolves the final path |
| Former phase 022 `checklist.md` | Scaffold/0% to evidence-aligned 96%; reopened unsupported commit pin; corrected P1 count to 12/13 | Implementation summary proves delivery but does not identify an implementation commit SHA |

## Preserved Open Items

- Former phase 022 keeps the implementation commit SHA pin open; no implementation work was reopened.
- Historical plan prose and decisions were preserved.

## Document Quality

- `former-020-plan`: DQI `91.0`; exit `0`; `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark/plan.md`.
- `former-022-plan`: DQI `91.0`; exit `0`; `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/plan.md`.
- `former-022-tasks`: DQI `75.0`; exit `0`; `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/tasks.md`.
- `former-022-checklist`: DQI `79.0`; exit `0`; `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/checklist.md`.
- HVR: pass; edits are direct, evidence-linked, and limited to active metadata, check states, and pointers.

## Validation Runs

### After former phase 020 plan.md — root

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict`
- Exit: `2`
```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'active coordination parent; topology applied', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 13 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-memory-search-intelligence' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 17 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '001-release-cleanup' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/001-release-cleanup
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 115 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '002-speckit-memory' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'complete' and implementation-summary.md Status 'complete' both classify as complete
! EVIDENCE_CITED: Found 43 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 53 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
! AI_PROTOCOL: AI protocol incomplete (0/4 components)
+ FOLDER_NAMING: Folder name '003-spec-data-quality' follows naming convention
! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 029-vague-query-model-benchmark
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/003-spec-data-quality
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Completion freshness is stale: stored continuity fingerprint does not match current content
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 6

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-review-remediation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/004-review-remediation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 29 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level ph
+ FOLDER_NAMING: Folder name '005-dark-flag-graduation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status does not claim Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level phase
+ FOLDER_NAMING: Folder name '006-speckit-surface-alignment' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

(node:95993) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:96809) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:97582) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:98889) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:1207) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2004) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2912) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 020 plan.md — resolved-phase

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict`
- Exit: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 5 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Completed' and implementation-summary.md Status 'Completed' both classify as complete
! EVIDENCE_CITED: Found 47 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=3, tasks=23, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '028-query-time-filter-benchmark' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Continuity freshness could not parse implementation-summary frontmatter
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 2

RESULT: FAILED

(node:3771) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 plan.md — root

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict`
- Exit: `2`
```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'active coordination parent; topology applied', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 13 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-memory-search-intelligence' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 17 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '001-release-cleanup' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/001-release-cleanup
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 115 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '002-speckit-memory' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'complete' and implementation-summary.md Status 'complete' both classify as complete
! EVIDENCE_CITED: Found 43 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 53 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
! AI_PROTOCOL: AI protocol incomplete (0/4 components)
+ FOLDER_NAMING: Folder name '003-spec-data-quality' follows naming convention
! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 029-vague-query-model-benchmark
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/003-spec-data-quality
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Completion freshness is stale: stored continuity fingerprint does not match current content
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 6

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-review-remediation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/004-review-remediation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 29 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level ph
+ FOLDER_NAMING: Folder name '005-dark-flag-graduation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status does not claim Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level phase
+ FOLDER_NAMING: Folder name '006-speckit-surface-alignment' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

(node:6637) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:7392) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:9201) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:10771) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:13640) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:14829) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:16209) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 plan.md — resolved-phase

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict`
- Exit: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 3 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'COMPLETE' both classify as complete
! EVIDENCE_CITED: Found 18 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=4, tasks=29, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '031-drift-marker-native-consolidation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 1

RESULT: FAILED

(node:16883) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 tasks.md — root

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict`
- Exit: `2`
```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'active coordination parent; topology applied', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 13 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-memory-search-intelligence' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 17 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '001-release-cleanup' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/001-release-cleanup
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 115 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '002-speckit-memory' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'complete' and implementation-summary.md Status 'complete' both classify as complete
! EVIDENCE_CITED: Found 43 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 53 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
! AI_PROTOCOL: AI protocol incomplete (0/4 components)
+ FOLDER_NAMING: Folder name '003-spec-data-quality' follows naming convention
! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 029-vague-query-model-benchmark
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/003-spec-data-quality
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Completion freshness is stale: stored continuity fingerprint does not match current content
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 6

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-review-remediation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/004-review-remediation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 29 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level ph
+ FOLDER_NAMING: Folder name '005-dark-flag-graduation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status does not claim Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level phase
+ FOLDER_NAMING: Folder name '006-speckit-surface-alignment' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

(node:19652) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:20372) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:21210) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:23221) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:25678) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:27377) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:28119) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 tasks.md — resolved-phase

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict`
- Exit: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 2 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 3 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'COMPLETE' both classify as complete
! EVIDENCE_CITED: Found 18 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=4, tasks=29, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '031-drift-marker-native-consolidation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 1

RESULT: FAILED

(node:29180) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 checklist.md — root

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict`
- Exit: `2`
```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'active coordination parent; topology applied', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 13 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-memory-search-intelligence' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 17 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '001-release-cleanup' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/001-release-cleanup
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 115 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '002-speckit-memory' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'complete' and implementation-summary.md Status 'complete' both classify as complete
! EVIDENCE_CITED: Found 43 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 53 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
! AI_PROTOCOL: AI protocol incomplete (0/4 components)
+ FOLDER_NAMING: Folder name '003-spec-data-quality' follows naming convention
! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 029-vague-query-model-benchmark
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/003-spec-data-quality
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Completion freshness is stale: stored continuity fingerprint does not match current content
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 6

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-review-remediation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/004-review-remediation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 29 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level ph
+ FOLDER_NAMING: Folder name '005-dark-flag-graduation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status does not claim Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level phase
+ FOLDER_NAMING: Folder name '006-speckit-surface-alignment' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

(node:31409) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:32131) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:32922) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:34157) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:37050) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:37660) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:39127) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### After former phase 022 checklist.md — resolved-phase

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict`
- Exit: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 3 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 3 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'COMPLETE' both classify as complete
! EVIDENCE_CITED: Found 17 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=4, tasks=29, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '031-drift-marker-native-consolidation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 1

RESULT: FAILED

(node:39906) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Post-Log Strict Validation

### root

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict`
- Exit/result verified after this log write: `2`
```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'active coordination parent; topology applied', not Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 13 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-memory-search-intelligence' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 17 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '001-release-cleanup' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/001-release-cleanup
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 115 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '002-speckit-memory' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'complete' and implementation-summary.md Status 'complete' both classify as complete
! EVIDENCE_CITED: Found 43 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 53 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
! AI_PROTOCOL: AI protocol incomplete (0/4 components)
+ FOLDER_NAMING: Folder name '003-spec-data-quality' follows naming convention
! GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 029-vague-query-model-benchmark
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/003-spec-data-quality
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Completion freshness is stale: stored continuity fingerprint does not match current content
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 3  Warnings: 6

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ FOLDER_NAMING: Folder name '004-review-remediation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/004-review-remediation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 29 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level ph
+ FOLDER_NAMING: Folder name '005-dark-flag-graduation' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/005-dark-flag-graduation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness skew detected (soft detector)
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
  Level:  phase

+ FILE_EXISTS: All required files present for Level phase
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Phase parent lean template shape accepted
+ ANCHORS_VALID: Phase parent lean template shape accepted
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
+ SCAFFOLD_NEVER_TOUCHED: Spec status does not claim Complete; scaffold markers are allowed
+ STATUS_CROSS_DOC_CONSISTENCY: status cross-doc check not applicable; spec.md or implementation-summary.md is absent
+ EVIDENCE_CITED: No checklist.md or tasks.md
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
! PHASE_LINKS: 6 phase link issue(s) found
+ PHASE_PARENT_CONTENT: Phase parent content avoids migration-history tokens
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md not present; current-state scan skipped
+ AI_PROTOCOL: AI protocol check not applicable for Level phase
+ FOLDER_NAMING: Folder name '006-speckit-surface-alignment' follows naming convention
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SPEC_DOC_INTEGRITY: Spec doc references, metadata, and handover targets resolve cleanly
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Live packet root exposes a canonical spec.md surface
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Live packet root graph metadata has non-empty derived.source_docs
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity freshness skipped: implementation-summary.md missing
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 1  Warnings: 1

RESULT: FAILED

(node:41762) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:43194) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:44053) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:45272) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:47297) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:48755) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:49486) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### former phase 020

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict`
- Exit/result verified after this log write: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 5 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 4 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Completed' and implementation-summary.md Status 'Completed' both classify as complete
! EVIDENCE_CITED: Found 47 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=3, tasks=23, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '028-query-time-filter-benchmark' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
! CONTINUITY_FRESHNESS: Continuity freshness could not parse implementation-summary frontmatter
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 2

RESULT: FAILED

(node:50095) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### former phase 022

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict`
- Exit/result verified after this log write: `2`
```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ TEMPLATE_SOURCE: Template source headers present
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ PRIORITY_TAGS: Checklist priority tags use CHK-* [P*] format
+ FRONTMATTER_VALID: Frontmatter continuity basics present
x FRONTMATTER_MEMORY_BLOCK: 3 frontmatter_memory_block issue(s) found
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
+ GENERATED_METADATA_DRIFT: Generated synopsis fields match the current docs
+ COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found
x SCAFFOLD_NEVER_TOUCHED: Found 3 scaffold-signature marker(s) in Complete spec folder
+ STATUS_CROSS_DOC_CONSISTENCY: spec.md Status 'Complete' and implementation-summary.md Status 'COMPLETE' both classify as complete
! EVIDENCE_CITED: Found 17 completed item(s) without evidence
+ AC_COVERAGE: Acceptance coverage gate disabled (set SPECKIT_AC_COVERAGE=true to enable advisory scan)
+ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents
+ PHASE_LINKS: No phase folders detected (non-phased spec)
+ PHASE_PARENT_CONTENT: Not a phase parent; content-discipline scan skipped
+ CURRENT_STATE_DISCIPLINE: implementation-summary.md avoids migration-history tokens
+ AI_PROTOCOL: AI protocol check not applicable for Level 2
+ COMPLEXITY_MATCH: Complexity level consistent with content (Level 2; phases=4, tasks=29, stories=0, scenarios=0)
+ FOLDER_NAMING: Folder name '031-drift-marker-native-consolidation' follows naming convention
+ LEVEL_MATCH: Level consistent across all files (Level 2)
+ GRAPH_METADATA_CHILD_DRIFT: children_ids matches the on-disk phase children
+ GRAPH_METADATA_SHAPE: graph-metadata.json shape validation passed
+ METADATA_DISK_PATH_CONSISTENCY: Generated metadata paths match on-disk folder: system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation
+ DESCRIPTION_SHAPE: description.json shape validation passed
+ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files
+ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
+ SECTION_COUNTS: Section counts appropriate for Level 2
x SPEC_DOC_INTEGRITY: 1 spec documentation integrity issue(s) found
+ CANONICAL_SAVE_ROOT_SPEC_REQUIRED: Canonical-save root-spec check not applicable to this folder
+ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED: Canonical-save source-doc check not applicable to this folder
+ CANONICAL_SAVE_LINEAGE_REQUIRED: save_lineage is present for the refreshed graph metadata
+ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED: Packet identity is normalized across continuity, description, and graph surfaces
+ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS: Description and graph freshness stay within the canonical-save slack window
+ CONTINUITY_FRESHNESS: Continuity last_updated_at is within the 10-minute heuristic policy budget
+ EVIDENCE_MARKER_LINT: Evidence marker lint passed: all markers closed with balanced brackets

Summary: Errors: 4  Warnings: 1

RESULT: FAILED

(node:52752) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

## Diff and Pointer Checks

- Modified paths count: `5` (four production documents plus this evidence log).
- The four migrated production files are currently untracked, so path-limited `git diff` is empty; each file was inspected with a scoped `git diff --no-index --stat /dev/null <file>` fallback.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark/plan.md`: `.../028-query-time-filter-benchmark/plan.md        | 336 +++++++++++++++++++++ |  1 file changed, 336 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/plan.md`: `.../031-drift-marker-native-consolidation/plan.md  | 380 +++++++++++++++++++++ |  1 file changed, 380 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/tasks.md`: `.../031-drift-marker-native-consolidation/tasks.md | 116 +++++++++++++++++++++ |  1 file changed, 116 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/checklist.md`: `.../checklist.md                                   | 139 +++++++++++++++++++++ |  1 file changed, 139 insertions(+)`.
- `git diff --check` over the four production paths: exit `0` (clean).
- Stale active pointer scan: none.
- Completion scan: both plans contain no unchecked plan rows; former phase 022 tasks remain 100%; former phase 022 checklist preserves only the unsupported commit-SHA pin as open and reports 12/13 P1.
- Mutation scope: only the four authorized production files and this evidence log were written.

## External or Residual Failures

- Root strict validation: exit `2`; generated metadata integrity/drift and spec-document integrity failures span the migrated coordination tree, with additional unrelated child-packet warnings/errors. Root docs and generated metadata are outside this task’s writable scope.
- Former phase 020 strict validation: exit `2`; existing frontmatter-memory-block, generated-metadata-integrity, scaffold-signature, and spec-document-integrity errors remain. The validator also reports evidence-citation and continuity-frontmatter warnings outside the authorized plan-only correction.
- Former phase 022 strict validation: exit `2`; existing frontmatter-memory-block, generated-metadata-integrity, scaffold-signature, and spec-document-integrity errors remain. The validator reports an evidence-citation warning; the intentionally open commit-SHA pin is not reported as a structural error.
- No DQI, stale-pointer, or diff-check failure remains.

## Final Post-Write Strict Validation

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2` (same external root categories itemized above).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2` (same external former-phase-020 categories itemized above).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2` (same external former-phase-022 categories itemized above).
- Full validator output from the corresponding immediately preceding runs is retained under **Validation Runs** and **Post-Log Strict Validation** above.

## Completion Judgment

- Production metadata is evidence-aligned and DQI is at least 75.
- Full packet completion is not claimed because all three strict validator scopes remain externally blocked.

# Retry 1 Attribution Reconciliation

This retry supersedes the prior completion judgment while preserving its validation history.

## Attributable Baseline and Fixes

| Attributable finding | Authorized file(s) | Fix | Final proof |
|---|---|---|---|
| Invalid actor slug (`openai/gpt-5.6-sol`) | All four production files | Changed to `openai-gpt-5.6-sol` | Former phase 022 `FRONTMATTER_MEMORY_BLOCK` passes; former phase 020 has no remaining `plan.md` diagnostic |
| Scaffold title marker | All four production files | Removed only `[template:...]` from title values | Former phase 022 `SCAFFOLD_NEVER_TOUCHED` passes; former phase 020 remaining markers name only out-of-scope docs |
| Completed rows without substantive evidence | Former phase 022 `tasks.md`, `checklist.md` | Added local file:line or document evidence markers to all 17 flagged rows | Former phase 022 `EVIDENCE_CITED` passes |

## Preserved State

- The implementation commit-SHA checklist item remains open at 96% checklist completion.
- No historical plan prose, migrated topology, implementation summary, generated metadata, or unrelated phase was changed.

## Per-Write Strict Validation Chronology

- After `phase020 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `phase020 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `phase020 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- After `phase022 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `phase022 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `phase022 plan.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- After `phase022 tasks.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `phase022 tasks.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `phase022 tasks.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- After `phase022 checklist.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `phase022 checklist.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `phase022 checklist.md retry edit`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- After `retry pre-log final scope run`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `retry pre-log final scope run`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `retry pre-log final scope run`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- After `retry scratch-log write A`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- After `retry scratch-log write A`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- After `retry scratch-log write A`: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.

## Direct Attribution Proof

### phase020 — frontmatter

- Command: `npx --yes tsx .opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts --folder .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --level 2 --rule FRONTMATTER_MEMORY_BLOCK --output json`
- Exit: `0`
- Result: `{ |   "rule": "FRONTMATTER_MEMORY_BLOCK", |   "status": "fail", |   "message": "4 frontmatter_memory_block issue(s) found", |   "details": [ |     "SPECDOC_FRONTMATTER_004: spec.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug", |     "SPECDOC_FRONTMATTER_004: tasks.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug", |     "MEMORY_BLOCK_INVALID: implementation-summary.md: invalid _memory YAML (line 22: indentation must use two-space steps)", |     "SPECDOC_FRONTMATTER_004: checklist.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug" |   ], |   "diagnostics": [ |     { |       "code": "SPECDOC_FRONTMATTER_004", |       "severity": "error", |       "detail": "spec.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug" |     }, |     { |       "code": "SPECDOC_FRONTMATTER_004", |       "severity": "error", |       "detail": "tasks.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug" |     }, |     { |       "code": "MEMORY_BLOCK_INVALID", |       "severity": "error", |       "detail": "implementation-summary.md: invalid _memory YAML (line 22: indentation must use two-space steps)" |     }, |     { |       "code": "SPECDOC_FRONTMATTER_004", |       "severity": "error", |       "detail": "checklist.md: last_updated_by 'openai/gpt-5.6-terra' is not an actor slug" |     } |   ] | }`

### phase020 — scaffold

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark 2`
- Exit: `0`
- Result: `status=fail | message=Found 3 scaffold-signature marker(s) in Complete spec folder | detail=tasks.md:2: title contains [template: | detail=implementation-summary.md:2: title contains [template: | detail=checklist.md:2: title contains [template:`

### phase020 — integrity

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark 2`
- Exit: `0`
- Result: `status=fail | message=1 spec documentation integrity issue(s) found | detail=implementation-summary.md has stale Spec Folder metadata: 020-query-time-filter-benchmark`

### phase020 — evidence

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark 2`
- Exit: `0`
- Result: `status=warn | message=Found 47 completed item(s) without evidence | detail=checklist.md:P0:58: CHK-001 [P0] Requirements documented in spec.md. | detail=checklist.md:P0:59: CHK-002 [P0] Technical approach defined in plan.md. | detail=checklist.md:P0:60: CHK-003 [P0] Re-confirmed the Layer 1 filter, capability flag, and ... | detail=checklist.md:P1:61: CHK-004 [P1] Read the benchmark backup and durability-isolation pre... | detail=checklist.md:P0:70: CHK-011 [P0] No unhandled errors or warnings escaped the focused te... | detail=checklist.md:P1:71: CHK-012 [P1] The process-lifetime aggregate performs no persistence... | detail=checklist.md:P1:72: CHK-013 [P1] The counter follows the existing process-lifetime tele... | detail=checklist.md:P0:80: CHK-020 [P0] All four acceptance criteria met by the benchmark and ... | detail=checklist.md:P0:81: CHK-021 [P0] Ran the benchmark on a read-only corpus/vector-shard s... | detail=checklist.md:P1:82: CHK-022 [P1] Existing timeout regression covers contended writes; t... | detail=checklist.md:P1:83: CHK-023 [P1] N/A: process-lifetime telemetry has no persistence fai... | detail=checklist.md:P0:94: CHK-FIX-001 [P0] The four gaps are respectively evidence, test-isol... | detail=checklist.md:P0:95: CHK-FIX-002 [P0] Confirmed the filter has one production call site ... | detail=checklist.md:P0:96: CHK-FIX-003 [P0] The new response field and getter have only the ne... | detail=checklist.md:P0:97: CHK-FIX-004 [P0] The 64-wide contended public-search burst is adver... | detail=checklist.md:P1:98: CHK-FIX-005 [P1] Benchmark: two flag states x 2 warmups x 8 measure... | detail=checklist.md:P1:99: CHK-FIX-006 [P1] E2e explicitly enables the flag; existing roadmap-... | detail=checklist.md:P1:100: CHK-FIX-007 [P1] Commit SHA recorded after final verification. | detail=checklist.md:P0:108: CHK-030 [P0] No secrets added. | detail=checklist.md:P1:110: CHK-032 [P1] Benchmark repeat settings are validated before use; it... | detail=checklist.md:P1:118: CHK-040 [P1] Packet documents, evidence, and task completion state ... | detail=checklist.md:P1:119: CHK-041 [P1] New comments describe runtime safety and contain no ep... | detail=checklist.md:P1:120: CHK-042 [P1] ENV_REFERENCE.md documents per-query and process-lifet... | detail=checklist.md:P1:121: CHK-043 [P1] Sibling CHK-064 points to this phase's recorded latenc... | detail=checklist.md:P1:129: CHK-050 [P1] Evaluation copies and test databases use system tempor... | detail=checklist.md:P1:130: CHK-051 [P1] No repository scratch directory was created. | detail=checklist.md:P0:138: CHK-060 [P0] Raw benchmark evidence records 64 samples per state an... | detail=checklist.md:P0:139: CHK-061 [P0] The 64-wide public-search soak passed without a hang o... | detail=checklist.md:P0:140: CHK-062 [P0] The suspect queue was readable and empty after the con... | detail=checklist.md:P0:141: CHK-063 [P0] One public-handler e2e test proves the missing, queued... | detail=checklist.md:P0:142: CHK-064 [P0] The e2e test proves aggregate checked +2 and excluded ... | detail=tasks.md:UNSPECIFIED:54: T001 Re-confirmed Layer 1 citations against the live handler and ca... | detail=tasks.md:UNSPECIFIED:55: T002 Re-confirmed the 25ms F8 fast-fail bound and best-effort write... | detail=tasks.md:UNSPECIFIED:56: T003 [P] Read the read-only backup benchmark precedent end to end. | detail=tasks.md:UNSPECIFIED:57: T004 [P] Read the throwaway-DB durability stress precedent end to end. | detail=tasks.md:UNSPECIFIED:58: T005 Added an eight-query representative benchmark set. | detail=tasks.md:UNSPECIFIED:66: T006 Added the read-only-source latency harness. | detail=tasks.md:UNSPECIFIED:68: T008 Added and passed the 64-wide public-search durability soak. | detail=tasks.md:UNSPECIFIED:69: T009 Added and passed the continuous public-handler transient-miss ... | detail=tasks.md:UNSPECIFIED:70: T010 Chose a process-lifetime in-memory aggregate to avoid hot-path... | detail=tasks.md:UNSPECIFIED:72: T012 Verified aggregate increments over a multi-query public-handle... | detail=tasks.md:UNSPECIFIED:81: T014 Passed the new stress suite with a throwaway DB. | detail=tasks.md:UNSPECIFIED:82: T015 Passed the e2e test through public handlers. | detail=tasks.md:UNSPECIFIED:83: T016 Passed aggregate-counter assertions in the e2e test. | detail=tasks.md:UNSPECIFIED:85: T018 Closed sibling CHK-064 with this phase's evidence. | detail=tasks.md:UNSPECIFIED:86: T019 Reviewed the production diff: only aggregate recording and res... | detail=tasks.md:UNSPECIFIED:87: T020 Updated implementation evidence, tasks, checklist, and sibling...`

### phase022 — frontmatter

- Command: `npx --yes tsx .opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts --folder .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --level 2 --rule FRONTMATTER_MEMORY_BLOCK --output json`
- Exit: `0`
- Result: `{ |   "rule": "FRONTMATTER_MEMORY_BLOCK", |   "status": "pass", |   "message": "All spec-doc frontmatter memory blocks are structurally valid", |   "details": [], |   "diagnostics": [] | }`

### phase022 — scaffold

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-scaffold-never-touched.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation 2`
- Exit: `1`
- Result: `status=pass | message=No scaffold-signature markers found in required docs for Complete spec |  | _: RULE_DETAILS[@]: unbound variable`

### phase022 — integrity

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation 2`
- Exit: `0`
- Result: `status=fail | message=1 spec documentation integrity issue(s) found | detail=implementation-summary.md has stale Spec Folder metadata: 022-drift-marker-native-consolidation`

### phase022 — evidence

- Command: `source .opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh; run_check .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation 2`
- Exit: `1`
- Result: `status=pass | message=All completed P0/P1 checklist/task items have substantive evidence |  | _: RULE_DETAILS[@]: unbound variable`

## DQI

- `phase020-plan`: DQI `91.0`; command `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark/plan.md`; exit `0`.
- `phase022-plan`: DQI `91.0`; command `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/plan.md`; exit `0`.
- `phase022-tasks`: DQI `75.0`; command `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/tasks.md`; exit `0`.
- `phase022-checklist`: DQI `79.0`; command `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/checklist.md`; exit `0`.
- Minimum DQI: `75.0`.

## Limited Diff Inspection

- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark/plan.md`: `git diff --no-index --stat /dev/null <file>` inspected; `.../028-query-time-filter-benchmark/plan.md        | 336 +++++++++++++++++++++ |  1 file changed, 336 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/plan.md`: `git diff --no-index --stat /dev/null <file>` inspected; `.../031-drift-marker-native-consolidation/plan.md  | 380 +++++++++++++++++++++ |  1 file changed, 380 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/tasks.md`: `git diff --no-index --stat /dev/null <file>` inspected; `.../031-drift-marker-native-consolidation/tasks.md | 116 +++++++++++++++++++++ |  1 file changed, 116 insertions(+)`.
- `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation/checklist.md`: `git diff --no-index --stat /dev/null <file>` inspected; `.../checklist.md                                   | 139 +++++++++++++++++++++ |  1 file changed, 139 insertions(+)`.
- `git diff --check` exit: `0` (clean).
- Stale active pointer scan: none.
- Mutation scope: exactly four production files plus this scratch log.

## Final Requested Strict Runs

- Pre-log: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- Pre-log: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- Pre-log: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- Post-log pass A: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- Post-log pass A: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- Post-log pass A: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.
- Final pass B (executed after this final log write and parity-checked by the runner): `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence --strict` → exit `2`.
- Final pass B (executed after this final log write and parity-checked by the runner): `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark --strict` → exit `2`.
- Final pass B (executed after this final log write and parity-checked by the runner): `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation --strict` → exit `2`.

## Remaining External Blocker Groups

- Group count: `34`.

1. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
2. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence` / GENERATED_METADATA_DRIFT (error)** — Generated metadata drift found 2 drifted field(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
3. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence` / PHASE_LINKS (warning)** — 13 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
4. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence` / SPEC_DOC_INTEGRITY (error)** — 1 spec documentation integrity issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
5. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
6. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/001-release-cleanup` / PHASE_LINKS (warning)** — 17 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
7. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
8. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory` / PHASE_LINKS (warning)** — 115 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
9. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory` / PHASE_PARENT_CONTENT (warning)** — Phase parent spec.md contains migration-history token(s). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
10. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
11. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / SCAFFOLD_NEVER_TOUCHED (error)** — Found 4 scaffold-signature marker(s) in Complete spec folder. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
12. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / EVIDENCE_CITED (warning)** — Found 43 completed item(s) without evidence. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
13. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / PHASE_LINKS (warning)** — 53 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
14. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / PHASE_PARENT_CONTENT (warning)** — Phase parent spec.md contains migration-history token(s). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
15. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / AI_PROTOCOL (warning)** — AI protocol incomplete (0/4 components). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
16. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / GRAPH_METADATA_CHILD_DRIFT (warning)** — children_ids is missing on-disk phase children: 029-vague-query-model-benchmark. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
17. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / SPEC_DOC_INTEGRITY (error)** — 1 spec documentation integrity issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
18. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/003-spec-data-quality` / CONTINUITY_FRESHNESS (warning)** — Completion freshness is stale: stored continuity fingerprint does not match current content. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
19. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
20. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/004-review-remediation` / PHASE_LINKS (warning)** — 6 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
21. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation` / FRONTMATTER_MEMORY_BLOCK (error)** — 1 frontmatter_memory_block issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
22. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
23. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation` / PHASE_LINKS (warning)** — 29 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
24. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/005-dark-flag-graduation` / PHASE_PARENT_CONTENT (warning)** — Phase parent spec.md contains migration-history token(s). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
25. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
26. **root / `.opencode/specs/system-speckit/004-memory-search-intelligence/006-speckit-surface-alignment` / PHASE_LINKS (warning)** — 6 phase link issue(s) found. Affected component: root or unrelated/top-level phase documents and generated metadata outside the four production targets. Attribution: no authorized production-file diagnostic remains for this group.
27. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / FRONTMATTER_MEMORY_BLOCK (error)** — 4 frontmatter_memory_block issue(s) found. Affected component: `spec.md`, `tasks.md`, `implementation-summary.md`, and `checklist.md` frontmatter (direct rule details above). Attribution: no authorized production-file diagnostic remains for this group.
28. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: out-of-scope generated `description.json` / `graph-metadata.json`. Attribution: no authorized production-file diagnostic remains for this group.
29. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / SCAFFOLD_NEVER_TOUCHED (error)** — Found 3 scaffold-signature marker(s) in Complete spec folder. Affected component: `tasks.md`, `implementation-summary.md`, and `checklist.md` titles (direct rule details above). Attribution: no authorized production-file diagnostic remains for this group.
30. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / EVIDENCE_CITED (warning)** — Found 47 completed item(s) without evidence. Affected component: out-of-scope `tasks.md` and `checklist.md` rows (direct rule details above). Attribution: no authorized production-file diagnostic remains for this group.
31. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / SPEC_DOC_INTEGRITY (error)** — 1 spec documentation integrity issue(s) found. Affected component: out-of-scope `implementation-summary.md`. Attribution: no authorized production-file diagnostic remains for this group.
32. **phase020 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/028-query-time-filter-benchmark` / CONTINUITY_FRESHNESS (warning)** — Continuity freshness could not parse implementation-summary frontmatter. Affected component: out-of-scope `implementation-summary.md`. Attribution: no authorized production-file diagnostic remains for this group.
33. **phase022 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation` / GENERATED_METADATA_INTEGRITY (error)** — Generated metadata integrity found 1 violation(s) (enforced). Affected component: out-of-scope generated `description.json` / `graph-metadata.json`. Attribution: no authorized production-file diagnostic remains for this group.
34. **phase022 / `.opencode/specs/system-speckit/004-memory-search-intelligence/002-speckit-memory/031-drift-marker-native-consolidation` / SPEC_DOC_INTEGRITY (error)** — 1 spec documentation integrity issue(s) found. Affected component: out-of-scope `implementation-summary.md`. Attribution: no authorized production-file diagnostic remains for this group.

## Retry Verdict

- Attributable issues remaining: `0`.
- External blocker groups remaining: `34`.
- All four DQI scores meet the required threshold.
- The requested strict commands still exit non-zero only for itemized out-of-scope findings.

