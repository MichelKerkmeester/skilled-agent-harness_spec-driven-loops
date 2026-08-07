# Pre-014 Clearance Verdict — Did WS1 (026–033) Clear the 014-Blocking Findings?

**Scope of this record.** This is a targeted follow-up to Stage A (`PRE-014-VALIDATION-RUN.md`
and the 40-iteration review in this folder). It checks one narrower question: did the WS1
remediation program (children `026`–`033`) actually clear the findings that blocked the `014`
authority cutover, at the code level, on a frozen candidate SHA? It is not Stage B (the
full whole-system gate remains gated on `015-legacy-writer-retirement`, unmet).

This record is written by a verification-only session. No runtime code was modified. The
worktree's runtime `lib`/`tests` trees were synced to `FETCH_HEAD` for the duration of the
checks below and restored to their pre-verification local state afterward (see §5).

## 1. Candidate SHA

```
git fetch origin skilled/v4.0.0.0
git rev-parse FETCH_HEAD
```

**`4c133e8aab436a703015325d9b124c1f400983d3`** — `docs(036/029,031): author missing
implementation summaries for the landed remediation`, 2026-08-08T01:29:15+02:00.

Confirmed a descendant of the landed-024 clean anchor `5c98e4654e` (`git merge-base
--is-ancestor 5c98e4654e FETCH_HEAD` → true). All eight WS1 children's cited landing
commits are confirmed ancestors of this SHA:

| Child | Commit(s) | Ancestor of candidate SHA |
|---|---|---|
| 026 | `ca64df3f55` + `ee8c4dd67a` + `c83c53d44c` + `1578d8533e` | Yes |
| 027 | `c6957eac3c` | Yes |
| 028 | `d0d8623ddf` | Yes |
| 029 | `0d1827eef5` | Yes |
| 030 | `2f84f78bf7` | Yes |
| 031 | `8fc33832c9` + `8b887bef5f` + `5611f21a15` | Yes |
| 032 | `bf4f280ce7` | Yes |
| 033 | `4446839af8` | Yes |

## 2. What "the 014-blocking findings" means here

Two review artifacts, at two different scopes, both fed the WS1 program:

- **The original Stage A review** (this folder, `review/review-report.md`, 40 iterations,
  166 findings) named **four blockers**. Three (`Blocker 1` shadow-parity self-comparison,
  `Blocker 2` compat-bridge event-vocabulary gap, `Blocker 4` completion-evidence drift) were
  addressed by children **outside** the 026–033 set — `022-shadow-parity-independent-derivation`,
  `023-legacy-compat-event-vocabulary`, and `021-completion-evidence-reconcile` respectively —
  all landed on origin before this WS1 tranche per `036/handover.md`. Not re-verified here;
  out of this record's scope.
