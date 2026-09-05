---
title: "Feature Specification: system-deep-loop recommendations implementation (evidence-ledger runtime + per-mode migration)"
description: "Implement the 178 research recommendations from packets 065/001 + 065/002 into the shipped system-deep-loop runtime and its per-mode workstreams. The research established that all 178 recs converge on ONE architecture — an append-only typed event ledger guarded by a fail-closed transition-authorization gateway, with sealed/frozen reference artifacts, versioned replay fingerprints, receipts/certificates, and blinded/counterfactual adjudication — and that the correct program builds the shared substrate ONCE, then gives each mode its own typed schema over it. The load-bearing constraint (from a GPT-5.6-sol ultra design review): the runtime holds in-flight state and cannot be swapped big-bang, so the new substrate lands ADDITIVE + DARK + non-authoritative behind compatibility adapters and shadow-parity, authority cuts over one mode at a time behind a rollback window, and legacy writers retire only after zero-use telemetry. Phase parent whose direct children are nine thematic group parents from the consolidation, holding the original research-to-closeout, remediation, hardening, review and executor phases, followed by flat leaf children appended in creation order as later work landed. Three of those leaves, 026 to 028, were merged in from separate top-level packets on 2026-09-05. The PHASE DOCUMENTATION MAP is the current child inventory and timeline.md is the creation-order lineage."
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
    last_updated_at: "2026-08-17T04:04:40Z"
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
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; mechanics live in each child's plan.md, the architecture + rec-ledger decisions in `001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/`'s children (`001-spine-architecture-adr/plan.md`, `002-recommendation-ledger-bijective-map/`). -->

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
| **Review** | GPT-5.6-sol (ultra) design review returned **REQUESTED_CHANGES**; this decomposition folds in every P0/P1. See `001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/plan.md`. |
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

> **Current identity caveat (target vs. runtime):** the transition-authorization gateway is fail-closed for request validity, authority availability, head/epoch staleness, unknown policy, and evaluator/audit-storage failures. Identity verification is **opt-in in the current runtime** — a missing, null, or partial identity resolver does not deny — and is scheduled to become a required dependency at the Phase 014 cutover. See [`011-identity-and-lock-ownership-hardening/decision-record.md`](006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/decision-record.md).

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

After grouping, the parent has nine thematic group parents from the consolidation (`001` through `009`), then flat leaf children appended in creation order as later work landed. Two of those later additions, `012-runtime-enablement` and `019-risky-followup-remediation`, are themselves phase parents with their own children, but neither is one of the original nine consolidation groups. The full creation order of every child, including the former top-level numbering of the three children merged in from separate packets, is in the root `timeline.md`.

| # | Child | Kind | Theme | Status |
|---|-------|------|-------|--------|
| 1 | `001-research-inputs-and-architecture` | group parent | research inputs, baseline taxonomy, architecture transition contract | complete |
| 2 | `002-substrate-and-orchestration` | group parent | ledger substrate, fan-out orchestration, convergence and health | complete |
| 3 | `003-mode-contracts-migration-and-cutover` | group parent | mode contracts, migration, authority cutover, legacy retirement | in_progress |
| 4 | `004-gate-closeout-and-drift` | group parent | whole-system gate, closeout, drift census and revalidation | in_progress |
| 5 | `005-blocker-closeout` | group parent | cutover blocker closeouts: evidence, shadow parity, write boundaries | complete |
| 6 | `006-runtime-docs-and-integrity-hardening` | group parent | runtime docs, integrity hardening, identity and lock hardening | in_progress |
| 7 | `007-executor-and-cli-hardening` | group parent | executor and CLI hardening, write-containment, executor repair | in_progress |
| 8 | `008-review-and-rollback-followup` | group parent | runtime code review, rollback hardening, containment exemption | complete |
| 9 | `009-innovation-gap-remediation` | group parent | gap-analysis remediation: fail-closed identity, authority cutover, status reconciliation | in_progress |
| 10 | `010-weak-model-loop-adherence` | leaf | weak-model write-boundary hardening for DeepSeek lineages | complete |
| 11 | `011-cli-pi-fanout-execution` | leaf | cli-pi fan-out execution drives DeepSeek lineage to completion | complete |
| 12 | `012-runtime-enablement` | group parent | turn on dark substrate, cutover, retire legacy writers | complete |
| 13 | `013-runtime-agent-gateway-alignment` | leaf | migrate leaf agents to the append gateway | complete |
| 14 | `014-gateway-alignment-review` | leaf | deep-review hunting for gaps the 013 fix missed | in_progress |
| 15 | `015-gateway-contract-remediation` | leaf | remediate the state-write contract to one gateway path | complete |
| 16 | `016-system-deep-loop-review` | leaf | broad deep-review for drift, bugs and issues | in_progress |
| 17 | `017-runtime-latent-issue-remediation` | leaf | verify-then-fix remediation of the 016 audit's P0/P1 findings | in_progress |
| 18 | `018-pre-existing-test-triage` | leaf | triage pre-existing runtime test failures, fix one drift | complete |
| 19 | `019-risky-followup-remediation` | group parent | remediate two risky pre-existing test failures, phase parent | complete |
| 20 | `020-tsx-boot-spaced-path-hardening` | leaf | harden tsx boot, containment root for spaced paths | complete |
| 21 | `021-containment-symlink-autoscope` | leaf | auto-resolve containment root through symlinked artifact trees | complete |
| 22 | `022-phase0-dispatch-anchor` | leaf | anchor Phase-0 dispatch gate to objective marker | complete |
| 23 | `023-cross-runtime-dispatch` | leaf | retire the Phase-0 dispatch-context self-classification gate | complete |
| 24 | `024-executor-kind-routing` | leaf | deterministic per-kind dispatch for cli-cursor, devin, pi | complete |
| 25 | `025-deprecate-deep-alignment` | leaf | remove deep-alignment, cascade to conformance-benchmark capability | complete |
| 26 | `026-codex-lineage-auth-isolation` | leaf | codex lineage 401 traced to an isolated CODEX_HOME, fix reverted | withdrawn |
| 27 | `027-executor-availability-docs` | leaf | correct command contracts to state real executor sets | complete |
| 28 | `028-cli-lineage-nesting-and-containment-guard` | leaf | stop nested codex exec, preserve containment recovery patch | complete |

