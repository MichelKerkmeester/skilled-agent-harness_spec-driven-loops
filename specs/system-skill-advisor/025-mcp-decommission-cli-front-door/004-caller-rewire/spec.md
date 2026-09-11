---
title: "Feature Specification: Phase 4: caller-rewire"
description: "Repoint the prompt hooks, the OpenCode plugin, the doctor routes and every instruction surface at the CLI while MCP still exists as a fallback"
trigger_phrases:
  - "advisor caller rewire"
  - "advisor hook rewire"
  - "doctor route rewire"
  - "advisor plugin cli"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: caller-rewire

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Removal is safe only when nothing calls what is being removed. This phase moves every caller onto the CLI front door while MCP is still registered, and proves after each move that the prompt-time routing brief still arrives in every runtime.

**Key Decisions**: Rewire before removal, with MCP live as the fallback throughout; instruction surfaces change with the code

**Critical Dependencies**: Phase 003's frozen CLI contract, and phase 001's caller list

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-cli-front-door-parity |
| **Successor** | 005-mcp-transport-removal |
| **Handoff Criteria** | No caller reaches the advisor through MCP, and the prompt brief still arrives in every runtime with MCP still registered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the skill advisor MCP decommission specification.

**Scope Boundary**: Callers only. The MCP surface stays registered and functional; phase 005 removes it.

**Dependencies**:
- Phase 001 for the complete caller list.
- Phase 003 for the frozen CLI contract the callers read against.

**Deliverables**:
- The Claude prompt hook on the CLI, with the brief still arriving.
- The pi prompt hook on the CLI, with the brief still arriving.
- The OpenCode plugin on the CLI, with its latency recorded.
- Doctor routes and allowed-tools lists naming CLI invocations.
- A caller sweep showing nothing reaches the advisor over MCP.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Callers reach the advisor three different ways today. The Claude hook imports the library in-process, the OpenCode plugin shells out through an MCP bridge, and the doctor routes name MCP tool ids in their allowed-tools lists. Two of those three break the moment the transport is removed, and the third is a second calling convention that every instruction surface has to describe. Moving them while MCP still answers means a mistake is recoverable; moving them after removal means a mistake is an outage on the prompt path.

### Purpose
Leave phase 005 with a transport that nothing calls, and prove the automatic routing behavior survived every individual move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Claude prompt hook, onto the CLI seam.
- The pi prompt hook, onto the CLI seam.
- The OpenCode plugin, off the MCP bridge and onto the CLI.
- Every doctor route and its allowed-tools list.
- Every skill and gate document that instructs a caller to use an MCP tool id.

### Out of Scope
- Deleting the MCP surface, the bridge or the registrations. Phase 005 owns all of it.
- Changing what the advisor recommends. The brief content must be identical before and after each move.
- The package rename. Phase 006 owns it, and doing both at once makes the rewire diff unreadable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Claude hook onto the CLI seam |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Pi hook onto the CLI seam |
| `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Promoted from fallback to the primary path |
| `.opencode/plugins/system-skill-advisor.js` | Modify | Plugin calls the CLI instead of the bridge |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Routes name CLI invocations |
| `.opencode/commands/doctor/update.md`, `speckit.md` | Modify | allowed-tools drop the MCP ids |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | Routing instructions name the CLI |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Claude prompt hook reaches the advisor only through the CLI, and the brief still arrives |
| REQ-002 | The pi prompt hook reaches the advisor only through the CLI, and the brief still arrives |
| REQ-003 | The OpenCode plugin reaches the advisor only through the CLI, with its latency recorded |
| REQ-004 | Every doctor route and allowed-tools list names a CLI invocation rather than an MCP tool id |
| REQ-005 | A sweep finds no caller reaching the advisor over MCP outside the server tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every caller from the phase 001 list is either rewired or recorded as needing no change |
| REQ-007 | A plugin latency breach is reported as a finding rather than worked around |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Session start in every runtime shows the routing brief while MCP is still registered.
- **SC-002**: The caller sweep is empty outside the server tree itself.
- **SC-003**: The brief content is identical before and after the rewire on a frozen prompt set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The brief silently stops arriving in one runtime | High | Prove the brief per runtime after each individual caller moves, not once at the end |
| Risk | Plugin spawn cost exceeds its budget | Medium | Record the latency; a breach is a reported finding, and the fallback decision belongs to the operator |
| Risk | An instruction surface updated without its code, or the reverse | Medium | Treat a route and its allowed-tools as a single change |
| Dependency | Phase 003 contract | Callers read fields it freezes | Do not rewire against an unfrozen contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No advisor call path gets slower than the phase 002 budget allows.

### Reliability
- **NFR-R01**: A failure in the advisor path degrades the same way it degrades today: the caller keeps working without a recommendation, and never blocks on one.

---

## 8. EDGE CASES

### Failure boundaries
- Daemon absent or not yet warm: the caller gets the documented retryable outcome, not a hang.
- Stale build output: the front door refuses with a readable message rather than serving an old answer.
- Concurrent callers: several runtimes holding sessions at once keep working, as they do today.

---

## 9. COMPLEXITY ASSESSMENT

Build phase. The risk is not in writing the code but in the blast radius: the advisor sits on the prompt path of every runtime, so a regression is visible on the next message.

---

## 12. OPEN QUESTIONS

- None open at authoring time beyond those the parent spec records; anything found during planning is raised there.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Goal**: See `goal.md` for the durable directive this phase executes against
- **Parent Goal**: See `../goal.md` for the packet directive that outranks it
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
