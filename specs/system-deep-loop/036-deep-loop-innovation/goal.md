# Execution Goal — Complete the 036 Deep-Loop Innovation Epic

> This is the durable, long-form execution plan. It complements the separate goal prompt that must remain at or below
> 4,000 characters. It does not itself authorize a mode flip, writer retirement, push, or merge.

## 1. Epic overview and planning baseline

Packet 036 turns 178 research recommendations into one convergent deep-loop runtime architecture: a typed append-only
event ledger behind a fail-closed transition-authorization gateway, with sealed reference artifacts, deterministic
replay fingerprints, receipts and certificates, and blinded/counterfactual adjudication. The migration model is
additive and dark first, then per-mode authority cutover behind rollback windows, then legacy-writer retirement after
measured zero use.

| Field | Durable value |
|---|---|
| Planning anchor | `origin/skilled/v4.0.0.0` at `a677adb195`, as frozen by the 2026-08-09 briefing |
| Branch destination | `skilled/v4.0.0.0`, then an explicitly approved merge to `main` |
| Current program shape | Phases 001–013 landed; remediation blockers discharged; 014/001 and 014/003 landed; 014/002 was building at the briefing anchor |
| Remaining critical path | Accept 014/002 build → execute eight mode cutovers → build and execute 015 → run 016 Stage B → execute 017 → merge |
| Authority rule | Legacy remains authoritative until one named mode passes every gate and an operator authorizes that exact transition |
| Audit rule | A flip is irreversible as an append-only historical fact, although runtime routing remains reversible during its governed rollback window |

The local origin ref can advance while work is in progress. During this document review it had already moved beyond
`a677adb195` and contained a dark 014/002 candidate. That observation does not change the planning anchor or prove the
candidate acceptable. At the start of every phase and immediately before every land, capture the fresh origin tip and
reconcile the candidate against it. If 014/002 is already landed, “finish the build” means independently accept or
reopen that exact landed candidate; it does not mean rebuild it blindly.

### Current delivered substrate

- 014/003 supplies cutover-certificate assembly/verification and rollback-window evaluation. Its unit suite has 41
  tests at the briefing anchor.
- 014/001 supplies the five disposition executors, fenced resumable migration coordinator, durable receipts, and
  successor handoff. Its unit suite has 31 tests at the briefing anchor.
- 014/002 supplies or is expected to supply the dark authority registry, selector, preflight, manifest guard,
  authority-transition event, and cutover coordinator. The reviewed candidate suite contains 42 tests.
- All new ledger writes must pass the transition-authorization gateway and
  `appendAuthorizedThroughFence`. No live path may regain a public append escape hatch.

### Source-of-truth and drift policy

1. The briefing and this document define the remaining execution intent.
2. Existing phase specs own their domain contracts.
3. Runtime code and tests prove what is actually implemented.
4. If those sources disagree, stop at the earlier safe authority state. Do not reinterpret a contradiction during a
   live cutover.
5. Every “COMPLETE” report is a hypothesis. Independently rerun typecheck, the relevant per-file suites, the cast and
   append-boundary greps, the scoped diff, and strict validation before accepting it.

## 2. Non-negotiable execution and landing mechanics

### 014 build worktree

- Build serially in `.worktrees/0135-skilled-014-cutover` from the fresh
  `origin/skilled/v4.0.0.0` tip. The 014 children are ledger-adjacent and must not be built in parallel.
- Symlink `runtime/node_modules` and `system-spec-kit/node_modules` from the main checkout as described in the
  briefing. Record the resolved targets before running commands.
- From `.opencode/skills/system-deep-loop/runtime/`, typecheck with:

  `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json`

- Run Vitest per file only with `node_modules/.bin/vitest run <file> --no-coverage` and
  `fileParallelism: false`. Never substitute the aggregate suite: append-lock contention can make the aggregate hang.
- Before each per-file suite, restore only the isolated build worktree’s test `database/` fixture to its known clean
  state. First prove that path contains no operator work. Do not run a broad checkout in the dirty 0129 worktree.
- The 0135 worktree lacks Spec Kit `scripts/dist` and `tsx`. Never claim strict validation passed there.

### Canonical/twin documentation and validation

