# Iteration 3: The degraded fallback path when the daemon is unreachable

## Focus

The carried question no lane owns: when the hook cannot reach the advisor daemon it answers from a local fallback with freshness `stale`. Find which runtimes hit that path in practice and how often, then name the smallest change that makes the fallback answer carry the same command as the live answer.

## Actions Taken

1. Read `012-plain-offer-reach/scratch/live-heads.txt` (the recorded degraded-path note) and its live lines for the same prompts.
2. Re-ran the degraded path at HEAD for the plain readme tune prompt with an unreachable endpoint (`SPECKIT_IPC_SOCKET_DIR=tcp://127.0.0.1:65123`) and timed it; saved `prompts/degraded-readme.json` and `.err`.
3. Read `runtime/skill-advisor-cli.ts` (`runLocalScorer`, `degradedRecommendations`, `LOCAL_SCORER_THRESHOLDS`), `runtime/lib/subprocess.ts` (`runAdvisorSubprocess` spawns `scripts/skill_advisor.py`), and `hooks/lib/skill-advisor-cli-fallback.ts` (field forwarding, `--no-warm-only`, freshness mapping).
4. Read the recorded frequency evidence: `011-typed-command-delivery-and-guards/scratch/hook-health.json` and the 008 cold-start note in `goal.md`.

## Findings

1. The unreachable-daemon answer is produced by the checked-in Python scorer, not the TypeScript scorer the daemon runs. `runLocalScorer` spawns `skill_advisor.py` with `FORCE_LOCAL=1` and the CLI's own 0.8/0.35 thresholds, then maps the rows for the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1453] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:294]

2. `degradedRecommendations` deliberately collapses every row whose bare slash command does not appear in the prompt into its owner skill, dropping `command`, `policy` and `needsMode`. Plain offers, the doctor hand-off and the needs-mode label are therefore lost by construction on this path, not by accident. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1487]

3. Measured at HEAD on the plain readme tune prompt: the live daemon answers `sk-doc` with `/create:readme (start)`; the unreachable endpoint answers `system-spec-kit` with no command in 644 ms. That reproduces the 012 note (`write a readme for the utils folder` went to `system-spec-kit` with no command) on the current build. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json]

4. The hook reader already forwards `command`, `policy`, `needsMode` and `ownerSkillId` when the answer carries them, and maps a `degraded` or `local-scorer` envelope to freshness `stale`. The loss is upstream of the reader, in what the CLI emits. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:382]

5. Which runtimes reach it: every runtime whose hook runs the CLI fallback (Claude, Pi, Devin and DSH in the measured arms). Codex does not reach it at all, because its hooks are unapproved on this checkout: the 013 arm answered delivery `false` on 24 of 24 Codex lines and the delivery leg reads DEGRADED, so Codex gets no brief rather than a degraded one. OpenCode delivery stays `unknown`, so whether its plugin path degrades is unmeasured. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md:117]

6. How often, as recorded: zero realised fallback answers in the measured arms. The 008 cold-start measurement recorded fail-open 0 of 5 with a cold first prompt at 611-844 ms, and the 011 hook health recorded `rollingFailOpenRate` 0 over 3 debug invocations. The only realised hits are deliberate socket sandboxes: the 012 note and the probe above. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json]

7. There is no persistent counter for this path. The only counter is `hookHealth.rollingFailOpenRate`, which the hook writes only when `SKILL_ADVISOR_DEBUG=1`, so the real frequency outside deliberate sandboxes is UNKNOWN and cannot be quoted from a committed artifact. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json]

8. Cold start is no longer a fallback trigger: the hook passes `--no-warm-only`, so the CLI starts the daemon itself and bounds the wait instead of refusing a cold session. What remains is a crashed or unreachable daemon, and a socket-path failure: a `SPECKIT_IPC_SOCKET_DIR` long enough to exceed Darwin's `sun_path` limit makes the CLI exit 69 with a socket-path error and no brief at all. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:258]

9. The smallest change that carries the same command: in `runLocalScorer`, score in process with the TypeScript fusion scorer and apply the same `enrichCompiledRoutes` step the handler applies, instead of spawning `skill_advisor.py`; keep the Python spawn as the fallback when the built scorer is absent, and keep `degradedRecommendations` as the last resort. This reuses the exact code the daemon runs, so the degraded answer becomes the live answer with freshness `stale`. [INFERENCE: based on findings 1, 2 and 4]

10. Projected gain and cost: on the tune split the degraded brief would carry 27 head commands plus 1 `Also:` line out of 45, where it carries a command only for a typed prompt today; the plain readme prompt becomes `sk-doc → /create:readme (start)` and the doctor prompt keeps `/doctor:agents-md check (run)`. The measured cost of the Python spawn today is 644 ms for one prompt, so an in-process scorer is not slower. The floors are untouched because the daemon path does not change. [INFERENCE: based on findings 3 and 9]

## Ruled Out

- Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill.
- Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix.
- Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out.

## Dead Ends

- Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented.
- Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint.

## Edge Cases

- Ambiguous input: "the fallback answer" could mean the CLI's local-scorer envelope or the hook's degraded render. Both were read; the loss is in the CLI envelope, and the hook forwards what it receives.
- Contradictory evidence: the 012 note and my probe agree on the plain readme outcome, but the CLI reported `degraded: null` in my probe envelope, so the envelope shape depends on which branch answered. The behaviour, not the flag, is the evidence here.
- Missing dependencies: OpenCode's degraded behaviour is unmeasured because its delivery is `unknown`; reported as a gap, not a result.
- Partial success: none; every planned action ran.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1453`, `:1487`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:294`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:258`, `:382`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md:117`

## Assessment

- New information ratio: 0.75
- Questions addressed: which runtimes hit the degraded fallback, how often, and the smallest change that makes it carry the live command
- Questions answered: Which runtimes hit the degraded fallback path in practice, and how often? What is the smallest change that makes the fallback answer carry the same command as the live answer?

## Reflection

- What worked and why: reading the CLI's own fallback branch explained the exact loss (a deliberate collapse of untyped rows), which a black-box comparison alone would have shown only as a symptom.
- What did not work and why: the first sandbox probe used a directory inside this lineage and died on Darwin's socket-path limit, which hid the fallback behind a different failure; a loopback endpoint isolated the intended path.
- What I would do differently: read the fallback writer before reproducing the path, so the probe targets the branch under test.

## Recommended Next Focus

Synthesis: rank the measured candidates from iterations 1 to 3 by expected gain in started-when-useful per unit of risk, each with the file it changes, the rows or milliseconds it moves, the verification command, and its floor risk. Re-check each against segment one and segment two so nothing already built or declined is re-recommended.
