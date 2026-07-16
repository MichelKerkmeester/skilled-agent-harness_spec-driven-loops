---
title: "Scouted Bugfix Batch 5: 3 Fixes from the Verify-First Round-3 Tail"
description: "Verify-first round-3 tail: 4 originally-unconfirmed targets re-confirmed by a gpt-5.5-fast confirm pass; 1 (cli-devin phantom dangerous permission rows) already shipped via parallel 130/014, so this packet lands the remaining 3 with regression tests. Fixes: D4-R grader dim_id mismatch capping confidence at 0.3, handover freshness timestamp field mismatch dropping to mtime, and updatePhaseParentPointer bypassing Zod schema validation on the highest-frequency graph-metadata mutation path."
trigger_phrases:
  - "scouted bugfix batch 5"
  - "d4-r grader dim_id mismatch"
  - "handover freshness timestamp field"
  - "updatePhaseParentPointer bypasses zod"
  - "verify-first round-3 tail"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train`

### Summary

The fifth batch of the scouted bugfix train closed out the verify-first round-3 tail. Four targets originally classified as unconfirmed were re-examined by a gpt-5.5-fast confirm pass and all four were confirmed against the real code. One of the four — the cli-devin phantom "dangerous" permission rows — had already shipped via parallel `130/014` cli-doc work, so it was deduped and left untouched. The remaining 3 confirmed defects were fixed by implement-and-test agents on disjoint file sets: the D4-R grader system prompt emitting `"dim_id": "D4R"` (no hyphen) while the harness strict-equals `'D4-R'`, silently capping confidence at 0.3 and injecting a mismatch annotation on every real D4-R grade (invisible in tests because the mock path injects the caller-supplied dimId → prompt changed to `"dim_id": "D4-R"`); handover freshness in `parseHandoverSignal()` only trying `last_updated` / `last_updated_at` top-level so `updated:` (top-level) and `last_updated_at:` under `_memory.continuity:` fell through to the unreliable mtime fallback (single frontmatter extraction + `updated` alias + continuity-block fallback; 11/11 tests); and `updatePhaseParentPointer`, the highest-frequency graph-metadata mutation path, reading via plain `JSON.parse` and writing via `atomicWriteJson` with NO schema validation, silently accepting malformed timestamps / empty `last_active_child_id` (parse with `graphMetadataSchema` Zod before mutating; typed `GraphMetadata` value). Every fix ships with a regression test; affected TS typechecks clean.

### Added

- 2 regression tests for handover freshness resolving `updated:` top-level and `last_updated_at:` under `_memory.continuity:` (`resume-ladder.vitest.ts`; 9 pre-existing + 2 new = 11/11).
- `phase-parent-pointer.vitest.ts` regression test for the Zod-validated phase-parent pointer mutation path.

### Changed

- `system-grader-task-outcome.md`: the D4-R system prompt now instructs the grader to return `"dim_id": "D4-R"` (hyphenated) to match the harness strict-equality against `'D4-R'`.
- `resume-ladder.ts` `parseHandoverSignal()`: frontmatter is extracted once; an `updated` top-level alias and a `last_updated_at`-under-`_memory.continuity` fallback are resolved before the mtime fallback.
- `generate-context.ts` `updatePhaseParentPointer`: the on-disk graph-metadata file is parsed with `graphMetadataSchema` (Zod) before mutating, and a typed `GraphMetadata` value is constructed and written.

### Fixed

- `system-grader-task-outcome.md`: the D4-R prompt told the grader to return `"dim_id": "D4R"` (no hyphen) while the harness compares with strict equality against `'D4-R'`, silently capping confidence at 0.3 and injecting a mismatch annotation on every real D4-R grade. Invisible in tests because the mock path injects the caller-supplied dimId. Prompt changed to `"dim_id": "D4-R"`.
- `resume-ladder.ts`: `parseHandoverSignal()` only tried `last_updated` and `last_updated_at` top-level fields, so live handovers using `updated:` (top-level) or `last_updated_at:` indented under `_memory.continuity:` fell through to the unreliable mtime fallback. Frontmatter is now extracted once with an `updated` alias and a continuity-block fallback. 11/11 tests pass.
- `generate-context.ts`: `updatePhaseParentPointer` — the highest-frequency graph-metadata mutation path — read via plain `JSON.parse` and wrote via `atomicWriteJson` with NO schema validation, silently accepting malformed timestamps / empty `last_active_child_id`. The on-disk file is now parsed with `graphMetadataSchema` (Zod) before mutating and a typed `GraphMetadata` value is constructed.

### Verification

| Check | Result |
|-------|--------|
| 4 round-3-tail candidates re-confirmed by gpt-5.5-fast before any edit | PASS — 4 CONFIRMED; 1 deduped (already shipped via `130/014`) |
| The deduped candidate not acted on | PASS — cli-devin phantom-permission-rows left unedited |
| Each of the 3 fixes has a passing regression test | PASS — resume-ladder 11/11; phase-parent-pointer via `tsx`; D4-R grade no longer capped |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Typecheck | PASS — system-spec-kit resume-ladder + generate-context typecheck clean |
| Scope leak | PASS — edits confined to the confirmed-defect files (sources + regression tests) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `system-grader-task-outcome.md` | Modified | D4-R prompt `"dim_id": "D4R"` → `"dim_id": "D4-R"` matching harness strict-equality |
| `resume-ladder.ts` + `resume-ladder.vitest.ts` | Modified | Single frontmatter extraction; `updated` alias + continuity-block fallback for handover freshness (11/11) |
| `generate-context.ts` + `phase-parent-pointer.vitest.ts` | Modified / Added | Zod-validated phase-parent pointer mutation; typed `GraphMetadata` value |

### Follow-Ups

- Deploy: recycle the mk-spec-memory daemon after commit so the `resume-ladder.ts` and `generate-context.ts` fixes take effect in the running daemon. The grader prompt (`system-grader-task-outcome.md`) is read at benchmark dispatch time; no daemon recycle needed.
- The cli-devin phantom "dangerous" permission rows target stays out-of-scope here — already shipped via parallel `130/014` cli-doc work.
- vitest segfaults on Node v25 in this env; the phase-parent-pointer test runs green via `tsx` (known environment issue, not a fix problem).
