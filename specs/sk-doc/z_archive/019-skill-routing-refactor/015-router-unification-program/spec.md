---
title: "Feature Specification: Router-Unification Program"
description: "Phase parent for the fleet router-unification program: a reversible compiled policy, closed route decision algebra, shared recovery budget, destination-local execution, calibrated negotiation, offline correction, and the rollout, cleanup, onboarding, benchmark, and activation gates that make the contract operational."
trigger_phrases:
  - "router unification program"
  - "fleet routing consistency to unified refactor"
  - "compiled policy migration gates"
  - "router activation verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Conformed docs to updated strict validator"
    next_safe_action: "Rerun recursive strict validation for the program"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent stays lean: purpose, direct-child map, shared gates, and constraints.
  Detailed scope, plans, tasks, checklists, and evidence live in the child folders.
-->

# Feature Specification: Router-Unification Program

## EXECUTIVE SUMMARY

Implement the unified router refactor as a shadow compiler plus additive semantic gates, not as a router rewrite. The program freezes one content-addressed compiled policy, one closed `route | clarify | defer | reject` decision algebra, one shared recovery budget, destination-local `PREPARE → VERIFY → COMMIT`, calibrated negotiation, and an optional offline correction overlay. Legacy remains serving-authoritative until each activation gate passes; route-gold stays green and the shared benchmark scorer remains untouched.

Calibration is a first-class capability in this program. The held-out corpus and calibrated controller live under phase `008`, while the optional learning overlay remains offline and last under phase `010`. Parent-hub and non-hub rollout, live activation, the promoted runtime, cutover hardening, default-on policy, create-skill onboarding, benchmark alignment, and final coverage verification are separate direct children so each gate has one executable owner.

The design source is the sibling research synthesis at `../001-research/010-unified-refactor-research/unified-refactor-synthesis.md`. This parent records the unified contract and its migration gates; the children record implementation detail and evidence.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus |
|-------|--------|-------|
| 001 | `001-3-tier-consistency-standard/` | Establish the fleet-wide three-tier routing standard and its route-gold and freshness gates. |
| 002 | `002-default-mode-implementation/` | Ship the parent-hub `defaultMode` policy and its routing-helper fallback behavior. |
| 003 | `003-contract-schemas/` | Define versioned contract schemas, canonical serialization, domain-separated hashes, and offline validation. |
| 004 | `004-compiler-n1-shadow/` | Compile the N=1 case and prove shadow parity, fencing, and byte-exact rollback. |
| 005 | `005-decision-evaluator/` | Emit and validate the closed four-action decision algebra and typed route-gold projection. |
| 006 | `006-execution-verify-commit/` | Implement destination-local prepare, verify, commit, proof, receipts, idempotency, and stale-proof rejection. |
| 007 | `007-recovery-ladder/` | Implement the ordered clarify-to-handoff recovery ladder on one shared uncertainty budget. |
| 008 | `008-calibration/` | Build the held-out corpus, calibrated contract, and selective-classification controller. |
| 009 | `009-parent-hub-rollout/` | Activate the compiled contract per parent hub in blast-radius order with canary and rollback gates. |
| 010 | `010-learning-overlay/` | Build the optional offline correction overlay with independent promotion and pointer-CAS gates. |
| 011 | `011-fleet-cleanup/` | Retire legacy dual-read paths only after per-skill deletion gates pass. |
| 012 | `012-non-hub-rollout/` | Roll the compiled contract out to standalone non-hub skills with independent verification. |
| 013 | `013-live-activation/` | Bind the shadow-complete compiled contract to fenced live serving. |
| 014 | `014-runtime-engine/` | Promote the runtime resolver and engine to a stable path decoupled from the spec tree. |
| 015 | `015-cutover-hardening/` | Harden runtime cutover, no-spec-import guarantees, and drift-versus-breakage status reporting. |
| 016 | `016-default-on-decision/` | Decide and verify the effective default-on behavior and its reversible kill-switch. |
| 017 | `017-create-skill-alignment/` | Teach create-skill onboarding to express the compiled-ready contract deliberately. |
| 018 | `018-benchmark-alignment/` | Extend benchmark validation to the compiled-serving path and its parity evidence. |
| 019 | `019-routing-coverage-activation-verification/` | Build remaining hub coverage, verify activation, and close the end-to-end parity and rollback gates. This child retains its own internal children unchanged. |
| 020 | `020-root-router-document-standard/` | Standardize mandatory root `ROUTER.md` contracts, align create-skill and validation, migrate all seven hubs, and restore coherent compiled-serving freshness. **Complete as of 2026-08-16; the only remaining step is the deferred authoritative main-side DB/index scan.** |

## SHARED MIGRATION-GATE MODEL

Authority moves through gates, not file conversions. Each child must clear its stage before the next serving authority can activate, and every stage has a reversible rollback path.

| Stage | Gate | Owned by phase(s) |
|-------|------|-------------------|
| 0 — Baseline freeze | Record the full legacy baseline and frozen inputs. | `003`, `004` |
| 1 — Shadow compile | Canonical bytes regenerate, typed fixtures parse, and route-gold stays green. | `004` |
| 2 — Dual-read | Every legacy input resolves; unmapped inputs fail closed. | `004`, `009` |
| 3 — Shadow evaluate | Typed replay is deterministic, compatibility projection matches route-gold, and gold never auto-updates. | `005`, `009` |
| 4 — Per-hub canary | Hard mismatches are zero, identity/parity gates pass, and rollback is proven. | `009`, `019` |
| 5 — Offline overlay | Offline replay, safety/parity, independent approval, and byte-stable promotion pass. | `010` |
| 6 — Destination rollout | Proof, expiry, read-set, authority, epoch, idempotency, and receipt fixtures pass; read-only legs precede mutating legs. | `006`, `009`, `012` |
| 7 — Fleet cleanup | Each skill passes its deletion gate before legacy artifacts are retired. | `011` |

## HARD CONSTRAINTS

- Deterministic route-gold replay remains green; `router-replay.cjs` and the shared benchmark scorer are never edited.
- Serving authority remains destination-local. A proof or recommendation is evidence, never capability.
- Requests pin one activation generation; rollback swaps to the byte-identical prior manifest and cannot undo an external commit.
- Runtime serving paths do not read from the spec tree after promotion.
- Every default-on change is fenced, observable, reversible, and verified one hub at a time.

## RELATED DOCUMENTS

- **Design source:** `../001-research/010-unified-refactor-research/unified-refactor-synthesis.md`
- **Research layer:** `../001-research/`
- **Root packet:** `../spec.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `014-sk-code-router-alignment` |
| **Successor** | `016-documentation-quality-program` |
