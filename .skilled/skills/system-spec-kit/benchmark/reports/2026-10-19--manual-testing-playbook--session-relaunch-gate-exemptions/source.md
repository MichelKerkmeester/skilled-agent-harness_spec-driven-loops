# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · session-relaunch-gate-exemptions

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives. The folder itself holds curated outputs only.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` and `session-relaunch-pi-opencode.md` |
| Scoring method | `not-applicable-manual-outcome` |
| Topology digest | `not recorded` |
| Source packet | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/` |
| Pane captures | `sr-claude10-pane.txt`, `sr-pi10-pane.txt` and `sr-oc10-pane.txt`, all in the source packet, end at the wrapper exit. `sr-claude10-receiver-pane.txt` and `sr-oc10-receiver-pane.txt` were captured before the exit and hold the receivers' answers. |
| Relaunch log | `relaunch-run10.txt`, in the source packet. It holds the three prepare, SIGTERM and relaunch lines and the three declines, from 11:34:56.858Z to 11:42:21.961Z. 891 bytes, SHA-256 `a7c82b89d5e76202d8e06e2ba5346ccf6f83a8de043ab343f0fddc44f76a3e02`. |
| Launch commands | `launch-commands.txt`, in the source packet. It holds the prompt, the shared environment and the three launch lines. 766 bytes, SHA-256 `102c3d8dbee787d1841824a596ec3fa22cc06a11bae43dceb3b79eea578ffc94`. |
| Handoff notes | Gitignored local runtime state, not copied into the packet: `.skilled/skills/.state/session-relaunch/handoffs/20261019T113443Z-6f63a2a7.md` (Claude), `20261019T113449Z-ses_eac0.md` (OpenCode) and `20261019T113650Z-01a153f1.md` (Pi). Each holds `status: done` and an empty `spec_folder`. The README cites their status lines. |
| Driver | `skilled-loop` inside tmux, in a clean environment (`clean-tmux.sh`, with the Claude session variables and `AI_SESSION_CHILD` unset). |
| Machine record | [`outcomes/`](./outcomes/) |
| Curated result set | [`results.csv`](./results.csv) |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than an overwrite.

A field the run did not capture reads as not recorded. The Claude and OpenCode receiver answers come from the two receiver captures taken before the wrapper exit. Claude's model is not recorded, because the launch passed no model flag and the pane shows none.

Codex, Cursor, Devin and Hermes are not part of this run. Their results stay in the earlier folders.

Last updated 2026-10-19.
