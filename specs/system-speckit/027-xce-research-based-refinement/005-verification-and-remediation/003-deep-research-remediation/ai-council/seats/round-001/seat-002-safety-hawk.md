---
round: 1
seat: seat-002
executor: inline-sequentialthinking
lens: "Correctness / Safety-hawk (temp 0.2)"
status: ok
timestamp: "2026-06-13T00:00:00Z"
simulated: true
---
# Seat 002 — Correctness / Safety-hawk

## Distinct mandate
Protect hard invariants (prompt-safety, daemon-lifecycle, DB integrity). Refuse any action that could reintroduce a historical failure class. Demand verify-first + adversarial post-verify. Risk focus: a "cheap honesty patch" that silently changes semantics; a launcher edit that re-triggers the 3x DB corruption; a replay design that leaks raw prompts.

## Proposed plan (challenges + guardrails)
1. tri-007/008/009 honesty patch is SAFE only if bounded to additive/doc: (a) shadow-evaluation-runtime emits a typed `skipped: no-replay-pool` cycle result instead of silent `[]`; (b) catalog marks weekly-replay inert-pending-design; (c) tri-008 rewrites the self-skipping runtime tests. Do NOT touch consumption_log schema — `query_text` is permanently banned (consumption-logger-privacy.vitest.ts asserts its absence). The actual replay POOL is design-first and ESCALATES to operator: "what corpus is allowed when query_text is banned?" Bounded consented raw retention is AUTO-REJECTED unless non-reversible.
2. tri-148 launcher front-proxy: HARD-BLOCK from DO-NOW / near-term code. code-index/advisor launchers EXIT on child SIGTERM; DB corrupted 3x from dual writers; packet 140 already did delicate lease/adoption work here. Porting createSessionProxy to the owner path is high-blast-radius. DEFER-BY-DESIGN, lean ESCALATE: code-index is a rebuildable index, so owner-flap-survival ROI is low vs blast radius. Cheap honest alternative = DOCUMENT the asymmetry (fix_sketch option 2) as a DO-NOW doc patch.
3. tri-105 vec SSOT is STORAGE-semantics, code-careful, design-first (recorded 7771-vs-3808 divergence). Natural SSOT = vec_<dim> authoritative BLOB, vec_memories rebuildable vec0 index. Hand-implemented, not fenced.
4. ELEVATE tri-010: memory_health reports green while vector_search drops rows (verify_integrity counts only vec_memories, read path uses vec_<dim>). That is a truth-violation in a health surface — more urgent than its P2 label. Fix is small (resolve getActiveVectorSourceForQuery inside verify_integrity) -> DESIGN-FIRST-FAST, hand-implemented + adversarial verify.

## Reasoning
The hard constraints exist because each maps to a real prior incident. The pragmatist's velocity is fine for docs and additive counters, but storage/launcher/privacy edits must clear verify-first + adversarial post-verify; "cheap" is not a license to mutate deletion/health/schema semantics.

## Risks & trade-offs
Trading throughput for invariant safety. Accept that some honest fixes (skipped-cycle emit) ship now while their full feature waits on operator decisions.

## Assumptions and evidence gaps
Assumes the operator must own the replay-corpus choice (correct — agent cannot pick raw retention under the auto-reject gate).

## Alternative challenged
Rejected "port the front-proxy now for parity" — parity is not a goal when one side is a rebuildable index and the change is high-blast-radius; document the asymmetry instead.

## Confidence
90: High on invariant protection, escalation calls, and the tri-010/tri-011 severity-vs-label catch.
