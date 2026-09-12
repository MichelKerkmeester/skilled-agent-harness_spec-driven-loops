# Iteration 1: All dimensions — packet-state fidelity of the containment hardening

**Target**: `specs/system-deep-loop/045-fanout-write-containment-hardening` (`spec-folder`)
**Run**: 1 of 1 | **Executor**: cli-pi / deepseek-v4.1-flash | **Mode**: AUTONOMOUS
**Lineage**: `fanout-containment-live-2-1789159071284-irnvcb`

## Focus

All four dimensions in one pass, because the ceiling for this lineage is a single
iteration (`maxIterations: 1`) and a partial dimension sweep would leave the packet
with no defensible verdict at all.

- **correctness** — does the shipped guard do what the packet says it does?
- **security** — does any remedy path destroy work it cannot attribute?
- **traceability** — do the packet's documents agree with the shipped tree and each other?
- **maintainability** — is the packet's own record safe to hand to the next session?

Scope read for this pass: the packet's `spec.md`, `acceptance-criteria.md`,
`implementation-summary.md`, `tasks.md`, `plan.md`, `research/synthesis.md`; the
runtime surfaces the criteria cite
(`runtime/lib/deep-loop/write-containment.ts`, `runtime/lib/deep-loop/executor-config.ts`,
`runtime/tests/unit/write-containment.vitest.ts`,
`runtime/tests/unit/fanout-pool.vitest.ts`,
`runtime/tests/stress/cli-adapter/fanout.vitest.ts`); the four `/deep:*` command YAMLs;
the hub SKILL.md, the runtime library README, and both mode packets' loop protocols.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 20
- New findings: P0=0 P1=5 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.70
- Target mutability: **changed under review** — one packet document was rewritten by a
  concurrent editor mid-pass and every affected finding was re-derived against the new bytes

## Findings

### P0, Blocker

None. This is a deliberate result, not an omission, and the reasoning belongs on the
record: the implementation that exists is correct, and the defects are in the packet's
account of itself. No P0 is reachable from a documentation contradiction whose
correcting authority (`spec.md`) is present and unambiguous — see the adversarial note
on F003 below.

### P1, Required

#### F001 — `implementation-summary.md` contradicts itself: a full verification table with 2,539 passing tests sits above a body that says nothing was built

`implementation-summary.md:54`, `implementation-summary.md:96`, `implementation-summary.md:45`, `implementation-summary.md:66`, `implementation-summary.md:16`

This document now carries two mutually exclusive accounts of the same packet, in the same
file.

The verification table reports real work, with outcomes and caveats:

| Line | Content |
|---|---|
| `:96` | Deep-loop runtime Vitest suite — 2,539 passed, 6 failed across 4 files, 7 skipped |
| `:97` | Containment unit suite — 54 passed |
| `:98` | Fan-out and pool unit suites — 223 passed, 1 skipped |
| `:99` | End-to-end stress reproduction — 19 passed, 1 skipped; the out-of-scope file keeps the lane's bytes, the ledger records `preserved_in_head`, the lane settles `completed_with_containment_advisory` with exit 0 |
| `:100` | Manual shared-checkout run — attempted; first attempt inconclusive because the stop-policy gate now precedes containment; baseline capture confirmed at 893 files / 10 MB |

Everything above the table denies it:

| Line | Content |
|---|---|
| `:3` | Description: "Planned stub. **Nothing is built yet**" |
| `:45` | `Completed | **Not completed**` |
| `:54` | "**Nothing yet.** The packet is planned and this document is the place its result will be recorded" |
| `:66` | Files Changed table: "**Not yet changed** | Planned" |
| `:74` | "**Not delivered.** The plan sequences three implementation changes" |
| `:16` | `_memory.continuity.recent_action`: "Left this document as a planned stub; no phase has run" |

A reader who opens this file and stops at the Summary section — which is what a summary is
for — is told the packet has not started. A reader who scrolls to Verification is told it has
been tested end to end. The two cannot both be true, and the third and fourth requirements are
in fact unbuilt, so neither account is simply right either.

The shipped behaviour the verification table describes is independently confirmed:
`write-containment.ts:782` (preserve default), `write-containment.ts:807` and `:811`
(baseline-targeted restore), `write-containment.ts:48` (remedy vocabulary), pinned by
`fanout.vitest.ts:379`, `:395`, `:411` and `write-containment.vitest.ts:231`, `:180`.
`acceptance-criteria.md:63` through `:70` mark seven criteria `Met`, and `tasks.md:38`,
`tasks.md:40` mark T002 and T003 `[x]` with recorded evidence.

