---
title: "Implementation Plan: system-code-graph runtime"
description: "Inventory the four-file runtime tree, conditionally rename any non-tool-mandated snake_case path, update its consumers, and prove hook/library behavior and discovery remain at BASE parity."
trigger_phrases:
  - "system-code-graph runtime implementation plan"
  - "code graph runtime path plan"
  - "freshness runtime naming audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime implementation plan"
    next_safe_action: "Freeze runtime inventory and path consumers"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime"
      - ".opencode/skills/system-code-graph/runtime/hooks"
      - ".opencode/skills/system-code-graph/runtime/lib"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All four current runtime files and their containing directories are already kebab-case."
      - "A verified no-rename result is valid and must include path, syntax, behavior, and discovery evidence."
---

# Implementation Plan: system-code-graph runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS/Node hooks and Vitest TypeScript coverage |
| **Framework** | Runtime freshness guard and code-graph test harness |
| **Storage** | Runtime source files and path-valued operator examples |
| **Testing** | Filesystem census, Node syntax, hook behavior, Vitest discovery, path scan |

### Overview
Build a complete runtime disposition ledger before changing anything. The current runtime contains four already
kebab-case files, so the expected outcome is an evidence-backed no-op; a conditional rename is performed only if the
pinned BASE reveals an additional in-scope candidate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every runtime directory and file is enumerated.
- [ ] Hook, library, test, playbook, and top-level documentation consumers are identified.
- [ ] BASE syntax, behavior, and discovery evidence is captured.

### Definition of Done
- [ ] No runtime filesystem name is unclassified.
- [ ] Any conditional target has no stale live old path.
- [ ] Hook/library behavior, safety behavior, and discovery retain BASE parity.
- [ ] A no-rename result is explicitly recorded when applicable.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime filesystem audit with conditional path-consumer closure.

### Key Components
- Hook paths: hooks/claude/code-graph-freshness.cjs and hooks/codex/code-graph-freshness.cjs.
- Library/test paths: lib/code-graph/freshness-core.cjs and freshness-core.vitest.ts.
- Consumers: runtime tests, manual-playbook examples, SKILL/README/ARCHITECTURE/INSTALL documentation, and scripts.

### Data Flow
Claude/Codex hook adapters load the freshness core, and tests exercise the same runtime contract. A conditional rename
updates only filesystem paths and path-valued consumers; event names, environment keys, input/output envelopes, and
fail-open behavior remain stable.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate the four current files and every runtime directory.
- [ ] Scan hook adapters, tests, playbook examples, top-level docs, and external live consumers.
- [ ] Freeze the candidate map, collision evidence, syntax/behavior baseline, and discovery counts.

### Phase 2: Implementation
- [ ] Preserve the current kebab-case tree, or rename any additional pinned candidate with a semantic map.
- [ ] Update all affected hook, library, test, playbook, and documentation path values.
- [ ] Preserve event names, environment keys, code identifiers, test IDs, and runtime semantics.

### Phase 3: Verification
- [ ] Re-run the runtime census and old-name scan.
- [ ] Run Node syntax, hook behavior, and runtime Vitest checks with BASE-equivalent discovery.
- [ ] Record zero-candidate or conditional-rename evidence for the feature-catalog/playbook phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Runtime directories/files and dispositions | rg, filesystem manifest, rename-map checker |
| Syntax | CommonJS hooks and runtime modules | node --check |
| Behavior | Freshness evaluation, fail-open, timeout, and path safety | focused runtime checks |
| Discovery | Runtime Vitest coverage | Vitest with BASE count comparison |
| Documentation | Runtime path examples and links | Markdown/path scan |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 000 BASE/worktree | Internal | Required | No defensible no-op or rename proof |
| Phase 001 package map | Internal | Required | Package-root prefixes can produce false stale-path findings |
| Runtime hook/test consumers | Internal | Required | Path cleanliness alone cannot prove behavior |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An unclassified runtime name, unresolved path, syntax/behavior failure, or discovery drift.
- **Procedure**: For a conditional rename, restore the mapped runtime path and reference edits in the isolated worktree,
  retain the disposition report, and rerun the BASE checks. For a clean census, remove only the evidence of the failed
  attempt and keep the source tree unchanged.
<!-- /ANCHOR:rollback -->

