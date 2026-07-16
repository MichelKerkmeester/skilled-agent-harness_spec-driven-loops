---
title: "Implementation Plan: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)"
description: "Approach and sequencing for the deep-loop continuity GO cluster: a per-iteration self-owned carried-forward open-questions block (no new model call) ships first as the durable thread, then the answer-as-next-query next-focus derivation reads it. Reuses the existing two continuity-injection paths and the already-built convergence stop. No dependency on the absent D2 reliability signal or the fan-out resilience cluster."
trigger_phrases:
  - "continuity threading plan"
  - "carried forward block sequencing"
  - "iterative retrieval next focus plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/006-continuity-threading"
    last_updated_at: "2026-06-19T10:30:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored implementation plan for the continuity-threading cluster"
    next_safe_action: "Run strict packet validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-006-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`reduce-state.cjs`) + TypeScript (`prompt-pack.ts`), deep-loop-workflows/runtime |
| **Continuity model** | EXACTLY two injection paths [CONFIRMED iter-6]: reducer `strategy.md` anchors (`reduce-state.cjs:734-745`) + prompt-pack `{var}` substitution (`prompt_pack_iteration.md.tmpl`) |
| **Convergence stop** | ALREADY built (`convergence.cjs:107` composite score, `:285` newInfoRatio agreement, `:368`), C2 reuses it, adds no new loop primitive |
| **Storage** | JSONL deltas + `strategy.md` / `findings-registry.json`, no DB schema, no new model call |
| **Testing** | deep-loop reducer / prompt-pack vitest, `node --check` on touched `.cjs` |

### Overview

This sub-phase implements the 028/004 **continuity GO cluster**, the continuity / iterative-retrieval pair, decoupled from both the reliability-scoring cluster (D2/D3/Q2, NO-GO until benchmarked) and the resilience cluster (`003-fanout-failure-recovery`). The work fixes that the iteration loop threads forward "reconstruct-cold" (no self-owned thread) and that its next focus is hand-written free-text rather than derived from what the iteration found.

The cluster has a clean two-step dependency: the self-owned carried-forward block is the durable thread the derived next-focus reads.

```
C1 Q5-carried-forward  (each iteration emits its OWN open-questions block;
        │               distinct from the machine-owned :629-650 fold; no new model call)
        │  feeds
        ▼
C2 DL-iterative-retrieval-loop  (resolveNextFocus :538 derives next focus from the prior answer;
                                 reuses the already-built convergence stop; reads C1's block)
```

All effort/leverage tags are **structural inference, never benchmarked** (per the 028 honesty layer). Ship for correctness and continuity quality, not a promised delta.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and each candidate's seam cited to research file:line
- [x] Scope frozen: the 2-candidate continuity cluster. D2/D3/Q2 and the resilience cluster explicitly out
- [x] Dependencies identified (C1→C2, the two injection paths + convergence stop already present)
- [x] Per-candidate status confirmed: both were pending at phase start and are DONE in this sub-phase.

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-C1/C2/C3) + REQ-C4/C5
- [x] Each candidate has scoped unit test evidence, no commit created per user directive
- [x] C2 verified to add NO new convergence/saturation primitive (consumes the existing stop)
- [x] `node --check` + deep-loop reducer/prompt-pack focused tests green
- [x] `validate.sh --strict` on this sub-phase passes
- [x] checklist.md items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive, surgical edits to the existing reducer + prompt-pack continuity spine. No new module and NO new continuity channel, both candidates ride the two confirmed injection paths. C1 emits a host-computed (not LLM) self-owned block. C2 rewrites the `resolveNextFocus` return to a derived focus while preserving the blocked-stop precedence and the terminal sentinel.

### Key Components (existing seams)

