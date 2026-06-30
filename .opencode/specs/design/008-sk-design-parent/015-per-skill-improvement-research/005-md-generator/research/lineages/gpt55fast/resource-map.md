# Resource Map - md-generator Improvement Research

## Lineage Outputs

| Path | Purpose |
|---|---|
| `deep-research-config.json` | Session config and write boundary |
| `deep-research-state.jsonl` | Append-only iteration and convergence state |
| `deep-research-strategy.md` | Strategy, key questions, worked/failed, stop conditions |
| `deep-research-findings-registry.json` | Resolved questions, findings, do-not directions |
| `deep-research-dashboard.md` | Operator dashboard and convergence summary |
| `research.md` | Final synthesis |
| `iterations/iteration-001.md` through `iterations/iteration-006.md` | Per-iteration evidence notes |
| `deltas/iter-001.jsonl` through `deltas/iter-006.jsonl` | Per-iteration structured deltas |

## Input Evidence Read

| Source | Role In Research |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md` | Loop contract and output expectations |
| `.opencode/skills/deep-loop-workflows/deep-research/references/guides/quick_reference.md` | State and convergence checklist |
| `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md` | Init, loop, and synthesis lifecycle |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_format.md` | Canonical packet file names |
| `.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md` | Stop and legal-stop gate semantics |
| `.opencode/skills/sk-design/SKILL.md` | Parent design hub and md-generator mode relationship |
| `.opencode/skills/sk-design/mode-registry.json` | Mode aliases and backendKind routing |
| `.opencode/skills/sk-design/graph-metadata.json` | Advisor-facing parent triggers |
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Mode contract and extraction/write/validate flow |
| `.opencode/skills/sk-design/design-md-generator/references/*` | Format, style, workflow, quality, troubleshooting, boundary evidence |
| `.opencode/skills/sk-design/design-md-generator/assets/*` | Prompt/card assets and fidelity guard evidence |
| `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md` | Scenario coverage and release-readiness model |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/*` | Extract/build/validate/CLI and emitted schema evidence |
| `.opencode/skills/sk-design/design-md-generator/backend/tests/README.md` | Claimed unit coverage and test topology |
| `.opencode/specs/design/008-sk-design-parent/009-reference-asset-expansion/research/research.md` | Prior corpus synthesis and md-generator recommendations |
| `.opencode/specs/design/008-sk-design-parent/external/stitch-skill.md` | Forward-authoring contrast source |
| `.opencode/specs/design/008-sk-design-parent/external/impeccable.md` | External design workflow/routing contrast source |
| `.opencode/specs/design/008-sk-design-parent/014-routing-benchmark` | Expected benchmark location; no artifact present in checkout |

## Coverage Notes

- Direct spec docs were absent at the declared `005-md-generator` subfolder.
- The routing benchmark score was operator-supplied because no benchmark artifact existed under the expected path.
- The existing `.executor-state/` directory was left untouched.
