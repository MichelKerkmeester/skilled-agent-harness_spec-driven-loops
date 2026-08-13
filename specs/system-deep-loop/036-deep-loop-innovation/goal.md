# Execution Goal — Complete the 036 Deep-Loop Innovation Epic

> This is the durable, long-form execution plan. It complements the separate goal prompt that must remain at or below
> 4,000 characters. It does not itself authorize a mode flip, writer retirement, push, or merge.
>
> **Execution state on 2026-08-12:** the phase-014 components are landed but remain dark and unwired. The independent
> review verdict is `REQUEST_CHANGES`, so the first live authority flip is blocked. No historical test count or landed
> commit in this document is operator approval to change authority.
>
> **Autonomous execution (2026-08-12):** this tail is driven by Claude as orchestrator dispatching two external models —
> GPT-5.6-SOL HIGH (cli-codex) and DeepSeek-v4-flash (cli-opencode / opencode-go) — as alternating implementer/checker.
> Work runs in an isolated worktree (`0144` at `ced5fe53cc1`, tsc rc0 baseline); nothing lands to the moving `skilled/v4`
> and no irreversible step runs until a fresh review returns APPROVE and the operator clears the frontier. The short
> operational contract is `goal-prompt.md`.
>
> **Re-grounding (2026-08-12):** the 13 review findings were re-verified at `ced5fe53cc1`. F5 is already fixed; the six
> P0s are PARTIAL. F6's residual is a *deliberately-deferred design change* (permanent-lock census rows must become a
> distinct verified PIN disposition, not overloaded `BLOCK`); a one-line denial gate is an over-denial that makes cutover
> unreachable — it was tried, caught by cross-model review against the packet's `hardening-notes.md`, and reverted. Treat
> every "PARTIAL → quick fix" as suspect until re-scoped against each packet's `hardening-notes.md` / `t001-disposition.md`
> design rationale. A green test is not proof; the checker model must read design docs and try to refute.

## 1. EPIC OVERVIEW AND PLANNING BASELINE

Packet 036 turns 178 research recommendations into one convergent deep-loop runtime architecture: a typed append-only
event ledger behind a fail-closed transition-authorization gateway, with sealed reference artifacts, deterministic
replay fingerprints, receipts and certificates, and blinded/counterfactual adjudication. The migration model is
additive and dark first, then per-mode authority cutover behind rollback windows, then legacy-writer retirement after
measured zero use.

| Field | Durable value |
|---|---|
| Latest observed branch tip | `HEAD == origin/skilled/v4.0.0.0 == 414936c3151f` on 2026-08-11; this dirty documentation checkout is not an acceptance candidate |
| Historical phase-014 anchors | 014/001 `a677adb195`; 014/002 `d76f84439a` plus hardening through `cf26cf5309`, `a37ab143d0`, and `75dbe65e09`; 014/003 `eaf0a79024` |
| Branch destination | `skilled/v4.0.0.0`, then an explicitly approved merge to `main` |
| Current program shape | The 001–013 substrate and all three dark 014 components are landed. No mode has been proved live on the new authority path. Phase 015 is Planned at 0/29 checklist items; 016 Stage B and 017 are unstarted |
| Independent review | `goal-plan-review.md` is `REQUEST_CHANGES`: seven P0 findings block the first irreversible authority transition and six P1 findings block their consuming phases or final closeout |
| Remaining critical path | Re-accept the exact 014 candidate and close every P0 → freeze integration inputs → execute and stabilize eight mode cutovers → build 015 telemetry and closed-world inventory → approve and retire legacy writers → run 016 Stage B → execute 017 final recensus → reconcile all packet evidence → approve the exact merge |
| Authority rule | Legacy remains authoritative until one named mode passes every gate and an operator authorizes that exact transition |
| Audit rule | A flip is irreversible as an append-only historical fact, although runtime routing remains reversible during its governed rollback window |

