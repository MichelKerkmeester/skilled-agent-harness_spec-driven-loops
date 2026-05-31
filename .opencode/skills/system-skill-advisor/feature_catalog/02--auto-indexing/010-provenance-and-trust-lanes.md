---
title: "Provenance Fingerprints and Trust Lanes"
description: "Per-entry provenance fingerprints plus trust-lane tagging (author / frontmatter / body / examples / local_docs / derived_local) that let scorers weight evidence by source."
trigger_phrases:
  - "provenance fingerprint"
  - "trust lanes derived"
  - "derived provenance"
  - "lane source tagging"
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

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/provenance.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/derived/trust-lanes.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | lane assignment and fingerprint stability |
| `Playbook scenario [AI-003](../../manual_testing_playbook/06--auto-indexing/029-provenance-and-trust-lanes.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/010-provenance-and-trust-lanes.md`

Related references:

- [01-derived-extraction.md](./008-derived-extraction.md).
- [`04--scorer-fusion/019-five-lane-fusion.md`](../04--scorer-fusion/019-five-lane-fusion.md).
- [`04--scorer-fusion/022-attribution.md`](../04--scorer-fusion/022-attribution.md).
