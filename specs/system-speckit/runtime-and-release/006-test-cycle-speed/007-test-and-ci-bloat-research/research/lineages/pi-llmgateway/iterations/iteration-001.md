# Iteration 1: Local git hook surface — what pre-commit and pre-push actually run

## Focus

Key question 3 (which hook checks can move to CI or narrow to changed paths, and what each costs). The packet's `spec.md` states local hook time is not measured yet, so this iteration maps the hook surface and measures the checkers that can be measured read-only. Chosen over the workflow inventory because the hooks sit on the commit and push path, where the operator pays the cost on every change.

## Actions Taken

1. Enumerated the hook scripts and their sizes with `wc -l` and listed `lib/` and `tests/`.
2. Read `pre-commit` (1056 lines) head and grepped its gate section markers and BLOCKED/WARNING lines.
3. Read `lib/gates.tsv` (the switchable-gate table) and grepped `pre-push` (609 lines) for gate sections.
4. Read the hook `README.md` and `lib/README.md` for stated timing and bounds.
5. Measured two read-only checkers with `/usr/bin/time -p`: `check-comment-hygiene.sh` on 40 TypeScript files, and `.skilled/bin/compiled-route-guard.cjs`.
6. Attempted to run `check-comment-hygiene.sh` under `bash` (it is a Python script); the attempt failed and was re-run with `python3`.

## Findings

1. `pre-commit` runs twelve distinct blocking gate families in one script: private-skill guard, comment hygiene, template phrase lint, agent mirror-sync, doc version bump, mirror parity, skill authoring, prompt card sync, MCP mutation class, compiled-routing re-mint, deep command contract recompile, spec derived-metadata re-mint, and tool ownership map. Four of them (`route-remint`, `contract-recompile`, `spec-remint`, `doc-version-bump`) do not check — they re-mint and stage files during the hook, so a commit can be rewritten by the gate that is supposed to validate it. [SOURCE: .skilled/scripts/git-hooks/pre-commit:279] [SOURCE: .skilled/scripts/git-hooks/pre-commit:641] [SOURCE: .skilled/scripts/git-hooks/pre-commit:850] [SOURCE: .skilled/scripts/git-hooks/pre-commit:899]

2. The repository has already removed two expensive commit-path checks for exactly the reason this research is investigating: the doc-model reference validator "scanned the whole tree on every commit for output that was advisory and could not block", and the pre-push test suites "were report-only, so the forty seconds they cost every push bought nothing that could block". The 40 s/push figure is the only measured hook number in the tree, and the pattern it establishes — carry a check on the local path only when it can block and is cheap — is the criterion this research should apply to everything else. [SOURCE: .skilled/scripts/git-hooks/pre-commit:111] [SOURCE: .skilled/scripts/git-hooks/pre-push:481]

3. The cheap gates are genuinely cheap, so hook cost is concentrated in the re-mint engines rather than in the lints. Measured: `check-comment-hygiene.sh` on 40 TypeScript files takes `real 0.20` s (0.19 user) including interpreter start, and `compiled-route-guard.cjs` takes `real 0.07` s across every hub. Both match their code comments, so neither is a candidate on time grounds. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1] [SOURCE: .skilled/bin/compiled-route-guard.cjs:1]

4. A push carries nine gates after the two removals: mass-deletion guard, validator load, message contract, Commit-Id presence, remote permission, remote create, compiled routing, routing-commit parity, track roots, plus an advisory skill-root metadata check that warns and never blocks. An advisory check that spawns Node on every push is the same shape as the two checks already moved to CI — it cannot block, so its local cost buys nothing CI could not buy later. [SOURCE: .skilled/scripts/git-hooks/pre-push:130] [SOURCE: .skilled/scripts/git-hooks/pre-push:453] [SOURCE: .skilled/scripts/git-hooks/pre-push:479]

5. The gate switch surface is 15 rows in one table, of which 10 are persistable `pre-commit` gates with their own `SPECKIT_SKIP_*` variable and git-config key. Every gate therefore needs a switch row, an env var, a config read, and a test; the hook test suite is about 170 KB of shell, with `pre-commit.test.sh` alone at 67 KB. [SOURCE: .skilled/scripts/git-hooks/lib/gates.tsv:1] [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:1]

6. The source-root selection and hook-trust blocks are duplicated verbatim in every hook script, and one test exists solely to keep the copies identical. That is test capacity spent defending duplication instead of behaviour: `source-root-selection.test.sh` asserts copy equality across the six lifecycle hooks rather than testing a single shared library. [SOURCE: .skilled/scripts/git-hooks/README.md:33] [SOURCE: .skilled/scripts/git-hooks/tests/source-root-selection.test.sh:1]

## Ruled Out

- Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers.
- Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1]

## Dead Ends

- Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: no recorded hook timing exists anywhere in the tree (`spec.md` says so and the hook README states only a 20 s git bound, not gate costs), so per-gate seconds stay inferred except for the two measured checkers.
- Partial success: measurement succeeded for two checkers and was refused by scope for the rest; status is `complete` because the mapping question is answered with cited evidence.

## Sources Consulted

- `.skilled/scripts/git-hooks/pre-commit` (1056 lines, gate sections at 118-1056)
- `.skilled/scripts/git-hooks/pre-push` (609 lines)
- `.skilled/scripts/git-hooks/lib/gates.tsv`
- `.skilled/scripts/git-hooks/README.md`
- `.skilled/scripts/git-hooks/lib/README.md`
- `.skilled/scripts/git-hooks/tests/` (file sizes)
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`
- `.skilled/bin/compiled-route-guard.cjs`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` (Measured Behavior)

## SCOPE VIOLATIONS

None. Two read-only checkers were executed; no hook, test, workflow or source file was created, modified, or deleted, and every write landed inside the lineage directory.

## Assessment

- New information ratio: 0.92
- Questions addressed: "Which git hook checks under `.skilled/scripts/git-hooks/` can move to CI or narrow to changed paths, and how much wall clock per commit and push does each cost?"
- Questions answered: none fully — the per-gate cost question is answered only for the two measured checkers, so the question stays open until the re-mint engines are priced.

## Reflection

- What worked and why: reading the hook scripts as a gate inventory rather than trying to execute them. The scripts document their own removals, and those comments carry the only real timing number in the tree, which gave a criterion (block-or-drop) without needing to run anything.
- What did not work and why: measuring the gates by invocation. A hook that re-mints and stages files cannot be timed in a read-only research run; the attempt was abandoned before it could write.
- What I would do differently: grep for the checker binary paths first, because the four re-mint gates are the suspected cost centre and their engine paths are the evidence needed to price them.

## Recommended Next Focus

Price the four re-mint gates by reading the engines they spawn (`.skilled/bin/*` and the doc version engine), then move to the CI workflow inventory so hook gates can be compared with the workflow that repeats them.
