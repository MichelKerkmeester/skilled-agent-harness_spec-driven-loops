---
title: "Lane Contribution Attribution"
description: "Attribution metadata that returns per-lane contribution fields plus a prompt-safe why_recommended summary without leaking prompt text."
trigger_phrases:
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
  - "attribution metadata"
  - "why_recommended"
---

# Lane Contribution Attribution

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Make the fusion score auditable by exposing each lane's contribution per recommendation, without leaking prompt text or evidence snippets.

## 2. HOW IT WORKS

`lib/scorer/attribution.ts` builds the `laneBreakdown` array when `includeAttribution: true` is passed to `advisor_recommend`. Each entry carries exactly `lane`, `rawScore`, `weight`, `weightedScore` and `shadowOnly`. The semantic lane reports `shadowOnly: false` because it is a live lane (registry weight 0.05); fusion derives `shadowOnly` from lane liveness. Prompt substrings are never copied into attribution.

The same opt-in response also includes `why_recommended`, a prompt-safe explanation string that summarizes the dominant lane, top contributing lanes and matched feature categories such as `phrase_match`, `token_match` and `semantic_similarity`. It must not include raw prompt phrases, prompt tokens, scorer evidence strings or the original prompt.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/attribution.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Library | semantic-lane attribution source |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Schema | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Automated test | attribution shape and prompt-safe `why_recommended` gating |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-privacy.vitest.ts` | Automated test | no prompt leakage |
| `Playbook scenario [SC-004](../../manual_testing_playbook/08--scorer-fusion/lane-attribution.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/attribution.md`

Related references:

- [01-five-lane-fusion.md](./five-lane-fusion.md).
- [05-ablation.md](./ablation.md).
- [`06--mcp-surface/advisor-recommend.md`](../06--mcp-surface/advisor-recommend.md).
