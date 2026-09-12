---
title: Deep Review Strategy — glm-53-flash lineage
description: Review-progress state for the detached fan-out lineage glm-53-flash against specs/hooks/021-compat-opt-in-and-image-declaration (commit 80576ef8aa / landed 8d897d2a83).
trigger_phrases:
  - "deep review strategy glm-53-flash"
  - "compat opt-in review state"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy — lineage glm-53-flash

Single-pass lineage note: `stopPolicy=max-iterations` with `maxIterations=1` means initialization and the iteration-001 update of this file collapse into one write; iteration 001 is the only iteration the cap allows. Coverage below therefore reflects the post-iteration-001 state, which is final for this lineage.

## 2. TOPIC

Adversarial review of commit 80576ef8aa "fix(pi-cache-optimizer): require a declared wire format before giving DeepSeek compat advice" — the change gating DeepSeek-specific compat advice on an explicit `compat.thinkingFormat: "deepseek"` opt-in, moving session affinity to the generic proxy path, and declaring `sendSessionAffinityHeaders` plus `input: ["text","image"]` for the llmgateway channel. Per the review brief in `review/brief.md`: find what is wrong, unsupported or overclaimed; distinguish verified / inferred / unknown; the reviewer is read-only.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

Dimension queue (risk-ordered): correctness → security → traceability → maintainability. Iteration 001 is the inventory pass plus the correctness deep pass; traceability and maintainability checks were exercised incidentally inside it (finding dimensions record this), but the dimensions are not signed off as covered. Security was only lightly touched (credential-exposure scans of the probe evidence), so D2 remains the first uncovered dimension. The iteration cap (1) stops the queue there.

## 4. NON-GOALS

- Not implementing fixes: the loop is observation-only; remediation is a follow-up `/speckit:plan`.
- Not editing the reviewed files: `.pi/extensions/pi-cache-optimizer/`, `.pi/models.json` and the packet docs are read-only for this lineage.
- Not running repo-wide tooling from inside the lineage: `generate-context.js`, `validate.sh` (and its `--recursive`), the reducer/upsert/convergence scripts, and any git write are outside this lineage's permitted write surface; REQ-008's `validate.sh --strict` claim therefore stays unverified here and is recorded as an explicit unknown.
- Not reviewing the working-tree noise outside the change (the other modified `.opencode/`/`.pi/` files in `git status`); only the reviewed commit's files plus the packet's own evidence.

## 5. STOP CONDITIONS

- Hard stop: `iteration_count >= maxIterations` (1) — `stopReason=maxIterationsReached` (fired, see the state log).
- Stop policy `max-iterations`: convergence before the cap is telemetry only; it did not, and could not, stop the loop early.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | 1 P1 (passive affinity warning lost on opted-in channels) + 1 P2 behavior change (responses gating); REQ-001..007 evidence-verified |

