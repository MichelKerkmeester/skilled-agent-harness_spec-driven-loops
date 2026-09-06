---
title: "Implementation Summary"
description: "The trigger index covers skill documents again after the generator learned to find the repository root by its anchors, and the README's rule count now checks itself against the registry."
trigger_phrases:
  - "trigger index repo root regression"
  - "findRepoRoot anchor derivation"
  - "skill documents vanished published index"
  - "46 rule became 37 registry"
  - "retrieval-repo-root vitest"
  - "validator registry doc count test"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/023-trigger-index-root-and-drift-fixes/001-index-root-and-docs"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "template-author"
    recent_action: "Index root fixed, counts pinned"
    next_safe_action: "None; phase complete, proceed to 002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:7d160ff81ac3484b1f4f4d36c0a83aad00df29c4271afd090c91f0b6b3de3a50"
      session_id: "scaffold-001-index-root-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-index-root-and-docs |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The trigger-index generator counted five parent hops to find the repository root. After the CLI nested one level deeper that landed on `.opencode`, and the `.opencode/specs` symlink kept spec documents flowing while every skill document vanished from the published index. The generator now walks up to the directory that holds both `.opencode` and `specs`, the index is regenerated with 1,864 skill documents, and a test pins the derivation. The skill README's "46-rule registry" became the registry's real 37, with a test that reads the docs and the registry together.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | Anchor-based `findRepoRoot()` |
| `runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/*.json` | Regenerate | Full corpus coverage |
| `runtime/cli/tests/retrieval-repo-root.vitest.ts` | Add | Root and corpus coverage regression |
| `runtime/cli/tests/validator-registry-doc-count.vitest.ts` | Add | Documented count equals registry length |
| `README.md`, `runtime/cli/tests/test-validation-extended.sh` | Modify | Rule count 37 |
| `runtime/api/README.md` | Modify | Boundary paragraph |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GLM 5.3 Flash lane through OpenRouter made the edits from a prompt naming each finding, its fix and its verification command; every claim was rerun here before commit `d1fae9e15c`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Walk to anchors instead of adding one hop | A hop count broke once when the tree deepened and would break again |
| Test the documented count against the registry | The number was copied five times without a check; the test makes the next drift fail loudly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `DEFAULT_REPO_ROOT` | the repository path |
| `walkCorpus` skill files | 8,054 |
| Index paths by root | `.opencode/skills` 1,864; install guides 2; `specs/` 11,597 |
| Two generator runs | identical index sha |
| New tests, parity and trigger-index suites | 4 of 4; 63 of 63 |
| Typecheck, build, freshness | exit 0, built, fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The v3.9 changelog still records the count as 46; it is history and stays.
<!-- /ANCHOR:limitations -->
