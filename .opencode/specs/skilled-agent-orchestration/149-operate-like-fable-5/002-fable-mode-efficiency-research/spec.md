---
title: "Feature Specification: Fable-5 efficiency — map every adjustable Public-repo surface and optimization (deep research round 2)"
description: "Deep-research round 2: extract net-new fable-5 logic from the fable-mode and opus-fable-mode sources, map every adjustable Public-repo surface by read-reliability, and produce a ranked, tiered (doctrine / mechanism / measurement) recommendation set deduped against round 1. Research-only — recommend, do not edit framework surfaces."
trigger_phrases:
  - "fable-5 efficiency research"
  - "fable mode surface map"
  - "opus fable mode optimizations"
  - "fable-5 surface recommendations"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5/002-fable-mode-efficiency-research"
    last_updated_at: "2026-06-15T12:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed 6-lineage research; updated recommendations.md"
    next_safe_action: "Await owner sign-off on recommendations.md"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/fable-mode-main/"
      - ".opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/"
      - ".opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-fable-mode-efficiency-research"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Fable-5 efficiency — map every adjustable Public-repo surface and optimization (deep research round 2)

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Round 1 distributed the distilled `Fable5.md` doctrine via a surgical set (now in `149/001-initial-refinement`). Round 2 is a deep-research round over two new, mechanism-rich sources (`external/fable-mode-main/` — a 62KB forensic behavioral profile + `/fable-mode` command; `external/opus-fable-mode-main/` — a CLAUDE.md governor + a `UserPromptSubmit` reinject hook + a `leak_test.py` measurement harness + Opus recursion-control) to find **every adjustable Public-repo surface** and the **optimizations** that move our AIs — any AI — toward fable-5 *efficiency*.

**Key Decisions**: research-only this round (ranked recommendations, stop for review); breadth = doctrine + mechanisms + measurement.

**Critical Dependencies**: the two external sources; the live skill-advisor `UserPromptSubmit` hook (the persistence "thermostat" we can ride).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework absorbed only the distilled `Fable5.md` doctrine (round 1). The two new sources encode far more — concrete rituals (mutation-as-epistemology, adversarial-review-at-scale, scar-tissue curation, cold-successor handoff), persistence mechanisms (a `UserPromptSubmit` governor hook), measurement (`leak_test.py`: tool:text ratio, opener%, caveat%, words/msg), and Opus-specific recursion-control. We do not yet know which Public-repo surfaces should carry which of these, ranked by leverage and read-reliability, deduped against what round 1 already shipped.

### Purpose
Produce a ranked, tiered, sign-off-ready map of surface×delta recommendations that move our AIs toward fable-5 efficiency — research-only, no framework edits this round.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (the research must deliver)
- **Pillar 1 — EXTRACT:** every net-new fable-5 technique/mechanism in `external/fable-mode-main/` + `external/opus-fable-mode-main/` vs `external/Fable5.md` and round-1's shipped set; tag each `doctrine | ritual | mechanism | measurement | model-specific`.
- **Pillar 2 — SURFACE MAP:** every adjustable Public-repo surface with read-reliability per runtime (OpenCode/Claude/Codex): `AGENTS.md`/`CLAUDE.md` §1-7; the ~17 `system-spec-kit/constitutional/` memories; skills (`sk-code`, `sk-prompt`, `sk-doc`, `sk-git`, `deep-loop-workflows`, `system-spec-kit`, `system-skill-advisor`); agents (`orchestrate`, `code`, `review`, `context`, `debug`, `deep-*`, `markdown`, `ai-council`); commands (`deep/*`, `speckit/*`, `memory/*`); and hot mechanisms — the skill-advisor `UserPromptSubmit` hook, the hook system, skill-advisor scoring/triggers, the deep-loop runtime, executor-config.
- **Pillar 3 — OPTIMIZE:** a ranked surface×delta set scored by behavioral-leverage / (cost + blast-radius), deduped vs round 1, tiered A (doctrine text) / B (mechanisms: ride the live hook for a fable-5 governor; recursion-control + "reason about the problem, not yourself" into agent prompts; lexicon + register-split) / C (measurement: a leak_test-style metric as a `/doctor` or `deep:*-benchmark` surface).
- Assess carried round-1 follow-ups: the machine-checkable evidence contract; the codex SIGKILL/silent-gpt-5-fallback hardening.

