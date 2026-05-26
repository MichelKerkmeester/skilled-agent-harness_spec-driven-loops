---
title: "Top-2 Ambiguity Window"
description: "Ambiguity detection that returns an ambiguous brief when the top two candidates are within 0.05 on EITHER score or confidence."
trigger_phrases:
  - "ambiguity window"
  - "top 2 ambiguity"
  - "ambiguous brief"
  - "0.05 ambiguity window"
  - "dual-margin ambiguity"
---

# Top-2 Ambiguity Window

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Avoid silently picking a single winner when two candidates are tied or near-tied. Expose the ambiguity to callers so routing decisions stay honest under the 5-lane fusion.

## 2. CURRENT REALITY

`lib/scorer/ambiguity.ts` evaluates a **dual-margin OR** predicate against the top-1 candidate. A candidate joins the ambiguity cluster when the gap on EITHER axis is within 0.05:

- `AMBIGUITY_MARGIN = 0.05` on aggregate `score` (keeps cluster aligned with the score-based fusion ranking, F-012-C2-04 invariant).
- `AMBIGUITY_CONFIDENCE_MARGIN = 0.05` on `confidence` (catches user-visible near-ties when score gap just exceeds margin, Packet 084, SAD-002 fix).

If either gap is within margin, the response carries an ambiguity signal that the render path surfaces as an ambiguous brief. A candidate is unambiguously ranked only when **both** gaps exceed margin.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Automated test | ambiguity window behavior |
| `Playbook scenarios [SC-003](../../manual_testing_playbook/08--scorer-fusion/003-ambiguity.md) and [NC-004](../../manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/03-ambiguity.md`

Related references:

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [04-attribution.md](./04-attribution.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
