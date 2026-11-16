---
title: "Implementation Plan: Phase 6: codex-check-and-advisory-fixes"
description: "Let the read-only Codex hook check pass the worktree guard, make Pi and DSH show that check only when it fails, and remove the spec-kit Vitest alias only if both suites prove it unused. Each change is proven by a test that fails without it."
trigger_phrases:
  - "codex check and advisory fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: codex-check-and-advisory-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM, CommonJS tests, TypeScript |
| **Framework** | Pi extensions, DSH plugins, `node --test`, Vitest |
| **Storage** | None |
| **Testing** | `node --test`, Vitest, live probes of the two adapters |

### Overview
Change one guard call in the installer and one check entry plus one branch in each of the Pi and DSH advisories. Prove each change with a test that fails against the old code and with a live run. Then run both spec-kit Vitest suites with and without the alias and keep the alias unless the counts match.
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
- [x] The installer tests, the DSH suite, the Pi advisory test and the hook Vitest suite pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: fixes at the source, no new component.

### Key Components
- **`assertSafeRepoAnchor`**: refuses a linked worktree. It now gets `--check` as an allowance, since a check writes nothing.
- **Advisory check entries**: the Codex check carries `quietOnSuccess`, so its runner drops the output of a clean exit.

### Data Flow
Each runtime's session start runs `install-codex-hooks.mjs --check`. The installer prints `OK` on stdout and exits 0, or prints `DRIFT` on stderr and exits 1. Claude and Devin drop stdout and react to the exit. Pi and DSH turned any output into a warning, so they now read the exit first for this one check.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the false warnings and the Vitest baselines. Implementation writes each test, sees it fail, then makes the fix. Verification reruns the suites, the live probes and the doc checkers.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/bin/tests/install-codex-hooks-*.test.cjs` must print `fail 0`, and `node .skilled/bin/install-codex-hooks.mjs --check` in this worktree must print `OK` with exit 0. The advisory probes must print `DSH injected: []` and `Pi notified: []`.
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

Trigger: a worktree session misses real Codex hook drift, or Pi or DSH stops showing a failing check. Revert the phase commit with `git revert`.
<!-- /ANCHOR:rollback -->

---
