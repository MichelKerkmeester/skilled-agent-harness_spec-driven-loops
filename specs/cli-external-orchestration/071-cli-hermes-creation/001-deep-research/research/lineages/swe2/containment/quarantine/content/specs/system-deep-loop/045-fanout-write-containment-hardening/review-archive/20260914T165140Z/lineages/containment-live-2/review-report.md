# Review Report: packet 045 — fan-out write containment hardening

**Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`, Level 3)
**Run**: `fanout-containment-live-2-1789159071284-irnvcb` (generation 1, mode `new`)
**Executor**: `cli-pi` / `deepseek-v4.1-flash` (reasoning effort max)
**Iterations**: 1 of 1
**Stop reason**: `maxIterationsReached` — convergence was **not** achieved

---

## 1. Executive Summary

**Verdict: CONDITIONAL**

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 5 |
| Active P2 | 2 |
| `hasAdvisories` | false |
| `releaseReadinessState` | `in-progress` |
| Dimensions covered | 4 of 4 |
| Convergence achieved | no |

**Scope.** The packet's own documents (`spec.md`, `acceptance-criteria.md`, `plan.md`,
`tasks.md`, `implementation-summary.md`, `research/synthesis.md`); the runtime the packet
changes (`write-containment.ts`, `executor-config.ts`) and the three test files its criteria
cite; the four `/deep:*` command YAMLs; and the documentation surfaces its Files to Change
table names — the hub `SKILL.md`, the runtime library `README.md`, both mode packets' loop
protocols, and the fan-out feature catalog entry. Twenty files read; no file modified.

**Why CONDITIONAL and not PASS.** Five P1 findings stand, all of them contradictions in the
packet's account of itself rather than defects in the shipped guard. They are required before
the packet can carry a truthful record, and three of them would misroute whoever picks the
packet up next.

**Why CONDITIONAL and not FAIL.** No P0 is reachable here, and that is a considered result.
The destructive defect this packet exists to fix is genuinely fixed: `write-containment.ts:782`
defaults the remedy to `preserve`, and `fanout.vitest.ts:379` pins the out-of-scope file still
holding the lane's bytes after enforcement. No containment path deletes a file. The P1→P0
ladder — "demonstrated data loss, security breach, or hard-gate failure" — is not cleared by a
documentation contradiction whose correcting authority is present in `spec.md`. F003 comes
closest, and it is discussed under the adversarial check below.

**The one structural caveat.** This review stopped on its iteration ceiling, not on
convergence. The severity-weighted new-findings ratio is 0.70 against a 0.10 threshold, and
because the target touches path handling, persistence, schema boundaries and shared policy the
security-sensitive override requires `minStabilizationPasses = 2` — unreachable at a ceiling of
1. The verdict therefore rests on a single pass. It is reported as such rather than dressed as
a converged review, and a follow-up run at `--max-iterations=3` or higher would be needed to
produce a legal convergence stop.

---

## 2. Planning Trigger

Route to planning. The verdict is CONDITIONAL because five active P1 findings remain, so the
next step is `/speckit:plan` for remediation rather than `/create:changelog`.

The remediation is unusual in that none of it is design work. Every P1 is a reconciliation
between artefacts that already exist: three documents disagree about what has shipped, one
planning document predates the research that answered its own open question, and one
documentation surface plus three YAML comment blocks were left in the pre-change wording.
There is no open design question for a planner to resolve, and no test to write.

**Ordering constraint.** F001, F002 and F007 should be handled first and as one unit. They are
the same defect seen from three angles — a packet that has landed three of its requirements
while its shipped-state surfaces deny it — and fixing one without the others leaves the packet
reading as though nothing has landed. The concrete cost of leaving them: the packet has no
`handover.md` and no `checklist.md`, so `/speckit:resume` reaches `_memory.continuity` second
in its ladder, and both continuity blocks still say `completion_pct: 0` with
`next_safe_action: "Implement Phase 1"`. The next session will re-plan work that is done.

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | Iterations |
|----|-----|-----------|-------|----------|-----------|
| F001 | P1 | traceability | `implementation-summary.md` contradicts itself: a 2,539-passing verification table sits above a body that says nothing was built | `implementation-summary.md:96`, `:54`, `:45`, `:66`, `:16` | 1 |
| F002 | P1 | traceability | Acceptance-criteria closure block contradicts its own criteria table; Status contradicts `spec.md` | `acceptance-criteria.md:98`, `:100`, `:50`; `spec.md:36` | 1 |
| F003 | P1 | traceability | `plan.md` not updated after the research that answered its open question; M3 gate still certifies the sweep hazard | `plan.md:306`, `:45`; `spec.md:273`; `research/synthesis.md:34` | 1 |
| F004 | P1 | traceability | Review loop protocol carries none of the two containment rules; review-mode readers routed to the research packet | `deep-review/.../loop-protocol.md:280`; `deep-research/.../loop-protocol.md:287`; `SKILL.md:128`; `spec.md:96` | 1 |
| F005 | P1 | maintainability | Superseded containment wording survives in three command YAML surfaces | `deep-review-confirm.yaml:1213`; `deep-research-confirm.yaml:1141`; `deep-review-auto.yaml:1516`; `write-containment.ts:782`; `fanout.vitest.ts:402` | 1 |
| F006 | P2 | maintainability | Two live-probe markers stranded in `tasks.md` with no owning task | `tasks.md:298`, `:299`; `write-containment.ts:807` | 1 |
| F007 | P2 | traceability | Stale `_memory.continuity` blocks in both packet documents route the next session to a landed phase | `acceptance-criteria.md:17`, `:19`; `implementation-summary.md:16`; `tasks.md:38` | 1 |

No finding was refined, resolved, deferred or disproved. All seven are active as written, and
each carries a typed claim-adjudication packet embedded in `iterations/iteration-001.md`.

---

## 4. Remediation Workstreams

### WS-1 — Reconcile the packet's account of what has shipped (F001, F002, F007)

*Blocks nothing technically; blocks the packet's own closure gate and misroutes the next session.*

1. **F001** — `implementation-summary.md`. The verification table at `:96`–`:101` is correct
   and should stay. The body must be brought up to it: replace "Nothing yet" (`:54`) with a
   per-phase record naming what has landed — preserve-by-default, baseline-targeted restore,
   outcome separation — each with its implementation surface and its pinning test; replace
   "Not yet changed" (`:66`) and "Not delivered" (`:74`) with the same record; update
   `Completed | Not completed` (`:45`) and the frontmatter description (`:3`); refresh the
   continuity block at `:14`–`:17`. Do not delete the unimplemented-work statements wholesale —
   the worktree phase and churn detection genuinely have not shipped, and the body should say
   so.
2. **F002** — `acceptance-criteria.md`. Rewrite the closure paragraph (`:100`) so it names the
   four unmet criteria as its reason instead of asserting nothing is built, and align the
   `Status` field (`:50`) with `spec.md:36`.
3. **F007** — both `_memory.continuity` blocks. Refresh `last_updated_at`, `recent_action`,
   `completion_pct` and `next_safe_action` against the twelve completed tasks in `tasks.md`,
   and replace the all-zero `session_dedup.fingerprint` placeholder with a real fingerprint so
   staleness becomes machine-detectable instead of human-detectable.

`tasks.md` should land in the same pass: `CHK-140 [P1] All packet documents are synchronized
with the shipped behaviour` is its own unchecked criterion, and it is currently failed.

### WS-2 — Update the plan from the answered research (F003)

*Gate for Phase 4, not for Phase 1–3.*

Transcribe `spec.md:273` into `plan.md` as a precondition on the worktree milestone:

1. A liveness gate on the startup sweep of the shared worktree prefix — PID-stamped,
   heartbeat-refreshed, or the existing lease projected into the worktree namespace.
2. Copy-back write semantics for the main checkout, which today has no lock, ownership claim
   or ordering against four possible concurrent writers.
3. Replace the M3 criterion at `plan.md:306` with the concurrent negative control: run B
   starts while run A is live, and every one of A's worktrees survives. The current M3 asserts
   only that no lane-authored change appears in the main checkout, which a destructive sweep
   satisfies.

Also close `plan.md:45` — the worktree lane decision is still an open checkbox.

### WS-3 — Finish the caller and documentation migration (F004, F005, F006)

*This is the residue of `AC-011`, which the packet records `Unmet`.*

1. **F004** — add the two containment rules to
   `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`,
   mirroring `deep-research/references/protocol/loop-protocol.md:287-290`, or amend
   `spec.md:96` to record that the rules are deliberately single-sourced and update
   `SKILL.md:128`'s routing accordingly. Either resolution closes it; leaving both is the
   current state.
2. **F005** — rewrite the three stale surfaces. `deep-review-confirm.yaml:1213` and
   `deep-research-confirm.yaml:1141` should describe preserve-by-default and the opt-in
   restore flag; `deep-review-auto.yaml:1516` should lose three comment lines that currently
   contradict the code directly beneath them.
3. **F006** — remove the two stranded probe markers at `tasks.md:298-299`, or convert the
   second into something load-bearing: a concurrent write landing *after* the baseline
   snapshot is exactly the case `write-containment.ts:807` handles, and a test reference for
   it would be worth more than a comment.

---

## 5. Spec Seed

Minimal spec delta implied by the findings. No requirement changes; record-keeping only.

- **REQ-003 / REQ-006 status.** `spec.md` §4 lists all six requirements without a status
  column, while `acceptance-criteria.md` records four criteria `Unmet`. Add a status field
  per requirement so the specification itself says which requirements have landed. F001 and
  F002 both exist because that information lives only in the criteria table, where a reader
  who arrives through `spec.md` will not look.
- **REQ-001 quarantine path.** The specification names `containment/quarantine/` as the
  destination. The shipped destination is `containment-reverted/` plus `containment/baseline/`.
  Either amend the requirement to name the shipped paths or restate it to describe the
  capability — a recoverable copy inside the lineage directory — and leave the path to the
  implementation. Not raised as a finding; recorded here so the divergence does not survive
  as an unresolved guess.
- **Reset the closure gate's evidence dates.** `acceptance-criteria.md:14` reads
  `last_updated_at: "2026-09-08T18:20:00Z"` and `recent_action: "Wrote eleven closure
  criteria"`, both falsified by the seven `Met` rows added later.

