---
title: "Ripgrep one row per file"
description: "Keeps the highest-ranked ripgrep match per file and reports matches hidden by the file limit."
trigger_phrases:
  - "Ripgrep one row per file"
  - "ripgrep per-file match flood control"
  - "rg-wrapper structured file limit"
  - "structured ripgrep result shaping"
version: 1.0.2.0
---

# Ripgrep one row per file (rg-wrapper.mjs)

## 1. OVERVIEW

Keeps the highest-ranked ripgrep match per file and reports matches hidden by the file limit.

The structured recipe shapes results after ranking, so each file keeps its best-ranked row while repeated matches remain visible as a count.

---

## 2. HOW IT WORKS

### Per-file rows

The structured recipe groups ranked rows by exact path and keeps the first row for each file. Each result carries results[].moreInFile, the number of additional matches in that file; it is always an integer, and a single-match file has a value of 0.

### Limits and reporting

The default --limit is 20 files, and --limit 0 returns every file. The limit accepts a non-negative whole decimal up to the largest safe integer; negative, fractional, trailing-junk and oversized values are rejected.

Wrapper JSON uses schema version 3. matchCount and fileCount describe all matches and files before shaping. hidden: { files, matches } reports omitted files and their matches. limit is the effective cap, and truncated is true only when hidden.files is greater than zero. The path-only and count recipes sort their lists, paths by name and counts by busiest file first, then apply the same limit and fill fileCount, limit, truncated and hidden. The count recipe also fills matchCount and the hidden match total. The path-only recipe stops at one match per file, so its hidden.matches is null.

The human ranked line follows `ranked  : {matchCount} match(es) in {fileCount} file(s); showing {shown} file(s) at limit {limit}`; zero is shown as `limit 0 (uncapped)`. A row with additional matches ends with exactly `(+N more in this file)`, omitted when N is zero. Hidden files add exactly `+N more files with M matches`, omitted when N is zero.

### Edge cases

A clean miss returns results as an empty array and zero match, file and hidden totals. An execution error leaves results null and the new totals null or false.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Script | Applies structured result shaping, reports schema fields and formats the human summary |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Shared | Ranks matches and keeps the first ranked row for each path while counting repeated matches |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts` | Vitest | Covers per-file shaping, file limits, hidden counts, human summaries and invalid limits |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-flood-control.md` | Manual playbook | Checks per-file result shaping, match counts and the assistant's file list |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/rg-flood-control.md`

Related references:
- [stale-index-fallback.md](stale-index-fallback.md) - Covers the adjacent ripgrep retrieval experience.
- [trigger-lookup-total-candidates.md](trigger-lookup-total-candidates.md) - Documents result totals and truncation in trigger lookup.
- [rg-archive-search.md](rg-archive-search.md) - Covers the `--include-archive` mode of the same wrapper.
