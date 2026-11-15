---
title: "Feature Specification: Phase 3: launch-flag-replay"
description: "A relaunch hop rebuilds its argument list from the carried model, effort, name, provider and Pi extension settings, so every other first-launch flag is dropped. This phase replays the full first-launch argument list and names the flags that must not repeat in one deny list."
trigger_phrases:
  - "launch flag replay"
  - "phase 3 launch flag replay"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: launch-flag-replay

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-state-dir-read-check |
| **Successor** | 004-claude-window-unknown |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with a case where `--permission-mode plan` survives a hop. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: Argument replay in `.skilled/bin/skilled-loop` and its README paragraph. The relaunch record format is not changed.

**Dependencies**:
- None. Phase 007 edits the same file later, so this phase lands first.

**Deliverables**:
- Full-argument replay with a documented deny list and a test per runtime arm that fails today.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hop rebuilds its argument list from the carried model, effort, name, provider and Pi extension settings alone, so every other first-launch flag is dropped. A session started under `--permission-mode plan` or `--add-dir /tmp` therefore continues after a hop without that restriction, and a session started to run unattended stalls at the first permission prompt.

### Purpose
A relaunch replays the first launch's full argument list, so a restriction or an unattended setting survives every hop unless the relaunch record replaces it or the wrapper's deny list forbids the repeat.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'build_relaunch_arguments|original_arguments' .skilled/bin/skilled-loop
477:build_relaunch_arguments() {
554:  build_relaunch_arguments "$manual_seed"
573:  build_relaunch_arguments "$manual_handoff_token"
606:original_arguments=("$@")
624:  argument="${original_arguments[$index]}"
627:    next_argument="${original_arguments[$((index + 1))]}"
1017:      build_relaunch_arguments "$launch_prompt"
```

The builder starts at line 477 and the hop calls it at line 1017. The first launch's list is stored at line 606 and read only by the option scan at lines 624 and 627, so the hop never sees it. That gap is the defect the Problem Statement describes: `--permission-mode plan` and `--add-dir /tmp` are in the stored list and absent from the hop's arguments.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replay the first launch's argument list in `build_relaunch_arguments` on every hop.
- Replace only the start prompt, which becomes the claim seed, and the five settings the relaunch record overrides: model, effort, name, provider and Pi extensions.
- Name every flag that must not repeat on a hop in one deny list in `.skilled/bin/skilled-loop`.
- Document the replay rule and the deny list in the carried-arguments paragraph of `.skilled/hooks/session-relaunch/README.md`.
- Add one replay case per runtime arm in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`.

### Out of Scope
- The relaunch record format - this phase replays arguments and adds no record field.
- Reading live model or effort from a runtime log - that behavior already works and no finding names it.
- The manual claim command's carried set - it is built from the same function but stays on its documented settings, so its tests and README sentence stay true.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | `build_relaunch_arguments` replays the first launch's arguments, replaces the prompt and the five record-backed settings, and drops the deny list |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The carried-arguments paragraph states the replay rule and names the deny list |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | One replay case per runtime arm, one deny-list case, and the updated second-hop assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hop from `skilled-loop claude --add-dir /tmp --permission-mode plan "first prompt"` starts with `--permission-mode plan` and `--add-dir /tmp` in its arguments, so the restriction survives the hop. Verify: `node --test --test-name-pattern 'replayed with --permission-mode' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test. |
| REQ-002 | A hop replaces only the start prompt and the five record-backed settings, and it adds no duplicate `--model`, `--effort`, `--name`, `--provider` or extension flag. Verify: `node --test --test-name-pattern 'replaces the start prompt and the record settings' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each of the six runtime arms has a replay case, one for Claude, Pi, OpenCode, Codex, Cursor and Devin. Verify: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports six passing tests. |
| REQ-004 | One deny list in `.skilled/bin/skilled-loop` names every flag that must not repeat on a hop, and a hop omits each flag the list names. Verify: `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test. |
| REQ-006 | An option the wrapper's tables do not know, followed by a bare word, leaves the wrapper unable to tell a value from the start prompt. The wrapper then warns at launch, and at the hop it prints the manual claim command and starts no session. Verify: `node --test --test-name-pattern 'unknown option before a bare word' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test. |
| REQ-005 | The carried-arguments paragraph in `.skilled/hooks/session-relaunch/README.md` states that a hop replays the first launch's full argument list and names the deny list. Verify: `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1. |
| REQ-007 | The scan handles the input classes the review of this phase confirmed: an option value that starts with a dash, the `--` separator, an unknown option that carries its value after `=`, a short option written with its value attached, and a Codex model named only through `-c model=...`. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and lists the four cases `a hop keeps a dash-leading value and stops at the separator`, `an unknown option that carries its value is not ambiguous`, `a joined short resume option is not replayed` and `Codex takes its model from a config setting when no model flag is given` as passing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and includes a passing case named `Claude first launch arguments are replayed with --permission-mode and --add-dir`.
- **SC-002**: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports six passing tests, one per runtime arm.
- **SC-003**: `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node --test` on the repository's Node version | No replay case can run | Run the suite the wrapper tests already use, and add no dependency |
| Risk | An existing case asserts the exact second-hop argument list at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:527`, so it fails when replay lands | Med | Update that assertion in the same task that adds the replay cases, then prove the whole suite with `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` |
| Risk | The deny list names a flag whose value is the next argument, and dropping the flag alone would leave the value behind | Med | Give the list one entry shape that states whether the flag takes a value, and prove both shapes in the deny-list case |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The replay adds no process spawn and no second pass over the list, so a hop's startup cost stays at one build of one array.
- **NFR-P02**: A 40-argument first launch replays every position in one pass, and the builder allocates only the launch array and the deny lookup.

### Security
- **NFR-S01**: A restriction flag such as `--permission-mode` survives every hop, so a hop never widens the permission state of the session it replaces.
- **NFR-S02**: A value that holds the `@@HANDOFF@@` placeholder stays visible to `find_manual_template_conflict`, so an unusable manual template is still reported rather than printed.

### Reliability
- **NFR-R01**: A replayed flag with no value does not stall the hop, because the wrapper replays the arguments as given and the runtime reports its own usage error.
- **NFR-R02**: The existing relaunch, manual-command and killer cases stay green, so the change adds no regression outside the replay path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a first launch with no argument except the prompt replays only the claim seed on the hop, with no leftover option.
- Maximum input: a first launch of 40 arguments replays all 40 positions in order, minus a replaced value and minus a deny-listed flag.
- Failure path: a deny-listed flag at the end of the list with its value missing is dropped whole, and the runtime reports its own usage error instead of the wrapper guessing a value.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One function and one deny list in `.skilled/bin/skilled-loop`, one README paragraph, one test file |
| Risk | 9/25 | Argument handling for six runtime arms, with one existing exact-list assertion to update |
| Research | 7/20 | The builder, its three call sites and the first-launch store are already read and measured |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which flags, per runtime, belong on the deny list? A resume or continue flag is the example. UNKNOWN until the deny list is written.
<!-- /ANCHOR:questions -->

---
