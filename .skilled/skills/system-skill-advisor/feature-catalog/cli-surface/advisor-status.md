---
title: "advisor_status Command"
description: "Diagnostic-only native command that reports advisor freshness, generation, trust state, skillCount, lastScanAt and lane weights without rebuilding stale state."
trigger_phrases:
  - "advisor_status"
  - "mcp status tool"
  - "advisor freshness status"
  - "trust state status"
version: 0.8.6.0
---

# advisor_status Command

## 1. OVERVIEW

Give operators and runtimes a single diagnostic read that summarizes whether advisor state is healthy enough to trust for routing.

---

## 2. HOW IT WORKS

`handlers/advisor-status.ts` returns `freshness`, `generation`, `trustState` (with `state` and optional `reason`), `skillCount`, `lastScanAt` and `laneWeights` (the canonical weights for the four lanes). Freshness vocabulary is `live / stale / absent / unavailable`. The status handler is fail-open: even when the daemon is absent, it returns a well-formed envelope describing the shortfall. The CLI's `--warm-only` mode is attach-or-refuse. If no daemon is already running, the CLI writes an error payload to stderr and exits with code `75`.

Every successful read also carries `indexStaleness`, the content-hash comparison that `skill_graph_status` reports as `staleness`. Its shape is `{ state, reason, trackedSkills, freshSourceFiles, changedSourceFiles, missingSourceFiles, staleSkillIds }`, where `state` is `fresh`, `stale` or `unavailable` and `staleSkillIds` is capped at 25 ids. The check opens the SQLite `skill_nodes` rows read-only and compares each stored `content_hash` with the indexer's sanitizer-versioned hash recipe applied to the file on disk, so a source edited after the last indexing pass counts as a changed source file. When `state` is `stale`, a `live` freshness is downgraded to `stale`, `trustState` stops being live, and `errors` gains an entry that names the skill count and points at `advisor_rebuild`. When `state` is `unavailable`, freshness keeps the generation verdict; the reasons are `database_absent`, `index_rows_absent` and `index_read_failed`. The read never creates, migrates or writes the database.

`skillCount` counts skill roots, not metadata files: non-dot directories directly under `.skilled/skills` that hold a `graph-metadata.json`. Nested metadata such as test fixtures is not counted, so the number matches `skill_graph_status.totalSkills` on a clean checkout. `maxMetadataFiles` still caps the scan, and a capped scan adds an `advisor_status metadata scan capped at N files` entry to `errors`.

`hookHealth` appears once a prompt hook has written at least one health record for the workspace, and the key is absent before that. It summarizes the newest 30 records as `{ invocations, rollingP95Ms, rollingFailOpenRate, rollingCacheHitRate, rollingDegradedRate, lastRecordAt }`. `rollingP95Ms` counts cache-hit runs only. `rollingDegradedRate` is the share of answers that came from the CLI's local scorer. `lastRecordAt` is the time of the newest record, so a runtime that stopped writing shows its age.

The status call refuses the two retired health flags, and its error names the flag it refused.

`readAdvisorStatus()` is strictly diagnostic. It reports stale, absent or unavailable advisor state and does not repair it. Operators should call `advisor_rebuild` when status reports stale state or when a forced rebuild is needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Handler | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | CLI | Warm-only error and retryable exit handling |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness/trust-state.ts` | Library | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:46-51` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Automated test | compact status, the four lane weights and the refused retired health flags |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts` | Automated test | retryable daemon exit code |
| `Playbook scenario [NC-002](../../manual-testing-playbook/native-cli-tools/native-status-transitions.md).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Command surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-surface/advisor-status.md`

Related references:

- [01-advisor-recommend.md](../../feature-catalog/cli-surface/advisor-recommend.md).
- [05-advisor-rebuild.md](../../feature-catalog/cli-surface/advisor-rebuild.md).
- [`daemon-and-freshness/trust-state.md`](../../feature-catalog/daemon-and-freshness/trust-state.md).
- [`scorer-fusion/weights-config.md`](../../feature-catalog/scorer-fusion/weights-config.md).
