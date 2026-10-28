# Baseline: sk-design and system-deep-loop hubs

Recorded on 2026-10-28 from the worktree at `cf31d46665` (main after the sk-doc hub move), before any phase edit.

## 1. Gates

All 38 gates exit 0: seven `parent-skill-check` runs, the compiled-route guard and sync check, `verify-router-sync`, fourteen `package_skill.py --check --strict` runs, the rule-copies canary, router vocabulary reach, the Hermes mirror check, the sk-code setup battery, root metadata, leaf-manifest freshness, the router test files, routing accuracy, recursive strict validation of the parent packet, contract drift, the advisor routing suites, the feature-catalog package validator, the sk-doc script tests and the cite-drift gate.

## 2. Routing accuracy

| Corpus | Top-1 |
|---|---|
| Full corpus | 155 / 195 |
| Holdout | 49 / 66 |
| Ambiguity | 19 / 24 |

## 3. Routing shape

The ledger holds nine entries for these two hubs, all reported as known debt by `parent-skill-check`:

| Key | Lines | Words | Machine blocks | Codes |
|---|---|---|---|---|
| `sk-design` | 88 | 901 | 1 | RS-001, RS-002 |
| `sk-design/sk-design-chart` | 44 | 297 | 1 | RS-001, RS-002 |
| `sk-design/sk-design-diagram` | 81 | 617 | 0 | RS-001 |
| `sk-design/sk-design-fundamentals` | 164 | 902 | 1 | RS-001, RS-002 |
| `sk-design/sk-design-md-generator` | 145 | 1183 | 1 | RS-001, RS-002 |
| `system-deep-loop` | 38 | 974 | 1 | RS-001, RS-002 |
| `system-deep-loop/deep-ai-council` | 168 | 911 | 1 | RS-001, RS-002 |
| `system-deep-loop/deep-research` | 157 | 842 | 1 | RS-001, RS-002 |
| `system-deep-loop/deep-review` | 163 | 723 | 1 | RS-001, RS-002 |

## 4. Hub router code

Both hubs' routing pseudocode already takes the mode from `hub-router.json`, the authority phase 004 settled, and both already name the no-match outcome `UNKNOWN_FALLBACK`. So the router code moves unchanged into a final MACHINE ROUTER section rather than being rewritten.

All seven packets use the same name too: a search for `UNKNOWN_*`, `NO_MATCH*` and `FALLBACK_*` over the nine files at `HEAD` finds only `UNKNOWN_FALLBACK` and `UNKNOWN_FALLBACK_CHECKLIST`.
