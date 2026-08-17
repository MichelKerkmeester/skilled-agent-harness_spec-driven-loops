---
title: "Implementation Plan: Pilot Mode Authority Cutover"
description: "Implementation plan for wiring deep-research to the production authority-flip root, enforcing shadow parity, and proving cutover and rollback across five production boundaries."
trigger_phrases:
  - "pilot mode cutover implementation plan"
  - "deep-research authority composition plan"
  - "five-boundary rollback plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Defined the production-root cutover and five-boundary verification plan"
    next_safe_action: "Confirm predecessor gates and inventory the shared deep-research root"
    blockers:
      - "Predecessor 002-substrate-identity-fail-closed must pass before live wiring"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts"
    completion_pct: 0
    open_questions:
      - "Which shared construction seam owns both deep-research command variants?"
      - "What rollback-window policy will be declared?"
    answered_questions:
      - "deep-research is the sole pilot mode"
---
# Implementation Plan: Pilot Mode Authority Cutover

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Production deep-research command and persistence composition root |
| **Change class** | One-mode reversible authority wiring plus production-boundary verification |
| **Pilot** | `deep-research` only; first in the frozen order (`../../goal.md:326-343`) |
| **Authority** | Legacy until predecessor, parity, approval, and cutover gates pass; dark only during the reversible window |
| **Primary substrate** | `AuthorityFlipCoordinator`, `AuthorityRegistry`, `selectAuthorityRoute`, transition gateway, typed event ledger, and deep-research rollback gate |

### Overview
Inventory the actual root shared by the deep-research auto and confirm command manifests, then install one production
dependency graph that reads the durable authority record at canonical admission and persistence. Construct the existing
coordinator with deployment-resolved identity, policy, ledger, and registry dependencies. Admit a cutover only after
current shadow-parity evidence is green. Persist forward intent before append, publish the authority CAS only through
the coordinator's recoverable protocol, and retain the legacy route throughout a declared rollback window.

Verification uses the same root, not a coordinator unit fixture. A subprocess-based matrix exercises selector
admission, durable intent persistence, real producer death, fresh-process restart, and forward CAS plus rollback. The
drill must restore legacy at a newer epoch within the declared window and prove a successful legacy canary. The phase
stops before fleet rollout and before any automated mutation of operator authority.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The predecessor `002-substrate-identity-fail-closed` is complete against the same production root and proves mandatory deployment identity, policy binding, append fencing, and fresh lock ownership
- [ ] A fresh census identifies every deep-research canonical admission, state append, reducer write, retry, resume, repair, subprocess, and rollback entry point
- [ ] One shared construction seam used by both `deep-research-auto.yaml` and `deep-research-confirm.yaml` is named with real imports and no invented symbol
- [ ] The exact candidate SHA, BASE SHA, policy tuple, deployment actor/capability binding, authority roots, and pilot mode are frozen
- [ ] Current mode-gate, migration, cutover-certificate, rollback-asset, and zero-divergence shadow-parity evidence verifies for that exact candidate
- [ ] The rollback-window duration, restoration-time objective, health triggers, legacy assets, and one-open-window policy are declared
- [ ] The production-boundary test uses isolated production-shaped storage and has no path to operator state

### Definition of Done
- [ ] Both deep-research command variants resolve the same production authority dependencies and no canonical writer bypasses `selectAuthorityRoute`
- [ ] One operator-approved pilot transition produces one event, one epoch increment, one dark canonical route, and one open rollback window
- [ ] Selector, parity, identity, policy, epoch, and CAS negative controls all fail closed with zero partial authority mutation
- [ ] Real producer-death and fresh-process tests reconcile durable intent, ledger, and registry facts without duplicate events or split authority
- [ ] The five-boundary production matrix is green on one frozen candidate with zero skipped rows
- [ ] The rollback drill restores legacy at a newer epoch within the declared window, passes a legacy canary, and denies stale dark and stale legacy writers
- [ ] All non-pilot mode records remain byte-identical and legacy-authoritative
- [ ] TypeScript, targeted production-root tests, scoped diff checks, and strict packet validation pass from the final state
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Confirmed production boundary**: the auto and confirm command manifests are shipped roots and both invoke the
  packet-local deep-research reducer (`.opencode/commands/deep/assets/deep-research-auto.yaml:889-899` and
  `.opencode/commands/deep/assets/deep-research-confirm.yaml:790-818`). The reducer resolves the canonical research
  state log and output paths and performs writes
  (`.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2902-2930,3044-3063`). Phase 1 determines
  the shared construction seam; this plan does not fabricate its future symbol.