---

## 6. Plan Seed

Action-ready tasks. Each names its finding and its target file.

| # | Task | Finding | Target |
|---|------|---------|--------|
| R1 | Bring the planned-stub body of `implementation-summary.md` up to its own verification table — shipped/unshipped per phase, no blanket denial | F001 | `implementation-summary.md:3, :14-17, :45, :54, :66, :74` |
| R2 | Rewrite the closure paragraph to name the four unmet criteria; align `Status` with `spec.md` | F002 | `acceptance-criteria.md:50, :98, :100` |
| R3 | Refresh both `_memory.continuity` blocks and replace the zero fingerprint | F007 | `acceptance-criteria.md:14-19`, `implementation-summary.md:14-17` |
| R4 | Add the worktree-phase preconditions and swap M3 for the concurrent negative control | F003 | `plan.md:45, :306` |
| R5 | Add the two containment rules to the review protocol, or record the single-source decision | F004 | `deep-review/.../loop-protocol.md` |
| R6 | Rewrite the three stale containment descriptions | F005 | `deep-review-confirm.yaml:1213`, `deep-research-confirm.yaml:1141`, `deep-review-auto.yaml:1516` |
| R7 | Remove or convert the stranded probe markers | F006 | `tasks.md:298-299` |
| R8 | Tick `CHK-140` only after R1–R3 and R7 land and a re-grep confirms synchronisation | — | `tasks.md` |

