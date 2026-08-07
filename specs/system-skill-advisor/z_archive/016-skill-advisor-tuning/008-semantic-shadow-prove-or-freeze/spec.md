---
title: "Feature Specification: Semantic Shadow Prove-or-Freeze"
description: "Confirm and lock the FREEZE of the semantic_shadow lane at weight 0.05 with a full 193-row paired ablation under real pinned embeddings, a fail-on-skip experiment-integrity guard, and a runtime degradation detector. No production scorer code or weight changed: every deliverable is an additive test/guard plus this decision record. The confirming ablation surfaced a marginal net-negative (149 vs 150 top-1 correct, delta +1 for the disabled arm) which strengthens the case against raising the weight and does not clear the bar to drop it."
trigger_phrases:
  - "semantic shadow freeze"
  - "semantic lane prove or freeze"
  - "semantic shadow ablation"
  - "semantic lane fail-on-skip"
  - "semantic shadow degradation detector"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze"
    last_updated_at: "2026-07-07T09:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Confirmed the semantic-shadow freeze on the full corpus"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Feature Specification: Semantic Shadow Prove-or-Freeze

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The `semantic_shadow` lane carries the smallest of the five live scorer weights (0.05). The mandate for this packet was to PROVE-or-FREEZE that weight on the full labeled corpus: either surface evidence that raising it earns net-correct routing, or lock the freeze honestly with a confirming ablation and guardrails. The verdict is **FREEZE** — keep the weight at 0.05, change no production scorer code.

The confirmation is a full 193-row paired ablation (full 5-lane vs `disabledLanes:['semantic_shadow']`) run under a **pinned** provider (`ollama__nomic-embed-text-v1.5__768`), with RRF fusion and the exact-semantic rerank both OFF so the two arms differ ONLY in the semantic lane. The measured result is deterministic across re-runs: **full 149/193 top-1 correct, semantic-disabled 150/193, delta +1 in favor of the disabled arm, 6 top-1 flips**. The lane, at its live weight and with real embeddings, is a **marginal net-negative** of one row (0.5% of the corpus): it helps 2 rows and hurts 3 (plus one neutral-wrong).

This does not change the FREEZE verdict; it hardens it. A net-negative is direct evidence AGAINST raising the weight, and a 0.5% swing measured under a seeded fixture-projection harness does not clear the bar to DROP the lane (dropping breaks the live-lane-count and weight-sum invariants and forces a full re-baseline of the 105/101/4 parity contract). The packet also adds a **fail-on-skip** experiment-integrity guard (a silently-degraded provider can never again masquerade as "semantic is irrelevant") and a **runtime degradation detector** over the lane's existing health struct.

**Key Decisions**: Keep the weight at 0.05, retaining the lane rather than dropping to 0 (structural invariants + parity-re-baseline cost outweigh a 0.5% seeded-harness delta); report the ablation exactly as measured rather than assume the plan's predicted delta-0; gate the heavy real-embedding ablation behind an opt-in env flag so default CI never depends on a local provider.

**Critical Dependencies**: the 193-row labeled corpus, the in-process seed harness that spies `loadSkillEmbeddings`, and a reachable pinned embedding provider for the opt-in confirming run.

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | ~350 (one additive vitest harness + this spec folder) |
| **Verdict** | FREEZE (weight 0.05 unchanged; no production code edit) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `semantic_shadow` lane weight (0.05) had never been confirmed on the full 193-row corpus with real embeddings. Prior evidence was strong-but-partial: a 46-prompt real-embedding sweep and a V0/V1 weight-ablation both showed zero routing change, and structural arguments (smallest weight, a 0.2 cosine floor, explicit-lane dominance) all pointed to a no-op. But the existing scorer gates run the lane under deterministic FIXTURE vectors (a 32-dim hash), never the daemon's real embedding path, so the live behavior of the lane on the full corpus was unmeasured. Worse, when the provider is unavailable the lane silently no-ops, and a silent no-op is indistinguishable from "semantic does not matter" — an experiment-integrity hole.

### Purpose
Run the mandated full-corpus paired ablation under a pinned real provider to confirm the freeze; convert the silent skip into a loud, opt-in failure so a missing provider can never be mistaken for a null result; and add a runtime detector so a degraded live lane surfaces as telemetry instead of a best-effort `console.warn`. Change no routing behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A full 193-row paired ablation (full 5-lane vs `disabledLanes:['semantic_shadow']`) under a pinned `providerModelId`, RRF off, exact-semantic rerank off, seeded and scored in-process.
- A fail-on-skip experiment-integrity guard: under an opt-in env flag the harness hard-fails on provider-unavailable, pinned-model mismatch, missing prompt/skill embeddings, or all-zero seeded semantic raw scores.
- A runtime degradation detector: a telemetry-read assertion over `getSemanticShadowRuntimeHealth().disabledReason`.
- This Level 2 spec folder recording the FREEZE decision and its evidence.

