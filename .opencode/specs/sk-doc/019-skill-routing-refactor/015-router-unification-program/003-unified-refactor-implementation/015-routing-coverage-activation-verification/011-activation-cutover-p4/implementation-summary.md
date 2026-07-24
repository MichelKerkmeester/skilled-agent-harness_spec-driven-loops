---
title: "Implementation Summary: Compiled Routing Staged Activation Cutover (P4)"
description: "SUPERSEDED by 013-compiled-coverage-buildout. Execution record for the terminal P4 cutover attempt: the coverage-closure join gate was GREEN, but the real Lane C compiled-routing parity run classified the first hub, sk-prompt, as legacy-fallback-drifted (5/5 rows red), so stop-on-first-failure correctly halted the staged flip before any mutation. That drift was a parity-harness classification bug plus thin compiled coverage on 4 hubs, both root-caused and fixed in 013. As of commit 7dfffa0c93, all 7 hubs are compiled-serving (0 drift each) and DEFAULT_ON_HUBS lists all 7 in both resolver copies."
trigger_phrases:
  - "compiled routing P4 cutover controller implemented"
  - "staged activation controller dry-run proven"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-21T12:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled: halt was correct; 013 fixed root cause, flipped all 7"
    next_safe_action: "None — superseded by 013 (7dfffa0c93); no further action here"
    blockers:
      - "None — the parity-harness bug and thin coverage that halted this attempt were fixed in 013"
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
      - "None — resolved by 013; spec.md/plan.md/decision-record.md still narrate the pre-013 gated state (out of this reconciliation pass's scope)"
    answered_questions:
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging; all 7 manifests are already servingAuthority: compiled."
      - "Coverage-closure join gate status? GREEN before the execution attempt."
      - "Was the sk-prompt drift real routing breakage? No — a parity-harness classification bug; sk-prompt reached compiled-serving (5/0) from the harness fix alone (013, e56361ee53)."
      - "How did the fleet actually reach default-on? 013 hand-implemented a single reconciling commit (7dfffa0c93) once all 7 hubs independently cleared parity — not a live run of this packet's own staged persister."
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
| **Status** | SUPERSEDED by `013-compiled-coverage-buildout`. This packet's own authorized attempt correctly halted at the first real parity gate: the coverage-closure join gate was GREEN, but `sk-prompt` classified `legacy-fallback-drifted` (5/5 rows red), so stop-on-first-failure halted before any staged mutation and zero hubs were cut over BY THIS PACKET. That drift was later root-caused in 013 to a parity-harness bug plus thin coverage on 4 hubs, both fixed; all 7 hubs are now `compiled-serving` and flipped default-on via `7dfffa0c93`. |
| **Date** | 2026-07-21 |
| **Level** | 3 |
| **Runtime change** | None FROM THIS PACKET's staged-flip attempt — the authored/promoted `DEFAULT_ON_HUBS` sets stayed empty and byte-identical at the time it ran. The eventual runtime change (all 7 hubs added to `DEFAULT_ON_HUBS` in both resolver copies) landed via sibling 013's hand-implemented persistence, not this packet's controller. |
| **Repository default** | Now default-ON for all 7 hubs (as of `7dfffa0c93`, delivered by 013). With the flag unset all seven hubs resolve compiled; explicit `SPECKIT_COMPILED_ROUTING=0` resolves all seven legacy (the kill-switch this packet proved still holds). |
| **Frozen scorer** | Byte-identical before and after this packet's own attempt (three SHA-256 digests match the pins); re-confirmed byte-identical live during this reconciliation pass; never opened for write. |
| **Verification** | This packet's own real Lane C classification (2026-07-21, pre-013-fix): all seven hubs reported `legacy-fallback-drifted`; first ordered hub `sk-prompt` blocked with 0 matches / 5 drifts. Post-013 (re-confirmed live during this reconciliation pass): all seven hubs `compiled-serving`, 0 drift each; `compiled-route-status.cjs` reports `fresh: true` for all 7; full skill-benchmark suite 18 files / 258 tests PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The coverage-closure join gate is now GREEN and the operator authorized the real staged cutover. The execution used the actual Lane C benchmark, not the controller's presence-only parity check, to classify all seven hubs before mutation.

