# Review Report — specs/hooks/021-compat-opt-in-and-image-declaration

Review lineage: glm-53-flash · session fanout-glm-53-flash-1789146937931-6gxjep · generation 1 · executor cli-pi (glm-5.3-flash, reasoningEffort max) · mode: detached inline fan-out, executor-dispatch steps satisfied by this process.

Reviewed: commit 80576ef8aa05a68a9c425d34cdaa1c301433c816, "fix(pi-cache-optimizer): require a declared wire format before giving DeepSeek compat advice" (change-under-review.diff, 3 files). The landed repository change, which additionally carries this spec packet, is the amended commit 8d897d2a83 (finding F5).

## Executive Summary

**Verdict: CONDITIONAL.** 0 P0, 1 P1, 4 P2. All five findings are active, none resolved, none repeated. releaseReadinessState: in-progress. Dimension coverage 0.25 (correctness) under stopPolicy=max-iterations with maxIterations=1, stopReason maxIterationsReached.

The change gates all DeepSeek-specific compat advice on an explicit wire-format declaration (compat.thinkingFormat === 'deepseek') instead of a DeepSeek-like model name, moves the session-affinity check to the generic OpenAI-compatible proxy list, and removes thinkingFormat from the fix write-set. The predicate change is real and, on the evidence reviewed, correctly motivated. One finding survives adjudication at P1: F1, the DeepSeek adapter's passive warning surface.

- **F1 (P1, correctness):** after the change the 'deepseek' cache-provider adapter's warningText recomputes its missing-list from the DeepSeek-only list (index.ts:3097-3105), which now holds only requiresReasoningContentOnAssistantMessages. Session-affinity warnings for opted-in, affinity-missing channels therefore never reach the passive model_select notification, because selectAdapterForModel (index.ts:4053-4055) picks the FIRST matching adapter and the generic-proxy warningText that carries affinity (index.ts:4045-4049) is unreachable for DeepSeek-named models. Harness control B (scratch/verify-no-warning.txt) sets sendSessionAffinityHeaders:true, so the regression path is unexercised. Adjudicated (Hunter/Skeptic/Referee): passed, held at P1 with a recorded downgradeTrigger.
- **F2 (P2):** isDeepSeekWireCompatApplicable (index.ts:2987-2990) narrows applicability to isOpenAICompatibleProxyApi (openai-completions only, index.ts:1495-1498), so an opted-in channel on openai-responses silently loses the reasoning-replay check. Defensible, since replay is a chat-completions concern, but undocumented and uncovered: no test fixture uses openai-responses.
- **F3 (P2):** the opt-in key thinkingFormat is no longer named anywhere in the extension's own advice output (only the interface field at index.ts:260 and the gate at 2989). Discovery rests on precedent outside the extension.
- **F4 (P2):** implementation-summary.md continuity metadata carries the all-zeros fingerprint placeholder (:25) and a next_safe_action (:18) that contradicts known-limitation 5 (:127).
- **F5 (P2):** the review brief cites 80576ef8aa (brief.md:17-18) while the landed 18-file change is 8d897d2a83, and .pi/models.json:13-14 carries uncommitted id drift that does not intersect the reviewed declarations.

Verified positives: the explicit-false affinity opt-out inconsistency is genuinely fixed (the old !== true treated explicit false as missing, the new === undefined at index.ts:2710-2712 respects it) and holds on both the generic and the DeepSeek paths (REQ-003). The four new gate tests are not vacuous: tests 1122, 1169 and the 1651-1662 expectation fail against pre-patch code, while 1138/1151 are regression guards, documented as such. Live probes support REQ-004 (affinity headers, HTTP 200) and REQ-005 (image declaration, 200 with a 720x300 probe transcribed exactly) for deepseek-v4.1-flash. scratch/check-run.txt records 114 tests / 28 suites / 0 failures including the four new gate tests.

Resource Map Coverage Gate: resource-map.md is not present in the review target, so the gate is skipped with a note (resource_map_present=false, recorded in the config record).

