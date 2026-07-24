---
title: "Verification Checklist: Compiled Routing Staged Activation Cutover (P4)"
description: "SUPERSEDED by 013-compiled-coverage-buildout. This packet's authorized cutover attempt correctly halted at sk-prompt via stop-on-first-failure when the real Lane C parity gate classified all seven hubs legacy-fallback-drifted; that classification was itself a parity-harness bug (selectionKind label, both-fail-gold conflation, resource-projection namespace/granularity), not real routing drift. 013 diagnosed and fixed all 4 harness/coverage root causes and completed the flip: all 7 hubs are compiled-serving (0 drift each) and DEFAULT_ON_HUBS now lists all 7 in both resolver copies (7dfffa0c93)."
trigger_phrases:
  - "compiled routing P4 cutover checklist"
  - "staged activation verification gate"
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
      - "spec.md"
      - "decision-record.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "None — resolved by 013; spec.md/plan.md/decision-record.md still narrate the pre-013 gated state (out of this reconciliation pass's scope)"
    answered_questions:
      - "The join gate is GREEN; the fixed order starts with sk-prompt and ends with sk-code."
      - "Was sk-prompt's drift real routing breakage? No — confirmed a parity-harness classification bug; sk-prompt reached compiled-serving (5/0) from the harness fix alone (013, commit e56361ee53)."
      - "Did the real flip execute 011's own staged one-hub-at-a-time persistence? No — 013 hand-implemented a single reconciling commit (7dfffa0c93) once all 7 hubs had independently cleared parity; 011's controller stayed a dry-run prover."
---
# Verification Checklist: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | The cutover cannot advance while unchecked |
| **[P1]** | Required | Must be verified or explicitly deferred by the operator |
| **[P2]** | Optional | May defer with an owner and reason |

**SUPERSEDED BY 013.** Rows distinguish **[x] Verified** evidence from **[ ] Not reached/Not applicable** items, each with a reason. This packet's authorized attempt found the join gate GREEN, then the real Lane C gate stopped at `sk-prompt`, whose sub-verdict was `legacy-fallback-drifted` (0 matches, 5 drifts) — the halt itself was the CORRECT call under stop-on-first-failure. That drift was later root-caused in `013-compiled-coverage-buildout` to four issues, all fixed: (a) three parity-harness classification bugs — the `selectionKind` label (surfaceBundle misclassified for ties), a both-fail-gold conflation (match required gold-achievability instead of pure behavioral parity), and a resource-projection namespace/granularity mismatch (commit `e56361ee53`); (b) a fourth harness refinement, the non-route/surface-layer exemption (SD-015, commit `6ba5f2957f`); and (c) genuinely thin compiled coverage on 4 hubs (sk-design, sk-doc, system-deep-loop, mcp-tooling), built out across commits `f9f639674b` and `b03b1dd882`. All 7 hubs are now independently confirmed `compiled-serving` (0 drift each; re-confirmed live during this reconciliation pass for `sk-doc` 32/0 and `sk-prompt` 5/0, matching the packet's recorded numbers for the other five), and `DEFAULT_ON_HUBS` lists all 7 in both resolver copies as of `7dfffa0c93`. Rows below keep the honest historical record of what THIS packet's own execution found and built; rows whose criterion is a fleet end-state now cite the 013 resolution.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-001 [P0] | The coverage-closure join gate is green for every input | Enumerated join-gate status table | Verified — controller reports GREEN; 7/7 hubs READY |
| [x] CHK-002 [P0] | Siblings `013`/`014` are implemented-and-verified, not "available" | Sibling verification records | Verified — 013 (compiled-coverage-buildout) shipped COMPLETE (`7dfffa0c93`); the planned 014 (Lane C benchmark alignment) never became its own child folder — its scope was subsumed by 013's harness-fix commits `e56361ee53`/`6ba5f2957f` |
| [x] CHK-003 [P0] | `002` cohort state and `010` `activate --rollback` exist and are verified | Prerequisite-verification record | Verified — consumed read-only; drill 23/0 |
| [x] CHK-004 [P0] | Frozen scorer baseline is captured | Three SHA-256 values | Verified — pins match |
| [x] CHK-005 [P1] | The ascending-blast-radius hub order is recorded with its basis | Hub-order decision record | Verified — recorded in controller (`sk-code` last) |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-010 [P0] | Cohort resolution is exact: N-advanced ⇒ exactly N compiled under `unset` | Cohort-resolution test matrix | Verified — proof, 8 steps all ok |
| [x] CHK-011 [P0] | `=0` overrides any per-hub cohort default | Kill-switch-precedence fixture | Verified — `=0` forces legacy at every step |
| [x] CHK-012 [P0] | The per-hub gate runs the five checks in order and stops on the first failure | Ordered-gate driver test | Verified — dry-run sequence, stop-on-first-failure |
| [ ] CHK-013 [P1] | The atomic rewriter advances cohort + directive + catalog together | Atomic-rewrite unit/integration test | Not reached by this packet's own atomic-rewriter code — 013 hand-implemented the real advance instead (`7dfffa0c93` moved cohort + 7 directives + 2 templates + 7 catalog leaves together in one commit), achieving the same lockstep property via a different code path; this packet's controller stayed dry-run-only |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-020 [P0] | Route-gold parity is exact per hub (compiled == legacy) | Lane C normalized decision-parity report | Verified via 013, not this packet's own re-run — all 7 hubs now `compiled-serving`, 0 drift each (sk-code 23, sk-design 38, sk-doc 32, sk-prompt 5, mcp-tooling 14, system-deep-loop 21, cli-ext 8; `7dfffa0c93`); directly re-confirmed live during this reconciliation pass for sk-doc (32/0) and sk-prompt (5/0) |
| [x] CHK-021 [P0] | Each advanced hub reads `compiled-serving` | Status-probe readout per hub | Verified — `compiled-route-status.cjs` re-run live for all 7 hubs during this reconciliation pass: every hub reports `servingAuthority: compiled`, `causeCode: compiled-serving`, `manifestFreshness.fresh: true` |
| [x] CHK-022 [P0] | Fallback is clean under drift and under `=0` | Drift and `=0` legacy-return fixtures | Verified — `=0` and invalid flag both resolve legacy |
| [x] CHK-023 [P0] | Frozen scorer digests are unchanged after every hub | Before/after SHA-256 per hub | Verified — three digests unchanged |
| [x] CHK-024 [P0] | The `=0` kill-switch drill returns legacy fleet-wide | Fleet-wide rollback probe | Verified — full cohort legacy under `=0` |
| [x] CHK-025 [P0] | Per-hub `activate --rollback` restores byte-exact prior manifests | Prior-manifest restore receipts | Verified — drill 23/0, restoredHash == priorManifestHash |
| [x] CHK-026 [P1] | The five non-hub archetypes stay legacy by construction | Non-hub exclusion fixture | Verified — fixtures 32/0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-030 [P0] | All seven hubs advanced only through their five-check gate | Per-hub gate logs | Verified in substance for all 7 hubs — route-gold parity, `compiled-serving` status, clean fallback, frozen-scorer integrity, and `=0` kill-switch each independently confirmed (013); not executed as a single run through this packet's own gate sequence code — 013 hand-implemented the persistence step |
| [x] CHK-031 [P0] | Every cut-over hub's directive and catalog agree on posture | Per-hub lockstep-agreement audit | Verified — all 7 `SKILL.md` files carry the identical default-on + `SPECKIT_COMPILED_ROUTING=0` kill-switch wording (spot-checked live across all 7 during this reconciliation pass); catalogs updated per commit `7dfffa0c93` |
| [x] CHK-032 [P0] | Both create-skill parent templates are in the lockstep set and reconciled | Template membership + reconcile record | Verified — `parent-skill-hub-template.md` and `scaffold/hub-skill-scaffold.md` both list all 7 hubs by name plus the `SPECKIT_COMPILED_ROUTING=0` kill-switch, with an inert-until-activated clause for newly scaffolded hubs (confirmed live) |
| [x] CHK-033 [P0] | The normalized-parity fixture is green across templates, directives, catalogs, docs | Parity fixture result | Verified — `compiled-routing-parity.vitest.ts`'s live cross-hub assertion ("every live hub manifest reads servingAuthority: compiled") is part of the 258/258 green suite; lockstep docs landed together in `7dfffa0c93` |
| [ ] CHK-034 [P1] | `sk-code` (surfaceBundle) was cut over last | Cutover-order audit | Not applicable as originally conceived — the real flip was not a live one-hub-at-a-time persist; `7dfffa0c93` added all 7 hubs to `DEFAULT_ON_HUBS` in one reconciling commit once each had independently cleared parity. `sk-code` was among the FIRST hubs to reach `compiled-serving` (`e56361ee53`), not cut over last |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-040 [P0] | No environment secret or prompt content is persisted by cutover evidence | Evidence-schema review | Verified — evidence holds hashes/status only |
| [x] CHK-041 [P0] | Failures return to legacy rather than throwing into the routing path | Error-injection tests | Verified — resolver fails safe; clean-fallback proven |
| [x] CHK-042 [P1] | Kill-switch precedence cannot be overridden by cohort or manifest state | `=0` with advanced-cohort fixture | Verified — `=0` beats full cohort |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-050 [P0] | Each hub's default-on + `=0` wording lands only at that hub's stage | Phase-gated wording audit | Verified — no wording changed while this packet's own gate was blocked; the eventual default-on wording landed fleet-wide only once all 7 hubs independently cleared parity (`7dfffa0c93`) |
| [ ] CHK-051 [P0] | Spec, plan, tasks, checklist, and summary agree on status | Cross-document status audit | Partial — checklist and summary now record the superseded-by-013 resolution; `spec.md`/`plan.md`/`decision-record.md` still narrate the pre-013 gated/BLOCKED state. This reconciliation pass is explicitly scoped to checklist.md + implementation-summary.md only; reconciling the remaining three docs is a follow-up |
| [x] CHK-052 [P1] | Per-hub evidence uses repo-relative provenance, never absolute worktree paths | Provenance review | Verified — evidence uses repo-relative paths |
| [x] CHK-053 [P1] | Strict validation reports zero errors | Validation log | Verified — strict validation reports Errors 0 / Warnings 0 |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-060 [P0] | Runtime reads no cohort or manifest state from under `.opencode/specs` | Resolved module/path inspection | Verified — runtime reads the promoted closure under `.opencode/bin` |
| [x] CHK-061 [P0] | Per-hub cutover evidence uses `007`'s durable convention | Report-path contract test | Verified — all 7 hubs carry archived runs under `<hub>/benchmark/compiled-routing/<run-label>/` (confirmed on disk during this reconciliation pass: `luna-high-real-*` and `luna-high-verify-*` for all 7; `luna-high-acceptance-*` for 2/7 so far) |
| [x] CHK-062 [P1] | No frozen scorer file is modified | Before/after SHA-256 comparison | Verified — byte-identical, not in diff |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-100 [P0] | The three cutover decisions have explicit implementation consequences | Decision-to-task traceability matrix | Verified — controller implements ADR-001/002/003 |
| [x] CHK-101 [P0] | No hub cutover begins before the join gate is green | Entry-gate records | Verified — gate BLOCKED ⇒ no cutover attempted |
| [x] CHK-102 [P1] | Rollback exists and is proven at every hub stage | Per-hub rollback drill output | Verified — drill 23/0 |
| [x] CHK-103 [P1] | Routing-decision identity remains an invariant across the cutover | Full normalized parity result | Verified — 013's full normalized parity result is `compiled-serving` (0 drift) on all 7 hubs; the earlier drift was a parity-harness classification bug, not a routing-decision change |
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-110 [P1] | Cohort resolution adds no unbounded work per request | Bounded resolution profile | Verified — Set membership, O(1) per hub |
| [x] CHK-111 [P1] | The status readout stays diagnostic and outside the hot decision path | Call graph or timing evidence | Verified — probe is diagnostic; `probeEngine` opt-in |
| [ ] CHK-112 [P2] | Per-hub cutover latency delta is recorded | Before/after per-hub measurement | Gated — no cutover executed |
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-120 [P0] | No fleet-wide `unset=on` posture is ever set | Cohort-advance audit | Verified — cohort advance only; proof asserts N ⇒ N |
| [x] CHK-121 [P0] | `=0` kill-switch is documented and exercised fleet-wide | Fleet-wide rollback probe | Verified — kill-switch drill passes |
| [x] CHK-122 [P0] | Per-hub prior manifests are retained before each advance | Manifest-retention inventory | Verified — drill proves retention + byte-exact restore |
| [x] CHK-123 [P1] | Stop-on-first-failure is enforced across the loop | Cutover driver or runbook evidence | Verified — sequence stops at first failure |
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-130 [P0] | Each hub's default-on wording satisfies the phase-gated authoring contract | Wording-vs-stage review | Verified — no hub's wording changed while this packet's own gate was blocked (the phase-gated contract held); default-on wording for all 7 landed only once every hub independently cleared parity, in the single reconciling commit `7dfffa0c93` |
| [x] CHK-131 [P0] | Frozen scorer pin is honored across all hubs and at completion | Digest ledger | Verified — pins honored before/after |
| [x] CHK-132 [P1] | Cutover evidence contains no secrets or raw prompt retention | Schema and fixture review | Verified — hashes/status only |
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

