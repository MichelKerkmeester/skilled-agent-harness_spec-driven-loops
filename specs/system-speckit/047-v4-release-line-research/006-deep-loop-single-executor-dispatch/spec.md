---
title: "Feature Specification: Phase 6: deep-loop-single-executor-dispatch"
description: "The single-executor half of the deep loops drifted from the fan-out runner: every cli-opencode dispatch fails on a removed flag, research branches on a field the config no longer carries, and CLI leaves never receive their persona. This phase routes the single-executor branches through the shared command builder and closes the verified drift."
trigger_phrases:
  - "deep loop single executor dispatch"
  - "phase 6 deep loop single executor dispatch"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: deep-loop-single-executor-dispatch

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 17 |
| **Predecessor** | 005-doctor-git-ci-runtime |
| **Successor** | 007-deep-loop-state-and-stop-policy |
| **Handoff Criteria** | The four deep YAMLs dispatch cli-opencode through the shared builder, the branch contract test passes, and the deep-loop runtime suite holds its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the v4 release line remediation specification.

**Scope Boundary**: The single-executor dispatch blocks of the deep-research and deep-review workflow YAMLs, the fan-out runner's prompt composition and the research prompt pack. State, stop policy and containment belong to phases 007 and 008.

**Dependencies**:
- The verified findings V01, V02, V03, V04, V05, V21 and V22 in `../research/research.md`

**Deliverables**:
- Single-executor cli-opencode branches built by `buildLineageCommand`
- A fail-closed cli-deepseek-harness single-executor branch
- A static executor-branch contract test
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every single-executor `cli-opencode` deep-loop iteration fails before it starts, because the four workflow YAMLs hand-build an argv that passes `--pure`, which OpenCode v2.2.5 rejects, and hardcode the `opencode` binary. Around that break, the research YAMLs branch on `config.executor.type` while the config carries `kind`, three research dispatch ids read a `{generation}` bound only on restart, `cli-deepseek-harness` is an admitted kind with no single-executor branch, CLI leaves get a path to their persona instead of the persona, and the prompt pack caps tool calls at 12 while the config says 24.

### Purpose
A single-executor deep loop dispatches every admitted CLI kind through the same command builder the fan-out runner uses, or refuses the kind with a clear message, so the two halves stop drifting.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd "$(mktemp -d)" && opencode --version
opencode v2.2.5
$ opencode run --pure --format json "noop" </dev/null; echo "exit $?"
ERROR
  Unrecognized flag: --pure in command opencode run
exit 1
$ rg -c "'--pure'|--pure'" .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml
.skilled/commands/deep/assets/deep-research-auto.yaml:1
.skilled/commands/deep/assets/deep-review-auto.yaml:1
$ rg -n "branch_on: \"config.executor" .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml
.skilled/commands/deep/assets/deep-research-auto.yaml:1204:        branch_on: "config.executor.type"
.skilled/commands/deep/assets/deep-review-auto.yaml:1232:        branch_on: "config.executor.kind"
$ rg -n "Max 12 tool calls" .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
36:- Target 3-5 research actions. Max 12 tool calls total.
$ rg -n "maxToolCallsPerIteration" .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json
12:  "maxToolCallsPerIteration": 24,
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the hand-built cli-opencode argv in the four deep-research and deep-review YAMLs with a call to the fan-out `buildLineageCommand`.
- Add a single-executor `cli-deepseek-harness` branch to the two auto YAMLs that fails closed with a message naming the fan-out path, and correct the note that advertises single-executor support.
- Branch the research YAMLs on `config.executor.kind` and bind the research dispatch ids to `config.lineage.generation`.
- Inline the resolved agent persona into CLI leaf prompts, and render the tool-call cap from `maxToolCallsPerIteration`.
- Remove the unreachable `if_cli_copilot` branches and add a static executor-branch contract test.

