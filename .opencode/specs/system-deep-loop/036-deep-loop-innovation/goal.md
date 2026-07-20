# GOAL — system-deep-loop Recommendations Implementation (packet 036)

> **One-line goal:** implement the 178 research recommendations into the shipped `system-deep-loop`
> runtime by building ONE cross-mode spine — a typed append-only event ledger guarded by a fail-closed
> transition-authorization gateway — landed additive/dark, proven at shadow parity, cut over one mode at a
> time behind a rollback window, with legacy writers retired only after zero-use telemetry.

| Field | Value |
|-------|-------|
| **Packet** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation` (phase parent, Level 3) |
| **Status** | Planning COMPLETE · Execution NOT STARTED (0 implementation-summaries in phases 003-017) |
| **Scope** | 17 phases: 001-002 research inputs (frozen), 003-017 implementation, 018 drift census (done) |
| **Size** | 121 implementation spec docs; the 013 fan-out alone is 8 modes × 7 leaves = 56 leaves (~54% of tasks) |
| **Validation** | 125/125 folders `validate.sh --strict` clean (errors=0 warnings=0) as of this handover |
| **Branch** | `skilled/v4.0.0.0` (shared, concurrent sessions active) |
| **Executor policy** | Primary `cli-codex` GPT-5.6-SOL `xhigh` `fast`; fallback `cli-opencode` `openai/gpt-5.6-sol-fast --variant xhigh`. Operator has authorized MAX parallelization. |

---

## 1. The objective

The shipped runtime solves its hard problems ad-hoc. The 178 recs (8 from 065/001 + 59 + 111 from 065/002)
converge on a **single architecture**, not 178 tweaks. Build that substrate ONCE, then give each of the eight
mode workstreams a typed schema over it.

**The spine (six primitives):**
1. Versioned typed **event envelope** + append-only **ledger**
2. Fail-closed **transition-authorization gateway** (co-lands with the first writer; no typed event is written without passing the gate)
3. **Sealed / frozen reference artifacts** (evaluator capsule, authority capsule, sealed canary, independence batch)
4. Versioned **replay fingerprints** (deterministic replay contract)
5. **Receipts / certificates** (per side-effect; effect-recovery gateway)
6. **Blinded / counterfactual adjudication** service

**The migration model (no big-bang):** additive-dark substrate → compatibility adapters + shadow parity →
staged per-mode authority cutover behind a rollback window → legacy-writer retirement after zero-use telemetry.

---

## 2. The six real problems (verified against shipped code) — the value fence

| # | Problem | Verdict vs shipped runtime | Owning phase |
|---|---------|----------------------------|--------------|
| 1 | Termination is a raw `newInfoRatio` | **Partial** — `convergence.cjs` already ships a multi-signal evaluator for 3/8 modes; gap is coverage | 011 |
| 2 | State JSONL has no replay-compat contract | **True** — no `schemaVersion` in `atomic-state.ts` | 006 |
| 3 | Side-effects have no receipts | **Partial** — `receipt-crypto.ts` ships HMAC, same-process only | 007 |
| 4 | Budgets not centrally enforced | **True** — only council-scoped `cost-guards.cjs` | 007 |
| 5 | Gauges recompute | **True but low-stakes** — full scans over ~12-row streams | 007 / 010 |
| 6 | Council counts seats, not independence | **True** — `multi-seat-dispatch.cjs` operates on `seats.length` | 013/003, 007/003 |

**Strategic note (from two independent analyses this session):** the 17-phase program is ~2–3× larger than
these six problems strictly justify, and 013 is 54% of it. This does **not** block execution, but the
**highest-leverage first move is to run phase 004/002 (the 178-row bijective ledger + triage) standalone,
FIRST, with real authority to defer/reject** — expect the 178 to fall well below 100 and 013 to shrink once
012's cross-mode closures hoist shared logic. Fund a spine-first slice; re-decide 013's full extent after 012.

---

## 3. Phase map & wave order (the execution DAG)

```
003 baseline/taxonomy/state census   (pin BASE against current HEAD)
      │
004 architecture ADR + 178-row bijective ledger + transition contract   ← run 004/002 triage FIRST
      ├───────────────┐
005 fanout            006 ledger core + auth gateway (DARK)
live-tools unblock         │
(dispatch-only,       007 shared evidence/control services (7 leaves, mostly parallel)
 parallel to 006/007)      │
      │               008 compatibility + shadow parity + rollback bridge
      └──────────────► 009 durable fan-out/fan-in
                           │
                       010 novelty / claims / continuity / projections
                           │
                       011 convergence / termination / health
                           │
                       012 shared mode contracts + WRITE-SET CONFLICT GRAPH  ← parallel-safety authority for 013
                           │
                       013 per-mode migrations ×8 (56 leaves; the long pole)
                           │
                       014 staged state migration + authority cutover (per mode)
                           │
                       015 legacy-writer retirement (zero-use gated)
                           │
                       016 whole-system gate (frozen SHA)
                           │
                       017 integrate-latest + rerun gate + closeout
