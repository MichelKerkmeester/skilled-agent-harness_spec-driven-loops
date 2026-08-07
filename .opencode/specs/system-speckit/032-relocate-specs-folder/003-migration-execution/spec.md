---
title: "Feature Specification: Specs-Root Migration Execution"
description: "Scope the literal, ordered runbook for executing the accepted specs-root topology flip. This phase produces the runbook only — it does not run it."
trigger_phrases:
  - "specs root migration execution"
  - "topology flip runbook"
  - "execute the specs flip"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-06T19:31:37Z"
    last_updated_by: "claude-code"
    recent_action: "Runbook scoped from the accepted phase 002 design"
    next_safe_action: "Operator reviews the runbook and explicitly approves running it before any live change happens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Specs-Root Migration Execution

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 002 accepted both ADRs — build a new topology-flip function on existing primitives (ADR-001), keep specs shared-by-default with an opt-in ownership override (ADR-002). This phase converts that design into a literal, ordered runbook: exact commands, exact verification checks, exact rollback triggers. **This phase produces the runbook only — no live change happens until the operator explicitly approves running it, separately from approving this scope.**

**Key Decisions**: The runbook executes as one atomic unit (symlink flip + `.gitignore` rebase together, never split); every step has a pass/fail check before the next step runs; any failed check halts and triggers the named rollback.

**Critical Dependencies**: Operator approval to actually run the runbook — scoping it here does not authorize execution.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft — runbook scoped, not yet run |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-migration-plan |
| **Successor** | None |
| **Handoff Criteria** | Operator explicitly approves running the runbook — a separate approval from accepting this scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the specs-folder relocation specification, and the last currently planned phase. It converts phase 002's accepted design into an executable runbook. No live change (no symlink flip, no code edit, no `.gitignore` change, no Memory MCP reindex) happens in this phase — only the runbook gets written.

**Scope Boundary**: Produce the literal step sequence, exact verification commands, and rollback triggers. Do not run any of it.

**Dependencies**:
- Phase 002's `plan.md` (§3-4) and `decision-record.md` (both ADRs Accepted)

**Deliverables**:
- `plan.md` with a literal, numbered, ordered runbook — each step has an exact command or code change, plus its own pass/fail verification
- `tasks.md` listing every runbook step as a task, left unchecked until actually run

**Changelog**:
- When this phase closes (i.e. after the runbook actually runs and is verified), refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 002's plan names WHAT needs to change (7 registry entries, a new function, a `.gitignore` rebase, a reindex) but not the exact HOW — the literal commands, the exact order, the exact checks between steps. Without that, running the migration would mean re-deriving the sequence live, under time pressure, against a real shared repository every future spec packet depends on.

### Purpose

Produce a runbook precise enough that running it later is mechanical: follow the steps, run the check after each one, stop and roll back on the first failure. No design decisions left to make at run time — those already happened in phase 002.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The literal, ordered runbook: exact `git` commands for the atomic flip + `.gitignore` rebase, the new topology-flip function's design (signature, inputs, what it reuses), the 7 registry-entry edits (before/after), the Memory MCP reindex commands, and the `SPEC_KIT_SPECS_DIR` override implementation (5 call sites, per ADR-002).
- A pre-flight checklist and named rollback trigger for every step that mutates anything.

### Out of Scope

- Actually running any step of the runbook. That is a separate, later, explicitly-approved action.
- Re-litigating ADR-001 or ADR-002 — both are Accepted; this phase executes them, not re-decides them.

### Files to Change

