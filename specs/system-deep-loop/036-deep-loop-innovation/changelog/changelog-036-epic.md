---
title: "Changelog: 036 Deep-Loop Innovation — Whole-Epic Rollup"
description: "The 036 deep-loop-innovation epic landed a typed event-ledger substrate under all eight deep-loop modes, migrated and cut them over to authoritative operation, hardened executors and CLIs across a hermetic stress program, and closed with runtime enablement, whole-system gate PASS, and over-engineering removal."
trigger_phrases:
  - "036 epic changelog"
  - "whole-epic rollup"
  - "deep-loop-innovation epic"
importance_tier: "normal"
contextType: "implementation"
---
# 036 Deep-Loop Innovation — Whole-Epic Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

The 036 deep-loop-innovation program set out to give every deep loop a durable, replayable, accountable record of what it actually did. One hundred and seventy-eight research recommendations — drawn from two research packets that mapped the loop-engineering state of the art and deepened it into mechanism-backed advice — converged on a single architecture: a typed, append-only event ledger, a fail-closed gateway that authorizes every state transition, and sealed reference artifacts that make the record tamper-evident and replayable. The program built that substrate, migrated all eight deep-loop modes onto it, proved the migrations additive-dark beside the legacy emitters, and then — under an operator-ratified direct flip in phase `012-runtime-enablement` — moved every mode to `new_authoritative_final`, retired the legacy shadow writer, and re-measured the whole-system gate to a literal PASS.

The work unfolded across twelve top-level groups, from research inputs and architecture through substrate and orchestration, mode contracts and migration, gate closeout and drift, blocker closeout, runtime integrity hardening, executor and CLI hardening, review follow-up, gap remediation, weak-model loop adherence, cli-pi fan-out execution, and finally runtime enablement. Each group owns its own scope, plan, and verification; this document synthesizes the whole program from those group-root changelogs without replacing them.

