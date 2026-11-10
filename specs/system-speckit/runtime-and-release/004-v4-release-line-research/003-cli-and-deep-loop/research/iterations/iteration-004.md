# Iteration 004 — Correction: fan-out owns stopPolicy; v4.0.0.16 containment and resume verified

## Focus

1. Correct iteration 3's F1: does `fanout-run.cjs` read and enforce `stopPolicy`, and does
   `reduce-state.cjs` carry a `stopPolicy`/`minIterations` reference?
2. Verify the two v4.0.0.16 claims: "a resumed lane runs its executor again" and "an operator's
   own edit is no longer quarantined in fan-out or single-lineage runs".
3. Test the premise that a concurrent sibling run's writes appear as `contested` in
   single-executor runs, against `runtime/lib/deep-loop/write-containment.ts`.

## Actions Taken

- `grep -nE "stopPolicy|stop_policy|minIterations|min_iterations"` over `fanout-run.cjs`
  (27 hits) and `reduce-state.cjs` (0 hits).
- `grep -rnE "minIterations|min_iterations"` over the whole `system-deep-loop/runtime/`
  tree: hits only in the ledger schema, in tests, and in one SQLite binary.
- Read `findMaxIterationsPolicyViolation` in full (1125-1174), the prompt-rendering block
  (1650-1680, 1740-1750) and `buildNativeCommandInput` (1755-1805).
- Read the post-dispatch enforcement block in the lineage pool (4030-4115).
- Read the `write-containment.ts` module header (1-34), `classifyViolation` (640), the
  `isContested` predicate and contested event append (1901-1950), and `CONTESTED_NOTE` (1880).
- `grep -rn "enforceWriteContainment"` across `system-deep-loop/` and `commands/deep/`:
  production callers are `fanout-run.cjs:3933` and all four `/deep` workflow YAMLs
  (`deep-research-auto.yaml:1342`, `deep-review-confirm.yaml:1413`, and their siblings).
- Read the v4.0.0.16 sections "An Interrupted Lane Resumes" and "An Operator's Edit Is Not
  Quarantined" (280-286) and the spec-043 resume explanation
  (`implementation-summary.md:54`).
- Recorded the iteration through `append-mode-event.cjs`. The first five shapes were refused:
  with `status: "correction"` the gateway answers `Payload validator rejected the event` with
  no field named, and without `runId`/`lineageId` it answers `stable-identity-missing`. The
  accepted shape is the legacy flat row with `status: "insight"`, which carries no `focus` and
  no `answeredQuestions` (F7).

## Findings

### F1 — P2, drift in the research record (high confidence): iteration 3's F1 overstated, now restated

Iteration 3 said "no code component owns the stop policy". That is **false for the fan-out
path**. `fanout-run.cjs` owns it in four places:

1. Validation — `normalizeStopPolicy` accepts exactly `convergence | max-iterations` and
   rejects everything else [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:236].
2. Prompting — the leaf contract's stop clause is `'until config.maxIterations is reached; treat
   convergence before that as telemetry only'` when the policy is `max-iterations` and a cap
   exists [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1659], and
   `config.stopPolicy` is bound as a literal parameter line
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1671].
3. Native dispatch — `--stop-policy=<mode>` plus `stop_policy:` in the pre-bound setup answers
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1769].
4. Enforcement — after every lineage exits, `findMaxIterationsPolicyViolation` runs and its
   return value becomes a thrown lineage failure carrying `failure.stopPolicyViolation`
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4036]
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4101].

**Restatement:** the P1 is scoped to the single-executor path only. `convergence.cjs` still has
no `stopPolicy` awareness — its flag table is unchanged
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:45] — so a direct
`convergence.cjs` invocation, and every single-executor `/deep:*` run, gets a
`STOP_ALLOWED`/`STOP_BLOCKED` answer from a tool that cannot see the policy that overrides it.
Fan-out lines are unaffected because the runner overrides the executor's own conclusion.

