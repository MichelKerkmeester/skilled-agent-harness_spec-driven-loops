---
title: "Feature Specification: Command + agent template conformance"
description: "Make the sk-doc /create commands and the markdown agents pass validate_document.py: routers get numbered PURPOSE/INSTRUCTIONS sections; the agent detection bug and over-strict agent rule are reconciled to the real agent house style."
trigger_phrases:
  - "command agent template conformance"
  - "125 sk-doc phase 020"
  - "validate_document command agent align"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/020-command-agent-template-conformance"
    last_updated_at: "2026-07-07T14:31:04.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed agent detection+rule; routers via GPT-5.5"
    next_safe_action: "Verify routers, validate, commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
      - ".opencode/commands/create/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Feature Specification: Command + agent template conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `019-create-command-alignment/` |
| **Predecessor** | `019-create-command-alignment/` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc `/create` command routers and the `markdown` agents all fail `validate_document.py`. Two independent causes: (1) the routers are thin (un-numbered `Routing Assets`/`Execution Order`) and lack the numbered `purpose`+`instructions` sections the `command` type requires; (2) the `agent` type is unsatisfiable — its rule demands five sections that no agent in the repo carries, and a detection bug (`/agent/` vs the actual `/agents/`) means agent files are mis-typed as `readme`.

### Purpose
Make the sk-doc commands and agents "perfectly align" with the sk-doc templates — i.e. validate cleanly — via the operator-chosen hybrid: **commands adopt the sections** (numbered PURPOSE/INSTRUCTIONS), while the **agent side is fixed on the rules** (correct the detection bug and reconcile the over-strict `agent` rule to the real agent house style), since rewriting 24 agents to a structure none use is infeasible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Commands** (10 `/create` routers): insert `## 1. PURPOSE` and number the remaining headings, renaming `Execution Order`→`## N. INSTRUCTIONS`, so each passes the `command` type. Body content preserved verbatim.
- **Agent detection**: fix `detect_document_type` so `/agents/` (plural) files are typed `agent`, not `readme`.
- **Agent rule**: reconcile `template_rules.json` `agent.requiredSections` to `["core_workflow"]` (the section every agent carries) and move the four aspirational sections (`capability_scan`, `output_verification`, `anti_patterns`, `related_resources`) to `recommendedSections`.

### Out of Scope
- Non-sk-doc commands (doctor/deep/memory/etc.) — they share the same `command`-type gap but are owned by other skills.
- Rewriting the 24 agents' bodies (the operator chose the rules-side fix).
- The command router-generation template — a follow-up so future commands are generated numbered.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/create/*.md` (10 routers) | Update | Numbered PURPOSE/INSTRUCTIONS structure |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Update | Agent detection `/agent/`→`/agents/` |
| `.opencode/skills/sk-doc/shared/assets/template_rules.json` | Update | `agent.requiredSections` reconciled |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 sk-doc `/create` routers pass validate_document.py | Each prints VALID; each has numbered `purpose`+`instructions` sections |
| REQ-002 | All 24 agents pass validate_document.py as type `agent` | Detection returns `agent`; every agent has numbered `core_workflow`; 24/24 VALID |
| REQ-003 | The validator + rules stay valid + non-regressive | `py_compile` OK; JSON valid; no previously-passing doc type newly fails |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Router body content is preserved | Only headings numbered + PURPOSE added; tables/steps/`$ARGUMENTS` unchanged |
| REQ-005 | The agent-rule change is non-regressive | No previously-valid doc type newly fails; `core_workflow` stays required, ideals become recommended guidance |
| REQ-006 | The change is scoped to sk-doc-related surfaces | Only the 10 `/create` routers, `validate_document.py`, and `template_rules.json` change; other-skill commands are untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10/10 sk-doc `/create` routers VALID.
- **SC-002**: 24/24 agents VALID as type `agent`.
- **SC-003**: `validate.sh --strict` exit 0 for this folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relaxing `agent.requiredSections` weakens the rule | Less-strict agents | `core_workflow` is the genuine universal contract; the four ideals stay as recommended guidance |
| Risk | Detection `/agents/` mis-types nested files | Wrong type | Agent files sit directly under `/agents/`; asset/reference paths hit their own earlier checks |
| Dependency | GPT-5.5 router edits | Must preserve body | Fresh-agent verify + validate_document.py gate per router |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Non-sk-doc commands (doctor/deep/memory) still fail the `command` type; bringing them into conformance is a separate, other-skill-owned follow-up.
- The command router-generation template should emit numbered PURPOSE/INSTRUCTIONS so future commands are born conformant (follow-up).
<!-- /ANCHOR:questions -->
