---
title: "Implementation Plan: Phase 38: pi-classifier-transport-integration"
description: "Phase 037 measured Pi's native classifier runtime as an `adopt` for `choice` questions, so this plan wires that route in as an opt-in transport beside the jev CLI. One shared module under cli-classifier answers a `choice` question through Pi's SDK and returns the shape callers read today, the CLI stays the default, each gate failure falls back with one skip line, and only the `choice` callers the design approves change. DeepSeek writes, SWE 2 max or Luna 6 max reviews, and docs go through sk-doc."
trigger_phrases:
  - "pi classifier transport plan"
  - "jev transport switch design"
  - "opt-in pi backend"
  - "choice transport fallback"
  - "classifier transport testing strategy"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 38: pi-classifier-transport-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), standard library, plus Pi's SDK (`ModelRuntime` from `@earendil-works/pi-coding-agent`) and the `jev` CLI for the default path and the fallback |
| **Framework** | None. The module runs Pi's backend in-process through the SDK and spawns `jev` only when the caller is on the CLI route or a Pi gate fails |
| **Storage** | None. The module writes nothing. Its tests use fixture data and its outputs sit under `scratch/` only |
| **Testing** | `node --test`, the convention `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` uses, with both backends stubbed |

### Overview

One shared module under `.skilled/skills/cli-classifier/shared/scripts/` (proposed) answers a `choice` question through Pi's SDK on the 037 identity, `openrouter` `typesafe/jev-1.13`, and returns the result shape callers read from the jev CLI's JSON today. The `jev` CLI stays the default and Pi answers only when a caller or the environment asks for it by name. Each gate failure prints one skip line and falls back to the CLI as `spec.md` section 4 fixes. Opt-in wiring reaches only the `choice` callers the design approves inside cli-classifier, sk-doc and sk-communication, the docs go through sk-doc, and the runtime-tree callers stay unedited and listed as a follow-up.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's ask is recorded: 2026-09-30, "Plan the integration", with the operator's words in `scratch/context/context.md`
- [ ] `scratch/context/context.md` is present and read, with the 037 verdict, Pi's API cites, the 21-file call-site census and the proposed frame
- [ ] Phase 037 is Complete, and its verdict line `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` is in `037-pi-native-classifier-transport/scratch/live-run.stdout.txt`
- [ ] Pi 0.99.1 is installed, and `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` holds the Pi helpers the design reads
- [ ] `jev 0.6.2` is on `PATH`, and `cli-jev/SKILL.md` holds the Output Contract and the Transport Guard
- [ ] The executors are available under D6: DeepSeek V4.1 Flash to write, SWE 2 max on cli-devin or Luna 6 max fast on cli-codex to review

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left open with the reason
- [ ] SWE 2 max or Luna 6 max reviewed every DeepSeek diff and DeepSeek reviewed any fix the reviewer wrote, with no open P0 or P1 finding (parent D5 through D6)
- [ ] The switch-off `diff` is empty for every changed caller, and the key grep exits 1 on the module
- [ ] SWE 2 max, Luna 6 max and DeepSeek between them leave every file hash of a read-only review unchanged
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` prints `packet_durable_chars` at or under 4000
- [ ] The three runtime trees show an empty `git diff --stat`, and only the files in `spec.md` section 3 changed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Small shared module with pure functions and two thin backend seams, one for Pi's SDK and one for the `jev` CLI. The switch is resolved in one place, so every caller opts in the same way and the default path is the module's CLI branch with no Pi import.

### Key Components

- **Switch resolver**: reads the environment value and the per-call option (names proposed in `spec.md` section 10), with unset or empty meaning today's CLI. One unknown-value line, then the CLI.
- **Type gate**: admits `choice` only. A `bool`, `score` or `noul` request goes straight to the CLI and reaches no Pi code.
- **Pi gate**: the three checks of `spec.md` section 4 (package, model, credential), each with one skip line and no Pi call on failure.
- **Pi backend**: one `choice` question through the SDK's `classify(model, context, options?)` on `openrouter` `typesafe/jev-1.13`, reusing or copying the 037 helpers (`resolvePiPackage`, `ModelRuntime.create()`, `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')`, `toClassifierContext`, `probabilitiesFrom`).
- **Result mapper**: maps Pi's answer to the shape the caller reads from the jev CLI's JSON today, per `cli-jev/SKILL.md`'s Output Contract, and treats a partial map as a gate-independent fallback rather than a judgment.
- **CLI backend**: the default and the fallback. The `jev` spawn keeps the caller's own flags, state, provider and model.
- **Skip line**: one line per gate failure, naming the gate, printed before the CLI result.
- **Callers**: only the `choice` call sites the design approves inside cli-classifier, sk-doc and sk-communication.
- **Tests**: `node --test` with a logging `jev` fixture and a stubbed Pi backend, one happy path and one edge case per public surface.

