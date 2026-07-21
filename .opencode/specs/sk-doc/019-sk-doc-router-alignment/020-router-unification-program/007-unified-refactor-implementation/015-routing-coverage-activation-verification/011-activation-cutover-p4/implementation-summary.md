---
title: "Implementation Summary: Compiled Routing Staged Activation Cutover (P4)"
description: "Implemented-state record for the terminal P4 cutover CONTROLLER. The staged hub-by-hub controller (coverage-closure join gate, per-hub five-check stop-on-first-failure sequence, in-memory cohort-resolution proof, atomic lockstep registry, =0 kill-switch, and byte-exact rollback via the committed audit drill) is built under controller/ and verification/ and dry-run-proven 9/9. No hub has been cut over: the join gate is BLOCKED (siblings 013/014 Planned) and the repository default remains OFF by design. Execution stays gated on the join gate going green and an operator go-ahead."
trigger_phrases:
  - "compiled routing P4 cutover controller implemented"
  - "staged activation controller dry-run proven"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-21T02:20:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the cutover controller + harness; dry-run-proven 9/9; default off"
    next_safe_action: "Land 013/014 to green the join gate, then run under operator go-ahead"
    blockers:
      - "Join gate BLOCKED: siblings 013/014 and the create-skill ready fixture are Planned"
    key_files:
      - "controller/cutover-controller.cjs"
      - "verification/verify-cutover.cjs"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Concrete hub order within the ascending-blast-radius principle, confirmed at execution."
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
| **Status** | Implemented (controller). The staged hub-by-hub cutover controller and its verification harness are built and dry-run-proven (9/9 PASS). No hub has been cut over: the coverage-closure join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. Execution stays gated on the join gate going green and a separate operator go-ahead. |
| **Date** | 2026-07-21 |
| **Level** | 3 |
| **Runtime change** | None to the committed runtime. A dry-run controller (`controller/cutover-controller.cjs`) and verification harness (`verification/verify-cutover.cjs`) were added under this packet; they consume the committed runtime and audit drills read-only and flip nothing. |
| **Repository default** | Unchanged; compiled routing remains default-off; `DEFAULT_ON_HUBS` is empty on disk and in memory; the flag is unset; all seven manifests keep `servingAuthority: compiled` with no byte changed. |
| **Frozen scorer** | Byte-identical before and after (three SHA-256 digests match the pins); never opened for write. |
| **Verification** | `verification/verify-cutover.cjs` reports VERDICT PASS (9/9); packet strict validation Errors zero. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet builds and proves the terminal P4 controller of the routing-coverage-activation-verification program: the staged, hub-by-hub mechanism that would make `SPECKIT_COMPILED_ROUTING` the effective default one hub at a time. The controller is built and dry-run-proven; **no cutover has run**, by design.

The controller advances the default via `002`'s per-hub cohort state — never a fleet-wide `unset=on`, because all seven activation manifests already read `servingAuthority: compiled` (7/7 confirmed on disk), so an `unset=on` would light the whole fleet at once. Cohort advance is simulated **in memory** against the resolver's live exported cohort Set, proven exact (N advanced ⇒ exactly N compiled under an unset flag) and reversible (an explicit `=0` forces legacy for every hub), then restored — the on-disk cohort stays empty.

Entry is blocked by a P3 coverage-closure join gate that requires the earlier `015` children and siblings `013`/`014` implemented-and-verified. The controller evaluates that gate honestly and reports **7/7 hubs BLOCKED** — the create-skill ready fixture and siblings `013`/`014` are Planned. That BLOCKED result is the correct, honest output while those children are not landed, not a defect of the controller. The per-hub gate sequence (route-gold parity → `compiled-serving` status → clean fallback → unchanged frozen-scorer hashes → `=0` kill-switch drill) runs stop-on-first-failure in a dry run and flips nothing. Byte-exact rollback and non-hub exclusion are proven through the committed audit drill and fixtures. The three frozen scorer files are byte-identical throughout; compiled stays byte-identical to legacy; the repository default remains off.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### The controller (`controller/cutover-controller.cjs`)

