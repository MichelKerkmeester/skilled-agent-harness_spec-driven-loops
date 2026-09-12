---
title: Deep Review Report - 069 llmgateway DeepSeek V4.1 Flash
description: Findings-first release-readiness report for the detached inline gpt-5-6-luna-max-fast review lineage.
sessionId: fanout-gpt-5-6-luna-max-fast-1789146954427-phycl9
reviewTarget: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash
reviewTargetType: spec-folder
verdict: CONDITIONAL
stopReason: maxIterationsReached
releaseReadinessState: in-progress
---

# Deep Review Report

## 1. Executive Summary

**Verdict: CONDITIONAL.** This detached lineage executed one full-matrix review iteration and stopped at the configured hard cap. The terminal stop reason is `maxIterationsReached`; it is not a convergence claim. Two active P1 findings require remediation, and two P2 findings are advisory. No P0 finding was raised.

- **F001 (P1, correctness):** the canonical cli-opencode reference still instructs operators to use the superseded `opencode-go/deepseek-v4-flash` route as the default in several live instruction points.
- **F002 (P1, correctness):** checked-in Pi settings select `llmgateway` with `z-ai/glm-5.3-flash`, while the model is declared under `cline-pass` and the llmgateway catalog uses bare `glm-5.3-flash`; adjacent guidance describes a different default and denies fan-out reachability.
- **F003 (P2, traceability):** continuity documents report 100% and 85% completion values without distinguishing implementation completion from release readiness while live gates remain open.
- **F004 (P2, maintainability):** the executor-config default test title names the old model although the assertion expects V4.1.

The source-level security check found no embedded credential or trust-boundary change. Live route, Pi, and Cline behavior remains recorded-but-not-confirmed in this lineage. `releaseReadinessState` is `in-progress` because the cap ended the loop before legal convergence and because live proof is deferred.

## 2. Planning Trigger

The review was bound to `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash` as a `spec-folder` target with all dimensions enabled. The packet is Level 2, spans runtime, two CLI skills, Pi configuration, playbooks, tests, and continuity documents, and was reopened on 2026-09-11 for the opencode-go and cline-pass sibling routes.

The execution binding was `cli-codex model=gpt-5.6-luna`, session `fanout-gpt-5-6-luna-max-fast-1789146954427-phycl9`, with `maxIterations=1`, `convergenceThreshold=0.1`, and `stopPolicy=max-iterations`. The workflow's per-iteration dispatch was satisfied inline by this process. No nested CLI, agent, Task, WebFetch, repository writer, graph writer, validator, or target mutation was used.

