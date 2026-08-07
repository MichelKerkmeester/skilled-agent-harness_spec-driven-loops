---
title: "Feature Specification: Advisory Research"
description: "Ten forced-depth research passes determine which git operations warrant a preflight advisory, what state each rule can evaluate before the command runs, and where the noise threshold sits."
trigger_phrases:
  - "git advisory research"
  - "which git operations warrant advisory"
  - "git hook noise threshold"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/001-advisory-research"
    last_updated_at: "2026-07-27T21:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the research phase spec"
    next_safe_action: "Dispatch the ten research passes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-001"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What advisory frequency stops being useful and starts being ignored?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Advisory Research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-rule-encoding |
| **Handoff Criteria** | Research names the operations worth advising, the state each rule can evaluate pre-execution, and the noise threshold |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Git action advisory hook specification.

**Scope Boundary**: Research only. This phase writes findings, not rules and not hook code. Encoding is phase 002; the hook is phase 003.

**Dependencies**: None. The evaluator (`dispatch-rule-checks.mjs`), the schema (`cli-devin/SKILL.md`), and the rule source (`sk-git/SKILL.md`) all already exist and are readable.

**Deliverables**:
- `research/` — per-pass transcripts and merged registry
- `research.md` — ranked findings with a confirmed-versus-inferred split
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The incident list in the parent spec is a starting point drawn from one session, not a survey. Building rules directly from five remembered failures would encode recency rather than risk: it would miss operations that fail rarely but expensively, and it would likely over-trigger on operations that look dangerous but are routine.

Two questions cannot be answered from the incident list alone. First, **what state is actually evaluable before a git command runs** — an advisory that needs post-execution information is not a preflight advisory. Second, **where the noise threshold sits**: an advisory that fires on every commit teaches the operator to skim past it, at which point it is worse than nothing because it consumes attention while providing no protection.

### Purpose

Produce an evidence-backed list of the git operations worth advising, each with the pre-execution state its rule can evaluate and an estimate of how often it would fire.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Which git operations carry enough risk to warrant an advisory.
- What state each candidate rule can evaluate *before* the command runs.
- How often each rule would have fired against real repository history — the noise estimate.
- Which existing sk-git prose rules map cleanly to a mechanical check, and which are irreducibly judgement calls.
- Failure modes with no rule today, of which the pathspec-commit omission is one known instance.
- How comparable ecosystems solve this, and where their advisories are known to be ignored.

### Out of Scope

- Writing `hard_rules:` frontmatter — phase 002.
- Writing hook code — phase 003.
- Any change to enforcement behaviour. The pre-commit, commit-msg and pre-push hooks own blocking; this program advises.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Per-pass transcripts, state logs, merged registry |
| `research.md` | Create | Ranked findings with verification tiers |
| `implementation-summary.md` | Modify | Program outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ten research passes complete | 5 `gpt-5.6-sol` at high effort, 5 `glm-5-2` via cli-devin; ten transcripts on disk |
| REQ-002 | No early convergence | Passes run to the iteration cap; convergence is telemetry, not a stop signal |
| REQ-003 | Every candidate rule states its pre-execution evaluability | Each finding names the exact state read and whether it is available before the command runs |
| REQ-004 | Every candidate rule carries a noise estimate | Fire-frequency grounded in real history or an explicit statement that it was not measured |
| REQ-005 | Claims are tiered | Findings separate confirmed from inferred; unverified claims are labelled, not presented as solid |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Existing sk-git rules are mapped | Each ALWAYS/NEVER/ESCALATE rule is classified mechanical, partial, or judgement-only |
| REQ-007 | Rules with no prose source are flagged | A candidate not traceable to sk-git prose or an observed incident is marked as new and justified |
| REQ-008 | Prior art is surveyed | At least one external comparison, including where its advisories fail |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked candidate-rule list where each entry states the operation, the pre-execution state, the noise estimate, and the source.
- **SC-002**: An explicit noise threshold recommendation with the reasoning that supports it.
- **SC-003**: The five known incidents are each either matched to a candidate rule or explained as unadvisable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Passes converge on restating the five known incidents | Med — produces confirmation rather than research | Divergent prompting; the incident list is given as a floor, and passes are told to find what it misses |
| Risk | Candidate rules that need post-execution state | High — unbuildable as a preflight advisory | REQ-003 makes evaluability a required field per finding |
| Risk | A rule set large enough to be ignored | High — the failure mode this packet exists to avoid | REQ-004 forces a noise estimate on every candidate |
| Dependency | `cli-devin` free tier availability | Med | Devin passes run as manual dispatches; it is not a deep-loop executor kind and cannot host a lineage |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What advisory frequency stops being useful and starts being ignored?
- Should the identity check compare against the remote owner, or against an explicit allowlist?
- Do any candidate rules belong in the existing pre-push hook as enforcement rather than here as advice?
<!-- /ANCHOR:questions -->