### Data Flow

A caller asks the module for a `choice` judgment. With the switch unset, the module runs the caller's `jev` command and returns the CLI's result, so the bytes are today's. With the switch set to Pi, the module checks the three gates, prints one skip line and falls back to the CLI on the first failure, and otherwise asks Pi once, maps the answer into the CLI's result shape and returns it. Nothing is written, no key is touched, and no runtime-tree caller changes.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Holds the working Pi helpers and the 41-case suite from 037 | Read only, or import the new module when the design proves the import is one line | The scorer's suite stays at 41 pass, 0 fail, and the file's diff is empty when the design chooses copy |
| The `jev` CLI | Today's transport and the fallback | Unchanged. Still the default and still the route every unopted caller uses | The switch-off `diff` is empty and the stub log matches the caller's old calls |
| `.skilled/skills/cli-classifier/shared/` | A README only | Adds the transport module and its tests | `node --test` passes and the key grep exits 1 |
| `cli-jev/SKILL.md`, `cli-pi/SKILL.md`, the catalog and the playbook | The doc surfaces D6 requires | Update through sk-doc for the Pi route and the switch | `validate_document.py` VALID on each changed doc |
| The 13 runtime-tree callers of `spec.md` section 3 | Spawn `jev` directly and stay on the CLI | Not a consumer of this phase | `git diff --stat` on the three trees is empty |
| `cli-classifier` and `cli-pi` mode registries | Route today's transports | Not a consumer of this phase | No registry file changes |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is an integration phase, not a bug fix, so the addendum records the producer and consumer inventories around the changed transport surface.

- Same-class producers: `rg -n "'choice', '--provider'" .skilled/skills` names the call sites of the context's owner breakdown, 20 files across six skill trees, of which 13 sit in the runtime trees this phase never edits.
- Consumers of the changed symbol: after the build, `rg -n 'askChoice|JEV_TRANSPORT' .skilled/skills` lists the module, its tests and each approved caller, with both names proposed until the design fixes them. Every other caller stays a CLI consumer and changes nothing.
- Consumers of the default: every unopted caller. The switch-off check proves their bytes do not move.
- Matrix axes: the switch axis (unset, empty, `jev`, `pi`, unknown), the type axis (`choice`, `bool`, `score`, `noul`), the availability axis (all gates pass, each of the three gate failures, CLI available or absent) and the caller axis (module unit, approved caller, runtime-tree caller left alone).
- Algorithm invariant: with the switch unset the caller's output is byte-identical to its pre-change output, and Pi is reached only after all three gates pass. Adversarial cases: an unknown switch value, a partial Pi map, a gate failure with the CLI also absent, and a non-`choice` type asked for while the switch names Pi.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The six phases below are the plan of record.

