---
title: Workflow Reference - Verification
description: Shared sk-code doctrine for the final non-mutating evidence phase that gates every done, works, complete, fixed, passing or ready claim.
trigger_phrases:
  - "sk-code verification workflow"
  - "verify workflow doctrine"
  - "falsifier discipline"
  - "completion claim gate"
importance_tier: important
contextType: general
version: 2.2.3.0
---

# Workflow Reference - Verification

Shared `sk-code` doctrine for the final non-mutating evidence phase that gates every done, works, complete, fixed, passing or ready claim.

---

## 1. OVERVIEW

### Purpose

Verification owns evidence, not fixes. It runs fresh surface-appropriate commands, records the outcomes, compares them against the implementation baseline, names the blind spots and claims only what the evidence proves. When verification fails, it hands back to debugging, implementation or quality without editing.

### Iron Law

**Iron Law**: no completion claim without fresh surface-appropriate verification evidence.

A clean static read is not runtime evidence. A green unit test is not live proof. A successful build is not exercised behavior. One exercised path is not full regression coverage. Name the rung you reached and its blind spot.

### When to Use

- Verifying work after implementation, quality checks or debugging.
- Running final commands before a done, works, complete, fixed, passing or ready claim.
- Collecting evidence for active-surface behavior or system-code changes.
- Reporting the delta from the baseline captured before implementation.
- Running a mutation check or claim falsifier after a green result.
- Walking the verification ladder and naming each rung's blind spot.

### When Not to Use

- The task needs code written, files scaffolded or behavior changed. Use [implementation](./workflow-implement.md).
- The task is author-side quality cleanup. Use the `sk-code-quality` mode.
- Verification finds a defect that needs root-cause repair. Use [debugging](./workflow-debug.md).
- The user wants findings-first review output or PR-style critique. Use the `sk-code-review` mode.
- The active surface and verification command set are unknown. Ask for them before claiming anything.

---

## 2. WORKFLOW

### Verification Loop

1. Resolve the active surface through [stack-detection.md](../../shared/references/stack-detection.md). If it is unsupported or ambiguous, ask for the verification command set before claiming anything. The quality config, `repository/quality.json` in the `sk-code-quality` packet, names quality checks only, so it never supplies the verification command set.
2. Read the implementation, quality or debug handoff for the intended behavior, changed scope, baseline and accepted risks. From the quality envelope, read the `checker_outputs` field with the `gate` and `unverified` values it carries, and any field that still reads `PENDING_AGENT_JUDGMENT`. Hand back to quality only on `BLOCKED`, `ERROR` or a field still reading `PENDING_AGENT_JUDGMENT`, which is the 3 to 1.5 transition in [phase-detection.md](../../shared/references/phase-detection.md). On `UNVERIFIED`, prove each id it lists with this phase's own command or report that id open. On `NOTHING_CHECKED`, prove the claim with this phase's own commands and never read the gate as clean, because no check read any file as code, which is where a Markdown-only change lands. The run verdict has three readers: this step, the @code RETURN `Quality Gate` field and `sk-code-review`, which reads it as input evidence only.
3. Name the claim to prove and the command, action or observation that proves it.
4. Select the surface-appropriate command set and targeted tests from the active-surface guidance.
5. Run fresh commands and capture the command names, exit codes, test counts, important output and failures.
6. Add end-to-end, runtime or performance evidence when the claim depends on behavior outside static checks.
7. Compare the current evidence to the baseline and report the delta.
8. Run a mutation check or claim falsifier when the claim depends on a new or changed test.
9. Walk the Pre-Claim Gate below, then state only the claims the evidence proves. If the evidence fails, hand back without editing.

### Pre-Claim Gate Substance

Walk every gate in order before any status claim:

| Gate | Required Discipline |
| --- | --- |
| Identify | Name the command, action or observation that proves the claim. |
| Run | Execute the surface-appropriate verification commands in the current session. |
| Test | Exercise targeted unit, integration, end-to-end, runtime or manual checks where available, including at least one edge case and one error path. |
| Verify | Confirm the output, exit code, test count and observed behavior match expectations, and that the run reached the changed code on a fresh build with real assertions. |
| Record | Save the exact evidence the final claim rests on. |
| Claim | State only the narrow claim the evidence supports. |

The Verify row guards against the four ways a green run lies, which `.skilled/repo-rules/evidence-and-proof.md` section 3 lists: it did not run, it ran on the wrong thing, it ran on stale artifacts or it asserted nothing.

### OpenCode Verification Reality

