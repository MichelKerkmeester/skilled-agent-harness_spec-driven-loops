---
title: "Feature Specification: Phase 5: point-chat-sessions-at-authoring-card"
description: "Plain-language write requests can miss the spec authoring card when a chat session does not enter the spec-kit workflow. This phase adds pointers at scaffold output, the first-mutation notice and the system-spec-kit router, subject to a live route check."
trigger_phrases:
  - "point chat sessions at authoring card"
  - "phase 5 point chat sessions at authoring card"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: point-chat-sessions-at-authoring-card

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | main |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-name-file-in-plan-phase-lines |
| **Successor** | 006-repair-speckit-workflow-gates |
| **Handoff Criteria** | T001 to T003 print their expected counts, the three carrier changes pass their focused checks, and strict validation of this child reports RESULT: PASSED. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 5 of the Build the confirmed recommendations of the fresh-context plan-check research specification.

**Scope Boundary**: Add the authoring-card path to the scaffold next steps, the shared Gate-3 mutation notice and the system-spec-kit IMPLEMENT route. Edit only those carriers and the two existing focused tests listed below. T001 to T003 check from the files that each carrier delivers its text to a session that types no command, before any carrier is edited.

**Dependencies**:
- Phase 4, 004-name-file-in-plan-phase-lines, hands off the updated plan guidance before this phase starts.
- The existing canonical card remains at .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.

**Deliverables**:
- Standard and phase scaffold output points to the authoring card.
- The shared first-mutation notice points to the authoring card.
- A plain-language write intent routes through IMPLEMENT to the authoring card in a session that has opened system-spec-kit.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Natural-language chat turns that create or change files can bypass the /speckit command flow, so users may not be pointed to the spec authoring card. The three proposed pointers are create.sh next steps, the spec-gate mutation notice and the system-spec-kit IMPLEMENT route; the orchestrating session proposed them, and no second model has confirmed that they change what a chat session does. The review pass on this plan checked the carriers' files and the exact edits, not their effect on a live session.

### Purpose
Point chat sessions that create or change files to the canonical spec authoring card before implementation begins.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run by the review pass on 2026-11-11 from the repository root.

~~~text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a --keep flag to the rotate-logs script"}' --format json | python3 -c 'import json,sys; [print(r["skillId"], r["confidence"]) for r in json.load(sys.stdin)["data"]["recommendations"]]'
sk-code 0.82
sk-doc 0.82
mcp-tooling 0.82
~~~

The advisor does not recommend system-spec-kit for a plain write request. The first draft of this spec recorded a degraded run with no recommendations. This run was not degraded. The router carrier therefore reaches a session only once that session opens system-spec-kit for another reason, such as creating its spec folder.

<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the canonical card path to the standard and phase creation next steps in create.sh.
- Add one sentence naming the card to the shared GATE_3_MUTATION_NOTICE.
- Add six write verbs, "add", "change", "edit", "fix", "update" and "write", to the IMPLEMENT intent signals in ROUTER.md so matching requests load the card, and to the prose list of the same keywords in the same file. Phase 007 later moved the six verbs to a WRITE intent at weight 1 that loads only the card, so they no longer outscore PLAN.
- Add focused checks for the create output and the shared gate notice in their existing test files, and prove the IMPLEMENT match with a command against ROUTER.md.

