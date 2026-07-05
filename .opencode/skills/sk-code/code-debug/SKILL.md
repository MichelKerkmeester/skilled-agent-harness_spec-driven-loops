---
name: code-debug
description: Root-cause debugging mode for sk-code; reproduces failures, localizes symptom to source cause, applies one-cause fixes, and escalates after failed attempts.
allowed-tools: [Read, Edit, Bash, Grep, Glob, Task]
version: 1.0.0.1
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: code-debug, debugging, root cause, reproduce failure, error recovery, one cause at a time, escalation discipline, webflow debugging, opencode debugging, failing tests, build failure -->

# Code Debug (debug)

`debug` is the root-cause MODE child of the `sk-code` family. It runs when a symptom, failing command, runtime error, test failure, or quality/verification failure needs diagnosis and repair. It consumes shared surface detection, reproduces the symptom, traces to a source cause, applies one fix at a time, and hands the result to `code-verify` for evidence.

---

## 1. WHEN TO USE

### Activation Triggers

Use this mode when the request involves:
- Diagnosing a failing test, build failure, runtime exception, browser console error, broken animation, layout regression, or command failure.
- Recovering from a failed implementation, failed quality gate, failed verification command, or inconsistent runtime behavior.
- Tracing a symptom backward to the source cause before changing code.
- Applying a minimal bug fix to an existing scoped file after the root cause is identified.
- Running a parallel investigation with `Task` when the search space is broad and bounded.
- Enforcing the three-strike escalation rule after repeated failed fixes for the same symptom.

Keyword triggers: `debug`, `fix bug`, `root cause`, `broken`, `failing`, `error`, `stack trace`, `console error`, `build failure`, `test failure`, `regression`, `reproduce`, `diagnose`, `error recovery`, `three fixes failed`.

### When NOT to Use

Skip this mode when:
- The work is planned implementation or refactoring without a failing symptom. Use `code-implement`.
- The task is the post-implementation quality gate. Use `code-quality`.
- The task is final non-mutating evidence after a fix. Use `code-verify`.
- The user wants findings-first review output or PR review. Use `code-review`.
- The task is documentation-only prose with no failing behavior. Use `sk-doc`.

### Family Boundary

This is an independently invokable member of the `sk-code` family. It owns investigation and fix application for a named symptom. It can edit existing scoped files and may dispatch a bounded `Task` for parallel investigation. It does not create new files, does not scaffold new behavior, and does not make completion claims.

Pairs well with:
- `code-quality` when the quality gate reveals a concrete failing symptom.
- `code-verify` after a fix, because verification proves the repair.
- `code-implement` when the root cause shows the requested behavior was never implemented.
- `code-review` when the user wants a non-mutating review of likely bugs rather than a fix.

---

## 2. SMART ROUTING

### Primary Detection Signal

Surface identity is resolved once by the parent shared router. This mode consumes that result and then routes by failure kind:

```text
DEBUG TASK
    |
    +- Surface identity -> ../shared/references/stack_detection.md
    +- Phase lifecycle  -> ../shared/references/phase_detection.md
    +- Resource routing -> ../shared/references/smart_routing.md
    |
    +- Universal symptom/root-cause loop -> assets/universal-debugging_checklist.md
    +- Universal recovery discipline     -> ../shared/references/universal/error_recovery.md
    +- WEBFLOW runtime/browser failure   -> references/webflow-debugging/*
    +- OPENCODE command/test failure     -> shared OpenCode routing + language checks
```

### Phase Detection

```text
Failure observed in implementation, quality, or verification
    -> Phase 2 Debugging runs here
        -> reproduce the symptom
        -> capture exact evidence
        -> localize symptom to root cause
        -> apply one-cause fix
        -> rerun the reproduction step
    -> Phase 1.5 Quality if a fix changes code
    -> Phase 3 Verification for final evidence
```

### Resource Domains

