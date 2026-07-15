---
title: "Implementation Plan: Phase 7: deep-improvement Frontmatter Alignment"
description: "Normalize all 22 deep-improvement reference/asset docs to the canonical frontmatter contract: enum fixes, tier judgment, and net-new authoring for 4 docs."
trigger_phrases:
  - "deep-improvement frontmatter plan"
  - "frontmatter mass authoring phase"
  - "skill doc contract normalization"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/011-skill-frontmatter-standardization/002-deep-improvement-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:54:32Z"
    last_updated_by: "claude-fable"
    recent_action: "Executed: 22 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/references/shared/promotion_gate_contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-007-deep-improvement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: deep-improvement Frontmatter Alignment

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
| **Storage** | `.opencode/skills/deep-improvement/references/*.md` + `assets/*.md` (22 docs, 7 asset READMEs exempt) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill deep-improvement --coverage` + Python local-mode advisor smoke |

### Overview
deep-improvement is the largest phase so far: 22 in-scope docs across three lanes (agent_improvement, model_benchmark, skill_benchmark plus shared). Drift spans four states — 5 fully-detailed docs with `contextType: reference` outside the enum, 12 partial docs missing tier and contextType, 3 docs with title+description only, and 1 doc with no frontmatter at all — so the phase mixes pure normalization with net-new phrase authoring.
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
Frontmatter-only normalization: the leading YAML fence is rewritten in place via an assertion-guarded Python patch (per-file title guard before replacement), body bytes stay untouched. Critical here because several deep-improvement files carry pre-existing uncommitted body modifications from another session that must not be disturbed.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Phrase policy**: 3-8 distinctive lowercase multi-word phrases from actual doc content; single-token, command-name, and finding-id phrases replaced
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Frontmatter dump enumerates per-doc state (full / partial / title-only / none)
2. Heading scans (`grep -n "^#"`) plus first-60-line reads feed phrase authoring for the 12 docs needing new or repaired phrases
3. One guarded Python pass patches all 22 leading fences
4. Coverage re-check must report 0 violations; Python local-mode smoke proves a doc phrase routes to deep-improvement with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Frontmatter state captured for all 22 docs (5 full-with-enum-drift, 12 partial, 3 title-only, 1 bare)
- [x] Contract enums confirmed against the checker (`IMPORTANCE_TIERS`, `CONTEXT_TYPES` in check-skill-doc-frontmatter.mjs)

### Phase 2: Core Implementation
- [x] Enum fix: 5 docs move `contextType: reference` to a canonical value
- [x] Completion: 12 partial docs gain `importance_tier` + `contextType`; weak phrases replaced (profiling_audit_log, mixed_executor_methodology, integration_scanning, skill_benchmark operator_guide)
- [x] Net-new authoring: 3 title-only docs gain phrases + tier + contextType; `heldout_and_gold_sets.md` gains the full block
- [x] Tier judgment: 7 formal contract docs at `important` (4 kept, 3 added); 2 Lane C guides demoted from `important` to `normal`

### Phase 3: Verification
- [x] Coverage check green for the skill (docs=22, violations=0)
- [x] Python local-mode doc-phrase smoke routes deep-improvement with a `(signal)` reason
- [x] git diff confined to frontmatter hunks for this phase's edits (pre-existing body hunks from another session left alone)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 22 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill deep-improvement --coverage` |
| Routing smoke | Doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks from this phase | `git diff` review |
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

- **Trigger**: A consumer turns out to depend on `contextType: reference`, the prior tier values, or the replaced trigger phrases
- **Procedure**:
  1. Revert the frontmatter hunks per file (cannot blanket `git checkout` — some files carry unrelated uncommitted body changes from another session)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
