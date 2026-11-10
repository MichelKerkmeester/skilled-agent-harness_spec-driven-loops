# Iteration 16 — Verification pass before the depth checkpoint

## Focus

Re-run the repro for each of the strongest P1s in this child on `/tmp` copies, record the exact command, output line and exit code, mark each CONFIRMED / REFUTED / CHANGED, attribute the introducing release from `git blame` / `git log -S` + `git tag --contains`, and name any v4.0.x.y release with no finding in this child along with whether it touched anything in scope.

All probes ran on copies under `/tmp/i16/`. Nothing in the repository was created, edited or deleted; `create.sh` ran only inside `/tmp/i16/cr` (an empty `git init` repo) and `check-goal.cjs` only against `/tmp/i16/goalcorpus` and `/tmp/i16/copy`.

## Actions Taken

1. Read the ten cited sites in source: the resume branch [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:839], its override condition [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:840], the workflow-marker regex [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:745], the file-write branch [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:849], the phase-parent anchor exemption [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975], the strict-mode level override [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1383], the phase-parent contract [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts:9], the corpus return [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703], the module-relative workspace root [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:58], the packet resolver [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:706], the project-root fallback [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131], the template-base guard [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2259], the scoring filter [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:204], the SOURCE_TAGS contract [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:13] and the placeholder wrapper's own caller note [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:6].

2. `npx tsx -e "import {classifyPrompt} from './.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts'; ..."` over seven prompts.

3. `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs -- "validaton rulles strict"` and the same with `--json --scoring-only`.

4. Copied `specs/ai-systems/040-skill-to-project-sync` to `/tmp/i16/parent`, appended `<ANCHOR:injected>never closed` to its `spec.md`, ran `validate.sh --strict` (recursive auto-enable fired).

5. `check-goal.cjs --all --root /tmp/i16/goalcorpus` (two hand-built packets) and `check-goal.cjs /tmp/i16/goalcorpus/specs/other/001-alpha`, then `cd /tmp/i16/copy/specs/other/001-alpha && check-goal.cjs .`.

6. `resolveProjectRoot(process.cwd())` from `/tmp/i16/nosk` (no git, no `specs/`).

7. `create.sh` in `/tmp/i16/cr` with `SPECKIT_TEMPLATES_BASE=/nope`, then with `--track /tmp/abs` and `--track ../escape`.

8. `check-placeholders.sh` and `validate.sh --strict` on the same copy carrying a `[YOUR_VALUE_HERE: token]` in `handover.md`; `validate.sh --strict` on a copy whose `Created` date was rewritten to `2026-09-01`.

9. Attempted the state-log append with `status: "verification"` (refused, exit 1), then with `status: "insight"` (accepted, ledger sequence 19).

10. `git blame` + `git log -S` + `git tag --contains` for the six sites; `rg -c` per release against `findings-registry.json`; release-note headings for the zero-finding releases.

## Findings

### V1 — Gate 3 order asymmetry · CONFIRMED (and the mechanism is sharper than recorded)

The resume branch is tested before the file-write branch [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:839] and its read-only escape hatch is gated on `hasWorkflowInvocationMarker`, whose regex is `/\b(run|use|start|begin|continue|resume|append|kick off|keep|launch)\b/` [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:745]. That list contains `resume` and `start`, i.e. words that are themselves resume triggers, so the guard is decided by vocabulary overlap rather than by whether the prompt asks for work.

Measured:

```
deep research audit                        => false no_match
convergence inspect                        => false no_match
autoresearch review                        => false no_match
Resume the packet and review the findings   => true  resume_match
review the packet then resume the loop      => false no_match
Audit the validator rules and fix the failing ones => true file_write_match
Save the context                           => false no_match
```

The first three matched a resume trigger *and* a read-only disqualifier and still return `triggersGate3: false`. The fourth carries the literal word `resume`, so the marker fires and Gate 3 is required. Two prompts of the same shape ("resume work, and look at something") land on opposite verdicts purely because one spells the verb. **Type** bug · **Severity** P1 · **Release** introduced `9001425612b` (2026-04-19), pre-v4 and live at v4.0.2.0 · **Confidence** high (ran it) · **Verify** `npx tsx -e "import {classifyPrompt} from './.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts'; console.log(classifyPrompt('deep research audit'), classifyPrompt('Resume the packet and review the findings'))"`.

### V2 — Resume read-only override · CONFIRMED, plus a new limb (F1 below)