The review write surface was exactly:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/review/lineages/gpt-5-6-luna-max-fast`

## 3. Active Finding Registry

| ID | Severity | Dimension | Primary evidence | Status |
|---|---|---|---|---|
| F001 | P1 | correctness | `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:131` | active |
| F002 | P1 | correctness | `.pi/settings.json:4` | active |
| F003 | P2 | traceability | `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/decision-record.md:20` | active |
| F004 | P2 | maintainability | `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:837` | active |

### F001 — Superseded cli-opencode default

`cli-reference.md:131`, `:141`, `:186`, `:242`, `:255`, and `:273` use or recommend `opencode-go/deepseek-v4-flash` as the default or recovery route. The current provider roster names `opencode-go/deepseek-v4.1-flash` as the mode default at `[SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:75]`, and the packet requires the V4.1 id on every retained surface at `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/spec.md:97]`. Update all operational guidance, then run a non-changelog stale-id scan. Typed claim adjudication passed with confidence 0.97.

### F002 — Pi provider/default mismatch

`.pi/settings.json:4-5` selects `llmgateway` plus `z-ai/glm-5.3-flash`. The llmgateway block at `[SOURCE: .pi/models.json:44]` declares bare `deepseek-v4.1-flash` and `glm-5.3-flash` at `[SOURCE: .pi/models.json:54]` and `[SOURCE: .pi/models.json:79]`; `z-ai/glm-5.3-flash` is under cline-pass at `[SOURCE: .pi/models.json:28]`. Meanwhile `[SOURCE: .pi/custom-providers.md:27]`, `:67`, and `:150` describe cline-pass as the default and llmgateway as unused by fan-out, while `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2285]` maps the V4.1 literal to llmgateway. Choose one valid provider/model pair and synchronize settings, catalog, docs, roster, and fan-out guidance. Typed claim adjudication passed with confidence 0.98. The exact runtime error mode requires a direct Pi resolution/round-trip and is deferred.

### F003 — Completion metadata ambiguity

`decision-record.md:20` reports `completion_pct: 100`, while `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/implementation-summary.md:27]` and `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/handover.md:23]` report 85%. The packet remains not closeable at `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/acceptance-criteria.md:102]`, and manual verification is unchecked at `[SOURCE: specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/tasks.md:93]`. Align the values or separate implementation completion from release readiness.

### F004 — Stale unit-test title

`[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:837]` names `deepseek-v4-flash`, while `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:838]` expects `deepseek-v4.1-flash`. Rename the test description so future failures identify the current contract.

## 4. Remediation Workstreams

1. **OpenCode documentation alignment — F001.** Replace the superseded default in the invocation block, default table, preflight action, fallback template, provider-missing prompt, and model-selection section. Preserve old ids only as explicitly labeled history or optional fallback.
2. **Pi default resolution — F002.** Decide whether the checked-in default is cline-pass or llmgateway, make `defaultProvider` and `defaultModel` resolve within one declared catalog block, and align custom-provider/cli-pi/fan-out documentation. Run a direct default resolution and model-picker check afterward.
3. **Release-state semantics — F003.** Give continuity percentages one defined meaning, or expose separate implementation and release-readiness fields. Keep the two live gates open until their owners provide proof.
4. **Test readability — F004.** Rename the stale test title and rerun the focused executor-config suite.

## 5. Spec Seed

The review maps the findings to the current packet contract as follows:

| Packet contract | Review result | Follow-up |
|---|---|---|
| REQ-006 / SC-005: opencode-go V4.1 on every retained surface | F001 shows the canonical reference still names V4 Flash | Update the reference and rescan |
| REQ-008 / SC-006: Pi catalog and default resolution | F002 shows provider/model and documentation drift | Reconcile catalog/settings and run Pi resolution |
| Packet closure and continuity | F003 shows ambiguous completion semantics while `Closeable: No` | Align metadata without closing deferred gates |
| Runtime default test | F004 shows stale narrative text | Rename the test title |
| Security boundary | No source-level defect found | Preserve environment-key references and closed allowlists |

This review does not authorize changes to the packet or implementation surfaces. It supplies evidence-backed follow-up seeds only.

## 6. Plan Seed

Recommended order for an authorized remediation session:

1. Correct F001 and F002 at their owning documentation/config seams.
2. Run focused static scans for the superseded route and for provider/model pairing consistency.
3. Rename F004 and run the focused executor-config tests.
4. Run both deep-loop suites and the frontmatter gate; capture exit codes and counts.
5. Run the operator-owned Pi default/model-list checks, the deferred gateway/Cline round-trips, and the packet validator.
6. Reconcile `acceptance-criteria.md`, `tasks.md`, continuity metadata, and release readiness only from final evidence.

No test, validator, live dispatch, or repository gate in this sequence was executed by this detached lineage; the packet's existing claims remain recorded evidence rather than fresh confirmation.

## 7. Traceability Status

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | partial | hard | `spec.md:94-107`; runtime `fanout-run.cjs:2099,2285`; cli-opencode roster `providers-and-models.md:75` | Producer/consumer path traced; F001/F002 remain. |
| `checklist_evidence` | partial | hard | `acceptance-criteria.md:57-77,102`; `tasks.md:89-93`; `implementation-summary.md:127-146` | Recorded checks exist, but manual verification is open and metadata conflicts. |
| `skill_agent` | notApplicable | advisory | spec-folder target | No skill/agent pair is the target contract. |
| `agent_cross_runtime` | notApplicable | advisory | spec-folder target | No agent definition is in scope. |
| `feature_catalog_code` | partial | advisory | `.pi/models.json:44-99`; `.pi/settings.json:4-24` | Static catalog pairing checked; live resolution deferred. |
| `playbook_capability` | partial | advisory | `cli-reference.md:131-273`; `.pi/custom-providers.md:27-150` | Operational default drift found; live examples not rerun. |

### AC_COVERAGE

- **Status:** deferred / not independently executed in this detached lineage.
- **Declared total:** 21 packet criteria (`AC-001` through `AC-021`).
- **Verified by this lineage:** 0/21 through the authoritative analyzer; packet-declared statuses were audited selectively but not promoted to fresh gate evidence.
- **Evidence floor:** every binary criterion needs attributable file:line or captured command evidence; live criteria additionally need the live output and exit status.
- **Next action:** run the packet's authorized acceptance-coverage analyzer and validator after remediation, then reconcile each criterion and the closure statement.

No `resource-map.md` was present at initialization, so the conditional Resource Map Coverage Gate was not emitted. The lineage records the absence and does not claim resource-map coverage.

## Dimension Expansion Map

| Dimension | Coverage | Findings | Remaining frontier |
|---|---|---|---|
| correctness | one full pass | F001, F002 | remediate and rerun provider/default consumers |
| security | source-level pass | none | live credential/dispatch checks remain external |
| traceability | one full pass | F003 | reconcile AC evidence and continuity semantics |
| maintainability | one full pass | F004 | rename stale test narrative and rerun focused test |

Configured dimension coverage is 4/4 for this iteration, but stabilization and required-protocol coverage are incomplete. The max cap prevents a follow-up pass.

## Search Ledger

| Bug class | Disposition | Evidence |
|---|---|---|
| stale operational route identifier | finding F001 | `cli-reference.md:131,273` vs provider roster `providers-and-models.md:75` |
| provider/default/model-id consistency | finding F002 | `.pi/settings.json:4-5`; `.pi/models.json:28,44,54,79`; `fanout-run.cjs:2285` |
| completion/release-state consistency | finding F003 | packet continuity and closure lines cited above |
| test expectation drift | finding F004 | `executor-config.vitest.ts:837-838` |
| credential boundary | ruled out | `.pi/models.json:7,48`; environment references only |
| retired-id scope classification | ruled out | `spec.md:65`; OpenRouter-prefixed alternate route remains distinct |
| allowlist/provider-map/pin alignment | ruled out for this pass | `fanout-run.cjs:2099,2285`; current runtime paths agree |
| live route behavior | deferred | requires operator-owned gateway/Pi/Cline round-trips |
| graph hotspot saturation | blocked | graph writer prohibited by detached containment; one pass cannot revisit hotspots |

The fallback search ledger is direct-read/exact-search based. Graph convergence telemetry was `CONTINUE`; no graph database write was attempted.

## 8. Deferred Items

- Pi-side default resolution and round-trip for the new model id; the checked-in provider/model mismatch must be resolved first.
- Cline-pass live round-trip after the recorded monthly quota window; the packet's 429 is not independently confirmed here.
- Current gateway `200`/`410`/`400` behavior, catalog freshness, pricing, context/output limits, and effort ladder; these remain packet-recorded probe claims.
- Both deep-loop test suites, the frontmatter gate, and the packet validator; user scope prohibited running them from this lineage.
- Graph-assisted hotspot saturation and a second iteration; the hard cap and detached write boundary prevent them.

## 9. Audit Appendix

### Terminal gate snapshot

| Gate | Result | Terminal evidence |
|---|---|---|
| `convergenceGate` | pass by cap | hard stop `maxIterationsReached`; telemetry score 0.45 |
| `dimensionCoverageGate` | fail for convergence | four dimensions covered once; required core protocols partial |
| `p0ResolutionGate` | pass | active P0 = 0 |
| `evidenceDensityGate` | pass | active P1 findings have direct file:line evidence |
| `hotspotSaturationGate` | fail | no revisit possible in one iteration |
| `claimAdjudicationGate` | pass | typed packets for F001 and F002; state event passed |
| `fixCompletenessReplayGate` | pass | security-sensitive rerun false; required rows = 0 |
| `candidateCoverageGate` | fail | live-route and graph-hotspot obligations remain deferred/blocked |
| `graphlessFallbackGate` | pass | cited direct-read/exact-search ledger rows retained |

### State and artifact receipts

- Iteration narrative: `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/review/lineages/gpt-5-6-luna-max-fast/iterations/iteration-001.md`.
- Iteration delta: `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/review/lineages/gpt-5-6-luna-max-fast/deltas/iteration-001.jsonl`.
- Append-only state: `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/review/lineages/gpt-5-6-luna-max-fast/deep-review-state.jsonl`.
- Final registry: `specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash/review/lineages/gpt-5-6-luna-max-fast/deep-review-findings-registry.json`.
- Final strategy/dashboard/config are in the same exact lineage directory.
- Four finding content hashes were recomputed from their declared primary file, line, finding class, and normalized description.
- The state log ends with a `synthesis_complete` event carrying `stopReason: maxIterationsReached`.

### Source-level security note

`[SOURCE: .pi/models.json:7]` and `[SOURCE: .pi/models.json:48]` retain environment-key references. No secret literal, permission change, or provider trust-boundary move was found in the reviewed sources. This does not replace an operator-owned live credential test.

Review verdict: CONDITIONAL
