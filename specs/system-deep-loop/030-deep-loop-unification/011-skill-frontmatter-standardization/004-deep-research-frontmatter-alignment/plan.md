---
title: "Implementation Plan: Phase 9: deep-research Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto all 15 deep-research reference/asset docs; first net-new authoring phase of the 009 campaign."
trigger_phrases:
  - "deep-research frontmatter plan"
  - "frontmatter net-new authoring"
  - "research doc contract plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/011-skill-frontmatter-standardization/004-deep-research-frontmatter-alignment"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Authoring executed: 15 docs conform and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-research/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-009-deep-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: deep-research Frontmatter Alignment

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
| **Storage** | `.opencode/skills/deep-research/references/**/*.md` (13 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill deep-research --coverage` + Python local-mode advisor smoke |

### Overview
deep-research is the campaign's first net-new authoring phase: all 15 docs carried title+description only, so trigger_phrases, importance_tier, and contextType are authored from doc content rather than normalized. Phrases must stay distinctive against the five sibling deep-* skills whose docs already carry phrases, so generic loop vocabulary is prefixed with "research".
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
Frontmatter-only authoring: the leading YAML fence is rebuilt in place via an assertion-guarded Python patch (title/description lines kept verbatim), body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Phrase distinctiveness**: sibling deep-* phrase corpus harvested first; research-prefixed phrases avoid collisions (e.g. "research stopreason values" vs deep-review's bare "stopreason values")
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Heading scan + first ~60 lines per doc source the phrases; sibling phrase corpus rules out collisions
2. Each doc's leading fence is rebuilt (5 contract fields, sibling YAML style)
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to deep-research with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Baseline confirmed: 15/15 docs title+description only, closing fence at line 4, no folded scalars, no non-contract keys
- [x] Sibling phrase corpus harvested (deep-loop-runtime, deep-review, deep-context, deep-ai-council, deep-improvement) to keep new phrases distinctive

### Phase 2: Core Implementation
- [x] 5-8 trigger phrases authored per doc from headings/content, research-prefixed where loop-generic
- [x] Tier judgment: 5 formal contract docs to `important` (convergence.md, loop_protocol.md, spec_check_protocol.md, capability_matrix.md, state_format.md); 10 stay `normal`
- [x] contextType: `implementation` for runtime-behavior references, `general` for cheat sheet + dashboard template, `planning` for strategy template + reference-only models

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks deep-research first with a doc signal
- [x] git diff confined to frontmatter hunks (insertions only, all at line 3)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 15 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill deep-research --coverage` |
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
| Sibling phrase corpus (phases 004-008 done) | Internal | Green | Phrase distinctiveness cannot be checked |
| Live daemon matchedDocs smoke | Internal | Deferred | Covered campaign-wide by packet 145 T025 after session-cycle adoption |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer turns out to mis-route on the authored phrases or tier choices
- **Procedure**:
  1. `git checkout -- .opencode/skills/deep-research/references/ .opencode/skills/deep-research/assets/` (15 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
