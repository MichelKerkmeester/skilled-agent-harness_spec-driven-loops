---
title: "skill-benchmark assets: Lane C reference data"
description: "Lane C data dir: the reference scoring profile, the remediation taxonomy, and the legacy per-skill fixture pairs."
trigger_phrases:
  - "skill benchmark profile"
  - "remediation taxonomy"
  - "lane C fixtures"
  - "default_profile json"
---

# skill-benchmark assets: Lane C reference data

---

## 1. OVERVIEW

`assets/skill_benchmark/` holds the static reference data for Lane C (skill-benchmark): the scoring profile, the finding-to-fix taxonomy, and the legacy fixture corpus. These are data inputs and documented references, not executable code — the Lane C scorer and orchestrator live under `scripts/skill-benchmark/`.

Current state:

- `default_profile.json` is REFERENCE ONLY. Its `weights` block mirrors the hardcoded `WEIGHTS` in `scripts/skill-benchmark/score-skill-benchmark.cjs`, but there is no `--profile` loader on the Lane C path, so the file is not consumed at runtime (its own `notes` field states this).
- `remediation_taxonomy.json` is a `v1` catalog keyed by finding `class`. It is validated by its own test but not imported by the report code, which does not yet enrich bottlenecks with its `targetFile` / `oneLineFix` / `handoffLane` fields.
- `fixtures/` holds legacy per-skill public/private fixture pairs, loaded only via the explicit `--fixtures-dir` override. The playbook (`manual_testing_playbook/`) is now the default Lane C corpus.

---

## 2. DIRECTORY TREE

```text
skill-benchmark/
+-- default_profile.json        # Reference scoring profile (weights + verdict bands); NOT loaded at runtime
+-- remediation_taxonomy.json   # Finding class -> targetFile/locus/oneLineFix/handoffLane catalog (v1)
`-- fixtures/                    # Legacy per-skill fixture corpus (used only with --fixtures-dir)
    `-- deep-improvement/        # One scenario pair for the deep-improvement skill
        +-- agent-improve-001.public.json   # Domain-language prompt + contract (advisor-blind)
        `-- agent-improve-001.private.json  # Expected labels (skillId/intentKeys/resources) + rubric
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `default_profile.json` | Reference scoring profile. Holds `weights` (`d1inter`, `d1intra`, `d2`, `d3`, `d4`, `d5`), `verdictBands` (PASS / CONDITIONAL / FAIL / BLOCKED-BY-STRUCTURE), `mode`, and `traceMode`. The `notes` field documents that the scorer hardcodes the same weights and that this block is the forward-looking source for a future profile loader. |
| `remediation_taxonomy.json` | Static `v1` catalog. Its `findings` array maps each finding `class` (`router_unparseable`, `dead_resource_path`, `path_escape`, `dead_intent_key`, `orphan_reference`, `funnel_attrition`, `contaminated_fixture`) to a `severity` (P0/P1/P2), `targetFile`, `locus`, `oneLineFix`, and `handoffLane` (`speckit-packet`, `agent-improvement`, or `harness-fix`). |
| `fixtures/<skill-id>/<id>.public.json` | The advisor-blind, domain-language scenario input: `prompt`, `runtime`, `mutationBoundary`, `outputContract`, and `provenance`. Never names router keywords. |
| `fixtures/<skill-id>/<id>.private.json` | The held-out gold for the same scenario: `expected` labels (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of usefulness / harm checks. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | These are JSON data files; they import nothing. `default_profile.json` is read by no script today (no `--profile` loader exists). |
| Consumers | `fixtures/` is read by `scripts/skill-benchmark/run-skill-benchmark.cjs` only on the `--fixtures-dir` (legacy) path. `remediation_taxonomy.json` is read by its own Vitest suite (`model-benchmark/tests/remediation.vitest.ts`), not by the report renderer. |
| Ownership | Lane C reference data lives here. The weights and verdict logic that actually run live in `scripts/skill-benchmark/score-skill-benchmark.cjs`. Bottleneck rendering lives in `scripts/skill-benchmark/build-report.cjs`. |
| Write policy | Reference data — hand-edited only. No script writes back into this directory; benchmark runs emit reports to a separate `--outputs-dir`. |

Main flow:

```text
╭──────────────────────────────────────────────╮
│ assets/skill_benchmark/ (reference data)     │
╰──────────────────────────────────────────────╯
        │                          │
        │ --fixtures-dir (legacy)  │ doc/test reference only
        ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│ run-skill-benchmark.cjs  │   │ default_profile.json mirrors  │
│ loads public/private     │   │ hardcoded WEIGHTS;            │
│ fixture pairs            │   │ remediation_taxonomy.json     │
└────────────┬─────────────┘   │ validated by its own test     │
             │                 └──────────────────────────────┘
             ▼
┌──────────────────────────┐
│ skill-benchmark-report   │
│ .json / .md (outputs-dir)│
└──────────────────────────┘
```

---

## 5. VALIDATION

Run from the repository root.

```bash
node -e "for (const f of ['default_profile.json','remediation_taxonomy.json','fixtures/deep-improvement/agent-improve-001.public.json','fixtures/deep-improvement/agent-improve-001.private.json']) { JSON.parse(require('fs').readFileSync('.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/'+f,'utf8')); console.log('ok',f); }"
npx vitest run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
```

Expected result: each JSON file parses (`ok <file>` printed for all four) and the remediation taxonomy suite passes.

---

## 6. RELATED

- [`scripts README`](../../scripts/model-benchmark/README.md)
- [`scripts tests README`](../../scripts/shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
