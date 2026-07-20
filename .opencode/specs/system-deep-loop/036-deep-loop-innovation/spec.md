---
title: "Feature Specification: system-deep-loop recommendations implementation (evidence-ledger runtime + per-mode migration)"
description: "Implement the 178 research recommendations from packets 065/001 + 065/002 into the shipped system-deep-loop runtime and its per-mode workstreams. The research established that all 178 recs converge on ONE architecture — an append-only typed event ledger guarded by a fail-closed transition-authorization gateway, with sealed/frozen reference artifacts, versioned replay fingerprints, receipts/certificates, and blinded/counterfactual adjudication — and that the correct program builds the shared substrate ONCE, then gives each mode its own typed schema over it. The load-bearing constraint (from a GPT-5.6-sol ultra design review): the runtime holds in-flight state and cannot be swapped big-bang, so the new substrate lands ADDITIVE + DARK + non-authoritative behind compatibility adapters and shadow-parity, authority cuts over one mode at a time behind a rollback window, and legacy writers retire only after zero-use telemetry. Phase parent for a 17-phase program (001-017): the two research inputs first (001 market research, 002 effectiveness + fan-out); then baseline + taxonomy + state census; the architecture/transition/coverage contract; the early backward-compatible fan-out live-tools unblock; the transition-authorized ledger core; shared evidence/control services; the compatibility + shadow + rollback bridge; durable fan-out/fan-in; novelty/claims/continuity projections; convergence/termination/health; shared mode contracts; the eight per-mode migrations; staged state-migration + authority cutover; legacy-writer retirement; the whole-system gate; and integrate-latest + closeout."
trigger_phrases:
  - "deep-loop recommendations implementation"
  - "implement the 178 deep-loop recs"
  - "evidence-ledger runtime for system-deep-loop"
  - "per-mode migration deep-loop"
  - "transition-authorized ledger core"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation"
    last_updated_at: "2026-07-15T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Flattened impl program to packet root; renumbered phases to 003-017"
    next_safe_action: "Author phase-003 baseline-taxonomy-and-state-census doc set on a pinned BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Placement = the implementation program is the 065 packet itself; research packets 001-002 stay pure inputs and are phases 001-002; implementation is phases 003-017"
      - "Scope = comprehensive; all 178 recs (8 + 59 + 111) map bijectively to exactly one phase or an explicit deferral"
      - "Architecture = the single cross-mode spine: typed event ledger + transition-authorization + sealed artifacts + replay fingerprints + receipts + blinded adjudication"
      - "Migration model = additive-dark substrate -> shadow parity -> staged per-mode authority cutover -> legacy retirement (no big-bang swap)"
      - "GPT-5.6-sol (ultra) design review returned REQUESTED_CHANGES; this decomposition folds in every P0/P1"
      - "Fan-out split: the backward-compatible live-tools unblock ships early (005); durable fan-in integrates later (009)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; mechanics live in each child's plan.md, the architecture + rec-ledger decisions in 004's children (`001-spine-architecture-adr/plan.md`, `002-recommendation-ledger-bijective-map/`). -->

# Feature Specification: system-deep-loop Recommendations Implementation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation |
| **Level** | phase parent (Level 3) |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (owns the runtime subsystems, the five deep modes + benchmark variants, and the externalized-state contract) |
| **Origin** | Operator: "do that [017-depth multi-phase planning] for our deep-loop innovation multi-phases spec … all the recs from the initial 45 iterations and all those after as well, the 40 after … collaborate with GPT 5.6 SOL ULTRA on how to properly plan and spec this" |
| **Inputs** | 065/001 (8 ranked recs R1-R8), 065/002 run-1 (59 runtime recs + fan-out finding), 065/002 run-2 (111 per-mode recs). Machine-readable: the three `findings-registry*.json`. |
| **Review** | GPT-5.6-sol (ultra) design review returned **REQUESTED_CHANGES**; this decomposition folds in every P0/P1. See `004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/plan.md`. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 065 established, across 105 research iterations, that the shipped `system-deep-loop` runtime solves its hard
problems ad-hoc: termination is a raw `newInfoRatio`, state is an append-only JSONL with no replay-compatibility
contract, side-effects have no receipts, budgets are not centrally enforced, gauges recompute, and the council counts
seats rather than measuring independence. The **178 recommendations converge on a single architecture** — a typed,
append-only event ledger guarded by a **fail-closed transition-authorization gateway**, with **sealed/frozen reference
artifacts** (evaluator capsule, authority capsule, sealed canary, independence batch), **versioned replay
fingerprints**, **receipts/certificates**, and **blinded/counterfactual adjudication**. The recommended program is not
178 tweaks: it is to build that substrate **once** and give each of the eight mode workstreams a typed schema over it.

