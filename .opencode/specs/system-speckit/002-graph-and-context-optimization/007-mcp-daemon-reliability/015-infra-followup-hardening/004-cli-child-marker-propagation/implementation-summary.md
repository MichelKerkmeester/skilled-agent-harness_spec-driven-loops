---
title: "Implementation Summary: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills"
description: "cli-claude-code, cli-gemini, and cli-devin now instruct dispatchers to set AI_SESSION_CHILD=1 so orchestrated children share the parent worktree — completing the cli-* family propagation begun in 036/003."
trigger_phrases:
  - "cli child marker propagation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation"
    last_updated_at: "2026-05-30T23:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified worker edits; committing"
    next_safe_action: "Commit; report"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003644"
      session_id: "036-004-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mechanical edits delegated to a cli-opencode worker (edits-only, no git); the Opus main loop verified against ground truth and owned the scope-guarded commit because the tree carried ~1758 parallel-session dirty files."
---
# Implementation Summary: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three remaining cli-* dispatcher skills now tell the calling AI to set `AI_SESSION_CHILD=1` when it dispatches a sub-session, completing the propagation begun in 036/003 (cli-codex + cli-opencode).

- **cli-claude-code** gains ALWAYS rule 11: `AI_SESSION_CHILD=1 claude -p ...`.
- **cli-gemini** gains ALWAYS rule 11: `AI_SESSION_CHILD=1 gemini ...`.
- **cli-devin** gains ALWAYS rule 16: `AI_SESSION_CHILD=1 devin ...`.

Each rule states the why (a dispatched child is a sub-session, not a new top-level session, so it must share the parent's worktree), notes it is harmless when the wrapper is not in use, and cross-refs `bin/README.md` → "Worktree session isolation" rather than duplicating the mechanism. The whole cli-* family (five dispatchers) now carries the uniform contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | ALWAYS rule 11 (claude -p dispatch) |
| `.opencode/skills/cli-gemini/SKILL.md` | Modified | ALWAYS rule 11 (gemini dispatch) |
| `.opencode/skills/cli-devin/SKILL.md` | Modified | ALWAYS rule 16 (devin dispatch) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The mechanical edits were delegated to a single `cli-opencode` worker (`opencode-go/deepseek-v4-pro`, edits-only, explicitly forbidden from running any git command) with verbatim insertion text and exact anchors. The Opus main loop then verified the result against git ground truth — not the worker's self-report — confirming each file gained exactly one additive line with the correct rule number, runtime pattern, and bin/README cross-ref, 0 comment-hygiene violations, valid structure, and zero out-of-scope writes. Because the working tree carried ~1758 parallel-session dirty files, the conductor owned the scope-guarded commit (git reset, explicit pathspecs, out-of-scope assertion) rather than letting the worker commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delegate edits to cli-opencode, commit from Opus | The user asked to use cli-opencode; mechanical doc edits are a good fit, but a tree with ~1758 dirty parallel-session files makes worker-side git unsafe — the conductor scope-guards every commit |
| Cross-ref bin/README, don't duplicate | One source of truth for the why/mechanism |
| Per-runtime invocation verb in each rule | Makes each example copy-pasteable for that dispatcher |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-claude-code rule 11 | PASS — `claude -p` pattern, bin/README cross-ref; diff +1/-0 |
| cli-gemini rule 11 | PASS — `gemini` pattern, bin/README cross-ref; diff +1/-0 |
| cli-devin rule 16 | PASS — `devin` pattern, bin/README cross-ref; diff +1/-0 |
| Comment-hygiene (3 skills) | PASS — 0 ephemeral-pointer violations |
| Worker scope | PASS — only the 4 dispatch files dirtied, no out-of-scope writes |
| Packet strict-validate | PASS (confirmed at commit gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisory, not enforced.** Nothing enforces that a dispatcher sets the var; the wrapper's structural `git --git-common-dir` backstop is the safety net. This closes the documentation gap across the whole cli-* family.
2. **Operator-machine launch aliases still out of scope.** Routing a runtime through `worktree-session.sh` by default (alias) remains the operator's environment-specific step (035 limitation #1). The companion SessionStart guard hook is handled by sibling child 006.
<!-- /ANCHOR:limitations -->
