---
title: "Implementation Plan: Phase 19: sk-prompt-models Frontmatter Alignment"
description: "Author the full canonical frontmatter block on all 14 sk-prompt-models reference/asset docs; first phase combining net-new authoring with model-profile registry-key cleanup."
trigger_phrases:
  - "sk-prompt-models frontmatter plan"
  - "model profile frontmatter authoring"
  - "small model doc contract plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/019-sk-prompt-models"
    last_updated_at: "2026-06-11T13:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "14 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/_index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-019-sk-prompt-models"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: sk-prompt-models Frontmatter Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown YAML frontmatter only |
| **Framework** | Canonical contract from 001 (operator Option B, 2026-06-11) |
| **Storage** | `.opencode/skills/sk-prompt-models/references/**/*.md` (12 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-prompt-models --coverage` + Python local-mode advisor smoke |

### Overview
Unlike the pilot, none of the 14 docs carried the detailed block, so this phase is net-new authoring: trigger_phrases, importance_tier, and contextType for every doc. The seven per-model prompt-craft profiles also carried non-contract registry keys (model_id, profile_of, status, last_benchmarked) and no description at all, so each gets an authored one-line description plus model-named trigger phrases for distinct routing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Frontmatter-only normalization: the leading YAML fence is rewritten in place with exactly the five contract fields, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `deprecated` for superseded content, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (14/14 failing at baseline)
2. Each doc's leading fence is rewritten: contract fields authored, registry keys dropped
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored model phrase routes to sk-prompt-models with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (14/14 docs failing; 7 model profiles also missing description)
- [x] Contract enums confirmed against the checker (mirrors the fsrs-scheduler vocabulary)

### Phase 2: Core Implementation
- [x] 7 model profiles: authored description + model-named trigger phrases; dropped model_id/profile_of/status/last_benchmarked
- [x] 5 non-profile references + 2 assets: authored trigger_phrases, tier, contextType on top of kept descriptions
- [x] Tier judgments: `important` for the canonical CLI prompt quality card; `deprecated` for the historical minimax-2.7 profile

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks sk-prompt-models first with doc signals
- [x] git diff confined to frontmatter hunks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 14 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-prompt-models --coverage` |
| Routing smoke | Authored model phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks | `git diff` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 contract decision | Internal | Green | Cannot normalize without a fixed contract |
| Contract checker script | Internal | Green | No deterministic per-skill verification |
| Live daemon matchedDocs smoke | Internal | Deferred | Covered campaign-wide by packet 145 T025 after session-cycle adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer turns out to depend on the removed model-profile registry keys (model_id, profile_of, status, last_benchmarked) or the prior frontmatter shape
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-prompt-models/references/ .opencode/skills/sk-prompt-models/assets/` (14 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