Every hub classified `legacy-fallback-drifted`. In the fixed ascending-blast-radius order, the first hub is `sk-prompt`; its five eligible parity rows produced 0 matches and 5 drifts. The legacy and compiled action/target projection agrees, but the compiled observation fails the harness's independent route-gold resource check on every row. Because `compiled-serving` is the only admissible sub-verdict, the first gate is red.

Stop-on-first-failure halted the run before the authored resolver, promoted mirror, hub documentation, catalogs, or shared parent templates were changed. `DEFAULT_ON_HUBS` remained empty in both copies at the time. The explicit `=0` kill-switch remained intact, the frozen scorer hashes remained pinned, and the full 18-file / 247-test benchmark suite stayed green. The correct outcome of this attempt was zero flips and an upstream parity blocker, not a forced default-on cohort — and that caution was validated: the drift was real (as measured), but its CAUSE was a defect in the measuring instrument, not in the routing being measured.

**Resolution (superseded by 013).** Sibling packet `013-compiled-coverage-buildout` root-caused the fleet-wide drift to two independent problems, both fixed: (a) three parity-harness classification bugs — a `selectionKind` label bug that misclassified ties, a both-fail-gold conflation that required gold-achievability instead of pure behavioral parity, and a resource-projection namespace/granularity mismatch (commit `e56361ee53`), plus a fourth harness refinement exempting matched non-route decisions from gold (SD-015, `6ba5f2957f`); and (b) genuinely thin compiled coverage on 4 hubs — sk-design, sk-doc, system-deep-loop, and mcp-tooling — built out across commits `f9f639674b` and `b03b1dd882`. `sk-prompt`, the hub that blocked this packet's attempt, reached `compiled-serving` (5/0) from the harness fix alone — its underlying routing was never broken. Once all 7 hubs independently cleared parity (sk-code 23, sk-design 38, sk-doc 32, sk-prompt 5, mcp-tooling 14, system-deep-loop 21, cli-ext 8; 0 drift each), 013 hand-implemented the actual default-on flip in a single reconciling commit, `7dfffa0c93`: `DEFAULT_ON_HUBS` now lists all 7 hubs in both the authored and promoted resolver copies (confirmed byte-identical during this reconciliation pass), all 7 `SKILL.md` directives and both create-skill parent templates carry default-on + `SPECKIT_COMPILED_ROUTING=0` kill-switch wording, and the 3 frozen scorer SHA-256 digests remain unchanged. This packet's own controller and verification harness never executed a real persist — they stayed dry-run-only exactly as built; the eventual state this packet's plan targeted was reached through 013's separate, hand-implemented path.
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

### The staged-flip execution attempt

The real benchmark command ran once per hub with `--route-gold on --compiled-routing-parity on`. Classification results at the time (2026-07-21, pre-013-fix) were:

| Hub | Compiled sub-verdict (at the time) | Matches / drifts (at the time) | Cutover action (at the time) |
|-----|----------------------|------------------|----------------|
| `sk-prompt` | `legacy-fallback-drifted` | 0 / 5 | BLOCKED — first ordered hub; stop |
| `cli-external-orchestration` | `legacy-fallback-drifted` | 3 / 5 | Not attempted after stop |
| `mcp-tooling` | `legacy-fallback-drifted` | 1 / 13 | Not attempted after stop |
| `system-deep-loop` | `legacy-fallback-drifted` | 0 / 21 | Not attempted after stop |
| `sk-design` | `legacy-fallback-drifted` | 36 / 2 | Not attempted after stop |
| `sk-doc` | `legacy-fallback-drifted` | 0 / 32 | Not attempted after stop |
| `sk-code` | `legacy-fallback-drifted` | 3 / 20 | Not attempted after stop |

