# Iteration 6: Independent cross-check of iterations 1 to 5

## Focus

Independent pass (Claude Opus 5.5, xhigh, native leaf) over the five parallel gpt-6-luna iterations, which each held one key question and never saw each other's work. Three jobs: (a) re-verify every P0 and P1 and the strongest P2s against the code, marking each CONFIRMED, REFUTED or NARROWED; (b) reconcile contradictions between iterations; (c) hunt for defects where the questions meet (workflow promise vs engine vs test vs operator journey). Q1, the one key question still open, is settled here.

## Actions Taken

1. Read the persona, the prompt pack, config, state log, strategy, registry, all five iteration narratives and all five delta files.
2. Read the router `.skilled/commands/doctor/update.md`, the three workflows, the presentation asset and the engine sections for CLI parsing, release context, base resolution, report building, alignment, decisions, apply, lock, rollback and record-base, plus the relevant test cases.
3. Ran `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs`: `tests 56, pass 56, fail 0`, exit 0 (duration 89.7 s).
4. Built throwaway fixture repos under the session scratchpad temp dir (the dispatch allows temp-dir fixtures) and drove the real engine through four probes: partial decisions in a conflict unit, a bare apply after align, two applies without a commit between them, and a copied (vendored) tree through the routed flag surface. A fifth probe checked whether a Node `finally` runs on SIGTERM and SIGINT.
5. Checked the sk-create-command contract lines the iterations cited, the canonical command contract entry, the changelog index and whether `.skilled/release/` is tracked.

## Findings

Verdict key: CONFIRMED (code and, where stated, a probe agree), NARROWED (true, but smaller or different than claimed), NEW (no earlier iteration found it). No earlier finding was REFUTED outright.

### NEW P1-A: Partial decisions in a conflict unit silently drop the release changes of every undecided file

`prepareWrites` marks a customized, conflict or removed unit applied as soon as one of its files has a decision [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1691-1718], then records the release tree as the base of every applied unit [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1728-1731]. An undecided conflict file is not written, but its base now equals the release, so the next check classifies it `local-only` (release equals base) [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:648] and the unit reads `local`, the quiet "no action" status [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:916] [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:49]. Probe: unit `skill:demo` with `a.md` conflicting and `b.md` take-release; decide only `b.md`; `apply --decisions` exits 0 with `appliedUnits: ["skill:demo"]`, base.json records `skill:demo` at v1.1.0.0, and the re-check reports `a.md` as `local-only`, unit `local`, file content still the pre-release local line. The routed gate does not close this: align keeps a partial run on failure or interruption [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:125], and apply accepts any decisions path with no completeness check [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:96]. No test covers it; test 945 decides every planned file. Fix: refuse or skip (reason `undecided files`) a non-update unit unless every non-same, non-generated planned file has a decision, and advance its base only when complete.

### CONFIRMED and WIDENED P1-B (iterations 1, 2 and 5): an interrupted apply strands the lock rollback needs

All three iterations reported this independently; it is one defect. The lock is created exclusively and records `pid` and `startedAt` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1775-1794], but nothing ever reads that owner back; it is removed only in `finally` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1903-1905]; rollback must acquire the same lock [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2035]; the workflow forbids removing a pre-existing lock [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:98] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:131]. Widening: the earlier iterations assumed SIGKILL or power loss. A probe shows Node runs no `finally` on SIGTERM or SIGINT either (lock file survived both), so an ordinary Ctrl-C or a runtime tool-timeout kill strands it. A kill inside `writeAtomic` also leaves a `<target>.release-update-<pid>-<ts>` temp file in a release-managed directory that rollback does not know about [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1809-1821]. Fix: owner validation (pid liveness plus age) with an explicit, approved stale-lock recovery, signal handlers that release the lock, a presentation template for the stale-lock state, and a child-process kill test.

### NEW P1-C: Copied or vendored trees cannot reach the framework upstream through /doctor:update