**Observation note.** This file was rewritten by a concurrent editor in the same checkout
while this review was running — its modification time is 22:39:04 and this lineage's first
write is 22:42:11. Its content at first read carried "Not run — no implementation exists" at
`:96`; the verification table above is what replaced it. The finding was therefore re-derived
against the post-write bytes rather than the bytes first read, and it survived the rewrite in a
stronger form: what was a cross-document disagreement is now an intra-document one. See the
audit appendix for the containment note.

Three of the packet's four P0/P1 requirements are implemented and pinned:

| Requirement | Where it is shipped | Where it is pinned |
|---|---|---|
| REQ-001 preserve-by-default | `write-containment.ts:782` (`const mode = opts.mode ?? 'preserve';`), `write-containment.ts:745` | `fanout.vitest.ts:379`, `fanout.vitest.ts:395` |
| REQ-002 baseline-targeted restore | `write-containment.ts:807`, `write-containment.ts:811`, `write-containment.ts:732` | `write-containment.vitest.ts:231`, `write-containment.vitest.ts:180` |
| REQ-003 separated outcomes | `write-containment.ts:48` carries the full remedy vocabulary | `fanout.vitest.ts:411`, `fanout-pool.vitest.ts:238` |

`acceptance-criteria.md:63` through `acceptance-criteria.md:70` mark seven criteria `Met`
with suite counts, and `tasks.md:38`, `tasks.md:40` mark T002 and T003 `[x]` with
recorded evidence. The "what shipped" surface is therefore false in the strongest
available way: it does not merely omit the work, it denies it.

#### F002 — The acceptance-criteria closure block contradicts the criteria table directly above it, and its Status field contradicts `spec.md`

`acceptance-criteria.md:98`, `acceptance-criteria.md:100`, `acceptance-criteria.md:50`, `spec.md:36`

The document that "decides whether the packet may close" states **Closeable: No** and
justifies it with "Nothing is built yet. The packet is planned, and the eleven criteria
above are the gate it will be measured against." Eleven lines earlier, its own table
records seven rows `Met` with observed evidence and four rows (`AC-002`, `AC-009`,
`AC-010`, `AC-011`) `Unmet`.

`Closeable: No` is still the right conclusion — four criteria are genuinely unmet — but
the sentence supporting it is false, which matters beyond prose. A reader cannot tell
whether the `Met` rows are over-claimed or the closure paragraph is stale, and those two
readings route to opposite next actions: re-verify the evidence, or go implement. The
independent `Status` fields disagree as well, `acceptance-criteria.md:50` reading
`Planned` against `spec.md:36` reading `In Progress`.

#### F003 — `plan.md` was never updated after the research that answered its own open question, so its phase gate still certifies the hazard the research named

`plan.md:306`, `plan.md:45`, `spec.md:273`, `research/synthesis.md:34`

The packet's own sequencing document predates the research that was run to answer its
open question. Modification times put `plan.md` at 2026-09-08 19:59, `research/synthesis.md`
at 2026-09-11 21:36, and `spec.md` at 2026-09-11 21:44 — `spec.md` absorbed the answer,
`plan.md` did not.

The answer is recorded at `spec.md:273` (the `ANSWERED 2026-09-11` block): per-lineage
worktrees must not become the default and the worktree phase must not start until the
startup sweep has a liveness gate and containment's single-repo-root resolution is
specified. It adds a third, verification-shaped requirement: a concurrent negative
control, because a criterion reading "no worktree remains" `passes for a destructive sweep`.

`plan.md` still carries exactly that criterion. `plan.md:306` sets milestone M3 as "A full
fan-out runs with every lineage in its own worktree, and the main checkout shows no
lane-authored change" — the gate the research disqualified. A search of `plan.md` for
`liveness`, `negative control` and `sweep` returns no hits; its dependency table
(`plan.md:162` onwards) covers only `node_modules`/`dist` symlinks and git availability.
`plan.md:45` still has the worktree decision unchecked.

An implementer who follows `plan.md` — the document that exists to say what to do — ships
the hazard; `spec.md` is the only artefact that warns them off it.

#### F004 — The review loop's operator-facing containment contract was not migrated; `/deep:review` readers are routed to the sibling mode's document