A dry-run, inert-by-default library plus CLI that consumes the committed runtime read-only:

- **Coverage-closure join gate** — an enumerated, all-must-be-green entry precondition over nine inputs (7 catalogs + advisor entry; 7-hub playbook matrix; Lane C compiled-parity harness; LUNA-HIGH acceptance harness + archived verdicts; create-skill ready fixture; `verify_alignment_drift` gate; per-hub serving-status freshness predicate; non-hub ineligibility fixtures; siblings `013`/`014` implemented-and-verified). Reports per-hub READY/BLOCKED with the blocking reasons.
- **Cohort-resolution proof** — advances the resolver's exported cohort Set in memory (1..7 hubs) and asserts exactly N compiled under an unset flag, with an explicit `=0` forcing legacy at every step; always restored.
- **Per-hub gate sequence** — the five ordered checks (route-gold parity, `compiled-serving` status, clean fallback, frozen-scorer integrity, `=0` kill-switch), stop-on-first-failure, advancing and rewriting nothing.
- **Kill-switch drill** — the full fleet advanced in the cohort still resolves legacy under `=0`, with a non-vacuous control.
- **Lockstep registry** — the exact surfaces a real per-hub flip would rewrite together (cohort default + that hub's `SKILL.md` directive + its feature-catalog wording) plus the fleet-shared create-skill parent templates flipped last, emitted as data (rewriting nothing).
- **Repository-default invariant** — confirms the on-disk cohort is empty, the flag is unset, and every manifest keeps its committed serving authority.

### The verification harness (`verification/verify-cutover.cjs`)

Runs the whole proof, invokes the committed rollback and non-hub drills as child processes, hashes the frozen scorer before and after, and emits `verification/dry-run-evidence.json` with repo-relative provenance. VERDICT PASS (9/9).

No runtime default, cohort state, hub directive, feature catalog, create-skill template, manifest, or frozen scorer file was changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The controller and harness consume, and never modify, the committed foundation: the promoted resolver and serving-status probe (tri-state flag + per-hub cohort), the activation engine map, the Lane C parity harness, and the rollback/non-hub drills. Cohort advance and flag changes happen only in process, always restored in a `finally`, so the committed default is provably unchanged after every run. The join gate is re-evaluated live rather than trusting any cached claim; sibling verification reads each owner's implementation-summary status directly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

The full context, alternatives, and consequences remain authoritative in `decision-record.md`.

| Decision | Status | Effect |
|----------|--------|--------|
| Advance the default per hub via cohort state, never fleet-wide `unset=on` | Accepted; controller built | In-memory cohort advance proven exact (N ⇒ N); `=0` stays the kill-switch |
| Atomic per-hub lockstep; shared create-skill templates reconciled last | Accepted; controller built | Lockstep registry enumerates directive + catalog + cohort per hub; templates flip last |
| Gate entry on a proven join gate; per-hub stop-on-first-failure + byte-exact rollback | Accepted; controller built | Join gate reports honest per-hub BLOCKED; rollback proven byte-exact through the committed drill |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Simulate cohort advance in memory, never on disk | The controller must prove the mechanism while keeping the committed default off and byte-exact reversible. |
| Report the join gate BLOCKED honestly | The create-skill ready fixture and siblings `013`/`014` are genuinely Planned; a false green would be the exact defect this phase exists to prevent. |
| Consume the committed rollback/non-hub drills as child processes | Byte-exact rollback and non-hub exclusion are already proven by the audit child; the controller reuses that proof rather than re-deriving it. |
| Never open the three scorer files for write | The parity baseline the whole program rests on must stay byte-identical; the controller only hashes them. |
| Gate on artifacts and exit codes, not sibling doc-status prose | Several owner packets ship live, committed code while their `Status` line still reads "Planned"; the gate reads the real signal (except for `013`/`014`, where the Planned status agrees with git). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frozen scorer before/after (three SHA-256) | PASS — byte-identical; digests match the pins; not in the diff |
| Coverage-closure join gate | RAN; honest — 7/7 hubs BLOCKED (create-skill ready fixture + siblings `013`/`014` Planned) |
| Cohort resolution N ⇒ N under unset + `=0` precedence | PASS — 8 steps all ok (baseline + advance 1..7) |
| Per-hub dry-run gate sequence (stop-on-first-failure, no flip) | PASS — 7 hubs, all five checks green, action none |
| `=0` kill-switch forces legacy fleet-wide | PASS — full cohort advanced still legacy under `=0`; control serves under unset |
| Per-hub rollback byte-exact (committed audit drill) | PASS — drill 23/0, restoredHash == priorManifestHash |
| Five non-hub archetypes stay legacy (committed fixtures) | PASS — fixtures 32/0 |
| Committed repository default unchanged | PASS — cohort empty on disk + in memory, flag unset, 7 manifests intact |
| Verification harness verdict | PASS (9/9) — `verification/dry-run-evidence.json` |
| Spec-folder strict validation | Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict`; Errors zero |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status | Evidence Boundary |
|-----------|--------|-------------------|
| M0 join gate | BLOCKED (honest) | Controller evaluates it live; 7/7 BLOCKED on Planned `013`/`014` + create-skill fixture |
| M1 first hub | Not executed; mechanism dry-run-proven | No hub cut over; per-hub gate sequence proven for the canary hub in dry-run |
| M2 fleet advancing | Not executed; mechanism dry-run-proven | No cohort advanced on disk; in-memory advance proven exact |
| M3 `sk-code` landed | Not executed; dry-run-proven | Terminal hub gate sequence proven in dry-run |
| M4 effective default | Not reached (by design) | Repository default remains off; templates not reconciled; no flip authorized |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The controller is built and dry-run-proven, but no cutover has run.** Execution is gated on the join gate going green and an operator go-ahead; the repository default stays off by design.
2. **The join gate is BLOCKED.** Siblings `013`/`014` and the dedicated create-skill ready fixture are genuinely Planned (doc-authoring commits only), so the gate correctly reports 7/7 hubs BLOCKED.
3. **Per-hub route-gold parity is proven at the harness level, not re-derived per scenario.** The controller confirms the committed Lane C parity harness is present and its frozen-scorer baseline is intact; per-scenario parity is owned by the committed parity test suite.
4. **The LUNA-HIGH archived evidence is a bounded sample.** The acceptance harness is present and two archived verdicts exist; the full seven-hub real-model sweep remains the owner packet's follow-up.
5. **The concrete hub order is provisional.** The ascending-blast-radius principle is fixed (`sk-code` last, recorded in the controller); the exact sequence is confirmed at execution against route-shape and volume evidence.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Land siblings `013`/`014` (create-skill + benchmark alignment) implemented-and-verified so the join gate can go green.
- [ ] Add the dedicated create-skill ready fixture the join gate looks for.
- [ ] On a green join gate and an operator go-ahead, run the controller for real, per hub in ascending blast-radius order, archiving evidence through the durable convention.
- [ ] Reconcile the two create-skill parent templates at fleet completion and run the normalized-parity fixture.
- [ ] Extend the LUNA-HIGH acceptance run from the bounded sample to the full seven-hub sweep.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

Two, both documented rather than silent:

1. **Scope extended from documentation-only to a built, dry-run-proven controller.** The authored spec framed this phase as authoring the controller *contract* only (its "Files to Change" listed the six docs). The implementing directive extended that to build and prove the controller in a dry run and reconcile the docs to Implemented. The controller and harness were therefore added under `controller/` and `verification/`; they are inert by construction, consume the committed runtime read-only, and change no runtime default, directive, catalog, template, manifest, or scorer. The critical invariant — enable-by-default is the gated P4 outcome, not something this pass executes — is honored: the repository default stays off and no hub's effective serving was lit.
2. **Shared create-skill templates reconciled last, not per hub.** As ADR-002 records, a shared template cannot be flipped for one hub without misdocumenting the others; the lockstep registry keeps both templates in the managed set throughout and marks them for fleet-completion reconciliation. No cutover has begun, so there is no execution delta.
<!-- /ANCHOR:deviations -->