**Verification for R1–R3 and R7.** A re-grep for the superseded phrases — `Nothing yet`,
`no implementation exists`, `Nothing is built yet`, `Left this document as a planned stub` —
should return no hits across the packet, and `acceptance-criteria.md`'s closure paragraph and
`spec.md` §1 should agree on status.

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| `spec_code` | core | hard | **partial** | REQ-001 preserve half (`write-containment.ts:782`), REQ-002 (`:807`, `:811`, `:732`) and REQ-003 (`:48`) resolve to shipped behaviour pinned by `fanout.vitest.ts:379/411` and `write-containment.vitest.ts:231/180`. REQ-001's quarantine half, REQ-004 and REQ-005 have no implementation. |
| `checklist_evidence` | core | hard | **partial** | Every acceptance-table citation spot-checked resolved exactly: `fanout.vitest.ts:379`, `:391`, `:395`, `:411`; `write-containment.vitest.ts:172`, `:180`, `:231`; `fanout-pool.vitest.ts:238`; `executor-config.ts:688`. The same evidence is denied by `implementation-summary.md:96`. No `checklist.md` exists at Level 3; `tasks.md` carries inline `CHK-` rows instead. |
| `skill_agent` | overlay | advisory | notApplicable | Target type is `spec-folder`. |
| `agent_cross_runtime` | overlay | advisory | notApplicable | Target type is `spec-folder`. |
| `feature_catalog_code` | overlay | advisory | **partial** | `feature-catalog/fanout/fanout-run.md:56` describes containment windows generally; the preserve-by-default paragraph `spec.md:98` asks for is absent. No separate finding raised. |
| `playbook_capability` | overlay | advisory | **not_executed** | Not enumerable inside a one-iteration budget. Listed in Deferred Items rather than reported as passing. |

**Unresolved core gaps.** Both core protocols are `partial`, so the hard traceability gate does
not pass and the verdict cannot rise above CONDITIONAL on traceability grounds alone, quite
apart from the finding counts.

