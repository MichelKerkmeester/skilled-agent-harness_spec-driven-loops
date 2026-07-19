---
title: "Tasks: reference checker and disposition ledger (020 phase 005.002)"
description: "Tasks for the whole-repository checker and ledger: enumerate scan coverage, resolve typed path references, disposition dynamic sites, validate map-row completeness, and fail on empty or unresolved scans."
trigger_phrases:
  - "reference checker tasks"
  - "disposition ledger tasks"
  - "dynamic reference audit tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the reference checker and ledger task contract"
    next_safe_action: "Implement scan manifest and ledger schema validation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The checker must fail closed on zero files, unresolved references, ambiguous resolution, and undispositioned dynamic sites."
---
# Tasks: Reference Checker and Disposition Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define the map-entry and dynamic-site ledger rows, terminal statuses, evidence fields, and pre/post rename state. Evidence: `reference_checker_models.py`.
- [x] T002 Enumerate tracked files, symlinks, generated/lockfile handling, and the zero-scan failure rule. Evidence: `tracked_manifest`.
- [x] T003 [P] Define the resolver coverage matrix for JS/TS, Markdown, JSON/YAML/TOML path values, shell, registries, and symlinks. Evidence: `extract_references`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the tracked-file and symlink manifest with a non-empty scan assertion. Evidence: `test_zero_tracked_files_is_a_hard_failure`.
- [x] T005 Implement typed extraction and resolution for JS/TS modules, Markdown links, and registry paths. Evidence: `test_complete_matrix_emits_cas_ready_read_only_ledger`.
- [x] T006 Implement JSON/YAML/TOML and frontmatter path-value checks without treating keys or identifiers as paths. Evidence: `old_config` exclusion fixture.
- [x] T007 Implement shell sourcing, executable paths, symlink targets, and exemption-aware reporting. Evidence: `symlink-target` and `shell-source` fixture rows.
- [x] T008 Detect dynamic `require`, `source`, and glob sites and require an explicit disposition for each. Evidence: `DYNAMIC_DISPOSITIONS`.
- [x] T009 Implement map reconciliation, ledger schema validation, and non-zero outcomes for unresolved or ambiguous references. Evidence: `validate_ledger`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify: A non-empty scan reports every supported file/reference class and a zero-file scan fails non-zero. Evidence: `test_zero_tracked_files_is_a_hard_failure`.
- [x] T011 Verify: Planted JS/TS, Markdown, JSON/YAML/TOML value, shell, registry, and symlink references resolve or fail with location evidence. Evidence: 7/7 resolver kinds.
- [x] T012 Verify: Code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python exemptions, generated output, tool-mandated names, and frozen paths are not misclassified. Evidence: 4/4 preserve classes.
- [x] T013 Verify: Every rename-map entry has one decision, rationale, status, and evidence row. Evidence: 13/13 map rows.
- [x] T014 Verify: Every dynamic `require`, `source`, and glob site is dispositioned; an undispositioned site fails the checker. Evidence: `producer-routed` fixture.
- [x] T015 Verify: The checker is read-only and leaves tracked content, modes, and the Git index unchanged. Evidence: `git_snapshot` equality.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All checker and ledger tasks complete with evidence in the phase checklist. Evidence: `checklist.md` 16/16.
- [x] All requirements in `spec.md` meet their acceptance criteria. Evidence: `test_reference_checker.py` 9/9.
- [x] Phase 003 can consume the ledger schema and deterministic failure semantics. Evidence: `LEDGER_SCHEMA_VERSION = 1`.
- [x] No rename or reference rewrite was executed against the real repository. Evidence: `git_snapshot` equality.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Checker decisions**: See `decision-record.md`
- **Parent map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