- `assets/universal-debugging_checklist.md` defines the surface-agnostic reproduce, analyze, hypothesize, and fix workflow.
- `assets/webflow-debugging_checklist.md` adapts the debugging checklist to Webflow/frontend runtime behavior.
- `references/webflow-debugging/debugging_workflows.md` covers browser DevTools, console, network, layout, animation, and profiling workflows.
- `references/webflow-debugging/error_recovery.md` covers Webflow/frontend recovery patterns.
- `../shared/references/universal/error_recovery.md` defines shared error recovery for both supported surfaces.

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any debug invocation | `../shared/references/stack_detection.md`, `../shared/references/smart_routing.md`, `../shared/references/phase_detection.md` |
| ALWAYS | Any non-trivial symptom | `assets/universal-debugging_checklist.md`, `../shared/references/universal/error_recovery.md` |
| CONDITIONAL | WEBFLOW/browser/runtime issue | `assets/webflow-debugging_checklist.md`, `references/webflow-debugging/debugging_workflows.md`, `references/webflow-debugging/error_recovery.md` |
| CONDITIONAL | OPENCODE test/build/script/config issue | Shared router-selected OpenCode language and pattern references; use `../shared/references/smart_routing.md` to identify them |
| CONDITIONAL | Multiple plausible cause layers or wide search space | `Task` for bounded parallel investigation with exact symptom, evidence, search scope, and expected return format |
| ON_DEMAND | Repeated failures, contradictory evidence, or unclear recovery path | `../shared/references/universal/error_recovery.md` escalation sections plus the escalation rules in this contract |

### Failure-Kind Map

| Failure Kind | First Evidence | Primary Resource | Owner After Debug |
| --- | --- | --- | --- |
| Failing unit or integration test | Exact command, exit code, failing assertion, relevant stack trace | `assets/universal-debugging_checklist.md` | `code-verify` after fix |
| Build/typecheck/script failure | Exact command and full output | `../shared/references/universal/error_recovery.md` plus surface language refs | `code-quality` then `code-verify` |
| Browser console or runtime failure | Console output, URL/path, interaction that triggers it | `references/webflow-debugging/debugging_workflows.md` | `code-verify` with browser evidence |
| Layout or animation regression | Viewport, target element, expected vs actual behavior | `assets/webflow-debugging_checklist.md` | `code-verify` with desktop/mobile evidence |
| Quality-gate failure with unclear cause | Checklist item, checker output, target file | `assets/universal-debugging_checklist.md` | `code-quality` after fix |
| Spec or requirement conflict | Conflicting facts and current implementation evidence | Escalation discipline in this file | User amendment decision |

---

## 3. HOW IT WORKS

### Debug Workflow

1. Resolve the target surface and phase through shared references. If the surface is UNKNOWN, ask for runtime and verification commands before changing code.
2. Reproduce the symptom. If it cannot be reproduced, collect the exact command, logs, inputs, state, or browser steps needed to narrow it.
3. Capture evidence verbatim: command, exit code, stack trace, console output, failing assertion, URL, viewport, file path, or observed behavior.
4. Localize the fault by tracing backward from symptom to immediate cause to source cause. Do not stop at a downstream exception if an earlier state made it inevitable.
5. State the current hypothesis and the evidence that would confirm or refute it.
6. Change one cause at a time with `Edit`, keeping the fix as small as the evidence supports.
7. Rerun the original reproduction step. If the original symptom persists, treat the attempt as failed and update the root-cause model before another fix.
8. If the fix changes code, return through `code-quality` before final verification.
9. Hand the fixed state to `code-verify` with the reproduction command, observed before/after result, and any residual risk.

### One-Cause Fix Rule

Debugging is a controlled experiment. A single edit may touch several lines, but it must address one named cause. Do not bundle unrelated cleanup, speculative hardening, or convenience refactors into a debug fix. If two independent causes are confirmed, fix and verify them sequentially.

### Task Dispatch Boundary

Use `Task` only for bounded parallel investigation, not for unsupervised rewriting. The subtask prompt must include the exact symptom, evidence already captured, files or directories to inspect, forbidden edits, and the final return shape. Treat the result as a hypothesis until confirmed against the local reproduction.

### Webflow Debugging

For WEBFLOW, debugging normally starts from browser evidence: console, network, element state, viewport, animation timing, media loading, and performance profile. Use `references/webflow-debugging/debugging_workflows.md` for the workflow and `references/webflow-debugging/error_recovery.md` for recovery patterns.

### OpenCode Debugging

For OPENCODE, debugging normally starts from commands and files: failing tests, script output, schema/config errors, alignment drift, shell behavior, Python exceptions, TypeScript errors, or MCP/tool contracts. Use shared smart routing to load the matching language and pattern references, then apply the universal debugging checklist.

### Escalation Discipline

Before applying another fix for the same symptom, state a one-sentence root cause tied to observed evidence. If that sentence cannot be stated, stop guessing and escalate. After three failed fixes for the same symptom, stop automatic retries and report the attempted fixes, current evidence, and one recommended next action. If implementation evidence conflicts with an approved spec, stop for an amendment decision. If independent validators contradict each other on a blocking outcome, emit one consolidated escalation with the conflicting facts and decision needed.