- **`reduce-state.cjs`**, `resolveNextFocus` (`:519-541`): the blocked-stop precedence branch (`:520-535`) followed by the hand-written next-focus return (`:538` = `iterationFiles.map(i => i.nextFocus).filter(Boolean).at(-1)`), falling back to `registry.openQuestions[0]?.text` (`:539`) then the terminal sentinel (`:540`). The iteration `nextFocus` is parsed from the "Recommended Next Focus" markdown section (`:193`, stored `:206`). The machine-owned `openQuestions` fold of unresolved STRATEGY questions is built at `:629-650`. The 7 strategy-anchor writes (continuity path 1) are `:734-745`.
- **`prompt_pack_iteration.md.tmpl`**, the continuity variables (path 2): `{state_summary}` (`:9`), `{next_focus}` (`:13`), `{remaining_questions_list}` (`:14`), `{state_paths_*}` (`:21-26`).
- **`prompt-pack.ts`**, `renderPromptPack` (`:55-73`): a checked `{var}` substituter that throws `PromptPackError` on a missing token, stateless and iteration-blind. Any new C1 variable must be supplied by the reducer to preserve this contract.
- **`convergence.cjs`**, `computeCompositeScore` (`:107`), newInfoRatio-agreement gate (`:285`), STOP path (`:368`): the already-built stop C2 reuses.

### Data Flow (target)

1. **C1**: at reduce time, the reducer computes a per-iteration SELF-owned carried-forward open-questions block from the existing iteration records (host-computed, no LLM), de-duplicated against the machine-owned `:629-650` fold and threaded via a reducer-owned strategy anchor plus an additive prompt-pack variable.
2. **C2**: `resolveNextFocus` (`:538`) derives the next focus from the prior iteration's answer/findings (reading C1's block where present) instead of returning the hand-written free-text. The blocked-stop branch (`:520-535`) still takes precedence. The terminal sentinel (`:540`) still fires when all questions are resolved. The existing convergence stop bounds the loop.
3. The next iteration reads the threaded block + derived focus through the unchanged prompt-pack / strategy-read path. No third channel, no new model call, no schema change.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Carried-forward thread (the durable thread), C1
- [x] Read `reduce-state.cjs:519-541` (`resolveNextFocus`), `:629-650` (machine-owned `openQuestions` fold), `:734-745` (strategy anchors) and `prompt_pack_iteration.md.tmpl:9-26` + `prompt-pack.ts:55-73`
- [x] Decide the carrier (strategy anchor + prompt-pack variable, no delta-record field) per the §3 seam-confirmation note, record the decision
- [x] Emit a per-iteration SELF-owned carried-forward open-questions block, host-computed from existing iteration records (NO new model call), de-duplicated against the `:629-650` fold
- [x] If a new prompt-pack variable is used, the reducer supplies it (preserve the stateless-renderer throw-on-missing contract)
- [x] Unit test: block emitted, distinguishable from the machine-owned fold, no double-listing, idempotent on re-reduce

### Phase 2: Answer-as-next-query next-focus, C2
- [x] Rewrite `resolveNextFocus`'s hand-written return (`:538`) to DERIVE the next focus from the prior iteration's answer/findings, reading C1's block where present
- [x] Preserve the blocked-stop precedence branch (`:520-535`) ahead of the derived focus (REQ-C4)
- [x] Preserve the terminal sentinel (`:540`) and the iteration-1 / empty-findings fallback to the strategy-question focus (no regression)
- [x] Verify NO new convergence/saturation primitive is added, the existing `convergence.cjs` stop is the only loop bound (SC-002)
- [x] Unit tests: derived focus from a prior answer, iteration-1 fallback, blocked-stop precedence, all-resolved sentinel, idempotent re-reduce

