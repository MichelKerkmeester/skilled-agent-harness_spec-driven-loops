---
title: "Memory Quality Backend Improvements: 10-Phase Remediation Train"
description: "Eight JSON-mode memory defects (D1-D8) fixed across a 10-phase train. Covers word-boundary truncation, single-owner metadata, trigger-phrase sanitization, SaveMode refactor, predecessor discovery, post-save review guardrails, compact-wrapper runtime, downstream parity, fast-path fix. All phases validated under strict spec validation."
trigger_phrases:
  - "memory quality remediation train"
  - "d1 d8 memory defect fixes"
  - "savemode refactor memory save"
  - "trigger phrase sanitizer memory"
  - "post save review guardrails"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-12

> Spec folder: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/002-fix-memory-quality` (Level 2)
> Parent packet: `027-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Eight distinct JSON-mode memory defects (D1-D8) had accumulated across content shaping, metadata consistency, lineage capture, git provenance. Template structure was also affected. The OVERVIEW anchor mismatch corrupted parser output. Raw truncation lost mid-word. Importance tier drifted across the save path. Garbage trigger phrases polluted search results. Predecessor discovery fabricated lineage from unrelated siblings. The save pipeline had no guardrail to detect its own broken output.

A 10-phase remediation train repaired all eight defects and extended the pipeline with compact-wrapper runtime, downstream parity sync, a fast-path normalizer coercion fix. Heuristic calibration closed the remaining validator edge cases. A 7-iteration deep-review cycle then closed 13 P1 and 9 P2 findings against the shipped code. All 10 child phases passed strict spec validation. PR-10 remains dry-run-only. PR-11 is explicitly deferred with documented reopen triggers.

### Added

- `truncateOnWordBoundary()` shared helper using U+2026 ellipsis for all truncation callsites across the save path
- `trigger-phrase-sanitizer.ts` encoding D3 junk-class rules and allowlist logic integrated into `workflow.ts`
- `find-predecessor-memory.ts` with conservative continuation-signal gating and ambiguity skip
- `save-mode.ts` replacing raw `_source` string branching with explicit `SaveMode` enum (`Json`, `Capture`, `ManualFile`)
- Phase 1-4 and Phase 6-10 vitest suites covering the full D1-D8 repair surface
- Telemetry catalog and `memory-save-quality-alerts.yml` from Phase 5 operational tail

### Changed

- `input-normalizer.ts` now coerces plain-string `user_prompts`, `observations` and `recent_context` to structured shapes on the JSON fast path
- `session-extractor.ts` became the authoritative `importance_tier` resolver; `frontmatter-migration.ts` rewrites both frontmatter and bottom metadata block from the same resolved value
- `post-save-review.ts` upgraded to accept in-memory rendered content and emit `REVIEWER_ERROR` status for unexpected failures
- `decision-extractor.ts` gates lexical fallback behind authored-array precedence while preserving degraded-payload fallback
- `semantic-signal-extractor.ts` rejects non-adjacent synthetic bigrams
- Context template switched to compact-wrapper contract with comment anchors as structural source of truth

### Fixed

- OVERVIEW anchor mismatch caused parser to skip the summary block. Renamed `summary` terminators to `overview` with backward-compatible regex.
- Raw truncation clamp cut mid-word and lost meaning. Replaced with shared `truncateOnWordBoundary()` helper.
- `importance_tier` drifted between frontmatter and bottom metadata block on every save. Single-owner resolver closed the drift.
- Garbage trigger phrases (`and`, `graph`, generic bigrams) reached the search index. Sanitizer now blocks empirical junk classes before indexing.
- Predecessor discovery fabricated lineage from unrelated siblings. Title-family affinity guard (50% normalized token overlap) now prevents false lineage.
- `post-save-review.ts` silently skipped on unexpected errors. `REVIEWER_ERROR` status and structured D10/HIGH warnings now surface failures.

### Verification

