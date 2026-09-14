# Review Report: packet 045 — fan-out write containment hardening

**Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`, Level 3)
**Run**: `fanout-worktree-live-1789221489298-ipjoou` (generation 1, mode `new`)
**Executor**: `cli-pi` / `deepseek-v4.1-flash` (reasoning effort max)
**Reviewed revision**: commit `2d7439c0a5` (2026-09-12), inside a dedicated git worktree
**Iterations**: 1 of 1
**Stop reason**: `maxIterationsReached` — convergence was **not** achieved

---

## 1. Executive Summary

**Verdict: CONDITIONAL**

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 6 |
| Active P2 | 3 |
| `hasAdvisories` | false |
| `releaseReadinessState` | `in-progress` |
| Dimensions covered | 4 of 4 |
| Convergence achieved | no |

**Scope.** The packet's own documents (`spec.md`, `acceptance-criteria.md`, `plan.md`,
`tasks.md`, `implementation-summary.md`, `goal.md`, `decision-record.md`,
`research/synthesis.md`); the runtime the packet changes (`write-containment.ts`,
`executor-config.ts`, `fanout-run.cjs` including the HEAD diff) and the three test files its
criteria cite; the four `/deep:*` command YAMLs; and the documentation surfaces its Files to
Change table names — the hub `SKILL.md`, the runtime library `README.md`, both mode packets'
loop protocols, and the fan-out feature catalog entry. Twenty-three files read; no file
modified.

**Why CONDITIONAL and not PASS.** Six P1 findings stand, all of them contradictions between
the packet's record and the tree, not defects in the shipped guard. They are required before
the packet can carry a truthful record, and four of them would misroute whoever picks the
packet up next: the summary denies shipped work, the closure gate denies its own table,
`plan.md` still certifies a disqualified milestone, and three operator-facing surfaces
describe the opposite remedy.

**Why CONDITIONAL and not FAIL.** No P0 is reachable here, and that is a considered result.
The destructive defect this packet exists to fix is genuinely fixed:
`write-containment.ts:696` defaults the remedy to `preserve`, `fanout.vitest.ts:379` pins
the out-of-scope file still holding the lane's bytes, no containment path deletes a file,
and a complete lane with findings settles `completed_with_containment_advisory`. F005 comes
closest to a P0 because it carries a false verification claim and operator-facing
misinformation; it stays P1 because nothing in those surfaces changes what the guard does
and the misinformation leads toward inaction, not destruction.

**The one structural caveat.** This review stopped on its iteration ceiling, not on
convergence. The severity-weighted new-findings ratio is 1.00 against a 0.10 threshold
(all nine findings are fully new against an empty prior registry), and the composite stop
score at one iteration is 0.45 against 0.60. The verdict therefore rests on a single pass,
and it is reported as such rather than dressed as a converged review. A follow-up run at
`--max-iterations=3` or higher would be needed for a legal convergence stop.

---

## 2. Planning Trigger

Route to planning. The verdict is CONDITIONAL because six active P1 findings remain, so the
next step is `/speckit:plan` for remediation rather than `/create:changelog`.

The remediation is almost entirely reconciliation, and none of it is design work: documents
disagree about what has shipped, a closure gate contradicts its own table, a plan predates
the resolution of its own open question, a migration claim is false against three surfaces,
and one task plus two limitations lag the last commit by hours.

**Ordering constraint.** F001, F002, F007 and F008 are the same defect seen from four
angles — a packet that has shipped most of its work while its shipped-state surfaces deny
or fail to record it — and they should land as one unit. The concrete cost of leaving them:
the packet has no `handover.md` and no `checklist.md`, so `/speckit:resume` reaches
`_memory.continuity` second in its ladder, and all four continuity blocks still say
`completion_pct: 0` with `next_safe_action` routing to Phase 1. The next session will
re-plan work that is done.

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | Iterations |
|----|-----|-----------|-------|----------|-----------|
| F001 | P1 | traceability | `implementation-summary.md` contradicts itself: green verification table for three shipped phases above a body that says nothing was built | `implementation-summary.md:97`, `:101`, `:102`, `:3`, `:16`, `:55`, `:75` | 1 |
| F002 | P1 | traceability | Acceptance closure block contradicts its own fourteen `Met` rows, miscounts the criteria, and its Status contradicts `spec.md` | `acceptance-criteria.md:101`, `:103`, `:63`–`:76`, `:50`; `spec.md:36` | 1 |
| F003 | P1 | traceability | `plan.md` predates the worktree resolution and the shipped phase; M3 still certifies the disqualified sweep-shaped criterion | `plan.md:306`, `:45`, `:91`; `spec.md:273`; `research/synthesis.md:34`; `tasks.md:101` | 1 |
| F004 | P1 | traceability | Review loop protocol carries no containment rule; task ledger says no change needed; hub still routes review readers to the research packet | `spec.md:96`, `:122`; `deep-review/.../loop-protocol.md:280`; `deep-research/.../loop-protocol.md:290`; `SKILL.md:128`; `tasks.md:81` | 1 |
| F005 | P1 | maintainability | AC-011 marked `Met` while superseded revert-and-fail-closed wording survives on three command-workflow surfaces | `deep-review-confirm.yaml:1213`; `deep-research-confirm.yaml:1141`; `deep-review-auto.yaml:1516`, `:1532`; `tasks.md:79`, `:126`; `acceptance-criteria.md:73` | 1 |
| F006 | P1 | maintainability | Known Limitations #6/#8 and open task T032 describe a pre-HEAD code state; the retry collision is fixed and the staging sweep is wired | `implementation-summary.md:115`, `:117`; `tasks.md:103`; `fanout-run.cjs:2794`, `:3152`; `fanout-run.vitest.ts:4459`, `:4513` | 1 |
| F007 | P2 | traceability | Four stale `_memory.continuity` blocks with all-zero fingerprints route the next session to landed phases | `acceptance-criteria.md:17`, `:25`; `implementation-summary.md:16`; `goal.md:17`; `decision-record.md:17` | 1 |
| F008 | P2 | traceability | Tasks verification checklist reports 0/36 verified while the verification tasks above it are complete with green-suite evidence | `tasks.md:244`–`:248`, `:119`, `:126`, `:188`, `:301` | 1 |
| F009 | P2 | traceability | Four line-anchored citations in the closure gate and its task mirror no longer resolve to the claim | `acceptance-criteria.md:66`, `:67`, `:68`; `tasks.md:40`; `executor-config.ts:688`, `:696`; `write-containment.vitest.ts:232` | 1 |

No finding was refined, resolved, deferred or disproved. All nine are active as written, and
each P1 carries a typed adjudication packet embedded in `iterations/iteration-001.md`.

---

## 4. Remediation Workstreams

### WS-1 — Reconcile the packet's account of what has shipped (F001, F002, F007, F008)

*Blocks the packet's own closure gate and misroutes the next session.*

1. **F001** — `implementation-summary.md`. The verification table at `:97`–`:103` is correct
   and should stay. The body must be brought up to it: replace "Nothing yet" (`:55`) with a
   per-phase record naming what has landed — preserve-by-default, baseline-targeted restore,
   outcome separation, the churn detector, the worktree phase — each with its implementation
   surface and pinning test; replace "Not yet changed" (`:67`) and "Not delivered" (`:75`)
   with the same record; update `Completed | Not completed` (`:46`) and the frontmatter
   description (`:3`); refresh the continuity block (`:14`–`:27`). Keep the genuinely
   unimplemented statements: T028's manual run and T032's remaining state are real.
2. **F002** — `acceptance-criteria.md`. Rewrite the closure paragraph (`:103`) so it names
   the open tasks (T028, T032) and the unchecked completion criteria as its reason instead
   of asserting nothing is built; correct "the eleven criteria" to fourteen; align `Status`
   (`:50`) with `spec.md:36`.
3. **F007** — all four `_memory.continuity` blocks. Refresh `last_updated_at`,
   `recent_action`, `completion_pct` and `next_safe_action` against the completed tasks in
   `tasks.md`, and replace the all-zero `session_dedup.fingerprint` placeholders with real
   fingerprints so staleness becomes machine-detectable.
4. **F008** — `tasks.md` verification checklist. Either verify the items against the
   evidence the completed tasks already carry, or record that the checklist is maintained at
   closure and the task evidence is authoritative until then — the present state says
   0/36 verified while the tasks above it are complete.

`tasks.md:301` (`CHK-140 All packet documents are synchronized with the shipped behaviour`)
should land in this pass; it is currently failed, and that is what the cluster records.

### WS-2 — Make the migration claim true (F004, F005)

*This is the residue of `AC-011`, which is currently marked `Met` on a false sweep.*

1. **F004** — either add the two containment rules to
   `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`,
   mirroring `deep-research/references/protocol/loop-protocol.md:287`–`:290`, or amend
   `spec.md:96` and REQ-006 to record that the rules are deliberately single-sourced and
   update `SKILL.md:128`'s routing accordingly. Either resolution closes it; leaving all
   three statements standing does not.
2. **F005** — rewrite the three stale surfaces. `deep-review-confirm.yaml:1213` and
   `deep-research-confirm.yaml:1141` (with their comment blocks at `:1176` and `:1104`)
   should describe preserve-by-default and the opt-in restore; `deep-review-auto.yaml:1516`–
   `:1520` should lose the five comment lines that contradict the code beneath them. Then
   re-run the T029 sweep for real before `AC-011` may be `Met`.

### WS-3 — Update the plan and the record from the shipped tree (F003, F006, F009)

1. **F003** — transcribe `spec.md:273`–`:288` into `plan.md`: the lease-based liveness proof
   (three independent conjuncts), run-keyed staged publication and reclamation ordering;
   replace M3 (`:306`) with the concurrent negative control; check the Definition of Ready
   (`:45`); refresh the affected-surface row (`:91`) so it matches T015's recorded decision.
2. **F006** — re-word limitation #6 (`:115`) and limitation #8 (`:117`) against the HEAD
   behaviour, and close T032 (`:103`) with its evidence: the sweep is called in `main()` at
   `fanout-run.cjs:3152` and test-pinned at `fanout-run.vitest.ts:4459`. Reconcile the
   2,639/2,643 suite-count delta while in the file.
3. **F009** — fix the four drifted citations: `executor-config.ts:688` → `:695`/`:696` in
   `acceptance-criteria.md:66` and `tasks.md:40`; `write-containment.vitest.ts:172`/`:180`
   → `:173`/`:181`; `:231` → `:232`.

---

## 5. Spec Seed

Minimal spec delta implied by the findings. No requirement changes; record-keeping only.

- **REQ-001 through REQ-006 status.** `spec.md` §4 lists all six requirements without a
  status field while the acceptance table records their outcomes. Add a status per
  requirement so the specification itself says which have landed — F001 and F002 both exist
  because that information lives only in the criteria table, where a reader who arrives
  through `spec.md` will not look.
- **REQ-006 surface list.** If the review loop protocol is deliberately single-sourced,
  amend REQ-006 and the Files to Change row at `spec.md:96` to say so; otherwise the
  protocol must be migrated. The current text names both loop protocols.
- **REQ-005 shipped-status note.** REQ-005's mechanics are resolved and built at unit level;
  record that T028's manual run and the default-flip decision remain the open items, so
  `plan.md` can be regenerated from the requirement rather than from the 2026-09-08 draft.
- **REQ-001 quarantine path.** The specification names `containment/quarantine/`; the tree
  also carries `containment-reverted/*.patch` and `containment/baseline/`. Either amend the
  requirement to name the shipped paths or restate it as the capability — a recoverable copy
  inside the lineage directory — and leave the path to the implementation. Not raised as a
  finding; recorded so the divergence does not survive as an unresolved guess.

---

## 6. Plan Seed

Action-ready tasks. Each names its finding and its target file.

| # | Task | Finding | Target |
|---|------|---------|--------|
| R1 | Bring the planned-stub body of `implementation-summary.md` up to its own verification table — shipped/unshipped per phase, no blanket denial | F001 | `implementation-summary.md:3, :14-27, :46, :55, :67, :75` |
| R2 | Rewrite the closure paragraph to name the open tasks; fix the criterion count; align `Status` with `spec.md` | F002 | `acceptance-criteria.md:50, :101, :103` |
| R3 | Refresh all four `_memory.continuity` blocks and replace the zero fingerprints | F007 | `acceptance-criteria.md:14-28`, `implementation-summary.md:14-27`, `goal.md:14-28`, `decision-record.md:14-27` |
| R4 | Reconcile the verification checklist with the completed verification tasks | F008 | `tasks.md:167-305` |
| R5 | Add the two containment rules to the review protocol, or record the single-source decision in spec and hub routing | F004 | `deep-review/.../loop-protocol.md`, `spec.md:96`, `SKILL.md:128` |
| R6 | Rewrite the three stale containment descriptions, then re-run the T029 sweep and update the evidence rows | F005 | `deep-review-confirm.yaml:1176, :1213`, `deep-research-confirm.yaml:1104, :1141`, `deep-review-auto.yaml:1516-1520`, `tasks.md:79, :126`, `acceptance-criteria.md:73` |
| R7 | Regenerate `plan.md` from `spec.md:273-288`; swap M3 for the concurrent negative control; check the Definition of Ready | F003 | `plan.md:45, :70, :91, :306` |
| R8 | Re-word limitations #6/#8 and close T032 with evidence | F006 | `implementation-summary.md:115, :117`, `tasks.md:103` |
| R9 | Fix the four drifted citations | F009 | `acceptance-criteria.md:66, :67, :68`, `tasks.md:40` |

**Verification for R1–R4 and R7.** A re-grep for the superseded phrases — `Nothing yet`,
`Nothing is built yet`, `Left this document as a planned stub`, `Not yet changed`,
`Not delivered`, `Implement Phase 1` — should return no hits across the packet, and
`acceptance-criteria.md`'s closure paragraph, `spec.md`'s status and the `_memory` blocks
should agree with `tasks.md`'s task state.

---

## 7. Traceability Status

| Protocol | Level | Gate | Status | Evidence |
|----------|-------|------|--------|----------|
| `spec_code` | core | hard | **partial** | REQ-001 (`write-containment.ts:696`), REQ-002 (`:1074`/`:1094`, pinned by `write-containment.vitest.ts:232`), REQ-003 (`fanout.vitest.ts:402`/`:411`) and REQ-004 (`executor-config.ts:701`, `fanout-run.cjs:3091` detector) resolve to shipped, test-pinned behaviour. REQ-005 is built at unit level with the resolved mechanics (`fanout-run.cjs:2794`, `:3152`; tests at `fanout-run.vitest.ts:4459`, `:4513`) but `plan.md` still gates it as unresolved and T028 is unperformed. REQ-006 is partial: the review protocol carries no rule and three command-workflow surfaces keep the superseded wording. |
| `checklist_evidence` | core | hard | **partial** | Four stress-suite citations resolved exactly (`fanout.vitest.ts:379`, `:391`, `:395`, `:411`); four others drifted (F009). AC-011's zero-occurrence sweep is false (F005); the closure paragraph denies its own table (F002); the tasks-side checklist is 0-verified while its verification tasks are complete (F008). No `checklist.md` exists at Level 3; `tasks.md` carries inline `CHK-` rows instead. |
| `skill_agent` | overlay | advisory | notApplicable | Target type is `spec-folder`. |
| `agent_cross_runtime` | overlay | advisory | notApplicable | Target type is `spec-folder`. |
| `feature_catalog_code` | overlay | advisory | **partial** | `feature-catalog/fanout/fanout-run.md:56` describes containment windows and orchestrator-owned exemptions; T016 records leaving it as written because detection did not change. The spec-named surface is unchanged, so the advisory protocol stays partial rather than pass. No separate finding raised. |
| `playbook_capability` | overlay | advisory | **not_executed** | Not enumerable inside a one-iteration budget. Listed in Deferred Items rather than reported as passing. |

**Unresolved core gaps.** Both core protocols are `partial`, so the hard traceability gate
does not pass and the verdict cannot rise above CONDITIONAL on traceability grounds alone,
quite apart from the finding counts.

---

## 8. Deferred Items

- **`playbook_capability` (advisory, not executed).** The playbook corpus was not enumerated.
  Reported as deferred, not as passing. A follow-up run should execute it against the
  packet's target type.
- **`feature_catalog_code` residue (advisory).** `spec.md:98` names the containment
  paragraph and the orchestrator-owned-paths note for modification; T016 records the
  decision not to change it. Carried in the protocol table rather than as a finding, because
  the paragraph describes detection, which this packet did not change.
- **Suite counts not reproduced.** The reported results — 151 files / 2,550 tests, 54
  containment, 223 fan-out and pool, 19 stress, and the worktree-phase 156 files / 2,639
  tests — are taken as reported from `implementation-summary.md:97`–`:103` and
  cross-referenced against `tasks.md`. Running the Vitest suites would write outside this
  lineage's declared directory. The individual line citations were verified instead. The
  2,639/2,643 delta between `implementation-summary.md:102` and `tasks.md:102` is recorded
  as an observation under F006.
- **Reviewed-revision note.** This report describes the tree at commit `2d7439c0a5`
  (2026-09-12). The packet had a further writer active in the repository before that commit;
  a reader who reopens this report should treat every citation as an observation at that
  revision rather than as a permanent property of the tree. Unlike the prior lineage on the
  shared checkout, this pass saw no mid-review writes: it ran in its own worktree and the
  reviewed tree was stable.
- **P0 absence.** No P0 was found, and that is a result rather than a gap. If a follow-up
  run finds one, the verdict moves to FAIL and the final line must read exactly
  `Review verdict: FAIL`.
- **`resource_map_present` is false.** `resource-map.md` is absent from the packet, so no
  Resource Map Coverage Gate section is due in this report and no coverage audit ran.

---

## 9. Audit Appendix

### Iteration table

| Run | Focus | Dimensions | Ratio | New findings | Status | Iteration file |
|-----|-------|-----------|-------|--------------|--------|----------------|
| 1 | all four dimensions | correctness, security, traceability, maintainability | 1.00 | 0 P0 / 6 P1 / 3 P2 | complete | `iterations/iteration-001.md` |

### Convergence signal replay

| Signal | Weight | Outcome |
|--------|--------|---------|
| Rolling average | 0.30 | Cannot vote — minimum 2 iterations; single reading 1.00 anyway |
| MAD noise floor | 0.25 | Cannot vote — minimum 3 iterations |
| Dimension coverage | 0.45 | Vote STOP on coverage (4 of 4 dimensions, both core protocols attempted), but the composite is 0.45 against the 0.60 consensus threshold |

Replayed decision: **CONTINUE would be the correct legal answer**, but the `maxIterations = 1`
ceiling is a policy stop that outranks it. Persisted decision: `STOP` with
`stopReason: maxIterationsReached`, `convergenceAchieved: false`. Replay agrees with the
persisted record on the outcome and disagrees on its cause, and the disagreement is recorded
rather than smoothed: this run did not converge.

`blocked_stop` recorded at run 1 with `blockedBy: ["convergenceGate"]`. The legal-stop
decision tree passed `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`,
`hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`,
`candidateCoverageGate` and `graphlessFallbackGate`, and failed `convergenceGate`. The
security-sensitive override matrix in `convergence.md` remains SPEC ONLY and was not relied
upon.

### Dimension breakdown

| Dimension | Verdict | Basis |
|-----------|---------|-------|
| Correctness | PASS | `write-containment.ts:696`, baseline restore and the advisory settle behave as specified and are pinned by three test files; the two HEAD changes are test-pinned. No correctness failure found. |
| Security | PASS | No remedy path deletes or destroys unattributable work; no `git clean`; quarantine and baseline destinations stay inside the lineage directory; the staging sweep removes only this run's own residue. |
| Traceability | CONDITIONAL | F001, F002, F003, F004, F007, F008, F009. Both core protocols `partial`. |
| Maintainability | CONDITIONAL | F005, F006. The shipped code is well-commented; the defect is in the documentation and YAML prose around it, including a comment that contradicts the line beneath it. |

### Replay validation

Recomputed from stored JSONL only: `newFindingsRatio` 1.00, rolling-average vote cannot run,
MAD vote cannot run, coverage vote pass-on-coverage, `traceabilityChecks.summary` consistent
with the recorded coverage vote. Evidence, scope and coverage gates re-run against stored
findings: evidence gate passes (every finding carries `file:line`), scope gate passes (all
reviewed files inside the declared target and its named blast radius), coverage gate passes
on dimension count. The replayed decision matches the persisted stop reason; the recomputed
*justification* differs from the recorded one, as noted above. No warning altered the outcome.

### Claim adjudication

Six typed packets emitted, one per new P1 (F001–F006), all embedded in
`iterations/iteration-001.md`. No new P0 exists, so no P0 packet is owed.
`claim_adjudication` event recorded with `passed: true` and `missingPackets: []`. F007, F008
and F009 are P2 and owe no packet.

### P0 replay

None to replay. The absence is load-bearing: this packet exists because an unattributable
write met an irreversible remedy, and the review's central question was whether that is
still true. It is not. `write-containment.ts:696` defaults to `preserve`,
`write-containment.ts:176` documents the mode seam, and `fanout.vitest.ts:379` pins the
out-of-scope file retaining the lane's bytes while `:411` pins the advisory settle.

### Methodology disclosure

A prior review lineage's report exists under
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/containment-live-2/`
and was read before this pass for artifact-format reference. Every finding in this report
was re-derived from the current tree at HEAD; overlapping candidates were re-verified
against today's bytes rather than carried, and the differences are material — that
lineage's stranded-probe-marker finding no longer applies, and F006 and F009 concern changes
that landed after its pass.

### Isolation and write-containment disclosure

This lineage ran in its own git worktree at commit `2d7439c0a5`. The reviewed tree was stable
for the whole pass: no file under the packet or the cited runtime surfaces changed between
the first read and the write that produced this report. That is the packet's structural fix
observed working, and it is recorded as methodology because it is evidence about the fix,
not a defect in the packet.

Every write from this lineage landed inside
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/worktree-live/`.
`generate-context.js`, `validate.sh` and every git write operation were withheld by the
lineage's contract, so continuity was not saved to the packet's canonical documents and the
repository validator was not run. Both are out of scope for this lineage by construction and
are owned by the fan-out orchestrator.

`resolveArtifactRoot` was not invoked: the artifact root was bound directly from
`config.fanout_lineage_artifact_dir`, per the lineage's execution contract.

### Coverage matrix

| Surface | Read | Findings |
|---------|------|----------|
| Packet documents (8) | yes | F001, F002, F003, F007, F008, F009 |
| Runtime implementation (3) | yes | F006 |
| Runtime tests (3) | yes | F009 |
| Command YAMLs (4) | yes | F005 |
| Hub SKILL.md, mode-packet loop protocols, runtime README (4) | yes | F004 |
| Feature catalog entry (1) | yes | — (advisory, carried in the protocol table) |

---

*Report produced by the `worktree-live` fan-out lineage. Verdict mapping: PASS if no P0 or
P1; CONDITIONAL if any P1 and no P0; FAIL if any P0. This run is CONDITIONAL.*
