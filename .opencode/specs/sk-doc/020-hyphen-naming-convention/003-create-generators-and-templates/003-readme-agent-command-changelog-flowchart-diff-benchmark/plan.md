---
title: "Implementation Plan: README, agent, command, changelog, flowchart, diff, and benchmark generators (032 phase 003 child 003)"
description: "Inventory seven create-* output contracts, update their packet guidance and templates, and verify each family in a disposable target with semantic kebab-case naming and explicit exemptions."
trigger_phrases:
  - "create workflow artifact naming implementation plan"
  - "readme agent command benchmark naming plan"
  - "hyphenated create output plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the implementation plan for seven create-* output families"
    next_safe_action: "Inventory output contracts and exact-name exemptions by generator family"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: README, Agent, Command, Changelog, Flowchart, Diff, and Benchmark Generators

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `sk-doc/create-readme`, `create-agent`, `create-command`, `create-changelog`, `create-flowchart`, `create-diff`, and `create-benchmark` |
| **Change class** | Generator output paths and packet-local templates/guidance |
| **Execution** | Family-by-family temporary output checks on the pinned BASE worktree |

### Overview
First inventory each workflow's output path inputs, derived slug rules, exact-name contracts, and current examples. Then update the packet-owned guidance/templates and run representative outputs through a semantic path checker. The proof stays family-specific so a version filename, `README.md`, benchmark artifact, or explicit user target is not treated like an ordinary slug.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each of the seven packet output contracts has a concrete representative input and target.
- [ ] Exact-name exemptions and user-provided target-path behavior are recorded before edits.
- [ ] The create-diff preview boundary and benchmark evaluator/scoring boundary are preserved.
- [ ] Temporary output roots are available for each generator family.

### Definition of Done
- [ ] All seven families emit only compliant non-exempt path segments and filenames.
- [ ] Packet guidance/templates match the emitted paths and contain no stale non-exempt output examples.
- [ ] Family-specific output listings, path/link checks, and focused tests are green.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- README/install-guide output keeps exact `README.md` where the artifact contract requires it and hyphenates derived folder/file names.
- Agent and command output derives the file stem from the validated hyphenated name and preserves the runtime command/agent surface.
- Changelog output keeps version syntax and changelog directory contracts while hyphenating component and packet-derived segments.
- Flowchart and diff output validate explicit target paths; create-diff reports preview availability rather than implementing a missing engine.
- Benchmark output treats MCP, behavior, skill, and model families separately and preserves their evaluator/report ownership while naming emitted artifacts semantically.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory `SKILL.md`, README, reference, asset, and output-path rules for all seven packets.
- [ ] Define representative inputs, expected output trees, exact-name exemptions, and invalid-name cases.
- [ ] Confirm existing source-template filenames and current benchmark/scoring files will not be renamed here.

### Phase 2: Implementation
- [ ] Update README/install-guide, agent, and command output naming rules.
- [ ] Update changelog, flowchart, and diff target-path rules without changing version or preview contracts.
- [ ] Update benchmark family output rules and packet-local examples without changing scoring/evaluator ownership.
- [ ] Replace stale non-exempt output examples and add semantic invalid-input diagnostics where the workflow validates names.

### Phase 3: Verification
- [ ] Run a representative temporary output for every family and list all emitted paths.
- [ ] Resolve generated links/references and compare names against the exemption-aware policy.
- [ ] Run focused packet tests/validators and record commands, exit codes, and output counts.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Generate a README and install guide into temporary targets; assert exact `README.md` preservation and kebab-case derived paths. |
| REQ-002 | Generate an agent and command from hyphenated names; assert filename stems, namespace segments, and frontmatter/name agreement. |
| REQ-003 | Generate changelog, flowchart, and diff targets; assert component/target segments, explicit path validation, and preserved version/tool contracts. |
| REQ-004 | Exercise one temporary output for each benchmark family; list directories and artifacts and compare against the recorded exact-name manifest. |
| REQ-005 | Search packet-owned output guidance and templates for stale non-exempt underscore examples; distinguish source-template filenames from copied output names. |
| REQ-006 | Feed invalid/ambiguous names and joined path segments to the naming boundary; assert rejection or an explicit user-path decision rather than character substitution. |
| REQ-007 | Run all seven representative generations and record nonzero output counts, path listings, and zero non-exempt underscore findings. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase uses the 032 policy/exemption set and the existing packet-local templates. Child 004 must later project the same output contract into command auto/confirm assets, while children 001/002 own skill/catalog/playbook-specific contracts. No existing on-disk rename or create-diff engine implementation is required here.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-scoped packet guidance/template and focused test changes. Delete disposable family output trees and reports. Leave existing source templates, command asset filenames, benchmark stores, and renderer/scorer code untouched.
<!-- /ANCHOR:rollback -->
