---
title: "Implementation Plan: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "Tighten the ask rule in communication-handoff.md and AGENTS.md Gate 3, then add one ask-surface guard with a shared detector and thin adapters that re-prompt on Claude Code, DSH, OpenCode and Pi and log on Codex and Devin."
trigger_phrases:
  - "ask surface enforcement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM hook scripts, one TypeScript Pi extension, Markdown rule text |
| **Framework** | Runtime hook contracts: Claude Code Stop, DSH plugin `agent/turn-stopping`, OpenCode plugin `session.idle`, Pi extension `turn_end` |
| **Storage** | A per-turn marker file under the OS temp directory; no persistent state |
| **Testing** | `node --test` for the detector and the Claude, Codex, Devin and DSH adapters; vitest (`.skilled/hooks/vitest.config.ts`) for the Pi extension; `node --test` for the OpenCode plugin |

### Overview
The rule text changes first: `communication-handoff.md` §4 and §5 make the §5 tool the required surface and narrow the prose fallback to sessions with no tool, and `AGENTS.md` Gate 3 points at §5 in a byte-neutral edit, because the delivery prefix has 8 bytes of headroom. A new `.skilled/hooks/ask-surface-guard/` concern holds one detector that reads the last assistant message and the turn's tool calls, and thin adapters that re-prompt once per turn through each runtime's own seam. The fixture suite and per-adapter tests prove the verdicts, and `sync-hook-registrations.cjs --check` proves the generated configs match the registry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/ask-surface-guard/**/*.test.mjs` prints `fail 0`, and `sync-hook-registrations.cjs --check` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Shared core, thin runtime shims, the layout `.skilled/hooks/classifier-injection-screen/` already uses.

### Key Components
- **`lib/ask-surface-core.cjs`**: `detectProseMenu(text)` strips fences, inline code, blockquotes and tables, then fires on a closing paragraph with a `?` and two or more option lines (`A)`, `A.`, `1)`, `**A)**`). `evaluateTurn({lastMessage, askToolCalled, surfaceAvailable})` returns `fire` or `pass`, and `markTurn(session, turnKey)` suppresses a second fire in the same turn. It does not reuse `chat-questions.mjs`, because that file's `isProcessQuestion` filter drops Gate 3 menus, which is the case this guard exists for.
- **`claude/ask-surface-stop.cjs`**: synchronous Stop hook. It returns nothing when `stop_hook_active` is true, reads `last_assistant_message` (falling back to the last assistant entry in `transcript_path`), scans the transcript entries since the last user prompt for an `AskUserQuestion` call, and prints `{"decision":"block","reason":...}` on a fire.
- **`dsh/ask-surface-guard.mjs`**: on `agent/turn-stopping`, reads the turn from `agent.session.snapshotEvents()` and calls `agent.steer(reason)`, which queues a next step so the loop does not end the turn (`dsh-agent-loop/lib/index.js:790-797`). Headless sessions are skipped.
- **`.opencode/plugins/ask-surface-guard.js`**: on `session.idle`, reads the last messages through `client.session.messages` (the `system-completion-sentinel.js:73-93` pattern), checks the `question` tool parts, and on a fire calls `client.session.promptAsync` (the `opencode-goal.js:2941-3057` pattern) with an in-flight set and a per-turn marker.
- **`pi/ask-surface-guard.ts`**: on `turn_end`, reads `event.message` and `event.toolResults`, and on a fire calls `pi.sendMessage(..., { deliverAs: "followUp", triggerTurn: true })`, the `session-relaunch.ts:563-568` precedent.
- **`codex/ask-surface-stop.cjs`, `devin/ask-surface-stop.cjs`**: the same evaluation, logged to stderr as an advisory, with no block envelope.

### Data Flow
The runtime fires its turn-end event. The adapter collects the last assistant text and whether the turn called the runtime's ask tool, and checks the kill switch through `isHookEnabled('ask-surface')`. The core returns a verdict. On `fire`, an enforcing adapter writes the per-turn marker and sends one re-prompt naming the tool, and an advisory adapter logs. Any error exits through the fail-open path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/repo-rules/communication-handoff.md` §4-§5 | Owns the ask posture and the only tool-name table | update, bump `version` | `rg -n "AskUserQuestion" AGENTS.md .skilled/repo-rules` hits §5 only |
| `AGENTS.md` Gate 3 | Always-loaded prose A/B/C/D format | update, byte-neutral | `agents-md-check.cjs` A6 stays at or under 16384 bytes to the last anchor |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Hashes AGENTS.md sections | re-mint with `--write` | `agents-md-manifest.cjs --check` exits 0; it already fails before this change on a stale derived key |
| `hook-registry.json` and the generated `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` | Hook bindings | update the registry, regenerate the rest | `sync-hook-registrations.cjs --check` exits 0 |
| `hook-registration-sync.vitest.ts:106` | Asserts 105 bindings | update to the new count | the vitest passes |
| `.pi/extensions/` | Pi symlinks | add one symlink | `--check` verifies it |
| `.dsh/plugins/repo-guards/index.mjs` and `adapters/` | DSH bundle | add one import and one symlink | the DSH adapter test |
| `.opencode/plugins/` and `tests/plugin-inventory.json` | OpenCode plugins | add the plugin and its inventory row | `plugin-inventory.test.cjs` passes |
| `.skilled/hooks/README.md`, `coverage-rationale.md`, `hook-flags.env.example` | Hook inventory and kill switches | add the concern row and `SYSTEM_ASK_SURFACE_DISABLED` | `rg -n "ask-surface" ` over the three files |
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Capture-side question parser | unchanged, not a consumer | the guard keeps its own detector |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the baselines (registry count, `--check`, AGENTS.md bytes). Implementation changes the rule text, then builds the detector and the six adapters and registers them. Verification runs the fixture suite, every adapter test and the registry, manifest and validator checks. `tasks.md` holds the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `detectProseMenu` and `evaluateTurn` over the ten fixtures: three firing menus (lettered, numbered, bold) and seven passes (numbered steps, a question with no options, a fenced menu, a quoted menu, one option, a tool-asked turn, a no-surface session) | `node --test` |
| Integration | Each adapter fed a firing payload, a second fire in the same turn, the kill switch and a malformed payload: Claude and Codex and Devin by spawning the script, DSH through `shared/tests/dsh-plugin-harness.mjs`, OpenCode by calling the plugin's `event` hook with a fake client, Pi with a fake `ExtensionAPI` | `node --test`, vitest for Pi |
| Manual | A live Claude Code turn ending in the original prose menu is sent back once with the `AskUserQuestion` instruction | Claude Code session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.skilled/hooks/shared/hook-flags.cjs` `isHookEnabled` | Internal | Green | No kill switch; a new concern needs no code change there |
| Claude Code Stop `decision: "block"` contract | External | Green | Without it the Claude adapter can only advise |
| DSH `agent.steer` in `dsh-agent-loop` | External | Green | Without it DSH falls back to advisory |
| OpenCode `client.session.promptAsync` | External | Green | Already used by `opencode-goal.js` |
| Pi `sendMessage` with `triggerTurn` | External | Yellow | Restart semantics come from source comments, not a live run; the test checks the call, the manual run checks the effect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a guard re-prompts a turn that held no prose menu, or loops on its own re-prompt.
- **Procedure**: set `SYSTEM_ASK_SURFACE_DISABLED=1` to stop every guard at once, then revert the guard commit and run `sync-hook-registrations.cjs` to regenerate the configs. The rule-text commit reverts on its own.
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
| Setup | None | Implementation |
| Implementation | Setup baselines; the detector before every adapter | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

