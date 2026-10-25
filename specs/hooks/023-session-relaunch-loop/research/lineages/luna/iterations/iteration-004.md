# Iteration 4: Live model source attribution

## Focus

Trace the live-value sources for Claude, Codex, Cursor, Pi, and Hermes, with attention to whether each source identifies the sender session rather than merely a recent global setting.

## Findings

1. **P2 — Cursor live-model attribution is ambiguous under concurrent sessions.** The wrapper reads Cursor's one cli-config.json for every session and accepts the model when that file's modification time is later than this wrapper's launch timestamp. If another Cursor session updates the shared file after both wrappers launch, this session can attribute and replay the other session's model. This is an inference from the shared-file design and timestamp-only ownership check; a two-session interleaving would confirm the observed runtime outcome. **Test coverage:** tests cover a same-session config update and a config older than this wrapper's launch, but no test runs two sessions against the shared config. [SOURCE: .skilled/bin/skilled-loop:655-658; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580-600; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2368-2419]

## Coverage checked

Claude settings are read from the latest main-chain session log entry; Codex settings come from the thread's rollout file; Cursor reads cli-config.json; Pi hands settings in at arm time; Hermes takes model/provider from post_api_request. Existing tests cover normal reads for the first four sources and model/provider replay for Pi/Hermes. The Cursor tests do not cover concurrent writers or session identity in the config file.

## Sources

- .skilled/bin/skilled-loop:655-658
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580-600
- .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2368-2419
- .skilled/hooks/session-relaunch/lib/context-usage.cjs:153-200
- .skilled/hooks/session-relaunch/pi/session-relaunch.ts:401-417
- .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:102-113
- .hermes/plugins/repo-guards/__init__.py:632-668

## Iteration outcome

One source-attribution risk confirmed by the shared file and reader logic; test confirmation requires a two-session interleaving. Continue into OpenCode 2 and Devin setting limits.