For system code under `.skilled/` (the `sk-code-skilled` surface), also apply the [verification reality](../../sk-code-skilled/references/shared/workflow-guardrails.md#3-verification-reality), including the `validate.sh` pointer, and the [runtime build traps](../../sk-code-skilled/references/shared/workflow-guardrails.md#4-runtime-build-traps).

### Baseline And Delta

Verification compares against the baseline whenever it states a no-regressions or improvement claim.

| Field | Required Content |
| --- | --- |
| Baseline | Starting command status, failing tests, warning count, runtime issue, performance number or `UNKNOWN` when no baseline was captured. |
| Current | Fresh output from the whole gate, not only the subset you iterated on: exit codes, test counts, runtime observations or measured numbers. |
| Delta | What changed, improved, regressed or remains unproven, including the parts that did not move. |
| Claim Scope | The exact claim the evidence supports and the blind spot that remains. |

No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence still stands.

The baseline floor belongs to `.skilled/repo-rules/evidence-and-proof.md` section 5 (BASELINES). This table is the sk-code record shape for it. Implementation records its Baseline row before the first edit.

### Verification Ladder

Climb from the cheapest rung to the most authoritative and name what each rung cannot see:

| Rung | Proves | Blind Spot |
| --- | --- | --- |
| Unit | Isolated logic or assertion path | Integration, wiring, real I/O, runtime state |
| In-memory | Multiple modules without external runtime | Real file system, serialization, deployed config, external state |
| On-server | Runtime service or local server path | Deployment differences, caches, real user environment |
| Live | Exact exercised path in real target | Unexercised paths, other users, other environments, future data |

### Mutation Check And Claim Falsifier

After green evidence for a new or modified test, confirm the test can fail for the right reason when that is feasible. A true red result is an assertion failing against the intended behavior. A compile error, or a command that never reached the assertion, is not a satisfying red. If a test stays green after the guarded behavior is broken, report it as a verification defect and hand back.

This applies the idea behind `.skilled/repo-rules/evidence-and-proof.md` section 4 (THE NEGATIVE CONTROL): a check that passes whether or not the behavior works proves nothing. The before-fix half of that control, reproducing the failure with the same check, is step 2 of the [Debug Loop](./workflow-debug.md#debug-loop).

---

## 3. DISCIPLINE

### Always

- Always run fresh verification in the current session before a completion-related claim.
- Always resolve surface identity before selecting commands.
- Always record command names, exit codes, key output, test counts and runtime observations.
- Always report the baseline, current result, delta and claim scope for a no-regressions or improvement claim.
- Always name the verification ladder rung reached and the blind spot that remains.
- Always include behavior evidence when runtime behavior changed and tooling is available.
- Always hand back when verification finds a defect.
- Always confirm the diff scope matches the stated change, with no accidental extras or debug residue.
- Always compare warnings against the last working state, so a new warning is reported and not absorbed.

### Never

- Never edit or create files during verification.
- Never dispatch subagents from verification.
- Never claim done, works, complete, fixed, passing or ready from unrun commands.
- Never claim no regressions without a baseline and a delta.
- Never treat one green rung as proof of a higher rung.
- Never hide a failed or skipped verifier behind a positive summary.
- Never invent runtime, test or performance evidence.
- Never verify against stale build output. Clean and rebuild first when an artifact is suspect.
- Never present a check run in one environment as proof for every environment.

### Escalate If

- The surface or the required verification command set is unknown.
- A required verifier path is missing or unsafe to run.
- Commands contradict each other on a blocking outcome.
- Runtime evidence is required but unavailable and the claim would mislead without it.
- The baseline is missing and the requested claim needs a regression comparison.
- A mutation check shows the test is vacuous.

---

## 4. HANDOFF BOUNDARIES

- [Debugging](./workflow-debug.md) receives reproducible verification failures, failed commands, broken runtime checks or vacuous tests.
- [Implementation](./workflow-implement.md) receives the handback when required behavior is missing or build work is incomplete.
- Quality (`sk-code-quality`) receives the handback when author-side checks, comment hygiene or checklist issues block verification.
- Review (`sk-code-review`) owns critique when the user wants findings instead of final evidence.

Verification is ready to report only when it ran last, used only non-mutating actions, recorded fresh active-surface evidence, compared against the baseline when the claim needed it, named its blind spots and handed back any defect without editing.

---

## 5. RELATED RESOURCES

- [workflow-implement.md](./workflow-implement.md) - the build phase whose baseline and handoff this phase reads.
- [workflow-debug.md](./workflow-debug.md) - the repair phase that receives every failed verification.
- [stack-detection.md](../../shared/references/stack-detection.md) - surface detection, which decides the command set.
- [workflow-guardrails.md](../../sk-code-skilled/references/shared/workflow-guardrails.md) - the verification command chain for system code under `.skilled/`.
