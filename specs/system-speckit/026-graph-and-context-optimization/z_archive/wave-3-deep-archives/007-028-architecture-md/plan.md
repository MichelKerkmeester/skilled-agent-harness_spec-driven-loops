---
title: "Implementation Plan: system-code-graph architecture.md"
description: "Create a documentation-only architecture reference for system-code-graph, using sk-doc anchored structure and line-cited source evidence."
trigger_phrases:
  - "system-code-graph architecture"
  - "architecture implementation plan"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-028-architecture-md"
    last_updated_at: "2026-05-14T17:44:37Z"
    last_updated_by: "codex"
    recent_action: "Created and validated architecture doc plan"
    next_safe_action: "Stage and commit documentation-only changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/architecture.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-architecture-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: system-code-graph architecture.md

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation over TypeScript MCP source |
| **Framework** | MCP server package documentation |
| **Storage** | SQLite graph storage and Spec Kit Memory vector storage are documented, not changed |
| **Testing** | Spec validation |

### Overview
Create `.opencode/skills/system-code-graph/architecture.md` from the sk-doc anchored-doc shape, using `system-spec-kit/architecture.md` as the sibling structural reference. The document will cite source line ranges for the MCP server boundary, tool schemas, dispatch, parsing, storage, readiness, context, verification, apply, and bridge flows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Strict spec validation passes
- [x] Docs updated with completion evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Anchored architecture reference.

### Key Components
- **MCP boundary**: `mcp_server/index.ts`, `tool-schemas.ts`, and `tools/`.
- **Runtime layers**: handlers, structural indexer, tree-sitter parser, SQLite graph DB, readiness contract, context builder, and apply orchestrator.

### Data Flow
`scan -> query -> context -> verify -> apply` with readiness checks between read and mutation surfaces.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-code-graph/architecture.md` | Missing architecture reference | Create | File exists with anchors and citations |
| Source code | Runtime implementation | Unchanged | Git diff contains no source edits |
| New 014 packet | Documentation governance | Create | `validate.sh --strict` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed branch is `main`.
- [x] Confirmed `014-architecture-md` did not already exist.
- [x] Scaffolded Level 1 packet.

### Phase 2: Core Implementation
- [x] Read sk-doc architecture template shape.
- [x] Read sibling `system-spec-kit/architecture.md` structure.
- [x] Read system-code-graph MCP, tool schema, dispatcher, storage, readiness, parser, context, bridge, and apply sources.
- [x] Created `.opencode/skills/system-code-graph/architecture.md`.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Stage the architecture doc and new packet.
- [x] Commit documentation-only changes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | New Level 1 packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
| Diff review | Documentation-only scope | `git diff --stat`, `git diff --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc template | Internal | Green | Needed for anchored structure |
| system-code-graph source | Internal | Green | Needed for citation-backed claims |
| spec-kit validator | Internal | Green | Needed for completion check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails in a way that cannot be fixed within this packet.
- **Procedure**: Leave changes unstaged with validation output, or revert only this new packet and the new architecture doc if explicitly asked.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
