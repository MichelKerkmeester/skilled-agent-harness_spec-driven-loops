---
title: Deep Review Iteration 001
description: Broad inline review of the compatibility opt-in and image declaration packet.
---

# Deep Review Iteration 001

## Scope and method

This was the required single broad pass across correctness, security, traceability, and
maintainability. I read the target packet, changed extension source and tests, models.json,
the complete review brief and diff, and the recorded scratch evidence. The source trace followed
the generic compatibility producer through adapter selection into the model_select notification
consumer. No target source was modified.

## Review verdict

The implementation is conditionally acceptable. The explicit DeepSeek gate and removal of
manufactured wire-format advice are supported, but the startup consumer does not consume the
generic affinity list that the plan says it preserves. Two lower-severity evidence/test gaps
also remain.

## Findings

### F001 — major — DeepSeek startup adapter suppresses generic affinity advice

- Claim: The generic affinity check was moved into describeMissingCacheCompatForModel() without
  losing advice for an opted-in DeepSeek channel.
- Evidence: index.ts:2997-3010 composes the generic proxy list and DeepSeek additions, but
  index.ts:3085-3105 makes the first DeepSeek adapter warningText call only
  describeMissingDeepSeekCompat(). selectAdapterForModel() uses first-match semantics at
  index.ts:4053-4055, and notifyCacheCompatIfNeeded() invokes only that selected adapter at
  index.ts:4080-4110. The plan promises preserved affinity advice at plan.md:64-74 and the
  implementation summary repeats it at implementation-summary.md:67 and 93.
- Basis: verified source control flow; the resulting missing notification is a deterministic
  inference from those branches.
- Why it matters: A DeepSeek-named OpenAI-completions proxy with explicit
  thinkingFormat=deepseek and missing sendSessionAffinityHeaders gets an empty DeepSeek-specific
  list if the replay flag is present, so model_select emits no affinity warning. An unopted
  DeepSeek-named proxy also short-circuits before the generic warning even though the full
  diagnosis still reports the missing affinity flag. The command surfaces can show it through
  describeMissingCacheCompatForModel(), but startup no longer does.
- Recommendation: Make the selected DeepSeek warning path consume the composed missing list, or
  explicitly emit a generic warning alongside the DeepSeek warning. Add model_select regression
  cases for both an opted-in DeepSeek proxy missing affinity and an unopted DeepSeek proxy missing
  affinity, then rerun the extension check.
- Disposition: active P1.

### F002 — minor — No-manufactured-thinkingFormat test never supplies the removed branch key

- Claim: The current test proves the removed suggestion and rendered advice can never manufacture
  thinkingFormat.
- Evidence: review-findings.test.ts:1151-1167 calls both helpers with only
  sendSessionAffinityHeaders and requiresReasoningContentOnAssistantMessages. The removed
  implementation branches shown in change-under-review.diff:124-143 were conditional on a
  missing list containing thinkingFormat, so these assertions pass without exercising the
  deleted branch. Other gate tests are meaningful, but this specific no-manufacturing assertion
  is vacuous.
- Basis: verified by comparing the current test inputs with the removed diff hunk.
- Why it matters: A future regression that reintroduces a conditional thinkingFormat branch would
  pass this test. Drive the helper with thinkingFormat in the input list and assert the output
  excludes it, and assert the rendered text excludes the advice line.
- Disposition: active P2.

### F003 — minor — Affinity probe does not preserve request-header evidence for its acceptance claim

- Claim: The affinity probe independently proves that all three Pi headers were sent and accepted.
- Evidence: live-affinity-probe.md:10-26 explains the expected adapter behavior, while
  live-affinity-probe.md:28-44 records HTTP 200 and a normal response. The companion
  live-affinity-probe.json is a response body and does not contain a request trace or echoed
  request headers.
- Basis: verified artifact contents; whether the original unrecorded command sent the headers is
  unknown.
- Why it matters: HTTP 200 proves the recorded request succeeded, but the repository cannot
  independently distinguish a request with all three headers from one without them. The
  declaration is therefore supported by a self-reported probe, not by replayable request evidence.
  Preserve a redacted verbose request trace, a server-side echo, or a controlled header-acceptance
  artifact; keep the existing limitation that stickiness is not proven.
- Disposition: active P2.

## Claim adjudication

### F001 typed claim-adjudication packet

~~~yaml
findingId: F001
severity: P1
claim: generic affinity advice is preserved for every opted-in DeepSeek startup channel
hunter:
  result: confirmed control-flow gap
  evidence: index.ts:2997-3010, index.ts:3085-3105, index.ts:4053-4110
skeptic:
  challenge: command surfaces still expose the composed diagnosis, and the current llmgateway
    configuration has affinity enabled, so the observed target startup is quiet as intended
referee:
  result: active P1
  rationale: the public plan and claim cover the startup path, not only command diagnostics;
    first-match DeepSeek selection prevents the generic list from reaching model_select
passed: true
~~~

## Traceability checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | fail | plan.md:64-74 contradicts the selected startup adapter at index.ts:3097-3105 |
| checklist_evidence | partial | tasks.md:37-63 and scratch/check-run.txt support broad completion, but F001 and F003 remain |
| feature_catalog_code | notApplicable | no feature catalog is part of this packet |
| playbook_capability | partial | scratch/verify-no-warning.mjs exercises model_select but omits missing-affinity DeepSeek |

## Ruled-out and supported claims

- The explicit opt-in gate is supported by index.ts:2987-2995 and tests at
  review-findings.test.ts:1122-1148.
- The current changed suggestion/advice source no longer contains the removed
  thinkingFormat branch; the fix path consumes buildFixSuggestion() at index.ts:5899-5923.
- The recorded check suite supports its claim: scratch/check-run.txt records typecheck, 114
  passing tests, diff check, and package dry-run with exit-success output.
- The image probe is strong for one model: the arbitrary code KX-4471 and all three expected
  lines match live-image-probe.json, but the evidence is not generalized to other models.
- No literal credential or out-of-scope mutation was found in the reviewed artifact set.

## What could not be checked

- This lineage did not run validate.sh, generate-context.js, network probes, or git writes under
  the user-specified execution contract.
- Gateway cache stickiness is not established by the affinity probe.
- The recorded affinity artifact does not independently prove the request headers were present.
- No live replay was performed for openai-responses or official OpenAI base URL variants.

Review verdict: CONDITIONAL
