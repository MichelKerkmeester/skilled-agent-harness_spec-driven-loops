# Iteration 6: Decompose Reasonix cache-first invariants

## Focus

Identify what Reasonix actually does client-side to improve an automatic provider cache.

## Findings

- The v1 architecture partitions context into an immutable session prefix, an append-only conversation log, and volatile scratch that is not sent upstream. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- It pins a hash of the initial prefix, preserves append order, and distills transient state before adding it to history. Those are serialization and lifecycle invariants, not a separate local inference cache. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md]
- Deterministic ordering of parallel tool results matters because completion-order writes could change a prior prefix even when the logical tool set is identical.
- Current Reasonix describes cache-aware context maintenance—stable environment summary, pruning, and compaction—rather than the `lumo.md` claim that arbitrary repository/docs snippets and “intermediate reasoning” are separately cached objects. [SOURCE: https://github.com/esengine/deepseek-reasonix]

## Sources Consulted

- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`
- `https://github.com/esengine/deepseek-reasonix`

## Assessment

- newInfoRatio: 0.66
- Novelty justification: Converts “cache-first” into four implementable invariants and rejects an object-cache interpretation.
- Confidence: High.

## Reflection

- Worked: Architecture source exposes stable-prefix mechanics directly.
- Failed/ruled out: Treating Reasonix as a cache of semantically indexed snippets or hidden reasoning is unsupported.

## Recommended Next Focus

Establish Pi’s design philosophy and core/extension boundary.
