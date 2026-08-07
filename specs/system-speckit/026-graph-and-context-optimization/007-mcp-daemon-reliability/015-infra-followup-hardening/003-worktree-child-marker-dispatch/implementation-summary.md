---
title: "Implementation Summary: Worktree child-marker dispatch documentation"
description: "cli-codex and cli-opencode now instruct dispatchers to set AI_SESSION_CHILD=1 so orchestrated children share the parent worktree — closing the in-repo doc portion of 035 T006."
trigger_phrases:
  - "worktree child-marker dispatch summary"
  - "AI_SESSION_CHILD cli rule summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch"
    last_updated_at: "2026-05-30T23:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added + verified the dispatch rule in both cli-* skills"
    next_safe_action: "Commit; update 036 parent pointer; report"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003624"
      session_id: "036-003-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator-machine wiring (aliases, SessionStart hook entries) stays out of scope — environment-specific (035 limitation). 003 covers only the in-repo dispatch-doc portion of T006."
---
# Implementation Summary: Worktree child-marker dispatch documentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two primary child-spawning dispatcher skills now tell the calling AI to set `AI_SESSION_CHILD=1` when it dispatches a sub-session, closing the in-repo documentation portion of 035 T006.

### The dispatch-site rule
`worktree-session.sh` (packet 035) isolates each top-level session in its own worktree but exec's in place for orchestrated children, detected by `AI_SESSION_CHILD=1` (or a structural `git --git-common-dir` backstop). `bin/README.md` documented this from the wrapper's side, but the dispatcher recipes never told the caller to set the marker. Now:
- **cli-codex** gains ALWAYS rule 13: `AI_SESSION_CHILD=1 codex exec ... </dev/null`.
- **cli-opencode** gains ALWAYS rule 15: `AI_SESSION_CHILD=1 opencode run ... </dev/null`.

Each rule states the why (a dispatched child is a sub-session, not a new top-level session, so it must share the parent's worktree), notes it is harmless when the wrapper is not in use, and cross-refs `bin/README.md` → "Worktree session isolation" rather than duplicating the mechanism.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-codex/SKILL.md` | Modified | ALWAYS rule 13 (codex exec dispatch) |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | ALWAYS rule 15 (opencode run dispatch) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Confirmed the bin/README contract was already present (035, c657219dd9) and mapped each skill's ALWAYS-rule structure before editing, so each addition slotted in just before the NEVER header as the next numbered rule. Each edit is a single additive hunk (+2/-1). Verified by grep (both present, both cross-ref the README) and a comment-hygiene audit (0 violations).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cover cli-codex + cli-opencode only | They are the primary child-spawning dispatchers for this repo's worktree flow; cli-claude-code/gemini/devin are lower-traffic and the central contract lives in bin/README — deferred + noted, not silently dropped |
| Cross-ref bin/README, don't duplicate | One source of truth for the why/mechanism; the skill rule is the actionable dispatcher half |
| Keep it advisory | The wrapper's structural backstop catches the common case even if a dispatcher omits the var; no enforcement code needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-codex AI_SESSION_CHILD rule | PASS — rule 13 present, `codex exec` pattern, bin/README cross-ref; diff +2/-1 one hunk |
| cli-opencode AI_SESSION_CHILD rule | PASS — rule 15 present, `opencode run` pattern, bin/README cross-ref; diff +2/-1 one hunk |
| Comment-hygiene (both skills) | PASS — 0 ephemeral-pointer violations |
| Packet strict-validate | PASS (to confirm at commit gate) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three cli-* skills not updated.** cli-claude-code, cli-gemini, cli-devin do not yet carry the rule. They are lower-traffic dispatch paths for this repo's worktree flow, and the contract is documented centrally in bin/README; propagate the rule to them if/when they become primary dispatchers.
2. **Doc-only, advisory.** Nothing enforces that a dispatcher actually sets the var; the wrapper's structural `git --git-common-dir` backstop is the safety net. This closes the documentation gap, not an enforcement gap.
3. **Operator-machine wiring still out of scope.** Launch aliases and SessionStart guard-hook entries remain the operator's environment-specific step (035 limitation #1).
<!-- /ANCHOR:limitations -->