### Out of Scope
- A working single-executor dsh dispatch - it needs a lineage cwd, a fresh `DSH_HOME` and the dsh completion validator, which is a design of its own; this phase makes the kind refuse honestly instead.
- The missing cursor, devin, pi and codex branches in `deep-research-confirm.yaml` - not a verified finding; recorded as an adjacent defect.
- State counting, stop policy, lock refresh and containment - phases 007 and 008.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Builder-based opencode branch, dsh refusal branch, `kind` branching, generation-bound ids, persona, tool cap variable |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Builder-based opencode branch, `kind` branching, copilot branch removed, tool cap variable |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Builder-based opencode branch, dsh refusal branch, copilot branch removed, persona |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Builder-based opencode branch, copilot branch removed |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Inline the agent persona into the composed CLI prompt and export the persona block helper |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | Render the tool-call cap from a variable |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Create | Static executor-branch contract test |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Modify | Regenerated so their source digests match the edited YAMLs |
| `.skilled/commands/deep/assets/deep-{research,review}-presentation.txt` | Modify | Name `config.executor.kind`, the field the branches read (review finding) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/{fanout-run,opencode-dual-dispatch,prompt-pack}.vitest.ts`, `runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modify | Direct callers of the changed prompt and template contracts: persona order, closed stdin, the new template variable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No deep YAML passes `--pure`, and every single-executor cli-opencode branch gets its command, args and input from `buildLineageCommand` in `fanout-run.cjs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | A single-executor run with executor kind `cli-deepseek-harness` exits non-zero with a message that names fan-out as the supported path, and no YAML note claims single-executor dsh support. |
| REQ-003 | Both deep-research YAMLs read `config.executor.kind` in every `branch_on`, `skip_when` and dispatch fact, with no `config.executor.type` left. |
| REQ-004 | Every research dispatch id uses `config.lineage.generation`, so no dispatch id depends on the restart-only `{generation}` binding. |
| REQ-005 | A CLI leaf prompt, fan-out or single-executor, carries the resolved agent persona inline between `BEGIN AGENT PERSONA` and `END AGENT PERSONA` markers. |
| REQ-006 | The research prompt pack renders its tool-call cap from `maxToolCallsPerIteration`, and every renderer of the template binds the variable. |
| REQ-007 | No deep YAML carries an `if_cli_copilot` branch. |
| REQ-008 | A unit test fails when a branch key names a kind outside `EXECUTOR_KINDS`, when a `config.executor.<field>` reference names a field the executor schema does not define (such as `type`), or when `--pure` reappears. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -- "--pure" .skilled/commands/deep/assets/*.yaml` prints nothing, and a single-executor opencode argv built by the branch's code passes OpenCode's own flag parser.
- **SC-002**: The deep-loop runtime vitest suite and the four spec-kit deep YAML contract tests pass with no fewer passing tests than the baseline, plus the new contract test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `buildLineageCommand` in `fanout-run.cjs` | The opencode branch inherits the fan-out sandbox rule: an explicit read-only or workspace-write request is rejected for opencode | Pass `danger-full-access` exactly as the fan-out default does for an unspecified opencode sandbox, and keep the containment advisory |
| Risk | Inlining a 38 KB persona into every single-executor iteration prompt | Med | Inline only for CLI kinds; native already runs as the named agent |
| Risk | The compiled command contracts go stale after the YAML edits | Low | Regenerate them with `compile-command-contracts.cjs --write` and diff against a dry print |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the change alters which argv a dispatch receives, not how long it runs.

### Security
- **NFR-S01**: The opencode branch keeps the recursion guard and env allowlist that `runAuditedExecutorCommand` applies.

### Reliability
- **NFR-R01**: A kind the single-executor path cannot run fails closed with a non-zero exit, never a silent fall-through to native.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an executor config with no `model` lets the builder apply its own default model for the kind.
- Maximum input: a 38 KB persona plus a full iteration prompt still travels as one positional argument, far below the OS argument limit.
- Failure path: `cli-deepseek-harness` in single-executor mode exits 2 with a message naming `--fanout`; a missing `opencode` binary exits non-zero from the builder's preflight.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four YAMLs, one runtime script, one template, one new test, regenerated contracts |
| Risk | 16/25 | Every single-executor deep-loop dispatch passes through these branches |
| Research | 6/20 | Findings and evidence come verified from the synthesis |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The dsh single-executor choice (refuse rather than build) is recorded in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
