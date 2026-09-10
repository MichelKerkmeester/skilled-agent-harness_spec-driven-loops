---
title: "Implementation Summary: Auto re-mint a hub routing manifest at commit time"
description: "What the gate does, the measured trigger set behind it, and the three cases proved against the real hook."
trigger_phrases:
  - "route remint summary"
  - "pre-commit remint results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/017-routing-manifest-auto-remint"
    last_updated_at: "2026-09-10T09:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added the gate and proved three cases against the hook"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-10-routing-auto-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Auto re-mint a hub routing manifest at commit time

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:status -->
## 1. STATUS

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Surface** | `.opencode/scripts/git-hooks/pre-commit`, one added block |
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:what -->
## 2. WHAT IT DOES

When a commit stages a routing input for one of the five hubs, the gate re-mints that hub, copies the runtime manifest over its authored counterpart and stages both, then lets the commit through. It prints one line naming the hub it fixed. When the same hub has an input staged and unstaged at once it refuses instead, because minting reads the working tree and the manifest would then describe content the commit does not carry.

This departs from the block-and-instruct shape of every gate above it, and the departure is confined to this artifact. The manifest is derived from the staged inputs with no judgment involved, so printing a command for a human to run is pure toil. The pre-push route gate is unchanged and remains the backstop if a mint ever fails.
<!-- /ANCHOR:what -->

---

<!-- ANCHOR:trigger -->
## 3. THE MEASURED TRIGGER

`loadCanonicalRouterInputs` reads three files at the hub root, but the compiler resolves the leaves the registry declares, so nested content reaches the hash too. Probing one file class at a time against the route guard settled it:

| Touched | Manifest |
|---|---|
| hub root `SKILL.md` | stale |
| nested mode `SKILL.md` | stale |
| `hub-router.json`, `mode-registry.json` | stale, direct hash inputs |
| `ROUTER.md`, `references/`, `README.md`, `assets/` | fresh |

The gate matches exactly that set. A wider trigger would re-mint on edits that change nothing, and a narrower one would miss the nested case, which is the case that actually bit.
<!-- /ANCHOR:trigger -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

Run against the real hook, with the tree restored afterwards and the guard reporting every hub fresh.

- `bash -n` on the hook: clean.
- No routing input staged: zero `route-remint` output, no work done.
- A nested mode `SKILL.md` staged: `re-minted cli-external-orchestration and staged both manifests`, the index carried the edit plus both manifests, and the guard reported the hub fresh.
- The same input staged and unstaged at once: exit code 1 with the file named.

Restored state after testing: index empty, no dirty file under the hub or either manifest root, all five hubs fresh.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

`git revert` the commit. The installed hook is a symlink to the tracked file, so every session picks the revert up at once with no reinstall. `SPECKIT_SKIP_ROUTE_REMINT=1` skips the block for one commit.
<!-- /ANCHOR:rollback -->
