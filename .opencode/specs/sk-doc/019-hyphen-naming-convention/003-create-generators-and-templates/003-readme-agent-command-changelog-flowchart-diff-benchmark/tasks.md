---
title: "Tasks: README, agent, command, changelog, flowchart, diff, and benchmark generators (017 phase 003 child 003)"
description: "Tasks for aligning seven create-* workflow families with semantic kebab-case output names and verifying each family in a temporary target."
trigger_phrases:
  - "create workflow artifact naming tasks"
  - "readme agent command benchmark naming tasks"
  - "hyphenated create output tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the task breakdown for seven create-* output families"
    next_safe_action: "Start with the family output-contract and exemption inventory"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Inventory output path rules for create-readme, create-agent, create-command, create-changelog, create-flowchart, create-diff, and create-benchmark.
- [ ] T002 Record representative inputs, expected trees, exact-name exemptions, and invalid/ambiguous name cases for each family.
- [ ] T003 [P] Create disposable target roots for family-by-family generation checks.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update README/install-guide, agent, and command output path/name rules.
- [ ] T005 Update changelog, flowchart, and diff target path/name rules while preserving version and preview contracts.
- [ ] T006 Update MCP, behavior, skill-benchmark, and model-benchmark output rules without changing scoring/evaluator ownership.
- [ ] T007 Remove stale non-exempt underscore output examples and add semantic invalid-name handling where required.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: README/install-guide outputs preserve exact tool names and use kebab-case for derived paths.
- [ ] T009 Verify: agent/command output stems and namespaces match validated hyphenated inputs.
- [ ] T010 Verify: changelog/flowchart/diff outputs use compliant target paths and preserve version/preview contracts.
- [ ] T011 Verify: every benchmark family emits a compliant temporary tree against its exact-name manifest.
- [ ] T012 Verify: packet guidance/templates contain no stale non-exempt output examples and source-template filenames are not mistaken for outputs.
- [ ] T013 Verify: invalid/ambiguous names are rejected or explicitly resolved without a blind underscore substitution.
- [ ] T014 Run all seven family checks and record output counts, path listings, exit codes, and focused validator/test results.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` are met with evidence.
- [ ] Every generator family has a nonzero, path-listed verification result.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Program policy**: See `../../001-convention-policy-and-scope/decision-record.md`.
<!-- /ANCHOR:cross-refs -->
