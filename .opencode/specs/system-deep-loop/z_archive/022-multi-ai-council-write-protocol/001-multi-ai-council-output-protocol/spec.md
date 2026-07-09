---
title: "Feature Specification: Multi-AI Council Output Protocol"
description: "Introduce ai-council/ subfolder convention parallel to research/ and review/ for capturing multi-ai-council deliberation rounds, per-seat outputs, critiques, and the final synthesized plan. Lightweight: no dedicated skill folder."
trigger_phrases:
  - "ai-council"
  - "multi-ai-council subfolder"
  - "council output protocol"
  - "council deliberation rounds"
  - "council seat outputs"
  - "iterative council planning"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/001-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T11:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Refactored spec.md to canonical template structure"
    next_safe_action: "Run Phase 2 implementation"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/references/"
    session_dedup:
      fingerprint: "sha256:291209cb8da2544cd69d61368bb0902172eb8689f546d3c6c56c9defe237c0c1"
      session_id: "spec-080-author"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Where exactly should shared references live: system-spec-kit/references/multi-ai-council/ vs a top-level references path?"
      - "Does the validator need to recognize ai-council/ as a known subfolder, or is it free-form like scratch/?"
    answered_questions: []
---

# Feature Specification: Multi-AI Council Output Protocol

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- PHASE_LINKS: parent=../spec.md; successor=002-multi-ai-council-persistence -->

---

## EXECUTIVE SUMMARY

The `@multi-ai-council` agent today returns deliberation results inline to chat with no packet-level persistence, breaking parity with `@deep-research` (writes to `research/`) and `@deep-review` (writes to `review/`). This packet introduces the `ai-council/` subfolder convention so council outputs become first-class, audit-friendly packet artifacts that support iteration and resume. The convention stays lightweight: no skill folder, no slash command, no YAML workflow — just an agent body update plus 4 shared reference files.

**Key Decisions**: lightweight bound (no dedicated skill folder), folder layout mirrors research/ and review/ patterns.

**Critical Dependencies**: `.opencode/agents/multi-ai-council.md`, `validate.sh` validator, system-spec-kit references home.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Track** | `skilled-agent-orchestration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Council deliberation outputs are transient: they return inline to chat and any intermediate seat outputs land in unstructured `scratch/` files. There is no parity with the deep skills, no per-round retrieval, no resume support, and no documented convention for "I dispatched a council on this packet, where did the output go?".

### Purpose
Define and roll out an `ai-council/` subfolder convention so council outputs are first-class packet artifacts that support iteration, audit, and resume — without building a full skill or new command surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Folder convention design (`ai-council/` subfolder layout)
- File shape canonical specs (config, strategy, state.jsonl, seats/, deliberations/, critiques/, council-report.md)
- Agent body update (`.opencode/agents/multi-ai-council.md`)
- Optional shared references under `system-spec-kit/references/multi-ai-council/`
- Validator awareness (treat `ai-council/` as known optional subfolder)
- Plan + tasks + checklist + ADRs for implementation

### Out of Scope
- Building a `multi-ai-council` skill folder — non-goal N1 (lightweight bound)
- Adding a `/speckit:council` slash command — non-goal N2
- Convergence math beyond 2/3 agreement
- Auto-dispatch policies — council remains user-invoked
- Cross-packet council aggregation
- Replacing `scratch/` for ad-hoc council notes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/multi-ai-council.md` | Modify | Add §Output Protocol, §Invocation Contract, §State Schema, §Convergence Signal |
| `.claude/agents/multi-ai-council.md` | Modify | Mirror agent body changes |
| `.codex/agents/multi-ai-council.toml` | Modify | Mirror agent body (sandbox-write adjusted) |
| `.gemini/agents/multi-ai-council.md` | Modify | Mirror agent body changes |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` | Create | Folder tree reference |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/seat-diversity-patterns.md` | Create | Lens combination guidance |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/convergence-signals.md` | Create | 2/3 rule + escape hatches |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` | Create | jsonl schema with examples |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` | Create | Regression test for validator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define `ai-council/` folder layout with canonical file shapes | spec.md §4 documents layout; agent body §Output Protocol mirrors it |
| REQ-002 | Update `@multi-ai-council` agent body to write outputs to `ai-council/` of the active spec folder | Agent body documents folder layout, invocation contract, state schema, convergence signal |
| REQ-003 | Mirror agent updates across `.claude/`, `.codex/`, `.gemini/` runtime directories | All 4 runtime mirrors agree on output protocol |
| REQ-004 | Validator does NOT flag `ai-council/` as unknown when present in a packet | `validate.sh --strict` passes with `ai-council/` populated |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Author 4 shared reference files under `system-spec-kit/references/multi-ai-council/` | folder-layout.md, seat-diversity-patterns.md, convergence-signals.md, state-format.md exist |
| REQ-006 | Iteration support: subsequent council runs append round-NNN without overwriting prior rounds | seats/round-001/ and round-002/ coexist after two dispatches |
| REQ-007 | Plan-only safety preserved: agent retains `write: deny` on source files; only writes to `ai-council/` artifacts | Agent permission block unchanged for source files |
| REQ-008 | Vitest case confirms validator does not flag `ai-council/` as unknown | New test passes in `system-spec-kit/scripts/tests/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An invocation of `@multi-ai-council` on packet X writes all output to `specs/.../X/ai-council/`, never to `scratch/` or chat-only.
- **SC-002**: A second invocation on the same packet appends round-002 without overwriting round-001.
- **SC-003**: After convergence, `council-report.md` exists with the canonical structure (composition, comparison, roadmap, confidence).
- **SC-004**: The agent body documents the folder layout + invocation contract in plain language.
- **SC-005**: `validate.sh --strict` accepts the new subfolder under any spec packet without false negatives.
- **SC-006**: No dedicated skill folder is created (only agent + system-spec-kit references).
- **SC-007**: Iteration support proven: resume from partial state log produces a coherent next round.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/agents/multi-ai-council.md` | Agent body is the primary writer of `ai-council/` | Keep agent body authoritative; reference docs are read-only support |
| Dependency | `validate.sh` validator | Validator must not flag `ai-council/` | Validator already accepts unknown subfolders; add regression test |
| Risk | Agent body bloat as council logic grows | Med | Hard cap at ~750 LOC; spill detail to references when crossed |
| Risk | State.jsonl format drift across runs | Med | Document schema in references; convention-only validation for v1 |
| Risk | Iteration support tempts feature creep toward a deep-skill clone | High | Explicit non-goal N1; ADR documents the lightweight bound |
| Risk | Per-round folders clutter packets that only run council once | Low | Single-round dispatch produces only `round-001/` + `council-report.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Council dispatch round-trip <5 minutes for 3 seats at default models.
- **NFR-P02**: Validator overhead for `ai-council/` recognition <10ms per packet.

