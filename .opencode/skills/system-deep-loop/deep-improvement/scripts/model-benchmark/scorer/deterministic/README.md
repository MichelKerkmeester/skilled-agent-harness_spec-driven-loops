---
title: "deterministic: scorer deterministic checks"
description: "Standalone deterministic check scripts that score model output without an LLM call."
trigger_phrases:
  - "deterministic checks"
  - "bundle gate"
  - "cwd check"
---

# deterministic: scorer deterministic checks

---

## 1. OVERVIEW

`deterministic/` holds the standalone check scripts the scorer spawns as subprocesses. Each script reads a fixture JSON and a model output file, then prints one JSON line with a `score` and `passed` flag. No LLM calls happen here.

Current state:

- `score-model-variant.cjs` runs each script via `node <script> <fixture.json> <output.md>` and parses the JSON line from stdout.
- A missing output file makes a script emit `score: 0.0` and exit 0 so the scorer keeps a clean parse.
- `bundle-gate.cjs` is the only script that can set `hard_gate_failed`, which caps D1 to 0 upstream.

---

## 2. ARCHITECTURE

```text
score-model-variant.cjs
        │  spawnSync('node', [script, fixture.json, output.md])
        ▼
┌──────────────────────────────────────────────┐
│ bundle-gate / cwd-check / preplanning-regex / │
│ hallucination-flag                            │
└──────────────────────────────────────────────┘
        │  one JSON line on stdout
        ▼
{ score, passed, details, version }

Dependency direction: score-model-variant ───▶ deterministic/*.cjs (subprocess)
The check scripts do not import the scorer.
```

---

## 3. DIRECTORY TREE

```text
deterministic/
+-- bundle-gate.cjs         # D2 import/export/smoke-run verification (hard gate)
+-- cwd-check.cjs           # D3 path discipline classification
+-- hallucination-flag.cjs  # Allowlist gate for claimed flags and symbols
`-- preplanning-regex.cjs   # D5 pre-plan block structure check
```

---

## 4. KEY FILES

| File | What it asserts |
|---|---|
| `bundle-gate.cjs` | Three layers: claimed imports look resolvable, declared exports are well-formed with no duplicates, and any smoke-run command exits 0 under the fixture cwd. Scores 1.0/0.6/0.3/0.0 by layers passed. Sets `hard_gate_failed` when the smoke run hits an environment failure such as a missing cwd or module. |
| `cwd-check.cjs` | Extracts path-like tokens and classifies each as in-cwd, outside, bare-relative, or traversal. Scores 1.0 when all are in-cwd or bare-relative, 0.7 when some are outside, and 0.0 on any traversal attempt. |
| `hallucination-flag.cjs` | Extracts claimed CLI flags and called symbols, compares them against the fixture allowlist plus a common builtin allowlist, and scores by the count of unverified claims (1.0/0.8/0.5/0.0). |
| `preplanning-regex.cjs` | Looks for a `<pre-plan>` block, counts numbered steps, and checks each step for an acceptance criterion and a verification command. Scores by signals satisfied (1.0/0.6/0.3/0.0). |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Each script imports only Node builtins (`fs`, `path`, `child_process`). No cross-script or scorer imports. |
| Exports | Each script exports its `scoreOutput`/`scoreBlock` function and `VERSION` for tests, and runs `main()` when invoked directly. |
| Ownership | These scripts own the deterministic dimensions D2, D3, D5 and the deterministic part of D4. The grader owns the semantic D4 check. |
| Contract | Each script prints exactly one JSON line on stdout and exits 0 even on a missing output file. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node bundle-gate.cjs <fixture.json> <output.md>` | CLI | Emits the D2 bundle-gate result. |
| `node cwd-check.cjs <fixture.json> <output.md>` | CLI | Emits the D3 path-discipline result. |
| `node hallucination-flag.cjs <fixture.json> <output.md>` | CLI | Emits the deterministic D4 allowlist result. |
| `node preplanning-regex.cjs <fixture.json> <output.md>` | CLI | Emits the D5 pre-plan-structure result. |

---

## 7. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/tests/scorer.vitest.ts
```

Expected result: the scorer suite, which exercises these checks through `score()`, passes.

---

## 8. RELATED

- [`scorer README`](../README.md)
- [`grader README`](../grader/README.md)
