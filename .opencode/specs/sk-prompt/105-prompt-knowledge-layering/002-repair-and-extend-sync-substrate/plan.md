---
title: "Implementation Plan: Phase 2 — Repair + extend sync substrate"
description: "Rewrite check-prompt-quality-card-sync.sh as a grep-based duplication guard covering all 5 cli-* quality cards; fix the broken path reference in sk-prompt/assets/cli_prompt_quality_card.md."
trigger_phrases:
  - "repair sync substrate plan"
  - "duplication guard plan"
  - "check-prompt-quality-card-sync plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
    last_updated_at: "2026-06-02T18:04:11Z"
    last_updated_by: "completion-agent"
    recent_action: "Phase complete — all implementation phases done"
    next_safe_action: "Phase 006 turns guard GREEN"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: repair-and-extend-sync-substrate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | Shell scripting, grep |
| **Storage** | None |
| **Testing** | Manual script execution against live repo |

### Overview

This phase rewrote the sync script from a 3-mirror hash comparison into a grep-based duplication guard covering all 5 cli-* executor quality cards. The guard detects whether any cli-* card inlines the framework selection table or CLEAR pre-dispatch table from sk-prompt, which must remain the single canonical source for those tables. A second change corrected a stale path reference in sk-prompt that pointed users to a non-existent script location.
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

Shell script — iterate over a fixed list of file paths, grep each for two header strings, accumulate exit code, print verdict.

### Key Components

- **cli_cards array**: Fixed list of all 5 cli-* quality card paths resolved relative to an optional repo-root argument
- **FRAMEWORK_HEADER_PATTERN**: The exact header row of the 7-framework selection table (`| Framework | Best for | Complexity band |`)
- **CLEAR_HEADER_PATTERN**: The exact header row of the CLEAR pre-dispatch table (`| Dimension | Floor | Pre-dispatch question |`)
- **overall_exit accumulator**: Set to 1 on first failure; all cards are checked regardless so the output lists every violation in one run

### Data Flow

Script receives optional repo-root path → builds absolute paths for each cli-* card → greps each card for both header patterns → prints PASS/FAIL per card → exits with accumulated code
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/.../check-prompt-quality-card-sync.sh` | Producer — enforces the no-duplication contract | Rewritten: hash comparison replaced with grep-based duplication guard | Run script; confirm exits 1 on current repo, exits 0 on clean state |
| `sk-prompt/assets/cli_prompt_quality_card.md` Mirror Sync section | Consumer — documents how to find and run the guard | Updated: broken path corrected to real system-skill-advisor location | grep corrected path in file; confirm it matches script's actual path on disk |
| 5 cli-* quality cards (opencode, gemini, devin, codex, claude-code) | Checked objects — must not inline the tables | Unchanged in this phase (still failing); Phase 006 fixes them | Guard exits 1, FAIL lines name the 4 violating cards |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read existing script and identify what to replace
- [x] Read cli_prompt_quality_card.md to locate the broken reference
- [x] Enumerate all 5 cli-* card paths

### Phase 2: Core Implementation
- [x] Rewrite check-prompt-quality-card-sync.sh with grep-based duplication guard covering all 5 cards
- [x] Pin both header patterns as detection strings with comments explaining their role
- [x] Implement fail-closed behavior for MISSING cards and multi-violation output
- [x] Fix broken path reference in cli_prompt_quality_card.md

### Phase 3: Verification
- [x] Syntax check the rewritten script
- [x] Run guard against live repo — confirmed exit 1 with 4 FAIL lines
- [x] Verified corrected path resolves to real file on disk
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Script has no bash syntax errors | `bash -n` |
| Functional — violation detection | Guard exits 1 and names violating cards when cli-* cards inline the tables | Run script against live repo |
| Functional — clean pass | Guard exits 0 when no card inlines either table | Manual verification |
| Path reference | Corrected path in cli_prompt_quality_card.md resolves on disk | `ls` / direct read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 architecture contract | Internal | Green | Guard design follows agreed duplication-guard approach |
| bash + grep on host | External | Green | Standard tooling; no install required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guard produces incorrect results (false positives on clean cards or false negatives on inlining cards)
- **Procedure**: Revert script to the previous hash-comparison version from git history; investigate and fix the grep pattern
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
