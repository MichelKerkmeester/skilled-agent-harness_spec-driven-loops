---
title: "skill-benchmark assets: Lane C reference data"
description: "Lane C data dir: the reference scoring profile, the remediation taxonomy, and the legacy per-skill fixture pairs."
trigger_phrases:
  - "skill benchmark profile"
  - "remediation taxonomy"
  - "lane C fixtures"
  - "default_profile json"
version: 1.17.0.4
---

# skill-benchmark assets: Lane C reference data

---

## 1. OVERVIEW

`assets/skill-benchmark/` holds the static reference data for Lane C (skill-benchmark): the scoring profile, the finding-to-fix taxonomy, and the legacy fixture corpus. These are data inputs and documented references, not executable code — the Lane C scorer and orchestrator live under `scripts/skill-benchmark/`.

Current state:

- `default-profile.json` is the default Lane C scoring profile loaded by `score-skill-benchmark.cjs`.
- `remediation-taxonomy.json` is the `v1` catalog loaded by the report renderer to enrich bottlenecks with `targetFile`, `oneLineFix` and `handoffLane` fields.
- `fixtures/` holds legacy per-skill public/private fixture pairs, loaded only via the explicit `--fixtures-dir` override. The playbook (`manual-testing-playbook/`) is now the default Lane C corpus.

---

## 2. DIRECTORY TREE

```text
skill-benchmark/
+-- default-profile.json        # Reference scoring profile (weights + verdict bands); NOT loaded at runtime
+-- remediation-taxonomy.json   # Finding class -> targetFile/locus/oneLineFix/handoffLane catalog (v1)
`-- fixtures/                    # Legacy per-skill fixture corpus (used only with --fixtures-dir)
    `-- deep-improvement/        # One scenario pair for the deep-improvement skill
        +-- agent-improve-001.public.json   # Domain-language prompt + contract (advisor-blind)
        `-- agent-improve-001.private.json  # Expected labels (skillId/intentKeys/resources) + rubric
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `default-profile.json` | Reference scoring profile. Holds `weights` (`d1inter`, `d1intra`, `d2`, `d3`, `d4`, `d5`), `verdictBands` (PASS / CONDITIONAL / FAIL / BLOCKED-BY-STRUCTURE), `mode`, and `traceMode`. The `notes` field documents that the scorer hardcodes the same weights and that this block is the forward-looking source for a future profile loader. |
| `remediation-taxonomy.json` | Static `v1` catalog. Its `findings` array maps each finding `class` (`router_unparseable`, `dead_resource_path`, `path_escape`, `dead_intent_key`, `orphan_reference`, `funnel_attrition`, `contaminated_fixture`) to a `severity` (P0/P1/P2), `targetFile`, `locus`, `oneLineFix`, and `handoffLane` (`speckit-packet`, `agent-improvement`, or `harness-fix`). |
| `fixtures/<skill-id>/<id>.public.json` | The advisor-blind, domain-language scenario input: `prompt`, `runtime`, `mutationBoundary`, `outputContract`, and `provenance`. Never names router keywords. |
| `fixtures/<skill-id>/<id>.private.json` | The held-out gold for the same scenario: `expected` labels (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of usefulness / harm checks. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The scorer loads `default-profile.json`; the report renderer loads `remediation-taxonomy.json`. |
| Consumers | `fixtures/` is read by `scripts/skill-benchmark/run-skill-benchmark.cjs` only on the `--fixtures-dir` (legacy) path. The taxonomy is also covered by `model-benchmark/tests/remediation.vitest.ts`. |
| Ownership | Lane C reference data lives here. The weights and verdict logic that actually run live in `scripts/skill-benchmark/score-skill-benchmark.cjs`. Bottleneck rendering lives in `scripts/skill-benchmark/build-report.cjs`. |
| Write policy | Reference data — hand-edited only. No script writes back into this directory; benchmark runs emit reports to a separate `--outputs-dir`. |

Main flow:

```text
╭──────────────────────────────────────────────╮
│ assets/skill-benchmark/ (reference data)     │
╰──────────────────────────────────────────────╯
        │                          │
        │ --fixtures-dir (legacy)  │ doc/test reference only
        ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│ run-skill-benchmark.cjs  │   │ default-profile.json mirrors  │
│ loads public/private     │   │ hardcoded WEIGHTS;            │
│ fixture pairs            │   │ remediation-taxonomy.json     │
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
node -e "for (const f of ['default-profile.json','remediation-taxonomy.json','fixtures/deep-improvement/agent-improve-001.public.json','fixtures/deep-improvement/agent-improve-001.private.json']) { JSON.parse(require('fs').readFileSync('.opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/'+f,'utf8')); console.log('ok',f); }"
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts
```

Expected result: each JSON file parses (`ok <file>` printed for all four) and the remediation taxonomy suite passes.

---

## 6. RELATED

- [`scripts README`](../../scripts/model-benchmark/README.md)
- [`scripts tests README`](../../scripts/shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
