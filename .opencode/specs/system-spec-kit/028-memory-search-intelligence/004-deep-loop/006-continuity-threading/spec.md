---
title: "Feature Specification: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)"
description: "Implement the deep-loop continuity GO cluster from packet 028's Deep Loop + memory-systems research: a per-iteration self-owned carried-forward open-questions block (galadriel's threaded-reflection model, no new model call) and a derived next-focus that uses the prior iteration's answer as the next query with the already-built convergence stop. Decoupled from the reliability scoring (D2/D3/Q2) and the resilience (fan-out recovery) clusters. Continuity confirmed to be exactly two injection paths (reducer anchors + prompt-pack variables), so this is a bounded unit."
trigger_phrases:
  - "deep loop continuity threading"
  - "carried forward open questions"
  - "iterative retrieval loop"
  - "derive next focus from answer"
  - "threaded ambient reflection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/006-continuity-threading"
    last_updated_at: "2026-06-19T10:30:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented continuity threading"
    next_safe_action: "Run strict validation and close out"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/06-memory-systems-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-006-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Deep Loop Continuity Threading (028/004 continuity / iterative-retrieval cluster)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `028-memory-search-intelligence/004-deep-loop` (Deep Loop — convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md` (Q5); `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM); `../../research/synthesis/06-memory-systems-findings.md` (#15) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-research iteration cycle is itself a retrieval loop, but it threads forward in the "reactive, reconstruct-cold" mode — each iteration rebuilds its working set from the reducer's distilled snapshot rather than carrying its own prior thread, and the "next focus" it pursues is whatever free-text the previous iteration hand-wrote, not a function of what that iteration actually found. Two confirmed continuity gaps remain after the 030 Wave-0 pass:

1. **No self-owned carried-forward thread.** Cross-iteration continuity is carried ONLY by the reducer folding findings into `strategy.md` anchors that the next iteration re-reads cold [CONFIRMED iter-2 `f-continuity-reducer-only`: the only callers of `renderPromptPack` are the module + its vitest]. The reducer DOES thread unresolved *strategy key-questions* forward as a machine-owned fold (`reduce-state.cjs:629-650` `openQuestions`, derived from the strategy question list), but an iteration does NOT cheaply thread its OWN raw open-questions/findings as a self-curated reflection. galadriel's threaded ambient reflection — "reflection that reads its own recent diary + open-questions and *threads* across ticks rather than starting fresh each time" (`galadriel/README.md:536-538`) — is the cheaper model the deep loop lacks. [CONFIRMED iter-2 F12-15; the existing machine-owned-only state CONFIRMED at `reduce-state.cjs:629-650`.]
2. **Next-focus is hand-written free-text, not derived from the answer.** `resolveNextFocus` (`reduce-state.cjs:519-541`) returns the last iteration's hand-written "Recommended Next Focus" markdown section (parsed at `:193`, stored at `:206`, returned at `:538`), falling back to `registry.openQuestions[0]` then a terminal sentinel. It is NEVER computed from the prior iteration's *answer* (answer-as-next-query). Cognee's iterative "answer-as-next-query" recall transfers directly because the deep-loop iteration cycle is a retrieval loop, and the **convergence stop it would need is already built** (`convergence.cjs:107` `computeCompositeScore`, `:285` newInfoRatio-agreement gate, `:368`) — so the change is bounded. [CONFIRMED: `reduce-state.cjs:538` seam; `06-memory-systems-findings.md:129-133`; convergence-stop present.]

### Purpose

Land the deep-loop **continuity GO cluster** — the continuity / iterative-retrieval pair, decoupled from the reliability-scoring cluster (D2/D3/Q2) and the resilience cluster (fan-out recovery) — as small, independently reversible, tested changes that reuse the existing JSONL/strategy spine with **no new model call** for Q5 and a **bounded** change for DL-iterative (the convergence stop already exists). The cluster's spine: **Q5-carried-forward** writes a per-iteration self-owned open-questions block (the durable thread); **DL-iterative-retrieval-loop** then derives the next focus from the prior answer instead of free-text, reading the threaded block where available.

### Critical context (from the 028 research, authoritative)

- **Continuity-injection paths are EXACTLY two — CONFIRMED, so this is a bounded unit.** (1) the reducer writes 7 `strategy.md` anchor sections via `replaceAnchorSection` (`reduce-state.cjs:734-745`); (2) the prompt-pack injects via `renderPromptPack` (`prompt-pack.ts:55`) substituting `{state_summary}` / `{next_focus}` / `{remaining_questions_list}` + `{state_paths_*}` path pointers (`prompt_pack_iteration.md.tmpl:9-26`). The executor's strategy-file read is DRIVEN BY a prompt-pack path variable → subsumed under prompt-pack, not a third channel. No env / appended-context seam exists. [CONFIRMED iter-6 F6-02; the roadmap's "not exhaustively traced" open item is CLOSED.]
- **NEITHER candidate shipped in 030.** The 030 Wave-0 §14 covers 13 candidates; the Deep-Loop entry (candidate 12, commit `46812f12a8`) shipped merge total-order + pool gauges + graceful-self-stop only, and `Q5-carried-forward` / `DL-iterative-retrieval-loop` appear nowhere in §14 or the 030 spec body. Both candidates were pending at phase start and are implemented in this sub-phase. [CONFIRMED: grep of `030/spec.md` §14 + body = zero continuity/iterative-retrieval/next-focus matches.]
- **`prompt-pack.ts` is stateless and iteration-blind.** It is a checked `{var}` substituter that throws `PromptPackError` on any missing token (`prompt-pack.ts:55-73`); ZERO iteration/finding/open-question awareness. Threading happens at the reducer + the variables map a caller passes, not in the pack. [CONFIRMED iter-2 `f-promptpack-stateless`.]
- **The reducer ALREADY threads strategy key-questions (machine-owned).** `reduce-state.cjs:629-650` builds an `openQuestions` list of UNRESOLVED strategy questions; this is the machine-owned fold. Q5's carried-forward block is a SELF-owned, per-iteration block DISTINCT from this fold (it threads the iteration's own raw open-questions, not just the strategy question list). Q5 must not duplicate or collide with the existing fold. [CONFIRMED iter-9: "carried-forward open-questions already threaded via findings-registry openQuestions (`reduce-state.cjs:629-650`)" — the partial state Q5 layers on top of.]
- **No candidate has a measured before/after benefit number** — all leverage/effort tags are structural inference. Ship for correctness and continuity quality, not a promised delta. [CONFIRMED: roadmap honesty layer; `06-memory-systems-findings.md` "no benefit number is measured anywhere; all lev/eff are structural inference."]
- **DL-iterative-retrieval has a stacking tail (OUT OF SCOPE here).** `cot-validate`, `query-decomposition`, and `question-type-router` patterns stack on the SAME `key-questions` / `focusTrack` machinery behind this one candidate. This sub-phase ships ONLY the answer-as-next-query next-focus derivation; the stack is a later decision. [CONFIRMED `06-memory-systems-findings.md:133` Catch.]

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the continuity GO cluster (2 candidates)

