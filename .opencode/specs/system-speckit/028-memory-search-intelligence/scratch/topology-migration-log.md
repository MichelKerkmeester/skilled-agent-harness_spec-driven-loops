# Topology Migration Log

## Verification

- Status: `applied`
- Updated: `2026-07-11T16:53:11.428367Z`
- Governed phases: `173`
- Numbered support directories: `7`
- Total numbered directories: `180`
- JSONL evidence files: `154`
- Memory checkpoint: `not created (timed out)`

## Acceptance Gates

- inventory_exact: `pass`
- destinations_unique: `pass`
- root_001_through_006: `pass`
- all_sibling_groups_contiguous: `pass`
- moved_leaves_resolved: `pass`
- staging_and_inverse_rollback_available: `pass`
- json_semantics_unambiguous: `pass`

## Post-Apply Verification

- governed_phase_count_173: `pass`
- all_sibling_groups_contiguous: `pass`
- root_exactly_001_through_006: `pass`
- all_18_moved_leaves_resolved: `pass`
- all_json_and_jsonl_parse: `pass`
- identity_fields_aligned: `pass`
- old_machine_canonical_paths_absent: `pass`
- file_count_and_hash_preservation: `pass`

## Packet Strict Validation

- Command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence --strict`
- Result: `failed; topology remains applied because transaction verification passed and rollback is retained`
- Root: generated metadata integrity (1), spec-doc integrity (7); frontmatter, phase-link and migration-history warnings.
- `001-release-cleanup`: generated metadata integrity (1); phase-link warnings.
- `002-speckit-memory`: generated metadata integrity (1); phase-link and migration-history warnings.
- `003-spec-data-quality`: generated metadata integrity (1), scaffold signatures (4), spec-doc integrity (1); evidence, phase-link, migration-history, AI-protocol, continuity and excluded-support child-drift warnings.
- `004-review-remediation`: generated metadata integrity (1); phase-link warnings.
- `005-dark-flag-graduation`: frontmatter memory block (1), generated metadata integrity (1); phase-link and migration-history warnings.
- `006-speckit-surface-alignment`: generated metadata integrity (1); phase-link warnings.
- Disposition: narrative links, generated fingerprints, stale completion evidence and support-directory validator alignment are deferred to the documentation pass.

## Transaction

- Staging: `scratch/.topology-migration-stage`
- Rollback source: `scratch/topology-migration-backup`
- Inverse mappings: `173`

## Deferred Narrative Drift

- Root and child narrative Markdown still names historical numeric paths and counts; preserve it for the documentation alignment pass.
- Numbered changelog support directory names remain unchanged by contract.
- Generated source fingerprints may be stale after identity-only frontmatter changes and require metadata regeneration in the documentation pass.

## Task 20 Support Declassification

- Historical alias: `003-spec-data-quality/029-vague-query-model-benchmark`.
- Active support path: `003-spec-data-quality/vague-query-model-benchmark`.
- The directory has no immediate `spec.md`; it remains benchmark evidence, not a governed phase.
- Post-change baseline: 173 governed phases, 7 numbered support directories, 180 numbered directories.
- Raw benchmark preservation gate: 144 JSONL files and all sibling evidence files retain their pre-move SHA-256 hashes.
