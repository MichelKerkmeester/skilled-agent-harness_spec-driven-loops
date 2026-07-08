---
title: "Hint-free fixtures and contamination gate"
description: "Per-skill public/private scenario pairs keep the gold answer scorer-only; a contamination linter rejects public prompts that leak the target skill's own vocabulary before routing runs."
trigger_phrases:
  - "hint-free fixtures and contamination gate"
  - "contamination-lint.cjs"
  - "lint fixture for leaks"
  - "banned vocabulary check"
  - "public private fixture pair"
version: 1.17.0.7
---

# Hint-free fixtures and contamination gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Each scenario is a public/private fixture pair. The public file carries only a realistic, hint-free prompt; the private file carries the gold answer the scorer compares against. Before routing, `contamination-lint.cjs` checks that the public prompt does not leak the target skill's identity, and treats any leak as a fixture failure rather than a skill failure.

---

## 2. HOW IT WORKS

Fixtures live under `assets/skill_benchmark/fixtures/<skill-id>/` as `<id>.public.json` and `<id>.private.json`. The orchestrator's `loadFixtures` reads every `*.public.json`, derives the base id, and reads the matching `<id>.private.json` (defaulting to `{ expected: {} }` when the private file is missing). A malformed (unparseable) fixture is caught and recorded as a `loadError` row rather than crashing the run. The loaded shape is `{ scenarioId, tier, public, expected, rubric }`. The shipped pair is `fixtures/deep-improvement/agent-improve-001.{public,private}.json`: the public side holds `public.prompt` plus `runtime`/`mutationBoundary`/`outputContract` and `provenance`; the private side holds `expected: { skillId, advisorLane, intentKeys, resources, negativeActivation }` and a `rubric`. The shipped fixture intentionally leaves `expected.intentKeys` and `expected.resources` empty (`[]`) until the deep-improvement router map is confirmed; Mode A treats empty gold as non-penalizing.

`scripts/skill-benchmark/contamination-lint.cjs` builds a banned vocabulary from the TARGET SKILL's own identity via `buildBannedVocab({ skillRoot, skillId, privateExpected })`: the skill id and root basename; frontmatter triggers (parsed by `frontmatterTriggers`, which reads `trigger_phrases:` list items and `name:` from the SKILL.md frontmatter block); router keywords and intent keys from `parseRouter(skillMd).intentSignals` (every `INTENT_SIGNALS` key plus its lowercased keywords, parsed via `router-replay.cjs`'s `parseRouter`); and resource path tokens from `RESOURCE_MAP` (each path's basename, extension-stripped basename, and any segment longer than 3 chars via `pathTokens`). When a private gold object is supplied it also bans the private `skillId`, `intentKeys`, `resources`, and `assets` tokens. The `add` helper only admits strings longer than 2 chars, lowercased. `lintFixture({ publicText, bannedVocab })` lowercases the prompt and flags any banned term that is a substring of it, returning `{ passed, hardLeaks }` where `passed` is true only when `hardLeaks` is empty. In the orchestrator a failed lint produces a `firstFailingStage: 'contaminated-fixture'` row with `modeAScore: 0` and does not abort the rest of the run.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/contamination-lint.cjs` | Fixture gate | `buildBannedVocab` (name, frontmatter triggers, `INTENT_SIGNALS`, `RESOURCE_MAP`, private gold) + `lintFixture` substring leak check. |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-improvement/agent-improve-001.public.json` | Fixture | Hint-free public prompt (`public.prompt`) the benchmark sees. |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-improvement/agent-improve-001.private.json` | Fixture | Scorer-only gold: `expected.{skillId,advisorLane,intentKeys,resources,negativeActivation}` + `rubric`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Utility (imported) | Supplies `parseRouter` used to derive banned router keyword / intent-key / resource tokens. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts a prompt leaking the skill name is flagged (`passed:false`, `hardLeaks` non-empty), a domain-language prompt passes, and the malformed-fixture row degrades to `unparseable-fixture` with a `loadError`. |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--skill-benchmark/contamination-gate-and-fixtures.md`
Related references:
- [mode-wiring.md](mode-wiring.md) — Mode wiring and orchestration
- [router-replay-and-advisor-probe.md](router-replay-and-advisor-probe.md) — Router replay and advisor probe
