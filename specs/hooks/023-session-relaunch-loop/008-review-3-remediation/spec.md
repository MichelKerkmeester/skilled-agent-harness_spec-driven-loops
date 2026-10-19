---
title: "Feature Specification: Phase 8: review-3-remediation"
description: "The third deep review of the session relaunch loop found two records that claimed more than their evidence and thirteen smaller defects in code, tests and docs. This phase fixes all fifteen."
trigger_phrases:
  - "review 3 remediation"
  - "phase 8 review 3 remediation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: review-3-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/148-session-relaunch-deep-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-handoff-gate-exemptions |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch suites pass with no failures and recursive strict validation of the parent prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Session relaunch loop specification.

**Scope Boundary**: The fifteen findings in `../review/review-report.md`, each confirmed against the files before this phase was opened. The merged registry is `../review/deep-review-findings-registry.json`. No new runtime, trigger or live feature.

**Dependencies**:
- `../review/review-report.md`, the third fan-out deep review (DeepSeek V4.1 Flash max and Luna max fast, five iterations each), run after phase 007.

**Deliverables**:
- Five code fixes in `.skilled/hooks/session-relaunch/lib/`, each with a test that fails on the old code.
- Spec-folder coverage for the Claude and Codex nudge adapters.
- Corrected command, environment and packet records.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The third review returned CONDITIONAL with 2 P1 and 13 P2 findings. The two P1s are records that claim more than their evidence: phase 007 cites a run log that Git ignores, so it never reached the repository, and phase 002 marks AC-003 Met while its evidence shows the literal smoke failing. The P2s are five small code defects in the relaunch core, nudge and killer, two adapter test gaps, and drift in the command doc, the environment reference and the parent packet records.

### Purpose
Every finding is fixed, each code fix carries a test that fails without it, and every record matches what its evidence shows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code: a future `armedAt` reads as stale (DS-009); a new `prepare` completes this session's open notes as well as its claimed ones, and the nudge reuses the newest open note (DS-002); the nudge creates a private handoffs directory (DS-001); every loop write pins a note to 0600 (DS-003); the killer sweeps a stranded `.stale-` lock directory (DS-008).
- Tests: one failing-first test per code fix, plus spec-folder nudge cases for Claude and Codex (DS-011).
- Docs: the `/speckit:handoff` exit-3 meaning (DS-007); `SYSTEM_SPEC_FOLDER` and `HERMES_SPEC_FOLDER` in the environment reference (DS-010).
- Records: phase 007 run-10 log made committable (DS-004); phase 002 AC-003 rerun and summary reconciled (P1-001, P2-002); phase 006 citations moved off a temp path (DS-006); the parent spec and goal brought to eight phases (DS-005, P2-003, P2-004).

### Out of Scope
- New runtimes, triggers or live runs - no finding asks for one.
- Historical pane captures that show temp paths - they are verbatim records of what the terminal printed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Future `armedAt` is stale; supersede open notes; pin note mode |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Create the handoffs directory privately; newest open note first |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Sweep `.stale-` lock leftovers |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs` (five files) | Modify | Failing-first tests and adapter spec-folder cases |
| `.skilled/commands/speckit/handoff.md` | Modify | Exit 3 also covers the hop limit |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Two spec-folder variables |
| `../002-pi-opencode-adapters/`, `../006-deep-review-2-remediation/`, `../007-handoff-gate-exemptions/` records and evidence | Modify | Evidence and citation corrections |
| The run-10 benchmark folder | Modify | Log citation |
| `../spec.md`, `../goal.md` | Modify | Eight phases, continuity, phase 008 binding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every phase 002 and 007 acceptance row cites evidence that is in the repository and shows what the row claims. |
| REQ-002 | Each of the five code fixes has a test that fails on the pre-fix code and passes after it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The Claude and Codex nudge suites cover a payload `spec_folder`. |
| REQ-004 | The handoff command and the environment reference describe what the code does. |
| REQ-005 | The parent spec, the parent goal and the phase 006 records carry no stale phase count, placeholder row or temp-path citation. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The session-relaunch suites pass with zero failures, and the six new behavior tests fail when run against the pre-fix library files.
- **SC-002**: Recursive strict validation of the parent prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The machine's relaunch log still holds the run-10 lines | Without it, the phase 007 citations cannot be repaired | The twelve-line window was extracted and matched line by line against the cited numbers |
| Risk | Superseding open notes completes a note a person meant to claim by hand | Low | Only notes this session wrote are touched, and the newer note carries the work |
| Risk | Creating the handoffs directory from a nudge fails | Low | The failure is swallowed so the nudge still fires, and the model's write then fails visibly |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The nudge adds one directory create per nudge, which only runs above the threshold.

### Security
- **NFR-S01**: Handoff notes and their directory are owner-only once the loop has touched them.

### Reliability
- **NFR-R01**: A clock step backwards never makes an old relaunch record count as fresh.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two open notes for one session: the nudge names the newest, and the next `prepare` completes the older one.
- A record armed one millisecond in the future: declined as stale.

### Error Scenarios
- Handoffs directory cannot be created: the nudge still fires.
- A crash between a stale-lock rename and its removal: the next mutex holder sweeps the leftover once it is past the stale window.

### State Transitions
- A note written by the model with mode 0644: claim, complete and supersede re-pin it to 0600.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three library files, five test files, two docs and the packet records |
| Risk | 6/25 | No interface change; every fix narrows behavior |
| Research | 4/20 | The review already located each defect |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose "Fix all as phase 008".
<!-- /ANCHOR:questions -->

---
