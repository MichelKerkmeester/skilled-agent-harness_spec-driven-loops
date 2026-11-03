# Why three rows failed REPO_CHANGED

All five runtimes passed 6/6 turns. Claude Code, Codex and Devin then failed `REPO_CHANGED`. Each change came from another session working at the same time, not from the subject in the scratch project.

| Runtime | Window (UTC) | Changed path | Writer |
|---------|--------------|--------------|--------|
| claude-code | 07:19:45 to 07:23:16 | `.skilled/skills/.state/decision-capture/<hex>.nudge`, size 2 to 1 | The hex decodes to session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`, the previous main session, still running. The subject used its own session id |
| codex | 07:25:57 to 07:30:59 | `.skilled/skills/.state/decision-capture/probe/codex.json` and `probe/pi.json`, written 07:27:33 | The decision-capture session's own probe record: "a temporary trusted PostToolUse hook logging stdin" |
| devin | 07:32:51 to 07:35:45 | `specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/scratch/devin-live-probe-*.jsonl`, written 07:35:17 | The decision-capture session's Devin probe. Its last message is "The fruit is pear.", which is not MTP-007 content |

The run needs a window in which no other session writes to `specs/` or `.skilled/skills/.state/decision-capture/`.
