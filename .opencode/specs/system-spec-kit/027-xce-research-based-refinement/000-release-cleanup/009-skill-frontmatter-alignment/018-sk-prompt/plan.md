---
title: "Implementation Plan: Phase 18: sk-prompt Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto the 5 sk-prompt reference/asset docs; net-new authoring since none carried the detailed block."
trigger_phrases:
  - "sk-prompt frontmatter plan"
  - "prompt skill doc contract"
  - "format guide frontmatter authoring"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/018-sk-prompt"
    last_updated_at: "2026-06-11T09:37:49Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 5 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/depth_framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-018-sk-prompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: sk-prompt Frontmatter Alignment

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
| **Storage** | `.opencode/skills/sk-prompt/references/*.md` (2 docs) + `assets/*.md` (3 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-prompt --coverage` + Python local-mode advisor smoke |

### Overview
sk-prompt is a net-new authoring phase: all 5 docs carried title+description only, so trigger_phrases, importance_tier, and contextType are authored fresh from each doc's body. The only pre-existing drift beyond the missing block is the folded multi-line `description: >` scalar on the 3 format-guide assets, which the contract's one-line description rule collapses.
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
Frontmatter-only authoring: the leading YAML fence is rewritten in place, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations
2. Each doc body is read; distinctive trigger phrases derived from actual section content
3. Each doc's leading fence is patched (phrases, tier judgment, contextType, one-line description)
4. Coverage re-check must report 0 violations for the skill
5. Python local-mode smoke proves an authored phrase routes to sk-prompt with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (5/5 docs failing on missing trigger_phrases, importance_tier, contextType)
- [x] All 5 doc bodies read for phrase derivation and tier/contextType judgment

### Phase 2: Core Implementation
- [x] 3 format-guide assets: full block authored, folded descriptions collapsed to one line, contextType `implementation`
- [x] `patterns_evaluation.md`: full block authored, tier `normal`, contextType `implementation`
- [x] `depth_framework.md`: full block authored, tier `important` (formal invariant doc: blocking gates, canonical energy-level table)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks sk-prompt first with doc signals
- [x] git diff confined to frontmatter hunks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 5 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-prompt --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks | `git diff` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 contract decision | Internal | Green | Cannot author without a fixed contract |
| Contract checker script | Internal | Green | No deterministic per-skill verification |
| Live daemon matchedDocs smoke | Internal | Deferred | Covered campaign-wide by packet 145 T025 after session-cycle adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer turns out to depend on the prior folded descriptions or absence of the detailed block
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-prompt/references/ .opencode/skills/sk-prompt/assets/` (5 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
