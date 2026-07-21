---
title: "Implementation Summary: Value-of-Computation Allocation"
description: "Replay-stable VOC assessment, greedy and proportional allocation, typed admission, rank-only fan-in handoff, and additive-dark ledger evidence."
trigger_phrases:
  - "value of computation allocation implementation"
  - "voc allocation shadow evidence"
  - "rank-only fan-in usefulness"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-21T12:46:24Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark VOC allocation leaf"
    next_safe_action: "Retain uniform/static allocation authority until a later cutover packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/voc-allocation/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/voc-allocation.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Value-of-Computation Allocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-value-of-computation-allocation |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Baseline** | `012652b479dee08455de574574c5e7a8971a8b0b` |
| **Branch** | `system-deep-loop/0091-036-execution` |
| **Status** | Complete |
| **Authority** | Additive-DARK; uniform/static allocation and shipped conditional-fan-in defaults remain authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The new `voc-allocation` library assesses one explicit marginal quantum from durable evidence, typed budget state,
confidence, and calibration metadata. It computes coverage, contradiction, blocker, and uncertainty benefit without
using verbosity or output counts. Token, cost, attempt, and monotonic-time pressure remain independent basis-point
ratios, and the greatest same-dimension ratio governs the score.

Greedy and proportional policies allocate deterministic integer quanta. Both enforce candidate, mode, and region
ceilings. A bounded exploration reserve, minimum service, capped aging, and maximum skips can reorder only already
positive and eligible candidates. The executor sends each selected aggregate through the shipped
`HierarchicalBudgetAuthority.admit` boundary and records the complete grant or denial.