The override itself fires as written, and its `reason` field discards the fact that a resume trigger matched: `return { triggersGate3: false, reason: hasFileWrite ? 'read_only_override' : 'no_match', ... }` [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:841]. In the three `false` rows above the reason is `no_match`, not `read_only_override`, because none of them carries a file-write token.

**F1 (new ground) — the override's reason is indistinguishable from a genuine no-match.** A consumer that wants to audit how often the override suppressed Gate 3 cannot count it: `no_match` is the same value returned for "hello". The doc block at [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:233] describes the override as marking a request read-only, but the returned reason names no override at all when no write verb is present. **Type** drift (telemetry) · **Severity** P2 · **Release** `9001425612b` (2026-04-19) / reason-union widened at the classifier introduction · **Confidence** high (observed output) · **Verify** the same `tsx -e` one-liner, reading `r.reason` for `'deep research audit'` → `no_match`.

### V3 — ANCHORS_VALID phase-parent pass · CONFIRMED

`/tmp/i16/parent` is a phase parent (`isPhaseParent` → `true`; five `###` children with `spec.md`). After appending an unclosed `<ANCHOR:injected>` to its `spec.md`, `validate.sh /tmp/i16/parent --strict` printed:

```
+ ANCHORS_VALID: Phase parent lean document set accepted
```

while the same run ended `RESULT: FAILED` (exit 2) on `SPEC_DOC_SUFFICIENCY` anchors in a *child* `goal.md` and one `GENERATED_METADATA_INTEGRITY` violation. So the exemption is real, it is scoped to `ANCHORS_VALID`, and it fires before any document is read — the malformed anchor in the parent was never examined [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975]. **Type** bug (silently passing bad input) · **Severity** P1 · **Release** `da06c477040` (2026-08-29), first tag v4.0.0.0 · **Confidence** high (ran it).

Honest limit: the control I built (`/tmp/i16/l2`, a copy of `specs/agents-md/016-doctor-agents-md`) *also* classified as a phase parent and took the same exemption, so this pass did not establish what a non-parent does with the same injected input. The finding stands on the parent case alone — the exemption is unconditional for that class of folder.

### V4 — check-goal corpus exit · CONFIRMED, and the divergence is wider than the exit code (F2)

```
--all --root /tmp/i16/goalcorpus   -> ALL_EXIT=0
  criteria-count_findings=2
  parent-budget_findings=2
  4 [check-goal] FINDING lines printed

<same packet alone>                -> ONE_EXIT=1
  [check-goal] 4/5 PASS parent-budget findings=0
  [check-goal] RESULT: FAILED (4/5 checks)
```

The corpus path returns `report.errors.length === 0 ? 0 : 2` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703] while the packet path returns `result.passed ? 0 : 1`, so finding-only output is exit 0 in one and exit 1 in the other. **F2 (new ground): the two paths disagree on the finding itself.** For `specs/other/001-alpha` the corpus reports `parent-budget` and the single-packet run reports `parent-budget findings=0` — the same packet, the same script, different verdicts, not merely different exit codes. That makes the corpus sweep incapable of confirming the packet-level answer for a budget it cannot resolve. **Type** bug (two entry points, two truths) · **Severity** P1 · **Release** `d65d4128c6` (2026-09-26), first tag v4.0.0.2 · **Confidence** high (ran both) · **Verify** `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all --root /tmp/i16/goalcorpus; echo $?` then the packet alone and diff the `parent-budget` lines.

### V5 — check-goal workspace root · CONFIRMED

From inside the packet, in a `/tmp` copy: `cd /tmp/i16/copy/specs/other/001-alpha && node /tmp/i16/copy/.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs .` printed `packet=/private/tmp/i16/copy`, `1/5 SKIP …` and exit 2. `.` was resolved against the module-relative default [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:58] and then against the packet argument [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:706], which is the repository root of the copy — never the working directory. The command an operator types after `cd`-ing into a packet checks the whole tree. **Type** bug · **Severity** P1 · **Release** `d65d4128c6` (2026-09-26), first tag v4.0.0.2 · **Confidence** high.

### V6 — resolveProjectRoot fallback · CONFIRMED

```
cd /tmp/i16/nosk && npx tsx -e "import {resolveProjectRoot} from '<repo>/.skilled/skills/system-spec-kit/runtime/cli/core/config.ts'; console.log(resolveProjectRoot(process.cwd()))"
ROOT=/Users/michelkerkmeester/MEGA/Development/Skilled
[spec-kit] /private/tmp/i16/nosk is not inside a repository that uses spec-kit; using the runtime repository … as the project root
F2_EXIT=0
```

