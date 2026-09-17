# Core: Normalization and Message Assembly

## 1. OVERVIEW

`core/` validates and normalizes runtime-neutral events, then assembles one complete message per generation key within explicit event, byte, attempt and time bounds. Terminal failures return an exact-original assembly.

Core supplies the assemble stage that precedes context, protection and provider routing.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `assembler.ts` | Implements the bounded `MessageAssembler` state machine |
| `assembly-input.ts` | Parses assembler options, generation starts and event ingestion |
| `assembly-output.ts` | Builds completed and exact-original terminal results |
| `assembly-types.ts` | Defines generation keys, bounds, results and reason codes |
| `index.ts` | Exposes normalization and assembly APIs |
| `normalizer.ts` | Implements event normalization and replay-stable sequence digests |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `MessageAssembler`, `serializeGenerationKey`, `normalizeEvent`, `normalizeEventSequence`, `createNormalizedSequenceDigest` and `AssemblyReasonCodes`. It also exports assembly input, result and normalized batch types.

---

## 4. VALIDATION

```bash
npm test -- test/core
```

Expected result: assembly, normalization, context, evidence and performance tests pass.

---

## 5. RELATED

- [Source map](../README.md)
- [Contracts subsystem](../contracts/README.md)
