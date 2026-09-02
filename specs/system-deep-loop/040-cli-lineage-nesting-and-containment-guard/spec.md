---
title: "Feature Specification: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them [template:level-2/spec.md]"
description: "A cli-codex fan-out lineage read its orchestration prompt as an instruction to dispatch codex again, so every iteration spawned a nested codex exec that died inside the sandbox and returned no findings. Write containment compounded the damage by reverting a concurrent operator edit from HEAD with no recoverable record. This packet closes both defects: an in-process execution directive backed by a pre-spawn refusal stops the nesting, and containment writes a recovery patch before it reverts anything."
trigger_phrases:
  - "nested codex exec"
  - "fanout lineage in-process"
  - "write containment revert"
  - "dispatch failure recursion guard"
  - "containment recovery patch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Prevent a cli-codex fan-out lineage from nesting codex exec per iteration, and make write containment preserve concurrent operator edits instead of erasing them

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `branches/017-memory-decommission` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A cli-codex fan-out lineage spawned a nested `codex exec` on every iteration and returned zero findings, and write containment reverted a concurrent operator edit from HEAD with no recoverable record. Both defects surfaced in the same deep-research run.

**Nested dispatch.** `buildLoopPrompt` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (lines 1108-1205) tells a CLI lineage it is orchestrating the deep-research workflow YAML, and the cli-codex executor step in `.opencode/commands/deep/assets/deep-research-auto.yaml` (lines 1536-1640, mirrored in `deep-review-auto.yaml` at 1405-1495) says a requested codex executor must dispatch codex. A lineage already running under `codex exec --model gpt-5.6-luna --sandbox workspace-write` read those two rules together and spawned a nested `codex exec` on every iteration. Each child died with `failed to initialize in-process app-server client: Operation not permitted`, producing five iterations, zero findings and five `dispatch_failure` records. The recursion guard in `runtime/lib/deep-loop/executor-audit.ts` never fired, because neither the `CODEX_SESSION_ID` mapping at line 64 nor `SPECKIT_CLI_DISPATCH_STACK` at lines 14 and 814 is consulted before that spawn. A sibling lineage carrying the identical prompt ran its iterations in-process and succeeded, which proves the prompt is ambiguous rather than wrong.

**Containment erases operator edits.** `enforceWriteContainment` in `runtime/lib/deep-loop/write-containment.ts` (line 511) reverts in-HEAD out-of-scope paths from HEAD and fails the lineage. An operator edited a tracked spec file in the same checkout while a run was live. Containment reverted it and left no recoverable record. Untracked paths survive as advisories, so the loss is silent and lands only on tracked work.

### Purpose

A CLI fan-out lineage runs its iterations in the process it was given, and any file containment reverts can be restored from a patch the run wrote before touching it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An explicit in-process execution directive in `buildLoopPrompt` for every CLI lineage kind, with a vitest guard.
- A pre-dispatch in-process rule in both auto YAMLs' cli-codex executor step, plus a pre-spawn refusal inside that step's embedded node script.
- A recursion guard in `executor-audit.ts` that refuses a nested cli-codex dispatch before spawn.
- A recovery patch written by `enforceWriteContainment` before any revert, surfaced through the `containment_violation` event and the returned result.
- Doc updates in cli-codex `SKILL.md`, the deep-research `loop-protocol.md` and the `system-deep-loop` hub `SKILL.md`.

