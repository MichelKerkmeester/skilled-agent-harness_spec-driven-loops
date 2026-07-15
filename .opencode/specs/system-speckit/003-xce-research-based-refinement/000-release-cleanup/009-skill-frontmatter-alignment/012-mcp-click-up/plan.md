---
title: "Implementation Plan: Phase 12: mcp-click-up Frontmatter Alignment"
description: "Normalize the 3 mcp-click-up reference docs to the canonical frontmatter contract as part of the 009 mass-authoring campaign."
trigger_phrases:
  - "mcp-click-up frontmatter plan"
  - "clickup skill doc contract"
  - "cupt reference frontmatter"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/012-mcp-click-up"
    last_updated_at: "2026-06-11T09:27:45Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 3 docs normalized and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/references/cupt_commands.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-012-mcp-click-up"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: mcp-click-up Frontmatter Alignment

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
| **Storage** | `.opencode/skills/mcp-click-up/references/*.md` (3 docs, no assets) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill mcp-click-up --coverage` + Python local-mode advisor smoke |

### Overview
All 3 mcp-click-up references already carry the detailed block with in-range, content-derived trigger phrases, so this phase is pure contract completion rather than re-authoring. The only drift is two missing fields per doc: `importance_tier` and `contextType` (unlike the pilot, no `contextType: reference` enum drift).
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
2. Each doc's leading fence is patched (missing tier and contextType added)
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves a doc phrase routes to mcp-click-up with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (3/3 docs failing on `importance_tier missing; contextType missing`)
- [x] Contract enums confirmed against the checker and the 008 pilot precedent

### Phase 2: Core Implementation
- [x] `cupt_commands.md`, `mcp_tools.md`: add `importance_tier: normal`, `contextType: implementation`
- [x] `troubleshooting.md`: add `importance_tier: normal`, `contextType: general` (diagnostic playbook, not an implementation spec)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks mcp-click-up first with doc signals
- [x] git diff confined to frontmatter hunks (6 added lines, 0 removed)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 3 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill mcp-click-up --coverage` |
| Routing smoke | Doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
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

- **Trigger**: A consumer turns out to depend on the prior two-field-short frontmatter shape
- **Procedure**:
  1. `git checkout -- .opencode/skills/mcp-click-up/references/` (3 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
