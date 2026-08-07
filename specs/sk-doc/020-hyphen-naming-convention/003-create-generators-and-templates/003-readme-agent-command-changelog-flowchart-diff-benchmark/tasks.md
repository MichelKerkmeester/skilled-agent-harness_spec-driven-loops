---
title: "Tasks: README, agent, command, changelog, flowchart, diff, and benchmark generators (020 phase 003 child 003)"
description: "Tasks for aligning seven create-* workflow families with semantic kebab-case output names and verifying each family in a temporary target."
trigger_phrases:
  - "create workflow artifact naming tasks"
  - "readme agent command benchmark naming tasks"
  - "hyphenated create output tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "No child work remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: README, Agent, Command, Changelog, Flowchart, Diff, and Benchmark Generators

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

- [x] T001 Inventory output path rules for create-readme, create-agent, create-command, create-changelog, create-flowchart, create-diff, and create-benchmark. Evidence: `stale-output-name audit` passes across all seven scoped generator directories.
- [x] T002 Record representative inputs, expected trees, exact-name exemptions, and invalid/ambiguous name cases for each family. Evidence: the exact-name manifest reports 24 files and `underscore-violations=0`.
- [x] T003 [P] Create disposable target roots for family-by-family generation checks. Evidence: `mktemp -d` created the isolated fixture root used by the 7/7 family audit.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update README/install-guide, agent, and command output path/name rules. Evidence: the fixture tree contains `install-guides/release-operations.md`, `migration-engineer.md`, and `spec-kit/create-packet.md`.
- [x] T005 Update changelog, flowchart, and diff target path/name rules while preserving version and preview contracts. Evidence: `v1.2.3.4.md`, `release-workflow.md`, and `release-notes.diff.html` pass the fixture audit.
- [x] T006 Update MCP, behavior, skill-benchmark, and model-benchmark output rules without changing scoring/evaluator ownership. Evidence: `benchmark-subfamilies=4/4` and the scoped diff contains no scorer or renderer file.
- [x] T007 Remove stale non-exempt underscore output examples and add semantic invalid-name handling where required. Evidence: `stale-output-name audit` and `source-template rename audit` both pass.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify: README/install-guide outputs preserve exact tool names and use kebab-case for derived paths. Evidence: the fixture tree preserves `README.md` and emits `install-guides/release-operations.md`.
- [x] T009 Verify: agent/command output stems and namespaces match validated hyphenated inputs. Evidence: the exact-name manifest contains `migration-engineer.md` and `spec-kit/create-packet.md`.
- [x] T010 Verify: changelog/flowchart/diff outputs use compliant target paths and preserve version/preview contracts. Evidence: `test_create_diff.py` passes 52 tests while the fixture preserves `v1.2.3.4.md`.
- [x] T011 Verify: every benchmark family emits a compliant temporary tree against its exact-name manifest. Evidence: the output audit reports `benchmark-subfamilies=4/4` and 24 total files.
- [x] T012 Verify: packet guidance/templates contain no stale non-exempt output examples and source-template filenames are not mistaken for outputs. Evidence: all 30 changed Markdown files pass `validate_document.py`.
- [x] T013 Verify: invalid/ambiguous names are rejected or explicitly resolved without a blind underscore substitution. Evidence: `test_explicit_report_name_rejects_underscore` and `test_explicit_report_name_rejects_non_suffix_dot` pass.
- [x] T014 Run all seven family checks and record output counts, path listings, exit codes, and focused validator/test results. Evidence: the named test commands exit 0 with `families=7/7`, `sk-doc=32`, and `sk-code=30`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete.
- [x] All requirements in `spec.md` are met with evidence.
- [x] Every generator family has a nonzero, path-listed verification result.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Program policy**: See `../../001-convention-policy-and-scope/decision-record.md`.
<!-- /ANCHOR:cross-refs -->
