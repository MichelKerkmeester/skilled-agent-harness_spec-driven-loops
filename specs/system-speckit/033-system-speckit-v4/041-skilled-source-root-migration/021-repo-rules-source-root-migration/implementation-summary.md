---
title: "Implementation Summary: Phase 21: repo-rules-source-root-migration"
description: "The rule corpus moves under .skilled, the root path becomes a tracked per-entry farm, and every live reference plus the corpus checker follows the canonical path."
trigger_phrases:
  - "repo rules source migration summary"
  - "phase 21 status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/021-repo-rules-source-root-migration"
    last_updated_at: "2026-09-20T00:00:00Z"
    last_updated_by: "pi"
    recent_action: "Scaffolded the phase and recorded baselines"
    next_safe_action: "Run the bounded research loop, then move the corpus"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-repo-rules-source-root-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the three sibling repositories be re-pointed at the canonical path?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 21: repo-rules-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 21 of 22 |
| **Status** | In progress |
| **Started** | 2026-09-20 |
| **Branch** | `worktrees/056-repo-rules-source-root-migration` |
| **Base Commit** | `c1817442b2` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rule corpus moves to `.skilled/repo-rules/` and the repository-root `repo-rules/` becomes a
farm of 13 tracked per-entry symlinks, so every existing consumer keeps resolving while the
canonical path is the one the repository points at.

### The Move

A rename-only commit carries the 13 files, and the farm entries are added in the same unit so no
commit leaves the corpus unreachable. `git log --follow` still walks each rule's history.

### The References

`REPO RULES.md` stays at the root and its 26 router rows point at the canonical path, as do
`AGENTS.md`'s five links and the 13 rule-body backlinks, which gain one directory level.

### The Checker

`check-repo-rules.cjs` probes `.skilled/repo-rules` and then `repo-rules`, and identifies router
rows by resolving each link into the chosen directory. It keeps its nine checks and its output
format, so the phase's claim is a verdict delta on an unchanged instrument, and it gains the
farm-integrity check.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ordered as: baselines, a bounded research loop over the consumer census, the move and the farm,
the reference rewrite, the machine and consumer surfaces, then the verification list. Each unit is
its own commit, and the divider fix in `answer-the-actual-request.md` is separable from the move so
the corpus fix can be reverted without reverting the relocation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Root path after the move | Per-entry symlink farm | A whole-directory link collapses in the GitHub web view and degrades in clones without symlink support, and deleting the root path breaks three sibling repositories |
| `REPO RULES.md` | Stays at the repository root | Gate 5, the checker's sentinel probe and the CI trigger filter all key on that path |
| Checker portability | Probe both layouts, canonical preferred | The skill is documented to work in repositories with no `.skilled/` tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corpus checker, worktree | Pending |
| Corpus checker, plain-layout fixture | Pending |
| Farm integrity | Pending |
| Gate inputs, mirror gates, derived artifacts | Pending |
| Frozen set unchanged | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The three sibling repositories keep reading the root farm path and are not written to by this
  phase; re-pointing them at the canonical path needs the operator's explicit go-ahead.
- The `sk-orca` and `.pi/settings.json` changes in the main checkout belong to other work and are
  deliberately absent from every commit here.
<!-- /ANCHOR:limitations -->

---
