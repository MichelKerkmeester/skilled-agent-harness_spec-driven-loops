---
title: "Provenance Fingerprints and Trust Lanes"
description: "Per-entry provenance fingerprints, trust-lane tagging and guarded skill-graph edge source_kind stamping that let operators trace evidence by source."
trigger_phrases:
  - "provenance fingerprint"
  - "trust lanes derived"
  - "derived provenance"
  - "lane source tagging"
  - "source_kind"
version: 0.8.0.14
---

# Provenance Fingerprints and Trust Lanes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Make derived entries inspectable and weighted by source. Every derived token carries a provenance fingerprint (so operators can tell when an entry truly changed) and a trust lane (so the scorer knows whether evidence came from author-declared signals, body prose, examples or local docs).

## 2. HOW IT WORKS

`lib/derived/provenance.ts` computes a stable fingerprint for each derived entry. `lib/derived/trust-lanes.ts` classifies the entry into one of six lanes:

| Lane | Source |
| --- | --- |
| `author` | Explicit `intent_signals` and author-declared routing metadata |
| `frontmatter` | Other SKILL.md frontmatter fields |
| `body` | Extracted from SKILL.md prose body |
| `examples` | Fenced code blocks and example sections |
| `local_docs` | `references/**` and `assets/**` bundled docs |
| `derived_local` | Generated n-grams not directly quoted from source |

The scorer consumes the lane tag in `lib/scorer/lanes/derived.ts` and weights evidence accordingly.

Skill-graph edge propagation also records write provenance. The guarded apply path derives `source_kind` server-side from write intent: automated `skill_graph_propagate_enhances` writes stamp `source_kind: "automated"`, while trusted-maintainer writes can stamp `source_kind: "trusted"`. Automated writes refuse to overwrite existing manual or trusted provenance, and legacy edges without `source_kind` remain valid for idempotent reads.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/provenance.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/trust-lanes.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts` | Library | derives `source_kind` and guards manual provenance |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts` | Library | passes write intent into guarded edge apply |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts` | Library | defines edge source and write-intent types |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts` | Handler | forces automated server intent for propagation writes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | lane assignment and fingerprint stability |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts` | Automated test | `source_kind`, manual protection, trusted update and legacy tolerance |
| `Playbook scenario [AI-003](../../manual_testing_playbook/auto-indexing/provenance-and-trust-lanes.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `auto-indexing/provenance-and-trust-lanes.md`

Related references:

- [01-derived-extraction.md](./derived-extraction.md).
- [`scorer-fusion/five-lane-fusion.md`](../scorer-fusion/five-lane-fusion.md).
- [`scorer-fusion/attribution.md`](../scorer-fusion/attribution.md).
