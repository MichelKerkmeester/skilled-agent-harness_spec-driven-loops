---
title: "Implementation Plan: Phase 22: system-spec-kit Frontmatter Alignment"
description: "Normalize the 45 system-spec-kit reference/asset docs to the canonical frontmatter contract; the largest batch-authoring phase of the 009 campaign."
trigger_phrases:
  - "system-spec-kit frontmatter plan"
  - "frontmatter batch authoring"
  - "skill doc contract largest phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/022-system-spec-kit"
    last_updated_at: "2026-06-11T09:57:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase executed: 45 docs normalized and checks green"
    next_safe_action: "Campaign-wide coverage flip and live-daemon smoke ride packet 145"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/validation/validation_rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-022-system-spec-kit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 22: system-spec-kit Frontmatter Alignment

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
| **Storage** | `.opencode/skills/system-spec-kit/references/**/*.md` (41 docs, 9 subdirectories) + `assets/*.md` (4 docs) |
| **Testing** | `check-skill-doc-frontmatter.sh --skill system-spec-kit --coverage` + Python local-mode advisor smoke |

### Overview
system-spec-kit is the campaign's largest phase: 45 docs needing mostly net-new authoring rather than the pilot's pure normalization. 42 docs carried title+description only, one had no frontmatter at all (`agent-io-contract.md`), one carried a partial detailed block (`embedder_architecture.md`), and one had the familiar out-of-enum `contextType: reference` (`embedder_pluggability.md`). At this scale the patch runs as a single assertion-guarded Python script over a per-doc authoring table.
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
Frontmatter-only normalization: the leading YAML fence is rebuilt in place from a per-doc authoring table; body bytes stay untouched. Existing title/description lines are preserved verbatim unless overridden.

### Key Components
- **Contract checker**: `check-skill-doc-frontmatter.sh` (shape/coverage modes, `--skill` filter)
- **Authoring table**: per-doc trigger phrases (3-8, distinctive multi-word), tier, contextType in one Python dict
- **Tier policy**: `important` for formal contract/invariant docs, `normal` default
- **Smoke harness**: `skill_advisor.py` local mode with `SPECKIT_ADVISOR_DOC_TRIGGERS=true` (daemon-independent)

### Data Flow
1. Coverage-mode check enumerates per-doc violations (45/45 failing at baseline)
2. Heading scan per doc (first ~50 lines + `grep "^#"`) feeds phrase/tier/contextType authoring
3. One Python pass rebuilds each leading fence with assertion guards (fence present, title/description preserved, body joined byte-identical)
4. Coverage re-check must report 0 violations for the skill
5. Python local-mode smoke proves authored phrases route to system-spec-kit with a doc signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Coverage-mode baseline captured (45/45 docs failing; 4 distinct drift classes)
- [x] Heading scans collected for all 45 docs to ground phrase authoring

### Phase 2: Core Implementation
- [x] Authoring table built: phrases, tier, contextType for all 9 reference subdirectories + assets
- [x] Single assertion-guarded Python patch applied (45 fences rebuilt, 1 net-new block prepended)
- [x] Perishable packet/finding ids dropped from `rename_pattern.md` description

### Phase 3: Verification
- [x] Coverage check green for the skill (0 violations)
- [x] Python local-mode doc-phrase smokes rank system-spec-kit first with doc signals
- [x] git diff confined to frontmatter hunks across all 45 files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | All 45 docs, coverage mode | `check-skill-doc-frontmatter.sh --skill system-spec-kit --coverage` |
| Routing smoke | Authored phrases route to owning skill | `SPECKIT_ADVISOR_DOC_TRIGGERS=true SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 skill_advisor.py` |
| Diff hygiene | Frontmatter-only hunks (no hunk past original line 20) | `git diff -U0` hunk-header scan |
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

- **Trigger**: A consumer turns out to depend on the prior partial blocks or the removed description wording
- **Procedure**:
  1. `git checkout -- .opencode/skills/system-spec-kit/references/ .opencode/skills/system-spec-kit/assets/` (45 files, frontmatter-only hunks; preserves the unrelated old-name deletions staged by another session)
  2. Re-run the coverage check to confirm the prior state

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
