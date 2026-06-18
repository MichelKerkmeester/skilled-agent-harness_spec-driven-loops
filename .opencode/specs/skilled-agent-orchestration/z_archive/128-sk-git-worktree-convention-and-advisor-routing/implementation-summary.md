---
title: "Implementation Summary: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization"
description: "Pre-implementation scaffold: the sk-git wt/NNNN-name worktree convention and advisor routing optimization are planned but not yet implemented."
trigger_phrases:
  - "sk-git worktree summary"
  - "wt/ convention summary"
  - "advisor routing summary"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-sk-git-worktree-convention-and-advisor-routing"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the impl doc; sk-git work not yet started"
    next_safe_action: "Begin Phase 2 edits, then fill this doc with concrete outcomes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-128-sk-git-worktree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 128-sk-git-worktree-convention-and-advisor-routing |
| **Completed** | Pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is a pre-implementation scaffold. No sk-git changes have shipped yet; this section will carry the delivered narrative once Phase 2 lands.

### Planned: numbered feature-worktree convention

The named-feature-worktree convention moves to branch `wt/{NNNN}-{name}` and directory `<repo>/.worktrees/{NNNN}-{name}`, with `NNNN` allocated as `max(existing NNNN) + 1`. The convention will be documented across `.opencode/skills/sk-git/references/worktree_workflows.md`, `.opencode/skills/sk-git/README.md`, `.opencode/skills/sk-git/SKILL.md`, and `.opencode/skills/sk-git/assets/worktree_checklist.md`.

### Planned: advisor routing optimization

The sk-git trigger phrases in `.opencode/skills/sk-git/SKILL.md` will gain the new worktree-convention vocabulary and reduce overlap with system-spec-kit and sk-code, then the advisor index will be rebuilt so git/worktree intent reliably selects sk-git.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Pending | Adopt `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` |
| `.opencode/skills/sk-git/SKILL.md` | Pending | Branch-naming guidance + new trigger phrases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The plan sequences setup (worktree inventory and baseline routing capture), core edits (four docs plus changelog plus advisor rebuild), then verification (grep assertions, advisor routing checks, and the one-time worktree restructure).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the ephemeral wrapper out of the convention | Keep the shared live `worktree-session.sh` lane stable and auto-reaped |
| Defer the two in-flight worktrees | Avoid racing live implementation dispatches that are writing those worktrees |
| Edit durable SKILL trigger data, then rebuild | A single advisor rebuild applies the routing change even if the MCP is flaky |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` | PASS at scaffold time (Errors: 0) |
| sk-git docs grep for legacy `type/{short-desc}` examples | Pending (run after Phase 2 edits) |
| Advisor routing on representative git/worktree prompts | Pending (run after the index rebuild) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-implementation scaffold.** No sk-git behavior has changed yet; this summary documents intent and will be rewritten with concrete outcomes after the work lands.
2. **Two in-flight worktrees deferred.** Their restructure waits until the live dispatches writing them finish.
<!-- /ANCHOR:limitations -->