| Item | Verification Criterion | Planned Evidence | Status |
|------|------------------------|------------------|--------|
| [x] CHK-140 [P0] | Authoritative contracts remain in `spec.md` and `decision-record.md` | Cross-document ownership review | Verified — contracts unchanged; ADRs authoritative |
| [ ] CHK-141 [P1] | The join gate and per-hub sequence are synchronized across supporting docs | Spec-doc diff review | Partial — checklist/summary now reflect the superseded-by-013 resolution; `spec.md`/`plan.md`/`decision-record.md` remain historical (out of this reconciliation pass's scope, see CHK-051) |
| [x] CHK-142 [P1] | Follow-ups list every earlier-child dependency this phase consumes | `implementation-summary.md` review | Verified — follow-ups list 013/014 + consumed children |
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Cutover owner | [x] Execution authorized; stop-on-first-failure honored at `sk-prompt` | 2026-07-21 |
| Runtime owner | P4 controller implementation owner | [ ] Blocking condition resolved (root cause fixed in 013, this packet superseded); formal owner sign-off is a separate act this reconciliation pass does not grant on the owner's behalf | |
| Benchmark owner | Frozen-scorer and parity owner | [ ] Blocking condition resolved (all 7 hubs compiled-serving, 0 drift each, scorer bytes unchanged); formal owner sign-off is a separate act this reconciliation pass does not grant on the owner's behalf | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 31 | 30/31 | Resolved via 013; only cross-doc sync with the frozen planning docs (CHK-051) remains partial |
| P1 Items | 16 | 13/16 | This packet's own atomic-rewriter/cutover-order mechanism was never invoked (013 used a different path); doc sync with frozen planning docs remains partial |
| P2 Items | 1 | 0/1 | Per-hub latency delta was not explicitly measured by the eventual flip |

**Verification Date**: 2026-07-21 — reconciliation pass: live re-confirmation of `compiled-route-status.cjs` (all 7 hubs), route-gold parity spot-checks (sk-doc 32/0, sk-prompt 5/0), the 258/258 skill-benchmark Vitest suite, byte-identical resolvers, and frozen-scorer SHA-256 pins, cross-referenced against 013's commits (`f19ee17179`..`7dfffa0c93`).

**Verification Scope**: The coverage-closure join gate, the per-hub five-check stop-on-first-failure loop, atomic lockstep registry, cohort resolution and `=0` precedence, non-hub exclusion, frozen-scorer integrity, byte-exact per-hub and fleet rollback, and (new) the eventual fleet-wide resolution recorded in 013.

**Current Boundary**: SUPERSEDED. This packet's own authorized attempt correctly halted at `sk-prompt` — the join gate was GREEN, but the real Lane C parity gate then classified all seven hubs `legacy-fallback-drifted` at the time, which stop-on-first-failure honored by leaving `DEFAULT_ON_HUBS` empty and every directive, catalog, template, manifest, and frozen scorer unchanged. That drift was a parity-harness bug plus thin coverage on 4 hubs, both fixed in `013-compiled-coverage-buildout`. As of `7dfffa0c93`, all 7 hubs are `compiled-serving` (0 drift each) and `DEFAULT_ON_HUBS` lists all 7 in both resolver copies — re-confirmed live during this reconciliation pass. This packet's own controller and verification harness (`controller/cutover-controller.cjs`, `verification/verify-cutover.cjs`) remain dry-run-only; 013 hand-implemented the actual persistence.
<!-- /ANCHOR:summary -->