```

**Critical path:** `003 → 004 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015 → 016 → 017`.
005 is off the critical path (parallel to 006/007). 013 is the longest pole.

---

## 4. Success criteria (all must hold on the final SHA)

1. **Bijective coverage** — all 178 recs carry a stable ID and exactly one disposition (phase / `deferred` / `eliminated`), no "unknown"; a validator proves the single-disposition property (phase 004/002).
2. **No behavioral regression** — the packet-033 behavior benchmarks (now at `z_archive/027` + `shared/behavior-benchmark/`, extended in 003) show no regression vs pinned BASE, by scenario ID + semantics not count.
3. **Additive-dark held** — the ledger is never authoritative before its mode's cutover; shadow parity green before any authority flip.
4. **Staged cutover + rollback proven** — each mode's flip carries a cutover certificate; a rollback drill restores legacy within the declared window.
5. **Legacy retired safely** — old writers removed only after zero-use telemetry; every historical packet still reads through a retained archival reader.
6. **Spine integrity** — every typed event passes the gate; replays deterministic under the fingerprint; receipts for every side-effect; raw pre-reduction scores retained.
7. **Per-mode value** — each of the 8 modes emits its sealed artifact/certificate and passes its independent mode gate.
8. **Whole-system green** — `validate.sh --strict --recursive` errors 0; all build/test/typecheck + mixed-version replay + crash-injection + degeneration tests pass; 016 gate reran after integrate-latest.

---

## 5. Sequencing invariants (load-bearing — from the SOL ultra design review)

1. BASE + taxonomy + the 178-row rec set are frozen (003-004) before any architecture or implementation work.
2. The transition-authority + event-compat contract is frozen (004) before any typed writer; the gateway co-lands with the first writer (006).
3. The substrate stays additive, dark, non-authoritative until adapters + shadow parity + rollback pass (008).
4. Stable identities + durable fan-in (009) precede novelty/claims (010); both precede convergence activation (011).
5. Shared mode contracts + the write-set conflict graph (012) land before the per-mode fan-out (013).
6. deep-improvement-common (013/004) precedes agent-improvement / model-benchmark / skill-benchmark (013/005-007).
7. Per-mode gates prove shadow parity ONLY; authority changes solely in the cutover phase (014).
8. Legacy writers retire (015) only after state classification, rollback rehearsal, mixed-version replay, cutover certs.
9. Every implementation phase strict-validates independently and produces a blocking SOL verifier receipt bound to its commit.
10. The whole-system gate (016) runs on a frozen SHA and reruns after integrate-latest (017), reopening phases on drift.

---

## 6. Known couplings & constraints

- **020 router-unification coupling** (recorded in `003/spec.md` §6 + `018/research/research.md` §9): a fleet-wide router refactor already landed 3 commits on this hub (`908efde8d8f`, `6cd8ab14e4e`, `708d25acf04`) — BASE captures them as **pre-existing**, not 036 deltas; registered-mode count is unchanged at 7. 020's compiled-router **live-activation** (its phase-010, default-off `SPECKIT_COMPILED_ROUTING`) is a named external drift dependency for 017. Do not interleave it with 036's 013/014 cutover unannounced. 036 only **parses** the registry, never writes it — no write-write race.
- **BASE has moved** — 247 commits landed since the plan's 2026-07-16 reference point; 003 pins BASE against **current HEAD**, and downstream phases treat all intervening routing/kebab changes as pre-existing baseline.
- **Shared-branch reality** — concurrent sessions actively edit and occasionally **reset the working tree**. Land every commit via `commit-tree`/`merge-tree` plumbing on origin's tip, path-scoped to `036/`; never rely on the working tree surviving; never blanket-`pkill` codex/opencode (shared OAuth).

---

## 7. What is already done (this session, all on origin)

- **Phase 018 drift census** — two-model deep-research (`gpt-5.6-sol-fast` + `glm-5.2`) over all 15 impl phases: 0 invalidated, 003/012/013 need refinement, both controls passed.
- **~400 cross-phase reference repairs** — `065→036`, the 214 `phase-006`/`phase-007` service misattributions, 107 leaf-index+3 self-descriptions, kebab runtime paths, the ledger phase-ID space, the manifest packet identity — all adversarially audited, on origin.
- **020 coupling recorded** in 003 §6 + 018 §9.
- Validation: 125/125 folders strict-clean.

---

## 8. First moves for the execution agent

1. Read `handover.md` (this packet root) end to end — it has the dispatch commands, wave plan, and traps.
2. Pin an isolated worktree off origin's current tip; pin BASE in 003 against that SHA.
3. Run **004/002 (the 178-row bijective ledger + triage) FIRST**, standalone, with authority to defer/reject.
4. Then execute wave-by-wave per §3, dispatching parallel `cli-codex` SOL-xhigh-fast agents within each wave per 012's write-set conflict graph, each leaf verified by a blocking SOL receipt.
