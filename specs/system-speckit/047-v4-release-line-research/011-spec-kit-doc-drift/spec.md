---
title: "Feature Specification: Phase 11: spec-kit-doc-drift"
description: "Four spec-kit documents promise behaviour the code does not have: a scope-adherence check, a three-tier save router, a truthy spec-gate kill switch and an unconditional phase-parent anchor pass. This phase makes each say what the code does."
trigger_phrases:
  - "spec kit doc drift"
  - "phase 11 spec kit doc drift"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: spec-kit-doc-drift

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 17 |
| **Predecessor** | 010-validate-and-retrieval-exit-honesty |
| **Successor** | 012-hook-guards-and-audit-log |
| **Handoff Criteria** | Each touched doc states only behaviour a command or code line confirms |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V38 and V39, the V30 note text, child finding 001 `f-iter019-001`, and the strict-mode sentence phase 010 made false.

**Dependencies**:
- Phase 010: its strict SOURCE_TAGS change makes the "warn-only rules never fail" sentence in three speckit commands false.

**Deliverables**:
- Release notes and references that describe the code as it is.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.0 note says the completion gate refuses a packet whose changed files fall outside its spec, driven by `SYSTEM_SCOPE_CHANGED_FILES`; no rule or reader exists. `save-workflow.md` documents a three-tier save router with an LLM endpoint, a pending-route refusal and a `routeAs` override; the save writer has none of it. `ENV-REFERENCE.md` documents `SYSTEM_SPEC_GATE_DISABLED` as accepting `true`, `yes` or `on`, but the gate core compares it to the exact string `1`. The v4.0.0.5 note describes the stricter `ANCHORS_VALID` without the phase-parent exemption the code keeps. The speckit plan, implement and complete commands say warn-only rules never fail a strict run, which phase 010 made false for a SOURCE_TAGS check that cannot run.

### Purpose
An operator who reads these documents gets the behaviour they describe.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "SCOPE_ADHERENCE|SYSTEM_SCOPE_CHANGED_FILES|SYSTEM_SCOPE_BASE" .skilled -g '!**/dist/**' -g '!**/changelog/**'
(no output)

$ rg -n "routeAs|mergeModeHint|LLM_REFORMULATION_ENDPOINT|pending-route" .skilled/skills/system-spec-kit/runtime -g '!**/dist/**' -g '!**/tests/**'
runtime/cli/continuity/generate-context.ts:168:  - Top-level routeAs / mergeModeHint are accepted for compatibility with routed save workflows

$ rg -n "SYSTEM_SPEC_GATE_DISABLED" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
76:| `SYSTEM_SPEC_GATE_DISABLED` | unset (enabled) | truthy disable flag | ...
248:| `SYSTEM_SPEC_GATE_DISABLED` | unset (enabled) | truthy disable flag | When set to a truthy value (`1`, `true`, `yes` or `on`), ...

$ sed -n 975,976p .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts
  if (level === 'phase' && isPhaseParent(folder)) {
    return entry('ANCHORS_VALID', 'pass', 'Phase parent lean document set accepted');

$ sed -n 110,111p .skilled/commands/speckit/plan.md
Its `validate.sh --strict` calls also run warn-only rules.
Those rules never fail the run.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the scope-adherence claim in the v4.0.0.0 note with what shipped (V38).
- Rewrite the save-router section of `save-workflow.md` to the code: the eight categories as the vocabulary validation uses, no tiers, no endpoint, no refusal file, `routeAs` accepted and ignored (V39).
- Say in the v4.0.0.5 note that a phase parent stays exempt from `ANCHORS_VALID` (V30 note text).
- Document `SYSTEM_SPEC_GATE_DISABLED` as `1` in both `ENV-REFERENCE.md` rows and say why the other truthy words are unreliable (001 `f-iter019-001`).
- Add the strict SOURCE_TAGS exception to the warn-only sentence in the speckit plan, implement and complete commands.

### Out of Scope
- Building a scope-adherence rule or a save router - the finding is the promise, and the fix the synthesis names is the text.
- Widening the gate core's parser - one documented value is enough, and changing a kill switch's grammar is a behaviour change no verified finding asks for.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/v4.0.0.0.md` | Modify | Scope-adherence paragraph |
| `.skilled/changelog/skilled/v4.0.0.5.md` | Modify | Phase-parent exemption sentence |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Save-router section |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Two `SYSTEM_SPEC_GATE_DISABLED` rows |
| `.skilled/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modify | Strict exception sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -n "SYSTEM_SCOPE_CHANGED_FILES|LLM_REFORMULATION_ENDPOINT|pending-route" .skilled/changelog/skilled/v4.0.0.0.md .skilled/skills/system-spec-kit/references/memory/save-workflow.md` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The v4.0.0.5 note names the phase-parent exemption from `ANCHORS_VALID`. |
| REQ-003 | Both `SYSTEM_SPEC_GATE_DISABLED` rows in `ENV-REFERENCE.md` name `1` as the value and no longer promise `true`, `yes` or `on`; the env parser test suite still passes. |
| REQ-004 | The plan, implement and complete commands name the strict SOURCE_TAGS exception. |
| REQ-005 | Every touched doc passes sk-doc `validate_document.py`, or holds its baseline result. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every claim changed by this phase cites a command or code line in `implementation-summary.md`.
- **SC-002**: No touched doc loses a passing `validate_document.py` result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/doctor:env` parser reads ENV-REFERENCE rows | A malformed row stops it | Keep the column shape; rerun the env parser tests |
| Risk | Editing released notes | Low | Change only the false sentences; the version history keeps the rest |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation only.

### Security
- **NFR-S01**: The kill-switch docs name the one value that reliably disables the gate.

### Reliability
- **NFR-R01**: Every ENV-REFERENCE row keeps its column count.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A, no runtime input.
- Maximum input: N/A.
- Failure path: an operator who sets `SYSTEM_SPEC_GATE_DISABLED=true` is told it may not disable the gate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Seven docs, prose only |
| Risk | 5/25 | One machine-read file |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The doc-or-code choice for each finding is in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
