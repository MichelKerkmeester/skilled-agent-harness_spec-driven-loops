---
title: Deep Review Strategy - Fan-out lineage (cli-pi, deepseek-v4.1-flash)
description: Review strategy for the DeepSeek compat opt-in and image declaration packet reviewed from a detached fan-out lineage.
trigger_phrases:
  - "deep review strategy"
  - "compat opt-in review"
  - "fanout lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review of commit `80576ef8aa` as documented by `specs/hooks/021-compat-opt-in-and-image-declaration`: the explicit `thinkingFormat` opt-in gate for DeepSeek cache-compat advice in `.pi/extensions/pi-cache-optimizer/index.ts`, the relocation of the session-affinity rule, the `thinkingFormat` removal from advice and `/cache-optimizer fix`, and the two `.pi/models.json` declarations (provider affinity compat, model image input). Detached fan-out lineage, generation 1, single iteration at the `maxIterations` cap.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Judging the upstream 2.8.7 extension's alternative implementation, or the npm/git copies under `~/.pi/agent/` (explicitly out of the packet's scope).
- Re-deciding the opt-in design itself: the review treats "name is not protocol evidence" as accepted and asks whether the implementation is faithful, complete and evidenced.
- Running the packet's own tooling (`validate.sh`, `generate-context.js`) or executing the live gateway probes; this lineage is a read-only reviewer with a bounded write surface.

