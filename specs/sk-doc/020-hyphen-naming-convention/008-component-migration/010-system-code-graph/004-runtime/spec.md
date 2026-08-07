---
title: "Feature Specification: system-code-graph runtime"
description: "Audit the system-code-graph runtime tree, rename any non-tool-mandated snake_case filesystem name found in the pinned baseline, and repair runtime references without changing hook events, code identifiers, or runtime contracts."
trigger_phrases:
  - "system-code-graph runtime naming"
  - "code graph runtime path audit"
  - "runtime kebab-case verification"
  - "freshness hook filename audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime naming audit contract"
    next_safe_action: "Confirm runtime inventory on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
      - ".opencode/skills/system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs"
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.vitest.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The runtime tree currently contains four files and all runtime directory/file basenames are already kebab-case."
      - "A proven zero-rename result is valid; the phase must retain the full inventory and reference evidence."
      - "Hook events, environment keys, code identifiers, test names, and runtime behavior remain unchanged."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph runtime
> Phase adjacency — predecessor `003-references`; successor `005-feature-catalog`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph runtime tree is a named migration surface even though its current four files and directory
segments already use kebab-case: hooks/claude/code-graph-freshness.cjs, hooks/codex/code-graph-freshness.cjs,
lib/code-graph/freshness-core.cjs, and freshness-core.vitest.ts. Without an evidence-pinned audit, a hidden or newly
tracked snake_case runtime name could pass into the final gate, or a no-op phase could be mistaken for incomplete work.

### Purpose
Prove the runtime tree has no unclassified in-scope snake_case filesystem name, conditionally rename any candidate if
the pinned BASE reveals one, and preserve runtime behavior and reference closure.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every directory and file under .opencode/skills/system-code-graph/runtime/.
- Preserve the current kebab-case runtime tree: hooks/claude/code-graph-freshness.cjs, hooks/codex/code-graph-freshness.cjs,
  lib/code-graph/freshness-core.cjs, and lib/code-graph/freshness-core.vitest.ts.
- If the pinned BASE reveals a non-tool-mandated snake_case runtime name, rename it with a semantic map and update
  every runtime hook, test, documentation, and path-valued reference.
- Re-run runtime discovery, syntax, and reference checks and retain zero-candidate evidence when no rename is required.

### Out of Scope
- The mcp-server package tree, scripts, references, feature catalog, manual playbook, generated dist, and unrelated
  runtime trees.
- Hook event names, environment variables, code identifiers, test IDs, JSON/YAML/TOML keys, frontmatter fields, and
  runtime behavior.
- A synthetic rename or broad underscore replacement when the runtime inventory is already clean.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/runtime/ | Verify/Conditional rename | Prove the runtime tree is kebab-clean or apply a pinned candidate map |
| .opencode/skills/system-code-graph/runtime/hooks/{claude,codex}/ | Verify/Conditional rename | Preserve hook locations and update any conditional filename target |
| .opencode/skills/system-code-graph/runtime/lib/code-graph/ | Verify/Conditional rename | Preserve runtime library paths and update any conditional filename target |
| .opencode/skills/system-code-graph/{SKILL,README,ARCHITECTURE,INSTALL_GUIDE}.md | Modify if needed | Repair runtime path references |
| .opencode/skills/system-code-graph/manual_testing_playbook/ and tests | Modify if needed | Repair runtime path examples or fixtures |
| 004-runtime/checklist.md | Evidence | Record complete inventory and zero-candidate or conditional result |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The runtime inventory is explicit | Every runtime directory/file is listed with owner and rename/exempt/already-compliant disposition. |
| REQ-002 | Runtime names are canonical | The current four-file tree remains kebab-case; any additional in-scope snake_case name has one kebab target and no old live path. |
| REQ-003 | Runtime references resolve | Hooks, tests, docs, examples, and path-valued consumers resolve the actual runtime paths. |
| REQ-004 | Runtime behavior is preserved | Hook events, environment keys, fail-open/timeout behavior, syntax, and test discovery match BASE. |
| REQ-005 | A no-rename result is accepted when proven | The checklist records the complete clean inventory and zero-candidate evidence instead of fabricating a rename. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime tree contains no unclassified in-scope snake_case filesystem name.
- **SC-002**: Every live runtime path reference resolves and runtime behavior matches BASE.
- **SC-003**: A zero-rename result is durable, evidence-pinned, and accepted by the subtree gate.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime references in sibling docs/playbook | A clean runtime tree can still have stale path examples | Scan all live system-code-graph consumers and classify cross-phase references. |
| Risk | Hook path is confused with hook event or identifier | Runtime routing can change without a filesystem diff that explains it | Separate path segments from event names, environment keys, and code symbols. |
| Risk | No-op outcome lacks evidence | A hidden candidate can survive into the final gate | Require full tree inventory, old-name scan, syntax/test evidence, and zero-candidate receipt. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current tree predicts a no-rename result; execution must confirm it against the pinned BASE and
retain evidence for every runtime hook and library consumer.
<!-- /ANCHOR:questions -->

