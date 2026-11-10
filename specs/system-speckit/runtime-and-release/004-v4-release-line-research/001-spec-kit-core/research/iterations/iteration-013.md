# Iteration 013 — Improvement and over-engineering pass

## Focus

The two thinnest finding types: 2 (misalignment with sk-code / sk-doc / Skilled canon) and 4 (improvement). Three concrete sub-goals, read from code rather than notes:

1. Count rules in the validation orchestrator registry that are always skipped, have no producer, or duplicate another rule.
2. `create.sh` size and its three repeated `TEMPLATES_BASE` assignments — can the sites collapse?
3. One concrete improvement row per confirmed P1 (gate-3 order asymmetry, `ANCHORS_VALID` phase skip, `check-goal` corpus exit, `check-goal` workspace root, `resolveProjectRoot` fallback, `create.sh` template root), each naming the `file:line` to change and the expected behaviour after the fix.

## Actions Taken

- Read `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` in full through a JSON projection: 42 rules, severity split 32 `error` / 8 `warn` / 2 `info`, and **zero** rules at severity `skip`. Producer split: 33 `rules/check-*.sh`, 5 `ts:spec-doc-structure`, 3 `validation/*.ts`, 1 `native:orchestrator` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1].
- Cross-checked the registry against the `rules/` directory (44 entries = 33 rule scripts + 5 `-helper` modules + 5 `check-canonical-save-*.cjs` implementations + 1 `check-canonical-save-shared.cjs` + README). Every `.sh` in the directory is registered; the `.cjs`/`.mjs` files are support modules [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:20].
- Opened the five paired `check-canonical-save-*.sh` rules to settle the Q9 "shim or duplicate" residual: all five are 53 lines and each delegates with `output="$(node "$CANONICAL_SAVE_MODULE" "$folder")"`, so the pair is a shim over one implementation, not two answers [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-lineage.sh:34].
- Read the orchestrator's rule-selection path: severity gating, `strict_only` gating, the `SPECKIT_RULES` subset resolver, the shell/node dispatch, and the native entry list [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:452].
- Read `validateAnchorIntegrity` end to end, including the phase-parent early return and the template-mapping that gives a phase parent a `phase-parent.spec.md.tmpl` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975].
- Read `create.sh`'s three `TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/...}"` sites and the single existence check, plus the function that consumes the global before any site on the phase path [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1477].
- Read `check-goal.cjs` `main()` (packet vs corpus exit ladders, packet-argument resolution) and `getDefaultWorkspaceRoot` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:691].
- Read `resolveProjectRoot` and its use in `STATIC_CONFIG.PROJECT_ROOT` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131].

## Findings

### F1 — improvement, P1: the resume branch applies a read-only override the module's own decision order forbids

The doc block states the rule plainly: a resume or memory-save trigger means Gate 3 is **always** required and read-only disqualifiers cannot override it [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:786]. Memory-save honours that — it returns unconditionally [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:837]. The resume branch does not: it returns `false` when a read-only disqualifier matched and no workflow marker or recoverable mixed-write tail is present [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:843].

So `"review the packet, then resume it"` suppresses Gate 3, while `"review the packet, then save it"` asks. Two triggers at the same stipulated strength get different treatment, and the `reason` union already carries the suppressing label that makes the asymmetry invisible in a log [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:117].

- **Change**: `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:841-845` — delete the read-only override from the resume branch and return `{ triggersGate3: true, reason: 'resume_match', ... }` exactly as the memory-save branch does.
- **Expected after fix**: every resume phrase triggers Gate 3; `read_only_override` becomes reachable only from the file-write branch, which is where the doc block puts it.
- **Verify**: `node -e "const {classifyPrompt}=require('./.skilled/skills/system-spec-kit/runtime/dist/shared/gate-3-classifier.js'); console.log(classifyPrompt('review the validation rules then resume the packet').reason)"` — today prints a suppressing reason, after the fix prints `resume_match`.
- Release: v4.0.0.1 (classifier introduction; attribution inherited from the run registry, not re-derived this iteration). Confidence 0.9.

### F2 — improvement, P1: the `ANCHORS_VALID` phase exemption is a blanket pass, not a narrowed requirement

Removing the template-diff was the right call — the comment argues it well [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:969]. But the phase-parent early return goes further than the argument supports: it returns `pass` before any anchor is parsed at all [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:976], even though a phase parent's `spec.md` is template-backed and the mapping is explicit [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:636]. A phase parent with an unclosed anchor therefore passes the rule that exists to catch exactly that, while the same defect one folder down fails.

- **Change**: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975-977` — keep the exemption scoped to the *requirement*, not the *integrity*: skip the `no anchors found` finding and the required-template-section list for a phase parent, but still run duplicate / unbalanced / nest-detection over whatever anchors it authored.
- **Expected after fix**: a phase parent that authored a `<ANCHOR:x>` without its closer reports an anchor integrity issue; a lean phase parent with no anchors at all still passes.
- **Verify**: copy a phase parent to `/tmp`, delete one `<!-- /ANCHOR:... -->` line, run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh /tmp/<packet> --strict` — expect `ANCHORS_VALID` to fail (today: `pass`).
- Release: v4.0.0.0 (validator-orchestrator rewrite that moved rule decisions out of `validate.sh`). Confidence 0.85.