The engine queries and fetches from `--remote`, default `origin` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2073] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:745], but the router and all three workflows expose no `--remote` [SOURCE: .skilled/commands/doctor/update.md:3] [SOURCE: .skilled/commands/doctor/update.md:36-38] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:34-40]. In a copied tree, `origin` is the operator's own project (or absent). Probe: a vendored copy with no framework origin gives `upstream.status unknown` and unit `blocked`, base `none`; the same tree with `--remote framework` gives `update`, base `inferred`. The presentation's base-recording command also omits `--remote` [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:86], and record-base must fetch the named release when no local tag exists [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1978-1979]. Every vendored test passes `--remote` explicitly [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:545] [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:1197], so the routed path is untested. This NARROWS iteration 2's "vendored tree works when a remote is reachable": it works only through the raw engine with `--remote`, or when `origin` is the framework. Fix: route `--remote` (or persist a framework remote beside base.json) and test the routed vendored path.

### NEW P1-D: The single startup approval is not bound to the plan that apply executes

The apply dry-run returns no `release` and no `runDir` (probe keys: `ok, command, dryRun, withoutRun, writes, skippedUnits, appliedUnits, followUps`) [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1860-1873], yet the plan template shows both [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:191-193] and approval covers "the exact displayed plan" [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:115]. With no decisions and no reusable run, the approved call re-plans from a fresh check [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1554-1561] whose release is the upstream latest at that moment [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:751], and the `changed_plan` rule only covers changes before approval is recorded [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:117]. A tag published between dry-run and approval changes the release written, without a second approval, contrary to the canonical contract "update apply writes only the engine's displayed release plan after one startup approval" [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:244]. Local edits in that window are refused or skipped by `assertPlanFresh`, not overwritten [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661], so the exposure is the release choice and the write set, not silent overwrite. Fix: report `release`, `releaseCommit` and a plan digest from the dry-run; have the workflow pass `--release` and the digest to the real apply, and have the engine refuse a mismatch.

### NEW P2-E: A second apply is refused until the operator commits base.json, and nothing says to commit

Apply always writes base.json (and divergence.json when present) and runs the HEAD-dirty check over its own ledgers [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1733-1760]. Probe: bare apply (update units), then align, decide, `apply --decisions`: exit 1, `target has staged or unstaged changes against HEAD: .skilled/release/base.json`. That is the documented journey: apply update and new units, then align the customized ones [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:68-79] [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:130-131]. Neither the apply workflow nor the apply result template mentions committing [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:310-322]. The tests commit between applies [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:932] [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:979], which hides it. It fails closed with a clear error, hence P2.

### NEW P2-F: A bare apply after align consumes the alignment run and discards its recorded decisions

With no `--decisions`, apply reuses the newest unapplied run at HEAD but replaces its decisions with an empty set [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1566-1571], then writes rollback.json into that run [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1889], after which the run is "already applied" forever [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1830-1832]. Probe: align, decide two files, bare apply (run directory identical to the align run, `skill:demo` skipped "no decisions"), then `apply --decisions <alignRun>/decisions.json`: exit 1, "this run was already applied". The workflow documents dropping decisions [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:46], but no prompt warns the operator that a bare apply burns a decided run; test 895 relies on this reuse silently [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:898-903].

### NEW P2-G: The base-recording prompt never clears on a copied tree

After `record-base` and a commit, check still reports `baseRecording.needed` for `directory:release`: the engine's own `.skilled/release/` directory is enumerated as a unit [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:535] with an inferred base (probe `afterCommit`). The same happens for every unit new in the target release, which the test asserts as expected [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:569]. Record-base only records units present in the named release [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1981], so following the prompt [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:82-88] can never satisfy it. Fix: exclude `RELEASE_DIR` from unit enumeration and exclude units with no base candidate (new units) from `baseRecording`.

### NEW P2-H: record-base trusts the named release and races apply

