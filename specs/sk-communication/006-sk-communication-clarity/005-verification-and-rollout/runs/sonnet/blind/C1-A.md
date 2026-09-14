Case: C1

Where does the retry policy live?

Reply A:

Three distinct retry mechanisms exist in this repo, no single unified "retry policy":

1. **Lineage-level dispatch retry** — `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:447-668`. A lineage's failed attempt retries when `result.error.retryable === true` and `retryCount < maxRetries` (`normalizeMaxRetries`, line 83). Counts persist through the ledger (`readRetryCountsFromLedger`, line 267), so an `orphan_requeued` consumes the same budget as `retry_scheduled` rather than resetting it.

2. **Git index.lock retry** — `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:292-374`. A fixed backoff schedule, `GIT_INDEX_LOCK_RETRY_DELAYS_MS = [250, 500, 1000, 2000]`, used only to wait out a neighbouring lineage's transient `.git/index.lock`, not for any other non-zero git exit. This is the mechanism the two most recent commits on this branch touched (`65ea476de3`, `a766c23a8f`).

3. **Post-resume reconciliation eligibility** — `.opencode/skills/system-deep-loop/runtime/lib/result-envelopes/types.ts:220` (`retryPolicyEligible` on `ExpectedLeafAttempt`) and `resume-reducer.ts:271-291`. This isn't a retry loop itself, it's a flag consulted when resuming a run to decide whether a `not_applied` / `execute_once` leaf is allowed to be retried at all.

If you meant the general engineering *rule* for when a retry is acceptable to write in the first place, that's a repo-wide policy statement, not code: `REPO RULES.md` → `repo-rules/root-cause-and-debugging.md` §2, which flags "a retry around a deterministic operation" as a smell (you don't know why it fails, and now it fails five times), and §5 tightens that to at most one re-run before treating a repeated failure as real.

Which of these did you mean, or is it something else entirely?