### Out of Scope
- Change the contents of spec-authoring-card.md or its templates; this phase adds pointers to that existing guidance.
- Extend AGENTS.md or Devin-specific synchronization rules; the file-size issue belongs to a separate packet.
- Change the skill advisor so it recommends system-spec-kit for a plain write. No evidence in this packet asks for it.
- Add a case to smart-router-measurement.vitest.ts. Its harness reads a fixture layout, `.skilled/skill/<name>`, and not the shipped `.skilled/skills/` tree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Modify | Add the canonical card path to standard and phase Next steps output. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | Modify | Assert that both scaffold paths print the card path. |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Modify | Add one card instruction sentence to GATE_3_MUTATION_NOTICE. |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | Modify | Update the exact expected mutation notice and keep the core behavior covered. |
| .skilled/skills/system-spec-kit/ROUTER.md | Modify | Add six write verbs to the IMPLEMENT keyword row and to the prose list of the same keywords; keep the existing card resource mapping. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Check, before any carrier edit, that each carrier delivers its text to a session that types no command. A carrier reaches such a session when a command the session runs prints the text, or a file the session is told to read holds it. | T001 prints 2 for the two scaffold output blocks. T002 prints 1 for the notice return and 7 for the adapters that load the gate core. T003 prints 1 for the skill's instruction to read ROUTER.md and records `system-spec-kit absent` for the advisor. |
| REQ-002 | The first unbound file mutation notice names the canonical spec authoring card in one direct sentence. | T009 prints the sentence as the last line of GATE_3_MUTATION_NOTICE, and T011 runs spec-gate-core.test.mjs with no failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Standard and phase creation output both identify the canonical card path. | T005 counts the card line twice in create.sh, and T008 runs scaffold-passes-its-own-gate.vitest.ts, whose two scaffold helpers throw when the card path is missing from the output. |
| REQ-004 | A plain-language write intent matches IMPLEMENT and the existing resource map includes the authoring card. | T012's command applies the router's own word-boundary rule to the measured prompt and prints `['add']`. T013's `check-card-sync.sh` run prints `PASS intent-IMPLEMENT` and ends with `CARD SYNC OK`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: T001 to T003 print their expected counts, and the advisor's result for the measured prompt is recorded.
- **SC-002**: Standard creation, phase creation and the first-mutation notice each surface the card path in their chat-facing output.
- **SC-003**: The measured plain-language write prompt matches an IMPLEMENT keyword under the router's word-boundary rule, and IMPLEMENT still loads the card.
- **SC-004**: The focused create, spec-gate and router checks pass, and strict validation of this child reports RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The canonical authoring card at .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md | If the path moves, each pointer becomes stale. | Keep the existing resource mapping and assert the exact path in the focused checks. |
| Risk | The top-level advisor does not select system-spec-kit for a plain chat write, so the ROUTER.md change is read only by a session that opens the skill for another reason. | High | The scaffold output and the mutation notice do not depend on the advisor and carry the card path on their own. T003 records the advisor result. Changing the advisor is out of scope. |
| Risk | Six common verbs make IMPLEMENT match more requests, and each match loads the IMPLEMENT resource set. | Medium | Keywords match on word boundaries, per `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:68-70`. How often the new verbs match a request that is not a write is unknown and listed as an open question. Phase 007 lowered the cost: the verbs now feed a WRITE intent at weight 1 that loads only the card. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A — this packet adds no request/response service or latency-sensitive runtime path.
- **NFR-P02**: N/A — this packet introduces no service throughput surface.

### Security
- **NFR-S01**: N/A — no authentication boundary or credential handling changes.
- **NFR-S02**: N/A — no persisted data, transport, or encryption behavior changes.

### Reliability
- **NFR-R01**: N/A — this packet adds no availability-managed service.
- **NFR-R02**: N/A — this packet changes no service error-rate surface.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A — no new prompt parser or empty-input handler is introduced; existing handling remains outside this packet.
- Maximum input: N/A — this packet adds no input-size limit or new prompt storage.
- Failure path: A reach check that prints another count blocks its task. A degraded advisor run prints no recommendations, which T003 reports as `system-spec-kit absent`, the same result as the measured run.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Five named files across three existing chat-facing surfaces; one runtime system. |
| Risk | 0/25 | No auth, API, persisted-data, configuration, or compatibility boundary changes. |
| Research | 15/20 | The advisor result is measured. Whether a live chat session opens system-spec-kit on a plain write is unknown and no task here measures it. |
| **Total** | **35/70** | **Level 2**; within the Level 2 range of 26–55. |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- UNKNOWN: Does a live chat session open system-spec-kit, and so read ROUTER.md, when the user asks for a plain write? The advisor does not recommend the skill for the measured prompt. No task in this phase measures a live session; that needs a traced chat run in its own packet.
- UNKNOWN: How often do the six new verbs match a request that is not a write? No task in this phase measures it. T012 measures only the one prompt in the Measured Behavior block.
- UNKNOWN: Does any test other than `spec-gate-core.test.mjs` pin the length or the bytes of the mutation notice? A search for the notice's last line found only the core and that test. T011 runs that test; a wider run is the review step's.

<!-- /ANCHOR:questions -->

---

