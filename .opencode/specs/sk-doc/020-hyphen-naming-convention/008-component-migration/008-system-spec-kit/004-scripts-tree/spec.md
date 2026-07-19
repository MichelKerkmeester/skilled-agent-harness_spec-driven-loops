---
title: "Feature Specification: Scripts tree (020 subtree 008 phase 004)"
description: "The system-spec-kit surface has a small set of non-Python script filenames that still contain underscores, while Python scripts and test fixture names follow separate contracts. This phase renames only permitted script filenames and updates sourcing, imports, and registry references without touching Python filenames or test-runner magic."
trigger_phrases:
  - "system-spec-kit scripts tree"
  - "_utils.sh rename"
  - "run_arm.sh rename"
  - "kebab-case script filenames"
  - "kebab-case phase 004"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/004-scripts-tree"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Reconciled to v4 - noted scripts/codex sync producers (already kebab, governed by 013/004)"
    next_safe_action: "Execute the non-Python script filename map; leave codex sync producers as-is"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Scripts tree

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 003-mcp-server-consumer-rewrites; successor 005-templates-and-examples.

> **RECONCILED — v4 reconciliation (2026-07-15).** This tree contains `scripts/codex/sync-prompts.cjs` and `scripts/codex/sync-agents.cjs` — the producers of the generated `.codex/` mirror. Both are already kebab (NOT rename candidates here). Their OUTPUT naming correctness (the 2 `.codex/prompts/` snake regressions) is governed by the source command names in 013-commands and by the guard treating `.codex/` as generated (004) — not by any filename change in this phase. See the packet's v4-reconciliation-inventory.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/004-scripts-tree |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 004 of the 008 system-spec-kit component migration under the 020 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live inventory identifies .opencode/skills/system-spec-kit/scripts/setup/_utils.sh and mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh as non-Python script filenames with underscores. Their sourcing and benchmark callers are path-sensitive, while nearby run_arm.py and test_dual_threshold.py files are explicitly exempt.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename scripts/setup/_utils.sh to scripts/setup/utils.sh.
- Rename mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.sh to run-arm.sh.
- Update shell sourcing, benchmark launch commands, README inventories, registry entries, and import/path references to those scripts.
- Sweep the scripts tree for additional non-Python script filenames and record the concrete zero or positive result before moving anything.

### Out of Scope
- All .py filenames, including run_arm.py, aggregate.py, generate_report.py, and test_dual_threshold.py.
- The scripts/tests/__snapshots__ directory and timestamped memory-quality fixture files, which require test/generated-data dispositions.
- Directory renames, template/reference files, and script-content changes unrelated to path closure.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The non-Python script inventory is complete. | The baseline search lists every script filename containing an underscore and classifies Python, test-magic, generated fixture, or rename candidates. |
| REQ-002 | Permitted script names use semantic kebab targets. | _utils.sh maps to utils.sh and run_arm.sh maps to run-arm.sh with no leading-hyphen target. |
| REQ-003 | Every script reference is updated in lockstep. | source commands, shell wrappers, README inventories, benchmark commands, and registry/path values resolve to the new names. |
| REQ-004 | Python and test/generated exemptions are preserved. | No .py filename, Python package directory, test magic directory, or generated fixture basename is renamed. |
| REQ-005 | The scripts tree remains executable and callable. | Shell syntax, executable bits, and benchmark wrapper behavior are verified centrally. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No permitted non-Python script filename in the assigned tree contains an underscore.
- **SC-002**: All script callers and documentation references resolve to utils.sh and run-arm.sh.
- **SC-003**: Python, test-magic, generated, and tool-mandated names remain intact.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Leading-underscore helper names need semantic targets; _utils.sh must become utils.sh, not -utils.sh. The benchmark wrapper is coupled to Python files that cannot be renamed, so only the shell wrapper and its references move. Fixture timestamps contain underscores but are not script filenames and must not be swept mechanically.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The execution report must record whether the live inventory contains only the two named shell candidates.
<!-- /ANCHOR:questions -->