`deep-review/references/protocol/loop-protocol.md:280`, `deep-research/references/protocol/loop-protocol.md:287`

`spec.md:96` lists `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`
under Files to Change with "The same containment rules for the review loop". The research
counterpart carries both rules at `deep-research/references/protocol/loop-protocol.md:287`
through `:290` — attribution reports rather than undoes, restore is opt-in and targets
pre-dispatch bytes, untracked files are never deleted, and the two write destinations
(`containment-reverted/*.patch`, `containment/baseline/`) are named.

Searching the review protocol for `preserve`, `revert`, `quarantine` and `out-of-scope`
returns only unrelated hits: `:382` (claim adjudication), `:460` and `:464` (audit-trail
prose), `:535` and `:553` (memory save). Its only `containment` occurrence is `:280`, the
pre-existing cli-opencode posture paragraph that predates this packet.

The consequence is a routing defect, not just a gap. `SKILL.md:128` points operators at
`deep-research/references/protocol/loop-protocol.md` "under Executor Resolution" for both
rules, so a review-mode operator is sent out of their own mode packet to find a rule that
`spec.md:96` says belongs in theirs. `AC-011` requires this surface be migrated; it is not.

#### F005 — Superseded containment wording survives in the command YAMLs, describing a remedy the code no longer applies

`deep-review-confirm.yaml:1213`, `deep-research-confirm.yaml:1141`, `deep-review-auto.yaml:1516`

Two confirm-mode YAMLs still describe the guard to the operator as
"Structural write-containment: snapshot out-of-scope dirty paths pre-dispatch, **revert
any NEW out-of-artifact-dir change post-dispatch, fail closed on violation**".

Neither clause is true of the shipped guard. `write-containment.ts:782` defaults the mode
to `preserve`, so nothing is reverted; and `fanout.vitest.ts:402` through `:405` pin
`events.filter((event) => event.event === 'failed')` to `[]` with
`{ total: 1, succeeded: 1, failed: 0 }`, so a completed lane with containment findings
does not fail closed.

`deep-review-auto.yaml:1516` carries the same stale contract inline: three comment lines
still read "Revert any NEW out-of-artifact-dir change it made ... and fail the iteration
fail-closed", sitting directly above code that prints "left on disk" and returns
`dispatchExit` unchanged. This is the shape the code-quality standard calls out worst —
a comment that contradicts the line beneath it, and that a reader will trust over the
line.

No YAML passes a `containment` mode at all, so each relies on the executor-config default.
That is behaviourally correct today and brittle in exactly one direction: an operator who
follows the confirm-mode description and opts into `restore` gets a remedy they were told
was already the default. `AC-011` requires the superseded wording be gone; it remains on
three surfaces.

### P2, Suggestion

#### F006 — Two live-probe markers are stranded in `tasks.md` with no owning task

`tasks.md:298`, `tasks.md:299`

The final two lines of the packet's task breakdown are:

```
<!-- live containment probe: a concurrent writer touched this file mid-lane -->
<!-- second live probe: concurrent write after the baseline snapshot -->
```

They sit after the sign-off table, belong to no task, and state an event rather than a
durable reason. An authored packet document is the wrong host for probe residue: a reader
cannot tell whether these are fixture setup, recorded evidence, or an accident, and the
second one carries information — a concurrent write landing *after* the baseline snapshot,
which is precisely the case `write-containment.ts:807` handles — that would be useful
recorded as a test reference and is useless recorded as a stray comment.

#### F007 — Both stale `_memory.continuity` blocks point the next session at work that has already landed

`acceptance-criteria.md:14`, `acceptance-criteria.md:17`, `implementation-summary.md:16`, `implementation-summary.md:28`

`acceptance-criteria.md` still carries `last_updated_at: "2026-09-08T18:20:00Z"`,
`recent_action: "Wrote eleven closure criteria for the four hardening requirements"`,
`completion_pct: 0` and `next_safe_action: "Implement Phase 1 and record evidence against
the first four criteria"`. `implementation-summary.md` carries the same date with
`recent_action: "Left this document as a planned stub; no phase has run"`.

Phase 1 has landed: `tasks.md` holds 12 completed tasks and the criteria table records the
evidence. Because `/speckit:resume` resolves context in the order
`handover.md -> _memory.continuity -> spec docs`, and neither `handover.md` nor a
`checklist.md` exists in this packet, the continuity block is the second thing the next
session reads — and it will send that session to re-implement Phase 1.