- The 0129 canonical `specs/` tree is sparse and can false-fail sibling references. Run strict validation against the
  full-tree `.opencode/specs/` twin in 0129.
- In this worktree `.opencode/specs` is a real directory; on origin it resolves to `specs`. When execution updates
  packet docs, copy deliberately between canonical and twin paths, compare them byte-for-byte, and land the canonical
  `specs/` path.
- Regenerate child metadata with:

  - `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js <child> <repo-root>`
  - `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/backfill-graph-metadata.js <child>`

  Re-add `level` if regeneration drops it, then validate again.

### Evidence and landing

- Completed task/checklist rows must cite a concrete runtime symbol or named test plus the suite digest, candidate SHA,
  result, and exit code. A citation only to `spec.md` is not evidence.
- Keep `_memory.continuity.recent_action` and `next_safe_action` at 90 characters or fewer.
- Land with `/tmp/ks/land-wt0129.sh <paths-file> <msg-file>`. The path file must name the exact runtime directory,
  exact test file, and exact documentation directory. The lander must seed from the fresh origin tip, allow zero
  deletions unless deletion is the approved 015 action, and reject anything outside the named prefixes.
- New writes use `appendAuthorizedThroughFence` with a gateway proof. The changed paths must have zero direct
  `.appendAuthorized(` calls and zero `as any`/`as unknown` cast-arounds used to reach the private append boundary.
  Canonical-JSON `as unknown as JsonObject` conversions remain permitted when unrelated to append access.
- Do not terminate shared Codex/OpenCode processes by name. Capture and terminate only the PID owned by the current
  run.
- An automated stop hook, task notification, green test, or agent message is never operator consent.

## 3. Remaining roadmap and objective phase gates

### Phase 014/002 — finish and accept the dark authority-flip build

**Objective:** deliver an unwired, mode-keyed selector and cutover coordinator that cannot move live authority and is
safe enough to become the only authority-transition mechanism after explicit wiring.

**Pass gates:**

1. `tsc` exits 0.
2. These suites run separately and all exit 0:

   | Suite | Required count |
   |---|---:|
   | `tests/unit/per-mode-authority-flip.vitest.ts` | 42/42 |
   | `tests/unit/cutover-certificate.vitest.ts` | 41/41 |
   | `tests/unit/inflight-state-migration.vitest.ts` | 31/31 |
   | Total | 114/114, zero skipped |

3. The order guard rejects every out-of-order request, not only benchmark variants before
   `deep-improvement-common`. A predecessor matrix proves all eight positions.
4. Migration preflight rejects every vetoing `BLOCK` row and every unresolved active `PIN` row. A `PIN` may survive
   only if a tested per-run legacy route remains isolated after the mode-level flip; otherwise the mode cannot flip.
5. Gateway identity verification is wired as a required deployment dependency. Tests prove that actor, capability,
   and evidence identities are positively resolved and recorded; a missing resolver, null resolution, or partially
   pinned identity denies a live cutover.
6. Authorization state and proof freshness are rechecked at the fenced append boundary. Replayed or stale decisions
   cannot authorize a transition after the head, epoch, policy, identity, or evidence changes.
7. The authority record and transition event have a proved atomicity model. The reviewed candidate appends the event
   before publishing the authority-record CAS, so it is a recoverable two-step protocol rather than a single storage
   transaction. Acceptance requires one of:

   - a true shared atomic transaction; or
   - an explicit write-ahead/intention state plus deterministic recovery proving that every crash point converges,
     readers never observe false dark authority, and a post-append CAS conflict cannot strand an uncompleted
     transition.

8. Crash tests include real process death, not only a thrown callback. They prove recovery from a stale `wx`
   transaction lock and from death before/after authorization, ledger append, registry publication, and receipt
   persistence.
9. A missing authority record does not silently hide provisioning mistakes. Either live wiring pre-creates and verifies
   all eight legacy records, or the contract is ratified to treat missing as a typed denial. The dark unit-test default
   is not sufficient evidence for production.
10. `rg` returns zero unauthorized append/cast escape hatches in changed code. The scoped diff contains only the
    expected 014/002 runtime directory, its unit test, and its packet docs.
11. Strict validation of the 014/002 full-tree twin exits 0 with Errors 0 and Warnings 0.
12. The leak-guard land produces zero unintended deletions and the landed tree equals the independently verified
    candidate tree.

