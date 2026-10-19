# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · session-relaunch-final-code

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
| Pane captures | `sr-claude9-pane.txt`, `sr-oc9-pane.txt`, `sr-codex9-pane.txt` and `sr-pi9-pane.txt`, all in the source packet |
| Relaunch log | `relaunch-run9.log`, in the source packet. It holds the four round-9 loops with their killer signals and relaunches, and the four declines. Each later log repeats the lines of the earlier ones. |
| Launch commands | `launch-commands-final.txt`, in the source packet. Its round-9 block at `2026-10-19T09:42:58.695Z` holds the four launches and is the source of the settings in [`README.md`](./README.md) §2. 6803 bytes, SHA-256 `aaebeaa03d6ff00dc1328acaed52c5c54ad0e2b538d4578524cd39a0643c209e`. `launch-commands.txt`, also in the packet, holds nine launches up to `2026-10-19T08:51:53.396Z` and no round-9 block. |
| Wrapper exits | `wrapper-exits.txt`, in the source packet. It pairs each `WRAPPER_EXIT` line with its decline line. The round-9 blocks are `2026-10-19T09:51:36.372Z`, where claude9, oc9 and codex9 each print `WRAPPER_EXIT=0` beside the declines for loops 78793, 78816 and 78834, and `2026-10-19T09:51:44.621Z`, where Pi loop 78800 prints `WRAPPER_EXIT=0` beside its decline. All four declines carry `reason=no-file`. 1314 bytes, SHA-256 `2955f877f543130383b23752dcab6e6e62e5631789517d4db389f398acb79367`. |
| Ledger rows | `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md`, entry D208 |
| Driver | `skilled-loop` inside tmux, in a clean environment. Per-runtime settings are in [`README.md`](./README.md) §2. |
| Machine record | [`outcomes/`](./outcomes/) |
| Curated result set | [`results.csv`](./results.csv) |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only, and a run whose result changes gets a new folder rather than overwriting this one. The earlier runs made while the gaps were being fixed stay in [`../2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`](../2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md).

A field the run did not capture reads as not recorded. Round 9's panes print no wrapper exit code, so the exit lines come from `wrapper-exits.txt`, and the launch settings come from the round-9 block in `launch-commands-final.txt`, with the models from each pane's status line.

Last updated 2026-10-19.
