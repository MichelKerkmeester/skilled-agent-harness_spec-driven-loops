---
title: "Implementation Plan: Indexer Surface Investigation"
description: "Research-only plan for mapping retrieval/indexer surfaces across the 016 embedder umbrella."
trigger_phrases:
  - "indexer surface investigation plan"
  - "016 retrieval surface plan"
  - "ollama bge promotion indexer plan"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation"
    last_updated_at: "2026-05-22T16:19:13Z"
    last_updated_by: "codex"
    recent_action: "Added Level 1 plan for strict validation."
    next_safe_action: "Keep research packet closed; no implementation action."
    blockers: []
    key_files:
      - "research.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0010010010010010010010010010010010010010010010010010010010010012"
      session_id: "001-indexer-surface-investigation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Research-only packet; no code changes or benchmarks."
---
# Implementation Plan: Indexer Surface Investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research packet |
| **Framework** | system-spec-kit Level 1 docs |
| **Storage** | Spec folder only |
| **Testing** | Strict spec validation |

### Overview
Map each retrieval or dispatch surface to the indexer it uses, the content type it indexes, and the embedder tier involved. The research output is `research.md`; this packet does not change runtime behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent arc and research scope are identified.
- [x] Consumer systems are listed in `spec.md`.
- [x] Research output path is `research.md`.

### Definition of Done
- [x] `research.md` contains a headline mapping table.
- [x] Mismatches and sub-phase implications are documented.
- [x] Level 1 docs exist for strict validation.
- [x] Strict validation passes after the parent rename.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research-only documentation packet. Evidence is gathered from existing agent, command, skill, and MCP configuration files.

### Key Components
- **Surface inventory**: consumer agents, commands, skills, and MCP tools.
- **Indexer classification**: CocoIndex, mk-spec-memory, Code Graph, Skill Advisor, or none.
- **Implication notes**: follow-on scope guidance for sibling phases in the arc.

### Data Flow
1. Read consumer definitions and command workflows.
2. Identify retrieval calls and indexer ownership.
3. Classify indexed content as code, text, structural graph, or none.
4. Record findings and implications in `research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `spec.md`, metadata files, and the parent arc.
- [x] Confirm the packet is research-only.

### Phase 2: Research
- [x] Inspect consumer agents, commands, skills, and MCP config.
- [x] Record per-system retrieval and embedder evidence.

### Phase 3: Documentation and Verification
- [x] Write `research.md`.
- [x] Add missing Level 1 docs for validation completeness.
- [x] Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source review | Evidence paths in `research.md` | Manual file reads |
| Scope validation | No code or behavior changes | Manual file-scope check |
| Spec validation | Required docs and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Agent and command definitions | Internal docs | Green | Retrieval surface mapping would be incomplete |
| Skill and MCP configuration | Internal docs/code references | Green | Embedder ownership would be ambiguous |
| system-spec-kit validator | Internal tool | Green | Completion cannot be claimed without PASS |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet is documentation-only. Rollback is restoring the prior spec docs or correcting metadata paths. No code, tests, model settings, or runtime state changed.
<!-- /ANCHOR:rollback -->
