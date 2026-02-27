# Wave 1 — S1-A3: Signal Vocabulary Expansion — DONE

## Files Modified
- MODIFIED: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- CREATED:  `.opencode/skill/system-spec-kit/mcp_server/tests/t012-signal-vocab.vitest.ts`
- CREATED:  `.opencode/skill/system-spec-kit/mcp_server/scratch/wave-1-S1-A3-DONE.md`

## Test Results
- New tests (t012-signal-vocab.vitest.ts): 27/27 PASS
- Existing trigger-matcher tests (trigger-matcher.vitest.ts): 19/19 PASS
- TypeScript type check (tsc --noEmit): PASS (no errors)

## What Was Implemented

### Types Added (trigger-matcher.ts §1)
- `SignalCategory` — union type: `'correction' | 'preference' | 'neutral'`
- `SignalDetection` interface — `{ category, keywords, boost }`
- `TriggerMatchStats.signals?` — optional field on stats object

### Constants Added (§6)
- `CORRECTION_KEYWORDS` — 7 keywords: "actually", "wait", "i was wrong", "correction", "not quite", "let me rephrase", "that's not right"
- `PREFERENCE_KEYWORDS` — 7 keywords: "prefer", "like", "want", "always use", "never use", "i want", "please use"
- `SIGNAL_BOOSTS` — `{ correction: 0.2, preference: 0.1 }`

### Functions Added (§6)
- `detectSignals(prompt)` — scans normalized prompt for correction/preference keywords, returns `SignalDetection[]`
- `applySignalBoosts(matches, signals)` — additive boost to `importanceWeight`, capped at 1.0

### Integration (§7 matchTriggerPhrasesWithStats)
- Signal detection called AFTER trigger matching (matching logic unchanged)
- Gated behind `process.env.SPECKIT_SIGNAL_VOCAB` — disabled by default
- `signals` field added to stats only when flag is enabled
- Boosts applied to returned TriggerMatch[] importanceWeight

### Exports Added (§8)
- `detectSignals`, `applySignalBoosts`, `CORRECTION_KEYWORDS`, `PREFERENCE_KEYWORDS`, `SIGNAL_BOOSTS`

## Decisions Made
1. Used `matchPhraseWithBoundary()` for keyword detection in `detectSignals` — reuses existing word-boundary logic for consistent matching behavior (e.g., "like" won't match "unlike").
2. Boost sum calculated once from all signals before applying — simpler than per-signal iteration over matches.
3. `signals` field omitted from stats entirely (not even `undefined`) when flag is off — uses spread conditional `...(signals !== undefined ? { signals } : {})` for clean backward compat.
4. Exported `CORRECTION_KEYWORDS`, `PREFERENCE_KEYWORDS`, `SIGNAL_BOOSTS` as const arrays/object so tests can verify the spec without hardcoding strings.
5. Section numbering updated: old §6 (MAIN MATCHING) became §7, new §6 is SIGNAL VOCABULARY; exports moved to §8.
