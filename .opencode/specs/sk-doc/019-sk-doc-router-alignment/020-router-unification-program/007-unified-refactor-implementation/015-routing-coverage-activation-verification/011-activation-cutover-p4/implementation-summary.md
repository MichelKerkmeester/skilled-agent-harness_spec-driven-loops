---
title: "Implementation Summary: Compiled Routing Staged Activation Cutover (P4)"
description: "Planned-state record for the terminal P4 cutover controller. The controller contract is authored (coverage-closure join gate, per-hub five-check stop-on-first-failure loop, atomic lockstep rewrites, cohort advance, shared-template reconcile, =0 and activate --rollback reverts); no hub has been cut over and no runtime default, directive, catalog, template, cohort state, manifest, or scorer has changed. Execution is gated on the join gate (015 children 002-010 + siblings 013/014 implemented-and-verified) and an operator go-ahead."
trigger_phrases:
  - "compiled routing P4 cutover planned summary"
  - "staged activation controller current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-20T21:44:54Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the Planned P4 controller doc set"
    next_safe_action: "Prove the join gate, then begin the per-hub loop"
    blockers:
      - "Depends on 015 children 002-010 and siblings 013/014 implemented-and-verified"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Concrete hub order within the ascending-blast-radius principle."
    answered_questions:
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging; all 7 manifests are already servingAuthority: compiled."
---
# Implementation Summary: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned. The P4 controller contract is authored; no hub has been cut over. Execution is gated on the coverage-closure join gate (015 children 002-010 + siblings 013/014 implemented-and-verified) and a separate operator go-ahead. |
| **Date** | 2026-07-20 |
| **Level** | 3 |
| **Runtime change** | None authored by this documentation phase |
| **Repository default** | Unchanged; compiled routing remains default-off; no hub cohort advanced |
| **Verification** | Packet strict validation run; Errors zero on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet authors the terminal P4 controller of the routing-coverage-activation-verification program: the staged, hub-by-hub mechanism that makes `SPECKIT_COMPILED_ROUTING` the effective default. No cutover has run. The controller advances the default one hub at a time via `002`'s per-hub cohort state — never a fleet-wide `unset=on`, because all seven activation manifests already read `servingAuthority: compiled` (`verification-v1.md` claim 6, 7/7 confirmed), so an `unset=on` would light the whole fleet at once.

Entry is blocked by a P3 coverage-closure join gate that requires the earlier `015` children and siblings `013`/`014` implemented-and-verified — the phrase deliberately replaces the old cyclic plan's weaker "available", which let the P4 gate pass empty (CF-ACT-7). Per hub, in ascending blast-radius order with stop-on-first-failure, five checks must be green before anything is rewritten: route-gold parity (compiled == legacy), `compiled-serving` status, clean fallback, unchanged frozen-scorer hashes, and a `=0` kill-switch drill. Only then does the controller atomically advance that hub's cohort default and rewrite its directive and catalog. The two shared create-skill parent templates are lockstep members that reconcile to fleet-default-on wording only when the seventh hub lands. The three frozen scorer files are never edited; compiled stays byte-identical to legacy; every step names a proven rollback.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### The coverage-closure join gate (entry precondition)

An enumerated, all-must-be-green gate: validated 7 catalogs + advisor entry, the 7-hub playbook matrix, Lane C compiled-parity pairs, LUNA-HIGH gold-bearing-holdout evidence, the create-skill ready fixture, the `verify_alignment_drift` markdown gate live, the single manifest-freshness eligibility predicate, the non-hub ineligibility policy, and siblings `013`/`014` implemented-and-verified.

### The per-hub cutover loop (five checks, then atomic rewrite)

Per hub, in ascending blast-radius order, stop-on-first-failure: route-gold parity → `compiled-serving` status → clean fallback → unchanged scorer SHA-256 → `=0` drill → THEN advance the cohort default and rewrite the directive and catalog atomically.

### The shared-template reconcile and rollback contract

Both create-skill parent templates tracked in the lockstep set, reconciled to fleet-default-on at fleet completion under a normalized-parity fixture; `SPECKIT_COMPILED_ROUTING=0` as the documented fleet-wide kill-switch and 010's `activate --rollback` as the per-hub byte-exact revert.

No runtime default, cohort state, hub directive, feature catalog, create-skill template, manifest, or frozen scorer file was changed while authoring this record.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery follows the ordered gates in `plan.md`: prove the coverage-closure join gate, then run the per-hub loop in ascending blast-radius order (`sk-code` last), then reconcile the shared templates. Each hub records parity, serving-status, fallback, scorer-integrity, and `=0`-drill evidence before the next hub can begin, and the run stops at the first failed gate with the failing hub and evidence preserved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences remain authoritative in `decision-record.md`.

