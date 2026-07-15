---
title: "Implementation Plan: Phase 5: deep-ai-council Frontmatter Alignment"
description: "Normalize 17 deep-ai-council docs to the canonical frontmatter contract and author the missing block on 1 asset; largest doc set so far in the 009 campaign."
trigger_phrases:
  - "deep-ai-council frontmatter plan"
  - "council doc contract normalization"
  - "skill doc frontmatter campaign"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/011-skill-frontmatter-standardization/001-deep-ai-council-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:45:08Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 18 docs conform and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/references/structure/output_schema.md"
      - ".opencode/skills/deep-ai-council/assets/prompt_pack_round.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-005-deep-ai-council"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: deep-ai-council Frontmatter Alignment

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
| **Storage** | `.opencode/skills/deep-ai-council/references/*.md` (15 docs) + `assets/*.md` (3 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill deep-ai-council --coverage` + Python local-mode advisor smoke |

### Overview
deep-ai-council mixes every drift class the campaign expects: 13 references with `contextType: reference` (outside the enum), 2 references and 2 assets missing `importance_tier`/`contextType` entirely, and 1 asset with no frontmatter at all that needs net-new authoring. The patch follows the 008 pilot recipe: leading-fence-only edits, tier judgment for formal contract docs, deterministic re-check, daemon-independent routing smoke.
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
Frontmatter-only normalization: the leading YAML fence is edited in place, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (18/18 docs failing at baseline)
2. Each doc's leading fence is patched (contextType enum, tier judgment, missing fields, net-new block)
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves doc phrases route to deep-ai-council with `(signal)` reasons
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (18/18 docs failing: 13 enum drift, 4 missing fields, 1 no frontmatter)
- [x] Tier candidates identified from doc bodies (dispatch and artifact-layout contracts)

### Phase 2: Core Implementation
- [x] 13 references: `contextType: reference` normalized to `planning` (workflow rules) or `implementation` (persistence/parser/graph machinery)
- [x] `depth_dispatch.md`, `folder_layout.md`, `output_schema.md`, `state_format.md`: tier to `important` (formal contracts)
- [x] `loop_protocol.md`, `quick_reference.md` + 2 template assets: missing `importance_tier`/`contextType` added
- [x] `prompt_pack_round.md`: full canonical block authored from doc content (no frontmatter before)
- [x] Phrase hygiene: `two-of-three-agree` to multi-word; uppercase `CLI`/`YAML` phrases lowercased

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke surfaces deep-ai-council with doc signals
- [x] git diff confined to frontmatter hunks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 18 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill deep-ai-council --coverage` |
| Routing smoke | Doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks | `git diff -U0` hunk-header review |
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

- **Trigger**: A consumer turns out to depend on `contextType: reference`, the prior tier values, or the removed phrase spellings
- **Procedure**:
  1. `git checkout -- .opencode/skills/deep-ai-council/references/ .opencode/skills/deep-ai-council/assets/` (18 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