### Phase 3: Verification
- [x] `node --check` on every touched `.cjs`
- [x] deep-loop reducer/prompt-pack focused test suite green (capture baseline first per regression-baseline rule)
- [x] Confirm continuity is still exactly two injection paths (no third channel), grep for any new inject/append seam (REQ-C3)
- [x] `validate.sh --strict` on this sub-phase

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | carried-forward block emission + de-dup vs machine-owned fold, derived next-focus from prior answer, blocked-stop precedence, iteration-1 fallback, idempotent re-reduce | deep-loop reducer / prompt-pack vitest |
| Syntax | every touched `.cjs` parses | `node --check` |
| Regression | full reducer suite green vs captured baseline, iteration-1 and all-resolved paths behave as today | existing suite |
| Channel-integrity | no new continuity-injection channel introduced (still exactly two paths) | grep `inject|continuity|anchor|append` over the diff + `prompt-pack` callers |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The two continuity-injection paths (reducer anchors + prompt-pack vars) | Internal (present) | Green | C1/C2 ride them. CONFIRMED iter-6 F6-02, no new plumbing |
| The already-built convergence stop (`convergence.cjs:107,285,368`) | Internal (present) | Green | C2 is bounded because of it. Confirmed present |
| The machine-owned `openQuestions` fold (`reduce-state.cjs:629-650`) | Internal (present) | Green | C1 de-dups against it. Confirmed present |
| D2 reliability signal | None | N/A | Continuity cluster is independent, no block |
| Fan-out resilience cluster (`003-003`) | None | N/A | Decoupled sibling, no block |
| 001 content-derived ordering helper | Internal (unread inference) | To confirm | Tie-break for any ordering in C1's block. Confirm the call site before implementing a tie-break (roadmap remaining item) |

### Shared-infra note
DL-iterative-retrieval-loop **cross-fits** Memory's `CG-iterative-context-extension` (answer-as-next-query recall with a convergence stop, `06-memory-systems-findings.md:39-43`): both turn an answer into the next query and stop on convergence. The DEEP-LOOP advantage is that the convergence stop is ALREADY built here (`convergence.cjs`), whereas the Memory candidate must build the saturation primitive net-new. This sub-phase does NOT build a shared module (the seams differ) but the answer-as-next-query + existing-stop discipline is the common contract. C1's threaded-reflection model is galadriel's (`README.md:536-538`) adapted to a deterministic host-computed fold (no silent LLM turn).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the carried-forward block double-lists machine-owned questions or breaks idempotency, or the derived next-focus regresses iteration 1, drops the blocked-stop precedence or loops past the convergence stop.
- **Procedure**: revert the scoped file changes for the offending candidate. C1 (the block) and C2 (the derivation) remain logically separable, reverting C2 restores the hand-written `resolveNextFocus` return, reverting C1 removes the self-owned block and prompt variable. No data migration to reverse (strategy/JSONL files only, no schema change). No commit was created in this implementation run per user directive.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (C1 carried-forward thread) ──> Phase 2 (C2 derive next-focus, reads C1) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 (C1) | None (rides existing injection paths) | 2 |
| 2 (C2) | 1 (reads the carried-forward block) | 3 |
| 3 (Verify) | 1, 2 | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Research lev/eff tag | Note |
|-----------|----------------------|------|
| C1 Q5-carried-forward | LOW-MED / S | host-computed self-owned block, no new model call, reuses the JSONL/strategy spine |
| C2 DL-iterative-retrieval-loop | H / M | net-new derivation in `resolveNextFocus`, bounded because the convergence stop is already built, the stacking tail (`cot-validate`/`query-decomposition`/`question-type-router`) is OUT OF SCOPE |

> Effort tags are structural inference. The cluster is Level 2 (100-499 LOC band) but each candidate is independently small. Risk on C2 (preserving iteration-1 fallback + blocked-stop precedence + not adding a loop primitive) is the reason for the channel-integrity + idempotency gates, not LOC.

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline captured: current deep-loop reducer/prompt-pack test counts (regression-baseline rule)
- [x] Branch-only, nothing pushed/deployed without explicit user go
- [x] Each candidate has scoped evidence, no commit created per user directive
- [x] Carrier decision (C1) recorded before coding

### Rollback Procedure
1. Identify the offending candidate's file changes
2. Revert the scoped changes, C2 reverts to the hand-written `resolveNextFocus` return, C1 reverts the self-owned block, they revert independently
3. Re-run `node --check` + the reducer/prompt-pack suite to confirm baseline restored
4. No data migration to reverse (strategy/JSONL files + config only, no schema change)

<!-- /ANCHOR:enhanced-rollback -->