**Second correction, against the premise:** the premise also asserted "`reduce-state.cjs` has
one `stopPolicy`/`minIterations` reference". It has **zero** of either. Its only adjacent hit is
the dashboard counter `config.maxIterations`, not an enforcement read
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2071]. Iteration 3's
own citation of line 2071 was accurate; the premise's re-characterisation of it was not.

### F2 — P1, drift (high confidence, narrowed): `minIterations` has no code owner anywhere

`minIterations` appears **nowhere** in `fanout-run.cjs`, nowhere in `convergence.cjs`, and
nowhere in `reduce-state.cjs`. Across the whole runtime tree the identifier survives only as
(a) a typed field on the `min_iterations_guard_pass` ledger event
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:562],
(b) a legacy-compatibility required-field list, and (c) tests that assert the *YAML text* of the
floor, e.g. `expect(yaml).toContain('iteration_count < effective_min_iterations')`
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-convergence-floor.vitest.ts:63].

One narrow exception keeps the floor alive in fan-out runs, and only there: when the policy is
`max-iterations`, the forced-depth check requires the terminal synthesis to carry
`stopReason=maxIterationsReached` and the iteration count to equal the cap
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1148]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1170]. A lineage that
stopped early on convergence therefore fails — `minIterations` is enforced as a *side effect* of
forced depth, never by name. Under the default policy (`convergence`, which is the fallback at
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1659]) nothing enforces
it at all, in fan-out or single-executor runs. The existing test coverage cannot catch that
because it asserts prose rather than behaviour.

Verify: `grep -c "minIterations" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
→ 0.

### F3 — P1, bug (medium-high confidence): `stopPolicy=max-iterations` without a cap fails every lineage after it has run

`findMaxIterationsPolicyViolation` returns `'stopPolicy=max-iterations requires a positive
lineage iteration cap'` when `lineage.iterations` is missing or non-positive
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1134]. Its only call
site is post-dispatch, inside the pool's per-lineage completion check
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4036]. Nothing on the
launch path pairs `--stop-policy=max-iterations` with a cap requirement: `normalizeStopPolicy`
validates the value and stops there, and `hasIterationCap`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1658] only chooses the
prompt wording — with no cap the leaf is told to run "to legal convergence", the exact policy
the launcher was told to impose.

Consequence: an operator who passes `--stop-policy=max-iterations` without per-lineage
`iterations` pays the full runtime of every lineage and then has all of them rejected with a
configuration error that was knowable at launch. The failure is safe (no false success) but
expensive and misattributed — the rejection reason names the lineage, not the launch flag.

