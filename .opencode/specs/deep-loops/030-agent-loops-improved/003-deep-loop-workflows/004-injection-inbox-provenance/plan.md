---
title: "Implementation Plan: Injection Inbox and Question Provenance Attribution"
description: "Documents the completed research inbox JSONL schema and question-origin propagation work."
trigger_phrases:
  - "injection inbox provenance"
  - "research inbox jsonl"
  - "question attribution badges"
  - "origin tracking open questions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/003-deep-loop-workflows/004-injection-inbox-provenance"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Injection Inbox and Question Provenance Attribution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-research reducer JavaScript, markdown strategy docs, JSONL state |
| **Framework** | `deep-loop-workflows` research state reducer and dashboard projection |
| **Storage** | `research/inbox.jsonl`, reducer state, `openQuestions`, and `resolvedQuestions` |
| **Testing** | Reducer injection checks, legacy markdown import checks, dashboard badge output |

### Overview
This completed work established `research/inbox.jsonl` as the canonical way to inject questions into a deep-research run. The reducer now preserves provenance on injected questions, carries `origin` through open and resolved question state, and treats direct markdown edits as a legacy import path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing direct markdown-edit path identified as provenance-losing.
- [x] Inbox schema fields defined in the completed spec.
- [x] Conflict resolution deferred to leaf 005 to keep schema work focused.

### Definition of Done
- [x] `research/inbox.jsonl` schema includes all provenance fields.
- [x] Reducer reads inbox records on each reduce step.
- [x] `origin` propagates into open and resolved question records.
- [x] Dashboard attribution badges render from `origin`.
- [x] Direct markdown edits become `origin:"legacy-import"` without throwing.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Append-only inbox plus reducer-owned projection: external inputs enter through JSONL records and the reducer turns them into question state with durable provenance.

### Key Components
- **`research/inbox.jsonl`**: Canonical injection surface with `id`, `text`, `source`, `origin`, `injectedAtIteration`, and `promotedQuestionId`.
- **`reduce-state.cjs`**: Reads inbox records and propagates origin metadata into question state.
- **`deep_research_strategy.md`**: Documents inbox usage and preserves the legacy markdown import path.
- **Dashboard output**: Renders attribution badges per open question from the origin field.

### Data Flow
An operator or agent appends an inbox record, the reducer reads the record during the next reduce step, and the question appears in `openQuestions` with its origin metadata. Legacy direct edits are imported with `legacy-import` origin and a deprecation warning instead of failing the run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Inbox JSONL | Canonical question-injection input | Define provenance record schema | Record with `origin:"angle-bank"` imports correctly |
| Reducer | Owns state transition into questions | Read inbox and carry origin fields | `openQuestions` includes origin after reduce |
| Strategy doc | Operator guidance surface | Document inbox path and legacy import | Direct markdown edit logs warning |
| Dashboard | Displays open questions | Render origin badges | Badge appears for each imported origin |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and identify inbox provenance fields.
- [x] Confirm conflict handling is deferred to leaf 005.
- [x] Identify reducer and strategy docs as implementation surfaces.

### Phase 2: Core Implementation
- [x] Define `research/inbox.jsonl` record fields.
- [x] Add reducer inbox reading on each reduce step.
- [x] Propagate `origin` into open and resolved questions.
- [x] Add dashboard attribution badges from origin.
- [x] Document direct markdown edits as `legacy-import`.

### Phase 3: Verification
- [x] Verify an `angle-bank` inbox question appears with matching origin.
- [x] Verify direct markdown edits do not throw and produce `legacy-import`.
- [x] Verify attribution badges appear in dashboard output.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reducer test | Inbox record to `openQuestions` with origin | Reducer run fixture |
| Legacy path | Direct `key-questions` markdown edit | Reducer run fixture |
| Dashboard output | Attribution badges per open question | Output inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| No hard predecessor | Internal | Complete | Schema work can stand alone |
| `005-anchor-ownership-conflict-adr` | Successor | Complete | Conflict resolution depends on this schema staying stable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Inbox records fail to import, origin metadata is lost, or legacy markdown edits break existing sessions.
- **Procedure**: Revert reducer inbox handling and strategy-doc guidance, then temporarily restore direct markdown editing as the only injection surface until provenance import is corrected.
<!-- /ANCHOR:rollback -->
