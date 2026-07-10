---
title: "Implementation Plan: Phase 11: mcp-chrome-devtools Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto the 3 mcp-chrome-devtools reference docs; net-new trigger-phrase authoring for the 009 campaign."
trigger_phrases:
  - "mcp-chrome-devtools frontmatter plan"
  - "chrome devtools doc contract plan"
  - "bdg doc frontmatter authoring"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/011-mcp-chrome-devtools"
    last_updated_at: "2026-06-11T13:05:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 3 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-chrome-devtools/references/session_management.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-011-mcp-chrome-devtools"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: mcp-chrome-devtools Frontmatter Alignment

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
| **Storage** | `.opencode/skills/mcp-chrome-devtools/references/*.md` (3 docs, no assets) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill mcp-chrome-devtools --coverage` + Python local-mode advisor smoke |

### Overview
Unlike the deep-loop-runtime pilot, all 3 mcp-chrome-devtools references carried title+description only, so the detailed block (trigger_phrases, importance_tier, contextType) is net-new authoring. Phrases are derived from each doc body: bdg command vocabulary, CDP domain patterns, session lifecycle terms, and error symptoms.
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
Frontmatter-only authoring: the leading YAML fence is extended in place, body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations
2. Each doc body is read and a 6-phrase trigger block plus tier/contextType is authored into its leading fence
3. Coverage re-check must report 0 violations for the skill
4. Python local-mode smoke proves an authored phrase routes to mcp-chrome-devtools with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (3/3 docs failing on missing trigger_phrases, importance_tier, contextType)
- [x] Contract enums confirmed against the checker and the pilot's normalized style

### Phase 2: Core Implementation
- [x] `cdp_patterns.md`: 6 phrases (CDP commands, discovery, screenshot/HAR, jq piping); tier `normal`, contextType `implementation`
- [x] `session_management.md`: 6 phrases (lifecycle, trap cleanup, health check, resumption, persistence); tier `normal`, contextType `implementation`
- [x] `troubleshooting.md`: 6 phrases (error symptoms: command not found, launch fails, jq parse error); tier `normal`, contextType `implementation`

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks mcp-chrome-devtools first with a doc signal
- [x] git diff confined to frontmatter hunks (+9 lines per file, 0 deletions)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 3 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill mcp-chrome-devtools --coverage` |
| Routing smoke | Doc phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
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

- **Trigger**: A consumer turns out to depend on the title+description-only shape or the authored phrases mis-route
- **Procedure**:
  1. `git checkout -- .opencode/skills/mcp-chrome-devtools/references/` (3 files, frontmatter-only hunks)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
