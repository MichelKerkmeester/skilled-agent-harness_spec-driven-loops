---
title: "Implementation Summary: JSON Cleanup and Advisor-Metadata Conventions"
description: "Removed the one dead advisor-metadata residue and codified the placement rule in the doctrine, the parent-hub checker (recursive rule 2b), and AGENTS.md, so a nested description.json now fails the checker instead of passing silently."
trigger_phrases:
  - "advisor metadata cleanup summary"
  - "parent-skill-check rule 2b"
  - "prompt-models description residue removed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/001-json-cleanup-and-conventions"
    last_updated_at: "2026-07-22T08:59:26Z"
    last_updated_by: "claude"
    recent_action: "Shipped and verified all four changes."
    next_safe_action: "Proceed to phase 002 (reference/asset template alignment)."
    blockers: []
    key_files:
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
      - ".opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-021-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-json-cleanup-and-conventions |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill tree carried one piece of dead advisor-metadata residue and no guard against more of it. This phase removed the residue and closed the gap that let it exist.

### The convention, now enforced

`description.json` and `graph-metadata.json` exist in two unrelated schemas that share filenames: spec-folder continuity metadata and skill-advisor hub-identity metadata. The advisor pair belongs only at a routable unit, a parent-hub root or a standalone-skill root, never inside a mode packet. The checker already enforced this recursively for `graph-metadata.json` (rule 2a) but not for `description.json`. A new `findDescriptionJson` collector plus rule 2b closes that asymmetry: a nested `description.json` now fails the checker.

### The residue, removed

`sk-prompt/prompt-models/description.json` was merge residue from when `sk-prompt-models` was folded into `sk-prompt` as a mode. A JSON audit grep-proved it has no runtime consumer, and its own content disclaimed advisor-discoverability. It is deleted.

### The doctrine and AGENTS.md, updated

`parent-skills-nested-packets.md` now names both files as hub-only. AGENTS.md §8 gains a two-schema disambiguation and the placement rule, with a pointer to the doctrine and the checker.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `parent-skill-check.cjs` | Modified | `findDescriptionJson` + recursive rule 2b |
| `parent-skills-nested-packets.md` | Modified | State the description.json placement rule |
| `AGENTS.md` | Modified | Two-schema disambiguation + placement rule |
| `sk-prompt/prompt-models/description.json` | Deleted | Dead advisor-metadata residue |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Harden first so the removal is self-verifying. Rule 2b was added and confirmed to FAIL on the live residue, then the residue was deleted and the same check confirmed to PASS. The modified checker parses under `node --check`, and a repo-wide scan confirms no nested `description.json` remains in any checked hub. Nothing in the runtime routing, serving, or advisor path changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror rule 2a exactly for rule 2b | The two files are the same class of hub-only identity, so the checker stays internally consistent |
| Harden before deleting | The new rule turns the deletion into a self-verifying regression rather than a blind removal |
| Leave the `10a-manifest-source` path bug alone | It is pre-existing and global (fails on every hub with this phase's edits stashed); fixing it belongs with the create-skill/scripts work in phase 005 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rule 2b before removal | FAIL (caught `prompt-models/description.json`) |
| Rule 2b after removal | PASS |
| `node --check` on the checker | PASS |
| Nested `description.json` in a checked hub | None (only `system-spec-kit` spec fixtures remain, not a checked hub) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `10a-manifest-source` checker rule fails on every hub.** Pre-existing path-resolution bug, unrelated to this phase (confirmed by stashing this phase's edits). Tracked in `../context-index.md` for phase 005.
2. **Rules 2a and 2b false-positive if pointed at `system-spec-kit`.** Its `scripts/**` holds spec-folder-schema fixtures named `description.json`/`graph-metadata.json`. system-spec-kit is not one of the 7 checked parent hubs, so the checker is never run against it in practice.
<!-- /ANCHOR:limitations -->