Record-base fingerprints the named release's unit trees without comparing them to the local tree [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1996-2001], although check already computes that per-unit distance during inference [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:820-835]. Naming a later release than the one installed makes every file that later release changed read `local-only` (release equals base) [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:648], so those units look quiet and the update never lands. [INFERENCE: from the classification rules; not reproduced.] It also writes base.json without the apply lock [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2003] while apply writes the same file under the lock [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1875].

### NEW P2-I: An explicit --release older than the recorded base plans a silent downgrade labelled update

With base B newer than release R and local equal to B, every changed file is `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:647] and the unit is `update` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:919]; nothing compares the release with the base release before planning. [INFERENCE: from the code path; not reproduced.] Fix: flag release-older-than-base units as `downgrade` and require explicit confirmation.

### NEW P2-J: Rollback and record-base have no route

The router accepts only check, align and apply [SOURCE: .skilled/commands/doctor/update.md:35] [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:10-11]. Rollback is reachable only inside the apply battery [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:177-181]; after the session ends, or after an interruption, the engine error points to a raw engine command [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1899-1901] with no approval prompt, path validator or state log. Record-base is likewise a raw command [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:86]. sk-create-command asks destructive commands for recovery design [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:378].

### NEW P2-K: Field-level drift between the workflows and the engine (the remaining Q1 matrix)

- Check's state schema promises `upstream_status: available|unknown|offline` [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:79]; the engine emits `known|unknown`, with offline only as `error: 'offline mode'` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:744] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:771].
- No workflow maps the engine report status `current|updates-available|blocked|unknown` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1092-1100] onto `STATUS=OK|UNKNOWN|FAILED` [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:148-151].
- Engine rollback exits 1 whenever a path is skipped [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2060]; the apply workflow's rollback steps do not say that exit 1 here means partial, not failure [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:178-181].
- `followUps.regenerateHubs` holds hub names [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1946], while the battery command takes `<hub-dir>` [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:137-138].
- The engine accepts `--offline` and `--remote` for apply [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:51-54], and a no-decisions apply does network work through `makePlan`, but the router offers neither for apply [SOURCE: .skilled/commands/doctor/update.md:38].
- Exit codes 0, 1 and 2, `kind:name` unit keys, lock acquisition, rollback.json-before-writes and the lock-release-in-finally guarantee all match the engine [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2166-2172] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1875-1905], except for the signal case in P1-B.

### NEW P2-L: followUps.regenerate is displayed but never acted on

The apply workflow lists `regenerate` among follow-up fields [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:56] and the plan shows "generated files and their generators" [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:201], but no battery step runs or checks the trigger-index generator [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:78] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:133-176]. Refreshing it depends on the operator accepting the optional /doctor:rebuild, which does regenerate the trigger index [SOURCE: .skilled/commands/doctor/assets/doctor-rebuild.yaml:170].

### Re-verification of the remaining earlier findings

- CONFIRMED (iteration 1, P2): align and apply `user_inputs` omit `include_prerelease` [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:33-38] [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:37-42], while check declares it [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:40] and the router binds only declared inputs [SOURCE: .skilled/commands/doctor/update.md:50].
- CONFIRMED (iteration 1, P2): the router carries base-recording next-step wording [SOURCE: .skilled/commands/doctor/update.md:68] that the presentation owns [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:82-88] [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:354].
- CONFIRMED code path, not reproduced (iteration 2, P2): binary detection is NUL or invalid UTF-8 only [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:555-560].
- CONFIRMED with NARROWED doc claim (iteration 2, P2): the generated inventory is a closed list of four patterns [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:79-100] and no test touches the trigger-index patterns (grep of the test file finds none). The router claim that apply "names their generators instead of writing them" [SOURCE: .skilled/commands/doctor/update.md:66] is overbroad: reclassification applies only to `local-only` or `conflict` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:701-707], so a release change to an unregenerated artifact is `take-release` and apply writes it.
- CONFIRMED (iteration 2, P2): renames are joined by exact path with no rename test [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1015-1058].
- NARROWED (iteration 2, P2, offline plus tagless vendor): the fail-closed result is confirmed by probe (`blocked`, base `none`), but P1-C shows the routed command fails the same way online.
- CONFIRMED (iteration 3, P2): cancellation and interruption map to `STATUS=DECLINED` [SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:212], with no cancelled status [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:197-203], against `STATUS=CANCELLED ACTION=cancelled` [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:379].
- CONFIRMED (iteration 3, P2): `dry_run_writes_nothing: true` [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:33] versus a state log written on dry-run [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:111]; align, by contrast, writes no dry-run log [SOURCE: .skilled/commands/doctor/assets/doctor-update-align.yaml:138].
- CONFIRMED (iteration 3, P2): the canonical hint omits `--include-prerelease` [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:203].
- CONFIRMED, low (iteration 3, P2): Grep and Glob are granted but unused [SOURCE: .skilled/commands/doctor/update.md:4] [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:218-219].
- NARROWED (iteration 3, P2, read-only): the check workflow does disclose the fetch exception [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:16-23], and the router summary says "without changing checkout files" [SOURCE: .skilled/commands/doctor/update.md:64]; only update.md:16 and the presentation omit the qualifier.
- CONFIRMED and WIDENED (iteration 4, P2, acceptance is a workflow gate): test 822 applies a prefilled `adopt-release` with no decide call [SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:832-838]. Iteration 4's "the routed workflow closes this boundary" does not hold for an interrupted align; see P1-A.
- NARROWED (iteration 4, P2, tree-less legacy base): the code path is real [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:806], but every current writer records a tree [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1730] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1999], and the fingerprint guards only against a moved tag, never against a wrongly named release (P2-H).
- CONFIRMED (iteration 4 invariant): align writes only under its run directory [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1371-1382], and the suite passes.
- NARROWED (iteration 5, P2, stale changelog index): stale as claimed [SOURCE: .skilled/changelog/skilled/README.md:23-25], `v4.0.0.3.md` exists, but the engine never reads the index; releases are identified from git tags [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:389-392]. Docs only, outside the update surface.
- Not re-verified this pass (iteration 5, P2, copied-tree acquisition docs): P1-C sharpens it, because the copied-tree path also needs a framework remote the routed command cannot name.

## Contradictions Reconciled

- Iteration 2 said the vendored path "works when a remote is reachable". Probes show it works only with the raw engine's `--remote`, or when `origin` is the framework. Resolved in favour of the narrower reading (P1-C).
- Iteration 4 found "no silent loss path in the routed apply path" and that the workflow closes the acceptance gate. Both hold for complete decision sets only. A partial run, which align explicitly keeps on failure, silently drops release changes (P1-A, reproduced).
- Iterations 1, 2 and 5 reported one lock defect three times. It is merged here as P1-B, and it is broader than any of the three stated.
- Iteration 1 cites `.skilled/commands/doctor/assets/workflows/doctor-update-*.yaml`; no `workflows/` directory exists. The files are `.skilled/commands/doctor/assets/doctor-update-*.yaml` [SOURCE: .skilled/commands/doctor/update.md:27-29]. Its line numbers still match the real files, so this is a citation-path defect, not a content error.

## Ranked Fixes

1. P1-A: refuse or skip incompletely decided units; advance the base only on complete units; add a test.
2. P1-B: stale-lock owner validation plus signal handlers plus an approved recovery route plus a kill test; clean stranded temp files.
3. P1-C: route `--remote` (or persist the framework remote); test the routed vendored path end to end, including record-base.
4. P1-D: dry-run reports release, releaseCommit and a plan digest; apply is pinned to them.
5. P2-E: tell the operator to commit after apply, or let apply accept its own last-applied ledgers.
6. P2-F: never reuse a decided run for a bare apply; warn, or use its decisions.
7. P2-G: exclude `.skilled/release/` and new units from base recording.
8. P2-J: add approved `rollback` and `record-base` routes with state logs.
9. P2-H, P2-I: validate the named base against the local tree; flag downgrades.
10. Contract hygiene: P2-K, P2-L, prerelease input binding, STATUS=CANCELLED, dry-run log wording, canonical hint, the tool grant, router wording.
11. Test gaps: partial decisions, routed vendored path, second apply without a commit, signal interruption, rename, valid-UTF-8 binary, trigger-index generated files.

## Ruled Out

- A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882].
- A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`.
- An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819].

