---
title: "Feature Specification: Specs-Root Migration Plan"
description: "Design the specs-root topology inversion: invert the 21-entry resolver registry and adapt the existing spec-root-* primitives for a symlink-topology flip, without executing any change."
trigger_phrases:
  - "specs root migration plan"
  - "invert resolver registry"
  - "spec-root topology flip"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/002-migration-plan"
    last_updated_at: "2026-08-06T18:04:13Z"
    last_updated_by: "claude-code"
    recent_action: "Read all 5 spec-root-* subsystem files; found the mutation functions don't directly apply"
    next_safe_action: "Operator reviews decision-record.md before any phase attempts execution"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-system-speckit-032-relocate-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Specs-Root Migration Plan

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 001's research recommended "invert and reuse" the existing `spec-root-*` migration subsystem. Reading it in full found that recommendation was directionally right but mechanically incomplete: the existing mutation functions consolidate packets between two independently-real trees and would silently no-op against today's actual symlinked state. This phase corrects the design — reuse the primitives, build new orchestration — and produces a concrete, reviewable plan.

**Key Decisions**: Build a new topology-flip function on existing primitives rather than repointing the existing mutation function (ADR-001, Accepted); keep specs shared-by-default with an opt-in `SPEC_KIT_SPECS_DIR` override for downstream ownership (ADR-002, Accepted).

**Critical Dependencies**: None remaining — both ADRs are Accepted. An execution phase can now be scoped.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 2 |
| **Predecessor** | 001-relocation-implications-research |
| **Successor** | 003-migration-execution |
| **Handoff Criteria** | Both ADRs Accepted (met) — an execution phase can be scoped whenever the operator chooses |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the specs-folder relocation specification. It plans the migration; it does not execute it. No source file, symlink, git object, or Memory MCP row changes in this phase.

**Scope Boundary**: Read the existing `spec-root-*` migration subsystem in full, verify whether phase 001's "invert and reuse" recommendation holds up against the actual code, and produce a concrete, reviewable migration design.

**Dependencies**:
- Phase 001's `research/research.md` (source of the combined implication list and initial recommendation)

**Deliverables**:
- `decision-record.md` recording the one architectural finding that refines phase 001's recommendation, and the one open policy decision still needing an operator answer
- `plan.md` with the concrete inversion design: which of the 21 registry entries need real code changes vs. relabeling, and how the existing primitives compose into a topology-flip operation that does not exist yet
- `tasks.md` as the literal task list a future execution phase would follow

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 001's research recommended inverting and reusing the existing `spec-root-*` migration subsystem (`spec-root-registry.ts`, `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`) rather than hand-patching literals. That recommendation was based on citation-level verification (the files exist and roughly do what they claim) but not a full read of what they actually do. A full read changes the picture: the subsystem's mutation functions are built for **packet consolidation between two independently-real directory trees**, not a **symlink-topology flip** — and today's actual starting state (`specs` is a tracked symlink to `.opencode/specs`) means the subsystem's own collision classifier would presently mark every existing packet `same-inode-alias` and skip it, a no-op.

### Purpose

Produce an accurate, reviewable migration plan that names exactly what's reusable (the primitives: collision classification, byte-verified copy/move, quarantine safety, deterministic manifest hashing, writer-freeze) versus what needs new orchestration code (the actual topology-flip operation), so an execution phase can proceed from a correct design instead of a plausible-sounding but untested assumption.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Full read of the 5 `spec-root-*` subsystem files (registry, migration, migration-manifest, write-guard, collision-classifier) and the 61-test validation matrix.
- Design of the topology-flip operation: what it needs to do, which existing primitives it reuses, what's genuinely new.
- Grouping the 21-entry resolver registry by which entries need real precedence-logic changes (`canonical-first`/`canonical-only`, 7 entries) versus which are already effectively flip-compatible (`legacy-first`/`direct-path-first`/`membership-only`, 14 entries).
- Naming the one open policy decision (downstream specs ownership) the operator must answer before execution.

### Out of Scope

- Writing or running any migration code.
- Flipping the actual symlink, moving any file, or touching the Memory MCP database.
- Resolving the downstream-ownership policy decision on the operator's behalf — that decision belongs to them, not this phase.

### Files to Change