---

## 4. RULES

### ALWAYS

1. Reproduce or tightly characterize the symptom before editing.
2. Capture exact evidence: command, exit code, stack trace, console line, input, viewport, or observed behavior.
3. Trace symptom to root cause before applying a fix.
4. State a one-sentence evidence-tied root cause before a second fix attempt for the same symptom.
5. Change one cause at a time.
6. Rerun the original reproduction step after every fix.
7. Send code changes back through `code-quality` before final verification.
8. Hand final evidence collection to `code-verify`; this mode does not claim done.
9. Treat `Task` investigation output as a hypothesis until local evidence confirms it.

### NEVER

1. Never create new files; this mode has no `Write` authority.
2. Never scaffold new planned behavior; use `code-implement` when the requested behavior does not exist yet.
3. Never apply multiple speculative fixes at once.
4. Never treat a symptom disappearance as proof without rerunning the original reproduction step.
5. Never silently work around a spec conflict; escalate for an amendment decision.
6. Never continue automatic retries after three failed fixes for the same symptom.
7. Never make completion, done, works, or passing claims; route to `code-verify`.
8. Never add a packet-local `graph-metadata.json`.

### ESCALATE IF

1. The symptom cannot be reproduced and available evidence is insufficient to localize it.
2. Surface detection is ambiguous or the active runtime is unsupported.
3. Three fixes fail for the same symptom.
4. Implementation evidence contradicts an approved spec or user requirement.
5. Independent validators or reviewers contradict each other on a blocking result.
6. Security-sensitive validation, filesystem behavior, or production data handling is unclear.

---

## 5. SUCCESS CRITERIA

- The original symptom is reproduced or characterized with concrete evidence.
- The root cause is stated in one sentence and tied to observed evidence.
- Only one cause is fixed at a time in already-scoped files.
- The original reproduction step changes from failing to passing, or escalation explains why it could not.
- Any code change returns through `code-quality` before final verification.
- `code-verify` receives the commands, reproduction steps, before/after observations, and residual risks needed for evidence.
- No new files were authored by this mode.

---

## 6. INTEGRATION POINTS

- `sk-code` routes debug prompts here through `mode-registry.json` and keeps the hub routing-only.
- `code-implement` receives handback when the fix requires new behavior, new files, or broader implementation.
- `code-quality` receives handback after a debug fix changes code.
- `code-verify` receives the final fixed state and original reproduction step for non-mutating verification.
- `code-review` owns findings-first review when the user wants diagnosis without author-side repair.
- `mcp-chrome-devtools` may provide browser evidence for WEBFLOW runtime debugging, but this mode keeps the debugging contract.

---

## 7. REFERENCES

### Parent And Shared Router

- [`../SKILL.md`](../SKILL.md) - Routing-only parent hub.
- [`../mode-registry.json`](../mode-registry.json) - Source of truth for mode tool surfaces and packet identity.
- [`../shared/references/stack_detection.md`](../shared/references/stack_detection.md) - Shared surface detection consumed by every mode.
- [`../shared/references/smart_routing.md`](../shared/references/smart_routing.md) - Shared intent and resource routing.
- [`../shared/references/phase_detection.md`](../shared/references/phase_detection.md) - Lifecycle transitions into and out of debugging.
- [`../shared/references/universal/error_recovery.md`](../shared/references/universal/error_recovery.md) - Universal error recovery and escalation guidance.

### Debugging Assets And References

- [`assets/universal-debugging_checklist.md`](assets/universal-debugging_checklist.md) - Surface-agnostic debugging checklist.
- [`assets/webflow-debugging_checklist.md`](../code-webflow/assets/webflow-debugging_checklist.md) - Webflow/frontend debugging checklist.
- [`references/webflow-debugging/debugging_workflows.md`](../code-webflow/references/debugging/debugging_workflows.md) - Browser and frontend debugging workflows.
- [`references/webflow-debugging/error_recovery.md`](../code-webflow/references/debugging/error_recovery.md) - Webflow/frontend error recovery patterns.

### Sibling Mode Contracts

- [`../code-implement/SKILL.md`](../code-implement/SKILL.md) - Planned implementation and new behavior.
- [`../code-quality/SKILL.md`](../code-quality/SKILL.md) - Quality gate after debug fixes.
- [`../code-verify/SKILL.md`](../code-verify/SKILL.md) - Final non-mutating verification evidence.
- [`../code-review/SKILL.md`](../code-review/SKILL.md) - Findings-first review output.
