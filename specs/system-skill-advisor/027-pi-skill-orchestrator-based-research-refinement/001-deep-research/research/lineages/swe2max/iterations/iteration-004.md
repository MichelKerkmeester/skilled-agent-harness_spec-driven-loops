# Iteration 004 — Advisor delivery surface: hooks, subprocess fallback, prompt policy, robustness

## Focus

How the advisor's brief actually reaches each runtime, what its failure taxonomy looks
like end-to-end, and how its robustness patterns compare to the orchestrator's.
Advisor side of RQ2 (failure modes) and RQ7; supporting evidence for RQ3 and RQ6.

## Actions Taken

- Read `hooks/pi/prompt-advisor.ts` (287 lines) — Pi in-process bridge + dedup.
- Read `hooks/claude/user-prompt-submit.ts` (444 lines) — canonical hook lifecycle.
- Read `hooks/lib/skill-advisor-cli-fallback.ts` (580 lines, key sections) — CLI front door.
- Read `runtime/lib/subprocess.ts` (369 lines) — Python scorer spawn mechanics.
- Read `runtime/lib/prompt-policy.ts` (197 lines) — fire-suppression gate.
- Surveyed `.skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` (1499 lines) — plugin mirror.

## Findings

### F18 — Delivery surface is five runtime adapters over one lifecycle core [CONFIRMED]

The Claude hook's `handleClaudeUserPromptSubmit` emits a `hookSpecificOutput.additionalContext`
envelope (`hooks/claude/user-prompt-submit.ts:357-362`); the Pi hook imports that same
handler in-process and appends the context to the visible prompt via a `transform`
action (`hooks/pi/prompt-advisor.ts:230-285`); the OpenCode plugin is a plain-JS mirror
of the lifecycle with in-flight dedup and bounded sizes
(`.skilled/hooks/skill-advisor/opencode/system-skill-advisor.js:4-6, 267-272, 390-418`).
All hooks route through `buildSkillAdvisorBriefFromCli`, which owns the warm-daemon
probe and the local-scorer fallback inside the CLI
(`user-prompt-submit.ts:271-290`; `hooks/lib/skill-advisor-cli-fallback.ts:160-168`).
Hook budget is `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` env-overridable
(`user-prompt-submit.ts:106, 163-165`); the warm-CLI probe itself runs at
`DEFAULT_CLI_FALLBACK_TIMEOUT_MS = 250` (`cli-fallback.ts:76, 145-158`). The
orchestrator has one integration point (a Pi extension, `src/index.ts`); the advisor
maintains five thin adapters over a shared lifecycle — higher surface area, but each
adapter is a bounded shim over identical core logic.

### F19 — The failure taxonomy is layered, typed, and always fail-open [CONFIRMED]

