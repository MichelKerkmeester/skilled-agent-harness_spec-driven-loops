# Workflow Reference - Verification

Shared verification workflow doctrine for `sk-code`. This reference covers the non-mutating evidence phase that runs last, compares against baseline, applies falsifier discipline, and gates any done, works, complete, fixed, passing, or ready claim. It is consumed by surface packets and carries no skill frontmatter or surface-specific standards.

---

## 1. OVERVIEW

### Purpose

Verification owns evidence, not fixes. It runs fresh surface-appropriate commands, records outcomes, compares against the implementation baseline, names blind spots, and claims only what the evidence proves. If verification fails, it hands back to debugging, implementation, or quality without editing.

### Iron Law

**Iron Law** — make no completion claim without fresh surface-appropriate verification evidence. A clean static read is not runtime evidence, a green unit test is not live proof, a minified bundle is not browser interaction, and a browser click is not full regression coverage; name the rung and its blind spot.

### When to Use

- Verifying work after implementation, quality checks, or debugging.
- Running final commands before a done, works, complete, fixed, passing, or ready claim.
- Collecting evidence for active-surface behavior or system-code changes.
- Reporting the delta from the baseline captured before implementation.
- Running mutation checks or claim-falsifier checks after a green result.
- Walking the verification ladder and naming each rung's blind spot.

### When Not to Use

- The task requires writing code, scaffolding files, or changing behavior; switch to implementation.
- The task is author-side quality cleanup; use the quality phase.
- Verification finds a defect that needs root-cause repair; switch to debugging.
- The user wants findings-first review output or PR-style critique.
- The active surface and verification command set are unknown; ask for them before claiming anything.

---

## 2. WORKFLOW

### Verification Loop

1. Resolve the active surface through shared router references. If unsupported or ambiguous, ask for the verification command set before claiming anything.
2. Read the implementation, quality, or debug handoff for intended behavior, changed scope, baseline, and accepted risks.
3. Use the universal verification checklist before any pre-claim decision.
4. Select the surface-appropriate command set and targeted tests from active-surface guidance.
5. Run fresh commands and capture command names, exit codes, test counts, important output, and failures.
6. Include browser, runtime, or performance evidence when the claim depends on behavior outside static checks.
7. Compare current evidence to baseline and report the delta.
8. Apply a mutation check or claim-falsifier ritual when the claim depends on a new or changed test.
9. State only the claims the evidence proves. If evidence fails, hand back without editing.

### Pre-Claim Gate Substance

Use the universal verification checklist as the detailed gate, not as content to duplicate wholesale:

| Gate | Required Discipline |
| --- | --- |
| Identify | Name the command, action, or observation that proves the claim. |
| Run | Execute the surface-appropriate verification commands in the current session. |
| Test | Exercise targeted unit, integration, browser, runtime, or manual checks where available. |
| Verify | Confirm output, exit code, test count, and observed behavior match expectations. |
| Record | Save the exact evidence needed to support the final claim. |
| Claim | Make only the narrow claim that evidence supports. |

### Baseline And Delta

Verification must compare against the baseline whenever a no-regressions or improvement claim is made.

| Field | Required Content |
| --- | --- |
| Baseline | Starting command status, failing tests, warning count, runtime issue, performance number, or `UNKNOWN` when no baseline was captured. |
| Current | Fresh command output, exit codes, test counts, runtime observations, or measured numbers. |
| Delta | What changed, improved, regressed, or remains unproven. |
| Claim Scope | The exact claim supported by evidence and the blind spot that remains. |

No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence is still allowed.

### Verification Ladder

Climb from cheapest to most authoritative and name what each rung cannot see:

| Rung | Proves | Blind Spot |
| --- | --- | --- |
| Unit | Isolated logic or assertion path | Integration, wiring, real I/O, browser/runtime state |
| In-memory | Multiple modules without external runtime | Real file system, serialization, deployed config, external state |
| On-server | Runtime service or local server path | Deployment differences, caches, real user environment |
| Live | Exact exercised path in real target | Unexercised paths, other users, other viewports, future data |

### Mutation Check And Claim Falsifier

After green evidence for a new or modified test, confirm the test can fail for the right reason when feasible. A true red result is an assertion failing against intended behavior. A compile error or command that never reached the assertion is not a satisfying red. If a test stays green after the guarded behavior is broken, report it as a verification defect and hand back.

### Performance And Loading Claims

Use the performance-loading checklist substance when deferring non-critical work or claiming startup wins: capture before/after data, verify gated paths, check first-use latency, exclude critical first-paint or compliance paths from deferral, and stop if measurement shows the win shifted cost into a worse first interaction.

---

## 3. DISCIPLINE

### Always

- Always run fresh verification in the current session before a completion-related claim.
- Always resolve surface identity before selecting commands.
- Always record command names, exit codes, key output, test counts, and runtime observations.
- Always report baseline, current result, delta, and claim scope for no-regressions or improvement claims.
- Always name the verification ladder rung and blind spot that remains.
- Always include behavior evidence when runtime behavior changed and tooling is available.
- Always hand back when verification finds a defect.

### Never

- Never edit or create files during verification.
- Never dispatch subagents from verification.
- Never claim done, works, complete, fixed, passing, or ready from unrun commands.
- Never make broad no-regressions claims without baseline and delta.
- Never treat one green rung as proof of higher rungs.
- Never hide a failed or skipped verifier behind a positive summary.
- Never invent browser, runtime, test, or performance evidence.

### Escalate If

- The surface or required verification command set is unknown.
- A required verifier path is missing or unsafe to run.
- Commands contradict each other on a blocking outcome.
- Runtime evidence is required but unavailable and the claim would be misleading without it.
- The baseline is missing and the requested claim requires regression comparison.
- A mutation check shows the test is vacuous.

---

## 4. HANDOFF BOUNDARIES

- Debugging receives reproducible verification failures, failed commands, broken runtime checks, or vacuous tests.
- Implementation receives handback when required behavior is missing or build work is incomplete.
- Quality receives handback when author-side checks, comment hygiene, or checklist issues block verification.
- Review owns critique when the user wants findings rather than final evidence.

Verification is ready to report only when it ran last, used non-mutating actions, recorded fresh active-surface evidence, compared against baseline when needed, named blind spots, and handed back any defect without editing.