Three children arrived by merge and renumbering from separate top-level packets:
- `026-codex-lineage-auth-isolation` was `system-deep-loop/038-codex-lineage-auth-isolation`. Its fix was reverted after a review returned FAIL, so the packet is kept as an investigation record and carries `deferred` in `graph-metadata.json`, the nearest value the status enum admits.
- `027-executor-availability-docs` was `system-deep-loop/039-executor-availability-docs`.
- `028-cli-lineage-nesting-and-containment-guard` was `system-deep-loop/040-cli-lineage-nesting-and-containment-guard`. It reads `complete` here because its own `acceptance-criteria.md` closure gate is Met on all ten rows, while `graph-metadata.json` derives `in_progress` from 21 unevidenced boilerplate rows still open in its `tasks.md`. The gate is the closure authority, the ledger is a record, and both are left honest rather than reconciled by back-filling evidence.

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

Direct children after grouping: nine thematic group parents from the consolidation, then flat leaf children appended in creation order as later work landed. Two of the later additions, `012-runtime-enablement/` and `019-risky-followup-remediation/`, are themselves phase parents with their own children. The full lineage of every child, including the former top-level numbering of the three children merged in from separate packets, is in the root `timeline.md`.

| # | Child | Status |
|---|-------|--------|
| 1 | `001-research-inputs-and-architecture/` | complete |
| 2 | `002-substrate-and-orchestration/` | complete |
| 3 | `003-mode-contracts-migration-and-cutover/` | in_progress |
| 4 | `004-gate-closeout-and-drift/` | in_progress |
| 5 | `005-blocker-closeout/` | complete |
| 6 | `006-runtime-docs-and-integrity-hardening/` | in_progress |
| 7 | `007-executor-and-cli-hardening/` | in_progress |
| 8 | `008-review-and-rollback-followup/` | complete |
| 9 | `009-innovation-gap-remediation/` | in_progress |
| 10 | `010-weak-model-loop-adherence/` | complete |
| 11 | `011-cli-pi-fanout-execution/` | complete |
| 12 | `012-runtime-enablement/` | complete |
| 13 | `013-runtime-agent-gateway-alignment/` | complete |
| 14 | `014-gateway-alignment-review/` | in_progress |
| 15 | `015-gateway-contract-remediation/` | complete |
| 16 | `016-system-deep-loop-review/` | in_progress |
| 17 | `017-runtime-latent-issue-remediation/` | in_progress |
| 18 | `018-pre-existing-test-triage/` | complete |
| 19 | `019-risky-followup-remediation/` | complete |
| 20 | `020-tsx-boot-spaced-path-hardening/` | complete |
| 21 | `021-containment-symlink-autoscope/` | complete |
| 22 | `022-phase0-dispatch-anchor/` | complete |
| 23 | `023-cross-runtime-dispatch/` | complete |
| 24 | `024-executor-kind-routing/` | complete |
| 25 | `025-deprecate-deep-alignment/` | complete |
| 26 | `026-codex-lineage-auth-isolation/` | withdrawn |
| 27 | `027-executor-availability-docs/` | complete |
| 28 | `028-cli-lineage-nesting-and-containment-guard/` | complete |

<!-- /ANCHOR:phase-map -->
