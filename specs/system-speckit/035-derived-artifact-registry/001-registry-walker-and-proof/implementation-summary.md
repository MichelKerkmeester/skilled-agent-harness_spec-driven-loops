---
title: "Implementation Summary"
description: "The phase has not executed yet. This summary records the pre-implementation state, the files the phase will create, and the evidence each completion claim must carry."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-derived-artifact-registry/001-registry-walker-and-proof"
    last_updated_at: "2026-09-11T06:37:37Z"
    last_updated_by: "template-author"
    recent_action: "Initialized the pre-implementation record"
    next_safe_action: "Execute the phase and replace this file with what shipped"
    blockers: []
    key_files:
      - "specs/system-speckit/035-derived-artifact-registry/001-registry-walker-and-proof/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-registry-walker-and-proof"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 001-registry-walker-and-proof |
| **Completed** | not yet, phase is in Draft |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. Nothing in this packet exists outside the specification. This summary is written before the work so the files the phase will touch are named in one place and the completion claims cannot be filled in retroactively.

### Phase 1: registry-walker-and-proof

When it executes, this phase creates `runtime/cli/lib/derived-artifacts.json`, the registry that names the three derived artifacts with their sources, generators and targets. It creates `runtime/cli/spec/derive-artifacts.mjs`, the walker that answers whether any target is out of date and regenerates through each entry's declared generator. It creates `runtime/tests/derive-artifacts.vitest.ts`, which carries one staling case per registry entry.

No existing file is edited. `runtime/cli/lib/validator-registry.json` is read as the schema precedent, `runtime/cli/graph/backfill-graph-metadata.ts` is read for the fingerprint recipe, and `.opencode/bin/compiled-route-guard.cjs` is invoked as the routing check. None of them changes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/lib/derived-artifacts.json` | Create, planned | The registry, three entries |
| `runtime/cli/spec/derive-artifacts.mjs` | Create, planned | The walker with `--check` and `--write` |
| `runtime/tests/derive-artifacts.vitest.ts` | Create, planned | One staling case per entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The delivery path the phase must follow is: test the `make -q` claim first, freeze the entry schema, implement one check at a time, then prove each entry with a staling case in a scratch worktree. The completion claim requires all three cases green, a byte-identical `git status --porcelain` before and after `--check`, and a `validate.sh --strict` run recorded from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Registry beside `validator-registry.json` | That directory already owns machine-readable policy tables, so both are found in one place |
| Exit codes normalized to 0, 1 and 2 | The three wrapped tools disagree today, so the walker is the only place the disagreement is resolved |
| Checks delegate to the owning tool or its recipe | A second implementation of fingerprinting is a second thing to keep in sync |
| The phase edits no existing file | A concurrent session is committing to this repository, and an additive phase cannot collide with it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase | Not run, phase is in Draft |
| Determinism of two `--check` runs | Not run, walker does not exist yet |
| One staling case per registry entry | Not run, test file does not exist yet |
| `git status --porcelain` before and after `--check` | Not run, walker does not exist yet |
| `make -q` observation | Not run, recorded in plan ADR-002 as an open test |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This summary is a plan.** It cannot be treated as evidence that anything shipped. Replace it during phase execution with the observed results, including the exact commands and their exit codes.

2. **The registry starts with three entries.** Mirrors, dist freshness and the MCP mutation class keep their own gates until these three are proved, so the registry is not yet the whole answer to what is derived.
<!-- /ANCHOR:limitations -->

---

