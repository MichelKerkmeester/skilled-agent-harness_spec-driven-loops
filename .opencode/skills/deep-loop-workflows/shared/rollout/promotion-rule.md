# Promotion Rule

Flip a command from `fallback` to `fix` only after all promotion evidence is green:

- 3 consecutive green CI comparator runs on both `gpt-fast-med` and `gpt-fast-high`.
- Comparator status is green.
- Fallback hash is unchanged.
- Zero unexpected Claude-baseline divergence.