**Execution notes (stated once):** this lineage ran inline per the detached fan-out invocation: the workflow's executor-dispatch steps are satisfied by this process and step_fanout_merge is skipped (single-executor path, the lineage config carries no fanout section). State, registry, delta, iteration, synthesis and dashboard records were hand-authored directly into the lineage directory, because the invocation mandates direct writes and the review-mode gateway has no projection onto the legacy state log (the documented cutover: direct writes stay until a projection contract exists). The append gateway was nevertheless invoked for each state record, in two documented shape variants, and its receipts are kept under .executor-state/ (gw-receipts.jsonl, gw-*.out). convergence.cjs, upsert.cjs and the reducer were not executed: their writes fall outside this lineage's permitted write surface, so convergence telemetry is computed inline and recorded as graphless (the coverage graph was not persisted, the iteration record's graphEvents are evidence, not a graph). The continuity save (generate-context.js) was skipped for the same reason. The advisory loop-lock was acquired and released at .deep-review.lock inside this lineage.

## Planning Trigger

The report carries one active P1 and four active P2 findings across three remediation workstreams, so the planning packet triggers a remediation round. Complete packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": 5,
  "remediationWorkstreams": [
    { "id": "WS1", "severity": "P1", "findings": ["F1"], "title": "Restore passive affinity visibility for opted-in DeepSeek channels", "required": true },
    { "id": "WS2", "severity": "P2", "findings": ["F2", "F3"], "title": "Cover the responses-transport narrowing and surface the thinkingFormat opt-in", "required": false },
    { "id": "WS3", "severity": "P2", "findings": ["F4", "F5"], "title": "Reconcile continuity metadata and record the amended-commit provenance", "required": false }
  ],
  "specSeed": {
    "packet": "specs/hooks/021-compat-opt-in-and-image-declaration",
    "verified": ["REQ-001", "REQ-002", "REQ-003", "REQ-004", "REQ-005", "REQ-006", "REQ-007 (supported, exit status not captured)"],
    "recordedUnknown": ["REQ-008 (validate.sh --strict not executable inside the lineage's command surface)"],
    "amendmentSeeds": [
      "notification-coverage expectation for the DeepSeek adapter (F1)",
      "responses-transport applicability note (F2)",
      "continuity metadata regeneration (F4)"
    ]
  },
  "planSeed": {
    "suggestedNextStep": "/speckit:plan",
    "sequencing": "WS1 first (the only required workstream); WS2 and WS3 are suggestion-tier and may ride along or follow",
    "coverageGap": "dimensions security, traceability and maintainability are formally uncovered (coverage 0.25); a follow-up review should start at security"
  },
  "findingClasses": ["notification-coverage", "applicability-narrowing", "documentation-gap", "traceability-metadata", "provenance-drift"],
  "affectedSurfacesSeed": [
    ".pi/extensions/pi-cache-optimizer/index.ts",
    ".pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts",
    ".pi/models.json",
    "specs/hooks/021-compat-opt-in-and-image-declaration/implementation-summary.md"
  ],
  "fixCompletenessRequired": true,
  "hasSearchDebt": true
}
```

## Active Finding Registry

Authoritative copy: deep-review-findings-registry.json in this lineage, which carries the full 64-character contentHash values. All dispositions: active.

| ID | Severity | Dimension | Primary evidence | findingClass | contentHash (prefix) | Title |
|----|----------|-----------|------------------|--------------|----------------------|-------|
| F1 | P1 | correctness | .pi/extensions/pi-cache-optimizer/index.ts:3097-3105 | notification-coverage | aa180feede3b | Passive affinity warning lost on opted-in DeepSeek channels: warningText recomputes missing from the DeepSeek-only list |
| F2 | P2 | correctness | .pi/extensions/pi-cache-optimizer/index.ts:2987-2990 | applicability-narrowing | e75240ac0450 | Opted-in DeepSeek on openai-responses silently loses the reasoning-replay check (predicate narrowed to openai-completions) |
| F3 | P2 | maintainability | .pi/extensions/pi-cache-optimizer/index.ts:260,2989 | documentation-gap | b19448ff179f | The opt-in key thinkingFormat is no longer named anywhere in the extension's own advice output |
| F4 | P2 | traceability | implementation-summary.md:18-25 | traceability-metadata | d81c76ddeaa3 | Continuity metadata: all-zeros fingerprint placeholder and next_safe_action contradicting limitation 5 |
| F5 | P2 | traceability | review/brief.md:17-18 | provenance-drift | b895b4a289bb | Provenance drift: brief cites 80576ef8aa, landed change is 8d897d2a83; models.json carries uncommitted id drift |

Evidence density: 3.4 evidence references per finding on average, every finding carries concrete file:line evidence (evidenceDensityGate: pass).

## Remediation Workstreams

**WS1 (required, P1, F1).** Restore passive affinity visibility for opted-in DeepSeek channels. Fix: compose the DeepSeek adapter's warningText missing-list from the merged describeMissingCacheCompatForModel list, or otherwise mark affinity as reported, in .pi/extensions/pi-cache-optimizer/index.ts:3097-3105. Verification: extend scratch/verify-no-warning.mjs with control D (opted-in, affinity-missing, replay-satisfied) and assert the notification fires. Doctor and compat output must remain unchanged. fixCompleteness: replay required on the next fix round (fixCompletenessRequired: true).

**WS2 (suggested, P2, F2 + F3).** (a) Add a responses-transport fixture asserting the intended, empty DeepSeek result for an opted-in channel on openai-responses, or record the narrowing as a limitation (F2). (b) Name the thinkingFormat:'deepseek' opt-in in the not-opted-in doctor output, or as an informational, never-written, advice line (F3).

**WS3 (suggested, P2, F4 + F5).** (a) Regenerate the continuity metadata pair after the last packet-doc edit and reconcile next_safe_action with known-limitation 5 (F4). (b) Add a one-line provenance note (80576ef8aa, amended as 8d897d2a83) to the packet (F5). The models.json working-tree drift needs awareness only.

## Spec Seed

Packet: specs/hooks/021-compat-opt-in-and-image-declaration (Level 1, P1, branch skilled/v4.0.0.0). Requirements REQ-001..REQ-006 verified with file:line evidence, REQ-007 supported by the captured check-run artifact (exit status itself not captured), REQ-008 recorded-unknown. Amendment seeds: the notification-coverage expectation (F1), so the passive warning surface is pinned by the spec, the responses-transport applicability note (F2), and regeneration of the continuity metadata (F4). Success criteria SC-001..003: no contradicting evidence was found. Checklist evidence: notApplicable (Level 1, no checklist.md, AC_COVERAGE exempt).

## Plan Seed

Suggested next step: /speckit:plan, seeded from the Planning Packet above. Sequence: WS1 (required) first, then WS2 and WS3 (suggestion-tier, may ride along). Do not re-plan the verified surface: REQ-001..006 are evidenced. The plan should additionally reserve a follow-up review iteration covering security, traceability and maintainability (coverage 0.25), starting at security per the risk-ordered queue.

## Traceability Status

| Requirement | Status | Evidence |
|---|---|---|
| REQ-001 (opt-in gate) | verified | index.ts:2987-2990, tests:review-findings.test.ts:1122-1136 |
| REQ-002 (no manufactured thinkingFormat) | verified | grep: only index.ts:260 (interface) and 2989 (gate), fix-assertion 1651-1662 |
| REQ-003 (explicit-false opt-out) | verified | index.ts:2710-2712 (=== undefined, respects explicit false), tests:1169-1185, holds on both the generic and the DeepSeek paths |
| REQ-004 (affinity declared + 200) | verified | .pi/models.json:50, scratch/live-affinity-probe.md (HTTP 200, three headers legible) |
| REQ-005 (input declaration + image 200) | verified | .pi/models.json:57, scratch/live-image-probe.md (200, 720x300 probe transcribed exactly), licenses the declaration for deepseek-v4.1-flash only |
| REQ-006 (tests fail pre-patch, no leftover assertion) | verified | tests 1122, 1169, 1651-1662 fail pre-patch, 1138/1151 are regression guards, no test still asserts a manufactured thinkingFormat |
| REQ-007 (check suite green) | supported | scratch/check-run.txt:186-190 (114 tests / 28 suites / 0 failures, the four new gate tests by name), exit status itself not captured in the artifact |
| REQ-008 (validate.sh --strict + metadata refresh) | recorded-unknown | not executable inside this lineage's permitted command surface, needs one run from the packet's own workflow |
| checklist_evidence | notApplicable | Level 1 packet, no checklist.md, AC_COVERAGE advisory signal: exempt |
| resource_map | not present | resource-map.md absent, coverage gate skipped (resource_map_present=false) |

Brief claim roll-up: CLAIM-1..7, five confirmed and two partly confirmed (CLAIM-3: the notification surface, see F1. CLAIM-7: the artifact records totals but not the exit status).

## Deferred Items

1. REQ-008 (validate.sh --strict): UNKNOWN here. What resolves it: one run from the packet's own workflow, outside this lineage.
2. Real-session notification behavior: the harness constructs the merged compat itself (verify-no-warning.mjs), it does not prove the pi runtime merge. What resolves it: one live model_select observation.
3. Vendored pi-ai adapter semantics (affinity-header sending): quoted from the probes, not independently re-read, recorded under omittedHighRiskTargets.
4. SPECKIT_COMPLETION_FRESHNESS enforcement state: depends on runtime flags, unchecked. Affects only how loudly F4's stale fingerprint would be reported.
5. 80576ef8aa → 8d897d2a83 parentage (the amend): inferred from read-only git, not proven, F5 records the evidence.
6. Search debt: DEBT-001 responses-API fixture coverage (from SL-002), DEBT-002 harness control D (from SL-001). Both are WS1/WS2 verification obligations.
7. Dimension coverage: security, traceability and maintainability formally uncovered (0.25). Resolution: a follow-up review, outside this lineage's cap.

## Search Ledger

Required bug classes (4): notification-coverage (covered, F1), applicability-narrowing (covered, F2), write-set-drift (ruled out, SL-003), contract-assertion-accuracy (ruled out, SL-004). Deferred: responses-api-coverage, harness-control-d. Blocked: none. Graph coverage mode: graphless_fallback (the coverage graph was not persisted, the iteration record's graphEvents document the would-be nodes and edges as evidence). Search rows: SL-001..004, with full searchActions and evidenceRefs in the iteration-001 record (deltas/iter-001.jsonl line 1). Ruled-out candidates: leftover thinkingFormat references in repair, placement or safety code (grep: only 260 and 2989), and vacuous new assertions (1122, 1169, 1651-1662 fail pre-patch). Clean-search proof: every required bug class answered by direct reads or greps with cited evidence, no negative control fired. hasSearchDebt: true (2 obligations), consistent with the CONDITIONAL verdict, since there is no active P0.

## Dimension Expansion Map

| Dimension | Status | Findings | Note |
|---|---|---|---|
| D1 correctness | covered (iteration 1) | F1, F2 | the cap exhausted the queue's first entry |
| D2 security | not covered | - | next in the risk-ordered queue, first in any follow-up |
| D3 traceability | incidental only | F4, F5 | surfaced while verifying, not counted as coverage |
| D4 maintainability | incidental only | F3 | surfaced while verifying, not counted as coverage |

Coverage 0.25. The convergence vote (weightedStopScore 0.0, newFindingsRatio 1.0) is telemetry: the loop ended on the hard iteration cap, not on convergence.

## Audit Appendix

Core protocols: read-only review of the target (SCOPE VIOLATIONS: none, per iteration-001), file:line evidence for every claim, severity mapping blocker→P0, major→P1, minor/nit→P2 per the brief, nothing held in memory (all findings written to the delta, the registry and the iteration), the advisory loop-lock honored.

Overlay protocols: adversarial claim adjudication (Hunter/Skeptic/Referee) on the sole P1, F1, recorded as the claim_adjudication event (passed, counter-evidence sought, alternative explanation recorded, downgradeTrigger: if the command-surface coverage is deemed sufficient and limitation 6 is extended to opted-in channels, downgrade to P2). Vacuity challenges on the new tests (two directions ruled out, see the Search Ledger). Provenance cross-check via read-only git (--no-optional-locks), yielding F5.

Review verdict: CONDITIONAL
