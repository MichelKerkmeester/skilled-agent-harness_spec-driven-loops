---
title: "Compaction recall census"
description: "Scores, with zero model calls, what host compactions keep in the stock summary and the recorded brief and whether the vendored staged fit can hold each session, then prints one stop line for a later deletion arm."
trigger_phrases:
  - "compaction recall census"
  - "score-compaction-recall.mjs"
  - "compact_boundary census"
  - "compaction brief recall"
version: 2.3.0.0
---

# Compaction recall census (score-compaction-recall.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Scores, with zero model calls, what host compactions keep in the stock summary and the recorded brief and whether the vendored staged fit can hold each session, then prints one stop line for a later deletion arm.

The census answers two questions before anyone builds a model pass that deletes tool results from a compacting session: can the vendored staged fit hold these sessions at all, and what do the host's stock summary and the recovered-context brief each keep. It reads only the transcripts the operator names, never starts `jev` or `cli-deem`, needs no key and leaves the hooks, the settings and the transcripts exactly as they are.

---

## 2. HOW IT WORKS

### Session Selection

`--transcripts <dir-or-file>` names what the census reads, and it never falls back to a default directory. `--newest-compacted <n>` narrows a directory to its `n` newest top-level `*.jsonl` files, by modification time, that hold at least one compaction. A file under a `subagents/` folder is never a candidate. Each file is read only up to the size it had just before the census read it and is split on the newline byte, so a session still being written adds no half record.

### Parsing And Boundaries

Every record's `type` must be one of the known transcript record types. An unknown type, a line that is not JSON or a boundary without `compactMetadata` stops that session with `parse error: <file>:<line>: <reason>`, counts it and makes the run exit 1. A boundary is a `system` record with `subtype` `compact_boundary` and `compactMetadata`, and the report prints that method and its scope.

### Columns

For each boundary the census rebuilds the history since the previous boundary and runs a port of the vendored `estimateTokens` and `fitState`, printing the stage reached or a counted `fit_throw`. A pass with no model cuts every unpinned tool result to a 300-character head, which gives an offline reduction upper bound and a kept-token estimate. The census reads the stock summary and the `SessionStart:compact` brief that the spec-kit `session-prime` hook recorded in the 30 records after the boundary. It scores both under five must-survive rules: identifiers used after the boundary, files written through Write or Edit, the bound spec folder, the identifiers in the last user instruction and a preserved-segment check. `--replay` rebuilds a brief only where none was recorded, from the built `compact-inject` module, and stamps the row.

### Report And Stop Line

The report at `--out` holds counts, scores, labels, file basenames, boundary uuids and line numbers. A guard checks every string before anything is printed or written and voids the run on any other text. The last line is the one stop line. The census is void when more than half the sessions stop on an unknown shape and prints `no boundaries` when it finds none. Otherwise it prints `arm not built` or `arm may be specified` from the share of fits that throw, the median offline reduction and the median ratio of kept tokens to the host's own.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` | Script | Picks the sessions, parses each transcript, scores every boundary and prints the report and the stop line |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Handler | Builds the brief that the `--replay` path imports from the built runtime |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Handler | Injects the recorded brief with its `Recovered Context (Post-Compaction)` marker |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | Vitest | Twelve cases over synthetic fixtures, with stub `jev` and `cli-deem` binaries first on the path |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/clean.jsonl` | Fixture | One of six synthetic transcripts, each text field carrying a canary string |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/compaction-recall-census.md` | Manual playbook | Runs the census over the fixtures, then the suite |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/compaction-recall-census.md`

Related references:
- [code-standards-alignment.md](code-standards-alignment.md) - the entry before this one in the category
- [completion-verdict-freshness-validation.md](completion-verdict-freshness-validation.md) - the entry after this one in the category
