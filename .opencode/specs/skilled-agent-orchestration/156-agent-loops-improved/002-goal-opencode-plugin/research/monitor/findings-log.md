iter 1 | ratio 0.68 | ?/? | Codex stores one durable goal row per thread via thread_id primary key; the live database currently has zero r | ?
iter 2 | ratio 0.78 | ?/? | Claude /goal is gated by trusted workspaces and unrestricted hooks, so it is not just a slash-command state wr | ?
iter 3 | ratio 0.86 | ?/? |  | ?
iter 4 | ratio 0.74 | ?/? | OpenCode system-transform injection is string-only: input has optional sessionID/model and output.system is st | ?
iter 5 | ratio 0.74 | ?/? | Local OpenCode plugins expose a generic event hook and use session/message events for readiness, cache evictio | ?
iter 6 | ratio 0.76 | ?/? | Use a root `.opencode/commands/goal.md` command with subcommands inside `$ARGUMENTS`. | ?
iter 7 | ratio 0.72 | ?/? | The OpenCode goal store should port Codex's thread_goals row shape into a JSON record keyed by session ID, add | ?
iter 8 | ratio 0.79 | ?/? | Tier 2 active continuation is buildable because PluginInput exposes a client and the SDK exposes session.promp | ?
iter 9 | ratio 0.64 | ?/? | Verifier output needs durable fields in the per-session goal JSON so /goal show, mk_goal_status, and injected  | ?
iter 10 | ratio 0.69 | ?/? | OpenCode goal state should preserve Codex parity fields tokenBudget/tokensUsed/timeUsedSeconds and the full st | ?
iter 11 | ratio 0.58 | ?/? | OpenCode should replace Claude's status-line overlay with three buildable surfaces: per-turn active-goal injec | ?
