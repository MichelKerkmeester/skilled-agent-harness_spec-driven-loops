# Iteration 1: All dimensions — packet-state fidelity of the containment hardening at HEAD 2d7439c0a5

**Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`)
**Run**: 1 of 1 | **Executor**: cli-pi / deepseek-v4.1-flash | **Mode**: AUTONOMOUS
**Lineage**: `fanout-worktree-live-1789221489298-ipjoou` (generation 1, mode `new`)
**Reviewed at**: commit `2d7439c0a5`; tree stable for the whole pass (this lineage runs in its own worktree)

## Focus

All four dimensions in one pass, because the ceiling for this lineage is a single
iteration (`maxIterations: 1`) and a partial sweep would leave the packet with no
defensible verdict at all.

- **correctness** — does the shipped guard, including the two changes at HEAD, do what the packet says it does?
- **security** — does any remedy or worktree path destroy or expose work it cannot attribute?
- **traceability** — do the packet's documents, its task ledger, its closure gate and the shipped tree agree?
- **maintainability** — is the packet's own record safe to hand to the next session?

Scope read for this pass: the packet's `spec.md`, `acceptance-criteria.md`,
`implementation-summary.md`, `tasks.md`, `plan.md`, `goal.md`, `decision-record.md`,
`research/synthesis.md`; the runtime surfaces the criteria cite
(`runtime/lib/deep-loop/write-containment.ts`, `runtime/lib/deep-loop/executor-config.ts`,
`runtime/scripts/fanout-run.cjs` plus the HEAD commit diff); the three test files the
criteria cite (`write-containment.vitest.ts`, `fanout-run.vitest.ts`,
`tests/stress/cli-adapter/fanout.vitest.ts`); the four `/deep:*` command YAMLs; the hub
`SKILL.md`, the runtime library `README.md`, both mode packets' loop protocols, and the
fan-out feature catalog entry. Twenty-three files read at HEAD or in targeted part, none
modified.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 23 (read at HEAD; 0 modified)
- New findings: P0=0 P1=6 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: **1.00** — computed per the documented formula
  (`convergence.md` §5: `(weightedNew + weightedRefinement) / weightedTotal`,
  P0=10, P1=5, P2=1). Six P1s and three P2s, all fully new against an empty prior
  registry, so `weightedNew = weightedTotal = 33` and the ratio is 1.0.
- Target mutability: **stable** — no mid-pass writes reached the reviewed tree. Unlike a
  shared-checkout run, this lineage executed inside its own worktree, which is the
  structural mode this packet ships.

## Findings

### P0, Blocker

None. This is a deliberate result and the reasoning belongs on the record: the destructive
defect this packet exists to fix is fixed in the shipped guard, and every finding below is
a contradiction in the packet's account of itself rather than a defect in the code that
runs. No containment path deletes a file; the default remedy preserves; a complete lane
with containment findings settles advisory. The P1-to-P0 ladder — demonstrated data loss,
security breach, or hard-gate failure — is not cleared by a record that misstates what has
shipped, even where the misstatement sends a reader to the wrong next action. F005 is the
closest call, and it is discussed under the adversarial check below.

### P1, Required

#### F001 — `implementation-summary.md` contradicts itself: a green verification table for three shipped phases sits above a body that says nothing was built

`implementation-summary.md:3`, `:16`, `:46`, `:55`, `:67`, `:75` versus `:97`–`:103`

The same file carries two mutually exclusive accounts of the packet.

The verification table reports real, phase-scoped work:

| Line | Content |
|---|---|
| `:97` | Deep-loop runtime Vitest suite — 151 files, 2,550 tests passed, 7 skipped, 0 failed, exit 0 |
| `:98` | Containment unit suite — 54 passed |
| `:99` | Fan-out and pool unit suites — 223 passed, 1 skipped across four files |
| `:100` | End-to-end stress reproduction — 19 passed, 1 skipped; out-of-scope file keeps the lane's bytes; ledger records `preserved_in_head`; lane settles `completed_with_containment_advisory` with exit 0 |
| `:101` | Manual shared-checkout run — **PASSED** on the real checkout with other sessions live; 7 out-of-scope paths detected, all 7 preserved (3 `preserved_in_head`, 4 `preserved_untracked`) |
| `:102` | Worktree phase, unit level — **GREEN**; five modules built and wired behind a flag; full suite 156 files, 2,639 passed, 7 skipped, 0 failed |
| `:103` | Manual uncommitted-packet worktree run — Not run |

Everything above and around the table denies it:

| Line | Content |
|---|---|
| `:3` | Description: "Planned stub. **Nothing is built yet**" |
| `:16` | `_memory.continuity.recent_action`: "Left this document as a planned stub; no phase has run" |
| `:46` | `Completed | **Not completed**` |
| `:55` | "**Nothing yet.** The packet is planned and this document is the place its result will be recorded" |
| `:67` | Files Changed table: "**Not yet changed** | Planned" |
| `:75` | "**Not delivered.** The plan sequences three implementation changes …" |

A reader who opens this file and stops at the summary is told the packet has not started.
A reader who scrolls to Verification is told three phases shipped, one of them tested end
to end and one verified on a live shared checkout. Both cannot be true, and the packet's
own task ledger marks T002–T027, T029, T030 and T031 `[x]` with evidence, so the table is
the account that matches the tree.

**Observation note.** This file is not frozen: it was last committed at 12:15 (`5df9389431`)
and the last code commit landed at 15:56 (`2d7439c0a5`), so the file is already behind the
tree by one commit — see F006. This finding was derived against the file as it stands at
HEAD, not against any earlier read.

#### F002 — The acceptance-criteria closure block contradicts its own criteria table, miscounts the criteria, and its Status field contradicts `spec.md`

`acceptance-criteria.md:50`, `:63`–`:76`, `:101`, `:103`; `spec.md:36`

The document that "decides whether the packet may close" states **Closeable: No** and
justifies it with "Nothing is built yet. The packet is planned, and the eleven criteria
above are the gate it will be measured against."

Eleven lines earlier its own table has grown to **fourteen** rows, `AC-001` through
`AC-014`, and **every one of them reads `Met`** with evidence observed. The document's own
closure rule at `:39`–`:41` says a packet is closeable when every row is `Met`, `Waived`
or `Superseded`. By that rule the table says the gate is open; the closure paragraph says
it is shut, for a reason that is false twice over:

- "Nothing is built yet" is contradicted by the fourteen `Met` rows in the same file, by
  `tasks.md` Phase 1–4 task state, and by `implementation-summary.md`'s verification table.
- "the eleven criteria" miscounts the table by three rows; the phrase "Criterion ten" in
  the same paragraph belongs to the eleven-row draft the document has outgrown.

`Closeable: No` may still be the right verdict — `tasks.md` T028 and T032 remain open and
its completion criteria are unchecked — but the stated reason is wrong, and a reader cannot
tell whether the `Met` rows are over-claimed or the closure paragraph is stale. Those two
readings route to opposite next actions: re-verify the evidence, or go implement. The
independent `Status` fields disagree as well, `acceptance-criteria.md:50` reading `Planned`
against `spec.md:36` reading `In Progress`.

#### F003 — `plan.md` predates the worktree resolution and the shipped phase: it carries none of the resolved mechanics, its M3 milestone still certifies the criterion the research disqualified, and its Phase 4 gate is unchecked while Phase 4 is built

`plan.md:45`, `:70`, `:91`, `:153`, `:306`; `spec.md:273`, `:286`; `research/synthesis.md:34`; `tasks.md:87`, `:101`

`plan.md` was last modified 2026-09-08 20:00 (`2a2e95b596`). A search of it for `liveness`,
`lease`, `publication`, `publish`, `staging`, `sweep`, `grace`, `run-keyed` and
`negative control` returns **zero hits**. Meanwhile:

- `spec.md:273`–`:288` records the 2026-09-12 follow-up that closed both blocking gaps and
  states that REQ-005 "now carries the resolved mechanics: a lease-based liveness proof
  requiring three independent conjuncts before any reclamation, run-keyed publication by
  staged rename, and reclamation ordered after the ledger read."
- `tasks.md` marks T017–T022, T030 and T031 `[x]` with evidence, including the concurrent
  negative control at T031 and the prefix lease at T030 — i.e. the phase `plan.md:153`
  says must not start until the decision is confirmed has been built and tested.

The plan's own gate conditions are therefore backwards:

- `plan.md:306` M3 still reads "A full fan-out runs with every lineage in its own worktree,
  and the main checkout shows no lane-authored change" — exactly the shape
  `research/synthesis.md:34`–`:36` says "passes for a destructive sweep," which is why a
  concurrent negative control was required instead. The plan never absorbed that control.
- `plan.md:45` (Definition of Ready) is an unchecked box while the phase it gates is built.
- `plan.md:70`'s Lineage worktree component still describes the pre-resolution mechanics
  (`worktree add --detach … removed on lane teardown`) with no lease, no publication
  semantics and no reclamation proof.
- `plan.md:91` tells implementers to update **both** loop protocols to "describe
  preserve-by-default and the worktree lane," while `tasks.md:81` (T015) records the review
  protocol "needed no change" — the two packet documents cannot both be followed.

An implementer who follows `plan.md` — the document that exists to say what to do — will
either rebuild a shipped phase or certify it with the disqualified gate. `spec.md` carries
the correction, but `plan.md` was never updated to point at it.

#### F004 — The review loop protocol still carries neither containment rule; the task ledger says it needed no change, and the hub still routes review-mode readers to the research packet

`spec.md:96`, `:122`; `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280`; `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287`, `:290`; `.opencode/skills/system-deep-loop/SKILL.md:128`; `tasks.md:81`; `acceptance-criteria.md:73`

`spec.md:96` lists the review mode's loop protocol under Files to Change with the
description "The same containment rules for the review loop", and REQ-006 (`spec.md:122`)
requires "the four command YAMLs …, the hub SKILL.md, **both loop protocols**, the runtime
library README and the fan-out feature catalog entry" to be migrated. The research
counterpart carries both rules at `deep-research/references/protocol/loop-protocol.md:287`
through `:290`: attribution reports rather than undoes, restore is opt-in and targets
pre-dispatch bytes, untracked files are never deleted, and the two write destinations are
named.

A search of the review protocol for `containment`, `preserve`, `quarantine` and `baseline`
returns only unrelated hits; its one `containment` occurrence at `:280` is the pre-existing
cli-opencode posture paragraph that predates this packet. `SKILL.md:128` still points
operators at the **research** protocol "under Executor Resolution" for both rules, so a
review-mode operator is routed out of their own mode packet to find a rule `spec.md:96`
says belongs in theirs.

The contradiction is now three-way rather than a simple omission: `tasks.md:81` (T015)
records "The review loop protocol carries no equivalent paragraph, so it needed no change";
`acceptance-criteria.md:73` (AC-011) is marked `Met` with a Then-clause requiring each of
the five documentation surfaces to name the current behaviour; and `spec.md` still lists
the surface as modified. Whatever the intended resolution — migrate the protocol or amend
the requirement — the packet currently asserts all three states at once.

#### F005 — AC-011 is marked Met and two task rows claim zero occurrences, but the superseded "revert … fail closed" wording survives on three command-workflow surfaces, one of them directly above contradicting code

`deep-review-confirm.yaml:1176`, `:1213`; `deep-research-confirm.yaml:1104`, `:1141`; `deep-review-auto.yaml:1516`–`:1520`; `tasks.md:79`, `:126`; `acceptance-criteria.md:73`; `write-containment.ts:696`; `fanout.vitest.ts:402`, `:411`; `deep-review-auto.yaml:1532`, `:1536`

Two confirm-mode YAMLs still describe the guard to the operator as

> "Structural write-containment: snapshot out-of-scope dirty paths pre-dispatch, **revert
> any NEW out-of-artifact-dir change post-dispatch, fail closed on violation**; the leaf's
> own artifact-dir writes are never flagged."

(`deep-review-confirm.yaml:1213`, `deep-research-confirm.yaml:1141`), with the same claim
in the inline comment block above the call at `:1176` and `:1104` ("makes outside its
artifact dir is reverted after, fail-closed"). Neither clause is true of the shipped guard:
`write-containment.ts:696` defaults the mode to `preserve`, and `fanout.vitest.ts:402`
through `:411` pin `events.filter((event) => event.event === 'failed')` to `[]` with the lane
settling `completed_with_containment_advisory`.

`deep-review-auto.yaml:1516`–`:1520` carries the same stale contract as a five-line comment
("Revert any NEW out-of-artifact-dir change it made … and fail the iteration fail-closed")
sitting directly above code that now prints `'write-containment advisory: detected … left
on disk'` at `:1532` and returns `process.exit(dispatchExit)` at `:1536`. This is the shape
the code-quality standard calls out worst: a comment a reader will trust over the line
beneath it.

