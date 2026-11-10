# Live probe facts

| Runtime | Version | Start | First screen | Ready marker | Busy marker | Question screen | Answer keys | Compact | Exit and resume | Settle | Slash input |
|---------|---------|-------|--------------|--------------|-------------|-----------------|-------------|---------|-----------------|--------|-------------|
| claude-code | 2.1.316 | `claude --session-id <uuid> --dangerously-skip-permissions` in a fresh folder | Workspace trust dialog (`fixtures/question-screens/claude-code-trust.txt`): `❯ No, exit` is preselected, so Down then Enter accepts | Empty `❯` prompt line between two rules, footer `bypass permissions on` | The spinner line (for example `✻ Baked for 5s`) changes while working; the settled screen shows `done <time>` | Header `←  ☐ <label>  ✔ Submit  →` (multi) or ` ☐ <label>` (single), question line, numbered options, `Type something` row, footer `Enter to select · ↑/↓ to navigate` | Single: arrows to the option, Enter. Multi: arrows plus Enter toggles `[ ]` to `[✔]`, arrows to `Submit`, Enter, then a review screen `1. Submit answers`, Enter. Other: arrows to `Type something.`, type the text, Enter | `/compact` then Enter runs it; the completion menu highlights the exact command | `/exit` then Enter ends the process (pane dead 1). `claude --resume <uuid> --dangerously-skip-permissions` restores the session with no trust dialog | Six captures 500 ms apart on the settled screen gave one hash | Enter on a typed slash command runs the highlighted exact completion |
| opencode | not probed | | | | | | | | | | |
| codex | not probed | | | | | | | | | | |
| pi | not probed | | | | | | | | | | |
| devin | not probed | | | | | | | | | | |

The OpenCode, Codex, Pi and Devin rows were not filled in here. Those probes ran later on 2026-11-02, and their facts are recorded in `references/conversation-scenarios.md` section 9 and in the plan's feasibility table; their screens are in `fixtures/question-screens/`.

Probe folder `/tmp/conv-probe-claude.*`, socket `probe-claude`, killed after the probe; `tmux -L probe-claude list-sessions` printed `no server running`. 2026-11-02 05:44 to 05:47 local.
