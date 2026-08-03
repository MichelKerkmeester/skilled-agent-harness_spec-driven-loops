# Promotion Rule

Flip a command from `fallback` to `fix` only after all promotion evidence is green:

- 3 consecutive green CI comparator runs on both `gpt-fast-med` and `gpt-fast-high`.
- Comparator status is green.
- Fallback hash is unchanged.
- Zero unexpected Claude-baseline divergence.

The JSON entry must carry the evidence mechanism alongside the mode:

```json
{
  "mode": "fix",
  "evidence": {
    "captureManifest": "<captured manifest>",
    "fallbackHash": "<fallback hash>",
    "comparatorRuns": ["<run records>"],
    "baselineDivergence": "<divergence result>"
  }
}
```

Run `node .opencode/skills/system-deep-loop/shared/rollout/validate-rollout.cjs` before promotion. It fails closed when any required evidence field is absent or empty; a command may not claim `fix` without a passing validator run.
