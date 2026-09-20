---
title: "Implementation Plan: Skill Upgrade / Single-to-Parent Conversion Path"
description: "Plan for the adopter upgrade guide (Phase 1) and the optional promote operation (Phase 2)."
trigger_phrases:
  - "skill upgrade plan"
  - "single to parent plan"
  - "adopter guide plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/030-skill-upgrade-conversion-path"
    last_updated_at: "2026-08-15T11:59:34Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 1 guide shipped and verified"
    next_safe_action: "Phase 2 promote op if adopter demand appears"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Upgrade / Single-to-Parent Conversion Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference doc + JSON manifest |
| **Framework** | sk-doc / sk-create-skill authoring contract |
| **Storage** | Repo tree under `.opencode/skills/sk-doc/` |
| **Testing** | `validate_skill_package.py` (package + parent-skill-check) |

### Overview
Phase 1 ships a doc-only adopter upgrade guide plus its cross-links, so downstream adopters can reconcile their own customized skills to the v4 parent-skill format. Implementation was dispatched to cli-cursor (`cursor-grok-4.6-xhigh`, switched from cli-devin per operator) in an isolated worktree, scope-locked to the guide and two cross-link edits, with `validate_skill_package.py` as the authoritative gate. Phase 2 (a `promote` code operation) is an optional follow-on gated behind Phase 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Command surface verified to exist
- [x] Authoritative gate identified (`validate_skill_package.py`)

### Definition of Done
- [x] Phase 1 acceptance criteria met (SC-001–SC-003)
- [x] `validate_skill_package.py` package + parent-skill-check PASS
- [x] Docs cross-linked (SKILL.md + README.md)
- [x] Changelog Upgrade Notes reference the guide
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference-doc-under-packet — the guide lives inside `sk-create-skill/references/skill/`, a declared leaf of the sk-doc hub, consumed but not executed.

### Key Components
- **upgrading-a-skill-to-v4.md**: the guide (decision rule, procedure, adopter cases, validation).
- **sk-create-skill/SKILL.md**: references section cross-link.
- **sk-create-skill/README.md**: cross-link in overview + references.
- **leaf-manifest.json**: declares the new reference as a leaf so the 10b parent-skill-check passes.

### Data Flow
1. Adopter pulls v4 and hits the reconcile question.
2. Guide routes them by the decision rule (single vs parent).
3. For conversion, the ordered procedure uses existing `/create:skill-parent` commands.
4. The final step runs `validate_skill_package.py` and names the failure each step prevents.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verified `/create:skill`, `/create:skill-parent`, `validate_skill_package.py`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json` all exist
- [x] Isolated worktree provisioned for the cli-cursor executor

### Phase 2: Core Implementation
- [x] Guide authored (257 lines) covering REQ-001–REQ-004
- [x] Cross-links added to SKILL.md and README.md
- [x] leaf-manifest.json refreshed

### Phase 3: Verification
- [x] `validate_skill_package.py` package_skill PASS
- [x] parent-skill-check PASS after leaf-manifest refresh
- [x] Every cited command/flag/path confirmed to exist
- [x] Changelog Upgrade Notes updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package validation | sk-doc package integrity | `validate_skill_package.py` |
| Parent-skill check | one-identity + leaf-manifest | `parent-skill-check.cjs` |
| Manual review | Guide accuracy vs real command surface | Grep/Read against the repo |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/create:skill-parent` command | Internal | Green | Guide would cite non-existent surface |
| `validate_skill_package.py` | Internal | Green | No authoritative gate |
| sk-doc `leaf-manifest.json` | Internal | Green | New leaf fails 10b gate |
| cli-cursor `cursor-grok-4.6-xhigh` | External | Green | Executor for the guide |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Guide cites a wrong command, or a cross-link breaks the hub package.
- **Procedure**: Revert the four files (guide + two cross-links + leaf-manifest); re-run `validate_skill_package.py` to confirm the package returns to its prior state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
| Phase 2 (promote, optional) | Phase 1 landed | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + surface verification | Low | 30 minutes |
| Guide authoring (cli-cursor) | Medium | 1-2 hours |
| Cross-links + leaf-manifest | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Clean HEAD baseline captured before integrating the executor's output
- [ ] Feature flag configured (N/A — doc-only change)
- [x] Authoritative gate identified (`validate_skill_package.py`)

### Rollback Procedure
1. **Revert docs**: `git checkout HEAD -- <four files>`
2. **Re-run gate**: `validate_skill_package.py .opencode/skills/sk-doc`
3. **Verify**: package + parent-skill-check return to prior state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — doc-only
<!-- /ANCHOR:l2-rollback -->
