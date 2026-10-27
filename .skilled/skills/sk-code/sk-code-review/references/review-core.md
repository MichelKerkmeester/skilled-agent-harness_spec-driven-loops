---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
trigger_phrases:
  - "findings first severity ordering"
  - "review finding schema"
  - "severity contract for merge decisions"
  - "evidence file line citation"
  - "baseline surface precedence"
  - "baseline check families"
importance_tier: important
contextType: implementation
version: 1.5.4.0
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

**Ownership.** This file owns the severity ids and their meanings (section 2), the evidence rules (section 3) and the finding schema (section 7). The deep-review contract, [`review-mode-contract.yaml`](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml), is an external consumer: it owns the deep-review loop (dimensions, verdicts, severity weights, convergence and quality gates) and reuses the severity ids defined here. When the two disagree on a severity id or its meaning, this file wins and the YAML is corrected by its owner, `deep-review`. The YAML may be stricter for its own loop, as when it requires `file:line` evidence on `P2`, but never looser.

---

## 1. OVERVIEW

Shared findings-first review doctrine for both single-pass and deep-review workflows.

---

## 2. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

### Reach Calibration

A `P0` or `P1` finding names its reach: an input or call path that the code's stated contract allows, or a real caller that sends the failing input. The stated contract is what the code promises through its signature, types, doc comment, name and the checks it already makes.

- A failure that needs input outside the stated contract, such as `NaN` where the contract says a number, a wrong type, or an inverted range the code already rejects, is `P2` hardening.
- The exception is input the code claims to validate. When a guard, a thrown error or a doc line promises to reject an input class and the promise fails for an input in that class, the gap is a correctness finding and keeps `P1` or higher. A guard claims only the class it checks: an ordering check such as `min > max` does not claim that its operands are numbers.
- At a trust boundary (user input, network, files, environment, another service), every value the outside can send is in reach. The stated contract of internal code never narrows a security finding on data that crosses that boundary.
- A finding that cannot name its reach is `P2`, however severe the failure would be.

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly. The confidence is confidence that the reach exists. The rule raises a finding whose reach is named but not proven, such as a caller that probably sends the input. It never raises a finding with no reach, so it cannot lift an out-of-contract failure above `P2`.

### Numeric Severity Calibration

Numeric scores are advisory context, not the gate. A reviewer may add an optional `riskScore` to a finding and adjust it by `+/-2` for local context such as exploitability, blast radius, user impact, confidence, or proven containment. The merge/block decision remains the severity contract above: `P0` blocks, `P1` requires remediation, and `P2` is advisory. Do not adopt `score>=4` or any numeric threshold as a blocker.

---

## 3. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 4. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 5. BASELINE + SURFACE PRECEDENCE

Apply this skill as the baseline first, then pair it with `sk-code` surface evidence when available:

- Detected code surfaces -> every declared surface that matches, specific surfaces first and the `SKILLED` fallback last. Each one pairs with its `sk-code` evidence packet, such as `sk-code-skilled` for `SKILLED`. No match -> `UNKNOWN`. Detection follows the shared contract, [`stack-detection.md`](../../shared/references/stack-detection.md) section 2.
- Unclear surfaces -> baseline-only plus explicit uncertainty

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Surface style, process, build, and test conventions override generic baseline guidance.
- Unclear conflicts must be escalated rather than guessed.

---

## 6. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by surface guidance.

---

## 7. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | The finding's number in the Findings list, counted once across severity groups, such as `2` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `case` | The input or situation that produces the wrong result. A finding with no case is not reported |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code; for a performance finding, name the workload it assumes, such as row count, request rate or payload size |
| `userImpact` | What users or callers bear if this fix is deferred |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |
| `affectedSurfaceHints` | Optional string array of producer/consumer surfaces the fix should address; recommended for actionable findings, required for cross-consumer findings. Use free-form short strings, max about 5 entries. Optional for instance-only findings. |
| `riskScore` | Optional advisory number for relative risk calibration; never gating and never a substitute for `severity` |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### 2 [P1] Missing authorization check
- Case: a request with no session token reaches the write handler and changes a user record
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- User impact: Until this is fixed, any caller can write records without a role check.
- Finding class: cross-consumer
- Scope proof: `rg -n "permission guard|write path" path/to` shows the write handler is the only unchecked consumer.
- Affected surface hints: ["request handler", "write path", "permission guard"]
- riskScore: 6 (advisory only)
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 8. RELATED RESOURCES

- [review-ux-single-pass.md](./review-ux-single-pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick-reference.md](./quick-reference.md) - Lightweight index across baseline review references.
- [security-checklist.md](../assets/security-checklist.md) - Security and reliability checks.
- [code-quality-checklist.md](../assets/code-quality-checklist.md) - Correctness, KISS, DRY, and maintainability checks.

---
