## Verdict

The C10 orphan coverage and C11/C12 layout assertions address the cited gaps, but the review remains blocked by an unsafe Git-inherited environment in the worktree fixture and stale source-root comments.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 must fix | `.opencode/bin/tests/worktree-session.test.sh:53-57,225-226` | Running the test with `GIT_INDEX_FILE=/path/to/real/index` or `GIT_DIR=/path/to/real/.git` makes fixture Git commands and the launcher inherit those paths, allowing index/config/worktree writes against the real repository instead of `$ROOT`. | Sanitize all repository-affecting `GIT_` variables for every fixture Git and launcher invocation. |
| F-002 | P2 should fix | `.opencode/bin/install-codex-hooks.mjs:9`; `.opencode/bin/relink-local-specs.sh:17` | In a `.skilled`-only checkout, the installer usage comment instructs `node .opencode/bin/...`, which fails because that path is absent; the relinker comment likewise incorrectly describes `.opencode/bin` when run through `.skilled/bin`. | Use a source-root-neutral description such as `<source-root>/bin`, or document both supported spellings. |
Codex exit 0, 2026-09-17T12:00:14Z to 2026-09-17T12:06:20Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
