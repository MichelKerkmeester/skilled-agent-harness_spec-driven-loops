---
title: "Implementation Plan: Phase 12: session-name-carry"
description: "Carry a Claude /rename across a hop and number each receiver's name. The Claude log reader returns the last custom title, prepare records it before the launch name, consume prints it, and the wrapper replays the stem with the receiver's session number. Test first, after phase 011."
trigger_phrases:
  - "session name carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: session-name-carry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS) in the relaunch hooks, Bash in the `skilled-loop` wrapper |
| **Framework** | None, Node built-in modules |
| **Storage** | The JSON relaunch record in the relaunch state directory and the Claude JSONL session log, read only |
| **Testing** | `node:test` with `node:assert/strict`, and the wrapper harness `skilled-loop-wrapper-harness.cjs` |

### Overview
The name moves through four files: the Claude log reader finds the last `customTitle`, `prepare` records it ahead of `SKILLED_LOOP_NAME`, `consume` prints it, and the wrapper replays its stem with the receiver's number. Each change gets a failing test first. The proof is the relaunch suites, the named hop-name tests and one strict validation run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator gave the greenlight to build
- [ ] Phase 011 is built, and `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 on its tree
- [ ] `goal.md` section 4 records the scratch session answer from `REQ-001`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Record field read back.

### Key Components
- **`lib/context-usage.cjs` `readClaudeSettings`**: reads the live name from the last `custom-title` entry. Without it the record never sees a `/rename`.
- **`lib/relaunch-core.cjs` `resolveSessionSettings`**: passes `name` from the reader to `prepare`.
- **`bin/session-relaunch.cjs` `prepare` and `consume`**: write the live name to the record and print it back.
- **`.skilled/bin/skilled-loop`**: reads `name` from consume, computes the stem and replays the numbered name in hop mode only.

### Data Flow
A `/rename` writes `{"type":"custom-title","customTitle":...}` to the Claude log. `prepare` calls `resolveSessionSettings`, which calls `readClaudeSettings` on that log and gets `{model, effort, name}`. `prepare` writes `name` to the record, ahead of `SKILLED_LOOP_NAME`. After the runtime exits, `consume` prints the record with `name`. The wrapper raises `SKILLED_LOOP_HOPS` to H at line 1194, reads `name`, checks it, strips the sender's ` (H)` when H is 2 or more, exports the stem as `SKILLED_LOOP_NAME`, and `build_relaunch_arguments` in hop mode appends `--name "<stem> (H+1)"`. Pi has no live-name reader in this phase, so its record name is the exported stem and it gets the same number.

### Name Rule
- **Source**: the consumed `name` when it is non-empty, does not start with `-` and holds no C0 control character or DEL. Otherwise `SKILLED_LOOP_NAME`, with a warning on stderr when a consumed value was refused.
- **Stem**: the source, less a trailing ` (H)` only when H is 2 or more. H is the sender's own number on hop H, so only the suffix this wrapper wrote is removed.
- **Hop replay**: `<stem> (H+1)`. The first receiver is `(2)`, because the first session is session 1 and carries no number.
- **Manual command**: the stem with no number, because a manual claim starts a new wrapper whose hop count is 0.
- **No stacking**: whether or not a launch `--name` writes a `custom-title` entry, the sender's live name on hop H is either the stem, a fresh rename, or `<stem> (H)`, and only the last carries a number this rule removes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `readClaudeSettings` in `lib/context-usage.cjs` (lines 229 to 255) | Returns model and effort from the Claude log | update | `node --test --test-name-pattern 'custom title' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` |
| `resolveSessionSettings` in `lib/relaunch-core.cjs` (line 728) | Hands the settings to `prepare` | update | The prepare test in `REQ-003` |
| `prepare` in `bin/session-relaunch.cjs` (line 560) | Writes `name` from the environment | update | `node --test --test-name-pattern 'custom title over SKILLED_LOOP_NAME' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` |
| `consume` in `bin/session-relaunch.cjs` (line 793) | Prints model, provider and effort | update | `node --test --test-name-pattern 'consume reports the record name' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` |
| `should-relaunch` in `bin/session-relaunch.cjs` (line 641) | Already prints `name` | unchanged | The wrapper does not read it, and `rg -n 'record.name' .skilled/bin/skilled-loop` prints nothing |
| `build_relaunch_arguments` in `.skilled/bin/skilled-loop` (lines 616 and 631) | Replays the launch name | update | The wrapper tests in `REQ-005` and `REQ-006` |
| Option comments in `.skilled/bin/skilled-loop` (lines 477 and 590) | Claim the lists follow each runtime's help | update | `rg -n 'no name flag' .skilled/bin/skilled-loop` |
| `.skilled/hooks/session-relaunch/README.md:83` | Says the name comes from the record | not a consumer | Phase 017 rewrites it |
| `.opencode/plugins/session-relaunch.js` | Ignores the record name | not a consumer | Phase 013 owns the OpenCode title |

Required inventories:
- Finding classes: the lost `/rename` is `cross-consumer` (reader, record, consume, wrapper), the unnumbered hop name is `instance-only`, the option comments are `matrix/evidence`, and the wrong research line for `consume` is `matrix/evidence`.
- Same-class producers: `rg -n 'SKILLED_LOOP_NAME' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/bin .skilled/hooks/session-relaunch/lib` before the edit.
- Consumers of changed symbols: `rg -n 'readClaudeSettings|resolveSessionSettings|consumed_field|SKILLED_LOOP_NAME' .skilled .opencode/plugins --glob '!**/node_modules/**'`.
- Matrix axes: runtime (Claude, Pi, the four with no flag), source (launch name, live title, none), hop (1, 2, 10), name ending (none, ` (H)`, another number), consumed value (valid, starts with `-`, control character), mode (hop, manual).
- Algorithm invariant: the replayed name is never `<x> (H) (H+1)` for a name this wrapper numbered, and a name never becomes an option.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup settles the open point in one scratch Claude session, confirms phase 011 is built and records the suite baseline. Implementation adds the reader, prepare, consume and wrapper changes in that order, each after its failing test, then amends the five guards and corrects the two comments. Verification runs the relaunch suites, the named tests, the performance check and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `readClaudeSettings`, `resolveSessionSettings` through `prepare`, `consume` output | `node:test` |
| Integration | The wrapper hop and manual argv through the harness stub | `node:test` with `skilled-loop-wrapper-harness.cjs` |
| Manual | One scratch Claude session started with `--name probe-name`, read by entry type only | `claude`, `node -e` over the JSONL log |

Each new test runs first as `env -u AI_SESSION_CHILD node --test --test-name-pattern '<title>' <file>` and must exit 1 with its assertion failure. After the source edit the same command must exit 0 with `fail 0`. The full gate is `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 built | Internal | Red | It edits `consume` and the Claude replay in the same files, so building first would force 011 to rebase on this phase |
| Operator greenlight | Internal | Red | Nothing is built before it |
| One scratch Claude session | External | Yellow | `REQ-001` stays UNCONFIRMED, while the stem rule still holds |
| Node.js test runner | Internal | Green | No test can run |
| `rg` | Internal | Green | The comment check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a relaunch suite fails after the change, a hop replays a stacked suffix, or `prepare` slows past the limit in NFR-P01.
- **Procedure**: revert the phase's one local commit. The record keeps the same keys, so a record written before or after the revert stays readable. No data is migrated.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 011 ──► Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 011 built and the operator greenlight | Implementation |
| Implementation | Setup, with the `REQ-001` answer recorded | Verification |
| Verification | Implementation | Close, and phase 017's README sentence on names |
<!-- /ANCHOR:phase-deps -->

---
