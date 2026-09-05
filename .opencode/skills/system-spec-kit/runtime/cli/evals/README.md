---
title: "Eval Scripts"
description: "Import-policy, architecture-boundary, dist-alignment and calibration checks for the Spec Kit engine."
trigger_phrases:
  - "eval scripts"
  - "run benchmarks"
  - "import policy"
  - "architecture boundaries"
---

# Eval Scripts

> CLI utilities for policy checks, dist alignment, redaction calibration and scripts-to-runtime boundaries.

---

## 1. OVERVIEW

`scripts/evals/` contains policy checks and calibration helpers for the Spec Kit engine. The tools cover import boundaries, handler cycles, source-to-dist alignment, redaction calibration and closure metrics.

Current state:

- TypeScript scripts run with `npx tsx` from the scripts workspace; `run-phase2-closure-metrics.mjs` runs with `node`.
- Import policy checks prefer the runtime package's public API (`@spec-kit/runtime/api`) over internal runtime paths.
- Allowlisted exceptions are tracked in `import-policy-allowlist.json`.
- The retrieval-quality runners that used to live here — `run-ablation.ts`, `run-bm25-baseline.ts` and `run-performance-benchmarks.ts` — were removed with the memory engine, along with `map-ground-truth-ids.ts`. Nothing replaced them, because the search pipeline they measured no longer exists.

---

## 2. PACKAGE TOPOLOGY

```text
scripts/evals/
+-- check-allowlist-expiry.ts                 # Import exception expiry checks
+-- check-architecture-boundaries.ts          # Architecture boundary checks
+-- check-handler-cycles-ast.ts               # Handler cycle detection
+-- check-no-mcp-lib-imports.ts               # Internal runtime import checks
+-- check-no-mcp-lib-imports-ast.ts           # AST variant of the same check
+-- check-source-dist-alignment.ts            # Orphaned dist artifact detection
+-- collect-redaction-calibration-inputs.ts   # Redaction calibration inputs
+-- run-redaction-calibration.ts              # Redaction threshold calibration
+-- run-phase2-closure-metrics.mjs            # Closure metrics into a spec folder's scratch/
+-- import-policy-rules.ts                    # Shared import policy rules
+-- import-policy-allowlist.json              # Managed import exceptions
`-- README.md
```

Allowed import surfaces:

- `../../runtime/api`
- `../../runtime/api/*`
- `../../shared/`

Restricted import surfaces:

- `@spec-kit/runtime/lib*`
- `@spec-kit/runtime/core*`
- `@spec-kit/runtime/handlers*`
- Relative imports into `../../runtime/{lib,core,handlers}`

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `check-no-mcp-lib-imports-ast.ts` | Enforces restricted import policy with AST traversal. |
| `check-no-mcp-lib-imports.ts` | Text-scan variant of the same restricted import policy. |
| `check-allowlist-expiry.ts` | Warns on near-expiry import exceptions and fails on expired ones. |
| `check-architecture-boundaries.ts` | Checks shared neutrality and wrapper-only boundaries. |
| `check-handler-cycles-ast.ts` | Detects import cycles between handlers. |
| `check-source-dist-alignment.ts` | Maps each runtime-critical `dist/**/*.js` back to its source `.ts` and flags orphans left by deleted or renamed sources. |
| `run-redaction-calibration.ts` | Calibrates sensitive-content redaction thresholds. |
| `collect-redaction-calibration-inputs.ts` | Collects data used by redaction calibration runs. |
| `run-phase2-closure-metrics.mjs` | Generates closure metrics for a named spec folder and writes them under that folder's `scratch/`. Takes the spec-folder path as its one argument. |
| `import-policy-rules.ts` | Shared rule definitions used by the import policy checks. |
| `import-policy-allowlist.json` | Stores temporary approved exceptions with owner and expiry metadata. |

---

## 4. COMMANDS

Run from `.opencode/skills/system-spec-kit/scripts` unless a command uses a repository-root path.

```bash
npx tsx evals/check-no-mcp-lib-imports-ast.ts
```

Expected result: exits zero when eval scripts avoid restricted runtime imports or use valid allowlist entries.

```bash
npx tsx evals/check-allowlist-expiry.ts
```

Expected result: warns on near-expiry exceptions and fails on expired exceptions.

```bash
npx tsx evals/check-source-dist-alignment.ts
```

Expected result: exits zero when every runtime-critical dist artifact still has a matching source file, and reports a violation for each orphan left by a deleted or renamed source.

```bash
node evals/run-phase2-closure-metrics.mjs specs/<track>/<packet>
```

Expected result: writes closure metrics into that spec folder's `scratch/` directory. Without the spec-folder argument it exits with a usage error.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Public API | Eval scripts should use the runtime package's public API (`@spec-kit/runtime/api`) rather than internal runtime modules. |
| Exceptions | Internal runtime access requires an allowlist entry with owner, reason and expiry. |
| Data | Calibration and metrics scripts may read fixtures and write into a named spec folder's `scratch/`, but should not rewrite tracked artifacts unless a command documents that behavior. |
| Reporting | Output should state when prerequisites are missing or results are investigation-only. |

---

## 6. VALIDATION

Run the README validator after editing this file:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/cli/evals/README.md
```

Run policy checks after changing eval scripts:

```bash
cd .opencode/skills/system-spec-kit/scripts
npx tsx evals/check-no-mcp-lib-imports-ast.ts
npx tsx evals/check-allowlist-expiry.ts
```

Expected result: both policy checks exit zero or report a documented exception that needs review.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../core/README.md`](../core/README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)
- [`import-policy-allowlist.json`](./import-policy-allowlist.json)
