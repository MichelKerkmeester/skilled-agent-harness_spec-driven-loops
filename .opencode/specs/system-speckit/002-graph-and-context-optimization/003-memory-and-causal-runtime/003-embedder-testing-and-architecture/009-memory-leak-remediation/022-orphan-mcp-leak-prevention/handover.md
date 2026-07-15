---
title: "Session Handover: Orphan MCP Leak Prevention"
description: "Continuation handover for the dry-run MCP leak prevention packet after implementation, documentation, commit, and push."
trigger_phrases:
  - "orphan mcp handover"
  - "mcp leak prevention continuation"
  - "orphan sweeper next session"
  - "launcher idle timeout handover"
importance_tier: "critical"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T22:00:00Z"
    last_updated_by: "codex"
    recent_action: "authored system-spec-kit handover after implementation, documentation, commit, and push"
    next_safe_action: "Review sweeper dry-run, then approve or defer LaunchAgent activation"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - ".opencode/scripts/README.md"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
      - ".opencode/scripts/claude-session-cleanup.sh"
      - ".opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist"
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220221"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-handover"
      parent_session_id: "2026-05-24-orphan-mcp-leak-prevention-implemented"
    completion_pct: 100
    open_questions:
      - "LaunchAgent activation remains a separate operator-approved rollout step."
      - "Real Claude Code session-exit cleanup still needs a live exit smoke after operator chooses to test it."
    answered_questions:
      - "Implementation, documentation, commit, and push completed on main."
      - "LaunchAgent was not installed or loaded."
      - "Home-level Claude config was not modified."
