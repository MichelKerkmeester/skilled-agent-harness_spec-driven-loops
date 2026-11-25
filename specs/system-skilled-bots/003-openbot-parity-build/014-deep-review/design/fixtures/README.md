---
title: "Design fixtures: the review packet's golden records"
description: "One golden file per record phase 014 writes, on one data set, with the command that reads each and the count it must print."
trigger_phrases:
  - "deep review fixtures"
  - "review packet goldens"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
---

# Golden records for the review packet

Each file is the literal sample of one section of `../records.md`, on one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, operator `ada`, reviewed commit `79519553b62`. The packet-level goldens for the runtime's own records are in `../../../contracts/fixtures/` and this folder copies none of them. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/README.md:13]

A golden here is a **shape** sample, not a run's output. The run writes its own files under `review/`, and a test compares the run's file against the golden key by key and type by type.

| Golden | Section | What reads it | The count it must print |
|--------|---------|---------------|-------------------------|
| `deep-review-config.json` | records 2 | T006, and AC-002 | `expansive correctness,security,traceability,maintainability` |
| `preflight.json` | records 11 | T003, and the fallback claim in AC-003 | `5 4 true` for `binaries.length`, `presentCount` and `fallbackUsed` |
| `orchestration-summary.json` | records 5 | T007, and AC-003 | `5 0` |
| `deep-review-findings-registry.json` | records 4 | T010, T011, AC-004, AC-005 | `0` for `P0`, `0` for `P1`, `4` for `openFindings.length` |
| `seeded-findings.json` | records 7 | T017, and the verdict rule's step 3 | `3 2 2` for `sources.length`, `seededCount` and `rows.length` |
| `scenario-rerun.json` | records 8 | T018, and AC-012 | `9 0` for `rerunCount` and `failedCount` |
| `fix-ledger.md` | records 6 | T009, T012, AC-004, AC-005 | `4` rows, all reading `pass` or `deferred` |
| `review-report.md` | records 9 | T008, and AC-008 | `9` sections and `1` verdict line |

`preflight.json` is the one golden that shows a degraded host rather than a clean one: `devin` is absent, so `presentCount` reads `4` and `fallbackUsed` reads `true`. That is the case D3 makes normal, and a golden that showed five present binaries would leave the fallback unproven. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:26]

Check every file parses and every count holds:

```bash
cd specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/design/fixtures
for f in *.json; do node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$f" || echo "BAD $f"; done
node -e "const c=require('./deep-review-config.json'); console.log(c.antiConvergence.depthMode, c.reviewDimensions.join(','), c.convergenceThreshold, c.stuckThreshold)"
node -e "const p=require('./preflight.json'); console.log(p.binaries.length, p.presentCount, p.fallbackUsed)"
node -e "const s=require('./orchestration-summary.json'); console.log(s.total_cli_lineages, s.orphaned_lineages.length)"
node -e "const r=require('./deep-review-findings-registry.json'); console.log(r.findingsBySeverity.P0, r.findingsBySeverity.P1, r.openFindings.length)"
node -e "const j=require('./seeded-findings.json'); console.log(j.sources.length, j.seededCount, j.rows.length)"
node -e "const j=require('./scenario-rerun.json'); console.log(j.rerunCount, j.failedCount)"
rg -c '^\| F[0-9]' fix-ledger.md
rg -c '^\| F[0-9].*\| (pass|deferred) \|$' fix-ledger.md
rg -c '^## (Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix)$' review-report.md
rg -c '^Review verdict: ' review-report.md
```

The expected output is `expansive correctness,security,traceability,maintainability 0.1 2`, then `5 4 true`, then `5 0`, then `0 0 4`, then `3 2 2`, then `9 0`, then `4`, then `4`, then `9`, then `1`.

Two values are illustrative and a test compares their type only: the `provider_cost_usd` figures and the `Reviewed commit` sha. Every other value is a shape the run produces.
