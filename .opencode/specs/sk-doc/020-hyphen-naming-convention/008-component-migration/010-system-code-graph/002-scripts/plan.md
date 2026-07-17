---
title: "Implementation Plan: system-code-graph scripts"
description: "Inventory the two current code-graph script locations, conditionally rename any non-Python snake_case filename, update its complete reference closure, and prove the existing kebab-case scripts remain behaviorally unchanged."
trigger_phrases:
  - "system-code-graph scripts implementation plan"
  - "code graph script filename plan"
  - "script naming audit plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts implementation plan"
    next_safe_action: "Freeze script filename and reference inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/scripts/doctor.sh"
      - ".opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs"
      - ".opencode/skills/system-code-graph/mcp_server"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current non-Python script filenames are already kebab-case, so the execution may produce a verified no-rename result."
      - "Python script names and import/module identifiers remain unchanged."
---

# Implementation Plan: system-code-graph scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | POSIX shell, Node/JavaScript, TypeScript consumers |
| **Framework** | Code-graph build/test and evaluation harnesses |
| **Storage** | Script files, test fixtures, and path-valued documentation |
| **Testing** | Filename census, shell/Node syntax checks, focused script consumers, path scan |

### Overview
Treat script names as filesystem assets and build a complete disposition ledger before changing anything. The current
files scripts/doctor.sh and mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs already satisfy the target form;
if the pinned BASE confirms that inventory, the phase records a no-rename result and verifies all references.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Full scripts inventory separates non-Python filenames from Python and tool exemptions.
- [ ] Direct loaders, shell sources, registries, fixtures, tests, and documentation references are enumerated.
- [ ] BASE script syntax, input, and discovery evidence is captured.

### Definition of Done
- [ ] No non-Python script filename is unclassified.
- [ ] Any conditional target has one kebab path and no stale live old path.
- [ ] Script syntax, consumers, and counts retain BASE behavior.
- [ ] A zero-candidate result is explicitly evidenced when applicable.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Script filename inventory with conditional path-consumer closure.

### Key Components
- Script locations: scripts/doctor.sh and mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs.
- Consumers: source path construction, shell commands, test/evaluation harnesses, registries, and operator docs.
- Preserved boundaries: Python filenames/imports, code identifiers, tool IDs, data keys, and generated metadata.

### Data Flow
The doctor script and evaluation script are invoked by operator or test workflows. A conditional rename changes only a
filesystem path and its path-valued consumers; command semantics, arguments, output, and identifiers remain stable.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate scripts/ and mcp_server/scripts/ and classify every basename.
- [ ] Scan source, shell, registry, fixture, test, metadata, and documentation references.
- [ ] Capture collision, syntax, and BASE behavior evidence.

### Phase 2: Implementation
- [ ] Preserve doctor.sh and score-seeded-ppr-retrieval.mjs as already compliant, unless the pinned inventory finds
  an additional non-Python snake_case filename.
- [ ] If a candidate exists, rename it with a semantic map and update every path consumer in the same dependency-closed
  change.
- [ ] Keep Python filenames, imports, identifiers, tool IDs, data keys, and generated metadata unchanged.

### Phase 3: Verification
- [ ] Re-run the script census and old-name scan.
- [ ] Run shell/Node syntax and focused consumers with BASE-equivalent results.
- [ ] Record zero-candidate or conditional-rename evidence for the references phase.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Script basenames, exemptions, and old/new paths | rg, filesystem manifest, rename-map checker |
| Syntax | Shell and Node script parseability | bash -n, node --check |
| Integration | Script loaders, evaluation harness, and path consumers | focused repository commands |
| Documentation | Operator examples and links | Markdown/path scan |
| No-op proof | Complete clean inventory when no candidate exists | candidate report and checklist receipt |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 root map | Internal | Required | Absolute mcp_server/scripts paths cannot be reconciled |
| Phase 000 BASE/worktree | Internal | Required | A no-rename result cannot be proven |
| Script consumers | Internal | Required | A stale path can survive despite a clean local filename scan |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An unclassified filename, syntax failure, unresolved old path, or behavior/count drift.
- **Procedure**: If a conditional rename occurred, restore the single mapped path and its reference edits in the
  isolated worktree, retain the disposition report, and rerun the BASE script checks. If the census was clean, remove
  only the phase evidence rather than manufacturing a rename.
<!-- /ANCHOR:rollback -->