---

## 8. Deferred Items

- **`playbook_capability` (advisory, not executed).** The playbook corpus was not enumerated.
  Reported as deferred, not as passing. A follow-up run should execute it against the packet's
  target type.
- **`feature_catalog_code` residue (advisory).** `spec.md:98` lists
  `feature-catalog/fanout/fanout-run.md` for "The containment paragraph and the
  orchestrator-owned-paths note". The preserve-by-default paragraph is not there. Carried
  inside F005's workstream rather than as its own finding, because the fix is one paragraph in a
  file already being edited.
- **Suite counts not reproduced.** The reported results — 2,539 passed / 6 failed across the
  runtime suite, 54 passed for containment, 223 passed for fan-out and pool, 19 passed / 1
  skipped for the end-to-end stress reproduction — are taken as reported from
  `implementation-summary.md:96`–`:101` and cross-referenced against `acceptance-criteria.md`.
  Running the Vitest suites would write outside this lineage's declared directory, which the
  lineage's write-containment contract forbids. The individual line citations were verified
  instead, which is the part a stale table would have falsified. The six runtime failures are
  declared unrelated to containment by the packet and were not adjudicated here.
- **Target changed under review.** `implementation-summary.md` was rewritten by a concurrent
  editor in the main checkout mid-pass (its mtime 22:39:04; this lineage's first write
  22:42:11). Affected findings were re-derived against the post-write bytes; F002, F003, F004,
  F005, F006 and F007 were re-verified and their evidence is unchanged. A reviewer who reopens
  this report should treat every packet-document citation as an observation at the timestamp
  above rather than as a permanent property of the tree.
- **Two limitations the packet now records against itself, carried as residual risk rather than
  as findings.** `implementation-summary.md:111` — containment does not run when an artefact or
  stop-policy gate rejects the lane first, so an out-of-scope write by a failing lane goes
  unreported; this is the intended ordering and also a detection gap worth knowing when reading
  `AC-001`'s stress result. `implementation-summary.md:112` — the `cli-pi` leaf can emit
  duplicate state records for one iteration, and the max-iterations validator refused a live
  run that produced five; this blocks the `max-iterations` stop policy on that executor until
  fixed. It is directly relevant to this lineage, which runs as `cli-pi`; this run emitted
  exactly one state record per iteration and did not need the max-iterations validator to accept
  its stop, so it neither reproduced nor ruled out the defect.
- **`resource_map_present` is false.** `resource-map.md` is absent from the packet, so no
  Resource Map Coverage Gate section is due in this report and no coverage audit ran.
- **F001–F005 carry P1 severity; F006 and F007 are P2.** P2 findings do not block PASS on their
  own; they are listed here as tracked debt so they do not disappear. Both are cheap.
- **No P0 was found, and that is a result rather than a gap.** If a follow-up run finds one, the
  verdict moves to FAIL and the final line must read exactly `Review verdict: FAIL`.

---

## 9. Audit Appendix

### Iteration table

| Run | Focus | Dimensions | Ratio | New findings | Status | Iteration file |
|-----|-------|-----------|-------|--------------|--------|----------------|
| 1 | all four dimensions | correctness, security, traceability, maintainability | 0.70 | 0 P0 / 5 P1 / 2 P2 | complete | `iterations/iteration-001.md` |

### Convergence signal replay

| Signal | Weight | Outcome |
|--------|--------|---------|
| Rolling average | 0.30 | Fail — single reading 0.70, far above `rollingStopThreshold` 0.08 |
| MAD noise floor | 0.25 | Fail — no historical distribution exists at one iteration |
| Dimension coverage | 0.45 | Pass on coverage (4 of 4 dimensions), fail on stabilization (`minStabilizationPasses = 2` required, 1 available) |

Replayed decision: **CONTINUE would be the correct legal answer**, but the `maxIterations = 1`
ceiling is a policy stop that outranks it. Persisted decision: `STOP` with
`stopReason: maxIterationsReached`, `convergenceAchieved: false`. Replay agrees with the
persisted record on the outcome and disagrees on its cause, and the disagreement is recorded
rather than smoothed: this run did not converge.

`blocked_stop` recorded at run 1 with `blockedBy: ["convergenceGate"]`. The legal-stop decision
tree passed `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`,
`hotspotSaturationGate`, `claimAdjudicationGate`, `candidateCoverageGate` and
`graphlessFallbackGate`, and failed `convergenceGate` and `fixCompletenessReplayGate`.

### Dimension breakdown

