---
title: "cli-devin Output Verification Pipeline"
description: "Opt-in Smallcode-derived verification pass for cli-devin iteration output, with code and research-output scoring modes."
---

# cli-devin Output Verification Pipeline

## Overview

Phase 004 adds an opt-in verification pattern for cli-devin recipes and deep-loop post-dispatch validation.

Default behavior remains unchanged. Existing recipes set `verification_enabled` to `false`, and `post-dispatch-validate.ts` treats missing config the same way.

The pipeline is derived from SmallCode's verifier and hard-fail policy:

| Source | Evidence |
| --- | --- |
| Research RQ2 | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/research.md:219-410` |
| Deepening iter | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode/research/iterations/iteration-007.md:21-275` |
| Context card | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/preflight/context-card.md:103-264` |
| Verifier source | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/external/smallcode-master/src/governor/verifier.ms:1-260` |
| Hard-fail source | `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/external/smallcode-master/src/governor/hard_fail.ms:1-105` |

SmallCode verifies generated code before delivery. It checks structure, compilation, execution, smoke tests, and lint, then computes a confidence score.

cli-devin Phase 004 adapts that idea in two layers:

- Recipe layer: opt-in fields tell the dispatcher whether verification should apply.
- Validator layer: post-dispatch validation scores fenced code output and appends a degraded JSONL event when confidence is below threshold.

## Smallcode-Derived 4-Stage Pipeline

SmallCode's source pipeline is five stages because it includes structural validation before compile. Phase 004 documents the operator-facing pipeline as four delivery gates:

1. Compile.
2. Execute.
3. Smoke-test.
4. Lint.

Structural checks remain implicit in the compile/lint scoring and in research-output quality checks.

The source `verify()` method is at `verifier.ms:31-102`. RQ2 records the same pipeline at `research.md:223-240`.

### Stage 1: Compile

Compile validates syntax without assuming the code is semantically correct.

Examples:

| Language | Command |
| --- | --- |
| Python | `python -m py_compile <file>` |
| JavaScript | `node --check <file>` |
| TypeScript | `npx tsc --noEmit` |
| Rust | `rustc --emit=metadata <file>` or `cargo check` |
| Go | `go vet <file>` |

SmallCode maps languages to compile commands at `verifier.ms:147-171`; RQ2 records the command pattern at `research.md:309-328`.

### Stage 2: Execute

Execute runs the generated code only after compilation succeeds.

Phase 004 validator does not execute arbitrary code directly. That keeps post-dispatch validation safe by default and avoids running untrusted model output outside a controlled sandbox.

Recipes that enable real execution later must provide sandboxed execution, timeouts, and artifact path constraints.

### Stage 3: Smoke-Test

Smoke tests prove minimal behavior. SmallCode auto-generates smoke tests for Python and JavaScript at `verifier.ms:189-217` and `verifier.ms:270-302`.

Phase 004 uses a lightweight score proxy in the validator and documents the fuller pattern for future dispatcher integration.

### Stage 4: Lint

Lint catches quality issues that compilation misses.

SmallCode treats lint as non-blocking at `verifier.ms:93-97`. Phase 004 follows that calibration: lint contributes 0.10 to confidence, but failed lint alone does not make a hard fail.

## Adapted For Research Output

Deep research and deep review iterations often produce markdown, not runnable code. Verification should not punish narrative output when no code is produced.

The rule:

- `verification_enabled: false`: no verification.
- `verification_enabled: true` and no supported fenced code blocks: verification is skipped as N/A.
- `verification_enabled: true` and code blocks exist: code scoring runs.

Research-output rubric mode is documented for self-checks and future dispatchers:

| Code-stage term | Research-output term | Weight |
| --- | --- | ---: |
| compile | cite-accuracy | 0.40 |
| execute | structure-pass | 0.30 |
| smoke-test | recommendation-actionability | 0.20 |
| lint | anti-hallucination | 0.10 |

The research adaptation comes from `iteration-007.md:49-103`, with the drop-in system-instruction shape at `iteration-007.md:21-45`.

## Confidence Scoring Formula

SmallCode computes confidence at `verifier.ms:252-260`.

Phase 004 code-output formula:

```text
score =
  (compiled ? 0.35 : 0)
+ (executed ? 0.25 : 0)
+ (tests_passed ? 0.25 : 0)
+ (lint_clean ? 0.10 : 0)
- (auto_fixed ? 0.05 : 0)
```

Default Phase 004 thresholds:

| Score | Outcome |
| ---: | --- |
| `>= 0.50` | Pass verification |
| `< 0.50` | Mark iteration degraded |
| `< 0.30` | Hard-fail candidate for future retry/escalation logic |

The validator appends a `verification_degraded` JSONL event when the score is below threshold.

Example event:

```json
{"type":"event","event":"verification_degraded","status":"degraded","confidence":0,"threshold":0.5,"language":"typescript","reason":"verification_degraded","detail":"verification confidence 0.00 below threshold 0.50","timestamp":"2026-05-18T00:00:00.000Z"}
```

## Hard-Fail Gatekeeper Template

