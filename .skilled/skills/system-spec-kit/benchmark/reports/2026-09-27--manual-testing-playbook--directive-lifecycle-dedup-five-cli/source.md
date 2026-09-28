# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · directive-lifecycle-dedup-five-cli

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives. The folder itself holds curated outputs only.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenario | `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` |
| Scoring method | `not-applicable-manual-outcome` |
| Topology digest | `not recorded` |
| Source packet | `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/` |
| Tester reports | `reports/<runtime>-457.md` in the source packet, each tester's last message |
| Adapter cadence output | `runtime/<runtime>-registered-adapter/` in the source packet, one folder per runtime |
| Dispatch timing | `ledger.tsv` in the source packet, one row per run with its start, end and exit code |
| Brief and runner | `briefs/457.task`, `briefs/run-test.sh` and the run notes in `harness-notes.txt` in the source packet |
| Machine record | [`outcomes/`](./outcomes/) |
| Curated result set | [`results.csv`](./results.csv) |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only, and a run whose result changes gets a new folder rather than overwriting this one.

Last updated 2026-09-27.
