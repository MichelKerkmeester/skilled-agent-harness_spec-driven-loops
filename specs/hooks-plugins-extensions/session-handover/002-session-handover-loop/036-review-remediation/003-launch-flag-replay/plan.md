---
title: "Implementation Plan: Phase 3: launch-flag-replay"
description: "Replay the first launch's argument list on every relaunch hop, replace only the start prompt and the five record-backed settings, drop the flags named in one deny list, and document the list in the README."
trigger_phrases:
  - "launch flag replay plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: launch-flag-replay

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ for the wrapper, Node.js for the test runner |
| **Framework** | None, the wrapper is one shell script |
| **Storage** | None, the relaunch record is the only state and its format does not change |
| **Testing** | `node --test` with `node:assert/strict` |

### Overview
Change one function in `.skilled/bin/skilled-loop` so a hop starts from the first launch's stored arguments instead of the carried settings alone. Replace the start prompt with the claim seed, replace the five settings the record overrides, and drop each flag one deny list names. Prove it in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, where one new case per runtime arm fails before the change and the whole suite passes after it.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One builder, one hop

### Key Components
- **`build_relaunch_arguments` in `.skilled/bin/skilled-loop`**: the only builder of a hop's argument list, defined at line 477 and called for the hop at line 1017.
- **The deny list in `.skilled/bin/skilled-loop`**: one named list of flags that must not repeat on a hop, read by the builder before it appends an argument.
- **`original_arguments` in `.skilled/bin/skilled-loop`**: the first launch's list, stored at line 606, which the builder reads instead of the carried settings alone.

### Data Flow
The wrapper stores the first launch's `"$@"` in `original_arguments` and scans it once. The scan classes every element with two per-runtime tables taken from that runtime's own `--help`: options that take a value, and options that take none. A value is one word, or every following word for a repeating option such as Claude's `--add-dir`. A word no option claims is a positional: the start prompt, or a session-selecting subcommand word such as Codex `resume`. OpenCode's positional is the project path. It is dropped like the others, as it is today, because the wrapper changes to the recorded working directory before the hop. `--option=value` forms need no table.

The scan builds one list, the replayed extras: every option with its values in the first launch's order, minus the record-backed settings, the deny list and the positionals. `build_relaunch_arguments` keeps its current output for the record-backed settings and the seed, then appends the replayed extras after the seed, or before the `--` separator on Devin. A seed that sits before the extras cannot be read as one more value of a repeating option. A hop with no extra flag is therefore the list it is today.

The deny list holds the flags that pick, continue, fork or place a session, and the flags that carry the start prompt. Claude: `-c`, `--continue`, `-r`, `--resume`, `--fork-session`, `--from-pr`, `--session-id`, `--teleport`, `--cloud`, `-w`, `--worktree`, `--tmux`. Pi: `-c`, `--continue`, `-r`, `--resume`, `--session`, `--session-id`, `--fork`. OpenCode: `-c`, `--continue`, `-s`, `--session`, `--prompt`. Codex: `-i`, `--image`, `--worktree`, and the `resume` and `fork` flags `--last`, `--all` and `--include-non-interactive`. Devin: `-c`, `--continue`, `-r`, `--resume`, `--prompt-file`, `-p`, `--print`. Cursor: `--resume`, `--continue`, `-w`, `--worktree`, `--worktree-base`, `--skip-worktree-setup`.

