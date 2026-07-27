---
title: "Feature Specification: Findings Triage and Verification"
description: "Eighty of the audit's 88 findings were path-checked but never claim-tested. Two of the six claims that were re-tested turned out wrong, and one of those declared a script dead that runs on every commit through an installed git hook. Acting "
trigger_phrases:
  - "findings triage and verification"
  - "017 phase 001"
  - "findings remediation 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/001-findings-triage-and-verification"
    last_updated_at: "2026-07-27T08:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase spec from the audit findings"
    next_safe_action: "Dispatch the three-model triage split"
    blockers: []
    key_files:
      - "spec.md"
      - "../../016-dead-code-and-architecture-audit/findings-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Remediation acts only on findings dispositioned CONFIRMED by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Findings Triage and Verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 001 of 009 |
| **Findings in scope** | 80 |
| **Blast radius** | Gate |
| **Successor** | ../002-repo-hygiene-and-residue/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 001** of the findings remediation program. Source findings: `../../016-dead-code-and-architecture-audit/findings-report.md`.

**Scope Boundary**: This phase is the gate. It dispositions findings and executes nothing.

**Deliverables**:
- Per-finding record of what was done and why.
- `implementation-summary.md` with counts and any deferrals.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Eighty of the audit's 88 findings were path-checked but never claim-tested. Two of the six claims that were re-tested turned out wrong, and one of those declared a script dead that runs on every commit through an installed git hook. Acting on the unverified set as though it were reliable would break working code.

### Purpose

Give every unverified finding a disposition backed by a re-runnable command, so downstream phases act only on claims that survived a second look.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-test all 80 UNVERIFIED findings from the audit registry and the normalized manual findings
- Record CONFIRMED, REFUTED or DEFERRED per finding with the exact command used
- For dead-code candidates, search string literals across .ts, .js, .cjs, .md, .yaml, .json rather than import graphs alone
- Route each CONFIRMED finding to its owning remediation phase
- Split re-testing across three model families by owning surface: `gpt-5.6-sol` for CAT-1 and CAT-5 reachability, `composer-2.5-fast` for CAT-3 and CAT-4 filesystem checks, `glm-5-2` for CAT-2 and CAT-6 judgement calls
- Send any cross-model disagreement to a third opinion before recording a disposition
- Apply the runtime-wins default when routing CAT-5 contradictions, escalating only intended-but-unbuilt cases

### Out of Scope

- Executing any remediation — this phase only dispositions
- Re-running the research program; the finding set is frozen

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `disposition-table.md` | Create | One row per finding: id, source, category, claim, disposition, command, owning phase |
| `implementation-summary.md` | Modify | Counts per disposition and the routing handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every one of the 80 unverified findings carries a disposition | Disposition table has 80 rows, none blank |
| REQ-002 | Every disposition cites the exact command that produced it | Each row has a re-runnable command |
| REQ-003 | Dead-code dispositions used string-literal search, not import graphs alone | Command column shows a literal search over .ts/.js/.cjs/.md/.yaml/.json |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | REFUTED findings are recorded as refutations, not silently dropped | Refuted rows retain the original claim and the disproving evidence |
| REQ-005 | Each CONFIRMED finding names its owning remediation phase | Owning-phase column populated for every CONFIRMED row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 80/80 findings dispositioned with a cited command.
- **SC-002**: Every CONFIRMED finding is routed to exactly one of phases 002 through 009.
- **SC-003**: The refutation rate is reported, so downstream phases know how much to trust the set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A verification search is narrower than the reachability it tests | High | Mirror the two known failure modes: search beyond the owning hub, and include .ts in every dependency check |
| Risk | Findings re-tested against a moved HEAD give a different answer | Medium | Record the SHA each disposition was taken against |
| Dependency | Phase 016 findings artifacts | Blocks the phase entirely | research/findings-registry.json and research/devin-findings.json |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many of the 80 unverified findings survive re-testing?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit findings**: `../../016-dead-code-and-architecture-audit/findings-report.md`
- **Phase parent**: `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
