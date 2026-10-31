# Reproduction of the recorded router-reach misroutes

## Advisor state before the run

`node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json` answered `freshness: live`, `generation: 19`, `trustState.state: live` immediately before the first fleet run.

## Hub inventory

Directories under `.skilled/skills/` carrying both `ROUTER.md` and `mode-registry.json`: cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop (7 hubs, the same 7 the probe checked).

Probe command, unchanged: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` (no `--hub`, no `--limit`). The probe fails closed: any answer that is degraded, not live, or lacks a generation becomes a probe-error (script lines 148-150).

## Full-fleet counts

| Run | Advisor generation | wrong-hub | outranked | no-reach | allowed | probe-error | Result |
|-----|--------------------|-----------|-----------|----------|---------|-------------|--------|
| Source audit (degraded local scorer) | unknown | 14 | 18 | 221 | 8 | 0 | FAILED |
| Live run before any fix (`live-fleet.log`) | 19 | 0 | 0 | 0 | 10 | 0 | PASSED, exit 0 |
| Post-change rerun (`verification.log`) | 29 | 0 | 0 | 0 | 10 | 0 | PASSED, exit 0 |

## Classification of the 32 recorded rows

Each recorded phrase was sent alone to `advisor_recommend` against the live daemon. Columns: declaring hub, audit kind, phrase, live top three, trust state/generation, verdict.

| Hub | Audit kind | Phrase | Live top three | Trust | Verdict |
|-----|-----------|--------|----------------|-------|---------|
| cli-classifier | wrong-hub | `jev mcp server` | cli-classifier=0.9457, mcp-code-mode=0.8766, sk-code=0.8249 | live/20 | no-longer-reproduced |
| cli-external-orchestration | wrong-hub | `full plugin and memory stack` | cli-external-orchestration=0.9338, system-spec-kit=0.82 | live/20 | no-longer-reproduced |
| cli-external-orchestration | wrong-hub | `codex diff review` | cli-external-orchestration=0.95, sk-code=0.9366, system-deep-loop=0.82 | live/20 | no-longer-reproduced |
| cli-external-orchestration | wrong-hub | `devin cloud session` | cli-external-orchestration=0.9288 | live/20 | no-longer-reproduced |
| mcp-tooling | wrong-hub | `extract design.md` | mcp-tooling=0.95, sk-design=0.8552 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion mcp` | mcp-tooling=0.9109, sk-code=0.82 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion api` | mcp-tooling=0.9092 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion token` | mcp-tooling=0.908 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion database` | mcp-tooling=0.9043 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion data source` | mcp-tooling=0.95, sk-code=0.82 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `query notion` | mcp-tooling=0.9133 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion property` | mcp-tooling=0.9043 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion relation` | mcp-tooling=0.9043 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion rollup` | mcp-tooling=0.9043 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion formula` | mcp-tooling=0.9043 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `notion markdown` | mcp-tooling=0.908, sk-doc=0.82 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `figma mcp` | mcp-tooling=0.8821, sk-code=0.82, mcp-code-mode=0.82 | live/20 | no-longer-reproduced |
| mcp-tooling | outranked | `mobile design patterns` | mcp-tooling=0.9214, sk-code=0.82, sk-design=0.82 | live/20 | no-longer-reproduced |
| sk-code | wrong-hub | `field validation` | sk-code=0.8271, system-spec-kit=0.82, sk-doc=0.82 | live/20 | no-longer-reproduced |
| sk-design | wrong-hub | `document layout` | sk-design=0.8745, sk-doc=0.82 | live/20 | no-longer-reproduced |
| sk-design | wrong-hub | `visual audit` | sk-design=0.8347, sk-code=0.82, sk-doc=0.82 | live/20 | no-longer-reproduced |
| sk-doc | wrong-hub | `validation rules` | sk-doc=0.8389, system-spec-kit=0.82 | live/20 | no-longer-reproduced |
| sk-doc | wrong-hub | `quality bar` | sk-doc=0.8281, sk-code=0.82 | live/20 | no-longer-reproduced |
| sk-doc | wrong-hub | `create command` | sk-doc=0.8827, system-spec-kit=0.82, mcp-tooling=0.82 | live/20 | no-longer-reproduced |
| sk-doc | wrong-hub | `model benchmark` | sk-doc=0.8323, deep-model-benchmark=0.8461, system-deep-loop=0.82 | live/20 | no-longer-reproduced |
| sk-doc | wrong-hub | `frontmatter validation` | sk-doc=0.8389, system-spec-kit=0.82 | live/20 | no-longer-reproduced |
| sk-doc | outranked | `document audit` | sk-doc=0.8857, sk-code=0.82, sk-design=0.82 | live/20 | no-longer-reproduced |
| sk-doc | outranked | `audit the docs` | sk-doc=0.9014, sk-code=0.9006, sk-design=0.82 | live/20 | no-longer-reproduced |
| system-deep-loop | wrong-hub | `release readiness` | system-deep-loop=0.939, sk-code=0.82 | live/20 | no-longer-reproduced |
| system-deep-loop | outranked | `severity findings` | system-deep-loop=0.8732, sk-code=0.82 | live/20 | no-longer-reproduced |
| system-deep-loop | outranked | `review convergence` | system-deep-loop=0.9234, sk-code=0.9214, sk-design=0.82 | live/20 | no-longer-reproduced |
| system-deep-loop | outranked | `audit the diff` | system-deep-loop=0.8629, sk-code=0.82, sk-doc=0.82 | live/20 | no-longer-reproduced |

Reproduced: 0. No longer reproduced: 32. Probe-error: 0.

## Margins worth watching

Two phrases reach their hub by less than 0.002: `audit the docs` (sk-doc 0.9014 over sk-code 0.9006) and `review convergence` (system-deep-loop 0.9234 over sk-code 0.9214). Neither fails today; a future scorer or vocabulary change could flip them, and the fleet probe would catch it.
