---
title: "Implementation Plan: Phase 8: claude-hook-tree-guard"
description: "One registry value moves the Claude hook guard from .skilled to .skilled/hooks. The generator rewrites the settings, and a regression test covers a folder whose .skilled holds only data."
trigger_phrases:
  - "claude hook tree guard plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: claude-hook-tree-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registry, Node.js generator, bash hook wrappers |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest 4.1.12 (spec-kit root config), `node --test` |

### Overview
Change one registry value, `requireTree`, from `.skilled` to `.skilled/hooks`. Regenerate the Claude settings from the registry. Prove it with a regression test in a temp folder that holds only `.skilled/.labels`, and with the real Stop command from the regenerated settings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `hook-registration-sync.vitest.ts` prints 9 passed and `sync-claude-user-hooks.test.cjs` prints pass 8
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: a generated registration, changed at its source.

### Key Components
- **`hook-registry.json`**: names the tree a Claude hook needs before it runs.
- **`sync-hook-registrations.cjs`**: renders that guard into every Claude command in `.claude/settings.json`.

### Data Flow
The registry feeds the generator, the generator writes `.claude/settings.json`, and `sync-claude-user-hooks.mjs` copies those commands into `~/.claude/settings.json`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup reproduces the failure with the real Stop command in a data-only folder and records the test baseline. Implementation writes the failing test, changes the registry value, regenerates the settings and corrects the comments. Verification reruns both tests, both sync checks and the reproduction. `tasks.md` owns the ordered tasks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From `.skilled/skills/system-spec-kit`, `node_modules/.bin/vitest run runtime/cli/tests/hook-registration-sync.vitest.ts` must print 9 passed. From the repository root, `node --test .skilled/bin/tests/sync-claude-user-hooks.test.cjs` must print pass 8.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a Claude hook stops running inside a Skilled checkout. Set `requireTree` back to `.skilled` and rerun `sync-hook-registrations.cjs`, or revert the commit.
<!-- /ANCHOR:rollback -->

---
