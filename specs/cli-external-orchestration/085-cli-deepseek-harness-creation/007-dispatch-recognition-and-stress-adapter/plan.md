---
title: "Implementation Plan: Phase 7: dispatch-recognition-and-stress-adapter"
description: "Extends the dispatch-audit hook to recognize dsh task shapes and check the packet's hard rules, and adds a dsh shim and stress suite to the cli-adapter matrix. Node tests prove the hook cases and vitest proves the stress suite beside the unchanged Pi and Hermes suites."
trigger_phrases:
  - "dispatch recognition and stress adapter plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: dispatch-recognition-and-stress-adapter

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM hooks (`.mjs`), TypeScript stress tests, CommonJS shims (`.cjs`) |
| **Framework** | The dispatch hook library and the deep-loop stress adapter harness |
| **Storage** | None |
| **Testing** | `node --test` for the hooks, vitest for the stress suites |

### Overview
The dispatch-audit hook gains a dsh task shape beside the Pi and Hermes shapes, and the rule checks gain four dsh rules. The stress matrix gains a dsh subject driven by a new shim. Both hook tests, the new stress suite and the unchanged Pi and Hermes suites prove it.

Authoring mode is `sk-code` `sk-code-skilled` for hooks and tests. The executor is `cli-codex gpt-6-luna xhigh fast`. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/phase-plan.md:156-171]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls .skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` prints the path
- [ ] `rg -n 'buildDshLineageCommand' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints a line
- [ ] Both hook tests and `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` pass before any edit, counts recorded

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] Both hook tests print `# fail 0` and the dsh stress suite passes
- [ ] `spec.md`, `plan.md` and `tasks.md` agree on files and commands
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Per-binary shape table. Each runtime adds one match shape and one shim, and shared code changes only when it cannot express the new runtime.

### Key Components
- **`dispatch-audit.mjs`**: matches `dsh (--profile )?headless` with a task or `-`, through env and shell wrappers, and skips `dsh plugin`, `--dump-*` and `--help`.
- **`dispatch-rule-checks.mjs`**: flags a missing `-`, a missing `--approval-policy never`, a missing route patch and a repo-root cwd, each with its `hard-rules.json` id.
- **`dsh-shim.cjs`**: emulates `--json` event streams and exit codes for completed, error, denial, timeout, stdin and lineage-write cases.

### Data Flow
A Bash tool call reaches the dispatch hook. The audit decides whether it is a dsh task. If it is, the rule checks run and report any broken rule. In tests, the stress suite spawns the shim through the phase 006 builder and asserts each scenario's outcome.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dispatch-audit.mjs` shape table | Matches task shapes per binary | update | `dispatch-audit.test.mjs` positive and negative dsh cases |
| `adapter-shim-core.cjs` | Shared shim emulation for all runtimes | unchanged unless it cannot express the dsh JSON stream | `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` pass unchanged |
| `cli-pi.vitest.ts`, `cli-hermes.vitest.ts` | Sibling stress suites | not a consumer of the dsh shape | `git diff --exit-code` on both files |

Required inventories:
- Same-class producers: `rg -n 'hermes' .skilled/hooks/dispatch/lib/dispatch-audit.mjs` lists the shape entries the dsh entry sits beside.
- Consumers of changed symbols: `rg -n 'adapter-shim-core' .skilled/skills/system-deep-loop/runtime/tests/stress`.
- Matrix axes: wrapper (bare, env, shell), subcommand (task, `plugin`, `--help`, `--dump-config`), stdin marker present or absent.
- Algorithm invariant: a command matches only when it runs a headless dsh task. Adversarial cases are `dsh plugin --profile x add y`, `dsh --profile headless --help` and `dsh --profile headless --dump-config`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baseline test counts. Implementation writes the negative cases first, then the regex, the rule checks, the shim and the stress suite. Verification reruns every suite and confirms the Pi and Hermes suites are unchanged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | dsh shape matching and rule checks | `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` and `dispatch-rule-checks.test.mjs` |
| Integration | The dsh subject through the shim and builder | vitest on `tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` |
| Manual | Sibling suites untouched | vitest on `cli-pi.vitest.ts` and `cli-hermes.vitest.ts`, then `git diff --exit-code` on both |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 `hard-rules.json` | Internal | Yellow, not built yet | Rule checks have no rule ids to cite |
| Phase 006 kind and builder | Internal | Yellow, not built yet | The stress suite has no builder to drive |
| Node test runner and vitest | Internal | Green | None. No new package is installed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the dispatch hook blocks or flags a non-dsh command it passed before, or a sibling stress suite fails.
- **Procedure**: revert the phase commit with `git revert <sha>`, which restores the hook and the stress harness together.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 003 and 006 landed | Implementation |
| Implementation | Baseline test counts recorded | Verification |
| Verification | Hook, rule checks, shim and suite written | Phase close, then phase 012 |
<!-- /ANCHOR:phase-deps -->

---
