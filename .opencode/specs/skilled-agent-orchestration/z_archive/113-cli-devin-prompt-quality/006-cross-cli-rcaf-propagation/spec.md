---
title: "Feature Specification: cli-cross-rcaf-propagation"
description: "Records the completed propagation of medium pre-planning density guidance across the sk-prompt CLI card and four sibling CLI mirrors. RCAF was already the shared default; this packet documents the narrower completed guidance update."
trigger_phrases:
  - "113/006 cli cross rcaf propagation"
  - "medium pre plan propagation"
  - "cross cli prompt quality card"
  - "rcaf default already present"
  - "bundle gate validation deferred"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
    last_updated_at: "2026-05-17T12:18:18Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-completed-cli-cross-rcaf-propagation"
    next_safe_action: "use-113-007-for-held-validation-findings"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-codex/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-gemini/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "RCAF default was already present in all five quality cards before this packet"
      - "Only medium pre-planning density guidance propagated in this packet"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: cli-cross-rcaf-propagation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Packet 113/006 records completed cross-CLI propagation of the 113/003 eval-loop finding that medium-density pre-planning beats dense pre-planning on SWE 1.6. The work updates the sk-prompt master CLI prompt quality card, mirrors the same guidance into four sibling CLI prompt quality cards, bumps sibling skill frontmatter versions, and adds sibling changelog entries.

**Key Decisions**: propagate only the model-agnostic medium pre-plan finding; keep bundle-gate-aversion and framework-dominates-anti-hallucination out of cross-CLI guidance until packet 113/007 validates them on frontier models

**Critical Dependencies**: packet 113/007 for cross-model validation of the held findings

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 113/003 cli-devin eval-loop measured that medium-density pre-planning outperformed dense pre-planning by roughly 10-15% on SWE 1.6. That finding is prompt-composition guidance rather than a Devin-only runtime behavior, so the sibling CLI orchestrator cards needed the same "just enough structure" instruction.

RCAF did not need new propagation. It was already present as the shared cross-CLI default through the sk-prompt master card and sibling mirrors.

### Purpose
Keep all CLI prompt quality cards aligned on medium pre-planning density while reserving unvalidated model-specific findings for packet 113/007.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a "Pre-planning density" composition-guidance note to the sk-prompt master CLI quality card.
- Mirror the same note into cli-claude-code, cli-codex, cli-gemini, and cli-opencode prompt quality cards.
- Bump four sibling SKILL.md frontmatter versions and add sibling changelog entries for the card update.

### Out of Scope
- Bundle-gate-aversion propagation, because it was measured only on SWE 1.6 and needs packet 113/007 cross-model confirmation.
- Framework-dominates-anti-hallucination propagation, because frontier models may handle strict constraints differently.
- Any runtime dispatch, CLI harness, or scoring pipeline changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | Add master medium pre-planning density note |
| `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md` | Modify | Mirror the medium pre-planning density note |
| `.opencode/skills/cli-codex/assets/prompt_quality_card.md` | Modify | Mirror the medium pre-planning density note |
| `.opencode/skills/cli-gemini/assets/prompt_quality_card.md` | Modify | Mirror the medium pre-planning density note |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | Mirror the medium pre-planning density note |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | Bump version for v1.1.6.0 |
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Bump version for v1.4.3.0 |
| `.opencode/skills/cli-gemini/SKILL.md` | Modify | Bump version for v1.2.6.0 |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Bump version for v1.3.2.0 |
| `.opencode/skills/cli-claude-code/changelog/v1.1.6.0.md` | Create | Record sibling card change |
| `.opencode/skills/cli-codex/changelog/v1.4.3.0.md` | Create | Record sibling card change |
| `.opencode/skills/cli-gemini/changelog/v1.2.6.0.md` | Create | Record sibling card change |
| `.opencode/skills/cli-opencode/changelog/v1.3.2.0.md` | Create | Record sibling card change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve RCAF as the shared default without rewriting it as new work | All five quality cards still use the existing RCAF default wording |
| REQ-002 | Propagate only the medium pre-planning density note | Master and four mirror cards contain the new guidance; no held findings are added |
| REQ-003 | Keep sibling skill release metadata coherent | Four sibling SKILL.md files have matching version bumps and changelog entries |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document why the held findings are excluded | Spec and ADR point to packet 113/007 for validation |
| REQ-005 | Avoid runtime or harness scope creep | No dispatch scripts, scoring scripts, or provider configuration files change in this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The master and four sibling prompt quality cards all include medium pre-planning density guidance.
- **SC-002**: RCAF remains documented as already-present shared default guidance, not as a new packet 113/006 change.
- **SC-003**: Bundle-gate-aversion and anti-hallucination-deprioritization remain deferred to packet 113/007.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 113/007 cross-model validation | Held findings cannot safely propagate without broader evidence | Keep them out of skill bodies until 113/007 completes |
| Risk | Overstating RCAF as new work | Packet history becomes inaccurate | State that RCAF was already present in all five cards |
| Risk | Treating SWE 1.6-specific results as universal | Frontier-model guidance may regress | Propagate only the model-agnostic pre-plan density finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime path changes; skill loading performance is unchanged.

### Security
- **NFR-S01**: No secrets, credentials, provider settings, or dispatch tokens are introduced.

### Reliability
- **NFR-R01**: Guidance remains mirrored across the master card and sibling cards so CLI prompt composition stays consistent.

---

## 8. EDGE CASES

### Data Boundaries
- Existing RCAF wording: Leave it intact unless a future packet explicitly changes shared framework defaults.
- Held findings: Mention only as excluded scope in packet docs, not as operational guidance in skill bodies.

### Error Scenarios
- Mirror drift: Re-check all five prompt quality cards before future card releases.
- Premature propagation: Use packet 113/007 decision gates before adding bundle-gate or anti-hallucination findings cross-CLI.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | 13 files across one master skill and four sibling skills |
| Risk | 8/25 | Documentation and skill metadata only; no runtime code |
| Research | 14/20 | Depends on 113/003 eval-loop synthesis and cross-model deferral judgment |
| Multi-Agent | 0/15 | Main-session documentation and completed local edits only |
| Coordination | 10/15 | Cross-skill mirror consistency and release metadata alignment |
| **Total** | **47/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Held findings propagate before frontier validation | H | M | Document 113/007 as the required validation packet |
| R-002 | Sibling mirrors drift from master card | M | M | Treat sk-prompt card as source and mirror exact guidance intent |
| R-003 | Version bump lacks changelog evidence | M | L | Record one changelog per sibling version |

---

## 11. USER STORIES

### US-001: Shared CLI Prompt Guidance (Priority: P0)

**As a** CLI skill maintainer, **I want** each CLI quality card to prefer medium pre-planning density, **so that** operators get enough planning structure without the dense pre-plan overhead measured against SWE 1.6.

**Acceptance Criteria**:
1. Given any of the five CLI quality cards, When a maintainer checks composition guidance, Then the medium pre-planning density note is present.

---

### US-002: Evidence-Bounded Propagation (Priority: P1)

**As a** prompt guidance maintainer, **I want** SWE 1.6-specific findings held until frontier validation, **so that** cross-CLI defaults do not overfit a small coding-specialized model.

**Acceptance Criteria**:
1. Given packet 113/006 docs, When a maintainer looks for bundle-gate-aversion propagation, Then the docs point to packet 113/007 instead of claiming completion.

---

## 12. OPEN QUESTIONS

- None for packet 113/006. The implementation scope is complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
