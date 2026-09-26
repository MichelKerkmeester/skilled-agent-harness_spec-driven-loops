---
title: "Iteration 9: Failure modes and prompt caching in the wiring"
trigger_phrases: []
---
# Iteration 9: Failure modes and prompt caching in the wiring

**Angle:** deepseek-09 · **Lens:** integration engineer · **Wave 4** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

For the top ideas, what happens on exit 3, exit 4, a malformed answer, a slow call near the deadline and the wrong `jev` package on PATH, and does any of them change a prompt that a provider caches? Hand-off target: a failure table per idea, the version probe that tells the two packages apart, and any idea that fails its deadline.

## Sibling check (required from wave 2 onward)

Newest siblings: grok complete at 10; mimo at iteration 2. No new sibling material changes this angle. No restating.

## Actions Taken (opened this iteration)

- `.skilled/skills/cli-jev/cli-usage/SKILL.md:167-174`, `:200-210`
- `.skilled/skills/cli-jev/cli-usage/references/cli-reference.md:150-175`
- `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:139-168`
- `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/binary-resolves-and-pins-version.md:29-63`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md:132-141`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:288` (60 s client timeout)
- Digest claims (reused): material digest section 5 package table, seam-map hook deadlines

## The version probe that tells the packages apart

- **Probe:** `command -v jev && jev --version` must print exactly `jev 0.6.2` at exit 0 (`cli-reference.md:28`, LIVE; playbook `binary-resolves-and-pins-version.md:33-36`: "stdout is exactly `jev 0.6.2` at exit 0"). Exit 127 means the shim is missing (`:36`). Any other version string means the pin moved and every downstream expectation moves with it (`:36`).
- **Then:** `jev auth status` decides whether a judgment is possible and never prints the key (`SKILL.md:96-103`); `auth test` costs one billed call (`providers-and-models.md:145-148`).
- **Why it is mandatory:** `command -v jev` passes for either package; the npm `jevctl` installs the same binary name and its **exit 2 is a tripped `--fail-on` gate**, not a usage error (material digest section 5). A caller that maps exit 2 to "usage, no quota spent" would misread a tripped gate as a flag problem, and its `noul`/`choice` subcommands do not exist there at all. Every caller must fail closed on a version mismatch, before it interprets any exit code.

## Failure table per surviving idea

| Idea | Exit 3 (credential) | Exit 4 (retryable) | Malformed / missing answer | Slow call | Wrong package on PATH |
|---|---|---|---|---|---|
| **A. Routing arm (harness A)** | Probe `auth status` first; exit 3 → write census + baseline report, mark the arm `skipped: credential` in the report, exit 0. Never write arm numbers. | Per-row: back off and retry once (docs: "back off and retry; never read as a judgment", `SKILL.md:173`; `integration-patterns.md:138`); on the second failure mark that row `unmeasured` and continue. Never a pick, never a `none` substitute. | Non-JSON stdout, missing `choice` key, or a key outside the submitted option set → row `unmeasured`; never coerced to a default. | Wrapper kills at a per-call timeout (10 s proposed); killed call → row `unmeasured`, record `timeout`. | Version probe fails → abort the arm with a named error; baseline output still written. |
| **B. D4 `jev` grader** | Startup refusal (stderr + exit 2) mirroring the family-collision check (`run-benchmark.cjs:614-621`); never fall through to `mock`. | `parse_status: 'failed'` plus an explicit not-measured marker; **not** `score 0.0` (`score-model-variant.cjs:222-224` is the anti-pattern). Retry once at the runner level, then the fixture is ungraded. | `parse_status: 'failed'`, fixture ungraded. | The Claude path allows 120 s (`harness.cjs:44`); the jev wrapper may use up to that, but should record `latencyMs`. | Startup version probe; mismatch → refuse the run. |
| **C. Goal verifier `jev` mode** | Probe at plugin init; exit 3 → fall back to `heuristic` for the session and log once. Never a fabricated verdict. | That turn falls back to `verifyGoalHeuristic`; record the fallback reason. | Fallback to the heuristic verdict for that turn. | Spawn timeout must sit under the 30 s verifier budget (`opencode-goal.js:49`); a 10 s wrapper timeout leaves margin, then fallback. | Version probe at init; mismatch → keep `heuristic`, log once. |
| **D. Stop second-rater replay** | Probe first; no key → replay runs without the Jev arm and says so (iteration 4). | Row-level retry once then `unmeasured`; a STOP judgment is never synthesized from a transport failure. | Row `unmeasured`. | Offline; per-call timeout as A. | Abort the arm. |
| **E. Severity replay (H14)** | Probe first; no key → the replay reports the arm skipped; the reviewer path is untouched. | Row-level retry once then `unmeasured`. | Row `unmeasured`; never `not_a_finding` by default. | Offline; per-call timeout as A. | Abort the arm. |

- **Interrupted (130):** operator abort in every case; leave partial JSONL in place with a `finished: false` marker rather than deleting evidence.
- **Exit 1 (unexpected response):** inspect the stderr body once (`SKILL.md:170`); the error object is on **stderr** with stdout empty (`cli-reference.md:157-159`), so a stdout-only parser records an empty payload and must classify it as failure by exit code first.

