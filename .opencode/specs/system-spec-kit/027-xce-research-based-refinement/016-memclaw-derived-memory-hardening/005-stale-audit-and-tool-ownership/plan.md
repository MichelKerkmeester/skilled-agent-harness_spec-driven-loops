---
title: "Implementation Plan: Phase 5: stale-audit-and-tool-ownership [template:level_1/plan.md]"
description: "Read-only audit comparing live memory_search exclusion predicates against an intended-exclusion policy, plus a derived tool-ownership lint over TOOL_DEFINITIONS, both wired into health, /doctor, and pre-commit without changing recall behavior."
trigger_phrases:
  - "stale exclusion audit plan memory_search"
  - "derived tool ownership lint plan"
  - "intended vs silent exclusion policy"
  - "tool ownership drift pre-commit gate"
  - "read-only recall diagnostic health doctor"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-06T10:10:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 5 planning docs (plan only)"
    next_safe_action: "Implement T001 intended-exclusion policy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: stale-audit-and-tool-ownership

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node (Spec Kit Memory MCP server) |
| **Framework** | MCP server handlers; `/doctor` YAML-driven diagnostics; git pre-commit hook |
| **Storage** | SQLite + vector store (read-only access for the audit) |
| **Testing** | vitest |

### Overview
A read-only audit compares the live `memory_search` exclusion predicates (the forced `includeArchived=false` and the `importance_tier != 'deprecated'` FTS filter) against a declared intended-exclusion policy, then reports any silent hard-exclusion of relevant rows as a diagnostic — without touching the recall path. A second, independent piece derives the MCP tool-ownership/stability map from `TOOL_DEFINITIONS` and lints it for drift. Both surface through existing automation (startup health, `/doctor`, pre-commit) so there is no manual step and no new search flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only diagnostic + derived-artifact lint. Two independent observers sit beside existing code: one reads query predicates and compares them to a declared policy; the other reads `TOOL_DEFINITIONS` and compares the derived ownership map to its prior generated form. Neither mutates state.

### Key Components
- **Intended-exclusion policy**: A declared statement of which statuses are excluded on purpose (e.g., archived rows when `includeArchived=false`) versus which exclusions are silent and risk dropping relevant rows. Lives near `doctor_memory.yaml` staleness signals.
- **Stale-exclusion audit**: Read-only check in `memory-crud-health.ts` that reads the live predicates exposed by `hybrid-search.ts` and reports any exclusion not covered by the intended policy as a diagnostic.
- **Derived tool-ownership map**: Generated from `TOOL_DEFINITIONS` in `tool-schemas.ts` — one entry per tool with owner/stability, never hand-edited.
- **Tool-ownership drift lint**: Compares the freshly derived map against the committed map and fails on drift; runs in pre-commit and `/doctor skill-budget`.
- **Surfacing layer**: MCP response hints + health output for the audit; pre-commit gate + `/doctor` for the lint. No new search flags.

### Data Flow
At startup/health and `/doctor memory`, the audit reads the recall path's exclusion predicates and the intended-exclusion policy, classifies each exclusion as intended or silent, and emits silent ones as diagnostics on the existing response envelope. At commit (and `/doctor skill-budget`), the lint regenerates the ownership map from `TOOL_DEFINITIONS`, diffs it against the committed map, and hard-blocks on drift. Stored memory data and recall results are never modified on either path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hybrid-search.ts` recall predicates (`includeArchived=false`; `importance_tier != 'deprecated'`) | Policy producer — owns what gets excluded from recall | Unchanged (read-only); expose predicates for the audit to read | `rg -n "includeArchived|importance_tier|deprecated|archived" mcp_server/lib/search/hybrid-search.ts` confirms the exclusion sites |
| `memory-crud-health.ts` | Health consumer — observes server state | Update — run the audit and emit diagnostics | Audit appears in health output; recall path untouched |
| `doctor_memory.yaml` `staleness_signals` | Diagnostic policy registry | Update — register the hard-exclusion-risk signal | `rg -n "staleness_signals" doctor_memory.yaml`; new signal present |
| `TOOL_DEFINITIONS` in `tool-schemas.ts` | Ownership truth source | Unchanged as truth; derive map from it | `rg -n "TOOL_DEFINITIONS" mcp_server/tool-schemas.ts` (definition at the export); derived map matches it |
| pre-commit gate chain | Commit-time governance | Update — add blocking ownership-drift gate | New gate runs after existing advisory+blocking gates; drift fails commit |
| `hook_system.md` (docs) | Generated/maintained doc | Update — document new diagnostic surfaces | Doc references audit + lint; treated as output, not input to the lint |

Required inventories:
- Same-class producers (exclusion predicates): `rg -n "includeArchived|importance_tier|deprecated|archived" mcp_server/lib/search/hybrid-search.ts`.
- Consumers of the ownership source: `rg -n "TOOL_DEFINITIONS" . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: exclusion-source axis = {archived (`includeArchived`), deprecated-tier (FTS filter), other status}; classification axis = {intended, silent}. Required rows: each exclusion source classified under both an intended-policy hit and a miss.
- Algorithm invariant: the audit is observe-only — for every input it MUST leave both the recall result set and stored rows byte-identical. Adversarial cases: a deprecated row that is genuinely relevant (must flag as silent), an archived row excluded by explicit `includeArchived=false` (must classify as intended, not flagged).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Define the intended status-exclusion policy (which statuses are excluded on purpose vs at risk)
- [ ] Confirm `TOOL_DEFINITIONS` as the single ownership source and the derived-map shape

### Phase 2: Core Implementation
- [ ] Read-only stale-exclusion audit in health, classifying each exclusion as intended or silent
- [ ] Derived tool-ownership map generated from `TOOL_DEFINITIONS`
- [ ] Tool-ownership drift lint (pre-commit blocking + `/doctor skill-budget`)
- [ ] Surface audit diagnostics via response hints + `/doctor memory` (no new search flags)

### Phase 3: Verification
- [ ] Audit catches a synthetic silent-exclusion (deprecated-but-relevant) case
- [ ] Lint catches a synthetic ownership drift and blocks the commit
- [ ] Default `memory_search` results confirmed unchanged; docs updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Audit classification (intended vs silent exclusion); lint drift detection over a derived map | vitest |
| Integration | Audit emitted in health output; lint blocking in the pre-commit gate chain | vitest + hook dry-run |
| Manual | `/doctor memory` shows the exclusion diagnostic; `/doctor skill-budget` shows ownership drift | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None (independent phase) | Internal | Green | Phase can land anytime; no sibling phase blocks it |
| `TOOL_DEFINITIONS` (`tool-schemas.ts`) | Internal | Green | Already the normalized tool source; consumed read-only |
| `doctor_memory.yaml` staleness signals | Internal | Green | Already classifies staleness; extended, not replaced |
| pre-commit gate chain | Internal | Green | Already chains advisory + blocking gates; one gate appended |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Diagnostics produce noise, or the lint blocks commits incorrectly.
- **Procedure**: Remove the audit call from health and the lint gate from pre-commit. Because the phase is read-only and changes no recall behavior, removal is clean — there is no data migration or behavior change to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

