---
title: "wave1-glm iteration 004 — Angle 9: architecture/containment"
loop: review
lane: wave1-glm
session: fanout-wave1-glm-1789465945073-px9i6h
iteration: 4 of 5
angle: 9
dimension_primary: correctness
dimension_secondary: maintainability
verdict: PASS
hasAdvisories: true
---

# Dimension / Focus

**Dimension:** correctness (primary), maintainability (secondary).
**Focus (Angle 9):** the containment architecture read as one system — detect → quarantine → remedy → ledger → merge — contradictions, dead paths, duplicated rules (the inline containment blocks in the command YAMLs beside the runner's), and validators with more than one call site.

# Files Reviewed

- The four command YAMLs' enforcement surfaces — the identifier census (`enforceWriteContainment|snapshotOutOfScopeDirtyPaths`): deep-review-auto ×16, deep-research-auto ×16, deep-review-confirm ×4, deep-research-confirm ×4 — plus the verbatim review-variant blocks already evidenced in iteration 1 (auto:1515-1538, the 4-branch strides, the section-validation at :1277)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — the enforcement core (:2930-2985: the dynamic import of write-containment.ts incl. `__internals`, the effect-gateway import (:2941-2943), the `orchestratorOwnedPaths` exemption list (:2972-2978), the `containmentRepoRoot` resolution, the mode lifecycle (:2984: CLI override → parsed config → `'preserve'`); the mode knob (:229-232, :2928, :3424 the second-writer latch, :3522 the call)
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` — the remedy contract: the banner (:19 "…alone, with a copy quarantined under the lineage directory"), `unrecoverable` as "the one outcome that is not a remedy" (:73-83), `recoverFrom` (:214), `recoveryHint` "the one patch a caller surfaces in its fatal message" (:256-266), `quarantinePath` (:269), the quarantine-time git-blob hash (:275), `PASS_QUARANTINE_DIR = containment/quarantine` under the lineage (:318)
- The lock contract, deep-review-auto:295-311 — `step_acquire_lock` (fail-closed on acquired=false), the three release paths (halt :303-305, cancel/pause :307-308, any-exit :310-311, idempotent), the platform caveat (:299: "macOS/BSD locking is advisory — best-effort single-writer, not a hard mutex across host calls; stale-lock override is confirm-only or explicit recovery-only")
- The dead-branch note, deep-review-auto:343 — "fork and completed-continue are deferred and no longer runtime-supported in this release"
- The validator call-site string census — `verify-iteration.cjs`: review-auto ×1, review-confirm ×0; `append-mode-event.cjs`: review-auto ×12, review-confirm ×2

Method note: the angle's five legs (contradictions / dead paths / duplicated rules / the remedy-arch / validator multiplicity) were pursued at the census + targeted-read layer; the ledger-interior and the prose remediation narratives were not read — the iteration's depth boundary (under Traceability).

# Scorecard

| Gate | Rating | Basis |
|------|--------|-------|
| evidence | pass | every finding cites the counted matrix or the exact lines; both killed-in-advance questions (dead paths, the lock contract) cite their closing lines |
| scope | pass | all surfaces in-scope (system-deep-loop + the command-YAML tree already swept for other questions); writes stayed in the ALLOWED-WRITE set |
| coverage | pass | contradictions: one systemic (F017); dead paths: negative (documented-dead, cited); duplicated rules: the ×5-surface matrix; remedy-arch: the contract read, the mode-boundary question flagged; validator multiplicity: two of three validators counted, the third flagged |

# Findings by Severity

## P0

None.

## P1

None.

## P2

### F017 — The containment promise diverges at three story levels: the comments promise, the inline code advises, the runner preserves

`[SOURCE: deep-review-auto.yaml:1515-1519,1528-1538 (the promise and the advisory, re-cited from F004); the ×16/×4/×4/×4 duplication census across the four command YAMLs; fanout-run.cjs:2984 (`containmentMode = override ?? parsedFanoutConfig.containment.mode ?? 'preserve'`), :3424 (the second-writer latch: "a detected second writer latches this run into preserve for good"), :3522 (the call); write-containment.ts:73-83, :318 (the remedy contract), :318-318 (the quarantine under the lineage)]`

The spec's duplicated-rules question resolves into a three-way divergence on the same mechanism. Level 1 — the comments, copied ×16 per auto YAML (×4 across the four trees) — promise: "Revert any NEW out-of-artifact-dir change it made, append a containment_violation event to the state log, and fail the iteration fail-closed." Level 2 — the YAML's own inline code at those sites — delivers: `console.error('write-containment advisory: …left on disk')` then `process.exit(dispatchExit)` — the dispatch's exit, not a containment failure. Level 3 — the runner, the actual enforcement surface for dispatched lineages — defaults to `containmentMode: preserve` (CLI → config → the literal `'preserve'`), which detects, records, and quarantines a copy under the lineage, but does not revert and does not fail; `restore` (the promised behavior) is the opt-in, and the second-writer latch (:3424) locks the run into preserve regardless. Meanwhile the remediation contract in the library (`unrecoverable` as "the one outcome that is not a remedy", the quarantine-time git-blob hash, the `recoveryHint` "the one patch a caller surfaces in its fatal message") describes exactly the machinery the default mode does not exercise. The mechanism is well-built and honestly typed; the promise chain above it disagrees with itself, and the shipped default is the weakest of the three stories. (Structure note: the review and research variants are copy-identical at the census level — 16/4/4/4 — so the drift risk is inter-surface, not inter-loop.)

**Recommendation:** one authority statement, in the library, naming which surface owns enforcement (the runner, not the YAML) and what the default mode actually does; then shorten the YAML comments to cite it. Alternatively, flip the default to `restore` — the promised behavior — and let the second-writer latch be the only preserve path.

### F018 — The mechanical post-dispatch gate is promised to both leaves but invoked by neither confirm-variant surface

`[SOURCE: the verify-iteration.cjs invocation census (review-auto ×1, review-confirm ×0); deep-review-auto.yaml (the post-dispatch-validate step, the ×1); both prompt packs, rendered from the same template, whose OUTPUT CONTRACT states "the workflow's post_dispatch_validate gate (`verify-iteration.cjs --loop-type review --artifact-dir <lineage> --iteration N`) exits 0 only when all three hold" (pack-001:113 = pack-002:113 = pack-004:113)]`

The census found exactly one `verify-iteration.cjs` invocation across the review variant pair — in the auto YAML. The confirm variant's count is zero: its post-dispatch validation either runs under a different mechanism (prose delegation to the interactive operator) or does not invoke the binary at all. Yet both variants render the same prompt pack, whose output contract tells the dispatched leaf that its three artifacts are validated by that gate with those exact flags. The consequence: the auto-variant leaf's iteration is mechanically gated (this lane's own iterations 1-3 each passed through it); the confirm-variant leaf's equivalent claims are self-certified — the same narrative/record/delta triad, the same final-line contract, but nobody runs the parser. For an interactive variant this may be deliberate (the operator is the gate), but the pack text does not say so, and the confirm variant's divergence ledger (iteration 1's F008, the twelve-omission cluster) already noted the pattern; this is its validation-leg instance.

**Recommendation:** either invoke the gate in the confirm variant's post-dispatch step (the cheapest parity) or add one sentence to the pack's STATE block: "in `:confirm` runs this gate is the operator's responsibility" — so the leaf's self-understanding matches who actually checks it.

# Traceability Checks

| Protocol | Class | Status | Evidence / notes |
|----------|-------|--------|------------------|
| spec_code | hard | partial | Angle 9 = "detect, quarantine, remedy, ledger and merge read as one system for contradictions, dead paths, duplicated rules (the inline containment blocks in the YAMLs beside the runner's) and validators with more than one call site" (strategy §13). Four of five legs traced end-to-end: contradictions (F017 — the systemic one found), dead paths (negative: the deferred branches are documented-dead, :343), duplicated rules (the ×5-surface, ×16/×4/×4/×4/×4 census), validator multiplicity (verify-iteration 1/0, append-gateway 12/2 — the third validator's call-sites, reduce-state.cjs's, uncounted). The ledger-interior and the merge leg (the lineage-merge machinery) were not read — the depth boundary. |
| checklist_evidence | hard | notApplicable | unchanged: no checklist.md in the target; the parent-REQ rows are assessed at synthesis. |

Summary: required 2, executed 1, pass 0, partial 1, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

# Assessment

- **Counts:** 2 findings — P0: 0, P1: 0, P2: 2 (F017-F018). All new; zero refinements. Cumulative: 18 open (P0 0, P1 1, P2 17), 0 resolved.
- **newFindingsRatio:** 2/(16+2) = 0.11 (formula (new + 0.5·refined)/(priorOpen + new + refined)); stuck_count 0 (0.11 > 0.05). durationMs = 149000 (pack-004 render T0=1789470306 → this checkpoint T2=1789470455; the artifact-compose window follows, consistent disclosure).
- **Novelty justification:** the containment-architecture census is new evidence — iterations 1-3 saw the mechanism only through the YAML-branch and dispatch-leaf lenses, never the runner's mode lifecycle, the remedy contract, or the validator multiplicity. F017 extends F004 (the comment-promise) to the architecture level (the promise chain), but the root cause — which surface owns enforcement — is newly identified, so it is recorded as a new finding, not a refinement.
- **Claim adjudication:** no new P0/P1 → the gate is vacuous-true; zero packets, zero missing. The adjudication event records activeP0P1: 0, passed: true.
- **Quality gates:** evidence — counted matrices and exact lines; scope — in-space reads, in-lineage writes; coverage — four of five legs traced, the fifth (merge) explicitly bounded.
- **Verdict logic:** no P0, no P1 → PASS, per pack-004:77; `hasAdvisories: true` (2 new; 17 cumulative) per pack-004:59. Third consecutive PASS.

# Ruled Out

1. **The lock contract (my earlier gray)** — answered: the contract is complete. Acquire fails closed on contention (:298), release covers all three terminal paths (:303, :307, :310) and is idempotent (:311), the stale-lock semantics are constrained to confirm-only or explicit-recovery-only, and the macOS/BSD advisory-lock limitation is stated in-place (:299). No undocumented failure path found. (Note for this lane's own synthesis: the contract demands the release as "the final step of any workflow exit path" — the synthesis phase will perform it, with the releasePhase honest-value note recorded there.)
2. **The dead-paths leg** — negative: the only dead branches found are the deliberately deferred ones (fork, completed-continue), marked dead in prose at the definition site (:343) with the note that the reducer still reads lineageMode for dashboards. No undocumented dead path.
3. **The orchestrator-owned-paths exemption** — the runner's containment exempts exactly three paths (the orchestration ledger, the summary, the observability twin, :2972-2978) and explains the heartbeat-timer interaction plus the prefix-collision design ("Named as whole paths so a neighbour sharing a prefix stays guarded"). Thorough; no finding.
4. **The inter-loop copy parity** — review ≡ research at the enforcement-identifier census (16/4/4/4, exactly parallel). Whatever drift exists is between YAML and runner, not between loop types. Negative.
5. **The ledger triptych coherence** — the run employs three ledgers (the mode ledger feeding the state projection, the audit ledger, the effect ledger fed by `dispatchExecutorEffect` at :2941-2943 for dispatch receipts). Each answers a distinct question; no overlap-contradiction found at this altitude. F003's mechanism split is now *quantified* by this iteration's census (append-gateway: auto ×12 vs confirm ×2) — recorded as a transition note strengthening F003, not a new finding.

# Dead Ends

- The reduce-state.cjs and convergence.cjs call-site counts (the third leg of the validator-multiplicity question) were not taken — the budget went to the containment core. The "validators with more than one call site" leg is therefore 2-of-3 counted. Carried.
- The mode-boundary gray: whether the quarantine copy is written in *preserve* mode too, or only in restore, is unresolved — the remedy contract (the types) and the mode lifecycle (:2984) were read at different depths. Carried.
- This lane's own effective containment mode: the default chain resolves to `preserve` unless the parent's fanout config sets `containment.mode: restore`; the parent's config value was not read (it lives in the parent's orchestration artifacts, outside the lineage). F017's downgradeTrigger lives there. Carried.

# SCOPE VIOLATIONS

None. Writes: `prompts/iteration-004.md` (pre-iteration), this narrative, `deltas/iter-004.jsonl`, `logs/iter-004-events.jsonl`, the sanctioned lane-direct state-log append, and the reducer/verify invocations' in-lineage outputs.

# Recommended Next Focus / Next Dimension

Iteration 5 (final) = **Angle 10 — state and ledger**: the gateway, the ledger schemas, the projections and reducers as one write path — exemptions, stems without producers, producers without stems, the projection's replace semantics (strategy §13 Angle 10 pointer), dimensions: security (primary) + correctness (secondary). Carry-overs: F003's projection-discriminator question (the scanner-vs-projection shape) is Angle 10's native question; F017's promise-chain (which surface owns the write path) terminates at the ledger; the three outstanding grays (the timeout values, the four unseen stress trees, the devin translation arm) plus this iteration's (the third validator's call sites, the mode-boundary quarantine question, the parent's containment.mode) fold into Angle 10's exemption/producer sweeps or the synthesis's UNKNOWN register.

Review verdict: PASS
