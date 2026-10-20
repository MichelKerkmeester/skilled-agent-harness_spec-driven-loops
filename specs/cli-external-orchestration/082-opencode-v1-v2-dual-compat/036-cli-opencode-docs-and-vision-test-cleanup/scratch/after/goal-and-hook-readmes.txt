$ node co-039-opencode-goal-live.mjs
{"verdict":"PASS","stateFiles":["0f07009cdce3e313987f4f29157e38b5405de99665d809f07351a4bbb7b19373.json","44eab740df466ae527f20275ce19ce2f763d2c89d912ab91031edb1bbf0d539e.json","5bf99dccc14aa3c9e80d97837958d7bf97160e16e75e7b65cef3677d31eefe08.json"],"migrated":true,"tokensUsed":160}
exit=0

$ CODEX_HOOKS_WATCHDOG_DISABLED=1 <codex-watchdog README kill-switch snippet>
ok
exit=0

$ hook README load checks
codex-hooks-watchdog ok object
system-completion-sentinel ok object
system-speckit-completion ok object
system-dist-freshness-guard ok object
session-cleanup ok object
