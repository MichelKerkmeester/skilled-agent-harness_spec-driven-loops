---
title: "Conformance Benchmark Lane-Config Template"
description: "Fillable scaffold for one conformance benchmark lane-config.json — a parseable JSON array containing the real deep-alignment authority, artifactClass, optional peer-adapter discriminator, and scope fields only."
trigger_phrases:
  - "conformance benchmark lane config template"
  - "lane-config.json peer adapter scaffold"
  - "deep-alignment conformance lane"
  - "AUTHORITY_ADAPTERS benchmark config"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE conformance-benchmark LANE CONFIG:
  <deep-loop-mode>/assets/conformance_benchmark/<benchmark-id>/lane-config.json

Usage:
  1. Copy ONLY the fenced json array below into the shipped lane-config.json.
     Shipped JSON carries no frontmatter, guidance prose, or comments.
  2. Fill every {{PLACEHOLDER}} without adding benchmark metadata to the lane
     object. The real scoping schema accepts authority, artifactClass, optional
     adapter, and scope only.
  3. Keep scope in one real supported shape: paths/globs use a non-empty values
     array; branchRange uses from/to instead. This scaffold uses paths.
  4. Parse the shipped file as JSON, then validate it through scoping.cjs.
-->

## 1. OVERVIEW

The fenced block is the complete shipped `lane-config.json`. It is a JSON array of
one lane object and matches deep-alignment's real scoping fields exactly.

Peer selection requires both the `adapter` field below and a matching entry in
[`AUTHORITY_ADAPTERS`](../../../../system-deep-loop/deep-alignment/scripts/scoping.cjs)
for the named authority. That registration is engine-owned; this template only
cross-references the prerequisite.

## 2. LANE CONFIG

```json
[
  {
    "authority": "{{AUTHORITY}}",
    "artifactClass": "{{ARTIFACT_CLASS}}",
    "adapter": "{{PEER_ADAPTER}}",
    "scope": {
      "type": "paths",
      "values": [
        "{{REPO_RELATIVE_CORPUS_PATH}}"
      ]
    }
  }
]
```

## 3. VALIDATION

After filling the placeholders and copying the block to `lane-config.json`, run:

```bash
python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "{{SHIPPED_LANE_CONFIG_PATH}}"
node .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs --lane-config "{{SHIPPED_LANE_CONFIG_PATH}}" --json
```

The second command is expected to pass only after `{{PEER_ADAPTER}}` is allowlisted
for `{{AUTHORITY}}`. Do not add a new authority or artifact class to make a peer
adapter selectable.
