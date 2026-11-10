---
title: "Implementation Summary"
description: "A bare Gate 1 lookup from a project checkout that links into a host now reads that host's index, scoped to the project's track, and a bare generation there is refused instead of writing a partial index."
trigger_phrases:
  - "linked project host index implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/022-linked-project-host-index"
    last_updated_at: "2026-11-09T15:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-linked-project-host-index |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate 1 now works from a Barter project checkout with no flag.

### Phase 22: linked-project-host-index

`owningHostRoot` in `host-index.mjs` returns the git toplevel that holds the real location of a project's `.skilled` tree, when that repository differs from the project and keeps an index. The lookup reads the caller's own index first, then that owner's, then the packaged one. Reading an owner's index, it scopes to the folder the project's `specs` link points to, keeps host-relative paths and prints a `paths` line naming the host. `--spec-folder ""` unscopes. The generator refuses a bare run from a linked project with no index of its own and names the host. The data README describes the layout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `R/lib/host-index.mjs` | Modified | `owningHostRoot`, `isFile` |
| `R/lookup-trigger-index.mjs` | Modified | `defaultIndexSelection`, default scope, `paths` line, empty `--spec-folder` |
| `R/generate-trigger-index.mjs` | Modified | Refuse a bare run from a linked project |
| `runtime/cli/tests/host-trigger-index.vitest.ts` | Modified | 8 linked-project cases |
| `runtime/data/README.md` | Modified | Linked Project Checkouts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. Two DeepSeek V4.1 Flash briefs through cli-pi wrote the code, the tests and the README, because cli-codex is out of quota until 2026-11-13. The lead reviewed both diffs, asked for the own-index exemption in a follow-up, reran the suites and ran the Barter reproduction from `backend-system` read-only with this worktree's scripts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the owner in the lookup, not through `/doctor:symlink` | Every linked project works with no setup step |
| Owner is the vendored tree's git toplevel, never an ancestor walk | An unrelated repository higher up is not the project's host |
| Default scope to the linked track, host-relative paths | One path spelling, and the scope line says what applied |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five lookup and trigger-index files | 143 passed and 1 skipped before |
| Seven retrieval files | 173 passed and 1 skipped after the main change; host and trigger-index files 81 passed after the follow-up |
| cli vitest project | 2439 passed before (phase 021 close), 2447 passed and 20 skipped after, none failing |
| Barter lookup from `backend-system`, read-only | 0 candidates before, 1 after, source `../ai-speckit/.speckit-index/trigger-index.json` |
| Barter bare generation from `backend-system`, read-only | exit 2 naming ai-speckit, nothing written |
| validate.sh --strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Owner layout.** The owner must be the git toplevel of the vendored tree's real location. A tree vendored as its own repository inside the host would name itself, and `--index` is the way through.
2. **Cross-track questions.** From a project, an answer in another track needs `--spec-folder ""`.
3. **Retrieval docs.** `runtime/cli/retrieval/README.md` and `references/retrieval/retrieval-conventions.md` describe only a caller's own index.
<!-- /ANCHOR:limitations -->

---
