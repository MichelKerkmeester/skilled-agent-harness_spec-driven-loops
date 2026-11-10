---
title: "Implementation Plan: Phase 4: opencode-devin-live-capture"
description: "Probe OpenCode and Devin's live answer surfaces first, then add a live adapter only where a probe proves the answer arrives, keyed the same as the save-time reader so the capture core dedupes the two. A real redacted session_message fixture replaces the inferred test of OpenCode's newest layout."
trigger_phrases:
  - "opencode devin live capture plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: opencode-devin-live-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`), one TypeScript Stop-hook adapter compiled to `runtime/dist/` |
| **Framework** | OpenCode plugin API (`dualPlugin` from `.opencode/plugins/lib/v2-bridge.js`) and Devin command hooks in `.devin/hooks.v1.json` |
| **Storage** | The gitignored queue under `.skilled/skills/.state/decision-capture/`. OpenCode's `opencode.db` and Devin's transcripts are read only. |
| **Testing** | `node --test` for the hook and reader files, `node --test` on `.opencode/plugins/tests/*.test.cjs`, runtime vitest for the Devin Stop hook |

### Overview
The change adds live capture to OpenCode and Devin where a live probe shows the answer reaches a hook, and keeps the save-time readers as the backstop. Each live adapter calls the same `normalizeAskUserQuestion` the readers call, with the same runtime name, session id and call id, so `appendRecords` drops whichever producer comes second. A real `session_message` row, redacted, turns the one inferred reader path into a tested one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `node --test` on `sweep-opencode.test.mjs` and `sweep-devin.test.mjs` prints `pass 11` and `fail 0`, the baseline in spec.md Measured Behavior.
- [ ] The operator has said yes to one harmless probe question in OpenCode and one in Devin.
- [ ] `cat .skilled/skills/.state/decision-capture/probe/opencode.json probe/devin.json` shows `hook_payload` UNKNOWN for both, the state this packet starts from.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/bin/*.test.mjs .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0`, and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS when a Devin binding was added.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Thin adapters over one core. Each runtime adapter only maps its payload into the core's normalized call. The core owns filtering, keys and dedupe.

### Key Components
- **`.opencode/plugins/decision-capture.js`**: a plugin, modeled on `sk-code-post-edit-quality.js` (its `tool.execute.after` at line 113 and `experimental.chat.system.transform` at line 142), that queues answers from the proven surface and pushes the pending-answer line into `output.system`.
- **`.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs`**: a Devin `PostToolUse` command hook, modeled on the Claude adapter `claude/ask-capture-posttooluse.mjs:42-69` and on the Devin payload fields `dispatch/devin/dispatch-audit-posttooluse.mjs` reads (`tool_name`, `tool_input`, `tool_response`, `session_id`, `tool_use_id`).
- **`runtime/hooks/devin/session-stop.ts`**: today it runs the Claude Stop hook through `runClaudeHookAdapter` and drops its stdout (line 32). The Claude hook already computes the nudge (`claude/session-stop.ts:96-113`) and prints it as `systemMessage` (line 659), so the Devin adapter can forward that text through `emitDevinContext` (`devin/shared.ts:127`) once the probe shows Devin displays Stop context.

### Data Flow
A live question call ends, the runtime fires its hook and the adapter builds `{ runtime, sessionId, toolUseId, toolInput, toolResponse }` for `normalizeAskUserQuestion`. The core keys each answer as `runtime:sessionId:toolUseId:index` (`capture-core.mjs:56-58`) and appends it under a lock. At save, the readers rebuild the same keys from stored data: OpenCode from `part.callID` (`sweep-opencode.mjs:86`) and Devin from `result.source_call_id` (`sweep-devin.mjs:127`). A key already in the queue is skipped, so the reader adds only what the hook missed.

When a probe shows the hook payload lacks the answer but the store already holds it at turn end, the near-live path replaces the hook: OpenCode's plugin runs `sweepOpenCodeSession` for its own session on `session.idle`, and Devin's Stop adapter runs `sweepDevinTranscript` for its session before it computes the nudge. Both open the runtime's store read-only, as the readers already do (`sweep-opencode.mjs:129`).

The probes proved the live hook for both runtimes, so neither near-live path was built. The Devin Stop adapter is unchanged, because Devin did not display the Stop context line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/capture-core.mjs` `toolSourceKey` and `appendRecords` | Owns the queue key and the dedupe | unchanged | `rg -n 'toolSourceKey' .skilled/hooks/decision-capture` lists the readers and each new adapter, and the same-key test passes |
| `bin/sweep-opencode.mjs` `loadOpenCodeParts` | Converts `session_message` items into the part shape (lines 145-165) | update only if the real-row test fails | the real-row test fails first, then passes |
| `bin/sweep-devin.mjs` | Save-time Devin reader | unchanged | `node --test bin/sweep-devin.test.mjs` still prints `pass 5` |
| `runtime/hooks/claude/session-stop.ts` `decisionCaptureNudge` | Computes the pending count through `takeNudge` | unchanged, read by the Devin adapter | runtime vitest `hook-session-stop` still passes |
| `hook-registry.json` and `.devin/hooks.v1.json` | Registry is the source, the Devin file is generated | update and regenerate when the Devin adapter lands | `sync-hook-registrations.cjs --check` prints PASS |
| `.opencode/plugins/tests/plugin-inventory.json` | Declares each plugin's hooks to the inventory test | update when the plugin lands | `node --test .opencode/plugins/tests/plugin-inventory.test.cjs` passes |

Required inventories:
- Same-class producers: `rg -n 'normalizeAskUserQuestion' .skilled/hooks/decision-capture .opencode/plugins`.
- Consumers of changed symbols: `rg -n 'decisionCaptureNudge|takeNudge' .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.mjs' --glob '*.md'`.
- Matrix axes: runtime (OpenCode, Devin) by producer order (live first, reader first) by answer state (answered, skipped, dismissed). Twelve rows, each asserting one queue line or none.
- Algorithm invariant: for one answered call, the live adapter and the reader produce byte-equal keys. Adversarial cases: a hook session id that differs from the stored one, a call id that differs in prefix or case, a multi-question call with one skipped answer.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup probes both live surfaces and captures one real `session_message` row. Implementation adds a failing-first fixture test, then an adapter for each proven surface and the nudge path. Verification runs the suites, the same-key tests and the 006 live-conversation re-proof. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The real `session_message` fixture case, each adapter's payload mapping, the kill switch and the fail-open paths | `node --test` |
| Integration | Adapter then reader on one call leaves one queue line, and reader then adapter does too, per runtime | `node --test` on a temp project with `appendRecords` |
| Manual | One harmless question per runtime for the probe, then the 006 multi-turn live conversation | OpenCode and Devin interactive sessions, run by the operator or the 006 harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator consent for the two live probes | External | Yellow | No adapter may be written. The runtime stays save-time only, recorded under REQ-005. |
| `node:sqlite` read-only access to `opencode.db` for the `session_message` sample | Internal | Green | Without a sample, REQ-003 stays unmet and the layout stays inferred. |
| The harness in `../006-live-conversation-test/` | Internal | Yellow | REQ-008 waits until 006 can drive OpenCode and Devin sessions. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A live adapter writes a duplicate queue line, breaks a tool call or prints into the OpenCode TUI.
- **Procedure**: Set `SYSTEM_DECISION_CAPTURE_DISABLED=1`, the `decision-capture` kill switch in `.skilled/hooks/README.md:47`, to disable every adapter at once, then revert the change's commit and rerun `sync-hook-registrations.cjs` so `.devin/hooks.v1.json` drops the binding. The save-time readers keep working throughout.
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
| Setup | Operator consent for the probes | Implementation, because no adapter is written before its probe |
| Implementation | The probe results and the captured `session_message` row | Verification |
| Verification | Implementation and the 006 harness | Closing this packet |
<!-- /ANCHOR:phase-deps -->

---

