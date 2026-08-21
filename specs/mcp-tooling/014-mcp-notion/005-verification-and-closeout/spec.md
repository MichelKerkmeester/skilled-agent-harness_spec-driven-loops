---
title: "Phase 005: mcp-notion verification + closeout"
description: "Author the mcp-notion manual-testing playbook and setup scripts (doctor.sh, install.sh), run validate_document.py across the mode, confirm advisor routing and hub metadata, and reconcile packet completion."
trigger_phrases:
  - "mcp-notion verification"
  - "mcp-notion playbook doctor"
  - "notion mode closeout"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/005-verification-and-closeout"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Whole-mode validate 0 issues; doctor.sh green; packet continuity reconciled"
    next_safe_action: "Defer live Notion API round-trip smoke to the operator"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-005-verification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 005: mcp-notion verification + closeout

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-hub-registration-and-advisor |
| **Successor** | None |
| **Handoff Criteria** | All 14 mcp-notion docs pass `validate_document.py` at 0 issues; `doctor.sh` runs green (exit 0, read-only); cross-doc headline numbers agree across the mode; the 014 parent + all five phase-children continuity blocks are reconciled to shipped state; closeout artifacts (playbook, install.sh, doctor.sh, scripts/README.md, changelog) authored. Live Notion API round-trip smoke deferred to the operator (needs a real `notion_NOTION_TOKEN`). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the `mcp-notion` mode build — the final phase. Phase 4 registered the mode across the hub and advisor; this phase proves the mode is usable and closes the packet with reconciled completion metadata.

**Scope Boundary**: Closeout authoring + verification only. Authors the manual-testing playbook, the read-only setup scripts, and the changelog; runs whole-mode document validation and read-only diagnostics; sweeps cross-doc consistency; reconciles completion metadata across the packet. It produces closeout artifacts and packet docs — NO new runtime code and no further hub edits.

**Dependencies**:
- All prior phases (001–004) complete: the package exists, docs are authored, and the mode is registered + advisor-rebuilt.
- `validate_document.py`, Node 18+/npx (for `doctor.sh`/`install.sh` probes), the registered Code Mode `notion` manual in `.utcp_config.json`.
- A live Notion workspace + real `notion_NOTION_TOKEN` for the live API round-trip smoke — if absent, the smoke is deferred to the operator.

**Deliverables**:
- `manual-testing-playbook/manual-testing-playbook.md`, `scripts/install.sh`, `scripts/doctor.sh`, `scripts/README.md`, `changelog/v0.1.0.0.md`, whole-mode validation evidence, reconciled packet docs.

**Changelog**:
- This phase refreshes `changelog/v0.1.0.0.md` under the mode as the closeout entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 4 the mode is registered but unproven end-to-end: nothing has confirmed that every mode doc validates, that a fresh operator can install and diagnose the mode without touching a real workspace, that the mode's headline numbers agree across all docs, or that the packet's completion metadata is internally consistent. Shipping without these steps risks a mode that looks registered but has no repeatable test path — or packet docs that claim conflicting completion states.

### Purpose
Author the closeout artifacts (a manual-testing playbook plus read-only install/doctor scripts and a changelog), validate every mode doc, sweep cross-doc consistency, and reconcile completion metadata across every packet doc so `mcp-notion` ships closed and independently verifiable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `manual-testing-playbook/manual-testing-playbook.md` (11 scenarios: 6 MCP round-trips via Code Mode, 1 API-gap direct call, 1 backend-selection, 3 auth/failure — all read-only or scratch-safe with reversible archive-to-trash cleanup).
- Author read-only `scripts/install.sh` (checks Node 18+/npx, prints the Code Mode manual snippet + the `notion_NOTION_TOKEN` env key, writes no config) and `scripts/doctor.sh` (Node/npx, whether the `notion` manual is registered, whether `notion_NOTION_TOKEN` is set — presence only, never the value), plus `scripts/README.md`.
- Author `changelog/v0.1.0.0.md`.
- Run `validate_document.py` across all 14 mode docs (target: 0 issues).
- Run `doctor.sh` (exit 0, read-only).
- Sweep cross-doc consistency (headline numbers agree across the mode).
- Reconcile completion metadata across the 014 parent + all five phase-children continuity blocks.

### Out of Scope
- New runtime or tool code - [everything ships in Phases 002–004].
- Further hub/advisor edits - [Phase 4 owns registration].
- A live Notion API round-trip smoke - [deferred to the operator; needs a real `notion_NOTION_TOKEN`].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-notion/manual-testing-playbook/manual-testing-playbook.md` | Create | 11-scenario read-only / scratch-safe playbook |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh` | Create | Read-only install helper (prints snippet + env key) |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/doctor.sh` | Create | Read-only diagnostics (Node/npx, manual, token presence) |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/README.md` | Create | Scripts usage notes |
| `.opencode/skills/mcp-tooling/mcp-notion/changelog/v0.1.0.0.md` | Create | Closeout changelog entry |
| `.../005-verification-and-closeout/implementation-summary.md` | Create | Verification evidence + final state |
| `specs/mcp-tooling/014-mcp-notion/**/{spec,plan,tasks,implementation-summary}.md` | Modify | Reconcile completion metadata so states do not conflict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every mcp-notion doc validates | All 14 mode docs pass `validate_document.py` at 0 issues |
| REQ-002 | The mode is installable + diagnosable without a real workspace | `doctor.sh` runs green (exit 0, read-only): confirms Node/npx, the registered Code Mode manual, and reports `notion_NOTION_TOKEN` presence only; `install.sh` writes no config |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cross-doc consistency + packet closeout | Headline numbers agree across the mode (24 tools / 6 domains / 22 property types / 3 req/s / API 2025-09-03 + 2026-03-11); 014 parent + all five phase-children continuity blocks reconciled to shipped state |
| REQ-004 | Live Notion API round-trip smoke, or deferred to the operator | A live round-trip succeeds; OR it is deferred citing the missing real `notion_NOTION_TOKEN` (build + registration already independently verified) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 mode docs pass `validate_document.py` at 0 issues.
- **SC-002**: `doctor.sh` runs green (exit 0, read-only) and a fresh operator can install/diagnose the mode without a live workspace.
- **SC-003**: Cross-doc headline numbers agree; the 014 parent and all five phase-children continuity blocks are reconciled; closeout artifacts and `implementation-summary.md` are written.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live Notion workspace + real `notion_NOTION_TOKEN` | No live API smoke without them | Defer the live round-trip to the operator; build + registration are independently verified |
| Risk | Playbook mutates a real workspace | Destructive test steps | Keep every scenario read-only or scratch-safe with reversible archive-to-trash cleanup; never destructive on a real workspace |
| Risk | Completion-metadata drift across docs | Packet claims conflicting states | Reconcile the 014 parent + all five phase-children in one pass before closeout |
| Risk | Headline numbers drift between docs | Docs disagree on tool/property counts | Sweep cross-doc consistency (24 tools / 6 domains / 22 property types / 3 req/s / API versions) before closeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is a live Notion workspace + real `notion_NOTION_TOKEN` available in-env for the API round-trip smoke, or is operator-deferred the outcome? (Resolved: operator-deferred.)
- Should the playbook's scratch-safe scenarios run against a throwaway workspace in CI, or stay operator-run?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