The observed tip is a navigation fact, not a frozen candidate. Origin can advance after this edit. At the start of
every phase, before every irreversible authority change or deletion, and immediately before landing, resolve the fresh
tip and bind every receipt to the exact candidate SHA and tree. The current 014 implementation must be independently
re-accepted or reopened from a clean, reproducible commit; do not rebuild it blindly and do not execute it from this
dirty checkout.

### Current execution ledger

| State | Scope | Meaning and next move |
|---|---|---|
| Landed, dark, not accepted for live use | 014/001, 014/002, 014/003 | Treat the implementation and recorded unit counts as historical evidence. Reproduce them on the exact clean candidate and close the seven P0 review findings before wiring any mode |
| Blocked before first live flip | Phase-014 execution | A fresh independent review must return `APPROVE` with zero open P0 findings; then the operator must approve mode 1’s exact candidate, epoch, evidence, rollback assets, and command |
| Planned / unstarted | 015 retirement | Build the inventory and telemetry first; prove closed-world zero use and closed rollback windows; obtain a separate operator approval before deleting anything |
| Planned / unstarted | 016 Stage B and 017 closeout | Run only after their prerequisites. Stage B must exercise the full authority lifecycle, and 017 must recensus current origin and rerun Stage B on the final SHA |
| Open evidence debt | Packet-wide closeout | Landed code is not equivalent to a complete packet. Reconcile every non-final child, checklist, ADR, status, residual, and generated-metadata record before the parent can close; known examples include 029’s 0/50 checklist and Proposed ADRs and 048/003’s reopened metadata closeout |

### Immediate next safe action

1. Resolve the fresh `origin/skilled/v4.0.0.0` tip and create a clean, isolated, reproducible candidate only after the
   operator chooses the Git workspace strategy. Record candidate SHA, tree hash, BASE SHA, tool versions, and a clean
   status. The recommendation is a fresh worktree because the current shared checkout is materially dirty.
2. Reconcile all seven P0 findings in `goal-plan-review.md` against that exact tree. For each finding, either land the
   fix with negative-control evidence or record a fresh independent refutation tied to current symbols and tests.
3. Rerun typecheck, the three phase-014 unit files, new integration/process-death/negative suites, unauthorized-append
   and cast greps, scoped diff checks, and strict packet validation on the same commit. Freeze the results in a sealed
   gate manifest; any SHA or tree drift invalidates the set.
4. Obtain a new independent review. Continue only on `APPROVE` with zero open P0 findings and owned P1 routes.
5. **STOP — request operator approval for mode 1 only.** No approval is implied by this roadmap edit.

### Current delivered substrate

- 014/003 supplies dark cutover-certificate assembly/verification and rollback-window evaluation. Its packet records
  41/41 unit tests at its historical build anchor; rerun them on the accepted candidate.
- 014/001 supplies the five disposition executors, fenced resumable migration coordinator, durable receipts, and
  successor handoff. Its packet records 31/31 unit tests at its historical build anchor; rerun them on the accepted
  candidate.
- 014/002 supplies the dark authority registry, selector, preflight, manifest guard, authority-transition event, and
  cutover coordinator. Its packet records 42/42 tests, but the independent review found live-safety gaps that keep the
  component unaccepted and unwired.
- All new ledger writes must pass the transition-authorization gateway and
  `appendAuthorizedThroughFence`. No live path may regain a public append escape hatch.

### Definition of full completion and perfected closeout

The epic is **fully complete** only when all of the following are simultaneously true on one final, reproducible
commit—not merely because the dark code landed:

1. The phase-014 candidate is accepted with zero open P0 findings; all eight modes cut over in frozen order, each has
   an independently evidenced live rollback drill, and every required rollback window closes cleanly.
2. Phase 015 proves a closed-world inventory and zero live legacy use, preserves historical readers, rehearses
   restoration, and retires only the operator-approved delete manifest.
3. Phase 016 Stage B passes every declared row, including the authority-lifecycle matrix, on one exact candidate/BASE
   pair with a blocking independent `APPROVE` verdict.