---
# Session Handover: Orphan MCP Leak Prevention

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-24 Codex desktop implementation and documentation session
- **To Session:** next AI or operator validation session
- **Phase Completed:** implementation, documentation, dry-run review, commit, and push
- **Handover Time:** 2026-05-24 after commit `e85fb49e27f0e8d186a51ffad71d7eb543bc61c8`
- **Current Branch:** `main`
- **Remote State:** pushed to `origin/main`
- **Spec Packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/`
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Implement Layers 1, 2, and 3 in one Level 3 child packet | The leak needs immediate tactical cleanup plus source-level prevention in MCP servers. | Created the `022-orphan-mcp-leak-prevention` packet under the memory-leak arc. |
| Keep rollout dry-run only | LaunchAgent activation and home-level process cleanup have workstation-wide effects. | No `launchctl load`, no copy into `~/Library/LaunchAgents`, and no home-level Claude config write occurred in this pass. |
| Version the LaunchAgent as a repo template | Operators need reviewable rollout material without enabling automation by default. | Added `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` as a template only. |
| Chain Claude cleanup inside the existing single nested `Stop` hook | Existing tests enforce canonical nested Stop hook shape. | `.claude/settings.local.json` keeps one Stop hook command and appends cleanup after `session-stop.js`. |
| Implement idle self-exit in MCP server processes | Servers can observe primary stdio and secondary IPC activity directly. | Added `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` support across Spec Kit, Skill Advisor, and Code Graph MCP servers. |
| Preserve operator safety rules in the sweeper | The original incident report required multi-session safety and `devin` preservation. | Sweeper preserves `devin --print`, `/tmp/devin-*`, `/tmp/codex-browser-use`, Ollama, non-MCP TCP listeners, live Claude descendants, and freshest young MCP instances. |
| Commit all staged work exactly as requested | User explicitly asked to commit and push all staged files to `main`. | Created and pushed commit `e85fb49e27f0e8d186a51ffad71d7eb543bc61c8`. |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
|---|---|---|
| Initial cached whitespace check failed before commit | Resolved | Stripped trailing whitespace and normalized EOF newlines only in staged paths reported by `git diff --cached --check`, then re-staged those paths explicitly. |
| Commit hook reported doc-model reference drift | Advisory only | Commit was allowed. The hook said to update model-name docs from `registry.ts` or bypass with `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` next time. |
| Commit hook invalidated local code-graph cache files due large commit | Advisory only | Commit was allowed. Next Claude Code session may run an inline full scan on boot. |
| GitHub reported branch-rule bypass notices on push | Accepted by remote | Push succeeded despite notices for PR requirement, code scanning, and unsigned commit policy. |

### 2.3 Files Modified

| File or Area | Change Summary | Status |
|---|---|---|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Added dry-run-capable stale MCP process and `/tmp` artifact sweeper with preserve rules, log rotation, SIGTERM, and SIGKILL fallback. | Complete |
| `.opencode/scripts/claude-session-cleanup.sh` | Added session-scoped Claude cleanup script that terminates only matching descendants of the current Claude session. | Complete |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | Added versioned LaunchAgent template for later operator-approved rollout. | Complete, not installed |
| `.opencode/scripts/README.md` | Added operator runbook for sweeper, cleanup script, LaunchAgent template, dry-run commands, env knobs, and rollout boundaries. | Complete |
| `.claude/settings.local.json` | Chained cleanup command after existing `session-stop.js` in the canonical single nested Stop hook. | Complete, repo-local only |
| `.opencode/skills/system-spec-kit/mcp_server/**` | Added IPC activity callbacks, idle timeout manager, env reference docs, tests, and build/typecheck alignment. | Complete |
| `.opencode/skills/system-skill-advisor/mcp_server/**` | Added shared idle timeout behavior and package-local docs/tests. | Complete |
| `.opencode/skills/system-code-graph/mcp_server/**` | Added shared idle timeout behavior and package-local docs/tests. | Complete |
| Root and runtime docs | Added concise wayfinding from root README, runtime READMEs, feature catalog, and manual playbook. | Complete |
| Spec packet docs | Added Level 3 spec, plan, tasks, checklist, decision record, implementation summary, and this handover. | Complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `implementation-summary.md`
- **Context:** Load the summary first to understand what shipped, what remains dry-run only, and which validations passed.
- **Then Load:** `.opencode/scripts/README.md`, `.opencode/scripts/orphan-mcp-sweeper.sh`, `.opencode/scripts/claude-session-cleanup.sh`, and the three `launcher-idle-timeout.ts` implementations if testing runtime behavior.

### 3.2 Priority Tasks Remaining

1. Run an operator review of `.opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose` on the current live process table before any real sweep.
2. If the operator approves rollout, copy the LaunchAgent template into `~/Library/LaunchAgents` and load it in a separate approved session.
3. Exercise a real Claude Code session exit to confirm the Stop hook removes only that session's launcher descendants.
4. Watch one long-running Codex.app session after LaunchAgent activation to confirm MCP process count stays bounded.
5. Optionally file the Codex.app upstream issue using the report text from the original incident brief.

### 3.3 Critical Context to Load

- [x] Handover: `handover.md`
- [x] Implementation summary: `implementation-summary.md`
- [x] Spec: `spec.md`
- [x] Plan: `plan.md`
- [x] Tasks: `tasks.md`
- [x] Checklist: `checklist.md`
- [x] Decision record: `decision-record.md`
- [x] Operator runbook: `.opencode/scripts/README.md`

### 3.4 Commit and Push State

- Commit: `e85fb49e27f0e8d186a51ffad71d7eb543bc61c8`
- Commit message: `chore: update agent runtime infrastructure`
- Pushed: yes, `origin/main`
- Cached diff check before commit: passed after staged whitespace cleanup
- Index after push: clean
- Working tree after push: still has unstaged local changes outside the committed index. Treat them as user-owned unless a future request scopes them.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before this handover, the following was verified:

- [x] Staged work committed and pushed to `origin/main`
- [x] No LaunchAgent activation performed
- [x] No home-level Claude config write performed
- [x] `git diff --cached --check` passed before commit
- [x] `bash -n .opencode/scripts/orphan-mcp-sweeper.sh` passed during packet verification
- [x] `bash -n .opencode/scripts/claude-session-cleanup.sh` passed during packet verification
- [x] `plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` passed during packet verification
- [x] `python3 -m json.tool .claude/settings.local.json` passed during packet verification
- [x] Sweeper dry-run ran without mutating live processes or `/tmp` files
- [x] Targeted idle-timeout Vitest suites passed
- [x] Targeted typechecks and builds passed for affected MCP packages
- [x] `verify_alignment_drift.py` passed with no errors for changed scopes
- [x] Strict spec validation passed for child `022` and parent `009` before commit
- [x] This handover document has no placeholder text
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The implementation is complete, but rollout is intentionally not active. The LaunchAgent is only a repo template, and the sweeper should remain in dry-run review until the operator explicitly approves real process termination and launchd installation.

The most important runtime safety rule is preservation before killing. Any future edit to the sweeper must keep the preserve order clear: `devin --print`, active non-MCP TCP listeners, Ollama, live Claude session descendants, freshest young MCP instance per class, and explicit `/tmp` exclusions.

The idle timeout is server-owned, not launcher-owned. `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0` disables it, fractional values are allowed for tests, and the default remains 30 minutes. Activity is refreshed from primary stdio plus secondary IPC socket connect, data, and write paths.

The pushed commit was large and included other staged repo work in addition to the orphan MCP packet. That was intentional for the commit action because the operator asked to commit all staged files. Do not infer that every changed file in `e85fb49e27` belongs to this packet.

If the next session tests this work, use dry-run and read-only checks first. Real sweeps, LaunchAgent loading, and home-level config writes need fresh operator approval.
<!-- /ANCHOR:session-notes -->
