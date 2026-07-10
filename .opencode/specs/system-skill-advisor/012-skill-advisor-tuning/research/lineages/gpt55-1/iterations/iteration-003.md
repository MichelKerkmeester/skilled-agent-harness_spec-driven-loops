# Iteration 3: Angle 3 - Cross-Hub Collision Guard

## Focus

Design a cross-hub report that maps shared normalized phrases to their owning hub and intent class.

## Findings

1. The existing `parent-hub-vocab-sync.cjs` takes one `skillRoot`, so it validates one hub at a time. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:263]
2. The guard's normalization already handles case, edge punctuation, hyphen/space equivalence, and whitespace collapse. Cross-hub reporting should reuse this normalization. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:61]
3. Existing collision detection only combines mode-registry aliases and hub-router typed aliases inside one hub. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:363]
4. Parent hubs with known collision risk are `sk-code`, `sk-design`, and `deep-loop-workflows`, because all own some audit/review vocabulary in metadata. [SOURCE: .opencode/skills/sk-code/graph-metadata.json:127] [SOURCE: .opencode/skills/sk-design/graph-metadata.json:65] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:78]
5. Proposed report fields: `normalized`, `owners`, `surface` (`intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, `hub-router`, `mode-registry`), `intentClass`, `severity`, `allowlistReason`, `samplePrompts`.

## Sources Consulted

- `parent-hub-vocab-sync.cjs`
- `sk-code/graph-metadata.json`
- `sk-design/graph-metadata.json`
- `deep-loop-workflows/graph-metadata.json`

## Assessment

`newInfoRatio: 0.78`

Novelty justification: moved from single-hub drift to cross-hub ownership reporting.

Confidence: high for guard gap; medium for severity thresholds until fixture-backed.

## Reflection

Worked: reusing existing normalization avoids inventing another phrase comparator.

Failed: raw shared terms like `audit` are sometimes valid and need intent-class context.

Ruled out: raw string equality only.

## Recommended Next Focus

Close the projection-surface gap so the report sees everything the advisor scores.
