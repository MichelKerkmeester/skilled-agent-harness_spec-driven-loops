---
title: Workflow Reference - Debugging
description: Shared sk-code doctrine for root-cause diagnosis and scoped repair once a symptom, failing command or failed check appears.
trigger_phrases:
  - "sk-code debugging workflow"
  - "debug workflow doctrine"
  - "root-cause diagnosis"
  - "scoped repair workflow"
importance_tier: important
contextType: general
version: 1.1.1.0
---

# Workflow Reference - Debugging

Shared `sk-code` doctrine for root-cause diagnosis and scoped repair once a symptom, failing command or failed check appears.

---

## 1. OVERVIEW

### Purpose

Debugging is the controlled-experiment phase. It reproduces or tightly characterizes the symptom, captures exact evidence, traces the symptom back to its source, fixes one cause at a time and sends the result back through quality and verification.

### Core Principle

Fix the producer, not the place the symptom surfaced. A patch at the failure site hides the cause and leaves every other reader of the bad value broken.

### When to Use

- Diagnosing a failing test, build failure, runtime exception, console error, broken interaction, output regression, command failure or inconsistent runtime behavior.
- Recovering from a failed implementation, quality or verification pass, or from a concrete regression.
- Tracing a symptom backward before changing code.
- Applying a minimal fix to already-scoped files once the root cause is identified.
- Dispatching a bounded parallel investigation when the search space is broad but the symptom is concrete.

### When Not to Use

- The work is planned implementation or refactoring with no failing symptom. Use [implementation](./workflow-implement.md).
- The work is an author-side quality gate with no concrete failing behavior. Use the `sk-code-quality` mode.
- The work is final non-mutating evidence after a fix. Use [verification](./workflow-verify.md).
- The user wants findings-first review output instead of a repair. Use the `sk-code-review` mode.
- The task is documentation-only prose with no failing behavior.

---

## 2. WORKFLOW

### Debug Loop

1. Resolve the active surface and lifecycle phase through [stack-detection.md](../../shared/references/stack-detection.md) and [phase-detection.md](../../shared/references/phase-detection.md). If the surface is unknown, ask for the runtime and verification commands before changing code.
2. Reproduce the exact symptom with the check that will later prove the fix. If it will not reproduce, collect the exact command, logs, inputs, state or interaction steps needed to narrow it.
3. Capture evidence verbatim: command, exit code, stack trace, console output, failing assertion, path, environment, input or observed behavior.
4. Trace backward from the symptom to the immediate cause, then to the source cause that produced the bad value or state.
5. State the current hypothesis and the evidence that would confirm or refute it.
6. Change one cause at a time and keep the fix as small as the evidence supports.
7. Rerun the original reproduction step after every fix.
8. When the fix changes code, return through quality before final verification.
9. Hand the fixed state to verification with the reproduction command, the before and after results and the residual risk.

The reproduce, trace-to-source and one-cause-at-a-time floors in this loop belong to `.skilled/repo-rules/root-cause-and-debugging.md` section 1 (THE LOOP). The rule that the reproduction uses the same check that will prove the fix belongs to `.skilled/repo-rules/evidence-and-proof.md` section 4 (THE NEGATIVE CONTROL). This loop is how sk-code applies both, so a change to a floor goes there first.

### Four-Phase Checklist Substance

Walk the four phases in order once a session outlives two trivial fixes:

| Phase | Required Discipline |
| --- | --- |
| Root Cause Investigation | Reproduce reliably, capture exact output, identify the failing layer, note the last working state and inspect what changed. |
| Pattern Analysis | Search the exact error string, separate symptom from cause, trace backward and compare against similar past issues. |
| Hypothesis Testing | State one hypothesis, predict the evidence that confirms or refutes it, test one variable and record the observed result. |
| Fix | Fix at the source, add or keep regression coverage where it fits and rerun the original reproduction step. |

When an attempt repeats without producing new evidence, stop patching at the failure site. Restate the problem one level up, at the interface, data flow or module boundary, as `.skilled/repo-rules/root-cause-and-debugging.md` section 3 requires.

### Command Failure Recovery

When a build, test, install or runtime command fails unexpectedly, or a flow that used to work breaks, walk this order before changing code:

