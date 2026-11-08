---
title: Deep Review Report - compat opt-in and image declaration
description: Terminal synthesis for the inline detached fan-out review lineage.
trigger_phrases:
  - deep review report
  - compat opt-in review findings
importance_tier: important
contextType: review
---

# Deep Review Report

## 1. Executive Summary

Overall verdict: CONDITIONAL

- Active P0 findings: 0
- Active P1 findings: 1
- Active P2 findings: 2
- hasAdvisories: false
- Dimension coverage: 4 of 4
- Iterations: 1 of 1
- Stop reason: maxIterationsReached
- Release readiness: in-progress

The explicit DeepSeek wire-format gate and removal of the manufactured thinkingFormat advice are
supported by the source and tests. The strongest objection is a missing consumer-path connection:
the generic affinity list is composed correctly, but the first-match DeepSeek startup adapter still
reads only the DeepSeek-specific list. The recorded extension check is green, yet its notification
harness does not exercise the missing-affinity DeepSeek case. The affinity live artifact also
records no durable request-header trace.

This was a read-only review. No remediation was applied.

## 2. Planning Trigger

A follow-on implementation plan is required because an active P1 finding contradicts the plan's
startup-path architecture claim. The P2 items can be carried as hardening tasks in the same plan.

Planning Packet

~~~json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P1",
      "title": "DeepSeek startup adapter suppresses generic affinity advice",
      "findingClass": "missing-consumer-path",
      "affectedSurfaceHints": [
        "model_select startup notification",
        "DeepSeek adapter warningText",
        "/cache-optimizer compat",
        "/cache-optimizer doctor"
      ]
    },
    {
      "id": "F002",
      "severity": "P2",
      "title": "No-manufactured-thinkingFormat test never supplies the removed branch key",
      "findingClass": "vacuous-test",
      "affectedSurfaceHints": [
        "DeepSeek suggestion helper",
        "rendered warning helper",
        "regression suite"
      ]
    },
    {
      "id": "F003",
      "severity": "P2",
      "title": "Affinity probe does not preserve request-header evidence for its acceptance claim",
      "findingClass": "evidence-gap",
      "affectedSurfaceHints": [
        "live affinity declaration",
        "models.json provider compat",
        "packet verification evidence"
      ]
    }
  ],
  "remediationWorkstreams": [
    "Fix and regression-test the selected DeepSeek startup warning consumer.",
    "Make the removed thinkingFormat branch assertion non-vacuous.",
    "Preserve replayable request-header evidence for the affinity declaration."
  ],
  "specSeed": [
    "Clarify that generic affinity advice must reach model_select for DeepSeek-named channels.",
    "Record the evidence boundary for an affinity acceptance probe."
  ],
  "planSeed": [
    "Add opted-in and unopted DeepSeek model_select cases with missing affinity.",
    "Feed the selected adapter the composed missing list or emit the generic warning separately.",
    "Pass thinkingFormat through the negative suggestion/advice test input.",
    "Attach a redacted request trace or header echo to the affinity evidence."
  ],
  "findingClasses": [
    "missing-consumer-path",
    "vacuous-test",
    "evidence-gap"
  ],
  "affectedSurfacesSeed": [
    "model_select startup notification",
    "DeepSeek warningText",
    "compat and doctor commands",
    "review regression suite",
    "llmgateway affinity declaration"
  ],
  "fixCompletenessRequired": true
}
~~~

## 3. Active Finding Registry

### F001 — P1 / major — DeepSeek startup adapter suppresses generic affinity advice

- File: .pi/extensions/pi-cache-optimizer/index.ts:3097-3105
- Evidence: index.ts:2997-3010 composes generic affinity, but the DeepSeek adapter at
  index.ts:3085-3105 calls describeMissingDeepSeekCompat alone. First-match selection is at
  index.ts:4053-4055 and notification uses only the selected adapter at index.ts:4080-4110.
- Impact: DeepSeek-named proxy channels can silently lose generic affinity advice on model_select.
  The command surfaces still expose the composed diagnosis, but that does not preserve the
  startup-path contract.
- Recommendation: Route DeepSeek startup warningText through the composed list or emit the
  generic warning separately; add opted-in and unopted missing-affinity model_select tests.
