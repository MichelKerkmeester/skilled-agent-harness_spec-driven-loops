---
title: "Implementation Summary: Phase 17: sk-git Frontmatter Alignment"
description: "All 10 sk-git reference/asset docs now carry the canonical contract; the first all-net-new authoring phase landed with zero body changes."
trigger_phrases:
  - "sk-git frontmatter summary"
  - "git skill docs authored"
  - "sk-git doc contract evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/017-sk-git"
    last_updated_at: "2026-06-11T09:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Phase complete: 10 docs conform and smoke passed"
    next_safe_action: "Campaign continues in sibling phases"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-009-017-sk-git"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-sk-git |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-git's 10 reference and asset docs now carry exactly the canonical frontmatter contract, so the advisor doc harvest can route git-workflow intent ("rename-heavy merge verification", "scoped staging discipline") straight to the owning skill. Unlike the 008 pilot, nothing here was normalization: every doc started with title+description only, making this the campaign's first all-net-new authoring phase.

### Phrase authoring

Each doc body was read first and its trigger phrases name that doc's own concepts: the worktree docs carry the `wt/{NNNN}-{name}` vocabulary (numbered worktree branches, global worktree counter), the commit doc carries its scoped-staging incident vocabulary (scoped staging discipline, staged deny pattern assertion), and the reorg playbook carries its failure-mode vocabulary (mass git mv renames, leftover ignored cruft cleanup). No generic single-concept git words were used, so the per-doc signal stays distinctive.

### Tier and contextType judgment

`worktree_workflows.md` is the one `important` doc: it owns the formal two-lane worktree naming contract (numbered `wt/{NNNN}-{name}` feature worktrees vs auto-reaped `work/{runtime}/{slug}` session worktrees). The two cross-cutting docs (`quick_reference.md`, `shared_patterns.md`) take `general` since they span all three workflow phases rather than executing one; the remaining workflow references and all three assets take `implementation`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modified | Full contract block; tier `important` (naming contract) |
| `.opencode/skills/sk-git/references/commit_workflows.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/references/finish_workflows.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/references/github_mcp_integration.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/references/large_reorg_playbook.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/references/quick_reference.md` | Modified | Full contract block; `general` (cheat sheet) |
| `.opencode/skills/sk-git/references/shared_patterns.md` | Modified | Full contract block; `general` (cross-workflow) |
| `.opencode/skills/sk-git/assets/commit_message_template.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/assets/pr_template.md` | Modified | Full contract block; `implementation` |
| `.opencode/skills/sk-git/assets/worktree_checklist.md` | Modified | Full contract block; `implementation` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-first authoring (every doc body read before its phrases were written), insertion-only frontmatter patches after each description line, verified by the contract checker in coverage mode and a Python local-mode advisor smoke that needs no live daemon.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tier `important` only for `worktree_workflows.md` | The campaign tier policy reserves `important` for formal contract/invariant docs; this doc owns the two-lane `wt/{NNNN}-{name}` naming contract that other docs and the session launcher depend on. The checklist asset restates the convention but is not its home, so it stays `normal`. |
| `general` for `quick_reference.md` and `shared_patterns.md` | Both span all three workflow phases as lookup surfaces rather than executing any single workflow, so `implementation` would overstate their role. |
| Phrases from incident vocabulary, not command names | Phrases like "scoped staging discipline" and "leftover ignored cruft cleanup" come from the docs' own incident-derived sections; bare git command names would collide with every git-adjacent prompt and dilute routing. |
| Smoke via Python local mode, not the live daemon | The live daemon adopts the doc-trigger flag only after a session cycle (packet 145 T025); the Python path reads the same files under the same flag and proves routing now. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-skill-doc-frontmatter.sh --skill sk-git --coverage` | PASS — docs=10, carrying-detailed-block=10, violations=0 |
| Python local-mode smoke ("rename-heavy merge verification", flag on) | PASS — sk-git first at 0.95 with `!rename-heavy merge verification(signal)`; sk-code second at 0.88 on the generic "verification" token |
| Diff hygiene | PASS — `git diff -U0` shows insertion-only hunks at frontmatter line 4 in all 10 files (86 insertions, 0 deletions) |
| Live daemon `matchedDocs` smoke | DEFERRED — rides packet 145 T025 (session-cycle daemon adoption) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-daemon verification is campaign-level, not per-phase.** The running advisor daemon predates the doc-trigger flag adoption, so `matchedDocs` cannot be observed live until every advisor-attached session ends and a fresh session respawns it (tracked as packet 145 T025).
2. **Smoke prompt overlap with sk-code.** Generic tokens inside authored phrases (e.g. "verification") still co-surface sk-code at lower confidence; sk-git ranks first, so routing is correct, but phrase authors in later phases should keep avoiding generic tail words where possible.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