### F3 — improvement, P1: the corpus exit ladder collapses warnings into a pass

Packet mode distinguishes "found problems" (2) from "did not pass" (1) [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:718]. Corpus mode keys on errors alone, so a sweep exits 0 for a packet whose individual check exits 1 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:703]. A CI sweep is the caller most likely to run the corpus form, which makes it the caller most damaged by the weaker ladder.

- **Change**: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:700-704` — mirror the packet ladder (`errors > 0 → 2`, else `passed ? 0 : 1`) and surface a `passed` flag from `scanWorkspace` alongside `errors`/`warnings`.
- **Expected after fix**: `check-goal.cjs --all` and `check-goal.cjs <packet>` agree on every packet, so a sweep cannot green a packet the single check reds.
- **Verify**: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs --all; echo $?` and the same packet by name — today the code paths disagree on warnings-only packets.
- Release: v4.0.0.2 (goal system). Confidence 0.85.

### F4 — improvement, P1: a packet argument resolves against the workspace root, not the caller's directory

`main()` takes the root first and then resolves the packet against it [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:706]. Only `--root` changes the root [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:568]. An operator who `cd`s into a packet and passes `.` checks the repository root instead — the corpus path, i.e. F3's ladder — with no warning that the argument was reinterpreted. `path.resolve` is doing what it is told; the surprise is that the base is the repo and never `process.cwd()`.

- **Change**: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:706` — resolve `options.packetArg` against `process.cwd()` when that resolution exists, and fall back to `workspaceRoot` only otherwise.
- **Expected after fix**: `cd specs/<track>/<packet> && check-goal.cjs .` checks that packet, not the whole workspace; `check-goal.cjs specs/...` from the repo root is unchanged.
- **Verify**: `cd /tmp/<copy>/specs/<packet> && node /tmp/<copy>/.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs .` — expect `packet=<that packet>`.
- Release: v4.0.0.2. Confidence 0.9.

### F5 — improvement, P1: `resolveProjectRoot` keeps going with the wrong root and only says so on stderr

When neither the git top level nor the cwd uses spec-kit, the function writes a warning and returns the *runtime* repository as the project root [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:142]. That value is bound into the static config at module load [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:355]. Every consequence — memory files, index, workspace scans — then lands inside the shipped skill tree, in a repo the caller never named. A stderr line during a long run is not a gate.

- **Change**: `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131-147` — throw (or return a discriminated miss) when no override was supplied, and let the CLI surface a one-line error naming the `--root`/env escape hatch.
- **Expected after fix**: running a spec-kit CLI outside a spec-kit repository fails loudly instead of writing into the runtime repository; a caller that genuinely wants the runtime repo opts in explicitly.
- **Verify**: `cd /tmp && node /tmp/<copy>/.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.js --help` (read-only) and check whether the resolved root is `/tmp` or the skill tree.
- Release: v4.0.0.0. Confidence 0.8 — the "fallback" is deliberate per the message text, which is why this is an improvement rather than a bug.

### F6 — improvement, P1: `create.sh` computes the template root three times and checks it once

Three identical assignments at three different depths [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1477], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1665], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2253], and the only existence check sits on the last of them [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2259]. Every consumer in between — including the phase child scaffolder reached through the global [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1219] — trusts the value unchecked. An `SPECKIT_TEMPLATES_BASE` typo therefore surfaces, if at all, as `copy_template failed for <doc>` from the middle of a scaffold rather than as "the template root you named does not exist".

- **Change**: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1409` — one `readonly TEMPLATES_BASE="${SPECKIT_TEMPLATES_BASE:-$REPO_ROOT/.skilled/skills/system-spec-kit/templates}"` immediately after `REPO_ROOT` is resolved, plus the `-d` check there and there only; delete the three later assignments.
- **Expected after fix**: one value, one validation, and a bad root fails before the first `mkdir` instead of part-way through the scaffold. `create.sh` loses 6 lines net and one class of partial-folder failure.
- **Verify**: `SPECKIT_TEMPLATES_BASE=/nope bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --path specs/_probe --level 1 --dry-run`-style inspection of argument order; or trace with `bash -x` that today the failure comes from `copy_template`, after the fix from the root check.
- Release: v4.0.0.3 (explicit-path work added the later site). Confidence 0.85.

### F7 — over-engineering, P2: the `skip` severity tier has no producer

`RegistrySeverity` includes `'skip'` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:107] and `shouldRunRegistryShellRule` opens with a guard for it [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:452]. The shipped registry holds 42 rules, none of them `skip`. A valueless tier is a place a future reader will look for the switch that disables a rule and find a guard nothing reaches. **What breaks if removed**: nothing — the registry would have to gain a `skip` row first, and that row is a one-line type change. Removing it also removes the ambiguity with `strict_only`, which *is* consumed one line later [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:453].