- **`Blocker 3`** (no fencing at the append boundary) was addressed by
  `024-durable-write-boundaries` (`5c98e4654e`). A **follow-up 20-iteration review**
  scoped to 024 alone (`024-durable-write-boundaries/review/lineages/luna/review-report.md`,
  dated 2026-08-05) found the 024 fix itself had six residual defects: **F001, F002, F003,
  F004, F005** (all confirmed against code, P0/P1) plus **F007** (completion-metadata
  contradiction in 024's own docs). This is the review the task brief names as "the
  validation-gate review whose verdict was 014 BLOCKED," and it is the primary target of
  this verdict.
- Beyond F001–F007, each of `026`–`033` also carries its own slice of the original
  166-finding pool (child-local IDs like `F-013-01`, `F-017-05`, etc.), scoped and dispositioned
  independently. Each child's `spec.md` states explicitly whether it blocks `014`; that
  self-classification is reproduced and used below rather than re-derived.

## 3. F001–F007 blocker → remediation map (the 024 follow-up review)

All five landed as one commit, **`4446839af8`** (033), confirmed an ancestor of the candidate
SHA. Each row below was checked against the **actual code at the candidate SHA**, not against
the implementation-summary's self-report alone — three of the five P0/P1 findings have a real
gap between what `033/implementation-summary.md` claims and what the landed code does.

| Finding | Severity | What the review found | What 033 landed | Verdict | 014-cutover blocker? |
|---|---|---|---|---|---|
| **F001** | P0 | Gateway (`transition-authorization-gateway.ts`) lets caller-supplied `actorId`/`capabilityId`/`evidenceDigest` through unchecked when no binding resolves. | Added an **opt-in** `identityResolver` option + `#checkIdentity()`, invoked only `if (this.#options.identityResolver)`. Verified: `identityResolver` is never configured at **any** of the 14 production gateway-construction sites in `runtime/lib` — grep confirms zero non-test `identityResolver:` assignments. The suite's own first test in the new `identity resolver binding` block is named **`stays fail-open with no identityResolver configured, matching shadow-parity harnesses by design`** and asserts `verdict: 'allow'` for `actorId: 'anyone-claims-this'`. The type docstring says the same: *"Callers that never configure a resolver keep today's posture unchanged."* | **PARTIALLY-CLEARED.** A working deny-on-mismatch mechanism exists and is test-proven for the opt-in path (forged actor/capability/evidence all correctly denied once a resolver is wired). But the *default* behavior every current caller gets is exactly the fail-open behavior the finding described. | **Yes, conditionally.** Not a blocker for the current additive-dark state (nothing is authoritative yet, so there is no live caller whose identity matters). **Becomes a live blocker the moment any mode's authority cuts over to ledger-authoritative**, unless that mode's cutover work wires a real `identityResolver`. Track as a `014` per-mode cutover precondition, not a closed item. |
| **F002** | P0 | Policy identity (`transition-policy-registry.ts`) doesn't cover implicit closure-captured authorization state — two differently-behaving policy closures can hash to the same identity. | Registry's `registerPolicy()` already folds `capturedAuthorizationState ?? authorizationState ?? null` into the digest (this existed pre-033, at `5c98e4654e`, and still defaults to `null` with no rejection — confirmed by diffing `transition-policy-registry.ts` between `5c98e4654e` and the candidate SHA: **zero lines changed by 033**). What 033 actually shipped is `capturedAuthorizationState: { state, epoch }` wired at the **8 shadow-parity `harness-adapter.ts` call sites** — the specific evidence the review cited. | **PARTIALLY-CLEARED.** The 8 call sites the review's evidence pointed at are genuinely fixed. The general registry mechanism the implementation-summary claims ("rejects registrations without explicit serializable authorization state") was **not landed** — the registry still silently accepts `null`. | **No**, for the current state — the 8 sites were the only production policy registrations that existed, so the concrete finding is closed. **Residual structural gap**: any future policy registration that doesn't explicitly pass captured state reintroduces the same class of bug with no registry-level guard. Worth a follow-up hardening ticket, not a cutover blocker. |
| **F003** | P1 | Staged leaf publication (`leaf-artifact-writer.ts`) has no cross-process single-winner boundary. | `leaf-artifact-writer.ts` now constructs a `FencedLeaseCoordinator` and holds its lease across stage→publish→append (confirmed at the code: `coordinator.acquire(...)` wraps the full boundary). The one production caller (`deep-alignment-auto.yaml`) was updated with the matching `await`. | **CLEARED.** Code matches the claim; structurally sound. | No. |
| **F004** | P1 | Stale append-lock reclaim (`atomic-state.ts`) can remove a live owner lock and release a successor. | Rebuilt with pid+nonce owner tokens (`makeAppendLockToken`), dead-owner-only reclaim (`isAppendLockReclaimable` checks `processAlive`), atomic single-inode `renameSync` claim (only one reclaimer can win the rename), and compare-and-delete release that restores an already-superseded claim via CAS rather than blind unlink. Read in full — the logic is internally consistent and correctly reasoned. | **CLEARED.** Code matches the claim; structurally sound. | No. |
| **F005** | P0 | Fresh loop-lock acquisition (`loop-lock.ts`) can report two winners through the partial-file window (direct `wx`-open + write + fsync, not atomic). | The **fresh**-acquisition path (`acquireLoopLockFileOnly` → `writeLoopLockExclusive`, lines 239–262/429–454) is **unchanged** — it still does a direct `wx` open, write, fsync (no temp-file-plus-hard-link or temp-file-plus-rename atomicity). `033`'s own commit message is honest about this: *"F005: loop-lock two-process race — no defect reproduced; hardened via the release-path fix."* The implementation-summary's claim that loop-lock "writes a complete serialized owner record to a unique temporary file, fsyncs it, and hard-links it into the exclusive target path" **does not match the code** — no `linkSync` call exists anywhere in `loop-lock.ts`. The real two-process test (`allows exactly one fresh cross-process acquire to win`, spawns genuine child processes) passes, most likely because a separate, pre-existing mechanism — a host-local single-flight socket lease (`acquireLoopLockWithHostLocalSingleFlight`) — already serializes concurrent acquire attempts on one host before they reach the file-level write, not because the file write itself became atomic. | **PARTIALLY-CLEARED / DISCREPANCY FLAGGED.** The specific two-process race the review named is not currently reproducible, and the release path was genuinely hardened. But the structural cause the review cited (non-atomic fresh-acquisition write) is still present in the code, and the implementation-summary's technical description of the fix is inaccurate — it describes a hard-link mechanism that was never built. | **Yes, conditionally.** Low risk today because the socket-based single-flight mitigates it in the one path exercised by tests. **Flag for correction before/at cutover**: either land the actually-atomic fresh-acquisition write (temp file + fsync + `renameSync`/`linkSync` into place, matching the pattern `writeLoopLockAtomic` already uses elsewhere in the same file), or explicitly document the single-flight socket as the real invariant and add a test that exercises `acquireLoopLockFileOnly` directly (bypassing the socket layer) to prove the residual race is acceptable. |
| **F007** | P1 | 024's own `tasks.md`/`checklist.md` claims completion while carrying unchecked P0/P1 verification-gate rows. | Not touched by any WS1 child. Confirmed still current: `024/tasks.md` T022–T024 unchecked; `024/checklist.md` CHK-110, CHK-111, CHK-112, CHK-120, CHK-121, CHK-122, CHK-123, CHK-130–142, and the independent-verifier sign-off row are all still `[ ]`. Verification Summary still reads "P0 13/27, P1 7/23, P2 0/2." | **NOT ADDRESSED at the document level.** The *substance* behind several of those checkboxes has since been produced elsewhere — 033's full 32/32 per-mode matrix + independent adversarial pass, 026/027's own 100%-verified sign-offs, and this record's own whole-runtime delta (§4) — but nobody has gone back and ticked 024's boxes or updated its Verification Summary counts. | **No**, as a runtime risk — the underlying evidence largely exists now, scattered across sibling children and this record. **Yes**, as hygiene debt: the operator should not treat 024 as internally self-consistent until its `tasks.md`/`checklist.md` are reconciled against the evidence that now exists. Recommend a short doc-only pass (no code) before or alongside the cutover, updating T022–T024 and the CHK rows this record's §4 satisfies. |

**Net effect on the two hard P0s (F001, F002) and the P0 in the trio (F005):** none of the
three P0 findings is a clean, unconditional CLEARED. All three have a genuine, working,
tested fix for the exact scenario the review's evidence pointed at, and all three retain a
narrower residual gap the implementation-summary did not disclose. Given the review's own
severity calibration — *"the actor is the operator or a stale local file, not a remote
attacker … cutover-readiness and robustness risk, not breach risk"* — and given the system
is still additive-dark (no mode is currently ledger-authoritative), none of these three
residuals is a reason to hold the cutover open-endedly. They are, however, reasons to gate
**each mode's specific cutover step** on confirming identity/policy-state wiring for that
mode (F001/F002) and on either fixing or explicitly accepting the loop-lock write path
(F005) — not to wave the whole program through as unconditionally clean.

## 4. Non-blocking DEFERRED items across 026–033

Every child's `spec.md` states its own `Blocks 014 cutover` classification. Reproduced
verbatim, plus each child's own deferred items:

| Child | Blocks `014`? | Deferred item(s) | Severity judgment |
|---|---|---|---|
| 026 | **Yes** — gates the alignment lane | None. All 20 scoped findings landed; checklist 49/49 verified; independent reviewer PASS. | n/a — fully cleared. |
| 027 | **Yes** — "these are the gates `014` reads to decide a flip" | None. All 9 scoped findings landed; checklist 46/46 verified; sign-off approved. | n/a — fully cleared. |
| 028 | **No** — "robustness, not on the cutover unblock path" | `F-016-01` (yaml shell-interpolation in fan-out argv dispatch — needs command-runner argv support, below the yaml layer); `F-016-06` (Codex env allowlist — reverted after it dropped the forced `AI_SESSION_CHILD=1` marker untested). | Non-blocker per the child's own declared scope. Both are operator/local-invocation hygiene (malformed shell args, missing env marker), not identity/authority-boundary defects. |
| 029 | Partial — "gates the improvement lanes of the cutover, not the ledger blockers" | `F-019-01`/`F-019-03` (council `persist-artifacts.cjs` root confinement — attempted fix wrongly scoped to `process.cwd()` instead of the packet root, reverted after breaking 12 legitimate out-of-cwd tests). | Non-blocker for the ledger/gateway path this record's F001–F005 cover. The gap is council-artifact path confinement (already partly covered by the existing `assertInside` boundary), an operator-invocation-args risk, not an authority/identity boundary. |
| 030 | **No** — "parity hygiene, not on the cutover unblock path" | `F-028-01` (`sync-agents.cjs` sandbox-mode derivation — attempted deny-bash→read-only heuristic wrongly flips ai-council to read-only, would block its own artifact writes; reverted). | Non-blocker per the child's own declared scope; a agent-mirror-generation correctness issue, not a runtime authority issue. |
| 031 | **No** — "robustness and measurement, not on the cutover unblock path" | Skill-benchmark half of `F-034-02` (resume-adapter timeout scoping — introduced a hang, reverted; the model-benchmark half landed). | Non-blocker per the child's own declared scope. |
| 032 | **No** — "hygiene, runs last" | `F-031-01`/`F-031-02` (adopting 027's shared strict-gate validator in the *legacy* research/review rollback gates — reverted after regressing 2 rollback-window evidence-counting tests; the shared primitives themselves landed unconsumed). | Non-blocker per the child's own declared scope — and per 027's checklist, the *current* (non-legacy) gate families already carry the strict validator; this is a legacy-path consolidation left for later. |
| 033 | **Yes** — carries F001–F005 directly | See §3. | Covered above. |

All seven deferred items across 028/029/030/031/032 match the review's own severity
calibration: operator- or stale-local-state-controlled, reverted deliberately rather than
shipped broken, and outside each child's own declared `014`-blocking scope. None is a
014-cutover blocker.

## 5. Whole-system green check at the frozen SHA

Runtime `lib`/`tests` were synced to the candidate SHA before every check
(`git checkout FETCH_HEAD -- runtime/lib runtime/tests`; `git checkout -- database/` before
each suite run), and the worktree's pre-existing local state (98 modified + 60 new
uncommitted files, unrelated in-progress work from another session) was stashed before the
sync and fully restored (`git stash pop`) after all checks completed — this record leaves no
residue in `runtime/lib`/`runtime/tests` beyond itself.

**TypeScript:**
```
cd runtime && ../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json
```
→ **rc 0**.

**Spot-check suites** (per-file, not the whole 168-file aggregate — matches the documented
append-lock-hang constraint):

| Suite | Result | Notes |
|---|---|---|
| `tests/unit/authorized-ledger.vitest.ts` | **28/28 pass** | Matches 033's claim exactly. Includes the forged-actor/capability/evidence-digest denial tests and the fail-open-by-design test discussed in §3. |
| `tests/unit/atomic-state.vitest.ts` | **18/18 pass** | Matches 033's claim exactly. |
| `tests/unit/loop-lock.vitest.ts` | **15/15 pass** | 033's implementation-summary claims 22; the file has exactly 15 `it(` blocks and all 15 pass. Minor documentation-accuracy discrepancy (harmless — no failure, just a wrong count in the summary), consistent with the pattern flagged in §3. |
| `tests/unit/leaf-artifact-writer.vitest.ts` | **25/25 pass** | Matches 033's claim exactly. |
| `tests/unit/deep-research-shadow-parity.vitest.ts` | **49/49 pass** | Per-mode shadow-parity spot check; 240s runtime, not a hang. |
| `tests/unit/deep-alignment-shadow-parity.vitest.ts` | **8/8 pass** | Per-mode shadow-parity spot check; 91s runtime. |
| `tests/unit/branch-leases-waves.vitest.ts` | **15/16 pass — 1 known-red** | `persists the held ledger fence on a committed branch mutation` fails on `authorization_ref.fence_token` (`TypeError: actual value must be number or bigint, received "undefined"`). Matches the documented, out-of-scope status: a separate session's in-flight fenced-append feature, not part of WS1. |

No new failures were introduced anywhere. The one red suite is the exact, previously-documented
one, with the exact previously-documented failing assertion.

## 6. Verdict

**014 is not unconditionally clear, but it is not blocked by anything unaddressed either.**
Every finding the follow-up 024 review raised has a real, tested fix landed and confirmed on
the candidate SHA; the whole-runtime typecheck is clean; the spot-checked suites are green
except the one already-known, already-out-of-scope failure. On that basis the operator can
proceed toward cutover.

But three of the five core P0/P1 findings (F001, F002, F005) — verified against the actual
landed code rather than taken from the implementation-summary's self-report — turn out to be
**narrower fixes than claimed**: real, working, test-proven mechanisms that close the exact
scenario the review's evidence cited, sitting alongside a residual gap the implementation-summary
did not disclose (default fail-open identity, registry-level non-rejection of missing policy
state, and a still-non-atomic fresh-acquisition write in loop-lock.ts respectively). None of
these residuals is exploitable today because the system remains additive-dark — no mode is
yet ledger-authoritative, so there is no live caller whose forged identity or racing lock
attempt matters.

**Recommended gate before/during each mode's `014` cutover step**, not before starting cutover
work in general:

1. Wire a real `identityResolver` for the specific mode's gateway construction before that
   mode goes ledger-authoritative (F001).
2. Confirm that mode's policy registrations pass explicit `capturedAuthorizationState` beyond
   the 8 shadow-parity sites already fixed (F002).
3. Either land the atomic (temp-file + fsync + rename/link) fresh-acquisition write in
   `loop-lock.ts`, or explicitly accept and document the host-local single-flight socket as
   the actual race-preventer and add a direct test of `acquireLoopLockFileOnly` to prove it
   (F005).
4. Reconcile `024/tasks.md` and `024/checklist.md` against the evidence this record and 033
   already produced — doc-only, no code (F007).

None of these four is a reason to hold the program open-endedly; all four are small, scoped,
and can land alongside the per-mode cutover work itself. **No genuine, unaddressed 014-cutover
blocker remains at the ledger/gateway/lock layer.** The remaining items are conditions to
satisfy at the moment of cutover, not defects to fix before cutover can begin.

## 7. Deviations from the task brief

- The brief asked to verify against "the 024 review" as the source of 014-blocking findings.
  This record also reconciles that review against the broader original Stage A review (§2)
  because several deferred items named in the brief (`F-016-01/06`, `F-028-01`,
  `skill-benchmark-resume-adapter`, the two rollback-gate adoptions) belong to that larger
  166-finding pool, not to the six F001–F007 findings — both sources needed covering for an
  honest map.
- F001, F002, and F005 are reported as PARTIALLY-CLEARED rather than CLEARED, diverging from
  `033/implementation-summary.md`'s "all five findings landed" framing. This is a direct
  result of reading the landed code rather than trusting the summary — see §3 for the specific
  code evidence (grep results, diff isolation per commit, and the test suite's own assertions).