- Disposition: active.
- Finding class: missing-consumer-path.
- Scope proof: The source, tests, configuration, plan, and scratch evidence are in scope; the
  unrelated handover-cli-skills.md file is excluded.
- Affected surfaces: model_select startup notification, DeepSeek adapter warningText, compat,
  and doctor.

### F002 — P2 / minor — No-manufactured-thinkingFormat test never supplies the removed branch key

- File: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:1151-1167
- Evidence: the test inputs omit thinkingFormat, while the removed implementation branch in
  change-under-review.diff:124-143 was conditional on missing thinkingFormat.
- Impact: A future conditional thinkingFormat suggestion branch could return without breaking
  this test.
- Recommendation: Include thinkingFormat in the input list and assert that both the suggestion
  and rendered advice exclude it.
- Disposition: active.
- Finding class: vacuous-test.

### F003 — P2 / minor — Affinity probe does not preserve request-header evidence for its acceptance claim

- File: specs/hooks/021-compat-opt-in-and-image-declaration/scratch/live-affinity-probe.md:28-44
- Evidence: the markdown describes the three expected headers and records HTTP 200; the
  companion response JSON contains no request trace or echoed request headers.
- Impact: The repository cannot independently distinguish a successful request with all three
  headers from a successful request without them.
- Recommendation: Preserve a redacted verbose request trace, server-side echo, or equivalent
  controlled artifact. Keep the existing limitation that stickiness is not proven.
- Disposition: active.
- Finding class: evidence-gap.

## 4. Remediation Workstreams

1. P1 startup consumer correction:
   - Update the selected DeepSeek warning path to include the generic affinity missing list.
   - Add notification-level tests for opted-in and unopted DeepSeek-named proxies.
   - Re-run the existing extension check suite.
2. P2 regression hardening:
   - Exercise the removed thinkingFormat branch input explicitly in the helper test.
3. P2 evidence hardening:
   - Record request-header presence without exposing credentials, or narrow the acceptance claim
     to the evidence that is actually preserved.

## 5. Spec Seed

- Add a requirement that every startup warning consumer preserves generic proxy compatibility
  advice when a model-specific adapter wins selection.
- Add acceptance cases for a DeepSeek-named channel with explicit thinkingFormat and missing
  affinity, and for an unopted DeepSeek-named channel with missing affinity.
- Define the evidence required to license sendSessionAffinityHeaders=true: the artifact must
  show the tested request carried the headers, while separately stating that stickiness is not
  proven.

## 6. Plan Seed

- Trace the selected adapter warningText path from model_select through first-match selection.
- Compose or merge generic and DeepSeek missing lists before rendering startup advice.
- Add actual hook-level regression fixtures for both DeepSeek affinity cases.
- Strengthen the no-manufactured-wire-format test input.
- Preserve a redacted request trace or an equivalent server echo for the affinity probe.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate class | Evidence | Finding refs |
|----------|--------|------------|----------|--------------|
| spec_code | fail | hard | plan.md:64-74 versus index.ts:2997-3110 | F001 |
| checklist_evidence | partial | hard | tasks.md:37-63, scratch/check-run.txt, scratch/verify-no-warning.txt | F001, F003 |

The packet is Level 1 and has no standalone checklist.md. Its tasks.md completion rows are
therefore the available checklist-style claims; broad command evidence supports them, but the
missing consumer case and affinity request trace leave the protocol partial.

### Overlay Protocols

| Protocol | Status | Gate class | Evidence |
|----------|--------|------------|----------|
| skill_agent | notApplicable | advisory | Target is a spec-folder, not a skill. |
| agent_cross_runtime | notApplicable | advisory | No agent definition is under review. |
| feature_catalog_code | notApplicable | advisory | No feature catalog is part of this packet. |
| playbook_capability | partial | advisory | review/brief.md:46-49 and verify-no-warning.mjs:60-99 omit missing-affinity DeepSeek startup coverage. |

Resource Map Coverage: resource-map.md was absent at target initialization; the coverage gate was
skipped. A lineage-local emission record documents that absence.

### Claim-by-claim assessment

1. Confirmed — the explicit effective thinkingFormat gate is present at index.ts:2987-2995,
   and the negative/positive unit assertions are at review-findings.test.ts:1122-1148.
2. Confirmed — the changed suggestion/advice branch is removed in
   change-under-review.diff:124-143, and buildFixSuggestion() consumes the remaining missing
   list without a thinkingFormat assignment at index.ts:5899-5923.