### Out of Scope
- Any change to the semantic lane weight, the fusion path, the lane implementation, the ablation engine, or the lane registry / weights config. These five files are frozen and stay git-clean.
- Any commit or push. The orchestrator owns the push to the shared branch.
- Adding the heavy ablation to default CI. It is opt-in behind the flag so machines without a local provider stay green.
- The routing-accuracy `README.md` and the concurrent WS5 fixtures/tests — held dirty by another session; not touched.
- Widening the vitest include glob to run the pre-existing `lib/**/__tests__` cosine test in the default suite (a pre-existing config condition, unrelated to this freeze).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/scorer/semantic-shadow-ablation.vitest.ts` | Create | Opt-in seeded 193-row paired ablation + non-zero-semantic guardrail + fail-on-skip + runtime degradation detector |
| `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/**` | Create | This Level 2 decision record (spec/plan/tasks/checklist/implementation-summary + metadata) |
| `.opencode/specs/system-skill-advisor/graph-metadata.json` | Modify | Append the 008 child to the parent `children_ids`; repoint `last_active_child_id` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No production scorer code or weight change | `fusion.ts`, `semantic-shadow.ts`, `ablation.ts`, `weights-config.ts`, `lane-registry.ts` all git-clean; weight stays 0.05 |
| REQ-002 | Full 193-row paired ablation under a pinned provider | Two arms differ only in the semantic lane; providerModelId pinned + asserted; RRF off, rerank off; counts + flip list recorded |
| REQ-003 | Freeze corroborated, not fabricated | The measured delta is reported exactly; a delta-0 result is never assumed. Freeze holds while the net correctness swing stays inside a negligible documented band |
| REQ-004 | Fail-on-skip experiment integrity | Under the opt-in flag the harness hard-fails on provider-absent, pin mismatch, missing embeddings, or all-zero seeded semantic scores; absent the flag it skip-guards on a machine without a provider |
| REQ-005 | Runtime degradation detector | A telemetry read over `getSemanticShadowRuntimeHealth()` surfaces a silent lane degradation (stale projection) instead of swallowing it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Existing scorer gates stay green | `semantic-lane-promotion`, `lane-weight-sweep`, `semantic-shadow-cosine`, and `python-ts-parity` (105/101/4) unchanged |
| REQ-007 | Determinism | The ablation reproduces the same counts + flips across re-runs; a persistent embedding cache backs the seed |
| REQ-008 | Comment hygiene in code | The new harness carries durable WHY only; no spec paths, ADR/REQ/CHK/task ids, or packet/phase numbers in code comments |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:decision -->
## 5. FREEZE DECISION & EVIDENCE

### 5.1 Verdict
**FREEZE.** Keep `semantic_shadow` at weight **0.05**. No change to `fusion.ts`, `semantic-shadow.ts`, `ablation.ts`, `weights-config.ts`, or `lane-registry.ts`.

### 5.2 The confirming 193-row paired ablation (measured, deterministic)

| Field | Value |
|-------|-------|
| Corpus | `scripts/routing-accuracy/labeled-prompts.jsonl` — 193 rows |
| Arms | full 5-lane vs `disabledLanes:['semantic_shadow']`, identical projection/thresholds |
| providerModelId (pinned + asserted) | `ollama__nomic-embed-text-v1.5__768` |
| RRF fusion flag | OFF (default) |
| exact-semantic rerank flag | OFF (default) — the rerank is a separate consumption site not gated by `disabledLanes`, so it is held off to keep the arms comparable |
| Full 5-lane top-1 correct | **149 / 193** |
| Semantic-disabled top-1 correct | **150 / 193** |
| Delta (disabled − full) | **+1** (the lane is net **−1** on correctness) |
| Top-1 flips | **6** |
| cacheHits / cacheMisses (skills) | 23 / 0 warm (11 / 12 cold on first seed) |
| varianceDetected across re-runs | none — identical counts + flips on repeat |

**The 6 flips** (`id: full → disabled`, gold): 2 where the lane HELPS (`rr-iter2-029`, `rr-iter3-117`: both `memory:save` correct with the lane, `system-spec-kit` wrong without it); 3 where the lane HURTS (`rr-iter3-087`, `rr-iter3-102`, `rr-iter3-142`: gold `none`, correct abstain without the lane, a `mcp-chrome-devtools` false-fire with it); 1 neutral-wrong (`rr-iter3-069`: gold `system-spec-kit`, `sk-code` with the lane vs `none` without — wrong either way).

### 5.3 Why this confirms FREEZE (and refutes raising)
- **Against raising**: the lane is net-negative at its live weight. Its only correctness losses are abstain false-fires (`none → mcp-chrome-devtools`); raising the weight would amplify exactly those false-fires, not the two `memory:save` gains. No weight in prior sweeps produced a net-correct flip; this full-corpus run produces a net-INCORRECT one.
- **Against dropping to 0**: the swing is 0.5% of the corpus, measured under a seeded fixture-projection harness that is not the production fixture-semantic gate regime. Dropping the lane breaks `metrics.liveLaneCount === 5`, `liveWeightTotal() ≈ 1`, and the weight-sum normalization, and forces a full re-baseline of the 105/101/4 parity contract — a large, deployed-contract cost for a sub-1% seeded delta. Retaining a low-weight semantic hedge is the smaller, reversible choice.
- **Consistent with the codified thesis**: the existing `semantic-shadow-cosine` test asserts the lane "keeps semantic matches from overturning an explicit top route." The three harmful flips are NOT overturned explicit routes — they occur on should-abstain rows where no strong explicit signal exists and the 0.05 contribution tips a near-threshold candidate over the abstain line. The thesis holds; the freeze is consistent with it.

### 5.4 Structural corroboration
- Semantic's maximum possible contribution is `1.0 × 0.05 = 0.05`, the smallest of five lanes, against `explicit_author` at 0.42.
- `COSINE_THRESHOLD = 0.2` already suppresses weak semantic matches to zero.
- The Python-reference parity harness scores with semantic disabled and still reaches 105/101/4, so the corpus is near-inert to semantic by construction.

### 5.5 Confirmation of no production change
The five scorer files are git-clean (`git status --porcelain` empty). Corpus routing is provably unchanged (weight unchanged → identical scores → identical top-1 for every row in production). Parity (105/101/4) is untouched by construction.
<!-- /ANCHOR:decision -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: The five production scorer files stay git-clean; the weight stays 0.05.
- **SC-002**: The opt-in ablation runs the full 193 rows under the pinned provider, RRF/rerank off, and records the exact counts + flip list (149 / 150 / +1 / 6).
- **SC-003**: The harness is green on the flag-off skip path (default) and the flag-on pinned path; it hard-fails under the flag on a provider/pin/embedding fault.
- **SC-004**: `semantic-lane-promotion`, `lane-weight-sweep`, `semantic-shadow-cosine`, and `python-ts-parity` (105/101/4) all stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fail-on-skip breaking default CI | A hard provider dependency in CI | Gated behind the opt-in flag; default CI skip-guards with no provider |
| Risk | Provider-model pin drift | Ablation compares the wrong model | Pinned + asserted; a mismatch is a loud failure under the flag, never a silent reseed |
| Risk | Daemon native-ABI / SIGBUS on DB access | Harness instability | `loadSkillEmbeddings` is spied in-process; no live daemon vector DB opened for scoring |
| Dependency | 193-row labeled corpus | The whole ablation rests on it | Read-only; row ids recorded in the flip list |
| Dependency | Reachable pinned provider | The opt-in confirming run | Skip-guarded when absent; the freeze also rests on structural corroboration |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Reproducibility
- **NFR-R01**: The ablation is deterministic — same counts and flips across re-runs; skill vectors are cache-backed and the pinned model is asserted.
- **NFR-R02**: A provider/model change surfaces as a pinned-mismatch failure under the flag, forcing a conscious re-measurement.

### Safety
- **NFR-S01**: No production scorer input is touched; the harness is read-only against the scorer and additive to the test tree.
- **NFR-S02**: The heavy real-embedding path never runs in default CI; it is opt-in.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Provider unavailable, flag off**: the ablation and guardrail tests skip; the always-on degradation detector still runs green.
- **Provider unavailable or pin mismatch, flag on**: the harness throws a named hard error — the experiment-integrity contract.
- **Gold label `none`**: a correct abstain (unknown / null top skill) is normalized to `none` identically in both arms, so the abstain false-fires are counted honestly.
- **A stale projection**: `scoreSemanticShadowLane` no-ops and stamps `disabledReason: 'projection_embedding_stale'`; the detector asserts the reason is surfaced, not swallowed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS

- Should the lane be dropped to 0 given the marginal net-negative? **RESOLVED: No — the 0.5% seeded-harness delta does not justify breaking the live-lane-count / weight-sum invariants and forcing a full 105/101/4 re-baseline; the low-weight hedge is the smaller, reversible choice.**
- Should the plan's predicted delta-0 be reported instead of the measured +1? **RESOLVED: No — the measured result is reported exactly; a fabricated delta-0 would defeat the entire experiment-integrity purpose of the packet.**
- Should the pre-existing `lib/**/__tests__` cosine test be wired into the default include glob? **RESOLVED: Deferred — a pre-existing config condition unrelated to the freeze; the test is confirmed green via an override and is untouched by this change.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Program umbrella**: `system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix`
- **Sibling**: `system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening`

<!-- /ANCHOR:related-docs -->
