---
title: "Implementation Plan: Phase 17: sk-git Frontmatter Alignment"
description: "Author the canonical frontmatter contract onto all 10 sk-git reference/asset docs; first all-net-new authoring phase of the 009 campaign."
trigger_phrases:
  - "sk-git frontmatter plan"
  - "sk-git doc contract authoring"
  - "git skill frontmatter phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git"
    last_updated_at: "2026-06-11T09:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 10 docs authored and checks green"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-017-sk-git"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 17: sk-git Frontmatter Alignment

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
| **Storage** | `.opencode/skills/sk-git/references/*.md` (7 docs) + `assets/*.md` (3 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill sk-git --coverage` + Python local-mode advisor smoke |

### Overview
sk-git is pure net-new authoring: all 10 docs carried title+description only, so every trigger_phrases list, tier, and contextType had to be derived from the doc bodies. The judgment work is the phrase authoring (distinctive multi-word git-workflow phrases, not generic git words) plus one tier promotion for the worktree naming-contract doc.
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
Frontmatter-only authoring: three contract fields are inserted after the existing description line in each leading YAML fence; body bytes stay untouched.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Phrase policy**: each doc read in full or by outline first; phrases name the doc's own concepts (numbered worktree branches, scoped staging discipline, rename-heavy merge verification)
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Frontmatter inventory confirms all 10 docs carry title+description only
2. Each doc body is read; 5-7 distinctive phrases authored per doc
3. Contract fields inserted into each leading fence; coverage check must report 0 violations
4. Python local-mode smoke proves an authored phrase routes to sk-git with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Frontmatter inventory captured (10/10 docs title+description only, no detailed block, no stray keys)
- [x] Contract enums confirmed against the checker and the 008 pilot format

### Phase 2: Core Implementation
- [x] 7 references authored: workflow docs get `implementation`, cross-cutting cheat-sheet docs get `general`
- [x] 3 assets authored: all `implementation` (templates/checklists used while executing work)
- [x] `worktree_workflows.md` tier promoted to `important` (owns the `wt/{NNNN}-{name}` naming contract)

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smoke ranks sk-git first with a doc signal
- [x] git diff confined to frontmatter insertion hunks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 10 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill sk-git --coverage` |
| Routing smoke | Authored phrase routes to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only insertion hunks | `git diff -U0` review |
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

- **Trigger**: Authored phrases cause advisor misrouting, or a consumer rejects the new fields
- **Procedure**:
  1. `git checkout -- .opencode/skills/sk-git/references/ .opencode/skills/sk-git/assets/` (10 files, insertion-only hunks)
  2. Re-run the coverage check to confirm the prior title+description state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
