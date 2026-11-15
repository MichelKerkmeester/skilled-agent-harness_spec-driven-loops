---
title: "Implementation Summary"
description: "The repository's guards now run under Mistral Vibe as shell hooks over the shared guard cores: seven strict pre_tool guards, a pre_agent spec-gate classifier, two post_tool annotators and a session lifecycle hook."
trigger_phrases:
  - "vibe repo guards implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards"
    last_updated_at: "2026-11-14T20:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ported ten guard rows plus the spec-gate classify half to .vibe/hooks.toml; live fixtures pass"
    next_safe_action: "Phase 009 adds cli-mistral-vibe as a deep-loop executor kind"
    blockers: []
    key_files:
      - ".vibe/hooks.toml"
      - ".vibe/plugins/repo-guards/lib/hook-io.mjs"
      - ".vibe/plugins/repo-guards/fixtures/run-fixture.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hook wire format, deny visibility and strict placement"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-vibe-repo-guards |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe session in a trusted checkout now meets the same guards an OpenCode session does. A dotenv read, a write before the spec-folder question is answered, a dispatch that breaks a CLI skill's hard rules, a write to an overlay-owned file, a native MCP call Code Mode can route, a commit message that breaks the sk-git templates and a mismatched deep-loop subagent spawn are each refused before the tool runs. Post-edit findings and fetched-text injection advisories are appended to the tool result the model reads, and the startup safety checks reach the model at session start.

### Phase 8: vibe-repo-guards

Each hook is a Node script under `.vibe/plugins/repo-guards/` that imports its runtime-neutral core from `.skilled/`, so a rule still changes in one place. `lib/hook-io.mjs` reads the payload, maps Vibe's qualified tool names onto the generic call shape the cores take, and turns any internal error into an allow.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.vibe/hooks.toml` | Created | 12 `[[hooks]]` entries; the command resolves the checkout with `git rev-parse` so it works from any cwd |
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | Created | Payload, allow, deny, tool-name mapping, fail-open wrapper |
| `.vibe/plugins/repo-guards/*.mjs` | Created | env-secret, spec-gate, spec-gate-classify, dispatch-preflight, overlay, mcp-route, git-message, deep-loop, post-edit-quality, classifier-injection-screen, session-cleanup |
| `.vibe/plugins/repo-guards/fixtures/` | Created | Wire-format fixture, the live runner, and per-guard violating and clean payloads, prompts and `hooks.toml` |
| `.vibe/plugins/repo-guards/tests/spec-gate.test.mjs` | Created | Interactive, inherited-env child and payload-parent child cases for the two spec-gate hooks |
| `.vibe/SYNC.md` | Modified | The guard bundle is hand-authored |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md` | Modified | Wire format, classification, and the spec gate's two-hook shape |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max`, one guard per brief, nine of them run three at a time. Each worker wrote only its own script and fixture folder, and the orchestrator merged the entries into `.vibe/hooks.toml`. After the batch the orchestrator piped every guard's three payloads itself and ran each live fixture as a keyed `vibe -p` turn.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The spec gate is two hooks | A `pre_tool` payload carries no prompt, so a `pre_agent` hook classifies the prompt and the strict `pre_tool` half reads the stored state |
| The Vibe spec gate supplies `SYSTEM_SPEC_GATE_ENFORCE=1` only when unset | A deny is the only channel a `pre_tool` hook has; an explicit operator value still decides |
| A child session is never held to the spec gate | Every dispatch recipe exports `AI_SESSION_CHILD=1`, and a headless `vibe -p` payload carries no parent, so the hooks honour the inherited variable as well as a payload parent; the first port deleted the variable and denied every dispatched write |
| mcp-route refuses instead of logging | A Vibe hook has no log channel the model or operator reads mid-run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Payload pipes, 11 scripts | PASS: violating denies or annotates, clean and malformed print nothing, every exit 0 |
| Live violating / clean | PASS: DENIED / NOT-DENIED for env-secret, spec gate, dispatch preflight, overlay, git-message, deep-loop guard |
| Live annotations | PASS: post-edit findings in the tool result; session-cleanup context reported by the model |
| Strict placement | PASS: 0 strict entries outside `pre_tool`, `post_tool`, `pre_agent` |
| Spec-gate child signal | PASS: `node --test .vibe/plugins/repo-guards/tests/spec-gate.test.mjs` 3/3; with the earlier hooks the inherited-env case fails |
| `.opencode/plugins` unchanged | PASS: empty diff, staged and unstaged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Payload-only guards.** mcp-route-guard and classifier-injection-screen have no live violating run: a throwaway project has no MCP server, and the local fetch went through a proxy error page.
2. **Trust.** Every entry loads only when the checkout root is trusted; an untrusted run is unguarded and no error says so.
3. **Non-portable guards.** Completion evidence, ask-surface, session relaunch and decision capture have no Vibe seam (`guards-and-hooks.md` section 4).
<!-- /ANCHOR:limitations -->