Exit 0, the caller's directory is silently replaced by the *runtime* repository [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131] (the note is printed; nothing fails). Note the compiled `runtime/dist/core/config.js` does **not** export `resolveProjectRoot` — `require(...).resolveProjectRoot` is `undefined` and throws `TypeError: resolveProjectRoot is not a function`, so a `.js` caller cannot reach the function that the `.ts` caller uses. **Type** bug · **Severity** P1 · **Release** `6f42c7b1691` (2026-10-31), first tag **v4.0.1.0** — the release that introduced the fallback is the one that introduced the regression · **Confidence** high (ran it).

### V7 — create.sh template root · CHANGED (the earlier shape is wrong; a smaller defect survives)

`SPECKIT_TEMPLATES_BASE=/nope create.sh --short-name x --level 1 "x"` in an empty git repo exits **1** with `Error: Templates directory not found at /nope` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2259] — the root error, not an argument error, and no `spec.md` is written. So the residual "`TEMPLATES_BASE` is empty at line 1219 and `copy_template` fails with an argument error" is **REFUTED**: the front-loaded guard runs first.

What survives: `find /tmp/i16/cr -maxdepth 3 -type d` afterwards shows `/tmp/i16/cr/specs` — the refusal still leaves an empty `specs/` behind. **F3** · **Type** bug (partial mutation before validation) · **Severity** P2 · **Release** guard at 2259 is v4-era; the `specs/` creation precedes it · **Confidence** high (observed dir).

### V8 — placeholder wrapper exit · REFUTED (iteration 15's divergence does not reproduce here)

A copy carrying `[YOUR_VALUE_HERE: token]` in `handover.md`:

```
check-placeholders.sh /tmp/i16/ph2                 -> WRAP_EXIT=1, "FAIL — 1 placeholder pattern(s) found"
validate.sh /tmp/i16/ph2 --strict                  -> VAL_EXIT=2, "x PLACEHOLDER_FILLED: 1 placeholder(s) found"
```

Both entry points flag the handover token, and the wrapper exits 1 rather than passing silently. The wrapper's own header says `validate.sh` does not run it [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:6], which is true, but the claim that the *validator* ignores a handover token is false at the orchestrator level. Recorded as ruled out.

### V9 — trigger lookup score-0 rows · CONFIRMED

```
lookup-trigger-index.mjs -- "validaton rulles strict"      -> LOOKUP_EXIT=0, 20 rows at 0.000, "discarded: (none)"
lookup-trigger-index.mjs --json --scoring-only -- <same>    -> SO_EXIT=1, 421 bytes
```

The score-0 filter only runs under `--scoring-only` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:204], so the bare form answers a misspelled query with twenty rows and success. **Type** UX · **Severity** P1 · **Release** `7f1e0e8878` (2026-09-27), first tag **v4.0.0.3** — the release that added the flag is the one that made the unfiltered path the noisy one · **Confidence** high (ran both).

### V10 — SOURCE_TAGS skip printing PASSED · CHANGED (two skips, two glyphs)

With `Created` rewritten to `2026-09-01` (cutoff `2026-10-04`) [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:213]:

```
+ SOURCE_TAGS: [SOURCE:] check skipped: created 2026-09-01, on or before the cutoff 2026-10-04
```

A proactive skip prints `+` (pass). The helper-failure skip on a child packet printed `!` (warn) — `[SOURCE:] check skipped: the repository or the redirect table could not be read` — and that run ended `RESULT: PASSED`. So the rule's own contract, "A pass means the cited path and line exist" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:13], is contradicted by the `+` glyph on a packet where **nothing was checked**; only the free-text message distinguishes it. **Type** UX/drift · **Severity** P2 · **Release** `5596820204b` (2026-10-04), first tag v4.0.0.3 · **Confidence** high.


### V12 — append-gateway status enum · CONFIRMED (found while recording this iteration)

The prompt pack's record schema documents `"status":"<string>"`, but the gateway's payload validator accepts a closed set. `status: "verification"` was refused with

```
{"ok":false,"phase":"runtime","reason":"Payload validator rejected the event","code":"RUNTIME_ERROR"}
GATEWAY_EXIT=1
```

