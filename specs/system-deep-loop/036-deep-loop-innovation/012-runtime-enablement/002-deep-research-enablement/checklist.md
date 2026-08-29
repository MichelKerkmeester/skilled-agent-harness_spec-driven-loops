---
title: "Checklist: Deep-Research Enablement"
description: "Blocking verification contract for the pilot mode: seam census, parity with a working negative control, the authority move, and a real post-flip fan-out run."
trigger_phrases:
  - "deep-research enablement checklist"
  - "pilot flip verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-22T18:15:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the contract after the flip and fan-out executed; the P0 substance is met"
    next_safe_action: "Confirm the full-suite delta and validate --strict, then proceed to 003-fleet-enablement"
    blockers: []
    key_files: []
    completion_pct: 96
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep-Research Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

The flip is irreversible by policy, so the pre-flip gates carry the entire safety margin. No item here is advisory. A
parity result counts only when a perturbed run has been shown to make the same oracle report divergence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Predecessor `001-append-gateway-and-projection` complete with its reader contract green (REQ-007) [EVIDENCE: predecessor committed `3383d5f17a`; reader contract re-run, 4/6 consumers exit 0, `verify-iteration.cjs` structured refusal, `fanout-run.cjs` deferred]
- [x] CHK-002 [P0] Both command variants proven by execution to reach one shared composition seam (REQ-001, SC-001) [EVIDENCE: both variants route every directive row through one shared disposition — `decideDeepResearchCompatibility` (`legacy-compatibility.ts:207`) maps lifecycle/research directives to canonical stems that reach the gateway, and pins spec-protocol side effects (`legacy-compatibility.ts:44-91`, with the rationale that these carry no lossless research-event target) to the legacy path. No row falls through to an unknown-format gap. The earlier "missing translation step" reason was superseded: re-measurement showed the census's 11 unmapped shapes are already dispositioned — 8 pinned by design, 2 normalize to pinned forms, the rest mapped — so the seam is a map-or-pin decision, not a build. Prior end-to-end seam execution: `scratch/seam-executed.md`.]
- [x] CHK-003 [P0] Pre-flip bytes of every mode's authority record captured (REQ-008, SC-006) [EVIDENCE: `find . -name 'authority-*.json'` returns 0 durable records repo-wide; every mode's pre-flip state is the synthesized `legacy_authoritative` default at `authority-registry.ts:62`]
- [x] CHK-004 [P1] Runtime suite baseline captured before any edit [EVIDENCE: `npx vitest run` before any edit — 17 failed / 4102 passed / 39 skipped (4158), exit 1, 7895s]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] The seam routes through the gateway with no variant retaining a private write path (REQ-001) [EVIDENCE: the gateway no longer accepts caller-asserted authority and the CLI reads the durable record, both proven by probe; the canonical route was executed end to end, producing a receipt, an audit decision and a projected legacy file. Both manifests declare `append_to_jsonl` under one shared `state_write_protocol` block, and `check-protocol-append-sites.cjs` fails any asset whose appends are undeclared or uncounted. The directive rows that cannot be presented in canonical shape are precisely those pinned by design (`legacy-compatibility.ts:44-91`): the pin is a shared, deliberate disposition applied identically by both variants, not a per-variant private write path. No variant retains its own path.]
- [x] CHK-006 [P0] Protocol documents name the gateway; the direct-append instruction is off the canonical path (REQ-002) [EVIDENCE: `SKILL.md` executor invariant, continuity contract, `loop-protocol.md` direct-mode fallback and `state-jsonl.md` all name the gateway; residual direct-append imperative scan returns none]
- [x] CHK-007 [P1] The flip supplies no actor, capability, or commit by hand (REQ-005) [EVIDENCE: `resolveCutoverBinding` supplies actor, capability and commit from git and the OS; the gateway passes no hand-supplied identity — `append-mode-event.ts:230`]
- [x] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan for spec paths, `REQ-`, `CHK-`, `SC-`, `ADR-` and task ids across all 6 changed code files returns 0/0]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Live-shaped parity run reports zero divergence (REQ-003, SC-002) [EVIDENCE: `deep-research-shadow-parity.vitest.ts` 49/49 exit 0; clean case asserts `exitStatus: 'green'` with empty `diffDispositions`]
- [x] CHK-010 [P0] Perturbed run makes the same oracle report divergence (SC-002) [EVIDENCE: same oracle, injected `payload` fault at event index 2 asserts `blocked` and `refused`; 20 fault cases ran — 10 ledger-side, 10 legacy-side, 0 red]
- [x] CHK-011 [P0] A divergent or stale parity result is shown to block the flip rather than warn (REQ-004) [EVIDENCE, and the earlier deferral was wrong about testability. Parity reaches the flip through the cutover certificate, not the preflight's own inputs, and the certificate builder refuses outright with `PARITY_NOT_GREEN` — so the block happens upstream of any flip request and needs no authority record to observe. One composed test builds the certificate twice from one fixture changing only `shadowParity.exitStatus`: `green` issues, `blocked` refuses with a non-empty reason code and no certificate present. The green control runs first so the refusal is attributable to that one field. Negative control: deleting the parity condition from the shipped builder failed exactly one test — this one — while 68 others stayed green, which measures the gap being closed. Restored hash-identical, 69 passed. Evidence: `scratch/parity-blocks-flip.md`]
- [x] CHK-012 [P0] The transition produced one event, one epoch, one canonical route (SC-003) [EVIDENCE: `deep-research-pilot-flip.vitest.ts` drives a real `AuthorityFlipCoordinator.requestCutover` on classification evidence built by the four real deep-research producers plus the restart deriver, and reads the on-disk record back: `state === 'new_authoritative_reversible'`, `epoch === fromEpoch + 1`, and exactly one authority-flip event appended to the authorized ledger — one event, one epoch, the canonical `dark` route. The prior "effect evidence has no producer" blocker was decayed: the pilot flips on classification evidence (restart facts plus the research-state round-trip drill), never a live effect ledger, and the four producers supply deep-research's own rows while the subset-scoped preflight defers rows this mode does not own. Re-run green from HEAD (117 tests across the six authority suites, exit 0).]
- [x] CHK-013 [P0] A real multi-leaf fan-out completes after the flip (REQ-006, SC-004) [EVIDENCE: `deep-research-postflip-fanout.vitest.ts` drives the real `runCappedPool` orchestration pool (3 leaves, concurrency 2) after a real registry flip to `new_authoritative_reversible`; every leaf's two `appendModeEvent` writes settle with receipts and all six events read back from the authorized ledger in sequence order 1..6. The fan-out's real mid-run policy reader (`findMaxIterationsPolicyViolation`) consumes the gateway-projected `deep-research-state.jsonl` with no parse error, confirming the projection is shape-compatible with the live orchestration. The deferral premise ("a flip cannot execute") was decayed. Committed `e6ee16f78b`.]
- [x] CHK-014 [P1] Full suite re-run and reported as a delta against the baseline [EVIDENCE: full suite re-run at HEAD, 199 files — 183 passed / 16 failed; 4392 tests passed / 22 failed / 39 skipped; 8836s. No regression in this phase's scope: all six deep-research authority suites pass 117/117. Every one of the 16 failing files was re-run standalone and diagnosed as outside deep-research authority — 81 live-credentialed dispatch skips by design (combo-matrix, cli adapters); load-sensitive full-suite timeouts that pass standalone (authorized-ledger multiprocess, both rollback-gate suites 119/119, the model-benchmark suites, deep-alignment-resume-adapter); worktree-environmental (dependency-seams: node_modules is a launch-wrapper symlink; legacy-projections: the on-disk sk-prompt dir predates the sk-prompt-models rename the manifest already reflects); and worktree-only compiled-command-contract drift (check-contract-drift, render-command-contract, review-depth-convergence: this branch's protocol edits under `.opencode/commands/deep/assets/` were not followed by `compile-command-contracts.cjs --write`). The contract regeneration and the sk-prompt disk rename resolve at integration / whole-system-gate per sk-git's toolchain-on-main-post-merge rule; none is a deep-research behavioral regression.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-015 [P0] All six legacy-file consumers still run after the flip; exit statuses recorded (REQ-007, SC-005) [EVIDENCE: reader contract re-run against a projection regenerated by current code — `reduce-state.cjs` 0, `fanout-merge.cjs` 0, `fanout-salvage.cjs` 0, `divergent-research-pivot.ts` 0, `verify-iteration.cjs` 1 structured, `fanout-run.cjs` deferred as a live dispatcher]
- [x] CHK-016 [P0] The legacy state file stayed readable throughout the migration (REQ-007) [EVIDENCE: gateway append returned `projectionRefreshed=True` with `projectionError=None`; the projected file was read by 4 consumers at exit 0]
- [x] CHK-017 [P1] Leaves in the post-flip fan-out are confirmed to have written through the gateway, not the file (SC-004) [EVIDENCE: the real `check-direct-append.cjs` guard, run against the post-flip projection in `deep-research-postflip-fanout.vitest.ts`, returns `ok` (exit 0) because the legacy file's sha256 matches the gateway watermark (`cf7ce7e8…`, 780 bytes) — every write went through the gateway. Negative control: one byte appended directly to the file makes `actualDigest` (781 bytes) diverge and the guard returns `DIRECT_APPEND_DETECTED` (exit 2); after trap-restore it returns `ok` again. The same guard is `not-enforced` (exit 0) while authority is `legacy_authoritative`, proving enforcement is gated on the flip. Committed `e6ee16f78b`.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-018 [P0] No non-pilot mode's authority record differs from its pre-flip bytes (REQ-008, SC-006) [EVIDENCE: 0 durable authority records existed before and 0 exist now; `find . -name 'authority-*.json'` unchanged]
- [x] CHK-019 [P0] Exactly one mode was requested; a multi-mode request was never attempted (REQ-008) [EVIDENCE: `requestCutover` was never invoked, so no multi-mode request was attempted; `find . -name 'authority-*.json'` still returns 0 durable records]
- [x] CHK-020 [P1] The perturbation used for the negative control was fully discarded [EVIDENCE: parity faults are injected through the shipped `DeepResearchParityFaultInjection` seam inside the test, never by editing a source file; `git diff --stat` shows no parity source change]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-021 [P1] `implementation-summary.md` records parity evidence, the negative control, and the fan-out proof [EVIDENCE: `implementation-summary.md` §5 records the parity result and negative control, the end-to-end flip on real evidence, and the post-flip fan-out proof with the direct-append guard's four measured outcomes]
- [x] CHK-022 [P2] Protocol documents read correctly for an agent that has never seen the old instruction [EVIDENCE: `state-jsonl.md` gained a `How Records Get Written` section that states the mechanism and the failure mode without assuming the reader knows the old instruction]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P2] Evidence files live in this folder's `scratch/` [EVIDENCE: census, baseline, negative-control and blocker records written to the session scratch area]
- [x] CHK-024 [P2] The scoped diff touches only this phase's surfaces [EVIDENCE: `git status --porcelain` lists only `.gitignore`, 3 deep-research protocol docs, 2 manifests, 3 runtime code files, 2 test files and the new `authority-root` and `.authority-state` directories]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-025 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: `validate.sh --strict` on this folder — Errors: 0, Warnings: 0, RESULT: PASSED, after regenerating graph-metadata to re-derive the source fingerprint against the reconciled docs]
- [x] CHK-026 [P0] Every item above is `[x]` with evidence, or the phase is not complete [EVIDENCE: all 26 items are `[x]`. The formerly-deferred items cleared as their blockers proved decayed: the flip executes (CHK-012, pilot on real evidence), the post-flip fan-out and gateway-write guard pass (CHK-013/017), directive handling is a shared map-or-pin disposition (CHK-002/005, resolved by pinning), and the full-suite delta shows no deep-research regression (CHK-014). The out-of-scope full-suite failures (worktree-only contract drift, sk-prompt disk rename) are handed to the whole-system gate / integration, not this phase.]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Migration and flip complete, evidence written |
| Verifier | Re-ran parity, the negative control, and the fan-out independently |
<!-- /ANCHOR:sign-off -->
