---
title: "Implementation Plan: Phase 21: brief-head-parity"
description: "Changes one condition in the recommend handler so the head row keeps its command under every request shape, makes the renderer's companion line print its policy word and skip a repeated command, and labels the OpenCode head from the first passing row. A two-path head probe proves the runtimes agree."
trigger_phrases:
  - "brief head parity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: brief-head-parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node for the advisor runtime, plain JavaScript for the OpenCode plugin |
| **Framework** | The skill advisor runtime and the OpenCode plugin host |
| **Storage** | None |
| **Testing** | Vitest for the runtime, `node --test` for the plugin, one two-path head probe |

### Overview
The recommend handler keeps the command on the first recommendation whichever request shape the caller sent, which removes the one difference between the Claude head and the OpenCode head. The renderer's companion line gains the policy word the head already prints and is left out when it would repeat a printed command. The plugin takes its head label from the first passing row. The proof is a failing-then-passing test per change and a probe that prints `same head: true` for all 15 prompts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `scratch/before.txt` holds the start commit, 0 failed, `fail 0` and the floor lines (T001)
- [ ] `scratch/repro-before.txt` holds the head probe output (T002)
- [ ] The files in the Affected Surfaces table are unchanged since `BASE`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD npx vitest run` in the advisor runtime reports 0 failed and the plugin tests report `fail 0`
- [ ] `scratch/after.txt` ends with `RESULT: every floor holds`
- [ ] `scratch/repro-after.txt` prints `same head: true` 17 times
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at producer.

### Key Components
- **`enrichCompiledRoutes` in `handlers/advisor-recommend.ts`**: the one place a command is taken off the head. Fixing it here serves every caller of the head row.
- **`companionCommandLabel` and the companion pick in `lib/render.ts`**: the one renderer every runtime shares.
- **The payload parser in the OpenCode plugin**: the only caller that labels the head before the renderer filters. Its request gains `compiledRouteTopOnly`, the option the schema already holds and every hook already sends, because the partner row of an ambiguous head follows that option and the head-row fix does not reach it. No new file or dependency.

### Data Flow
A hook or the plugin sends a prompt to the advisor CLI. The handler attaches the command to the head row and to lower hub rows that do not repeat one. The caller marks which rows pass, and `renderAdvisorBrief` prints the head, one partner when the result is ambiguous and one companion that names a doctor command not already printed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/advisor-recommend.ts` `enrichCompiledRoutes` | Attaches the routed command to hub rows | update (T003) | `handlers/advisor-recommend-compiled-route-option.vitest.ts` |
| `lib/render.ts` `companionCommandLabel`, `renderAdvisorBrief` | Prints the head and the companion | update (T004, T005) | `doctor-brief-render.vitest.ts`, `command-brief-golden.vitest.ts` |
| `.opencode/plugins/system-skill-advisor.js` | Builds the advisor request, parses the CLI payload and labels the head | update (T006, T014) | `.opencode/plugins/tests/system-skill-advisor.test.cjs` |
| `hooks/lib/skill-advisor-cli-fallback.ts` | The Claude, Codex, Cursor, Devin, Pi and DSH path. Filters to passing rows before it labels | unchanged, already correct | The claude lines of the head probe |
| `scripts/routing-accuracy/command-offer.mjs` | Replays the Claude hook to record the offer | unchanged here. Its replay now equals every runtime's head row, and phase 022 states that | The head probe |
| `scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Counts attached commands | unchanged. Its plain tune line is compared in T010 | `scratch/after.txt` |
| `SKA/README.md`, `SKA/hooks/skill-advisor-hook.md` | Show the companion line's form | update (T007, T008) | `rg` for `(<policy>)` |
| The MCP tool and the direct CLI call | Return the recommendation list | a consumer: the head row may now carry a command it lacked in the default shape | `handlers/advisor-recommend-compiled-route-option.vitest.ts` |

Required inventories:
- Same-class producers: `rg -n "recommendations\[0\]" .opencode/plugins/system-skill-advisor.js .skilled/skills/system-skill-advisor/hooks --glob '!**/tests/**'`.
- Consumers of changed symbols: `rg -n "compiledRouteTopOnly|companionCommandLabel|Also: " .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.md' --glob '!**/dist/**' --glob '!**/changelog/**'`.
- Matrix axes: request shape (top only, every row) by head kind (hub with a route, command row, doctor bridge) by companion (none, distinct, repeat) by session (operator, child).
- Algorithm invariant: for one prompt, the first recommendation's `command` and `policy` do not depend on `compiledRouteTopOnly`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the floor lines and the head probe output. Implementation changes `handlers/advisor-recommend.ts`, `lib/render.ts` and the OpenCode plugin, test first, then two documents. Verification reruns the suites, the floors and the head probe and checks the diff names only the planned files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `enrichCompiledRoutes` through the handler, `renderAdvisorBrief`, the plugin's payload parser | Vitest and `node --test` |
| Integration | The child-session render, the head length cap, the golden briefs and the floor lines | Vitest and the two capture scripts |
| Manual | `node --import <tsx loader> scratch/planning/probe-heads.mts` prints `same head: true` 17 times | The real plugin and the advisor CLI against the live daemon |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The advisor daemon | Internal | Green at planning | The head probe cannot run. The three test files still prove each change |
| The compiled renderer the plugin loads | Internal | Rebuilt in T009 | A stale build shows the old companion line in the probe, so the probe runs after the build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A floor line drops, or a runtime's head loses a command it carried at `BASE`.
- **Procedure**: Revert the phase commit and rebuild the advisor runtime. The handler change is one condition and can be reverted alone.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation (lanes H, R, P in parallel, lane D after T004) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | A green suite on the start commit | Implementation |
| Implementation | Setup. T005, T007 and T008 depend on T004 | Verification |
| Verification | Every lane ended | Close, and the offer note in phase 022 |
<!-- /ANCHOR:phase-deps -->

---
