---
title: "agent-improvement: Lane A data and config"
description: "Lane A charter, run config, strategy template, and full-skill target classification for deep-improvement agent runs."
trigger_phrases:
  - "improvement charter"
  - "improvement_config.json"
  - "target manifest"
  - "agent-improvement config"
---

# agent-improvement: Lane A data and config

---

## 1. OVERVIEW

`agent-improvement/` holds the Lane A (agent-improvement) data and config: the fixed policy charter, the run-config template plus its field reference, the strategy template, and the full-skill surface classification manifest. These are source-of-truth templates and config that a run copies into its packet-local runtime area; nothing here executes.

Current state:

- `improvement_config.json` is the run-config template (status `initialized`, empty `target`/`specFolder`); a run clones and fills it.
- `improvement_charter.md` is the immutable, non-negotiable policy layer; the mutator must never rewrite it.
- `improvement_strategy.md` splits operator-owned fields (filled before the run) from machine-owned sections the reducer updates after each score.
- `target_manifest.jsonc` classifies the full skill surface; its `targets` array is intentionally empty because all targets run via dynamic mode.
- `target-profiles/` is the runtime-generated profile catalog; it ships empty (only `.gitkeep`) under dynamic-only profiling.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `improvement_charter.md` | Fixed policy charter: mission, dynamic-target rule, proposal-only policy, keep/discard rule, journal-emission protocol, stop-reason and legal-stop gate bundles (contract/behavior/integration/evidence/improvement), and out-of-scope list. Immutable for the run. |
| `improvement_config.json` | Run-config template: iteration caps, `proposalOnly`/`promotionEnabled` flags, `dimensionWeights` (structural 0.20, ruleCoherence 0.25, integration 0.25, outputQuality 0.15, systemFitness 0.15), stop rules, journal/coverage/trajectory/trade-off settings, packet-local `paths`, and a `fileProtection` map. Ships as a template; a run fills `target`, `specFolder`, `lineage.sessionId`. |
| `improvement_config_reference.md` | Field-level reference for `improvement_config.json`: documents top-level, scoring, and stop-rule fields, plus the command-line model-benchmark levers (`--mode`, `--scorer`, `--grader`) and their env switches. |
| `improvement_strategy.md` | Mutable strategy template: operator-owned target/goal/hypothesis/focus fields and a `MACHINE-OWNED` block (dimensional scores, mutation coverage, convergence eligibility, trade-off detection) the reducer populates. |
| `target_manifest.jsonc` | Full-skill surface classification: `dynamicProfileEnabled` plus the `dynamicProfileScript` and `integrationScanScript` paths, an empty `targets` array (dynamic mode is the only evaluation path), and `fixed`/`forbidden` lists naming live spec-kit handover surfaces deep-improvement must never mutate. |
| `target-profiles/` | Runtime-generated target-profile catalog. Intentionally empty (`.gitkeep` only); referenced by `improvement_config.json` (`paths.targetProfiles`) and `target_manifest.jsonc` (`profileCatalog`) for path consistency. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Ownership | Lane A data and config templates live here. The scripts that read them (`generate-profile.cjs`, `scan-integration.cjs`) live in `../../scripts/agent-improvement/`. |
| Consumers | `target_manifest.jsonc` names `dynamicProfileScript` and `integrationScanScript` under `scripts/agent-improvement/`. `improvement_config.json` paths point at the packet-local `improvement/` runtime root, with `targetProfiles` and `fixtureCatalog` resolving back under this skill's `assets/`. |
| Write policy | These files are templates and source-of-truth config: edited deliberately by maintainers, not by a run. A run copies them into its packet-local `improvement/` area and edits the copies. `improvement_charter.md` and `target_manifest.jsonc` are immutable per the config `fileProtection` map. |
| Profile catalog | `target-profiles/` is runtime-generated and ships empty under dynamic-only profiling; the `fixed`/`forbidden` lists in `target_manifest.jsonc` are protections, not static profiles. |

---

## 4. VALIDATION

Run from the repository root.

```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/skills/deep-improvement/assets/agent-improvement/improvement_config.json','utf8'))"
```

Expected result: the command exits 0, confirming `improvement_config.json` is valid JSON. (`target_manifest.jsonc` carries comments and is parsed by the JSONC-aware loaders in `scripts/agent-improvement/`.)

---

## 5. RELATED

- [`scripts/agent-improvement README`](../../scripts/README.md)
- [`model-benchmark README`](../../scripts/model-benchmark/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