The false-verification layer is what lifts this above stale prose. `tasks.md:79` (T014)
claims the superseded wording "is absent from every workflow asset"; `tasks.md:126` (T029)
claims "all four command workflows report zero occurrences"; `acceptance-criteria.md:73`
(AC-011) is `Met` on the same sweep. All three claims are false at the bytes they describe.
The code call sites were migrated — the advisory message and the exit-code passthrough are
real — but the three descriptive surfaces were not, and the packet's own verification
record says otherwise.

#### F006 — Two Known Limitations and one open task describe a code state older than HEAD: the retry collision is fixed and the staging sweep is wired, but the record still calls them broken and unbuilt

`implementation-summary.md:115`, `:117`; `tasks.md:103`; `fanout-run.cjs:2794`, `:3152`, `:3154`–`:3166`

The last commit, `2d7439c0a5` (2026-09-12 15:56, "sweep publish residue and let a retried
lane build its own worktree"), made two changes, both verified by reading the diff rather
than the message:

1. **Retry collision fixed.** The worktree name now carries the attempt —
   `fanout-run.cjs:2794`: `const worktreeLabel = \`attempt-${attempt}-${label}\`` — so a
   lane retried after a failed publish no longer finds its predecessor's retained name
   taken. `implementation-summary.md:115` (limitation #6) still says a retry "cannot create
   it and degrades to the shared checkout," and calls that "a consequence of the retention
   rule rather than a separate defect." The tree no longer behaves that way, and the commit
   added tests for it (`fanout-run.vitest.ts:4513`).
2. **Staging sweep wired.** `fanout-run.cjs:3152` now calls
   `worktrees.sweepStagingResidue({ targetParent: lineagesDir, runId })` in `main()` before
   any lane publishes, emitting `worktree_staging_swept` (or `…_failed`) at `:3154`–`:3166`;
   `fanout-run.vitest.ts:4459` pins that only this run's residue is removed and a different
   run's staging is untouched. `implementation-summary.md:117` (limitation #8) still says
   "The staging-residue sweep exists but is not called in production … wiring it is an open
   task," and `tasks.md:103` (T032) — the task whose deliverable is exactly that wiring —
   remains `[ ]` with no evidence.

The direction of the error is understatement, which is why no P0 attaches, but it is
misinformation all the same: the next session reading these entries will wire a wired
sweep, or plan around a retry failure that no longer exists, instead of continuing from
the point the code actually reached.

A smaller unreconciled number rides in the same evidence: the same "full suite" is reported
as 2,639 passed at `implementation-summary.md:102` and 2,643 at `tasks.md:102` and
`acceptance-criteria.md:71` — a four-test delta that no cited run can be checked against.

### P2, Suggestion

#### F007 — Four stale `_memory.continuity` blocks point the next session at work that has already landed

`acceptance-criteria.md:14`–`:28`; `implementation-summary.md:14`–`:27`; `goal.md:14`–`:28`; `decision-record.md:14`–`:27`

All four packet documents still carry `last_updated_at: "2026-09-08T18:20:00Z"`,
`completion_pct: 0`, and a `next_safe_action` that routes to Phase 1 —
`acceptance-criteria.md:17` "Implement Phase 1 and record evidence against the first four
criteria", `implementation-summary.md:17` "Fill this document after Phase 1 lands",
`goal.md:17` "Confirm the two open decisions with the operator, then start Phase 1".
`implementation-summary.md:16` still reads "no phase has run" while the same file's
verification table reports three phases and a live run.

Phase 1 has landed, along with Phases 2, 3, 4 and most of 5 (`tasks.md` holds 28 completed
tasks). Because `/speckit:resume` resolves context in the order
`handover.md -> _memory.continuity -> spec docs`, and this packet has no `handover.md` and
no `checklist.md`, the continuity block is the second thing the next session reads — and it
will send that session to re-implement landed work.

All four blocks also carry `session_dedup.fingerprint:
"sha256:0000000000000000000000000000000000000000000000000000000000000000"`, an all-zero
placeholder. A fingerprint that cannot be recomputed cannot be checked for freshness, so
the staleness above is undetectable by tooling and persists until a human reads it.

#### F008 — The tasks verification checklist reports 0/36 verified items while the verification tasks above it are complete with green-suite evidence

`tasks.md:134`–`:136`, `:188`, `:244`–`:248`, `:301`; `:118`–`:126`

The L3+ checklist groups in `tasks.md` (Pre-Implementation through Compliance and
Documentation Verification) are all unchecked, and the Verification Summary reads:

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 5 | 0/5 |

with `Verification Date: 2026-09-08`. Directly above, Phase 3's T025, T026, T027 and T029
are `[x]` with evidence naming the same runs the summary counts as unverified — including
T026's incident reproduction, which is CHK-021's subject, and T029's documentation sweep,
which is CHK-040's subject. CHK-020 ("Every criterion in `acceptance-criteria.md` is met or
waived") is unchecked while all fourteen rows are `Met`; CHK-140 ("All packet documents are
synchronized with the shipped behaviour") is unchecked, and this review's F001–F006 are
evidence that leaving it unticked is honest.

A reader can take either surface as the packet's verification state and be wrong about the
other. The checklist being unfilled is a legitimate close-out state; the conflict between
the two surfaces is not, and one line ("verification checklist is maintained at closure;
task evidence above is authoritative until then") would resolve it.

#### F009 — Four line-anchored citations in the closure gate and its task mirror no longer resolve to the claim

`acceptance-criteria.md:66`, `:67`, `:68`; `tasks.md:40`; `executor-config.ts:688`, `:695`, `:696`; `write-containment.vitest.ts:173`, `:232`

AC-004 cites `runtime/lib/deep-loop/executor-config.ts:688` for "defaults the mode to
preserve and rejects an unknown value". At HEAD, `:688` is a comment line inside the stall
detection block; the containment schema starts at `:695` and the preserve default is `:696`.
The claim is true, the pointer is wrong — the stall/watchdog additions shifted the block
down after the citation was written. T002's evidence (`tasks.md:40`) cites the same line.

Two more drifted by one line each: AC-006 cites `write-containment.vitest.ts:172`/`:180`
for the over-bound case while the test is at `:173` and the `baselineTruncated` assertion
at `:181`; AC-005 cites `:231` for `restored_from_baseline`, which is at `:232`.

Spot-check results from the same pass, for calibration: every stress-suite citation
checked resolved exactly — `fanout.vitest.ts:379` (bytes retained), `:391`
(`containment_violation`), `:395` (`preserved_in_head`), `:411`
(`completed_with_containment_advisory`). So the drift is local, not systemic, and the
claims behind the stale pointers are all independently true. A closure gate whose evidence
pointers cannot be resolved, however, cannot be machine-checked, which is the whole point
of pinning them.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `write-containment.ts:696`, `:176`, `fanout.vitest.ts:379`, `:411`, `write-containment.vitest.ts:232`, `executor-config.ts:696`, `:701`, `fanout-run.cjs:2794`, `:3152` | REQ-001 (preserve + quarantine), REQ-002 (baseline-targeted restore), REQ-003 (separated outcomes) and REQ-004 (churn detector) resolve to shipped, test-pinned behaviour. REQ-005 is built at unit level (T017–T022, T030, T031) but its planning artefacts are unresolved (F003) and T028's manual run is not performed. REQ-006 is not fully migrated (F004, F005). |
| `checklist_evidence` | partial | hard | `acceptance-criteria.md:63`–`:76`, `tasks.md:38`–`:126`, `implementation-summary.md:97`–`:103` | Fourteen rows `Met`, and most line citations resolve; AC-011's sweep claim is false against three command-workflow surfaces (F005), four citations have drifted (F009), and the closure paragraph denies the table it follows (F002). The tasks-side checklist is 0-verified (F008). |
| `feature_catalog_code` | partial | advisory | `runtime/feature-catalog/fanout/fanout-run.md:56` | `spec.md:98` lists the containment paragraph and orchestrator-owned-paths note for modification; T016 records the decision to leave the paragraph as written because it describes detection and exemptions, which this work did not change. Detection indeed did not change, so the paragraph is not wrong — but the spec surface it names is unchanged, so the advisory protocol stays partial rather than pass. |
| `playbook_capability` | not_executed | advisory | — | Not enumerated in this pass. One iteration cannot both sweep four dimensions and audit the playbook corpus; recorded under Deferred Items as a follow-up check rather than reported as passing. |

## Assessment

- New findings ratio: **1.00** (six P1 × 5 + three P2 × 1 = 33 over 33; all findings fully
  new against an empty prior registry; no P0 so the 0.50 floor does not apply)
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: iteration 1 of 1; no prior packet state under this lineage. The
  ratio follows the documented formula; a prior lineage reviewing the same target recorded
  a lower calibrated ratio for a smaller finding set, and the divergence is a calibration
  difference in a derived metric, not a difference in the blocked-stop conclusion.

**On the absence of a P0.** The destructive defect this packet exists to fix is genuinely
fixed: `write-containment.ts:696` defaults the remedy to preserve, `fanout.vitest.ts:379`
pins the out-of-scope file still holding the lane's bytes, no containment path deletes a
file, and a complete lane with findings settles `completed_with_containment_advisory`. The
findings are contradictions in the packet's account of itself. F005 is the hardest case
because it carries a false verification claim in the closure gate *and* operator-facing
prose that describes the opposite remedy; but the prose does not drive the guard, the code
beneath it preserves, and a reader misled by it is misled toward inaction, not toward
destruction. The P1-to-P0 ladder is not cleared.

## Adversarial Self-Check

**F001 — Hunter.** Could the runtime work predate the packet and the verification table be
borrowing unrelated evidence? Traced: the containment schema block is `executor-config.ts:695`
which `tasks.md:39` names as T002's deliverable; the quarantine and baseline code paths are
the ones `spec.md:84` scopes; the manual run's 7 preserved paths match T026/T027's evidence.
The evidence is packet-specific. **Skeptic.** Could the body sections be an intentionally
maintained stub whose denial is scoped by a header? The file was read end to end; no
scoping sentence excludes the verification table, and `:75` names the packet's own three
implementation changes in present-tense denial. **Referee.** Claim survives. P1, traceability.

**F002 — Hunter.** Is there a reading where "Nothing is built yet" is true? Only if every
one of the fourteen `Met` rows is fabricated. Four rows were resolved to source in this
pass (`fanout.vitest.ts:379`, `:395`, `:411`, `write-containment.vitest.ts:232`) and all
resolved to the claimed assertions. Rejected. **Skeptic.** Does the closure rule really
make rows decisive? `:39`–`:41` says so in the document's own words. **Skeptic, second
pass.** Could `Closeable: No` be defended by `tasks.md`'s open tasks? Yes — and the finding
says so; what fails is the stated reason and the criterion count, not necessarily the
verdict. **Referee.** Claim survives as scoped. P1, traceability.

**F003 — Hunter.** Could `plan.md` have been updated without the greps matching? The terms
were chosen from `spec.md`'s own resolution text (`liveness`, `negative control`, `sweep`,
plus publication vocabulary); zero hits across all of them, and the file's mtime/commit
date predates the research it must absorb. Two independent checks agree. **Skeptic.** Is
the M3 text really the disqualified shape? `research/synthesis.md:34`–`:36` says a "no
worktree remains" criterion passes for a destructive sweep; M3 asserts the main checkout
shows no lane-authored change after a full worktree fan-out — the same
satisfiable-by-deletion shape, which is why the negative control was required. Accepted as
the same hazard class. **Referee.** Claim survives, and stays P1 rather than P0 because
`spec.md` carries the correction and no path currently authorises loss. P1, traceability.

**F004 — Hunter.** Could the review rules deliberately live in one shared document, making
the omission correct? That is what T015's evidence asserts; but it does not answer
`spec.md:96` and REQ-006, which name the review protocol as a surface to change, and it
does not fix `SKILL.md:128` routing review readers to the research packet. The decision can
be intentional and the packet still be internally inconsistent. **Skeptic.** Is this the
difference between a task completing its intent and its letter? Either resolution closes
it; leaving the requirement, the task evidence and the criterion all asserting different
states does not. **Referee.** Claim survives. P1, traceability.

**F005 — Hunter.** Could the surviving strings be explicitly historical? Read in context:
the confirm notes end by contrasting with "the confirm branch previously relied on the
prompt contract plus post-dispatch validation alone," which presents revert-and-fail-closed
as the current capability; the auto block is a present-tense description of the code below
it. Rejected. **Skeptic.** Is stale prose plus three optimistic evidence rows worth P1?
The evidence rows are falsified verification claims in the packet's closure gate, and the
prose is the branch description a human approves at confirm-mode dispatch; the packet's own
R-002 risk is that preserve-by-default gets misread. **Skeptic, second pass — why not P0?**
Because nothing in these surfaces changes what the guard does: the default is preserve, no
delete path exists, and the misinformation has no demonstrated path to data loss. **Referee.**
Claim survives. P1, maintainability.

**F006 — Hunter.** Could the staging sweep call be dead code or conditional in a way that
leaves limitation #8 true? The call sits in `main()`'s worktree setup block, guarded only
by the same module loading the rest of the worktree phase, and its test at
`fanout-run.vitest.ts:4459` exercises removal and foreign-staging preservation. It runs
whenever the worktree phase runs. **Skeptic.** Could the retry fix be upstream-unreleased?
It is committed at HEAD, which is the tree under review. **Referee.** Claim survives; P1
with a low-cost downgrade trigger (tick T032 and re-word two entries). P1, maintainability.

**F007 — Skeptic.** Do continuity blocks matter when `spec.md` and `tasks.md` are current?
They are second in `/speckit:resume`'s ladder and the packet has no `handover.md` or
`checklist.md`, so yes. P2 stands. **F008 — Skeptic.** Is the checklist simply
closure-time bookkeeping? Mostly yes, which is why it is P2; the conflict is that its
"0/36 verified" line is the only numeric verification summary in the file. **F009 —
Skeptic.** Is a one-line drift worth a finding? On its own, no; bundled as citation
integrity for the closure gate, it is worth tracking, and the finding records the exact
spot-check results so the repair is mechanical.

## Ruled Out

- **A P1 against T028's unperformed manual worktree run.** The box is unchecked and the
  criterion's unit-level assertions are covered by T031; an open task in a packet that
  says it is open is tracked state, not a finding. F006's finding is the opposite
  direction — a shipped item recorded as unshipped — not the open items themselves.
- **A P0 against F003's plan gap.** `spec.md:273` carries the correction and `spec.md`
  outranks `plan.md`, so the packet does not currently authorise the hazard. "The plan is
  stale" is a different claim from "the packet will cause loss".
- **A finding against the 2,639/2,643 suite-count divergence.** Folded into F006's
  evidence as an observation: the delta is four tests between two same-day runs, no cited
  run can be checked against it, and it changes no claim.
- **A finding against the unchanged feature-catalog paragraph.** T016 records the decision
  and the paragraph describes detection and exemptions, which this packet did not change.
  Carried as advisory `partial` in the protocol table instead.
- **Treating the `containment-reverted/` directory name as a REQ-001 violation.** The
  planned name differs from the shipped path, but the capability asked for — a recoverable
  copy inside the lineage directory — is served by the quarantine and baseline trees. Name
  drift is P2-grade at most and is not worth an operator's time on its own.
- **A P1 against the absence of `checklist.md` at Level 3.** The packet's closure gate is
  `acceptance-criteria.md`, which exists and is maintained. Noted in the protocol table.
- **A P1 against the missing `resource-map.md`.** Absent at init, so `resource_map_present`
  is false and no coverage gate or report section is due.

## Dead Ends

- **Reproducing the suite counts.** Running the Vitest suites would write outside this
  lineage's declared directory. The counts are taken as reported, with the individual line
  citations independently verified instead — which is the part a stale table would have
  falsified.
- **Enumerating `playbook_capability`.** One iteration's budget cannot carry a dimension
  sweep and a playbook-corpus audit. Recorded as `not_executed` rather than guessed at.
- **Checking the main checkout's live state.** This lineage reviews the tree it can read at
  HEAD; the shared checkout's uncommitted state is not the target and is outside this
  lineage's read-for-review scope.

## Recommended Next Focus

Not applicable — this lineage's ceiling is one iteration and it has been reached. For the
maintainer who picks the packet up, in descending value:

1. **Reconcile the packet's account of itself before anything closes** (F001, F002, F007,
   F008). Bring `implementation-summary.md`'s body up to its own verification table, make
   the closure paragraph cite the real reason (T028/T032), refresh the four continuity
   blocks, and reconcile the checklist with the completed verification tasks. This is
   bookkeeping with no design content, and it is the difference between the next session
   continuing the work and restarting it.
2. **Fix the false migration claim** (F004, F005). Either migrate the review protocol and
   the three stale command surfaces, or amend REQ-006/`spec.md:96` to record the
   single-source decision; then re-run the T029 sweep for real before AC-011 may be `Met`.
3. **Update `plan.md` from `spec.md:273`–`:288`** (F003), replacing M3 with the concurrent
   negative control, checking the Definition of Ready, and describing the lease/publication
   mechanics the phase actually shipped.
4. **Re-word limitations #6 and #8 and close T032 with evidence** (F006), and fix the
   `executor-config.ts` citations (F009).

## Audit

- Previous verdict: none (first iteration of this lineage)
- Consistent: yes — first iteration, no prior verdict to contradict
- Claim-adjudication packets: 6 emitted (F001–F006), one per new P1. No new P0 exists, so
  no P0 packet is owed. F007–F009 are P2 and owe no packet.
- Findings carried forward: 0
- Findings resolved: 0

### Concurrent-write note and methodology disclosure

This lineage ran in its own git worktree at commit `2d7439c0a5`. The reviewed tree was
stable for the whole pass: no file under the packet or the cited runtime surfaces changed
between the first read and this write. That is the containment fix's structural mode
observed working as designed, and it is worth recording next to the prior lineage that ran
on the shared checkout and saw `implementation-summary.md` rewritten beneath it.

A prior review lineage's report exists under
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/containment-live-2/`
and was read before this pass for artifact-format reference. Every finding here was
re-derived from the current tree at HEAD; where findings overlap with that lineage's,
they were re-verified against today's bytes, and two differences are material: its
stranded-probe-marker finding no longer applies (the markers are gone from `tasks.md`), and
this iteration's F006 and F009 concern changes that landed after that lineage's pass.

### Write-containment disclosure

Every write from this lineage landed inside
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/worktree-live/`.
`generate-context.js`, `validate.sh` and every git write operation were withheld by the
lineage's contract, so continuity was not saved to the packet's canonical documents and
the repository validator was not run. Both are out of scope for this lineage by
construction and are owned by the fan-out orchestrator.

`resolveArtifactRoot` was not invoked: the artifact root was bound directly from
`config.fanout_lineage_artifact_dir`, per the lineage's execution contract.

## Claim Adjudication Packets

One typed packet per new P1. F007, F008 and F009 are P2 and owe no packet.

```json
{
  "findingId": "F001",
  "claim": "implementation-summary.md contradicts itself: its description, metadata, body and continuity block state the packet is a planned stub with nothing built, while its Verification table reports the shipped guard, a PASSED live shared-checkout run with seven preserved paths, and a GREEN worktree phase at 156 files and 2,639 passing tests.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:97",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:101",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:102",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:3",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:16",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:55",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:75"
  ],
  "counterevidenceSought": "Read the file end to end looking for a scoping sentence that limits the body to an unstarted phase; checked whether the verification table could name a different packet or another checkout; checked whether the body could be an unread template and the table the live content. No scoping sentence exists, the table names this packet's suites, its own limitation list and its live run, and :75 names the packet's three implementation changes in prose specific to this work.",
  "alternativeExplanation": "The body is intentionally held as a planned stub until closure so that a completion claim cannot be read before the packet closes. Rejected: a stub is coherent only while nothing has shipped, and the same file now certifies three phases and a live production run; the denial misroutes the next reader instead of protecting them.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 once the body records per-phase shipped/unshipped state and the continuity block matches tasks.md's completed tasks.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "The acceptance-criteria closure block says nothing is built and refers to eleven criteria while its own table has fourteen rows all marked Met, and its Status field reads Planned against spec.md's In Progress.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:101",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:103",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:76",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:50",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:36"
  ],
  "counterevidenceSought": "Counted the rows and checked whether any is Unmet or Waived; read the document's own closure rule at :39 through :41; looked for a superseding note above the closure paragraph; spot-checked four Met rows against source. All fourteen rows are Met, the rule makes closure a function of rows, no superseding note exists, and every spot-checked citation resolved to the claimed assertion.",
  "alternativeExplanation": "Closeable: No remains the right conclusion because tasks.md T028 and T032 are open, so only the reason is stale. Accepted as the mechanism, rejected as a defence: the stated reason is false twice — the build denial and the criterion count — and the two readings of the document (over-claimed rows versus stale closure) route to opposite next actions.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade to P2 once the closure paragraph names the open tasks as its reason, the criterion count matches the table, and Status agrees with spec.md.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "plan.md was not updated for the resolved worktree mechanics and now contradicts the shipped phase: it contains none of the liveness, publication or staging vocabulary, its Phase 4 gate is unchecked while Phase 4 is built, and its M3 milestone still certifies the no-worktree-remains criterion that the research disqualified in favour of a concurrent negative control.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:306",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:45",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:91",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:273",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/research/synthesis.md:34",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:101"
  ],
  "counterevidenceSought": "Grepped plan.md for liveness, lease, publication, publish, staging, sweep, grace, run-keyed and negative control and found no hits; read its dependency, risk and phase tables for a precondition that covers the same ground and found only symlink and git-availability dependencies; checked commit dates and confirmed plan.md predates the resolution while tasks T017 through T022, T030 and T031 are closed against it.",
  "alternativeExplanation": "The plan is a historical artefact and spec.md plus tasks.md are the live documents. Rejected: plan.md delegates only task state to tasks.md while keeping the phase sequencing, the gates and the milestones, and :153 still conditions Phase 4 on a decision that has shipped; an implementer following the plan alone rebuilds the phase against the disqualified gate.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade to P2 once plan.md carries the resolved mechanics, the concurrent negative control and a checked Definition of Ready.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F004",
  "claim": "The review mode packet's loop protocol carries no containment rule although spec.md lists it as a surface to change and REQ-006 names both loop protocols, while the task ledger says it needed no change and the hub SKILL still routes review-mode readers to the deep-research packet for both rules.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:96",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:122",
    ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280",
    ".opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:290",
    ".opencode/skills/system-deep-loop/SKILL.md:128",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:81"
  ],
  "counterevidenceSought": "Searched the review protocol for containment, preserve, quarantine and baseline and inspected every hit to confirm each belongs to unrelated subject matter; read the hub bullet to see where it routes; checked the acceptance criterion's own Then clause. No rule text exists in the review protocol, the hub routes to the research document, and AC-011's each-surface clause fails for this surface.",
  "alternativeExplanation": "The rules are deliberately single-sourced in the research protocol to avoid drift, and T015's evidence records that decision. Accepted as a decision, rejected as a defence: REQ-006 and spec.md:96 name the review protocol as a surface to change, so the packet must either migrate the surface or amend the requirement; it cannot mark the criterion Met while all three statements stand.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade to P2 once either the review protocol gains the rules or spec.md and REQ-006 record the single-source decision and the hub routing matches it.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F005",
  "claim": "Three command-workflow surfaces still describe write containment as reverting out-of-scope changes and failing closed, while two task rows claim the superseded wording is absent from every workflow asset and the acceptance criterion for that migration is marked Met; the auto-mode comment sits directly above code that prints left-on-disk and returns the dispatch exit code.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep-review-confirm.yaml:1213",
    ".opencode/commands/deep/assets/deep-research-confirm.yaml:1141",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1516",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1532",
    ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:696",
    ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:402",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:79",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:126",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:73"
  ],
  "counterevidenceSought": "Grepped all four command YAMLs and the five documentation surfaces for the superseded phrases; read the confirm notes in context to test whether they are explicitly historical; read the code beneath the auto comment; checked whether any YAML passes a containment mode that would make the described branch the one that runs. The notes present revert-and-fail-closed as current, no YAML passes a mode, and the code preserves.",
  "alternativeExplanation": "The notes are presentation text an operator may skim rather than operational instructions, so the harm is limited. Accepted as mitigation, rejected as a defence: confirm-mode notes are the branch description a human approves, the auto comment contradicts the line beneath it, the packet's own R-002 risk is exactly this misreading, and the verification rows that claim the sweep succeeded are false regardless of how the prose is read.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 once the three surfaces describe preserve-by-default and the advisory outcome and the T014, T029 and AC-011 evidence rows match the tree.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F006",
  "claim": "Two Known Limitations entries and one open task describe a code state older than HEAD: the retained-worktree retry collision was fixed by naming worktrees with the attempt prefix, and the staging-residue sweep is now wired and called before lane dispatch, yet implementation-summary.md presents both as broken or unwired and T032 remains open without evidence.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:115",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:117",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:103",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2794",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3152",
    ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4459",
    ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4513"
  ],
  "counterevidenceSought": "Read the HEAD commit diff rather than its message to confirm both changes; read the sweep's call site to confirm it is invoked in main() rather than defined and unused; checked whether the retry fix is test-pinned; checked the mtimes against the commit time. The sweep is called before lane dispatch, the label change is exercised by two added tests, and the docs were committed hours earlier.",
  "alternativeExplanation": "The documentation lags a same-day commit and the packet is not closed, so the record is allowed to trail the tree. Accepted as the mechanism, rejected as a defence: T032 is the task for exactly this wiring and remains open after the wiring shipped, and limitation #8 asserts production absence in the present tense, which is the direction that sends the next session to redo finished work.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 once T032 is closed with its evidence and both limitation entries describe the shipped behaviour.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

Review verdict: CONDITIONAL