## Deadline verification

| Surface | Budget | Fits? |
|---|---|---|
| Routing arm, replays, grader | none (offline) | yes; wall time recorded per call |
| Goal verifier | 30 s verifier budget (`opencode-goal.js:49`), configurable | yes with a wrapper timeout under 10 s; the Python client's own 60 s timeout (`__init__.py:288`) is irrelevant because the wrapper kills first |
| Advisor child | 2200 ms effective (iteration 2) | no; already dropped |
| Claude PreCompact | 1800 ms internal | no; already dropped |
| Completion sentinel (live) | 1200 ms internal | no; offline only (iteration 1) |

## Prompt-cache analysis

1. **The four survivor ideas touch no model prompt at all.** The routing arm, the D4 grader, the stop replay and the severity replay run offline and write reports; no host-provider prompt is composed or altered, so no provider cache can be invalidated.
2. **The goal verifier changes a verdict, not a cached prefix.** The `[active_goal]` injection is already per-turn variable by design (`goal-plugin.md:49-51`), and the nudge is a hidden message sent only when the verdict is not `met` (`goal-context.ts:233-239`). A Jev verdict changes which hidden nudge fires, not a stable prefix.
3. **The cache-breakage warning in the vendored material applies to per-request history pruning**, which this lineage does not propose (compaction live pass dropped at iteration 3; advisor live lane dropped at iteration 2). Nothing surviving rewrites conversation history.
4. **Do not add a client-side answer cache to the measurement arms.** A content-hash judgment cache (the supercov / pi-jev pattern) would make the arm's three stability runs return identical answers and defeat the flip-rate measure. Caching belongs to operational repeat use (for example a future cached shadow lane), not to measurement.
5. **No server-side Jev cache is documented** (material digest section 2); all caching seen in the vendored material is client-side.

## Findings

1. **Every failure path is already named in the pinned contract**: 0 judgment, 1 inspect, 2 usage/no-quota, 3 operator, 4 retryable, 130 interrupted (`cli-reference.md:150-155`, LIVE/SOURCE tagged). The wiring work is mapping them, not inventing them.
2. **The stderr/stdout split makes exit-code-first parsing mandatory.** Errors print one JSON object on stderr and leave stdout empty (`cli-reference.md:157-159`); a wrapper that parses stdout first cannot distinguish "no output" from "no judgment".
3. **The wrong-package hazard is real and cheap to close**: one exact version-string check (`jev 0.6.2`) at every caller, fail closed with a named error. Exit 2 is the dangerous collision: usage here, tripped gate there.
4. **Retry semantics are asymmetric and documented**: back off on 4, never retry 3, inspect 1 (`SKILL.md:170-173`, `integration-patterns.md:138-141`). A blanket retry wrapper would violate them.
5. **No deadline in the surviving set fails, provided each wrapper sets its own timeout.** The only deadline-bearing survivor is the goal verifier, and it has 30 s against a 10 s wrapper timeout plus a heuristic fallback.

## Ruled Out

- **Interpreting any stdlib failure as a judgment**: explicitly forbidden (`integration-patterns.md:138`).
- **A blanket retry policy across exits**: exit 3 must not retry; exit 1 must not retry blindly.
- **A client-side answer cache inside a stability measurement**: would nullify the measurement.
- **Treating `score 0.0` as the not-measured representation** for the grader: the ungraded fixture must be distinguishable from a maximally hallucinated one.

## Questions Answered

- Failure semantics per idea: table above.
- Version probe: exact `jev 0.6.2` stdout check before any exit-code interpretation; a mismatch aborts the caller.
- Deadline fit: all survivors fit with wrapper timeouts; the only near call is the goal verifier under its 30 s budget.
- Caching: no survivor changes a provider-cached prompt; the risk belongs to the dropped prune/live ideas.

## Questions Remaining

- Does the Python client expose any timeout override? Not found in the pinned docs; UNKNOWN, so wrappers must kill. (And `JEV_TIMEOUT_MS` is the **jevctl** env var; it must not be cited for the Python CLI.)

## Hand-off (for iteration 10)

- The build order must carry this failure table as acceptance criteria: each slice ships with its probe, its exit map, and its not-measured representation.
- No survivor changes a provider-cached prompt; do not add cache work to any phase.
- The goal verifier slice must include the one-time fallback notice; the grader slice must include the not-measured representation and the silent-mock fix.

## Assessment

- `newInfoRatio`: `0.64`
- Novelty justification: Mapped every exit class onto each survivor, pinned the exact version probe with its package-collision rationale, and proved that no surviving idea touches a provider-cached prompt. The caching analysis closes the vendored warning for this proposal set.
- Confidence: high for the contract taxonomy and probe; medium for per-call timeout choices (10 s is proposed, not measured); UNKNOWN for Python-side timeout override.

## Sources Consulted

- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/references/cli-reference.md`
- `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md`
- `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/binary-resolves-and-pins-version.md`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`
- Digest claims (not reopened): material digest section 5, seam-map hook deadlines