### Out of Scope
- Changing containment's fail-closed revert semantics. The revert is the policy, and only its recoverability is defective.
- Sandbox settings for executor kinds other than cli-codex. No other kind produced the nested-spawn symptom.
- The deep-loop council sqlite database. It carries no containment or dispatch state.
- Anything under `specs/system-speckit/049-memory-decommission`. That packet's research run surfaced these defects and is not their owner.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `buildLoopPrompt` emits an in-process execution directive for every CLI lineage kind |
| `.opencode/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts` | Create | Asserts the directive is present for each lineage kind the builder supports |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modify | cli-codex step gains a pre-dispatch in-process rule and a pre-spawn refusal in its embedded node script |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | Modify | Same pair of changes, kept identical to the research YAML |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Recursion guard refuses a nested cli-codex dispatch before spawn |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modify | Adds refusal, top-level allow and stale-session rows to the existing guard suite |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Writes the reverted diff, adds `revertedPatchPath` to the event and `recoveryHint` to the result |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Adds a `git apply` round trip that restores the reverted content |
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Modify | New rule: a codex lineage never dispatches codex |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | Executor and containment rules |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modify | Pointer to both rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every prompt `buildLoopPrompt` produces for a CLI lineage states that iterations run in the current process and that the lineage must not spawn a nested CLI executor. The directive applies to every lineage kind the builder supports, not only cli-codex. |
| REQ-002 | The cli-codex executor step in `deep-research-auto.yaml` and `deep-review-auto.yaml` carries a pre-dispatch rule that an already-codex lineage executes in-process, and its embedded node script refuses to spawn `codex exec` when the current process is already a codex lineage. |
| REQ-003 | `executor-audit.ts` refuses a nested cli-codex dispatch before spawn, deciding from the `CODEX_SESSION_ID` mapping and `SPECKIT_CLI_DISPATCH_STACK` rather than from the prompt. |
| REQ-004 | `enforceWriteContainment` writes the diff of every in-HEAD out-of-scope path to `<artifactDir>/containment-reverted/<iteration>-<timestamp>.patch` before it reverts anything. |
| REQ-005 | The `containment_violation` event carries `revertedPatchPath`, and the returned result carries a `recoveryHint` naming that patch and the command that replays it. |
| REQ-009 | The fan-out driver treats another run's lineage directory under the same top-level packet as that run's own write surface while its loop lock is live, so two lineages in sibling phase folders no longer fail each other, while a directory with no live lock stays a fatal breach. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each work stream ships targeted vitest coverage, and the containment test proves recovery through a real `git apply` round trip rather than by asserting the patch string. |
| REQ-007 | The cli-codex `SKILL.md`, the deep-research `loop-protocol.md` and the `system-deep-loop` hub `SKILL.md` carry the executor rule and the containment rule, so a future lineage author reads them before writing a prompt. |
| REQ-008 | Containment keeps its existing behavior everywhere else: it still fails the lineage, still reverts in-HEAD paths and still preserves untracked paths as advisories. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cli-codex lineage completes its configured iterations with zero `dispatch_failure` records and zero nested `codex exec` processes.
- **SC-002**: A containment violation on a tracked file leaves a patch under `<artifactDir>/containment-reverted/` that `git apply` restores byte for byte.
- **SC-003**: Targeted vitest suites for all four streams pass, and `npm run typecheck` in `.opencode/skills/system-deep-loop/runtime` reports no errors.
- **SC-004**: Both auto YAMLs still parse, and the cli-codex step still fails closed when the codex binary is absent.
- **SC-005**: `validate.sh` on this packet exits 0 with `RESULT: PASSED` and Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Four streams editing one runtime in parallel | A late conflict blocks the final gate | Streams own disjoint files, and the orchestrator runs one full `npm test` after all four land |
| Risk | The pre-spawn refusal blocks a legitimate top-level cli-codex dispatch | High: deep loops lose their codex executor | Guard reads the dispatch stack, and a test covers the top-level allow case alongside the refusal |
| Risk | A stale `CODEX_SESSION_ID` inherited from an operator shell looks like a nested lineage | Medium: false refusal outside any loop | Decide from `SPECKIT_CLI_DISPATCH_STACK` first and treat a bare session id as insufficient |
| Risk | Patch writing fails and takes the containment path down with it | Medium: containment stops failing closed | Wrap the write, keep the revert and the failure unconditional and degrade to an advisory when the patch cannot be written |
| Risk | The prompt directive is added for cli-codex only | Medium: the same ambiguity returns on another executor kind | REQ-001 binds every lineage kind, and the vitest guard iterates the kinds the builder supports |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Patch writing runs only on the violation path. A clean iteration performs no extra filesystem work.
- **NFR-P02**: The in-process directive adds under 500 characters to a prompt that already runs to several thousand, so no prompt budget changes.

### Security
- **NFR-S01**: Recovery patches are written inside `artifactDir` and nowhere else, so they inherit the lineage write boundary that containment itself enforces.
- **NFR-S02**: The pre-spawn refusal reads process environment only. It introduces no new credential, network call or shell interpolation.

### Reliability
- **NFR-R01**: Zero nested `codex exec` spawns across a full cli-codex lineage, measured from the run's dispatch records.
- **NFR-R02**: Every tracked file containment reverts is recoverable from its patch. A revert with no patch on disk is a defect, not a degraded mode.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a containment run finding no out-of-scope in-HEAD path writes no patch and adds no `revertedPatchPath` to the event.
- Maximum length: a violation spanning many files produces one patch covering all of them, never one file per path.
- Invalid format: a binary or deleted path that `git diff` cannot render as text still gets reverted, and the patch records whatever git could produce.

### Error Scenarios
- External service failure: the codex binary is absent. The step already exits 1 and must keep doing so, because the refusal is a separate branch from the availability check.
- Network timeout: a lineage killed mid-iteration keeps its patch, because the patch is written before the revert rather than after it.
- Concurrent access: two lineages violating containment in the same checkout write distinct filenames, since the name carries both iteration and timestamp.

### State Transitions
- Partial completion: the revert fails halfway. The patch is already on disk and still covers every path the run intended to revert.
- Session expiry: a stale `CODEX_SESSION_ID` left in the operator shell must not suppress a legitimate top-level dispatch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 11 files across the deep-loop runtime, two command YAMLs and three docs |
| Risk | 14/25 | Touches a shared runtime and a fail-closed policy, and a wrong guard disables the codex executor |
| Research | 6/20 | Both defects are already diagnosed against named files and line numbers |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the recovery patch be pruned on a later clean run, or kept for the life of the artifact directory?
- Does the pre-spawn refusal belong to cli-codex alone, or should `executor-audit.ts` refuse any executor kind that would re-enter its own CLI?
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
