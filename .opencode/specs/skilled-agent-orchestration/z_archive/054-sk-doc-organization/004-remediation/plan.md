---
title: "Implementation Plan: Phase 4: remediation"
description: "3 surgical doc edits applied directly via Edit tool. validate.sh --strict gate. One commit on main."
trigger_phrases:
  - "068/004 plan"
  - "remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/004-remediation"
    last_updated_at: "2026-05-05T11:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 4 plan.md after 3 fixes already applied"
    next_safe_action: "Author tasks.md/impl-summary.md, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-authoring"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (doc-only edits) |
| **Framework** | Edit tool (surgical line-level changes) |
| **Storage** | Filesystem (`.opencode/skills/sk-doc/`) |
| **Testing** | validate.sh --strict + manual rg residual + file-existence check |

### Overview
3 small targeted Edit operations against doc files inside sk-doc. No mirror replication, no cross-runtime impact, no new substring substitutions. Direct execution via Claude Edit tool — justified by surgical scope (3 line-level changes + 1 ASCII tree rewrite, all in sk-doc skill files only).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] review-report.md authored with 1 P1 + 2 P2 actionable findings
- [x] On `main` branch
- [x] Phases 001-003 shipped clean

### Definition of Done
- [x] P1-003-A fix applied (frontmatter_templates.md:770)
- [x] iter4-F1 P2 fix applied (quick_reference.md tree)
- [x] P2-003-A fix applied (illustrative examples × 2)
- [x] validate.sh --strict on parent 068 → exit 0
- [x] Active-scope residual rg → 0 hits
- [ ] Spec docs (plan, tasks, impl-summary) authored
- [ ] One commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical doc patching. No code changes, no API changes, no mirror impact. Each fix is independently verifiable.

### Key Components
- **Edit tool** (Claude): line-level find/replace for the 3 illustrative-example tweaks and the broken link
- **Manual ASCII tree rewrite**: quick_reference.md L174-189 cannot be done via substring substitution — replaced as a coherent block

### Data Flow
```
read review-report.md
  -> identify 4 file targets
    -> apply Edit per target (4 file ops; tree counts as 1 multi-line block)
      -> validate.sh --strict
        -> residual rg
          -> commit
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (pre-flight)
- [x] Read review-report.md to identify 4 target files
- [x] Read each target's relevant section to understand exact line-level context

### Phase 2: Core Implementation
- [x] Edit `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md:770` — fix broken link
- [x] Edit `.opencode/skills/sk-doc/references/global/quick_reference.md:174-189` — rewrite ASCII tree
- [x] Edit `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:593` — remove `assets/agents/` from illustrative example
- [x] Edit `.opencode/skills/sk-doc/references/specific/skill_creation.md:56` — remove `assets/agents/` from illustrative example

### Phase 3: Verification
- [x] `test -f .opencode/skills/sk-doc/assets/command_template.md` (P1 link target exists) — OK
- [x] `rg -c "assets/agents/" <each fixed file>` returns 0 — OK
- [x] `bash validate.sh --strict` on parent 068 → exit 0
- [x] Active-scope residual rg → 0 hits
- [ ] Commit on main with prescribed message
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each fix line-level | rg, grep, test -f |
| Integration | Parent 068 spec-folder integrity | validate.sh --strict |
| Residual | Active-scope stale path detection | rg --no-config --no-ignore-vcs with glob exclusions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| review-report.md from 7-iter deep-review | Internal | Green | Cannot identify scope |
| Edit tool | External | Green | Falls back to manual sed |
| validate.sh script | External | Green | Skip strict check (lower confidence) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the 4 Edits introduces a regression (validate.sh fail, broken markdown rendering, etc.)
- **Procedure**: `git reset --hard 98cc6b59c` (rolls back Phase 4 commit; Phases 1-3 remain)
- **Granularity**: One terminal commit. Surgical rollback returns repo to post-Phase-3 state.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
-->
