---
title: "Implementation Plan: Phase 10: deep-review Frontmatter Alignment"
description: "Bring all 12 deep-review reference/asset docs onto the canonical frontmatter contract: complete 3 partial detailed blocks and author 9 net-new blocks."
trigger_phrases:
  - "deep-review frontmatter plan"
  - "review skill doc contract"
  - "frontmatter campaign phase ten"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/011-skill-frontmatter-standardization/005-deep-review-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:50:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 12 docs aligned and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/references/protocol/loop_protocol.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-010-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: deep-review Frontmatter Alignment

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
| **Storage** | `.opencode/skills/deep-review/references/**/*.md` (10 docs) + `assets/*.md` (2 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill deep-review --coverage` + Python local-mode advisor smoke |

### Overview
deep-review mixes both campaign work types: 3 references carry a partial detailed block (good trigger_phrases, no tier/contextType), while 9 docs carry title+description only and need net-new phrase authoring. The plan completes the 3 partials additively and authors 9 full blocks with phrases derived from each doc's actual sections, kept distinctive against sibling deep-* skills.
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
Frontmatter-only normalization: the leading YAML fence is edited in place, body bytes stay untouched. All hunks are additive (insert fields before the closing fence).

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Phrase policy**: 3-8 lowercase multi-word phrases per doc, sourced from section headings, distinct from sibling deep-* phrase sets
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (baseline: 12/12 failing)
2. The 3 partial docs gain tier + contextType after their existing phrase lists
3. The 9 minimal docs gain trigger_phrases + tier + contextType after description
4. Coverage re-check must report 0 violations for the skill
5. Python local-mode smoke proves a doc phrase routes to deep-review with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (12/12 docs failing; 3 missing only tier+contextType, 9 missing all detailed fields)
- [x] Sibling deep-* phrase sets extracted to keep new phrases distinctive

### Phase 2: Core Implementation
- [x] 3 partial references (`convergence_signals.md`, `state_outputs.md`, `state_reducer_registry.md`): append tier + contextType, keep existing phrases
- [x] 7 minimal references: author full phrase lists from doc sections; tier `important` for the 4 contract docs, `normal` otherwise
- [x] 2 assets: author full blocks; dashboard `general`, strategy template `planning`

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks deep-review with a doc signal
- [x] git diff confined to additive frontmatter hunks (74 insertions, 0 deletions)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 12 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill deep-review --coverage` |
| Routing smoke | Doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only additive hunks | `git diff` review |
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

- **Trigger**: A consumer turns out to depend on the prior minimal frontmatter shape or the new tier values misroute the advisor
- **Procedure**:
  1. `git checkout -- .opencode/skills/deep-review/references/ .opencode/skills/deep-review/assets/` (12 files, additive frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