<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 4 active
- **Delta this iteration:** +0 P0, +1 P1, +4 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Producer→consumer tracing of the affinity warning: `describeMissingOpenAICompatibleProxyCompat` → `describeMissingCacheCompatForModel` → the warningText/doctor/fix surfaces, then `CACHE_PROVIDER_ADAPTERS` ordering (`selectAdapterForModel` takes the FIRST `matchesModel`) → `notifyCacheCompatIfNeeded`. That trace located the P1 (the DeepSeek adapter's warningText recomputes `missing` from the DeepSeek-only list, so affinity-missingness never reaches the passive notification) and stays the highest-yield approach for any follow-up notification-coverage review (iteration 1).

## 9. WHAT FAILED

- Nothing failed outright. Two avenues returned no findings and are recorded as ruled out, not failed: leftover `thinkingFormat` references in repair/placement code (grep: only the interface at line 260 and the applicability gate at 2989), and vacuous new tests (the 1122/1169/1651 expectations demonstrably fail against the pre-change behavior).

## 10. EXHAUSTED APPROACHES (do not retry)

### Affinity-notification surfaces — PRODUCTIVE (iteration 1)
- What worked: enumerating every `warningText` implementation and every `notifyCacheCompatIfNeeded`/`selectAdapterForModel` caller before concluding the notification silence.
- Prefer for: any follow-up on the D2/D4 dimensions that touches the same notification path.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: D2 Security, D3 Traceability, D4 Maintainability — uncovered because the iteration cap (1) was reached, not because they converged
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

- Provider-placement safety rules special-casing `thinkingFormat`: ruled out — the only occurrences of `thinkingFormat` in `index.ts` are the interface field (line 260) and the applicability gate (2989); no repair, placement, or safety code references it (iteration 1, evidence: `grep -n thinkingFormat index.ts`).
- Vacuous-assertion regression in the new tests: ruled out — `tests/review-findings.test.ts:1122` (name-alone → `['sendSessionAffinityHeaders']`), `:1169` (explicit `false` → `[]`) and the fix-command expectation `:1651-1662` (`resolveExplicitCompatValue(...,'thinkingFormat')` → `undefined`) all fail against the pre-change behavior; `:1138`/`:1151` are regression guards that also pass pre-change, noted as such rather than counted as change-proving (iteration 1).

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Ceiling reached — no next iteration. If the loop were extended: (1) D2 Security as the first uncovered dimension, then (2) a dedicated traceability pass closing REQ-008 (run `validate.sh <folder> --strict` — permitted only outside this lineage's write surface) and regenerating the continuity fingerprint (registry finding F4). Otherwise the report's remediation workstreams carry the actionable items.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.pi/extensions/pi-cache-optimizer/index.ts` (changed regions: `describeMissingDeepSeekCompat` ~2960, `isDeepSeekWireCompatApplicable` 2987, `isDeepSeekCompatCheckApplicable` 2993, `describeMissingCacheCompatForModel` 2997, `buildDeepSeekCompatSuggestion` 3006, `appendDeepSeekCompatAdviceLines` 3029, DeepSeek adapter `warningText` 3097, `selectAdapterForModel` 4053, `notifyCacheCompatIfNeeded` 4102, doctor 5350); `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` (DeepSeek classification 1110-1203, fix command 1590-1698); `.pi/models.json` (llmgateway provider 44, provider compat 50, model `input` 57).
- Behavior claims to verify: the review brief's CLAIM-1..7 (`review/brief.md`); spec REQ-001..008 with their acceptance criteria; implementation-summary's verification table and known limitations.
- Reuse/conventions: the existing adapter pattern (one `warningText` per family, first-match adapter selection), the composed-missing-list contract of `describeMissingCacheCompatForModel`, the precedence ladder in `resolveExplicitCompatValue` (modelOverride → model → provider).
- Risks/gaps: the passive notification surface vs the composed command surfaces can drift (they read different lists — that gap produced F1); the probes prove endpoint acceptance, not in-session pi behavior; the continuity fingerprint is a zero placeholder; the cited commit hash differs from the landed one.

### Continuity ladder result (context loading)

`handover.md` absent; `_memory.continuity` present in `implementation-summary.md` (packet complete, completion_pct 100, no blockers); canonical docs read: `spec.md`, `implementation-summary.md`. Prior-context summary: the packet claims 114/114 checks, live-probe-verified declarations, and a clean `validate.sh --strict` after metadata regeneration; the review/README records that no prior review ran (the dispatch gate had blocked both earlier attempts), so this lineage's findings are the first review evidence. `resource-map.md` not present; skipping coverage gate.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | REQ-001..007 verified against code/tests/config with file:line evidence; REQ-008 (validate.sh --strict) not executable inside the lineage's write surface — recorded as an explicit unknown, not silently passed |
| `checklist_evidence` | core | notApplicable | 1 | Level 1 packet, no `checklist.md`; the AC_COVERAGE advisory signal evaluates to `exempt` |
| `skill_agent` | overlay | notApplicable | 1 | no skill/agent surface in the change |
| `agent_cross_runtime` | overlay | notApplicable | 1 | no agent definitions touched |
| `feature_catalog_code` | overlay | notApplicable | 1 | no feature-catalog claims in scope |
| `playbook_capability` | overlay | notApplicable | 1 | no playbook preconditions in scope |

<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .pi/extensions/pi-cache-optimizer/index.ts | D1 (+D3/D4 incidentally) | 1 | 0 P0, 1 P1, 2 P2 | partial (single pass) |
| .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| .pi/models.json | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| specs/hooks/021-compat-opt-in-and-image-declaration/ (packet docs + scratch evidence) | D3, D4 | 1 | 0 P0, 0 P1, 2 P2 | partial |

<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-glm-53-flash-1789146937931-6gxjep, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-09-11T17:45:26Z (lineage effect recorded 17:16:25Z by the fan-out dispatcher)
<!-- MACHINE-OWNED: END -->