| Decision | Status | Planned Effect |
|----------|--------|----------------|
| Advance the default per hub via cohort state, never fleet-wide `unset=on` | Accepted | Genuine per-hub staging with a real gate; `=0` stays the kill-switch |
| Atomic per-hub lockstep; shared create-skill templates reconciled last | Accepted | Directive + catalog + cohort agree per hub; templates never lead the cohort |
| Gate entry on a proven join gate; per-hub stop-on-first-failure + byte-exact rollback | Accepted | P4 cannot pass empty; a failure halts small and reversible |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Stage via cohort state rather than the manifest | All 7 manifests are already `servingAuthority: compiled`, so the manifest cannot stage; the cohort default is the only per-hub staging lever. |
| Require `013`/`014` implemented-and-verified, not "available" | The old P4 gate could pass with nothing proven and Planned siblings (CF-ACT-7); a real green needs the siblings verified. |
| Rewrite directive and catalog atomically per hub | A hub whose directive and catalog disagree on posture is a governance defect (CF-CAT-2). |
| Keep the create-skill templates in the lockstep set | They were omitted from the old P4 lockstep and still encode off-by-default wording (CF-TPL-1). |
| Pin the three scorer files at every hub and at completion | The parity baseline the whole program rests on must stay byte-identical. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Cohort staging vs fleet flip (ADR-001) | Decided: per-hub cohort advance; a fleet `unset=on` would light all 7 (7/7 compiled-serving) |
| Coverage-closure join gate | Specified; Planned — no input proven yet in this phase |
| Per-hub five-check loop | Specified; Planned — no hub cut over |
| Route-gold compiled-versus-legacy parity | Planned; consumes `004` Lane C per hub |
| `=0` kill-switch and `activate --rollback` drills | Planned for the cutover loop and closeout |
| Frozen scorer digest comparison | Planned per hub and at completion; the three files are never edited |
| Spec-folder strict validation | Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4 --strict`; Errors zero |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 join gate | Planned | No join-gate input proven in this phase |
| M1 first hub | Planned | No hub cut over |
| M2 fleet advancing | Planned | No cohort state advanced |
| M3 `sk-code` landed | Planned | Highest-blast hub not attempted |
| M4 effective default | Planned | Repository default remains off; templates not reconciled |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The controller is specified, not built.** This phase authors the P4 contract; the join-gate evaluator, per-hub loop, atomic rewriter, and reconciler are future work.
2. **The join gate depends entirely on earlier children.** It cannot go green until `015` children `002`-`010` and siblings `013`/`014` are implemented-and-verified; several are Planned today.
3. **Cohort state does not exist yet.** `002` owns the tri-state flag and per-hub `defaultEnabled` cohort state; without them there is nothing to advance.
4. **`activate --rollback` does not exist yet.** `010` owns it; without it there is no byte-exact per-hub revert.
5. **The concrete hub order is provisional.** The ascending-blast-radius principle is fixed (`sk-code` last); the exact sequence is confirmed at execution against per-hub route-shape and routing-volume evidence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Prove the coverage-closure join gate green: confirm every `015` child input and siblings `013`/`014` implemented-and-verified.
- [ ] Confirm `002`'s tri-state flag + cohort state and `010`'s `activate --rollback` exist and are verified before hub 1.
- [ ] Finalize the concrete ascending-blast-radius hub order against route-shape and routing-volume evidence; keep `sk-code` terminal.
- [ ] Execute the per-hub loop under the five-check stop-on-first-failure gate, archiving evidence through `007`'s durable convention.
- [ ] Reconcile the two create-skill parent templates at fleet completion and run the normalized-parity fixture.
- [ ] Drill `=0` fleet-wide and per-hub `activate --rollback`; confirm the five non-hub archetypes stayed legacy.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

One recorded, and it is a documented refinement rather than a scope change: the task frames the create-skill parent templates as flipping "atomic, at the same stage" as each hub, but a shared template cannot be flipped for one hub without misdocumenting the others. ADR-002 resolves this by keeping both templates in the lockstep set throughout and reconciling them to fleet-default-on at fleet completion under a normalized-parity fixture. The intent (never forget the templates; never let any surface lead its hub's posture) is preserved. No cutover has begun, so there is no execution delta to report.
<!-- /ANCHOR:deviations -->
