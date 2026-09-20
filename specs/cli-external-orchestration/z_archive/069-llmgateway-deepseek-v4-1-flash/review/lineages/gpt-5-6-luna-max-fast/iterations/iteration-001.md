---
title: Deep Review Iteration 001 - Full Matrix
description: Inline correctness-led review of packet 069 and its runtime, Pi, OpenCode, and continuity contracts.
---

# Deep Review Iteration 001

## 1. Bindings and execution

| Binding | Value |
|---|---|
| Target | `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash` |
| Target type | `spec-folder` |
| Dimensions | correctness, security, traceability, maintainability |
| Session | `fanout-gpt-5-6-luna-max-fast-1789146954427-phycl9` |
| Executor | `cli-codex model=gpt-5.6-luna` |
| Execution | Inline in this detached lineage; no nested dispatch |
| Iteration | 001 of 001 |

The target packet, operational references, Pi configuration, runtime allowlist/provider map, and unit-test expectations were read without modifying any target file. Recorded live probe results were treated as evidence supplied by the packet; no live dispatch or repository test/gate command was run from this lineage.

## 2. Review method and scope

The pass followed the producer-to-consumer path for the model identifier and defaults: packet requirements and closure state, OpenCode and Pi provider rosters, `.pi` model/settings sources, fan-out mapping, executor configuration, and tests. It also checked security-sensitive configuration boundaries for credential material and provider routing. Historical changelog occurrences were treated as history unless a current operational instruction depended on them.

The hard cap means convergence telemetry is not a reason to synthesize early. The pre-iteration max-policy decision was `CONTINUE` because zero iterations were complete; after this record, the terminal decision is `maxIterationsReached`.

## 3. Findings

### F001 — cli-opencode reference retains the superseded V4 Flash operational default

- **Severity:** P1
- **Dimension:** correctness
- **Finding class:** `cross-consumer`
- **Primary source:** `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:131`
- **Evidence:**
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:131]` uses `--model opencode-go/deepseek-v4-flash` in the canonical invocation block.
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:141]` labels the same superseded id as the `--model` default.
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:186]` tells the operator to proceed with the old id when the default is available.
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:242]` and `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:255]` repeat the old id in missing-provider recovery guidance; `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:273]` repeats it in model selection.
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:75]` identifies `opencode-go/deepseek-v4.1-flash` as the mode default and says the route was moved.
  - `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/spec.md:97]` requires the opencode-go route to name the live V4.1 id on every retained surface.
- **Impact:** An operator following the canonical cli-opencode reference sends the superseded route and can bypass the packet's intended V4.1 replacement. The old route's current live availability is not re-probed here; the documentation/source-of-record contradiction is directly confirmed.
- **Recommendation:** Replace every operational default, preflight action, recovery template, and model-selection example in `cli-reference.md` with `opencode-go/deepseek-v4.1-flash`. Preserve an old id only when explicitly labeled historical or optional fallback, then re-scan non-changelog operational surfaces.
- **Scope proof:** The target packet names the cli-opencode reference and sibling route in scope, and its requirement is explicitly “every surface”; five current instruction points disagree with the current roster's default.
- **Affected surface hints:** `cli-opencode/references/cli-reference.md` default invocation, provider preflight, missing-provider recovery, and model-selection guidance.
- **Content hash:** `6213a7466609734e9954e7173263e46d16b10597565acd66d809174c4bb1ea64`

Typed claim-adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The canonical cli-opencode reference still labels opencode-go/deepseek-v4-flash as the default route.",
  "evidenceRefs": [
    ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:131",
    ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:186",
    ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:273",
    ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:75"
  ],
  "counterevidenceSought": "Compared every operational occurrence in cli-reference.md with the current provider roster and the packet requirement; the roster names V4.1 as the mode default, while the reference still names V4 Flash.",
  "alternativeExplanation": "The old id might remain a supported direct-dispatch fallback, but the cited sections call it the default and recovery action, so that reading does not reconcile the live instructions.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade to P2 only if the old id is explicitly relabeled as historical or optional fallback and every default/preflight instruction names V4.1.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial inline review" }
  ]
}
```

### F002 — Pi default configuration and custom-provider guidance disagree with the active provider catalog

- **Severity:** P1
- **Dimension:** correctness
- **Finding class:** `cross-consumer`
- **Primary source:** `.pi/settings.json:4`
- **Evidence:**
  - `[SOURCE: .pi/settings.json:4]` sets `defaultProvider` to `llmgateway`, while `[SOURCE: .pi/settings.json:5]` sets `defaultModel` to `z-ai/glm-5.3-flash`.
  - `[SOURCE: .pi/models.json:44]` begins the `llmgateway` provider block, whose declared model ids are the bare `deepseek-v4.1-flash` at `[SOURCE: .pi/models.json:54]` and bare `glm-5.3-flash` at `[SOURCE: .pi/models.json:79]`; `z-ai/glm-5.3-flash` is instead declared under `cline-pass` at `[SOURCE: .pi/models.json:28]`.
  - `[SOURCE: .pi/custom-providers.md:27]` and `[SOURCE: .pi/custom-providers.md:35]` state that the Pi default provider is `cline-pass`, while `[SOURCE: .pi/custom-providers.md:67]` says `llmgateway` is not a default and `[SOURCE: .pi/custom-providers.md:150]` says it is not in the deep-loop fan-out roster.
  - `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2099]` sets the fan-out default to `deepseek-v4.1-flash`, and `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2285]` maps that literal to `llmgateway`, contradicting the removal guidance.
  - `[SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:86]` repeats the cline-pass-default statement.
