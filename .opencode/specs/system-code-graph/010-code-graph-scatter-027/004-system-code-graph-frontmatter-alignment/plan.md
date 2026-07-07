---
title: "Implementation Plan: Phase 20: system-code-graph Frontmatter Alignment"
description: "Normalize the 7 system-code-graph reference docs to the canonical frontmatter contract: add missing tier/contextType on 6, author the full block on launcher_lease.md."
trigger_phrases:
  - "system-code-graph frontmatter plan"
  - "code graph doc contract plan"
  - "skill doc frontmatter phase 20"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/010-code-graph-scatter-027/004-system-code-graph-frontmatter-alignment"
    last_updated_at: "2026-06-11T09:29:13Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 7 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references/runtime/launcher_lease.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-020-system-code-graph"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: system-code-graph Frontmatter Alignment

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
| **Storage** | `.opencode/skills/system-code-graph/references/*.md` (7 docs, no assets) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill system-code-graph --coverage` + Python local-mode advisor smoke |

### Overview
system-code-graph is a partial-block skill: 6 of 7 references carry trigger_phrases but lack `importance_tier`/`contextType`, and `launcher_lease.md` carries title+description only. The phase fills the missing fields, authors the full block for the lease doc, and fixes one phrase that violates the lowercase multi-word rule (`ensureCodeGraphReady`).
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
2. Each doc's leading fence is patched (missing tier/contextType, phrase fix, net-new block for launcher_lease)
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to system-code-graph with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (7/7 docs failing: 6 missing tier+contextType, launcher_lease.md also missing trigger_phrases)
- [x] Contract enums confirmed against the checker (`check-skill-doc-frontmatter.mjs` vocabulary)

### Phase 2: Core Implementation
- [x] `code_graph_readiness_check.md`, `tool_surface.md`: tier `normal`, contextType `implementation`; camelCase phrase replaced with "ensure code graph ready"
- [x] `database_path_policy.md`, `readiness_and_scope_fingerprint.md`: tier `important` (formal policy/contract), contextType `implementation`
- [x] `naming_conventions.md`, `ownership_boundary.md`: tier `important` (formal contract docs), contextType `general`
- [x] `launcher_lease.md`: full detailed block authored (4 phrases, tier `normal`, contextType `implementation`)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks system-code-graph first with a doc signal
- [x] git diff confined to frontmatter hunks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 7 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill system-code-graph --coverage` |
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

- **Trigger**: A consumer turns out to depend on the prior partial frontmatter or the replaced camelCase phrase
- **Procedure**:
  1. `git checkout -- .opencode/skills/system-code-graph/references/` (7 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
