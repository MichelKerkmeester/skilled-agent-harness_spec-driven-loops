---
title: "Feature Specification: Specs-Root Migration Execution"
description: "Scope and execute the literal, ordered runbook for the accepted specs-root topology flip. All 11 steps ran and verified clean, including a bulk-delete dedup of 10,459 stale-alias Memory MCP rows step 9's reindex alone could not clean up. Only the operator's final review (T015) remains open."
trigger_phrases:
  - "specs root migration execution"
  - "topology flip runbook"
  - "execute the specs flip"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/003-migration-execution"
    last_updated_at: "2026-08-07T12:45:15Z"
    last_updated_by: "claude-code"
    recent_action: "All 11 steps executed and verified; step 9 dedup resolved via bulk-delete"
    next_safe_action: "T015: operator reviews the final state"
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

Phase 002 accepted both ADRs — build a new topology-flip function on existing primitives (ADR-001), keep specs shared-by-default with an opt-in ownership override (ADR-002). This phase converted that design into a literal, ordered runbook, then executed it: `specs/` is now the real, canonical directory and `.opencode/specs` is the compat symlink. All 11 steps ran and verified clean, including step 9 (Memory MCP reindex) — worked around a daemon-workspace mismatch with a standalone reindex, then a verified bulk-delete of 10,459 stale-alias rows the reindex alone couldn't clean up.

**Key Decisions**: The runbook executed as one atomic unit (symlink flip + `.gitignore` rebase together, in commit `606e55cb8a`, never split); every step had a pass/fail check before the next step ran; testing during step 10 surfaced 6 more hardcoded-direction call sites beyond the originally-named 12, fixed in the same pass; step 9's design gap (symlink makes old-alias rows unorphanable) got a verified bulk-delete rather than a deferred code-level fix.

**Critical Dependencies**: None remaining. Only T015 (operator final review) is open.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Steps 1-11 all executed and verified; T015 (operator final review) open |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-migration-plan |
| **Successor** | 004-code-graph-index-flag-deprecation |
| **Handoff Criteria** | Operator reviews the final state (T015) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the specs-folder relocation specification, and the last currently planned phase. It converted phase 002's accepted design into an executable runbook, then ran it end to end: the symlink flip, the `.gitignore` rebase, all 12+ code call sites, CI/docs updates, and the Memory MCP reindex (step 9, including a bulk-delete dedup of stale-alias rows the reindex alone couldn't clean up).

**Scope Boundary**: Produce the literal step sequence, exact verification commands, and rollback triggers, then execute steps 1-11 in order, halting on any failed check.

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

- Re-litigating ADR-001 or ADR-002 — both are Accepted; this phase executes them, not re-decides them.

### Files to Change

`specs`/`.opencode/specs` topology (the flip itself), the 12 named call sites plus 6 more discovered during step 10 testing, `.gitignore`, the CI workflow, `AGENTS.md`, `PUBLIC-RELEASE.md`, and this packet's own docs. See `plan.md` §4 and `implementation-summary.md` for the full list with commit SHAs.
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
| REQ-007 | tasks.md checkboxes track real state, never ahead of it | `tasks.md` Phase 2 (Execute) items T004-T013 are `[x]` with evidence; T014/T015 stay `[ ]` until step 11 and operator review actually complete |
| REQ-008 | This phase's own docs pass `validate.sh --recursive --strict` | Confirmed by the command run at the end of this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader with no prior context on this migration could follow `plan.md` §4 step by step and know exactly what to type, what to check, and when to stop.
- **SC-002**: Every mutating step names its own rollback trigger before it's ever run for real.
- **SC-003**: Every change this phase made to the repository is traceable to a named commit SHA in `plan.md`/`implementation-summary.md` — verified by `git log` and `git status --porcelain` at each step.
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
| R-001 | Runbook run without a fresh, explicit operator go-ahead | High | Realized safely — mitigated as designed | The operator's `/goal` submission plus "Go" was the separate, explicit go-ahead ADR-001 required; the runbook then executed with per-step verification |
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
1. Given this phase's `tasks.md` before the operator's `/goal` submission, execution tasks were unchecked; after that separate, explicit go-ahead, they check off only as each step really completes, never ahead of it (satisfied by REQ-007).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None carried forward from phase 002 — both ADRs are Accepted and executed. All 11 runbook steps are complete. The only remaining open item is T015 — the operator's final review of the finished state.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior Decisions**: See `../002-migration-plan/decision-record.md`
