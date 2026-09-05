---
title: "Retrieval Scripts: Trigger Index and Ripgrep Lane"
description: "Generates and looks up the committed trigger index, runs the ripgrep recipe lane, checks retrieval parity, retrofits the grep convention and sweeps for memory-MCP residue."
trigger_phrases:
  - "retrieval scripts"
  - "trigger index generator"
  - "ripgrep recipe wrapper"
  - "retrieval parity harness"
---

# Retrieval Scripts: Trigger Index and Ripgrep Lane

---

## 1. OVERVIEW

`scripts/retrieval/` owns the trigger-index generator and lookup that back Gate 1 trigger lookup, the ripgrep recipe lane documented in `references/retrieval/retrieval-conventions.md`, and the tooling that keeps both honest: a three-arm parity harness, a grep-convention retrofit pipeline and a memory-MCP residue sweep. `lib/` holds the shared, filesystem-free primitives every script here imports.

Current state:

- `generate-trigger-index.mjs` publishes the committed index at `../runtime/data/trigger-index.json` from the `trigger_phrases` frontmatter across `specs/` and `.opencode/skills/`.
- `lookup-trigger-index.mjs` is the read side: it scores a prompt against the committed index using the same normalization, tokenization and match-class ranking as the substring trigger lane in `runtime/lib/search/hybrid-search.ts`.
- `rg-wrapper.mjs` runs the three documented ripgrep recipes (structured, path-only, count) behind one front door, and `parity-check.mjs` compares the trigger index, the ripgrep lane and a legacy sqlite substring lane against one frozen prompt set.
- `retrofit-convention.mjs` applies the greppable-corpus convention to the spec corpus in an enumerate/dry-run/process/rescan pipeline; `sweep-memory-residue.mjs` answers one question with an exit code — does any live consumer of the retired memory MCP surface still exist outside its own subsystem tree.
- All scripts are plain ESM `.mjs`, run directly with `node` (no build step), and read fixtures from `fixtures/` for tests and frozen baselines.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       scripts/retrieval                          │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐      ┌──────────────────────────┐
│ specs/, .opencode/  │ ───▶ │ generate-trigger-index.mjs│ ──▶ runtime/data/trigger-index.json
│ (trigger_phrases)   │      └──────────────────────────┘              │
└─────────────────────┘                                                ▼
                                                            ┌──────────────────────────┐
                                                            │ lookup-trigger-index.mjs │ ──▶ Gate 1 candidates
                                                            └──────────────────────────┘

┌──────────────────┐      ┌───────────────┐      ┌──────────────────┐
│ rg-wrapper.mjs   │ ───▶ │ ripgrep       │      │ parity-check.mjs │ ──▶ index vs. ripgrep vs. legacy-lane divergence report
│ (3 recipes)      │      │ (subprocess)  │ ◀─── │ (3-arm harness)  │
└──────────────────┘      └───────────────┘      └──────────────────┘

┌────────────────────────┐      ┌─────────────────────────┐
│ retrofit-convention.mjs│ ───▶ │ lib/grep-convention.mjs │ (pure classification/diff logic)
└────────────────────────┘      └─────────────────────────┘

┌───────────────────────────┐
│ sweep-memory-residue.mjs  │ ──▶ ripgrep over the repo, allowlist-filtered
└───────────────────────────┘

