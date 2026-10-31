---
title: "Resource Map — Jev routing clarify default research (deepseek lineage)"
trigger_phrases: []
---
# Resource Map — Jev routing clarify default research (deepseek lineage)

| Resource | Role |
|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Scorer under study: census, label gate, option digest, Jev arm, Keep Rule, verdict and report |
| `.skilled/bin/compiled-route.cjs` | Front door under study: normalizes the compiled decision and drops the clarify alternatives |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Engine entry the census and this lineage's replay use (`loadHubEngine`, `evaluate`) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Serving-authority gate and the seven-hub default-on cohort |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/*.cjs` | The six clarify branches classified by option type and reachability |
| `.skilled/skills/cli-classifier/mode-registry.json` | Single-mode evidence making that hub's clarify unreachable |
| `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/{spec.md,goal.md}` | Feature record: Keep Rule, call shape, scope drops, label gate, risks |
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/fixtures/020-rows.jsonl` | Committed unlabeled fixture rows for 020 |
| `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md` | The recorded 020 result row and its corpus/labeler claims |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/decision-record.md` | ADR-001: the delegated arbiter label method |
| `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md` | Labeling card: rubric, row shape, the UNDEFINED decision rule |
| `specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/implementation-summary.md` | The same judgment measured on the advisor: kill (W=11 L=27) |
| `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/goal.md` | Whole-cluster order form: kill (W=13 L=25) |
| `~/.skilled/.labels/020-rows.jsonl` | Recorded labels: 54 rows, 34 `none_of_these` |
| `~/.skilled/.labels/drafts/020-arbiter.jsonl` | Arbiter draft matching the labels 54/54 |
| `~/.skilled/.labels/runs/047-020-jev-20261002/{calls.jsonl,report.json}` | The 163 recorded calls and the verdict block |
| `~/.skilled/.labels/runs/047-020-jev.stdout.txt` | Census/gate/payload/digest/verdict lines |
| `.../lineages/deepseek/verification/` | This lineage's replay outputs: four-way census on the current tree |

**Coverage note:** the resource map lists only resources actually read or produced in iterations 1–5.
The four hub routers outside the five fixture hubs were read only for their clarify branches; the
compiled-corpus registries behind the census were not enumerated individually.