- **Impact:** The checked-in Pi settings select a provider/model pair that is not declared together in `.pi/models.json`, while the operator-facing document describes a different default and advises treating llmgateway as removable. The exact runtime failure mode is not asserted without a Pi round-trip, but the static default/provider contract is inconsistent and can make an unqualified dispatch fail or resolve unexpectedly.
- **Recommendation:** Choose and document one valid default pair. If `llmgateway` remains the active default, use a declared bare model id and update both provider references and removal guidance; if `cline-pass` is intended, restore matching settings and explicitly explain the fan-out's independent llmgateway mapping. Add a default-resolution check that validates provider and model against the same catalog block.
- **Scope proof:** `.pi/settings.json`, `.pi/models.json`, `.pi/custom-providers.md`, the cli-pi roster, and the fan-out mapping are all named implementation/config surfaces for this packet.
- **Affected surface hints:** Pi startup/default dispatch, model picker, custom-provider removal instructions, cli-pi roster, and deep-loop fan-out model selection.
- **Content hash:** `25e0c258e4dcd2d9a8da8dbb635d92a4b4e06dc5d89f501c7260f626a1b9a3f3`

Typed claim-adjudication packet:

```json
{
  "findingId": "F002",
  "claim": "The checked-in Pi default selects llmgateway with a model id declared under cline-pass, while the provider documentation says cline-pass is the default and llmgateway is not used by fan-out.",
  "evidenceRefs": [
    ".pi/settings.json:4",
    ".pi/settings.json:5",
    ".pi/models.json:28",
    ".pi/models.json:44",
    ".pi/models.json:79",
    ".pi/custom-providers.md:67",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2285"
  ],
  "counterevidenceSought": "Compared the checked-in settings with both provider blocks, the cli-pi roster, the custom-provider instructions, and the fan-out default/provider map; no second repository settings source or explicit environment-specific override was found in the reviewed surfaces.",
  "alternativeExplanation": "The settings file could be an operator-local preference that intentionally differs from the documentation baseline, but it is checked into the repository and its selected model id is not declared in the selected provider block.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade to P2 only after the repository documents the settings as an intentional environment-specific override and a direct Pi resolution check proves the selected pair is valid.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial inline review" }
  ]
}
```

### F003 — Continuity percentages do not distinguish implementation completion from release readiness

- **Severity:** P2
- **Dimension:** traceability
- **Finding class:** `cross-consumer`
- **Primary source:** `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/decision-record.md:20`
- **Evidence:**
  - `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/decision-record.md:20]` records `_memory.continuity.completion_pct: 100`.
  - `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/implementation-summary.md:27]` and `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:23]` record `completion_pct: 85`.
  - `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:102]` says `Closeable: No` because two live gates are deferred, and `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/tasks.md:93]` leaves manual verification unchecked.
- **Impact:** A resume reader or automation that consumes the 100% value can mistake implementation completion for release readiness and skip the explicitly open Pi/Cline gates. This is a traceability ambiguity rather than evidence that the deferral decision itself is invalid.
- **Recommendation:** Align the continuity percentages or label separate `implementationCompletionPct` and `releaseReadinessState` values consistently across the packet. Keep the open-gate state machine authoritative for closure.
- **Scope proof:** All cited files are packet continuity/closure surfaces, and the target is a spec-folder review of release-readiness claims.
- **Affected surface hints:** decision record metadata, implementation summary, handover, acceptance closure, and task completion checklist.
- **Content hash:** `04d25209c7af93b0ee9e646f62907c11e06d38d57d45923da141a4b4584e389f`

### F004 — Unit-test description still names the old model

- **Severity:** P2
- **Dimension:** maintainability
- **Finding class:** `single-site`
- **Primary source:** `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:837`
- **Evidence:** `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:837]` titles the test as defaulting to `deepseek-v4-flash`, while `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:838]` asserts `deepseek-v4.1-flash`.
- **Impact:** The test executes the correct assertion but its description misstates the contract, making failures and review output harder to interpret during future model-route changes.
- **Recommendation:** Rename the test to state `deepseek-v4.1-flash` and retain the assertion as the source-of-truth check.
- **Scope proof:** The unit test is explicitly named in the packet's implementation and verification surfaces.
- **Affected surface hints:** executor-config default test naming and future failure diagnostics.
- **Content hash:** `09fd1e31c3becd7feb8d8e66f0da4dc6bd177493584af3a58aeeaca3585fd4b5`

## 4. Security review result

