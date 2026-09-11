---
title: "Feature Specification: Phase 3: cli-front-door-parity"
description: "Make the daemon-backed CLI the complete documented front door for all nine capabilities, with a frozen JSON contract, a stable exit taxonomy and proven per-tool payload parity"
trigger_phrases:
  - "advisor cli front door"
  - "advisor cli parity"
  - "advisor exit taxonomy"
  - "advisor cli contract"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: cli-front-door-parity

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A CLI already reaches the daemon and its manifest already declares all nine capabilities. What it lacks is the standing of a front door: a frozen contract, a documented exit taxonomy, a warm path, and proof that its answers match the MCP surface tool by tool. This phase supplies all four while MCP is still live to compare against.

**Key Decisions**: Parity proven per tool on a frozen input set; the JSON contract frozen here and not changed later

**Critical Dependencies**: Phase 002's protocol contract and latency budget

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
| **Phase** | 3 of 8 |
| **Predecessor** | 002-daemon-transport-decision |
| **Successor** | 004-caller-rewire |
| **Handoff Criteria** | Each of the nine capabilities returns byte-equivalent payloads through the CLI and through the MCP surface on a frozen input set |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the skill advisor MCP decommission specification.

**Scope Boundary**: The CLI, its contract and its parity proof. No caller changes here; callers move in phase 004.

**Dependencies**:
- Phase 002 for the frozen socket protocol and the latency budget.
- The MCP surface stays live throughout, because parity needs a comparison target.

**Deliverables**:
- Nine CLI commands with documented argument shapes.
- A frozen, versioned JSON output contract.
- A documented exit taxonomy with a test per code.
- A parity harness comparing CLI and MCP payloads per tool on a frozen input set.
- The session warm path, implemented and measurable.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI works today but is not yet something the rest of the repository can be pointed at with confidence. Its output contract is not frozen, so a caller reading a field has no guarantee it survives. Its exit taxonomy exists in code but is not documented or tested per code. And nothing proves that what it returns equals what the MCP surface returns, which is the whole claim this packet rests on. Proving that after MCP is deleted is impossible, so it has to happen now.

### Purpose
Turn a working CLI into a front door that callers can depend on, with parity proven while both surfaces still exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A CLI command for each of the nine advisor and skill-graph capabilities, with a documented argument shape.
- A frozen and versioned JSON output contract naming every field callers may read.
- The exit taxonomy, documented, with a test for every code the CLI can return.
- A parity harness that compares CLI and MCP payloads per tool on a frozen input set.
- The session warm path chosen in phase 002, implemented and measurable.

### Out of Scope
- Changing any caller. Phase 004 owns that.
- Deleting anything. The MCP surface must stay live here.
- Changing what the tools compute. Parity means identical answers, so the handlers are untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` | Modify | Front-door contract, exit taxonomy, warm path |
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli-manifest.ts` | Modify | Argument shapes for all nine commands |
| `.opencode/bin/skill-advisor.cjs` | Modify | Shim behavior for the warm path and the exit taxonomy |
| `003-cli-front-door-parity/parity/` | Create | Frozen input set and harness output |
| `.opencode/skills/system-skill-advisor/references/` | Create | The CLI contract document |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the nine capabilities has a CLI command with a documented argument shape |
| REQ-002 | The parity harness compares CLI and MCP payloads per tool and reports zero differences outside a named allowlist |
| REQ-003 | The JSON output contract is frozen and versioned, naming every field a caller may read |
| REQ-004 | The exit taxonomy is documented with a test for every code the CLI can return |
| REQ-005 | The session warm path runs and its cost is measurable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Any allowlisted parity difference carries a written justification |
| REQ-007 | The contract document is specific enough that phase 004 rewires callers without reading the CLI source |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Nine of nine capabilities answer through the CLI at payload parity on the frozen input set.
- **SC-002**: Every exit code the CLI can return has a test that produces it.
- **SC-003**: The warm path cost is a recorded number, inside the phase 002 budget.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parity that passes on shallow inputs | High | Freeze an input set that exercises each tool's real branches, including error paths |
| Risk | A contract frozen too late to help phase 004 | Medium | The contract document is a deliverable of this phase, not of the rewire |
| Risk | Warm path that never fires in some runtime | Medium | Name the mechanism per runtime in phase 002, and prove it fires in each |
| Dependency | MCP surface still live | Parity has no target without it | Nothing is deleted before phase 005 |
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
