Case: C1

Where does the retry policy live?

Reply B:

This is the freshest one, from the last commit on your branch (`65ea476de3`, "wait out a neighbour's index.lock in containment and report an exhausted retry").

The `.git/index.lock` retry policy lives in `spawnGit()` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:339-377`, backed by the delay table `GIT_INDEX_LOCK_RETRY_DELAYS_MS = [250, 500, 1000, 2000]` at line 292. Four retries, delays summing to under 4 seconds, matches only the `index.lock` contention message, fails open on any other error, and records an exhausted budget once via `drainGitContentionWarnings()` rather than blocking the loop.

There's a second, unrelated retry concept in the same skill: `retryPolicyEligible` on `ExpectedLeafAttempt` (`runtime/lib/result-envelopes/types.ts:220`), which governs leaf-dispatch retry eligibility in the result-envelope reducer, not git locking.

If you meant a different runtime's retry policy (API calls, a CLI executor, etc.), say which surface and I'll point at that instead.