### Resolution: the same seven hubs, post-013 (current state)

013 root-caused every one of the above rows to a mix of harness bugs and thin coverage (see Executive Summary), fixed both, and the fleet was flipped default-on in `7dfffa0c93`. Re-run/re-probed live during this reconciliation pass:

| Hub | Compiled sub-verdict (now) | Matches / drifts (now) | `DEFAULT_ON_HUBS` |
|-----|-----------------------------|--------------------------|--------------------|
| `sk-prompt` | `compiled-serving` | 5 / 0 | yes |
| `cli-external-orchestration` | `compiled-serving` | 8 / 0 | yes |
| `mcp-tooling` | `compiled-serving` | 14 / 0 | yes |
| `system-deep-loop` | `compiled-serving` | 21 / 0 | yes |
| `sk-design` | `compiled-serving` | 38 / 0 | yes |
| `sk-doc` | `compiled-serving` | 32 / 0 | yes |
| `sk-code` | `compiled-serving` | 23 / 0 | yes |

`sk-doc` and `sk-prompt` were directly re-run live during this reconciliation pass (32/0 and 5/0 respectively, matching the packet's recorded figures exactly); the remaining five are cited from 013's commit trail and corroborated by the live `compiled-route-status.cjs` sweep (all 7 report `servingAuthority: compiled`, `causeCode: compiled-serving`, `manifestFreshness.fresh: true`) and by the 258/258-passing `compiled-routing-parity.vitest.ts`, which asserts live that every hub manifest reads `servingAuthority: compiled`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The join gate was re-evaluated live and returned GREEN. The real Lane C benchmark then classified every hub from its current playbook and compiled front door. The ordered execution stopped at `sk-prompt` before entering the persistence step, so the committed cohort and all lockstep documentation surfaces remained unchanged BY THIS PACKET.

Sibling `013-compiled-coverage-buildout` subsequently fixed the parity-harness bugs this stop had surfaced and built out the thin coverage on the four hubs that genuinely needed it, then hand-implemented the persistence step itself — a single reconciling commit (`7dfffa0c93`) rather than a live re-run of this packet's staged, one-hub-at-a-time loop. That commit's own follow-ups line explicitly flagged this packet's docs as needing reconciliation, which this pass performs.
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
| Treat the real Lane C sub-verdict as the parity authority | The controller's presence check does not execute compiled-vs-legacy scenario parity and cannot authorize a serving-default change. |
| Stop at `sk-prompt` with zero flips | The first ordered hub is not `compiled-serving`; continuing would violate the explicit stop-on-first-failure contract. |
| Consume the committed rollback/non-hub drills as child processes | Byte-exact rollback and non-hub exclusion are already proven by the audit child; the controller reuses that proof rather than re-deriving it. |
| Never open the three scorer files for write | The parity baseline the whole program rests on must stay byte-identical; the controller only hashes them. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frozen scorer before/after (three SHA-256) | PASS — byte-identical; digests match the pins; not in the diff |
| Coverage-closure join gate | PASS — GREEN for all seven hubs before classification |
| Real per-hub Lane C classification (this packet's own attempt, 2026-07-21) | BLOCKED at the time — all seven `legacy-fallback-drifted`; first hub `sk-prompt` had 0 matches / 5 drifts. Root-caused post-hoc to a parity-harness bug, not real routing drift — see below |
| Stop-on-first-failure | PASS — stopped before the first cohort or documentation mutation, exactly as designed |
| Cohort membership (at the time of this packet's attempt) | PASS — authored and promoted `DEFAULT_ON_HUBS` agreed and were both empty |
| `=0` kill-switch forces legacy fleet-wide | PASS — full cohort advanced still legacy under `=0`; control serves under unset |
| Per-hub rollback byte-exact (committed audit drill) | PASS — drill 23/0, restoredHash == priorManifestHash |
| Five non-hub archetypes stay legacy (committed fixtures) | PASS — fixtures 32/0 |
| Full skill-benchmark Vitest suite | PASS — 18 files / 247 tests (at the time) |
| Frozen scorer before/after (three SHA-256) | PASS — byte-identical; digests match the pins; not in the diff |
| Runtime path isolation | PASS — promoted serving closure reports 0 reads under `.opencode/specs` |
| Spec-folder strict validation | PASS — Errors 0 / Warnings 0 |
| **Post-013 resolution (re-confirmed live during this reconciliation pass, 2026-07-21):** | |
| Per-hub Lane C classification, current | PASS — all seven `compiled-serving`, 0 drift each; `sk-doc` (32/0) and `sk-prompt` (5/0) directly re-run live, remaining five cited from 013's commit trail |
| `compiled-route-status.cjs`, all 7 hubs | PASS — every hub reports `servingAuthority: compiled`, `causeCode: compiled-serving`, `manifestFreshness.fresh: true` |
| Cohort membership, current | PASS — authored and promoted `DEFAULT_ON_HUBS` both list all 7 hubs and are byte-identical (`diff` confirms) |
| Hub `SKILL.md` directive wording, all 7 | PASS — each carries `Compiled routing is now the default for <hub>; set SPECKIT_COMPILED_ROUTING=0 to force legacy routing fleet-wide` |
| Create-skill parent templates | PASS — both templates list all 7 hubs by name plus the `=0` kill-switch |
| Frozen scorer, current | PASS — three SHA-256 digests still byte-identical to the pins |
| Full skill-benchmark Vitest suite, current | PASS — 18 files / 258 tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Status

| Milestone | Status (this packet's own attempt) | Status (post-013, current) | Evidence Boundary |
|-----------|--------------------------------------|-------------------------------|-------------------|
| M0 join gate | PASS | PASS (unchanged) | Controller evaluates it live; all inputs GREEN |
| M1 first hub | BLOCKED | RESOLVED | `sk-prompt`'s drift was a parity-harness bug (013, `e56361ee53`); now `compiled-serving` 5/0 |
| M2 fleet advancing | Not executed; mechanism dry-run-proven | RESOLVED — via 013, not this packet's mechanism | All 7 hubs `compiled-serving`; `DEFAULT_ON_HUBS` on-disk lists all 7 (`7dfffa0c93`) |
| M3 `sk-code` landed | Not executed | RESOLVED, but not "last" as planned | `sk-code` was among the FIRST hubs fixed (`e56361ee53`); the final flip added all 7 simultaneously, not in ascending-blast-radius order |
| M4 effective default | Not reached | RESOLVED | Repository default is now ON for all 7 hubs; `SPECKIT_COMPILED_ROUTING=0` remains the fleet kill-switch; both create-skill templates carry fleet-default-on wording |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. ~~No hub is cleanly compiled-serving under the requested Lane C gate.~~ **RESOLVED by 013.** The first ordered hub's 5/5 drift rows were a parity-harness classification bug, not real routing drift; all 7 hubs are now `compiled-serving` (0 drift each), confirmed live during this reconciliation pass.
2. **The controller's dry-run parity check is weaker than the real gate.** Still true as a standing property of this packet's own mechanism — it confirms harness presence and frozen hashes but does not execute scenario comparisons; it never substituted for real Lane C classification, and never ran one for a real persist. The real persist that eventually shipped (`7dfffa0c93`) was hand-implemented in 013, not run through this controller.
3. **No per-hub rollback mutation was exercised by this packet's own controller.** Still true — zero hubs were ever flipped through this packet's own code path, so there was no new per-hub state for its rollback to remove; the committed rollback drill remains the byte-exact proof this packet produced. The real, shipped default-on state was written by 013's separate hand-implemented persistence, and per-hub cohort removal from that state is drilled and documented in 013, not here.
4. **The LUNA-HIGH archived evidence is still a bounded sample.** Still true — as of this reconciliation pass, `luna-high-acceptance-*` runs are archived for 2 of 7 hubs (`sk-code`, `sk-doc`); the full seven-hub real-model sweep remains an open follow-up, tracked separately per the operator.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] Repair the Lane C resource-projection failures beginning with `sk-prompt`; re-run all seven classifications and require `compiled-serving` before restarting persistence. — DONE in 013 (`e56361ee53`, `f9f639674b`, `b03b1dd882`, `6ba5f2957f`); all 7 now `compiled-serving`.
- [x] Re-mint the stale `system-deep-loop` and `sk-doc` activation manifests before any later cutover attempt. — DONE; both confirmed `manifestFreshness.fresh: true` live during this reconciliation pass.
- [~] After the first hub is clean, restart the staged loop from `sk-prompt` in the recorded order and stop at the next failure. — SUPERSEDED, not literally executed: 013 verified each hub independently across several commits, then hand-implemented a single reconciling commit (`7dfffa0c93`) that added all 7 to `DEFAULT_ON_HUBS` together, rather than a live restart of this packet's one-hub-at-a-time loop.
- [x] Reconcile the two create-skill parent templates at fleet completion and run the normalized-parity fixture. — DONE; both templates list all 7 hubs plus the kill-switch (confirmed live), and the live cross-hub parity assertion is part of the 258/258-passing suite.
- [ ] Extend the LUNA-HIGH acceptance run from the bounded sample to the full seven-hub sweep. — STILL OPEN. 2/7 hubs (`sk-code`, `sk-doc`) have an archived `luna-high-acceptance-*` run; the remaining 5 are tracked as a separate, in-flight effort per the operator.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

Three, all documented rather than silent:

1. **Scope extended from documentation-only to a built, dry-run-proven controller.** The authored spec framed this phase as authoring the controller *contract* only (its "Files to Change" listed the six docs). The implementing directive extended that to build and prove the controller in a dry run and reconcile the docs to Implemented. The controller and harness were therefore added under `controller/` and `verification/`; they are inert by construction, consume the committed runtime read-only, and change no runtime default, directive, catalog, template, manifest, or scorer. The critical invariant — enable-by-default is the gated P4 outcome, not something this pass executes — is honored: the repository default stays off and no hub's effective serving was lit.
2. **Shared create-skill templates reconciled last, not per hub.** As ADR-002 records, a shared template cannot be flipped for one hub without misdocumenting the others; the lockstep registry keeps both templates in the managed set throughout and marks them for fleet-completion reconciliation. No cutover has begun, so there is no execution delta.

The later authorized execution attempt introduced no scope deviation: it ran the specified real parity gate and obeyed stop-on-first-failure. The actual outcome at the time differed from the earlier dry-run expectation because every live Lane C sub-verdict was drifted; the docs recorded that result instead of treating harness presence as parity proof. That drift has since been root-caused and fixed (see Executive Summary / Resolution), and this reconciliation pass records the closed-out state.

3. **The eventual real flip was delivered by sibling 013, not by this packet's own controller in a "real" (persisting) mode.** Neither `cutover-controller.cjs` nor `verify-cutover.cjs` was ever extended to write a real persist — both remain exactly the dry-run provers described in "What Was Built." Once 013 fixed the harness and coverage gaps, it hand-implemented the actual `DEFAULT_ON_HUBS` write, directive/catalog/template rewrite, and manifest re-mint itself, landing in a single commit (`7dfffa0c93`) rather than as a live run of this packet's staged, stop-on-first-failure loop. The delivered end-state matches this packet's plan (per-hub parity proven, lockstep docs, kill-switch, byte-exact rollback); the mechanism that produced it does not match this packet's own code, and that is recorded here rather than implied.
<!-- /ANCHOR:deviations -->