| Check | Result |
|-------|--------|
| Phase 1 strict validation | PASS. `001-foundation-templates-truncation` validated cleanly. Served as clean baseline. |
| Phase 2 strict validation | PASS. `002-single-owner-metadata` validated cleanly. |
| Phase 3 strict validation | PASS. `003-sanitization-precedence` validated cleanly. |
| Phase 4 strict validation | PASS. `004-heuristics-refactor-guardrails` validated cleanly. |
| Phase 5 strict validation | PASS. `005-operations-tail-prs` validated cleanly. |
| Phase 1 checklist | Verified. Evidence consolidated in `implementation-summary.md`. |
| Phase 2 checklist | Verified. Evidence consolidated in `implementation-summary.md`. |
| Phase 3 checklist | Verified. Evidence consolidated in `implementation-summary.md`. |
| Phase 4 checklist | Verified. Evidence consolidated in `implementation-summary.md`. |
| Phase 5 checklist | Verified. Evidence consolidated in `implementation-summary.md`. |
| TypeScript type check (`tsc --noEmit`) | Clean after all workstreams. |
| Phase 4 PR-7 vitest | Pass. |
| Phase 4 PR-9 vitest | Pass (18/18). |
| Phase 1-3 and Phase 6 memory-quality vitest suites | Pass. |
| `post-save-review.vitest.ts` | Pass (with backward-compatible return-shape tweak). |
| Trigger-phrase sanitizer tests | Pass. |
| YAML parse check on `memory-save-quality-alerts.yml` | Pass. |
| Deep-review verdict | FAIL initially (0 P0, 13 P1, 9 P2). All 22 findings closed via 4 codex workstreams on branch `003-continuity-memory-runtime/002-fix-memory-quality`. |
| Parent strict validation | Partially blocked. Remaining blockers sit in out-of-scope packet-root `plan.md`, `tasks.md` and a saved `memory/` artifact. |

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/lib/truncate-on-word-boundary.ts` (NEW) | Shared word-boundary truncation helper. Migrated all callsites from raw clamp. |
| `scripts/lib/trigger-phrase-sanitizer.ts` (NEW) | D3 junk-class rules and allowlist. NFC normalization, max-length cap, control-char rejection added in RW-D. |
| `scripts/core/find-predecessor-memory.ts` (NEW) | Conservative predecessor discovery with title-family affinity guard and ambiguity skip. |
| `scripts/types/save-mode.ts` (NEW) | `SaveMode` enum replacing raw `_source` string branching across workflow. |
| `scripts/core/post-save-review.ts` | Accepts in-memory content. `REVIEWER_ERROR` status. `CHECK-D1` through `CHECK-D8` assertions. |
| `scripts/utils/input-normalizer.ts` | JSON fast-path coerces plain strings to structured shapes. Merges mixed-mode fields correctly. |
| `scripts/core/workflow.ts` | `SaveMode` threading. Authored trigger phrases authoritative over auto-generated bigrams. Predecessor gate narrowed for `SaveMode.Json`. |
| `session-extractor.ts` | Single-owner `importance_tier` resolver. Canonical packet doc discovery and ordered source rendering. |

### Follow-Ups

- Apply mode for PR-10 historical migration classifier remains deferred. Dry-run classification shipped. Reopen when operator-gated apply path is ready.
- PR-11 lock-hardening remains deferred. D9 candidate is documented with explicit reopen triggers (concurrency pressure threshold).
- Legacy callers of `reviewPostSaveQuality()` still fall back to file read when they do not pass `content`. Full removal requires updating those callers and tests in a follow-up.
- The `COMPLEXITY_MATCH` strict-validator warning on the parent packet (`Tasks (3) below minimum (4) for Level 2`) is a historical content-shape warning not targeted by any of the 22 deep-review findings. Remains open.
- Title-family overlap threshold in `find-predecessor-memory.ts` is set to 50%. Tune if edge cases surface in mixed-topic folders.
