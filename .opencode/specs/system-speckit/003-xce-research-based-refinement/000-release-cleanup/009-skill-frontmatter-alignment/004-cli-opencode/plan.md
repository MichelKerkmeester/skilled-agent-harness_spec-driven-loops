---
title: "Implementation Plan: Phase 4: cli-opencode Frontmatter Alignment"
description: "Author the canonical frontmatter contract on all 9 cli-opencode reference/asset docs; first net-new authoring phase after the pilot."
trigger_phrases:
  - "cli-opencode frontmatter plan"
  - "frontmatter authoring phase"
  - "cli skill doc contract"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/004-cli-opencode"
    last_updated_at: "2026-06-11T09:38:23Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 9 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-004-cli-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: cli-opencode Frontmatter Alignment

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
| **Storage** | `.opencode/skills/cli-opencode/references/*.md` (7 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill cli-opencode --coverage` + Python local-mode advisor smoke |

### Overview
cli-opencode is a net-new authoring phase: all 9 docs carried title+description only, so unlike the pilot every doc needed trigger_phrases authored from its actual body plus tier and contextType judgment. Phrases are prefixed with "opencode" where natural so they stay distinctive against the sibling cli-claude-code and cli-codex skills.
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
Frontmatter-only authoring: read each body first, derive 4-7 distinctive lowercase phrases from it, extend the leading YAML fence in place, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal dispatch-contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (9/9 missing the detailed block)
2. Each doc's body is read; the leading fence gains trigger_phrases, importance_tier, contextType
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to cli-opencode with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (9/9 docs missing trigger_phrases, importance_tier, contextType)
- [x] Each doc body read in full before authoring phrases

### Phase 2: Core Implementation
- [x] 7 references authored: tier `important` for `cli_reference.md` (invocation contract), `integration_patterns.md` (stdin/self-invocation rules), `destructive_scope_violations.md` (RM-8 safety invariant); rest `normal`
- [x] 2 assets authored: `prompt_quality_card.md` (planning), `prompt_templates.md` (implementation)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode authored-phrase smoke ranks cli-opencode first with a doc signal
- [x] This phase's hunks confined to the leading YAML fences
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 9 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill cli-opencode --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks from this phase | `git diff` review |
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

- **Trigger**: A consumer rejects the authored phrases or tier/contextType choices
- **Procedure**:
  1. Revert the frontmatter hunks in the 9 files (the leading-fence additions are self-contained; 3 files also carry unrelated in-flight body hunks from the 028 branch session, so revert by hunk, not by file)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
