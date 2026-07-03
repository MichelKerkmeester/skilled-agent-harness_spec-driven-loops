---
title: "Implementation Summary: Rename the deep router agent to deep-loop"
description: "The primary deep-loop router agent is now named `deep-loop` instead of `deep`, giving it one identity that no longer collides with the `/deep:*` command namespace or the `deep-*` leaf agents. Renamed across all three runtime mirrors; sibling agents, commands, and the registry are untouched."
trigger_phrases:
  - "deep router rename summary"
  - "deep-loop agent summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "deep-loops/037-deep-router-agent-rename"
    last_updated_at: "2026-07-03T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renamed and verified; ready to commit and push"
    next_safe_action: "Commit the tracked rename and push the branch"
    blockers: []
    key_files:
      - ".opencode/agents/deep-loop.md"
      - ".claude/agents/deep-loop.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-deep-router-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Rename the deep router agent to deep-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-deep-router-agent-rename |
| **Completed** | 2026-07-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The primary deep-loop router agent now answers to a single, unambiguous name: `deep-loop`. Before, it was named `deep`, which collided visually with the `/deep:*` command namespace, the `deep-loop-workflows` and `deep-loop-runtime` skills, and the `deep-research` / `deep-review` / `deep-context` leaf agents. You can now read `@deep-loop` and know it means the router, nothing else.

### Router identity

The router definition was renamed from `deep.md` to `deep-loop.md` in all three runtime mirrors, its `name:` field set to `deep-loop`, and its internal cross-runtime mirror note repointed at the new filenames.

### Routing-boundary references

The three `orchestrate.md` mirrors carry a boundary rule that forbids Task-dispatching the router as a worker. Their bare `@deep` references were updated to `@deep-loop`. A negative-lookahead pattern (`@deep(?![-\w])`) ensured the sibling leaf mentions (`@deep-research`, `@deep-review`, `@deep-context`) were left alone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/agents/deep-loop.md | Renamed (from deep.md) | Router identity, tracked (git mv) |
| .claude/agents/deep-loop.md | Renamed (from deep.md) | Router identity, tracked (git mv) |
| .codex/agents/deep-loop.md | Renamed (from deep.md) | Router identity, untracked, on-disk parity only |
| .opencode/agents/orchestrate.md | Modified | `@deep` → `@deep-loop` boundary references |
| .claude/agents/orchestrate.md | Modified | `@deep` → `@deep-loop` boundary references |
| .codex/agents/orchestrate.md | Modified | `@deep` → `@deep-loop` (untracked) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scoped mechanical rename, verified by search: `git mv` for the two tracked mirrors, an on-disk rename for the untracked codex mirror, then `sed`/`perl` edits for the name field, mirror notes, and the `@deep` boundary references. Every git add was scoped to exact paths because a concurrent session held unrelated dirty files in the shared working tree, and the staged set was confirmed leak-free before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rename the agent only, not the `/deep:*` commands | The user asked to rename the agent; the command namespace is a separate surface and renaming it would be a much larger, unrequested blast radius |
| Leave the codex mirror untracked | It was untracked before; starting to track it is a separate policy decision, so it was renamed on disk for runtime parity only |
| Do not touch historical spec-folder `@deep` mentions | They are frozen records of past state; rewriting them would be retroactive history editing |
| Negative-lookahead replace `@deep(?![-\w])` | Guarantees the sibling `@deep-<mode>` leaf agents are never caught by the rename |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Router files renamed with `name: deep-loop` | PASS - all three mirrors declare `name: deep-loop`; no `deep.md` router file remains |
| Zero bare `@deep` router refs in live files | PASS - `@deep(?![-\w])` returns 0 across the agent and orchestrate files |
| Sibling leaf agents / `/deep:*` commands / registry untouched | PASS - no changes outside the six named files |
| Codex mirror parity | PASS - diff identical to opencode modulo the path-convention line |
| validate.sh --strict (this spec folder) | See closeout commit; 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex mirror is not in version control.** `.codex/agents/deep-loop.md` and `.codex/agents/orchestrate.md` were renamed/edited on disk for runtime parity but remain untracked, matching their prior state. If codex agents should be tracked, that is a separate change.
<!-- /ANCHOR:limitations -->