Both blocks also carry `session_dedup.fingerprint: "sha256:00000000...0000"`, an all-zero
placeholder. A fingerprint that cannot be recomputed cannot be checked for freshness, so
the staleness above is undetectable by tooling and will persist until a human reads it.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `write-containment.ts:782`, `fanout.vitest.ts:411`, `write-containment.vitest.ts:231` | REQ-001 (preserve half), REQ-002 and REQ-003 resolve to shipped, test-pinned behaviour; REQ-001's quarantine half, REQ-004 and REQ-005 have no implementation. `quarantine` returns zero hits across `write-containment.ts` and `fanout-run.cjs`; the patch destination is `containment-reverted/` at `write-containment.ts:711`. |
| `checklist_evidence` | partial | hard | `acceptance-criteria.md:63`, `tasks.md:38`, `implementation-summary.md:96` | Every citation spot-checked in the acceptance table resolved exactly (`fanout.vitest.ts:379`, `:391`, `:395`, `:411`; `write-containment.vitest.ts:172`, `:180`, `:231`; `fanout-pool.vitest.ts:238`; `executor-config.ts:688`), so that surface is trustworthy. It is contradicted by `implementation-summary.md`'s Verification table, which reports every check "Not run". No `checklist.md` exists at Level 3. |
| `feature_catalog_code` | partial | advisory | `feature-catalog/fanout/fanout-run.md:56` | `spec.md:98` lists this entry for "The containment paragraph and the orchestrator-owned-paths note". Its sole `containment` occurrence is `:56`, describing containment windows generally; the preserve-by-default paragraph is not there. |
| `playbook_capability` | not_executed | advisory | — | Not enumerated in this pass. One iteration cannot both sweep four dimensions and audit the playbook corpus; recorded under Deferred Items as a follow-up check rather than reported as passing. |

## Assessment

- New findings ratio: 0.70
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: every finding is new to this lineage — iteration 1 of 1, no prior
  packet state under `review/lineages/containment-live-2/`. The ratio is severity-weighted
  rather than a raw count: five P1s at weight 5.0 and two P2s at weight 1.0 against an
  empty prior registry. No P0 contributes, so the P0 override that would force the ratio to
  0.50 and block convergence does not apply.

**On the absence of a P0.** The destructive defect this packet exists to fix is genuinely
fixed: `write-containment.ts:782` defaults to preserve, and `fanout.vitest.ts:379` pins
the out-of-scope file still holding the lane's bytes. Nothing in the shipped guard destroys
unattributable work, and no containment path deletes a file, so there is no correctness
failure and no security defect to report at P0. The findings are contradictions in the
packet's account of itself, and the P1-to-P0 ladder — "demonstrated data loss, security
breach, or hard-gate failure" — is not cleared by any of them. F003 comes closest, since an
implementer following `plan.md` would ship the sweep hazard, but it stays P1 deliberately:
the authoritative correction is present in `spec.md:273`, `spec.md` outranks `plan.md`, and
"the plan is stale" is a different claim from "the packet will cause loss".

## Adversarial Self-Check

**F001 — Hunter.** Could the runtime code predate the packet, with the criteria table
borrowing unrelated tests as evidence? Traced: `executor-config.ts:688` is the containment
block that `tasks.md:38` names as T002's deliverable and marks `[x]`; `AC-004` cites that
same line. The evidence is packet-specific, not opportunistic.
**Skeptic.** The file was rewritten mid-review by another writer, so the first-read bytes are
not the bytes under review. Re-derived against the post-rewrite file: the body sections still
denied completion at `:45`, `:54`, `:66` and `:74` after the verification table landed at
`:96`–`:101`, so the contradiction is internal and no longer depends on any other document.
The finding strengthened rather than dissolved.
**Skeptic, second pass.** Could the body sections be a template skeleton nobody reads, while
the table is the live content? `:74` names the three implementation changes and the four
verification steps in prose that is specific to this packet, not boilerplate. Rejected.
**Referee.** Claim survives on the rewritten bytes. P1, traceability.

**F002 — Hunter.** Is there a reading where "Nothing is built yet" is true? Only if the
seven `Met` rows are fabricated. Spot-checked three of them against the source and all
three resolved to the exact line claimed. Rejected.
**Skeptic.** Does the contradiction change any action? Yes — it is the difference between
"verify the evidence" and "go build", and it disagrees with `spec.md` on packet status.
**Referee.** Claim survives. P1, traceability. The `Closeable: No` verdict itself is not
challenged; only its stated reason and the status conflict are.