The load-bearing complication (surfaced by the SOL ultra review): the runtime is **live and holds in-flight state** —
existing packets are mid-run on the current JSONL shape, and the modes share backends (the three benchmark variants
share deep-improvement's packet and scoring backend; alignment shares the review loop). The new substrate therefore
**cannot be swapped big-bang** — doing so would leave the running system internally inconsistent between commits.
Additionally, the current research registries carry **no stable recommendation IDs or normalized targets**, so the
promised bijective 178-row map cannot be validated until IDs are minted and frozen.

### Purpose
Land the one-architecture spine as an **additive, dark, non-authoritative** layer behind compatibility adapters; prove
**shadow parity** against the legacy behavior before any authority moves; cut authority over **one mode at a time**
behind a **rollback window**; retire legacy writers only after **zero-use telemetry**; and migrate every one of the
eight mode workstreams onto its typed ledger schema + sealed artifact — **without regressing** the packet-033 behavior
benchmarks, mode gates, replay determinism, or budget/receipt integrity, and with **every one of the 178
recommendations assigned to exactly one phase or explicitly deferred**.

### Non-Goals
- **Re-running the research.** 065/001 + 065/002 are complete; this packet consumes their outputs, it does not extend them.
- **The `ai-system-improvement` mode.** Deliberately excluded from run-2 by the operator; not implemented here.
- **New capabilities beyond the 178 recs.** No speculative features; the bijective ledger is the scope fence.
- **A big-bang rewrite.** Every change is additive-then-cutover; the legacy path stays authoritative until its replacement proves parity.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The shared spine substrate**: a versioned typed event envelope + append-only ledger; a fail-closed
  transition-authorization gateway; replay-compatibility fingerprints; receipts + a side-effect/effect-recovery gateway;
  the sealed/frozen reference-artifact mechanism; hierarchical typed budgets; incremental stream-fold gauges with
  immutable records; locks/fencing; continuity identities; and a **blinded/counterfactual adjudication service**.
- **The migration lifecycle**: upcasters + dual-read/single-write adapters + legacy projections; a shadow-parity harness;
  in-flight-state classification (upcast / pin / fork / migrate / block); rollback drills; staged per-mode authority
  cutover with cutover certificates; and gated legacy-writer retirement.
- **The runtime subsystem rec clusters**: convergence/termination, fan-out/fan-in (durable orchestration + the early
  live-tools unblock), dedup-novelty + continuity, gauges-observability, budget-cost, locks-recovery,
  state-jsonl-checkpointing — every rec from runs A/B that targets a runtime subsystem.
- **The eight mode migrations**: deep-research, deep-review, deep-ai-council, deep-improvement (+ its agent-improvement,
  model-benchmark, skill-benchmark variants), deep-alignment — each mode's full run-C behavior (planning, evaluation,
  validity, rollout, certificates), not merely a schema, ending in an independent mode gate.
- **The whole-system gate + integration**: exact-SHA baselines, mixed-version replay, crash-injection, degeneration +
  counterfactual tests, and a recursive strict-validate, rerun after integrate-latest.

