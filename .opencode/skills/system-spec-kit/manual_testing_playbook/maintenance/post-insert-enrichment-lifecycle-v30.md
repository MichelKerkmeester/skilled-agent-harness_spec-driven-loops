---
title: "EX-038 -- Post-insert enrichment lifecycle (schema v30)"
description: "This scenario validates the schema v30 post-insert enrichment lifecycle for `EX-038`. It focuses on the post_insert_enrichment_status lifecycle after memory_save, plus repair-on-replay and scan-lease backfill of incomplete markers."
version: 3.6.0.2
---

# EX-038 -- Post-insert enrichment lifecycle (schema v30)

## 1. OVERVIEW

This scenario validates the post-insert enrichment lifecycle introduced by schema migration v30 for `EX-038`. After a `memory_save`, post-insert enrichment runs asynchronously; the row's `post_insert_enrichment_status` tracks whether that enrichment is `complete`, still `pending`, `partial`, `failed`, or intentionally `deferred`. The column defaults to `'complete'` so pre-v30 rows are correctly classified with no backfill.

When enrichment does not finish in-line (process restart, transient failure), the markers are repaired on replay and backfilled during a leased `memory_index_scan`, so the system converges incomplete enrichment without operator intervention. The user-observable value is that saved memories reliably reach a fully enriched state even across restarts.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the `post_insert_enrichment_status` lifecycle plus repair-on-replay and scan-lease backfill.
- Real user request: `I save a lot of context. If enrichment doesn't finish before a restart, does the system fix it on its own?`
- Prompt: `Validate the schema v30 post-insert enrichment lifecycle: after memory_save, confirm post_insert_enrichment_status transitions toward complete; then confirm an incomplete (pending/partial/failed) marker is repaired on replay and backfilled during a leased memory_index_scan. Return a concise pass/fail verdict with cited field names.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `post_insert_enrichment_status` reaches `complete` for a healthy save; an incomplete marker (`pending`/`partial`/`failed`) is selected and re-run by `repairEnrichmentOnReplay`; `repairIncompleteMarkers` runs during a leased scan and reports a repaired count; `complete`/`deferred` markers are left untouched.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the status lifecycle converges and incomplete markers are repaired on replay and via the scan backfill.

---

## 3. TEST EXECUTION

### Prompt

```
As a maintenance validation operator, validate the post-insert enrichment status lifecycle against memory_save followed by a status read. Verify a healthy save's post_insert_enrichment_status converges to complete and records post_insert_enrichment_completed_at. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_save with representative content in a sandbox spec folder.
2. Read the row's `post_insert_enrichment_status`, `post_insert_enrichment_state`, `post_insert_enrichment_completed_at`, and `post_insert_enrichment_version` after enrichment runs.

### Expected

A healthy save reaches `post_insert_enrichment_status='complete'` with a populated `post_insert_enrichment_completed_at`; the version column is set via `recordEnrichmentResult`. Pre-v30 / unenriched-by-default rows carry the column default `'complete'`.

### Evidence

The saved row's enrichment columns after enrichment completes.

### Pass / Fail

- **Pass**: the status converges to `complete` with a completion timestamp
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `recordEnrichmentResult` and `markEnrichmentPending` in `mcp_server/handlers/save/enrichment-state.ts`, and migration v30 in `mcp_server/lib/search/vector-index-schema.ts` if the columns are missing.

---

### Prompt

```
As a maintenance validation operator, validate repair-on-replay against a row whose post_insert_enrichment_status is pending, partial, or failed. Verify repairEnrichmentOnReplay re-runs enrichment and converges the marker, while a complete or deferred marker is left untouched. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create or simulate a sandbox row with `post_insert_enrichment_status` in (`pending`, `partial`, `failed`).
2. Trigger the replay repair path and confirm the marker re-runs and converges.
3. Confirm a `complete` or `deferred` marker is NOT re-run (idempotent skip).

### Expected

`needsEnrichmentRepair` returns true only for `pending`/`partial`/`failed`; `repairEnrichmentOnReplay` re-marks the row pending, re-runs enrichment, and records the result. A `complete` or `deferred` marker is returned unchanged with `repaired:false`.

### Evidence

Before/after marker status for an incomplete row and a no-op for a complete/deferred row.

### Pass / Fail

- **Pass**: incomplete markers re-run and converge; complete/deferred markers are skipped
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `needsEnrichmentRepair` and `repairEnrichmentOnReplay` in `mcp_server/handlers/save/enrichment-state.ts` if complete rows get needlessly re-run or incomplete rows are skipped.

---

### Prompt

```
As a maintenance validation operator, validate the scan-lease enrichment backfill against memory_index_scan with incomplete enrichment markers present. Verify repairIncompleteMarkers selects pending/partial/failed rows up to the limit and reports a repaired count after the scan acquires its lease. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. With sandbox rows whose enrichment markers are incomplete, run memory_index_scan(force:false).
2. Confirm the scan acquires its lease, then runs `repairIncompleteMarkers`.
3. Capture the backfill result (repaired count, failed count).

### Expected

The leased scan runs `repairIncompleteMarkers`, which selects rows where `post_insert_enrichment_status IN ('pending','partial','failed')` ordered by id up to the limit, repairs each via replay, and reports a repaired count; rows that fail are counted separately.

### Evidence

Scan transcript showing the backfill repaired/failed counts after lease acquisition.

### Pass / Fail

- **Pass**: the leased scan backfills incomplete markers and reports a repaired count
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `repairIncompleteMarkers` in `mcp_server/handlers/save/enrichment-state.ts` and its call site in `mcp_server/handlers/memory-index.ts` (after `acquireIndexScanLease`) if the backfill never runs or selects the wrong rows.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Enrichment lifecycle: `mcp_server/handlers/save/enrichment-state.ts` (`markEnrichmentPending`, `recordEnrichmentResult`, `needsEnrichmentRepair`, `repairEnrichmentOnReplay`, `repairIncompleteMarkers`)
- Schema v30: `mcp_server/lib/search/vector-index-schema.ts` (migration v30: `post_insert_enrichment_status`, `post_insert_enrichment_state`, `post_insert_enrichment_completed_at`, `post_insert_enrichment_version`, partial index `idx_post_insert_enrichment_incomplete`)
- Scan backfill call: `mcp_server/handlers/memory-index.ts` (`repairIncompleteMarkers` after lease acquisition)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-038
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `maintenance/post-insert-enrichment-lifecycle-v30.md`
- Source anchors read: `mcp_server/lib/search/vector-index-schema.ts` (`SCHEMA_VERSION = 30` L438; migration v30 columns ~L1394-1407; partial index `idx_post_insert_enrichment_incomplete` ~L145-147); `mcp_server/handlers/save/enrichment-state.ts` (`markEnrichmentPending` ~L154, `recordEnrichmentResult` ~L169, `needsEnrichmentRepair` ~L192, `repairEnrichmentOnReplay` ~L200, `repairIncompleteMarkers` ~L230); `mcp_server/handlers/memory-index.ts` (`repairIncompleteMarkers` import L29, call ~L516)
- Destructive: No — sandbox spec folder for save rows.
- Runtime policy: Real execution only; no mocked enrichment.