4. Phase 017 integrates current origin, reopens every affected owner, reruns Stage B on the exact final SHA, and
   reconciles the 178-row ledger plus every child’s status and evidence.
5. All non-final packet state is closed or explicitly deferred with an owner, rationale, and trigger. Checklists,
   tasks, ADRs, implementation summaries, changelogs, `description.json`, and `graph-metadata.json` agree; recursive
   strict validation returns Errors 0 and Warnings 0 from the committed tree.
6. The operator approves the exact Stage-B/SOL-reviewed SHA for merge; required mainline gates pass; rollback/revert
   instructions, evidence retention, and post-merge monitoring ownership are recorded.

The epic is **perfected** when the full-completion gates above also survive the adversarial tail: verification from a
fresh detached checkout with no untracked inputs; zero unresolved P0/P1 findings or unowned carryovers; full forward
and reverse crash/restart negative controls; mixed-version and shared-backend authority isolation; a closed-world test
of delayed/offline consumers and oldest-supported logs; no stale or contradictory packet metadata; and a post-merge
observation receipt showing no authority, replay, receipt, budget, or degeneration regression. Optional work may remain
unimplemented only when it has an explicit non-blocking disposition and cannot change an accepted contract.

### Source-of-truth and drift policy

1. This document defines the remaining execution intent; `goal-plan-review.md` defines the unresolved adversarial
   findings until a fresh review closes or supersedes them.
2. Existing phase specs own their domain contracts.
3. Runtime code and tests prove what is actually implemented.
4. If those sources disagree, stop at the earlier safe authority state. Do not reinterpret a contradiction during a
   live cutover.
5. Every “COMPLETE” report is a hypothesis. Independently rerun typecheck, the relevant per-file suites, the cast and
   append-boundary greps, the scoped diff, and strict validation before accepting it.

## 2. NON-NEGOTIABLE EXECUTION AND LANDING MECHANICS

### Clean candidate workspace

- Before implementation, the operator must explicitly choose a Git workspace strategy. Use a fresh isolated worktree
  from the then-current `origin/skilled/v4.0.0.0` tip for the recommended path; never treat the historical 0135
  worktree or the current dirty shared checkout as the candidate. The 014 components are ledger-adjacent and must be
  repaired and accepted serially.
- Use dependencies already available to the project. If a worktree reuses dependency directories, record and verify
  the resolved targets before running commands; a dependency change is a separate scoped mutation.
- From `.opencode/skills/system-deep-loop/runtime/`, typecheck with:

  `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json`

- Run Vitest per file only with `node_modules/.bin/vitest run <file> --no-coverage` and
  `fileParallelism: false`. Never substitute the aggregate suite: append-lock contention can make the aggregate hang.
- Before each per-file suite, restore only the isolated candidate’s test `database/` fixture to its known clean state.
  First prove that path contains no operator work. Never run a broad checkout in a shared dirty checkout.
- Run strict validation from the exact tracked candidate. Tool absence or a stale generated build blocks the gate; it
  is not permission to validate a different tree.

### Canonical documentation and validation

- `specs/` is canonical. `.opencode/specs` is a symlink to it at the observed branch tip; verify that topology from the
  exact candidate and reject an unexpected real-directory twin or untracked evidence.
- Edit and land only the canonical `specs/` path. Do not maintain or copy a second packet tree.
- Regenerate child metadata with:

  - `npx tsx .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts <absolute-child-path> <repo-root>`
  - `npx tsx .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts <absolute-child-path>`

  Preserve required `level` metadata, inspect the scoped generated diff, then validate again. Use only one-packet
  invocations; a tree-wide backfill is not part of a child closeout.

### Evidence and landing

- Completed task/checklist rows must cite a concrete runtime symbol or named test plus the suite digest, candidate SHA,
  result, and exit code. A citation only to `spec.md` is not evidence.