None. This phase produces planning documents only.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| — | — | Planning phase; no repo files outside this packet's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read all 5 spec-root-* subsystem files in full, not just cited snippets | Each file's actual behavior is described accurately in `plan.md`, verified against the real source |
| REQ-002 | Determine whether the existing mutation functions apply directly or need new orchestration code | `decision-record.md` states the finding with evidence (collision classifier behavior against the current symlinked state) |
| REQ-003 | Group all 21 registry entries by whether they need a real code change | `plan.md` §3 groups all 21 by precedence type with a real-change/no-change call for each |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Name the downstream-ownership decision explicitly, without resolving it | `decision-record.md` records it as OPEN, pending operator answer |
| REQ-005 | Produce a task list an execution phase could follow without re-deriving the design | `tasks.md` is concrete enough to hand to a future phase |
| REQ-006 | Confirm the write-guard's flip preserves divergent-duplicate rejection | `plan.md` FIX ADDENDUM names `assertSpecWriteAllowed`'s change as a literal swap only, logic otherwise unchanged |
| REQ-007 | Name every cutover surface beyond the resolver registry (CI, docs) | `plan.md` §4 Phase B names `strict-pass-freshness-sweep.yml` and Gate 3/`AGENTS.md` examples |
| REQ-008 | Preserve the existing rollback boundary in the new design | `plan.md` §7 names `restoreFromQuarantine`-equivalent logic as the rollback mechanism |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plan accurately reflects what the existing `spec-root-*` code does today, verified by reading it (not inferred from citations alone).
- **SC-002**: A reader can tell, for each of the 21 registry entries, whether it needs a code change and why.
- **SC-003**: The one open policy decision is named clearly enough that answering it is the only remaining blocker to scoping an execution phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Treating "invert and reuse" too literally would produce a no-op migration | High if unnoticed — silently does nothing since same-inode-alias packets are skipped | This phase's core finding exists specifically to catch this before execution |
| Risk | The 61-test validation matrix may not translate cleanly to the new operation shape | Medium — false confidence from "tests exist" without checking what they actually assert | Named as a carried-forward verification item, not assumed covered |
| Dependency | Operator answer on downstream-ownership policy | Blocks scoping an execution phase, does not block this planning phase | Documented as the single named blocker in decision-record.md |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable to this planning phase (no runtime code shipped). A future execution phase's topology-flip function should complete the byte-verified copy of the current tree in a time proportional to tree size — no target set yet, since the tree hasn't been measured for this purpose.

### Security
- **NFR-S01**: The topology-flip design must preserve `assertSpecWriteAllowed`'s divergent-duplicate rejection — the write guard must still refuse a write that would create a true collision after the flip, not just after the literal swap.

### Reliability
- **NFR-R01**: The design must preserve the existing rollback boundary — a future execution phase must be able to restore the pre-flip state via quarantine-based logic before any new canonical write lands.

---

## 8. EDGE CASES

### Data Boundaries
- Symlink-aliased packets (today's actual state): `classifySpecRootCollision` returns `same-inode-alias` for every packet — the new topology-flip function must handle this as the expected starting state, not an error.
- Divergent-duplicate packets: if any exist (verified absent today via `buildMigrationManifest`), the flip must refuse to proceed rather than silently pick a winner.

### Error Scenarios
- Partial copy failure mid-flip: `copyDirectoryVerified` already fails closed (removes the temporary path and rethrows) — the new function should preserve this behavior.
- Cross-device move (`EXDEV`): `moveDirectoryVerified` already falls back to verified copy-then-remove — reusable as-is.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 5 core subsystem files read, 7 registry entries need changes; LOC: design-only, no code written; Systems: spec-kit tooling + Memory MCP |
| Risk | 18/25 | Auth: N/A; API: Memory MCP indexing behavior; Breaking: Yes — a future execution phase touches every spec packet's resolution path |
| Research | 15/20 | Full read of 5 subsystem files plus reconciliation against 2 rounds of prior research (4 lineages) |
| Multi-Agent | 5/15 | Single-agent planning phase; no parallel workstreams |
| Coordination | 10/15 | One explicit operator decision gates the next phase |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A future execution phase repoints the existing mutation function's literals instead of building the new topology-flip function | High | Low (explicitly documented in ADR-001 to prevent this) | `decision-record.md` ADR-001 names the exact failure mode |
| R-002 | The 61-test validation matrix doesn't translate to the new operation shape | Medium | Medium | Carried forward as an unverified item in `plan.md` §4 Phase C |
| R-003 | Execution scoped before the downstream-ownership decision is answered | Medium | Low | `spec.md` Handoff Criteria names this as the explicit blocker |

---

## 11. USER STORIES

### US-001: Accurate migration design (Priority: P0)

**As an** operator, **I want** the migration plan to reflect what the existing code actually does, **so that** an execution phase doesn't discover mid-flight that the "reuse" recommendation was a no-op.

**Acceptance Criteria**:
1. Given the existing `spec-root-*` subsystem, When it's read in full, Then the plan states precisely what's reusable and what's new (satisfied — `plan.md` §3).

### US-002: A concrete handoff to a future execution phase (Priority: P1)

**As a** future execution phase, **I want** a task list and registry breakdown I can act on directly, **so that** I don't have to re-read all 5 subsystem files myself before starting.

**Acceptance Criteria**:
1. Given `plan.md` §3-4, When an execution phase starts, Then it can identify every entry needing a code change without re-deriving the list (satisfied — the 7-entry table is complete and file:line-cited).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Resolved: downstream specs ownership stays framework-shared by default, with an opt-in `SPEC_KIT_SPECS_DIR` override available per-project. See `decision-record.md` ADR-002 (Accepted).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
