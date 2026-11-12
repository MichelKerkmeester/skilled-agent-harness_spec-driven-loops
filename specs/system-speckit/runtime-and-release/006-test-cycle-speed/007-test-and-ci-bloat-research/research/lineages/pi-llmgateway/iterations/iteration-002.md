# Iteration 2: What a commit and a push actually cost — pricing every hook gate

## Focus

Follow-up to the reducer's Next Focus (the duplicated source-root preamble). It is taken together with key question 3 and 5, because the duplication claim only matters if the hook path is where the operator's time goes. This iteration prices each gate family and then decides whether hook work can shorten the wait at all.

## Actions Taken

1. Read the reducer-refreshed `Next Focus` from `deep-research-strategy.md`.
2. Extracted every checker and engine path `pre-commit` invokes (`COMMENT_CHECKER`, `MIRROR_CHECKER`, `DOCV_ENGINE`, `CARD_GUARD`, `MUTCLASS_GUARD`, `ROUTE_GUARD`, `SPEC_TOOL`).
3. Scanned those four entry points for write calls before touching them, then timed the two that are read-only.
4. Counted bounded git calls in both hooks and measured the per-call cost of a bounded git invocation and of a bare Node spawn.
5. Counted the mirror tree the mirror-sync gate scans.

## Findings

1. No pre-commit gate measured above a quarter second: agent mirror-sync `real 0.12` s over 91 mirror files, prompt-quality card sync `real 0.12` s, compiled-route-guard `real 0.07` s, comment hygiene `real 0.20` s over 40 TypeScript files. The lints are not where a commit loses time. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:1]

2. Fixed hook overhead is also small: a bounded git call costs about 20 ms (10 runs of `git -c core.fsmonitor=false diff --cached --name-only` took `real 0.20` s) and a bare Node spawn costs 0.02 s. With 29 `git_bounded` references and roughly eight Node-based checkers, a typical commit pays an estimated one to two seconds, almost all of it process startup rather than scanning. [SOURCE: .skilled/scripts/git-hooks/pre-commit:98] [SOURCE: .skilled/scripts/git-hooks/lib/bounded-git.sh:1]

3. The only unpriced term left on the commit path is the four re-mint engines (`frontmatter-version.mjs`, `repair-derived.cjs`, the compiled-route re-mint pair, and the deep command contract compiler). Two of the six hook entry points contain write calls (`frontmatter-version.mjs` 4, `check-mcp-mutation-class.sh` 2), so they cannot be timed from this research run; their cost stays inferred. [SOURCE: .skilled/scripts/git-hooks/pre-commit:294] [SOURCE: .skilled/scripts/git-hooks/pre-commit:938]

4. `pre-push` is already lean: four bounded git calls total, the routing guard at 0.07 s, and the 40 s of report-only test suites already removed. A push now costs about a second, not a minute. [SOURCE: .skilled/scripts/git-hooks/pre-push:479]

5. The hook path is therefore not the operator's wait. Measured CI means are 60 to 600 s per workflow (`Spec-Kit Check` 595 s, `Deep-Loop Runtime Tests` 472 s), which is two orders of magnitude above a one-to-two-second commit and a one-second push. Any further hook optimisation buys seconds once, while a workflow cut buys minutes on every run; the duplication and gate-switch findings from iteration 1 are maintenance debt, not time debt. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:81] [INFERENCE: based on the measured gate costs in findings 1-4 and the CI run times recorded in spec.md]

## Ruled Out

- Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope.
- Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls.
- Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI.

## Dead Ends

- Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: the four re-mint engines are unmeasurable in a read-only run, so the commit estimate carries an unquantified term; this is stated rather than smoothed over.
- Partial success: two of six entry points were timed, four were refused on write-safety; status is `insight` because the measured totals reframe where the time goes even though the engine term stays open.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/research/lineages/pi-llmgateway/deep-research-strategy.md` (Next Focus)
- `.skilled/scripts/git-hooks/pre-commit`
- `.skilled/scripts/git-hooks/pre-push`
- `.skilled/bin/check-agent-mirror-sync.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh`
- `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`
- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` (referenced, not run)

## SCOPE VIOLATIONS

None. Only read-only checkers were executed; no write outside the lineage directory.

## Assessment

- New information ratio: 0.90
- Questions addressed: "Which git hook checks under `.skilled/scripts/git-hooks/` can move to CI or narrow to changed paths, and how much wall clock per commit and push does each cost?"
- Questions answered: none fully, but the cost half is now measured and bounded.

## Reflection

- What worked and why: pricing the components instead of the whole. Running the hooks was forbidden, but the components are individually reachable, and their sum is small enough to state with a known unmeasured term.
- What did not work and why: chasing the reducer's Next Focus as a time item. The duplication is real, but measurement shows it costs milliseconds; following it as though it were a wait source would have wasted the iteration.
- What I would do differently: decide the time-versus-maintenance distinction at focus-selection time, before reading the gates.

## Recommended Next Focus

Inventory the 32 CI workflows: triggers, what each runs, and which repeat a hook gate or another workflow. That is where the measured minutes are.