Verify: `grep -n "findMaxIterationsPolicyViolation" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
→ definition at 1125, one production call site at 4036, export at 4302.

### F4 — P2, drift (high confidence): `contested` is narrower than "a concurrent writer touched it"

The orchestrator's premise — that a concurrent sibling run's writes show up as `contested` in
single-executor runs — is **not what the code does**. The predicate is:

```
mode !== 'restore' && violation.baselineDirty === true && !laneQuarantined.has(path)
&& !escapesArtifactTree(violation) && !isRegenerableRuntimeState(path, artifactRelPosix)
```
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1923]

`baselineDirty === true` is required. A sibling run's write to a path that was **clean** at
baseline is therefore a plain `violation`: under the default `preserve` mode it gets a quarantine
copy, a patch, a `containment_violation` event and an advisory, and it is charged to this lane.
Only a path that was already dirty *and* changed again is held out as contested, and the shipped
note says exactly that — "already uncommitted before the dispatch began and changed again during
it ... git status shows that the bytes changed, not who wrote them"
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1881].

The drift is in the framing above the code. The module header motivates the whole design with
"on a shared checkout the honest answer is often a second session rather than this lane"
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:18], but
attribution is decided by *when* the path was dirty, not by *whether another writer could be
live*. Two concurrent fan-out runs on one checkout will cross-attribute each other's fresh edits.
Nothing is destroyed — preserve is the default and restore is opt-in — but the advisory text and
the quarantine copy will name the wrong run's work, and the note's confidence ("none of it is
attributed to this lane") does not extend to the case that actually occurs.

Verify: `grep -n "baselineDirty" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`.

### F5 — P2, verified-true with a parity gap (high confidence): both v4.0.0.16 claims hold; single-lineage runs cannot opt into restore

Both release claims check out:

- *"A resumed lane runs its executor again."* The logical effect id now appends
  `:redispatch-<count>`, counting the intents the ledger already holds for that lineage and
  attempt, so the gateway cannot replay the first dispatch
  [SOURCE: specs/system-deep-loop/043-fanout-resume-and-containment/implementation-summary.md:54].
- *"An operator's own edit is no longer quarantined in fan-out or single-lineage runs."*
  Fan-out routes through the guard at
  [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3933] and emits
  `containment_contested` at
  [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3959]; every `/deep`
  workflow YAML calls the same function with a `stateLogPath` and prints the contested paths and
  their note [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:1360]
  [SOURCE: .skilled/commands/deep/assets/deep-review-confirm.yaml:1429], and a repo test
  enforces that shape at all four call sites
  [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment-yaml-call-sites.vitest.ts:10].

The gap: the module documents restoring as "opt-in per run"
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:24] and
fan-out exposes `--containment-mode` / `containment.mode`
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3334]. The single-lineage
workflows expose no equivalent — `grep -n "containmentMode" .skilled/commands/deep/assets/*.yaml`
returns nothing — so a single-executor run can only ever preserve. That is the safe side of the
asymmetry, but it means "restore is opt-in per run" is true only for fan-out lineages, and an
operator who owns their checkout alone has no way to say so in a `/deep:research` run.

Verify: `grep -rn "containmentMode" .skilled/commands/deep/assets/` → no output;
`grep -n "containmentMode" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` → 3334.

### F6 — P2, improvement: give `minIterations` a code owner and cap-validation a launch-time home

Two changes close F2 and F3 without touching the fan-out contract: (a) accept
`--min-iterations` in `convergence.cjs` and emit `minIterationsNotReached` from code so the
single-executor path has the floor the YAML computes by hand; (b) move
`findMaxIterationsPolicyViolation`'s cap requirement to launch validation beside
`normalizeStopPolicy`, keeping the post-dispatch check as the invariant it already is. Removing
neither duplicates nor coverage; the post-dispatch check stays the enforcement of record.

### F7 — P2, drift/UX (high confidence): the iteration record's contract is not the ledger's schema, and a bad `status` value fails opaquely

The prompt pack requires `mode`, `target_agent`, `agent_definition_loaded`, `resolved_route`,
`focus`, `answeredQuestions` and stable identity on the iteration record. The deep-research
ledger accepts a `status` drawn only from `complete | error | insight | stuck | thought | timeout`
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:139].
There is no `correction`, `drift`, `finding` or `partial` value, so the run's actual character —
this iteration corrects a previous one — is unrepresentable, and the accepted fallback is
`insight`.

Worse is the error path: an out-of-vocabulary `status` is reported as
`{"ok":false,"phase":"runtime","reason":"Payload validator rejected the event"}` with exit 1
and **no field, no value and no allowed set**. `isPayload` returns a boolean and the throws that
carry field detail (`PAYLOAD_UNKNOWN_FIELD`, `PAYLOAD_MISSING_FIELD`) never fire on the enum path,
so the only diagnostic is that something in the record is wrong
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts:677].
An executor that hand-builds its record — the only way to satisfy the prompt contract — will
spend iterations guessing.

Relatedly, `focus` and `answeredQuestions` are not carried into the ledger row at all: the accessor
for a legacy `iteration` row builds its data block from `status`, `newInfoRatio` and `ruledOut`
only [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:588].
The question-tick therefore depends entirely on the separate delta file, not on the canonical
record the prompt calls authoritative.

Verify: `echo '{"type":"iteration","iteration":99,"run":99,"runId":"x","lineageId":"x","status":"correction","newInfoRatio":0.5,"ruledOut":[],"timestamp":"2026-01-01T00:00:00Z"}' > /tmp/r.json && node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs --mode research --run-directory <run-dir> --event-json /tmp/r.json`
→ exit 1 with the opaque reason.

### F8 — P1 candidate, bug (medium confidence): the gateway refresh drops containment events and `iteration_start` from the state log

Before this iteration the state log held ten rows, including two `event` rows written by the
containment call sites (`containment_contested`, `containment_violation`) and one `iteration_start`
row. After the authorized append the log holds eight rows: `config`, three pre-dispatch `event`
rows, three iteration rows 1-3 and iteration 4. The containment events and `iteration_start` are
gone [SOURCE: specs/system-speckit/047-v4-release-line-research/003-cli-and-deep-loop/research/deep-research-state.jsonl:1].

The gateway's contract says it "refreshes that log from the ledger after authorizing, fencing and
receipting the record", so the projection is behaving as documented — but the effect contradicts
two adjacent promises: `deep-research-config.json` declares the state log `append-only` under
`fileProtection`, and the v4.0.0.16 containment design treats the `containment_contested` state-log
record as the durable record of a contested path ("a contested path has no other durable record"
[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1932]).
Whether those rows survive in the canonical ledger is unverified this iteration; if they do not,
the containment audit trail for iterations 1-3 is lost at the next append of any kind.

Verify: `git diff -- <run-dir>/deep-research-state.jsonl` shows the removed rows;
`wc -l` before and after an append.

## Questions Answered

- **Write containment and lane resume (v4.0.0.16): does
  `runtime/lib/deep-loop/write-containment.ts` and the fan-out resume path do what the v4.0.0.16
  note claims?**
  Yes on both claims, verified against code and tests, with one parity gap and one framing
  drift. Resume: the redispatch id suffix prevents the gateway replay, so the executor runs
  again. Operator edits: the contested classification (`baselineDirty && changed again`) is
  implemented in the shared guard, called by fan-out and by all four `/deep` workflow YAMLs, and
  test-enforced at those call sites; contested paths get no quarantine copy, no patch and no
  revert, and are recorded as `containment_contested` in the run's state log. The gap is that
  restore is opt-in only through fan-out's `--containment-mode`; no single-lineage workflow
  accepts a containment mode. The framing drift is that `contested` requires pre-existing
  dirtiness, so a concurrent sibling's write to a clean path is still a `violation` charged to
  the lane — not, as the premise assumed, `contested`.

## Questions Remaining

- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and
  `deep-review-auto.yaml` carry placeholder, field-name or ordering defects? (deferred twice)
- `cli-classifier` / `cli-jev`: router phrases, Jev feature switches, stored-key behaviour.
- Hub canon (v4.0.1.0): parent-hub canon and per-skill `ROUTER.md` routing.
- Over-engineering: which runtime surfaces (divergent pivot, legacy projection, idea lifecycle,
  observability, wave planner) have no live caller or test.
- UX: which steps of `deep-research-auto.yaml` / `deep-research-presentation.txt` are unclear,
  contradictory or impossible to execute.
- Extension: what concrete change removes the manual steps and defects in this cluster.
- Executor failure handling: quota errors (devin `resource_exhausted`) and builder throws under
  the single-executor workflow; whether a run can change executor without archiving its tree.
- NEW — does anything validate the `containment.mode` value in `deep-research-config.json` for
  single-lineage runs, or is the key silently inert there?

## Next Focus

The two clusters never yet opened: (1) single-executor dispatch branches — walk every `if_cli_*`
in `deep-research-auto.yaml` and `deep-review-auto.yaml` for placeholders, field-name mismatch and
ordering against `buildNativeCommandInput`'s arg contract at
`fanout-run.cjs:1755`; (2) hub canon for `cli-external-orchestration` and `cli-classifier` —
`hub-router.json`, `mode-registry.json` and each `ROUTER.md`, since the fan-out parity question is
already answered and the containment questions are now closed.
