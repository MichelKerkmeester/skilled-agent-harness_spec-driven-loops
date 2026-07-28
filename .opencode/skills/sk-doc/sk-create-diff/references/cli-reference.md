---
title: create-diff CLI Reference
description: Every create-diff command, flag, JSON summary shape, exit code, and the report validator for the create_diff.py engine.
trigger_phrases:
  - "create-diff cli reference"
  - "create_diff.py commands"
  - "create-diff exit codes"
  - "create-diff flags"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# CLI reference

Engine: `scripts/create_diff.py` (run with `python3`). All paths are relative to where you run it; the engine never writes to a source document.

## `capabilities`

List supported formats, fidelity tiers, and which PDF extractor is available.

```bash
python3 create_diff.py capabilities [--json]
```

## `snapshot`

Capture a baseline of a file into the local store (before an edit).

```bash
python3 create_diff.py snapshot <file> [--state-dir DIR]
```

## `compare`

Compare a file against its latest baseline and render a report.

```bash
python3 create_diff.py compare <file> \
  [--report OUT] [--view unified|side-by-side] [--state-dir DIR] [--json]
```

Default report path: `<file-stem>.diff.html` in the current directory.

## `compare-pair`

Compare two explicit files with no stored state.

```bash
python3 create_diff.py compare-pair \
  --before A --after B \
  [--report OUT] [--view unified|side-by-side] \
  [--label-before L] [--label-after L] [--json]
```

## `status`

List stored baselines (all, or for one file).

```bash
python3 create_diff.py status [<file>] [--state-dir DIR] [--json]
```

## `cleanup`

Remove stored baselines.

```bash
python3 create_diff.py cleanup \
  [--file F] [--older-than DAYS] [--state-dir DIR] [--dry-run]
```

With no `--older-than`, all matching snapshots are removed. Use `--dry-run` to preview.

## Flags

| Flag | Applies to | Meaning |
| --- | --- | --- |
| `--report OUT` | compare, compare-pair | Output HTML path (default `<stem>.diff.html`). |
| `--view` | compare, compare-pair | `unified` (default) or `side-by-side`. |
| `--state-dir DIR` | snapshot, compare, status, cleanup | Snapshot store location (default `./.create-diff`). |
| `--json` | capabilities, compare, compare-pair, status | Emit a machine-readable summary instead of prose. |
| `--label-before/--label-after` | compare-pair | Names shown in the report. |
| `--older-than DAYS` | cleanup | Remove snapshots older than N days. |
| `--dry-run` | cleanup | Preview removals without deleting. |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success. |
| `2` | Usage error (bad arguments). |
| `3` | Unsupported/limited format with no fallback (e.g. PDF with no extractor). |
| `4` | Missing baseline snapshot for `compare`. |
| `5` | I/O or extraction failure. |

## JSON summary shape

`compare`/`compare-pair --json` prints:

```json
{
  "format": "markdown",
  "fidelity_tier": "full",
  "added": 4, "removed": 0, "changed": 5,
  "unchanged": 12, "possible_moves": 0,
  "total_changes": 9, "identical": false,
  "report": "review.html"
}
```

## Reproducibility

Set `SOURCE_DATE_EPOCH` to a fixed Unix timestamp to make report output byte-reproducible (the diff content is already deterministic; only the "Generated" timestamp varies otherwise).

## Report validator

```bash
python3 validate_report.py <report.html> [more.html ...]
```

Exits `0` if every report is safe/self-contained, `1` otherwise. Checks: doctype, `<html lang>`, a Content-Security-Policy meta tag, no `<script>` tags, no inline event handlers, and no remote `href`/`src` in real markup (escaped content is ignored).