and the message names no field. Re-running with `status: "insight"` and `run: 16` succeeded (ledger sequence 19, `projectionRefreshed: true`). The validator's own upcast default is `stringValue(input.status, 'error')` for `deep_research.iteration_completed`, so an unknown status is not merely ignored — it fails the whole append. **Type** UX (contract vs validator) · **Severity** P2 · **Release** present at v4.0.2.0, deep-loop gateway not spec-kit core · **Confidence** high (ran both) · **Verify** the two commands above and diff the exit codes.

### V11 — release coverage: which v4.0.x.y has no finding in this child

Counted in `findings-registry.json`: `v4.0.0.6=0 v4.0.0.7=0 v4.0.0.9=0 v4.0.0.10=0 v4.0.0.11=0 v4.0.0.15=0 v4.0.0.16=0` (all others non-zero; `.2=25`, `.13=28`, `.4.0.2.0=63`).

- **v4.0.0.15 is in scope and unaudited.** Its note opens a `## Spec Kit` section [SOURCE: .skilled/changelog/skilled/v4.0.0.15.md:40] covering templates-that-teach, `[YOUR_VALUE_HERE:]` status-dependent severity, single-run remediation, draft metadata auto-repair, three retired add-ons, and `--track`/`--path` containment. I probed the containment claim and it **holds**: `--track /tmp/abs` and `--track ../escape` both exit 1 with `Error: --track '<value>' must name a folder under specs/ …` and create nothing. Zero findings for this release is a coverage gap, not a clean bill of health — the template and draft-repair limbs remain unread.
- **v4.0.0.11 is genuinely out of scope**: its content is `/doctor:git` (eleven read-only git checks) [SOURCE: .skilled/changelog/skilled/v4.0.0.11.md:19], not `/doctor:update`.
- **v4.0.0.6 / v4.0.0.7** carry Code Skill, Repo Rules, Deep Loop Modes and Skill Routing sections; none is a surface in this child's scope.
- **v4.0.0.9 / v4.0.0.10 / v4.0.0.16** were **not read** this iteration (they share commit `4d8f403355`), so their restraint is unverified rather than justified.

### Reproduction hygiene

All ten probes ran under `/tmp/i16/`; the repository was not written to. `ls` of the repository status was not needed because no command targeted it — `create.sh` ran with an explicit `--short-name`/`--track` inside `/tmp/i16/cr`, `check-goal.cjs` with explicit `--root` / absolute packet paths inside `/tmp`, and `validate.sh` only against `/tmp` copies.

## Questions Answered

None completed this pass. Verification strengthens existing evidence but does not settle a strategy question end to end: Q6 (`/doctor:update` align/apply/rollback) was not run, and Q7's "does the scaffold pass `--strict` without hand edits" is still unverified — this pass only proved the *failure* path of `create.sh` (V7) and one v4.0.0.15 claim (V11).

## Questions Remaining

- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Ninth iteration carrying this; the read path is complete and only execution is missing.
- **Q7 `create.sh` + level templates** — the scaffold-versus-`--strict` half still needs a scratch repo plus a real (non-dry) scaffold, and the template fill-note comparison against sk-doc canon is untouched.
- **New from V6** — whether any `.js` consumer actually calls `resolveProjectRoot` from `dist/core/config.js`; if one does, it throws today, which would make V6 a crash rather than a wrong root.
- **New from V4/F2** — why the corpus path reports `parent-budget` where the packet path reports none: whether corpus passes an unresolved budget through, and whether that same split exists for the other four checks.
- **New from V11** — the v4.0.0.15 draft-auto-repair limb ("never runs in CI", "never for a non-draft"): `orchestrator.ts` carries a `REPAIR_DERIVED_REL` spawn and a five-minute hang guard, but the CI/non-draft gates were only grepped, not executed.
- **Carried** — Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal.

## Next Focus

The verification pass closes the ten strongest P1s with one refutation (V8), two corrections (V7, V10) and one widened finding (V4→F2). Next: (1) close Q6 by running `align --dry-run`, `apply --dry-run`, `rollback --dry-run` and `compat --dry-run` against a `/tmp` repo copy and capturing exit codes plus the files each step would touch; (2) run one real `create.sh` scaffold in a fresh `/tmp` git repo and `validate.sh --strict` it with zero hand edits, which is the last unverified half of Q7; (3) read `v4.0.0.15`'s template and draft-repair sections against the shipped templates, since that is the only in-scope release with zero findings.

## SCOPE VIOLATIONS

None. Every write landed in `/tmp/i16/` copies or this iteration's allowed artifact paths; no repository file was created, modified or deleted, and no banned operation (`rm`/`mv`/`sed -i`) ran against a repository path.
