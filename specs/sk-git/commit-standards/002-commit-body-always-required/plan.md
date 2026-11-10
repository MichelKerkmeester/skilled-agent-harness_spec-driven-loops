---
title: "Implementation Plan: Require a commit body on every authored commit"
description: "Replace the staged-path threshold in the commit-msg hook with an unconditional body requirement, align every doc and caller with it, and prove the change with a before and after control on real commits."
trigger_phrases:
  - "commit body always required plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Require a commit body on every authored commit

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash hook, Markdown docs, YAML command assets |
| **Framework** | Git hooks under a global `core.hooksPath`, sk-git skill |
| **Storage** | None |
| **Testing** | Shell test harnesses under `.skilled/scripts/git-hooks/tests/`, `node --test` for the sk-git checks |

### Overview
The hook already computes `HAS_EXPLANATORY_BODY` and only consulted it when four or more files were staged. The change deletes the file-count block and checks the flag on every authored commit. Docs and callers follow, then a negative control on real commits shows the behavior flip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified, including the machine-wide reach of the hook

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing against the recorded baselines
- [x] Docs updated (spec, plan, tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single enforcement point with documentation that mirrors it.

### Key Components
- **`commit-msg` hook**: the only place the rule is enforced, for every commit through the global hooks path.
- **`SKILL.md` section 6**: the canonical contract the references, template, catalog and playbook restate.
- **Callers**: scripts and runbooks that create commits under the hooks and now pass a body.

### Data Flow
`git commit` writes the message, `prepare-commit-msg` stamps the trailers, `commit-msg` checks the subject, the trailer keys and now the body, then either accepts or prints one error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `commit-msg` hook | Enforces the body only above four staged paths | Update | Hook suite 22 of 22, negative control on real commits |
| Hook tests | Pin the old threshold | Update | commit-msg cases 18 to 20, prepare-commit-msg case 13 |
| `SKILL.md`, references, template, catalog, playbook | State the threshold and show subject-only examples | Update | `rg` for subject-only `git commit -m` in sk-git returns only the documented-not-executed refusals |
| Deep-loop checkpoint YAMLs, installer, runbooks | Commit subject-only under the hooks | Update | `rg` for the same pattern outside sk-git |
| Callers that bypass with `core.hooksPath=/dev/null` or their own hooks path | Not subject to the hook | Unchanged | Read each caller |
| Sync Loop expiry proof | Throwaway commit under the global hooks | Update | Proof reruns green |

Required inventories:
- Same-class producers: `rg -n 'git commit' .skilled --glob '*.md' --glob '*.yaml' --glob '*.sh'` filtered to subject-only commands.
- Consumers of the changed rule: `rg -n '4\+|four or more|STAGED_FILE_COUNT' .skilled/skills/sk-git .skilled/scripts/git-hooks`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The hook's accept and refuse cases, including one-path subject-only, trailer-only and Git-generated subjects | `commit-msg.test.sh` |
| Integration | A real commit through both the stamper and the validator | `prepare-commit-msg.test.sh` case 13 |
| Control | The same commit messages on real commits before and after the edit | `negctl.sh` with the old and new hook |
| Regression | The other hook and sk-git suites against their baselines | The ten shell suites and `node --test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Global `core.hooksPath` symlinks into this tree | Internal | Green | The edit is live at once, so the caller sweep comes first |
| `check-frontmatter-versions.sh` | Internal | Green | The version gate cannot report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate workflow is refused and cannot be given a body.
- **Procedure**: `git revert` the commit. For one commit, set `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Med | A few hours, mostly the caller sweep |
| Verification | Med | About an hour |
| **Total** | | **A working day at most** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Caller sweep done before the hook edit was relied on
- [x] Bypass path documented in the hook error and the changelog
- [x] Negative control captured on real commits

### Rollback Procedure
1. Set `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` for the one commit that is blocked.
2. Revert the packet commit in Code_Environment to restore the four-path threshold.
3. Rerun `commit-msg.test.sh` and confirm the older 19 cases pass.
4. Tell the operator, since the hook is machine-wide.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
