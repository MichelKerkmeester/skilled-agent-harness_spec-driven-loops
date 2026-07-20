---
title: Baseline, Comparison, and Lifecycle Workflow
description: The capture-before-edit invariant, the automatic snapshot flow, the explicit-pair fallback, snapshot storage, and cleanup lifecycle for create-diff.
trigger_phrases:
  - "create-diff workflow"
  - "capture baseline before edit"
  - "explicit before after pair"
  - "snapshot cleanup lifecycle"
importance_tier: normal
contextType: implementation
version: 1.1.1.0
---

# Workflow: baseline, comparison, and lifecycle

## 1. OVERVIEW

The core invariant: **capture the baseline before the edit.** A before/after review needs a real before-state, and once a file is overwritten the original is gone. `create-diff` never mutates the source — capture copies it into a local store.

## Automatic flow (snapshot-backed)

Best when you control the moment before an edit (e.g. an AI is about to modify a document).

```bash
# 1. BEFORE the edit
python3 ../scripts/create_diff.py snapshot path/to/doc.md

# 2. ... the edit happens ...

# 3. AFTER the edit
python3 ../scripts/create_diff.py compare path/to/doc.md --report review.html
```

`compare` uses the file's **latest** snapshot as the "before" and the current file as the "after". If no snapshot exists it exits `4` and tells you to snapshot first or use the explicit pair.

## Explicit-pair flow (fallback)

Best when there is no baseline, when comparing two arbitrary versions, or when the automatic store is unavailable or unwanted.

```bash
python3 ../scripts/create_diff.py compare-pair \
  --before old.md --after new.md \
  --label-before "v1" --label-after "v2" \
  --report review.html
```

No stored state is read or written. `--label-before`/`--label-after` set the names shown in the report (default: the file names).

## Pre-composed aggregate pairs

When one review needs to cover multiple files, compose one before document and
one after document with the same ordered, unique file markers:

```text
===== BEGIN FILE: docs/first.md =====
[file content]
===== END FILE: docs/first.md =====
===== BEGIN FILE: docs/second.md =====
[file content]
===== END FILE: docs/second.md =====
```

Run those aggregate documents through the ordinary `compare-pair` command. The
engine activates boundary mode only when both inputs contain at least two files
and every start/end pair is balanced, path-matched, unique, and in the same
order. Valid boundaries become explicit `START FILE` and `END FILE` bands in
both report views and cannot be hidden by collapsed context. Invalid envelopes
fall back to ordinary document text instead of producing partial file chrome.

This is a pre-composed input format, not native directory comparison or repeated
multi-file CLI arguments.

## Where snapshots live

Baselines are stored under a `.create-diff/` directory in the current working directory (override with `--state-dir DIR`). Each source path gets its own subdirectory keyed by a hash of its absolute path, containing the copied blobs plus a `manifest.json` recording capture time, size, and SHA-256. Writes are atomic (temp file + rename); the source is only ever read.

Add `.create-diff/` to `.gitignore` if you run this inside a repository — it is local scratch state, not a deliverable.

## Lifecycle

```bash
# What baselines exist (all, or for one file)
python3 ../scripts/create_diff.py status
python3 ../scripts/create_diff.py status path/to/doc.md

# Prune old baselines (preview first)
python3 ../scripts/create_diff.py cleanup --older-than 14 --dry-run
python3 ../scripts/create_diff.py cleanup --older-than 14
```

`cleanup` with no `--older-than` removes all matching snapshots; scope it with `--file` and preview with `--dry-run`.

## After generating a report

Always validate the report before handing it off:

```bash
python3 ../scripts/validate_report.py review.html
```

Then report the change summary and the report path. If the source file changed during the run, something is wrong — comparison must be read-only against the source.
