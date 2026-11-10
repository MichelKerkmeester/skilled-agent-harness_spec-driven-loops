---
title: "Implementation Plan: Phase 3: codex-and-pi-capture"
description: "Probe Codex and Pi under the tool names they actually record, then add a save-time reader for each runtime whose answers can be tied to the question, or a recorded refusal pinned by a test. Pi already shows answered results in stored sessions; Codex needs one live interactive probe first."
trigger_phrases:
  - "codex and pi capture plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: codex-and-pi-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) for the readers; TypeScript for a Pi extension, loaded by Pi directly |
| **Framework** | The 001 capture core (`lib/capture-core.mjs`) and Pi's extension API (`pi.on('tool_result', ...)`) |
| **Storage** | Gitignored JSONL queue under `.skilled/skills/.state/decision-capture/`; reads `~/.pi/agent/sessions` and `~/.codex/sessions` |
| **Testing** | `node --test` with redacted fixtures, the same harness as `sweep-devin.test.mjs` |

### Overview
Each runtime gets a probe first and then one of two exits. Pi already has an observed answer surface: the `ask_user_question` tool result keeps `details.answers[]`, so the plan adds `bin/sweep-pi.mjs` on the `sweep-devin.mjs` pattern and registers a live extension only after a live probe. Codex's `request_user_input_async` returns `{"accepted":true}` before any answer exists, so one consented interactive probe decides between a reader and a refusal pinned by a test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] From the repo root, `bash specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/003-codex-and-pi-capture/scratch/measure-answer-surfaces.sh` prints the same counts as the spec's Measured Behavior block, or the differences are noted in `implementation-summary.md`.
- [ ] The operator has consented to one live Codex probe and one live Pi probe, each with a harmless question, and the consent is recorded in `implementation-summary.md`.
- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` passes, so the pattern being copied is green.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` reports `fail 0`, and `sync-hook-registrations.cjs --check` prints PASS.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Save-time session reader. Each runtime gets a script under `.skilled/hooks/decision-capture/bin/` that the save step runs before writing, as OpenCode and Devin already have.

### Key Components
- **`bin/sweep-pi.mjs`**: finds the Pi session file for the project (or takes `--transcript <path>`), pairs each `ask_user_question` toolCall with its toolResult, skips `cancelled:true`, and passes question, options and answer to `normalizeAskUserQuestion` and `appendRecords`.
- **Codex exit**: `bin/sweep-codex.mjs` when the probe ties the reply to the call, or `bin/runtime-refusal.test.mjs` plus a `n/a:` README cell when it cannot.
- **`.pi/extensions/decision-capture.ts`** (conditional): a `tool_result` handler for `toolName === 'ask_user_question'` that reads `event.details.answers`, registered only after the live Pi probe.

### Data Flow
The operator answers a question in Pi or Codex. The runtime writes the call and its result to its session file. At `/speckit:save`, the runtime's reader parses that file, keys each answered question with `toolSourceKey(runtime, sessionId, callId, questionIndex)` and appends new keys to the queue. The 001 save flow then filters, rewrites and consumes those lines unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/capture-core.mjs` | Owns normalization, process filtering, dedup and the queue append | unchanged | `git diff --quiet -- .skilled/hooks/decision-capture/lib/capture-core.mjs` exits 0 |
| `probe/pi.json` and `probe/codex.json` | Record each runtime's answer surface; both searched the wrong tool name | update | `jq -r .method` names `ask_user_question` and `request_user_input_async` |
| `.skilled/commands/speckit/save.md` | Tells the save step which reader to run per runtime | update | `rg -n 'sweep-pi.mjs' .skilled/commands/speckit/save.md` prints a line |
| `.skilled/hooks/README.md` coverage row | Documents per-runtime coverage of `decision-capture` | update | `rg -n '^\| .decision-capture. \|' .skilled/hooks/README.md` shows the new Codex and Pi cells |
| `hook-registry.json` | Binds live adapters per runtime | update only after a live probe | `sync-hook-registrations.cjs --check` prints PASS |
| Decision-record writer and save writer | Consume queue lines | not a consumer of the change | The queue line shape is the core's, so no writer test changes |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.

For this packet: the same-class producers are the four probe files, checked with `jq -r .method .skilled/skills/.state/decision-capture/probe/*.json`. The matrix axes are runtime (Codex, Pi) by result (answered, cancelled, rejected for bad arguments, multi-question). The invariant: a queue line exists only for a question a human answered.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup re-probes Pi offline and runs the consented live Codex probe. Implementation builds the Pi reader and takes one Codex branch. The probe chose branch (a): the synchronous `request_user_input` ties each answer to its call, so the Codex reader was built (`decision-record.md` ADR-001). Verification runs the node tests, the registry check and the 006 live-conversation re-proof.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The one command: `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` must report `fail 0`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `sweep-pi.mjs`: answered call queues one line per question, cancelled queues none, rerun adds none, missing file exits 0. Codex reader or refusal test, whichever branch runs. | `node --test` with redacted fixtures |
| Integration | The reader's CLI writes to a temp project's queue, and the 001 save flow reads those lines as pending | `node --test` spawning the script, as `sweep-devin.test.mjs` does |
| Manual | One live Pi question and one live Codex question, then the 006 multi-turn run for each runtime | Operator-consented interactive sessions in a scratch project |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@juicesharp/rpiv-ask-user-question` 2.15.0 (listed in `.pi/settings.json`) | External | Green | Without it Pi has no question tool and takes the refusal branch. |
| Codex CLI 0.164.0 in an interactive Plan-mode session | External | Yellow | The Codex answer path stays unobserved; Codex takes branch (b) with the reason "not probed live". |
| Operator consent for the live probes | Internal | Yellow | No live probe runs, so no hook or extension is registered. The Pi save-time reader still ships. |
| `../006-live-conversation-test/` harness | Internal | Yellow | REQ-007 waits; the other requirements can still pass. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a reader queues a line for a question nobody answered, or the Pi extension slows or breaks a Pi tool call.
- **Procedure**: set `SYSTEM_DECISION_CAPTURE_DISABLED=1` to stop a live adapter at once (the Claude adapter checks it through `isHookEnabled('decision-capture')`, and a Pi extension must do the same), then revert the commit, which also removes the reader the save step calls. A queue line already written is local and gitignored, and the save step drops it when the operator rejects it.
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
| Setup | Operator consent for the live probes | The Codex branch choice and any registration |
| Implementation | The Pi offline probe for the Pi reader; the live Codex probe for the Codex branch | Verification |
| Verification | Implementation and the 006 harness | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
