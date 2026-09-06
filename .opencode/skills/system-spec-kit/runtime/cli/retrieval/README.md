---
title: "Retrieval Scripts: Trigger Index and Ripgrep Lane"
description: "Generates and looks up the committed trigger index, runs the ripgrep recipe lane, retrofits the grep convention and sweeps for memory-MCP residue."
trigger_phrases:
  - "retrieval scripts"
  - "trigger index generator"
  - "ripgrep recipe wrapper"
---

# Retrieval Scripts: Trigger Index and Ripgrep Lane

---

## 1. OVERVIEW

`runtime/cli/retrieval/` owns the trigger-index generator and lookup that back Gate 1 trigger lookup, the ripgrep recipe lane documented in `references/retrieval/retrieval-conventions.md`, and the tooling that keeps both honest: a grep-convention retrofit pipeline and a memory-MCP residue sweep. `lib/` holds the shared, filesystem-free primitives every script here imports.

Current state:

- `generate-trigger-index.mjs` publishes the committed index at `../runtime/data/trigger-index.json` from the `trigger_phrases` frontmatter across `specs/`, `.opencode/skills/` and `.opencode/install-guides/`.
- `lookup-trigger-index.mjs` is the read side: it scores a prompt against the committed index using the same normalization, tokenization and match-class ranking the retired substring trigger lane used, so its recorded results still diff against this lookup.
- `rg-wrapper.mjs` runs the three documented ripgrep recipes (structured, path-only, count) behind one front door. Its glob set now excludes `scratch/` alongside `z_archive/`, `node_modules/` and `.git/` - see `references/retrieval/retrieval-conventions.md` Section 9 for the full root and exclusion coverage table shared with `lib/corpus.mjs`.
- `sweep-memory-residue.mjs` answers one question with an exit code — does any live consumer of the retired memory MCP surface still exist outside its own subsystem tree.
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

┌──────────────────┐      ┌───────────────┐
│ rg-wrapper.mjs   │ ───▶ │ ripgrep       │
│ (3 recipes)      │      │ (subprocess)  │
└──────────────────┘      └───────────────┘

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
+-- rg-wrapper.mjs                # One front door for the three documented ripgrep recipes
+-- sweep-memory-residue.mjs      # Exit-code check for live consumers of the retired memory MCP surface
+-- lib/                          # Shared, filesystem-free primitives (see lib/README.md)
`-- fixtures/                     # Frozen manifests, baselines and grep-convention test documents
```

The one-time grep-convention retrofit pipeline lives in `../ops/retrofit-convention.mjs`. It imports this folder's `lib/` and `rg-wrapper.mjs`, but nothing at lookup time depends on it.

### Frozen acceptance evidence

Five fixtures were captured once, when the lexical lanes were accepted, and have no runtime reader: `latency-report.json`, `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json` and `daemon-off-proof.json`. Each pins the `manifestHash` of the snapshot it was taken on, and regeneration does not refresh that pin, so a mismatch against the committed manifest is expected and is not a staleness signal. `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` are the opposite: every generator run rewrites them, and `/doctor speckit-retrieval` treats a manifest whose hash differs from the committed index as a committed pair that one run did not produce. The manifest's `promptSetHash` stays `null` until a parity consumer pins a prompt set there; the slot is kept so landing that value leaves the manifest hash stable.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `generate-trigger-index.mjs` | Walks the corpus, reads `trigger_phrases` frontmatter, and publishes one deterministic index plus a manifest and diagnostics. |
| `lookup-trigger-index.mjs` | Loads the committed index and ranks candidates for one prompt, optionally scoped to a spec folder. |
| `measure-cold-lookup.mjs` | Spawns one fresh Node process per sample to measure real cold-start lookup latency against a budget. Acceptance-only: nothing runs it on a schedule, and `/doctor speckit-retrieval` offers it as an optional check that writes its report to packet scratch, never to the committed fixture. |
| `rg-wrapper.mjs` | Builds and runs the structured, path-only and count ripgrep recipes exactly as the convention document specifies, applying the caller-side rank tuple to structured results. |
| `sweep-memory-residue.mjs` | Streams ripgrep JSON-lines matches for retired memory-MCP terms and classifies each hit against an allowlist. A one-shot acceptance check from the memory decommission; the coverage-parity suite keeps its exclusion delta honest. |

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Index authority | `runtime/data/trigger-index.json` is generated only by `generate-trigger-index.mjs`. No script here hand-edits it. |
| Scoring parity | `lookup-trigger-index.mjs` and `rg-wrapper.mjs` share normalization and ranking through `lib/normalize.mjs` and `lib/rg-lane.mjs` rather than each re-deriving it. |
| No daemon, no MCP | Every script here runs as a plain Node process reading files or shelling out to `rg` directly; none of them talk to a daemon or an MCP transport. |

---

## 6. ENTRYPOINTS

Run from the repository root. `rg-wrapper.mjs` and `sweep-memory-residue.mjs` default their search root to the current working directory, so running them from elsewhere without `--root`/`--search-root` fails to find `specs/` and `.opencode/`.

```bash
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --json
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs "<prompt>" --json
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs structured "<phrase>" --json
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs --json
```

Exit codes follow the same shape across scripts: `0` for a clean or passing result, `1` for a substantive finding (no candidates, residue, at least one failing case), `2` for a bad invocation or execution fault. Each script's own header comment documents its exact codes.

---

## 7. VALIDATION

Run from the CLI package (`.opencode/skills/system-spec-kit/runtime/cli`):

```bash
npx vitest run --config ../../vitest.config.ts --project cli \
  tests/trigger-index.vitest.ts \
  tests/rg-wrapper-recipes.vitest.ts \
  tests/retrieval-coverage-parity.vitest.ts \
  tests/grep-convention.vitest.ts \
  tests/grep-convention-rule.vitest.ts \
  tests/sweep-memory-residue.vitest.ts \
  tests/retrofit-convention-pipeline.vitest.ts
```

Expected result: all suites pass.

Determinism check after any edit here, from the repository root:

```bash
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --json > /tmp/a.json
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --json > /tmp/b.json
diff <(python3 -c "import json;print(json.load(open('/tmp/a.json'))['indexSha256'])") \
     <(python3 -c "import json;print(json.load(open('/tmp/b.json'))['indexSha256'])")
```

Expected result: no diff output; the two runs produce the identical `indexSha256`.

---

## 8. RELATED

- [`lib/README.md`](./lib/README.md)
- [Retrieval conventions](../../references/retrieval/retrieval-conventions.md)
- [`../rules/README.md`](../rules/README.md)
