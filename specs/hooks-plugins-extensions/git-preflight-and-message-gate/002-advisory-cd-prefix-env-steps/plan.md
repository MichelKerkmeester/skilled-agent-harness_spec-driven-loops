---
title: "Implementation Plan: Teach the git preflight advisory that environment assignments between cd and git keep the cd"
description: "Widen one regex in the git preflight rule checks so an assignment-only step between `cd <dir> &&` and the git word still yields the cd, add four assertions to the test that covers the effective directory, and record the skill release."
trigger_phrases:
  - "advisory cd prefix env steps plan"
  - "assignment step between cd and git plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Teach the git preflight advisory that environment assignments between cd and git keep the cd

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM modules, no build step |
| **Framework** | None. The tests use `node:test` with `node:assert/strict` |
| **Storage** | None |
| **Testing** | `node --test` with temporary git repositories built per test |

### Overview
One regular expression in `git-rule-checks.mjs` learns to skip assignment-only steps between the cd and the git word, and its comment says why an assignment does not move the directory. Four assertions in the existing effective-directory test prove the three recognised shapes stay silent and the non-assignment shape still warns. The proof is that test file, the other `*.test.mjs` files beside it, and the strict packet validator.
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
- [x] `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` exits 0 with 29 passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single regex widening in one parsing module. The component is `CD_BEFORE_GIT` in `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs`.

### Key Components
- **`CD_BEFORE_GIT`**: the pattern that turns `cd <dir> &&` into the effective directory of a git invocation. Every path-sensitive check reads that directory through `parseGitCommand`.
- **`GIT_SHAPE` and `GIT_INVOCATION`**: the shape gate and the parser. Both already reach a git word behind a separate step, so the cd pattern was the only place the shapes were lost.
- **`check` in the test file**: resolves the session context, evaluates one named rule and returns the advisory verdict, which is what the assertions compare.

### Data Flow
A command string enters `parseGitCommand`, the cd pattern either captures a directory or not, and `cwdResolved` carries that answer into `contextFor`. A resolved directory gives the rule the repository state of the directory the command runs in. An unresolved one makes the rule return null, which every check treats as silence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` must exit 0 with 29 tests passing, the four new assertions among them. Each assertion runs against a primary checkout plus a linked worktree whose files exist only in the worktree, so an advisory either sees the paths or does not.

The four new assertions are discriminative rather than decorative. Before the change, the two `export` shapes lose the cd, so the pathspec resolves in the session checkout and the rule fires. The assertion expects no advisory, so it fails on the old pattern.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
`node` 20 or later for `node:test`, and `git` on the path for the test fixtures. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Trigger: an advisory goes silent for a shape a person actually types. Revert the one scoped commit, which restores the narrower cd pattern and removes the four assertions with it.
<!-- /ANCHOR:rollback -->

---
