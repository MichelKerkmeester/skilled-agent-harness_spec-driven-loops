# Lead steering for this review lineage

These rulings come from the lead and bind every iteration.

## Focus

The review question is: does the automatic in-session handover fire every time it should on the five automatic runtimes (Claude Code, Pi, OpenCode, Codex and Hermes)? That covers a session started through the shell shim `.skilled/bin/skilled-loop-shell.sh` or through `.skilled/bin/skilled-loop`, including a repository whose `.skilled` is a symlink to this checkout. Cursor and Devin are command-only by design; review only their `/speckit:handoff` path.

Trace each runtime's whole chain and look for any condition that silently stops a hop:

1. Usage signal read (transcript tail, `message_end`, `info.tokens`, Codex `token_count`, Hermes `post_api_request`) and window resolution.
2. Threshold check and nudge delivery to the model (once, plus the +5% re-nudge), including suppression rules (outside loop, pending or fresh armed record, hop cap, existing open note).
3. The note, continuity save and `prepare` the model runs, with its exit codes and refusals (running shell children, session id, runtime mismatch).
4. The arm event (Claude Stop, Pi `agent_end`, OpenCode `session.idle`, Codex Stop, Hermes `on_session_end`) and the killer spawn, re-arm and lock logic.
5. Killer idle detection, SIGTERM, grace, timeout path.
6. `skilled-loop` relaunch decision, cwd, model and flag carry, seed text, and the receiving session's claim.
7. Shim decisions: wrapper discovery walking up from `$PWD` through a symlinked `.skilled`, interactive versus pass-through argument classification, TTY checks, Hermes plugin env.
8. Repo-root and state-path resolution when `.skilled` is a symlink (does any adapter, CLI or killer resolve paths through the real path and miss the linking repository's state or config?).
9. Hook registrations actually present in `.claude/settings.json`, `.codex/hooks.json`, the Pi extension symlink, the OpenCode plugin and the Hermes `repo-guards` bridge, and whether a linking repository gets them.

Also check that `.skilled/commands/speckit/handoff.md` conforms to the sk-doc `sk-create-command` contract (`.skilled/skills/sk-doc/sk-create-command/SKILL.md` and its assets).

## Rules

- Each finding needs a severity (P0 blocks a hop on an automatic runtime, P1 makes a hop unreliable or wrong, P2 is drift or polish), a `file:line`, a concrete repro or the exact condition, and a concrete fix.
- Do not re-report findings already recorded in `specs/hooks/023-session-relaunch-loop/review-archive/*/review-report.md`, `specs/hooks/023-session-relaunch-loop/research/research.md` or `specs/hooks/023-session-relaunch-loop/010-post-fix-research/research/research.md` unless the code still shows the defect today; say so when you do.
- Spread the ten iterations across the chain steps above so every runtime and every step gets read at least once; later iterations adversarially re-check earlier findings.
