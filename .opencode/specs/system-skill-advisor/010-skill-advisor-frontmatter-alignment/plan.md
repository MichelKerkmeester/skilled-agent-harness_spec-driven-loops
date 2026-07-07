---
title: "Implementation Plan: Phase 21: system-skill-advisor Frontmatter Alignment"
description: "Normalize the 15 system-skill-advisor reference docs to the canonical frontmatter contract; largest per-skill slice of the 009 campaign."
trigger_phrases:
  - "system-skill-advisor frontmatter plan"
  - "advisor reference doc contract"
  - "skill doc contract phase 21"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:31:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 15 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-021-system-skill-advisor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: system-skill-advisor Frontmatter Alignment

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
| **Storage** | `.opencode/skills/system-skill-advisor/references/**/*.md` (15 docs, no assets) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill system-skill-advisor --coverage` + Python local-mode advisor smoke |

### Overview
system-skill-advisor owns the checker and the doc-harvest consumer, so its own 15 references must model the contract exactly. 14 docs carry partial detailed blocks (all missing `contextType`, 8 also missing `importance_tier`), one hook doc carries title+description only, and five docs sit at `important` tier outside the contract's formal-contract criterion.
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
1. Coverage-mode check enumerates per-doc violations
2. Each doc's leading fence is patched (missing fields added, tier judgment applied, weak phrases replaced)
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored doc phrase routes to system-skill-advisor with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (15/15 docs failing: 15 missing `contextType`, 8 missing `importance_tier`, 1 missing `trigger_phrases`)
- [x] Tier policy applied per doc: `important` reserved for the five contract/policy docs (db path policy, daemon lease, freshness, legacy tool bridge, hook operator contract)

### Phase 2: Core Implementation
- [x] `hooks/skill_advisor_hook.md`: author 5 trigger phrases from the runtime matrix; tier `important`; contextType `implementation`
- [x] 4 contract/policy docs to tier `important`; ADR summary, references and runbooks stay or move to `normal` (5 demotions)
- [x] contextType assigned: `implementation` x12, `planning` (extraction roadmap), `research` (validation baselines), `general` (deferred decisions)
- [x] `graph/skill_graph_extraction_plan.md`: replace single-token phrase `lib/skill-graph` and generic `skill graph database` with multi-word distinctive phrases

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks system-skill-advisor first with a doc signal
- [x] git diff confined to frontmatter hunks (15 files, 36 insertions, 7 deletions)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 15 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill system-skill-advisor --coverage` |
| Routing smoke | Authored doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
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

- **Trigger**: A consumer turns out to depend on the prior tier values or the replaced extraction-plan phrases
- **Procedure**:
  1. `git checkout -- .opencode/skills/system-skill-advisor/references/` (15 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
