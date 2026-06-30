# Iteration 11 — gpt55

**Angle:** CLI flag to MCP property-name mapping audit across memory commands — verify every bracketed flag in argument-hints maps to a real tool schema property (e.g. `--older-than`/`--folder` vs `olderThanDays`/`specFolder`).

**Findings:** 3

- **[P1] drift** `.opencode/commands/memory/manage.md:29` — `--older-than` does not map to `olderThanDays`
  - evidence: `bulk-delete <tier> [--older-than <days>] [--folder <spec>]`; daemon CLI mapping only exact/normalized/camel-cases flags (`spec-memory-cli.ts:288-296`), so `--older-than` becomes `olderThan`, while schema expects `olderThanDays` (`tool-input-schemas.ts:338-345`).
  - fix: Change the hint to `--older-than-days <days>` or add an explicit `older-than` -> `olderThanDays` alias in `resolvePropertyName()`.
- **[P1] drift** `.opencode/commands/memory/manage.md:29` — `--folder` does not map to `specFolder`
  - evidence: `bulk-delete <tier> [--older-than <days>] [--folder <spec>]`; daemon CLI mapping falls back to the raw flag when there is no normalized property match (`spec-memory-cli.ts:288-296`), so `--folder` stays `folder`, while schema expects `specFolder` (`tool-input-schemas.ts:338-341`).
  - fix: Change the hint to `--spec-folder <spec>` or add an explicit `folder` -> `specFolder` alias in `resolvePropertyName()`.
- **[P2] drift** `.opencode/commands/memory/search.md:3` — Colon intent flag is not a daemon CLI property flag
  - evidence: `<query> [--intent:<type>]`; daemon CLI extracts flags by stripping `--` and splitting only on `=` (`spec-memory-cli.ts:408`), while schemas expose `intent` as the property (`tool-input-schemas.ts:178-182`, `tool-input-schemas.ts:196-223`).
  - fix: Use `--intent <type>` or `--intent=<type>` in the hint, or teach the parser to treat `--intent:<value>` as property `intent`.
