---
title: "Fan-out write-failure salvage"
description: "Post-subprocess salvage: recovers missing or empty iteration .md files from captured subprocess stdout (opencode --format json text parts or raw fallback), appending a salvaged_from_stdout event or writing a failed-marker placeholder."
---

# Fan-out write-failure salvage

---

## 1. OVERVIEW

After a CLI lineage subprocess exits, some executors (weak CLIs, sandboxed write
restrictions) may not have written their iteration `.md` files. `runSalvageSweep` reads the
lineage state log to discover which iterations completed (`type == 'iteration'` records),
checks each expected `iteration-N.md`, and for missing or empty files: calls
`extractTextFromOpencodeJson` on the saved stdout (concatenates opencode
`{type:"text",part:{text:...}}` JSONL lines; falls back to raw stdout ≥50 chars), writes the
recovered text and appends a `salvaged_from_stdout` JSONL event to the state log. When no
content is recoverable, writes a `fanout_salvage_failed` HTML comment placeholder.

### Why This Matters

Proven mandatory from the packet-122 prototype: weak CLI executors intermittently fail to
write output files. Without salvage, those lineages contribute nothing to the final merge.

---

## 2. CURRENT REALITY

Fully shipped in `fanout-salvage.cjs`. Pure CJS (no TSX bootstrap), exports only —
`runSalvageSweep` and `extractTextFromOpencodeJson` — making it fully testable via
`require()`. `STATE_LOG_BY_LOOP_TYPE` maps `research` → `deep-research-state.jsonl` and
`review` → `deep-review-state.jsonl`.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-salvage.cjs` | `extractTextFromOpencodeJson`, `runSalvageSweep`, `STATE_LOG_BY_LOOP_TYPE` |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-salvage.vitest.ts` | 11 tests: `extractTextFromOpencodeJson` (5: null input, opencode JSON parts, raw fallback, too-short fallback, non-text JSON skipped); `runSalvageSweep` unit (5: no state log, all files present, salvage from opencode stdout, failed marker when no content, mixed present/missing); coverage-graph per-sessionId isolation (1) |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F026
- Catalog source: `feature_catalog/09--fanout/04-fanout-salvage.md`
- Primary source files: `scripts/fanout-salvage.cjs`
