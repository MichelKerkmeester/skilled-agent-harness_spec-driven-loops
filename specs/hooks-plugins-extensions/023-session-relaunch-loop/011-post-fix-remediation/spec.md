---
title: "Feature Specification: Phase 11: post-fix-remediation"
description: "The research after phase 009 left one relaunch bug, a conformance gap and a set of duplications, doc gaps and small inconsistencies. This phase fixes every one of its twenty findings, the two areas it left unexplored, and the follow-ups the fixes surfaced."
trigger_phrases:
  - "post fix remediation"
  - "phase 11 post fix remediation"
  - "session relaunch stale re-arm fix"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: post-fix-remediation

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
| **Branch** | `worktrees/156-session-relaunch-post-fix-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-post-fix-research |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch suites and the Pi suite pass with no failures and recursive strict validation of the parent prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Session relaunch loop specification.

**Scope Boundary**: All twenty findings in `../010-post-fix-research/research/research.md`, the two frontier areas it named (the killer's lock lifetime against the freshness gate, and the untested Cursor and Devin wrapper paths), and the follow-ups the fixes surfaced. The operator asked on 2026-10-19 to "Fix all p1, p2, p3", "Plus bug" and "all open items".

**Dependencies**:
- Phase 010's verified report.

**Deliverables**:
- A failing-first test per behaviour change in the core, CLI, killer, adapters and wrapper.
- Arm cases in the conformance table, mirrored for Pi.
- Corrected concern README, tests README, environment reference and `/speckit:handoff`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A re-arm of an armed record kept its first `armedAt`, so after a killer died and the session idled past ten minutes, the wrapper printed the manual command instead of relaunching. The killer never checked a record's age, so it could end a session the wrapper would then decline as stale. Five arm paths used three different guard rules, and the conformance table had no arm case to notice. Constants were declared twice, entrypoints ran on import and could not be tested, two docs drifted, and the manual command fell back silently when its template was unusable.

### Purpose
Every finding is fixed or made explicit with a test that fails without the change, and the arm decision joins the conformance table.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code: the stale re-arm (P1-1), one arm guard (P1-12), shared constants and exports (P2-1, P2-5, P2-13, P2-19, P3-3, P3-8), the `CLAUDE_PID` descent check (P2-7), entrypoint guards (P2-14), adapter-level target tests (P2-9), one payload-event rule (P3-15), the Pi load check (P3-4), the wrapper's manual command (P2-6), the killer's freshness check, a `Date` clock in `shouldRelaunch`, and a visible template fallback in the CLI and the killer.
- Tests: arm conformance cases (P2-10) and Cursor and Devin wrapper tests.
- Docs: P2-16, P2-17, P2-18, P3-11 and the behaviour changes above.

### Out of Scope
- The deep-loop open items, which are phase 011 of `system-deep-loop/038-review-and-cli-lineage`.
- Live relaunch runs. Every change narrows a path the unit, adapter and wrapper tests reach.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/*.cjs`, `bin/session-relaunch.cjs` | Modify | Core, nudge, killer and CLI fixes |
| `claude/`, `codex/`, `hermes/`, `pi/`, `.opencode/plugins/session-relaunch.js` | Modify | Shared arm guard, entrypoint guard, payload rule |
| `.skilled/bin/skilled-loop` | Modify | Manual command from the core, visible template error |
| `tests/*.test.cjs`, `pi/session-relaunch.test.ts` | Modify | Failing-first tests and arm conformance cases |
| Concern and tests READMEs, `ENV-REFERENCE.md`, `handoff.md` | Modify | Doc fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A re-arm after a killer death makes the record fresh, and the killer never signals for a record the wrapper would decline as stale. |
| REQ-002 | Every behaviour change has a test that fails on the pre-phase sources. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | All five arm paths use one core guard, and the conformance table covers the arm decision. |
| REQ-004 | Every other verified finding and frontier item is fixed, and the docs describe the resulting behaviour. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pre-phase sources fail the final tests, and the phase sources pass every session-relaunch suite and the Pi suite.
- **SC-002**: Recursive strict validation of the parent prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The shared guard refuses records two arm paths used to accept | Medium | It refuses only a record for another loop or runtime, which no single loop can produce; conformance cases cover each refusal |
| Risk | The killer now skips a signal near the age limit | Low | It unarms with reason `stale` and logs `killer-stale`; the note stays open for a new prepare |
| Risk | A wrapper template error turns a clean exit into exit 1 | Low | Only when a carried value contains the placeholder token, and it prints the plain command |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The killer adds one freshness read before its signal; no extra process-table read.

### Security
- **NFR-S01**: `CLAUDE_PID` counts only while it descends from the loop, in `prepare` as in the Stop hook.

### Reliability
- **NFR-R01**: An entrypoint started through a linked directory still runs, because the guard compares real paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record with no runtime counts as Claude's.
- A template with no placeholder or more than one: the CLI warns on stderr, the killer logs `killer-manual-template`, and both use the plain command.

### Error Scenarios
- `ps` fails: every process-table caller still refuses to act.
- A payload without a session id: no arm, even when the record has none.

### State Transitions
- An armed record with a live killer is not re-armed; one whose killer is gone is re-armed with a new `armedAt`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Core, killer, CLI, five adapters, the wrapper, ten suites and four docs |
| Risk | 9/25 | Arm and kill decisions change; both narrow |
| Research | 3/20 | Phase 010 located each defect |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose a worktree merged to main.
<!-- /ANCHOR:questions -->

---
