---
title: "Feature Specification: Phase 6: command-contract-structural"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "017-search-and-output-intelligence-implementation/006-command-contract-structural"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped /memory:search arg header + salience inversion; spec superseded"
    next_safe_action: "FOLLOW-UP: live A/B --command execute-rate run on Kimi/MiMo (cannot run here)"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-command-contract-structural"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to stop weak models dropping the query? -> compute ARGS_PRESENT/QUERY in shell, invert salience, gate the ask-path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: command-contract-structural

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-cosine-topn-reorder |
| **Successor** | 007-output-surface-parity |
| **Handoff Criteria** | §0 shell header resolves ARGS_PRESENT/QUERY; execute-path leads; arg echo equals QUERY |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the search-and-output-intelligence implementation: `/memory:search` command-contract structural hardening (recommendations #1/#2/#3/#7 / O1).

**Scope Boundary**: The `/memory:search` command contract and its presentation asset only. No lib/search code change - this is a slash-command markdown + shell-header change targeting weak instruction-followers (Kimi K2.7, MiMo v2.5 Pro).

**Dependencies**:
- The OpenCode/Claude slash-command renderer's `$ARGUMENTS` substitution behaviour (the §0 shell header joins argv).

**Deliverables**:
- A §0 `` !`…` `` shell block emitting deterministic `ARGS_PRESENT`/`QUERY` ground-truth lines before any model policy is read.
- Salience inversion: RETRIEVAL/ANALYSIS lead; the STARTUP ask-path is physically last and gated on `ARGS_PRESENT=false`.
- An imperative no-ask guard bound to the resolved values, plus an arg-echo self-correction rule (`MEMORY:SEARCH "<query>"` MUST equal `QUERY`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Weak instruction-followers (Kimi K2.7 always, MiMo v2.5 Pro intermittently) dropped the `/memory:search` query and fell back to the startup question even when invoked with a real query. The root cause was salience: the contract made "ask when `$ARGUMENTS` is empty" the first, most imperative instruction, forcing the model to actively negate an empty-guard to do its job.

### Purpose
Move the arg-presence branch out of model judgment into the shell, and re-order the contract so the execute-path is read first - so a populated query can never reach the ask-path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- §0 deterministic `ARGS_PRESENT`/`QUERY` shell-resolution header.
- Salience inversion (RETRIEVAL/ANALYSIS before the gated STARTUP section).
- Imperative no-ask guard + arg-echo self-correction rule.

### Out of Scope
- Any `lib/search/` code change - this is a command-contract/presentation change only.
- The live cross-model A/B execute-rate measurement - documented follow-up, not runnable here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/memory/search.md` | Modify | §0 ARGUMENT RESOLUTION shell header + no-ask guard; reorder so RETRIEVAL/ANALYSIS precede the gated STARTUP; bind arg-presence on `ARGS_PRESENT`/`QUERY` |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | Gate §1 Startup Question Policy behind `ARGS_PRESENT=false`; replace `$ARGUMENTS`-empty wording with resolved-flag wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Arg-presence must be resolved deterministically before the model reads policy | §0 shell header emits `ARGS_PRESENT`/`QUERY`; populated argv yields `ARGS_PRESENT=true` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A populated query must never reach the ask-path | STARTUP section physically last and gated on `ARGS_PRESENT=false`; presentation §1 gated the same way |
| REQ-003 | A dropped query must be self-correctable | Arg-echo rule: rendered `MEMORY:SEARCH "<query>"` MUST equal `QUERY`, else re-emit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `/memory:search "<query>"` invocation executes retrieval instead of falling back to the startup question.
- **SC-002**: The `$@` word-split caveat is handled - multi-word queries are joined into one `QUERY` string with embedded quotes escaped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Slash-command renderer `$ARGUMENTS` expansion | §0 header must join argv correctly | `bash -c` wrapper guarantees bash param-expansion regardless of outer shell |
| Risk | Real-world execute-rate lift on weak models is unmeasured | Med | Documented live A/B follow-up on Kimi/MiMo (cannot run here) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Shipped; see `implementation-summary.md`. The live A/B execute-rate run on Kimi/MiMo is a documented follow-up, not a blocking question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
