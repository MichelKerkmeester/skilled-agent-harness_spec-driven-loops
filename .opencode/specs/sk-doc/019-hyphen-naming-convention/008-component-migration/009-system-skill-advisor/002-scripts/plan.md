---
title: "Implementation Plan: system-skill-advisor scripts"
description: "Rename the single current non-Python script filename candidate, update its complete reference closure, and prove the Python compatibility scripts remain importable and semantically unchanged."
trigger_phrases:
  - "system-skill-advisor scripts implementation plan"
  - "regression dataset path plan"
  - "Python script exemption verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/002-scripts"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the scripts implementation plan"
    next_safe_action: "Freeze the non-Python script candidate and reference manifest"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/build-holdout.mjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The regression dataset filename is the only current non-Python script filename containing snake_case."
      - "Python script names and import/module identifiers remain unchanged."
---

# Implementation Plan: system-skill-advisor scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node/TypeScript loaders, JavaScript tooling, Python compatibility scripts, JSONL data |
| **Framework** | Vitest and routing-accuracy harnesses |
| **Storage** | Checked-in JSONL regression dataset and generated holdout data |
| **Testing** | Python regression, holdout generation, TypeScript validation, path scan |

### Overview
Treat the regression JSONL file as a filesystem asset, not a Python module. Rename it with a semantic map, update
every direct path consumer and provenance field, and verify that Python scripts still resolve their original module
names and consume the same records.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Full scripts inventory separates non-Python filenames from Python exemptions.
- [ ] Direct loaders, routing fixtures, docs, and manual scenario references are enumerated.
- [ ] BASE dataset line/record counts are captured.

### Definition of Done
- [ ] The regression dataset has one kebab-case path and no stale live path.
- [ ] All source, registry, provenance, and documentation consumers use the new path.
- [ ] Python imports and regression semantics retain BASE parity.
- [ ] No JSONL field, tool ID, or Python identifier was altered.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Asset filename rename with path-consumer closure.

### Key Components
- Regression dataset: source JSONL under scripts/fixtures.
- Loaders: advisor validation and routing-accuracy holdout builder.
- Compatibility scripts: Python files whose names and imports are exempt.
- Evidence consumers: holdout provenance, manual playbook, reference docs, and install guide.

### Data Flow
The Python regression harness and TypeScript validator read the same JSONL asset. The holdout builder derives a
secondary corpus and records the source path. Updating the asset path at each consumer preserves the data flow; no
record key or prompt content is rewritten.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Freeze the scripts inventory and identify every path-valued hit for the old dataset filename.
- [ ] Record Python filenames, imports, fixture counts, and current regression/holdout outputs.
- [ ] Check for exact, casefold, and path-context collisions before the rename.

### Phase 2: Implementation
- [ ] Rename skill_advisor_regression_cases.jsonl to skill-advisor-regression-cases.jsonl.
- [ ] Update advisor-validate, build-holdout, holdout provenance, tests, playbooks, references, and install commands.
- [ ] Keep skill_advisor.py, skill_advisor_bench.py, skill_advisor_regression.py, skill_advisor_runtime.py, and
  skill_graph_compiler.py unchanged as Python exemptions.

### Phase 3: Verification
- [ ] Scan for live old dataset paths and classify retained prose/data mentions.
- [ ] Run the Python regression and routing-accuracy/holdout checks.
- [ ] Compare record counts and output schema to BASE.
- [ ] Hand off the new dataset path to the references and playbook phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path | Old/new filename references and script inventory | rg and rename-map checker |
| Compatibility | Python imports and regression harness | Python regression runner |
| Integration | TypeScript validator and holdout builder | Node/TypeScript command paths |
| Data | JSONL record count and output schema | JSONL parser and BASE comparison |
| Documentation | Operator commands and playbook/reference pointers | Link/path scan |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 root map | Internal | Required | Absolute script paths cannot be reconciled |
| Python compatibility contract | Internal | Required | Exemption boundary is unverified |
| Routing-accuracy corpus | Internal | Required | Holdout provenance cannot be compared |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Python import failure, record-count drift, unresolved old path, or changed JSONL semantics.
- **Procedure**: Revert the single asset rename and path-reference edits in the isolated worktree, restore the BASE
  dataset path, and rerun the regression/holdout baseline before attempting a narrower map.
<!-- /ANCHOR:rollback -->