- **Production dependency graph**: the shared seam constructs one `AuthorityRegistry`, typed event ledger, transition
  gateway, policy registry, mandatory deployment identity resolver, and `AuthorityFlipCoordinator` for
  `deep-research`. Durable roots come from production configuration and are explicitly separated from test roots.
- **Admission and write selector**: every canonical invocation reads the current mode record and calls
  `selectAuthorityRoute`. Selector denial stops before either writer. Legacy states use the existing legacy path;
  `new_authoritative_reversible` uses the typed ledger and retains legacy only as the declared shadow/rollback route.
- **Parity and cutover preflight**: current shadow-parity, mode-gate, migration, rollback-asset, certificate, candidate,
  policy, identity, head, and epoch facts are verified immediately before the coordinator request. Drift invalidates
  approval and requires a refreshed evidence set.
- **Recoverable forward transaction**: `requestCutover` persists the complete intended CAS, appends the authorized
  authority event, and publishes the registry CAS. On restart, pending intent is reconciled against verified ledger and
  registry facts; conflicting durable state fails loud rather than guessing
  (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:142-147,256-280,345-409`).
- **Rollback integration**: the existing deep-research rollback gate supplies admission freeze, evidence validation, and
  writer fencing. Its authorized certificate currently records that canonical restoration is still required
  (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts:299-338`). The pilot
  composition therefore applies `AuthorityRegistry.compareAndSwapRollback` to the same record and verifies the resulting
  legacy route at a newer epoch.
- **Evidence recorder**: bind matrix and drill output to candidate, BASE, mode, source/restored epochs, heads, policy and
  certificate digests, process IDs and exits, elapsed restoration time, command results, and tracked-mutation checks.

The fixed execution order is: census and dependency proof -> freeze candidate and window -> verify parity -> operator
approval stop -> persist intent -> authorized ledger append -> registry CAS -> selector verification -> bounded dark
canary -> real-process crash/restart matrix -> rollback drill -> legacy canary -> stale-writer denials -> evidence seal.
Any earlier failure leaves or restores legacy authority and blocks downstream steps.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Re-census the deep-research auto/confirm command roots, reducer, canonical state appenders, ledger adapters, resume and repair paths, subprocess routes, and rollback gate; record the exact shared construction seam.
- Capture the current composition baseline. Confirmed evidence includes dark-only coordinator and selector declarations; the gap brief's `0/72` and empty-matrix values remain inferred until this census reproduces them.
- Verify the predecessor's identity, policy, fencing, and lock controls at the selected root; stop if any dependency is optional, unresolved, stale, or test-only.
- Freeze the candidate, BASE, mode, policy, identity, durable-root layout, parity inputs, rollback assets, and five-row test manifest.
- Declare the rollback window, restoration-time objective, health triggers, maximum one open window, operator stop, and isolated test-root guard.

### Phase 2: Implementation
- Add the smallest shared production composition adapter needed by both deep-research command variants; construct the existing registry, ledger, gateway, policies, identity resolver, coordinator, and selector dependencies there.
- Route canonical deep-research admission and persistence through `selectAuthorityRoute`, with explicit legacy and typed-ledger branches and no implicit fallback.
- Connect current shadow-parity and predecessor evidence to the cutover preflight; stale or divergent evidence must stop before intent persistence.
- Connect the production request path to `AuthorityFlipCoordinator.requestCutover` and preserve the existing pending-intent, authorized append, CAS, and reconciliation protocol.
- Bind the deep-research rollback gate to `compareAndSwapRollback` on the same durable authority record, then verify legacy selection and canary writes after restoration.
- Add candidate-bound evidence capture and non-pilot byte-identity checks without introducing a fleet transition path.

