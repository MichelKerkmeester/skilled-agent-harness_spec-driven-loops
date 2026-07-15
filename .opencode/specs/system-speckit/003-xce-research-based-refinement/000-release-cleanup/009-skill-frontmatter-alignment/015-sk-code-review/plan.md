---
title: "Implementation Plan: Phase 15: sk-code-review Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto all 10 sk-code-review reference docs; first all-net-new-authoring phase of the 009 campaign."
trigger_phrases:
  - "sk-code-review frontmatter plan"
  - "review skill doc authoring"
  - "frontmatter net new authoring phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/015-sk-code-review"
    last_updated_at: "2026-06-11T12:55:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Authoring executed: 10 docs conform and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/references/review_core.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-015-sk-code-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: sk-code-review Frontmatter Alignment

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
| **Storage** | `.opencode/skills/sk-code-review/references/*.md` (10 docs, no assets) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-code-review --coverage` + Python local-mode advisor smoke |

### Overview
sk-code-review is the first pure net-new-authoring phase: 9 of 10 references carried title+description only and `pr_state_dedup.md` carried no frontmatter at all, so every detailed block (trigger_phrases, importance_tier, contextType) is authored fresh from the doc bodies. Phrase selection stays distinctive against the deep-review skill: this skill is the stack-agnostic review-standards baseline, not the iterative loop.
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
Frontmatter-only authoring: the leading YAML fence is extended in place (or created above the H1 for the one fence-less doc); body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Phrase policy**: 3-6 lowercase multi-word phrases per doc, derived from section content, distinct from deep-review loop vocabulary
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (baseline: 10/10 failing)
2. Each doc's leading fence gains trigger_phrases, importance_tier, contextType; `pr_state_dedup.md` gains the full block including authored title and description
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to sk-code-review with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (10/10 docs failing: 9 missing the three detailed fields, 1 with no leading frontmatter block)
- [x] Doc bodies skimmed (section headers plus full reads where needed) to ground phrase authoring

### Phase 2: Core Implementation
- [x] 9 docs with title+description: detailed fields appended inside the existing fence
- [x] `pr_state_dedup.md`: full canonical block authored above the H1
- [x] Tier judgment: `review_core.md` and `pr_state_dedup.md` to `important` (formal contracts); 8 checklists/indexes stay `normal`
- [x] contextType judgment: `implementation` default; `planning` for `removal_plan.md` (a planning template); `general` for `quick_reference.md` (an index)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks sk-code-review first with a doc signal
- [x] git diff confined to frontmatter hunks (insertions only, 83 lines)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 10 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-code-review --coverage` |
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

- **Trigger**: A consumer turns out to depend on the bare title+description shape or mis-routes on an authored phrase
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-code-review/references/` (10 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