**Fail:** any failed/omitted test, implicit live wiring, incomplete order enforcement, tolerated veto row, optional
identity verification, unhandled crash state, unauthorized append path, out-of-scope diff, or strict-validation
warning. Remain legacy-authoritative.

### Phase 014 execution — eight evidence-gated authority cutovers

**Objective:** move exactly one mode at a time into `new_authoritative_reversible`, prove its live rollback path, and
retain all evidence until its window closes.

**Pass gates:**

- 8/8 modes complete in the frozen order; 0 skipped and 0 batch transitions.
- Every accepted transition is bound to one candidate SHA, source epoch, policy digest, certificate digest, migration
  handoff digest, rollback asset-set digest, operator identity, and request digest.
- For each mode, the selected record advances exactly one epoch, one transition event is durably present, the other
  seven authority records are byte-identical, stale legacy writes are denied, and the open rollback-window record is
  valid.
- Each mode passes the live rollback drill below. If the drill restores legacy, returning the mode to dark authority
  requires fresh evidence, a fresh certificate, and a new STOP-for-approval.
- No next-mode transaction begins while a cutover or rollback transaction is active. The operator must ratify the
  maximum number of simultaneously open reversible windows; the safe default is one.

**Fail:** any stale/mismatched evidence, open migration veto, identity uncertainty, parity divergence, failed drill,
unreconciled effect, health/replay/receipt/budget signal, CAS/event ambiguity, changed candidate, or absent explicit
approval. Leave or restore the selected mode on legacy at a new epoch; do not advance the order.

### Phase 015 — build evidence collection, then retire legacy writers

**Objective:** prove no live legacy path is used, preserve historical read compatibility, and delete only the approved
live writer/helper set in a separately approved irreversible action.

**Pass gates:**

1. All 26 implementation tasks and all 29 checklist items are complete with exact evidence.
2. The phase-003 census and current static/runtime inventory reconcile to a frozen delete/retain manifest with zero
   unknown rows.
3. Every mode has a valid cutover history, final dark-authority epoch, closed later-of-14-days-and-five-successful-runs
   window, retained rollback assets, and zero unresolved revert signals.
4. Telemetry covers every legacy live writer and live canonical-reader boundary, including dynamic routes, subprocess,
   resume, retry, replay, repair, rollback, and shared-backend paths.
5. Positive controls produce the expected telemetry before the zero-use interval begins. The ratified observation
   window then exercises every declared path and reports zero live legacy events and zero uninstrumented paths.
6. Historical fixtures cover every retained schema family and complete with read-only archival classification and zero
   canonical writes.
7. A pre-delete restoration rehearsal succeeds from the retained source anchor and rollback evidence.
8. The deletion diff exactly equals the approved manifest. `git diff --name-status` reports no unexpected path, and
   static greps find zero remaining live legacy writer registrations/calls while retaining the named readers,
   decoders, upcasters, schemas, projections, and fixtures.
9. The phase’s frozen test manifest records the expected file and test counts before deletion; executed equals
   declared, every suite exits 0, and zero tests are skipped. Do not invent counts before the build defines the
   manifest.
10. `tsc` exits 0; changed-comment hygiene grep is clean; strict packet validation exits 0 with Errors 0 and Warnings 0.
11. The phase-016 handoff binds the exact candidate SHA, deletion diff digest, retention manifest, telemetry report,
    historical-read results, rollback evidence, commands, counts, and exit codes.

**Fail:** open rollback window, nonzero live use, failed positive control, unknown path, archival-read failure, manifest
drift, changed candidate, test failure/skip, or missing restoration evidence. Stop before deletion.

### Phase 016 Stage B — whole-system acceptance gate

**Objective:** accept the post-retirement system on one frozen SHA without changing tracked runtime or spec state.

The complete acceptance matrix appears in section 6. Stage B passes only when every matrix row is green on the same
candidate/BASE pair, the blocking SOL review approves it, and recursive strict validation is clean.

### Phase 017 — integrate latest and close out

**Objective:** reconcile moving-origin drift, rerun Stage B on the exact final candidate, and make all parent/child
documentation and evidence agree before merge.

**Pass gates:**