| Dimension | Verdict | Basis |
|-----------|---------|-------|
| Correctness | PASS | `write-containment.ts:782`, `:807`, `:732` behave as specified and are pinned by three test files. No correctness failure found. |
| Security | PASS | No remedy path deletes or destroys unattributable work; no `git clean` anywhere; quarantine and baseline destinations stay inside the lineage directory, matching NFR-S01 and NFR-S02. |
| Traceability | CONDITIONAL | F001, F002, F003, F004, F007. Both core protocols `partial`. |
| Maintainability | CONDITIONAL | F005, F006. The shipped code is well-commented; the defect is in the documentation and YAML prose around it, including one comment that contradicts the line beneath it. |

### Replay validation

Recomputed from stored JSONL only: `newFindingsRatio` 0.70, rolling-average vote fail, MAD vote
fail, coverage vote pass-on-coverage / fail-on-stabilization, `traceabilityChecks.summary`
consistent with the recorded coverage vote. Evidence, scope and coverage gates re-run against
stored findings: evidence gate passes (every finding carries `file:line`), scope gate passes
(all reviewed files inside the declared target and its named blast radius), coverage gate
passes on dimension count and fails on stabilization. The replayed decision matches the
persisted stop reason; the recomputed *justification* differs from the recorded one, as noted
above. No warning altered the outcome.

### Claim adjudication

Five typed packets emitted, one per new P1 (F001–F005), all embedded in
`iterations/iteration-001.md`. No new P0 exists, so no P0 packet is owed. `claim_adjudication`
event recorded with `passed: true` and `missingPackets: []`. F006 and F007 are P2 and owe no
packet.

### P0 replay

None to replay. The absence is load-bearing: this packet exists because an unattributable write
met an irreversible remedy, and the review's central question was whether that is still true.
It is not. `write-containment.ts:782` defaults to `preserve`, `write-containment.ts:745`
documents it, and `fanout.vitest.ts:379` pins the out-of-scope file retaining the lane's bytes
with `fanout.vitest.ts:395` recording the remedy as `preserved_in_head`.

### Write-containment disclosure

This lineage ran under the containment behaviour it was reviewing. All writes landed inside
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/containment-live-2/`.
`generate-context.js`, `validate.sh` and every git write operation were withheld by the
lineage's own contract, so continuity was not saved to the packet's canonical documents and
the repo's validator was not run. Those are out-of-scope for this lineage by construction, not
omissions, and the fan-out orchestrator owns both.

`resolveArtifactRoot` was not invoked: the artifact root was bound directly from
`config.fanout_lineage_artifact_dir`, per the lineage's execution contract.

### Live observation of the hazard under review

Mid-pass, `implementation-summary.md` was rewritten in the main checkout by a second writer
while this review was running. Timestamps: that file 22:39:04, this lineage's first artifact
write 22:42:11.

This is the packet's own hazard, observed rather than reconstructed — two writers in one
checkout, neither able to attribute the other's changes. The guard behaved correctly: nothing
was rolled back, the other writer's edits survived, and this review's findings were re-derived
against the new bytes instead of being silently invalidated. The event is reported as
methodology because it is evidence about the guard, not a defect in the packet.

What changed, and what it cost:

| Surface | Effect |
|---|---|
| F001 evidence and claim | Rewritten. The contradiction moved from cross-document to intra-document and strengthened. |
| F001 adjudication packet | `evidenceRefs` and `counterevidenceSought` rewritten; severity and confidence unchanged. |
| F002, F003, F004, F005, F006, F007 | Re-verified against current bytes; all evidence unchanged. |
| `spec_code` protocol | Extended, not altered: `implementation-summary.md:99` is now independent confirmation of the end-to-end behaviour already cited from `fanout.vitest.ts:411`. |

The review target was not read-only in the sense the loop protocol assumes. A reviewer who
reopens this report should treat packet-document citations as observations at this timestamp,
not as permanent properties of the tree.

### Coverage matrix

| Surface | Read | Findings |
|---------|------|----------|
| Packet documents (6) | yes | F001, F002, F003, F006, F007 |
| Runtime implementation (2) | yes | — |
| Runtime tests (3) | yes | — |
| Command YAMLs (4) | yes | F005 |
| Hub SKILL.md, runtime README (2) | yes | — |
| Mode-packet loop protocols (2) | yes | F004 |
| Feature catalog entry (1) | yes | — (advisory, carried in F005's workstream) |

---

*Report produced by the `containment-live-2` fan-out lineage. Verdict mapping: PASS if no P0 or
P1; CONDITIONAL if any P1 and no P0; FAIL if any P0. This run is CONDITIONAL.*
