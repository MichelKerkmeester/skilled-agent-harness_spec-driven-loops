---
title: "Implementation Summary: Phase 4 save-and-resume-freshness"
description: "A canonical save now proves the committed trigger index matches the packet's own trigger_phrases instead of only logging a manual reminder, and the resume ladder no longer lets a malformed continuity record or a merely-newer unbound handover outrank validated, packet-bound continuity."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/004-save-and-resume-freshness"
    last_updated_at: "2026-09-05T09:30:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Shipped save-time trigger-index freshness and resume-ladder trust ranking"
    next_safe_action: "Review phase 005 hook-fallback-failure-signal before starting it"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts"
    session_dedup:
      fingerprint: "sha256:94720d30ee75336bf474f95bb83675ced4ec09bb06088fd22b5f44c93a4e65d8"
      session_id: "2026-09-05-054-004-save-and-resume-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-save-and-resume-freshness |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A canonical save now proves whether the committed trigger index reflects the saved packet's own `trigger_phrases`, instead of only logging a reminder to run the generator by hand. Separately, the resume ladder no longer trusts a continuity record that fails strict validation through a lenient manual field extraction, and it no longer lets a merely-newer, unbound `handover.md` outrank a validated, packet-bound continuity record — a handover only wins on freshness when it declares a packet pointer and a content fingerprint that verify against the resolved folder.

### Save-Time Trigger-Index Staleness

`workflow.ts`'s Step 11 gained `checkTriggerIndexFreshness`, which reads the saved packet's `spec.md` frontmatter through the retrieval package's own `readTriggerPhrases` parser, loads the committed `runtime/data/trigger-index.json` through its own `loadIndex` reader, and compares the two phrase sets by exact set-equality. A mismatch logs a `STALE` warning naming the added/removed phrases and is added to the workflow's `warnings` output; an unchanged match logs a quiet confirmation; a packet with no declared phrases or an unreadable index degrades to the original reminder-only line, never failing the save. The retrieval modules are resolved by locating the real `scripts/retrieval` directory relative to `workflow.ts`'s own on-disk location (checking both the TS-source and compiled-dist layouts) rather than through `CONFIG.PROJECT_ROOT`, which a caller can point at a throwaway workspace.

### Resume-Ladder Trust Ranking