**Who builds (parent D5 through this phase's D6).** DeepSeek V4.1 Flash writes the module, the tests, the caller changes and the docs, each dispatched through the external orchestration route. SWE 2 max on cli-devin or Luna 6 max fast on cli-codex reviews every DeepSeek diff, and DeepSeek reviews any fix the reviewer writes. No MiMo or Claude worker writes or reviews. The session records every gate result and commits path-scoped. P0 and P1 findings are fixed and rechecked, P2 findings are recorded.

Each phase's observable check:

1. **Design.** Read the 037 scorer's Pi helpers, the jev result shape callers parse in `cli-jev/SKILL.md`'s Output Contract and each candidate caller, then write the interface, the switch, the gate rule and the test matrix as a design note under `scratch/`. Check: the note names the exports, the exact switch names, the gate rule's per-gate lines, the bytes-invariance plan, the approved caller list and the test matrix, with every `UNKNOWN` item named.
2. **Transport module with stubbed tests.** The switch resolver, the type gate, the Pi gate, the Pi backend, the result mapper, the CLI backend and the skip line, plus their tests. Check: a stub-backed switch-off run returns the CLI's result with no added output, a switch-on run answers one `choice` question through the Pi stub, and `node --test` exits 0.
3. **Caller opt-in.** Only the `choice` callers the design approves, one call site each. Check: each changed caller's switch-off output `diff`s empty against its pre-change recording, and its switch-on output answers through the Pi stub in a test.
4. **Docs through sk-doc.** The `cli-jev` Pi route, the `cli-pi/SKILL.md` classifier section, the catalog entry and the playbook scenario with their index rows. Check: `validate_document.py` exits 0 on each changed doc, and no doc claims a measurement no run printed.
5. **Cross-family review.** SWE 2 max or Luna 6 max reviews every DeepSeek diff and DeepSeek reviews any fix the reviewer writes. Check: one review file with a verdict, no open P0 or P1 finding, each review's file hashes equal before and after, and P2 findings recorded.
6. **Closure.** Record every gate result and the follow-up list, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)`, and `packet_durable_chars` at or under 4000.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root. `M` is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (proposed) and `T` its test file (proposed).

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The switch resolver, the type gate, the result mapper and the exact skip lines, all pure | `node --test` |
| Stub integration | The switch-off path, the switch-on path, each of the three gate failures and the CLI-absent stop, with a logging `jev` fixture and a stubbed Pi backend | `node --test`, stub fixtures |
| Byte invariance | Each changed caller against a stub `jev`, before and after, compared with `diff` | `diff`, stub logs, recordings under `scratch/verify/` |
| Doc gates | `cli-jev`, the `cli-pi/SKILL.md` section, the catalog entry and the playbook scenario | `validate_document.py` |
| Manual | The operator's optional one live smoke call on the real tree | Terminal, the recorded call under `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 037 | Internal | Complete | The phase has no measured basis for Pi |
| Pi 0.99.1 with `ModelRuntime` and a credential in its own store | External, installed | Installed at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent`, with 7 classifier models available through `openrouter` | The Pi route cannot be built or proven, and the transport reduces to the CLI fallback |
| `jev 0.6.2` | External, installed | On `PATH`, pinned in `cli-jev/SKILL.md:97` | The default route and the fallback disappear |
| The 037 scorer and its 41-case suite | Internal | Committed at `b34b9d1907` | The design's move-versus-copy decision loses its check |
| The design's caller approval | Internal | Not yet produced | Only the docs and the module land, with no caller change |
| The operator's yes for a live smoke call | Operator | Not yet given | The smoke call never runs. The build is unaffected |
| DeepSeek V4.1 Flash, SWE 2 max on cli-devin and Luna 6 max fast on cli-codex | External, dispatched | Under D6 | A phase waits or reports the blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A switch-off `diff` is non-empty, the key grep matches, a stub-backed test opens a socket, or a file outside `spec.md` section 3 changes.
- **Procedure**: Stop the phase. Revert its path-scoped commits: the shared module and its tests, the caller call sites, the `cli-jev` route, the `cli-pi` section and the catalog and playbook entries with their index rows. No runtime file changed, so nothing else reverts, and no mode registry or activation manifest needs a remint. Delete any recording under `scratch/` that a later run must not reuse.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design) ──► Phase 2 (Module) ──► Phase 3 (Caller opt-in) ──► Phase 5 (Review) ──► Phase 6 (Closure)
                                              └──► Phase 4 (Docs) ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Design | `scratch/context/context.md`, the 037 scorer and the CLI contract | Phase 2 |
| 2. Module | Phase 1 | Phases 3, 4 |
| 3. Caller opt-in | Phase 2 | Phase 5 |
| 4. Docs | Phases 2 and 3, so the docs describe what the code does | Phase 5 |
| 5. Review | Phases 2 to 4 | Phase 6 |
| 6. Closure | Phase 5, and the operator's yes only for a live smoke call | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Design | Med | One read-and-record pass over the scorer, the contract and the candidate callers |
| 2. Module | Med | One module, its stub seams and its test matrix |
| 3. Caller opt-in | Low | One call site per approved caller plus its invariance recording |
| 4. Docs | Low | Four doc surfaces through sk-doc |
| 5. Review | Med | One review round plus one fix round |
| 6. Closure | Low | The gates and the phase record |
| **Total** | | The six phases above |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline recorded: each approved caller's switch-off recording, the scorer's 41-case result, the key grep exit 1 and the three runtime trees' empty diffs
- [ ] The stubs exist and a switch-off run is byte-identical across two repeats
- [ ] The operator's yes is recorded before any live smoke call

### Rollback Procedure
1. Stop the phase at its failing check.
2. Revert the phase's path-scoped commits, paths only.
3. Rerun the switch-off `diff`, the module's tests and the key grep.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The phase edits no persisted data and no runtime file.
- **Reversal procedure**: Not applicable. A `git revert` of the path-scoped commits removes the module, the caller changes and the doc rows.
<!-- /ANCHOR:enhanced-rollback -->

---
