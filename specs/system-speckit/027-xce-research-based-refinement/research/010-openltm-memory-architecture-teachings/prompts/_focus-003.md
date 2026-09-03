---
title: "YOUR NARROW FOCUS — iteration 003 of 10: Janitor background-maintenance pipeline"
trigger_phrases: []
---

# YOUR NARROW FOCUS — iteration 003 of 10: Janitor background-maintenance pipeline
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/janitor/` — `index.ts` (the ordered task pipeline), `dedup.ts`, `embeddings.ts`, `promote.ts`, `decay.ts`, and `providers/`
- `migrations/012_seed_janitor_settings.sql`
- `packages/openltm-core/src/scheduler/` — if present, how janitor is scheduled
- `docs/` — janitor references
Focus on: the ordered embed→decay→archive→promote→dedup pass, the `context_items → memories` PROMOTION tier, and dedup STAGING (no auto-merge). Contrast with our self-maintaining incremental index — is an explicit periodic janitor pass + a promotion tier + propose-not-merge dedup a better maintenance model than ours?
