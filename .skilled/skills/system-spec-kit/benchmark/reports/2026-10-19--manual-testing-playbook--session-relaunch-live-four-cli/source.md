# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · session-relaunch-live-four-cli

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives. The folder itself holds curated outputs only.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`, `session-relaunch-pi-opencode.md` and `session-relaunch-command-runtimes.md` |
| Scoring method | `not-applicable-manual-outcome` |
| Topology digest | `not recorded` |
| Source packet | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/` |
| Pane captures | `codex-run1-pane.txt`, `codex-run3-pane.txt`, `oc-run1-pane.txt`, `pi-run1-pane.txt`, `sr-claude-run2-pane.txt`, `sr-claude-run3-pane.txt`, `sr-oc-run2-pane.txt`, `sr-oc-run3-pane.txt`, `sr-pi-run2-pane.txt`, `sr-pi-run3-pane.txt`, `sr-pi-run4-pane.txt` and `sr-pi-run5-pane.txt`, all in the source packet |
| Relaunch logs | `relaunch-run1.log`, `relaunch-run2.log`, `relaunch-run3.log` and `relaunch-run4-run5.log`, all in the source packet. Each later log repeats the lines of the earlier ones. |
| Launch commands | `launch-commands.txt`, in the source packet. It holds every live-run launch command with its UTC timestamp. |
| Ledger rows | `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md`, entries D188, D194, D195, D196 and D200 |
| Driver | `skilled-loop` inside tmux, in a clean environment. Per-runtime settings are in [`README.md`](./README.md) §2. |
| Machine record | [`outcomes/`](./outcomes/) |
| Curated result set | [`results.csv`](./results.csv) |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only, and a run whose result changes gets a new folder rather than overwriting this one.

A field the packet did not capture reads as not recorded, and the Claude run 1 pane capture is the one that still does. The threshold, window, hop cap and model of every launch come from `launch-commands.txt`, which records each launch with its UTC timestamp.

Last updated 2026-10-19.
