---
title: "Changelog: system-deep-loop Recommendations Implementation [036-deep-loop-innovation/root]"
description: "Narrative release notes for the 036 deep-loop-innovation program: a typed event-ledger substrate landed dark under all eight deep-loop modes, a hermetic CLI-adapter stress program, and a clean whole-system gate — additive-dark throughout, with the authority cutovers deliberately held for operator approval."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "036 changelog"
importance_tier: "normal"
contextType: "implementation"
---
# 036, Deep-Loop Innovation — A Ledger Under Every Loop

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-08-16

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation` (Phase Parent)

The center of this program is a new spine for the deep loops, and the spine runs dark. One hundred and seventy-eight research recommendations — drawn from two research packets that mapped the loop-engineering state of the art and deepened it into mechanism-backed advice — converged on a single architecture: a typed, append-only event ledger that records what a loop actually did, a fail-closed gateway that authorizes every state transition, and a set of sealed reference artifacts that make the record tamper-evident and replayable. All eight deep-loop modes were migrated onto that substrate, each one ending in its own rollback-guarded mode gate, and every one of them verified green.

None of that changes what you run today, on purpose. The ledger authority plane records after the legacy result and returns that result unchanged, so the new substrate is non-authoritative while it proves itself. No mode authority has been flipped, and no legacy writer has been retired. Those cutovers and retirements are real, finished work waiting on a human decision — they are gated for explicit operator approval and have not been executed.

Around that core, the failure paths got the same attention the spine did. A hermetic stress program put the six external CLI adapters and the fan-out scheduler through 132-plus tests, backed by 98 operator playbooks and a destructive-scope write-containment proof. A whole-system acceptance gate ran recursive strict validation clean and an independent blocking review that confirmed the additive-dark claim. A gap-analysis pass landed the measurement and traceability join and a fail-closed substrate identity, then stopped at the pilot cutover because that is where authority starts to move.

The work happened in the corners the loops already occupy, not on the path you use to start one. The commands you type — the `/deep:*` family, the agent names, the executor roster — behave as before. What changed is what a run leaves behind: a replayable, accountable record that was not there before, sitting quietly beside the path you already know.

---

## What's New at a Glance

- **A typed-ledger substrate, running dark** — A versioned event envelope, a typed append-only ledger, a fail-closed transition-authorization gateway, sealed reference artifacts keyed by a single reference set digest, replay fingerprints, and a shadow-parity harness with an identity registry — all landed non-authoritative, recording after the legacy result and returning it unchanged.
- **Eight modes, one substrate** — Deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment each migrated their full run behavior onto the ledger, ending in a rollback-guarded mode gate. All eight verified green.
- **Additive-dark by design** — No mode authority flipped, no legacy writer retired. The ledger records beside the legacy emitter and the legacy result is what you get back. The cutovers and retirements are gated for operator approval and are not done.
- **A hermetic CLI-adapter stress program** — 132-plus tests across the six external CLI adapters and the fan-out scheduler, 98 operator playbooks, a matrix-bijection validator, and a destructive-scope write-containment proof — all additive, touching no shipped adapter.
- **A clean whole-system gate** — Recursive strict validation came back clean, and an independent blocking review confirmed the additive-dark claim, with one accepted and deliberate exception that made autonomous model-benchmark promotion advisory-only.
- **Measured recommendation-to-runtime traceability** — A derived join ties each of the 178 recommendations to where it landed in the runtime, with a three-field composition status schema and a consolidation alias manifest, and it never rewrote the frozen recommendation ledger.
- **Fail-closed substrate identity** — Shared-gateway identity resolution and rollback-certificate identity verification now fail closed before any pilot cutover can begin.
- **Durable fan-out and fan-in** — Dispatch receipts, result envelopes, resumable branch orchestration, budget-aware completion, and provenance-balanced reduction make a fan-out reproducible over the canonical ledger.
- **Path-covering termination instead of count-based stopping** — Cycle detection, independent stopping clocks, value-of-computation allocation, and a generic health and degeneration harness replace the old "stop after N iterations" rule.
- **Runtime docs and integrity hardening** — A code README in every source-bearing runtime folder, artifact-certificate binding with a forgery negative test per finding, one shared strict gate validator across four gate families, and fail-closed identity and lock ownership boundaries.
- **What is deliberately gated** — The pilot cutover, the fleet cutover, legacy-writer retirement, and the final closeout are Planned and operator-gated. They are not executed, and that is the point.

---

## The Typed-Ledger Substrate

The biggest change in this program is one you cannot see yet, because it was built to be invisible. The deep loops always produced results; what they did not produce was a durable, replayable, accountable record of how those results came to be. The substrate fixes that. It is a single architecture with a few load-bearing parts, and every mode now runs over it.

#### The Six-Piece Core

The spine has six pieces that landed together as one dark, non-authoritative core:

- a **versioned event envelope** that wraps every record a loop emits, with upcaster hooks so an old log never blocks a new reader;
- a **typed append-only ledger** as the single record of what happened, written through one gateway-only mutation surface so direct appends are internal-only;
- a **fail-closed transition-authorization gateway** that authorizes every state transition before it is recorded;
- **sealed reference artifacts**, content-addressed and sealed on write, keyed by a single reference set digest so every artifact in a run ties back to one identity;
- **replay fingerprints** that let a run be re-derived from its sealed ledger and proven byte-identical to the original; and
- a **shadow-parity harness with an identity registry** that runs the ledger path beside the legacy emitter and diffs the two event-for-event.

Because the runtime holds live in-flight state, the substrate could not be swapped in one move. So it lands additive and dark behind compatibility adapters, proves shadow-parity against the current behavior first, and waits. The legacy writers remain authoritative. The payoff, when authority moves, is that every run becomes replayable and every transition accountable — but that payoff is held behind an operator gate, not delivered in this program.

Around the core sit seven shared evidence and control services that the substrate makes possible: receipts with effect recovery, the sealed reference artifacts themselves, blinded adjudication for the judgments the loops make, hierarchical typed budgets, stream-fold gauges, locks and fencing, and continuity identities. Each one is a small, self-contained contract that the modes draw on, and each owns its own scope and verification. None of them moves authority on its own; they are the machinery the later cutovers will use.

&nbsp;

#### A Frozen Plan Against a Frozen Baseline

The transition contract that governs all of this was frozen before any implementation began. The architecture coverage gate ratified the cross-mode spine, froze all 178 recommendations into a bijective single-disposition ledger — every recommendation mapped to exactly one disposition, with no duplicates and no orphans — and fixed the versioning, compatibility, cutover, and rollback rules the rest of the program followed. A baseline census captured one immutable base commit and the authoritative five-, seven-, and eight-mode taxonomy, along with the runtime, schema, behavior-benchmark, replay-fixture, defect-contract, and rollback evidence every later phase would be measured against. So the substrate did not grow ad-hoc; it grew against a frozen plan and a frozen baseline.

The research that fed that plan was not a literature skim. A broadening, non-converging research run of 45 iterations catalogued ten-plus GitHub repositories and mapped every insight to a specific deep-loop subsystem, child, or mode. A targeted 20-iteration follow-on — plus a 40-iteration per-mode pass — deepened those recommendations into mechanisms and proved automated multi-model and live-search fan-out with a scratch prototype, without modifying the shipped runtime. The 178 recommendations that came out of that work are the same 178 the rest of the program implemented, and the same 178 the traceability join later tied back to the runtime.

&nbsp;

#### Durable Fan-Out and Honest Termination

Two orchestration problems the loops have always had got real answers this program. The first is making a fan-out durable, and the second is knowing when to stop.

Fan-out and fan-in now run over the canonical ledger through dispatch receipts, result envelopes, resumable branch orchestration, a budget-aware completion policy, and provenance-balanced reduction. The practical effect is that a fan-out is reproducible — the dispatch receipts record which agent ran on which route, the result envelopes carry the outcome, and a resumable branch can pick up where it left off. A budget-aware completion policy decides when a branch is done, and provenance-balanced reduction folds the branches back together without losing where each result came from.

Termination stopped being a count. The old rule — stop after N iterations — was replaced with path-covering termination, cycle detection, independent stopping clocks, value-of-computation allocation, and a generic health and degeneration harness. A loop now stops when it has covered the paths that matter, not when it has hit an arbitrary number, and a degeneration harness can tell the difference between a loop that is still learning and one that is spinning. An intelligence layer over the durable substrate adds concept-level semantic communities, typed contradiction and supersession, stable claim continuity, next-focus semantics, and deterministic transactional projections and gauges — so the loop's own sense of what it knows and what it still needs is itself a typed, replayable thing.

---

## Eight Modes, One Substrate

The substrate is only as useful as the modes that run on it, and all eight of them do. Each deep-loop mode migrated its full run behavior onto the typed event-ledger substrate as an independent workstream, and each one ended in its own rollback-guarded mode gate that certifies the migration is complete. The eight modes are deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment.

Every mode followed the same seven-part shape, so the migrations are fractal copies of one pattern rather than eight hand-rolled jobs:

1. a **typed-ledger schema** — the envelope specialization, concrete event types, field-level types, and versioned-envelope plus upcaster hooks the mode emits during its run;
2. **reducers and projections** — the deterministic pure folds that replay a mode's typed event log into its live state projections, with no side effects;
3. **sealed artifacts** — content-addressed, sealed on write, with a tamper-evident read path;
4. **certificates and receipts** — per-run certificates and per-transition receipts, their replay-fingerprint inputs, and independent offline verification;
5. a **resume adapter** — the path by which a mid-run interruption rebuilds live state purely from the sealed ledger through the reducers, with idempotent re-entry;
6. a **shadow-parity harness** — the ledger path run beside the legacy emitter, with projections diffed event-for-event; and
7. a **rollback switch and mode gate** — a fail-closed rollback switch and an independently authenticated migration-readiness gate that certifies this one mode migrated.

The shared mode boundary was frozen before the migrations began, so the eight modes did not have to negotiate their contracts as they went. Common interfaces, hoisted cross-mode closures, mixed-version fixtures, and an executable dependency and write-set conflict graph made the per-mode work parallel-safe. The deep-research lane went first as the golden path, and when its seven children all reached Complete — shadow-parity green at 49 out of 49 and the rollback gate green at 79 out of 79 — the remaining lanes received a proven pattern and an unambiguous mode boundary to copy.

All eight modes are verified green. The migrations stay additive-dark: each mode's ledger records beside its legacy emitter, and the legacy result is what the run returns. Authority has not moved for any of them.

&nbsp;

#### The Golden Lane, Then the Rest

The deep-research lane was the deliberate pilot for the migration shape, and it earned that role by going first and going clean. Its seven concern children — typed-ledger schema, reducers and projections, sealed artifacts, certificates and receipts, resume adapter, shadow parity, and the rollback plus mode gate — each landed in order, and each one's verification fed the next. When the lane closed, shadow-parity had verified 49 of 49 events event-for-event against the legacy emitter, and the rollback gate had verified 79 of 79 checks. That is the bar the other seven lanes were held to, and the bar they met.

The remaining seven modes followed the same seven-part shape against the same shared boundary. Deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment each migrated their full run behavior onto the ledger, each ending in its own independently authenticated mode gate. Because the boundary was frozen and the golden lane had already proven the pattern, the later lanes could run in parallel without stepping on one another — the dependency and write-set conflict graph guaranteed it.

&nbsp;

#### The Cutover Contract, Held

The migrations are not the cutovers. A separate contract governs what happens when a mode's authority actually moves from the legacy emitter to the ledger, and that contract was defined alongside the substrate rather than left for later. It classifies and migrates eligible in-flight state, then cuts authority per mode under shadow-parity, rollback, and certificate gates. The legacy writers are retired only after every mode has a clean cutover certificate, a closed rollback window, and zero-use telemetry.

That contract is finished and verified. The cutovers it describes are not. They are the operator-gated remainder described later in **What Is Deliberately Gated**, and the contract exists precisely so that, when an operator says go, the path is already defined and already proven safe rather than being invented under pressure.

---

## Additive-Dark by Design

The hardest design decision in this program was the one that looks like nothing happened. The substrate is finished, the modes are migrated, the gates are green — and yet nothing you run today behaves differently. That is the additive-dark principle, and it is the reason the program could land this much change without risk.

Additive-dark means the ledger authority plane runs dark. It records after the legacy result and returns that result unchanged. The legacy writers stay authoritative. The shadow-parity harness proves the two paths agree event-for-event, but the ledger does not get to decide what a run returns — not yet. Every mode gate certifies that the migration is complete and the rollback switch is fail-closed, and then it stops, because the next step is an authority cutover and that step belongs to an operator.

This is not a hedge; it is a sequence. The runtime holds live in-flight state, so a single big-bang swap would have been unsafe. Instead the program proves the new path first, ships it dark, and waits for an explicit, in-the-moment approval before any mode's authority flips. The cutovers are staged per mode, each one behind a shadow-parity certificate and a closed rollback window, and the legacy writers are retired only after telemetry shows zero use. None of those authority-changing steps have been executed. They are Planned, they are operator-gated, and they are the deliberate remainder of the program.

The whole-system gate and an independent blocking review both confirmed this. The review accepted the additive-dark claim with one deliberate exception: the promotion-authority containment work made autonomous model-benchmark promotion advisory-only, so a model benchmark can no longer promote itself without a human in the loop. That exception narrows authority rather than widening it, and it was accepted as the right call.

---

## The CLI-Adapter Stress Program

The deep loops fan out across six external CLI adapters — Codex, OpenCode, Pi, Claude Code, Devin, and Cursor — and a fan-out is only as trustworthy as the adapters it dispatches through. This program put that trust to a hermetic test.

A dedicated stress phase delivered a deterministic stress-test and manual-testing program for the six external CLI deep-loop adapters and the fan-out orchestration that schedules them. It is hermetic, meaning it runs without depending on the live adapters' volatility, and it is additive, meaning it touches no shipped adapter. The program comprises:

- **132-plus tests** across the six external CLI adapters and the fan-out scheduler, exercising the dispatch paths a real fan-out relies on;
- **98 operator playbooks** that turn the stress scenarios into reproducible, human-runnable procedures;
- a **matrix-bijection validator** that proves every cli, provider, and model combination is reachable end-to-end through the fan-out, so a route you name is a route that actually runs; and
- a **destructive-scope write-containment proof** that shows a dispatched leaf can never leave, delete, or misattribute an out-of-scope write.

&nbsp;

#### Wiring, Parity, and Containment

Around the stress program, the executor wiring and parity work grouped the per-kind wiring and proved every cli, provider, and model combination reachable end-to-end through the fan-out. The matrix-bijection validator is the formal version of that claim: it checks that the matrix of combinations is a bijection, so there are no routes that promise a combination they cannot deliver and no combinations that have no route. The write-containment hardening grouped the fan-out guard fixes that keep a dispatched leaf inside its scope — uniform containment, argv dispatch, filtered env, and an allowlisted observability sink — so a leaf can never leave, delete, or misattribute an out-of-scope write.

A dedicated repair phase fixed the cli-devin adapter so cli-devin lineages run again on the installed devin CLI. The adapter had been broken against the installed binary, and the repair brought it back without disturbing the other five. A trustworthy-state-records pass stamped deep-loop state records with the time they were appended and stopped failing a completed lineage over the event name it chose, so a run's own bookkeeping can no longer mark a successful run as failed.

&nbsp;

#### Deep-Alignment Integrity

The deep-alignment mode — the one that audits artifacts against the named authority they claim to follow — got its own integrity pass. A trustworthy findings-registry seal state and a contained multi-executor path landed together, so an alignment run's findings are sealed and its fan-out stays contained. The work matters beyond the mode itself: deep-alignment is the loop that checks the framework against its own standards, so an integrity gap there would undercut every other conformance claim the framework makes.

The net effect of the whole program is that a fan-out is reproducible and the executor you name is the one that actually runs — and all of it was proven without modifying a shipped adapter.

---

## The Whole-System Gate

Before the program could close, it had to prove the whole thing holds together. A whole-system acceptance gate ran the final check: freeze an exact candidate commit, run every mode and cross-system parity gate, exercise mixed-version replay and crash recovery, test counterfactual adjudication and degeneration health, obtain a blocking review, and recursively strict-validate the complete packet.

Recursive strict validation came back clean. An independent blocking review — a two-lineage senior review fan-out — confirmed the additive-dark claim: no mode authority flipped, no legacy writer retired, the ledger running dark as designed. The one accepted exception, the promotion-authority containment that made autonomous model-benchmark promotion advisory-only, was accepted as deliberate and correct.

&nbsp;

#### Drift, Integration, and the Moving Mainline

The gate did not stop at the program's own boundary. A drift census checked the frozen planning baseline against the 204 commits of drift between that baseline and the moving mainline, returning a per-phase verdict — still valid, needs refinement, or invalidated — with commit-level and path-and-line evidence for each. Where a phase's inputs had drifted, the phase was reopened rather than waved through.

An integrate-latest and closeout contract landed the program on the moving mainline in a clean worktree, re-censused the touched contracts, reopened phases whose inputs had drifted, and reran the whole-system gate on the exact final commit. So the green result is against the real, current mainline, not a frozen island. The parent packet's open items, changelogs, and generated metadata were reconciled as part of the same pass, so the documentation matches the code that actually shipped.

&nbsp;

#### The Follow-Up Review and Two Remediations

A follow-up code-targeted deep-review of the runtime and two scoped remediations closed the loop. The review ran as a two-lineage senior fan-out and persisted its findings registry and lineage reports. Its traceability check surfaced documentation and metadata drift in the parent — incomplete child lists, a stale phase documentation map, legacy alias residue, and a status contradiction — and a remediation phase reconciled them.

Two fixes landed. Rollback candidate hash hardening now requires the current target to equal the promoted candidate hash exclusively, so pre-ship rollback is intentionally removed and only a promoted candidate can authorize a rollback. And a review containment exemption stops the runtime's own generated state — runtime database telemetry and memory-index metadata — from tripping fatal write-containment reverts, so a fan-out review can run without the runtime's own writes failing the lineage.

---

## Runtime Docs and Integrity Hardening

A substrate that promises accountability has to hold itself to the same standard, and a long hardening pass across the runtime made sure it does. The work is mostly internal, but it is the reason the gate could come back clean.

A code README was added to every source-bearing folder in the system-deep-loop runtime, authored to the repo's documentation standard, with fourteen recorded defects repaired along the way. A separate alignment pass audited the runtime against the code-surface conventions and reconciled the divergences while preserving behavior, with the per-mode, per-file test matrix and the whole-runtime type check staying green.

The integrity work ran across a set of named clusters, each one closing a class of gap:

- **Artifact-certificate binding** — every load-bearing identity in a certificate or sealed-artifact claim is now bound to the verified typed payload by exact equality, closing twelve findings across the sealed-artifact store and four certificate emitters, with a decoy or forgery negative test per finding.
- **Alignment-coverage integrity** — coverage fails closed with four distinguishable corpus states, both readers agree on identical bytes, and coverage credit requires per-artifact evidence from the dispatched slice.
- **Mode-gate and contract binding** — one shared strict gate validator was adopted by all four gate families, so the readiness-gate, rollback-switch, and mode-contract conformance boundaries all check the same way.
- **Fan-out dispatch integrity** — fulfillment is evidence-derived, dispatch containment is enforced across kinds, provenance is preserved in the audit, argv dispatch and filtered env are uniform, and an allowlisted observability sink keeps telemetry contained. Ten of twelve findings landed; two were deferred.
- **Improvement promotion authority** — promotion, rollback, and council persistence are bound to authenticated receipts and authorized roots, so mutable local JSON is never the sole authority. Thirteen of thirteen implementation findings landed; the checklist and decision-record closeout remain open.
- **Runtime mirror and routing parity** — the mirror and routing-parity gates now compare what actually differs, with order-sensitive and tool-surface-sensitive mirror comparison and compile-time identity resolution. Seven of eight findings landed; one was deferred.
- **Silent failure and harness repair** — invalid input fails loudly, exit codes are honest, test-harness integrity is repaired, and asset and playbook resolution is fixed. Twenty-two of twenty-three findings landed across three lanes.
- **Docs drift and P2 batch** — duplicated facts were replaced with links to one authoritative source, so the drift cannot silently recur.
- **Identity and lock ownership hardening** — fail-closed identity binding and process-shared ownership boundaries cover authorized transitions, staged leaf publication, append locks, and fresh loop-lock acquisition. Five of five landed.

A blocker-closeout pass addressed the four cutover blockers in dependency order. Completion-evidence reconcile reopened every unreproducible completion claim, re-evidenced it against the suites at the current commit or struck it, and repaired the acceptance boundary so the drift cannot recur. Shadow-parity independent derivation rebuilt six harness adapters so the ledger side derives from the folded reducer projection and the legacy side is an independent oracle, with each rebuild proven by an injected divergence. The legacy-compatibility event vocabulary wrote six live compatibility vocabularies with full upcaster coverage, so an ordinary lifecycle record never blocks a log. And durable write boundaries enforced fencing at the append boundary through a gateway-only mutation surface, making direct append authorization internal-only.

---

## What Is Deliberately Gated

The part of the program that did not run is the part that matters most to read carefully, because it is where authority starts to move. A gap-analysis pass at the end of the program landed the two verification-plane children and then stopped, on purpose, at the three authority-changing children.

What landed:

- **Measurement and traceability** — Complete. The derived recommendation-to-runtime traceability join ties each of the 178 recommendations to where it landed in the runtime, with a three-field composition status schema and a consolidation alias manifest. It does not rewrite the frozen recommendation ledger; it reads it.
- **Fail-closed substrate identity** — Complete. Shared-gateway identity resolution and rollback-certificate identity verification now fail closed before any pilot cutover can begin, so a cutover cannot proceed on an unresolved identity.

What is Planned and operator-gated, and not executed:

- **Pilot-mode cutover** — the deep-research pilot authority flip requires explicit operator approval and a zero-divergence shadow-parity certificate. It has not run.
- **Fleet authority cutover** — the serial seven-mode cutover and legacy-writer retirement require per-mode operator approval and zero-use telemetry. They have not run.
- **Closeout and drift reconciliation** — the final closeout depends on the cutover children landing first. It has not run.

This is the additive-dark line held to the end. The substrate is built, the modes are migrated, the gates are green, the traceability is measured, and the identity is fail-closed. What remains is the decision to flip authority, and that decision is yours, not the program's.

---

## Upgrade Notes

There is no migration for you to run, because nothing you operate has changed authority. The ledger runs dark, the legacy writers are still authoritative, and the `/deep:*` commands, agent names, and executor roster behave as before. The program is additive by construction, and the cutovers are gated for your approval rather than shipped.

The concrete things to know:

- **Nothing flips on its own.** No mode authority has been flipped and no legacy writer has been retired. A pilot cutover, the fleet cutover, legacy-writer retirement, and the final closeout are Planned and wait on your explicit, per-mode approval. You will not wake up to a ledger-authoritative run.
- **The stress program is additive.** The 132-plus adapter tests, the 98 operator playbooks, the matrix-bijection validator, and the write-containment proof touch no shipped adapter. You do not need to update any adapter to benefit from them.
- **Promotion authority narrowed.** The one accepted exception to additive-dark made autonomous model-benchmark promotion advisory-only. If you relied on a model benchmark promoting itself without a human, that path is now advisory — a human is in the loop.
- **Rollback authority tightened.** The deep-improvement rollback path now requires the current target to equal the promoted candidate hash exclusively, and pre-ship rollback was intentionally removed. Only a promoted candidate can authorize a rollback.
- **Review containment now exempts the runtime's own state.** Runtime database telemetry and memory-index metadata are exempt from fatal write-containment reverts, so a fan-out review can run without the runtime's own writes failing the lineage. If you scripted against the old, stricter behavior, that exemption is now in place.
- **To move authority, follow the gates.** When you are ready to flip a mode, the path is the staged state migration and authority cutover contract: per-mode shadow-parity certificate, closed rollback window, zero-use telemetry, then retirement. The machinery is built and verified; the decision is the operator's.

---

## Internal Seams (No User-Facing Change)

- **Typed-ledger substrate, landed dark.** A versioned event envelope, typed append-only ledger, fail-closed transition-authorization gateway, sealed reference artifacts keyed by a single reference set digest, replay fingerprints, and a shadow-parity harness with an identity registry — all non-authoritative, recording beside the legacy emitter.
- **Seven shared evidence and control services.** Receipts with effect recovery, sealed reference artifacts, blinded adjudication, hierarchical typed budgets, stream-fold gauges, locks and fencing, and continuity identities — the machinery the later cutovers will use.
- **Eight mode migrations, one shape.** Each mode migrated through seven concern children — schema, reducers and projections, sealed artifacts, certificates and receipts, resume adapter, shadow parity, and rollback plus mode gate — and each ended in its own rollback-guarded mode gate.
- **Durable fan-out and fan-in.** Dispatch receipts, result envelopes, resumable branch orchestration, budget-aware completion, and provenance-balanced reduction make a fan-out reproducible over the canonical ledger.
- **Path-covering termination.** Count-based stopping was replaced with path-covering termination, cycle detection, independent stopping clocks, value-of-computation allocation, and a generic health and degeneration harness.
- **One shared strict gate validator.** The readiness-gate, rollback-switch, and mode-contract conformance boundaries all use one validator across the four gate families.
- **Artifact-certificate binding by exact equality.** Every load-bearing identity in a certificate or sealed-artifact claim is bound to the verified typed payload, with a forgery negative test per finding.
- **Fail-closed identity and lock ownership.** Authorized transitions, staged leaf publication, append locks, and fresh loop-lock acquisition all bind identity fail-closed under process-shared ownership boundaries.
- **Hermetic CLI-adapter stress.** 132-plus tests, 98 playbooks, a matrix-bijection validator, and a destructive-scope write-containment proof — additive, touching no shipped adapter.
- **Whole-system gate, recursive strict validation clean.** An independent blocking review confirmed the additive-dark claim, with one accepted exception that made autonomous model-benchmark promotion advisory-only.
- **Drift census and integrate-latest.** The 204 commits of drift between the planning baseline and the moving mainline were censused per phase, and the program was landed on the current mainline with the gate rerun on the exact final commit.

---

## Included Phases

| Group | Direct phases | Changelogs | Rollup |
|---|---:|---:|---|
| `001-research-inputs-and-architecture` — Research Inputs and Architecture | 4 | 8 | [`changelog-001-…`](./001-research-inputs-and-architecture/changelog-001-research-inputs-and-architecture.md) |
| `002-substrate-and-orchestration` — Substrate and Orchestration | 7 | 41 | [`changelog-002-…`](./002-substrate-and-orchestration/changelog-002-substrate-and-orchestration.md) |
| `003-mode-contracts-migration-and-cutover` — Mode Contracts, Migration and Cutover | 4 | 76 | [`changelog-003-…`](./003-mode-contracts-migration-and-cutover/changelog-003-mode-contracts-migration-and-cutover.md) |
| `004-gate-closeout-and-drift` — Gate, Closeout and Drift | 3 | 4 | [`changelog-004-…`](./004-gate-closeout-and-drift/changelog-004-gate-closeout-and-drift.md) |
| `005-blocker-closeout` — Blocker Closeout | 4 | 5 | [`changelog-005-…`](./005-blocker-closeout/changelog-005-blocker-closeout.md) |
| `006-runtime-docs-and-integrity-hardening` — Runtime Docs and Integrity Hardening | 11 | 12 | [`changelog-006-…`](./006-runtime-docs-and-integrity-hardening/changelog-006-runtime-docs-and-integrity-hardening.md) |
| `007-executor-and-cli-hardening` — Executor and CLI Hardening | 7 | 24 | [`changelog-007-…`](./007-executor-and-cli-hardening/changelog-007-executor-and-cli-hardening.md) |
| `008-review-and-rollback-followup` — Review and Rollback Follow-up | 4 | 5 | [`changelog-008-…`](./008-review-and-rollback-followup/changelog-008-review-and-rollback-followup.md) |
| `009-innovation-gap-remediation` — Innovation Gap Remediation | 5 | 6 | [`changelog-009-…`](./009-innovation-gap-remediation/changelog-009-innovation-gap-remediation.md) |
