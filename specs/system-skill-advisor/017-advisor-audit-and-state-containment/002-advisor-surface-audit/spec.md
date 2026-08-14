---
title: "Feature Specification: Skill Advisor Surface Audit"
description: "Nine findings across all six audit categories in the skill-advisor subsystem, including two dead handler aliases, a test that has never run, and a benchmark set that is both misplaced and broken."
trigger_phrases:
  - "advisor surface audit"
  - "skill advisor dead code"
  - "advisor architecture audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/018-advisor-audit-and-state-containment/002-advisor-surface-audit"
    last_updated_at: "2026-07-27T17:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the audit spec from GPT-5.6-SOL research with two findings independently verified"
    next_safe_action: "Re-verify each finding against current HEAD before any remediation"
    blockers: []
    key_files:
      - "spec.md"
      - "../research/advisor-audit-research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-advisor-018-002"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the invisible scorer test be wired into the gate or removed?"
    answered_questions:
      - "A test file outside the include glob has never run; this repository has two independent instances."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill Advisor Surface Audit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 002 of 002 |
| **Predecessor** | ../001-state-directory-containment/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill-advisor subsystem has never had a systematic sweep of its own code and structure surface. A GPT-5.6-SOL research pass at xhigh effort produced nine findings spread evenly across all six audit categories, including exported symbols with no consumer, a duplicated harness, a test file that has never executed, and a retained benchmark set that is both misplaced and currently broken.

### Purpose

Produce a verified, ranked disposition for each finding so remediation acts only on claims that survive re-testing, and record the two structural patterns the audit exposed rather than treating each instance as isolated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The nine findings in `../research/advisor-audit-research.md`, scoped to `system-skill-advisor/`, its launcher and its plugin bridges.
- Re-verification of every finding against current HEAD before any edit.

### Out of Scope

- The stray state-directory leak, which phase 001 owns.
- Anything outside the advisor subsystem, even where the same pattern appears elsewhere.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `disposition-table.md` | Create | Per-finding verdict with a re-runnable command |
| `implementation-summary.md` | Modify | Closeout and remediation handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:findings -->
## 4. FINDINGS

| ID | Cat | Claim | Status |
|----|-----|-------|--------|
| F1 | CAT-1 | Four snake_case handler aliases have no live consumers | **VERIFIED** |
| F2 | CAT-1 | The launcher forwards an unused Codex timeout variable | Unverified |
| F3 | CAT-2 | An orphaned copy of the canonical search-quality harness | Unverified |
| F4 | CAT-3 | Test telemetry committed under a temporary directory | Unverified |
| F5 | CAT-4 | A scorer test sits in production source and is excluded from every gate | **VERIFIED** |
| F6 | CAT-4 | Retained code-graph benchmarks are misplaced and currently broken | Unverified |
| F7 | CAT-5 | The documented test contract and Vitest discovery disagree | Unverified |
| F8 | CAT-5 | The compatibility contract has two manually synchronized sources | Unverified |
| F9 | CAT-6 | All nine MCP tool descriptors are copied into a second CLI registry | Unverified |

### F1, verified

`handle_advisor_recommend`, `handle_advisor_rebuild`, `handle_advisor_status` and `handle_advisor_validate` are declared in their handler files and re-exported at `handlers/index.ts:5-8`. Outside `.opencode/specs/`, which holds archived research transcripts rather than code, they appear in exactly two files: their own declaration and the barrel. No consumer exists.

The naive search is misleading and worth recording: `advisor_recommend` is the MCP **tool id** and appears throughout `AGENTS.md`, `README.md`, `SKILL.md` and the CLI fallback. `handle_advisor_recommend` is the **handler alias** and appears nowhere live. Searching the shorter string finds the wrong symbol and would have refuted a true finding.

### F5, verified

`vitest.config.ts` includes only `tests/**/*.vitest.ts`. The test lives at `lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts`, outside that root, so Vitest never collects it. `tsconfig.build.json` also excludes `**/__tests__`.

This is the second independent instance of the same defect in this repository. The release-cleanup audit found `detector-regression-floor.vitest.ts.test.ts`, a test invisible because its filename fell outside the include glob. Two instances found by two separate audits means the class is systemic and deserves a lint rule rather than two point fixes.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding is re-verified against current HEAD before any edit | Each disposition cites a re-run of its own evidence command |
| REQ-002 | Reachability claims name the exact symbol, not a similar one | Each dead-code disposition states the symbol searched and distinguishes it from lookalikes |
| REQ-003 | No file is deleted without a whole-repo string-literal search | Search covers `.ts`, `.js`, `.cjs`, `.mjs`, `.md`, `.yaml`, `.json`, `.sh` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The invisible test is either wired into a gate or removed with rationale | Either Vitest collects it or its removal is recorded |
| REQ-005 | The two-instance test-invisibility pattern is recorded as a systemic finding | A lint or config check is proposed, not just two fixes |
| REQ-006 | Findings about duplicated contracts state which side is canonical | F8 and F9 dispositions name the source of truth |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: All nine findings carry a disposition backed by a re-runnable command.
- **SC-002**: Every dead-code disposition names the exact symbol searched.
- **SC-003**: The test-invisibility pattern has a proposed systemic guard, not two isolated repairs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dead-code claim matches a lookalike symbol and is wrongly refuted or confirmed | High | F1 already demonstrates the trap; every claim states its exact symbol |
| Risk | Wiring the invisible test into the gate surfaces real failures and blocks the phase | Medium | Expected outcome; fix or accept explicitly rather than reverting the wiring |
| Risk | Removing a duplicated descriptor registry breaks the CLI surface that reads it | High | Establish which registry is canonical before removing either |
| Dependency | The research report | Blocks disposition | `../research/advisor-audit-research.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should `semantic-shadow-cosine.vitest.ts` be wired into the gate or removed? Wiring it will likely surface real failures, since it has never run.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `../research/advisor-audit-research.md`
- **Phase parent**: `../spec.md`
- **Sibling phase**: `../001-state-directory-containment/spec.md`