**F003 — Hunter.** Could `plan.md` have been updated without its mtime moving? Not
plausibly under normal editing, and the textual check is independent: `liveness`,
`negative control` and `sweep` are absent from its content. Two independent checks agree.
**Skeptic.** Is M3 at `plan.md:306` really the disqualified criterion? `research/synthesis.md:34`
says a criterion reading "no worktree remains" passes for a destructive sweep; M3 asserts
the main checkout shows no lane-authored change, which is the same shape — satisfied by a
sweep that deletes everything. Accepted as the same hazard class.
**Referee.** Claim survives, and stays P1 for the reason recorded above: `spec.md` carries
the correction and outranks the plan, so the packet does not currently authorise loss.

**F004 — Hunter.** Could the review rules live in a shared doc instead? The hub SKILL.md
routes to the *research* packet's loop protocol, which is the routing defect, not a
defence. Rejected.
**Skeptic.** Is the review protocol in scope? Yes — `spec.md:96` lists it by path.
**Referee.** Claim survives. P1, traceability.

**F005 — Hunter.** Is the YAML text perhaps describing `enforceWriteContainment`'s
`restore` branch, which does still fail closed? `write-containment.ts:782` defaults to
`preserve` and the YAML passes no mode, so the described branch is not the one that runs.
Rejected.
**Skeptic.** Is stale YAML prose worth P1 rather than P2? These are confirm-mode operator
gates — the text a human approves at each iteration. Telling an operator that a remedy
already reverts, when it does not, is the misinformation this packet's own R-002 risk names
("preserve-by-default is read as containment was removed"). P1 stands.
**Referee.** Claim survives. P1, maintainability.

## Ruled Out

- **A P0 against REQ-001's missing quarantine.** `AC-002` already records it `Unmet`, and
  `spec.md:112` scopes quarantine as the remedy for a *preserved* path, which preserve mode
  already satisfies without copying. An unbuilt deliverable in a partially-landed packet is
  not a finding; reporting it as one would add no information an operator lacks.
- **A P0 against the absent worktree phase.** `AC-009` records it `Unmet` and `spec.md:273`
  now gates it behind two specified preconditions. The gap is tracked by the packet itself.
- **Treating `containment-reverted/` as a violation of REQ-001's `containment/quarantine/`
  path.** The directory name differs from the spec, but the capability the spec asks for —
  a recoverable copy of the out-of-scope change — is served by `containment-reverted/*.patch`
  plus `containment/baseline/`, both inside the lineage directory. A naming mismatch between
  a shipped path and a planned path is P2-grade at most and is not worth an operator's time
  on its own.
- **A P1 against the missing `checklist.md` at Level 3.** The packet's closure gate is
  `acceptance-criteria.md`, which exists and is maintained, and the in-scope requirement set
  does not make `checklist.md` load-bearing here. Noted in the protocol table, not raised as
  a finding.

## Dead Ends

- **Enumerating `playbook_capability`.** Could not be completed inside one iteration's tool
  budget alongside four dimensions. Recorded as `not_executed` rather than guessed at.
- **Recomputing the criteria suite counts.** `Suite: 271 passed`, `54 passed`, `19 passed,
  1 skipped` are reported by `acceptance-criteria.md`; reproducing them means running the
  Vitest suites, which writes outside this lineage's directory. Taken as reported, with the
  individual line citations independently verified.
- **Proving the probe in F006 executed.** The markers' presence is verified; whether a
  given probe run produced them is not reconstructible from the packet.

## Recommended Next Focus

Not applicable — this lineage's ceiling is one iteration and it has been reached. For the
maintainer who picks the packet up, in descending value:

1. Reconcile the three documents that disagree about what has shipped: F001, F002, F007.
   This is bookkeeping with zero design content and it is the difference between the next
   session continuing the work and restarting it.
2. Update `plan.md` from `spec.md:273` before Phase 4 is allowed to start: F003. The M3 gate
   needs the concurrent negative control to be able to fail.
3. Finish the `AC-011` migration: F004 and F005. Two documentation surfaces and three stale
   lines.

## Audit

