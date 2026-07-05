---
title: "Feature Specification: Phase 21: completion-verifier-wiring"
description: "supervisorVerifier is options-injectable only (mk-goal.js:128, 1197-1199) and OpenCode loads plugins without options, so production verdicts are permanently not-configured -> not_met: goals can NEVER auto-complete and autonomy ends only via caps. Design-gated: operator must pick verifier option (a), (b), or (c) before implementation."
trigger_phrases:
  - "goal completion verifier wiring"
  - "supervisor verifier design fork"
  - "phase 021 verifier"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/021-completion-verifier-wiring"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Operator selected verifier design (c) hybrid"
    next_safe_action: "Author plan.md/tasks.md for option (c), then implement"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "2026-07-03, operator: selected verifier design (c) hybrid (heuristic default + env-gated LLM tier), matching the dossier's own recommendation. Env gate name/default adopted as the natural extension of this choice: MK_GOAL_VERIFIER=heuristic|llm, default heuristic."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: completion-verifier-wiring

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-deep-loop/032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 |
| **Predecessor** | 020-capability-additions |
| **Successor** | None |
| **Handoff Criteria** | Operator has recorded an explicit verifier design selection; the selected verifier ships as the production default so verdicts are no longer permanently `not_met`; injected `supervisorVerifier` precedence and the existing supervisor test suite are preserved; docs synchronized |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the goal-plugin review remediation program, covering the single design-gated finding e-3.1 of the four-reviewer audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md` §B). It is deliberately last: it is the only backlog item that changes the plugin's autonomy semantics rather than adding a small capability, and it MUST NOT start until the operator has chosen a design fork.

**Scope Boundary**: Production wiring of a default completion verifier in `mk-goal.js`, its tests, and doc sync. Nothing else: no new verbs (phase 020), no correctness fixes (016), no optimization (017).

**Dependencies**:
- Phase 020 lands first (serial `mk-goal.js` edit constraint: 016+017+019+020 then 021).
- HARD GATE: operator sign-off on the design fork (REQ-001) — precedent: phase 013's F-003/F-014 fork handling, where the fork was surfaced and explicitly decided rather than silently picked.

**Deliverables**:
- A recorded operator decision on verifier design (a)/(b)/(c)
- The selected verifier wired as the production default (goals can auto-complete without options injection)
- Regression tests: injected-verifier precedence preserved; default-verifier verdict paths covered
- Doc sync across goal_plugin.md, ENV_REFERENCE.md (if new envs), both feature catalogs, both playbooks

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
From the dossier (e-3.1, verbatim): `supervisorVerifier` is options-injectable only (`mk-goal.js:128`, `1197-1199`); OpenCode loads plugins without options, so production verdicts are permanently not-configured -> `not_met`; goals can NEVER auto-complete in production; autonomy ends only via caps. The verification machinery (evidence capture, verdict envelope, `maybeVerifyGoal`) all works and is tested — but the seam it depends on is never filled outside tests, so the completion supervisor built in phase 005 is dead code in every real session.

### Purpose
A production-default verifier — of a design the operator has explicitly chosen — fills the `supervisorVerifier` seam so goals with satisfying evidence can reach `complete` without options injection, while injected verifiers keep working exactly as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Design Options (the fork — operator must pick one)

| Option | Design | Pros | Cons |
|--------|--------|------|------|
| (a) LLM verdict via `ctx.client` | On verification, ask the session's model to judge goal-vs-evidence | Real semantic judgment; handles fuzzy objectives | Cost + latency on every verification cycle; non-deterministic verdicts; hard to test; couples plugin autonomy to model availability |
| (b) Structural/heuristic verifier from evidence | Deterministic rules over captured evidence (e.g., checklist/tasks completion state, explicit completion markers) | Deterministic, cheap, fully testable offline; no model dependency | Can only verify what evidence encodes; loose heuristics risk false auto-completes, tight ones re-create today's never-complete behavior |
| (c) Hybrid: heuristic default + env-gated LLM | (b) always runs as the default; an env flag upgrades to (a) for semantic confirmation | Safe deterministic baseline with an opt-in semantic tier; degrades gracefully to (b) when no model | Two code paths to test; env surface grows by one flag |

**RECOMMENDATION**: (c) — the heuristic default fixes "can never auto-complete" deterministically and cheaply, while the env-gated LLM tier lets operators opt into semantic verification where it is worth the cost. This is the dossier reviewer's recommendation as well.

### In Scope
- Presenting the fork and recording the operator's selection (REQ-001 — HARD GATE)
- Implementing the selected verifier as the production default at the `supervisorVerifier` seam
- Preserving injected-verifier precedence (options-injected verifier still wins when provided)
- Verdict provenance in status/event output (which verifier produced the verdict)
- Tests for the default verifier's met/not_met/error paths; existing supervisor tests stay green
- Doc sync for any new env/behavior (same six-surface discipline as phase 020's REQ-007)

### Out of Scope
- Changing verdict semantics, evidence capture, or `maybeVerifyGoal`'s envelope shape (e-2.5's envelope normalization belongs to phase 019)
- Auto-completion policy changes beyond wiring the verifier (caps, cooldowns, continuation gating untouched)
- Multi-goal considerations — deferred per phase 020 REQ-009

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Wire the selected default verifier at the `supervisorVerifier` seam (`:128`, `:1197-1199`); provenance in verdict output |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Modify | Default-verifier coverage + injected-precedence regression |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modify | Document the default verifier and any env flag |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify (if option (c)/(a)) | New env flag(s) with defaults |
| Both feature catalogs + both manual-testing playbooks | Modify | Sync verifier capability rows/steps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | HARD GATE: operator has explicitly selected the design fork before implementation begins; do not silently pick one (precedent: phase 013's F-003/F-014 fork handling) | The selection — (a), (b), or (c) — is recorded in this spec's Open Questions (moved to answered) and in `_memory.continuity.answered_questions` with date and chooser, BEFORE any `mk-goal.js` edit in this phase; a phase with implementation diffs but no recorded selection is a hard violation |
| REQ-002 | The selected verifier ships as the production default | With no options injection (plain OpenCode plugin load), a goal whose evidence satisfies the selected design's criteria reaches `complete` via `maybeVerifyGoal`; verdicts are no longer permanently "Supervisor verifier is not configured" -> `not_met` (`mk-goal.js:1197-1199`) |
| REQ-003 | Injected verifiers keep precedence | When `options.supervisorVerifier` is provided (as in tests), it is used instead of the default; the existing `mk-goal-supervisor.test.cjs` suite passes unmodified in behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verdict provenance is visible | Status/verification output identifies which verifier produced the verdict (injected / default-heuristic / LLM tier), so operators can distinguish semantic from structural completes |
| REQ-005 | Docs synchronized | goal_plugin.md documents the default verifier; ENV_REFERENCE.md gains any new env with code-matching default; both feature catalogs and both playbooks updated; grep evidence for each new name |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator's fork selection is recorded before any implementation diff exists (audit trail in this folder)
- **SC-002**: A production-shaped test (no options injection) demonstrates a goal auto-completing through the default verifier
- **SC-003**: Full mk-goal test suite green, including unmodified injected-verifier precedence behavior
- **SC-004**: No false auto-completes in the default path's negative tests (unsatisfying evidence stays `not_met`)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Silently picking a fork and implementing it | High - repeats the exact failure mode phase 013 existed to prevent | REQ-001 is a P0 hard gate; tasks T003+ are marked blocked until the selection is recorded |
| Risk | Heuristic verifier too permissive -> false auto-completes end autonomy early with a wrong "complete" | High | Negative-path tests are P0-adjacent (SC-004); default thresholds conservative; provenance (REQ-004) makes structural completes auditable |
| Risk | LLM tier (if selected) adds cost/latency/nondeterminism to every verification cycle | Medium | Env-gated and off by default under option (c); never selected implicitly |
| Dependency | Phase 020 lands first (serial `mk-goal.js` edits) | High | Do not start until 020's suite is green |
| Dependency | Operator availability for the fork decision | Medium - phase stalls | The decision packet is small (the table above); escalate once with the recommendation if unanswered |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **THE FORK**: RESOLVED 2026-07-03 by explicit operator sign-off — option **(c) hybrid: heuristic default + env-gated LLM tier**, matching the dossier reviewer's own recommendation. REQ-001's HARD GATE is satisfied; implementation may proceed.
- Env gate name/default: `MK_GOAL_VERIFIER=heuristic|llm`, default `heuristic` — adopted as the natural extension of choice (c), consistent with the existing `MK_GOAL_*` naming convention.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §B e-3.1
- **Fork-handling precedent**: `../013-design-fidelity-and-polish/` (F-003/F-014 fork surfaced and explicitly decided)
- **Verifier machinery under change**: `mk-goal.js:128` (options seam), `:1195-1199` (not-configured default path), `mk-goal-supervisor.test.cjs` (injected-verifier contract)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