The subprocess runner returns nine typed error codes — `PYTHON_MISSING`,
`SCRIPT_MISSING`, `TIMEOUT`, `JSON_PARSE_FAILED`, `INVALID_JSON_SHAPE`,
`SQLITE_BUSY_EXHAUSTED`, `NON_ZERO_EXIT`, `SIGNAL_KILLED`, `SPAWN_ERROR`
(`runtime/lib/subprocess.ts:45-54`) — with a single `SQLITE_BUSY` retry carrying
75-125 ms jitter inside the original 3 s budget (`subprocess.ts:86, 97-99, 303-321`)
and stderr sanitized to 240 chars (`subprocess.ts:114-120`). Above it, the CLI
fallback classifies retryable reasons (`socket_absent`, `timeout`,
`warm_daemon_unavailable`, `bad_json_response`, exit 75) and retries the CLI path on
`fail_open` or `degraded`+`unavailable` (`cli-fallback.ts:77, 86-91, 113-122, 160-168`).
The hook layer emits `{}` on parse failure and on any unhandled exception
(`user-prompt-submit.ts:243-254, 376-387, 430-441`), honors the kill-switch
`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and shared hook-flags
(`user-prompt-submit.ts:44-53, 232`), and emits diagnostics that can never affect
behavior (`user-prompt-submit.ts:196-212`). On Pi, `advisorFailed` means no context is
appended; the opt-in `SPECKIT_PI_ADVISOR_DEBUG` line classifies
failed/empty/fallback/head with durationMs against the budget so an operator can tell a
timeout from an unreachable daemon (`prompt-advisor.ts:164-191, 251-255`). Compared
with the orchestrator's persistence-side robustness (atomic write tmp+rename in
`skill_io.ts`, catalog fail-closed with error, compat-test warnings in `index.ts`),
the advisor's robustness is delivery-path defense in depth: three degradation layers
(daemon → warm CLI → local scorer), typed errors, and a hard latency ceiling at every
hop. Neither side has the other's primary mechanism: the advisor has no atomic-write
discipline issue to solve (it writes only caches/diagnostics), and the orchestrator has
no multi-layer serving fallback.

### F20 — Directive dedup is the advisor's own partial answer to push-cost [CONFIRMED]

`decideDirectiveLifecycleDelivery` suppresses a proven same-content repeat of the
constant `Directives:` block per session, while lifecycle boundaries
(startup/resume/compact or transcript shrink) force full redelivery
(`user-prompt-submit.ts:303-345`); the Pi hook carries its own mirror,
`decidePiDirectiveDelivery`, suppressing identical full contributions
(`prompt-advisor.ts:60-69, 129-152`), and the OpenCode plugin mirrors it via
`splitDirectiveBrief` + `deduplicateTransforms`
(`system-skill-advisor.js:61-70, 267-272, 390-418`). The suppression is content-equality
on the *static* part only: a changed `Advisor:` head re-delivers the whole block, so it
saves tokens on repeat turns but cannot shrink a single delivery. This is the push
design learning one half of the orchestrator's lesson — don't resend what the model
already has — but the variable head (the actual routing signal) is never deduped, only
the invariant directive tail.

### F21 — `shouldFireAdvisor` is a prompt-partitioning gate, not a skill scope [CONFIRMED]

The prompt policy fires the advisor only on explicit markers (`sk-*`, `/command`,
governance markers), work-intent verbs with ≥ N meaningful tokens, length+token
thresholds, or long non-casual prompts — and suppresses empty prompts, exact-skip
commands, and short casual acknowledgements
(`runtime/lib/prompt-policy.ts:83-197`), with the policy externalized to
`data/prompt-policy.default.json` and thresholds env-overridable
(`prompt-policy.ts:30-58`). This is the cheapest form of "scope": it removes the
advisor's cost on the prompt classes where routing adds nothing, but it partitions
*prompts*, never the *skill set*. The orchestrator's profile/group scopes partition
skills per active context (`scope.ts`, `profiles.ts`). The two compose cleanly: an
advisor "profile" could gate which skills are eligible per policy reason or per
project, something neither system does today — the advisor ranks the full graph on
every fired prompt.

### F22 — Boundary hygiene: prompt clamp, root anchoring, migration atomicity [CONFIRMED]

Prompts are clamped byte-safe to `MAX_PROMPT_BYTES = 64 KB` via binary-search slicing
(`user-prompt-submit.ts:107, 115-134`); Pi's raw-input capture is bounded at 32 KB per
session over ≤64 sessions (`prompt-advisor.ts:8-10, 16-30`). Workspace root resolves to
the real repo root so a nested cwd can't spawn a stray `.state/advisor` tree
(`user-prompt-submit.ts:136-145`). CLI path discovery accepts either `.skilled` or
`.opencode` roots but requires all three paths (CLI, IPC bridge, db dir) from one root —
a half-migrated checkout is rejected rather than producing a broken pair
(`cli-fallback.ts:170-197`). The orchestrator's equivalent hygiene is at write time
(atomic rename, content-addressed assets); the advisor's is at read/locate time —
consistent with push-vs-pull: the pull side defends its writes, the push side defends
its delivery path.

## Questions Answered

- RQ2 (advisor side): failure surface = typed error → degraded layers → `{}` or
  directives-only fallback; operator-visible only via opt-in debug.
- RQ7 (advisor side): delivery-path defense in depth — timeouts at every hop, one
  jittered SQLITE_BUSY retry, kill switches, sanitized stderr, migration-atomic path
  discovery, prompt clamps, behavioral diagnostics.
- RQ3 partial: prompt-policy as the advisor's only existing "scope-like" partition.
- RQ6: dedup bounds repeat-turn cost; single-delivery bound remains the 80/120-token cap.

## Questions Remaining

- Whether the skill graph's `depends_on` rows could back a bundle return (schema check
  in iteration 5's verification pass).
- Cross-lineage agreement check against the mimo lineage findings (iteration 5).
- Citation verification across all findings (iteration 5).

## Ruled Out

- Full read of `system-skill-advisor.js` (1499 lines): plugin internals mirror the
  canonical lifecycle; section reads cover the divergence points (dedup, CLI args,
  lifecycle mapping). Evidence: `system-skill-advisor.js:61-70, 390-418, 749-763, 805-807`.
- `directive-lifecycle.ts` internals: decision contract already established from
  caller sites; sink details don't change the mechanism comparison.
- Devin/Cursor hook files (`hooks/devin`, `hooks/cursor`): same lifecycle module, thin
  adapters; reading all five adapters adds no new mechanism.

## Next Focus

Iteration 5: citation verification pass over the synthesis claim set, skill-graph
schema check for dependency rows, cross-lineage comparison with the mimo lineage,
and the verdict table (ADOPT/ADAPT/REJECT per mechanism).
