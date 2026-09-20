# cli-jev benchmark baseline

This is the hub-level baseline package. The hub's own benchmarkable surface is routing: does a
request land on `cli-usage`, does the transport stay non-mutating, and does the per-hub gate hold.

| Baseline | Where the evidence lives |
|----------|--------------------------|
| Hub routing and transport contract | `manual-testing-playbook/hub-routing/transport-selection.md` |
| The transport's 22-scenario judgment contract | `cli-usage/benchmark/reports/` |
| Compiled-routing activation | Added by the compiled-fleet onboarding phase; the hub's serving state then lives in `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-jev/manifest.json` |

Recorded runs are dated report directories under `benchmark/reports/`, never inline in this file.
