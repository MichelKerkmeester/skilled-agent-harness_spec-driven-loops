---
title: "Implementation Summary"
description: "A new suite runs relocate.mjs and archive.sh with the true writers in a temp repository, so a removed pipeline step now fails a test."
trigger_phrases:
  - "real pipeline tests implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/010-real-pipeline-tests"
    last_updated_at: "2026-11-14T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built and verified the real pipeline suite, committed 5d84ff0e25"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/relocate-real-pipeline.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-real-pipeline-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-real-pipeline-tests |
| **Completed** | 2026-11-14, commit `5d84ff0e25` |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`relocate-real-pipeline.vitest.ts` runs `relocate.mjs` and `archive.sh` with the true writers in a committed temp repository, so a removed pipeline step now fails a test.

### Phase 10: real-pipeline-tests

- **Builder.** `buildRealPipelineRepo` in `fixtures/subtrack-tree.mjs` builds the repository with copies of the writers that write beside themselves, `node_modules` linked and the `@spec-kit` packages pointed at the copies. The worker's report lists what each writer reads and writes.
- **Guard.** `beforeAll` and `afterAll` compare `git status --porcelain` of the stores the writers touch in the real checkout and fail on any difference.
- **Cases.** A sub-track map applied twice, reading `description.json`, `graph-metadata.json`, the track's `children_ids` and a strict validation. A resume after the redirect table step fails once, and one after the identity step fails once, each through a wrapper around the true writer. A renumbering restore through the true `archive.sh`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate-real-pipeline.vitest.ts` | Created | Four cases and the guard |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs` | Modified | The builder and its helpers, added beside the existing ones |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two `dsh` briefs to DeepSeek V4.1 Flash at max reasoning: the builder, guard and happy path first, then the resume and restore cases. The orchestrator reran the suite, ran the mutation check itself in two forms and ran the full CLI suite. Evidence: `scratch/build-evidence.md`, `scratch/mutation.txt`, `scratch/reproduce.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend `subtrack-tree.mjs` instead of a new fixture file | The builder could be added beside the existing ones without changing them |
| Run writers that write beside themselves from copies | `generate-trigger-index.mjs` and the `validate.sh` freshness cache would otherwise write into the real checkout |
| `RELOCATE_REAL_PIPELINE_SOURCE` points the suite at another `relocate.mjs` | It exists only for the mutation check and is unset by default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New suite on the committed scripts | 4 passed, exit 0, about 31 s |
| New suite with the migrate call removed | Fails on the `parentChain` assertion, exit 1 (`scratch/mutation.txt`) |
| The two stubbed suites on the same mutant | 1 of 101 failed, exit 1. Reviewer A saw them green; a phase 006 case now catches it (`scratch/reproduce.txt`) |
| Full CLI `npm test` | PASS: 212 files, 2603 passed, 0 failed, exit 0 |
| `validate.sh --strict --recursive` on the parent | `RESULT: PASSED` for each folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime freshness.** The builder fails with the rebuild command when the checkout's compiled runtime is stale, so the suite needs a built runtime.
2. **Timing.** No separate timing file was written. The suite takes about 31 s for four cases.
<!-- /ANCHOR:limitations -->

---
