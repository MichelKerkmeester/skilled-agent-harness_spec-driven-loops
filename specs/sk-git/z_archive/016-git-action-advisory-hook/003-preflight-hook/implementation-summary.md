---
title: "Implementation Summary: Preflight Hook"
description: "A PreToolUse hook delivering sk-git rules at command time, advisory-only, verified across five payload cases."
trigger_phrases:
  - "git preflight hook"
  - "sk-git advisory hook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/003-preflight-hook"
    last_updated_at: "2026-07-27T23:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Built and registered the preflight advisory hook"
    next_safe_action: "Phase 004 measures the fire rate"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Preflight Hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-preflight-hook |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A PreToolUse hook that reads sk-git's rules and prints the relevant one at the moment a git command is typed. It is the third entry in a Bash hook group that already had two, and it reuses the parser and evaluator both of them use.

The gap it closes is specific. sk-git's rules were written down and still reached nobody, because a skill is surfaced by prompt routing while the damage happens at command time.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-git/scripts/hooks/git-preflight-advisory.mjs` | Created | The hook |
| `.claude/settings.json` | Modified | Registered in the existing Bash group |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ordering is deliberate and is the whole performance story: a regex rejects non-git commands, then suppression is consulted, then rules are read, and only then does a repository context exist. An unrelated Bash command spawns no git process.

Three suppression tiers ship because prior art was consistent that a single global switch is not enough — every comparable system offers per-rule, grouped and global, and those that shipped only the global one taught users to flip it once and forget. Grouping works by id prefix so a family can be silenced without enumerating it.

Verification fed real payloads on stdin against a purpose-built repository rather than asserting on internals.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sibling of the existing lint, not new infrastructure | The mechanism is proven; a second one would be a second thing to keep working |
| Shape test before anything else | The hook runs on every Bash command, most of which are not git |
| Three suppression tiers | Global-only is the documented way this class of tool gets ignored |
| Cap the output | A miscalibrated rule set should cost a line, not a screen |
| Name the invoked subcommand in the line | A correct warning that reads as a non-sequitur is dismissed like a wrong one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fires on the directory-scoped commit failure | PASS — advisory emitted with the rule message |
| Silent on an ordinary commit | PASS — no output |
| Silent on a non-git command | PASS — no output |
| Global kill | PASS — silenced |
| Per-rule opt-out | PASS — silenced |
| Never emits a permission decision | PASS — `additionalContext` only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Registered for the Claude runtime only.** The dispatch preflight has a Codex sibling under `.codex/hooks.json`; this one does not. Under other runtimes the rules stay prose-only, exactly as before.
2. **Verified by hand, not by an automated suite.** The five payload cases were run directly. They are reproducible from the summary but nothing re-runs them.
3. **Latency is not measured.** The design keeps git calls off non-git commands, and state collection is lazy, but no timing was captured for a matching command in a large repository.
4. **The advisory appears as tool context, not in the terminal.** It reaches the operator through the assistant, which is where the reader is, but it is not a shell-level warning for someone typing git directly.
<!-- /ANCHOR:limitations -->