- Keep `_memory.continuity.recent_action` and `next_safe_action` at 90 characters or fewer.
- Land through the execution session’s approved leak-guard workflow with an exact path allowlist naming the runtime
  directory, test files, and packet docs. It must seed from the fresh origin tip, allow zero deletions unless deletion
  is the separately approved 015 action, and reject anything outside the named prefixes. Do not depend on an
  ephemeral `/tmp` helper as the durable contract.
- New writes use `appendAuthorizedThroughFence` with a gateway proof. The changed paths must have zero direct
  `.appendAuthorized(` calls and zero `as any`/`as unknown` cast-arounds used to reach the private append boundary.
  Canonical-JSON `as unknown as JsonObject` conversions remain permitted when unrelated to append access.
- Do not terminate shared Codex/OpenCode processes by name. Capture and terminate only the PID owned by the current
  run.
- An automated stop hook, task notification, green test, or agent message is never operator consent.

## 3. REMAINING ROADMAP AND OBJECTIVE PHASE GATES

### Phase 014 acceptance — reopen and accept the landed dark build

**Objective:** independently reproduce, repair where required, and accept the landed 014/001–003 components on one
clean commit. The accepted result remains unwired and cannot itself move live authority; it must be safe enough to
become the only forward-and-reverse authority-transition mechanism after separate operator-approved wiring.

**Pass gates:**

1. `tsc` exits 0.
2. These suites run separately and all exit 0:

   | Suite | Historical minimum before review-closure additions |
   |---|---:|
   | `tests/unit/per-mode-authority-flip.vitest.ts` | 42/42 |
   | `tests/unit/cutover-certificate.vitest.ts` | 41/41 |
   | `tests/unit/inflight-state-migration.vitest.ts` | 31/31 |
   | Total | At least 114 historical cases plus every new review-closure case, zero skipped |

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

8. The same live registry and persistence boundary implement the reverse state machine
   `new_authoritative_reversible → rollback_pending → legacy_authoritative`. A realistic drill proves the new legacy
   epoch, a successful legacy write, and rejection of the pre-rollback dark lease after restart; a rollback artifact
   with `authorityMutation: false` is an automatic failure.
9. Rollback-window evaluation and closure verify signed source evidence and bind every execution/health receipt to the
   mode, window digest, exact epoch, certificate, candidate, and observation interval. Missing, empty, stale,
   duplicate, or cross-mode signal families deny closure; closure recomputes its inputs rather than trusting a
   caller-supplied eligibility object.
10. Crash tests include real process death, not only a thrown callback. They prove recovery from a stale `wx`
   transaction lock and from death before/after authorization, ledger append, registry publication, and receipt
   persistence.
11. A missing authority record does not silently hide provisioning mistakes. Either live wiring pre-creates and verifies
   all eight legacy records, or the contract is ratified to treat missing as a typed denial. The dark unit-test default
   is not sufficient evidence for production.
12. `rg` returns zero unauthorized append/cast escape hatches in changed code. The scoped diff contains only the
    expected 014/002 runtime directory, its unit test, and its packet docs.
13. Strict validation of the canonical 014 packet exits 0 with Errors 0 and Warnings 0 from the exact tracked
    candidate tree.
14. The leak-guard land produces zero unintended deletions and the landed tree equals the independently verified
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
7. Recursive strict validation from the exact canonical tracked tree exits 0 with Errors 0 and Warnings 0.
8. Leak-guard scope shows only approved closeout paths and zero unintended deletion.

**Fail:** conflict, unexplained drift, reopened phase not reclosed, stale receipt, Stage-B failure, metadata mismatch,
canonical/twin mismatch, out-of-scope diff, or strict-validation warning. Do not request merge approval.

### Merge to main

**Objective:** merge the exact accepted final SHA and nothing else.

**Pass gates:** final SHA equals the Stage-B/SOL-reviewed SHA; the merge diff and commit set are frozen; mainline CI or
the repository’s required local gates are green; rollback/revert instructions and evidence retention are recorded; and
the operator explicitly approves this exact merge. Re-resolve the main tip immediately before merging. Any drift
invalidates the approval and requires integration recensus plus the affected final gates.