None in this phase. The runbook documents which files a future *run* would change; this phase changes only its own planning docs.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| — | — | Scoping phase; no repo files outside this packet's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every runbook step has an exact command or code change, not a description | `plan.md` §4 has no "[TBD]"-style placeholders in the step sequence |
| REQ-002 | Every mutating step has its own pass/fail verification before the next step runs | `plan.md` §4 pairs each step with a concrete check (exit code, `git status`, count comparison) |
| REQ-003 | The symlink flip and `.gitignore` rebase are documented as one atomic unit, never split | `plan.md` §4 names them as a single numbered step with one combined verification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Rollback trigger and procedure named for every mutating step | `plan.md` §7 covers pre-write and post-write rollback separately |
| REQ-005 | The 7 registry-entry code changes are specified precisely enough to apply without re-reading the source | `plan.md` §4 gives before/after for each of the 7 |
| REQ-006 | The `SPEC_KIT_SPECS_DIR` override (ADR-002) is included in the runbook, not deferred silently | `plan.md` §4 covers all 5 call sites named in phase 002's addendum |
| REQ-007 | tasks.md leaves every execution task unchecked | No task in `tasks.md` Phase 2 (Execute) is marked `[x]` — nothing has actually run |
| REQ-008 | This phase's own docs pass `validate.sh --recursive --strict` | Confirmed by the command run at the end of this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader with no prior context on this migration could follow `plan.md` §4 step by step and know exactly what to type, what to check, and when to stop.
- **SC-002**: Every mutating step names its own rollback trigger before it's ever run for real.
- **SC-003**: Nothing in this repository actually changed as a result of this phase — verified by `git status --porcelain` outside this packet's own docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The runbook looks complete but a step turns out to be under-specified once actually run | Medium — first real attempt discovers the gap instead of this planning pass | Each step's verification is a real, nameable command, not a vague "confirm it worked" |
| Risk | Someone runs the runbook without re-confirming the operator's go-ahead, since it now exists in writing | High if it happened — this affects every spec packet in the repo | `spec.md` Status stays "Draft — not yet run" until an explicit, separate run-approval; `tasks.md` execution tasks stay unchecked as the visible signal |
| Dependency | Phase 002's ADRs staying Accepted and unchanged | Low — both are already Accepted; re-verify they weren't touched before running | Reference `decision-record.md` directly at run time, don't rely on memory of this session |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable to this scoping phase. A future run's byte-verified copy step should be measured against actual tree size at run time — no target set here.

### Security
- **NFR-S01**: The runbook must not include any step that writes outside the two spec roots without going through `assertSpecWriteAllowed`/`assertQuarantineLocation`-equivalent containment checks.

### Reliability
- **NFR-R01**: Every mutating step must be individually verifiable and individually reversible before the next step starts — no multi-step "leap of faith" sequences.

---

## 8. EDGE CASES

### Data Boundaries
- What if `buildMigrationManifest` finds a divergent-duplicate at run time (none exist today, verified in phase 002, but repo state could change before this actually runs)? The runbook must halt, not proceed past it.
- What if a downstream project's checkout is not a plain symlink (per ADR-002's named open assumption)? The runbook covers the Public-repo-side changes only; it does not claim to fix every downstream project sight unseen.

### Error Scenarios
- Partial copy failure mid-flip: already handled by the reused `copyDirectoryVerified` primitive (fails closed).
- `.gitignore` rebase applied but symlink flip fails, or vice versa: this is exactly why REQ-003 requires them as one atomic step, not two.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: runbook covers 12+ real files across 2 subsystems (spec-kit tooling + Memory MCP); LOC: design-only in this phase, real code in the future run |
| Risk | 22/25 | Breaking: Yes, touches shared framework infra every spec packet depends on; the leak risk named in ADR-002 is real and high-impact if the atomic step is split |
| Research | 10/20 | Builds directly on phase 001/002's already-completed research and design; no new investigation needed |
| Multi-Agent | 5/15 | Single-agent scoping phase |
| Coordination | 12/15 | Requires a second, separate operator approval before running — the highest coordination bar of any phase so far |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Runbook run without a fresh, explicit operator go-ahead | High | Low (explicit gate designed in) | `spec.md` Status and `tasks.md` unchecked execution tasks are the visible signal that nothing ran yet |
| R-002 | Atomic flip+rebase step gets split into two commits when actually run | High — the exact leak ADR-002 named | Low (explicitly called out as REQ-003) | Runbook step is written as one unit with one combined verification, not two separate steps |
| R-003 | A registry entry's real code has drifted since phase 002 read it | Medium | Low | Runbook instructs re-reading each file immediately before editing it, not trusting the phase 002 snapshot blindly |

---

## 11. USER STORIES

### US-001: A runnable, unambiguous runbook (Priority: P0)

**As an** operator, **I want** the execution steps written down precisely enough that running them later doesn't require re-deriving the design, **so that** the actual migration is mechanical, not improvised.

**Acceptance Criteria**:
1. Given `plan.md` §4, When a future session runs it, Then every step has an exact command/change and its own check (satisfied by REQ-001/REQ-002).

### US-002: Nothing runs without me saying so, twice (Priority: P0)

**As an** operator, **I want** scoping the runbook and approving its execution to be two distinct, separate decisions, **so that** writing the plan down doesn't accidentally become permission to run it.

**Acceptance Criteria**:
1. Given this phase's `tasks.md`, When it's reviewed, Then every execution task is still unchecked (satisfied by REQ-007).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None carried forward from phase 002 — both ADRs are Accepted. The only remaining gate is the operator's separate approval to actually run this runbook.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior Decisions**: See `../002-migration-plan/decision-record.md`
