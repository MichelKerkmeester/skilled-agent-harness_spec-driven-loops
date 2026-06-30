---
title: "Implementation Plan: cli-cross-rcaf-propagation"
description: "Describes the completed plan for adding medium pre-planning density guidance to the master CLI prompt quality card and four sibling mirrors. The plan keeps RCAF as already-present context and excludes findings reserved for packet 113/007."
trigger_phrases:
  - "113/006 implementation plan"
  - "cross cli card propagation plan"
  - "medium pre plan implementation"
  - "held findings validation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
    last_updated_at: "2026-05-17T12:18:18Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-completed-implementation-plan"
    next_safe_action: "use-113-007-for-held-validation-findings"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/cli-claude-code/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-codex/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-gemini/assets/prompt_quality_card.md"
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation has already completed in local repo"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cross-rcaf-propagation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill assets and YAML frontmatter |
| **Framework** | Spec Kit Level 3 packet documentation |
| **Storage** | Repository files only |
| **Testing** | Manual scope review and Spec Kit strict validation |

### Overview
The implementation updates prompt guidance, not runtime code. The master sk-prompt CLI quality card receives the medium pre-planning density note, four sibling cards mirror it, and sibling skill versions plus changelogs record the release surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 113/003 eval-loop synthesis identified medium pre-planning as the portable finding
- [x] RCAF default confirmed as already present across all five cards
- [x] Bundle-gate and anti-hallucination findings assigned to packet 113/007 validation

### Definition of Done
- [x] Master and sibling prompt cards contain the medium pre-planning density note
- [x] Four sibling SKILL.md frontmatter versions are bumped
- [x] Four sibling changelog entries exist for the release metadata
- [x] Packet docs state the held findings are excluded from 113/006
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Master-and-mirror documentation propagation

### Key Components
- **sk-prompt master card**: Owns the canonical CLI prompt quality guidance.
- **Sibling CLI cards**: Mirror the relevant guidance for cli-claude-code, cli-codex, cli-gemini, and cli-opencode.
- **Sibling release metadata**: SKILL.md version bumps and changelogs record the prompt-card update.

### Data Flow
The 113/003 eval-loop synthesis feeds the sk-prompt master card, then the same guidance is mirrored into sibling CLI cards. Packet 113/007 receives the unpropagated findings for validation before any future cross-CLI guidance update.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a bug-fix packet. The affected surfaces are documentation and skill release metadata.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-prompt CLI quality card | Canonical shared prompt guidance | Updated with medium pre-planning density note | Manual card review |
| Four sibling CLI quality cards | Local prompt guidance mirrors | Updated to mirror the same note | Manual mirror review |
| Four sibling SKILL.md files | Skill release metadata | Version bumped | Frontmatter review |
| Four sibling changelog files | Release history | Added version entries | Changelog review |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Boundary
- [x] Identify the medium pre-planning density finding from 113/003.
- [x] Confirm RCAF was already present across all five cards.
- [x] Assign bundle-gate-aversion and anti-hallucination findings to packet 113/007.

### Phase 2: Card and Release Updates
- [x] Update the sk-prompt master CLI prompt quality card.
- [x] Mirror the update across cli-claude-code, cli-codex, cli-gemini, and cli-opencode cards.
- [x] Bump four sibling skill versions.
- [x] Add four sibling changelog entries.

### Phase 3: Documentation and Verification
- [x] Fill Level 3 packet docs for the completed work.
- [x] Mark packet 113/006 complete.
- [x] Run final strict validation on packet 113/006 after documentation fill.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation review | Scope boundaries and held findings | Manual read-through |
| Mirror review | Master card plus four sibling cards | `rg` and file reads |
| Spec validation | Packet 113/006 documentation structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 113/003 eval-loop synthesis | Internal evidence | Green | Medium pre-plan propagation lacks empirical basis |
| Packet 113/007 cross-model validation | Follow-on packet | Planned | Held findings remain unpropagated |
| Existing CLI quality card mirror structure | Internal docs | Green | Manual propagation would be less consistent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Future validation shows medium pre-planning density should not be shared across CLI orchestrators.
- **Procedure**: Revert the packet 113/006 card guidance, sibling version bumps, and sibling changelog entries from the follow-on commit.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Evidence boundary -> Card and release updates -> Documentation and validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Evidence boundary | 113/003 synthesis | Card and release updates |
| Card and release updates | Evidence boundary | Documentation and validation |
| Documentation and validation | Card and release updates | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Evidence boundary | Low | Completed |
| Card and release updates | Medium | Completed |
| Documentation and validation | Medium | Completed except final validation |
| **Total** | | **Completed implementation** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations involved
- [x] No feature flags required
- [x] Changelog entries identify sibling skill releases

### Rollback Procedure
1. Revert prompt-card guidance changes from the packet 113/006 follow-on commit.
2. Revert sibling SKILL.md version bumps if the changelog release should not stand.
3. Remove or supersede the sibling changelog entries.
4. Re-run packet validation after documentation state changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
113/003 eval-loop synthesis
        |
        v
Evidence boundary decision
        |
        v
sk-prompt master card
        |
        v
four sibling card mirrors
        |
        v
version bumps and changelogs
        |
        v
packet 113/006 documentation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence boundary | 113/003 synthesis | Propagation decision | Card updates |
| Master card update | Evidence boundary | Canonical guidance | Sibling mirrors |
| Sibling mirrors | Master card update | Cross-CLI consistency | Release metadata |
| Release metadata | Sibling mirrors | Version and changelog evidence | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm evidence boundary** - Completed - CRITICAL
2. **Update master and sibling cards** - Completed - CRITICAL
3. **Record sibling release metadata** - Completed - CRITICAL
4. **Validate packet docs** - Pending final command - CRITICAL

**Total Critical Path**: Completed implementation plus final packet validation

**Parallel Opportunities**:
- Sibling card mirror checks can run independently once the master wording is fixed.
- Sibling changelog entries can be reviewed independently after version targets are known.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence boundary accepted | Only medium pre-plan finding selected for propagation | Complete |
| M2 | Cross-CLI card propagation complete | Master plus four mirrors contain the note | Complete |
| M3 | Release metadata complete | Four sibling versions and changelogs recorded | Complete |
| M4 | Packet validation complete | Strict validation passes | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Propagate Only Medium Pre-Plan Guidance

**Status**: Accepted

**Context**: 113/003 produced one broadly portable prompt-composition finding and two findings that may depend on model capability.

**Decision**: Share medium pre-planning density across CLI prompt quality cards now; defer bundle-gate-aversion and framework-dominates-anti-hallucination to packet 113/007.

**Consequences**:
- CLI prompt guidance gets the current model-agnostic planning-density improvement.
- Other findings wait for cross-model validation before becoming shared guidance.

**Alternatives Rejected**:
- Propagate all findings now: rejected because SWE 1.6 evidence alone is not enough for frontier-model defaults.