SmallCode refuses to claim success when code cannot compile or execute after retries. Its hard-fail template is at `hard_fail.ms:95-105`, and the policy is at `hard_fail.ms:28-70`.

Use this template for future cli-devin retry loops:

```markdown
# ITERATION DELIVERY DEGRADED

Iteration: {iteration}
Confidence: {confidence} (threshold: {threshold})
Language: {language}
Reason: {reason}

## Verification Failures

{failures}

## Required Remediation

- Fix syntax or structural errors first.
- Re-run the language verifier.
- Add or repair smoke tests when behavior is intended.
- Keep lint warnings separate from correctness failures.
- Retry with narrower scope or escalated context if the same stage fails twice.
```

The template intentionally says "degraded" for Phase 004. Full hard-fail retry orchestration is out of scope.

## post-dispatch-validate.ts Handshake

The integration point is:

```text
.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts
```

The validator accepts optional recipe config:

```typescript
type PostDispatchRecipeConfig = {
  verification_enabled?: boolean;
  verification_languages?: VerificationLanguage[];
  verification_threshold?: number;
};
```

Handshake behavior:

1. Run existing post-dispatch structural validation.
2. If structural validation fails, return the existing failure.
3. If `verification_enabled` is absent or false, return unchanged.
4. If enabled, read the iteration file.
5. Extract fenced code blocks for supported languages.
6. If no supported code blocks exist, skip verification.
7. Score the lowest-confidence block.
8. If below threshold, append `verification_degraded` to the state log and return a verification failure.
9. If above threshold, return `{ ok: true }`.

Supported language labels:

- `python`, `py`
- `typescript`, `ts`, `tsx`
- `javascript`, `js`, `mjs`
- `rust`, `rs`
- `go`, `golang`

The implementation is intentionally local and static. It does not run arbitrary model output.

## When To Enable

Enable verification when:

- the iter is expected to produce code snippets that may be reused.
- the synthesis output will become implementation guidance.
- the dispatcher is testing small-model code generation quality.
- hallucinated syntax would be costly downstream.

Keep verification disabled when:

- the iter is pure research narrative.
- the expected output is a file list or summary.
- the recipe is read-only and not producing reusable code.
- the model output should be judged by human review rather than syntax checks.

ADR-001 requires opt-in semantics. Existing recipes must keep `verification_enabled: false`.

## Recipe Fields

All three Phase 004 recipes include:

```json
{
  "verification_enabled": false,
  "verification_languages": []
}
```

`verification_languages` is an allowlist. Empty means the validator may score any supported fenced language when verification is enabled.

Supported values:

- `python`
- `typescript`
- `javascript`
- `rust`
- `go`

Do not add conditionals to JSON. The conditional meaning is documented in each recipe's `system_instructions`.

## Tool Scoring State File Format

Phase 005 adds an optional Bayesian tool-scoring contract to the same three recipes.

Default behavior remains unchanged:

- `bayesian_scoring_enabled: false`
- `fallback_chain: []`
- no score file is read or written unless an operator opts in

When `bayesian_scoring_enabled` is true, the worker records per-tool success/failure counts in `bayesian_score_file`, relative to the spec folder.

Default state paths:

| Recipe | Default `bayesian_score_file` |
| --- | --- |
| Deep research iter | `research/agent-state/tool-scores-iter-NNN.json` |
| Deep review iter | `review/agent-state/tool-scores-iter-NNN.json` |
| Synthesis | `synthesis/agent-state/tool-scores-synthesis.json` |

The state is per-iter scratch data. It should live under the packet's `agent-state/` directory and be cleaned by the reducer or main agent when the packet completes.

Expected JSON shape:

```json
{
  "version": "1.0",
  "iteration": "NNN",
  "scope": "research",
  "tools": {
    "Read": {
      "success": 3,
      "failure": 1,
      "total": 4,
      "score": 0.6666666667
    }
  }
}
```

Score calculation uses Laplace smoothing:

```text
score = (success + 1) / (total + 2)
```

Demotion rule:

```text
score < 0.5 AND total >= 3
```

At exactly `0.5`, do not demote. Below `0.5` with only one or two calls, do not demote. The minimum-call guard prevents a single transient failure from hiding a useful tool.

Demotion only affects the next iter's suggestions. It is not a permanent deny rule, and it does not modify the recipe's allowed-tools contract.

## Operational Verification

Run the focused unit test:

```bash
npx vitest run tests/deep-loop/post-dispatch-validate.vitest.ts
```

Run typecheck:

```bash
npm run typecheck
```

Run the integration smoke from Phase 004:

```bash
node /tmp/verification-integ-004.js
```

Expected degraded case:

- `verification_enabled: true`.
- TypeScript fenced block is malformed.
- validator returns `verification_degraded`.
- state log contains `event:"verification_degraded"`.

Expected backward-compat case:

- `verification_enabled` absent or false.
- malformed fenced code does not alter existing validation behavior.
- no degraded event is appended.

## Limits

Phase 004 does not execute model output.

Phase 004 does not add retry orchestration.

Phase 004 does not make verification default-on.

Phase 004 does not change cli-opencode docs.

Phase 004 treats lint as a confidence contributor, not a blocker.

