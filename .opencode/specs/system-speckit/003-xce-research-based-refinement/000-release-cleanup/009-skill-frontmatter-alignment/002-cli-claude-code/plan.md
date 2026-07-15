---
title: "Implementation Plan: Phase 2: cli-claude-code Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto the 6 cli-claude-code reference/asset docs; first net-new authoring phase of the 009 campaign."
trigger_phrases:
  - "cli-claude-code frontmatter plan"
  - "frontmatter authoring phase"
  - "claude code doc contract plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/002-cli-claude-code"
    last_updated_at: "2026-06-11T12:45:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 6 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-002-cli-claude-code"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: cli-claude-code Frontmatter Alignment

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
| **Storage** | `.opencode/skills/cli-claude-code/references/*.md` (4 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill cli-claude-code --coverage` + Python local-mode advisor smoke |

### Overview
cli-claude-code is the first net-new authoring phase: all 6 docs carried title+description only, so the work is authoring trigger_phrases from each doc body plus tier/contextType judgment, not normalizing an existing block. Phrases are executor-prefixed ("claude code ...") so the doc signal stays distinctive against sibling cli-* skills.
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
Frontmatter-only authoring: the three missing contract fields are appended inside the leading YAML fence, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations
2. Each doc body is read; trigger_phrases authored from its actual sections, tier/contextType applied
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to cli-claude-code with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (6/6 docs missing trigger_phrases, importance_tier, contextType)
- [x] Contract enums confirmed against the checker (3-8 phrases, tier + contextType vocabularies)

### Phase 2: Core Implementation
- [x] `agent_delegation.md`, `claude_tools.md`, `integration_patterns.md`: full block authored, tier `normal`, contextType `implementation`
- [x] `cli_reference.md`: full block authored, tier `important` (formal flag/invocation contract for dispatch)
- [x] `prompt_quality_card.md`, `prompt_templates.md`: full block authored, tier `normal`, contextType `implementation`

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks cli-claude-code first with a doc signal
- [x] git diff confined to frontmatter hunks (additions only)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 6 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill cli-claude-code --coverage` |
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

- **Trigger**: A consumer turns out to depend on the prior title+description-only frontmatter shape
- **Procedure**:
  1. `git checkout -- .opencode/skills/cli-claude-code/references/ .opencode/skills/cli-claude-code/assets/` (6 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
