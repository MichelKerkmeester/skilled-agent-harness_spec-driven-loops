---
title: "Validation"
description: "Pre-flight gates for memory saves, save quality scoring, spec-doc structure rules, and folder-level validation reporting."
trigger_phrases:
  - "validation"
  - "preflight"
  - "anchor format"
  - "save quality gate"
  - "spec doc structure"
  - "validate folder"
---

# Validation

## 1. OVERVIEW

`lib/validation/` checks content and spec-folder structure before memory operations proceed. Two concerns live here. The save path catches malformed anchors, duplicate content, token-budget issues, content-size problems, and low-signal save payloads before storage runs. The spec-folder path applies structural rules and builds a level-aware validation report for a folder on disk.

## 2. DATA FLOW

Save path:

```text
content and save metadata
  -> runPreflight()
  -> anchor, duplicate, token, and size checks
  -> optional runQualityGate()
  -> structural, content-quality, and semantic-dedup checks
  -> pass or actionable rejection reasons
```

The output is a typed result that callers can return in an envelope or use to stop a write before embedding and storage work starts.

Spec-folder path:

```text
folder path and options
  -> validateFolder()
  -> level detection and required-file checks
  -> runSpecDocStructureRule() per structural rule
  -> ValidationReport with pass, warn, and error entries
```

## 3. KEY FILES

| File | Purpose |
|---|---|
| `preflight.ts` | Runs anchor, duplicate, token, and content-size checks for a save payload |
| `save-quality-gate.ts` | Scores save payloads with structural, content-quality, and semantic-dedup layers |
| `orchestrator.ts` | Detects the spec level, runs required-file and structural rules, and builds a `ValidationReport` |
| `spec-doc-structure.ts` | Defines and dispatches the named spec-doc structure rules with `SPECDOC_*` failure codes |

## 4. BOUNDARIES

This module reports whether content is safe to continue and whether a spec folder meets its structure rules. It does not write memory records, create embeddings, rewrite markdown, or format MCP responses.

## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `runPreflight()` | Run the selected pre-flight checks in one call |
| `validateAnchorFormat()` | Check paired `ANCHOR` tags and anchor IDs |
| `checkDuplicate()` | Detect exact or similar existing content |
| `computeContentHash()` | Hash content for duplicate detection |
| `estimateTokens()` | Estimate token count for a payload |
| `checkTokenBudget()` | Compare content against token limits |
| `validateContentSize()` | Enforce minimum and maximum content length |
| `runQualityGate()` | Run save quality layers when enabled |
| `isQualityGateEnabled()` | Read the save-quality feature flag state |
| `validateStructural()` | Score structural signals for a save payload |
| `scoreContentQuality()` | Score title, trigger, length, anchor, and metadata quality |
| `checkSemanticDedup()` | Compare new content against similar stored records |
| `validateFolder()` | Detect the level and build a `ValidationReport` for a spec folder |
| `runSpecDocStructureRule()` | Dispatch one named spec-doc structure rule |

## 6. FAILURE CODES AND THRESHOLDS

- Anchor failures use `PF001` through `PF003`.
- Duplicate failures use `PF010` through `PF012`.
- Token-budget failures use `PF020` and `PF021`.
- Content-size failures use `PF030` and `PF031`.
- Save quality checks return layer-specific reasons and a final `pass` value.
- Spec-doc structure failures use `SPECDOC_*` codes grouped by rule in `RULE_FAILURE_CODES`: `FRONTMATTER_MEMORY_BLOCK` (`SPECDOC_FRONTMATTER_001` through `SPECDOC_FRONTMATTER_007`, plus `MEMORY_BLOCK_INVALID` and `SESSION_LINEAGE_BROKEN`), `MERGE_LEGALITY` (`SPECDOC_MERGE_001` through `SPECDOC_MERGE_005`), `SPEC_DOC_SUFFICIENCY` (`SPECDOC_SUFFICIENCY_001` through `SPECDOC_SUFFICIENCY_004`), `CROSS_ANCHOR_CONTAMINATION` (`SPECDOC_CONTAM_001` through `SPECDOC_CONTAM_003`), `POST_SAVE_FINGERPRINT` (`SPECDOC_FINGERPRINT_001` through `SPECDOC_FINGERPRINT_004`).
- `validateFolder()` returns a `ValidationReport` with per-rule `pass`, `warn`, `error`, and `info` entries plus a summary count.
- Thresholds are environment-configurable through the `MCP_*` and `SPECKIT_SAVE_QUALITY_GATE` settings.

## 7. VALIDATION

Run focused tests from the `mcp-server/` directory when changing this folder:

```bash
npx vitest run tests/preflight.vitest.ts
npx vitest run tests/save-quality-gate.vitest.ts
npx vitest run tests/spec-doc-structure.vitest.ts
```

Run document validation after README edits:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/validation/README.md
```

## 8. RELATED

- `../errors/README.md`
- `../search/README.md`
- `../storage/README.md`
- `../../context-server.ts`
