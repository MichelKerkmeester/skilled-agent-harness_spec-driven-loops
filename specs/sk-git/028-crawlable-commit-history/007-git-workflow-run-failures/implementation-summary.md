---
title: "Implementation Summary"
description: "Fourteen git behaviors that fail an unattended run were reproduced, ten were fixed at their producers in the hooks, sk-git scripts and bin scripts with harness cases, four were named for the runtime, and a fresh lineage settled clean."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/007-git-workflow-run-failures"
    last_updated_at: "2026-09-11T08:06:46Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the run-failure phase with a clean proof lineage"
    next_safe_action: "Run phase 006, then present the rewrite window to the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
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
| **Spec Folder** | 007-git-workflow-run-failures |
| **Completed** | 2026-09-11 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An unattended run in this repository now survives the git behaviors that bit this packet. The advisory judges commands in their own directory, a stranded autostash is anchored, a blocked commit names its bypass, the allocator recovers from a killed mint, the reaper keeps its hands off live sessions, and autosync records what it rewrote.

### Phase 1: git-workflow-run-failures

[What this feature does and why it exists. 1-2 paragraphs. Use direct address.
Explain what the user gains, not what files you touched.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` and `research/lineages/deepseek/` | Created | The analysis and its reproductions |
| `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh`, `post-commit`, `pre-commit`, `commit-msg`, `install-git-hooks.sh` | Modified | Anchor, bypass lines, trailer exemption, status |
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs`, `git-context.mjs`, `commit-id-naming.sh` | Modified | Effective directory, fail-open, lock reclaim |
| `.opencode/bin/worktree-reaper.sh`, `worktree-session.sh`, `git-sync.sh` | Modified | Registry-based candidates, live-process refusal, base persistence, rewrite log |
| Nine harnesses | Modified or created | One case per reproduced failure |
| `research/proof/` | Created | The clean proof lineage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The analysis ran on a frozen tree, as the delegation rule now requires, and left throwaway repositories under its scratch that had to be stripped before the evidence could be committed. The three dispatches ran serially on cli-pi with DeepSeek V4.1 Flash after the operating system had killed three concurrent children earlier in the day. The conductor re-ran every harness and re-reproduced two failures by hand before and after. Commits: `ab8458c250`, `debfaf217d`, `f83952c3a9`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the producer, keep the gate | Every gate keeps its bypass and its interactive behavior; automation gets a path beside it, never silence |
| Runtime seams named, not edited | Shared runtime, own blast radius, own packet |
| Serial dispatch | Three concurrent children died under memory pressure; one at a time did not |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Analysis lineage | succeeded 1, five iterations, maxIterationsReached |
| Hook harnesses | autostash 2, commit-msg 11, pre-commit 25, prepare-commit-msg 43, installer harness rc 0 |
| sk-git suites | rule engine 25 node cases, adapters 7, allocator 39 |
| bin harnesses | reaper 24, session 18, sync log 7, rebase-abort 14 |
| Ownerless lock reclaim | 2 seconds, was a 34-second timeout |
| Proof lineage | succeeded 1, 259 seconds |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisory fix is not live in this session.** The hook that fires it runs from the main clone; the worktree's copy is proven by its suite and goes live at merge.
2. **Four runtime failures remain possible.** Containment can still fail a lineage for another writer's same-packet edit until a system-deep-loop packet lands; the delegation rule now tells the orchestrator to freeze.
3. **The reaper's live-process check needs lsof visibility.** A child owned by another user can be invisible to a non-root lsof, so the check protects same-user sessions.
<!-- /ANCHOR:limitations -->

---