### Security
- **NFR-S01**: Agent retains `write: deny` on source files. Only writes are inside `ai-council/`.
- **NFR-S02**: State.jsonl never contains secrets; seat outputs sanitized of credentials before write.

### Reliability
- **NFR-R01**: Resume after interruption: agent re-reads state.jsonl and continues from last completed event.
- **NFR-R02**: Failed seat dispatch does not corrupt the packet; partial round is recoverable from state log.

---

## 8. EDGE CASES

### Data Boundaries
- Empty packet: agent creates `ai-council/` skeleton on first dispatch.
- Packet already running deep-research: `ai-council/` namespaced separately, no collision.
- Maximum seats: capped at 3 per round (per existing agent guidance).

### Error Scenarios
- Seat dispatch timeout: agent records `seat_returned status:timeout` in state.jsonl, continues with N>=2 surviving seats.
- All seats fail: agent reports failure, does not fabricate council-report.md.
- Convergence not reached after max_rounds: agent emits `council_complete` with `convergence:false` and recommends user decision.

### State Transitions
- Mid-round interruption: state.jsonl is append-only; resume reads last event and continues.
- User aborts mid-round: agent leaves partial state; next dispatch detects and offers resume vs restart.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: ~10, LOC: ~800, Systems: agent + validator + references |
| Risk | 8/25 | Auth: N, API: N, Breaking: N (new convention only) |
| Research | 5/20 | Investigation: minimal — pattern mirrors existing deep skills |
| Multi-Agent | 6/15 | Workstreams: 3 (agent body, references, validator) |
| Coordination | 5/15 | Dependencies: 4-runtime mirror sync |
| **Total** | **36/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Agent body grows past 750 LOC | M | M | Spill to references; track LOC in checklist P2-1 |
| R-002 | Validator regression: false positive on new subfolder | M | L | Add vitest regression test |
| R-003 | 4-runtime mirror desync | H | M | Mirror sync is mandatory (REQ-003); regression test validates parity |
| R-004 | Iteration support creeps into deep-skill clone | H | L | Explicit non-goal N1; ADR-001 documents bound |
| R-005 | State.jsonl schema drift across runs | M | M | Document in references; convention-only for v1 |

---

## 11. USER STORIES

### US-001: Audit a council deliberation (Priority: P0)

**As a** spec-folder maintainer, **I want** to retrieve the seat outputs and synthesized plan from a prior council dispatch, **so that** I can audit the reasoning and feed the plan into an implementation packet.

**Acceptance Criteria**:
1. Given a packet where `@multi-ai-council` ran once, When I open `<packet>/ai-council/council-report.md`, Then I see the canonical structure with composition table, comparison, roadmap, and confidence score.
2. Given the same packet, When I open `<packet>/ai-council/seats/round-001/`, Then I see one file per dispatched seat with the verbatim plan output.

### US-002: Iterate on a prior council (Priority: P1)

**As a** maintainer, **I want** to dispatch the council a second time on the same packet without losing round-001 artifacts, **so that** I can iterate on the plan with new seats or refined critique.

**Acceptance Criteria**:
1. Given a packet with `ai-council/seats/round-001/` populated, When I dispatch `@multi-ai-council` again, Then `seats/round-002/` appears alongside, round-001 untouched, state.jsonl appends.
2. Given convergence at round-002, When the agent writes `council-report.md`, Then the report supersedes the round-001 report in place (not appended).

---

## 12. OPEN QUESTIONS

- Should `ai-council/` validation be added to `validate.sh --strict`, or kept fully free-form (like `scratch/`)? Current preference: free-form, but document expected layout.
- Where do shared references live: `system-spec-kit/references/multi-ai-council/` or a more general location? Current preference: under system-spec-kit.
- Should `ai-council-state.jsonl` schema be enforced by a tiny validator, or by convention only? Current preference: convention only for v1.
- Should the agent emit a memory save on council completion (like deep-skills do)? Current preference: yes, with a templated continuity payload.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
