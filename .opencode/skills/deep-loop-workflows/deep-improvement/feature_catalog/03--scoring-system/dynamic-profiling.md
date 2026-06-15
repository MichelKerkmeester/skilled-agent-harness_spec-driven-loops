---
title: "Dynamic profiling"
description: "Builds a target-specific scoring profile from the agent file being evaluated."
trigger_phrases:
  - "dynamic profiling"
  - "generate-profile.cjs"
  - "build scoring profile"
  - "target-specific profile"
  - "agent profile generation"
---

# Dynamic profiling

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Builds a target-specific scoring profile from the agent file being evaluated.

This feature replaces fixed evaluator profiles with a profile that is generated from the target agent's own frontmatter, sections, rules, and related-resource tables.

---

## 2. HOW IT WORKS

`generate-profile.cjs` reads the agent markdown, parses frontmatter and permission blocks, extracts numbered `##` sections, derives structural probes, ALWAYS and NEVER rule checks, output-verification checklist items, forbidden behaviors, related-resource integration points, and permission-capability mismatches, then emits a generated profile object with benchmark defaults and permission summaries.

The current release ships only this dynamic path. `target_manifest.jsonc` enables dynamic profiling, points to `generate-profile.cjs`, and keeps `targets` empty. The skill docs and onboarding guide both describe static profiles as gone, so every evaluated agent is treated as a derived dynamic target unless a wrapper adds extra runtime classification around it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/generate-profile.cjs` | Profile builder | Parses agent markdown and emits the derived checks used by the scorer. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/target_manifest.jsonc` | Manifest | Declares dynamic profiling as the canonical path and leaves the static target catalog empty. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/agent_improvement/target_onboarding.md` | Operator reference | Requires dynamic-profile generation when new targets are onboarded. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/model_benchmark/evaluator_contract.md` | Contract reference | Defines dynamic mode as the only scoring surface. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/agents/deep-improvement.md` | Consumed target example | Shows the section, rules, capability scan, and related-resource patterns that the generator is designed to parse. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/README.md` | Package reference | Documents that no static profiles ship in the current release. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/dynamic-profiling.md`
Related references:
- [five-dimension-rubric.md](five-dimension-rubric.md) — Five-dimension rubric
- [deterministic-scoring.md](deterministic-scoring.md) — Deterministic scoring
