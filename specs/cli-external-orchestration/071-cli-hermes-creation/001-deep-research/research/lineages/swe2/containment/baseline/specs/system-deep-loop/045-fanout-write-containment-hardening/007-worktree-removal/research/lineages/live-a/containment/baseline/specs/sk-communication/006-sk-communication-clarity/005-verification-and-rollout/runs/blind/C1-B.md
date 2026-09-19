Case: C1

Where does the retry policy live?

Reply B:

There is no single retry policy here. The phrase resolves to a different thing at each layer, so it depends which one you mean.

The one that is literally named a policy: the retry behavior of orchestration, in `.claude/agents/orchestrate.md`. It defines the "Retry → Reassign → Escalate Protocol" at line 571, auto-retry up to 2x on a quality score below 70 at lines 552-555, and a circuit breaker, 3 consecutive failures then a 60s cooldown, at line 589.

Other places the word "retry" is defined, in case you meant one of those:

- The harness, pi, retries transient model errors. Knobs are `retry.enabled`, `retry.maxRetries` (default 3), `retry.baseDelayMs` (2000, backoff 2s, 4s, 8s), documented in pi's `docs/settings.md` §Retry. The implementation lives in the installed pi package, I did not locate the source file.
- The code agent has no retry by design. `.claude/agents/code.md` line 53 says NO internal retry, and `orchestrate.md` line 273 stops retrying `@code` after 3 consecutive BLOCKED.
- Deep research retries Tier 1 source failures, max 2, `.claude/agents/deep-research.md` line 178.
- Which nodeterm error codes are worth retrying: `.codex/AGENTS.md` lines 102-104.
- The only retry policy in working code is the retry loop guard, `RetryLoopGuardState`, in `.pi/extensions/pi-cache-optimizer/index.ts` from around line 7695.
- Lease-probe retry knobs: `.env.example` lines 92-93.

When to add a retry at all is a rule, not a mechanism: `repo-rules/root-cause-and-debugging.md`, the symptom-fix smells table.

Tell me which layer you meant if none of these is it, and I will go deeper there.
