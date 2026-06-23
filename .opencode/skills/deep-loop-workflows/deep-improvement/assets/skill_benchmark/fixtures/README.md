---
title: "fixtures: legacy Mode A skill-benchmark corpus"
description: "Per-skill public/private fixture pairs for the legacy Mode A (--fixtures-dir) skill-benchmark corpus; superseded by the in-skill manual_testing_playbook but still supported."
trigger_phrases:
  - "skill-benchmark fixtures"
  - "public private fixture split"
  - "Mode A fixtures-dir corpus"
  - "agent-improve-001 fixture"
version: 1.17.0.1
---

# fixtures: legacy Mode A skill-benchmark corpus

---

## 1. OVERVIEW

`fixtures/` holds the legacy Mode A skill-benchmark corpus, organized as per-skill directories (`<skill-id>/`) each containing one or more `<scenario>.public.json` / `<scenario>.private.json` pairs. The skill-benchmark loop consumes this corpus via `--fixtures-dir`. The PUBLIC half of a pair is the only material that crosses the dispatch boundary to the agent under test; the PRIVATE half is scorer-only gold and never reaches the model. This corpus is superseded by the skill's own `manual_testing_playbook` (the default corpus) but remains supported for explicit `--fixtures-dir` runs.

Current state:

- One skill directory exists: `deep-improvement/`, with the single scenario `agent-improve-001`.
- The scenario carries a `scenarioId`, a `tier` (`T2`), and a self-contained `public` block (`prompt`, `runtime`, `mutationBoundary`, `outputContract`) plus a `provenance` block.
- The private half declares `expected` routing (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`) and a `rubric` of `usefulnessChecks` / `harmChecks`.
- `expected.intentKeys` and `expected.resources` are intentionally empty pending a router-extract pass; Mode A treats unknown gold as non-penalizing.
- This is the LEGACY Mode A path. The in-skill `manual_testing_playbook` is the default corpus; `fixtures/` is superseded-but-supported.

---

## 2. DIRECTORY TREE

```text
fixtures/
`-- deep-improvement/                   # One dir per skill under test (<skill-id>/)
    +-- agent-improve-001.public.json   # Dispatch-boundary half: prompt + contract (crosses to the agent)
    `-- agent-improve-001.private.json  # Scorer-only gold: expected routing + rubric (never dispatched)
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `deep-improvement/agent-improve-001.public.json` | The only half that crosses the dispatch boundary. Holds `scenarioId`, `tier`, a `public` block (`prompt`, `runtime`, `mutationBoundary`, `outputContract`), and `provenance` (`promptAuthor`, `goldAuthor`, `blindToRouterKeywords`). |
| `deep-improvement/agent-improve-001.private.json` | Scorer-only gold, withheld from the agent. Holds `scenarioId`, an `expected` routing block (`skillId`, `advisorLane`, `intentKeys`, `resources`, `negativeActivation`), a `rubric` (`usefulnessChecks`, `harmChecks`), and a `notes` field recording why `intentKeys`/`resources` stay empty. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Dispatch boundary | Only the `*.public.json` half is sent to the agent under test. The matching `*.private.json` half is scorer-only gold and MUST NOT cross to the model. |
| Pairing | Each scenario is a `<scenario>.public.json` / `<scenario>.private.json` pair sharing one `scenarioId`, grouped under a `<skill-id>/` directory. |
| Consumers | Read by the skill-benchmark loop only when invoked with `--fixtures-dir` (Mode A). The default corpus is the in-skill `manual_testing_playbook`. |
| Status | Legacy, superseded-but-supported. Prefer the playbook corpus; `--fixtures-dir` continues to work for these fixtures. |
| Write policy | Static gold inputs. Edits are authored deliberately; the benchmark loop reads but does not mutate them. |

---

## 5. RELATED

- [`tests README`](../../../scripts/shared/tests/README.md)
- [`model-benchmark README`](../../../scripts/model-benchmark/README.md)
- [`deep-improvement SKILL.md`](../../../SKILL.md)
