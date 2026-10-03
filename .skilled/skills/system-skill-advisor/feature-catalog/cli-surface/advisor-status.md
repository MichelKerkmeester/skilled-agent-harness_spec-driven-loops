---
title: "advisor_status Command"
description: "Diagnostic-only native command that reports advisor freshness, generation, trust state, skillCount, lastScanAt, lane weights and opt-in semantic-lane health without rebuilding stale state."
trigger_phrases:
  - "advisor_status"
  - "mcp status tool"
  - "advisor freshness status"
  - "trust state status"
  - "semanticLaneHealth"
version: 0.8.0.15
---

# advisor_status Command

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Give operators and runtimes a single diagnostic read that summarizes whether advisor state is healthy enough to trust for routing.

---

## 2. HOW IT WORKS

`handlers/advisor-status.ts` returns `freshness`, `generation`, `trustState` (with `state` and optional `reason`), `skillCount`, `lastScanAt` and `laneWeights` (the canonical 5-lane configuration). Freshness vocabulary is `live / stale / absent / unavailable`. The call is fail-open: even when the daemon is absent, status returns a well-formed envelope describing the shortfall.

Every successful read also carries `indexStaleness`, the content-hash comparison that `skill_graph_status` reports as `staleness`. Its shape is `{ state, reason, trackedSkills, freshSourceFiles, changedSourceFiles, missingSourceFiles, staleSkillIds }`, where `state` is `fresh`, `stale` or `unavailable` and `staleSkillIds` is capped at 25 ids. The check opens the SQLite `skill_nodes` rows read-only and compares each stored `content_hash` with the indexer's sanitizer-versioned hash recipe applied to the file on disk, so a source edited after the last indexing pass counts as a changed source file. When `state` is `stale`, a `live` freshness is downgraded to `stale`, `trustState` stops being live, and `errors` gains an entry that names the skill count and points at `advisor_rebuild`. When `state` is `unavailable`, freshness keeps the generation verdict; the reasons are `database_absent`, `index_rows_absent` and `index_read_failed`. The read never creates, migrates or writes the database.

`skillCount` counts skill roots, not metadata files: non-dot directories directly under `.skilled/skills` that hold a `graph-metadata.json`. Nested metadata such as test fixtures is not counted, so the number matches `skill_graph_status.totalSkills` on a clean checkout. `maxMetadataFiles` still caps the scan, and a capped scan adds an `advisor_status metadata scan capped at N files` entry to `errors`.

When callers pass `includeSemanticHealth` or `debug`, the status envelope also includes `semanticLaneHealth`. That opt-in diagnostic reports active embedder identity, vector coverage, dimension mismatch state, last vector refresh timestamp, disabled reason and whether the semantic lane is enabled. The semantic-shadow lane records degraded-vector reasons such as database absence, adapter unavailability, dimension mismatch, prompt embedding failure, skill-vector load failure and empty vector coverage.

`includeEmbeddingsHealth` is a second opt-in diagnostic, off by default, that adds `embeddingsHealth` with `checkedAt` and two independent parts. `provider` reports how the embedding provider resolved, as `{ state: resolved, requestedProvider, effectiveProvider, fallbackReason, dimensionChanged, reason }` or `{ state: unavailable, error }`. `modelServer` is a single bounded read-only GET of the local model server's `/api/health`, resolved from `HF_EMBED_SERVER_URL`, else a `tcp://` `SPECKIT_IPC_SOCKET_DIR`, else `<SPECKIT_IPC_SOCKET_DIR or /tmp/system-hf-embed>/hf-embed.sock`. A reachable server reports `{ state: reachable, target, serverState, model, dim, device, loadTimeMs, loadStartedAt, loadProgressAt, lastSuccessfulEmbedAt, inFlight, queueDepth, error }`; an unreachable one reports `{ state: unavailable, target, errorClass, error }` with `errorClass` one of `unreachable`, `timeout`, `bad_response` or `probe_failed`. The probe has a 1500 ms budget, never loads a model and never fails the status call. Plain calls carry no `embeddingsHealth` key, and the probe runs only on `advisor_status`, never on the `advisor_recommend` hot path. The CLI manifest declares the flag, so `node .skilled/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<root>","includeEmbeddingsHealth":true}' --format json` returns it.

`readAdvisorStatus()` is strictly diagnostic. It reports stale, absent or unavailable advisor state and does not repair it. Operators should call `advisor_rebuild` when status reports stale state or when a forced rebuild is needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Handler | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness/trust-state.ts` | Library | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Library | semantic-lane disabled-reason source |
| `.skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts` | Library | bounded read-only probe of provider resolution and the local model server |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:46-51` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Automated test | compact status, semantic health fields and degraded-vector reason coverage |
| `.skilled/skills/system-skill-advisor/runtime/tests/embedders/embeddings-health.vitest.ts` | Automated test | provider resolution and model-server probe coverage |
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