1. A clean integration worktree records the pre-integration origin SHA, integrated tip, merge result, final candidate
   SHA, and zero unexpected mutation. Merge conflicts stop the phase.
2. Every changed contract is classified relevant/non-relevant with an owning phase. Relevant drift reopens its owner
   and all affected downstream gates; no stale pre-integration receipt is presented as final.
3. The entire Stage-B matrix passes again on the exact final SHA.
4. The 178-row ledger has one disposition per row; every carried-forward item has an owner and next action.
5. Parent phase map, child statuses, completion percentages, checklists, tasks, implementation summaries, changelogs,
   `description.json`, and `graph-metadata.json` are mutually consistent.
6. Canonical and twin packet paths compare equal after deterministic regeneration.
7. Recursive strict validation from the full-tree twin exits 0 with Errors 0 and Warnings 0.
8. Leak-guard scope shows only approved closeout paths and zero unintended deletion.

**Fail:** conflict, unexplained drift, reopened phase not reclosed, stale receipt, Stage-B failure, metadata mismatch,
canonical/twin mismatch, out-of-scope diff, or strict-validation warning. Do not request merge approval.

### Merge to main

**Objective:** merge the exact accepted final SHA and nothing else.

**Pass gates:** final SHA equals the Stage-B/SOL-reviewed SHA; the merge diff and commit set are frozen; mainline CI or
the repository’s required local gates are green; rollback/revert instructions and evidence retention are recorded; and
the operator explicitly approves this exact merge. Re-resolve the main tip immediately before merging. Any drift
invalidates the approval and requires integration recensus plus the affected final gates.

## 4. Per-mode authority-cutover execution runbook

### Frozen mode order

| Order | Mode | Additional ordering rule |
|---:|---|---|
| 1 | `deep-research` | First cutover candidate |
| 2 | `deep-review` | Starts only after order 1’s immediate stabilization/drill gate |
| 3 | `deep-ai-council` | Independent selector, evidence, and rollback assets |
| 4 | `deep-improvement-common` | Must precede all three variants |
| 5 | `agent-improvement` | Separate epoch/certificate despite shared services |
| 6 | `model-benchmark` | Separate epoch/certificate despite shared services |
| 7 | `skill-benchmark` | Separate epoch/certificate despite shared services |
| 8 | `deep-alignment` | Eighth and last; isolate its review-loop coupling |

The briefing’s “(8th)” placeholder resolves to `deep-alignment` from the phase contract and runtime mode set. Freeze
this list in the execution manifest and hash it. An implementation that merely prevents variants from preceding common
does not enforce this order.

### Preconditions before any mode is considered

1. Freeze the candidate SHA, BASE SHA, tool versions, gate-manifest digest, mode-order digest, and clean worktree.
2. Confirm the 014/002 build gates above passed on that exact candidate.
3. Provision and verify all eight authority records in `legacy_authoritative` or `cutover_ready` with explicit epoch,
   policy, and record digests. Do not rely on an absent-record default.
4. Wire the gateway’s real deployment `identityResolver` before the selected mode can become authoritative. It must:

   - resolve the expected actor, capability, and evidence digest from trusted deployment state;
   - deny null, partial, unavailable, or mismatched resolution for authority-transition events; and
   - emit audit evidence that all three identities were positively verified.

5. Prove authorization decisions capture current authority state and cannot be replayed after head, epoch, policy,
   identity, capability, evidence, candidate, or decision freshness changes.
6. Verify all runtime ledger writes use the fenced seam and the fence capability is minted by the current durable lease
   holder and rechecked at commit.
7. Verify there is no active cutover/rollback transaction and no stale transaction or mode lock. Exercise the
   process-death recovery procedure before live use.
8. Freeze the selected mode’s admission, effect, lease, and in-flight-state snapshot long enough to validate migration
   evidence. A vetoing `BLOCK`, aborted row, or unisolated active `PIN` denies the flip.
9. Retain and content-bind the legacy adapter, rollback anchor, historical reader, reconciliation procedure, and all
   required rollback assets.
10. Ratify the post-flip health thresholds, authoritative-success predicate, rollback triggers, observation duration,
    and maximum open-window policy. Unset thresholds are a blocker.

### Per-flip gate and commit sequence

Execute the following for one mode only:

1. **Refresh mode gate.** Run the selected mode’s behavior, sealed-artifact/certificate, replay, resume, rollback-switch,
   and negative write-isolation checks. Require the declared count, exit 0, and zero skips.
2. **Refresh parity.** Run independent legacy-versus-ledger derivation on the exact candidate and frozen case set.
   Require zero open divergences, semantic comparison by scenario ID, and matching BASE/candidate/contract/input/
   comparator/projection identities.
3. **Refresh rollback rehearsal.** Verify the phase-008 rollback-drill certificate covers admission freeze, current
   writer fencing, state/effect reconciliation, legacy restoration at a new epoch, stale-writer denial, and integrity.
4. **Refresh migration evidence.** Rehash the classification manifest, migration receipts, handoff, rollback anchors,
   and current source state. Require total row accounting and no veto described above.
5. **Build and append the pre-cutover authorization certificate.** Bind the mode gate, parity, rollback rehearsal,
   mixed-version replay, migration/classification, approving policy, candidate SHA, and source epoch. Append through the
   fenced seam, then run `verifyCutoverCertificate` against the current facts.
6. **Recheck immediately before commit.** Confirm the candidate, head, epoch, policy, identity resolution, evidence
   digests, locks, rollback assets, and all prior mode-order records are unchanged.
7. **STOP — explicit operator go-ahead for this exact mode, candidate, source epoch, certificate digest, and rollback
   plan.** No signal or prior approval substitutes.
8. **Commit the authority transition.** The logical outcome must be one atomic/recoverable commit containing the
   expected-epoch CAS and one authority-transition event. The requested shorthand “atomic CAS → transition event” is
   unsafe if interpreted as two independent writes: CAS-first can expose dark authority without an event, while the
   reviewed implementation’s event-first sequence can strand an event without a published selector. Execute only the
   build-accepted transaction/recovery protocol.
9. **Verify the commit.** Require one new epoch, one transition event, dark canonical routing for the selected mode,
   byte-identical records for the other seven, denial of stale legacy writes, and an opened rollback-window record.
10. **Run an authoritative canary.** Exercise one bounded real execution with disposable external effects where
    possible. Verify receipts, budgets, replay fingerprint, terminal state, sealed artifact, and health.
11. **Run the live rollback drill.** Use the procedure below. A verifier-only dry run does not satisfy this step.
12. **If the drill restored legacy and the mode is to remain dark, STOP again.** Refresh the epoch-bound evidence and
    certificate, obtain a separate operator approval, re-cut over, repeat commit verification, and open a fresh window.
13. **Immediate stabilization gate.** Record health/parity/replay/receipt/budget/reconciliation signals. Only then may
    the operator consider the next mode under the ratified open-window policy.

### Live rollback drill required for every mode

1. Record the mode, dark-authority epoch, ledger head, active admissions, in-flight work/effects, rollback anchor, and
   retained asset digests.
2. Trigger the rollback through the mode’s existing `<mode>-rollback-gate/rollback-switch.ts`. Do not duplicate switch
   mechanics in the certificate package.
3. Freeze new admissions and prove the freeze before state mutation.
4. Fence the dark writer using the current durable lease and prove a stale dark capability cannot append.
5. Reconcile admitted/in-flight work and effects according to the mode’s frozen disposition policy. Preserve all
   ledger events and receipts.
6. Restore legacy authority at a new monotonic epoch; never reuse or decrement an epoch.
7. Append the rollback transition/certificate through the authorized fenced seam.
8. Attempt stale dark and stale legacy writes. Both stale epochs must be denied.
9. Run a bounded legacy canary and verify terminal state, receipts, budgets, replay, and historical reads.
10. Recompute integrity and parity. Require zero lost/duplicated/unauthorized effects and zero unresolved
    reconciliation.
11. Record commands, test counts, exit codes, timestamps, operator, before/after epochs, heads, digests, and verdict.

Any drill failure leaves admissions frozen or the mode safely legacy-authoritative. It blocks re-cutover and every
later mode.

### Certificate lifecycle — remove the current ambiguity

The existing documents use “cutover certificate” for both authorization and post-cutover evidence. Execution must use
distinct lifecycle facts:

1. **Pre-cutover authorization certificate:** `authorityMutation: false`; built and verified before operator approval.
2. **Authority-transition event/receipt:** records the actual epoch and route change.
3. **Rollback-window-open record:** starts at the successful transition commit.
4. **Rollback certificate:** records a live revert when triggered or drilled.
5. **Window-closure certificate/evidence:** only after both 14 calendar days and five trusted authoritative executions,
   with all monitored signals clear.

Phase 015 consumes item 5 plus independent zero-use and archival evidence. It must never treat item 1 as proof that a
flip happened or that a window closed.

## 5. Phase 015 build and retirement plan

### Stage 015-A — reversible inventory and telemetry build

1. Start from a fresh isolated worktree and exact origin tip. Freeze the phase-003 census digest.
2. Build a row-complete inventory of legacy producers, canonical readers, repair paths, dynamic dispatch, generated
   outputs, subprocess paths, shared backends, and historical-read obligations.
3. Classify every row `delete`, `retain`, or `blocked`. Zero unknown rows is mandatory.
4. Add bounded telemetry before deletion. It records mode, operation class, authority epoch, candidate, run/packet
   identity, outcome, and bounded source reference—never secrets, unrestricted prompts, or payload bodies.
5. Instrument live writers and live canonical readers separately from archival readers. Unknown classification fails
   closed.
6. Land instrumentation first, run positive controls, and freeze the observation policy. This is still reversible and
   does not authorize deletion.

### Stage 015-B — zero-use and rollback evidence

1. Require all eight rollback windows cleanly closed under the later-of rule.
2. Exercise every mode plus resume, retry, restart, replay, repair, rollback, shared-backend, and subprocess paths during
   the ratified zero-use interval.
3. Require positive controls to have been observed, then zero qualifying live legacy events and zero uninstrumented
   paths during the real interval.
4. Run historical fixtures for every retained schema family and assert read-only behavior with no canonical append.
5. Rehearse restoration from the pre-delete source anchor. Preserve certificates, transition/rollback events,
   telemetry, migration receipts, and rollback assets.
6. Freeze the delete/retain manifest, candidate SHA, expected deletion diff, test manifest, and rollback evidence
   digest.

### STOP — approve the exact 015 retirement

The operator approval must name the candidate SHA and manifest digest. Any changed path, certificate, authority epoch,
telemetry report, historical fixture result, or test manifest invalidates approval.

### Stage 015-C — ordered retirement

Retire in the same eight-mode order. For each mode:

1. Reverify its final authority epoch, closed window, zero-use row, archival reads, and candidate binding.
2. Remove that mode’s live writer registrations/calls before its replaced helpers.
3. Run its scoped test-manifest row and static writer/reader greps.
4. Compare the actual diff to the mode’s manifest slice; stop on extra deletion.

For `deep-improvement-common`, remove only the common mode’s live binding before the three variants. Retain any shared
implementation still needed by the variants. Remove shared legacy emitters/helpers only after all eight rows pass.

### Stage 015-D — retirement verification and handoff

- Run `tsc`, every declared per-file suite, all historical fixtures, comment hygiene, live-writer absence greps, and
  strict validation.
- Prove the retained archival surface cannot write.
- Prove the final diff equals the frozen manifest and all evidence artifacts remain readable.
- Produce the phase-016 handoff bound to the exact post-delete SHA.
- Do not claim a runtime rollback promise for removed live writers. A source-level revert remains possible before
  downstream integration, but state/evidence compatibility must be reassessed rather than assumed.

## 6. Phase 016 Stage-B whole-system acceptance matrix

Run Stage B in a clean, frozen-SHA worktree after 015 lands. Before execution, publish a gate manifest containing every
command, expected suite/scenario/fixture/fault count, tool version, artifact digest, and owner. “All” means executed
count equals declared count with zero skip/xfail/waiver.