## Dead Ends

- None. Every action produced evidence.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: iterations 2 and 4 against the probes; resolved above with reproduced evidence.
- Missing dependencies: none.
- Partial success: P2-H and P2-I are code-path inferences, not reproduced; the iteration-5 copied-tree documentation finding was not re-read.

## Scope Notes

- Fixture repos and one probe script live only under the session scratchpad temp dir, as the dispatch allows. No researched file was modified. The banned-operations list forbids `rm`, so the fixtures were left in the scratchpad, which is session-scoped temp space.
- `progressiveSynthesis` is true in the config, but the prompt pack's allowed-write list excludes `research/research.md`, so it was not touched.

## Sources Consulted

- .skilled/commands/doctor/update.md
- .skilled/commands/doctor/assets/doctor-update-check.yaml
- .skilled/commands/doctor/assets/doctor-update-align.yaml
- .skilled/commands/doctor/assets/doctor-update-apply.yaml
- .skilled/commands/doctor/assets/doctor-update-presentation.txt
- .skilled/commands/doctor/assets/doctor-rebuild.yaml
- .skilled/commands/doctor/scripts/release-update.cjs
- .skilled/commands/doctor/scripts/tests/release-update.test.cjs
- .skilled/skills/sk-doc/sk-create-command/SKILL.md
- .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json
- .skilled/changelog/skilled/README.md
- research/iterations/iteration-001.md to iteration-005.md, research/deltas/iter-001.jsonl to iter-005.jsonl, research/findings-registry.json
- Command output: node --test (56/56 pass, exit 0); fixture probes p1, p2, p3 and the vendored probe (exit 0)

