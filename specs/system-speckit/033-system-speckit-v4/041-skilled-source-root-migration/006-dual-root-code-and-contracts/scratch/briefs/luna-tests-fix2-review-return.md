## Verdict

LOAD-003 is correctly moved outside the loader’s temporary bases and cleaned up on Linux/macOS; one P1 isolation defect remains because `GIT_CONFIG_GLOBAL` is not cleared before fixture or launcher execution.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 must fix | `.opencode/bin/tests/worktree-session.test.sh:12-14` | Run with `GIT_CONFIG_GLOBAL=/foreign/.git/config`, where the config sets `core.worktree=/foreign`. The variable reaches fixture Git commands and launcher calls (`:56-63`, `:235-244`); the wrapper can resolve `MAIN_ROOT` as `/foreign` and write there via `git -C "$MAIN_ROOT"` (`.opencode/bin/worktree-session.sh:197-201`, `:286-291`). | Also unset `GIT_CONFIG_GLOBAL` before any fixture or launcher invocation. |
Codex exit 0, 2026-09-17T12:19:09Z to 2026-09-17T12:24:02Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
