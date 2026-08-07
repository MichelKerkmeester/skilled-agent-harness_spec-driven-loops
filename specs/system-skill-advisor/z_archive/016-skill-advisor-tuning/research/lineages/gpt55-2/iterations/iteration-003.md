# Iteration 3: Cross-Hub Collision Guard

## Focus

Investigate charter angle 3: `parent-hub-vocab-sync.cjs` checks one hub internally only.

## Findings

1. The existing guard builds mode prefixes from one registry and maps vocabulary classes to owner modes within that same hub [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:27].
2. It checks registry aliases against hub-router typed vocabulary, detects orphan aliases, same-hub alias collisions, and same-hub ownership drift [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:347].
3. It also reads graph trigger phrases and packet intent signals, but all ownership is local to the selected `skillRoot` [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:338].
4. The guard's `sourceKeys` already centralizes source collection for registry aliases, hub keywords, trigger phrases, and intent-signal owners [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:214].
5. A cross-hub guard can reuse `normalizePhrase`, `buildRegistryAliases`, `graphTriggerPhrases`, and the intent-signal owner scan, but must add an `owningHub` and `intentClass` dimension.

## Sources Consulted

- `parent-hub-vocab-sync.cjs`
- `sk-code/hub-router.json`
- `deep-loop-workflows/hub-router.json`
- `sk-design/hub-router.json`

## Assessment

- newInfoRatio: 0.66
- Novelty: identified reusable implementation seams and the missing workspace-level owner dimension.
- Confidence: high on gap; medium on final failure policy until sample collision report is run.

## Reflection

- Worked: reading the existing guard avoided inventing a parallel validator.
- Failed: a naive global collision rule would over-report shared infrastructure vocabulary.
- Ruled out: failing on every shared normalized token.

## Recommended Next Focus

Close the projection-surface guard gap beyond `trigger_phrases`.