## Assessment

- New information ratio: 0.62 (11 fully new findings and 7 partially new verdicts out of 28 rows, giving 0.52, plus 0.10 for settling Q1 and reconciling three contradictions).
- Questions addressed: Q1, Q2, Q4, Q5.
- Questions answered: Q1. The answer is no. Locking, exit codes, unit keys and rollback.json ordering match the engine. But the workflows promise an approval-bound plan the engine cannot pin (P1-D), lock release on every exit that signals bypass (P1-B), a vendored path the routed flags cannot reach (P1-C), status and field values the engine does not emit (P2-K), and generator follow-ups no phase runs (P2-L). Q2 and Q4 stay answered, with the corrections above; Q5 gains P2-E, P2-F, P2-G and P2-J.

## Reflection

- What worked and why: driving the real engine in throwaway repos turned three "the workflow covers it" readings into reproduced defects (P1-A, P2-E, P2-F) that static reading had missed, because each lives in the hand-off between two actions rather than inside one.
- What did not work and why: the earlier static pass could not show that Node skips `finally` on SIGINT and SIGTERM; a ten-line signal probe settled it.
- What I would do differently: build the routed-flag probes (exact router flags only) first, since the test suite's habit of passing `--remote` and committing between applies is precisely what hid P1-C and P2-E.

## Questions Answered

- Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback? No. See the Assessment and P1-B, P1-C, P1-D, P2-K and P2-L.

## Questions Remaining

- None of the five key questions remain open. Unverified residue: P2-H and P2-I need a reproducing fixture; the iteration-5 copied-tree documentation claim was not re-read.

## Next Focus

The run has reached its maximum iterations. Synthesis should lead with P1-A to P1-D, merge the triple-reported lock defect into one entry, and carry the ranked fix list above.

## Recommended Next Focus

Synthesis. If a follow-up research pass is ever run, reproduce P2-H (record-base with a later release) and P2-I (explicit downgrade) with fixtures, and re-read PUBLIC-RELEASE.md for the copied-tree route.