No security finding was raised in this iteration. Static inspection confirmed that the custom-provider blocks retain environment references rather than embedded credentials: `[SOURCE: .pi/models.json:7]` uses `${CLINE_API_KEY}` and `[SOURCE: .pi/models.json:48]` uses `${LLMGATEWAY_API_KEY}`. The review did not execute a live credential or dispatch test, so this is a source-level result only.

## 5. Traceability checks

| Protocol | Status | Gate class | Evidence | Result |
|---|---|---|---|---|
| `spec_code` | partial | hard | `spec.md:94-107`, `cli-reference.md:131`, `providers-and-models.md:75`, `fanout-run.cjs:2099,2285` | Runtime/provider mapping was traced; F001 and F002 leave documentation/config contract gaps. |
| `checklist_evidence` | partial | hard | `acceptance-criteria.md:57-77,102`, `tasks.md:89-93`, `implementation-summary.md:127-146` | Recorded checks exist, but manual verification remains unchecked and continuity percentages disagree (F003). |
| `skill_agent` | notApplicable | advisory | target type `spec-folder` | No skill/agent pair is the target contract. |
| `agent_cross_runtime` | notApplicable | advisory | target type `spec-folder` | No agent definition is in scope. |
| `feature_catalog_code` | partial | advisory | `.pi/models.json:44-99`, `.pi/settings.json:4-24` | Catalog/provider pairing was checked statically; live resolution was deferred. |
| `playbook_capability` | partial | advisory | `cli-reference.md:131-273`, `.pi/custom-providers.md:27-150` | Operational guidance contains F001/F002 drift; live examples were not re-run. |

Required core protocols executed: 2. Required core protocols fully covered: 0. `requiredProtocolsCovered=false` for convergence purposes.

## 6. Search ledger summary

| Bug class / invariant | Disposition | Evidence or reason |
|---|---|---|
| stale operational route identifier | finding `F001` | `cli-reference.md:131,141,186,242,255,273` vs `providers-and-models.md:75` |
| provider/default/model-id consistency | finding `F002` | `.pi/settings.json:4-5`, `.pi/models.json:28,44,54,79`, fan-out map `fanout-run.cjs:2285` |
| completion and closure state consistency | finding `F003` | packet continuity and closure rows cited above |
| test expectation/documentation drift | finding `F004` | `executor-config.vitest.ts:837-838` |
| credential material and provider trust boundary | ruled out | `.pi/models.json:7,48`; no secret literal or boundary move found |
| OpenRouter-prefixed historical/alternate route as retired-id violation | ruled out | packet scope excludes OpenRouter; provider-prefixed form remains a separate route |
| allowlist/provider map/pin divergence | ruled out for this pass | `fanout-run.cjs:2099,2285` and executor configuration align on the V4.1 literal; existing duplication risk is recorded in the packet |
| live route status, Pi round-trip, and Cline quota behavior | deferred | source tree cannot confirm live HTTP/dispatch results; packet records the current probe claims |
| graph-assisted hotspot saturation | blocked | graph writer was not invoked to preserve the detached lineage write boundary; direct evidence ledger is retained |

## 7. Convergence and terminal gates

- Findings: 4 total, all new (`P0=0`, `P1=2`, `P2=2`); `newFindingsRatio=1.0`.
- Dimensions addressed: correctness, security, traceability, maintainability (`4/4` dimension coverage for this iteration).
- Stabilization: one pass only; no cross-iteration stability can be demonstrated.
- Convergence telemetry: rolling average unavailable as a two-iteration measure; MAD unavailable; dimension signal is incomplete because required core protocols are partial. The telemetry is not used to synthesize early.
- Terminal decision: `maxIterationsReached` takes precedence after iteration 001. Release readiness remains `in-progress`.

Terminal legal-gate snapshot preserved for synthesis:

| Gate | Result | Detail |
|---|---|---|
| `convergenceGate` | pass by hard cap | score is telemetry only; cap reached |
| `dimensionCoverageGate` | fail for legal convergence | four dimensions reviewed, but required core protocols are partial |
| `p0ResolutionGate` | pass | active P0 = 0 |
| `evidenceDensityGate` | pass | every active P1 has direct file:line evidence |
| `hotspotSaturationGate` | fail | one pass cannot establish revisit/saturation |
| `claimAdjudicationGate` | pass | typed packets present for F001 and F002 |
| `fixCompletenessReplayGate` | pass | not a security-sensitive fix rerun; required rows = 0 |
| `candidateCoverageGate` | fail | live-route and Pi-resolution obligations remain deferred |
| `graphlessFallbackGate` | pass | direct-read/exact-search ledger rows cover the selected bug classes; graph was intentionally unavailable |

## 8. Remediation workstreams

1. Correct the cli-opencode default and fallback references, then scan non-changelog operational surfaces for the superseded route (F001).
2. Reconcile `.pi/settings.json`, `.pi/models.json`, `.pi/custom-providers.md`, the cli-pi roster, and fan-out mapping; run a direct default-resolution check after the static repair (F002).
3. Clarify continuity percentage semantics without closing the packet while its live gates remain open (F003).
4. Rename the stale unit-test description (F004).

Review verdict: CONDITIONAL
