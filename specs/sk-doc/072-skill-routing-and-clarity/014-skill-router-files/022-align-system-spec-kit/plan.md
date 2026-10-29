---
title: "Implementation Plan: Phase 22: align-system-spec-kit"
description: "One operator-local alignment check over system-spec-kit after the router move: scope the changed files, run the battery, review in four lanes, score probes, let a critic prune, fix what does not change routing, then recheck."
trigger_phrases:
  - "align system spec kit plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: align-system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TypeScript, CommonJS and bash (four scripts and their tests) |
| **Framework** | None |
| **Storage** | None; run output in the run folder outside the checkout |
| **Testing** | The existing check battery, `package_skill.py`, `validate_document.py`, `check-markdown-links.cjs`, vitest, `node --test`, `tsc --noEmit` and eslint |

### Overview
The check reads the system-spec-kit files changed since base `6a9946a800` and fixes only what does not change routing. It edits docs, playbooks, a changelog and four scripts in place, and adds tests for the script changes. The recheck of the full battery, the hand-run tests and the router-file resolver prove the result.
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
- [x] The recheck battery reads `{"pass":64,"cannot_run":1,"not_applicable":7,"fail":2}` with each non-pass row classified, and the skill routers parse identically to HEAD
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: check, fix, recheck.

### Key Components
- **Check battery**: the existing checks for each surface the changed files touch, run once before the fixes and once after.
- **Review lanes and critic**: four read-only lanes (code; skill docs; READMEs, changelogs and env; routing) raise findings, and a critic overturns the weak ones.
- **Fix lane and prose pass**: the DeepSeek fix lane applies upheld findings outside routing, and a follow-up pass fixes router prose the fix lane was barred from.
- **Router-file resolver**: parses every skill router so the result can be compared with HEAD.

### Data Flow
The scope step lists the changed files. The battery, lanes and probes read them and write findings to the run folder. The critic prunes the findings, the fix lane and prose pass edit the skill files, and the recheck reads the edited worktree.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup scopes the files and runs the first battery and probes. Implementation runs the lanes, the critic, the fix lane and the prose pass. Verification reruns the battery, the hand-run tests and the resolver.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package | The system-spec-kit skill package | `package_skill.py --check --strict` |
| Document | Each changed markdown file | `validate_document.py`, `check-markdown-links.cjs` |
| Unit | The four changed scripts | vitest, `node --test`, `bash runtime/cli/spec/check-card-sync.sh`, `tsc --noEmit`, eslint |
| Regression | Routing parse for every skill router | The router-file resolver, compared with HEAD |
| Integration | Every surface the scope fires | The full battery, rerun against the worktree |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The router move, phases 004 to 006 | Internal | Green | Nothing to align |
| DeepSeek V4.1 Flash workers | External | Green | No lane findings and no fix lane |
| The skill advisor CLI | Internal | Green | The probes cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix turns out to change routing, or the recheck shows a new failure with no known cause.
- **Procedure**: restore the affected file from HEAD with `git checkout -- <path>` and rerun the battery. The edits are uncommitted, so each file reverts on its own.
<!-- /ANCHOR:rollback -->

---