### Out of Scope
- Implementation of any recommendation — deferred to a gated, owner-approved follow-up.
- Re-recommending round-1's shipped set (Operating Discipline subsection, the 2 constitutional rules, the folded bullet, the sk-code line).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `149/002-.../research/research.md` | Create (by the loop) | Merged 2-lineage research output |
| `149/002-.../recommendations.md` | Create | The ranked, tiered surface×delta recommendation map (the deliverable) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Two-lineage research runs on the correct models | codex lineage on gpt-5.5 (not silent gpt-5); opus lineage on claude-opus-4-8/account2; merged research.md present |
| REQ-002 | Ranked, tiered, deduped recommendation map | Every item tagged tier + leverage + blast + dedup-vs-round-1; nothing re-recommends round-1's set |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | All three pillars answered | EXTRACT + SURFACE MAP + OPTIMIZE present in research.md |
| REQ-004 | Research-only discipline | No framework surface edited this round |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A merged `research.md` synthesized across both lineages, answering the 3 pillars.
- **SC-002**: A `recommendations.md` ranked/tiered map the owner can approve item-by-item, deduped vs round 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | codex SIGKILL / silent gpt-5 fallback (round-1 blocker) | High | Pre-flight smoke (passed); verify lineage model in logs; fail loud |
| Risk | account2 quota for the opus lineage | Med | Proven this session; merge tolerates a degraded lineage but flag |
| Dependency | live skill-advisor `UserPromptSubmit` hook | — | Already present; a ride-along surface for Tier B |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fanout runs both lineages in parallel (concurrency 2); wall time bounded by the slower lineage.

### Security
- **NFR-S01**: Read-only research; no secrets, no writes outside the 002 packet.

### Reliability
- **NFR-R01**: A degraded lineage is flagged, not silently accepted (the round-1 lesson).

---

## 8. EDGE CASES

### Data Boundaries
- A lineage converges before its iteration cap — acceptable (convergence detection).
- The opus lineage hits a quota limit — the merge proceeds with the codex lineage + a flagged gap.

### Error Scenarios
- codex degrades to gpt-5 silently — caught by the model-verification gate; fail loud.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Whole-repo surface map + 2 mechanism-rich sources |
| Risk | 8/25 | Research-only; no framework edits |
| Research | 18/20 | 15 iterations, 2 models, broad surface space |
| Multi-Agent | 10/15 | 2 heterogeneous lineages + merge |
| Coordination | 6/15 | Builds on round 1; dedup required |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | codex silent gpt-5 fallback | H | M | Model-verification gate; fail loud |
| R-002 | Recommendations duplicate round 1 | M | M | Explicit dedup pillar |
| R-003 | Scope creep into implementation | M | L | Research-only; gated follow-up |

---

## 11. USER STORIES

### US-001: Owner reviews a ranked surface map (Priority: P0)
**As the** repo owner, **I want** a ranked, tiered map of where to add fable-5 logic, **so that** I can approve the highest-leverage, lowest-blast changes item-by-item.

**Acceptance Criteria**:
1. Given the merged research, When I open `recommendations.md`, Then I see tiered items with leverage/blast/dedup tags.

### US-002: Any AI gets closer to fable-5 efficiency (Priority: P1)
**As an** operator, **I want** the recommendations to cover mechanisms + measurement (not just doctrine text), **so that** the gains are persistent and measurable.

**Acceptance Criteria**:
1. Given the recommendation map, When I read Tier B/C, Then it includes the live-hook governor + a behavioral metric.

---

## 12. OPEN QUESTIONS

- None blocking. Implementation scope (which tier items to land) is a gated follow-up the owner directs after review.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research output**: `research/research.md` (merged); **Recommendations**: `recommendations.md`