All six scripts import shared primitives from lib/ (see lib/README.md).
```

---

## 3. DIRECTORY TREE

```text
retrieval/
+-- generate-trigger-index.mjs    # Publishes the committed trigger index from corpus frontmatter
+-- lookup-trigger-index.mjs      # Scores a prompt against the committed index
+-- measure-cold-lookup.mjs       # Times cold-start lookup latency across fresh Node processes
+-- parity-check.mjs              # Three-arm harness: index vs. ripgrep vs. legacy sqlite lane
+-- retrofit-convention.mjs       # Enumerate/dry-run/process/rescan pipeline for the grep convention
+-- rg-wrapper.mjs                # One front door for the three documented ripgrep recipes
+-- sweep-memory-residue.mjs      # Exit-code check for live consumers of the retired memory MCP surface
+-- lib/                          # Shared, filesystem-free primitives (see lib/README.md)
`-- fixtures/                     # Frozen manifests, baselines and grep-convention test documents
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `generate-trigger-index.mjs` | Walks the corpus, reads `trigger_phrases` frontmatter, and publishes one deterministic index plus a manifest and diagnostics. |
| `lookup-trigger-index.mjs` | Loads the committed index and ranks candidates for one prompt, optionally scoped to a spec folder. |
| `measure-cold-lookup.mjs` | Spawns one fresh Node process per sample to measure real cold-start lookup latency against a budget. |
| `parity-check.mjs` | Runs a frozen prompt set through the index, ripgrep and legacy-lane arms and reports two-directional divergence. |
| `retrofit-convention.mjs` | Applies the greppable-corpus convention across the spec corpus; each stage reads a manifest frozen by `enumerate` so `process` cannot silently see documents that changed since enumeration. |
| `rg-wrapper.mjs` | Builds and runs the structured, path-only and count ripgrep recipes exactly as the convention document specifies, applying the caller-side rank tuple to structured results. |
| `sweep-memory-residue.mjs` | Streams ripgrep JSON-lines matches for retired memory-MCP terms and classifies each hit against an allowlist. |

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Index authority | `runtime/data/trigger-index.json` is generated only by `generate-trigger-index.mjs`. No script here hand-edits it. |
| Scoring parity | `lookup-trigger-index.mjs`, `rg-wrapper.mjs` and `parity-check.mjs` share normalization and ranking through `lib/normalize.mjs` and `lib/rg-lane.mjs` rather than each re-deriving it. |
| Manifest freezing | `retrofit-convention.mjs` reads the manifest `enumerate` wrote; it never re-walks the corpus mid-pipeline, so `process` and `rescan` operate on the same byte-frozen snapshot `dry-run` reported against. |
| No daemon, no MCP | Every script here runs as a plain Node process reading files or shelling out to `rg` directly; none of them talk to a daemon or an MCP transport. |

---

## 6. ENTRYPOINTS

Run from the repository root. `rg-wrapper.mjs` and `sweep-memory-residue.mjs` default their search root to the current working directory, so running them from elsewhere without `--root`/`--search-root` fails to find `specs/` and `.opencode/`.

```bash
node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs --json
node .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs "<prompt>" --json
node .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs structured "<phrase>" --json
node .opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs enumerate --root . --out <dir>
node .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs --json
```

Exit codes follow the same shape across scripts: `0` for a clean or passing result, `1` for a substantive finding (no candidates, residue, at least one failing case), `2` for a bad invocation or execution fault. Each script's own header comment documents its exact codes.

---

## 7. VALIDATION

Run from the skill root (`.opencode/skills/system-spec-kit`):

```bash
npx --prefix scripts vitest run --config runtime/vitest.config.ts \
  scripts/tests/trigger-index.vitest.ts \
  scripts/tests/rg-wrapper-recipes.vitest.ts \
  scripts/tests/parity-check.vitest.ts \
  scripts/tests/grep-convention.vitest.ts \
  scripts/tests/grep-convention-rule.vitest.ts \
  scripts/tests/sweep-memory-residue.vitest.ts \
  scripts/tests/retrofit-convention-pipeline.vitest.ts
```

Expected result: all suites pass.

Determinism check after any edit here, from the skill root:

```bash
node scripts/retrieval/generate-trigger-index.mjs --json > /tmp/a.json
node scripts/retrieval/generate-trigger-index.mjs --json > /tmp/b.json
diff <(python3 -c "import json;print(json.load(open('/tmp/a.json'))['indexSha256'])") \
     <(python3 -c "import json;print(json.load(open('/tmp/b.json'))['indexSha256'])")
```

Expected result: no diff output; the two runs produce the identical `indexSha256`.

---

## 8. RELATED

- [`lib/README.md`](./lib/README.md)
- [Retrieval conventions](../../references/retrieval/retrieval-conventions.md)
- [`../rules/README.md`](../rules/README.md)