### Out of Scope (deliberate)
- **Research artifacts** under 001/ and 002/ — read-only inputs; never rewritten (append-only supersession of their "open" items only).
- **The `ai-system-improvement` mode** and any non-`system-deep-loop` skill.
- **Recommendations rated low-impact and deferred by the phase-004 triage** — carried in the ledger as `deferred` with a reason, not silently dropped.
- **Model/executor selection policy** beyond wiring the fan-out capability matrix (the research's model choices are settled).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## PHASE MAP & OUTCOMES

The two research inputs are phases 001-002 (read-only). The implementation is ordered — per the SOL ultra review — so the
running system stays internally consistent at every commit and the new substrate is additive/dark until it proves parity:
baseline + taxonomy + a frozen 178-row rec ledger come FIRST; the transition-authorization + event-compatibility contract
is frozen before any typed writer exists; the substrate lands dark behind adapters + shadow parity + rollback before any
authority moves; stable identities + durable fan-in + novelty precede convergence (which consumes them); shared mode
contracts land before the per-mode fan-out; authority cuts over one mode at a time; legacy writers retire last; and a
whole-system gate reruns after integrate-latest. Every implementation phase carries a blocking SOL verifier contract in
its `checklist.md`.

| Phase | Child | Kind | Outcome |
|-------|-------|------|---------|
| **001** | `001-deep-loop-market-research` | research (input) | The 8 ranked recommendations (R1-R8) and the market/landscape research — a complete, read-only input consumed by the phase-004 ledger. |
| **002** | `002-deep-loop-effectiveness-and-fanout` | research (input) | The 59 runtime recommendations + the fan-out finding (run 1) and the 111 per-mode recommendations (run 2) — complete, read-only inputs consumed by the phase-004 ledger. |
| **003** | `003-baseline-taxonomy-and-state-census` | leaf | Pin an immutable BASE. Normalize the taxonomy (workflow families vs registered workflow modes vs the eight research workstreams — packet 033's benchmark set is stale and must be extended). Census the runtime subsystems, every event schema + reader/writer, all persisted in-flight state and backend paths, known-defects-vs-protected-contracts, replay fixtures, and rollback anchors. Everything later is proven against this. |
| **004** | `004-architecture-coverage-and-transition-contract` | parent | Ratify the one-architecture spine (decision-record). Freeze a **bijective 178-row classified ledger** — mint stable rec IDs, normalize targets, assign every rec exactly one disposition (phase / deferred / eliminated), no "unknown" bucket. Define the canonical event namespace, transition vocabulary, schema-version + replay-compatibility policy, the authority boundary, and the cutover/rollback/disposition policy — **before any writer exists**. |
| **005** | `005-fanout-live-tools-unblock` | leaf | The operator's most-requested capability, shipped early and **backward-compatibly**: a typed `liveTools.webSearch` policy + capability matrix + per-kind executor adapters + manifest expansion on `fanout-run.cjs`, so automated fan-out can pass codex top-level `--search` per leaf. Changes dispatch only — **no canonical-persistence change** — so it lands independent of the ledger. Reference: the proven `002-deep-loop-effectiveness-and-fanout/scratch/fanout-prototype.cjs`. |
| **006** | `006-transition-authorized-ledger-core` | parent | The versioned event envelope, the typed append-only ledger, replay fingerprints, and the **fail-closed transition-authorization gateway** — co-landed so no typed event is ever written without passing the gate. The core is **dark**: it records in parallel; legacy remains authoritative. |
| **007** | `007-shared-evidence-and-control-services` | parent | The shared services every mode consumes: receipts + effect-recovery gateway (per-effect recovery policy), the sealed/frozen reference-artifact mechanism, the **blinded/counterfactual adjudication service** (the fifth spine primitive), hierarchical typed budgets, incremental stream-fold gauges, locks/fencing, and continuity identities. |
| **008** | `008-compatibility-shadow-and-rollback-bridge` | parent | The migration safety net: upcasters + dual-read/single-write adapters + legacy projections so old and new coexist; a **shadow-parity** harness proving the dark substrate reproduces legacy behavior; in-flight-state classification (upcast / pin-legacy / fork / migrate / block); and rollback drills. **No authority cutover here.** |
| **009** | `009-fanout-fanin-durable-orchestration` | parent | Durable orchestration integrated onto the ledger: canonical dispatch receipts, result envelopes, resume + salvage, logical branch IDs, leases, waves, conditional budget-aware fan-in, partial-failure policy (strict/quorum/deadline/progressive), and provenance-balanced reduction. Consumes the 005 unblock + the substrate. |
| **010** | `010-novelty-claims-continuity-and-projections` | parent | Semantic-community novelty, contradiction + supersession events, claim continuity, next-focus semantics, and deterministic transactional projections/gauges. Depends on stable identities (009) + the ledger. |
| **011** | `011-convergence-termination-and-health` | parent | Path-covering multi-signal termination, cycle detection, exponential-tail stopping clocks, value-of-computation + adaptive-compute allocation, plus the **generic** health + degeneration harness. Placed AFTER fan-in + novelty + claims because its stop contract consumes them. |
| **012** | `012-shared-mode-contracts-and-fixtures` | parent | Freeze the shared mode interfaces, hoist every cross-mode closure (deep-improvement common used by its 3 variants; the shared review/alignment loop), build mixed-version fixtures, and produce the **executable dependency + write-set conflict graph** that makes the per-mode fan-out parallel-safe. |
| **013** | `013-mode-and-lane-migrations` | parent (×8) | The per-mode fan-out: eight workstreams (`001-deep-research` … `008-deep-alignment`), each a **fractal parent** implementing that mode's full run-C behavior — typed ledger schema, reducers, sealed artifacts, certificates, resume adapters, shadow parity, rollback switch — ending in an independent mode gate. **deep-improvement common precedes** agent-improvement / model-benchmark / skill-benchmark. |
| **014** | `014-staged-state-migration-and-authority-cutover` | parent | Classify + migrate eligible in-flight state; flip authority from legacy to the ledger **one mode at a time**, each behind a rollback window and a cutover certificate proving parity held. |
| **015** | `015-legacy-writer-retirement` | leaf | Remove the old live emitters + replaced logic **only** after zero-use telemetry + rollback evidence; retain required archival readers (old completed packets must still be readable). |
| **016** | `016-whole-system-gate` | leaf | The whole-system gate on the frozen SHA: exact-SHA behavior baselines, every mode gate, mixed-version replay, crash-injection, counterfactual + degeneration tests, budget/receipt parity vs 003, a blocking SOL review, and recursive `validate.sh --strict`. Verification mutates no tracked file. |
| **017** | `017-integrate-latest-and-closeout` | leaf | Integrate the latest origin in a clean worktree; re-census touched contracts and **reopen affected phases on relevant drift**; rerun the entire 016 gate on the exact final SHA; reconcile the 065 "open" items (append-only), changelogs, and packet metadata; parent rollup + merge. |

**Sequencing invariants** (SOL ultra review, folded in):
1. Baseline, taxonomy, the state corpus, and the frozen 178-row rec set are frozen (003-004) before any architecture or implementation work.
2. The transition-authority + event-compatibility contract is frozen (004) before any typed event writer lands, and the authorization gateway co-lands with the first writer (006).
3. The new substrate stays **additive, dark, and non-authoritative** until legacy adapters, shadow parity, and rollback pass (008).
4. Stable logical identities + durable fan-in (009) precede novelty/claim projections (010); both precede convergence activation (011).
5. Shared mode contracts + cross-mode closures (012) land before the per-mode fan-out (013).
6. deep-improvement common services precede the agent-improvement, model-benchmark, and skill-benchmark migrations.
7. Per-mode gates prove **shadow parity only**; authority changes solely in the cutover phase (014).
8. Legacy live writers are removed (015) only after state classification, rollback rehearsal, mixed-version replay, and cutover certificates.
9. Every implementation phase strict-validates independently and produces a blocking SOL receipt bound to its exact commit.
10. The whole-system gate (016) runs on a frozen SHA and reruns after integrate-latest (017), reopening earlier phases on relevant drift.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. **Bijective coverage**: all 178 recommendations carry a stable ID and exactly one disposition (a named phase, or `deferred`/`eliminated` with a reason) in the phase-004 ledger — no "unknown" bucket; a validator proves the 178-row single-disposition property.
2. **No behavioral regression**: the packet-033 deep-loop behavior benchmarks (extended in 003) show no regression vs the pinned BASE, compared by scenario ID + semantics, not count alone.
3. **Additive-dark discipline held**: at no commit before its mode's cutover does the ledger become authoritative; shadow parity is green for a mode before its authority flips.
4. **Staged cutover + rollback proven**: each mode's authority flip carries a cutover certificate; a rollback drill restores the legacy path within the declared window on every mode.
5. **Legacy retired safely**: old live writers are removed only after zero-use telemetry; every historical completed packet still reads correctly through a retained archival reader.
6. **Spine integrity**: every typed event passes the transition-authorization gate (no unauthorized write); replays are deterministic under the versioned fingerprint; receipts exist for every side-effect; raw pre-reduction scores are retained.
7. **Per-mode value delivered**: each of the eight modes emits its sealed artifact / certificate (claim ledger, proof ledger, independence batch, evaluator capsule, authority capsule, transfer certificate, selection certificate, skill-contribution certificate) and passes its independent mode gate.
8. **Whole-system green on the final SHA**: `validate.sh --strict --recursive` is Errors 0 across the tree; all build/test/typecheck gates + mixed-version replay + crash-injection + degeneration tests pass; the 016 gate reran after integrate-latest.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Big-bang inconsistency (highest risk)** — swapping the state/event shape while packets are mid-run corrupts in-flight loops. Mitigation: 006 lands dark; 008 adds adapters + shadow parity + in-flight-state classification; 014 cuts authority per mode behind a rollback window; 015 retires legacy only after zero-use.
- **Authorization landing after writers** — a typed writer without the gate can persist an unauthorized transition. Mitigation: 004 freezes the transition model; 006 co-lands the fail-closed gateway with the first writer.
- **Convergence consuming not-yet-built inputs** — a stop contract referencing branch IDs / fan-in / novelty / claims before they exist. Mitigation: 011 depends on 009 + 010; the ordering invariant is explicit.
- **Missing / drifting rec IDs** — the registries lack stable IDs, so coverage can't be audited. Mitigation: 004 freezes source digests, mints IDs, normalizes targets, validates the 178-row ledger.
- **Taxonomy conflation** — "5 families" vs "7 registered modes" vs "8 workstreams"; packet-033's benchmark set is stale. Mitigation: 003 normalizes the taxonomy and extends the baselines before any design.
- **Hidden cross-mode coupling** — the 3 benchmark variants share deep-improvement's backend; alignment shares the review loop; naive parent-×8 parallelism races on shared write-sets. Mitigation: 012 freezes shared contracts + emits the write-set conflict graph; 013 orders deep-improvement-common first and serializes conflicting lanes.
- **Concurrent sessions on the branch** — other lanes commit to the shared checkout. Mitigation: pin BASE (003), isolated worktree, path-scoped commits, integrate-latest + gate rerun (017).
- **Dependencies**: the packet-033 behavior-benchmark harness (extended, not replaced) for the 003 baseline + 016 gate; the shipped `runtime/scripts/fanout-*.cjs` (005/009 modify additively); `sk-git` for the worktree lifecycle; the spec-kit validator (per-phase strict gate).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to the phase that owns the decision (per the SOL review):
- **003** — Which observed behaviors are protected contracts vs known defects (the no-regression set)?
- **004** — Confirm deep-improvement is an eighth research workstream but not an eighth public workflowMode; the canonical event namespace, transition vocabulary, schema-version policy, and authority boundary.
- **005** — What executor descriptor captures runtime, model build, tools, permissions, search capability, and isolation?
- **007** — Are sealed artifacts commitments, signatures, access-control boundaries, or a combination?
- **008** — Which packet states upcast, pin to legacy, fork, migrate, or block?
- **009** — What evidence authorizes wave fan-out and progressive fan-in?
- **011** — Which stopping / independence / degeneration thresholds stay shadow-only pending calibration?
- **012** — What write ownership + dependency graph makes the mode work parallel-safe?
- **013** — Which evaluator / canary / promotion helpers belong to deep-improvement common vs its variants?
- **014** — What rollback window + evidence authorizes each mode authority flip?
- **015** — Which archival readers + migrators must be retained permanently?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. Phases 001-002 are the read-only research inputs; phases 003-017 are the implementation program. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children; the architecture ADR + the 178-row rec ledger live in 004.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-deep-loop-market-research/ | Market/landscape research + 8 ranked recs (read-only input) | Complete |
| 002 | 002-deep-loop-effectiveness-and-fanout/ | 59 runtime recs + fan-out finding + 111 per-mode recs (read-only input) | Complete |
| 003 | 003-baseline-taxonomy-and-state-census/ | Pinned BASE, normalized taxonomy, full state census | Planned |
| 004 | 004-architecture-coverage-and-transition-contract/ | Architecture ADR + bijective 178-row ledger + transition contract (parent) | Planned |
| 005 | 005-fanout-live-tools-unblock/ | Early backward-compatible live-tools fan-out unblock | Planned |
| 006 | 006-transition-authorized-ledger-core/ | Event envelope + typed ledger + replay fingerprints + auth gateway (parent) | Planned |
| 007 | 007-shared-evidence-and-control-services/ | Receipts, sealed artifacts, adjudication, budgets, gauges, locks (parent) | Planned |
| 008 | 008-compatibility-shadow-and-rollback-bridge/ | Adapters + shadow parity + state classification + rollback (parent) | Planned |
| 009 | 009-fanout-fanin-durable-orchestration/ | Durable fan-out/fan-in on the ledger (parent) | Planned |
| 010 | 010-novelty-claims-continuity-and-projections/ | Novelty + contradiction + claim continuity + projections (parent) | Planned |
| 011 | 011-convergence-termination-and-health/ | Termination + cycle detection + health/degeneration (parent) | Planned |
| 012 | 012-shared-mode-contracts-and-fixtures/ | Shared mode contracts + write-set conflict graph (parent) | Planned |
| 013 | 013-mode-and-lane-migrations/ | The eight per-mode migrations (parent ×8, each fractal) | In Progress |
| 014 | 014-staged-state-migration-and-authority-cutover/ | Per-mode authority cutover + rollback window (parent) | Planned |
| 015 | 015-legacy-writer-retirement/ | Gated legacy-writer removal; archival readers retained | Planned |
| 016 | 016-whole-system-gate/ | Whole-system gate on the frozen SHA | Planned |
| 017 | 017-integrate-latest-and-closeout/ | Integrate latest, rerun gate, reconcile, close out | Planned |
| 018 | 018-drift-census-and-plan-revalidation/ | Drift census: revalidate phases 003-017 against current HEAD before execution | In Progress |

### Phase Transition Rules
- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 002 | 003 | Research inputs complete and frozen; 178 recs available for the ledger | The three findings-registry files present and read-only |
| 003 | 004 | BASE pinned; taxonomy normalized; state + schema + behavior baseline captured | Baseline artifacts keyed by BASE; extended packet-033 benchmark recorded |
| 004 | 005-007 | Architecture ratified; 178-row bijective ledger frozen; transition/compat/cutover policy set | Single-disposition validator green; transition vocabulary + namespace published |
| 006-007 | 008 | Ledger core + shared services land dark; legacy still authoritative | Auth gate rejects an unauthorized transition; dark-write parity smoke passes |
| 008 | 009-011 | Adapters + shadow parity + rollback proven; no authority moved | Shadow parity green; a rollback drill restores legacy; in-flight state classified |
| 009-011 | 012 | Durable fan-in + novelty/claims + convergence land on the ledger (dark) | Deterministic replay under the fingerprint; convergence inputs resolve |
| 012 | 013 | Shared mode contracts frozen; write-set conflict graph emitted | Parallel-safe lane plan; deep-improvement-common ordered first |
| 013 | 014 | Every mode migrated + shadow-parity green behind its mode gate | Per-mode gate checklists pass; sealed artifact/certificate emitted per mode |
| 014 | 015 | Authority flipped per mode behind rollback windows + cutover certificates | Cutover certificate per mode; rollback drill green post-cutover |
| 015 | 016 | Legacy writers removed after zero-use; archival readers retained | Zero-use telemetry; historical packets still read |
| 016 | 017 | Whole-system gate green on the pre-integration SHA | `--all` behavior + mode + replay + degeneration parity vs 003 |
<!-- /ANCHOR:phase-map -->