## 4. PER-MODE AUTHORITY-CUTOVER EXECUTION RUNBOOK

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

## 5. PHASE 015 BUILD AND RETIREMENT PLAN

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

## 6. PHASE 016 STAGE-B WHOLE-SYSTEM ACCEPTANCE MATRIX

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
| Recursive strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict --recursive` exits 0 with Errors 0 and Warnings 0 from the exact tracked candidate | Owning packet |
| Mutation check | `git diff --exit-code` and `git diff --cached --exit-code` both exit 0 after disposable gate outputs are removed; no tracked gate mutation | 016 |

Run test files separately with `fileParallelism: false`. Never replace the frozen manifest with the known-hanging
aggregate. A failed row reopens the owning phase; after correction, rerun that row and every dependent row on a new
exact SHA, then renew the blocking SOL review.

## 7. PHASE 017 INTEGRATION, ROLLUP, AND MERGE CLOSEOUT

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
8. Regenerate canonical documentation metadata with scoped tooling, verify `.opencode/specs` still resolves to
   canonical `specs/`, and run recursive strict validation from the exact tracked candidate.
9. Land only the leak-guarded closeout paths on the fresh origin tip. If the tip changed after review, recensus and
   rerun affected gates.
10. Prepare the exact merge diff, commit set, final SHA, rollback/revert instructions, and retained evidence location.
11. **STOP — explicit operator go-ahead to merge this exact final SHA to `main`.**
12. Merge only after approval. Re-resolve `main` immediately before the operation; any drift requires a renewed
    comparison and approval.

Optional 018 tail work, 034 runtime-lib reorganization, and 035 CLI-adapter stress stay off the critical path. Do not
interleave 034 before ledger-touching work is closed. Any optional item that changes an accepted contract must enter the
drift ledger and reopen its owner.

## 8. RISKS, GAPS, AND OPEN QUESTIONS

### P0 — must close before the first live authority flip

1. **Rollback must really restore live authority.** Implement the reverse registry transition against the canonical
   persistence boundary and prove it with process-death/restart drills, a new legacy epoch, a successful legacy write,
   and rejection of the stale dark lease. A record that merely claims restoration fails.
2. **The authority event and selector record need one recoverable commit protocol.** Use a shared transaction or a
   durable prepare/commit state machine whose readers derive one authority and whose startup recovery handles every
   crash boundary, CAS conflict, and stale lock.
3. **Identity, policy, and proof freshness must be mandatory at commit.** Require a deployment `identityResolver`,
   positively resolve actor/capability/evidence, require the gateway policy tuple to equal the certificate’s trusted
   policy tuple, and recheck head, epoch, authority, policy, identity, evidence, decision expiry, and fence at the
   append boundary.
4. **Rollback-window evidence must be authority-bound and complete.** Bind signed execution and health receipts to the
   mode, window, epoch, certificate, candidate, and time interval; deny empty/stale/duplicate/cross-mode families; and
   recompute closure inputs inside the closure operation.
5. **Acceptance needs an immutable, buildable candidate.** Reproduce all imports, typecheck, tests, negative controls,
   tree identity, and packet validation from a clean isolated commit with zero unexpected paths. The shared dirty
   checkout and historical test reports cannot supply this proof.
6. **`BLOCK` and unresolved `PIN` semantics must deny a mode-level flip.** Require zero blocked/aborted rows. Permit a
   `PIN` only when a separately verified live legacy lane, owner, expiry/review policy, and admission-isolation proof
   survive that mode’s selector change.
7. **Frozen order and one-mode blast radius must come from durable state.** Enforce the complete eight-mode predecessor
   prefix from registry/ledger facts, not request claims. Partition or unify every shared backend by authority domain,
   mode, and epoch, and prove the mixed-state/rollback dependency matrix with concurrent legacy and dark writers.

### P1 — must ratify before the phase that consumes it

1. **Certificates must verify evidence authorities, not self-reported shapes.** Verify each source envelope through a
   trusted issuer/verifier registry and bind mode, candidate, epochs, manifest, and policy before aggregation. Add
   tamper and substitution tests for every evidence family.
2. **Phase 015 needs a closed-world consumer proof.** Inventory deployed binary/config hashes, API/protocol versions,
   queue age, cache/service-worker TTLs, scheduled and repair jobs, and replay producers. Drain or expire them beyond
   proven dormancy, retain a deny/tombstone for old writes, and test delayed N-1 clients plus oldest-supported logs.
3. **Integration freeze must precede irreversible state.** Reconcile latest origin before each flip, invalidate
   certificates on relevant drift, freeze shared authority/persistence surfaces through 015, and recensus again before
   deletion while rollback assets still exist. Phase 017 remains the final recensus, not the first current-main test.
4. **Stage B must exercise the complete authority lifecycle.** Add all eight modes, rolling N-1/N processes,
   allowed partial orders, shared-backend concurrency, forward and reverse crash boundaries, restart/reconciliation,
   stale-writer rejection, window closure, and post-retirement old-client/log replay to the frozen gate manifest.
5. **Final proof must come from the committed tree.** Run recursive validation and evidence checks from a fresh
   detached checkout or extracted archive of the exact candidate; assert all inputs are tracked and record tree hash,
   path topology, `git status`, and `git ls-files` in the blocking receipt.
6. **Phase 017 must use phase 003, never `000`, as the protected baseline.** Before execution, correct its contract and
   machine-bind `{phase_id, exact_sha, manifest_digest}`; reject aliases, missing IDs, or any tuple drift.

### Operational decisions — close before their consuming gate

1. A real rollback returns the mode to legacy; any re-cutover requires a fresh candidate-bound certificate and a new
   single-use operator approval.
2. Default to one open rollback window unless the operator ratifies a higher cap with blast-radius evidence.
3. Pre-create and verify all eight legacy authority records, or formally ratify a narrower bootstrap rule that denies
   ambiguous missing state.
4. Freeze the zero-use duration, workload sufficiency, positive controls, and unknown-path blocker before 015
   instrumentation starts. Remove common-mode bindings in order, but delete shared implementation last.
5. Freeze Stage B’s exact commands, cases, expected counts, negative controls, and failure owners before running it;
   count-only or “representative” evidence fails.
6. Use the five-fact certificate lifecycle in section 4 consistently: readiness, operator authorization, committed
   transition, rollback-window state, and final closure are distinct facts.

### P2 — track without delaying the critical path unless it changes accepted contracts

1. Optional drift-census tail decisions and stop-policy schema cleanup remain off-critical.
2. Runtime-lib reorganization should remain last; moving files before 015/016 would invalidate callsite, telemetry, and
   evidence inventories.
3. CLI-adapter stress/playbook scope should be decided separately unless Stage B exposes it as an owning failure.
4. Parent and child metadata are known to lag landed reality. Phase 017 must reconcile them, but stale metadata must not
   be used as authority for a live flip.

## 9. OPERATOR APPROVAL LEDGER — EXPLICIT STOP POINTS

| STOP | Required approval payload | What invalidates it |
|---|---|---|
| Mode flip 1–8 | Mode, candidate SHA, source epoch, certificate/evidence digests, rollback assets, live-drill plan, exact command | Any SHA/epoch/evidence/policy/identity/asset/command drift |
| Re-cutover after a live drill | New source epoch, fresh certificate, drill verdict, reconciled state/effects | Reuse of the pre-drill approval or certificate |
| Phase 015 retirement | Post-window candidate SHA, frozen delete/retain manifest digest, zero-use report, archival-read results, restoration rehearsal, test manifest | Any manifest/diff/evidence/test/candidate drift |
| Merge to `main` | Exact Stage-B/SOL-approved final SHA, merge diff and commits, current `main` tip, rollback instructions | Tip drift, new commits, changed diff, stale Stage-B/SOL evidence |

Approval is single-use and scoped to the named action. It is not transferable to another mode, epoch, candidate, delete
manifest, re-cutover, push, or merge.
