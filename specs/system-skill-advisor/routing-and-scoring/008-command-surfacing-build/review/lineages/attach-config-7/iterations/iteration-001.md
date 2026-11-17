# Review Iteration 001

## Dispatcher

- Lineage: `attach-config-7` (fan-out child, session `fanout-attach-config-7-1794829999759-g4q8yp`)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `attach-config` per `review/review-scope-7.txt`
- Diff base: `git -c core.fsmonitor=false diff 85550ee946e 1c3d62def5a -- <path>`
- Dimension: correctness
- Operator review focus: reviewer read `review/review-brief-7.txt` and `review/review-scope-7.txt` before analysis. This iteration covers the matcher and test-config behavior the brief assigns to `attach-config-7`; the scorer and docs areas stay with their own lineages, and no recorded limit from the brief is re-reported.
- Steer channel: `steer.md` does not exist in the lineage directory at this iteration.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (changed hunk 197-244, plus 255-263 and 456-518 call sites) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197]
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (changed hunk 1-32) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:1]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (changed hunk 436-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:436]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (changed hunk 87-96) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:87]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` (changed hunk 779-790) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:779]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. Correctness behavior of the changed lines matched every input probed this iteration.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | No spec-folder requirement names the suffix chain; behavior is verified against the command docs in iteration 2. [SOURCE: .skilled/commands/speckit/complete.md:3] |
| `checklist_evidence` | notApplicable | The review target is a phase-parent packet with no `checklist.md`; the scope is the five child-area files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Behavior Probes

Inputs were evaluated against the exact `MODE_SUFFIX` and `typedCommandIn` logic from the changed file, reproduced outside the repository (no build, no test run, no writes).

- `/speckit:complete:auto:with-research now` -> `/speckit:complete` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- `/speckit:complete:with-phases:with-context:with-research:auto:confirm:unattended` -> `/speckit:complete` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- `/speckit:complete:unattendedx now` -> `undefined`, so a longer word does not read as `:unattended` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- `/speckit:complete:auto:draft now` -> `undefined`, so an unknown suffix poisons the chain instead of falling back to `:auto` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- `/speckit:complete:with-research:` -> `undefined`, because the trailing colon fails the negative lookahead [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- `run /create:sk-skill.` -> `/create:sk-skill`, and `see /create:sk-skill.md` -> `undefined`, so the sentence-period and path boundaries are unchanged [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:424]

## Integration Evidence

- `typedCommandForTop` still requires the leading skill to own the row or carry the same command row, so the widened suffix cannot attach a command to an unrelated skill. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:255]
- `attachCommand`'s deep-loop gate compares `typedCommandIn(prompt)` with the mode's command, so `/deep:review:with-research` now counts as typing `/deep:review`; that is the intended reading of a typed command and not a new attach path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:513]
- The vitest config sets `TMPDIR`, `TEMP` and `TMP`, which matches `os.tmpdir()`'s platform order (POSIX `TMPDIR`, Windows `TEMP` then `TMP`), and the shared setup file keeps an absolute value when one is set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:18] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:16]
- The new arena premise check asserts `git ls-files -z` output above `1024 * 1024` bytes, the default `spawnSync` buffer, so the fixture cannot silently stop guarding the overflow it was built for. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:784]
- The doctor brief test now passes `{ childSession: false }`, so its parent-shape assertion no longer depends on the dispatching worker's environment. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]

## Edge Cases

- A chain followed by a file extension (for example `:with-research.md`) reads as the command. This is the same dot rule recorded in `review-brief-7.txt` and is not re-reported. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:233]
- The exit handler removes the per-run temp folder only when node exits normally; a signal-killed run leaves the folder behind. The config comment states this limit, so it is documented, not silent. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:13]
- Coverage-graph seeding and upsert were skipped so every write stays inside the lineage directory. `convergence.cjs` therefore reports an empty graph and returns `CONTINUE`; that is a state of the lineage, not a finding about the reviewed code.
- The matcher accepts the shared suffix set on every command, including commands whose `argument-hint` does not advertise a given modifier. That is a vocabulary-scope question rather than a correctness failure in the changed line, and it is deferred to the traceability iteration.

## Confirmed-Clean Surfaces

- The start boundary and continuation rules are unchanged: a path such as `docs/create:goal.md` and a partial name such as `/create:sk` still fail to read as a command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:229]
- The longest-key rule still keeps `/group:name-parent` from collapsing to its shorter key, including with a suffix attached. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:236]
- The new tests pin both the positive chain and the negative unknown-suffix cases, so the widened vocabulary cannot regress silently. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442]
- `AI_SESSION_CHILD` deletion cannot hide child-path coverage: suites that assert child behavior stub the flag themselves. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:49]

## Ruled Out

- Catastrophic backtracking: the only new quantifier is `(?::(?:...))+`, each repetition consumes at least one character, and the alternatives are prefix-disambiguated, so the engine backtracks linearly over a prompt-length slice. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- Regex injection from prompt text: the suffix pattern is a constant and user text is only tested against it; `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:315]
- A false `:auto` match inside `:automation`: the negative lookahead rejects the following letter and the chain cannot back down to zero repetitions, which the existing guard test still pins. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:449]

## Next Focus

- Dimension: traceability
- Focus area: the suffix vocabulary against the command `argument-hint` documents, then the tests that pin the matcher.
- Reason: correctness is clean; the remaining question is whether the matcher reads exactly the suffixes the documents advertise, per command.
- Rotation status: correctness complete, traceability next.
- Blocked/productive carry-forward: productivity of direct diff-read plus the documents under `.skilled/commands`; no blocked approaches.
- Required evidence: file:line for each command whose advertised modifiers differ from the shared suffix set, with one concrete typed input.
- Recovery note: not in recovery.

Review verdict: PASS