| Gate family | Objective pass condition | Failure owner |
|---|---|---|
| Candidate freeze | One full candidate SHA and one phase-003 BASE SHA; clean tree/index; every artifact and result names that pair | 016 |
| Type/build | Runtime `tsc` exits 0; build commands in the frozen manifest exit 0 | Owning compile surface |
| Eight mode gates | 8/8 independent mode rows pass behavior, certificate/sealed artifact, replay, resume, rollback-switch, and negative writer-isolation checks | Corresponding 013 mode |
| Full parity | Every protected scenario ID executes; zero unexplained semantic divergence across outputs, budgets, receipts, terminal state, fingerprints, artifacts, and archival reads | 008 or producing phase |
| Mixed-version replay | Every declared old/new event-state fixture family replays through upcasters, projections, archival readers, and resume; deterministic fingerprints and terminal projections | 012/014/015 owner |
| Crash recovery | Every frozen fault point—claim, dispatch, receipt commit, checkpoint, migration/cutover boundary, resume, salvage, recovery—runs; zero lost, duplicate, or unauthorized effects | 007/009/014 |
| Fencing/authority | Stale lease, stale epoch, stale proof, wrong identity, concurrent transition, and process-death fixtures all deny/recover; exactly one canonical writer per mode | 007/014 |
| Adjudication | All blinded/counterfactual cases run; order/identity perturbations preserve blindness; declared controls produce their expected decision delta; replay is deterministic | 007 |
| Health/degeneration | Repetition, cycle, collapse, quality decay, stopping-clock, recovery, and cross-mode coupling cases run; declared unsafe continuation is detected | 011 |
| Legacy retirement | Frozen deletion manifest matches source; zero live writer paths; every retained schema family reads; archival surfaces cannot append | 015 |
| Receipts/budgets | Counts and semantic totals match the phase-003 protected baseline or an approved, owned delta; no missing effect receipt | 007 |
| Blocking SOL review | Review binds candidate and BASE SHAs, commands, counts, exit codes, digests, findings, and tracked-mutation check; verdict is APPROVE with zero unresolved blockers | 016/reopened owner |
| Recursive strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation --strict --recursive` exits 0 with Errors 0 and Warnings 0 | Owning packet |
| Mutation check | `git diff --exit-code` and `git diff --cached --exit-code` both exit 0 after disposable gate outputs are removed; no tracked gate mutation | 016 |

Run test files separately with `fileParallelism: false`. Never replace the frozen manifest with the known-hanging
aggregate. A failed row reopens the owning phase; after correction, rerun that row and every dependent row on a new
exact SHA, then renew the blocking SOL review.

## 7. Phase 017 integration, rollup, and merge closeout

1. Create a clean integration worktree from the latest origin tip. Record the last Stage-B SHA, integration target,
   tree IDs, and tool versions.
2. Integrate latest. Stop on conflicts or unexpected tracked mutation.
3. Build a drift ledger from the exact diff. Map every changed input/output contract, schema/persistence boundary,
   protected behavior, dependency/write-set edge, and receipt binding to its owning phase.
4. Reopen every relevant owner before final verification. Preserve old evidence as history; never relabel it as final.
5. Rerun the complete Stage-B matrix on the exact integrated candidate and obtain a new blocking SOL approval.
6. Reconcile the 178-row ledger and carried-forward work append-only. Do not rewrite research inputs.
7. Reconcile every child’s `spec.md` status, tasks, checklist, implementation summary, changelog, description metadata,
   graph metadata, and parent phase-map row. Verify no contradictory completion claim remains.
8. Copy/regenerate canonical and twin documentation deliberately, compare the intended files, and run recursive strict
   validation from the full-tree twin.
9. Land only the leak-guarded closeout paths on the fresh origin tip. If the tip changed after review, recensus and
   rerun affected gates.
10. Prepare the exact merge diff, commit set, final SHA, rollback/revert instructions, and retained evidence location.
11. **STOP — explicit operator go-ahead to merge this exact final SHA to `main`.**
12. Merge only after approval. Re-resolve `main` immediately before the operation; any drift requires a renewed
    comparison and approval.

Optional 018 tail work, 034 runtime-lib reorganization, and 035 CLI-adapter stress stay off the critical path. Do not
interleave 034 before ledger-touching work is closed. Any optional item that changes an accepted contract must enter the
drift ledger and reopen its owner.

## 8. Risks, gaps, and open questions

### P0 — must close before the first live authority flip

1. **Full mode order is not implemented by the reviewed candidate.** The guard proves single-mode requests and
   common-before-variant ordering, but does not prove `deep-research → deep-review → … → deep-alignment` predecessor
   order. Add and test the complete predecessor matrix.
2. **The authority event and selector record are not one storage transaction.** The reviewed coordinator appends the
   event, then publishes the record CAS. Its retry logic is useful, but process death can also strand a filesystem
   `wx` lock. Ratify and prove a real recoverable transaction protocol before live use.
3. **Migration veto semantics conflict.** The migration spec says `BLOCK` prevents a mode flip, while reviewed preflight
   comments allow policy-frozen `BLOCK` as terminal. `PIN` also conflicts with a mode-wide dark selector unless a tested
   per-run legacy lane survives. Resolve the contract and make uncertainty deny.
4. **Gateway identity remains opt-in and can be partial.** “Resolver configured” is not enough. A null or partially
   populated expectation currently carries no mismatch. Live transitions must require positive actor, capability, and
   evidence verification.
5. **Captured authorization state/proof freshness is not yet operationally proved.** Recheck authority, head, policy,
   evidence, identity, decision expiry, and fence at commit so an earlier allow cannot authorize a later state.
6. **Certificate lifecycle language is contradictory.** Some docs describe the certificate as pre-flip authorization;
   others make it sound post-flip. Use the five distinct facts in section 4 and update phase evidence during execution.
7. **The requested physical order “CAS then event” is unsafe without a shared transaction.** The inverse is also
   unsafe without recovery. The build must define the actual commit protocol rather than relying on arrow notation.

### P1 — must ratify before the phase that consumes it

1. **Live rollback-drill semantics are underspecified.** A real post-flip rollback returns the mode to legacy and makes
   any re-cutover a new approval-bound transition. The runbook adopts that strict interpretation.
2. **Overlapping rollback windows have no settled policy.** Multiple reversible modes enlarge the blast radius. Default
   to one open window unless the operator approves a higher cap with evidence.
3. **Missing authority records default to legacy in the dark candidate while the spec says missing selector state
   fails closed.** Explicitly provision records or ratify a narrower bootstrap exception before wiring.
4. **Certificate verification trusts bound digests without necessarily re-reading every upstream artifact at flip
   time.** Rehash and independently verify the evidence immediately before commit.
5. **The 015 zero-use interval has no duration or workload sufficiency rule.** Ratify it before instrumentation lands;
   a quiet counter is not proof.
6. **Dynamic telemetry completeness is unproved.** Subprocess, retry, replay, repair, rollback, shared-backend, and
   generated routes need positive controls and an unknown-path blocker.
7. **The 015 common-before-variant order can be misread as permission to delete shared code early.** Remove the common
   mode binding first, but shared implementation last.
8. **Stage-B exact counts and commands do not yet exist as one manifest.** Freeze them before running 016; count-only or
   “representative” evidence fails.
9. **The planning anchor is already subject to origin drift.** Reconfirm fresh origin before each land and bind every
   receipt to the accepted candidate, not the briefing SHA.

### P2 — track without delaying the critical path unless it changes accepted contracts

1. Optional drift-census tail decisions and stop-policy schema cleanup remain off-critical.
2. Runtime-lib reorganization should remain last; moving files before 015/016 would invalidate callsite, telemetry, and
   evidence inventories.
3. CLI-adapter stress/playbook scope should be decided separately unless Stage B exposes it as an owning failure.
4. Parent and child metadata are known to lag landed reality. Phase 017 must reconcile them, but stale metadata must not
   be used as authority for a live flip.

## 9. Operator approval ledger — explicit STOP points

| STOP | Required approval payload | What invalidates it |
|---|---|---|
| Mode flip 1–8 | Mode, candidate SHA, source epoch, certificate/evidence digests, rollback assets, live-drill plan, exact command | Any SHA/epoch/evidence/policy/identity/asset/command drift |
| Re-cutover after a live drill | New source epoch, fresh certificate, drill verdict, reconciled state/effects | Reuse of the pre-drill approval or certificate |
| Phase 015 retirement | Post-window candidate SHA, frozen delete/retain manifest digest, zero-use report, archival-read results, restoration rehearsal, test manifest | Any manifest/diff/evidence/test/candidate drift |
| Merge to `main` | Exact Stage-B/SOL-approved final SHA, merge diff and commits, current `main` tip, rollback instructions | Tip drift, new commits, changed diff, stale Stage-B/SOL evidence |

Approval is single-use and scoped to the named action. It is not transferable to another mode, epoch, candidate, delete
manifest, re-cutover, push, or merge.