- **Change**: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:107` and `:452` — drop `'skip'` from the union and the guard, or add the producer (a documented way to retire a rule without deleting its script).
- Release: v4.0.0.0. Confidence 0.9.

### F8 — over-engineering, P2: the strict-only ternary in `validate()` is a no-op

The level is computed as `opts.strict && isPhaseParent(folder) ? 'phase' : detectLevel(folder)` [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1383]. `detectLevel` already returns `'phase'` whenever the folder is a phase parent [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:192]. Both arms of the ternary therefore produce the same value for every input, so the `strict` conjunct changes nothing and the expression reads as if strictness alters the level detection. **What breaks if removed**: nothing; replacing it with `detectLevel(folder)` is behaviour-identical.

- **Change**: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1383` — `const level = detectLevel(folder);`, and if the intent was ever "strict judges a phase parent as a phase", write the assertion as a comment with the test that proves it rather than a ternary that cannot fail.
- Release: v4.0.0.0. Confidence 0.9.

### F9 — over-engineering, P2: the canonical-save `.sh`/`.cjs` pairs are shims — cost is one extra process, not a second answer

Resolves the Q9 residual. Each `.sh` is 53 lines whose only real line is the delegation [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-root-spec.sh:34]. Nothing is duplicated; the duplication the registry suggests is a uniform `bash wrapper → node implementation` shape, five times. **What breaks if removed**: the shell wrappers are the registry's dispatch contract (`rules/check-*.sh`), so removing them means adding `rules/check-*.cjs` dispatch to the orchestrator — a change with no behavioural payoff. Recommendation: leave as-is, and record that the pair is a shim so a later pass does not re-open this as suspected duplication.

- Release: v4.0.0.0. Confidence 0.95.

### F10 — misalignment, P2: two root-resolution strategies in one product

`sk-create-goal` resolves its workspace root from `__dirname` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:59]; spec-kit core resolves it by walking to the git top level and testing for a spec-kit marker [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:135]. A module-relative default is right for a script shipped inside the skill and wrong the moment the skill is vendored somewhere unexpected or invoked from a linked path — which is precisely the case `resolveProjectRoot` exists to handle. Two answers to "where is the workspace" is the sk-code canon's named failure: the same question resolved twice drifts.

- **Change**: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:58-60` — call the spec-kit resolver (with the module-relative path as a last resort), so both entry points agree.
- **Expected after fix**: `--root`, cwd discovery and the vendored default resolve through one function; the `packet=` label in the report stops depending on where the script sits.
- Release: v4.0.0.2. Confidence 0.8.

## Questions Answered

- **Q9 (residual limb closed)**: "Which spec-kit scripts, rules or options have no caller, no test, or duplicate another, and what breaks if each is removed?" Partly. The inventory is now exact: 42 registry rules, every `rules/check-*.sh` registered, no rule at severity `skip`, the five `canonical-save` pairs are shims over one implementation each, and the one genuinely unproduced surface is the `skip` severity tier (F7) plus a no-op level ternary (F8).
- Not claimed: Q7 (scaffold-vs-`--strict` and the fill-note comparison) and Q6 (`/doctor:update` `align`/`apply`/`rollback`/`compat`) remain unrun.

## Questions Remaining

- **Q7** — still blocked on the missing preview mode: whether a `create.sh` scaffold passes `validate.sh --strict` without hand edits is unverified, and the fill-note comparison against sk-doc canon is untouched. F6 improves the failure mode, not the answer.
- **Q6** — `align`, `apply`, `rollback`, `compat` unrun. Sixth iteration carrying this; it is the oldest open item and the only one where the read path is complete and only execution is missing.
- **New residual from F3**: whether `scanWorkspace` already exposes a per-packet `passed` flag that the corpus ladder simply ignores — if so F3 is a one-line change, not a signature change.
- **New residual from F2**: whether `phase-parent.spec.md.tmpl` in fact defines anchors. If it defines none, the phase exemption is harmless today and only becomes wrong when the template gains an anchor — which changes F2 from "silently passing bad input" to "a latent trap".
- **New residual from F5**: what `usesSpecKit` requires, given that a scratch repo carrying `specs/` was still rejected (iteration 8). That decides whether the fallback fires only for non-skilled projects or also for skilled-looking ones.
- **New residual from F6**: whether `create.sh:1219`'s global read can precede all three assignments on any path; if it can, the template root is empty there and `copy_template` fails with an argument error rather than a root error.
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for trigger index, continuity and goal.

## Next Focus

Iteration 14 should spend its budget on the two unrun surfaces rather than more reading, in this order:

1. **Q6 by execution**: run `/doctor:update` `compat`, `align --dry-run`, `apply --dry-run`, `rollback --dry-run` against a `/tmp` copy and record each exit code and mutated file set. Six iterations have read this path and none has run it.
2. **Q7 by construction**: build one Level 1 packet with `create.sh` inside `/tmp` (never in the repo), then run `validate.sh --strict` on it and diff the failures against the fill notes. This needs no preview mode — it needs a scratch copy.
3. **F2's dependency**: read `phase-parent.spec.md.tmpl` for anchors, which is one file read and decides whether F2 is a live defect or a latent one.