---

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations`, `maxIterations: 1` — the loop terminates at the cap regardless of any convergence signal. Convergence math is telemetry only; the recorded `stopReason` is `maxIterationsReached`.
- No converged STOP is claimed, so the security-sensitive stabilization requirement (`minStabilizationPasses=2`) is explicitly unmet by this run and is carried as deferred work.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [CONDITIONAL] | [1] | Gate, suggestion and write-set behave as specified; one user-visible advisory (chat-level affinity) is lost through the adapter chain (F001). |
| [D2 Security] | [PASS] | [1] | No credential exposure or trust-boundary defect in the change; one advisory about committed gateway account metadata in the probe artifacts (F005). |
| [D3 Traceability] | [CONDITIONAL] | [1] | REQ-001/2/3/5 resolve to shipped behaviour; REQ-004 under-evidenced (F004), REQ-006 partly overstated (F002), plan DoD unchecked (F006). |
| [D4 Maintainability] | [PASS] | [1] | Cohesive predicate, tests updated; dead `thinkingFormat` placement branch and stale comments remain (F003). |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 5 active
- **Delta this iteration:** +0 P0, +1 P1, +5 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Tracing the *consumers* rather than only the edited regions: reading `selectAdapterForModel` / `notifyCacheCompatIfNeeded` (`index.ts:4053-4111`) is what surfaced F001; the diff alone cannot show it. (iteration 1)
- Reading the installed runtime (`pi-ai/dist/api/openai-completions.js` `detectCompat`, `core/provider-composer.js` `mergeCompat`) to test the change's premises against the code that actually consumes the compat keys — this both confirmed the gate's shape is right and ruled out three suspected under-reports. (iteration 1)
- Deriving the removed implementation from `review/change-under-review.diff` and evaluating each new test against it, which is the only way to test REQ-006's "fails pre-patch" claim. (iteration 1)
- Independent corroboration of the vision probe (OCR plus region colour analysis of the committed PNG) instead of trusting the probe narrative. (iteration 1)

---

## 9. WHAT FAILED

- Grepping for a second automatic notification surface on the assumption there might be a periodic compat check: there is none, so the only path is `model_select` — useful negative evidence but it cost a pass. (iteration 1)
- An initial read of `decideFixPlacement`'s `thinkingFormat` branch as a live write path: it is unreachable for that key, which downgraded the concern from a possible REQ-002 violation to a maintainability finding. (iteration 1)

---

## 10. EXHAUSTED APPROACHES (do not retry)

### Wire-format write path -- BLOCKED (iteration 1, 3 attempts)
- What was tried: literal grep across `index.ts`; end-to-end trace of `buildFixSuggestion` -> `composeFixInsertion`; inspection of the 403 auto-fix path and the `mayRepairThisCompat` self-check exemption.
- Why blocked: no path can put `thinkingFormat` into `compatKeys`; the literal survives only as a type declaration, the gate comparison and stale comments/branch.
- Do NOT retry: looking for a live `thinkingFormat` writer; REQ-002 is satisfied.

### Gate under-reporting on non-completions APIs -- BLOCKED (iteration 1, 2 attempts)
- What was tried: grepping the installed `pi-ai` api modules for the two compat keys; reading `detectCompat` and its merge order.
- Why blocked: only `openai-completions` consumes them, and the runtime auto-detects genuine DeepSeek endpoints from provider id or `deepseek.com` base URL.
- Do NOT retry: framing the `isOpenAICompatibleProxyApi` narrowing as a regression.

### Image-probe ground truth -- PRODUCTIVE (iteration 1)
- What worked: OCR and region colour analysis of the committed PNG corroborate the fixture and the model's answer.
- Prefer for: any future claim that rests on a generated-but-not-scripted fixture.

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: correctness, security, traceability, maintainability (single breadth pass at the cap)
- Pivot lineage: none yet
- Remaining frontier: chat-surface advisory coverage for DeepSeek-named channels (F001); reverification items deferred by the cap (strict validator run, request-side affinity re-probe, security-sensitive stabilization second pass)
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- `thinkingFormat` still written by `/cache-optimizer fix`: ruled out (iteration 1; evidence: `index.ts:260,2989,6962` literal grep, `tests:1651-1662`, `index.ts:8619-8621`).
- Under-report for opted-in `openai-responses` channels: ruled out (iteration 1; evidence: `pi-ai/dist/api/openai-completions.js:681,1337-1339`).
- Breakage of channels that genuinely need DeepSeek replay: ruled out (iteration 1; evidence: `detectCompat` at `openai-completions.js:1250,1287-1288` with `model.compat.X ?? detected.X` merge at `1324-1339`).
- Unsupportable image declaration: ruled out (iteration 1; evidence: `scratch/vision-probe.png` OCR + colour analysis, `scratch/live-image-probe.json` answer match).
- Inert provider-level affinity compat: ruled out (iteration 1; evidence: `core/provider-composer.js:5-20,76,105`).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration cap reached (`maxIterations: 1`); no further iteration is scheduled for this lineage. The next agent should work the remediation lanes in `review-report.md` in this order: (1) F001 — give the DeepSeek adapter a generic fallback so the affinity advisory survives on the chat surface; (2) F004 — re-probe the affinity headers with request-side evidence and commit the probe command; (3) F006/F002 — reconcile the packet's completion and regression-coverage claims; (4) F003 — remove the stale wire-format doctrine; (5) F005 — trim committed probe metadata. Two verifications remain outside this lineage's authority: `validate.sh --strict` on the packet and a second stabilization pass under the security-sensitive override (the change touches env precedence and the compat schema boundary).
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.pi/extensions/pi-cache-optimizer/index.ts` (predicates at 1487-1526, 2681-2758, 2918-3110; adapter chain 3085-3110 + 4053-4111; diagnosis 5310-5400, 5631-5718; fix 5895-5930, 6890-6990, 7010-7130, 7285-7325), `tests/review-findings.test.ts` (1110-1203, 1530-1698), `.pi/models.json` `providers.llmgateway`.
- **Claimed behaviour to verify**: REQ-001 opt-in gate; REQ-002 no manufactured `thinkingFormat` on any of three surfaces; REQ-003 explicit-`false` affinity opt-out; REQ-004 provider affinity declaration with a live 200; REQ-005 image declaration with a live image-reading answer; REQ-006 discriminating regression tests; REQ-007 green `npm run check`; REQ-008 strict validator + metadata.
- **Reuse and conventions**: the generic proxy advisory path (`describeMissingOpenAICompatibleProxyCompat`) defines the opt-out semantics; `getCompat` documents the provider+model merge contract that `provider-composer.js` implements; `PROVIDER_LEVEL_SAFE_COMPAT_KEYS` defines which keys may be written provider-wide.
- **Review risks and gaps**: no `resource-map.md` in the packet (coverage gate skipped); the two live probes are non-reproducible (no scripts committed); `review/README.md` records that the previous dispatch was denied by the operator's own dispatch gate, so the probe evidence predates this session and could not be re-run here.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | REQ-001/2/3/5 resolve to shipped behaviour; REQ-004 contradicted by nothing but under-evidenced (F004). |
| `checklist_evidence` | core | partial | 1 | Plan DoD unchecked while the packet reports Complete (F006); REQ-006 partly overstated (F002). |
| `skill_agent` | overlay | notApplicable | 1 | Spec-folder target, no skill package in scope. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definition in scope. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No catalog claims reference this surface. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook scenario in scope. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | D1, D2, D3, D4 | 1 | 0 P0, 1 P1, 1 P2 | complete |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | D1, D3 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `.pi/models.json` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `spec.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `plan.md` | D3, D4 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `tasks.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `implementation-summary.md` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `scratch/live-affinity-probe.*` | D3, D2 | 1 | 0 P0, 0 P1, 2 P2 | complete |
| `scratch/live-image-probe.*` | D3, D2 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `scratch/verify-no-warning.*` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `scratch/check-run.txt` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `scratch/vision-probe.png` | D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `review/brief.md`, `review/change-under-review.diff` | D1, D3 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1 (config `maxIterations`, `stopPolicy: max-iterations`)
- Convergence threshold: 0.10 (telemetry only; cap governs termination)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1 (security-sensitive override not satisfied by this cap-limited run)
- Session lineage: sessionId=fanout-deepseek-v41-flash-1789146937931-6gxjep, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking (state: in-progress)
- Per-iteration budget: 12 tool calls, 10 minutes (breadth over depth; exceeded by the offline read-only pass, recorded as telemetry)
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-09-11T17:21:00Z
- Executor: cli-pi, model deepseek-v4.1-flash, reasoningEffort max
- Write surface: this lineage directory only (read-only review; no source or packet file was modified)
<!-- MACHINE-OWNED: END -->