An option in neither table replays as written. Among the Codex `-c` settings only `model_reasoning_effort=...` and `model=...` stay out of the replay, because the record supplies the effort and `-m` supplies the model, and a hop must not name a model twice. A first launch that names its model only through `-c model=...` has that value carried as the model, so the hop emits it as `-m`. Every other `-c key=value` replays. A short option written with its value attached, such as `-rabc`, is classed by its first two characters when the whole token is in no table. An option that carries its value after `=` is never ambiguous. An option whose value is required takes the next word even when it starts with a dash. An option whose value is optional, such as Claude `--debug`, never does, so a deny-listed flag after it is still seen. An option in neither table that is followed by a bare word is ambiguous, because the word may be its value or the start prompt. A wrong guess either hands the seed to that option or starts the hop on the old prompt. The wrapper warns at launch, and at the hop it consumes the record, prints the manual claim command and exits without starting a session, the way it already declines a hop for a note that is not open. The same builder also prints the manual claim command, which keeps its current carried set through an explicit mode so its documented shape and tests do not change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Finding class: `class-of-bug`. The builder drops every flag outside its carried set, so the fix must cover the whole class of dropped flags and not just `--permission-mode`. All six runtime arms read the same builder, so the evidence is one case per arm.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `build_relaunch_arguments` in `.skilled/bin/skilled-loop` | Builds a hop's argument list from the carried settings alone, starting at line 477 | update | `rg -n 'build_relaunch_arguments|original_arguments' .skilled/bin/skilled-loop` prints the definition, the first-launch store and the hop call |
| The deny list in `.skilled/bin/skilled-loop` | Does not exist, so every first-launch flag is either carried or dropped | create | `rg -n 'deny' .skilled/bin/skilled-loop` prints the list and its filter |
| `build_manual_command_template` in `.skilled/bin/skilled-loop` | Calls the same builder at line 554 to print the manual claim command | unchanged, it keeps the current carried set through an explicit mode | `node --test --test-name-pattern 'manual command' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |
| `find_manual_template_conflict` in `.skilled/bin/skilled-loop` | Calls the same builder at line 573 to find a carried value holding `@@HANDOFF@@` | unchanged, it reads the template mode | `node --test --test-name-pattern 'placeholder' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |
| The carried-arguments paragraph in `.skilled/hooks/session-relaunch/README.md` | Says the wrapper preserves model, effort, name, provider and Pi extensions and is silent on the rest, at line 83 | update | `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1 |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Asserts the exact second-hop list at line 527 and prints manual commands at several lines | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |

Required inventories:
- Same-class producers: `rg -n 'build_relaunch_arguments|original_arguments' .skilled/bin/skilled-loop`.
- Consumers of changed symbols: `rg -n 'build_relaunch_arguments|SKILLED_LOOP_MANUAL_TEMPLATE' .skilled --glob '*.cjs' --glob '*.md'`.
- Matrix axes: runtime arm (Claude, Pi, OpenCode, Codex, Cursor, Devin), record override (the five settings present or absent), and deny list (one listed flag, one unlisted flag). Minimum rows: 6 arms times 2 override states, which is 12, plus one deny case per arm.
- Algorithm invariant: the hop's list is today's list for the record-backed settings and the seed, followed by the replayed extras in the first launch's order. Nothing else is added, and nothing is dropped except a positional, a record-backed setting or a deny-listed flag. Adversarial cases: a value equal to `--`, a value that starts with `-`, a flag at the end with no value, a `--` separator before the prompt, and a prompt that equals a flag name.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the Setup, Implementation and Verification checkboxes and task state. Setup reads the builder, its three call sites and the README paragraph. Implementation writes the failing replay and deny-list cases first, then changes `.skilled/bin/skilled-loop` and the README paragraph. Verification runs the full suite, the documentation check and the strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `build_relaunch_arguments` replay order, the five replaced settings and the deny list | `node --test` with `node:assert/strict` |
| Integration | The wrapper's first launch, hop and printed manual command in the suite's sandbox | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` |
| Manual | N/A: the suite spawns the wrapper with stub runtimes, so no manual launch is needed | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` with `node --test` | Internal | Green | No replay case can run and the handoff criterion cannot be met |
| `bash` 3.2+ | Internal | Green | The wrapper cannot run, so no hop is built |
| `rg` | Internal | Green | The documentation and inventory checks cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the full suite fails on a case outside the ones this phase updates, or the printed manual claim command no longer matches its documented shape.
- **Procedure**: revert the commit that changes `.skilled/bin/skilled-loop` and `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, then run `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` and confirm it exits 0.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | - | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
