# Review not yet run: the project's own dispatch gate withholds authorization

Both requested reviews — `cli-pi` (GLM-5.3-Flash, `--thinking max`, llmgateway) and
`cli-codex` (GPT-5.6 Luna, `--reasoning-effort max`, `fast`) — are composed and ready, but
nothing has been dispatched. The operator's CLI-dispatch authorization hook denied both
attempts. This note records exactly why, so the next session does not have to rediscover it.

## What blocked it

`.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` (`shouldDenyPiDispatch`, wired to the
`tool_call` hook) denies a `bash` dispatch unless the user's **own, current** request names the
matching executor as a literal token. Two denials, in order:

1. `Pi dispatch denied: the command does not prove one direct executor.`
   The first command shape was `ambiguous` to the shared inspector: it used an `env -u NAME`
   wrapper, a `$PROMPT` variable and a heredoc. The inspector treats any variable expansion or a
   second dispatch-shaped segment as ambiguous. Re-shaped with a literal prompt and one
   executor, the classification became `direct`.
2. `Pi dispatch denied for cli-pi. Name the matching executor in the user request.`
   Now correctly classified, still unauthorized: the captured request text was the latest user
   turn, which names Codex (upper-case, spaced) and not `cli-pi`.

## Which phrasings authorize what

`review/authorizer-probe.mjs` imports the shipped gate and calls its decision function directly
(no process is launched, no command is executed). Output in `review/authorizer-probe.txt`:

| Request text | `cli-pi` | `cli-codex` |
|---|---|---|
| "Use cli pi with GLM 5.3 flash max llm gateway to review what youve done" | DENY | DENY |
| "Also ask GPT 5.6 LUNA MAX FAST (CLI CODEX)" | DENY | DENY |
| "use cli-pi and cli-codex to review" | ALLOW | ALLOW |
| "use cli-pi to review" | ALLOW | DENY |
| "do not use cli-pi" | DENY | DENY |

The match is a literal, case-sensitive `cli-pi` / `cli-codex` token with non-word boundaries.
"cli pi" with a space and "CLI CODEX" in upper case both fail; a negated mention fails by design.

## What would unblock it

- **Preferred:** re-issue the request naming the executors literally, e.g.
  "use cli-pi and cli-codex to review". Both dispatches then run sequentially (the cli-codex
  packet's single-dispatch discipline forbids launching two at once unless the operator
  explicitly asks for parallel).
- Alternative, operator's call: disable the dispatch concern for a session with
  `CLI_DISPATCH_AUDIT_DISABLED=1` (canonical switch; aliases `SYSTEM_DISPATCH_DISABLED`,
  `MK_DISPATCH_DISABLED`). This also drops the dispatch audit trail, which is why it is not the
  recommended route here.

Nothing in `review/` claims a review happened. `brief.md`, `change-under-review.diff` and the
probe are the prepared inputs only.
