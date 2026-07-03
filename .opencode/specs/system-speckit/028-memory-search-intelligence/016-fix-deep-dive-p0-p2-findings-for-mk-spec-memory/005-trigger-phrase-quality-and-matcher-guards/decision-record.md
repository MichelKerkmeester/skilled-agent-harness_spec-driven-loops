---
title: "Decision Record: Trigger Phrase Quality and Matcher Guards"
description: "Records implementation decisions for constitutional visibility, migration safety, and trigger matcher guard behavior."
trigger_phrases:
  - "constitutional trigger visibility decision"
  - "trigger matcher guard decision"
  - "dry run trigger migration decision"
importance_tier: "normal"
contextType: "planning"
---
# Decision Record: Trigger Phrase Quality and Matcher Guards

## Decisions

| Decision | Rationale | Status |
|----------|-----------|--------|
| Keep constitutional rows out of `memory_match_triggers` trigger cache. | Constitutional memories already have a dedicated priming/read lane and should not compete with packet docs in prompt-trigger matching. Keeping them excluded also prevents duplicated or sandbox constitutional rows from polluting Gate-1 trigger recall. | Implemented via the shared active-row predicate with `includeCold: false` in the trigger cache loader. |
| Make live-data repairs dry-run by default and gated for apply. | Trigger regeneration and constitutional cleanup can destroy recall if run against the wrong database. Apply mode requires an explicit checkpoint/baseline and supports batch/resume where rows are rewritten. | Implemented in migration scripts under `mcp_server/scripts/migrations/`. |
| Preserve user-authored trigger phrases ahead of auto-extracted phrases. | The quality loop is an enrichment source, not the owner of user-authored recall hints. Authored phrases stay first, then extracted phrases fill remaining slots after case-insensitive dedupe. | Implemented in the memory save path. |

## Verification Notes

Local dry-runs were executed against the available checkpoint `snapshot-main.sqlite` only. The vector shard was rejected because it has no `memory_index` table; the migration scripts now treat non-index DBs as zero-row dry-runs rather than mutating or crashing.