The fan-in adapter writes copied `OutstandingBranchAtCut.usefulnessRank` values and an exact rank-only
`ValueOfComputationPolicy`. It does not call or alter the fan-in finalizer. The decision event losslessly retains the
complete shadow decision through a versioned fixed-Huffman canonical JSON codec, then commits through the existing
transition authorization gateway and append-only ledger.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/voc-allocation/types.ts` | Created | Versioned candidate, benefit, confidence, pressure, policy, admission, handoff, shadow, and decision types |
| `runtime/lib/voc-allocation/policy.ts` | Created | Closed policy validation and canonical policy digest |
| `runtime/lib/voc-allocation/assessment.ts` | Created | Replay-stable benefit, typed pressure, confidence, eligibility, fairness, and score derivation |
| `runtime/lib/voc-allocation/allocation.ts` | Created | Deterministic greedy and largest-remainder proportional allocation with live share caps |
| `runtime/lib/voc-allocation/decision.ts` | Created | Atomic authority admission, semantic denial status, shadow comparison, and decision digest |
| `runtime/lib/voc-allocation/fan-in-handoff.ts` | Created | Rank-only usefulness population for future eligible outstanding branches |
| `runtime/lib/voc-allocation/events.ts` | Created | Lossless authorized ledger event, validation, decoding, and idempotent append |
| `runtime/lib/voc-allocation/index.ts` | Created | Public additive module surface |
| `runtime/tests/unit/voc-allocation.vitest.ts` | Created | Fourteen scoring, fairness, admission, replay, fan-in, proxy, concurrency, and ledger fixtures |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated/Created | Completion state and durable verifier evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation is isolated in one new runtime module and one focused test file. Frozen conditional-fan-in,
hierarchical-budget, event-envelope, ledger, and replay code remains unchanged. The leaf composes those public APIs,
keeps every adaptive result shadow-only, and records the uniform/static baseline beside each comparison.

The implementation and verifier evidence bind to these source contracts:

- Typed budget admission:
  `.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md`
- Conditional fan-in extension and frozen decision:
  `.opencode/specs/system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin/spec.md`
- Run-2 allocation research:
  `.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`
- Program ordering manifest:
  `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`
<!-- /ANCHOR:how-delivered -->

---

## Load-Bearing Invariant Evidence

| Invariant | Implementation proof | Executed fixture |
|-----------|----------------------|------------------|
| Extension point, not admission bypass | `populateVocUsefulnessRanks` only copies ranks; `executeVocAllocationShadow` separately requires a real `HierarchicalBudgetAuthority` and calls `admit` | Granted and denied admissions retain `shadowDispatchAuthorized: false`; final-remainder race admits one reservation |
| Frozen fan-in immutability | The new module never imports a fan-in mutation path; handoff creates branch copies | A finalized fan-in decision retains identical reducer input digest, decision digest, and canonical JSON after favorable VOC evidence |
| No cross-unit arithmetic | Each pressure ratio divides one estimate by the same dimension's authorized remainder; `Math.max` selects the governing ratio | Typed-pressure fixture records 1000 token, 5000 cost, 2000 attempt, and 2000 time basis points with cost governing |
| Deterministic replay | Integer and `BigInt` math, canonical digests, stable IDs, stable tie-breaks, and durable trigger sequences exclude wall-clock arrival | Reordered candidate and branch inputs reproduce identical assessments, order, quanta, and decision digest |
| Denial is not convergence | Denied authority results map to incomplete budget-exhausted or admission-denied status; every VOC decision fixes `converged: false` | Over-budget request leaves the reservation map unchanged and records budget exhausted |
| Fairness cannot manufacture value | Exploration and minimum service filter on `eligible` and positive adjusted score before applying bounded service | Valueless, stale, unhealthy, fan-in-ineligible, and invalid-identity fixtures receive no allocation |
| Anti-Goodhart benefit | Raw novelty, output, duplicate, and correlated counts are diagnostics only | A million proxy counts with zero evidence value loses to one concise unit of weighted coverage |
| Additive-dark authority | Decision and comparison fix authority to shadow, authoritative path to uniform-static, and authority movement to false | Lossless ledger round-trip preserves those fields and the shipped fan-in default remains `kind: 'none'` |
<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use integer fixed-point scoring | Replay does not depend on floating-point rounding or process order |
| Let the maximum typed pressure govern | Unlike token, money, attempts, and time never enter one arithmetic sum |
| Reserve aggregate candidate quanta atomically | One authority call either reserves every dimension and ancestor or leaves no candidate reservation |
| Recompute live capacity inside proportional passes | Candidates sharing a mode or region cannot consume the same stale share allowance |
| Carry proxy counters without scoring them | Audit evidence can expose Goodhart pressure without rewarding it |
| Encode complete decisions losslessly in ledger payloads | Full evidence survives while the authorized preflight stays below its byte-array node ceiling |
| Keep `shadowDispatchAuthorized` false even after admission | A valid reservation proves feasibility but this leaf never gains dispatch authority |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, 1 file and 14 tests |
| Runtime TypeScript | PASS with repository-pinned TypeScript 5.9, exit 0 |
| Alignment drift | PASS for 8 library files and 82 unit-test files, 0 findings |
| Comment hygiene | PASS, no ephemeral requirement or packet labels in code comments |
| Packet validation | PASS required before handoff, strict validator exit 0 with zero errors |
| Task mutation audit | PASS required before handoff; no task edit targeted conditional-fanin, hierarchical-budgets, or substrate paths |

The focused suite covers equal-pressure benefit ordering, typed maximum pressure, diminishing-return redirection,
bounded cold-start service, stale and unhealthy exclusions, anti-proxy behavior, deterministic greedy and proportional
replay, shared-mode ceiling redistribution, atomic budget denial, final-remainder concurrency, rank-only fan-in handoff,
frozen decision immutability, every durable reallocation trigger, complete replay identity, and lossless idempotent
ledger append.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only authority.** The feature records feasibility and comparison evidence, but it cannot dispatch work or replace uniform/static allocation.
2. **Reducer-owned input trust.** Evidence and budget snapshots must come from the named durable reducers. Atomic authority admission remains the decisive capacity check.
3. **Bounded event payloads.** The lossless codec rejects malformed, non-canonical, oversized, or undecodable decision evidence before authorization.
4. **No fan-in retroactivity.** A rank signal affects only a future fan-in view. Finalized decisions remain immutable by design.
5. **Pre-existing worktree state.** Repository-wide status includes an untracked `conditional-fanin/` dependency directory that predates this task. Task-scoped status contains only the VOC module, its test, and this leaf's docs; tracked frozen-path diff is empty.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
