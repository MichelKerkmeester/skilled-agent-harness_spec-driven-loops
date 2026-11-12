# Iteration 8: Test infrastructure — nine configs, a serial advisor suite, and a hand-maintained serial list

## Focus

Key question 5 directly: the shared harnesses, configs, fixtures and serial lists that cost run time or maintenance beyond the coverage they add. This iteration looks at the configuration layer rather than the test bodies, because the configs decide how much of the corpus runs in parallel.

## Actions Taken

1. Enumerated every `vitest.config.*` and `vitest.stress.config.*` under `.skilled`.
2. Grepped every config for `fileParallelism`, `maxConcurrency`, `poolOptions` and `singleThread`.
3. Read the advisor runtime config and the deep-loop runtime two-project split, including its `SERIAL_FILES` list.
4. Counted harness and helper files and located the fixture trees.

## Findings

1. The repository configures nine vitest entry points for one surface: `.skilled/hooks/vitest.config.ts`, the sk-design backend, `deep-ai-council/vitest.config.mjs`, the deep-loop runtime, the advisor runtime plus its stress variant, the spec-kit runtime plus its stress variant, and the spec-kit skill config. Two of the nine exist only to hold env-gated suites. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.stress.config.ts:1]

2. The advisor's default suite runs every one of its 185 files with `fileParallelism: false`, so the "about 2.7 minutes" the stress workflow quotes is a serial floor, not a property of the tests. Thirty-one of those files spawn processes, so serial execution queues process startup behind process startup. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40]

3. The deep-loop runtime config carries a hand-maintained five-pattern `SERIAL_FILES` list (`tests/stress/**`, `tests/lifecycle/**`, `fanout-run.vitest.ts`, `lineage-timestamp-window.vitest.ts`, `deep-research-postflip-fanout.vitest.ts`) and splits the tree into a `parallel` project excluding those patterns and a `serial` project for them, ordered by `groupOrder`. A new file that matches a serial pattern and a new file that does not are told apart only by this config, and nothing tests that the list is complete. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:57]

4. Fifteen harness and helper files back the suites, and one of them is shared across trees: every advisor and deep-loop run resolves `../system-spec-kit/runtime/tests/_support/vitest-setup.ts` by relative path, which is why both workflows list spec-kit `tests/_support/**` in their path filters. A helper edit in one skill therefore re-runs two other skills' suites. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:38] [SOURCE: .github/workflows/skill-advisor-stress.yml:22]

5. Fixture trees sit at runtime library paths with packet numbering in the directory name, such as `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling`. They cost no run time, but a runtime fixture whose path records a closed packet's sequence number is the same ephemeral-label pattern the repository's comment-hygiene rule blocks in code. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs:1]

6. No config records its own duration, so the parallel/serial decision cannot be priced from the repository: the only measured figures are the workflows' means (457 s advisor, 472 s deep-loop) and the local "2.7 minutes" the advisor workflow quotes for a serial default suite. [SOURCE: .github/workflows/deep-loop-runtime.yml:1] [SOURCE: .github/workflows/skill-advisor-stress.yml:58]

## Ruled Out

- Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot.
- Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete.

## Dead Ends

- Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the advisor comment implies the default suite was never run in CI, while the workflow now runs it, and the workflow comment records that history.
- Missing dependencies: no per-config or per-project durations.
- Partial success: config inventory and the serial/parallel split are confirmed; seconds saved by parallelising are not measured.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`
- `.skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`
- `.skilled/skills/system-spec-kit/vitest.config.ts`
- `.skilled/skills/system-spec-kit/runtime/vitest.stress.config.ts`
- `.skilled/hooks/vitest.config.ts`
- `.github/workflows/skill-advisor-stress.yml`
- `.github/workflows/deep-loop-runtime.yml`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/` (fixture tree listing)

## SCOPE VIOLATIONS

None. No config was modified; the parallelism findings are recommendations only.

## Assessment

- New information ratio: 0.90
- Questions addressed: "Which overengineered test infrastructure (custom harnesses, serial lists, fixtures, helper layers) costs run time or maintenance beyond the coverage it adds?"
- Questions answered: "Which overengineered test infrastructure (custom harnesses, serial lists, fixtures, helper layers) costs run time or maintenance beyond the coverage it adds?" — the inventory is complete and the mechanisms are named, with the seconds labelled unmeasured.

## Reflection

- What worked and why: reading configs instead of test bodies. One `fileParallelism: false` line explains more run time than any amount of suite reading, and the deep-loop split shows what a hand-maintained serial list actually looks like.
- What did not work and why: trying to attribute seconds. The repository stores no per-config timing, so every parallelism figure has to be offered as a hypothesis.
- What I would do differently: grep for `fileParallelism` in the first iteration, because the serial default is the single largest cost lever found in this lineage after the report-only job.

## Recommended Next Focus

The remaining CI guard cluster — `naming-standard-guard`, `message-contract`, `dispatch-enforcement-guard`, `command-tree-parity`, `rule-canary-sync`, `markdown-link-integrity`, `skill-doc-frontmatter`, `gate-inputs`, `changed-packet-validation` — to rank which of these should lose a trigger, merge, or move to the push path's own backstop.
