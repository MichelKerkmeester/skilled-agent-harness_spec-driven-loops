---
title: "Verification Checklist: Runtime-agnostic session lifecycle scripts [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts/checklist]"
description: "Verification evidence for the runtime-agnostic lifecycle scripts packet."
trigger_phrases:
  - "runtime-agnostic lifecycle checklist"
  - "session-cleanup verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T12:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all phases; checklist marked with evidence"
    next_safe_action: "Optional P2 doc refresh (feature_catalog/playbook)"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Per-script Claude-specificity classified (functional vs cosmetic)
  - **Evidence**: investigation mapped post-commit (cosmetic), sweeper (functional gap), cleanup (functional), pre-commit/install/copy (already neutral)
- [x] CHK-002 [P0] Per-runtime session-end capability mapped
  - **Evidence**: Claude Stop, Gemini SessionEnd, OpenCode dispose event, Codex/Devin none (sweeper fallback)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All changed scripts pass syntax check
  - **Evidence**: `bash -n` clean on orphan-mcp-sweeper.sh, session-cleanup.sh, claude-session-cleanup.sh, post-commit; `node --check` clean on session-cleanup.js
- [x] CHK-011 [P0] No stale Claude-only identifiers in generalized logic
  - **Evidence**: `grep -c claude_tree_pids orphan-mcp-sweeper.sh` = 0; uses session_tree_pids / build_session_trees
- [x] CHK-012 [P1] Comment hygiene clean
  - **Evidence**: check-comment-hygiene.sh rc=0 on all changed scripts

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Operator `opencode run` preserved by the sweeper (REQ-001)
  - **Evidence**: `preserve_reason` unit test → `operator-opencode-preserve` (also codex/gemini/devin)
- [x] CHK-021 [P1] Multi-runtime session-PID fallback resolves correctly
  - **Evidence**: chain CLAUDE/OPENCODE/CODEX/GEMINI → PPID resolved to PPID when all unset
- [x] CHK-022 [P1] Back-compat shim delegates
  - **Evidence**: `claude-session-cleanup.sh` execs `session-cleanup.sh`, skip path rc=0

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] Sweeper hard-rule gap closed (opencode-run no longer swept)
  - **Evidence**: explicit `*"opencode run"*` preserve + multi-runtime live-session tree
- [x] CHK-026 [P1] Cleanup wired into every runtime with a session-end mechanism
  - **Evidence**: Claude Stop + Gemini SessionEnd + OpenCode dispose plugin; Codex/Devin documented as sweeper-covered

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or unsafe shell introduced
  - **Evidence**: scripts use only process/PID enumeration + SIGTERM; no creds, no eval
- [x] CHK-031 [P1] Cleanup remains session-scoped (no cross-session kills)
  - **Evidence**: walks descendants of the ending session PID only; sweeper preserves all live operator trees

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized with the shipped change
  - **Evidence**: all three reflect the 5-phase implementation as shipped
- [x] CHK-041 [P1] README updated to the new script name + per-runtime table
  - **Evidence**: `.opencode/scripts/README.md` cites session-cleanup.sh and wiring per runtime
- [x] CHK-042 [P2] feature_catalog + manual_testing_playbook refreshed
  - **Evidence**: deferred — historical/secondary docs; tracked as P2 follow-on

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git mv` preserved cleanup-script history
  - **Evidence**: commit shows `claude-session-cleanup.sh => session-cleanup.sh` rename
- [x] CHK-051 [P1] No temp/scratch files committed
  - **Evidence**: staged set scoped to scripts + configs + 034 docs; no /tmp artifacts

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 0/1 (deferred: feature_catalog/playbook) |

**Verification Date**: 2026-05-30
**Verified By**: AI Assistant (Claude Opus 4.8)

<!-- /ANCHOR:summary -->
