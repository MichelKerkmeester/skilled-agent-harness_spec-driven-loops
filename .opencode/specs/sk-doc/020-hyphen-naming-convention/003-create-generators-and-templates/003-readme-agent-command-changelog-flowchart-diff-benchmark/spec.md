---
title: "Feature Specification: README, agent, command, changelog, flowchart, diff, and benchmark generators (032 phase 003 child 003)"
description: "Seven create-* workflow packets still carry output examples and path rules that can produce underscore names. Their generated files and directories must use kebab-case, with README/SKILL/tool contracts and Python exemptions preserved."
trigger_phrases:
  - "readme agent command benchmark generator naming"
  - "hyphenate create outputs"
  - "create workflow artifact filenames"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Level 2 contract for seven create-* generator families"
    next_safe_action: "Inventory each workflow's derived output path and exact-name exemptions"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: README, Agent, Command, Changelog, Flowchart, Diff, and Benchmark Generators

> Parallel child under `003-create-generators-and-templates`; the command asset emission layer is covered separately by child 004.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Child 003 of phase 003 in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The README, agent, command, changelog, flowchart, diff, and benchmark workflows each derive output paths from a user name, topic, component, date, or report type. Their current guidance and templates contain mixed naming rules, so a successful run can create an underscore directory or filename even when the requested artifact is otherwise valid.

Align these seven generator families with the canonical filesystem rule. Each workflow must validate or derive semantic kebab-case path segments, preserve exact tool/format names such as `README.md`, `SKILL.md`, and versioned files where required, and prove its emitted tree in a temporary target.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `create-readme`: README and install-guide output paths, including derived component/project slugs.
- `create-agent` and `create-command`: generated markdown filenames, namespace/directory segments, and name-to-filename agreement.
- `create-changelog`: component/packet directory segments and global or nested changelog output paths, with version filename contracts preserved.
- `create-flowchart` and `create-diff`: explicit or derived markdown target paths and report filenames; create-diff remains a preview workflow until its engine exists.
- `create-benchmark`: MCP promotion, behavior-benchmark, skill-benchmark, and model-benchmark generated directories and artifact filenames.
- Packet-local `SKILL.md`, `README.md`, references, and templates that define these emitted paths, plus temporary generation fixtures.

### Out of Scope
- The create-skill, feature-catalog, and manual-testing-playbook generator contracts; sibling children 001 and 002 own them.
- The `/create:*` auto/confirm/presentation asset files; child 004 owns their emitter instructions.
- Renaming existing packet, template, benchmark, or documentation files; later migration phases own on-disk renames.
- Implementing the pending create-diff engine or changing benchmark scoring/evaluator contracts.
- Code identifiers, YAML/JSON keys, frontmatter field names, Python filenames/package directories, and exact tool-mandated filenames.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README and install-guide generators emit canonical output paths | A temporary README/install-guide run writes `README.md` where required and uses kebab-case for every non-exempt derived directory or filename segment. |
| REQ-002 | Agent and command generators emit names that match their hyphenated inputs | Generated agent/command filenames and namespace paths are lowercase kebab-case, and the output stem matches the validated name. |
| REQ-003 | Changelog, flowchart, and diff generators emit compliant markdown targets | Global/nested changelog component paths, flowchart targets, and diff-report paths contain no non-exempt underscore segment; versioned or tool-mandated names remain exact. |
| REQ-004 | Benchmark generators emit canonical family trees and artifacts | MCP promotion, behavior, skill-benchmark, and model-benchmark temporary outputs use hyphenated directories/files, with exact-name contracts recorded before assertion. |
| REQ-005 | Templates and packet guidance agree with generator behavior | No owned instruction tells a generator to create a non-exempt underscore output name; current source template filenames are identified separately from copied output names. |
| REQ-006 | Name conversion is semantic and collision-safe | The implementation validates or derives a legal slug and rejects ambiguous/invalid input; it does not perform a blind global underscore-to-hyphen substitution. |
| REQ-007 | Every family passes an isolated output-tree check | A representative temporary run for each family lists all emitted paths and finds zero non-exempt underscore names, with the command and exit code recorded. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven generator families emit kebab-case filesystem names while preserving declared exact-name exemptions.
- **SC-002**: Generated paths, links, and report references resolve within each temporary target, and no create-diff engine or benchmark scoring scope is expanded.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The families have different path contracts, so a shared mechanical replacement would corrupt version names, tool contracts, or user-supplied paths. Build the evidence by family and classify every exact-name exemption before scanning. The create-diff packet is preview-only, and benchmark output must not change evaluator/scoring ownership while its filesystem names change.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the semantic naming rule and exemption boundary are fixed by the 032 parent and DR-005/DR-008.
<!-- /ANCHOR:questions -->
