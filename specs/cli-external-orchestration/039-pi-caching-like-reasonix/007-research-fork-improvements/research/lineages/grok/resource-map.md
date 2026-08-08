# Resource Map — Grok Fan-out Lineage

Generated at synthesis from iteration evidence. Lineage-local only.

## READMEs
- `.pi/extensions/deep-pi/README.md` — DeepPi install, `/deeppi` metrics, live benchmark opt-in
- `.pi/extensions/pi-cache-optimizer/README.md` — upstream optimizer docs (still present in vendored copy)

## Documents
- `specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/spec.md`
- `specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md`
- `specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/spec.md`
- `specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md`

## Extensions (researched)
- `.pi/extensions/pi-cache-optimizer/index.ts` — guards, stats persistence, usage accounting
- `.pi/extensions/deep-pi/extensions/deeppi.ts` — command, drift warning, hook wiring
- `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` — `DEEPPI_MODEL_IDS` / `isDeepPiModel`
- `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` — usage recording, report formatting

## Tests
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts`
- `.pi/extensions/deep-pi/tests/*.ts` (eligibility, telemetry, stability, stormbreaker, hashlines, integration, package, review2)

## Config
- `.pi/settings.json` — local package pointers to both vendored forks
- `.pi/extensions/*/package.json` — verify scripts and upstream repository URLs

## Meta
- Lineage artifacts under `research/lineages/grok/`
- resource-map.md was absent at init; this file is synthesis output
