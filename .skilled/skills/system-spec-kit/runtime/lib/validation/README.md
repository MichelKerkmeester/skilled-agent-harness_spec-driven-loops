---
title: "Validation: Spec Folder Rule Orchestration"
description: "Level detection, spec-doc structure rules, and generated-metadata integrity checks behind validate.sh's ValidationReport."
trigger_phrases:
  - "validate folder"
  - "validation report"
  - "spec doc structure"
  - "generated metadata integrity"
---

# Validation: Spec Folder Rule Orchestration

---

## 1. OVERVIEW

`lib/validation/` decides every spec-folder rule verdict. It detects a folder's documentation level, runs the named spec-doc structure rules, checks the two generated JSON files (`description.json` and `graph-metadata.json`) against their schemas and invariants, and folds the results into the `ValidationReport` that `validate.sh` prints.

Current state:

- `orchestrator.ts` resolves the level contract, detects folder shape (including phase parents), and runs the registered rule set (both the TypeScript structure rules and the shell-based validator registry) to a report.
- `spec-doc-structure.ts` implements five named structural rules, each with its own `SPECDOC_*` failure-code range, plus the continuity-fingerprint helpers `orchestrator.ts` and other callers share.
- `generated-metadata-integrity.ts` validates `description.json` and `graph-metadata.json` against the shared Zod schemas plus the canonical path-prefix and status-enum invariants. Severity resolution is left to the caller, so the same check backs both the grandfather report-mode rollout and the enforced run.

---

## 2. DATA FLOW

```text
folder path and options
  -> validateFolder()
  -> level detection (including phase-parent shape)
  -> runSpecDocStructureRule() per structural rule
  -> checkGeneratedMetadataIntegrity() / checkGeneratedMetadataDrift()
  -> ValidationReport with pass, warn, error, and info entries
```

The output is the typed report `validate.sh` (through the compiled `dist/lib/validation/orchestrator.js`) reads to decide `RESULT: PASSED` or `RESULT: FAILED`.

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `orchestrator.ts` | Resolves the level contract, detects folder shape, runs the TypeScript structure rules plus the shell-based validator registry, and builds the `ValidationReport`. |
| `spec-doc-structure.ts` | Five named structural rules (`FRONTMATTER_MEMORY_BLOCK`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`) and the continuity-fingerprint helpers. |
| `generated-metadata-integrity.ts` | Schema, path-prefix, and status-enum validation for `description.json` and `graph-metadata.json`. |

---

## 4. BOUNDARIES

This folder decides whether a spec folder's structure and generated metadata are valid. It does not write memory records, mutate spec documents, or render transport responses. Only `graph-metadata-parser.ts` writes `graph-metadata.json`; the integrity check here reads and reports only.

---

## 5. ENTRYPOINTS

| Entrypoint | Purpose |
|---|---|
| `validateFolder(folderPath, opts)` | Validate one spec folder end to end and return its `ValidationReport`. |
| `runSpecDocStructureRule(options)` | Evaluate one named structural rule against a spec folder. |
| `buildContinuityFingerprint(content)` | Compute the sha256 continuity fingerprint of normalized content. |
| `normalizeForContinuityFingerprint(content)` | Normalize continuity content so re-derives are stable. |
| `checkGeneratedMetadataIntegrity(...)` | Validate a spec folder's generated JSON files against the integrity contract. |
| `resolveGeneratedMetadataIntegrity(...)` | Turn an integrity report into a caller-chosen severity. |

---

## 6. FAILURE CODES AND THRESHOLDS

- `FRONTMATTER_MEMORY_BLOCK` uses `SPECDOC_FRONTMATTER_001` through `SPECDOC_FRONTMATTER_007`, plus `MEMORY_BLOCK_INVALID` and `SESSION_LINEAGE_BROKEN`.
- `MERGE_LEGALITY` uses `SPECDOC_MERGE_001` through `SPECDOC_MERGE_005`.
- `SPEC_DOC_SUFFICIENCY` uses `SPECDOC_SUFFICIENCY_001` through `SPECDOC_SUFFICIENCY_004`.
- `CROSS_ANCHOR_CONTAMINATION` uses `SPECDOC_CONTAM_001` through `SPECDOC_CONTAM_003`.
- `POST_SAVE_FINGERPRINT` uses `SPECDOC_FINGERPRINT_001` through `SPECDOC_FINGERPRINT_004`.
- The full code set per rule is exported as `RULE_FAILURE_CODES`.
- `generated-metadata-integrity.ts` reports `STATUS_COMPLETE_EVIDENCE_MISMATCH` when a `derived.status: complete` folder's completion evidence disagrees (gated by `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE`).
- `validateFolder()` returns a `ValidationReport` with per-rule `pass`, `warn`, `error`, and `info` entries plus a summary count.
- Rule behavior is tunable through the `SPECKIT_*` capability flags in `../config/capability-flags.ts`.

---

## 7. VALIDATION

Run focused tests from `.opencode/skills/system-spec-kit/runtime`:

```bash
npx vitest run tests/spec-doc-structure.vitest.ts tests/generated-metadata-integrity.vitest.ts
```

Run document validation after README edits:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/lib/validation/README.md
```

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../graph/README.md`](../graph/README.md)
- [`../templates/README.md`](../templates/README.md)
- [`../spec/README.md`](../spec/README.md)