- Previous verdict: none (first iteration)
- Consistent: yes — first iteration of the lineage, no prior verdict to contradict
- Claim-adjudication packets: 5 emitted (F001–F005), one per new P1. No new P0 exists, so
  no P0 packet is owed.
- Findings carried forward: 0
- Findings resolved: 0

### Concurrent-write note

`implementation-summary.md` was rewritten in the main checkout by a second writer while this
iteration was running. Timestamps: that file 22:39:04, this lineage's first artifact write
22:42:11. Its Verification table grew from a single "Not run — no implementation exists" row
into five rows reporting 2,539 passing runtime tests, 54 containment tests, 223 fan-out and
pool tests and a passing end-to-end stress reproduction, and its Known Limitations section grew
from three entries to five.

Everything downstream of that write was re-derived rather than carried:

| Surface | Effect of the rewrite |
|---|---|
| F001 evidence and claim | Rewritten. The contradiction moved from cross-document to intra-document and strengthened. |
| F001 adjudication packet | `evidenceRefs` and `counterevidenceSought` rewritten; severity and confidence unchanged. |
| F002, F003, F004, F005, F006, F007 | Re-verified against current bytes. `acceptance-criteria.md` (`Planned`, `Nothing is built yet`, seven `Met`), `spec.md:36` (`In Progress`), `plan.md:306`, and `tasks.md:298-299` are all unchanged. |
| `spec_code` protocol | Extended, not altered: `implementation-summary.md:99` is now independent confirmation of the end-to-end behaviour already cited from `fanout.vitest.ts:411`. |

This is the hazard the packet exists to address, observed live rather than reconstructed: two
writers in one checkout, neither able to attribute the other's changes. The guard's preserve
default is why the other writer's edits survived this review instead of being rolled back. It
is reported as methodology, not as a finding against the packet.

### Residual risks the packet now records against itself

Two entries added to `implementation-summary.md`'s Known Limitations during this run are
load-bearing for anyone reading this verdict, and neither is a finding because the packet
discloses them honestly:

- `:111` — containment does not run when an artefact or stop-policy gate rejects the lane first,
  so an out-of-scope write by a failing lane goes unreported. This is a deliberate ordering, and
  it is also a detection gap worth knowing about when reading `AC-001`'s stress result.
- `:112` — the `cli-pi` leaf can emit duplicate state records for one iteration; a live run
  produced five, and the max-iterations validator refused it. This blocks the
  `max-iterations` stop policy on this executor until fixed. It is directly relevant to this
  lineage, whose ceiling is `maxIterations: 1` and whose executor is `cli-pi`; this run emitted
  exactly one state record per iteration, so it did not reproduce the defect, and it did not
  need the max-iterations validator to accept its stop.

### Write-containment disclosure

This lineage ran under the containment behaviour it was reviewing. Every write landed inside
`specs/system-deep-loop/045-fanout-write-containment-hardening/review/lineages/containment-live-2/`.
`generate-context.js`, `validate.sh` and every git write operation were withheld by the lineage's
contract, so continuity was not saved to the packet's canonical documents and the repository
validator was not run. Both are out of scope for this lineage by construction and are owned by
the fan-out orchestrator.

`resolveArtifactRoot` was not invoked: the artifact root was bound directly from
`config.fanout_lineage_artifact_dir`, per the lineage's execution contract.

## Claim Adjudication Packets

One typed packet per new P1. F006 and F007 are P2 and owe no packet.

