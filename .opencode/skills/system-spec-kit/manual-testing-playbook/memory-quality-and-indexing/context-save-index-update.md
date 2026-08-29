---
title: "M-003 -- Context Save + Index Update"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`."
audited_post_018: true
version: 3.6.0.22
id: memory-quality-and-indexing-context-save-index-update
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-003 -- Context Save + Index Update

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.
- Prompt: `Validate Context Save + Index Update against generate-context.js and memory_index_scan.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: context appears in retrieval post-index, cleanup verify counts match, no scan-originated regressions fire, and the tier-invariant spot-check downgrades as documented; FAIL: any scan-originated `E_LINEAGE` / `candidate_changed` false-positive recurs, cleanup verify counts deviate (especially `z_future_rows != 0` or `external_rows != 0`), or a non-constitutional path persists as `constitutional`

---

## 3. TEST EXECUTION

### Commands
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js --verify`

### Expected

- Saved context artifacts are discoverable via `memory_search` / `memory_context` after the scan
- `memory_index_scan` produces no `E_LINEAGE` errors on cross-file sibling docs (packet 001 — cross-file `UPDATE` / `REINFORCE` now downgrade to `CREATE` when `SimilarMemory.canonical_file_path` differs from the target)
- `memory_index_scan` produces no `candidate_changed` false-positives on scan-originated saves (packet 001 — scan saves carry `fromScan: true` and skip only the transactional complement recheck)
- Cleanup verify reports `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` (packet 002 invariant)
- No row appears in the indexed set for paths under `z-future/` or `/external/` (packet 002 permanent exclusions)
- The constitutional `README.md` stays excluded from the spec-doc record index (ADR-005)
- A poisoned checkpoint or existing row for `.opencode/skills/system-spec-kit/constitutional/README.md` is downgraded to `important` and emits `tier_downgrade_non_constitutional_path`
- `memory_save` on an excluded path returns `E_MEMORY_INDEX_SCOPE_EXCLUDED` with `canonicalPath`

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass/Fail

- **Blocked**: required input file `/tmp/save-context-data-031-manual-playbook-execution-sweep.json` was missing, `memory_index_scan` returned `E040`, and `cleanup-index-scope-violations.js --verify` could not run without `--db` or `MEMORY_DB_PATH`; the Expected signals could not be evaluated.

### Failure Triage

- Discoverability fails → rerun save, inspect path/permissions, confirm `memory_index_scan` ran against the correct `specFolder`
- Scan-originated regression fires → confirm the dist build is current (`scripts/dist/memory/cleanup-index-scope-violations.js` exists and matches source) and that MCP clients were restarted after the last build; check `mcp-server/handlers/save/pe-orchestration.ts` + `handlers/memory-save.ts` for the `canonical_file_path` and `fromScan` wiring
- Invariant counts deviate → run `cleanup-index-scope-violations.js --apply` and re-verify; if non-zero counts persist, inspect `mcp-server/lib/utils/index-scope.ts` for drift from the shared policy

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [mutation/memory-indexing-memorysave.md](../../feature-catalog/mutation/memory-indexing-memorysave.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/context-save-index-update.md`