3. Partly confirmed — the generic helper preserves the false opt-out, but the selected DeepSeek
   startup adapter bypasses that generic list; command surfaces still expose it.
4. Partly confirmed — gate tests would fail against the old predicate, but the specific negative
   suggestion/advice test is vacuous because its input omits thinkingFormat.
5. Partly confirmed — models.json contains the provider and model declarations, and the image
   response matches its deterministic fixture; the affinity artifact records HTTP 200 but no
   request-header trace.
6. Partly confirmed — verify-no-warning.mjs reaches model_select and has positive controls, but
   it explicitly accepts zero warnings for an unopted DeepSeek case whose full diagnosis still
   has missing affinity.
7. Confirmed from scratch/check-run.txt — typecheck, 114 tests, diff check, and package dry-run
   output are present with successful results.

## 8. Deferred Items

- No live replay of openai-responses or official OpenAI base URL variants was performed.
- Gateway cache stickiness remains unproven, as the packet itself acknowledges.
- The packet's README limitation about operator-only thinkingFormat guidance remains outside the
  frozen implementation scope.
- validate.sh and metadata freshness were not rerun in this lineage because the user prohibited
  repository tooling that could write outside the lineage.

## 9. Dimension Expansion Map

- Selected direction: broad all-dimensions pass because maxIterations=1.
- Correctness: source consumer path, adapter ordering, helper composition, and fix path reviewed.
- Security: credential redaction, input handling, and write-surface boundaries reviewed.
- Traceability: spec/plan/task claims, test harness, live image evidence, and affinity evidence
  reviewed.
- Maintainability: test non-vacuity, duplicated adapter responsibilities, and documentation
  claims reviewed.
- Completed pivots: 0.
- Failed pivots: 0.
- Remaining frontier: startup notification replay and request-header evidence replay.

## 10. Search Ledger

| Ledger | Bug class | Result | Evidence |
|--------|------------|--------|----------|
| SL-001 | consumer-path | finding F001 | index.ts:2997-3110 and 4053-4110 |
| SL-002 | test-vacuity | finding F002 | review-findings.test.ts:1151-1167 and diff:124-143 |
| SL-003 | config-evidence | finding F003 | live-affinity-probe.md:10-49 and live-affinity-probe.json:1 |
| SL-004 | scope-and-secret-safety | ruled out | plan.md:105-110 and packet scratch artifacts |

Search debt: none. The single-pass frontier is explicit; it is not treated as convergence.

## 11. Audit Appendix

### Convergence and lifecycle

- Session: fanout-gpt-56-luna-1789146937931-6gxjep
- Executor: cli-codex model=gpt-5.6-luna
- Requested execution mode: AUTONOMOUS
- Requested lineage mode: auto
- Effective lifecycle lineage: new, generation 1
- Total iterations: 1
- Stop policy: max-iterations
- Terminal stop reason: maxIterationsReached
- Dimension coverage: 1.0
- Convergence eligibility: false; the cap was reached before the required stabilization pass.
- Final release readiness: in-progress.

### Sources reviewed

- Target documents: spec.md, plan.md, tasks.md, implementation-summary.md.
- Implementation: .pi/extensions/pi-cache-optimizer/index.ts,
  .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts, and .pi/models.json.
- Review material: review/README.md, review/brief.md, review/change-under-review.diff.
- Evidence: scratch/live-image-probe.*, scratch/live-affinity-probe.*,
  scratch/verify-no-warning.*, scratch/check-run.txt, and scratch/vision-probe.png.

### Core Protocols

- spec_code: fail due F001.
- checklist_evidence: partial due F001 and F003.

### Overlay Protocols

- skill_agent: not applicable.
- agent_cross_runtime: not applicable.
- feature_catalog_code: not applicable.
- playbook_capability: partial due missing notification-path coverage.

### Adversarial self-check

F001 was replayed against the plan claim, the generic helper, the selected DeepSeek adapter, and
the notification consumer. The finding remains P1 because it affects an advertised startup
contract beyond the already-configured llmgateway case, but it is not a release-blocking P0.
F002 and F003 are retained as P2 because they weaken proof and maintainability without showing a
direct production outage in the reviewed target.

Review verdict: CONDITIONAL
