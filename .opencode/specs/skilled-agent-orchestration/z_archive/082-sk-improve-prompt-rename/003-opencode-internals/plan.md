---
title: "Implementation Plan: Phase 003 OpenCode Internals [template:level_2/plan.md]"
description: "Rotate Phase 003 OpenCode internals from sk-improve-prompt to sk-prompt with scoped verification."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T11:12:38Z"
    last_updated_by: "codex"
    recent_action: "Phase 003 plan updated"
    next_safe_action: "Resolve rebuild blocker"
    blockers:
      - "advisor_rebuild blocked by deep-agent-improvement skill_id mismatch"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Should the deep-agent-improvement graph metadata mismatch be fixed before Phase 004?"
    answered_questions: []
---
# Implementation Plan: Phase 3: opencode-internals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, TypeScript, JSON, shell |
| **Framework** | OpenCode skill and advisor internals |
| **Storage** | skill graph metadata and advisor SQLite rebuild path |
| **Testing** | `rg`, `jq`, `py_compile`, prompt-card sync, advisor probe, spec validation |

### Overview
Rotate literal prompt-skill references in Phase 003-owned `.opencode/` consumers from `sk-improve-prompt` to `sk-prompt`. Keep command and agent surfaces unchanged, preserve syntax for code/config files, and record rebuild blockers separately from source-reference completion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
[MVC | MVVM | Clean Architecture | Serverless | Monolith | Other]

### Key Components
- **[Component 1]**: [Purpose]
- **[Component 2]**: [Purpose]

### Data Flow
[Brief description of how data moves through the system]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor scorer literals | Route prompt-improvement requests | Updated to `sk-prompt` | Phase 003 file-list grep and prompt probe |
| CLI prompt quality cards | Mirror canonical prompt card path | Updated existing mirrors | Sync script returned `SYNC OK` |

Required inventories:
- Same-class producers: Phase 001 inventory and Phase 003 explicit file-list grep.
- Consumers of changed symbols: dispatcher, advisor, cli mirror, and cross-skill refs listed in tasks.md.
- Matrix axes: dispatcher, advisor code, advisor fixtures, cli mirrors, cross-skill docs, phase docs.
- Algorithm invariant: no parser, path resolver, or security algorithm changed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase docs and inventory read
- [x] Branch confirmed as `main`
- [x] Target reference shapes inspected

### Phase 2: Core Implementation
- [x] Dispatcher and agent body refs rotated
- [x] Advisor scorer, metadata, sync script, and fixtures rotated
- [x] Existing cli-* mirror and cross-skill refs rotated

### Phase 3: Verification
- [x] Phase 003-owned grep clean
- [x] Syntax and fixture validity checks passed
- [x] Rebuild blocker documented
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Python advisor script, JSON, JSONL | `py_compile`, `jq` |
| Integration | Prompt-card mirror consistency | `check-prompt-quality-card-sync.sh` |
| Routing | Prompt skill recommendation | `skill_advisor.py "improve my prompt" --threshold 0.0` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor rebuild metadata | Internal | Red | Rebuild aborts until `deep-agent-improvement` `skill_id` matches its folder or the indexer policy changes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Prompt skill routing regresses or code/config syntax validation fails.
- **Procedure**: Revert the Phase 003 literal rotations and rerun the same grep, syntax, sync, and probe checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 003 | Phase 002 folder rename | Phase 004 runtime mirrors |
| Advisor rebuild | Valid skill graph metadata | Final Phase 006 validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Reference rotation | Medium | Completed |
| Verification | Medium | Completed except rebuild |
| Blocker resolution | Low to medium | Requires explicit scope decision |
| **Total** | | **Phase source work complete; rebuild blocked** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Rollback Scope
- Revert Phase 003 literal rotations if prompt routing regresses.
- Keep phase docs if they are needed to preserve blocker evidence.

### Risk Controls
- **Requires data rollback?** No.
- **Requires cache rebuild?** Yes, after blocker resolution.
- **Has data migrations?** No.
- **Reversal procedure**: Revert changed Phase 003 files and rerun grep, syntax, sync, probe, and strict spec validation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
