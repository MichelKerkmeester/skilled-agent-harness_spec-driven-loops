---
title: "Implementation Summary: Devin hook hardening"
description: "Unified workspace-root resolution across 10 Devin adapters, added cwd fallback to completion-evidence-stop, built a discriminating spec-gate test suite, and trimmed stale comment scar tissue."
trigger_phrases:
  - "devin hook hardening summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Hardening pass complete: 10 adapters unified, test suite 10/10 green."
    next_safe_action: "Run strict validation, then move to phase 006 and 003."
    blockers: []
    key_files: ["spec.md", ".opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs", ".opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-hook-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-devin-hook-hardening |
| **Completed** | 2026-07-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 10 Devin hook adapters now resolve `projectDir` uniformly: a whitespace-only `payload.cwd` is treated as absent and falls back to `DEVIN_PROJECT_DIR` then `process.cwd()`. The completion-evidence-stop adapter, which previously hardcoded `process.cwd()`, now uses the same resolution as its 9 siblings. A 10-row process-level test suite exercises the spec-gate classify and enforce adapters across the full matrix (malformed input, missing identity, disabled, child, mutating prompt, non-mutating prompt, enforce deny, enforce advise, satisfied state, terminal-state preservation, whitespace cwd, missing cwd). Stale 8-line historical comment blocks were trimmed to a durable one-liner across all 9 adapters that carried them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec-gate-classify.mjs` | Modified | Trim-and-fallback cwd; session-ID guard; trimmed comment. |
| `spec-gate-enforce.mjs` | Modified | Trim-and-fallback cwd; session-ID guard; trimmed comment. |
| `completion-evidence-stop.cjs` | Modified | Added payload?.cwd fallback; trimmed comment. |
| `post-compaction.cjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `session-start.ts` | Modified | Trimmed comment. |
| `session-stop.ts` | Modified | Trimmed comment. |
| `user-prompt-submit.ts` | Modified | Trimmed comment. |
| `shared.ts` | Modified | Trimmed comment. |
| `task-dispatch-guard.cjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `mcp-route-guard.cjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `post-edit-quality.cjs` | Modified | Trimmed comment (already trim-and-fallback). |
| `code-graph-freshness.cjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `dispatch-preflight-lint.mjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `dispatch-audit-posttooluse.mjs` | Modified | Trim-and-fallback cwd; trimmed comment. |
| `spec-gate-devin.test.mjs` | Created | 10-row discriminating process test suite. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The process suite runs both real spec-gate adapter entrypoints in isolated workspaces with fresh environment maps. The trim-and-fallback change is purely additive — it only changes behavior for whitespace-only `payload.cwd`, which the pre-fix adapters treated as truthy. No shared core was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Apply trim-and-fallback to all 10 adapters | `post-edit-quality.cjs` already used this pattern; applying it uniformly preserves the invariant that every adapter derives the same projectDir for every payload shape. |
| Add session-ID guard to spec-gate adapters | The test suite exposed that the classify adapter wrote state under `<stateDir>/.json` for an empty session ID. The Cursor prebind already had this guard; matching it closes the gap. |
| Trim the 8-line STATUS block to a one-liner | The historical context (registration-schema bug corrected in phase 008) is stale scar tissue. The durable fact (hooks fire under the documented schema) fits in one line. |
| Build a test suite for spec-gate adapters only | The spec-gate adapters are the highest-risk surface (deny-capable). The other 8 adapters delegate to tested shared cores and are lower-risk. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Devin spec-gate process suite | PASS: 10/10 |
| Shared spec-gate core suite | PASS: 67/67 (no regression) |
| OpenCode plugin suite | PASS: 11/11 (no regression) |
| Cursor prebind suite | PASS: 11/11 (no regression) |
| Syntax checks | PASS: all 10 changed JS files pass `node --check` |
| TypeScript | PASS: full project `tsc --noEmit` reports 0 errors |
| Shared core diff | PASS: `git diff --stat` empty on all 6 shared cores |
| Stale comment grep | PASS: no multi-line "STATUS: LIVE" blocks remain |
| `payload?.cwd \|\|` grep | PASS: no raw `||` patterns remain in any Devin adapter |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The process-level test suite covers the spec-gate adapters only. The other 8 adapters (post-compaction, task-dispatch-guard, mcp-route-guard, post-edit-quality, code-graph-freshness, dispatch-preflight-lint, dispatch-audit-posttooluse, completion-evidence-stop) rely on direct invocation and live `devin -p` evidence from phase 008. A broader suite is a separate follow-up if the spec-gate suite surfaces a class of issue that warrants it.
2. The deny branch of `spec-gate-enforce.mjs` has not been observed firing under a live `devin -p` session (phase 008 open question). The test suite confirms the envelope shape and the deny decision, but real-world deny behavior under Devin remains unverified end-to-end. This is tracked as P3-2 in the phase 006 manual-testing playbook expansion.
<!-- /ANCHOR:limitations -->

---
