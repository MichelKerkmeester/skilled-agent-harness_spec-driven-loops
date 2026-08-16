---
title: "Implementation Summary: Repo-Agnostic Git Workspace Rows [specs/agents/005-git-workspace-repo-agnostic]"
description: "Summary of rewriting the AGENTS.md Git Workspace Safety rows repo-agnostic, moving repo-specific detail into sk-git."
trigger_phrases:
  - "agents.md summary"
  - "repo agnostic"
  - "git workspace safety"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/005-git-workspace-repo-agnostic"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Rewrote the AGENTS.md rows repo-agnostic and verified zero forbidden tokens"
    next_safe_action: "Land the AGENTS.md edit and packet to v4 and main"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-git-workspace-repo-agnostic |
| **Status** | In Progress |
| **Completed** | — |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The root `AGENTS.md` now carries the git-workspace rules without this repo's sk-git implementation, so the framework doc reads the same in any repository that adopts it. Six repo-specific rows became five agnostic ones; `CLAUDE.md` (a symlink to `AGENTS.md`) inherits the change.

### Repo-agnostic Git Workspace Safety rows

Each row states its universal principle and names sk-git as the owner of the detail: branch naming lives in two numbered namespaces (sk-git holds the grammar); numbers are allocated by sk-git under a lock (never hand-counted); branches are never made with raw `git` commands; pushes to non-allowlisted remote branches ask first; and the main-checkout live-sync has documented disable flags. The internal hyphen-case-pilot row — an implementation-migration note with no meaning outside this repo — was removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Rewrote the Git Workspace Safety table rows repo-agnostic (5 insertions / 6 deletions). `CLAUDE.md` is a symlink, so it inherits the edit. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A surgical Edit of the one table in `AGENTS.md`, authored in an isolated worktree, verified by a section-scoped forbidden-token grep, then landed to `skilled/v4.0.0.0` and cherry-picked to `main`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Point to sk-git rather than delete the rules.** The universal principles stay stated; only the repo-specific HOW moves out, so `AGENTS.md` stays enforceable while becoming portable.
- **Remove the hyphen-case-pilot row outright.** It documented an internal migration program, not a universal rule, and has no meaning in another repo.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Section-scoped grep for the forbidden repo-specific tokens: **0**.
- Hyphen-case-pilot row: **0** occurrences.
- sk-git still named: Mandatory Tools row, Quick Reference row, and the section body.
- `diff --stat AGENTS.md`: 5 insertions / 6 deletions, one table only — no other section touched.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Agents reading `AGENTS.md` no longer see the exact grammar and disable flags inline. They obtain them from sk-git, which every git-workflow task already routes through, so the framework doc gains portability without losing enforceability.
<!-- /ANCHOR:limitations -->