```json
{
  "findingId": "F001",
  "claim": "implementation-summary.md contradicts itself: its Verification table reports a 2,539-passed runtime suite, a 54-passed containment suite, a 223-passed fan-out and pool run and a passing end-to-end stress reproduction, while its description, metadata, What Was Built, Files Changed and How It Was Delivered sections still state that nothing is built and nothing was changed.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:96",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:54",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:45",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:66",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:16"
  ],
  "counterevidenceSought": "Read the file whole rather than the anchors, looking for a scoping sentence limiting either account to a later phase; checked whether the verification table might name a different packet; checked whether the runtime code and the criteria table might both predate the packet. No scoping sentence exists, the table names this packet's suites and the file's own limitation list, and AC-004 cites executor-config.ts:688 which tasks.md:38 attributes to T002, so the code is this packet's evidence and not borrowed.",
  "alternativeExplanation": "The document may be intentionally un-updated until the packet closes, so that its completion claim cannot be read before the work lands. Rejected: a planned-stub is coherent only while the packet is planned, and the packet has landed three of its requirements and recorded the evidence itself; the denial now misroutes the next reader rather than protecting them.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade to P2 if implementation-summary.md gains a scoping header that marks its body as pre-Phase-1 and names acceptance-criteria.md as the authoritative shipped-state surface.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "The acceptance-criteria closure statement says nothing is built and its metadata Status says Planned, while the criteria table eleven lines above records seven rows Met with observed test evidence, and spec.md records the packet Status as In Progress.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:98",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:100",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:36"
  ],
  "counterevidenceSought": "Checked whether the four Unmet rows make the closure prose unreachable or excusable, re-read the criteria table for a superseding note, and spot-checked three Met rows against source to rule out a fabricated table: fanout.vitest.ts:379, :391 and :395 each resolved to the exact assertion claimed, as did write-containment.vitest.ts:172 and :180.",
  "alternativeExplanation": "The closure block was written before the Phase 1 evidence was recorded and never revisited, which makes it stale rather than false. Accepted as the mechanism, rejected as a defence: the same file's table and its closure paragraph are two answers to one question, and the Status field additionally contradicts spec.md.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade to P2 once the closure paragraph names the four unmet criteria as its reason and the Status field matches spec.md.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "plan.md was not updated after the research that answered its own open question, so its M3 milestone still certifies a worktree sweep the research identified as indistinguishable from a destructive deletion pass, and none of the research's three plan-changing preconditions appear in it.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:306",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:45",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:273",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/research/synthesis.md:34"
  ],
  "counterevidenceSought": "Grepped plan.md for liveness, negative control and sweep and found no hits; read its dependency and risk tables for a precondition that covers the same ground and found only node_modules and dist symlinks plus git availability; checked modification times and confirmed plan.md predates research/synthesis.md while spec.md postdates it.",
  "alternativeExplanation": "The research may be advisory input that the author judged already satisfied by the plan's fallback wording, since plan.md:165 has the worktree phase degrade to in-checkout behaviour on failure. Rejected: the fallback addresses worktree creation failing, not a sweep deleting a live peer's untracked output, which is the failure the research names.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if plan.md is regenerated from spec.md:273 with the liveness gate, the copy-back write semantics and the concurrent negative control present in the phase gate itself.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F004",
  "claim": "The review mode packet's loop protocol contains none of the two containment rules that spec.md assigns to it, leaving review-mode operators routed by the hub SKILL to the deep-research packet's protocol document for a rule their own mode packet should carry.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280",
    ".opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287",
    ".opencode/skills/system-deep-loop/SKILL.md:128",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:96"
  ],
  "counterevidenceSought": "Searched the review protocol for preserve, revert, quarantine and out-of-scope and inspected every hit to confirm each belongs to unrelated subject matter rather than to containment; read the file's own resource table for a cross-reference that would make the omission intentional.",
  "alternativeExplanation": "The rules may deliberately live in one shared document to avoid duplication, and the hub SKILL's routing may be the intended single source. Rejected: spec.md:96 lists the review protocol by path as a surface to change, so the packet's own scope document disagrees with the shared-document reading.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade to P2 if the review protocol gains an explicit pointer to the shared rule that names both write destinations, or if spec.md is amended to record that the rules are intentionally single-sourced.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F005",
  "claim": "Three command YAML surfaces still tell an operator that write containment reverts out-of-artifact-dir changes and fails closed on violation, which the shipped guard does not do because the mode defaults to preserve and a completed lane settles successfully while carrying the finding.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep-review-confirm.yaml:1213",
    ".opencode/commands/deep/assets/deep-research-confirm.yaml:1141",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1516",
    ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:782",
    ".opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:402"
  ],
  "counterevidenceSought": "Checked whether the YAML text describes a restore branch that still behaves as stated, grepped all four YAMLs for a containment mode flag to see whether one is passed, and read the auto-mode call site to see what the code does after detect.",
  "alternativeExplanation": "The wording may be legacy prose that no operator reads because the confirm gate presents findings rather than this note. Rejected: the note is the branch description a human approves at each confirm-mode dispatch, and the packet's own R-002 risk is precisely that preserve-by-default gets misread as containment having been removed.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade to P2 once the three notes describe preserve-by-default and the opt-in restore flag, since the behavioural defect would then be documentation-only drift with no operator misinformation.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

Review verdict: CONDITIONAL