### Phase 3: Verification
- Run both deep-research command variants before cutover and prove selector admission chooses legacy while shadow parity observes the typed-ledger path without publication.
- Run the five-boundary matrix through the production root: selector admission, intent persistence, producer death, fresh-process restart, and authority CAS plus rollback.
- Kill a real producer at each frozen fault boundary, start a new process with empty memory, and verify one event, one epoch, one route, and deterministic marker cleanup or fail-closed conflict.
- Execute a bounded dark canary, trigger rollback, measure restoration against the declared window, complete a legacy canary, and deny stale dark and stale legacy capabilities.
- Verify every non-pilot mode record and route remains unchanged, all evidence binds to one candidate/BASE pair, and no test reaches operator state.
- Run targeted runtime typecheck/tests, static bypass scans, scoped diff/status checks, strict packet validation, and the final evidence review.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Composition census and import graph prove both production command variants use one authority dependency graph; a negative test removes the binding and requires startup/admission denial rather than legacy fallback |
| REQ-002 | Missing resolver, null/partial identity, actor mismatch, capability mismatch, policy mismatch, stale proof, stale fence, and lock-publication fault each deny before pending intent, ledger append, or registry CAS |
| REQ-003 | Green current parity admits preflight; missing, stale, divergent, wrong-mode, wrong-candidate, wrong-BASE, and changed-comparator fixtures leave legacy authoritative with no transition artifact |
| REQ-004 | The selector-admission row drives both command variants through every authority state and malformed/wrong-mode/stale-digest inputs; exactly one writer is callable, and `rollback_pending` calls neither |
| REQ-005 | The intent-persistence row inspects the durable prepare marker before append, verifies all CAS facts are present, and proves malformed or absent intent cannot publish authority |
| REQ-006 | The producer-death row terminates a child process after intent persistence and after ledger append; recovery produces no duplicate event, epoch, receipt, or effect and never exposes two writers |
| REQ-007 | The fresh-process row starts a new process against the same roots with no request object or memory cache; it resumes the exact transition, aborts a non-appended intent, and fails loud on conflicting durable facts |
| REQ-008 | The CAS-plus-rollback row proves forward `cutover_ready(N)` to reversible dark `(N+1)`, rollback-pending admission denial, final legacy restoration at a newer epoch, and stale capability rejection |
| REQ-009 | A timed rollback drill freezes admission, fences dark, preserves event/artifact counts, restores legacy, passes a canary, and compares elapsed time to the declared window and objective |
| REQ-010 | Before/after digests cover all non-pilot records, routes, and shared-backend namespaces; any cross-mode mutation fails the matrix |
| REQ-011 | Evidence-schema and replay tests require exact candidate/BASE, commands, exits, heads, epochs, digests, elapsed time, and clean tracked-state checks; missing fields fail acceptance |

The production-boundary suite must invoke the same entry root used by shipped deep-research commands. Coordinator unit
tests may remain as fast controls, but they cannot satisfy any matrix row. Process-death tests use child processes and
deterministic barriers rather than thrown callbacks or sleeps. All storage is production-shaped but isolated under an
explicit test root; a guard rejects operator or live packet paths before startup.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hard predecessor is `../002-substrate-identity-fail-closed`; its exact implementation symbols are not assumed by
this plan because that phase is being authored separately. Its completion evidence must nevertheless prove mandatory
identity resolution, policy binding, fenced appends, and safe lock ownership at the pilot root before Phase 2 can enable
authority wiring. The need is grounded in the generic gateway's optional resolver check
(`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:747-751`) and the
coordinator's mandatory resolver contract
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:61-81`).

Execution also consumes the completed per-mode authority-flip package, deep-research mode gate and rollback switch,
typed event ledger, current shadow-parity evidence, migration handoff, cutover certificate, rollback assets, and the
program's frozen order/runbook. The authority-flip package is confirmed dark and unit-only
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:5-11`), so this phase owns
the production composition delta. The successor is `../004-fleet-authority-cutover`, which cannot begin until the pilot
matrix and rollback drill are green and independently reviewed. No pilot result grants fleet authority by itself.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is a required live-path behavior, not only a source revert. During the declared window, retain the legacy
adapter, rollback anchor, migration/classification evidence, historical readers, and all authority events and receipts.
On a trigger, freeze new admissions; fence the dark writer; reconcile admitted work and effects; invoke the existing
deep-research rollback gate; apply `AuthorityRegistry.compareAndSwapRollback` to the same durable record; and verify the
selector exposes legacy only at a new monotonic epoch. Then run a bounded legacy canary and reject both the old dark
capability and any stale legacy epoch. The registry's reverse edge deliberately exposes `rollback_pending` between its
two atomic writes so the selector denies both writers after a crash
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:325-403`).

If rollback fails, keep admissions frozen or leave the mode at the last verified legacy-authoritative state. Preserve
all diagnostic and ledger evidence, block re-cutover and the fleet successor, and require root-cause repair plus a full
five-boundary rerun. If the drill successfully restores legacy and dark authority is still desired, freeze fresh
candidate-bound evidence and obtain a new single-use operator approval before another cutover. A source revert may
remove the composition wiring only after durable authority has been restored and verified; reverting code while the
record still selects dark is not an operational rollback.
<!-- /ANCHOR:rollback -->
