---
title: "Feature Specification: Phase 2: cli-jev skill packet"
description: "The hub needs a packet that tells a dispatcher what a Jev judgment is, what it is not, and which command shapes the hub will refuse — otherwise the mode is a binary name and its contract lives only in whoever read the source."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/002-cli-jev-skill-packet"
    last_updated_at: "2026-09-20T10:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase specification authored at closeout from the authored packet"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-002-cli-jev-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: cli-jev skill packet

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/002-cli-jev-skill-packet` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-jev-contract-research-and-pin |
| **Successor** | 003-hub-mode-registration |
| **Handoff Criteria** | The packet declares eight rules whose checks exist; the references carry the pinned contract; the mode's tool surface cannot write |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract specification.

**Scope Boundary**: Authoring the packet. Registration in the hub's routing files, the dispatch-library checks and the compiled-routing wiring belong to phase 003; the feature catalog and the scenario files belong to phase 004.

**Dependencies**:
- Phase 001's pinned contract and evidence tags
- The hub's existing mode-packet layout, which this packet follows

**Deliverables**:
- `SKILL.md` with eight declared hard rules, each naming the check that enforces it
- Four contract references, the question-shaping card, the README, the changelog and the benchmark baseline
- The playbook root that phase 004's scenario files hang from

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hub routes to executables whose contracts live in their own documentation. For Jev that documentation would be the only account of a mode that behaves unlike every other mode in the hub: it returns a value instead of running a session, it must never be asked to edit anything, and its command line has failure modes — an open stdin, a single-option choice, `--value` on a batch — that produce a hang or a meaningless answer rather than an error anyone would notice in time.

### Purpose

Write the packet so the distinction survives contact with a caller: what the mode is, what it is not, which command shapes are refused and why, and where the pinned contract lives. Declare the rules together with the checks that enforce them, so the packet's claims and the hook's behavior can be compared rather than trusted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The transport contract: purpose, non-negotiables, tool surface, references, success criteria
- Eight hard rules, each with a check id and a severity
- Four references: CLI contract, providers and models, integration patterns, MCP surface
- The question-shaping card, the README, the changelog entry and the benchmark baseline

### Out of Scope

- Hub registration, dispatch-library checks and compiled-routing wiring (phase 003)
- The feature catalog and the manual-testing-playbook scenario files (phase 004)
- Any change to the seven existing modes' packets

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-jev/SKILL.md` | Create | Transport contract and the eight hard rules |
| `.skilled/skills/cli-external-orchestration/cli-jev/README.md` | Create | Mode overview |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/cli-reference.md` | Create | CLI contract |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/providers-and-models.md` | Create | Providers, key resolution, translation |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/integration-patterns.md` | Create | Patterns and anti-patterns |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/mcp-server.md` | Create | MCP surface and the operator step |
| `.skilled/skills/cli-external-orchestration/cli-jev/assets/question-shaping-card.md` | Create | How to write the question |
| `.skilled/skills/cli-external-orchestration/cli-jev/changelog/v1.0.0.0.md` | Create | First release entry |
| `.skilled/skills/cli-external-orchestration/cli-jev/benchmark/README.md` | Create | Baseline |
| `.skilled/skills/cli-external-orchestration/cli-jev/benchmark/reports/README.md` | Create | Report index |
| `.skilled/skills/cli-external-orchestration/cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Create | Playbook root |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet states the transport classification and the forbidden tool surface | The opening sections say value-not-action, and `Write`/`Edit`/`Task` are forbidden |
| REQ-002 | Every declared rule names an implemented check, with a severity that matches its consequence | All eight ids resolve; six block, two advise |
| REQ-003 | The references carry the pinned contract with evidence tags intact | Each reference versioned; claims trace to phase 001 probes |
| REQ-004 | The MCP surface is documented as an operator step, not an implied connection | The reference says no repository config carries the server |
| REQ-005 | The packet matches the hub's mode layout | `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/`, `changelog/` present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The two advisory rules explain which violation is legitimate | Both messages name the exception |
| REQ-007 | A reader can compose a valid command without reading the source | The CLI reference carries the state forms and the flag set |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The eight rules and the eight checks are the same eight, in both directions, under the existing CI guard
- **SC-002**: A dispatcher who reads only `SKILL.md` and `references/cli-reference.md` composes a command that passes the guard
- **SC-003**: Nothing in the packet invites a write, and the tool surface makes one impossible
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 evidence tags | A reference could restate a claim as observed | Every claim was traced back before the reference was written |
| Risk | A declared rule with no check | The packet reads as enforcement and provides none | The ids were resolved against the implemented registry before the phase closed |
| Risk | The packet reads as an executor | A caller asks it to edit files | The classification, the forbidden list and the opening framing all say otherwise |
| Risk | Reference frontmatter drift | The documentation gate fails on the packet | The version field is present on all four, and the gate was re-run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The packet documents an unauthenticated contract; the response-body claims are inherited from phase 001 already tagged as source-read.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The packet adds no runtime cost; it is loaded, not executed
- **NFR-P02**: The references are short enough to load on a first slice

### Security

- **NFR-S01**: No rule or reference instructs a reader to place a credential on a command line
- **NFR-S02**: The custom-endpoint warning states that the bearer key goes to the endpoint named

### Reliability

- **NFR-R01**: Every rule is enforceable by a predicate over the command line, so the guard's verdict never depends on intent
- **NFR-R02**: A rule whose violation is acceptable in some context advises instead of blocking
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8b. EDGE CASES

### Data Boundaries

- State omitted: the CLI reads stdin, which is why one rule refuses an unbounded dispatch
- Single-option choice: sent by the CLI, refused by the MCP server, refused earlier still by the guard

### Error Scenarios

- Missing binary: the availability rule refuses before anything else runs
- Inline key: advised against, because a harness may legitimately pass one and the reader is told why not to

### State Transitions

- Package upgrade: the references are versioned per packet release, so a re-pin is a new packet version rather than a silent edit
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Eleven documents, no executable code |
| Risk | 5/25 | Documentation only; the enforcement lands in phase 003 |
| Research | 10/20 | Requires phase 001's evidence but no new investigation |
| Multi-Agent | 2/15 | One workstream |
| Coordination | 4/15 | Consumes the previous phase's artifacts |
| **Total** | **29/100** | **Level 3 by the packet's declared level; the recommend-level scorer returned Level 2** |
<!-- /ANCHOR:complexity -->