| # | Candidate | One-line | Seam (file:line) | Lev/Eff | Status |
|---|-----------|----------|------------------|---------|--------|
| C1 | **Q5-carried-forward** | each iteration emits a lightweight SELF-owned "open-questions carried forward" block (distinct from the reducer's machine-owned `openQuestions` fold at `:629-650`) so the next iteration threads its OWN raw thread; reuses the existing JSONL/strategy spine; NO new model call | runtime helper `continuity-thread.cjs`; reducer fold (`reduce-state.cjs`); injection via strategy anchor + prompt-pack variable only | LOW-MED / S | DONE |
| C2 | **DL-iterative-retrieval-loop** | make `resolveNextFocus` derive the next focus from the prior iteration's ANSWER (answer-as-next-query) instead of returning the hand-written "Recommended Next Focus" free-text; the convergence stop is ALREADY built so the change is bounded; reads C1's carried-forward block where present | `resolveNextFocus` calls runtime helper; stop remains `convergence.cjs:107,285,368` | H / M | DONE |

> Build order (dependency-driven): **C1 → C2** — Q5's self-owned carried-forward block is the durable thread DL-iterative reads when deriving next-focus; ship the thread first, then the derivation that consumes it. See `plan.md`.

### Out of Scope (documented, NOT built this sub-phase)

- **Reliability-weighted scoring (D2 / D3 / Q2)** — NO-GO until built AND benchmarked; D2 is a wholly-absent net-new build (every input `r=0.5`). Lives in a sibling impl sub-phase of `004-deep-loop`, not here. This continuity cluster has ZERO dependency on it. [CONFIRMED iter-13.]
- **Fan-out failure recovery / resilience cluster** (failure-class taxonomy, transient/fatal retry, orphan-lineage reset, recover-vs-fresh gate) — that is the sibling `003-fanout-failure-recovery` sub-phase, decoupled from continuity. [CONFIRMED: separate cluster.]
- **The DL-iterative stacking tail** — `cot-validate`, `query-decomposition`, `question-type-router` patterns on the same `key-questions`/`focusTrack` machinery. A later decision; only answer-as-next-query next-focus ships here. [CONFIRMED `06-memory-systems-findings.md:133`.]
- **Galadriel's other Deep-Loop residue** — resume-once token, preserve-before-trim, graceful-self-stop (the last already shipped in 030). Those are RESILIENCE primitives, not continuity threading. [CONFIRMED iter-9.]
- **A new continuity-injection channel.** Continuity is exactly two paths (reducer anchors + prompt-pack vars); both candidates ride the existing spine. NO third channel is introduced. [CONFIRMED iter-6 F6-02.]
- Modifying the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Candidate(s) |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify (`resolveNextFocus` `:519-541`; carried-forward read/merge alongside the `:629-650` fold) | C1, C2 |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Possibly extend (a carried-forward variable / instruction for the self-owned block) | C1 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/continuity-thread.cjs` | Add runtime helper for carried-forward block construction and answer-derived focus | C1, C2 |
| `.opencode/commands/deep/assets/deep_research_{auto,confirm}.yaml` | Extend prompt variable map for carried-forward block | C1 |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Add initialized carried-forward strategy anchor | C1 |
| Tests alongside each change (deep-loop reducer / prompt-pack test suite) | Create/Modify | all |

> **Carrier decision:** C1 uses a new reducer-owned `strategy.md` anchor (`carried-forward-open-questions`) plus an additive `carried_forward_open_questions` prompt-pack variable. No delta-record field and no third injection path were added.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C1 | Per-iteration self-owned carried-forward open-questions block | Each iteration emits a lightweight block of its OWN open questions carried forward, distinct from the reducer's machine-owned `openQuestions` fold (`reduce-state.cjs:629-650`). The block reuses the existing JSONL/strategy spine and requires NO new model call. It does NOT duplicate or collide with the machine-owned fold (no double-listing of the same strategy question). [research: iter-2 F12-15, `f-continuity-reducer-only`; seam `prompt-pack.ts:55-73`] |
| REQ-C2 | Next-focus derived from the prior answer (answer-as-next-query) | `resolveNextFocus` (`reduce-state.cjs:538`) derives the next focus from the prior iteration's answer/findings rather than returning the hand-written "Recommended Next Focus" free-text. The change is bounded: it reuses the ALREADY-built convergence stop (`convergence.cjs:107,285,368`) and adds NO new convergence/saturation algorithm. [research: `06-memory-systems-findings.md:129-133`; seam `reduce-state.cjs:519-541`] |
| REQ-C3 | Continuity stays on the two confirmed injection paths | No third continuity-injection channel is introduced; both candidates inject only via the reducer's `strategy.md` anchors (`reduce-state.cjs:734-745`) and/or the prompt-pack variables map (`prompt_pack_iteration.md.tmpl`). [research: iter-6 F6-02] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C4 | Blocked-stop precedence preserved | The existing blocked-stop precedence in `resolveNextFocus` (`reduce-state.cjs:520-535`: a fresh BLOCKED stop overrides the iteration next-focus) is preserved by the C2 derivation — a blocked stop still takes precedence over the derived focus. |
| REQ-C5 | Idempotent reduce | A second reduce over the same state produces the same carried-forward block and the same derived next-focus (determinism spine reuse — reproducible folding). [research: roadmap determinism spine; iter-6 idempotent-2nd-reduce check.] |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each candidate is independently reversible and unit-tested (C1 thread emission; C2 next-focus derivation).
- **SC-002**: C2 introduces NO new convergence/saturation primitive — it consumes the existing `convergence.cjs` stop; verified by the absence of any new threshold/loop algorithm in the diff.
- **SC-003**: C1's carried-forward block does not duplicate the machine-owned `openQuestions` fold (`reduce-state.cjs:629-650`); the two are distinguishable in the output.
- **SC-004**: Continuity remains exactly two injection paths (no third channel); the blocked-stop precedence is preserved.
- **SC-005**: `node --check` on the touched `.cjs`, the deep-loop reducer/prompt-pack focused tests, and `validate.sh --strict` on this sub-phase all pass.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | C1's self-owned block double-lists questions already in the machine-owned `openQuestions` fold | Noisy / contradictory continuity | REQ-C1 distinguishability test; de-dup the self-owned block against the `:629-650` fold key |
| Risk | C2's answer-as-next-query loops unboundedly | Runaway iterations | C2 reuses the EXISTING convergence stop (`convergence.cjs:107,285,368`); adds NO new loop primitive (SC-002) — the stop already caps the loop |
| Risk | C2 drops the blocked-stop precedence | A blocked stop is ignored, loop proceeds into a blocker | REQ-C4 preserves the `:520-535` blocked-stop branch ahead of the derived focus |
| Risk | A new continuity carrier becomes a third injection channel | Breaks the bounded two-path model | REQ-C3 restricts injection to reducer anchors + prompt-pack vars; seam-confirmation note picks one of those carriers |
| Risk | Non-idempotent reduce (derived focus changes on re-reduce) | Resume non-determinism | REQ-C5 idempotent-2nd-reduce test; reuse the 001 content-derived ordering for any tie-break |
| Dependency | The two confirmed continuity-injection paths | C1/C2 both ride them | CONFIRMED present (iter-6 F6-02); no new plumbing |
| Dependency | The already-built convergence stop | C2 is bounded because of it | CONFIRMED present (`convergence.cjs:107,285,368`) |
| Dependency | D2 reliability signal | NONE — explicitly independent | Cluster is continuity-only; no reliability input |
| Dependency | Fan-out resilience cluster (`003-003`) | NONE — decoupled | Separate sibling sub-phase |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No new model call — C1 reuses the existing JSONL/strategy spine; the carried-forward block is host-computed from existing iteration records, not a fresh LLM turn (galadriel's side-effect-only model adapted to a deterministic fold).
- **NFR-R02**: Bounded loop — C2 consumes the existing convergence stop; a misderived focus cannot loop forever because the stop is unchanged.

### Compatibility
- **NFR-C01**: `prompt-pack.ts` stays a checked `{var}` substituter (throws on missing token); any new variable is additive and supplied by the reducer, preserving the stateless renderer contract.
- **NFR-C02**: No schema migration; the carried-forward block and derived focus reuse the existing strategy/JSONL files. The machine-owned `openQuestions` fold (`:629-650`) is unchanged.

### Determinism
- **NFR-D01**: Idempotent reduce — re-reducing the same state yields the same carried-forward block and the same derived next-focus; any tie-break reuses the 001 content-derived ordering (reproducible folding), not insertion order or timestamp.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **All strategy questions resolved**: the carried-forward block is empty; `resolveNextFocus` still returns the existing terminal sentinel (`[All tracked questions are resolved]`, `:540`) rather than a fabricated derived focus.
- **First iteration (no prior answer)**: C2 has no prior answer to derive from — it must fall back to the strategy-driven focus exactly as today (no regression on iteration 1).
- **Fresh blocked stop newer than the last iteration**: C2 must keep the blocked-stop branch (`:525-535`) ahead of the derived focus (REQ-C4).
- **Self-owned block overlaps the machine-owned fold**: a question present in BOTH the iteration's self-owned block and the reducer's `openQuestions` fold (`:629-650`) must appear once, not twice (de-dup; SC-003).
- **Re-reduce after interruption**: the carried-forward block and derived focus must be identical to the pre-interruption reduce (idempotency, REQ-C5).
- **Empty/no findings in the prior iteration**: C2's answer-as-next-query has nothing to derive from → fall back to the strategy-question focus, not an empty or null focus.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Reducer, prompt-pack variable surface and focused tests |
| Risk | 12/25 | Continuity channel discipline, blocked-stop precedence and idempotent reduce |
| Research | 10/20 | Two-path continuity model confirmed in research |
| Coordination | 6/15 | Q5 feeds C2, no external runtime dependency |
| **Total** | **38/85** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **RESOLVED:** C1's carrier is a reducer-owned strategy anchor plus an additive prompt-pack variable. This stays within the two confirmed injection paths and avoids a delta-record schema change.
- **RESOLVED:** C2 replaces the hand-written "Recommended Next Focus" return with derive-first behavior: carried-forward question, then latest finding, then strategy-question fallback, then the terminal sentinel.
- **RESOLVED:** Same-iteration carried-forward question ordering uses a content-derived SHA-256 key after iteration number ordering. No timestamp or insertion-order tie-break is used.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Parent research**: `../research/research.md` (Q5 — cross-iteration continuity); detail in `../research/iterations/iteration-002.md` (Q5 answered), `iteration-006.md` (two-path continuity confirmed), `iteration-009.md` (machine-owned fold overlap) + `../research/deltas/iter-002.jsonl`, `iter-006.jsonl`.
- **Cross-cutting roadmap**: `../../research/roadmap.md` (MEMORY-SYSTEMS ADDENDUM — `DL-iterative-retrieval-loop` #6 of top-7; galadriel threaded-reflection note); `../../research/synthesis/06-memory-systems-findings.md` (#15 derive next-focus; #3 CG-iterative-context-extension cross-fit).
- **Shipped record (Wave-0)**: Wave-0 record — neither candidate present (Deep-Loop entry is, commit `46812f12a8`, merge/gauges/graceful-self-stop only).

<!-- /ANCHOR:related-docs -->