What changed for operators is the end state: the ledger is now authoritative for `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, `alignment`, and `deep-improvement-common`. The legacy files remain readable for their consumers — fan-out orchestration among them — but they are produced by projection from the ledger rather than by a separate legacy writer. A direct-append guard fails closed on any out-of-band write to a projected file. The `/deep:*` commands, agent names, and executor roster behave as before; what a run leaves behind is now a replayable, accountable record backed by the typed substrate.

## What the Epic Delivered

- **A typed-ledger substrate** — Versioned event envelope, typed append-only ledger, fail-closed transition-authorization gateway, sealed reference artifacts keyed by a single reference set digest, replay fingerprints, and a shadow-parity harness with an identity registry — built dark, then made authoritative through runtime enablement.
- **Eight modes, one substrate** — Deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment each migrated through seven concern children (schema, reducers/projections, sealed artifacts, certificates/receipts, resume adapter, shadow parity, rollback plus mode gate) and ended in rollback-guarded mode gates verified green.
- **Additive-dark, then operator-ratified cutover** — The substrate first recorded beside legacy emitters without moving authority; phase `012-runtime-enablement` executed the direct flip to `new_authoritative_final`, dropped the legacy shadow writer, and deleted rollback and one-time migration scaffolding the flip made dead weight.
- **A frozen plan against a frozen baseline** — Architecture coverage ratified the cross-mode spine, froze all 178 recommendations into a bijective single-disposition ledger, and fixed versioning, compatibility, cutover, and rollback rules; a baseline census captured one immutable BASE commit and the authoritative 5/7/8 taxonomy plus runtime, schema, behavior-benchmark, replay-fixture, defect-contract, and rollback evidence.
- **Durable fan-out and honest termination** — Dispatch receipts, result envelopes, resumable branch orchestration, budget-aware completion, provenance-balanced reduction, path-covering termination, cycle detection, independent stopping clocks, value-of-computation allocation, and a generic health and degeneration harness.
- **Seven shared evidence and control services** — Receipts with effect recovery, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks and fencing, and continuity identities.
- **A hermetic CLI-adapter stress program** — 132-plus tests across six external CLI adapters and the fan-out scheduler, 98 operator playbooks, a matrix-bijection validator, and a destructive-scope write-containment proof — additive, touching no shipped adapter.
- **Runtime docs and integrity hardening** — Code README in every source-bearing runtime folder, artifact-certificate binding with forgery negative tests, one shared strict gate validator across four gate families, fail-closed identity and lock ownership boundaries, and multiple named integrity clusters.
- **Cutover blocker closeout** — Completion-evidence reconcile, shadow-parity independent derivation, legacy-compat event vocabulary, and durable write boundaries addressed in dependency order.
- **Weak-model and cli-pi fan-out fixes** — Observation-only write-boundary hardening for weak models and artifact-progress liveness for non-streaming cli-pi executors.
- **Measured traceability and fail-closed identity** — Derived recommendation-to-runtime traceability join with a three-field composition status schema; shared-gateway identity resolution and rollback-certificate identity verification fail closed before cutover.
- **Whole-system gate PASS** — Seven checks, none not-run: authority-state reads eight modes on `new_authoritative_final`, reader-contracts check all eight modes through real consumers, runtime suite carries no new failures against baseline, working tree clean; recursive strict validation clean on the `012` subtree.
- **Over-engineering removal** — Rollback ceremony, one-time migration scaffolding, and five dependency-ordered residue waves deleted with import-graph and audit evidence.

## The Twelve Groups

### 001-research-inputs-and-architecture

This group feeds the program's planning under one thematic map. Four child phases delivered and verified independently.

**Key phases:**
- `001-deep-loop-market-research` — A 45-iteration non-converging `/deep:research` run cataloguing 10+ GitHub repos and mapping every insight to a specific system-deep-loop subsystem, child, or mode (Complete).
- `002-deep-loop-effectiveness-and-fanout` — A 20-iteration targeted follow-on plus a 40-iteration per-mode run deepening recommendations into mechanisms and proving automated multi-model and live-search fan-out with a scratch prototype, without modifying the shipped runtime (Complete).
- `003-baseline-taxonomy-and-state-census` — Froze one immutable BASE commit and the authoritative 5/7/8 deep-loop taxonomy, capturing runtime, state, schema, behavior-benchmark, replay-fixture, defect-contract, and rollback evidence (Complete).
- `004-architecture-coverage-and-transition-contract` — The last planning gate: ratified the cross-mode spine, froze all 178 recommendations into a bijective single-disposition ledger, and fixed the transition, versioning, compatibility, cutover, and rollback contract (Complete).

**Status:** All four children delivered and verified. Chronological lineage recorded in `timeline.md`.

### 002-substrate-and-orchestration

This group covers the substrate and orchestration spine: fan-out live-tools unblock, transition-authorized ledger core, shared evidence and control services, compatibility/shadow/rollback bridge, durable fan-out/fan-in orchestration, novelty/claims continuity and projections, and convergence/termination/health.

**Key phases:**
- `001-fanout-live-tools-unblock` — Typed liveTools.webSearch policy, fail-closed executor capability matrix, per-kind command adapters with invocation fingerprints, models-by-branches-by-replicas manifest expansion; dispatch-only (Complete).
- `002-transition-authorized-ledger-core` — Versioned event envelope, typed append-only ledger, replay fingerprints, and fail-closed transition-authorization gateway co-landed as one dark, non-authoritative substrate (Complete per group map).
- `003-shared-evidence-and-control-services` — Seven shared services behind the envelope: receipts, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks/fencing, continuity identities (In progress per group map).
- `004-compatibility-shadow-and-rollback-bridge` — Five compatibility, shadow-parity, in-flight-state, and rollback child contracts for provably safe later cutover (In progress per group map).
- `005-fanout-fanin-durable-orchestration` — Dispatch receipts, result envelopes, resumable branch orchestration, budget-aware completion, provenance-balanced reduction (Complete).
- `006-novelty-claims-continuity-and-projections` — Concept-level semantic communities, typed contradiction and supersession, stable claim continuity, next-focus semantics, deterministic transactional projections and gauges (Complete).
- `007-convergence-termination-and-health` — Path-covering termination, cycle detection, independent stopping clocks, value-of-computation allocation, generic health and degeneration harness (In progress per group map).

**Status:** Per the group-root changelog (2026-08-13), phases 005, 006, and 010 are complete; phases 007, 008, 009, and 011 are in progress. The substrate core and durable orchestration landed; later enablement (`012`) made the ledger authoritative.

### 003-mode-contracts-migration-and-cutover

This group groups four related child phases: shared mode contracts and fixtures, mode and lane migrations, staged state migration and authority cutover, and legacy-writer retirement.

**Key phases:**
- `001-shared-mode-contracts-and-fixtures` — Froze the shared mode boundary: common interfaces, hoisted cross-mode closures, mixed-version fixtures, executable dependency plus write-set conflict graph (In progress per group map).
- `002-mode-and-lane-migrations` — Eight deep-loop modes each migrated full run behavior onto the typed event-ledger substrate as independent fractal parents, ending in rollback-guarded mode gates (In progress per group map; all eight verified green per epic narrative).
- `003-staged-state-migration-and-authority-cutover` — Classify and migrate eligible in-flight state, cut authority per mode under shadow-parity, rollback, and certificate gates (In progress per group map; executed in `012`).
- `004-legacy-writer-retirement` — Remove old live emitters only after clean cutover certificate, closed rollback window, and zero-use telemetry (Planned per group map; executed in `012`).

**Status:** Per group-root (2026-08-13), phases 012, 013, and 014 were in progress and phase 015 planned. Runtime enablement (`012`) subsequently completed the cutover, fleet flip, and legacy-writer retirement.

### 004-gate-closeout-and-drift

This group covers the final whole-system acceptance gate, integrate-latest and closeout, and drift census and plan revalidation.

**Key phases:**
- `001-whole-system-gate` — Freeze exact candidate SHA, run every mode and cross-system parity gate, exercise mixed-version replay and crash recovery, test counterfactual adjudication and degeneration health, obtain blocking SOL review, recursively strict-validate (Planned per group map; built and PASS in `012`).
- `002-integrate-latest-and-closeout` — Land on moving mainline, re-census touched contracts, reopen drifted phases, rerun whole-system gate on exact final SHA, reconcile parent open items and metadata (Planned per group map).
- `003-drift-census-and-plan-revalidation` — Census 204 commits of drift between planning baseline and HEAD with per-phase verdict and commit-level evidence (In progress per group map).

**Status:** Per group-root (2026-08-13), phases 016 and 017 planned, phase 018 in progress. The whole-system gate later re-measured to literal PASS on the finalized tree (`012`).

### 005-blocker-closeout

This group addresses the four named cutover blockers in dependency order.

**Key phases:**
- `001-completion-evidence-reconcile` — Blocker 4: reopens unreproducible completion-evidence claims, re-evidences against suites at HEAD or strikes them, repairs acceptance boundary (Complete/discharged).
- `002-shadow-parity-independent-derivation` — Blocker 1: rebuilds six shadow-parity harness adapters so ledger side derives from folded reducer projection and legacy side is independent oracle (Complete/discharged).
- `003-legacy-compat-event-vocabulary` — Blocker 2: six live compatibility vocabularies with full upcaster coverage (Complete).
- `004-durable-write-boundaries` — Blocker 3: fencing at append boundary through gateway-only mutation surface (Complete/discharged).

**Status:** All four children delivered and verified independently.

### 006-runtime-docs-and-integrity-hardening

This group covers runtime code READMEs, sk-code alignment, and nine integrity-hardening clusters.

**Key phases:**
- `001-runtime-code-readmes` — Code README in every source-bearing folder; fourteen recorded defects repaired (Complete).
- `002-sk-code-opencode-alignment` — Audit and align runtime against sk-code conventions; Vitest matrix and tsc stay green (Complete).
- `003-artifact-certificate-binding` — Bind load-bearing identities to verified typed payload by exact equality; 12/12 findings with forgery negative tests (Complete).
- `004-alignment-coverage-integrity` — Coverage fails closed with four distinguishable corpus states; per-artifact evidence required (Complete).
- `005-mode-gate-and-contract-binding` — One shared strict gate validator across four gate families (Complete).
- `006-fanout-dispatch-integrity` — Evidence-derived fulfillment, uniform containment, argv dispatch, filtered env, allowlisted observability sink; 10/12 landed, two deferred (Complete).
- `007-improvement-promotion-authority` — Bind promotion, rollback, council persistence to authenticated receipts; 13/13 implementation findings landed; checklist and ADR closeout remain open (In progress per group map).
- `008-runtime-mirror-and-routing-parity` — Order-sensitive mirror comparison, compile-time identity resolution; 7/8 landed, one deferred (Complete).
- `009-silent-failure-and-harness-repair` — Invalid input fails loudly, honest exit codes, harness integrity; 22/23 landed (Complete).
- `010-docs-drift-and-p2-batch` — Replace duplicated facts with links to authoritative source (Complete).
- `011-identity-and-lock-ownership-hardening` — Fail-closed identity binding and process-shared ownership boundaries; 5/5 landed (Complete).

**Status:** Per group-root (2026-08-13), phases 019, 020, 026, 027, and 033 complete; phases 025, 028, 029, 030, 031, and 032 in progress. Most integrity clusters landed; promotion-authority checklist closeout was open at that snapshot.

### 007-executor-and-cli-hardening

This group groups CLI executor and hardening work under one thematic map: stress program, wiring and parity, write containment, deep-alignment integrity, trustworthy state records, residual finding closeouts, and cli-devin repair.

**Key phases:**
- `001-cli-adapter-stress-and-playbooks` — Deterministic stress-test and manual-testing program for six external CLI adapters and fan-out orchestration (Planned scaffold; 132-plus tests and 98 playbooks per epic narrative).
- `002-executor-wiring-and-parity` — Prove every cli/provider/model combination reachable end-to-end through fan-out.
- `003-write-containment-hardening` — Fan-out guard fixes so dispatched leaves cannot leave, delete, or misattribute out-of-scope writes.
- `004-deep-alignment-integrity` — Trustworthy findings-registry seal state and contained multi-executor path.
- `005-trustworthy-state-records` — Stamps state records with append time; stops failing completed lineages over event name choice (Complete per timeline).
- `006-residual-finding-closeouts` — Plan and record evidence for three deferred residuals from siblings 022/025/028.
- `007-cli-devin-executor-repair` — Repairs cli-devin adapter so cli-devin lineages run again on installed devin CLI (Complete per timeline).

**Status:** Each child delivered and verified independently per group-root summary.

### 008-review-and-rollback-followup

This group tracks post-review follow-up: runtime code review, review drift remediation, rollback candidate hash hardening, and review containment exemption.

**Key phases:**
- `001-runtime-code-review` — Code-targeted deep-review of system-deep-loop runtime with 2-lineage SOL fan-out; findings registry and lineage reports persisted (Complete).
- `002-review-drift-remediation` — Reconcile parent documentation and metadata drift: incomplete `children_ids`, stale phase documentation map, legacy alias residue, status contradiction (Complete).
- `003-rollback-candidate-hash-hardening` — Promoted-candidate-only rollback authority; pre-ship rollback intentionally removed (Complete).
- `004-review-containment-exemption` — Exempt runtime's own generated state from fatal write-containment reverts (Complete).

**Status:** All four child phases complete per group-root.

### 009-innovation-gap-remediation

This group closes gap-analysis findings across five children: measurement and traceability, fail-closed substrate identity, pilot-mode cutover, fleet authority cutover with legacy-writer retirement, and closeout drift reconciliation.

**Key phases:**
- `001-measurement-and-traceability` — Derived recommendation-to-runtime traceability join, three-field composition status schema, consolidation alias manifest without rewriting frozen recommendation ledger (Complete).
- `002-substrate-identity-fail-closed` — Shared-gateway identity resolution and rollback-certificate identity verification fail closed before pilot cutover (Complete).
- `003-pilot-mode-cutover` — Deep-research pilot authority flip; operator-gated, not executed in this group (Planned; executed in `012`).
- `004-fleet-authority-cutover` — Serial seven-mode cutover and legacy-writer retirement; operator-gated, not executed in this group (Planned; executed in `012`).
- `005-closeout-and-drift-reconcile` — Depends on cutover children; not executed in this group (Planned; partially addressed in `012` closeout).

**Status:** Two verification-plane children complete; three authority-changing children were planned and operator-gated at group close (2026-08-16). Runtime enablement (`012`) subsequently executed the cutovers and retirement.

### 010-weak-model-loop-adherence

This leaf phase closed the weak-model observation-only write-boundary gap that caused DeepSeek Flash lineages to fail write-containment.

**Key deliverables:**
- Hardened `buildLoopPrompt` in `fanout-run.cjs` with explicit weak-model observation-only prohibition naming forbidden tooling (`generate-context.js`, `validate.sh`, `git` write operations) and lineage-only write rule.
- Applied across all eight loop modes via shared fan-out prompt surface (cli-opencode and cli-pi).
- Mirrored directive into `sk-prompt/sk-prompt-models` (`cli-prompt-quality-card.md` §6).
- Regression coverage in `fanout.vitest.ts` asserting prohibition renders for research and review on both executor kinds.
- Live acceptance: DeepSeek lineage `fulfilled`, zero write-containment violations; strong-model run unaffected.
- `write-containment.ts` unchanged; containment net remains enforced backstop.

**Status:** Complete. Prompt-hardening shipped; hard pre-write jail not adopted.

### 011-cli-pi-fanout-execution

This leaf phase hardened the deep-loop fan-out runner for non-streaming cli-pi executors. Diagnosis overturned the original orphan-requeue loop premise; the real defect was print-mode pi emitting no incremental stdout, so liveness judgements treated working lineages as idle.

**Key deliverables:**
- Artifact-progress poller in `fanout-run.cjs` watching lineage artifact directory, resetting stall watchdog via `markLineageEvent()`, calling `context.reportProgress()` on real writes.
- `reportProgress` threaded through `fanout-pool.cjs` to reset pool stall clock, record `lastArtifactProgressAtMs`, treat fresh progress within grace window as still working for post-exit-orphan watchdog.
- Unit coverage in `fanout-pool.vitest.ts` (+4): silent workers reporting artifact progress not lag-aborted or orphaned; workers whose progress stops still caught.
- Live acceptance on cli-pi DeepSeek review: all iterations plus `review-report.md`, zero requeue/orphan events.
- Live cli-pi research fan-out deferred by operator approval (REQ-005).

**Status:** Complete. P0 requirements satisfied; research live run deferred by approval. Advisory `stall_detected` may still log for pi configs that buffer all disk writes to the end.

### 012-runtime-enablement

This phase turns on the dark deep-loop substrate: append gateway and per-event projection, write-protocol migration, serial authority flips across all eight modes, legacy-writer retirement, fail-closed effect recording, and whole-system gate PASS on the finalized runtime.

**Key phases:**
- `001-append-gateway-and-projection` — `appendModeEvent`, first production projection contract, `append-mode-event.cjs` CLI, ten unit tests with negative controls (Complete).
- `002-deep-research-enablement` — Pilot write protocol on gateway; promotion and classification edges; pilot flip; post-flip fan-out writes through gateway with legacy file as pure projection (Complete).
- `003-fleet-enablement` — Serial enablement driver, CLI, tests; fleet flip via registry-direct path; all eight modes hold durable `new_authoritative_reversible` records (Complete).
- `004-legacy-writer-retirement` — Inventoried direct appends, `check-direct-append.cjs` gated on ledger authority, widened enforcement under `new_authoritative_final` (Complete).
- `005-whole-system-gate` — Frozen-SHA gate with seven checks and blocking receipts; re-measured to literal PASS (Complete).
- `006-enablement-closeout` — Claim sweep, reconciled `036` statuses, feature catalog, manual-testing playbook (Complete).
- `007-effect-enablement` — Fail-closed effect intent and confirmation at `fanout-run.cjs` launcher seam through audited effect gateway (Complete).
- `008-ledger-read-cache` — Opt-in, default-off verified-events read cache on `AppendOnlyLedger`; ~40% per-dispatch win on per-lineage effect ledger (Complete).
- `009-mode-projection-contracts` — Six ledger-fold projection surface contracts; three non-foldable surfaces reclassified; zero mode-owned coverage gaps (Complete).
- `010-full-enablement-finalize` — All eight modes finalized to `new_authoritative_final`; legacy shadow writer dropped; `verify-authority` taught final tier; gate re-measured to proven literal PASS (Complete).
- `011-delete-overengineering` — Removed rollback ceremony, one-time migration scaffolding, five dependency-ordered residue waves (Complete).

**Status:** Complete. All eleven phase children complete. All eight modes read `new_authoritative_final` from stored records; whole-system gate passes; legacy writers retired and guarded. Pending only the operator ff-merge gate.

## Cross-Cutting Themes

### The typed-ledger substrate

The spine has six co-landed pieces: a versioned event envelope with upcaster hooks; a typed append-only ledger written through one gateway-only mutation surface; a fail-closed transition-authorization gateway; sealed reference artifacts content-addressed and keyed by a single reference set digest; replay fingerprints for byte-identical re-derivation; and a shadow-parity harness with identity registry running beside the legacy emitter. Seven shared evidence and control services sit around the core. The substrate first landed additive and dark; runtime enablement made it authoritative.

### Eight modes on one substrate

Each mode migrated through the same seven-part shape: typed-ledger schema, reducers and projections, sealed artifacts, certificates and receipts, resume adapter, shadow-parity harness, and rollback switch plus mode gate. The shared mode boundary was frozen before migrations began. Deep-research went first as the golden lane (shadow-parity 49/49, rollback gate 79/79); the remaining seven lanes followed the same pattern in parallel-safe fashion.

### Additive-dark, then operator-ratified cutover

The ledger authority plane initially recorded after the legacy result and returned it unchanged. No mode authority flipped and no legacy writer retired until phase `012`. The cutover contract — classify and migrate in-flight state, cut authority per mode under shadow-parity, rollback, and certificate gates, retire legacy writers only after clean cutover certificate and zero-use telemetry — was defined alongside the substrate and executed in runtime enablement under an operator-ratified direct flip.

### The whole-system gate

The final acceptance gate freezes an exact candidate commit, runs every mode and cross-system parity gate, exercises mixed-version replay and crash recovery, tests counterfactual adjudication and degeneration health, obtains a blocking review, and recursively strict-validates the complete packet. On the finalized tree it returns literal PASS — all seven checks, none not-run. An earlier blocking review confirmed the additive-dark claim with one accepted exception: autonomous model-benchmark promotion made advisory-only.

### CLI-adapter and executor hardening

A hermetic stress program delivered 132-plus tests, 98 operator playbooks, a matrix-bijection validator, and a destructive-scope write-containment proof without modifying shipped adapters. Executor wiring proved every cli/provider/model combination reachable end-to-end. Write-containment hardening, deep-alignment integrity, trustworthy state records, cli-devin repair, weak-model prompt hardening (`010`), and cli-pi artifact-progress liveness (`011`) closed the gaps that blocked reliable fan-out execution.

### Over-engineering removal

Phase `012` child `011-delete-overengineering` removed rollback ceremony, one-time migration scaffolding, and five dependency-ordered residue waves proven safe by import-graph and audit evidence — dead weight after the direct flip to `new_authoritative_final`.

## Current State

As of the 2026-08-24 epic narrative and `012-runtime-enablement` group-root:

- **All eight modes on `new_authoritative_final`.** The ledger is authoritative for `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark`, `alignment`, and `deep-improvement-common`. Stored authority records read the final tier.
- **Whole-system gate PASS.** All seven checks pass with none not-run: authority-state, reader-contracts across all eight modes, runtime suite against baseline, clean working tree. The `012` subtree passes recursive strict validation with Errors 0.
- **Legacy writers retired and guarded.** The legacy shadow writer was dropped. Legacy files remain readable but are produced by projection from the ledger. `check-direct-append.cjs` and direct-append guards fail closed on out-of-band writes to projected files; neutering the digest comparison makes the same append pass undetected (negative-controlled).
- **Effect and read-path enablement.** Fail-closed effect intent and confirmation wired at the `fanout-run.cjs` launcher seam. Opt-in verified-events read cache on `AppendOnlyLedger` enabled on per-lineage effect ledger (~40% per-dispatch win).
- **Traceability and identity.** Measured recommendation-to-runtime traceability join ties 178 recommendations to runtime landing sites. Substrate identity resolution and rollback-certificate verification fail closed.
- **What remains gated.** The `012` group-root states the epic awaits only the operator ff-merge gate. Live cli-pi research fan-out (REQ-005 from `011`) was deferred by operator approval. Improvement-promotion-authority checklist and ADR closeout were open in the `006` group snapshot. Deferred findings in fanout-dispatch-integrity (F-016-01/F-016-06) and runtime-mirror-and-routing-parity (F-028-01) remain deferred per group-root.

## Per-Group Changelog Index

| Group | Theme | Direct phases | Changelog files | Root |
|---|---|---:|---:|---|
| `001-research-inputs-and-architecture` | Research Inputs and Architecture | 4 | 8 | [root](./001-research-inputs-and-architecture/changelog-001-research-inputs-and-architecture.md) |
| `002-substrate-and-orchestration` | Substrate and Orchestration | 7 | 41 | [root](./002-substrate-and-orchestration/changelog-002-substrate-and-orchestration.md) |
| `003-mode-contracts-migration-and-cutover` | Mode Contracts, Migration and Cutover | 4 | 76 | [root](./003-mode-contracts-migration-and-cutover/changelog-003-mode-contracts-migration-and-cutover.md) |
| `004-gate-closeout-and-drift` | Gate, Closeout and Drift | 3 | 4 | [root](./004-gate-closeout-and-drift/changelog-004-gate-closeout-and-drift.md) |
| `005-blocker-closeout` | Blocker Closeout | 4 | 5 | [root](./005-blocker-closeout/changelog-005-blocker-closeout.md) |
| `006-runtime-docs-and-integrity-hardening` | Runtime Docs and Integrity Hardening | 11 | 12 | [root](./006-runtime-docs-and-integrity-hardening/changelog-006-runtime-docs-and-integrity-hardening.md) |
| `007-executor-and-cli-hardening` | Executor and CLI Hardening | 7 | 24 | [root](./007-executor-and-cli-hardening/changelog-007-executor-and-cli-hardening.md) |
| `008-review-and-rollback-followup` | Review and Rollback Follow-up | 4 | 5 | [root](./008-review-and-rollback-followup/changelog-008-review-and-rollback-followup.md) |
| `009-innovation-gap-remediation` | Innovation Gap Remediation | 5 | 6 | [root](./009-innovation-gap-remediation/changelog-009-innovation-gap-remediation.md) |
| `010-weak-model-loop-adherence` | Weak-Model Loop Adherence (leaf phase) | 0 | 1 | [changelog](./changelog-010-weak-model-loop-adherence.md) |
| `011-cli-pi-fanout-execution` | cli-pi Fan-Out Execution (leaf phase) | 0 | 1 | [changelog](./changelog-011-cli-pi-fanout-execution.md) |
| `012-runtime-enablement` | Runtime Enablement | 11 | 17 | [root](./012-runtime-enablement/changelog-012-runtime-enablement.md) |