Future work can replace static scoring with sandboxed compile/run/test/lint commands once the dispatcher can constrain execution paths and timeouts.

## Reference Checklist

Use this checklist when enabling verification for a recipe or future dispatcher.

### Enablement

- [ ] Confirm the recipe produces code-like output.
- [ ] Confirm the operator explicitly wants verification.
- [ ] Set `verification_enabled` to `true`.
- [ ] Keep default recipes at `false`.
- [ ] Populate `verification_languages` only when the recipe should restrict languages.
- [ ] Leave `verification_languages` empty when any supported fenced code is acceptable.
- [ ] Do not add JSON conditionals.
- [ ] Document the conditional behavior in `system_instructions`.

### Code Detection

- [ ] Require fenced code blocks.
- [ ] Require a supported language fence.
- [ ] Ignore unsupported language fences.
- [ ] Skip verification when no supported code exists.
- [ ] Treat skipped verification as N/A, not pass or fail.
- [ ] Score every supported block when multiple blocks exist.
- [ ] Use the lowest-confidence block as the iteration score.
- [ ] Include the language in degraded events.

### Scoring

- [ ] Compile contributes 0.35.
- [ ] Execute contributes 0.25.
- [ ] Smoke tests contribute 0.25.
- [ ] Lint contributes 0.10.
- [ ] Auto-fix subtracts 0.05.
- [ ] Clamp score to `[0, 1]`.
- [ ] Mark degraded below threshold.
- [ ] Keep Phase 004 default threshold at 0.50.

### JSONL Event

- [ ] Append a new event record.
- [ ] Do not mutate prior JSONL lines.
- [ ] Use `type:"event"`.
- [ ] Use `event:"verification_degraded"`.
- [ ] Include `status:"degraded"`.
- [ ] Include `confidence`.
- [ ] Include `threshold`.
- [ ] Include `language`.
- [ ] Include a human-readable `detail`.
- [ ] Include `timestamp`.

### Safety

- [ ] Do not execute arbitrary code by default.
- [ ] Use static scoring for Phase 004.
- [ ] Require sandboxing before real execution.
- [ ] Require timeouts before real execution.
- [ ] Require path scoping before real execution.
- [ ] Keep lint non-blocking unless a future ADR changes it.

## Worked Examples

### Verification Disabled

Recipe:

```json
{
  "verification_enabled": false,
  "verification_languages": []
}
```

Outcome:

```text
existing structural validation only
no verification_degraded event
no behavior change
```

### Verification Enabled With No Code

Recipe:

```json
{
  "verification_enabled": true,
  "verification_languages": ["typescript"]
}
```

Iteration output:

```markdown
## Findings

The implementation should add a validator.
```

Outcome:

```text
verification skipped as no_code_output
no degraded event
```

### Verification Enabled With Bad TypeScript

Recipe:

```json
{
  "verification_enabled": true,
  "verification_languages": ["typescript"]
}
```

Iteration output:

````markdown
```typescript
export function broken() {
  return 1;
```
````

Outcome:

```text
confidence = 0.00
threshold = 0.50
event = verification_degraded
```

### Verification Enabled With Good TypeScript

Iteration output:

````markdown
```typescript
export function add(left: number, right: number): number {
  return left + right;
}
```
````

Outcome:

```text
confidence >= 0.50
validator returns ok
no degraded event
```

## Failure Modes

### False Positive Code Detection

A markdown document can include illustrative snippets that are not intended to run.

Mitigation:

- leave verification disabled for pure research.
- restrict `verification_languages`.
- tell the worker to fence only reusable code in target languages.

### False Negative Static Scoring

Static scoring can miss semantic errors.

Mitigation:

- keep the reference commands documented.
- use human review for high-risk output.
- add sandboxed execution in a later packet.

### Over-Aggressive Threshold

A high threshold can degrade useful partial output.

Mitigation:

- Phase 004 defaults to 0.50.
- reserve 0.80+ for "strong pass" reporting.
- treat 0.30 as hard-fail candidate, not automatic retry in this phase.

### Backward-Compat Regression

Default-on verification would break research and review loops.

Mitigation:

- recipe defaults stay false.
- missing config is equivalent to false.
- unit tests cover verification-off pass-through.

## Future Extension Points

### Sandboxed Compile

Future packets can replace static compile detection with real commands from `confidence-scoring-rubric.md`.

Required controls:

- temp directory execution.
- no network.
- command timeout.
- output truncation.
- explicit file allowlist.

### Retry Orchestration

Future packets can consume `verification_degraded` events and decide whether to retry, escalate, or decompose.

Required controls:

- max retry count.
- failure reason grouping.
- no infinite retry loops.
- continuity logging.

### Research-Quality Validator

Future packets can implement the research-output formula from this doc and `confidence-scoring-rubric.md`.

Required controls:

- file existence checks for citations.
- line-range validation.
- actionability checks.
- hallucination flag handling.

### Dashboarding

Future packets can aggregate degraded events by language, recipe, and executor.

Useful metrics:

- degradation rate.
- average confidence.
- most common failure stage.
- verification skip rate.
- false-positive review rate.
