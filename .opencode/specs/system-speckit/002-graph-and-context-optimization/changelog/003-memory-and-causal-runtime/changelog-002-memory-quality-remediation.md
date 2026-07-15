---
title: "Continuity Memory Runtime Phase 002: Memory quality remediation"
description: "A five-phase remediation train that closed 8 JSON-mode memory defects across the save pipeline. Fixed D1-D8 with template anchors, truncation, metadata ownership, sanitization, and heuristic guardrails."
trigger_phrases:
  - "phase 002 changelog"
  - "memory quality remediation"
  - "D1 D8 defect train"
  - "five phase remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime` (Level 2)
> Parent packet: `002-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Eight distinct JSON-mode memory defects (D1-D8) across content shaping, metadata consistency, lineage capture, git provenance, and template structure were remediated across five child phases. A 10-iteration deep-research session produced the remediation matrix. A 7-iteration deep-review surfaced 22 findings (13 P1, 9 P2), all of which landed across 4 targeted workstreams.

The parent packet now serves as the closeout surface: PR-10 stops at dry-run classification, PR-11 is deferred with rationale, and 10 sub-phases are consolidated in implementation-summary.md.

### Added

- Shared `truncateOnWordBoundary()` helper replacing raw substring clamps across the save pipeline.
- `trigger-phrase-sanitizer.ts` with empirical junk-class and allowlist rules.
- `find-predecessor-memory.ts` for conservative continuation-signal gated predecessor discovery.
- `SaveMode` enum replacing raw `_source === 'file'` control flow with explicit Json/Capture/ManualFile types.
- `post-save-review.ts` CHECK-D1 through CHECK-D8 exercising broken fixtures and staying silent on clean baselines.

### Changed

- OVERVIEW anchor naming standardized from `summary` to `overview` in context template (parser accepts both for backward compatibility).
- `importance_tier` became single-owner: session-extractor.ts is the authoritative resolver. Frontmatter-migration.ts rewrites both frontmatter and bottom metadata block from the same value.
- JSON-mode saves now pick up head_ref, commit_ref, and repository_state through narrow provenance-only insertion without touching authored summaries.
- `semantic-signal-extractor.ts` rejects non-adjacent synthetic bigrams.
- `decision-extractor.ts` gates lexical fallback behind authored-array precedence.

### Fixed

- D8: OVERVIEW anchor mismatch between template comment markers.
- D1: Raw substring(0,500) truncation replaced with boundary-aware helper.
- D4: importance-tier drift between frontmatter and metadata block.
- D7: JSON-mode provenance gap (missing git context fields).
- D3: Garbage trigger phrases from unconditional folder-token append.
- D2: Generic decision text from lexical fallback overriding authored arrays.
- D5: Missing causal predecessor discovery for continuation saves.
- Post-save-reviewer now detects broken fixtures and stays silent on clean baselines.

### Verification

- Phases 1-5 each passed `validate.sh --strict` independently.
- TypeScript typecheck: PASS.
- All targeted vitest suites: PASS (memory-quality-phase1 through phase4, post-save-review, trigger-phrase-sanitizer, YAML parse check).

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/lib/truncate-on-word-boundary.ts` (NEW) | Shared boundary-aware truncation helper. |
| `scripts/lib/trigger-phrase-sanitizer.ts` (NEW) | Junk-class filtering and allowlist rules for trigger phrases. |
| `scripts/core/find-predecessor-memory.ts` (NEW) | Conservative continuation-signal gated predecessor discovery. |
| `scripts/core/save-mode.ts` (NEW) | Explicit SaveMode enum replacing raw _source overload. |
| `scripts/core/post-save-review.ts` | CHECK-D1 through CHECK-D8 exercises broken and clean fixtures. |
| `scripts/core/frontmatter-migration.ts` | Extended to rewrite both frontmatter and bottom YAML block. |
| `scripts/core/workflow.ts` | Predecessor discovery integration, provenance-only enrichment path, triggered-phrase sanitization wiring. |
| `scripts/extractors/decision-extractor.ts` | Authored-array precedence gate with degraded-payload fallback. |
| `scripts/lib/semantic-signal-extractor.ts` | Topic-adjacency guardrail for synthetic bigrams. |
| `scripts/extractors/collect-session-data.ts` | Migrated to shared truncation helper. |
| Memory-quality vitest files (5 files) | Phase 1-5 fixture and regression suites. |

Four workstream commits: `bc7754ef0` (parent rollup normalization), `93c415203` (shipped-code bug fixes), `599449409` (telemetry reconciliation), `2de224c79` (P2 advisory cleanup). Packet-level reference: `7a987e8827`.

### Follow-Ups

- **PR-10 apply mode** remains deferred (dry-run-only in this packet).
- **PR-11 lock hardening** deferred with documented reopen triggers.
- **Parent strict validation** blocked by out-of-scope packet-root files.
