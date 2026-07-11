---
title: "Router replay and advisor probe"
description: "Replays the target skill's own substring router for in-skill routing and resource discovery (Mode A, deterministic, the CI gate), and runs an opt-in deterministic advisor probe out-of-band for inter-skill selection."
trigger_phrases:
  - "router replay and advisor probe"
  - "router-replay.cjs"
  - "replay skill router"
  - "advisor probe inter-skill"
  - "INTENT_SIGNALS substring matching"
version: 1.17.0.6
---

# Router replay and advisor probe

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Mode A routing is reproduced deterministically. `router-replay.cjs` parses the target skill's own `INTENT_SIGNALS` and `RESOURCE_MAP` and re-runs its substring matching to produce the D1-intra (intent) and D2 (resource discovery) signals. `advisor-probe.cjs` separately shells out to the standalone Python skill-advisor to capture the D1-inter (inter-skill selection) signal; this probe is opt-in (`--advisor-mode=python`) and is also deterministic because the advisor reads a compiled SQLite graph, not an LLM.

---

## 2. HOW IT WORKS

`scripts/skill-benchmark/router-replay.cjs` is a pure function of `(skillRoot, taskText)` with no LLM. `extractDictBody(text, name)` finds `NAME = {` and returns the brace-balanced body. `parseIntentSignals` builds `{ KEY: { weight, keywords } }` from the `INTENT_SIGNALS` block (keywords lowercased); `parseResourceMap` builds `{ KEY: [paths] }` from `RESOURCE_MAP`; `parseDefaultResource` reads `DEFAULT_RESOURCE`. `parseRouter` combines these and sets `parseable` true when either map is non-empty. `scoreIntents` lowercases the task and sums each intent's `weight` for every keyword that is a substring of the task; `selectIntents` keeps every intent within `AMBIGUITY_DELTA = 1` of the top score. `routeSkillResources` returns `{ parseable, intents, resources, missingResources, scores }`, where `resources` is the union of `DEFAULT_RESOURCE` plus `RESOURCE_MAP[intent]` for selected intents, and `missingResources` are routed paths absent on disk. When the router is unparseable it returns `parseable:false` with empty arrays. The module exports `routeSkillResources`, `parseRouter`, `scoreIntents`, and `selectIntents`; `contamination-lint.cjs` and `d5-connectivity.cjs` reuse `parseRouter`.

`scripts/skill-benchmark/advisor-probe.cjs` provides the D1-inter signal and is opt-in. `probeAdvisor({ prompt, advisorPy, timeoutMs })` runs `spawnSync('python3', [skill_advisor.py, prompt], { timeout: 60000, maxBuffer: 8MB })` against `DEFAULT_ADVISOR_PY = .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. On non-zero exit or empty stdout it returns `{ ok: false, recommendations: [], topSkill: null, error }`; on unparseable JSON it returns `ok:false` with an error; otherwise it maps the parsed array to `{ skill, confidence }` records and returns `{ ok: true, recommendations, topSkill }`. `scoreD1Inter({ advisorResult, expectedSkillId, negative })` rank-weights the target's position in the recommendations: rank 1 = 1.0, rank ≤ 3 = 0.75, rank ≤ 5 = 0.5, else 0; a failed/`ok:false` probe yields `score:null`; negative-activation scenarios invert (target absent or rank > 5 scores 1, otherwise 0). The orchestrator calls `probeAdvisor` per scenario only when `--advisor-mode=python`; with the probe off, D1-inter is reported `unscored-mode-a`. (Internal detail: `score-skill-benchmark.cjs` imports `scoreD1Inter` from this module to fold the probe result into the scenario score.)

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Routing | Deterministic Mode A replay of the skill's own `INTENT_SIGNALS` / `RESOURCE_MAP` substring routing; emits D1-intra + D2 signals via `routeSkillResources`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/advisor-probe.cjs` | Discovery probe | Opt-in, read-only `skill_advisor.py` probe (`probeAdvisor`) + rank-weighted `scoreD1Inter` for D1-inter. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts `routeSkillResources` routes a REVIEW prompt on `cli-opencode` to expected resources, `selectIntents` keeps near-tied intents, an unparseable router returns `parseable:false`, `scoreD1Inter` rank-weighting (1.0 / 0.75 / 0 / null) and negative-scenario inversion, and that `probeAdvisor` returns a ranked list deterministically. |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `skill-benchmark/router-replay-and-advisor-probe.md`
Related references:
- [contamination-gate-and-fixtures.md](contamination-gate-and-fixtures.md) — Hint-free fixtures and contamination gate
- [d5-connectivity-gate.md](d5-connectivity-gate.md) — D5 structural connectivity hard gate