`parseContinuitySignal` now returns `null` outright when `readThinContinuityRecord` fails strict validation, deleting the manual-extraction fallback that used to re-derive `packet_pointer`/`last_updated_at`/etc. from the raw frontmatter block without any of the same checks. The handover-versus-continuity comparison in `buildResumeLadder` now computes `handoverBindingVerifies` — true only when the handover's own optional `_memory.continuity` block declares a `packet_pointer` matching the resolved spec folder and a `session_dedup.fingerprint` that equals `buildContinuityFingerprint` of the continuity document's actual current content — and picks continuity unconditionally when that check fails, falling back to the prior newer-wins comparison only when it passes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify | Replaced the reminder-only trigger-index log with `checkTriggerIndexFreshness` (plus `loadTriggerIndexRetrievalLibrary`), wired into Step 11 |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-trigger-index-freshness.vitest.ts` | Add | 7 tests: fresh, added-phrase stale, removed-phrase stale, one-word-change stale, no-phrases, missing spec.md, unparseable index |
| `.opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts` | Modify | `parseContinuitySignal` strict rejection (dropped the unused `resolvedSpecFolder` param); added `extractHandoverBinding`/`handoverBindingVerifies`; rewired the handover-vs-continuity comparison; replaced the now-dead `extractContinuityList` with `extractNestedContinuityField` |
| `.opencode/skills/system-spec-kit/runtime/tests/resume-ladder.vitest.ts` | Modify | Fixed the shared `buildImplementationSummary` default and two overrides that silently failed strict continuity validation (previously masked by the removed fallback); updated the Unicode-packet-pointer test to the correct fall-through behavior; extended `buildHandover` with an optional packet-binding block; added 3 dedicated trust-ranking tests |
| `.opencode/skills/system-spec-kit/runtime/tests/path-boundary.vitest.ts` | Modify | One assertion fixed: "maps in-root absolute specFolder values back to packet-relative folders" built an unbound-but-newer handover alongside valid continuity and asserted handover won — the exact bug REQ-003 closes. The path-resolution behavior it actually tests is unchanged; only the expected winning tier moved from `handover` to `continuity` |
| `.opencode/skills/system-spec-kit/runtime/lib/resume/README.md` | Modify | Corrected the frontmatter description, overview prose, both ASCII flow diagrams and the key-files row, which all described the old fixed `handover.md`-then-`_memory.continuity` precedence this phase replaced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read both target files and their existing tests first to confirm exact line ranges and current behavior (the spec's cited line numbers had already drifted). Traced the retrieval package's shape (`lookup-trigger-index.mjs`, `lib/frontmatter.mjs`, `lib/corpus.mjs`) to reuse `loadIndex`/`readTriggerPhrases`/`canonicalRelativePath` rather than re-implement frontmatter parsing or index reading; confirmed a non-literal dynamic `import()` path lets `workflow.ts` load those plain-JS modules without tripping the scripts package's missing-declaration typecheck. Traced `resume-ladder.ts`'s existing continuity/handover parsing to find the one safe way to add a fingerprint-verified escape hatch without touching `parseHandoverSignal`'s own contract or the handover template's shape (both explicitly out of scope). Ran the pre-existing `resume-ladder.vitest.ts` suite before editing anything else, found 3 of 12 tests failing once the lenient fallback was removed, and traced each failure to its root cause (an already-invalid default fixture field, two individually-invalid `next_safe_action` overrides, and a Unicode `packet_pointer` that has always failed strict shape validation) rather than reintroducing leniency to make them pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Warn-first, not auto-regenerate, on a stale index at save time | Matches the spec's recorded default-safe choice (Open Questions); auto-regeneration's wall-clock cost is Phase 3's to measure, and a warn-only path is always safe to ship first |
| Compare only `spec.md`'s trigger phrases, not every canonical doc in the folder | Mirrors the existing `extractSpecFolderContext`/`specContext.triggerPhrases` convention already used elsewhere in `workflow.ts` for "the packet's trigger phrases"; keeps the check to one frontmatter read per NFR-P01 |
| Locate the retrieval modules from `workflow.ts`'s own on-disk location, not `CONFIG.PROJECT_ROOT` | `CONFIG.PROJECT_ROOT` is a caller-mutable value (the canonical-save integration test points it at a throwaway temp root); the retrieval package's real location never moves relative to `workflow.ts` |
| Left `generate-context.ts` untouched | The staleness result already reaches the save's own CLI output through the existing `log`/`warn` closures (`structuredLog`), the same mechanism the prior reminder-only line already used; no additional plumbing was needed there |
| Fixed the pre-existing test fixtures rather than reintroducing the fallback to keep them green | Three tests were passing only because a schema-invalid continuity record was being silently salvaged by the exact fallback REQ-002 requires removed; the fixtures' bugs predate this phase but the fallback masked them |
| Fixed `path-boundary.vitest.ts`'s one affected assertion even though it sits outside the plan's named file list | It is a real consumer of `resume-ladder.ts` that the plan's own consumer-inventory grep names as required reading; its fixture encoded the exact unbound-newer-handover bug REQ-003 closes, and leaving it red would be an unreported regression |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Scripts typecheck | `npx tsc --noEmit -p tsconfig.json` (in `scripts/`) | Exit 0 |
| Runtime typecheck | `npx tsc --noEmit --composite false -p tsconfig.json` (in `runtime/`) | Exit 0 |
| Resume-ladder + thin-continuity-record suites | `npx vitest run tests/resume-ladder.vitest.ts tests/thin-continuity-record.vitest.ts` (in `runtime/`) | 20/20 passed (baseline pre-edit: 17/17) |
| Consumer inventory: every other `resume-ladder.ts` importer | `rg -n "resume-ladder" .opencode/skills/system-spec-kit --glob '*.ts' -l` then `npx vitest run tests/path-boundary.vitest.ts tests/generator-hardening.vitest.ts` (in `runtime/`) | 23/23 passed after fixing one path-boundary.vitest.ts assertion that encoded the same pre-existing bug REQ-003 closes |
| Workflow regression suites + new staleness suite | `npx --prefix scripts vitest run --config runtime/vitest.config.ts scripts/tests/workflow-invariance.vitest.ts scripts/tests/workflow-canonical-save-metadata.vitest.ts scripts/tests/workflow-step115-daemon-guard.vitest.ts scripts/tests/task-enrichment.vitest.ts scripts/tests/workflow-trigger-index-freshness.vitest.ts` | 75 passed, 1 skipped (baseline pre-edit for the first 4 files: 68 passed, 1 skipped) |
| Scripts dist rebuild | `node lib/dist-freshness.cjs prepare-build --package system-spec-kit/scripts && npm run build && node lib/dist-freshness.cjs record-build --package system-spec-kit/scripts` | Exit 0 |
| Runtime dist rebuild | `npm run build` (in `runtime/`) | Exit 0 |
| CLI entry point smoke check | `node scripts/dist/memory/generate-context.js --help` | Exit 0 |
| Phase folder strict validation | `NODE_PRESERVE_SYMLINKS=1 bash scripts/spec/validate.sh <phase folder> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Continuity's `packet_pointer` shape check is ASCII-only.** A spec folder whose name contains non-ASCII characters fails `readThinContinuityRecord`'s strict `packet_pointer` validation regardless of every other field being well-formed, so the resume ladder correctly falls through to the spec-doc tier for such a folder rather than recovering continuity. This is a pre-existing, unrelated constraint in `thin-continuity-record.ts` (out of this phase's scope per the plan's dependency note); it surfaced only because removing the lenient manual-extraction fallback stopped silently working around it.
2. **Auto-regeneration of the trigger index at save time is not implemented.** Per the spec's recorded Open Question, this phase ships the warn-first path only; wiring an inline regenerate branch is a follow-up once Phase 3 confirms the generator's wall-clock cost.
<!-- /ANCHOR:limitations -->

---