1. **Document.** Capture the full error output, exit code, working directory, relevant environment variables and the last working state (commit, test run or release).
2. **Isolate.** Name the broken layer from the table below before touching it.
3. **Verify prerequisites.** Confirm the working directory, the branch, valid credentials, free disk space, an intact lockfile and a fresh cache. When the cache or lockfile is suspect, reinstall with the package manager's clean-install command and run the tool's clean step.
4. **Retry verbose.** Rerun the failing command with the most verbose flag the tool supports and read the output in order. The first line that differs from a passing run usually names the cause.
5. **Escalate.** After three failed attempts, stop retrying and follow Escalate If below.

| Suspect Layer | First Check |
| --- | --- |
| Source code | What changed since the last working state (`git diff <last-good>..HEAD`)? |
| Build or test tool | The same command with its verbose or debug flag. |
| Runtime | The last runtime or dependency version that worked. |
| Environment | Required variables set, credentials valid and not expired. |
| External service | Its status page, health check or rate limits. |

### One-Cause Fix Rule

A single edit may touch several lines, but it must address one named cause. Keep unrelated cleanup, speculative hardening and convenience refactors out of a debug fix, because a bundled change leaves the rerun unable to say which edit fixed the symptom. When two independent causes are confirmed, fix and verify them one after the other.

### Bounded Investigation

Parallel investigation is for bounded diagnosis, never for unsupervised rewriting. The subtask names the exact symptom, the evidence already captured, the files or directories to inspect, the forbidden edits and the expected return shape. Treat its result as a hypothesis until local reproduction confirms it.

---

## 3. DISCIPLINE

### Always

- Always reproduce or tightly characterize the symptom before editing.
- Always capture exact evidence instead of paraphrasing a failure.
- Always trace the symptom to its source cause before applying a fix.
- Always state a one-sentence, evidence-tied root cause before a second fix attempt on the same symptom.
- Always change one cause at a time.
- Always rerun the original reproduction step after every fix.
- Always send changed code through quality before final verification.
- Always treat parallel investigation output as a hypothesis until local evidence confirms it.

### Never

- Never create new files as part of debugging.
- Never scaffold planned behavior. Switch to implementation when the requested behavior does not exist.
- Never apply several speculative fixes at once.
- Never treat a vanished symptom as proof without rerunning the original reproduction step.
- Never work around a spec or requirement conflict silently.
- Never keep retrying after three failed fixes for the same symptom.
- Never claim done, works, fixed, passing or complete from debugging alone. The [Iron Law](./workflow-verify.md#iron-law) gates every completion claim.
- Never leave debug instrumentation, such as temporary print or log statements, in the committed fix.

### Escalate If

- The symptom will not reproduce and the available evidence cannot localize it.
- Surface detection is ambiguous or the active runtime is unsupported.
- Three fixes fail for the same symptom.
- Implementation evidence contradicts an approved spec or user requirement.
- Independent validators or reviewers contradict each other on a blocking result.
- Security-sensitive validation, filesystem behavior or production data handling is unclear.
- A failure involves credentials, tokens or secrets, or would modify production or deployed state. Escalate at once, without retrying.
- A failure cascades across unrelated components or fits no reasonable model of the system.

Escalate in the five-part format of `.skilled/repo-rules/root-cause-and-debugging.md` section 7: the symptom verbatim, each attempt with the evidence it produced, what that rules out, two or three options with their trade-offs and one recommendation with its reason.

---

## 4. HANDOFF BOUNDARIES

- [Implementation](./workflow-implement.md) receives the task when the root cause shows the requested behavior was never built or new files are required.
- Quality (`sk-code-quality`) receives the changed code after a debug fix.
- [Verification](./workflow-verify.md) receives the original reproduction step, the before and after observations, the commands and the residual risks.
- Review (`sk-code-review`) owns non-mutating critique when the user wants a diagnosis without a repair.

The handoff is ready when the original symptom is reproduced or characterized, the root cause is tied to evidence, each fix addressed one cause and the original reproduction step now passes, or the escalation explains why it cannot.

---

## 5. RELATED RESOURCES

- [workflow-implement.md](./workflow-implement.md) - the build phase that takes over when the behavior was never implemented.
- [workflow-verify.md](./workflow-verify.md) - the evidence phase that proves the fix and gates the claim.
- [stack-detection.md](../../shared/references/stack-detection.md) - surface detection, read before changing code.
- [phase-detection.md](../../shared/references/phase-detection.md) - how a request maps to this phase and what each phase hands on.
